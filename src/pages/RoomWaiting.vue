<template>
  <main class="page">
    <section class="panel">
      <h1>{{ room?.name || '等待房间' }}</h1>
      <p class="text-gray-500">地图主题：{{ themeName }}</p>
      <div class="grid">
        <PlayerAvatar v-for="p in players" :key="p.id" :player="p" />
      </div>
      <GameButton @click="start">开始游戏</GameButton>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PlayerStatus, PLAYER_COLORS } from '../constants/player';
import { useRoomStore } from '../stores/roomStore';
import { useGameStore } from '../stores/gameStore';
import PlayerAvatar from '../components/common/PlayerAvatar.vue';
import GameButton from '../components/common/GameButton.vue';
import { getMapTheme, DEFAULT_MAP_THEME } from '../constants/mapThemes';

const route = useRoute();
const router = useRouter();
const roomStore = useRoomStore();
const game = useGameStore();
const room = computed(() => roomStore.rooms.find((r) => r.id === route.params.id));
const themeName = computed(() => getMapTheme(room.value?.map_theme || DEFAULT_MAP_THEME).name);
const players = computed(() =>
  room.value?.players.length
    ? room.value.players
    : [
        {
          id: 'p-local',
          nickname: '你',
          color: PLAYER_COLORS[0],
          score: 0,
          status: PlayerStatus.ALIVE,
          position: { x: 5, y: 5 },
          trail: [],
          territory: [],
        },
      ]
);

function start() {
  game.start(String(route.params.id), room.value?.map_theme || DEFAULT_MAP_THEME);
  router.push('/game/' + route.params.id);
}
</script>
