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

const getSearchHistory = async () => {
  const searchHistoryAsync = (queryText: string): Promise<{ query: string, time: number }[]> => {
    return new Promise((resolve) => {
      let history = <{ query: string, time: number }[]>([])
      chrome.history.search({text: queryText, maxResults: searchHistoryNum}, (historyItems) => {
        const paramsKeys = ['wd', 'q', 'query', 'search', 's']

        for (const historyItem of historyItems) {
          if (!historyItem.url) continue
          const urlObj = new URL(historyItem.url)

          let query = ''

          for (const key of paramsKeys) {
            if (urlObj.searchParams.has(key)) {
              query = urlObj.searchParams.get(key) || ''
              break
            }
          }

          if (!query) continue

          history.push({
            query: query,
            time: historyItem.lastVisitTime ? historyItem.lastVisitTime : 0
          })
        }

        resolve(history)
      })
    })
  }

  let chromeSearchHistory = <{ query: string, time: number }[]>([])
  for (const engine of searchEngines.value) {
    if (!engine.value) continue
    const engineUrl = new URL(engine.value)
    const queryText = engineUrl.origin

    const history = await searchHistoryAsync(queryText)
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

const fetchSearchSuggestions = async (query: string) => {
  const api = new URL('https://suggestion.baidu.com/su')
  api.searchParams.set('wd', query)
  api.searchParams.set('action', 'opensearch')

  const response = await fetch(api)
  if (!response.ok) return
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
  if (!data || !data[1]) return
  return data[1]
}

const querySearch = async (query: string, cb: (suggestions: object[]) => void) => {
  let suggestions: string[] = []
  const suggestionNum = 8

  if (query) {
    for (const q of searchHistory.value) {
      if (q.startsWith(query)) suggestions.push(q)
      if (suggestions.length >= suggestionNum) break
    }
  } else {
    suggestions = searchHistory.value.slice(0, suggestionNum)
  }

  if (suggestions.length < suggestionNum) {
    try {
      const searchSuggestions = await fetchSearchSuggestions(query)
      if (searchSuggestions) {
        suggestions.push(...searchSuggestions.slice(0, suggestionNum - suggestions.length))
      }
    } catch (e) {
    }
  }

  let results = suggestions.map((suggestion) => {
    return {value: suggestion}
  })
  cb(results)
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
