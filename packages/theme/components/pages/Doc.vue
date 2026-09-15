<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import Sidebar from '../docs/Sidebar.vue'
import Outline from '../docs/Outline.vue'
import DocFooter from '../docs/DocFooter.vue'
import { useReadingTime } from '../../composables/useReadingTime'

const { page, site, theme, frontmatter } = useData()
const { readingTime, readingTimeLocale } = useReadingTime()

// 检测是否有侧边栏内容
const hasSidebar = computed(() => {
  const sidebarConfig = theme.value.sidebar
  if (!sidebarConfig) return false

  // 如果是对象格式（多路径配置）
  if (typeof sidebarConfig === 'object' && !Array.isArray(sidebarConfig)) {
    const currentPath = page.value.relativePath
    for (const [path, config] of Object.entries(sidebarConfig)) {
      // 检查当前路径是否匹配这个侧边栏配置
      if (currentPath.startsWith(path.replace(/^\//, ''))) {
        const sidebarData = Array.isArray(config) ? config : []
        return sidebarData.length > 0
      }
    }
    return false
  } else {
    // 如果是数组格式
    const sidebarData = Array.isArray(sidebarConfig) ? sidebarConfig : []
    return sidebarData.length > 0
  }
})

// 动态计算容器的CSS类
const containerClasses = computed(() => {
  const baseClasses = 'container mx-auto px-4 flex-1 items-start'
  if (hasSidebar.value) {
    return `${baseClasses} md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10`
  } else {
    return `${baseClasses} max-w-6xl`
  }
})
</script>

<template>
  <div class="flex-1">
    <div :class="containerClasses">
      
      <!-- 侧边栏组件 - 现在使用 VitePress 内置数据 -->
      <Sidebar />

      <!-- 主内容区域 -->
      <main class="flex-1 relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
        <div class="mx-auto w-full min-w-0">
          <article class="prose prose-slate dark:prose-invert max-w-none prose-lg">
            <!-- 文章标题和元信息 -->
            <div class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <h1 v-if="frontmatter.title" class="mb-4">{{ frontmatter.title }}</h1>
              
              <!-- 阅读时间显示 -->
              <div class="flex items-center gap-4 text-sm text-muted-foreground not-prose">
                <div class="flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{{ readingTimeLocale.time }}：{{ readingTime.time }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span>{{ readingTime.wordsText }}</span>
                </div>
              </div>
              
              <p v-if="frontmatter.description" class="text-xl text-muted-foreground mt-4">
                {{ frontmatter.description }}
              </p>
            </div>
            
            <div class="prose-content">
              <Content />
            </div>
            
            <!-- 文档页脚 -->
            <DocFooter />
          </article>
        </div>
        
        <!-- 右侧目录导航 -->
        <div class="hidden text-sm xl:block">
          <Outline />
        </div>
      </main>
    </div>
  </div>
</template>
