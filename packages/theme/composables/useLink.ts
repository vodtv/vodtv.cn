import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

/**
 * 处理链接和资源路径，自动添加 base 前缀
 */
export function useLink() {
  const { site } = useData()
  
  /**
   * 判断是否为外部链接
   */
  const isExternalLink = (link: string): boolean => {
    return /^https?:\/\//.test(link)
  }
  
  /**
   * 获取带 base 的链接
   * @param link 原始链接
   * @returns 处理后的链接
   */
  const resolveLink = (link: string | undefined): string => {
    if (!link) return ''
    
    // 外部链接不处理
    if (isExternalLink(link)) {
      return link
    }
    
    // 锚点链接不处理
    if (link.startsWith('#')) {
      return link
    }
    
    // 使用 VitePress 的 withBase 函数
    return withBase(link)
  }
  
  /**
   * 处理静态资源路径（图片、视频等）
   * 适用于 public 目录下的资源
   */
  const resolveAsset = (path: string | undefined): string => {
    if (!path) return ''
    
    // 外部资源不处理
    if (/^https?:\/\//.test(path)) {
      return path
    }
    
    // data: URLs 不处理
    if (path.startsWith('data:')) {
      return path
    }
    
    // 使用 withBase 处理资源路径
    return withBase(path)
  }
  
  /**
   * 批量处理导航项的链接
   */
  const resolveNavLinks = (items: any[]): any[] => {
    return items.map(item => ({
      ...item,
      link: item.link ? resolveLink(item.link) : undefined,
      items: item.items ? resolveNavLinks(item.items) : undefined
    }))
  }
  
  /**
   * 处理侧边栏链接
   */
  const resolveSidebarLinks = (sidebar: any): any => {
    if (!sidebar) return sidebar
    
    // 数组格式
    if (Array.isArray(sidebar)) {
      return sidebar.map(item => ({
        ...item,
        link: item.link ? resolveLink(item.link) : undefined,
        items: item.items ? resolveSidebarLinks(item.items) : undefined
      }))
    }
    
    // 对象格式（多路径配置）
    if (typeof sidebar === 'object') {
      const resolved: any = {}
      for (const [path, config] of Object.entries(sidebar)) {
        resolved[path] = resolveSidebarLinks(config)
      }
      return resolved
    }
    
    return sidebar
  }
  
  return {
    isExternalLink,
    resolveLink,
    resolveAsset,
    resolveNavLinks,
    resolveSidebarLinks
  }
}