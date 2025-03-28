<script setup lang="ts">
import {Folder} from "@element-plus/icons-vue";
import BookmarksItem from "@/components/BookmarksItem.vue";

defineProps<{
  nodes: chrome.bookmarks.BookmarkTreeNode[],
}>()

const faviconURL = (u: string) => {
  let url: URL
  if (chrome.runtime && chrome.runtime.getURL) {
    url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u);
    url.searchParams.set("size", "32");
  } else {
    url = new URL("https://www.google.com/s2/favicons?domain=" + u)
  }
  return url.toString();
}

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
    <bookmarks-item :title="node.title" :url="node.url || ''"/>
  </template>
</template>

<style scoped>

</style>
