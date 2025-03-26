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
    <el-menu-item v-else :index="node.id" @click="node.url && openPage(node.url)">{{ node.title }}</el-menu-item>
  </template>
</template>
