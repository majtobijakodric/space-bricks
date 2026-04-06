import { featureConfig, canvasConfig, asteroidLayoutConfig } from './config.ts';
import { gameCanvas } from './canvas.ts';
import { resetAbilitySystem } from './abilities.ts';
import {
  handleAsteroidCollisions,
  handlePadCollision,
  handleWallCollisions,
  initializeAsteroids,
  movePadBy,
  resetPadPosition,
  resetRocketLaunchState,
  resetRocketPosition,
  updateRocketPosition,
} from './entities.ts';
import { renderScene } from './render.ts';
import { resetGameOverModalState, showGameOverModal, updateFuelTankLevel } from './ui.ts';

export let canvasHeight = canvasConfig.height;
export let canvasWidth = canvasConfig.width;

export const rocketColor = 'red';
export const padColor = 'blue';
export const backgroundColor = 'lightgray';
export const asteroidColor = 'green';

export const ASTEROID_AREA_OFFSET_X = asteroidLayoutConfig.offsetX;
export const ASTEROID_AREA_OFFSET_Y = asteroidLayoutConfig.offsetY;

export let isPaused = false;
export let isGameOver = false;
export let isRocketLaunched = false;
export let fuel = featureConfig.maxFuel;
export let hasHandledBottomMiss = false;

export const pad = {
  x: canvasWidth / 2 - 25,
  y: canvasHeight - 50,
  width: 100,
  height: 20,
  speed: 4,
};

export const rocket = {
  x: canvasWidth / 2,
  y: canvasHeight / 2,
  radius: 10,
  speed: 5,
  dx: 0,
  dy: 0,
};

let basePadSpeed = pad.speed;
let baseRocketSpeed = rocket.speed;
let basePadWidth = pad.width;
let fuelPauseActive = false;
let fuelDrainMultiplier = 1;
let padSpeedMultiplier = 1;
let rocketSpeedMultiplier = 1;
let padWidthMultiplier = 1;

let fuelPauseTimeoutId: ReturnType<typeof setTimeout> | null = null;
let fuelDrainTimeoutId: ReturnType<typeof setTimeout> | null = null;
let padSpeedTimeoutId: ReturnType<typeof setTimeout> | null = null;
let rocketSpeedTimeoutId: ReturnType<typeof setTimeout> | null = null;
let padWidthTimeoutId: ReturnType<typeof setTimeout> | null = null;

export const input = {
  left: false,
  right: false,
};

export const cell = {
  width: asteroidLayoutConfig.cell.width,
  height: asteroidLayoutConfig.cell.height,
  marginLeftRight: asteroidLayoutConfig.cell.marginLeftRight,
  marginTop: asteroidLayoutConfig.cell.marginTop,
  padding: asteroidLayoutConfig.cell.padding,
};

export const rows = asteroidLayoutConfig.rows;
export const columns = asteroidLayoutConfig.columns;

export function resetCanvasSize() {
  canvasWidth = canvasConfig.width;
  canvasHeight = canvasConfig.height;
}

export function setPaused(value: boolean) {
  isPaused = value;
}

export function setGameOver(value: boolean) {
  isGameOver = value;
}

export function loseFuel(amount = 1) {
  fuel = Math.max(0, fuel - amount);
}

export function addFuel(amount: number) {
  fuel = Math.max(0, Math.min(featureConfig.maxFuel, fuel + amount));
}

export function resetFuel() {
  fuel = featureConfig.maxFuel;
}

export function resetBottomMissState() {
  hasHandledBottomMiss = false;
}

export function setRocketLaunched(value: boolean) {
  isRocketLaunched = value;
}

export function setBasePadSpeed(speed: number) {
  basePadSpeed = speed;
  syncPadSpeed();
}

export function setBaseRocketSpeed(speed: number) {
  baseRocketSpeed = speed;
  syncRocketSpeed();
}

function clearEffectTimer(timeoutId: ReturnType<typeof setTimeout> | null) {
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
  }
}

function syncRocketVelocityToSpeed() {
  if (!isRocketLaunched) {
    rocket.dx = 0;
    rocket.dy = -rocket.speed;
    return;
  }

  const angle = Math.atan2(rocket.dy, rocket.dx);
  rocket.dx = Math.cos(angle) * rocket.speed;
  rocket.dy = Math.sin(angle) * rocket.speed;
}

function syncPadSpeed() {
  pad.speed = Math.max(1, basePadSpeed * padSpeedMultiplier);
}

function syncPadWidth() {
  pad.width = Math.max(36, basePadWidth * padWidthMultiplier);
  pad.x = Math.max(0, Math.min(canvasWidth - pad.width, pad.x));
}

function syncRocketSpeed() {
  rocket.speed = Math.max(1, baseRocketSpeed * rocketSpeedMultiplier);
  syncRocketVelocityToSpeed();
}

export function applyFuelPause(durationMs: number) {
  fuelPauseActive = true;
  clearEffectTimer(fuelPauseTimeoutId);
  fuelPauseTimeoutId = setTimeout(() => {
    fuelPauseActive = false;
    fuelPauseTimeoutId = null;
  }, durationMs);
}

