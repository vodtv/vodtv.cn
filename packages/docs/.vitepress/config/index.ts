import { VPTheme } from "@vodtv/theme/config";
import nav from "./nav.ts";

import sidebar from "./sidebar.ts";
const base = process.env.GITHUB_ACTIONS ? "/vodtv.cn/" : "/";

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
    // 开启行号
    lineNumbers: true,
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoad: true,
    },
    // 更改容器默认值标题
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
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
        // Logo 配置
        logo: "/logo.svg",

        outline: {
          label: "本页导航",
          level: [2, 3],
        },

        lastUpdated: {
          text: "最后更新于",
          formatOptions: {
            dateStyle: "full",
            timeStyle: "full",
            hourCycle: "h24",
          },
        },

        // 文章翻页
        docFooter: { prev: "上一页", next: "下一页" },

        ///返回顶部文字修改(移动端)
        returnToTopLabel: "返回顶部",

        //侧边栏文字更改(移动端)
        sidebarMenuLabel: "目录",

        // 主题模式切换
        lightModeSwitchTitle: "切换到浅色模式",
        darkModeSwitchTitle: "切换到深色模式",
        darkModeSwitchLabel: "主题模式",

        // 社交链接
        socialLinks: [
          { icon: "github", link: "https://github.com/vodtv/vodtv" },
        ],

        // Footer 配置
        footer: {
          copyright: 'Copyright © 2024 <a href="https://vodtv.cn">vodtv</a>',
        },
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
});
