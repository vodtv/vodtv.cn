import { ref, watch } from 'vue'
import MiniSearch from 'minisearch'
import type { Ref } from 'vue'
import { data } from './search.data'

// 搜索结果接口
export interface SearchResult {
  id: string
  title: string
  text: string
  url: string
  section?: string
}

// 搜索状态
export const isSearchOpen = ref(false)
export const searchQuery = ref('')
export const searchResults: Ref<SearchResult[]> = ref([])
export const selectedIndex = ref(0)
export const searchIndex = ref<MiniSearch<SearchResult> | null>(null)
export const isLoading = ref(false)

// 初始化搜索索引
export async function initSearchIndex() {
  if (searchIndex.value) return
  
  isLoading.value = true
  
  try {
    // 创建 MiniSearch 实例，使用 VitePress 默认配置
    searchIndex.value = new MiniSearch<SearchResult>({
      fields: ['title', 'text', 'section'],
      storeFields: ['title', 'text', 'url', 'section']
    })
    
    // 添加所有文档到搜索索引
    searchIndex.value.addAll(data as any)
  } catch (error) {
    console.error('Failed to initialize search index:', error)
  } finally {
    isLoading.value = false
  }
}

// 执行搜索
export function performSearch(query: string) {
  if (!searchIndex.value || !query.trim()) {
    searchResults.value = []
    return
  }

  try {
    // 使用 VitePress 默认搜索配置
    const results = searchIndex.value.search(query, {
      fuzzy: 0.2,
      prefix: true,
      boost: { 
        title: 4, 
        text: 2, 
        section: 1 
      }
    })

    searchResults.value = results.map(result => ({
      id: result.id,
      title: result.title,
      text: result.text, 
      url: result.url,
      section: result.section
    }))
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []
  }

  selectedIndex.value = 0
}

// 打开搜索
export function openSearch() {
  isSearchOpen.value = true
  searchQuery.value = ''
  searchResults.value = []
  selectedIndex.value = 0
  
  // 初始化索引（如果还没有初始化）
  if (!searchIndex.value) {
    initSearchIndex()
  }
}

// 关闭搜索
export function closeSearch() {
  isSearchOpen.value = false
  searchQuery.value = ''
  searchResults.value = []
  selectedIndex.value = 0
}

// 选择搜索结果
export function selectResult(index: number, navigate?: (url: string) => void) {
  const result = searchResults.value[index]
  
  if (result) {
    if (navigate) {
      navigate(result.url)
    } else {
      // 使用原生方式跳转
      window.location.href = result.url
    }
    closeSearch()
  }
}

// 键盘导航
export function navigateResults(direction: 'up' | 'down') {
  if (direction === 'up' && selectedIndex.value > 0) {
    selectedIndex.value--
  } else if (direction === 'down' && selectedIndex.value < searchResults.value.length - 1) {
    selectedIndex.value++
  }
}

// 监听搜索查询变化
watch(searchQuery, (query) => {
  performSearch(query)
})