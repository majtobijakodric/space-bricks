import './style.css';
import './buttons.ts';
import { initializeBallVelocity } from './ball.ts';
import { gameCanvas, setupCanvasSize } from './canvas.ts';
import { initializeBricks } from './bricks.ts';
import { setupEventListeners } from './events.ts';
import { startGameLoop } from './gameLoop.ts';
import { renderScene } from './render.ts';
import { updateRefreshRateEstimate } from './refreshRate.ts';

export let refreshRateEstimate = await updateRefreshRateEstimate();

setInterval(() => {
  void updateRefreshRateEstimate().then((refreshRate) => {
    refreshRateEstimate = refreshRate;
  });
}, 1000);

initializeBallVelocity();

if (gameCanvas) {
  setupCanvasSize();
  initializeBricks();
  renderScene();
  startGameLoop();
}

setupEventListeners();
