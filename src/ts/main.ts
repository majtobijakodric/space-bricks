import '../style/style.css';
import { initializeAsteroids, resetRocketLaunchState } from './entities.ts';
import { gameCanvas, setupCanvasSize } from './canvas.ts';
import { resetPadPosition } from './entities.ts';
import { startGameLoop } from './game.ts';
import { renderScene } from './render.ts';
import { initializeUi } from './ui.ts';

initializeUi();

if (gameCanvas) {
  setupCanvasSize();
  resetPadPosition();
  resetRocketLaunchState();
  initializeAsteroids();
  renderScene();
  startGameLoop();
}
