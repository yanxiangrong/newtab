<script setup lang="ts">
defineProps<{
  title: string
  url: string
}>()

const faviconURL = (u: string) => {
  const parsedUrl = new URL(u);
  let faviconUrl: URL
  if (chrome.runtime && chrome.runtime.getURL) {
    faviconUrl = new URL(chrome.runtime.getURL("/_favicon/"));
    faviconUrl.searchParams.set("pageUrl", `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`);
    faviconUrl.searchParams.set("size", "16");
  } else {
    faviconUrl = new URL("https://www.google.com/s2/favicons")
    faviconUrl.searchParams.set("domain", parsedUrl.host)
    faviconUrl.searchParams.set("sz", "16")
  }
  return faviconUrl.toString();
}

</script>

<template>
  <div class="bookmarks-wrap">
    <el-link :underline="false" class="bookmark-link" :href="url" >
      <el-icon class="favicon" v-if="url">
        <img loading="lazy" :src="faviconURL(url)" alt=""/>
      </el-icon>
      <span class="bookmark-span">
        {{ title }}
        </span>
    </el-link>
  </div>
</template>

<style scoped>
.bookmarks-wrap {
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  height: 100%;
  padding: 0 var(--el-menu-base-level-padding);
  box-sizing: border-box;
  --el-link-text-color: var(--el-menu-text-color);
}

.el-menu--popup .bookmarks-wrap {
  display: flex;
  height: var(--el-menu-horizontal-sub-item-height);
  padding: 0 10px;
}

.favicon {
  font-size: 16px;
  margin-right: 4px;
  width: 1em;
  height: 1em;
}


.bookmark-link {
  --el-link-text-color: var(--el-menu-text-color);
}

.bookmark-span {
  max-width: 10em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}


</style>
