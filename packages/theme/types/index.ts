import type { DefaultTheme } from 'vitepress'

/**
 * 多语言文本配置
 */
export interface LangConfig {
  notFound?: {
    title?: string
    content?: string
    backToHome?: string
    previousPage?: string
  }
  
  sponsor?: {
    selectPaymentMethod?: string
    recentSupporters?: string
    totalSupporters?: string
    totalAmount?: string
  }
  
  search?: {
    button?: {
      buttonText?: string
      buttonAriaLabel?: string
    }
    modal?: {
      displayDetails?: string
      resetButtonTitle?: string
      backButtonTitle?: string
      noResultsText?: string
      footer?: {
        selectText?: string
        selectKeyAriaLabel?: string
        navigateText?: string
        navigateUpKeyAriaLabel?: string
        navigateDownKeyAriaLabel?: string
        closeText?: string
        closeKeyAriaLabel?: string
      }
    }
  }
  
  sidebar?: {
    toggleButtonText?: string
    mobileTitle?: string
    docNavTitle?: string
  }
  
  docFooter?: {
    editLinkText?: string
    lastUpdatedText?: string
    prevPageText?: string
    nextPageText?: string
  }
  
  readingTime?: {
    time?: string
    words?: string
    minute?: string
    minutes?: string
  }
}

/**
 *  Theme 配置接口
 */
export interface ThemeConfig extends DefaultTheme.Config {
  /**
   * 多语言文本配置
   */
  langs?: LangConfig
}
