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

const getWeatherJWTWithCache = async () => {
    const cacheKey = 'weather-jwt'
    const cachedToken = cache.get(cacheKey)
    if (cachedToken) {
        return cachedToken
    }
    const token = await generateWeatherJWT()
    cache.set(cacheKey, token, {ttl: 1000 * 600}) // 缓存10分钟
    return token
}

const fetchWeatherNow = async (location: string) => {
    const url = new URL(weatherNowUrl)
    url.searchParams.set('location', location)

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

export const fetchWeatherNowWithCache = async (location: string) => {
    const cacheKey = `weather-now-${location}`
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
        return cachedData
    }
    const data = await fetchWeatherNow(location)
    cache.set(cacheKey, data, {ttl: 1000 * 60 * 5}) // 缓存5分钟
    return data
}
