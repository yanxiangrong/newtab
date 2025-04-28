<script setup lang="ts">
import {Folder} from "@element-plus/icons-vue";
import {faviconURL} from "@/utils/utils.ts";

defineProps<{
  nodes: chrome.bookmarks.BookmarkTreeNode[],
}>()

</script>

<template>
  <li v-for="node in nodes" class="bookmarks-wrap" :key="node.id">
    <el-dropdown v-if="node.children" :index="node.id">
      <div class="bookmarks-text">
        <el-icon class="favicon" v-if="node.title">
          <Folder/>
        </el-icon>
        <span class="bookmark-span">{{ node.title }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <bookmarks-tree :nodes="node.children"/>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-link v-else :underline="false" :href="node.url">
      <div class="bookmarks-text">
        <el-icon class="favicon" v-if="node.url">
          <img loading="lazy" :src="faviconURL(node.url)" alt=""/>
        </el-icon>
        <span class="bookmark-span">
        {{ node.title }}
        </span>
      </div>
    </el-link>
  </li>
</template>

<style scoped>
.bookmarks-wrap {
  display: flex;
  align-items: center;
  height: 100%;
  margin: 0 2px;
}

.favicon {
  font-size: 16px;
  margin-right: 4px;
  width: 1em;
  height: 1em;
}

.scroll {
  max-height: calc(100vh - 20px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
}

.bookmarks-text {
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  text-wrap: nowrap;
  box-sizing: border-box;
  color: var(--el-menu-text-color);
  height: 24px;
  padding: 8px;
  transition: background-color 0.3s ease;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 12px;
}

.bookmarks-text:hover,
.bookmarks-text:hover:focus,
.bookmarks-text:hover:focus-visible {
  background-color: rgba(255, 255, 255, 0.3);
}

.bookmark-span {
  max-width: 10em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.el-link:hover {
  color: inherit !important;
  text-decoration: none !important;
  background: none !important;
}

.el-tooltip__trigger:focus-visible{
  outline: none !important;
}
</style>
