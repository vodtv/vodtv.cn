import { h } from 'vue'
// 扩展默认主题
import Theme from '@vodtv/theme'
// 显式引入主题样式
import '@vodtv/theme/dist/index.css'

import HomeAdvantageCards from './components/HomeAdvantageCards.vue'
import ScenarioCards from './components/ScenarioCards.vue'
import ExtensionCards from './components/ExtensionCards.vue'
import BlogIndex from './components/BlogIndex.vue'

export default {
   Layout() {
    return h((Theme as any).Layout, null, {
      'aside-ads-before': () => h(ExtensionCards),
    })
  },
  enhanceApp(ctx: any) {
    const { app } = ctx
    
    app.component('HomeAdvantageCards', HomeAdvantageCards)
    app.component('ScenarioCards', ScenarioCards)
    app.component('ExtensionCards', ExtensionCards)
    app.component('BlogIndex', BlogIndex)

    Theme.enhanceApp(ctx)
  },
                 
}