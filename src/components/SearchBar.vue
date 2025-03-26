<script setup lang="ts">
import {ref} from 'vue'
import {Search} from "@element-plus/icons-vue";

const searchEngines = [
  {label: '谷歌', value: 'https://www.google.com/search?q='},
  {label: '百度', value: 'https://www.baidu.com/s?wd='},
  {label: '必应', value: 'https://cn.bing.com/search?q='},
  {label: '搜狗', value: 'https://www.sogou.com/web?query='},
  {label: '360', value: 'https://www.so.com/s?q='},
]
const selectedEngine = ref(searchEngines[0].value)
const input = ref('')
const openSearch = (query: string) => {
  window.location.assign(selectedEngine.value + query)
}
</script>

<template>
  <el-input style="max-width: 600px" v-model="input" autofocus size="large" @keydown.enter="openSearch(input)">
    <template #prepend>
      <el-select style="width: 115px" v-model="selectedEngine" size="large">
        <el-option v-for="engine in searchEngines" :key="engine.label" :label="engine.label"
                   :value="engine.value"/>
      </el-select>
    </template>
    <template #append>
      <el-button :icon="Search" @click="openSearch(input)"/>
    </template>
  </el-input>
</template>

<style scoped>

</style>
