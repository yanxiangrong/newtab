<script setup lang="ts">

import {useConfigStore, useLocalConfigStore} from "@/stores/configStore.ts";
import {storeToRefs} from "pinia";
import {onMounted, ref, watch} from 'vue'
import {ElMessage} from "element-plus";
import {type BookmarkNode, countBookmarks, genBookmarkHtml, parseBookmarksHtml} from "@/utils/bookmarkParser.ts";
import {isChromeBookmarkAvailable} from "@/utils/utils.ts";
import {hitokotoTypeMap} from "@/api/hitokoto.ts";

const configStore = useConfigStore()
const config = storeToRefs(configStore)

const localConfigStore = useLocalConfigStore()

const fontTest = ref<HTMLElement>()
watch(config.fontFamily, (newFontFamily) => {
  if (!fontTest.value) return
  fontTest.value.style.fontFamily = newFontFamily
})

const bookmarkInput = ref<HTMLInputElement>()

function triggerImport() {
  bookmarkInput.value?.click()
}

function onImportBookmark(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files || !files.length) return
  const file = files[0]
  const reader = new FileReader()
  reader.onload = function (evt) {
    const htmlString = evt.target?.result as string
    const tree: BookmarkNode[] = parseBookmarksHtml(htmlString)

    localConfigStore.bookmarks = tree
    ElMessage.success('已导入书签' + countBookmarks(tree) + '条')
  }
  reader.readAsText(file)
}

function onExportBookmark() {
  const bookmarks = localConfigStore.bookmarks // 需替换为真实数据源
  // 生成标准Bookmark html
  const html = genBookmarkHtml(bookmarks)
  const blob = new Blob([html], {type: "text/html"})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const now = new Date()
  a.href = url
  a.download = `bookmarks_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

onMounted(() => {
  if (!fontTest.value) return
  fontTest.value.style.fontFamily = config.fontFamily.value
})

const backgroundImageUrlInput = ref(config.backgroundImageUrl.value)
const onBackgroundImageUrlChange = (value: string) => {
  config.backgroundImageUrl.value = value
}

const fontFamilyInput = ref(config.fontFamily.value)
const onFontFamilyChange = (value: string) => {
  config.fontFamily.value = value
}

</script>

<template>
  <el-form :model="config" label-width="auto">
    <el-form-item label="显示书签栏">
      <el-switch v-model="config.showBookmark.value"/>
    </el-form-item>
    <el-form-item label="书签管理" v-if="config.showBookmark.value && !isChromeBookmarkAvailable()">
      <el-button @click="onExportBookmark">导出书签</el-button>
      <el-button @click="triggerImport">导入书签</el-button>
      <input ref="bookmarkInput" type="file" accept=".html" @change="onImportBookmark" style="display: none"/>
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
        <el-input v-model="backgroundImageUrlInput" @change="onBackgroundImageUrlChange"/>
      </el-form-item>
    </template>
    <el-form-item label="字体">
      <el-input v-model="fontFamilyInput" @change="onFontFamilyChange"/>
    </el-form-item>
    <el-card shadow="never" style="margin-bottom: 18px">
      <div ref="fontTest">The quick brown fox jumps over the lazy dog. 1234567890<br/>
        敏捷的棕色狐狸跳过了懒狗。你好，World！@Vue字体测试
      </div>
    </el-card>
    <el-form-item label="显示热门网站">
      <el-switch v-model="config.showTopSites.value"/>
    </el-form-item>
    <el-form-item label="主题">
      <el-radio-group v-model="config.theme.value">
        <el-radio-button label="light">浅色</el-radio-button>
        <el-radio-button label="auto">跟随系统</el-radio-button>
        <el-radio-button label="dark">深色</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="显示时间">
      <el-switch v-model="config.showTime.value"/>
    </el-form-item>
    <el-form-item label="显示一言">
      <el-switch v-model="config.showHitokoto.value"/>
    </el-form-item>
    <el-form-item label="一言类型" v-if="config.showHitokoto.value">
      <el-checkbox-group id="hitokotoClass" v-model="config.hitokotoClass.value">
        <el-checkbox v-for="[key, label] in hitokotoTypeMap" :key="key" :label="label" :value="key"/>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="显示天气">
      <el-switch v-model="config.showWeather.value"/>
    </el-form-item>
    <el-form-item label="位置服务">
      <el-switch v-model="config.locationSetting.value" active-text="浏览器定位" active-value="browser"
                 inactive-text="IP 定位" inactive-value="ip"
                 style="--el-switch-on-color: #409EFF; --el-switch-off-color: #FFA940"/>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>

<style>
#hitokotoClass .el-checkbox {
  margin-right: 8px;
}

#hitokotoClass .el-checkbox__label {
  padding-left: 4px;
}
</style>
