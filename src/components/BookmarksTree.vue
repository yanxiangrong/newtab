<script setup lang="ts">
import {Folder} from "@element-plus/icons-vue";
import BookmarksItem from "@/components/BookmarksItem.vue";

defineProps<{
  nodes: chrome.bookmarks.BookmarkTreeNode[],
}>()

</script>

<template>
  <template v-for="node in nodes" :key="node.id">
    <el-sub-menu v-if="node.children" :index="node.id">
      <template #title>
        <el-icon class="favicon" v-if="node.title">
          <Folder/>
        </el-icon>
        {{ node.title }}
      </template>
      <bookmarks-tree :nodes="node.children"/>
    </el-sub-menu>
    <bookmarks-item v-else :title="node.title" :url="node.url || ''"/>
  </template>
</template>

<style scoped>
.favicon {
  font-size: 16px;
  margin-right: 4px;
  width: 1em;
  height: 1em;
}
</style>
