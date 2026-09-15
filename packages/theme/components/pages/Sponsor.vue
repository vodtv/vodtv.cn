<script setup lang="ts">
import { useData } from 'vitepress'
import { ref, computed } from 'vue'
import PageHero from '../common/PageHero.vue'
import { useLocale } from '../../composables/useLocale'
import { useIcon } from '../../composables/useIcon'
import { useLink } from '../../composables/useLink'

const { frontmatter } = useData()
const { isEmoji, isImageUrl } = useIcon()
const { resolveAsset } = useLink()

// 获取多语言配置
const locale = useLocale('sponsor')

// 支付方式切换
const activeMethod = ref<string>('wechat')

// 从 frontmatter 获取支持者记录
const sponsors = computed(() => {
  return frontmatter.value.sponsors || []
})

// 计算统计信息
const stats = computed(() => {
  const list = sponsors.value
  const totalAmount = list.reduce((sum: number, sponsor: any) => sum + (sponsor.amount || 0), 0)
  const totalSponsors = list.length
  return {
    totalAmount,
    totalSponsors
  }
})

// 支付方式配置
const paymentMethods = computed(() => {
  return frontmatter.value.paymentMethods || {}
})

// 获取激活按钮的类名
const getActiveButtonClass = (color: string) => {
  const colorMap = {
    green: 'bg-green-500 text-white shadow-lg',
    blue: 'bg-blue-500 text-white shadow-lg', 
    indigo: 'bg-indigo-500 text-white shadow-lg',
    red: 'bg-red-500 text-white shadow-lg',
    yellow: 'bg-yellow-500 text-white shadow-lg',
    purple: 'bg-purple-500 text-white shadow-lg'
  }
  return colorMap[color] || 'bg-primary-500 text-white shadow-lg'
}

// 判断图标类型
const getIconType = (icon: string | undefined): 'class' | 'emoji' | 'image' | 'svg' => {
  if (!icon) return 'class'
  
  // 检查是否是图片 URL
  if (isImageUrl(icon)) {
    return 'image'
  }
  
  // 检查是否是 SVG
  if (icon.includes('<svg') || icon.endsWith('.svg')) {
    return 'svg'
  }
  
  // 检查是否是 emoji
  if (isEmoji(icon)) {
    return 'emoji'
  }
  
  // 默认作为类名处理
  return 'class'
}
</script>

<template>
  <div class="sponsor-container">
    <!-- 页面头部 - 使用 PageHero 组件 -->
    <PageHero
      :title="frontmatter.title"
      :description="frontmatter.description"
      icon="icon-[tabler--heart-filled]"
      color="sponsor"
      align="center"
      size="md"
    />

    <!-- 主要内容 -->
    <main class="sponsor-main">
      <div class="sponsor-main-container">
        <div class="sponsor-grid">
          
          <!-- 支付方式 -->
          <div class="sponsor-form">
            <div class="sponsor-card">
              <h2 class="sponsor-card-title">
                {{ locale.selectPaymentMethod }}
              </h2>
              
              <!-- 支付方式标签 -->
              <div class="sponsor-payment-methods">
                <button
                  v-for="(method, key) in paymentMethods"
                  :key="key"
                  @click="activeMethod = String(key)"
                  :class="[
                    'sponsor-payment-btn',
                    activeMethod === String(key)
                      ? getActiveButtonClass(method.color)
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  <!-- 根据图标类型显示不同的内容 -->
                  <template v-if="method.icon">
                    <!-- Emoji 图标 -->
                    <span v-if="getIconType(method.icon) === 'emoji'" class="sponsor-payment-icon text-lg">
                      {{ method.icon }}
                    </span>
                    
                    <!-- 图片图标 -->
                    <img 
                      v-else-if="getIconType(method.icon) === 'image'"
                      :src="resolveAsset(method.icon)"
                      :alt="method.name"
                      class="sponsor-payment-icon w-5 h-5 object-contain"
                    />
                    
                    <!-- SVG 图标（如果是 .svg 文件） -->
                    <img 
                      v-else-if="getIconType(method.icon) === 'svg' && method.icon.endsWith('.svg')"
                      :src="resolveAsset(method.icon)"
                      :alt="method.name"
                      class="sponsor-payment-icon w-5 h-5"
                    />
                    
                    <!-- 内联 SVG -->
                    <div 
                      v-else-if="getIconType(method.icon) === 'svg' && method.icon.includes('<svg')"
                      v-html="method.icon"
                      class="sponsor-payment-icon w-5 h-5"
                    ></div>
                    
                    <!-- 图标类名 -->
                    <div v-else :class="method.icon + ' sponsor-payment-icon'"></div>
                  </template>
                  
                  <!-- 默认图标 -->
                  <div v-else class="icon-[tabler--coin] sponsor-payment-icon"></div>
                  
                  {{ method.name }}
                </button>
              </div>
              
              <!-- 支付二维码或链接 -->
              <div class="sponsor-payment-qrcode">
                <div v-if="paymentMethods[activeMethod].qrcode" class="sponsor-payment-qrcode-wrapper">
                  <img 
                    :src="resolveAsset(paymentMethods[activeMethod].qrcode)" 
                    :alt="paymentMethods[activeMethod].name"
                    class="sponsor-payment-qrcode-img"
                  />
                  <p class="sponsor-payment-qrcode-text">
                    {{ paymentMethods[activeMethod].description }}
                  </p>
                </div>
                
                <div v-else-if="paymentMethods[activeMethod].link" class="text-center">
                  <a 
                    :href="paymentMethods[activeMethod].link"
                    target="_blank"
                    class="sponsor-payment-link"
                  >
                    <div class="icon-[tabler--external-link] h-5 w-5"></div>
                    {{ paymentMethods[activeMethod].name }}
                  </a>
                  <p class="sponsor-payment-description">
                    {{ paymentMethods[activeMethod].description }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 内容卡片 -->
            <div class="sponsor-card">
              <div class="sponsor-content prose-content">
                <Content />
              </div>
            </div>
          </div>

          <!-- 右侧：支持者记录 -->
          <div class="sponsor-sidebar">
            <div class="sponsor-sidebar-card">
              <h3 class="sponsor-sidebar-title">
                <div class="sponsor-sidebar-icon icon-[tabler--users]"></div>
                {{ locale.recentSupporters }}
              </h3>
              
              <div class="sponsor-list">
                <div
                  v-for="(sponsor, index) in sponsors"
                  :key="index"
                  class="sponsor-list-item"
                >
                  <!-- 头像 -->
                  <div class="sponsor-avatar">
                    {{ sponsor.name.charAt(0) }}
                  </div>
                  
                  <!-- 信息 -->
                  <div class="sponsor-info">
                    <div class="sponsor-info-header">
                      <span class="sponsor-info-name">{{ sponsor.name }}</span>
                      <span class="sponsor-info-amount">¥{{ sponsor.amount }}</span>
                    </div>
                    <p class="sponsor-info-message">
                      {{ sponsor.message }}
                    </p>
                    <p class="sponsor-info-date">
                      {{ sponsor.date }}
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- 统计信息 -->
              <div class="sponsor-stats">
                <div class="sponsor-stats-grid">
                  <div>
                    <p class="sponsor-stats-value">{{ stats.totalSponsors }}</p>
                    <p class="sponsor-stats-label">{{ locale.totalSupporters }}</p>
                  </div>
                  <div>
                    <p class="sponsor-stats-value">¥{{ stats.totalAmount.toLocaleString() }}</p>
                    <p class="sponsor-stats-label">{{ locale.totalAmount }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
