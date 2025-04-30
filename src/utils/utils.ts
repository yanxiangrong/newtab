export const faviconURL = (u: string, size: number = 16) => {
    const parsedUrl = new URL(u);
    let faviconUrl: URL
    if (chrome.runtime && chrome.runtime.getURL) {
        faviconUrl = new URL(chrome.runtime.getURL("/_favicon/"));
        faviconUrl.searchParams.set("pageUrl", `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`);
        faviconUrl.searchParams.set("size", size.toString());
    } else {
        faviconUrl = new URL("https://www.google.com/s2/favicons")
        faviconUrl.searchParams.set("domain", parsedUrl.host)
        faviconUrl.searchParams.set("sz",size.toString())
    }
    return faviconUrl.toString();
}

export function isChromeExtension(): boolean {
    return typeof chrome !== 'undefined' && !!chrome.runtime?.id
}

export function isChromeBookmarkAvailable(): boolean {
    return typeof chrome !== 'undefined' && !!chrome.bookmarks
}

export function isChromeStorageAvailable(): boolean {
    return typeof chrome !== 'undefined' && !!chrome.storage
}
