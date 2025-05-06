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

export async function getHitokoto(types: string[] = []): Promise<Hitokoto> {
    const url = new URL('https://v1.hitokoto.cn')
    url.searchParams.set('encoding', 'json')
    url.searchParams.set('charset', 'utf-8')
    types.forEach(type => url.searchParams.append('c', type));

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch Hitokoto');
    }
    const data = await response.json();
    return {
        content: data.hitokoto,
        from: data.from || data.from_who || data.creator || '一言',
        href: `https://hitokoto.cn/?uuid=${data.uuid}`
    }
}
