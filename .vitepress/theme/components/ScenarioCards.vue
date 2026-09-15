<script setup lang="ts">
const items = [
  {
    title: '个人助手',
    summary: '适合把 AI 变成你自己的日常协作入口。',
    color: 'var(--color-blue-500)',
    colorLight: 'var(--color-blue-50)',
    icon: 'M12 3a3 3 0 0 1 3 3v1.2a4.8 4.8 0 0 1 1.8 3.8c0 2.8-2.2 5-4.8 5.2V19h2a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h2v-1.8C7.4 15 5.2 12.8 5.2 10A4.8 4.8 0 0 1 7 6.2V6a3 3 0 0 1 3-3h2Zm-3 7a1 1 0 1 0 0 .01V10Zm6 0a1 1 0 1 0 0 .01V10Z',
    examples: ['日常提醒', '计划安排', '备忘记录', '资料问答', '个人协作'],
    tags: ['智能体', '机器人', '提醒', '知识问答'],
  },
  {
    title: 'CRM 销售助手',
    summary: '适合销售、客户运营和预约相关流程。',
    color: 'var(--color-green-500)',
    colorLight: 'var(--color-green-50)',
    icon: 'M4 6.5A2.5 2.5 0 0 1 6.5 4h3A2.5 2.5 0 0 1 12 6.5v11A2.5 2.5 0 0 1 9.5 20h-3A2.5 2.5 0 0 1 4 17.5v-11Zm8-1.5h5.5A2.5 2.5 0 0 1 20 7.5v10a2.5 2.5 0 0 1-2.5 2.5H12V5Zm-5 3h2v2H7V8Zm0 4h2v2H7v-2Z',
    examples: ['客户安排', '预约提醒', '客户录入管理', '销售跟进', '商机查询'],
    tags: ['CRM', '智能体', 'HTTP/函数', '工作流'],
  },
  {
    title: '企业办公助手',
    summary: '适合企业内部办公、协同、通知与流程跟进。',
    color: 'var(--color-amber-500)',
    colorLight: 'var(--color-yellow-50)',
    icon: 'M5 4.5A1.5 1.5 0 0 1 6.5 3h11A1.5 1.5 0 0 1 19 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-15ZM8 7h8v2H8V7Zm0 4h8v2H8v-2Zm0 4h5v2H8v-2Z',
    examples: ['待办提醒', '审批跟进', '制度查询', '会议安排', '内部通知'],
    tags: ['OA', '智能体', '机器人', '知识库'],
  },
  {
    title: '客服与服务入口',
    summary: '适合官网、客服、机器人对外服务场景。',
    color: 'var(--color-purple-500)',
    colorLight: 'var(--color-purple-50)',
    icon: 'M12 4a8 8 0 0 1 8 8v5a3 3 0 0 1-3 3h-3v-6h4v-2a6 6 0 1 0-12 0v2h4v6H7a3 3 0 0 1-3-3v-5a8 8 0 0 1 8-8Z',
    examples: ['产品咨询', '售前问答', '售后引导', '常见问题处理', '服务分流'],
    tags: ['客服', '机器人', '知识库', '智能体'],
  },
  {
    title: '知识库问答助手',
    summary: '适合基于企业资料、产品文档和制度内容做问答。',
    color: 'var(--color-cyan-500)',
    colorLight: 'var(--color-blue-50)',
    icon: 'M6 5.5A2.5 2.5 0 0 1 8.5 3H19v16H8.5A2.5 2.5 0 0 0 6 21V5.5ZM8 7h8v2H8V7Zm0 4h8v2H8v-2Zm0 4h5v2H8v-2Z',
    examples: ['公司资料问答', '产品文档查询', '操作手册问答', 'FAQ 检索', '制度说明'],
    tags: ['知识库', '解析', '向量库', '智能体'],
  },
  {
    title: '电商与订单助手',
    summary: '适合商品、订单、支付和售后类业务流程。',
    color: 'var(--color-pink-500)',
    colorLight: 'var(--color-red-50)',
    icon: 'M3 5h2l2.2 9.2A2 2 0 0 0 9.15 16H17a2 2 0 0 0 1.94-1.53L20 9H7.1',
    examples: ['商品推荐', '下单引导', '订单状态查询', '支付说明', '售后处理'],
    tags: ['电商', '工作流', 'API', '业务系统'],
  },
  {
    title: '餐饮 / 外卖助手',
    summary: '适合菜单、点餐、配送和门店服务场景。',
    color: 'var(--color-orange-500)',
    colorLight: 'var(--color-yellow-50)',
    icon: 'M7 3v8a2 2 0 0 1-2 2v8H3v-8a2 2 0 0 1-2-2V3h2v5h2V3h2Zm8 0c1.66 0 3 1.79 3 4v14h-2v-6h-2V7c0-2.21.9-4 1-4Z',
    examples: ['菜单推荐', '点餐下单', '配送说明', '营业信息查询', '售后处理'],
    tags: ['餐饮', '工作流', '业务接口'],
  },
  {
    title: '医院 / 预约助手',
    summary: '适合预约、挂号、到诊提醒和资料引导。',
    color: 'var(--color-teal-500)',
    colorLight: 'var(--color-green-50)',
    icon: 'M11 4h2v5h5v2h-5v5h-2v-5H6V9h5V4Zm-7 8a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z',
    examples: ['挂号预约', '科室引导', '检查说明', '报告解读引导', '到诊提醒'],
    tags: ['预约', '工作流', '文件解析', '机器人'],
  },
  {
    title: '内容与多媒体助手',
    summary: '适合图片、视频、文档和内容素材生成场景。',
    color: 'var(--color-indigo-500)',
    colorLight: 'var(--color-blue-50)',
    icon: 'M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11ZM9 9l6 3-6 3V9Z',
    examples: ['图片生成', '视频生成', '文档解析', '内容整理', '素材辅助生产'],
    tags: ['图片生成', '视频生成', '文件解析', '工作流'],
  },
]
</script>

