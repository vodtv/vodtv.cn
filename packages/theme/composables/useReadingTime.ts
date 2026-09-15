import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import { useLocale } from './useLocale'

export function useReadingTime() {
  const contentText = ref('')
  const readingTimeLocale = useLocale('readingTime')
  const route = useRoute()
  
  const updateContent = () => {
    // 延迟执行以确保 DOM 已更新
    setTimeout(() => {
      const contentElement = document.querySelector('.prose-content')
      if (contentElement) {
        contentText.value = contentElement.textContent || ''
      } else {
        contentText.value = ''
      }
    }, 100)
  }
  
  onMounted(() => {
    updateContent()
  })
  
  // 监听路由变化，更新内容
  watch(() => route.path, () => {
    updateContent()
  })
  
  const readingTime = computed(() => {
    const text = contentText.value
    const locale = readingTimeLocale.value
    
    if (!text) {
      return {
        words: 0,
        minutes: 0,
        time: locale.minute || '1 minute',
        wordsText: `0 ${locale.words || 'words'}`
      }
    }
    
    // 移除多余的空白字符
    const plainText = text
      .replace(/\s+/g, ' ') // 规范化空白字符
      .trim()
    
    // 计算字数
    // 中文字符计数
    const chineseChars = plainText.match(/[\u4e00-\u9fa5]/g) || []
    const chineseCount = chineseChars.length
    
    // 英文单词计数
    const englishWords = plainText
      .replace(/[\u4e00-\u9fa5]/g, '') // 移除中文字符
      .split(/\s+/)
      .filter(word => word.length > 0)
    const englishCount = englishWords.length
    
    // 计算总字数（中文字符 + 英文单词）
    const totalWords = chineseCount + englishCount
    
    // 计算阅读时间（假设阅读速度：中文 300字/分钟，英文 200词/分钟）
    const chineseReadingTime = chineseCount / 300
    const englishReadingTime = englishCount / 200
    const totalMinutes = Math.ceil(chineseReadingTime + englishReadingTime)
    
    // 至少显示 1 分钟
    const minutes = Math.max(1, totalMinutes)
    
    const minuteText = minutes <= 1 
      ? locale.minute || '1 minute'
      : (locale.minutes || `${minutes} minutes`)
    
    const timeText = minuteText.replace('{n}', String(minutes))
    
    return {
      words: totalWords,
      minutes: minutes,
      time: timeText,
      wordsText: `${totalWords} ${locale.words || 'words'}`
    }
  })
  
  return {
    readingTime,
    readingTimeLocale
  }
}