import {getWeatherIcon} from "@/icons/weather-icons/weatherIconsMap.ts";

const modules = import.meta.glob('./*.svg', {eager: true, import: 'default'})

const iconComponentMap: Record<string, any> = {}

// 解析文件名，建立 name=>组件 映射
Object.entries(modules).forEach(([path, mod]) => {
    // 提取 basename，不带扩展名
    const name = path.match(/\.\/(.*)\.svg$/)?.[1]
    if (name && mod) iconComponentMap[name] = mod
})

export const getWeatherIconComponent = (code: number) => {
    const name = getWeatherIcon(code)
    return iconComponentMap[name]
}
