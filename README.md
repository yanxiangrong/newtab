# New Tab Extension

## 项目概述

该项目是一个基于 Vue 3、TypeScript 开发的 Chrome 新标签页扩展。项目提供了书签栏、搜索栏、背景图片及字体自定义等功能，帮助用户快速访问常用网站和进行网络搜索，同时可定制页面外观。

## 特性

- 书签栏：显示 Chrome 书签，支持文件夹结构浏览。
- 搜索栏：
  - 支持多种搜索引擎切换
  - 提供搜索建议（来自浏览历史、书签及网络接口）
  - 管理搜索引擎及建议数量设置
- 背景图片：自定义新标签页背景图片（支持模糊效果和切换）。
- 字体自定义：可设置页面字体，实时更新预览。
- 设置面板：通过配置界面管理各项设置。

## 技术栈

- Vue 3
- TypeScript
- Pinia
- Element Plus
- \@vueuse/core
- Vite

## 项目结构

- `src/`：项目源码
  - `App.vue`：入口组件，路由视图容器
  - `components/`：各个功能组件
    - `SearchBar.vue`：搜索栏组件，支持自动完成与搜索建议
    - `BookmarksBar.vue`：书签栏组件，使用书签树进行展示
    - `BookmarksTree.vue`：书签树组件，递归展示书签文件夹和链接
    - `SettingPanel.vue`：设置面板组件，用于管理各项配置
  - `views/`：页面视图
    - `HomeView.vue`：新标签页主视图
  - `stores/`：使用 Pinia 管控的状态管理
    - `configStore.ts`：配置相关状态管理
  - `utils/`：工具函数，如获取网站 favicon
- `public/`：公共资源文件
  - `manifest.json`：Chrome 扩展配置文件
  - `popup.html`：扩展弹出页页面
- `tsconfig*`：TypeScript 配置文件
- `.gitignore`：忽略不需要追踪的文件

## 安装与使用

### 环境要求

- Node.js
- npm 或 pnpm

### 安装步骤

1. 克隆仓库：

   ```bash
   git clone <repository-url>
   ```

2. 安装依赖：

   ```bash
   pnpm install
   ```

### 开发调试

启动开发服务器：

```bash
npm run dev
```

### 构建

构建扩展：

```bash
npm run build
```

## 加载 Chrome 扩展

1. 打开 Chrome，访问 `chrome://extensions/`。
2. 开启 “开发者模式”。
3. 点击 “加载已解压的扩展程序”，选择构建后的 `dist` 目录。

## 其他说明

- 部分功能依赖 Chrome 扩展 API（如书签、历史记录等），仅在 Chrome 环境下有效。
- 浏览器兼容性和权限配置请参考 `public/manifest.json` 文件。
