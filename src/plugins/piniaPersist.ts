import type {PiniaPluginContext} from 'pinia'

export const piniaPersist = (context: PiniaPluginContext) => {
    if (chrome.storage) {
        chrome.storage.sync.get(context.store.$id).then((data) => {
            console.log('chrome.storage.sync.get', data)
            if (data[context.store.$id]) {
                context.store.$patch(JSON.parse(data[context.store.$id]))
            }
        })

        context.store.$subscribe((mutation, state) => {
            console.log('chrome.storage.sync.set',  mutation, state)
            chrome.storage.sync.set({[context.store.$id]: JSON.stringify(state)}).then(() => {
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
    }
}
