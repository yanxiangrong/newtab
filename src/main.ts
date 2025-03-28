import './assets/main.css'

import {createApp} from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import router from './router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import {piniaPersist} from "@/plugins/piniaPersist.ts";

const pinia = createPinia()
pinia.use(piniaPersist)

const app = createApp(App)

app.use(ElementPlus, {
    locale: zhCn
})
app.use(router)
app.use(pinia)

app.mount('#app')
