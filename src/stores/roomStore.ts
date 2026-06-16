import { defineStore } from 'pinia';
import type { Room } from '../models/room';
import { websocketService } from '../services/websocketService';
import { WsMessageType } from '../constants/websocket';
import { logGame } from '../utils/gameLogger';
import { MapThemeId, DEFAULT_MAP_THEME } from '../constants/mapThemes';

export const useRoomStore = defineStore('room', {
  state: () => ({
    rooms: websocketService.rooms as Room[],
    currentRoom: undefined as Room | undefined,
  }),
  actions: {
    refresh() {
      logGame('ROOM_LIST');
      websocketService.send(WsMessageType.ROOM_LIST, {});
      this.rooms = websocketService.rooms;
    },
    create(name: string = '我的房间', mapTheme: MapThemeId = DEFAULT_MAP_THEME) {
      this.currentRoom = websocketService.createRoom(name, mapTheme);
      this.rooms = websocketService.rooms;
      return this.currentRoom.id;
    },
    join(id: string) {
      this.currentRoom = this.rooms.find((r) => r.id === id);
      logGame('ROOM_JOIN', { id });
    },
  },
});
