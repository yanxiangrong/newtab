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
    return await navigator.locks.request(cacheKey, async () => {
        // 二次检查，避免队列等待期间被其他人设置过
        const cachedInsideLock = cache.get(cacheKey)
        if (cachedInsideLock) return cachedInsideLock

        const data = await fetchFunc()
        cache.set(cacheKey, data, {ttl})
        return data
    })

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
    return witchCache(() => fetchWeatherDaily(location, days), cacheKey, 1000 * 60 * 30)
}

const fetchWeatherHourly = async (location: string, hours: 24 | 72 | 168 = 24) => {
    const url = new URL(`${apiHost}/v7/weather/${hours}h`)
    url.searchParams.set('location', location)
    return fetchWeatherAPI(url)
}

export const fetchWeatherHourlyWithCache = async (location: string, hours: 24 | 72 | 168 = 24) => {
    const cacheKey = `weather-hourly-${location}-${hours}`
    return witchCache(() => fetchWeatherHourly(location, hours), cacheKey, 1000 * 60 * 15)
}

const fetchWeatherMinutely = async (location: string, minutes: 5 = 5) => {
    const url = new URL(`${apiHost}/v7/weather/${minutes}m`)
    url.searchParams.set('location', location)
    return fetchWeatherAPI(url)
}

