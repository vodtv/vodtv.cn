<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useData, useRouter } from 'vitepress'
import type { DefaultTheme } from 'vitepress/theme'
import SearchButton from '../search/SearchButton.vue'
import SocialIcons from '../common/SocialIcons.vue'
import NavDropdown from '../common/NavDropdown.vue'
import { useLocale } from '../../composables/useLocale'
import { useLink } from '../../composables/useLink'

const { isDark, site, theme, localeIndex } = useData()
const router = useRouter()
const ui = useLocale('ui')
const { resolveLink } = useLink()

const uiTexts = computed(() => ({
  switchTheme: {
    dark: ui.value?.switchTheme?.dark || 'Switch to dark mode',
    light: ui.value?.switchTheme?.light || 'Switch to light mode'
  },
  language: {
    ariaLabel: ui.value?.language?.ariaLabel || 'language',
    switchLanguage: ui.value?.language?.switchLanguage || 'Switch language'
  }
}))

interface Props {
  themeConfig?: DefaultTheme.Config
  site?: any
  isDark?: boolean
  lang?: string
}

const props = defineProps<Props>()

const themeConfig = computed(() => props.themeConfig || theme.value)
const siteData = computed(() => props.site || site.value)

const siteTitle = computed(() => 
  themeConfig.value.siteTitle !== false 
    ? (themeConfig.value.siteTitle || siteData.value.title)
    : false
)

const navItems = computed(() => themeConfig.value.nav || [])

const logo = computed(() => {
  const logoConfig = themeConfig.value.logo
  if (!logoConfig) return null
  
  if (typeof logoConfig === 'string') {
    return resolveLink(logoConfig)
  }
  if (typeof logoConfig === 'object') {
    return {
      light: logoConfig.light ? resolveLink(logoConfig.light) : null,
      dark: logoConfig.dark ? resolveLink(logoConfig.dark) : null
    }
  }
  
  return null
})

const locales = computed(() => site.value.locales || {})
const currentLocale = computed(() => {
  const locale = locales.value[localeIndex.value]
  if (!locale || typeof locale !== 'object') return null
  return locale as any
})

const localeLinks = computed(() => {
  const links: Array<{key: string, label: string, link: string}> = []
  
  for (const [key, locale] of Object.entries(locales.value)) {
    if (key !== localeIndex.value && locale && typeof locale === 'object') {
      const localeData = locale as any
      
      let targetPath = ''
      if (localeData.link) {
        targetPath = resolveLink(localeData.link)
      } else if (key === 'root') {
        targetPath = resolveLink('/')
      } else {
        targetPath = resolveLink(`/${key}/`)
      }
      
      links.push({
        key,
        label: localeData.label || key,
        link: targetPath
      })
    }
  }
  return links
})

const showLangMenu = ref(false)
const langMenuRef = ref<HTMLElement>()

const handleClickOutside = (event: MouseEvent) => {
  if (langMenuRef.value && !langMenuRef.value.contains(event.target as Node)) {
    showLangMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const switchLocale = (link: string) => {
  router.go(link)
  showLangMenu.value = false
}

const toggleDark = () => {
  const enableTransitions = () =>
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches

  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }
  
  document.startViewTransition(() => {
    isDark.value = !isDark.value
  })
}

const toggleMobileMenu = () => {
  const menu = document.getElementById('mobile-menu')
  menu?.classList.toggle('hidden')
}
</script>

<template>
<header class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-gray-900/60">
    <div class="container mx-auto flex h-16 max-w-screen-2xl items-center px-4">
      <div class="mr-4 flex">
        <a :href="resolveLink('/')" class="mr-6 flex items-center space-x-2">
          <template v-if="logo">
            <img v-if="typeof logo === 'string'" :src="logo" alt="Logo" class="h-6 w-6" />
            <template v-else-if="typeof logo === 'object'">
              <img v-if="isDark && logo.dark" :src="logo.dark" alt="Logo" class="h-6 w-6" />
              <img v-else-if="!isDark && logo.light" :src="logo.light" alt="Logo" class="h-6 w-6" />
            </template>
          </template>
          <span v-if="siteTitle" class="font-bold">{{ siteTitle }}</span>
        </a>
      </div>

      <nav class="hidden md:flex items-center gap-6 text-sm">
        <template v-for="item in navItems" :key="item.text">
          <NavDropdown :item="item" />
        </template>
      </nav>

      <div class="flex flex-1 items-center justify-end space-x-2">

        <SearchButton class="hidden md:flex" />

        <div v-if="Object.keys(locales).length > 1" class="relative" ref="langMenuRef">
          <button
            type="button"
            class="btn-ghost px-2 [w-2rem] h-8"
            @click="showLangMenu = !showLangMenu"
            :aria-label="currentLocale?.label || uiTexts.language.ariaLabel"
            :title="currentLocale?.label || uiTexts.language.switchLanguage"
          >
            <div class="icon-[heroicons--language] h-4 w-4"></div>
          </button>
          
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 transform scale-95 -translate-y-1"
            enter-to-class="opacity-100 transform scale-100 translate-y-0"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 transform scale-100 translate-y-0"
            leave-to-class="opacity-0 transform scale-95 -translate-y-1"
          >
            <div 
              v-if="showLangMenu" 
              class="absolute right-0 top-full mt-2 py-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 origin-top-right z-50"
            >
              <button
                v-for="locale in localeLinks"
                :key="locale.key"
                @click="switchLocale(locale.link)"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-md last:rounded-b-md transition-colors duration-150"
              >
                {{ locale.label }}
              </button>
            </div>
          </Transition>
        </div>

        <SocialIcons variant="header" />

        <button
          type="button"
          class="btn-ghost px-2 theme-toggle"
          @click="toggleDark"
          :aria-label="isDark ? uiTexts.switchTheme.light : uiTexts.switchTheme.dark"
        >
          <div class="icon-[tabler--sun] h-4 w-4 sun-icon"></div>
          <div class="icon-[tabler--moon] h-4 w-4 moon-icon"></div>
        </button>


        <button
          type="button"
          class="btn-ghost px-2 [w-2rem] h-8 md:hidden"
          @click="toggleMobileMenu"
        >
          <div class="icon-[heroicons--bars-3] h-4 w-4"></div>
        </button>
        
        
      </div>

    </div>

    

    <div id="mobile-menu" class="hidden md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4 py-4 space-y-4">
        <SearchButton class="w-full" />
        
        <nav class="flex flex-col space-y-2">
          <template v-for="item in navItems" :key="item.text">
            <NavDropdown :item="item" />
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>