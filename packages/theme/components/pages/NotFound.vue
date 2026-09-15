<script setup lang="ts">
import { useLocale } from '../../composables/useLocale'

const locale = useLocale('notFound')

const handleBack = () => {
  window.history.back()
}
</script>

<template>
  <div class="not-found">
    <div class="container mx-auto px-4 py-16 text-center">
      <!-- 404 图标 -->
      <div class="mb-8">
        <div class="icon-[heroicons--face-frown] h-24 w-24 mx-auto text-gray-400 dark:text-gray-600"></div>
      </div>
      
      <!-- 404 标题 -->
      <h1 class="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {{ locale.title }}
      </h1>
      
      <!-- 404 描述 -->
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
        {{ locale.content }}
      </p>
      
      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a 
          href="/"
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white no-underline rounded-lg font-medium transition-colors duration-200"
        >
          <div class="icon-[heroicons--home] h-5 w-5"></div>
          {{ locale.backToHome }}
        </a>
        
        <button
          @click="handleBack"
          class="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200"
        >
          <div class="icon-[heroicons--arrow-left] h-5 w-5"></div>
          {{ locale.previousPage }}
        </button>
      </div>
    </div>
  </div>
</template>