<script setup lang="ts">
import {Folder} from "@element-plus/icons-vue";
import {faviconURL} from "@/utils/utils.ts";

defineProps<{
  node: chrome.bookmarks.BookmarkTreeNode,
}>()

</script>

<template>
    <el-dropdown class="bookmarks-wrap" v-if="node.children" :index="node.id">
      <div class="bookmarks-text">
        <el-icon class="favicon" v-if="node.title">
          <Folder/>
        </el-icon>
        <span class="bookmark-span">{{ node.title }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="child in node.children" :key="child.id">
            <bookmarks-tree :node="child"/>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-link class="bookmarks-wrap" v-else :underline="false" :href="node.url">
      <div class="bookmarks-text">
        <el-icon class="favicon" v-if="node.url">
          <img loading="lazy" :src="faviconURL(node.url)" alt=""/>
        </el-icon>
        <span class="bookmark-span">{{ node.title }}</span>
      </div>
    </el-link>
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

.bookmarks-text {
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  text-wrap: nowrap;
  box-sizing: border-box;
  line-height: 1;
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
</style>
