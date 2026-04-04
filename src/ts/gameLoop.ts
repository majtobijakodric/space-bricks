import { gameCanvas } from './canvas.ts';
import { handleBrickCollisions, handlePadCollision, handleWallCollisions, updateBallPosition } from './ball.ts';
import { addBarElapsedTime, barDurationMs, barElapsedMs, input, isGameOver, isPaused, pad } from './gameState.ts';
import { movePadBy } from './pad.ts';
import { renderScene } from './render.ts';
import { updateFuelTankLevel } from './ui.ts';

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

  if (lastActiveTimestamp === null) {
    lastActiveTimestamp = timestamp;
  } else {
    addBarElapsedTime(timestamp - lastActiveTimestamp);
    lastActiveTimestamp = timestamp;
  }

  updateFuelTankLevel(1 - barElapsedMs / barDurationMs);

  if (input.left) {
    movePadBy(-pad.speed);
  }

  if (input.right) {
    movePadBy(pad.speed);
  }

  updateBallPosition();
  handleWallCollisions();

  if (isGameOver) {
    renderScene();
    return;
  }

  handlePadCollision();
  handleBrickCollisions();

  renderScene();
  requestAnimationFrame(animateFrame);
}

export function startGameLoop() {
  requestAnimationFrame(animateFrame);
}
