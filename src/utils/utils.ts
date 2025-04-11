export const faviconURL = (u: string) => {
    const parsedUrl = new URL(u);
    let faviconUrl: URL
    if (chrome.runtime && chrome.runtime.getURL) {
        faviconUrl = new URL(chrome.runtime.getURL("/_favicon/"));
        faviconUrl.searchParams.set("pageUrl", `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`);
        faviconUrl.searchParams.set("size", "16");
    } else {
        faviconUrl = new URL("https://www.google.com/s2/favicons")
        faviconUrl.searchParams.set("domain", parsedUrl.host)
        faviconUrl.searchParams.set("sz", "16")
    }
    return faviconUrl.toString();
}
