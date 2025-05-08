<script setup lang="ts">
import {ref, watch} from 'vue'
import {Link, Search, Star} from "@element-plus/icons-vue";
import {useConfigStore} from "@/stores/configStore.ts";
import {storeToRefs} from "pinia";
import {faviconURL, isChromeBookmarkAvailable, isChromeHistoryAvailable} from "@/utils/utils.ts";
import {fetchSearchSuggestions} from "@/api/baiduSuggestion.ts";

const configStore = useConfigStore()
const {searchEngine, searchEngines, suggestionCount} = storeToRefs(configStore)

// const searchHistory = ref<string[]>(JSON.parse(localStorage.getItem("searchHistory") || "[]"))
// watch(searchHistory, () => localStorage.setItem("searchHistory", JSON.stringify(searchHistory.value)))

const autoComplete = ref()

const searchHistoryNum = 1000
const searchHistory = ref<string[]>([])

const isFocused = ref(false)

const getSearchHistory = async () => {
  const paramsKeys = ['wd', 'q', 'query', 'search', 's']

  let chromeSearchHistory = <{ query: string, time: number }[]>([])
  for (const engine of searchEngines.value) {
    if (!engine.value) continue
    const engineUrl = new URL(engine.value)
    const queryText = engineUrl.origin

    let history = <{ query: string, time: number }[]>([])

    const historyItems = await chrome.history.search({
      text: queryText,
      maxResults: searchHistoryNum,
      startTime: 14 * 24 * 60 * 60 * 1000
    })
    for (const historyItem of historyItems) {
      if (!historyItem.url) continue
      const urlObj = new URL(historyItem.url)

      for (const key of paramsKeys) {
        if (!urlObj.searchParams.has(key)) continue

        let query = urlObj.searchParams.get(key) || ''
        if (query) {
          history.push({
            query: query,
            time: historyItem.lastVisitTime || 0
          })
          break
        }
      }
    }
    chromeSearchHistory.push(...history)
  }

  chromeSearchHistory.sort((a, b) => b.time - a.time)

  let uniqueString = new Set()
  let searchHistory = <string[]>([])

  for (const historyItem of chromeSearchHistory) {
    if (uniqueString.has(historyItem.query)) continue
    if (searchHistory.length > searchHistoryNum) break
    uniqueString.add(historyItem.query)
    searchHistory.push(historyItem.query)
  }

  return searchHistory
}

(async () => {
  if (isChromeHistoryAvailable()) {
    searchHistory.value = await getSearchHistory()
  } else {
    searchHistory.value = JSON.parse(localStorage.getItem("searchHistory") || "[]")
    watch(searchHistory, () => localStorage.setItem("searchHistory", JSON.stringify(searchHistory.value)))
  }
})()

const input = ref('')
const openSearch = (query: string) => {
  if (!query || autoComplete.value?.highlightedIndex > -1) return

  searchHistory.value = [query, ...searchHistory.value.filter(q => q !== query)].slice(0, 100)

  const s = searchEngines.value.find(e => e.label === searchEngine.value)
  if (!s) return
  window.location.assign(s.value + query)
}


interface SuggestionItem {
  value: string
  link: string | null
  type: 'history' | 'bookmark' | 'search'
}

const querySearch = (query: string, cb: (suggestions: Record<string, any>[]) => void): void => {
  const suggestionNum = suggestionCount.value;

  const fetchSuggestions = async () => {
    let suggestions: SuggestionItem[] = [];

    if (!query) {
      suggestions.push(...searchHistory.value.slice(0, suggestionNum).map(item => {
        return <SuggestionItem>{value: item, link: null, type: 'search'};
      }));
    } else {
      // 书签
      if (isChromeBookmarkAvailable()) {
        const bookmarks = await chrome.bookmarks.search(query);
        suggestions.push(...bookmarks.filter(item => item.url).slice(0, suggestionNum - suggestions.length).map(item => {
          return <SuggestionItem>{value: item.title || '', link: item.url || null, type: 'bookmark'};
        }));
      }

      // 搜索历史
      if (suggestions.length < suggestionNum) {
        suggestions.push(...searchHistory.value.filter(q => q.includes(query)).slice(0, suggestionNum - suggestions.length).map(item => {
          return <SuggestionItem>{value: item, link: null, type: 'search'};
        }));
      }

      // Chrome 历史记录
      if (suggestions.length < suggestionNum && chrome && chrome.history) {
        const historyItems = await chrome.history.search({
          text: query,
          maxResults: suggestionNum - suggestions.length,
          startTime: 14 * 24 * 60 * 60 * 1000
        });
        suggestions.push(...historyItems.map(item => {
          return <SuggestionItem>{value: item.title || '', link: item.url || null, type: 'history'};
        }));
      }

      // 搜索建议
      if (suggestions.length < suggestionNum) {
        try {
          const searchSuggestions = await fetchSearchSuggestions(query);
          suggestions.push(...searchSuggestions.slice(0, suggestionNum - suggestions.length).map(item => {
            return <SuggestionItem>{value: item, link: null, type: 'search'};
          }));
        } catch (e) {
        }
      }
    }

    cb(suggestions);
  };

  fetchSuggestions();
};

const handleSuggestionSelect = (item: Record<string, any>) => {
  if (item.link) {
    window.location.assign(item.link)
  }
}

</script>

<template>
  <el-autocomplete ref="autoComplete" style="max-width: 750px" v-model="input" autofocus size="large"
                   @keydown.enter="openSearch(input)"
                   :fetch-suggestions="querySearch" @select="handleSuggestionSelect" class="search-input"
                   :class="{'is-focus': isFocused}"
                   fit-input-width @focusin="isFocused = true" @focusout="isFocused = false">
    <template #prepend>
      <el-select style="width: 115px" v-model="searchEngine" size="large">
        <el-option v-for="engine in searchEngines" :key="engine.label" :label="engine.label"
                   :value="engine.label"/>
      </el-select>
    </template>
    <template #append>
      <el-button :icon="Search" @click="openSearch(input)"/>
    </template>
    <template #default="{item}">
      <div class="suggestion-wrapper">
        <el-icon>
          <img v-if="item.link" :src="faviconURL(item.link)" alt="" draggable="false" loading="lazy"/>
          <template v-else>
            <Link v-if="item.type === 'history'"/>
            <Star v-else-if="item.type === 'bookmark'"/>
            <Search v-else-if="item.type === 'search'"/>
          </template>
        </el-icon>
        <div class="suggestion-text">{{ item.value }}</div>
        <el-link v-if="item.link" class="suggestion-link" :underline="false" type="primary" :href="item.link">
          <span class="suggestion-link-text">
            {{ item.link }}
          </span>
        </el-link>
      </div>
    </template>
  </el-autocomplete>
</template>

<style scoped>
.suggestion-wrapper {
  display: flex;
  align-items: center;
  overflow: hidden;
}

.suggestion-text {
  margin-left: 10px;
  margin-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-link {
  width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  justify-content: start;
}

.suggestion-link-text {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}


</style>

<style>
.search-input .el-input--large {
  font-size: 16px;
  font-weight: 600;
}

.search-input {
  --el-border-radius-base: 20px
}

.search-input .el-input {
  background-color: color-mix(in srgb, var(--el-fill-color-extra-light), transparent 50%);
  backdrop-filter: blur(8px);
  border-radius: var(--el-border-radius-base);
}

.search-input.is-focus .el-input {
  background-color: color-mix(in srgb, var(--el-fill-color-extra-light), transparent 0%);
}

.search-input input {
  font-family: inherit;
}
</style>
