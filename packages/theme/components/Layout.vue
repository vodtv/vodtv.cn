<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useData } from 'vitepress'
import { createMermaidRenderer } from 'vitepress-mermaid-renderer'
import Header from './layout/Header.vue'
import Footer from './layout/Footer.vue'
import Home from './pages/Home.vue'
import Doc from './pages/Doc.vue'
import NotFound from './pages/NotFound.vue'
import SinglePage from './pages/SinglePage.vue'
import ChangeLog from './pages/ChangeLog.vue'
import Sponsor from './pages/Sponsor.vue'
import Jump from './pages/Jump.vue'
import MiniSearchModal from './search/MiniSearchModal.vue'
import { ThemeConfig } from '../types/index'

// 获取 VitePress 核心数据
const { theme, page, frontmatter, isDark } = useData<ThemeConfig>()

const initMermaid = (dark: boolean) => {
  if (typeof window === 'undefined') return
  createMermaidRenderer({
    theme: dark ? 'dark' : 'default'
  })
}

onMounted(() => {
  initMermaid(isDark.value)
})

watch(isDark, (value) => {
  initMermaid(value)
})

watch(
  () => page.value.relativePath,
  () => {
    initMermaid(isDark.value)
  }
)

</script>

<template>
    <!-- Jump 布局 - 语言自动跳转页面 -->
    <template v-if="frontmatter.layout === 'jump'">
      <Jump />
    </template>
    
    <!-- 其他布局 -->
    <template v-else>
      <!-- Header 组件 - 现在直接使用 VitePress useData -->
      <Header />
      
      <!-- 主内容区域 - 根据页面类型条件渲染 -->
      <main class="flex-1">
        <!-- 首页布局 -->
        <Home 
          v-if="frontmatter.layout === 'home'" 
        />
        
        <!-- 单页文档布局 -->
        <SinglePage 
          v-else-if="frontmatter.layout === 'page'"
        />
        
        <!-- 更新日志布局 -->
        <ChangeLog 
          v-else-if="frontmatter.layout === 'changelog'"
        />
        
        <!-- 捐助页面布局 -->
        <Sponsor 
          v-else-if="frontmatter.layout === 'sponsor'"
        />
        
        <!-- 文档页布局 -->
        <Doc 
          v-else-if="!page.isNotFound" 
          :page="page"
          :frontmatter="frontmatter"
          :themeConfig="theme"
        />
        
        <!-- 404 页面 -->
        <NotFound v-else :themeConfig="theme" />
      </main>
      
      <!-- Footer 组件 - 传递数据 -->
      <Footer 
        v-if="theme.footer"
        :footer="theme.footer"
        :themeConfig="theme"
      />
      
      <!-- 搜索模态框 -->
      <MiniSearchModal />
    </template>
</template>
