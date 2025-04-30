<script setup lang="ts">

import {faviconURL, isChromeTopSitesAvailable} from "@/utils/utils.ts";

const mostVisited = ref<chrome.topSites.MostVisitedURL[]>([])

if (isChromeTopSitesAvailable()) {
  chrome.topSites.get((sites) => {
    if (!sites) {
      return
    }
    mostVisited.value = sites
  })
} else {
  console.log('chrome.topSites is not available')
  mostVisited.value = [ // TODO: mock data
    {
      title: "虎牙直播",
      url: "https://www.huya.com/"
    },
    {
      title: "虎牙直播",
      url: "https://www.huya.com/"
    },
    {
      title: "虎牙直播",
      url: "https://www.huya.com/"
    },
    {
      title: "虎牙直播",
      url: "https://www.huya.com/"
    },
    {
      title: "虎牙直播",
      url: "https://www.huya.com/"
    },
    {
      "title": "腾讯云 产业智变·云启未来 - 腾讯",
      "url": "https://cloud.tencent.com/"
    },
    {
      "title": "Python 标准库 — Python 3.13.3 文档",
      "url": "https://docs.python.org/zh-cn/3.13/library/index.html"
    },
    {
      "title": "GitHub",
      "url": "https://github.com/"
    }
  ]
}
</script>

<template>
  <div class="most-visited">
    <div class="site-item-wrap" v-for="site in mostVisited" :key="site.url">
      <el-link :href="site.url" target="_blank" :underline="false">
        <div class="site-item">
          <img :src="faviconURL(site.url, 48)" alt="" class="favicon"/>
          <span>{{ site.title }}</span>
        </div>
      </el-link>
    </div>
  </div>
</template>

<style scoped>
.most-visited {
  display: flex;
  flex-wrap: wrap;
  max-width: 750px;
  justify-content: center;
  gap: 16px;
}

.site-item-wrap {
  display: flex;
  justify-content: center;
}

.site-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-decoration: none;
  padding: 16px 8px;
  border-radius: 12px;
  transition: background 0.3s, box-shadow 0.3s;
  color: var(--el-link-text-color);

  background: color-mix(in srgb, var(--el-bg-color), transparent 60%);
  backdrop-filter: blur(8px);
}

.site-item:hover {
  background: var(--el-color-primary-light-9);
  box-shadow: var(--el-box-shadow-light);
}


.site-item span {
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.favicon {
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
  object-fit: contain;
}

.el-link:hover {
  color: inherit;
}

@media (max-width: 800px) {
  .most-visited {
    gap: 10px;
  }

  .site-item {
    padding: 12px 4px;
  }

  .site-item span {
    width: 70px;
  }

  .favicon {
    width: 32px;
    height: 32px;
    margin-bottom: 8px;
  }
}
</style>
