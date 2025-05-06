import {importPKCS8, SignJWT} from "jose";

const apiHost = 'https://mw3h2dygar.re.qweatherapi.com'

const weatherNowUrl = `${apiHost}/v7/weather/now`

const pemKey = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIFwnuBUL5GOU36SIfw+q8zx+TFGSWsU8niuLDtSkQBpO
-----END PRIVATE KEY-----`

const generateWeatherJWT = async (): Promise<string> => {
    const unixSeconds = Math.floor(Date.now() / 1000)
    const header = {
        alg: "ES256",
        kid: "TKB32GG52H"
    }
    const payload = {
        sub: "TKB32GG52H",
        iat: unixSeconds,
        exp: unixSeconds + 600,
    }
    const privateKey = await importPKCS8(pemKey, header.alg)

    return await new SignJWT(payload)
        .setProtectedHeader(header)
        .sign(privateKey)
}

export const fetchWeatherNow = async (location: string) => {
    const url = new URL(weatherNowUrl)
    url.searchParams.set('location', location)

    const token = await generateWeatherJWT()

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
