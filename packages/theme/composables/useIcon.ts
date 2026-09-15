import { computed, type Ref } from 'vue'

/**
 * 处理图标类名的 composable
 * 支持 emoji、heroicons 和自定义图标类
 */
export function useIcon() {
  /**
   * 生成图标类名
   * @param iconName 图标名称或 emoji
   * @returns 处理后的图标类名或原始值
   */
  const getIconClass = (iconName: string | undefined): string => {
    if (!iconName) return ''
    
    // 如果已经是完整的类名，直接返回
    if (iconName.startsWith('icon-[')) {
      return iconName
    }
    
    // 如果是 emoji 或其他非 heroicons 图标，直接返回
    if (!iconName.includes('-') || iconName.length <= 3) {
      return iconName
    }
    
    // 如果包含 -- 说明已经包含了图标集前缀
    if (iconName.includes('--')) {
      return `icon-[${iconName}]`
    }
    
    // 默认使用 heroicons
    return `icon-[heroicons--${iconName}]`
  }
  
  /**
   * 创建响应式的图标类名
   * @param icon 响应式的图标名称
   * @returns 响应式的图标类名
   */
  const useIconClass = (icon: Ref<string | undefined>) => {
    return computed(() => getIconClass(icon.value))
  }
  
  /**
   * 判断是否为 emoji
   * @param icon 图标字符串
   * @returns 是否为 emoji
   */
  const isEmoji = (icon: string | undefined): boolean => {
    if (!icon) return false
    // 简单判断：长度小于等于3且不包含 -
    return !icon.includes('-') && icon.length <= 3
  }
  
  /**
   * 判断是否为图片URL
   * @param icon 图标字符串
   * @returns 是否为图片URL
   */
  const isImageUrl = (icon: string | undefined): boolean => {
    if (!icon) return false
    return icon.startsWith('http://') || 
           icon.startsWith('https://') || 
           icon.startsWith('/') ||
           icon.includes('.svg') ||
           icon.includes('.png') ||
           icon.includes('.jpg') ||
           icon.includes('.jpeg')
  }
  
  return {
    getIconClass,
    useIconClass,
    isEmoji,
    isImageUrl
  }
}