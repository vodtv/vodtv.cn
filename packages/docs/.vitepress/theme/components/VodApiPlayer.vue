<template>
    <div class="vod-player-wrap">
        <div v-if="loading" class="loading">加载列表中...</div>
        <div v-if="error" class="error">{{ error }}</div>

        <div class="search-bar">
            <input v-model="searchKey" type="text" placeholder="输入影片名称搜索" @keyup.enter="onSearch" />
            <button class="search-btn" @click="onSearch">搜索</button>
            <button class="reset-btn" @click="resetSearch">重置</button>
        </div>

        <div class="cate-group">
            <button class="cate-btn" :class="{ active: params.t === '' }"
                @click="params.t = ''; resetSearch()">全部</button>
            <button v-for="item in typeList" :key="item.type_id" class="cate-btn"
                :class="{ active: params.t == item.type_id }" @click="params.t = item.type_id; resetSearch()">
                {{ item.type_name }}
            </button>
        </div>

        <div class="vod-grid">
            <div v-for="vod in vodList" :key="vod.vod_id" class="vod-card" @click="openVodDetail(vod)">
                <div class="vod-poster">
                    <img v-if="vod.vod_pic" :src="getVodPic(vod)" :alt="vod.vod_name" loading="lazy"
                        @error="handleImgError($event)" />
                    <div v-else-if="vod.__picLoading" class="poster-placeholder">
                        <span>加载封面</span>
                    </div>
                    <div v-else class="poster-placeholder">
                        <span>暂无封面</span>
                    </div>
                </div>
                <div class="vod-info">
                    <div class="vod-name">{{ vod.vod_name }}</div>
                    <div class="vod-remark">{{ vod.vod_remark || '' }}</div>
                </div>
            </div>
        </div>

        <!-- 升级后的分页栏：左统计 + 右分页控件 -->
        <div class="pagination-bar" v-if="total > 0">
            <div class="pagination-stat">
                共 {{ total }} 条数据 · 第 {{ params.pg }} / {{ totalPage }} 页
            </div>
            <div class="pagination-controls">
                <button class="page-btn" :disabled="params.pg <= 1" @click="goPage(1)">首页</button>
                <button class="page-btn" :disabled="params.pg <= 1" @click="goPage(params.pg - 1)">上一页</button>
                <template v-for="p in pageList" :key="p">
                    <button class="page-btn" :class="{ active: p === params.pg }" @click="goPage(p)">
                        {{ p }}
                    </button>
                </template>
                <button class="page-btn" :disabled="params.pg >= totalPage" @click="goPage(params.pg + 1)">下一页</button>
                <button class="page-btn" :disabled="params.pg >= totalPage" @click="goPage(totalPage)">尾页</button>
            </div>
        </div>

        <div v-if="showModal" class="modal-mask" @click.self="closePlayer">
            <div class="modal-box">
                <div class="modal-header">
                    <div class="modal-title" :title="playTitle">{{ playTitle }}</div>
                    <button class="btn-close" @click="closePlayer">关闭</button>
                </div>

                <div v-if="currentEp && currentEp.isM3u8">
                    <div class="player-container" ref="artRef"></div>
                </div>

                <div v-else-if="currentEp && !currentEp.isM3u8" class="player-tip">
                    <p>⚠️ 当前为网页源，需手动跳转</p>
                    <button class="btn-link" @click="openWebUrl">前往网页播放</button>
                </div>

                <div class="control-row">
                    <div class="control-item">
                        <label>线路</label>
                        <select v-model="currLineName" @change="onLineChange">
                            <option v-for="line in lineList" :key="line.name" :value="line.name">
                                {{ line.name }}
                            </option>
                        </select>
                    </div>

                    <div class="control-item auto-item" v-if="currentEp?.isM3u8">
                        <label class="toggle-label">
                            <input v-model="autoNext" type="checkbox" />
                            自动连播
                        </label>
                    </div>

                    <div class="control-item auto-item" v-if="currentEp?.isM3u8 && skipIntroOutro">
                        <label>片头(s):</label>
                        <input v-model.number="localIntroSec" type="number" min="0"
                            style="width:50px;padding:4px;background:#111;color:#fff;border:1px solid #333;border-radius:4px" />
                        <label>片尾(s):</label>
                        <input v-model.number="localOutroSec" type="number" min="0"
                            style="width:50px;padding:4px;background:#111;color:#fff;border:1px solid #333;border-radius:4px" />
                    </div>

                    <div class="control-item auto-item" v-if="currentEp?.isM3u8">
                        <label class="toggle-label">
                            <input v-model="skipIntroOutro" type="checkbox" />
                            自动跳过
                        </label>
                    </div>

                    <div class="control-item">
                        <label>集数</label>
                        <select v-model="currIndex" @change="onEpChange">
                            <option v-for="(ep, idx) in episodeList" :key="idx" :value="idx">
                                {{ ep.name }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onUnmounted, nextTick, computed } from 'vue'

