import { backgroundColor, viewHeight, viewWidth } from './gameState.ts';

export const gameCanvas = document.querySelector<HTMLCanvasElement>('#gameCanvas');
export const aboutButton = document.querySelector<HTMLButtonElement>('#aboutButton');
export const pauseButton = document.querySelector<HTMLButtonElement>('#pauseButton');
export const ballSpeedButton = document.querySelector<HTMLButtonElement>('#ballSpeedButton');
export const padSpeedButton = document.querySelector<HTMLButtonElement>('#padSpeedButton');

export function setupCanvasSize() {
  if (!gameCanvas) {
    return;
  }

  gameCanvas.width = viewWidth;
  gameCanvas.height = viewHeight;
  gameCanvas.style.width = `${viewWidth}px`;
  gameCanvas.style.height = `${viewHeight}px`;
  gameCanvas.style.backgroundColor = backgroundColor;
}
