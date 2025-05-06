import {isChromeExtension} from "@/utils/utils.ts";

export const fetchSearchSuggestions = async (query: string): Promise<string[]> => {
    if (isChromeExtension()) {
        return fetchSearchSuggestionsFetch(query)
    } else {
        return fetchSearchSuggestionsJsonp(query)
    }
}

const fetchSearchSuggestionsJsonp = async (query: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        const cbName = 'jsonp_cb_' + Math.random().toString(36).substring(2)
        ;(window as any)[cbName] = (data: any) => {
            // 结果在 data.s，是数组
            resolve(data.s)
            // 清理
            delete (window as any)[cbName]
            document.body.removeChild(script)
        }
        const script = document.createElement('script')
        script.onerror = () => {
            reject(new Error('JSONP request failed'))
            delete (window as any)[cbName]
            document.body.removeChild(script)
        }
        script.src = `https://suggestion.baidu.com/su?wd=${encodeURIComponent(query)}&cb=${cbName}`
        document.body.appendChild(script)
        // 可选超时
        // setTimeout(() => { ...reject...清理... }, 5000)
    })
}

const fetchSearchSuggestionsFetch = async (query: string): Promise<string[]> => {
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
