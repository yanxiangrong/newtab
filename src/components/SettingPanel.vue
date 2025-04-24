<script setup lang="ts">

import {useConfigStore} from "@/stores/configStore.ts";
import {storeToRefs} from "pinia";
import {ref, watch, onMounted} from 'vue'

const configStore = useConfigStore()
const config = storeToRefs(configStore)

const fontTest = ref<HTMLElement>()
watch(config.fontFamily, (newFontFamily) => {
  if (!fontTest.value) return
  fontTest.value.style.fontFamily = newFontFamily
})

onMounted(() => {
  if (!fontTest.value) return
  fontTest.value.style.fontFamily = config.fontFamily.value
})

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
      <el-form-item label="搜索建议数量">
        <el-input-number v-model="config.suggestionCount.value" :min="0" :max="1000"/>
      </el-form-item>
      <el-form-item label="搜索建议设置">
        <el-button>搜索建议设置</el-button>
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
    <el-form-item label="字体">
      <el-input v-model="config.fontFamily.value"/>
    </el-form-item>
    <el-card shadow="never">
      <div ref="fontTest">The quick brown fox jumps over the lazy dog. 1234567890<br/>
        敏捷的棕色狐狸跳过了懒狗。你好，World！@Vue字体测试
      </div>
    </el-card>
  </el-form>
</template>

<style scoped>

</style>
