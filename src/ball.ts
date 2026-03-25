import { ball, pad, viewHeight, viewWidth } from './gameState.ts';

export function initializeBallVelocity() {
  const launchAngle = (Math.random() * Math.PI) / 2 + Math.PI / 4;
  const horizontalDirection = Math.random() < 0.5 ? -1 : 1;

  ball.dx = Math.cos(launchAngle) * ball.speed * horizontalDirection;
  ball.dy = -Math.sin(launchAngle) * ball.speed;
}

export function setBallSpeed(speed: number) {
  ball.speed = speed;
  const angle = Math.atan2(ball.dy, ball.dx);
  ball.dx = Math.cos(angle) * ball.speed;
  ball.dy = Math.sin(angle) * ball.speed;
}

export function updateBallPosition() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

export function handleWallCollisions() {
  if (ball.x + ball.radius >= viewWidth || ball.x - ball.radius <= 0) {
    ball.dx *= -1;
    ball.x = Math.max(ball.radius, Math.min(viewWidth - ball.radius, ball.x));
  }

  if (ball.y - ball.radius <= 0) {
    ball.dy *= -1;
    ball.y = ball.radius;
  }

  if (ball.y + ball.radius >= viewHeight) {
    ball.dy *= -1;
    ball.y = viewHeight - ball.radius;
  }
}

export function handlePadCollision() {
  const hitsPadHorizontally = ball.x + ball.radius >= pad.x && ball.x - ball.radius <= pad.width + pad.x;
  const hitsPadVertically = ball.y + ball.radius >= pad.y && ball.y - ball.radius <= pad.y + pad.height;

  if (ball.dy > 0 && hitsPadHorizontally && hitsPadVertically) {
    ball.dy *= -1;
    ball.y = pad.y - ball.radius;
  }
}
