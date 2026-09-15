<script setup lang="ts">
import { useData } from 'vitepress'
import PageHero from '../common/PageHero.vue'

const { frontmatter } = useData()

</script>

<template>
  <div class="changelog-container">
    <!-- 页面头部 - 使用 PageHero 组件 -->
    <PageHero
      :title="frontmatter.title || ''"
      :description="frontmatter.description || ''"
      icon="icon-[tabler--news]"
      color="primary"
      align="center"
      size="md"
    />

    <!-- 更新日志内容 -->
    <main class="changelog-main">
      <div class="changelog-main-container">
        <div class="changelog-content prose-content">
          <Content />
        </div>
      </div>
    </main>
  </div>
</template>

