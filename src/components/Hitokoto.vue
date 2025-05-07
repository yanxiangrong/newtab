<script setup lang="ts">
import {getHitokoto} from "@/api/hitokoto.ts";
import {Refresh} from "@element-plus/icons-vue";
import {useConfigStore} from "@/stores/configStore.ts";
import {storeToRefs} from "pinia";

const configStore = useConfigStore()
const {hitokotoClass} = storeToRefs(configStore)

const hitokoto = ref<string>('')
const hitokotoFrom = ref<string>('')
const hitokotoHref = ref<string>('')

const updateHitokoto = async () => {
  try {
    const hitokotoObj = await getHitokoto(hitokotoClass.value)
    hitokoto.value = hitokotoObj.content
    hitokotoFrom.value = hitokotoObj.from
    hitokotoHref.value = hitokotoObj.href
  } catch (error) {
    console.error('Error fetching Hitokoto:', error)
  }
}

const refreshHitokoto = async () => {
  if (timer) {
    clearInterval(timer);
  }
  await updateHitokoto()
  timer = setInterval(updateHitokoto, 60 * 1000);
}

updateHitokoto()

let timer: number | null = null;

onMounted(() => {
  timer = setInterval(updateHitokoto, 60 * 1000);
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<template>
  <div class="hitokoto-box">
    <p class="hitokoto-content" v-if="hitokoto">
      <a :href="hitokotoHref" target="_blank" rel="noopener" v-if="hitokotoHref">『&emsp;{{ hitokoto }}&emsp;』</a>
      <span v-else>『&emsp;{{ hitokoto }}&emsp;』</span>
    </p>
    <p class="hitokoto-from" v-if="hitokotoFrom">—— {{ hitokotoFrom }}</p>
    <el-button class="hitokoto-refresh" circle :icon="Refresh" @click="refreshHitokoto"/>
  </div>
</template>

<style scoped>
.hitokoto-box {
  max-width: 750px;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3);
  position: relative;
  font-size: var(--el-font-size-base);
}

.hitokoto-content {
  font-size: 1.15em;
  word-break: break-word;
  color: var(--el-text-color-regular);
}

.hitokoto-content a {
  color: inherit;
  text-decoration: none;
}

.hitokoto-content a:focus,
.hitokoto-content a:active,
.hitokoto-content a:hover,
.hitokoto-content a:visited {
  color: inherit;
  text-decoration: inherit;
}

.hitokoto-from {
  font-size: 0.98em;
  margin-top: 6px;
  text-align: end;
  color: var(--el-text-color-regular);
}

.hitokoto-refresh {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 2; /* 防止被内容遮盖 */
}

.hitokoto-box:hover .hitokoto-refresh {
  opacity: 1;
  pointer-events: auto;
}
</style>
