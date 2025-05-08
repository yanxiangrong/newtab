<script lang="ts" setup>
import {useConfigStore} from "@/stores/configStore.ts";
import {storeToRefs} from "pinia";
import {fetchWeatherNowWithCache} from "@/api/weather.ts";
import {type Position, positionToString} from "@/utils/position.ts";
import {getLocation} from "@/api/baiduLocation.ts";

const configStore = useConfigStore()
const {showWeather, locationSetting} = storeToRefs(configStore)

const position = ref<Position | null>(null)

const weatherText = ref('')
const temperature = ref('')
const weatherIconCode = ref(0)

const updatePosition = async () => {
  if (!showWeather.value) {
    return
  }
  if (navigator.geolocation && locationSetting.value == 'browser') {
    navigator.geolocation.getCurrentPosition((p) => {
      position.value = {
        lat: p.coords.latitude,
        lng: p.coords.longitude
      }
      console.log('Current position (browser):', positionToString(position.value))
    }, (error) => {
      console.error('Error getting location:', error)
    })
  } else if (locationSetting.value == 'ip') {
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

watch([showWeather, locationSetting], updatePosition, {immediate: true})


const updateWeather = async () => {
  if (!showWeather.value || !position.value) {
    return
  }
  const data = await fetchWeatherNowWithCache(positionToString(position.value))
  weatherText.value = data.now.text
  temperature.value = data.now.temp
  weatherIconCode.value = Number(data.now.icon)
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
          <weather-icon :code="weatherIconCode"/>
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