export function applyFuelDrainMultiplier(multiplier: number, durationMs: number) {
  fuelDrainMultiplier = multiplier;
  clearEffectTimer(fuelDrainTimeoutId);
  fuelDrainTimeoutId = setTimeout(() => {
    fuelDrainMultiplier = 1;
    fuelDrainTimeoutId = null;
  }, durationMs);
}

export function applyPadSpeedMultiplier(multiplier: number, durationMs: number) {
  padSpeedMultiplier = multiplier;
  syncPadSpeed();
  clearEffectTimer(padSpeedTimeoutId);
  padSpeedTimeoutId = setTimeout(() => {
    padSpeedMultiplier = 1;
    syncPadSpeed();
    padSpeedTimeoutId = null;
  }, durationMs);
}

export function applyPadWidthMultiplier(multiplier: number, durationMs: number) {
  padWidthMultiplier = multiplier;
  syncPadWidth();
  clearEffectTimer(padWidthTimeoutId);
  padWidthTimeoutId = setTimeout(() => {
    padWidthMultiplier = 1;
    syncPadWidth();
    padWidthTimeoutId = null;
  }, durationMs);
}

export function applyRocketSpeedMultiplier(multiplier: number, durationMs: number) {
  rocketSpeedMultiplier = multiplier;
  syncRocketSpeed();
  clearEffectTimer(rocketSpeedTimeoutId);
  rocketSpeedTimeoutId = setTimeout(() => {
    rocketSpeedMultiplier = 1;
    syncRocketSpeed();
    rocketSpeedTimeoutId = null;
  }, durationMs);
}

export function clearGameplayEffects() {
  fuelPauseActive = false;
  fuelDrainMultiplier = 1;
  padSpeedMultiplier = 1;
  rocketSpeedMultiplier = 1;
  padWidthMultiplier = 1;

  clearEffectTimer(fuelPauseTimeoutId);
  clearEffectTimer(fuelDrainTimeoutId);
  clearEffectTimer(padSpeedTimeoutId);
  clearEffectTimer(rocketSpeedTimeoutId);
  clearEffectTimer(padWidthTimeoutId);

  fuelPauseTimeoutId = null;
  fuelDrainTimeoutId = null;
  padSpeedTimeoutId = null;
  rocketSpeedTimeoutId = null;
  padWidthTimeoutId = null;

  syncPadSpeed();
  syncPadWidth();
  syncRocketSpeed();
}

export function markBottomMissHandled() {
  hasHandledBottomMiss = true;
}

export function pauseGame() {
  setPaused(true);
  input.left = false;
  input.right = false;
}

export function resumeGame() {
  setPaused(false);
}

export function restartGame() {
  setGameOver(false);
  setPaused(false);
  setRocketLaunched(false);
  input.left = false;
  input.right = false;

  resetAbilitySystem();
  resetFuel();
  resetBottomMissState();
  resetPadPosition();
  initializeAsteroids();
  resetRocketLaunchState();
  resetGameOverModalState();
  updateFuelTankLevel(1);

  renderScene();
  startGameLoop();
}

let lastActiveTimestamp: number | null = null;

function animateFrame(timestamp: number) {
  if (!gameCanvas) {
    return;
  }

  if (isPaused) {
    lastActiveTimestamp = null;
    renderScene();
    requestAnimationFrame(animateFrame);
    return;
  }

  if (isGameOver) {
    lastActiveTimestamp = null;
    renderScene();
    return;
  }

  if (!isRocketLaunched) {
    lastActiveTimestamp = timestamp;

    if (input.left) {
      movePadBy(-pad.speed);
    }

    if (input.right) {
      movePadBy(pad.speed);
    }

    resetRocketPosition();
    updateFuelTankLevel(fuel / featureConfig.maxFuel);
    renderScene();
    requestAnimationFrame(animateFrame);
    return;
  }

  const deltaMs = lastActiveTimestamp === null ? 0 : Math.min(timestamp - lastActiveTimestamp, 100);
  lastActiveTimestamp = timestamp;

  if (deltaMs > 0) {
    if (!fuelPauseActive) {
      loseFuel((deltaMs / 1000) * featureConfig.fuelBurnPerSecond * fuelDrainMultiplier);
    }
  }

  if (input.left) {
    movePadBy(-pad.speed);
  }

  if (input.right) {
    movePadBy(pad.speed);
  }

  updateRocketPosition();
  handleWallCollisions();

  updateFuelTankLevel(fuel / featureConfig.maxFuel);

  if (fuel === 0) {
    setGameOver(true);
    renderScene();
    void showGameOverModal();
    return;
  }

  if (isGameOver) {
    renderScene();
    return;
  }

  handlePadCollision();
  handleAsteroidCollisions();

  renderScene();
  requestAnimationFrame(animateFrame);
}

export function startGameLoop() {
  requestAnimationFrame(animateFrame);
}