const props = defineProps({
    api: {
        type: String,
        required: true
    },
    useProxy: {
        type: Boolean,
        default: true
    },
    proxyUrl: {
        type: String,
        default: 'https://cors.isteed.cc/'
    },
    introSec: {
        type: Number,
        default: 60
    },
    outroSec: {
        type: Number,
        default: 30
    }
})

let art = null
let hlsInstance = null
let timeTimer = null
const artRef = ref(null)
const showModal = ref(false)
const currTitle = ref('')
const currLineName = ref('')
const lineList = ref([])
const episodeList = ref([])
const currIndex = ref(0)
const currentEp = ref(null)
const vodDetail = ref(null)
const autoNext = ref(true)
const skipIntroOutro = ref(true)
// 本地可修改的秒数，初始取自props
const localIntroSec = ref(props.introSec)
const localOutroSec = ref(props.outroSec)

const loading = ref(false)
const error = ref('')
const raw = ref(null)
const typeList = ref([])
const vodList = ref([])
const total = ref(0)
const totalPage = ref(0) // 总页数
const picCache = new Map()
const searchKey = ref('')

const params = reactive({
    t: '',
    pg: 1,
    wd: '',
    order: ''
})

const playTitle = computed(() => {
    if (!currTitle.value || !currentEp.value) return currTitle.value
    return `${currTitle.value} - ${currentEp.value.name}`
})

// 生成显示的页码列表（当前页前后各2页）
const pageList = computed(() => {
    const pages = []
    const total = totalPage.value
    const current = params.pg
    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i)
    } else {
        let start = Math.max(1, current - 2)
        let end = Math.min(total, current + 2)
        if (current <= 3) end = 5
        if (current >= total - 2) start = total - 4
        for (let i = start; i <= end; i++) pages.push(i)
    }
    return pages
})

function getVodPic(vod) {
    if (!vod.vod_pic) return ''
    let url = vod.vod_pic
    url = url.replace('vod.dyttimage.com', 'img.dytt-tupian.com')
    url = url.replace('dyttimage.com', 'dytt-tupian.com')
    return url
}

function onSearch() {
    params.wd = searchKey.value.trim()
    params.pg = 1
    fetchList()
}

function resetSearch() {
    searchKey.value = ''
    params.wd = ''
    params.pg = 1
    fetchList()
}

// 跳转指定页码
function goPage(p) {
    if (p < 1 || p > totalPage.value || p === params.pg) return
    params.pg = p
    fetchList()
}

watch(() => props.api, () => {
    typeList.value = []
    vodList.value = []
    params.pg = 1
    params.wd = ''
    searchKey.value = ''
    fetchType()
    fetchList()
})

onMounted(() => {
    if (!window.Artplayer) {
        const s1 = document.createElement('script')
        s1.src = 'https://cdn.jsdelivr.net/npm/artplayer@5/dist/artplayer.min.js'
        document.head.appendChild(s1)
    }
    if (!window.Hls) {
        const s2 = document.createElement('script')
        s2.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js'
        document.head.appendChild(s2)
    }
    fetchType()
    fetchList()
})

onUnmounted(() => {
    destroyArt()
})

function destroyArt() {
    clearTimeout(timeTimer)
    if (art) {
        art.destroy()
        art = null
    }
    if (hlsInstance) {
        hlsInstance.destroy()
        hlsInstance = null
    }
}

function playNext() {
    if (!autoNext.value) return
    if (currIndex.value < episodeList.value.length - 1) {
        currIndex.value = currIndex.value + 1
        const nextEp = episodeList.value[currIndex.value]
        if (nextEp.isM3u8) playEp(nextEp, currIndex.value)
    }
}

async function req(query, timeout = 3000) {
    const sp = new URLSearchParams()
    for (const k in query) {
        const v = query[k]
        if (v !== '' && v != null) sp.append(k, v)
    }
    let targetUrl = `${props.api}?${sp.toString()}`
    if (props.useProxy) {
        targetUrl = props.proxyUrl + encodeURIComponent(targetUrl)
    }
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)
    try {
        const res = await fetch(targetUrl, { signal: controller.signal })
        clearTimeout(timer)
        const json = await res.json()
        return json
    } catch (err) {
        clearTimeout(timer)
        console.error('请求失败', err)
        return null
    }
}

async function fetchType() {
    const data = await req({ ac: 'type' })
    if (data?.class) {
        typeList.value = data.class
    }
}

