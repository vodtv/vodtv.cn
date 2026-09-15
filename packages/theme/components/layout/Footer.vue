<script setup lang="ts">
import SocialIcons from '../common/SocialIcons.vue'

// 定义 Props
interface Props {
  footer: {
    copyright?: string
    message?: string
  }
  themeConfig: any
}

const props = defineProps<Props>()
</script>

<template>
  <footer class="border-t border-gray-200 dark:border-gray-700 bg-background">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col items-center gap-4 md:flex-row md:justify-between md:gap-2">
        <!-- 左侧：社交媒体图标 -->
        <div class="flex items-center gap-4">
          <SocialIcons variant="footer" />
        </div>
        
        <!-- 右侧：Footer 内容 -->
        <div class="text-center text-sm leading-loose text-muted-foreground md:text-right flex items-center gap-2">
          <span v-if="footer.message" v-html="footer.message"></span>

          <span v-if="footer.copyright" v-html="footer.copyright"></span>
          <span v-else>
            Powered by <a href="https://github.com/duxweb/dux-docs" class="font-medium underline underline-offset-4 hover:text-foreground transition-colors">dux-docs</a>
            · © {{ new Date().getFullYear() }} 
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>