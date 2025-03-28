<script setup lang="ts">

import {useConfigStore} from "@/stores/configStore.ts";
import {storeToRefs} from "pinia";

const configStore = useConfigStore()
const config = storeToRefs(configStore)

</script>

<template>
  <el-form :model="config" label-width="auto">
    <el-form-item label="显示书签栏">
      <el-switch v-model="config.showBookmark.value"/>
    </el-form-item>
    <el-form-item label="显示搜索栏">
      <el-switch v-model="config.showSearch.value"/>
    </el-form-item>
    <el-form-item label="搜索引擎">
      <el-select v-model="config.searchEngine.value">
        <el-option v-for="engine in config.searchEngines.value" :key="engine.label" :label="engine.label"
                   :value="engine.label"/>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>
