<script setup lang="ts">
interface Props {
  type?: 'info' | 'tip' | 'warning' | 'danger' | 'default'
  text: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default'
})

const typeClass = {
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  tip: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
}
</script>

<template>
  <span :class="[
    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
    typeClass[type]
  ]">
    {{ text }}
  </span>
</template>