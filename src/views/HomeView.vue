<script setup lang="ts">
import {onMounted, ref, useTemplateRef} from "vue";
import BookmarksTree from "@/components/BookmarksTree.vue";
import SearchBar from "@/components/SearchBar.vue";


const bookmarks = ref<chrome.bookmarks.BookmarkTreeNode[]>();

if (chrome.bookmarks) {
  chrome.bookmarks.getTree((tree) => {
    if (!tree || !tree[0].children) {
      return
    }

    for (const node of tree[0].children) {
      if (!node.folderType && node.children) {
        bookmarks.value = node.children
        break
      }
      if (node.folderType === "bookmarks-bar" && node.children) {
        bookmarks.value = node.children
        break
      }
    }

    console.log('chrome.bookmarks:', bookmarks.value)
  })
} else {
  console.log('chrome.bookmarks is not available')
}

if (!bookmarks.value) {
  bookmarks.value = [
    {index: 0, title: '书签1', id: '1', syncing: false},
    {index: 1, title: '书签2', id: '2', syncing: false},
    {
      index: 2, title: '书签3', id: '3', syncing: false,
      children: [
        {index: 0, title: '书签3-1', id: '3-1', syncing: false},
        {index: 1, title: '书签3-2', id: '3-2', syncing: false},
        {index: 2, title: '书签3-3', id: '3-3', syncing: false},
      ]
    },
    {index: 3, title: '书签4', id: '4', syncing: false},
    {
      index: 4, title: '书签5', id: '5', syncing: false,
      children: [
        {index: 0, title: '书签5-1', id: '5-1', syncing: false},
        {index: 1, title: '书签5-2', id: '5-2', syncing: false},
        {
          index: 2, title: '书签5-3', id: '5-3', syncing: false,
          children: [
            {index: 0, title: '书签5-3-1', id: '5-3-1', syncing: false},
            {index: 1, title: '书签5-3-2', id: '5-3-2', syncing: false},
            {index: 2, title: '书签5-3-3', id: '5-3-3', syncing: false},
          ]
        }
      ]
    },
    {index: 5, title: '书签6', id: '6', syncing: false},
    {index: 6, title: '书签7', id: '7', syncing: false},
    {index: 7, title: '书签8', id: '8', syncing: false},
    {index: 8, title: '书签9', id: '9', syncing: false},
    {index: 9, title: '书签10', id: '10', syncing: false},
  ]
}

const openPage = (url: string) => window.location.assign(url)
const activeMenu = ref('')
const handleSelect = () => {
  console.log('handleSelect', activeMenu.value)
}

onMounted(() => {

})
</script>

<template>
  <div class="background">
    <el-container class="container">
      <el-header style="padding: 0">
        <el-menu mode="horizontal" show-timeout="0" unique-opened @select="handleSelect" :default-active="activeMenu">
          <template v-for="node in bookmarks" :key="node.id">
            <el-sub-menu v-if="node.children" :index="node.id">
              <template #title>{{ node.title }}</template>
              <bookmarks-tree :nodes="node.children"/>
            </el-sub-menu>
            <div v-else class="bookmark-link">
              <el-link :href="node.url">{{ node.title }}</el-link>
            </div>
          </template>
        </el-menu>
      </el-header>

      <el-main>
        <div class="search-container">
          <search-bar/>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.el-menu--horizontal {
  --el-menu-horizontal-height: 40px;
}

.background {
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

.bookmark-link {
  justify-content: start;
  align-items: center;
  background-color: var(--el-menu-bg-color);
  color: var(--el-menu-text-color);
  display: flex;
  font-size: var(--el-menu-item-font-size);
  height: 100%;
  padding: 0 var(--el-menu-base-level-padding);
  white-space: nowrap;
}

.el-link {
  --el-link-text-color: var(--el-menu-text-color);
}
</style>
