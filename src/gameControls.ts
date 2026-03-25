import { pauseButton } from './canvas.ts';
import { input, setPaused } from './gameState.ts';

export function pauseGame() {
  setPaused(true);
  input.left = false;
  input.right = false;

  if (pauseButton) {
    pauseButton.textContent = 'Resume';
  }
}

export function resumeGame() {
  setPaused(false);

  if (pauseButton) {
    pauseButton.textContent = 'Pause';
  }
}
