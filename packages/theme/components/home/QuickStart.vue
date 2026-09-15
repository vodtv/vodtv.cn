<script setup lang="ts">
import { computed } from 'vue'
import { useIcon } from '../../composables/useIcon'
import { useLink } from '../../composables/useLink'

// 定义 Props
interface Props {
  quickStart?: {
    title?: string
    subtitle?: string
    badge?: string
    description?: string
    steps?: Array<{
      step: string
      title: string
      description: string
      code: string
      icon: string
      color: string
    }>
    helpText?: string
    helpLink?: string
    helpLinkText?: string
  }
}

const props = defineProps<Props>()
const { getIconClass } = useIcon()
const { resolveLink } = useLink()

// 使用 computed 使 steps 响应式
const steps = computed(() => props.quickStart?.steps || [])

// 使用 computed 处理 steps，添加图标类名
const processedSteps = computed(() => 
  steps.value.map((step: any) => ({
    ...step,
    iconClass: typeof step.icon === 'string' ? getIconClass(step.icon) : step.icon
  }))
)

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
</script>

<template>
  <section v-if="quickStart" class="section-padding bg-gray-50 dark:bg-gray-950/25 overflow-hidden relative">
    <!-- 背景装饰 -->
    <div class="absolute inset-0">
      <div class="absolute top-1/2 left-0 w-64 h-64 bg-primary-100/30 dark:bg-primary-800/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
      <div class="absolute top-1/2 right-0 w-80 h-80 bg-primary-200/20 dark:bg-primary-700/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
    </div>

    <div class="container-section">
      <!-- 标题区域 -->
      <div class="text-center max-w-3xl mx-auto mb-20">
        <div v-if="quickStart.badge" class="badge-primary mb-6">
          <div class="icon-[heroicons--clock] w-4 h-4 text-primary-600 dark:text-primary-400 mr-2"></div>
          <span class="text-sm font-medium text-primary-700 dark:text-primary-300">{{ quickStart.badge }}</span>
        </div>
        
        <h2 v-if="quickStart.title || quickStart.subtitle" class="text-section-title mb-6">
          <span v-if="quickStart.subtitle" class="text-primary-linear">
            {{ quickStart.subtitle }}
          </span>
          {{ quickStart.title && quickStart.title.replace(quickStart.subtitle || '', '').trim() }}
        </h2>
        
        <p v-if="quickStart.description" class="text-xl text-muted">
          {{ quickStart.description }}
        </p>
      </div>

      <!-- 步骤网格 -->
      <div v-if="steps.length" class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          <!-- 连接线 -->
          <div class="hidden lg:block absolute top-20 left-1/6 right-1/6 h-0.5 bg-linear-to-r from-primary-200 via-primary-300 to-primary-200 dark:from-primary-700 dark:via-primary-600 dark:to-primary-700"></div>
          
          <!-- 背景装饰 - 增强毛玻璃效果 -->
          <div class="absolute inset-0 opacity-60">
            <div class="absolute top-10 left-10 w-32 h-32 bg-primary-300/40 dark:bg-primary-700/40 rounded-full blur-2xl"></div>
            <div class="absolute bottom-10 right-10 w-40 h-40 bg-primary-400/30 dark:bg-primary-600/30 rounded-full blur-2xl"></div>
            <div class="absolute top-1/2 left-1/3 w-28 h-28 bg-primary-200/50 dark:bg-primary-800/50 rounded-full blur-xl"></div>
          </div>
          
          <div 
            v-for="(step, index) in processedSteps"
            :key="index"
            class="relative group scale-in"
            :style="`animation-delay: ${index * 0.2}s;`"
          >
            <!-- 连接点 -->
            <div class="hidden lg:block absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary-400 dark:bg-primary-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg z-10"></div>
            
            <!-- 卡片 - 使用flex保持相同高度 -->
            <div class="relative backdrop-blur rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-8 bg-white/95 dark:bg-gray-800/95 border border-gray-100 dark:border-gray-600/30 group-hover:border-primary-100/60 dark:group-hover:border-primary-600/60 h-full flex flex-col">
              <!-- 背景渐变 -->
              <div class="absolute inset-0 bg-linear-to-br from-primary-50/50 to-transparent dark:from-primary-900/20 dark:to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div class="relative flex flex-col h-full">
                <!-- 步骤编号和图标 -->
                <div class="flex items-center justify-between mb-6">
                  <div :class="`flex items-center justify-center shadow-lg w-16 h-16 rounded-2xl bg-linear-to-br ${getColorClass(step.color)} group-hover:scale-110 transition-transform duration-300`">
                    <!-- 如果是 emoji 或 HTML，直接显示 -->
                    <div v-if="!step.iconClass.startsWith('icon-[')" v-html="step.iconClass" class="w-8 h-8 text-white text-2xl flex items-center justify-center"></div>
                    <!-- 如果是 heroicons 类名 -->
                    <div v-else :class="`${step.iconClass} w-8 h-8 text-white`"></div>
                  </div>
                  <div class="text-right">
                    <span class="text-4xl font-bold text-gray-200 dark:text-gray-600 group-hover:text-primary-300 dark:group-hover:text-primary-400 transition-colors">
                      {{ step.step }}
                    </span>
                  </div>
                </div>
                
                <!-- 内容 -->
                <div class="space-y-4 flex-1 flex flex-col">
                  <h3 class="text-card-title group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {{ step.title }}
                  </h3>
                  
                  <p class="text-muted">
                    {{ step.description }}
                  </p>
                  
                  <!-- 代码块 - 占用剩余空间 -->
                  <div class="relative flex-1">
                    <div class="h-full bg-gray-900 dark:bg-black rounded-xl p-4 overflow-x-auto">
                      <div class="flex items-center mb-2">
                        <div class="flex space-x-2">
                          <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                      <code class="text-sm font-mono text-green-400 whitespace-pre-wrap">$ {{ step.code }}</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 额外提示 -->
        <div v-if="quickStart.helpText || quickStart.helpLink" class="mt-20 text-center">
          <div class="inline-flex items-center px-6 py-3 bg-linear-to-r from-primary-50 to-primary-100 dark:from-primary-900/50 dark:to-primary-800/50 border border-primary-200/50 dark:border-primary-700/50 rounded-2xl">
            <div class="icon-[heroicons--information-circle] w-5 h-5 text-primary-600 dark:text-primary-400 mr-3"></div>
            <span class="text-primary-700 dark:text-primary-300 font-medium">
              {{ quickStart.helpText }}
              <a v-if="quickStart.helpLink" :href="resolveLink(quickStart.helpLink)" class="underline hover:no-underline">
                {{ quickStart.helpLinkText }}
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>