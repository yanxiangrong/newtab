import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import svgLoader from 'vite-svg-loader'


// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        AutoImport({
            imports: [
                'vue',
                'vue-router',
                'pinia'
            ],
            resolvers: [
                ElementPlusResolver(),
                IconsResolver({
                    prefix: 'Icon',
                })
            ],
            dts: 'src/auto-imports.d.ts',
            eslintrc: {
                enabled: true
            },
        }),
        Components({
            resolvers: [
                IconsResolver({
                    enabledCollections: ['ep'],
                }),
                ElementPlusResolver()
            ],
            dts: 'src/components.d.ts',
        }),
        Icons({
            autoInstall: true,
        }),
        svgLoader(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
})
