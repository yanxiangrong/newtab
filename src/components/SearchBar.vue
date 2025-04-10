<script setup lang="ts">
import {ref, watch} from 'vue'
import {Search} from "@element-plus/icons-vue";
import {useConfigStore} from "@/stores/configStore.ts";
import {storeToRefs} from "pinia";

const configStore = useConfigStore()
const {searchEngine, searchEngines} = storeToRefs(configStore)

// const searchHistory = ref<string[]>(JSON.parse(localStorage.getItem("searchHistory") || "[]"))
// watch(searchHistory, () => localStorage.setItem("searchHistory", JSON.stringify(searchHistory.value)))

const searchHistoryNum = 1000
const searchHistory = ref<string[]>([])


const searchChromeHistoryAsync = (queryText: string, maxResults: number): Promise<chrome.history.HistoryItem[]> => {
  return new Promise((resolve) => {
    chrome.history.search({text: queryText, maxResults: maxResults}, (historyItems) => {
      resolve(historyItems)
    })
  })
}

const searchChromeBookmarkAsync = (queryText: string, maxResults: number): Promise<chrome.bookmarks.BookmarkTreeNode[]> => {
  return new Promise((resolve) => {
    chrome.bookmarks.search(queryText, (bookmarks) => {
      resolve(bookmarks)
    })
  })
}

const getSearchHistory = async () => {
  const paramsKeys = ['wd', 'q', 'query', 'search', 's']

  let chromeSearchHistory = <{ query: string, time: number }[]>([])
  for (const engine of searchEngines.value) {
    if (!engine.value) continue
    const engineUrl = new URL(engine.value)
    const queryText = engineUrl.origin

    let history = <{ query: string, time: number }[]>([])

    const historyItems = await searchChromeHistoryAsync(queryText, searchHistoryNum)
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
  if (!chrome || !chrome.history) {
    searchHistory.value = JSON.parse(localStorage.getItem("searchHistory") || "[]")
    watch(searchHistory, () => localStorage.setItem("searchHistory", JSON.stringify(searchHistory.value)))
    return
  }
  searchHistory.value = await getSearchHistory()
})()

const input = ref('')
const openSearch = (query: string) => {
  if (!query) return

  searchHistory.value = [query, ...searchHistory.value.filter(q => q !== query)].slice(0, 100)

  const s = searchEngines.value.find(e => e.label === searchEngine.value)
  if (!s) return
  window.location.assign(s.value + query)
}

const fetchSearchSuggestions = async (query: string): Promise<string[]> => {
  const api = new URL('https://suggestion.baidu.com/su')
  api.searchParams.set('wd', query)
  api.searchParams.set('action', 'opensearch')

  const response = await fetch(api)
  if (!response.ok) return []
  // 获取响应头中的 Content-Type
  const contentType = response.headers.get('Content-Type') || ''

  // 解析 charset
  const getCharset = (contentType: string): string => {
    const matches = contentType.match(/charset=([^;]+)/i)
    return matches ? matches[1].toLowerCase() : 'utf-8' // 默认使用 'utf-8'
  }
  const charset = getCharset(contentType)

  // 获取响应的 ArrayBuffer
  const buffer = await response.arrayBuffer()

  const decodedText = new TextDecoder(charset).decode(buffer)

  const data = JSON.parse(decodedText)
  if (!data || !data[1]) return []
  return data[1]
}

interface SuggestionItem {
  value: string
  link: string | null
}

const querySearch = async (query: string, cb: (suggestions: object[]) => void) => {
  let suggestions: SuggestionItem[] = []
  const suggestionNum = 25

  if (!query) {
    suggestions = searchHistory.value.slice(0, suggestionNum).map(item => {
      return {value: item, link: null}
    })
  } else {
    // 书签
    if (chrome && chrome.bookmarks) {
      const bookmarks = await chrome.bookmarks.search(query)
      suggestions.push(...bookmarks.map(item => {
        return {value: item.title || '', link: item.url || null}
      }).slice(0, suggestionNum - suggestions.length))
    }

    // 搜索历史
    if (suggestions.length < suggestionNum) {
      suggestions.push(...searchHistory.value.filter(q => q.includes(query)).slice(0, suggestionNum - suggestions.length).map(item => {
        return {value: item, link: null}
      }))
    }

    // Chrome 历史记录
    if (suggestions.length < suggestionNum && chrome && chrome.history) {
      const historyItems = await searchChromeHistoryAsync(query, suggestionNum - suggestions.length)
      suggestions.push(...historyItems.map(item => {
        return {value: item.title || '', link: item.url || null}
      }))
    }

    // 搜索建议
    if (suggestions.length < suggestionNum) {
      try {
        const searchSuggestions = await fetchSearchSuggestions(query)
        suggestions.push(...searchSuggestions.slice(0, suggestionNum - suggestions.length).map(item => {
          return {value: item, link: null}
        }))
      } catch (e) {
      }
    }
  }

  cb(suggestions)
}


</script>

<template>
  <el-autocomplete style="max-width: 600px" v-model="input" autofocus size="large" @keydown.enter="openSearch(input)"
                   :fetch-suggestions="querySearch" :fit-input-width="true">
    <template #prepend>
      <el-select style="width: 115px" v-model="searchEngine" size="large">
        <el-option v-for="engine in searchEngines" :key="engine.label" :label="engine.label"
                   :value="engine.label"/>
      </el-select>
    </template>
    <template #append>
      <el-button :icon="Search" @click="openSearch(input)"/>
    </template>
  </el-autocomplete>
</template>

<style scoped>

</style>
