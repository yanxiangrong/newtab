<script lang="ts" setup>
import DrizzleIcon from '@/assets/weather-icons/drizzle.svg'
import {useConfigStore} from "@/stores/configStore.ts";
import {storeToRefs} from "pinia";
import {fetchWeatherNowWithCache} from "@/api/weather.ts";
import {type Position, positionToString} from "@/utils/position.ts";

const configStore = useConfigStore()
const {showWeather} = storeToRefs(configStore)

const position = ref<Position | null>(null)

const weatherText = ref('')
const temperature = ref('')
const weatherIcon = ref('')

const updatePosition = () => {
  if (!showWeather.value) {
    return
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((p) => {
      position.value = {
        lat: p.coords.latitude,
        lng: p.coords.longitude
      }
      console.log('Current position:', positionToString(position.value))
    }, (error) => {
      console.error('Error getting location:', error)
    })
  } else {
    console.error('Geolocation is not supported by this browser.')
  }
}

watch(showWeather, updatePosition, {immediate: true})

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
  天气
  <DrizzleIcon/>
  {{ weatherText }}
  {{ temperature }}
  {{ weatherIcon }}
</template>

<style scoped>

</style>
