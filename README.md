<h1 align="center">vodtv VitePress Theme</h1>

<p align="center">
  <strong>🎨 现代、优雅、可定制的 VitePress 文档主题</strong>
</p>

<p align="center">
  轻松打造高颜值、多语言、组件丰富的技术文档站点
</p>

<p align="center">
  <a href="https://vodtv.github.io/vodtv/" target="_blank">📖 在线文档</a> ·
  <a href="https://github.com/vodtv/vodtv" target="_blank">🏠 GitHub</a> ·
  <a href="https://www.vodtv.cn" target="_blank">🌐 官网</a>
</p>

<p align="center">
  <strong>中文</strong> · <a href="./README.en.md">English</a>
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green.svg" />
  <img alt="VitePress" src="https://img.shields.io/badge/VitePress-1.x-3b82f6" />
  <img alt="Node" src="https://img.shields.io/badge/Node-18%2B-333" />
  <img alt="PNPM" src="https://img.shields.io/badge/PNPM-9-ffa500" />
  <img alt="Stars" src="https://img.shields.io/github/stars/vodtv/vodtv?style=social" />
</p>

---

## ✨ 特性亮点

- 🚀 **开箱即用**：一行命令安装，零配置快速上手
- 🎨 **现代设计**：优雅的 UI，支持亮/暗色主题
- 🌍 **多语言**：完整的 i18n 支持与语言跳转页
- 📚 **多种布局**：Home / Doc / Page / Sponsor / Changelog / Jump
- 🔍 **本地搜索**：内置搜索与优雅降级
- 🧩 **丰富组件**：自定义容器、代码组、Badge、Mermaid 等
- ⚡ **高性能**：基于 VitePress 1.x 与按需构建

---

## 🧱 Monorepo 结构

本仓库为 Monorepo：

```
vitepress-monorepo/
├─ packages/
│  ├─ theme/     # 主题源码（发布包）
│  └─ docs/      # 文档站点（演示与说明）
├─ .github/workflows/deploy-docs.yml  # 自动部署文档到 GitHub Pages
└─ README.md
```

> 文档站点默认部署到 `https://vodtv.github.io/vodtv/`。

---

## 🚀 快速开始（在你的项目中使用主题）

### 1. 安装主题

```bash
# 使用 pnpm
pnpm add @vodtv/vodtv

# 或 npm / yarn
npm i @vodtv/vodtv
# yarn add @vodtv/vodtv
```

### 2. 启用主题

```ts
// .vitepress/theme/index.ts
import theme from '@vodtv/theme'
import '@vodtv/theme/dist/index.css'

export default {
  extends: theme
}
```

### 3. 最小化配置（推荐）
会自动注入 `vite.ssr.noExternal`、`optimizeDeps.exclude`，并启用 Mermaid 运行时渲染（基于 `vitepress-mermaid-renderer`，GPL-3.0-only）。

```ts
// .vitepress/config.mts
import { withvodtvTheme } from '@vodtv/vodtv/config'

export default withvodtvTheme({
  // 你的配置...
})
```

### 4. 首页示例

```md
---
layout: home
hero:
  name: My Project
  text: Modern VitePress Theme
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
features:
  - icon: ⚡
    title: Fast
    details: Built on VitePress
---
```

---

## 🧭 文档开发（本仓库）

```bash
# 开发文档站点
pnpm dev

# 构建所有包（主题与文档）
pnpm build

# 仅构建文档
pnpm build:docs

# 预览文档
pnpm preview
```

> 文档构建已根据 GitHub 环境自动设置 `base`：
> - 本地：`/`
> - GitHub Pages：`/vodtv/`

---

## 🧩 布局与能力

| 布局 | 用途 | 说明 |
|---|---|---|
| `home` | 首页 | Hero / Features / QuickStart |
| `doc` | 文档页 | 侧边栏 / 目录 / 页脚导航 |
| `page` | 单页 | 居中内容 + 自定义 PageHero |
| `sponsor` | 赞助页 | 支付方式 / 支持者列表 / 统计 |
| `changelog` | 更新日志 | 版本历史 / 类型分类 |
| `jump` | 语言跳转 | 智能检测语言并跳转 |

更多示例与 API 详见在线文档。

---

## 🤝 参与贡献

欢迎通过 Issue / PR 参与贡献：

1. Fork 本仓库
2. 新建分支：`feat/your-feature`
3. 提交代码并发起 PR

---

## 📄 协议

[MIT](./LICENSE)

---

<p align="center">
  Made with ❤️ by <a href="https://www.vodtv.cn" target="_blank">vodtv</a>
</p>
