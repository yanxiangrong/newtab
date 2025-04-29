export type BookmarkNode = {
    title: string;
    url?: string;
    children?: BookmarkNode[];
};

// 解析1个DL（即文件夹/ext list）
function parseDL(dl: HTMLDListElement): BookmarkNode[] {
    const result: BookmarkNode[] = [];

    for (const node of Array.from(dl.children)) {
        if (node.tagName === 'DT') {
            const dt = node as HTMLElement;
            const firstChild = dt.firstElementChild;
            if (firstChild && firstChild.tagName === 'H3') {
                // 文件夹
                const folder: BookmarkNode = {
                    title: firstChild.textContent || '未命名文件夹',
                    children: []
                };
                folder.children = parseDL(dt as HTMLDListElement);
                result.push(folder);
            } else if (firstChild && firstChild.tagName === 'A') {
                // 普通书签
                result.push({
                    title: firstChild.textContent || '',
                    url: (firstChild as HTMLAnchorElement).href
                });
            }
        } else if (node.tagName === 'DL') {
            // 递归解析子DL
            const subDL = node as HTMLDListElement;
            const subNodes = parseDL(subDL);
            result.push(...subNodes);
        }
    }
    return result;
}

// 主体调用
export function parseBookmarksHtml(html: string): BookmarkNode[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const rootDL = doc.querySelector('DL');
    if (!rootDL) return [];
    return parseDL(rootDL as HTMLDListElement);
}

// 递归将BookmarkNode生成为书签HTML（树结构）
function genDL(nodes: BookmarkNode[]): string {
    return `<DL><p>
${nodes.map(node => {
        if (node.children && node.children.length > 0) {
            return `<DT><H3>${node.title}</H3>
${genDL(node.children)}`;
        }
        if (node.url) {
            return `<DT><A HREF="${node.url}">${node.title}</A>`;
        }
        return '';
    }).join('\n')}
</DL><p>`;
}

export function genBookmarkHtml(nodes: BookmarkNode[]): string {
    return `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!--This is an automatically generated file.-->
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
${genDL(nodes)}
`.trim();
}

export function bookmarkNodeToChromeTree(
    nodes: BookmarkNode[],
    parentId = '0' // 根节点id
): chrome.bookmarks.BookmarkTreeNode[] {
    return nodes.map((node, idx) => {
        const id = 'custom_' + Math.random().toString(36).slice(2); // 生成个id
        const res: chrome.bookmarks.BookmarkTreeNode = {
            id,
            parentId,
            title: node.title,
            index: idx,
            dateAdded: Date.now(),
            dateGroupModified: node.children ? Date.now() : undefined,
            url: node.url,
            children: node.children
                ? bookmarkNodeToChromeTree(node.children, id)
                : undefined,
            unmodifiable: undefined,
            syncing: false // 随便给个默认
        };
        return res;
    });
}

export function countBookmarks(nodes: BookmarkNode[]): number {
    let total = 0;
    for (const node of nodes) {
        if (node.url) {
            total++;
        }
        if (node.children) {
            total += countBookmarks(node.children);
        }
    }
    return total;
}
