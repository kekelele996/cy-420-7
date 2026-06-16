<template>
  <main class="page grid">
    <section class="panel">
      <h1>TerritoryRush</h1>
      <p>{{ messages.nickname }}</p>
      <van-field v-model="auth.nickname" label="昵称" />
      <p class="mt-3">地图主题</p>
      <div class="flex gap-2 flex-wrap mt-2">
        <button
          v-for="theme in themeList"
          :key="theme.id"
          class="theme-btn"
          :class="{ active: selectedTheme === theme.id }"
          @click="selectedTheme = theme.id"
        >
          <span class="theme-dot" :style="{ background: theme.colors.territory }"></span>
          {{ theme.name }}
        </button>
      </div>
      <div class="flex gap-2 mt-3">
        <GameButton @click="quick">快速加入</GameButton>
        <GameButton @click="create">创建房间</GameButton>
      </div>
      <p>{{ messages.rules }}</p>
    </section>
    <RoomCard v-for="room in roomStore.rooms.slice(0, 2)" :key="room.id" :room="room" @join="join" />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useRoomStore } from '../stores/roomStore';
import GameButton from '../components/common/GameButton.vue';
import RoomCard from '../components/common/RoomCard.vue';
import { messages } from '../constants/messages';
import { MAP_THEMES, DEFAULT_MAP_THEME, type MapThemeId } from '../constants/mapThemes';

const router = useRouter();
const auth = useAuthStore();
const roomStore = useRoomStore();
const selectedTheme = ref<MapThemeId>(DEFAULT_MAP_THEME);
const themeList = Object.values(MAP_THEMES);

function join(id: string) {
  roomStore.join(id);
  router.push('/room/' + id);
}

function quick() {
  const id = roomStore.rooms[0]?.id || roomStore.create();
  join(id);
}

function create() {
  router.push('/room/' + roomStore.create('我的房间', selectedTheme.value));
}
</script>

<style scoped>
.theme-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.15s;
}
.theme-btn:hover {
  border-color: #2f80ed;
  color: #2f80ed;
}
.theme-btn.active {
  border-color: #2f80ed;
  background: #e6f4ff;
  color: #2f80ed;
}
.theme-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}
</style>