async function loadSinglePic(item) {
    if (picCache.has(item.vod_id)) {
        item.vod_pic = picCache.get(item.vod_id)
        item.__picLoading = false
        return
    }
    item.__picLoading = true
    const d = await req({ ac: 'detail', ids: item.vod_id }, 2500)
    if (d?.list?.[0]?.vod_pic) {
        item.vod_pic = d.list[0].vod_pic
        picCache.set(item.vod_id, item.vod_pic)
    }
    item.__picLoading = false
}

async function fetchList() {
    loading.value = true
    error.value = ''
    const data = await req({ ac: 'list', t: params.t, pg: params.pg, wd: params.wd })
    if (data?.list) {
        vodList.value = data.list
        total.value = data.total || data.list.length
        // 优先取接口返回的总页数，兼容苹果CMS结构
        totalPage.value = data.pagecount || data.page?.pagecount || Math.ceil(total.value / 20)
        for (const item of vodList.value) {
            loadSinglePic(item)
            await new Promise(r => setTimeout(r, 120))
        }
    }
    loading.value = false
}

async function openVodDetail(vod) {
    destroyArt()
    currTitle.value = vod.vod_name
    showModal.value = true
    // 打开新剧集，重置为本组件默认值
    localIntroSec.value = props.introSec
    localOutroSec.value = props.outroSec
    const data = await req({ ac: 'detail', ids: vod.vod_id })
    if (!data?.list?.[0]) return
    const item = data.list[0]
    vodDetail.value = item
    lineList.value = parseMultiLine(item.vod_play_from, item.vod_play_url)
    if (lineList.value.length > 0) {
        const preferLine = lineList.value.find(l => l.name === 'm3u8') || lineList.value[0]
        currLineName.value = preferLine.name
        switchLine(preferLine)
    }
}

function parseMultiLine(fromStr, urlStr) {
    if (!fromStr || !urlStr) return []
    const fromArr = fromStr.split('$$$')
    const urlArr = urlStr.split('$$$')
    const res = []
    for (let i = 0; i < fromArr.length; i++) {
        const epStr = urlArr[i]
        if (!epStr) continue
        const epList = epStr.split('#').map(epItem => {
            const [epName, epUrl] = epItem.split('$')
            if (!epUrl) return null
            const isM3u8 = epUrl.includes('.m3u8')
            return {
                name: epName,
                url: epUrl,
                rawUrl: epUrl,
                isM3u8
            }
        }).filter(Boolean)
        if (epList.length === 0) continue
        const hasM3u8 = epList.some(ep => ep.isM3u8)
        const showName = hasM3u8 ? 'm3u8' : '网页源'
        res.push({ name: showName, epList })
    }
    return res
}

function switchLine(line) {
    currLineName.value = line.name
    episodeList.value = line.epList
    currIndex.value = 0
    const firstEp = episodeList.value[0]
    if (!firstEp) {
        currentEp.value = null
        destroyArt()
        return
    }
    currentEp.value = firstEp
    if (firstEp.isM3u8) {
        playEp(firstEp, 0)
    } else {
        destroyArt()
    }
}

function onLineChange() {
    const line = lineList.value.find(l => l.name === currLineName.value)
    if (line) switchLine(line)
}

function onEpChange() {
    const ep = episodeList.value[currIndex.value]
    if (!ep) return
    currentEp.value = ep
    if (ep.isM3u8) {
        playEp(ep, currIndex.value)
    } else {
        destroyArt()
    }
}

function playEp(ep, idx) {
    currIndex.value = idx
    currentEp.value = ep
    destroyArt()

    if (!ep.isM3u8) return

    nextTick(() => {
        if (!artRef.value || !window.Artplayer || !window.Hls) return
        art = new Artplayer({
            container: artRef.value,
            url: ep.url,
            autoplay: true,
            muted: true,
            settings: [],
            fullscreen: true,
            fullscreenWeb: true,
            customType: {
                m3u8: function (video, url) {
                    if (Hls.isSupported()) {
                        hlsInstance = new Hls()
                        hlsInstance.loadSource(url)
                        hlsInstance.attachMedia(video)
                    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = url
                    }
                }
            }
        })

        art.on('ready', () => {
            art.play()
            if (skipIntroOutro.value && localIntroSec.value > 0) {
                art.seek = localIntroSec.value
            }
        })

        art.on('video:ended', () => {
            playNext()
        })

        art.on('video:timeupdate', () => {
            const dur = art.duration
            const cur = art.currentTime
            if (!dur || dur <= 0) return

            if (skipIntroOutro.value && cur < localIntroSec.value) {
                art.seek = localIntroSec.value
            }

            if (skipIntroOutro.value && autoNext.value) {
                if (dur > localOutroSec.value && cur >= dur - localOutroSec.value) {
                    clearTimeout(timeTimer)
                    timeTimer = setTimeout(() => {
                        playNext()
                    }, 1000)
                }
            }
        })
    })
}

