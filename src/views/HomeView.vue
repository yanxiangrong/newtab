<script setup lang="ts">
import SearchBar from "@/components/SearchBar.vue";
import BookmarksBar from "@/components/BookmarksBar.vue";
import {Refresh, Setting} from "@element-plus/icons-vue";
import {ref} from "vue";
import SettingPanel from "@/components/SettingPanel.vue";
import {useConfigStore} from "@/stores/configStore.ts";
import {storeToRefs} from "pinia";

const configStore  = useConfigStore()
const {showBookmark, showSearch} = storeToRefs(configStore)

const settingVisible = ref(false)
</script>

<template>
  <div class="background">
    <el-container class="container">
      <el-header style="padding: 0">
        <bookmarks-bar v-if="showBookmark"/>
      </el-header>
      <el-main>
        <div class="search-container">
          <search-bar v-if="showSearch"/>
        </div>
      </el-main>
      <el-footer>
        <div class="options">
          <el-button circle :icon="Refresh"/>
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
  background-color: #3c3c3c;
  background-image: url("https://bing.ee123.net/img/");
  width: 100%;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.container {
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}

.search-container {
  width: 100%;
  display: grid;
  place-items: center;
  height: 100%;
}

.options {
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
}
</style>