export const fetchWeatherMinutelyWithCache = async (location: string, minutes: 5 = 5) => {
    const cacheKey = `weather-minutely-${location}-${minutes}`
    return witchCache(() => fetchWeatherMinutely(location, minutes), cacheKey, 1000 * 60 * 5)
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

const fetchGridWeatherNow = async (location: string) => {
    const url = new URL(`${apiHost}/v7/grid-weather/now`)
    url.searchParams.set('location', location)
    return fetchWeatherAPI(url)
}

export const fetchGridWeatherNowWithCache = async (location: string) => {
    const cacheKey = `grid-weather-now-${location}`
    return witchCache(() => fetchGridWeatherNow(location), cacheKey, 1000 * 60 * 5)
}

const fetchGridWeatherDaily = async (location: string, days: 3 | 7) => {
    const url = new URL(`${apiHost}/v7/grid-weather/${days}d`)
    url.searchParams.set('location', location)
    return fetchWeatherAPI(url)
}

export const fetchGridWeatherDailyWithCache = async (location: string, days: 3 | 7) => {
    const cacheKey = `grid-weather-daily-${location}-${days}`
    return witchCache(() => fetchGridWeatherDaily(location, days), cacheKey, 1000 * 60 * 30)
}

const fetchGridWeatherHourly = async (location: string, hours: 24 | 72) => {
    const url = new URL(`${apiHost}/v7/grid-weather/${hours}h`)
    url.searchParams.set('location', location)
    return fetchWeatherAPI(url)
}

export const fetchGridWeatherHourlyWithCache = async (location: string, hours: 24 | 72) => {
    const cacheKey = `grid-weather-hourly-${location}-${hours}`
    return witchCache(() => fetchGridWeatherHourly(location, hours), cacheKey, 1000 * 60 * 30)
}

const fetchWarningNow = async (location: string) => {
    const url = new URL(`${apiHost}/v7/warning/now`)
    url.searchParams.set('location', location)
    return fetchWeatherAPI(url)
}

export const fetchWarningNowWithCache = async (location: string) => {
    const cacheKey = `warning-now-${location}`
    return witchCache(() => fetchWarningNow(location), cacheKey, 1000 * 60 * 5)
}

const fetchHistoricalWeather = async (location: string, date: string) => {
    const url = new URL(`${apiHost}/v7/historical/weather`)
    url.searchParams.set('location', location)
    url.searchParams.set('date', date)
    return fetchWeatherAPI(url)
}

export const fetchHistoricalWeatherWithCache = async (location: string, date: string) => {
    const cacheKey = `historical-weather-${location}-${date}`
    return witchCache(() => fetchHistoricalWeather(location, date), cacheKey, 1000 * 60 * 60)
}

const fetchIndicesDaily = async (location: string, days: 1 | 3 = 1) => {
    const url = new URL(`${apiHost}/v7/indices/${days}d`)
    url.searchParams.set('location', location)
    return fetchWeatherAPI(url)
}

export const fetchIndicesDailyWithCache = async (location: string, days: 1 | 3 = 1) => {
    const cacheKey = `indices-daily-${location}-${days}`
    return witchCache(() => fetchIndicesDaily(location, days), cacheKey, 1000 * 60 * 30)
}

const fetchAirNow = async (latitude: number, longitude: number) => {
    const url = new URL(`${apiHost}/airquality/v1/current/${latitude}/${longitude}`)
    return fetchWeatherAPI(url)
}

export const fetchAirNowWithCache = async (latitude: number, longitude: number) => {
    const cacheKey = `air-now-${latitude}-${longitude}`
    return witchCache(() => fetchAirNow(latitude, longitude), cacheKey, 1000 * 60 * 15)
}

const fetchAirDaily = async (latitude: number, longitude: number) => {
    const url = new URL(`${apiHost}/airquality/v1/daily/${latitude}/${longitude}`)
    return fetchWeatherAPI(url)
}

export const fetchAirDailyWithCache = async (latitude: number, longitude: number) => {
    const cacheKey = `air-daily-${latitude}-${longitude}`
    return witchCache(() => fetchAirDaily(latitude, longitude), cacheKey, 1000 * 60 * 30)
}

const fetchAirHourly = async (latitude: number, longitude: number) => {
    const url = new URL(`${apiHost}/airquality/v1/hourly/${latitude}/${longitude}`)
    return fetchWeatherAPI(url)
}

export const fetchAirHourlyWithCache = async (latitude: number, longitude: number) => {
    const cacheKey = `air-hourly-${latitude}-${longitude}`
    return witchCache(() => fetchAirHourly(latitude, longitude), cacheKey, 1000 * 60 * 30)
}

const fetchStormList = async (year: number = new Date().getFullYear(), basin: 'AL' | 'EP' | 'NP' | 'SP' | 'NI' | 'SI' = 'NP') => {
    const url = new URL(`${apiHost}/v7/tropical/storm-list`)
    url.searchParams.set('basin', basin)
    return fetchWeatherAPI(url)
}

export const fetchStormListWithCache = async (year: number = new Date().getFullYear(), basin: 'AL' | 'EP' | 'NP' | 'SP' | 'NI' | 'SI' = 'NP') => {
    const cacheKey = `storm-list-${year}-${basin}`
    return witchCache(() => fetchStormList(year, basin), cacheKey, 1000 * 60 * 15)
}

const fetchStormTrack = async (stormId: string) => {
    const url = new URL(`${apiHost}/v7/tropical/storm-track`)
    url.searchParams.set('stormId', stormId)
    return fetchWeatherAPI(url)
}

export const fetchStormTrackWithCache = async (stormId: string) => {
    const cacheKey = `storm-track-${stormId}`
    return witchCache(() => fetchStormTrack(stormId), cacheKey, 1000 * 60 * 15)
}

const fetchStormForecast = async (stormId: string) => {
    const url = new URL(`${apiHost}/v7/tropical/storm-forecast`)
    url.searchParams.set('stormId', stormId)
    return fetchWeatherAPI(url)
}

export const fetchStormForecastWithCache = async (stormId: string) => {
    const cacheKey = `storm-forecast-${stormId}`
    return witchCache(() => fetchStormForecast(stormId), cacheKey, 1000 * 60 * 15)
}

const fetchSolar = async (location: string, hours: 24 | 72 = 24) => {
    const url = new URL(`${apiHost}/v7/solar-radiation/${hours}h`)
    url.searchParams.set('location', location)
    return fetchWeatherAPI(url)
}

export const fetchSolarWithCache = async (location: string, hours: 24 | 72 = 24) => {
    const cacheKey = `solar-${location}-${hours}`
    return witchCache(() => fetchSolar(location, hours), cacheKey, 1000 * 60 * 60)
}

const fetchAstronomySun = async (location: string, date: string) => {
    const url = new URL(`${apiHost}/v7/astronomy/sun`)
    url.searchParams.set('location', location)
    url.searchParams.set('date', date)
    return fetchWeatherAPI(url)
}

export const fetchAstronomySunWithCache = async (location: string, date: string) => {
    const cacheKey = `astronomy-sun-${location}-${date}`
    return witchCache(() => fetchAstronomySun(location, date), cacheKey, 1000 * 60 * 60)
}

const fetchAstronomyMoon = async (location: string, date: string) => {
    const url = new URL(`${apiHost}/v7/astronomy/moon`)
    url.searchParams.set('location', location)
    url.searchParams.set('date', date)
    return fetchWeatherAPI(url)
}

export const fetchAstronomyMoonWithCache = async (location: string, date: string) => {
    const cacheKey = `astronomy-moon-${location}-${date}`
    return witchCache(() => fetchAstronomyMoon(location, date), cacheKey, 1000 * 60 * 60)
}

const fetchAstronomySolarAngle = async (location: string, date: string, time: string, tz: string, alt: number) => {
    const url = new URL(`${apiHost}/v7/astronomy/solar-elevation-angle`)
    url.searchParams.set('location', location)
    url.searchParams.set('date', date)
    url.searchParams.set('time', time)
    url.searchParams.set('tz', tz)
    url.searchParams.set('alt', alt.toString())
    return fetchWeatherAPI(url)
}

export const fetchAstronomySolarAngleWithCache = async (location: string, date: string, time: string, tz: string, alt: number) => {
    const cacheKey = `astronomy-solar-angle-${location}-${date}-${time}-${tz}-${alt}`
    return witchCache(() => fetchAstronomySolarAngle(location, date, time, tz, alt), cacheKey, 1000 * 60 * 60)
}
