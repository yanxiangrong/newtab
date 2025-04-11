<script setup lang="ts">
import {faviconURL} from "@/utils/utils.ts";

defineProps<{
  title: string
  url: string
}>()



</script>

<template>
  <li class="bookmarks-wrap">
    <el-link :underline="false" class="bookmark-link" :href="url" >
      <el-icon class="favicon" v-if="url">
        <img loading="lazy" :src="faviconURL(url)" alt=""/>
      </el-icon>
      <span class="bookmark-span">
        {{ title }}
        </span>
    </el-link>
  </li>
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
