<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import {ref} from "vue";


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


</script>

<template>
  <main>
    <TheWelcome/>
    <section>
      <h2>Bookmarks</h2>
      <ul>
        <li v-for="bookmark in bookmarks" :key="bookmark.id">
          <a :href="bookmark.url" target="_blank">{{ bookmark.title }}</a>
        </li>
      </ul>
    </section>
  </main>
</template>
