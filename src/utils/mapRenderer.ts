import type { GameState } from '../models/gameState';
import { CellType } from '../constants/cell';
import { MAP_CONFIG } from '../constants/map';
import { logGame } from './gameLogger';
import { getMapTheme } from '../constants/mapThemes';

export function renderMap(canvas: HTMLCanvasElement, state: GameState) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const theme = getMapTheme(state.map_theme);
  canvas.width = MAP_CONFIG.width * MAP_CONFIG.cellSize;
  canvas.height = MAP_CONFIG.height * MAP_CONFIG.cellSize;

  ctx.fillStyle = theme.colors.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const row of state.map) {
    for (const cell of row) {
      ctx.strokeStyle = theme.colors.grid;
      ctx.strokeRect(
        cell.x * MAP_CONFIG.cellSize,
        cell.y * MAP_CONFIG.cellSize,
        MAP_CONFIG.cellSize,
        MAP_CONFIG.cellSize
      );

      if (cell.type === CellType.OBSTACLE) {
        ctx.fillStyle = theme.colors.obstacle;
        ctx.fillRect(
          cell.x * MAP_CONFIG.cellSize + 1,
          cell.y * MAP_CONFIG.cellSize + 1,
          MAP_CONFIG.cellSize - 2,
          MAP_CONFIG.cellSize - 2
        );
      } else if (cell.type !== CellType.EMPTY) {
        ctx.fillStyle = cell.type === CellType.TRAIL ? theme.colors.trail : theme.colors.territory;
        ctx.fillRect(
          cell.x * MAP_CONFIG.cellSize + 2,
          cell.y * MAP_CONFIG.cellSize + 2,
          MAP_CONFIG.cellSize - 4,
          MAP_CONFIG.cellSize - 4
        );
      }
    }
  }

  for (const p of state.players) {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(
      (p.position.x + 0.5) * MAP_CONFIG.cellSize,
      (p.position.y + 0.5) * MAP_CONFIG.cellSize,
      7,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  logGame('MAP_RENDER', { tick: state.tick, theme: state.map_theme });
}
