import * as ed from '@noble/ed25519';
import {LRUCache} from 'lru-cache'
import {encodeURL, fromUint8Array} from 'js-base64';


const apiHost = 'https://mw3h2dygar.re.qweatherapi.com'

const weatherNowUrl = `${apiHost}/v7/weather/now`

const hexStr = '61E37FB0261B5373497EE223AEC4282813EAE8A2B61812B6052BA13DD69CD282'
const keyId = 'CHB3UHA3DK'
const projectId = '4AE3QB8WNC'

const cache = new LRUCache({
    max: 100,            // 最多缓存 100 条
    ttl: 1000 * 60 * 5   // TTL，单位毫秒，这里是5分钟
});


const generateWeatherJWT = async (): Promise<string> => {
    const unixSeconds = Math.floor(Date.now() / 1000)
    const header = {
        alg: "EdDSA",
        kid: keyId,
        typ: "JWT",
    }
    const payload = {
        sub: projectId,
        iat: unixSeconds - 30,
        exp: unixSeconds + 900,
    }
    const privateKey = ed.etc.hexToBytes(hexStr)

    const signingInput = `${encodeURL(JSON.stringify(header))}.${encodeURL(JSON.stringify(payload))}`;
    const message = new TextEncoder().encode(signingInput)
    const signature = await ed.signAsync(message, privateKey)

    const signatureBase64 = fromUint8Array(signature, true)
    return `${signingInput}.${signatureBase64}`
}

const witchCache = async (fetchFunc: () => Promise<any>, cacheKey: string, ttl: number) => {
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
        return cachedData
    }
    const data = await fetchFunc()
    cache.set(cacheKey, data, {ttl})
    return data
}

const getWeatherJWTWithCache = async () => {
    return witchCache(generateWeatherJWT, 'weather-jwt', 1000 * 600)
}

const fetchWeatherAPI = async (url: URL) => {
    const token = await getWeatherJWTWithCache()
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    const data = await response.json();
    if (data.code !== '200') {
        throw new Error('Failed to fetch weather data');
    }
    return data
}

const fetchWeatherNow = async (location: string) => {
    const url = new URL(weatherNowUrl)
    url.searchParams.set('location', location)
    return fetchWeatherAPI(url)
}

export const fetchWeatherNowWithCache = async (location: string) => {
    const cacheKey = `weather-now-${location}`
    return witchCache(() => fetchWeatherNow(location), cacheKey, 1000 * 60 * 5)
}

const fetchWeatherDaily = async (location: string, days: 3 | 7 | 10 | 15 | 30 = 7) => {
    const url = new URL(`${apiHost}/v7/weather/${days}d`)
    url.searchParams.set('location', location)
    return fetchWeatherAPI(url)
}

export const fetchWeatherDailyWithCache = async (location: string, days: 3 | 7 | 10 | 15 | 30 = 7) => {
    const cacheKey = `weather-daily-${location}-${days}`
    return witchCache(() => fetchWeatherDaily(location, days), cacheKey, 1000 * 60 * 5)
}

const fetchWeatherHourly = async (location: string, hours: 24 | 72 | 168 = 24) => {
    const url = new URL(`${apiHost}/v7/weather/${hours}h`)
    url.searchParams.set('location', location)
    return fetchWeatherAPI(url)
}

export const fetchWeatherHourlyWithCache = async (location: string, hours: 24 | 72 | 168 = 24) => {
    const cacheKey = `weather-hourly-${location}-${hours}`
    return witchCache(() => fetchWeatherHourly(location, hours), cacheKey, 1000 * 60 * 5)
}

const fetchWeatherMinutely = async (location: string, minutes: 5 = 5) => {
    const url = new URL(`${apiHost}/v7/weather/${minutes}m`)
    url.searchParams.set('location', location)
    return fetchWeatherAPI(url)
}

export const fetchWeatherMinutelyWithCache = async (location: string, minutes: 5 = 5) => {
    const cacheKey = `weather-minutely-${location}-${minutes}`
    return witchCache(() => fetchWeatherMinutely(location, minutes), cacheKey, 1000 * 60)
}

const fetchCityLookup = async (location: string) => {
    const url = new URL(`${apiHost}/geo/v2/city/lookup`)
    url.searchParams.set('location', location)
    return fetchWeatherAPI(url)
}

export const fetchCityLookupWithCache = async (location: string) => {
    const cacheKey = `city-lookup-${location}`
    return witchCache(() => fetchCityLookup(location), cacheKey, 1000 * 3600 * 24)
}
