<script setup lang="ts">
import {Folder} from "@element-plus/icons-vue";
import {faviconURL} from "@/utils/utils.ts";

defineProps<{
  node: chrome.bookmarks.BookmarkTreeNode,
}>()

</script>

<template>
  <el-sub-menu v-if="node.children" :index="node.id" teleported popper-class="scroll-menu-list">
    <template #title>
      <el-icon class="favicon" v-if="node.title">
        <Folder/>
      </el-icon>
      <span class="bookmark-span">{{ node.title }}</span>
    </template>
    <bookmarks-tree v-for="child in node.children" :key="child.id" :node="child"/>
  </el-sub-menu>
  <el-menu-item v-else>
    <el-link :underline="false" :href="node.url">
      <el-icon class="favicon" v-if="node.url">
        <img loading="lazy" :src="faviconURL(node.url)" alt=""/>
      </el-icon>
      <span class="bookmark-span">{{ node.title }}</span>
    </el-link>
  </el-menu-item>
</template>

<style scoped>
.favicon {
  font-size: 16px;
  margin-right: 4px;
  width: 1em;
  height: 1em;
}

.bookmark-span {
  max-width: 10em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.el-link {
  transition: background-color 0.3s ease;
}

.el-link:hover {
  color: inherit;
}

.el-menu-item > .el-link {
  width: 100%;
  justify-content: flex-start;
}

</style>

<style>
.scroll-menu-list ul {
  max-height: calc(100vh - 60px);
  overflow-y: auto;
}


</style>
