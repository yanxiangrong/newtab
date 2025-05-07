<script lang="ts" setup>
import {fetchCityLookupWithCache, fetchWeatherNowWithCache} from "@/api/weather.ts";
import {type Position, positionToString} from "@/utils/position.ts";

const props = defineProps<{
  position: Position | null
}>()

type Weather = {
  locationName: string
  fxLink: string
}

const weather = ref<Weather>()

const updateWeather = async () => {
  if (!props.position) {
    return
  }
  const location = positionToString(props.position)

  let newWeather: Weather = {
    locationName: '',
    fxLink: ''
  }

  try {
    const fetchCiteRes = await fetchCityLookupWithCache(location)
    newWeather.locationName = fetchCiteRes.location[0].name
  } catch (error) {
    console.error('Error fetching weather data:', error)
  }

  try {
    const fetchWeatherRes = await fetchWeatherNowWithCache(location)
    newWeather.fxLink = fetchWeatherRes.fxLink
  } catch (error) {
    console.error('Error fetching weather data:', error)
  }

  weather.value = newWeather
}

watch(() => props.position, updateWeather, {immediate: true})
</script>

<template>
  <el-row>
    <!-- 详细天气 -->
    <el-col :span="12">
      <span>{{ weather?.locationName }}</span>
    </el-col>
    <!-- 分钟级降雨 -->
    <el-col :span="12">
    </el-col>
    <!-- 小时天气 -->
    <el-col :span="12">
    </el-col>
    <!-- 每日天气 -->
    <el-col :span="12">
    </el-col>
  </el-row>
  <el-link :href="weather?.fxLink" target="_blank">更多信息</el-link>
</template>

<style scoped>

</style>
