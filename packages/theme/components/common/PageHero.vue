<script setup lang="ts">
import { computed } from 'vue'
import { useIcon } from '../../composables/useIcon'
import { useLink } from '../../composables/useLink'

interface Props {
  title?: string
  description?: string
  icon?: string
  align?: 'left' | 'center'
  color?: 'primary' | 'sponsor' | 'success' | 'warning' | 'danger' | 'info' | 'gray'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  align: 'center',
  color: 'primary',
  size: 'md'
})

const { getIconClass, isEmoji, isImageUrl } = useIcon()
const { resolveAsset } = useLink()

// 计算图标类型
const iconType = computed(() => {
  if (!props.icon) return null
  if (isEmoji(props.icon)) return 'emoji'
  if (isImageUrl(props.icon)) return 'image'
  return 'class'
})

// 获取处理后的图标类名
const iconClass = computed(() => {
  if (!props.icon || iconType.value !== 'class') return ''
  return getIconClass(props.icon)
})
</script>

<template>
  <div :class="[
    'page-hero',
    `page-hero--${color}`,
    `page-hero--${align}`,
    `page-hero--${size}`
  ]">
    <div class="page-hero-container">
      <div class="page-hero-content">
        <!-- 图标显示 -->
        <div v-if="icon && iconType === 'emoji'" class="page-hero-icon text-4xl">
          {{ icon }}
        </div>
        <img v-else-if="icon && iconType === 'image'" :src="resolveAsset(icon)" class="page-hero-icon w-12 h-12" />
        <div v-else-if="icon && iconType === 'class'" :class="['page-hero-icon', iconClass]"></div>
        
        <h1 v-if="title" class="page-hero-title">
          {{ title }}
        </h1>
        
        <p v-if="description" class="page-hero-description">
          {{ description }}
        </p>
        
        <!-- 插槽支持自定义内容 -->
        <slot />
      </div>
    </div>
  </div>
</template>