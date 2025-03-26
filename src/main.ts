import './assets/main.css'

import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import router from './router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'


const app = createApp(App)

app.use(ElementPlus, {
    locale: zhCn
})
app.use(router)

app.mount('#app')
