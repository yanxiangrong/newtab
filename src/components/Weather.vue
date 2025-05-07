<script lang="ts" setup>
import {useConfigStore} from "@/stores/configStore.ts";
import {storeToRefs} from "pinia";
import {fetchWeatherNowWithCache} from "@/api/weather.ts";
import {type Position, positionToString} from "@/utils/position.ts";
import {getWeatherIcon} from "@/utils/weatherIconMap.ts";
import {getLocation} from "@/api/baiduLocation.ts";

const configStore = useConfigStore()
const {showWeather, useBrowserLocation} = storeToRefs(configStore)

const position = ref<Position | null>(null)
const positionBrowser = ref<Position | null>(null)

const weatherText = ref('')
const temperature = ref('')
const weatherIcon = ref('')

const updatePosition = async () => {
  if (!showWeather.value) {
    return
  }
  if (navigator.geolocation && useBrowserLocation.value) {
    navigator.geolocation.getCurrentPosition((p) => {
      positionBrowser.value = {
        lat: p.coords.latitude,
        lng: p.coords.longitude
      }
      console.log('Current position (browser):', positionToString(positionBrowser.value))
    }, (error) => {
      console.error('Error getting location:', error)
    })
  } else {
    try {
      const p = await getLocation()
      position.value = {
        lat: p.content.point.y,
        lng: p.content.point.x
      }
      console.log('Current position (Baidu):', positionToString(position.value))
    } catch (err) {
      console.error('Error getting location:', err)
    }
  }
}

onMounted(() => {
  watch([showWeather, useBrowserLocation], updatePosition, {immediate: true})
})


const updateWeather = async () => {
  if (!showWeather.value || !position.value) {
    return
  }
  const data = await fetchWeatherNowWithCache(positionToString(position.value))
  weatherText.value = data.now.text
  temperature.value = data.now.temp
  weatherIcon.value = data.now.icon
}

watch(position, updateWeather, {immediate: true})


</script>

<template>
  <el-popover
      placement="right-start"
      trigger="hover">
    <template #reference>
      <div class="weather-wrap">
        <div class="weather-icon">
          <SvgIcon :name="getWeatherIcon(Number(weatherIcon))" prefix="icon-weather"/>
        </div>
        <div class="weather-info">
          <div class="temperature">{{ temperature }}<span v-if="temperature" class="degree">℃</span></div>
          <div class="weather-text">{{ weatherText || '获取中...' }}</div>
        </div>
      </div>
    </template>
    <weather-details :position="position"/>
  </el-popover>
</template>

<style scoped>
.weather-wrap {
  display: flex;
  align-items: center;
  font-size: var(--el-font-size-base);
  line-height: 1;
}

.weather-icon {
  width: 5em;
  height: 5em;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.weather-icon :deep(svg), .weather-icon svg {
  width: 100%;
  height: 100%;
}

.weather-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--el-text-color-primary);
}

.temperature {
  font-size: 1.5em;
  font-weight: bold;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.15);
}

.degree {
  font-size: 0.75em;
  vertical-align: super;
  margin-left: 2px;
}

.weather-text {
  margin-top: 4px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>
