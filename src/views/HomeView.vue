<script setup lang="ts">
import {onMounted, ref} from "vue";
import BookmarksTree from "@/components/BookmarksTree.vue";
import SearchBar from "@/components/SearchBar.vue";
import {Folder} from "@element-plus/icons-vue";


const bookmarks = ref<chrome.bookmarks.BookmarkTreeNode[]>();
const otherBookmarks = ref<chrome.bookmarks.BookmarkTreeNode[]>();

if (chrome.bookmarks) {
  chrome.bookmarks.getTree((tree) => {
    if (!tree || !tree[0].children) {
      return
    }
    console.log('all', tree)

    for (const node of tree[0].children) {
      if (!node.folderType && node.children) {
        bookmarks.value = node.children
        break
      }
      if (node.folderType === "bookmarks-bar" && node.children && !bookmarks.value) {
        bookmarks.value = node.children
      }
      if (node.folderType === "other" && node.children && !otherBookmarks.value) {
        otherBookmarks.value = node.children
      }
    }

    console.log('chrome.bookmarks:', bookmarks.value)
  })
} else {
  console.log('chrome.bookmarks is not available')
}

if (!bookmarks.value) {
  bookmarks.value = [
    {
      "dateAdded": 1724643955000,
      "dateLastUsed": 1742292844330,
      "id": "5",
      "index": 0,
      "parentId": "1",
      "syncing": false,
      "title": "GitLab",
      "url": "https://git.huya.info/"
    },
    {
      "children": [
        {
          "dateAdded": 1742378633363,
          "dateLastUsed": 1742788759589,
          "id": "49",
          "index": 0,
          "parentId": "52",
          "syncing": false,
          "title": "DCache-国内测试",
          "url": "https://test-dcache.huya.info/huya/"
        },
        {
          "dateAdded": 1742378613019,
          "dateLastUsed": 1742874714534,
          "id": "47",
          "index": 1,
          "parentId": "52",
          "syncing": false,
          "title": "DCache-国内正式",
          "url": "https://dcache.huya.info/huya/"
        },
        {
          "dateAdded": 1742378642139,
          "id": "50",
          "index": 2,
          "parentId": "52",
          "syncing": false,
          "title": "DCache-海外测试",
          "url": "https://test-dcache.huya.info/nimo/"
        },
        {
          "dateAdded": 1742378625068,
          "id": "48",
          "index": 3,
          "parentId": "52",
          "syncing": false,
          "title": "DCache-海外正式",
          "url": "https://dcache.huya.info/nimo/"
        }
      ],
      "dateAdded": 1742378672444,
      "dateGroupModified": 1742378684693,
      "id": "52",
      "index": 1,
      "parentId": "1",
      "syncing": false,
      "title": "Dcache"
    },
    {
      "children": [
        {
          "dateAdded": 1724667708000,
          "dateLastUsed": 1742894012401,
          "id": "9",
          "index": 0,
          "parentId": "41",
          "syncing": false,
          "title": "TAF-国内测试",
          "url": "http://test.taf.huya.com/"
        },
        {
          "dateAdded": 1742378416483,
          "dateLastUsed": 1742897873437,
          "id": "38",
          "index": 1,
          "parentId": "41",
          "syncing": false,
          "title": "TAF-国内正式",
          "url": "https://taf.huya.com/"
        },
        {
          "dateAdded": 1742378447339,
          "dateLastUsed": 1742897874303,
          "id": "40",
          "index": 2,
          "parentId": "41",
          "syncing": false,
          "title": "TAF-海外测试",
          "url": "https://nimotaf-test-new.huya.com/"
        },
        {
          "dateAdded": 1742378434676,
          "dateLastUsed": 1742897874630,
          "id": "39",
          "index": 3,
          "parentId": "41",
          "syncing": false,
          "title": "TAF-海外正式",
          "url": "https://nimotaf-new.huya.com/"
        }
      ],
      "dateAdded": 1742378478292,
      "dateGroupModified": 1742378490101,
      "id": "41",
      "index": 2,
      "parentId": "1",
      "syncing": false,
      "title": "TAF"
    },
    {
      "children": [
        {
          "dateAdded": 1724829932000,
          "dateLastUsed": 1742378261678,
          "id": "13",
          "index": 0,
          "parentId": "37",
          "syncing": false,
          "title": "Athena-研测",
          "url": "https://athena-local.huya.com/"
        },
        {
          "dateAdded": 1742378266627,
          "dateLastUsed": 1742884903076,
          "id": "35",
          "index": 1,
          "parentId": "37",
          "syncing": false,
          "title": "Athena-正式",
          "url": "https://athena.huya.com/"
        }
      ],
      "dateAdded": 1742378374005,
      "dateGroupModified": 1742378447339,
      "id": "37",
      "index": 3,
      "parentId": "1",
      "syncing": false,
      "title": "雅典娜"
    },
    {
      "children": [
        {
          "dateAdded": 1724750598000,
          "dateLastUsed": 1742378513026,
          "id": "12",
          "index": 0,
          "parentId": "46",
          "syncing": false,
          "title": "Gradio-国内测试",
          "url": "http://10.132.255.230:7860/"
        },
        {
          "dateAdded": 1742378516859,
          "id": "42",
          "index": 1,
          "parentId": "46",
          "syncing": false,
          "title": "Gradio-国内正式",
          "url": "http://pacstore-tools.huya.info/"
        },
        {
          "dateAdded": 1742378553644,
          "id": "45",
          "index": 2,
          "parentId": "46",
          "syncing": false,
          "title": "Gradio-海外测试",
          "url": "http://10.132.193.252:7860/"
        },
        {
          "dateAdded": 1742378546548,
          "dateLastUsed": 1742780878170,
          "id": "44",
          "index": 3,
          "parentId": "46",
          "syncing": false,
          "title": "Gradio-海外正式",
          "url": "https://nimo-pacstore-tools.huya.info/"
        }
      ],
      "dateAdded": 1742378581901,
      "dateGroupModified": 1742378680590,
      "id": "46",
      "index": 4,
      "parentId": "1",
      "syncing": false,
      "title": "Gradio"
    },
    {
      "dateAdded": 1725610476000,
      "dateLastUsed": 1742885115399,
      "id": "15",
      "index": 5,
      "parentId": "1",
      "syncing": false,
      "title": "主机管理",
      "url": "https://new-autoidc.huya.com/"
    },
    {
      "dateAdded": 1742378654660,
      "id": "51",
      "index": 6,
      "parentId": "1",
      "syncing": false,
      "title": "NEO",
      "url": "https://neo-jingwei.huya.info/entry"
    },
    {
      "dateAdded": 1726630345000,
      "dateLastUsed": 1742378843073,
      "id": "16",
      "index": 7,
      "parentId": "1",
      "syncing": false,
      "title": "精卫",
      "url": "https://jingwei.huya.com/app/"
    },
    {
      "children": [
        {
          "dateAdded": 1742807957035,
          "id": "56",
          "index": 0,
          "parentId": "57",
          "syncing": false,
          "title": "Grafana-研测",
          "url": "https://grafana-yc.huya.info/"
        },
        {
          "dateAdded": 1742377932163,
          "dateLastUsed": 1742807941582,
          "id": "32",
          "index": 1,
          "parentId": "57",
          "syncing": false,
          "title": "Grafana-生产",
          "url": "https://grafana.huya.info/?orgId=2"
        }
      ],
      "dateAdded": 1742807986243,
      "dateGroupModified": 1742808023917,
      "id": "57",
      "index": 8,
      "parentId": "1",
      "syncing": false,
      "title": "Grafana"
    },
    {
      "dateAdded": 1742378864060,
      "dateLastUsed": 1742786129879,
      "id": "54",
      "index": 9,
      "parentId": "1",
      "syncing": false,
      "title": "升龙",
      "url": "https://deploy-jingwei.huya.com/"
    },
    {
      "dateAdded": 1724667719000,
      "dateLastUsed": 1742805176899,
      "id": "10",
      "index": 10,
      "parentId": "1",
      "syncing": false,
      "title": "JCE",
      "url": "https://jce.huya.info/online/tafcall"
    },
    {
      "dateAdded": 1726820282000,
      "dateLastUsed": 1742805180107,
      "id": "17",
      "index": 11,
      "parentId": "1",
      "syncing": false,
      "title": "虎牙接口",
      "url": "https://call.huya.info/"
    },
    {
      "dateAdded": 1732264576000,
      "dateLastUsed": 1742378099214,
      "id": "18",
      "index": 12,
      "parentId": "1",
      "syncing": false,
      "title": "虎牙数据库",
      "url": "https://dmx.huya.com/"
    },
    {
      "dateAdded": 1734055155000,
      "dateLastUsed": 1742805186770,
      "id": "20",
      "index": 13,
      "parentId": "1",
      "syncing": false,
      "title": "LEAF",
      "url": "http://leaf.huya.info/"
    },
    {
      "dateAdded": 1742378336380,
      "dateLastUsed": 1742379254685,
      "id": "36",
      "index": 14,
      "parentId": "1",
      "syncing": false,
      "title": "LLM",
      "url": "https://llm.huya.info/"
    },
    {
      "dateAdded": 1742378716659,
      "id": "53",
      "index": 15,
      "parentId": "1",
      "syncing": false,
      "title": "TAPD",
      "url": "https://www.tapd.cn/"
    },
    {
      "dateAdded": 1742378169379,
      "dateLastUsed": 1742894566826,
      "id": "34",
      "index": 16,
      "parentId": "1",
      "syncing": false,
      "title": "翻译",
      "url": "https://translate.google.com/?hl=zh-CN"
    }
  ]
}

