<script setup lang="ts">
import { computed } from 'vue'
import { useIcon } from '../../composables/useIcon'
import { useLink } from '../../composables/useLink'

// 定义 Props
interface Props {
  features: any[]
  config?: {
    badge?: string
    title?: string
    subtitle?: string
    description?: string
    tags?: string[]
    extraSection?: {
      title?: string
      description?: string
      tags?: string[]
    }
  }
}

const props = defineProps<Props>()
const { getIconClass } = useIcon()
const { resolveLink } = useLink()

// 定义固定的颜色方案
const colorVariants = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600', 
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
  red: 'from-red-500 to-red-600',
  pink: 'from-pink-500 to-pink-600',
  indigo: 'from-indigo-500 to-indigo-600',
  teal: 'from-teal-500 to-teal-600',
  cyan: 'from-cyan-500 to-cyan-600',
  amber: 'from-amber-500 to-amber-600'
}

// 获取颜色样式的函数
const getColorClass = (color: string) => {
  return colorVariants[color as keyof typeof colorVariants] || colorVariants.blue
}

// 使用 computed 使 features 响应式
const processedFeatures = computed(() => 
  props.features.map((feature: any) => ({
    ...feature,
    icon: feature.icon || "star",
    color: feature.color || 'blue',
    iconClass: typeof feature.icon === 'string' ? getIconClass(feature.icon) : feature.icon,
    link: feature.link ? resolveLink(feature.link) : undefined
  }))
)
</script>

<template>
  <section v-if="processedFeatures.length" class="section-padding bg-white dark:bg-gray-900 overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0">
      <div class="absolute top-0 left-1/4 w-72 h-72 bg-primary-100/20 dark:bg-primary-800/20 rounded-full blur-3xl opacity-60"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-200/15 dark:bg-primary-700/15 rounded-full blur-3xl opacity-40"></div>
    </div>

    <div class="container-section">
      <!-- 标题区域 -->
      <div v-if="config" class="text-center max-w-3xl mx-auto mb-20">
        <div v-if="config.badge" class="badge-primary mb-6">
          <div class="icon-[heroicons--star] w-4 h-4 text-primary-600 dark:text-primary-400 mr-2"></div>
          <span class="text-sm font-medium text-primary-700 dark:text-primary-300">{{ config.badge }}</span>
        </div>
        
        <h2 v-if="config.title || config.subtitle" class="text-section-title mb-6">
          {{ config.title }}
          <span v-if="config.subtitle" class="text-primary-linear">
            {{ config.subtitle }}
          </span>
        </h2>
        
        <p v-if="config.description" class="text-xl text-muted">
          {{ config.description }}
        </p>
      </div>
      <!-- 特性网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
        <template v-for="(feature, index) in processedFeatures" :key="feature.title">
          <!-- 可点击的 feature（有链接） -->
          <a
            v-if="feature.link"
            :href="feature.link"
            :target="feature.target || '_self'"
            :rel="feature.target === '_blank' ? 'noopener noreferrer' : undefined"
            class="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 scale-in cursor-pointer"
            :style="`animation-delay: ${index * 0.1}s;`"
          >
            <!-- 内容区域 -->
            <div class="relative p-8">
              <!-- 图标区域 -->
              <div class="flex items-center mb-6">
                <div :class="`flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br ${getColorClass(feature.color)} shadow-sm group-hover:scale-105 transition-all duration-300`">
                  <!-- 如果是 emoji 或 HTML，直接显示 -->
                  <div v-if="!feature.iconClass.startsWith('icon-[')" v-html="feature.iconClass" class="w-7 h-7 text-white text-2xl flex items-center justify-center"></div>
                  <!-- 如果是 heroicons 类名 -->
                  <div v-else :class="`${feature.iconClass} w-7 h-7 text-white`"></div>
                </div>
              </div>
              
              <!-- 标题 -->
              <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                {{ feature.title }}
              </h3>
              
              <!-- 描述 -->
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                {{ feature.details }}
              </p>
            </div>
            
            <!-- 悬浮装饰箭头 - 只在有链接时显示 -->
            <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                <div class="icon-[heroicons--arrow-right] w-4 h-4 text-primary-600 dark:text-primary-400"></div>
              </div>
            </div>
          </a>

          <!-- 不可点击的 feature（无链接） -->
          <div
            v-else
            class="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 scale-in"
            :style="`animation-delay: ${index * 0.1}s;`"
          >
            <!-- 内容区域 -->
            <div class="relative p-8">
              <!-- 图标区域 -->
              <div class="flex items-center mb-6">
                <div :class="`flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br ${getColorClass(feature.color)} shadow-sm group-hover:scale-105 transition-all duration-300`">
                  <!-- 如果是 emoji 或 HTML，直接显示 -->
                  <div v-if="!feature.iconClass.startsWith('icon-[')" v-html="feature.iconClass" class="w-7 h-7 text-white text-2xl flex items-center justify-center"></div>
                  <!-- 如果是 heroicons 类名 -->
                  <div v-else :class="`${feature.iconClass} w-7 h-7 text-white`"></div>
                </div>
              </div>
              
              <!-- 标题 -->
              <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                {{ feature.title }}
              </h3>
              
              <!-- 描述 -->
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                {{ feature.details }}
              </p>
            </div>
            
            <!-- 无悬浮装饰（无链接时不显示箭头） -->
          </div>
        </template>
      </div>
    </div>


    <div v-if="config?.extraSection" class="container-section">
      <div class="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary-500 via-primary-600 to-primary-500 dark:from-primary-600 dark:via-primary-700 dark:to-primary-600 p-12 text-center shadow-2xl">        
        <div class="relative">
          <h3 v-if="config?.extraSection?.title" class="text-3xl md:text-4xl font-bold text-white mb-6">
            {{ config.extraSection.title }}
          </h3>
          <p v-if="config?.extraSection?.description" class="text-xl text-primary-100 dark:text-primary-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            {{ config.extraSection.description }}
          </p>
          
          <!-- 标签 -->
          <div v-if="config?.extraSection?.tags?.length || config?.tags?.length" class="flex flex-wrap justify-center gap-3">
            <span 
              v-for="tag in (config?.extraSection?.tags || config?.tags || [])"
              :key="tag"
              class="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium text-sm border border-white/30 hover:bg-white/30 transition-colors"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>