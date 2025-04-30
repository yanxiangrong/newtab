<script setup lang="ts">

import {useNow, useDateFormat } from "@vueuse/core";

const now = useNow() // 响应式 Date
// const formatted = useDateFormat(now, 'HH:mm:ss')
const formatted = useDateFormat(now, 'HH:mm')
</script>

<template>
  <div id="current-time">{{ formatted }}</div>
</template>

<style scoped>
#current-time {
  font-size: clamp(2rem, 10vh, 8rem);
  color: var(--el-text-color-primary);
  font-weight: 300;
  font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif;
  text-shadow: 0 4px 16px rgba(0,0,0,0.16);;
}
</style>
