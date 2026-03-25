import { initializeBallVelocity } from './ball.ts';
import { gameCanvas, setupCanvasSize } from './canvas.ts';
import { initializeBricks } from './bricks.ts';
import { ball, input, pad, setViewportSize, viewHeight, viewWidth } from './gameState.ts';
import { movePad } from './pad.ts';
import { renderScene } from './render.ts';

export function setupEventListeners() {
  addEventListener('keydown', (event) => {
    const step = pad.speed;

    switch (event.key) {
      case 'ArrowLeft': {
        movePad(pad.x - step);
        input.left = true;
        renderScene();
        break;
      }
      case 'ArrowRight': {
        movePad(pad.x + step);
        input.right = true;
        renderScene();
        break;
      }
    }
  });

  addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') input.left = false;
    if (event.key === 'ArrowRight') input.right = false;
  });

  addEventListener('resize', () => {
    setViewportSize(window.innerWidth, window.innerHeight);
    setupCanvasSize();
    initializeBricks();

    ball.x = viewWidth / 2;
    ball.y = viewHeight / 2;
    pad.x = viewWidth / 2 - pad.width / 2;
    pad.y = viewHeight - pad.height - 10;

    initializeBallVelocity();

    if (gameCanvas) {
      renderScene();
    }
  });
}
