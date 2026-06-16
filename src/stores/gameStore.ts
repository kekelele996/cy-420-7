import { defineStore } from 'pinia';
import type { GameState } from '../models/gameState';
import { websocketService } from '../services/websocketService';
import { fillTerritory } from '../utils/floodFill';
import { logGame } from '../utils/gameLogger';
import { CellType } from '../constants/cell';
import { MAP_CONFIG } from '../constants/map';
import type { MapThemeId } from '../constants/mapThemes';
import { DEFAULT_MAP_THEME } from '../constants/mapThemes';

export const useGameStore = defineStore('game', {
  state: () => ({
    state: undefined as GameState | undefined,
    observer: false,
  }),
  actions: {
    start(roomId: string, mapTheme: MapThemeId = DEFAULT_MAP_THEME) {
      this.state = websocketService.makeState(roomId, mapTheme);
      logGame('GAME_START', { id: roomId, theme: mapTheme });
    },
    move(dx: number, dy: number) {
      if (!this.state) return;
      const p = this.state.players[0];
      const newX = Math.max(0, Math.min(MAP_CONFIG.width - 1, p.position.x + dx));
      const newY = Math.max(0, Math.min(MAP_CONFIG.height - 1, p.position.y + dy));

      const targetCell = this.state.map[newY]?.[newX];
      if (!targetCell || targetCell.type === CellType.OBSTACLE) {
        logGame('MOVE_BLOCKED', { x: newX, y: newY });
        return;
      }

      p.position.x = newX;
      p.position.y = newY;
      p.trail.push({ x: p.position.x, y: p.position.y, type: 'trail' as any, owner_id: p.id });
      this.state.tick++;
      logGame('PLAYER_MOVE', { id: p.id, x: p.position.x, y: p.position.y });

      if (p.trail.length > 4) {
        const cells = fillTerritory(this.state.map, p.id);
        p.score += cells.length;
        logGame('TERRITORY_CAPTURE', { id: p.id, count: cells.length });
      }
    },
    toggleObserver() {
      this.observer = !this.observer;
      logGame('OBSERVER_SWITCH');
    },
  },
});
