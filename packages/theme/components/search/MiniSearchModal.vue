<template>
  <Teleport to="body">
    <div
      v-if="isSearchOpen"
      class="fixed inset-0 z-100 flex items-start justify-center p-4 sm:p-6 md:p-20"
      @click.self="closeSearch"
    >
      <!-- 背景遮罩 -->
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm search-modal"
        @click="closeSearch"
      ></div>
      
      <!-- 搜索容器 -->
      <div class="relative w-full max-w-2xl bg-white dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-xl shadow-2xl overflow-hidden search-container">
        <!-- 搜索输入区 -->
        <div class="search-box border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center px-4">
            <div class="icon-[heroicons--magnifying-glass] h-5 w-5 text-gray-400 dark:text-gray-500"></div>
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              :placeholder="searchTexts.button.buttonText"
              class="flex-1 px-3 py-4 text-base bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              @input="handleSearch"
              @keydown="handleKeyDown"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              :aria-label="searchTexts.modal.resetButtonTitle"
            >
              <div class="icon-[heroicons--x-mark] h-4 w-4 text-gray-400 dark:text-gray-500"></div>
            </button>
          </div>
        </div>
        
        <!-- 搜索结果区 -->
        <div class="search-results max-h-[60vh] overflow-y-auto">
          <!-- 无结果提示 -->
          <div v-if="searchQuery && searchResults.length === 0" class="p-8 text-center">
            <div class="icon-[heroicons--magnifying-glass] h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3"></div>
            <p class="text-gray-500 dark:text-gray-400">{{ searchTexts.modal.noResultsText }}</p>
          </div>
          
          <!-- 搜索结果列表 -->
          <div v-else-if="searchResults.length > 0" class="py-2">
            <a
              v-for="(result, index) in searchResults"
              :key="result.id"
              :href="resolveLink(result.url)"
              class="search-result block px-4 py-3 hover:bg-primary-600/10 transition-colors"
              :class="{ 'bg-primary-600/10': selectedIndex === index }"
              @click.prevent="selectSearchResult(index)"
              @mouseenter="selectedIndex = index"
            >
              <div class="flex items-start gap-3">
                <div class="icon-[heroicons--document-text] h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 shrink-0"></div>
                <div class="flex-1 min-w-0">
                  <div v-if="result.section" class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {{ result.section }}
                  </div>
                  <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {{ result.title }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {{ result.text }}
                  </p>
                </div>
              </div>
            </a>
          </div>
          
          <!-- 初始状态提示 -->
          <div v-else class="p-8 text-center">
            <div class="icon-[heroicons--magnifying-glass] h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3"></div>
            <p class="text-gray-500 dark:text-gray-400">{{ searchTexts.button.buttonText }}</p>
          </div>
        </div>
        
        <!-- 搜索页脚 -->
        <div class="search-footer border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1">
              <kbd class="flex items-center" :aria-label="searchTexts.modal.footer.selectKeyAriaLabel">
                <div class="icon-[heroicons--arrow-turn-down-left] h-3 w-3"></div>
              </kbd>
              <span>{{ searchTexts.modal.footer.selectText }}</span>
            </span>
            <span class="flex items-center gap-1">
              <kbd class="flex items-center" :aria-label="searchTexts.modal.footer.navigateUpKeyAriaLabel">
                <div class="icon-[heroicons--arrow-up] h-3 w-3"></div>
              </kbd>
              <kbd class="flex items-center" :aria-label="searchTexts.modal.footer.navigateDownKeyAriaLabel">
                <div class="icon-[heroicons--arrow-down] h-3 w-3"></div>
              </kbd>
              <span>{{ searchTexts.modal.footer.navigateText }}</span>
            </span>
          </div>
          <button @click="closeSearch" class="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
            <kbd class="flex items-center" :aria-label="searchTexts.modal.footer.closeKeyAriaLabel">
              <div class="icon-[heroicons--x-mark] h-3 w-3"></div>
            </kbd>
            <span>{{ searchTexts.modal.footer.closeText }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vitepress'
import { useLocale } from '../../composables/useLocale'
import { useLink } from '../../composables/useLink'
import { 
  isSearchOpen, 
  searchQuery, 
  searchResults, 
  selectedIndex,
  performSearch,
  closeSearch as closeSearchModal,
  selectResult,
  navigateResults,
  initSearchIndex
} from '../../composables/useSearch'

const searchInput = ref<HTMLInputElement>()
const router = useRouter()
const { resolveLink } = useLink()

// 获取多语言文本
const searchTexts = useLocale('search')

// 初始化搜索索引
onMounted(async () => {
  await initSearchIndex()
  
  // 监听全局键盘快捷键
  document.addEventListener('keydown', handleGlobalKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeyDown)
})

// 监听搜索框打开状态
watch(isSearchOpen, async (open) => {
  if (open) {
    await nextTick()
    searchInput.value?.focus()
  }
})

// 处理搜索输入
const handleSearch = () => {
  performSearch(searchQuery.value)
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  selectedIndex.value = 0
  searchInput.value?.focus()
}

// 选择搜索结果
const selectSearchResult = (index: number) => {
  selectResult(index, (url: string) => {
    router.go(resolveLink(url))
  })
}

// 关闭搜索
const closeSearch = () => {
  closeSearchModal()
}

// 键盘事件处理
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault()
      navigateResults('up')
      break
    case 'ArrowDown':
      e.preventDefault()
      navigateResults('down')
      break
    case 'Enter':
      e.preventDefault()
      selectSearchResult(selectedIndex.value)
      break
    case 'Escape':
      e.preventDefault()
      closeSearch()
      break
  }
}

// 全局键盘快捷键
const handleGlobalKeyDown = (e: KeyboardEvent) => {
  // Cmd/Ctrl + K 打开搜索
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    if (isSearchOpen.value) {
      closeSearch()
    } else {
      isSearchOpen.value = true
    }
  }
}
</script>