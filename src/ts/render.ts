import { drawAsteroidTexture } from './asteroidTextures.ts';
import { gameCanvas } from './canvas.ts';
import { bricks } from './bricks.ts';
import rocketSrc from '../assets/rocket6.png';
import { ball, pad, padColor } from './gameState.ts';

const rocketImage = new Image();
rocketImage.src = rocketSrc;

// The sprite points upward by default, then gets flipped 180 degrees.
const rocketRotationOffset = Math.PI / 2;

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

  // Pad
  ctx.fillStyle = padColor;
  ctx.fillRect(pad.x, pad.y, pad.width, pad.height);

  // Ball
  const size = ball.radius * 3;
  const angle = Math.atan2(ball.dy, ball.dx) + rocketRotationOffset;

  ctx.save();
  ctx.translate(ball.x, ball.y);
  ctx.rotate(angle);

  if (rocketImage.complete && rocketImage.naturalWidth > 0) {
    const fitScale = size / Math.max(rocketImage.naturalWidth, rocketImage.naturalHeight);
    const drawWidth = rocketImage.naturalWidth * fitScale;
    const drawHeight = rocketImage.naturalHeight * fitScale;

    ctx.drawImage(rocketImage, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  }

  ctx.restore();
}

function renderBricks(ctx: CanvasRenderingContext2D) {
  bricks.forEach((brick) => {
    drawAsteroidTexture(
      ctx,
      brick.shapeIndex,
      brick.material,
      brick.textureVariant,
      brick.x,
      brick.y,
      brick.width,
      brick.height,
    );
  });
}