const activeMenu = ref('')

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

onMounted(() => {

})
</script>

<template>
  <div class="background">
    <el-container class="container">
      <el-header style="padding: 0">
        <div style="display: flex;">
          <el-menu style="flex-grow: 1" mode="horizontal" :show-timeout="0" unique-opened :default-active="activeMenu">
            <template v-for="node in bookmarks">
              <el-sub-menu v-if="node.children" :index="node.id" :key="node.id">
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
          </el-menu>
          <el-menu mode="horizontal" :ellipsis="false">
            <el-sub-menu>
              <template #title>
                <el-icon style="margin-right: 8px">
                  <Folder/>
                </el-icon>
                <span>所有书签</span>
              </template>
              <bookmarks-tree v-if="otherBookmarks" :nodes="otherBookmarks"/>
            </el-sub-menu>
          </el-menu>
        </div>
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
  --el-menu-base-level-padding: 10px;
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

.el-menu--horizontal .bookmark-link {
  display: flex;
  justify-content: start;
  font-size: var(--el-menu-item-font-size);
  height: var(--el-menu-horizontal-sub-item-height);
  line-height: var(--el-menu-horizontal-sub-item-height);
  padding: 0 var(--el-menu-base-level-padding);
  white-space: nowrap;
}

.el-menu--horizontal > .bookmark-link {
  align-items: center;
  display: inline-flex;
  font-size: var(--el-menu-item-font-size);
  height: 100%;
  line-height: 100%;
  padding: 0 var(--el-menu-base-level-padding);
}

.el-menu--horizontal .el-link {
  --el-link-text-color: var(--el-menu-text-color);
}

.el-menu--horizontal .el-icon {
  font-size: 18px;
}

.el-icon img {
  object-fit: contain;
  height: 100%;
  width: 100%;
}

</style>
