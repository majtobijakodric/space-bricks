import { CircleHelp, createElement, Info, Pause, Play } from 'lucide'
import { activateAbility, getAbilityIconSource, getAbilityState, subscribeToAbilityState } from './abilities.js'
import { abilityMessage, aboutButton, blueAbilityButton, blueAbilityCount, blueAbilityIcon, currentScoreButton, howToPlayButton, modeButton, padSpeedButton, pauseButton, redAbilityButton, redAbilityCount, redAbilityIcon, rocketSpeedButton } from './canvas.js'
import { featureConfig, modeConfig } from './config.js'
import { launchRocketFromPad, movePadBy, setPadSpeed, setRocketSpeed } from './entities.js'
import { currentScore, fuel, input, isGameOver, isPaused, isRocketLaunched, pad, pauseGame, restartGame, resumeGame, rocket } from './game.js'
import { showAboutSweet, showGameOverSweet, showHowToPlaySweet, showModeSweet, showPadSpeedSweet, showRocketSpeedSweet, showScoreSweet, showWinSweet } from './sweet.js'
import { renderScene } from './render.js'

const fuelTankFill = document.querySelector('#fuelTankFill')
const scoreHistoryStorageKey = 'the-bricks-score-history'

let endSweetShown = false
let listenersBound = false
let currentMode = modeConfig.defaultMode

function getStoredScores() {
  const rawScores = localStorage.getItem(scoreHistoryStorageKey)

  if (!rawScores) {
    return []
  }

  try {
    const parsedScores = JSON.parse(rawScores)

    if (!Array.isArray(parsedScores)) {
      return []
    }

    return parsedScores.flatMap((entry) => {
      if (Number.isFinite(entry)) {
        return [{ score: Number(entry), timestamp: null, didFinish: false, mode: null }]
      }

      if (!entry || typeof entry !== 'object' || !Number.isFinite(entry.score)) {
        return []
      }

      return [{
        score: Number(entry.score),
        timestamp: Number.isFinite(entry.timestamp) ? Number(entry.timestamp) : null,
        didFinish: entry.didFinish === true,
        mode: typeof entry.mode === 'string' ? entry.mode : null,
      }]
    })
  } catch {
    return []
  }
}

function saveScore(score, didFinish = false) {
  const scores = getStoredScores()
  scores.unshift({ score, timestamp: Date.now(), didFinish, mode: currentMode })
  localStorage.setItem(scoreHistoryStorageKey, JSON.stringify(scores))
}

function formatModeLabel(mode) {
  if (!mode) {
    return 'Unknown'
  }

  return mode.charAt(0).toUpperCase() + mode.slice(1)
}

