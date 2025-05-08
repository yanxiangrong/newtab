<script lang="ts" setup>
import {computed} from 'vue'
import {getWeatherIcon} from '@/icons/weatherIconsMap.ts' // 路径根据实际调整


const props = defineProps<{ code: number, alt?: string }>()
const iconSrc = computed(() => `/icons/weather-icons/${getWeatherIcon(props.code)}.svg`)
</script>

<template>
  <img
      :alt="alt || 'weather-icon'"
      :src="iconSrc"
      draggable="false"
      loading="lazy"
  />
</template>

<style scoped>
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
