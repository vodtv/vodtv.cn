import { VPTheme } from "@vodtv/theme/config";
import path from "path";
// import AutoImport from "unplugin-auto-import/vite";
// import Components from "unplugin-vue-components/vite";
const base = process.env.GITHUB_ACTIONS
  ? "/" + process.env.GITHUB_REPOSITORY_URL + "/"
  : "/";
const srcDir = "packages/docs";

export default VPTheme({
  base,
  // 站点配置
  title: "Vodtv",
  description: "A modern and elegant VitePress theme",

  head: [
    ["link", { rel: "icon", href: "/favicon.svg" }],
    ["meta", { name: "theme-color", content: "#3b82f6" }],
  ],

  // 启用暗色模式
  appearance: true,

  // 启用最后更新时间
  lastUpdated: true,

  // Markdown 配置
  markdown: {
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
  },

  // vite
  vite: {
    /* plugins: [
        AutoImport({
          imports: ["vue", "vitepress"],
          dts: ".vitepress/auto-imports.d.ts",
        }),
        Components({
          dirs: [".vitepress/theme/components", ".vitepress/theme/views"],
          extensions: ["vue", "md"],
          include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
          dts: ".vitepress/components.d.ts",
        }),
      ], */
    resolve: {
      // 配置路径别名
      alias: {
        // eslint-disable-next-line no-undef
        //"@": path.resolve(__dirname, "./theme"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
    // 服务器
    server: {
      port: 1001,
    },
  },

  // 多语言配置
  locales: {
    root: {
      label: "简体中文",
      lang: "zh-CN",
      title: "VODTV",
      description: "极速 、 高清 、 无广告",
      themeConfig: {
        // 中文导航
        nav: [
          { text: "📖 指南", link: "/guide/" },
          { text: "📝 更新", link: "/changelog" },
          { text: "⚡ 镜像", link: "/mirror" },
          { text: "⚠️ 声明", link: "/notice" },
          { text: "ℹ️ 关于", link: "/about" },
          { text: "☕ 赞助", link: "/sponsor" },
        ],
        // 中文侧边栏
        sidebar: {
          "/guide/": [
            {
              text: "快速入门",
              items: [
                { text: "📁 介绍", link: "/guide/" },
                { text: "💡 快速开始", link: "/guide/quick-start" },
              ],
            },
            {
              text: "部署运维 ",
              items: [
                { text: "🚀 部署指南", link: "/guide/DEPLOYMENT" },
                { text: "⚙️ 配置说明", link: "/guide/CONFIGURATION" },
                {
                  text: "🎥 观影房部署",
                  link: "/guide/WATCH_ROOM_DEPLOYMENT",
                },
              ],
            },
            {
              text: "功能特性  ",
              items: [
                { text: "🤖 AI 功能详解", link: "/guide/AI_FEATURES" },
                { text: "📥 下载功能", link: "/guide/DOWNLOAD_FEATURES" },
                {
                  text: "📺 虚拟滚动指南",
                  link: "/guide/VIRTUAL_SCROLL_GUIDE",
                },
              ],
            },
            {
              text: "开发实践",
              items: [
                { text: "📺 TVBox 集成", link: "/guide/TVBOX" },
                { text: "🎬 Emby 集成", link: "/guide/EMBY_GUIDE" },
                { text: "🔒 TVBox 安全", link: "/guide/TVBOX_SECURITY" },
              ],
            },
            {
              text: "认证授权",
              items: [
                { text: "🔐 OIDC 认证", link: "/guide/OIDC_SETUP" },
                { text: "🌐 可信网络", link: "/guide/TRUSTED_NETWORK" },
                {
                  text: "💬 Telegram 认证",
                  link: "/guide/TELEGRAM_AUTH",
                },
              ],
            },

            {
              text: "高级配置",
              items: [
                { text: "🚫 广告过滤", link: "/guide/CUSTOM_AD_FILTER" },
                { text: "🔧 代理配置", link: "/guide/PROXY_CONFIG" },
                {
                  text: "⏭️ 跳过控制器",
                  link: "/guide/SKIP_CONTROLLER_GUIDE",
                },
              ],
            },
            {
              text: "移动使用",
              items: [{ text: "📱 移动端使用 ", link: "/guide/MOBILE" }],
            },
            {
              text: "安全隐私",
              items: [{ text: "🔒 安全与隐私", link: "/guide/SECURITY" }],
            },
          ],
        },
      },
    },
    "en-US": {
      label: "English",
      lang: "en-US",
      title: "VODTV",
      description: "Fast, HD, No Ads",
      themeConfig: {
        // 英文导航
        nav: [
          { text: "📖 Guide", link: "/en-US/guide/" },
          { text: "📝 Changelog", link: "/en-US/changelog" },
          { text: "⚡ Mirror", link: "/en-US/mirror" },
          { text: "⚠️ Notice", link: "/en-US/notice" },
          { text: "ℹ️ About", link: "/en-US/about" },
          { text: "☕ Sponsor", link: "/en-US/sponsor" },
        ],
        // 英文侧边栏
        sidebar: {
          "/en-US/guide/": [
            {
              text: "Get Started",
              items: [
                { text: "📁 Introduction", link: "/en-US/guide/" },
                { text: "💡 Quick Start", link: "/en-US/guide/quick-start" },
              ],
            },
            {
              text: "Deploy & Config ",
              items: [
                {
                  text: "🚀 Deployment Guide",
                  link: "/en-US/guide/DEPLOYMENT",
                },
                {
                  text: "⚙️ Config Reference",
                  link: "/en-US/guide/CONFIGURATION",
                },
                {
                  text: "🎥 Watch Room Deployment",
                  link: "/en-US/guide/WATCH_ROOM_DEPLOYMENT",
                },
              ],
            },
            {
              text: "Features",
              items: [
                { text: "🤖 AI Features", link: "/en-US/guide/AI_FEATURES" },
                {
                  text: "📥 Download Function",
                  link: "/en-US/guide/DOWNLOAD_FEATURES",
                },
                {
                  text: "📺 Virtual Scroll Guide",
                  link: "/en-US/guide/VIRTUAL_SCROLL_GUIDE",
                },
              ],
            },
            {
              text: "Third-party Integration",
              items: [
                { text: "📺 TVBox Integration", link: "/en-US/guide/TVBOX" },
                {
                  text: "🎬 Emby Integration",
                  link: "/en-US/guide/EMBY_GUIDE",
                },
                {
                  text: "🔒 TVBox Security",
                  link: "/en-US/guide/TVBOX_SECURITY",
                },
              ],
            },
            {
              text: "Auth & Permission",
              items: [
                { text: "🔐 OIDC Setup", link: "/en-US/guide/OIDC_SETUP" },
                {
                  text: "🌐 Trusted Network",
                  link: "/en-US/guide/TRUSTED_NETWORK",
                },
                {
                  text: "💬 Telegram Auth",
                  link: "/en-US/guide/TELEGRAM_AUTH",
                },
              ],
            },

            {
              text: "Advanced Config",
              items: [
                { text: "🚫 Ad Filter", link: "/en-US/guide/CUSTOM_AD_FILTER" },
                {
                  text: "🔧 Proxy Settings",
                  link: "/en-US/guide/PROXY_CONFIG",
                },
                {
                  text: "⏭️ Skip Controller",
                  link: "/en-US/guide/SKIP_CONTROLLER_GUIDE",
                },
              ],
            },
            {
              text: "Mobile",
              items: [
                { text: "📱 Mobile Usage ", link: "/en-US/guide/MOBILE" },
              ],
            },
            {
              text: "Security",
              items: [
                {
                  text: "🔒 Security & Privacy",
                  link: "/en-US/guide/SECURITY",
                },
              ],
            },
          ],
        },
      },
    },
  },

  // 全局主题配置
  themeConfig: {
    // Logo 配置
    logo: "/logo.svg",

    // 搜索配置
    search: {
      provider: "local",
    },

    // 社交链接
    socialLinks: [{ icon: "github", link: "https://github.com/vodtv/vodtv" }],

    // Footer 配置
    footer: {
      copyright: 'Copyright © 2024 <a href="https://vodtv.cn">vodtv</a>',
    },
  },
});
