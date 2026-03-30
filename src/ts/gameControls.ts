import { input, setPaused } from './gameState.ts';
import { updatePauseButtonText } from './ui.ts';

export function pauseGame() {
  setPaused(true);
  input.left = false;
  input.right = false;
  updatePauseButtonText(true);
}

export function resumeGame() {
  setPaused(false);
  updatePauseButtonText(false);
}
