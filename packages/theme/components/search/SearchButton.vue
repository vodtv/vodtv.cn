<template>
  <button
    type="button"
    @click="handleOpenSearch"
    class="search-button inline-flex items-center gap-2 px-3 py-1.5 h-8 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
    :aria-label="searchTexts.button?.buttonAriaLabel"
  >
    <div class="icon-[heroicons--magnifying-glass] h-4 w-4"></div>
    <span class="hidden sm:inline-block">{{ searchTexts.button?.buttonText }}</span>
    <kbd class="hidden sm:inline-flex items-center gap-1 ml-auto">
      <span class="search-kbd">⌘</span>
      <span class="search-kbd">K</span>
    </kbd>
  </button>
</template>

<script setup lang="ts">
import { openSearch } from '../../composables/useSearch'
import { useLocale } from '../../composables/useLocale'

// 使用统一的语言包系统
const searchTexts = useLocale('search')

// 处理打开搜索
const handleOpenSearch = () => {
  openSearch()
}
</script>

