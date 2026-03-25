import { gameCanvas } from './canvas.ts';
import { handlePadCollision, handleWallCollisions, updateBallPosition } from './ball.ts';
import { input, isPaused, pad } from './gameState.ts';
import { movePadBy } from './pad.ts';
import { renderScene } from './render.ts';

function animateFrame() {
  if (!gameCanvas) {
    return;
  }

  if (isPaused) {
    renderScene();
    requestAnimationFrame(animateFrame);
    return;
  }

  if (input.left) {
    movePadBy(-pad.speed);
  }

  if (input.right) {
    movePadBy(pad.speed);
  }

  updateBallPosition();
  handleWallCollisions();
  handlePadCollision();

  renderScene();
  requestAnimationFrame(animateFrame);
}

export function startGameLoop() {
  animateFrame();
}
