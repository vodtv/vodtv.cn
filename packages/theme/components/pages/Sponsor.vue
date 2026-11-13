<script setup lang="ts">
import { useData } from 'vitepress'
import PageHero from '../common/PageHero.vue'
import { useLocale } from '../../composables/useLocale'
import { useIcon } from '../../composables/useIcon'
import { useLink } from '../../composables/useLink'
import { ref, computed } from 'vue'
import { useSponsors } from '../../composables/sponsors'

const { frontmatter } = useData()
const { isEmoji, isImageUrl } = useIcon()
const { resolveAsset } = useLink()
const locale = useLocale('sponsor')
const activeMethod = ref<string>('wechat')

// 直接调用hook，自动触发远程请求
const { sponsors, stats, loading, errorMsg } = useSponsors()

const paymentMethods = computed(() => frontmatter.value.paymentMethods || {})

const getActiveButtonClass = (color: string) => {
  const colorMap: Record<string, string> = {
    green: 'bg-green-500 text-white shadow-lg',
    blue: 'bg-blue-500 text-white shadow-lg',
    indigo: 'bg-indigo-500 text-white shadow-lg',
    red: 'bg-red-500 text-white shadow-lg',
    yellow: 'bg-yellow-500 text-white shadow-lg',
    purple: 'bg-purple-500 text-white shadow-lg'
  }
  return colorMap[color] || 'bg-primary-500 text-white shadow-lg'
}

const getIconType = (icon: string | undefined): 'class' | 'emoji' | 'image' | 'svg' => {
  if (!icon) return 'class'
  if (isImageUrl(icon)) return 'image'
  if (icon.includes('<svg') || icon.endsWith('.svg')) return 'svg'
  if (isEmoji(icon)) return 'emoji'
  return 'class'
}

// 头像安全兜底
const getAvatarChar = (name: string) => name?.trim()?.charAt(0) || '友'
</script>

<template>
  <div class="sponsor-container">
    <PageHero :title="frontmatter.title" :description="frontmatter.description" icon="icon-[tabler--heart-filled]"
      color="sponsor" align="center" size="md" />

    <main class="sponsor-main">
      <div class="sponsor-main-container">
        <div class="sponsor-grid">
          <!-- 左侧：支付方式 -->
          <div class="sponsor-form">
            <div class="sponsor-card">
              <h2 class="sponsor-card-title">{{ locale.selectPaymentMethod }}</h2>

              <div class="sponsor-payment-methods">
                <button v-for="(method, key) in paymentMethods" :key="key" @click="activeMethod = String(key)" :class="[
                  'sponsor-payment-btn',
                  activeMethod === String(key)
                    ? getActiveButtonClass(method.color)
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                ]">
                  <template v-if="method.icon">
                    <span v-if="getIconType(method.icon) === 'emoji'" class="sponsor-payment-icon text-lg">
                      {{ method.icon }}
                    </span>
                    <img v-else-if="getIconType(method.icon) === 'image'" :src="resolveAsset(method.icon)"
                      :alt="method.name" class="sponsor-payment-icon w-5 h-5 object-contain" />
                    <img v-else-if="getIconType(method.icon) === 'svg' && method.icon.endsWith('.svg')"
                      :src="resolveAsset(method.icon)" :alt="method.name" class="sponsor-payment-icon w-5 h-5" />
                    <div v-else-if="getIconType(method.icon) === 'svg' && method.icon.includes('<svg')"
                      v-html="method.icon" class="sponsor-payment-icon w-5 h-5"></div>
                    <div v-else :class="method.icon + ' sponsor-payment-icon'"></div>
                  </template>
                  <div v-else class="icon-[tabler--coin] sponsor-payment-icon"></div>
                  {{ method.name }}
                </button>
              </div>

              <div class="sponsor-payment-qrcode">
                <div v-if="paymentMethods[activeMethod].qrcode" class="sponsor-payment-qrcode-wrapper">
                  <img :src="resolveAsset(paymentMethods[activeMethod].qrcode)" :alt="paymentMethods[activeMethod].name"
                    class="sponsor-payment-qrcode-img" />
                  <p class="sponsor-payment-qrcode-text">{{ paymentMethods[activeMethod].description }}</p>
                </div>
                <div v-else-if="paymentMethods[activeMethod].link" class="text-center">
                  <a :href="paymentMethods[activeMethod].link" target="_blank" class="sponsor-payment-link">
                    <div class="icon-[tabler--external-link] h-5 w-5"></div>
                    {{ paymentMethods[activeMethod].name }}
                  </a>
                  <p class="sponsor-payment-description">{{ paymentMethods[activeMethod].description }}</p>
                </div>
              </div>
            </div>

            <div class="sponsor-card">
              <div class="sponsor-content prose-content">
                <Content />
              </div>
            </div>
          </div>

          <!-- 右侧：支持者列表 -->
          <div class="sponsor-sidebar">
            <div class="sponsor-sidebar-card">
              <h3 class="sponsor-sidebar-title">
                <div class="sponsor-sidebar-icon icon-[tabler--users]"></div>
                {{ locale.recentSupporters }}
              </h3>

              <div class="sponsor-list">
                <div v-if="loading" class="sponsor-list-item text-center text-gray-400">
                  支持者数据加载中...
                </div>
                <div v-else-if="errorMsg" class="sponsor-list-item text-center text-red-400 text-sm">
                  {{ errorMsg }}
                </div>
                <div v-else-if="sponsors.length === 0" class="sponsor-list-item text-center text-gray-400">
                  暂无赞助记录
                </div>
                <template v-else>
                  <div v-for="(sponsor, index) in sponsors" :key="index" class="sponsor-list-item">
                    <div class="sponsor-avatar">
                      {{ getAvatarChar(sponsor.name) }}
                    </div>
                    <div class="sponsor-info">
                      <div class="sponsor-info-header">
                        <span class="sponsor-info-name">{{ sponsor.name }}</span>
                        <span class="sponsor-info-amount">¥{{ sponsor.amount }}</span>
                      </div>
                      <p class="sponsor-info-message">{{ sponsor.message }}</p>
                      <p class="sponsor-info-date">{{ sponsor.date }}</p>
                    </div>
                  </div>
                </template>
              </div>

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