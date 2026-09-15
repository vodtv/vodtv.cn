<template>
  <footer class="doc-footer mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
    <!-- 编辑链接和最后更新 -->
    <div class="flex justify-between flex-col lg:flex-row gap-4 mb-8">
      <!-- GitHub 编辑链接 -->
      <div v-if="editLink" class="edit-link mb-4">
        <a 
          :href="editLink.url" 
          class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="icon-[heroicons--pencil-square] w-4 h-4"></span>
          {{ editLink.text }}
        </a>
      </div>

      <!-- 最后更新时间 -->
      <div v-if="lastUpdated" class="last-updated text-sm text-gray-500 dark:text-gray-400 inline-flex items-center">
        <span class="icon-[heroicons--clock] w-4 h-4 inline-block mr-1"></span>
        {{ docFooterTexts.lastUpdatedText }} {{ lastUpdated }}
      </div>
    </div>

    <!-- 上一篇/下一篇导航 -->
    <nav v-if="prevNext" class="doc-nav grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 上一篇 -->
      <div v-if="prevNext.prev" class="nav-link prev">
        <a 
          :href="prevNext.prev.link"
          class="flex flex-col p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
        >
          <span class="text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span class="icon-[heroicons--arrow-left] w-4 h-4 inline-block mr-1"></span>
            {{ docFooterTexts.prevPageText }}
          </span>
          <span class="text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 font-medium">
            {{ prevNext.prev.text }}
          </span>
        </a>
      </div>

      <!-- 占位符，保持右侧对齐 -->
      <div v-else-if="prevNext.next" class="hidden md:block"></div>

      <!-- 下一篇 -->
      <div v-if="prevNext.next" class="nav-link next md:text-right">
        <a 
          :href="prevNext.next.link"
          class="flex flex-col p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
        >
          <span class="text-sm text-gray-500 dark:text-gray-400 mb-1 md:text-right">
            {{ docFooterTexts.nextPageText }}
            <span class="icon-[heroicons--arrow-right] w-4 h-4 inline-block ml-1"></span>
          </span>
          <span class="text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 font-medium md:text-right">
            {{ prevNext.next.text }}
          </span>
        </a>
      </div>
    </nav>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { useLocale } from '../../composables/useLocale'

const { page, theme, site, lang } = useData()

// 获取多语言文本
const docFooterTexts = useLocale('docFooter')

// 编辑链接
const editLink = computed(() => {
  const editLinkConfig = theme.value.editLink
  if (!editLinkConfig) return null

  const { pattern, text } = editLinkConfig
  if (!pattern) return null

  let url: string
  if (typeof pattern === 'string') {
    url = pattern.replace(/:path/g, page.value.filePath)
  } else if (typeof pattern === 'function') {
    url = pattern(page.value)
  } else {
    return null
  }

  // 使用配置的文本，如果没有则使用多语言文本
  return { 
    url, 
    text: text || docFooterTexts.value.editLinkText 
  }
})

// 最后更新时间 - 默认显示，不受配置控制
const lastUpdated = computed(() => {
  const timestamp = page.value.lastUpdated
  
  if (!timestamp) return null
  
  const date = new Date(timestamp)
  const config = theme.value.lastUpdated
  const formatOptions = config?.formatOptions || {
    dateStyle: 'short',
    timeStyle: 'short'
  }
  
  return new Intl.DateTimeFormat(lang.value, formatOptions).format(date)
})


// 上一篇/下一篇导航
const prevNext = computed(() => {
  const sidebar = theme.value.sidebar
  if (!sidebar) return null

  // 获取当前页面的相对路径
  const currentPath = page.value.relativePath.replace(/\.md$/, '')
  
  // 扁平化侧边栏项目
  const flattenSidebar = (items: any[], result: any[] = []) => {
    items.forEach(item => {
      if (item.link) {
        result.push({
          text: item.text,
          link: item.link
        })
      }
      if (item.items) {
        flattenSidebar(item.items, result)
      }
    })
    return result
  }

  let allItems: any[] = []
  
  // 处理不同类型的侧边栏配置
  if (Array.isArray(sidebar)) {
    allItems = flattenSidebar(sidebar)
  } else if (typeof sidebar === 'object') {
    // 找到匹配当前路径的侧边栏配置
    for (const [path, config] of Object.entries(sidebar)) {
      if (currentPath.startsWith(path.replace(/^\//, '').replace(/\/$/, ''))) {
        if (Array.isArray(config)) {
          allItems = flattenSidebar(config)
          break
        }
      }
    }
  }

  if (allItems.length === 0) return null

  // 查找当前页面在列表中的位置
  const currentIndex = allItems.findIndex(item => {
    const itemPath = item.link.replace(/^\//, '').replace(/\/$/, '').replace(/\.html$/, '')
    return itemPath === currentPath
  })

  if (currentIndex === -1) return null

  const prev = currentIndex > 0 ? allItems[currentIndex - 1] : null
  const next = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null

  return { prev, next }
})
</script>