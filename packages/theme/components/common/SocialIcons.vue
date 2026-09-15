<template>
  <div :class="containerClass">
    <a
      v-for="social in socialLinks"
      :key="social.link"
      :href="social.link"
      :aria-label="social.ariaLabel || social.icon"
      target="_blank"
      rel="noopener noreferrer"
      :class="iconClass"
    >
      <div v-if="social.icon === 'github'" :class="`icon-[tabler--brand-github] ${iconSizeClass}`"></div>
      <div v-else-if="social.icon === 'twitter'" :class="`icon-[tabler--brand-twitter] ${iconSizeClass}`"></div>
      <div v-else-if="social.icon === 'x'" :class="`icon-[tabler--brand-x] ${iconSizeClass}`"></div>
      <div v-else-if="social.icon === 'discord'" :class="`icon-[tabler--brand-discord] ${iconSizeClass}`"></div>
      <div v-else-if="social.icon === 'facebook'" :class="`icon-[tabler--brand-facebook] ${iconSizeClass}`"></div>
      <div v-else-if="social.icon === 'instagram'" :class="`icon-[tabler--brand-instagram] ${iconSizeClass}`"></div>
      <div v-else-if="social.icon === 'linkedin'" :class="`icon-[tabler--brand-linkedin] ${iconSizeClass}`"></div>
      <div v-else-if="social.icon === 'slack'" :class="`icon-[tabler--brand-slack] ${iconSizeClass}`"></div>
      <div v-else-if="social.icon === 'youtube'" :class="`icon-[tabler--brand-youtube] ${iconSizeClass}`"></div>
      <div v-else-if="social.icon === 'telegram'" :class="`icon-[tabler--brand-telegram] ${iconSizeClass}`"></div>
      <div v-else-if="social.icon === 'whatsapp'" :class="`icon-[tabler--brand-whatsapp] ${iconSizeClass}`"></div>
      <div v-else-if="social.icon === 'reddit'" :class="`icon-[tabler--brand-reddit] ${iconSizeClass}`"></div>
      <div v-else-if="social.icon === 'mastodon'" :class="`icon-[tabler--brand-mastodon] ${iconSizeClass}`"></div>
      <div v-else-if="typeof social.icon === 'object' && social.icon.svg" v-html="social.icon.svg" :class="iconSizeClass"></div>
      <div v-else :class="`icon-[tabler--link] ${iconSizeClass}`"></div>
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

interface Props {
  variant?: 'header' | 'footer'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'header'
})

const { theme } = useData()

// 获取社交链接配置
const socialLinks = computed(() => theme.value.socialLinks || [])

// 容器样式
const containerClass = computed(() => {
  if (props.class) return props.class
  
  switch (props.variant) {
    case 'header':
      return 'hidden sm:flex justify-center items-center gap-2'
    case 'footer':
      return 'flex items-center gap-3'
    default:
      return 'flex items-center gap-2'
  }
})

// 图标大小样式
const iconSizeClass = computed(() => {
  switch (props.variant) {
    case 'header':
      return 'h-4 w-4'
    case 'footer':
      return 'h-5 w-5'
    default:
      return 'h-4 w-4'
  }
})

// 图标按钮样式
const iconClass = computed(() => {
  switch (props.variant) {
    case 'header':
      return 'btn-ghost px-2 [w-2rem] h-[2rem]'
    case 'footer':
      return 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors'
    default:
      return 'btn-ghost px-2'
  }
})
</script>