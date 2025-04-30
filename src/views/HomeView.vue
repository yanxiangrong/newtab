<script setup lang="ts">
import SearchBar from "@/components/SearchBar.vue";
import BookmarksBar from "@/components/BookmarksBar.vue";
import {Refresh, Setting} from "@element-plus/icons-vue";
import {ref, watch} from "vue";
import SettingPanel from "@/components/SettingPanel.vue";
import {useConfigStore} from "@/stores/configStore.ts";
import {storeToRefs} from "pinia";

const configStore = useConfigStore()
const {
  showBookmark,
  showSearch,
  showBackgroundImage,
  backgroundImageUrl,
  fontFamily,
  showTopSites
} = storeToRefs(configStore)

const settingVisible = ref(false)

const backgroundImgLoaded = ref(false)
const imgKey = ref(0)

const isBlurred = ref(false)

const setFontFamily = (fontFamily: string) => {
  document.body.style.fontFamily = fontFamily
}

watch(fontFamily, (newFontFamily) => {
  setFontFamily(newFontFamily)
})
setFontFamily(fontFamily.value)
</script>

<template>
  <div class="background">
    <img :key="imgKey" v-if="showBackgroundImage" class="background-img"
         :class="{loaded: backgroundImgLoaded, blurred: isBlurred}"
         :src="backgroundImageUrl" @load="backgroundImgLoaded = true" alt=""/>
    <el-container class="container">
      <el-header style="padding: 0">
        <bookmarks-bar v-if="showBookmark"/>
      </el-header>
      <el-main>
        <div class="search-container">
          <search-bar v-if="showSearch" @focusin="isBlurred = true" @focusout="isBlurred = false"/>
          <most-visited v-if="showTopSites"/>
        </div>
      </el-main>
      <el-footer>
        <div class="options">
          <el-button circle :icon="Refresh" @click="imgKey+=1"/>
          <el-button circle :icon="Setting" @click="settingVisible=true"/>
        </div>
      </el-footer>
    </el-container>
  </div>
  <el-drawer
      v-model="settingVisible"
      title="设置"
      :size="400"
      destroy-on-close>
    <setting-panel/>
  </el-drawer>
</template>

<style scoped>
.background {
  background-color: var(--el-bg-color);
  width: 100%;
  height: 100vh;
}

.background-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  object-fit: cover;
  object-position: center;
  opacity: 0;
  transition: opacity 0.3s ease-in-out, filter 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.blurred {
  filter: blur(16px);
  transform: scale(1.08);
}

.background-img.loaded {
  opacity: 1;
}

.container {
  position: relative;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}

.search-container {
  width: 100%;
  display: grid;
  place-items: center;
  height: 100%;
  align-content: center;
  gap: 2rem;
}

@media (max-height: 650px) {
  .search-container {
    place-items: start;
  }
}

.options {
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
}
</style>
