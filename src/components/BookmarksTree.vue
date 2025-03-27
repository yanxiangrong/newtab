<script setup lang="ts">
defineProps<{
  nodes: chrome.bookmarks.BookmarkTreeNode[],
}>()

const openPage = (url: string) => window.location.assign(url)

</script>

<template>
  <template v-for="node in nodes" :key="node.id">
    <el-sub-menu v-if="node.children" :index="node.id">
      <template #title>{{ node.title }}</template>
      <bookmarks-tree :nodes="node.children"/>
    </el-sub-menu>
    <div v-else class="bookmark-link">
      <el-link style="width: 100%; justify-content: start" :href="node.url">{{ node.title }}</el-link>
    </div>
  </template>
</template>

<style scoped>
.bookmark-link {
  justify-content: start;
  align-items: center;
  background-color: var(--el-menu-bg-color);
  color: var(--el-menu-text-color);
  display: flex;
  font-size: var(--el-menu-item-font-size);
  height: var(--el-menu-horizontal-sub-item-height);
  line-height: var(--el-menu-horizontal-sub-item-height);
  padding: 0 10px;
  white-space: nowrap;
}

.el-link {
  --el-link-text-color: var(--el-menu-text-color);
}
</style>
