---
layout: home
title: vodtv
titleTemplate: 极速 、 高清 、 无广告

hero:
  name: 自由观影，畅享精彩
  text: 深度二次开发的全功能影视聚合搜索与播放平台
  tagline: 60+ 重大功能增强，帮您打造极致的在线观影体验。
  subtitle: 智能体 • 机器人 • 知识库 • 文件解析 • 多媒体生成 • 工作流
  mockUrl: "https://www.vodtv.cn" 
  image:
    src: "/screenshot2.png"
    alt: "一体化模块化 AI "
  actions:
    - theme: brand
      text: 快速开始
      link: /zh-CN/guide/quick-start
    - theme: alt
      text: 在 GitHub 查看
      link: https://github.com/Vodtv/vodtv
      target: _blank
    - theme: alt
      text: 查看指南
      link: /zh-CN/guide/

features:
  - icon: rocket-launch
    color: blue
    title: 快速搭建
    details: 简单配置，快速搭建你的视频站点。
  - icon: paint-brush
    color: purple
    title: 简洁播放界面
    details: 美观媒体UI，支持亮色、暗色主题切换。
  - icon: globe-alt
    color: green
    title: 多语言支持
    details: 面向全球用户，轻松添加更多语种。
  - icon: device-phone-mobile
    color: orange
    title: 多端适配
    details: 完美适配桌面、平板和移动设备
  - icon: bolt
    color: amber
    title: 极速流媒体
    details: 低延迟视频流，影片加载迅速。
  - icon: magnifying-glass
    color: indigo
    title: 媒体检索
    details: 一键搜索电影与剧集。
  - icon: magnifying-glass
    color: blue
    title: 聚合搜索
    details: 多采集站服务端并行搜索，单源失败不影响整体，用户 IP 不暴露给第三方。
  - icon: paint-brush
    color: purple
    title: 跨源同名聚合
    details: 同名影片合并为一张卡片，展开即可比较和选择各来源。
  - icon: globe-alt
    color: green
    title: HLS 播放
    details: ArtPlayer + hls.js 内核，广告分片过滤、自动连播、倍速与快捷键。
  - icon: device-phone-mobile
    color: orange
    title: 秒级续播
    details: 播放进度与观看历史存于本机 IndexedDB，精确到秒的续播。
  - icon: bolt
    color: amber
    title: 换源测速
    details: 项目开发者不对使用本项目产生的任何后果负责。
  - icon: magnifying-glass  
    color: indigo
    title: 源测试与订阅
    details: 仅供学习与个人使用，请勿用于商业用途或公开服务。


featuresConfig:
  title: 为什么选择 VODTV？
  description: 帮助您打造极致的点播与视频播放媒体平台
  extraSection:
    title: 立即开始
    description: 仅需3步，简单搭建属于你的视频站点
    tags:
      - 快速搭建
      - 简洁播放界面
      - TypeScript支持
      - 多布局方案
      - 多语言
      - 响应式设计


quickStart:
  badge: 5分钟部署
  title: 快速开始
  subtitle: 简易部署
  description: 简单几步即可Docker 部署（推荐）
  steps:
    - step: "第一步"
      icon: "arrow-down-tray"
      color: "blue"
      title: "克隆项目"
      description: "使用git下载后快速安装"
      code: |
        git clone https://github.com/SzeMeng76/LunaTV.git
        cd LunaTV
    - step: "第二步"
      icon: "cog-8-tooth"
      color: "green"
      title: "配置必要的环境变量"
      description: "编辑 .env 文件"
      code: |
        cp .env.example .env
        nano .env
    - step: "第三步"
      icon: "rocket-launch"
      color: "purple"
      title: "启动服务"
      description: "启动 docker-compose 服务"
      code: |
        docker-compose up -d  
        # 访问 `http://localhost:3000` 即可使用
  helpText: "需要帮助？查看我们的详细文档"
  helpLink: "/zh-CN/guide/quick-start"
  helpLinkText: "快速开始指南"  
---