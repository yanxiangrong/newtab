<script setup lang="ts">
import {RouterView} from 'vue-router'
import {useDark, usePreferredDark} from "@vueuse/core";
import {watch} from "vue";
import {useConfigStore} from "@/stores/configStore.ts";
import {storeToRefs} from "pinia";

const preferredDark = usePreferredDark()
const toggleDark = useDark()

const configStore = useConfigStore()
const {theme} = storeToRefs(configStore)
watch(theme, (newTheme) => {
  if (newTheme === 'auto') {
    toggleDark.value = preferredDark.value
  } else toggleDark.value = newTheme === 'dark';
})

</script>

<template>
  <RouterView/>
</template>

<style>
</style>
