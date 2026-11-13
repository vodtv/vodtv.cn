import { VPTheme } from "@vodtv/theme/config";
import nav from "./nav";
import sidebar from "./sidebar";
const base = process.env.GITHUB_ACTIONS
  ? `/${process.env.GITHUB_REPOSITORY}/`
  : "/";

export default VPTheme({
  base,
  // 站点配置
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

  // 多语言配置
  locales: {
    root: {
      label: "简体中文",
      lang: "zh-CN",
      title: "vodtv.cn",
      description: "极速 、 高清 、 无广告",
      themeConfig: {
        // 中文导航
        nav: nav.cn,
        // 中文侧边栏
        sidebar: sidebar.cn,
      },
    },
    "en-US": {
      label: "English",
      lang: "en-US",
      title: "vodtv.cn",
      description: "Fast, HD, No Ads",
      themeConfig: {
        // 英文导航
        nav: nav.en,
        // 英文侧边栏
        sidebar: sidebar.en,
      },
    },
  },

  // 全局主题配置
  themeConfig: {
    // Logo 配置
    logo: "/logo.svg",

    // 社交链接
    socialLinks: [{ icon: "github", link: "https://github.com/vodtv/vodtv" }],

    // Footer 配置
    footer: {
      copyright: 'Copyright © 2024 <a href="https://vodtv.cn">vodtv</a>',
    },
  },
});