<template>
  <div class="sc-grid">
    <article
      v-for="item in items"
      :key="item.title"
      class="sc-card"
      :style="{ '--c': item.color, '--c-light': item.colorLight }"
    >
      <div class="sc-head">
        <span class="sc-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path :d="item.icon" />
          </svg>
        </span>
        <h3>{{ item.title }}</h3>
      </div>

      <p>{{ item.summary }}</p>

      <div class="sc-examples">
        <span v-for="example in item.examples" :key="example">{{ example }}</span>
      </div>

      <div class="sc-tags">
        <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
      </div>
    </article>
  </div>
</template>

<style scoped>
.sc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 24px 0 32px;
}

@media (max-width: 960px) {
  .sc-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .sc-grid { grid-template-columns: 1fr; }
}

.sc-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-gray-200);
  border-radius: 12px;
  padding: 20px;
  transition: border-color 0.2s;
}
.dark .sc-card {
  border-color: var(--color-gray-800);
}
.sc-card:hover {
  border-color: var(--c);
}

/* 标题行 */
.sc-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.sc-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  flex-shrink: 0;
  color: var(--c);
  background: var(--c-light);
}
.dark .sc-icon {
  background: var(--color-gray-800);
}

.sc-head h3 {
  margin: 0;
  padding: 0;
  border: none;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-gray-900);
}
.dark .sc-head h3 {
  color: var(--color-gray-100);
}

/* 描述 */
.sc-card p {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-gray-500);
}
.dark .sc-card p {
  color: var(--color-gray-400);
}

/* 示例 */
.sc-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}
.sc-examples span {
  font-size: 12px;
  line-height: 1;
  padding: 5px 10px;
  border-radius: 6px;
  color: var(--color-gray-600);
  background: var(--color-gray-50);
}
.dark .sc-examples span {
  color: var(--color-gray-300);
  background: var(--color-gray-800);
}

/* 标签 */
.sc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--color-gray-100);
}
.dark .sc-tags {
  border-top-color: var(--color-gray-800);
}

.sc-tags span {
  font-size: 12px;
  line-height: 1;
  padding: 4px 8px;
  border-radius: 4px;
  color: var(--c);
  background: var(--c-light);
}
.dark .sc-tags span {
  background: var(--color-gray-800);
}
</style>