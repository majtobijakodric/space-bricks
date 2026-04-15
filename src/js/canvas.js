import { canvasConfig } from './config.js'

export const gameCanvas = document.querySelector('#gameCanvas')
export const aboutButton = document.querySelector('#aboutButton')
export const abilityMessage = document.querySelector('#abilityMessage')
export const redAbilityButton = document.querySelector('#redAbilityButton')
export const redAbilityIcon = document.querySelector('#redAbilityIcon')
export const redAbilityCount = document.querySelector('#redAbilityCount')
export const blueAbilityButton = document.querySelector('#blueAbilityButton')
export const blueAbilityIcon = document.querySelector('#blueAbilityIcon')
export const blueAbilityCount = document.querySelector('#blueAbilityCount')
export const pauseButton = document.querySelector('#pauseButton')
export const howToPlayButton = document.querySelector('#howToPlayButton')
export const modeButton = document.querySelector('#modeButton')
export const currentScoreButton = document.querySelector('#currentScoreButton')
export const rocketSpeedButton = document.querySelector('#rocketSpeedButton')
export const padSpeedButton = document.querySelector('#padSpeedButton')

export function setupCanvasSize() {
  if (!gameCanvas) return

  gameCanvas.width = canvasConfig.width
  gameCanvas.height = canvasConfig.height
  gameCanvas.style.width = `${canvasConfig.width}px`
  gameCanvas.style.height = `${canvasConfig.height}px`
  gameCanvas.style.backgroundColor = 'transparent'
}
