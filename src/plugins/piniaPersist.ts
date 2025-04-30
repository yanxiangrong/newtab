import type {PiniaPluginContext} from 'pinia'
import {isChromeStorageAvailable} from "@/utils/utils.ts";

export const piniaPersist = (context: PiniaPluginContext) => {
    if (isChromeStorageAvailable()) {
        let storage: chrome.storage.StorageArea = chrome.storage.local
        if (context.store.$id === 'config') {
            storage = chrome.storage.sync
        }
        storage.get(context.store.$id).then((data) => {
            console.log('storage.get', data)
            if (data[context.store.$id]) {
                context.store.$patch(JSON.parse(data[context.store.$id]))
            }
        })

        context.store.$subscribe((mutation, state) => {
            console.log('storage.set', mutation, state)
            storage.set({[context.store.$id]: JSON.stringify(state)}).then(() => {
            })
        })
    } else {
        const fromStorage = localStorage.getItem(context.store.$id)
        console.log('localStorage.get', fromStorage)
        if (fromStorage) {
            context.store.$patch(JSON.parse(fromStorage))
        }
        context.store.$subscribe((mutation, state) => {
            console.log('localStorage.set', mutation, state)
            localStorage.setItem(context.store.$id, JSON.stringify(state))
        })
        console.log('chrome.storage not available, using localStorage')
    }
}
