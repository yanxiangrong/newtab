<script setup lang="ts">

import {useDateFormat, useNow} from "@vueuse/core";

const now = useNow() // 响应式 Date
// const formatted = useDateFormat(now, 'HH:mm:ss')
const formatted = useDateFormat(now, 'HH:mm')
const dateFormated = useDateFormat(now, 'M月d日 dddd', {locales: 'zh-CN'})
</script>

<template>
  <div class="time-warp">
    <time id="current-time">{{ formatted }}</time>
    <span class="date">{{ dateFormated }}</span>
  </div>
</template>

<style scoped>
.time-warp {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--el-text-color-primary);
}

#current-time {
  font-size: clamp(2rem, 10vh, 8rem);
  color: var(--el-text-color-primary);
  font-weight: 300;
  font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.15);;
}

.date {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3);
}
</style>
