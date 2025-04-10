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
    <template v-if="config.showSearch.value">
      <el-form-item label="默认搜索引擎">
        <el-select v-model="config.searchEngine.value">
          <el-option v-for="engine in config.searchEngines.value" :key="engine.label" :label="engine.label"
                     :value="engine.label"/>
        </el-select>
      </el-form-item>
      <el-form-item label="管理搜索引擎">
        <el-button>管理搜索引擎</el-button>
      </el-form-item>
    </template>
    <el-form-item label="显示背景图片">
      <el-switch v-model="config.showBackgroundImage.value"/>
    </el-form-item>
    <template v-if="config.showBackgroundImage.value">
      <el-form-item label="背景图片地址">
        <el-input v-model="config.backgroundImageUrl.value"/>
      </el-form-item>
    </template>
  </el-form>
</template>

<style scoped>

</style>
