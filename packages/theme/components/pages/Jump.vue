<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useData } from 'vitepress'
import { useLocale } from '../../composables/useLocale'
import { useLink } from '../../composables/useLink'

const { site, frontmatter } = useData()
const { resolveLink } = useLink()
const jumpTexts = useLocale('jump')

// 配置
const showManualSelect = ref(false)
const countdown = ref(3)

// 获取可用语言列表
const availableLocales = computed(() => {
  const locales = site.value.locales || {}
  return Object.entries(locales).map(([key, locale]) => {
    const localeData = locale as any
    // 获取实际的语言代码
    const langCode = localeData.lang || key
    
    // 获取实际的跳转路径
    let targetPath = ''
    if (localeData.link) {
      // 使用配置的 link
      targetPath = resolveLink(localeData.link)
    } else if (key === 'root') {
      // root 如果没有配置 link，使用语言代码作为路径
      targetPath = resolveLink(`/${langCode}/`)
    } else {
      // 其他语言使用 key 作为路径
      targetPath = resolveLink(`/${key}/`)
    }
    
    return {
      key: key,
      label: localeData.label || key,
      lang: langCode,
      path: targetPath
    }
  })
})

// 文本内容
const localizedTexts = computed(() => ({
  redirecting: jumpTexts.value?.redirecting || 'Redirecting to preferred language...',
  redirectingSecondary: jumpTexts.value?.redirectingSecondary || '',
  orChooseLanguage: jumpTexts.value?.orChooseLanguage || 'Or choose language',
  orChooseLanguageSecondary: jumpTexts.value?.orChooseLanguageSecondary || '',
  countdown: jumpTexts.value?.countdown || 's'
}))

// 检测用户语言偏好
const detectUserLanguage = () => {
  // 1. URL 参数优先
  const urlLang = new URLSearchParams(window.location.search).get('lang')
  if (urlLang) {
    const match = availableLocales.value.find(l => l.lang === urlLang || l.key === urlLang)
    if (match) return match.key
  }
  
  // 2. 浏览器语言
  const browserLang = navigator.language?.toLowerCase().replace('_', '-')
  if (browserLang) {
    // 精确匹配语言代码
    const exact = availableLocales.value.find(l => 
      l.lang.toLowerCase() === browserLang
    )
    if (exact) return exact.key
    
    // 前缀匹配
    const prefix = browserLang.split('-')[0]
    const match = availableLocales.value.find(l => 
      l.lang.toLowerCase().startsWith(prefix)
    )
    if (match) return match.key
  }
  
  // 3. 默认使用第一个配置的语言
  return availableLocales.value[0]?.key || 'root'
}

// 执行跳转
const jumpToLocale = (localeKey: string) => {
  const target = availableLocales.value.find(l => l.key === localeKey)
  if (target) {
    window.location.href = target.path
  }
}

onMounted(() => {
  const targetLocale = detectUserLanguage()
  showManualSelect.value = true
  
  // 倒计时跳转
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      jumpToLocale(targetLocale)
    }
  }, 1000)
})
</script>

<template>
  <div class="jump-layout min-h-screen flex items-center justify-center bg-linear-to-br from-white via-primary-50/30 to-primary-100/50 dark:bg-linear-to-br dark:from-gray-900 dark:via-gray-800/50 dark:to-primary-950/30">
    <!-- 背景装饰元素 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-32 w-80 h-80 bg-primary-200/20 dark:bg-primary-800/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-32 w-96 h-96 bg-primary-300/15 dark:bg-primary-700/15 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-linear-to-r from-primary-100/10 to-primary-200/10 dark:from-primary-900/10 dark:to-primary-800/10 rounded-full blur-3xl"></div>
    </div>

    <div class="text-center z-10 max-w-md mx-auto px-6">
      <!-- Logo 或标题 -->
      <div class="mb-8">
        <div class="icon-[heroicons--globe-alt] w-16 h-16 text-primary-500 mx-auto mb-4"></div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ frontmatter.title || site.title }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ frontmatter.description || site.description }}
        </p>
      </div>

      <!-- 跳转提示 -->
      <div class="mb-8">
        <div class="flex items-center justify-center mb-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
        
        <p class="text-gray-700 dark:text-gray-300 mb-2">
          {{ localizedTexts.redirecting }}
        </p>
        <p v-if="localizedTexts.redirectingSecondary" class="text-sm text-gray-500 dark:text-gray-400">
          {{ localizedTexts.redirectingSecondary }}
        </p>
        
        <div v-if="countdown > 0" class="mt-4">
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300">
            <div class="icon-[heroicons--clock] w-4 h-4 mr-2"></div>
            {{ countdown }}{{ localizedTexts.countdown }}
          </div>
        </div>
      </div>

      <!-- 手动语言选择 -->
      <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 transform scale-95 translate-y-4"
        enter-to-class="opacity-100 transform scale-100 translate-y-0"
      >
        <div v-if="showManualSelect" class="mt-8">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            <span>{{ localizedTexts.orChooseLanguage }}</span>
            <span v-if="localizedTexts.orChooseLanguageSecondary" class="block text-xs mt-1">
              {{ localizedTexts.orChooseLanguageSecondary }}
            </span>
          </p>
          
          <div class="flex flex-wrap justify-center gap-3">
            <button
              v-for="locale in availableLocales"
              :key="locale.key"
              @click="jumpToLocale(locale.key)"
              class="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all group"
            >
              <span class="text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-300 font-medium">
                {{ locale.label }}
              </span>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>