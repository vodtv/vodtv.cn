<script setup lang="ts">
const items = [
  {
    title: 'AI 模块',
    desc: '智能体、知识库、解析、向量库、能力扩展、工作流、服务商协议。',
    color: 'var(--color-blue-500)',
    colorLight: 'var(--color-blue-50)',
    icon: 'M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Zm-3 9a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm-2.5 6a5.5 5.5 0 0 1 11 0',
    link: '/extensions/ai/',
  },
  {
    title: 'Bot 模块',
    desc: 'BotService、消息桥接、机器人驱动注册，以及聊天平台接入扩展。',
    color: 'var(--color-green-500)',
    colorLight: 'var(--color-green-50)',
    icon: 'M8 10h.01M16 10h.01M9 16h6M12 3C7.582 3 4 6.134 4 10c0 2.09 1.047 3.966 2.714 5.244L6 21l4.103-2.051C10.72 19.983 11.35 20 12 20c4.418 0 8-3.134 8-7s-3.582-7-8-7Z',
    link: '/extensions/bot/',
  },
  {
    title: '电脑助手',
    desc: '电脑助手扩展的安装、使用和开发说明。',
    color: 'var(--color-orange-500)',
    colorLight: 'var(--color-yellow-50)',
    icon: 'M7 7h10v10H7zM3 10h4M17 10h4M10 3v4M10 17v4M14 3v4M14 17v4',
    link: '/extensions/device-control/introduction',
  },
]
</script>

<template>
  <div class="adv-grid">
    <a
      v-for="item in items"
      :key="item.title"
      class="adv-card ext-link"
      :href="item.link"
      :style="{ '--c': item.color, '--c-light': item.colorLight }"
    >
      <span class="adv-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path :d="item.icon" />
        </svg>
      </span>
      <h3>{{ item.title }}</h3>
      <p>{{ item.desc }}</p>
    </a>
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

.ext-link {
  display: block;
  text-decoration: none;
  color: inherit;
}
</style>