// 主题入口文件
import type { Theme } from 'vitepress'
import Layout from './components/Layout.vue'
import NotFound from './components/pages/NotFound.vue'
import Badge from './components/common/Badge.vue'

// 导入全局样式
import './styles/index.css'

// 导出主题
export const theme = {
  Layout,
  NotFound,
  enhanceApp({ app }) {
    // 全局注册 Badge 组件
    app.component('Badge', Badge)
  }
} satisfies Theme


// 导出默认主题
export default theme

// 导出组件供外部使用
export { default as Layout } from './components/Layout.vue'
export { default as NotFound } from './components/pages/NotFound.vue'
export { default as Home } from './components/pages/Home.vue'
export { default as Doc } from './components/pages/Doc.vue'
export { default as SinglePage } from './components/pages/SinglePage.vue'
export { default as ChangeLog } from './components/pages/ChangeLog.vue'
export { default as Sponsor } from './components/pages/Sponsor.vue'
export { default as Jump } from './components/pages/Jump.vue'

// 导出类型
export * from './types'
