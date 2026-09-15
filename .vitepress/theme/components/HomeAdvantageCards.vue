<script setup lang="ts">
import { advantageItems } from '../composables/advantageData'
</script>

<template>
  <div class="adv-grid">
    <article
      v-for="item in advantageItems"
      :key="item.title"
      class="adv-card"
      :style="{ '--c': item.color, '--c-light': item.colorLight }"
    >
      <span class="adv-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path :d="item.icon" />
        </svg>
      </span>
      <h3>{{ item.title }}</h3>
      <p>{{ item.desc }}</p>
    </article>
  </div>
</template>

<style scoped>
.adv-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 24px 0 32px;
}

@media (max-width: 960px) {
  .adv-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .adv-grid { grid-template-columns: 1fr; }
}

.adv-card {
  border: 1px solid var(--color-gray-200);
  border-radius: 12px;
  padding: 20px;
  transition: border-color 0.2s;
}
.dark .adv-card {
  border-color: var(--color-gray-800);
}
.adv-card:hover {
  border-color: var(--c);
}

.adv-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  margin-bottom: 14px;
  color: var(--c);
  background: var(--c-light);
}
.dark .adv-icon {
  background: var(--color-gray-800);
}

.adv-card h3 {
  margin: 0 0 8px;
  padding: 0;
  border: none;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-gray-900);
}
.dark .adv-card h3 {
  color: var(--color-gray-100);
}

.adv-card p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-gray-500);
}
.dark .adv-card p {
  color: var(--color-gray-400);
}
</style>