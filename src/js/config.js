export const canvasConfig = {
  width: 800,
  height: 600,
}

export const asteroidLayoutConfig = {
  offsetX: 18,
  offsetY: 15,
  rows: 4,
  columns: 12,
  cell: {
    width: 15,
    height: 45,
    marginLeftRight: 3,
    marginTop: 3,
    padding: 1,
  },
}

export const modeConfig = {
  defaultMode: 'medium',
  values: {
    easy: {
      rocketSpeed: 4,
      padSpeed: 3,
    },
    medium: {
      rocketSpeed: 5,
      padSpeed: 4,
    },
    hard: {
      rocketSpeed: 7,
      padSpeed: 6,
    },
    experimental: {
      rocketSpeed: 5,
      padSpeed: 4,
    },
  },
}

export const featureConfig = {
  enableDeath: true,
  maxFuel: 5,
  fuelBurnPerSecond: 0.1,
  deathBoundaryOffset: 80,
}

export const rockSpriteConfig = {
  // % of rocks
  weights: {
    normal: 60,
    gray: 18,
    blue: 14,
    red: 8,
  },
}

export const rocketSpriteConfig = {
  sizeMultiplier: 6,
}
