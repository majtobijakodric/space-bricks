import { gameCanvas } from './canvas.ts';
import { bricks } from './bricks.ts';
import { ball, ballColor, cellColor, pad, padColor } from './gameState.ts';

function renderBricks(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = cellColor;
  bricks.forEach((brick) => {
    ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
  });
}

export function renderScene() {
  if (!gameCanvas) {
    return;
  }

  const ctx = gameCanvas.getContext('2d');
  if (!ctx) {
    return;
  }

  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  renderBricks(ctx);

  ctx.fillStyle = padColor;
  ctx.fillRect(pad.x, pad.y, pad.width, pad.height);

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}
