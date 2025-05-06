import {watch} from "vue";

export type Hitokoto = {
    content: string;
    from: string;
    href: string
}

export const hitokotoTypeMap: Map<string, string> = new Map([
    ['a', '动画'],
    ['b', '漫画'],
    ['c', '游戏'],
    ['d', '文学'],
    ['e', '原创'],
    ['f', '来自网络'],
    ['g', '其他'],
    ['h', '影视'],
    ['i', '诗词'],
    ['j', '网易云'],
    ['k', '哲学'],
    ['l', '抖机灵'],
]);

const bufferKey = 'hitokotoHistory';
const bufferSize = 1000;

export const hitokotoHistory = ref<Hitokoto[]>(JSON.parse(localStorage.getItem(bufferKey) || "[]"))
watch(hitokotoHistory, () => localStorage.setItem(bufferKey, JSON.stringify(hitokotoHistory.value)))

const updateHitokotoHistory = (hitokoto: Hitokoto) => {
    while (hitokotoHistory.value.length >= bufferSize) {
        hitokotoHistory.value.shift();
    }
    hitokotoHistory.value.push(hitokoto);
}

const getHitokotoFromHistoryRand = (types: string[] = []): Hitokoto | null => {
    const filteredHistory = hitokotoHistory.value.filter(hitokoto => {
        return types.length === 0 || types.includes(hitokoto.from);
    });
    if (filteredHistory.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * filteredHistory.length);
    return filteredHistory[randomIndex];
}

export async function getHitokoto(types: string[] = []): Promise<Hitokoto> {
    const url = new URL('https://v1.hitokoto.cn')
    url.searchParams.set('encoding', 'json')
    url.searchParams.set('charset', 'utf-8')
    types.forEach(type => url.searchParams.append('c', type));

    const response = await fetch(url);
    if (!response.ok) {
        const hitokoto = getHitokotoFromHistoryRand(types);
        if (hitokoto) {
            return hitokoto;
        }
        throw new Error('Failed to fetch Hitokoto');
    }
    const data = await response.json();
    const hitokoto = {
        content: data.hitokoto,
        from: data.from || data.from_who || data.creator || '一言',
        href: `https://hitokoto.cn/?uuid=${data.uuid}`
    }

    updateHitokotoHistory(hitokoto);
    return hitokoto;
}
