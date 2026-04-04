import { initializeBallVelocity } from './ball.ts';
import { initializeBricks } from './bricks.ts';
import { startGameLoop } from './gameLoop.ts';
import { featureConfig } from './config.ts';
import { renderScene } from './render.ts';
import {
  input,
  resetBallPosition,
  resetBottomMissState,
  resetBarTimer,
  resetLives,
  resetPadPosition,
  setGameOver,
  setPaused,
} from './gameState.ts';
import { resetGameOverModalState, updateLivesText } from './ui.ts';

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
  input.left = false;
  input.right = false;

  resetLives();
  resetBottomMissState();
  resetBarTimer();
  resetPadPosition();
  resetBallPosition();
  initializeBricks();
  initializeBallVelocity();
  resetGameOverModalState();
  updateLivesText(featureConfig.maxLives);

  renderScene();
  startGameLoop();
}
