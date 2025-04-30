<script setup lang="ts">
import {ref} from "vue";
import BookmarksTree from "@/components/BookmarksTree.vue";
import {useConfigStore} from "@/stores/configStore.ts";
import {bookmarkNodeToChromeTree} from "@/utils/bookmarkParser.ts";
import {isChromeBookmarkAvailable} from "@/utils/utils.ts";

const configStore = useConfigStore()

const bookmarks = ref<chrome.bookmarks.BookmarkTreeNode[]>();
const otherBookmarks = ref<chrome.bookmarks.BookmarkTreeNode[]>();

if (isChromeBookmarkAvailable()) {
  chrome.bookmarks.getTree((tree) => {
    if (!tree || !tree[0].children) {
      return
    }
    console.log('all bookmarks', tree)

    bookmarks.value = tree[0].children.find(node => {
      return node.folderType === "bookmarks-bar"
    })?.children
    otherBookmarks.value = [
      {
        id: '',
        title: '所有书签',
        syncing: false,
        children: tree[0].children.find(node => {
          return node.folderType === "other"
        })?.children
      }
    ]

    console.log('chrome.bookmarks:', bookmarks.value)
  })
} else {
  const tree = bookmarkNodeToChromeTree(configStore.bookmarks)
  bookmarks.value = tree[0].children
  otherBookmarks.value = [
    {
      id: '',
      title: '所有书签',
      syncing: false,
      children: tree.slice(1)
    }
  ]
  console.log('chrome.bookmarks is not available')
}

</script>

<template>
  <div class="bookmarks-bar-wrap">
    <div class="bookmarks-bar">
      <el-menu mode="horizontal" unique-opened>
        <template v-for="node in bookmarks">
          <bookmarks-tree v-if="node" :node="node" :key="node.id" class="bookmarks-item"/>
        </template>
      </el-menu>
    </div>
    <el-menu mode="horizontal" :ellipsis="false">
      <template v-for="node in otherBookmarks">
        <bookmarks-tree v-if="node" :node="node" :key="node.id" class="bookmarks-item"/>
      </template>
    </el-menu>
  </div>
</template>

<style scoped>
.el-menu--horizontal {
  --el-menu-horizontal-height: 40px;
  --el-menu-base-level-padding: 10px;
}

.bookmarks-bar-wrap {
  display: flex;
}

.bookmarks-bar {
  width: 0;
  flex: 1;
}

.bookmarks-bar-wrap .el-menu {
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
}

.el-menu--horizontal > .bookmarks-item {
  background-color: rgba(255, 255, 255, 0);
  margin-left: 2px;
  margin-right: 2px;
  height: 28px;
  border-radius: 14px;
  box-sizing: border-box;
  padding: 8px;
  transition: background-color 0.3s ease;
  line-height: 28px;
}


.el-menu-item {
  border: unset;
}

.bookmarks-bar-wrap {
  background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--el-bg-color), transparent 50%) 0%,
      rgba(0, 0, 0, 0) 100%
  );
  height: 50px;
}

.el-menu--horizontal.el-menu {
  border: none;
}
</style>

<style>
.el-menu--horizontal > .bookmarks-item:not(.is-disabled):focus,
.el-menu--horizontal > .bookmarks-item:not(.is-disabled):hover {
  background-color: var(--el-color-primary-light-9);
}

.el-menu--horizontal > .bookmarks-item .el-sub-menu__title {
  padding: 0;
  border: 0;
  line-height: inherit;
}

.el-menu--horizontal > .bookmarks-item .el-sub-menu__title .el-sub-menu__icon-arrow {
  display: none;
}
</style>
