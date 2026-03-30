// Main game settings.
// Keep easy-to-edit values here.

export const canvasConfig = {
  width: 800,
  height: 600,
};

export const colorConfig = {
  ball: 'red',
  pad: 'blue',
  background: 'lightgray',
  brick: 'green',
};

export const brickLayoutConfig = {
  sideMarginRatio: 0,
  topMarginRatio: 0,
  rows: 15,
  columns: 20,
  cell: {
    width: 15,
    height: 22,
    marginLeftRight: 3,
    marginTop: 3,
    padding: 1,
  },
};

export const modeConfig = {
  defaultMode: 'medium',
  values: {
    easy: {
      ballSpeed: 4,
      padSpeed: 3,
      speedMultiplier: 0,
    },
    medium: {
      ballSpeed: 5,
      padSpeed: 4,
      speedMultiplier: 0.02,
    },
    hard: {
      ballSpeed: 7,
      padSpeed: 6,
      speedMultiplier: 0.05,
    },
    experimental: {
      ballSpeed: 5,
      padSpeed: 4,
      speedMultiplier: 0,
    },
  },
} as const;

export const soundConfig = {
  brickHit: 'brick-hit.mp3',
  bonusHit: 'bonus-hit.mp3',
  paddleHit: 'paddle-hit.mp3',
  gameOver: 'game-over.mp3',
  win: 'win.mp3',
  buttonClick: 'button-click.mp3',
};

export const featureConfig = {
  showStars: true,
  useBonusBricks: true,
  enableSound: true,
};