function handleImgError(e) {
    const parent = e.target.parentNode
    e.target.remove()
    const placeholder = document.createElement('div')
    placeholder.className = 'poster-placeholder'
    placeholder.innerHTML = '<span>图片失效</span>'
    parent.appendChild(placeholder)
}

function openWebUrl() {
    if (!currentEp.value) return
    window.open(currentEp.value.rawUrl, '_blank')
}

function closePlayer() {
    showModal.value = false
    destroyArt()
    currentEp.value = null
}
</script>

<style scoped>
.vod-player-wrap {
    padding: 12px;
}

.search-bar {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;
}

.search-bar input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    outline: none;
}

.search-bar input:focus {
    border-color: #2563eb;
}

.search-btn,
.reset-btn {
    padding: 8px 14px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
}

.search-btn {
    background: #2563eb;
    color: #fff;
}

.reset-btn {
    background: #f1f5f9;
    color: #334155;
}

.cate-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 14px;
}

.cate-btn {
    border: 1px solid #e2e8f0;
    background: #fff;
    color: #334155;
    padding: 6px 12px;
    border-radius: 999px;
    cursor: pointer;
    font-size: 14px;
    transition: 0.2s;
}

.cate-btn.active {
    background: #2563eb;
    border-color: #2563eb;
    color: #fff;
}

.cate-btn:hover {
    border-color: #2563eb;
    color: #2563eb;
}

.vod-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 14px;
    margin-bottom: 16px;
}

.vod-card {
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    background: #fff;
    transition: 0.2s;
}

.vod-card:hover {
    border-color: #2563eb;
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.12);
}

.vod-poster {
    width: 100%;
    aspect-ratio: 2 / 3;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
}

.vod-poster img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.poster-placeholder {
    width: 100%;
    height: 100%;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    font-size: 14px;
}

.vod-info {
    padding: 8px 10px;
}

.vod-name {
    font-size: 14px;
    color: #1e293b;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.vod-remark {
    font-size: 12px;
    color: #64748b;
    margin-top: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 分页栏 */
.pagination-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 0.8rem 1rem;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    margin-top: 1rem;
}

.pagination-stat {
    color: #334155;
    font-size: 14px;
}

.pagination-controls {
    display: flex;
    gap: 6px;
    align-items: center;
}

.page-btn {
    border: 1px solid #cbd5e1;
    background: #fff;
    padding: 4px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    color: #334155;
    transition: 0.2s;
}

.page-btn:hover:not(:disabled) {
    background: #eff6ff;
    border-color: #3b82f6;
    color: #2563eb;
}

.page-btn.active {
    background: #3b82f6;
    color: #fff;
    border-color: #3b82f6;
}

.page-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.page-info {
    color: #64748b;
    font-size: 14px;
}

.modal-mask {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.modal-box {
    width: 92%;
    max-width: 960px;
    background: #000;
    color: #fff;
    padding: 16px;
    border-radius: 10px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #222;
}

.modal-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    margin-right: 12px;
}

.btn-close {
    border: 1px solid #333;
    background: #111;
    color: #fff;
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: 0.2s;
}

.btn-close:hover {
    background: #ef4444;
    border-color: #ef4444;
}

.player-container {
    width: 100%;
    height: 480px;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 14px;
}

.player-tip {
    background: #111;
    border: 1px solid #222;
    border-radius: 8px;
    padding: 30px 16px;
    text-align: center;
    margin-bottom: 14px;
}

.player-tip p {
    margin: 0 0 12px;
    color: #bbb;
}

.btn-link {
    display: inline-block;
    padding: 8px 18px;
    background: #2563eb;
    color: #fff;
    border-radius: 6px;
    border: none;
    font-size: 14px;
    cursor: pointer;
    transition: 0.2s;
}

.btn-link:hover {
    background: #3b82f6;
}

.control-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
}

.control-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

.control-item label {
    color: #ccc;
    font-size: 14px;
    white-space: nowrap;
}

.control-item select {
    padding: 6px 10px;
    background: #111;
    color: #fff;
    border: 1px solid #333;
    border-radius: 6px;
    outline: none;
}

.control-item select:focus {
    border-color: #2563eb;
}

.toggle-label {
    color: #ccc;
    cursor: pointer;
    font-size: 14px;
    display: inline-flex;
    gap: 6px;
    align-items: center;
}

.loading,
.error {
    padding: 10px;
    color: #334155;
}

@media (max-width:768px) {
    .vod-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .control-row {
        flex-direction: column;
        align-items: flex-start;
    }

    .search-bar {
        flex-wrap: wrap;
    }

    .player-container {
        height: 260px;
    }

    .pagination-bar {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
