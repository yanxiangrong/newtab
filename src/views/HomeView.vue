<script setup lang="ts">
import SearchBar from "@/components/SearchBar.vue";
import BookmarksBar from "@/components/BookmarksBar.vue";

</script>

<template>
  <div class="background">
    <el-container class="container">
      <el-header style="padding: 0">
        <bookmarks-bar/>
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

</style>
