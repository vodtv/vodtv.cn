<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import { useLocale } from '../../composables/useLocale'
import { useLink } from '../../composables/useLink'

// 使用 VitePress 内置数据
const { page, theme } = useData()
const route = useRoute()
const { resolveLink } = useLink()

// 获取多语言文本
const sidebarTexts = useLocale('sidebar')

// 手动处理 sidebar 数据，不依赖 useLayout
const sidebarData = ref<any[]>([])
const hasSidebar = ref(false)

// 处理侧边栏配置
const processSidebar = () => {
  const sidebarConfig = theme.value.sidebar
  if (!sidebarConfig) {
    sidebarData.value = []
    hasSidebar.value = false
    return
  }

  // 如果是对象格式（多路径配置）
  if (typeof sidebarConfig === 'object' && !Array.isArray(sidebarConfig)) {
    const currentPath = page.value.relativePath
    for (const [path, config] of Object.entries(sidebarConfig)) {
      // 检查当前路径是否匹配这个侧边栏配置
      if (currentPath.startsWith(path.replace(/^\//, ''))) {
        sidebarData.value = Array.isArray(config) ? config : []
        hasSidebar.value = sidebarData.value.length > 0
        return
      }
    }
    sidebarData.value = []
    hasSidebar.value = false
  } else {
    // 如果是数组格式
    sidebarData.value = Array.isArray(sidebarConfig) ? sidebarConfig : []
    hasSidebar.value = sidebarData.value.length > 0
  }
}

// 移动端侧边栏状态
const isMobileSidebarOpen = ref(false)

// 检查链接是否激活
const isLinkActive = (link: string) => {
  if (!link) return false
  
  // 清理链接和路径，移除开头的斜杠
  const cleanLink = link.replace(/^\//, '').replace(/\/$/, '')
  const cleanPath = page.value.relativePath.replace(/^\//, '').replace(/\.md$/, '').replace(/\/index$/, '')
  
  // 如果是首页链接（空字符串或只有路径前缀）
  if (cleanLink === '' || cleanLink.endsWith('/')) {
    const linkPrefix = cleanLink.replace(/\/$/, '')
    return cleanPath === linkPrefix || cleanPath === linkPrefix + '/index'
  }
  
  // 精确匹配
  return cleanPath === cleanLink
}

// 移动端侧边栏控制
const openMobileSidebar = () => {
  isMobileSidebarOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
  document.body.style.overflow = ''
}

// 点击链接后关闭移动端侧边栏
const handleLinkClick = () => {
  if (window.innerWidth < 768) {
    closeMobileSidebar()
  }
}

// 监听路由变化，更新侧边栏
watch(() => route.path, () => {
  processSidebar()
})

// 监听窗口大小变化
onMounted(() => {
  // 初始化侧边栏数据
  processSidebar()

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      closeMobileSidebar()
    }
  }
  
  window.addEventListener('resize', handleResize)
  
  return () => {
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<template>
  <!-- 移动端侧边栏按钮 -->
  <div class="flex items-center py-3 md:hidden">
    <button
      type="button"
      class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      @click="openMobileSidebar"
    >
      <div class="icon-[heroicons--bars-3] h-4 w-4"></div>
      <span>{{ sidebarTexts.toggleButtonText }}</span>
    </button>
  </div>

  <!-- 左侧导航栏 -->
  <aside 
    v-if="hasSidebar"
    :class="[
      'fixed top-16 left-0 z-40 w-full h-[calc(100vh-4rem)] transform transition-transform md:translate-x-0 md:top-14 md:z-30 md:w-auto md:h-[calc(100vh-3.5rem)] md:bg-transparent shrink-0 md:sticky md:block',
      isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <!-- 移动端遮罩层 -->
    <div 
      v-if="isMobileSidebarOpen"
      class="fixed inset-0 bg-black/50 -z-10 md:hidden"
      @click="closeMobileSidebar"
    ></div>
    
    <div class="relative overflow-hidden h-full py-6 px-4 md:pr-6 lg:py-8">
      <!-- 移动端关闭按钮 -->
      <div class="flex items-center justify-between mb-4 md:hidden">
        <h4 class="text-lg font-semibold">{{ sidebarTexts.mobileTitle }}</h4>
        <button
          type="button"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
          @click="closeMobileSidebar"
        >
          <div class="icon-[heroicons--x-mark] h-5 w-5"></div>
        </button>
      </div>
      
      <div class="w-full">
        <div class="pb-4 hidden md:block">
          <h4 class="mb-1 rounded-md px-2 py-1 text-base font-semibold">
            {{ sidebarTexts.docNavTitle }}
          </h4>
        </div>
        
        <div class="overflow-y-auto max-h-[calc(100vh-12rem)] md:max-h-[calc(100vh-8rem)]">
          <!-- 侧边栏内容 -->
          <nav class="sidebar-nav">
            <template v-for="item in sidebarData" :key="item.text">
              <!-- 分组标题 -->
              <div v-if="item.text && !item.link" class="sidebar-group mb-4">
                <h3 class="sidebar-group-title text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 px-2 py-1">
                  {{ item.text }}
                </h3>
                
                <!-- 分组下的链接 -->
                <ul v-if="item.items" class="sidebar-group-items space-y-1">
                  <li v-for="subItem in item.items" :key="subItem.link || subItem.text">
                    <!-- 子项有链接 -->
                    <a 
                      v-if="subItem.link"
                      :href="resolveLink(subItem.link)"
                      :class="[
                        'block px-3 py-2 text-sm rounded-md transition-colors duration-200',
                        isLinkActive(subItem.link)
                          ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium border-l-2 border-primary-500'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                      ]"
                      @click="handleLinkClick"
                    >
                      {{ subItem.text }}
                    </a>
                    
                    <!-- 子项是分组（多级） -->
                    <div v-else-if="subItem.items" class="ml-2">
                      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 px-2 py-1">
                        {{ subItem.text }}
                      </h4>
                      <ul class="space-y-1">
                        <li v-for="nestedItem in subItem.items" :key="nestedItem.link">
                          <a 
                            :href="resolveLink(nestedItem.link)"
                            :class="[
                              'block px-3 py-2 text-sm rounded-md transition-colors duration-200 ml-2',
                              isLinkActive(nestedItem.link)
                                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium border-l-2 border-primary-500'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                            ]"
                            @click="handleLinkClick"
                          >
                            {{ nestedItem.text }}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
              
              <!-- 直接链接 -->
              <div v-else-if="item.link" class="mb-1">
                <a 
                  :href="resolveLink(item.link)"
                  :class="[
                    'block px-3 py-2 text-sm rounded-md transition-colors duration-200',
                    isLinkActive(item.link)
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium border-l-2 border-primary-500'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                  ]"
                  @click="handleLinkClick"
                >
                  {{ item.text }}
                </a>
              </div>
            </template>
          </nav>
        </div>
      </div>
    </div>
  </aside>
</template>