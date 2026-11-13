<template>
    <div class="container">
        <p class="tip-text">
            最新可用地址，镜像源每 12 小时测速，自动最优不行就手动换正常节点。
            本页面自动轮询检测各大 GitHub 加速代理，实时展示连通状态、延迟与测速结果。测速存在网络波动，仅供参考，请优先选择状态为正常的镜像使用。
        </p>

        <div class="stat-row" v-if="mirrorList.length">
            <span class="tag total">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;margin-right:4px;">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                {{ mirrorList.length }} 个镜像
            </span>
            <span class="tag ok">● {{ countOk }} 正常</span>
            <span class="tag error">● {{ countError }} 超时</span>
            <span class="tag unsupported">● {{ countUnsupported }} 不支持</span>
        </div>

        <div class="usage-desc">
            <div class="title">使用说明</div>
            <ul>
                <li>点击【复制】拿到镜像前缀，在原 GitHub 链接前面拼接该地址即可加速下载</li>
                <li>仅<strong>正常</strong>状态镜像可复制；超时、不支持状态无法使用，按钮已锁定</li>
                <li>不支持：该代理格式不兼容，无法用于 GitHub 加速；超时：当前网络无法连通</li>
                <li>所有镜像均为第三方公共服务，不保证长期稳定，建议多备用几个镜像</li>
            </ul>
        </div>

        <p class="loading" v-if="loading">数据加载中...</p>
        <p class="error" v-else-if="errorMsg">加载失败：{{ errorMsg }}</p>

        <table v-if="mirrorList.length">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>镜像</th>
                    <th>延迟</th>
                    <th>速度</th>
                    <th>状态</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in mirrorList" :key="item.key">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.label }}</td>
                    <td>{{ item.latency ? `${item.latency} ms` : '—' }}</td>
                    <td>{{ item.speed ? `${item.speed} MB/s` : '—' }}</td>
                    <td>
                        <span class="status-tag" :class="item.statusClass">
                            {{ item.statusText }}
                        </span>
                    </td>
                    <td class="op-col">
                        <button class="copy-btn" :disabled="item.rawStatus !== 'ok'" @click="copyText(item.label)">
                            复制
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
const API_URL = 'https://hiwiki.org/data/mirror-speeds.json'
const loading = ref(true)
const errorMsg = ref('')
const rawMirrors = ref([])

const mirrorList = computed(() => {
    return rawMirrors.value.map(item => {
        let statusText, statusClass
        const rawStatus = item.status

        if (rawStatus === 'ok') {
            statusText = '正常'
            statusClass = 'tag-ok'
        } else if (rawStatus === '404') {
            statusText = '不支持'
            statusClass = 'tag-unsupported'
        } else if (rawStatus === 'error') {
            statusText = '超时'
            statusClass = 'tag-error'
        } else {
            statusText = '超时'
            statusClass = 'tag-error'
        }

        return {
            ...item,
            rawStatus,
            statusText,
            statusClass
        }
    })
})

const countOk = computed(() => mirrorList.value.filter(i => i.rawStatus === 'ok').length)
const countUnsupported = computed(() => mirrorList.value.filter(i => i.rawStatus === '404').length)
const countError = computed(() => mirrorList.value.filter(i => i.rawStatus === 'error').length)

async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text)
        alert('复制成功：' + text)
    } catch (e) {
        alert('复制失败，请手动复制')
    }
}

async function fetchData() {
    try {
        loading.value = true
        errorMsg.value = ''
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        rawMirrors.value = data.mirrors
    } catch (err) {
        errorMsg.value = err.message + '（可能存在跨域限制）'
    } finally {
        loading.value = false
    }
}

onMounted(fetchData)
</script>

<style scoped>
.container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    font-size: 24px;
    margin: 0 0 8px;
}

.tip-text {
    color: #555;
    font-size: 14px;
    line-height: 1.6;
    margin: 0 0 12px;
}

.stat-row {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 12px;
    font-size: 14px;
}

.tag.total {
    color: #333;
    display: flex;
    align-items: center;
}

.tag.ok {
    color: #059669;
}

.tag.error {
    color: #dc2626;
}

.tag.unsupported {
    color: #b45309;
}

.usage-desc {
    background: #f6f8fa;
    padding: 12px 16px;
    border-radius: 6px;
    margin-bottom: 16px;
    font-size: 14px;
}

.usage-desc .title {
    font-weight: bold;
    margin-bottom: 6px;
    font-size: 15px;
}

.usage-desc ul {
    margin: 0;
    padding-left: 20px;
    line-height: 1.6;
}

.loading {
    color: #888;
}

.error {
    color: #dc2626;
}

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

th,
td {
    border: 1px solid #e5e7eb;
    padding: 8px 10px;
    text-align: left;
}

th {
    background: #f9fafb;
}

.status-tag {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
}

.tag-ok {
    background: #dcfce7;
    color: #059669;
}

.tag-error {
    background: #fee2e2;
    color: #dc2626;
}

.tag-unsupported {
    background: #fef3c7;
    color: #b45309;
}

.op-col {
    width: 80px;
    text-align: center;
}

.copy-btn {
    border: none;
    background: #3b82f6;
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
}

.copy-btn:hover {
    background: #2563eb;
}

.copy-btn:disabled {
    background: #cccccc;
    cursor: not-allowed;
}
</style>
