<script setup lang="ts">
import {ref} from 'vue'
import {Search} from "@element-plus/icons-vue";
import {useConfigStore} from "@/stores/configStore.ts";
import {storeToRefs} from "pinia";

const configStore = useConfigStore()
const {searchEngine, searchEngines} = storeToRefs(configStore)


const input = ref('')
const openSearch = (query: string) => {
  const s = searchEngines.value.find(e => e.label === searchEngine.value)
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
