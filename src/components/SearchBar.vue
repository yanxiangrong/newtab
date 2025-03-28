<script setup lang="ts">
import {ref} from 'vue'
import {Search} from "@element-plus/icons-vue";
import {useConfigStore} from "@/stores/configStore.ts";
import {storeToRefs} from "pinia";

const configStore  = useConfigStore()
const {searchEngine} = storeToRefs(configStore)

const searchEngines = [
  {label: 'Google', value: 'https://www.google.com/search?q='},
  {label: '百度', value: 'https://www.baidu.com/s?wd='},
  {label: '必应', value: 'https://cn.bing.com/search?q='},
  {label: '搜狗', value: 'https://www.sogou.com/web?query='},
  {label: '360', value: 'https://www.so.com/s?q='},
]

const input = ref('')
const openSearch = (query: string) => {
  const s = searchEngines.find(e => e.label === searchEngine.value)
  if (!s) return
  window.location.assign(s.value + query)
}
</script>

<template>
  <el-input style="max-width: 600px" v-model="input" autofocus size="large" @keydown.enter="openSearch(input)">
    <template #prepend>
      <el-select style="width: 115px" v-model="searchEngine" size="large">
        <el-option v-for="engine in searchEngines" :key="engine.label" :label="engine.label"
                   :value="engine.label"/>
      </el-select>
    </template>
    <template #append>
      <el-button :icon="Search" @click="openSearch(input)"/>
    </template>
  </el-input>
</template>

<style scoped>

</style>
