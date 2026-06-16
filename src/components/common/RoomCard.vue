<template>
  <article class="panel">
    <h3>{{ room.name }}</h3>
    <p>{{ roomStatusText[room.status] }} · {{ room.players.length }}/{{ room.max_players }}</p>
    <p class="text-sm text-gray-500">主题：{{ themeName }}</p>
    <GameButton @click="$emit('join', room.id)">加入房间</GameButton>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Room } from '../../models/room';
import { roomStatusText } from '../../utils/formatters';
import GameButton from './GameButton.vue';
import { getMapTheme } from '../../constants/mapThemes';

const props = defineProps<{ room: Room }>();
defineEmits<{ join: [id: string] }>();

const themeName = computed(() => getMapTheme(props.room.map_theme).name);
</script>
