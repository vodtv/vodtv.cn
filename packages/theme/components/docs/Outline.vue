<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

const { page, theme } = useData()
const route = useRoute()

// 获取配置的 outline 选项
const outlineConfig = computed(() => theme.value.outline || {})
const outlineLabel = computed(() => outlineConfig.value.label || 'Outline')
const outlineLevel = computed(() => {
  const level = outlineConfig.value.level || 2
  if (level === 'deep') return [2, 6]
  if (Array.isArray(level)) return level
  return [2, level]
})

// 当前激活的标题
const activeHeading = ref('')

// 从 DOM 中提取标题
const extractHeadingsFromDOM = () => {
  const [minLevel, maxLevel] = outlineLevel.value
  const headings: Array<{ title: string; anchor: string; level: number }> = []
  
  // 查找所有标题元素
  const headingElements = document.querySelectorAll('.prose-content h1, .prose-content h2, .prose-content h3, .prose-content h4, .prose-content h5, .prose-content h6')
  
  headingElements.forEach((el, index) => {
    const level = parseInt(el.tagName.substring(1))
    
    if (level >= minLevel && level <= maxLevel) {
      // 确保标题有ID
      let anchor = el.id
      if (!anchor) {
        anchor = `heading-${index}`
        el.id = anchor
      }
      
      headings.push({
        title: el.textContent || '',
        anchor,
        level
      })
    }
  })
  
  return headings
}

// 计算要显示的标题
const headings = ref<Array<{ title: string; anchor: string; level: number }>>([])

// 设置滚动监听
const setupScrollSpy = (headingList: Array<{ anchor: string }>) => {
  if (!headingList.length) return

  const headingElements = headingList
    .map(h => document.getElementById(h.anchor))
    .filter(Boolean) as HTMLElement[]

  if (!headingElements.length) return

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        activeHeading.value = entry.target.id
        break
      }
    }
  }, {
    rootMargin: '-20% 0% -80% 0%',
    threshold: 0
  })

  headingElements.forEach(el => observer.observe(el))

  return () => {
    observer.disconnect()
  }
}

let cleanup: (() => void) | undefined

// 更新 TOC 的函数
const updateOutline = async () => {
  // 清理之前的观察器
  cleanup?.()
  
  // 等待内容渲染完成
  await nextTick()
  
  setTimeout(() => {
    // 提取标题
    headings.value = extractHeadingsFromDOM()
    
    // 设置滚动监听
    if (headings.value.length > 0) {
      cleanup = setupScrollSpy(headings.value)
    }
  }, 200)
}

// 监听路由变化
watch(() => route.path, () => {
  // 重置状态
  activeHeading.value = ''
  headings.value = []
  
  // 更新 TOC
  updateOutline()
})

onMounted(() => {
  updateOutline()
})

onUnmounted(() => {
  cleanup?.()
})

// 点击处理
const handleClick = (anchor: string) => {
  const el = document.getElementById(anchor)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    activeHeading.value = anchor
  }
}
</script>

<template>
  <div v-if="headings.length > 0" class="sticky top-16 -mt-10 pt-4">
    <div class="space-y-2">
      <p class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
        {{ outlineLabel }}
      </p>
      
      <div class="space-y-1 border-l border-gray-200 dark:border-gray-700 pl-4">
        <a
          v-for="heading in headings"
          :key="heading.anchor"
          :href="`#${heading.anchor}`"
          :class="[
            'block py-1.5 text-sm transition-all duration-200',
            'hover:text-gray-700 dark:hover:text-gray-300',
            activeHeading === heading.anchor 
              ? 'text-primary-600 dark:text-primary-400 font-medium bg-primary-50/50 dark:bg-primary-500/10 rounded-r-md border-l-2 border-primary-500 dark:border-primary-400 -ml-4 pl-3'
              : 'text-gray-500 dark:text-gray-400',
            {
              'pl-0': heading.level === 2,
              'pl-4 text-sm': heading.level === 3,
              'pl-8 text-sm opacity-75': heading.level >= 4
            }
          ]"
          @click.prevent="handleClick(heading.anchor)"
        >
          {{ heading.title }}
        </a>
      </div>
    </div>
  </div>
</template>