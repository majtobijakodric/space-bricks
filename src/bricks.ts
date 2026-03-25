import {
  cell,
  CELL_SIDE_MARGIN_RATIO,
  CELL_TOP_MARGIN_RATIO,
  columns,
  rows,
  viewHeight,
  viewWidth,
} from './gameState.ts';

export type Brick = { x: number; y: number; width: number; height: number };

export let bricks: Brick[] = [];

export function initializeBricks() {
  bricks = [];

  const startX = viewWidth * CELL_SIDE_MARGIN_RATIO;
  const startY = viewHeight * CELL_TOP_MARGIN_RATIO;
  const availableWidth = viewWidth * (1 - CELL_SIDE_MARGIN_RATIO * 2);
  const totalHorizontalSpacing = cell.marginLeftRight * (columns - 1);
  const cellWidth = (availableWidth - totalHorizontalSpacing) / columns;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      bricks.push({
        x: startX + (j * (cellWidth + cell.marginLeftRight)),
        y: startY + (i * (cell.height + cell.marginTop)),
        width: cellWidth,
        height: cell.height,
      });
    }
  }
}
