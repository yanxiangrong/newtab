import {defineStore} from "pinia";
import type {BookmarkNode} from "@/utils/bookmarkParser.ts";

export const useConfigStore = defineStore('config', {
    state: () => ({
        searchEngine: 'Google',
        showBookmark: true,
        showSearch: true,
        showBackgroundImage: true,
        backgroundImageUrl: 'https://bing.ee123.net/img',
        searchEngines: [
            {label: 'Google', value: 'https://www.google.com/search?q='},
            {label: '百度', value: 'https://www.baidu.com/s?wd='},
            {label: '必应', value: 'https://cn.bing.com/search?q='},
            {label: '搜狗', value: 'https://www.sogou.com/web?query='},
            {label: '360', value: 'https://www.so.com/s?q='},
            {label: 'DuckDuckGo', value: 'https://duckduckgo.com/?q='},
        ],
        suggestionCount: 25,
        fontFamily: 'initial',
        showTopSites: true,
        theme: 'auto',
        showTime: true,
        showHitokoto: true,
        hitokotoClass: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'],
        showWeather: true
    })
})


export const useLocalConfigStore = defineStore('localConfig', {
    state: () => ({
        bookmarks: [] as Array<BookmarkNode>,
    }),
})
