<script setup lang="ts">
import {Folder} from "@element-plus/icons-vue";
import {faviconURL} from "@/utils/utils.ts";

defineProps<{
  node: chrome.bookmarks.BookmarkTreeNode,
}>()

</script>

<template>
  <el-dropdown v-if="node.children" :index="node.id">
    <el-link :underline="false" :href="node.url">
      <el-icon class="favicon" v-if="node.title">
        <Folder/>
      </el-icon>
      <span class="bookmark-span">{{ node.title }}</span>
    </el-link>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="child in node.children" :key="child.id">
          <bookmarks-tree :node="child"/>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <el-link v-else :underline="false" :href="node.url">
    <el-icon class="favicon" v-if="node.url">
      <img loading="lazy" :src="faviconURL(node.url)" alt=""/>
    </el-icon>
    <span class="bookmark-span">{{ node.title }}</span>
  </el-link>
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

.el-dropdown__popper .el-dropdown-menu {
  max-height: calc(100vh - 60px);
}

</style>
