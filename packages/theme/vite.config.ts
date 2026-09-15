import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  build: {
    emptyOutDir: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'index.ts'),
        config: resolve(__dirname, 'config.ts'),
        'shims/sanitize-url': resolve(__dirname, 'shims/sanitize-url.ts'),
        'shims/dayjs': resolve(__dirname, 'shims/dayjs.ts')
      }
    },
    rollupOptions: {
      external: [
        'vue',
        'dayjs',
        /^dayjs\/.*/,
        'vitepress',
        /^vitepress\/.*/,
        'minisearch',
        '@vueuse/core',
        '@vueuse/integrations/useFocusTrap',
        'mark.js/src/vanilla.js',
        'focus-trap',
        'vitepress-mermaid-renderer'
      ],
      output: [
        {
          format: 'es',
          dir: 'dist/esm',
          entryFileNames: '[name].js',
          preserveModules: true,
          preserveModulesRoot: __dirname,
          exports: 'named'
        },
        {
          format: 'cjs',
          dir: 'dist/cjs',
          entryFileNames: '[name].cjs',
          preserveModules: true,
          preserveModulesRoot: __dirname,
          exports: 'named'
        }
      ]
    }
  }
})
