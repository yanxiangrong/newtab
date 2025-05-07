import {LRUCache} from 'lru-cache'

const ak = 'oUVh9oB6WvMqv3E5ey3WWwgZGY1QlJ5j'
const url = 'https://api.map.baidu.com/location/ip'
const cache = new LRUCache({
    max: 100,            // 最多缓存 100 条
    ttl: 1000 * 60 * 5   // TTL，单位毫秒，这里是5分钟
});

export const getLocation = async () => {
    const cacheKey = 'baiduLocation'
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
        return cachedData
    }
    const response = await fetch(`${url}?ak=${ak}&coor=gcj02`)
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    const data = await response.json()
    if (data.status !== 0) {
        throw new Error('Error fetching location data')
    }
    cache.set(cacheKey, data)
    return data
}