function formatRunTimestamp(timestamp) {
  if (!timestamp) {
    return 'Unknown date'
  }

  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date'
  }

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes} ${day}.${month}.${year}`
}

function renderScoreHistoryMarkup() {
  const previousScores = getStoredScores()

  if (previousScores.length === 0) {
    return `
      <div class="score-history-panel text-left text-sm leading-6">
        <p class="mb-3">Current score: <strong>${currentScore}</strong></p>
        <p>You haven't played this game yet.</p>
      </div>
    `
  }

  const scoreItems = previousScores
    .map((run, index) => `
      <li class="score-history-item">
        <div class="score-history-copy">
          <span>Run ${index + 1}</span>
          <div class="score-history-meta">
            <span class="score-history-date">${formatRunTimestamp(run.timestamp)}</span>
            <span class="score-history-status${run.didFinish ? ' is-finished' : ''}">${run.didFinish ? 'Finished' : 'Did not finish'}</span>
            <span class="score-history-mode">${formatModeLabel(run.mode)}</span>
          </div>
        </div>
        <strong>${run.score}</strong>
      </li>
    `)
    .join('')

  return `
    <div class="score-history-panel text-left text-sm leading-6">
      <p class="mb-3">Current score: <strong>${currentScore}</strong></p>
      <div class="score-history-list" role="region" aria-label="Previous scores">
        <ol>${scoreItems}</ol>
      </div>
    </div>
  `
}

async function runPausedSweet(openSweet) {
  const wasPaused = isPaused
  pauseGame()
  syncPauseButtonUi(true)

  const result = await openSweet()

  if (!wasPaused) {
    resumeGame()
    syncPauseButtonUi(false)
  }

  return result
}

async function openScoreMenu() {
  await runPausedSweet(() => showScoreSweet(renderScoreHistoryMarkup()))
}

function updateExperimentalControls() {
  const isExperimental = currentMode === 'experimental'

  if (rocketSpeedButton) {
    rocketSpeedButton.hidden = !isExperimental
  }

  if (padSpeedButton) {
    padSpeedButton.hidden = !isExperimental
  }
}

function updateAbilityUi() {
  const state = getAbilityState()

  if (abilityMessage) {
    abilityMessage.textContent = state.message
    abilityMessage.classList.toggle('is-visible', state.message.length > 0)
  }

  const slots = [
    { button: redAbilityButton, count: redAbilityCount, icon: redAbilityIcon, color: 'red' },
    { button: blueAbilityButton, count: blueAbilityCount, icon: blueAbilityIcon, color: 'blue' },
  ]

  slots.forEach(({ button, count, icon, color }) => {
    const slot = state.slots[color]
    const hasCharges = slot.charges > 0

    if (icon) {
      icon.src = getAbilityIconSource(color)
    }

    if (count) {
      count.textContent = String(slot.charges)
      count.classList.toggle('is-visible', hasCharges)
    }

    if (!button) {
      return
    }

    button.disabled = !hasCharges
    button.classList.toggle('is-charged', hasCharges)
    button.classList.toggle('is-clickable', hasCharges)
    button.classList.toggle('is-pulsing', slot.pulsing)
  })
}

function handleAbilityActivation(color) {
  if (isPaused || isGameOver) {
    return
  }

  if (!activateAbility(color)) {
    return
  }

  updateFuelTankLevel(fuel / featureConfig.maxFuel)
  renderScene()
}

function renderAboutButtonIcon(button) {
  button.replaceChildren(createElement(Info, { width: 18, height: 18 }))
  button.title = 'About'
  button.setAttribute('aria-label', 'About')
}

function renderHowToPlayButtonIcon(button) {
  button.replaceChildren(createElement(CircleHelp, { width: 18, height: 18 }))
  button.title = 'How to play'
  button.setAttribute('aria-label', 'How to play')
}

function renderPauseButtonIcon(button, paused) {
  button.replaceChildren(createElement(paused ? Play : Pause, { width: 18, height: 18 }))
  button.title = paused ? 'Resume' : 'Pause'
  button.setAttribute('aria-label', button.title)
}

function bindAbilityButton(button, icon, color) {
  if (!button || !icon) {
    return
  }

  icon.src = getAbilityIconSource(color)
  button.addEventListener('click', () => {
    handleAbilityActivation(color)
  })
}

export function syncCurrentScoreButton() {
  if (!currentScoreButton) {
    return
  }

  currentScoreButton.textContent = `Score: ${currentScore}`
  currentScoreButton.setAttribute('aria-label', `Current score ${currentScore}`)
}

export function syncPauseButtonUi(paused = isPaused) {
  if (!pauseButton) {
    return
  }

  renderPauseButtonIcon(pauseButton, paused)
}

function applyMode(mode) {
  const settings = modeConfig.values[mode]
  currentMode = mode
  setPadSpeed(settings.padSpeed)
  setRocketSpeed(settings.rocketSpeed)
  updateExperimentalControls()
}

async function openModeMenu() {
  const selectedMode = await showModeSweet(currentMode)

  if (!selectedMode) {
    return
  }

  applyMode(selectedMode)
  restartGame()
}

export function updateFuelTankLevel(remainingRatio) {
  if (!fuelTankFill) {
    return
  }

  const clampedRatio = Math.max(0, Math.min(1, remainingRatio))
  fuelTankFill.style.transform = `scaleY(${clampedRatio})`
}

function bindKeyboardListeners() {
  addEventListener('keydown', (event) => {
    if (isGameOver) {
      return
    }

    if (isPaused) {
      return
    }

    const step = pad.speed

    if (event.code === 'Space') {
      event.preventDefault()

      if (!isRocketLaunched) {
        launchRocketFromPad()
        renderScene()
      }

      return
    }

    switch (event.key) {
      case 'ArrowLeft': {
        movePadBy(-step)
        input.left = true
        renderScene()
        break
      }
      case 'ArrowRight': {
        movePadBy(step)
        input.right = true
        renderScene()
        break
      }
    }
  })

  addEventListener('keyup', (event) => {
    if (isGameOver) {
      return
    }

    if (event.key === 'ArrowLeft') input.left = false
    if (event.key === 'ArrowRight') input.right = false
  })
}

export function initializeUi() {
  applyMode(modeConfig.defaultMode)
  syncCurrentScoreButton()
  syncPauseButtonUi(false)
  updateFuelTankLevel(1)
  updateAbilityUi()

  if (modeButton) {
    modeButton.addEventListener('click', () => {
      void openModeMenu()
    })
  }

  bindAbilityButton(redAbilityButton, redAbilityIcon, 'red')
  bindAbilityButton(blueAbilityButton, blueAbilityIcon, 'blue')

  subscribeToAbilityState(updateAbilityUi)

  if (aboutButton) {
    renderAboutButtonIcon(aboutButton)

    aboutButton.addEventListener('click', async () => {
      await runPausedSweet(showAboutSweet)
    })
  }

  if (howToPlayButton) {
    renderHowToPlayButtonIcon(howToPlayButton)

    howToPlayButton.addEventListener('click', async () => {
      await runPausedSweet(showHowToPlaySweet)
    })
  }

  if (currentScoreButton) {
    currentScoreButton.addEventListener('click', () => {
      void openScoreMenu()
    })
  }

  if (pauseButton) {
    const button = pauseButton

    renderPauseButtonIcon(button, isPaused)

    button.addEventListener('click', () => {
      if (isPaused) {
        resumeGame()
        syncPauseButtonUi(false)
      } else {
        pauseGame()
        syncPauseButtonUi(true)
      }
    })
  }

  if (rocketSpeedButton) {
    rocketSpeedButton.addEventListener('click', () => {
      showRocketSpeedSweet(rocket.speed).then((result) => {
        if (result.isConfirmed) {
          const value = Number(result.value)
          setRocketSpeed(value)
        }
      })
    })
  }

  if (padSpeedButton) {
    padSpeedButton.addEventListener('click', () => {
      showPadSpeedSweet(pad.speed).then((result) => {
        if (result.isConfirmed) {
          const value = Number(result.value)
          setPadSpeed(value)
        }
      })
    })
  }

  if (!listenersBound) {
    bindKeyboardListeners()
    listenersBound = true
  }
}

export async function openGameOverSweet() {
  if (endSweetShown) {
    return
  }

  endSweetShown = true
  saveScore(currentScore, false)

  await showGameOverSweet()

  restartGame()
}

export async function openWinSweet() {
  if (endSweetShown) {
    return
  } 

  endSweetShown = true
  saveScore(currentScore, true)

  await showWinSweet()

  restartGame()
}

export function resetEndSweetState() {
  endSweetShown = false
}
