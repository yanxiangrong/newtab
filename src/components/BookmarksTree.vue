<script setup lang="ts">
import {Folder} from "@element-plus/icons-vue";

defineProps<{
  nodes: chrome.bookmarks.BookmarkTreeNode[],
}>()

const faviconURL = (u: string) => {
  let url: URL
  if (chrome.runtime) {
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
        <el-icon v-if="node.title" style="margin-right: 8px">
          <Folder/>
        </el-icon>
        {{ node.title }}
      </template>
      <bookmarks-tree :nodes="node.children"/>
    </el-sub-menu>
    <el-link v-else class="bookmark-link" :key="'else' + node.id" :href="node.url">
      <el-icon v-if="node.url" style="margin-right: 8px">
        <img loading="lazy" :src="faviconURL(node.url)" alt=""/>
      </el-icon>
      {{ node.title }}
    </el-link>
  </template>
</template>

<style scoped>
.bookmark-link {
  justify-content: start;
  align-items: center;
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

.el-icon img {
  object-fit: contain;
  height: 100%;
  width: 100%;
}

</style>
