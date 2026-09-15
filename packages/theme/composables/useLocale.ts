import { useData } from 'vitepress'
import { computed } from 'vue'

// 语言包导入
import enUS from '../locales/en-US.json'
import zhCN from '../locales/zh-CN.json'
import zhTW from '../locales/zh-TW.json'
import jaJP from '../locales/ja-JP.json'
import koKR from '../locales/ko-KR.json'
import deDE from '../locales/de-DE.json'
import frFR from '../locales/fr-FR.json'
import esES from '../locales/es-ES.json'
import ruRU from '../locales/ru-RU.json'

// 内置语言包
const locales = {
  'en-US': enUS,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'de-DE': deDE,
  'fr-FR': frFR,
  'es-ES': esES,
  'ru-RU': ruRU,
  // 简化别名
  'en': enUS,
  'zh': zhCN,
  'ja': jaJP,
  'ko': koKR,
  'de': deDE,
  'fr': frFR,
  'es': esES,
  'ru': ruRU
}

/**
 * 获取当前语言的本地化文本
 * @param section 区域名称 (notFound, sponsor)
 * @returns 本地化文本对象
 */
export function useLocale(section: keyof typeof enUS) {
  const { theme, lang, site } = useData()
  
  return computed(() => {
    // 获取当前语言，优先级：VitePress lang -> site.lang -> 默认英文
    const currentLang = lang.value || site.value.lang || 'en-US'
    
    // 优先使用主题配置中的自定义文本（新的 langs 配置）
    const themeConfig = (theme.value as any)?.langs?.[section]
    if (themeConfig) {
      return { ...getBuiltinLocale(section, currentLang), ...themeConfig }
    }
    
    // 兼容旧的直接配置方式
    const legacyConfig = (theme.value as any)?.[section]
    if (legacyConfig) {
      return { ...getBuiltinLocale(section, currentLang), ...legacyConfig }
    }
    
    // 兼容更旧的 customPages 配置方式
    const customPagesConfig = (theme.value as any)?.customPages?.[section]
    if (customPagesConfig) {
      return { ...getBuiltinLocale(section, currentLang), ...customPagesConfig }
    }
    
    // 使用内置语言包
    return getBuiltinLocale(section, currentLang)
  })
}

/**
 * 获取内置语言包文本
 * @param section 区域名称
 * @param language 语言代码
 * @returns 本地化文本对象
 */
function getBuiltinLocale(section: keyof typeof enUS, language: string) {
  // 获取语言包，找不到则回退到英文
  const locale = locales[language as keyof typeof locales] || locales['en-US']
  return locale[section] || enUS[section]
}

/**
 * 获取支持的语言列表
 * @returns 语言代码数组
 */
export function getSupportedLocales() {
  return Object.keys(locales)
}