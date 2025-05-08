<script setup lang="ts">
import SearchBar from "@/components/SearchBar.vue";
import BookmarksBar from "@/components/BookmarksBar.vue";
import {Refresh, Setting} from "@element-plus/icons-vue";
import {ref, watch} from "vue";
import SettingPanel from "@/components/SettingPanel.vue";
import {useConfigStore} from "@/stores/configStore.ts";
import {storeToRefs} from "pinia";
import TimeNow from "@/components/TimeNow.vue";
import Weather from "@/components/Weather.vue";

const configStore = useConfigStore()
const {
  showBookmark,
  showSearch,
  showBackgroundImage,
  backgroundImageUrl,
  fontFamily,
  showTopSites,
  showTime,
  showHitokoto,
  showWeather
} = storeToRefs(configStore)

const settingVisible = ref(false)

const backgroundImage1Url = ref('')
const backgroundImage2Url = ref('')

const backgroundImg1Show = ref(false)
const backgroundImg2Show = ref(false)

const isBlurred = ref(false)

const onBackgroundImg1Loaded = () => {
  backgroundImg1Show.value = true
  backgroundImg2Show.value = false
}

const onBackgroundImg2Loaded = () => {
  backgroundImg1Show.value = false
  backgroundImg2Show.value = true
}


watch(fontFamily, (newFontFamily: string) => {
  if (newFontFamily) {
    document.body.style.fontFamily = newFontFamily
  }
}, {immediate: true})

const refreshBackgroundImage = () => {
  if (!backgroundImageUrl.value) {
    backgroundImg1Show.value = false
    backgroundImg2Show.value = false
    return
  }
  if (backgroundImg1Show.value) {
    backgroundImage2Url.value = backgroundImageUrl.value + '?t=' + new Date().getTime()
  } else {
    backgroundImage1Url.value = backgroundImageUrl.value + '?t=' + new Date().getTime()
  }
}

watch(backgroundImageUrl, refreshBackgroundImage, {immediate: true})

</script>

<template>
  <div class="background">
    <div v-if="showBackgroundImage" class="background-img-container"
         :class="{blurred: isBlurred}">
      <img class="background-img" :class="{show: backgroundImg1Show}"
           :src="backgroundImage1Url" @load="onBackgroundImg1Loaded" alt=""/>
      <img class="background-img" :class="{show: backgroundImg2Show}"
           :src="backgroundImage2Url" @load="onBackgroundImg2Loaded" alt=""/>
    </div>
    <el-container class="container">
      <el-header style="padding: 0">
        <bookmarks-bar v-if="showBookmark"/>
      </el-header>
      <el-main class="main">
        <div v-if="showWeather" class="weather-container">
          <weather/>
        </div>
        <div class="search-container">
          <time-now v-if="showTime"/>
          <search-bar v-if="showSearch" @focusin="isBlurred = true" @focusout="isBlurred = false"/>
          <most-visited v-if="showTopSites"/>
        </div>
      </el-main>
      <el-footer class="footer-bar">
        <div class="hitokoto-container" v-if="showHitokoto">
          <hitokoto class="hitokoto" v-if="showHitokoto"/>
        </div>
        <div class="options">
          <el-button circle :icon="Refresh" @click="refreshBackgroundImage"/>
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
  background-color: var(--el-fill-color);
  width: 100%;
  height: 100vh;
}

.background-img-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  transition: opacity 0.3s ease-in-out, filter 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.background-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.background-img.show {
  opacity: 1;
}


.blurred {
  filter: blur(16px);
  transform: scale(1.08);
}

.container {
  position: relative;
  height: 100vh;
  width: 100%;
  background-color: var(--el-mask-color-extra-light);
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
    align-content: start;
  }
}

.footer-bar {
  position: relative; /* 用于绝对定位 options */
}

.hitokoto-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  display: flex;
  justify-content: center;
}

.hitokoto {
  flex: 1;
  min-width: 0;
}

.options {
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
}

.main {
  position: relative;
}

.weather-container {
  position: absolute;
  top: 0;
  left: 10px;
  padding: 10px;
}
</style>
