<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import PageHero from '../common/PageHero.vue'

const { page, frontmatter } = useData()

// 计算内容容器的最大宽度
const maxWidth = computed(() => {
  return frontmatter.value.maxWidth || 'max-w-6xl'
})

// 获取hero配置，支持自定义颜色、图标等
const heroColor = computed(() => frontmatter.value.heroColor || 'info')
const heroIcon = computed(() => frontmatter.value.heroIcon || '')
const heroSize = computed(() => frontmatter.value.heroSize || 'md')
</script>

<template>
  <div class="page-container">
    <!-- 页面头部 - 使用 PageHero 组件 -->
    <PageHero
      v-if="frontmatter.title"
      :title="frontmatter.title"
      :description="frontmatter.description"
      :icon="heroIcon"
      :color="heroColor"
      align="center"
      :size="heroSize"
    />

    <!-- 内容区域 -->
    <main class="page-main">
      <div :class="['page-content', maxWidth]">
        <Content />
      </div>
    </main>
  </div>
</template>

