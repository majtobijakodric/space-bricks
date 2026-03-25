import { pad, viewWidth } from './gameState.ts';

function clampPadX(x: number) {
  return Math.max(0, Math.min(viewWidth - pad.width, x));
}

export function movePad(x: number) {
  pad.x = clampPadX(x);
}

export function movePadBy(delta: number) {
  movePad(pad.x + delta);
}

export function setPadSpeed(speed: number) {
  pad.speed = speed;
}
