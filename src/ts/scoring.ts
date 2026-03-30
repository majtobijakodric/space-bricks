import { updateScoreText } from './ui.ts';

export let score = 0;

export function updateScore(points: number) {
  score += points;
  updateScoreText(score);
}
