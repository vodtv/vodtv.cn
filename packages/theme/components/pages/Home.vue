<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import Hero from '../home/Hero.vue'
import Features from '../home/Features.vue'
import QuickStart from '../home/QuickStart.vue'

// 使用 VitePress 的 useData 获取当前数据，确保响应式更新
const { frontmatter } = useData()

// 从 frontmatter 获取数据 - 现在会随语言切换而更新
const hero = computed(() => frontmatter.value.hero || {})
const features = computed(() => frontmatter.value.features || [])
const featuresConfig = computed(() => frontmatter.value.featuresConfig)
const quickStart = computed(() => frontmatter.value.quickStart)
</script>

<template>
  <div class="home">
    <!-- Hero 区域 -->
    <Hero :hero="hero" />

    <!-- Features 区域 -->
    <Features v-if="features.length" :features="features" :config="featuresConfig" />

    <!-- QuickStart 区域 -->
    <QuickStart v-if="quickStart" :quickStart="quickStart" />

    <!-- Custom Content Slot -->
    <div class="custom-content">
      <Content />
    </div>
  </div>
</template>