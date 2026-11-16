<template>
  <div class="vod-player-wrap">
    <!-- 1. 基础状态显示 -->
    <div v-if="loading" class="loading">加载列表中...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- 2. 搜索栏 -->
    <div class="search-bar">
      <input
        v-model="searchKey"
        type="text"
        placeholder="输入影片名称搜索"
        @keyup.enter="onSearch"
      />
      <button class="search-btn" @click="onSearch">搜索</button>
      <button class="reset-btn" @click="resetSearch">重置</button>
    </div>

    <!-- 3. 分类 -->
    <div class="cate-group">
      <button
        class="cate-btn"
        :class="{ active: params.t === '' }"
        @click="
          params.t = '';
          resetSearch();
        "
      >
        全部
      </button>
      <button
        v-for="item in typeList"
        :key="item.type_id"
        class="cate-btn"
        :class="{ active: params.t == item.type_id }"
        @click="
          params.t = item.type_id;
          resetSearch();
        "
      >
        {{ item.type_name }}
      </button>
    </div>

    <!-- 4. 列表 -->
    <div class="vod-grid">
      <div
        v-for="vod in vodList"
        :key="vod.vod_id"
        class="vod-card"
        @click="openVodDetail(vod)"
      >
        <div class="vod-poster">
          <img
            v-if="vod.vod_pic"
            :src="getVodPic(vod)"
            :alt="vod.vod_name"
            loading="lazy"
            @error="handleImgError($event)"
          />
          <div v-else-if="vod.__picLoading" class="poster-placeholder">
            <span>加载封面</span>
          </div>
          <div v-else class="poster-placeholder">
            <span>暂无封面</span>
          </div>
        </div>
        <div class="vod-info">
          <div class="vod-name">{{ vod.vod_name }}</div>
          <div class="vod-remark">{{ vod.vod_remark || "" }}</div>
        </div>
      </div>
    </div>

    <!-- 升级后的分页栏：左统计 + 右分页控件 -->
    <div class="pagination-bar" v-if="total > 0">
      <div class="pagination-stat">
        共 {{ total }} 条数据 · 第 {{ params.pg }} / {{ totalPage }} 页
      </div>
      <div class="pagination-controls">
        <button class="page-btn" :disabled="params.pg <= 1" @click="goPage(1)">
          首页
        </button>
        <button
          class="page-btn"
          :disabled="params.pg <= 1"
          @click="goPage(params.pg - 1)"
        >
          上一页
        </button>
        <template v-for="p in pageList" :key="p">
          <button
            class="page-btn"
            :class="{ active: p === params.pg }"
            @click="goPage(p)"
          >
            {{ p }}
          </button>
        </template>
        <button
          class="page-btn"
          :disabled="params.pg >= totalPage"
          @click="goPage(params.pg + 1)"
        >
          下一页
        </button>
        <button
          class="page-btn"
          :disabled="params.pg >= totalPage"
          @click="goPage(params.pg)"
        >
          尾页
        </button>
      </div>
    </div>

    <!-- 5. 播放器弹窗【新版左右双栏｜右栏=简介详情】 -->
    <div v-if="showModal" class="modal-mask" @click.self="closePlayer">
      <div class="modal-box" @keydown="handleKeydown">
        <div class="modal-header">
          <div class="modal-title" :title="playTitle">{{ playTitle }}</div>
          <!-- 上一集、下一集，手机端隐藏 -->
          <div class="ep-nav-btn-group">
            <button
              class="ep-nav-btn"
              @click="prevEp"
              :disabled="currIndex <= 0"
            >
              上一集
            </button>
            <button
              class="ep-nav-btn"
              @click="nextEp"
              :disabled="currIndex >= episodeList.length - 1"
            >
              下一集
            </button>
          </div>
          <button class="btn-close" @click="closePlayer">关闭</button>
        </div>

        <div class="modal-body-wrap">
          <!-- 左侧区域：播放器 -->
          <div class="modal-left">
            <!-- 播放器容器：m3u8用artplayer -->
            <div v-if="currentEp && currentEp.isM3u8">
              <div class="player-container" ref="artRef"></div>
            </div>
            <div v-else-if="currentEp && !currentEp.isM3u8">
              <iframe
                :src="webIframeUrl"
                class="web-iframe"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
            <div v-else class="player-empty">暂无播放资源</div>
          </div>

          <!-- 右侧区域：Tab面板【剧集 / 详情 / 历史 / 设置】 -->
          <div class="modal-right">
            <div class="tab-header">
              <button
                class="tab-btn"
                :class="{ active: activeTab === 'ep' }"
                @click="activeTab = 'ep'"
              >
                剧集
              </button>
              <button
                class="tab-btn"
                :class="{ active: activeTab === 'info' }"
                @click="activeTab = 'info'"
              >
                详情
              </button>
              <button
                class="tab-btn"
                :class="{ active: activeTab === 'history' }"
                @click="activeTab = 'history'"
              >
                历史
              </button>
              <button
                class="tab-btn"
                :class="{ active: activeTab === 'setting' }"
                @click="activeTab = 'setting'"
              >
                设置
              </button>
            </div>

            <!-- Tab内容区：这块滚动，高度扣除tab头部 -->
            <div class="tab-content">
              <!-- 剧集Tab -->
              <div v-if="activeTab === 'ep'" class="tab-panel ep-panel">
                <div v-if="!episodeList.length" class="empty-tip">暂无剧集</div>
                <div class="ep-grid" v-else>
                  <button
                    v-for="(ep, idx) in episodeList"
                    :key="idx"
                    class="ep-btn"
                    :class="{ active: idx === currIndex }"
                    @click="
                      currIndex = idx;
                      onEpChange();
                    "
                  >
                    {{ ep.name }}
                  </button>
                </div>
              </div>

              <!-- 详情Tab -->
              <div v-if="activeTab === 'info'" class="tab-panel info-panel">
                <div v-if="vodDetail" class="info-item">
                  <label>影片名称：</label>
                  <span>{{ vodDetail.vod_name }}</span>
                </div>
                <div v-if="vodDetail" class="info-item">
                  <label>年份：</label>
                  <span>{{ vodDetail.vod_year || "-" }}</span>
                </div>
                <div v-if="vodDetail" class="info-item">
                  <label>地区：</label>
                  <span>{{ vodDetail.vod_area || "-" }}</span>
                </div>
                <div v-if="vodDetail" class="info-item">
                  <label>主演：</label>
                  <span>{{ vodDetail.vod_actor || "-" }}</span>
                </div>
                <div v-if="vodDetail" class="info-item info-desc">
                  <label>剧情简介：</label>
                  <span>{{ vodDetail.vod_content || "暂无简介" }}</span>
                </div>
                <div v-else class="info-empty">加载详情...</div>
              </div>

              <!-- 历史Tab -->
              <div
                v-if="activeTab === 'history'"
                class="tab-panel history-panel"
              >
                <div class="history-head">
                  <span>点播历史</span>
                  <button
                    v-if="playHistory.length"
                    class="clear-history-btn"
                    @click="clearHistory"
                  >
                    清空历史
                  </button>
                </div>
                <div v-if="!playHistory.length" class="empty-tip">
                  暂无播放记录
                </div>
                <div class="history-grid">
                  <div
                    class="history-card"
                    v-for="item in playHistory"
                    :key="item.id + '_' + item.epIndex"
                    @click="playHistoryItem(item)"
                  >
                    <img
                      :src="item.pic"
                      alt=""
                      class="history-pic"
                      loading="lazy"
                    />
                    <div class="history-name">{{ item.name }}</div>
                    <div class="history-time">{{ item.epName || "" }}</div>
                  </div>
                </div>
              </div>

              <!-- 设置Tab -->
              <div
                v-if="activeTab === 'setting'"
                class="tab-panel setting-panel"
              >
                <div class="setting-item">
                  <label>线路选择</label>
                  <select v-model="currLineName" @change="onLineChange">
                    <option
                      v-for="line in lineList"
                      :key="line.name"
                      :value="line.name"
                    >
                      {{ line.name }}
                    </option>
                  </select>
                </div>
                <div class="setting-row-inline" v-if="currentEp?.isM3u8">
                  <label class="toggle-label">
                    <input v-model="autoNext" type="checkbox" />
                    自动联播
                  </label>
                  <label class="toggle-label">
                    <input v-model="skipIntroOutro" type="checkbox" />
                    自动跳过
                  </label>
                </div>

                <div
                  class="setting-item"
                  v-if="currentEp?.isM3u8 && skipIntroOutro"
                >
                  <label>跳过片头(秒)</label>
                  <input
                    v-model.number="localIntroSec"
                    type="number"
                    min="0"
                    @input="
                      localIntroSec = Math.max(0, Number(localIntroSec) || 0)
                    "
                  />
                </div>
                <div
                  class="setting-item"
                  v-if="currentEp?.isM3u8 && skipIntroOutro"
                >
                  <label>跳过片尾(秒)</label>
                  <input
                    v-model.number="localOutroSec"
                    type="number"
                    min="0"
                    @input="
                      localOutroSec = Math.max(0, Number(localOutroSec) || 0)
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
  computed,
} from "vue";

const props = defineProps({
  api: {
    type: String,
    required: true,
  },
  proxyUrl: {
    type: String,
    default: "https://cors.isteed.cc/",
  },
  old_pic_domain: {
    type: String,
    default: "",
  },
  new_pic_domain: {
    type: String,
    default: "",
  },
  useProxy: {
    type: Boolean,
    default: true,
  },
  introSec: {
    type: Number,
    default: 60,
  },
  outroSec: {
    type: Number,
    default: 30,
  },
  pageSize: {
    type: Number,
    default: 20,
  },
});

let art = null;
let hlsInstance = null;
let timeTimer = null;
let introSkipped = false;
let fetchLock = false;
let picLoadTimer = null;
const artRef = ref(null);
const showModal = ref(false);
const currTitle = ref("");
const currLineName = ref("");
const lineList = ref([]);
const episodeList = ref([]);
const currIndex = ref(0);
const currentEp = ref(null);
const vodDetail = ref(null);
const autoNext = ref(true);
const skipIntroOutro = ref(true);
const localIntroSec = ref(props.introSec);
const localOutroSec = ref(props.outroSec);
const activeTab = ref("ep");

// 全局请求控制器，组件卸载统一取消所有pending请求
let globalAbortController = new AbortController();

// ===== 播放历史（增强：保存线路、集数） =====
const playHistory = ref([]);
const MAX_HISTORY = 20;

const loadHistory = () => {
  const str = localStorage.getItem("vod_play_history");
  if (str) {
    try {
      playHistory.value = JSON.parse(str);
    } catch (e) {
      playHistory.value = [];
    }
  }
};
const saveHistory = () => {
  localStorage.setItem("vod_play_history", JSON.stringify(playHistory.value));
};
const addHistory = (vod, lineName, epIndex, epName) => {
  if (!vod || !vod.vod_id) return;
  const idx = playHistory.value.findIndex((i) => i.id === vod.vod_id);
  if (idx > -1) {
    playHistory.value.splice(idx, 1);
  }
  playHistory.value.unshift({
    id: vod.vod_id,
    name: vod.vod_name,
    pic: vod.vod_pic || "",
    time: new Date().toLocaleString(),
    lineName,
    epIndex,
    epName,
  });
  if (playHistory.value.length > MAX_HISTORY) {
    playHistory.value.pop();
  }
  saveHistory();
};
const playHistoryItem = async (item) => {
  const vod = {
    vod_id: item.id,
    vod_name: item.name,
    vod_pic: item.pic,
  };
  await openVodDetail(vod, item.lineName ?? "", item.epIndex ?? 0);
};
const clearHistory = () => {
  playHistory.value = [];
  localStorage.removeItem("vod_play_history");
};

const loading = ref(false);
const error = ref("");
const typeList = ref([]);
const vodList = ref([]);
const total = ref(0);
const totalPage = ref(0);
const picCache = new Map();
const searchKey = ref("");

const params = reactive({
  t: "",
  pg: 1,
  wd: "",
  order: "",
});

const playTitle = computed(() => {
  if (!currTitle.value || !currentEp.value) return currTitle.value;
  return `${currTitle.value} - ${currentEp.value.name}`;
});

const webIframeUrl = computed(() => {
  if (!currentEp.value?.rawUrl) return "";
  let url = currentEp.value.rawUrl;
  return url;
});

const pageList = computed(() => {
  const pages = [];
  const total = totalPage.value;
  const current = params.pg;
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);
    if (current <= 3) end = 5;
    if (current >= total - 2) start = total - 4;
    for (let i = start; i <= end; i++) pages.push(i);
  }
  return pages;
});

function getVodPic(vod) {
  if (!vod.vod_pic) return "";
  let url = vod.vod_pic;
  url = url.replace(props.old_pic_domain, props.new_pic_domain);
  return url;
}

function onSearch() {
  params.wd = searchKey.value.trim();
  params.pg = 1;
  fetchList();
}

function resetSearch() {
  searchKey.value = "";
  params.wd = "";
  params.pg = 1;
  fetchList();
}

function goPage(p) {
  if (p < 1 || p > totalPage.value || p === params.pg) return;
  params.pg = p;
  fetchList();
}

watch(
  () => props.api,
  () => {
    typeList.value = [];
    vodList.value = [];
    params.pg = 1;
    params.wd = "";
    searchKey.value = "";
    fetchType();
    fetchList();
  },
);

onMounted(() => {
  loadHistory();
  loadScript(
    "https://cdn.jsdelivr.net/npm/artplayer@5/dist/artplayer.min.js",
    "Artplayer",
  );
  loadScript(
    "https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js",
    "Hls",
  );
  fetchType();
  fetchList();
});

onUnmounted(() => {
  // 组件销毁，终止所有正在进行的请求
  globalAbortController.abort();
  destroyArt();
  clearTimeout(picLoadTimer);
});

function loadScript(src, globalName) {
  if (window[globalName]) return;
  const s = document.createElement("script");
  s.src = src;
  document.head.appendChild(s);
}

function destroyArt() {
  clearTimeout(timeTimer);
  introSkipped = false;
  if (art) {
    art.destroy();
    art = null;
  }
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }
}

function playNext() {
  if (!autoNext.value) return;
  if (currIndex.value < episodeList.value.length - 1) {
    currIndex.value = currIndex.value + 1;
    const nextEp = episodeList.value[currIndex.value];
    if (nextEp.isM3u8) playEp(nextEp, currIndex.value);
  }
}

async function req(query, timeout = 3000) {
  const sp = new URLSearchParams();
  for (const k in query) {
    const v = query[k];
    if (v !== "" && v != null) sp.append(k, v);
  }
  let targetUrl = `${props.api}?${sp.toString()}`;
  if (props.useProxy) {
    targetUrl = props.proxyUrl + encodeURIComponent(targetUrl);
  }

  const controller = new AbortController();
  // 和全局卸载信号联动
  globalAbortController.signal.addEventListener("abort", () =>
    controller.abort(),
  );
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(targetUrl, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error("http error");
    const json = await res.json();
    return json;
  } catch (err) {
    clearTimeout(timer);
    // 超时/组件销毁取消请求，静默，不打印红报错
    if (err.name === "AbortError") {
      return null;
    }
    console.error("请求失败", err);
    return null;
  }
}

async function fetchType() {
  const data = await req({ ac: "type" });
  if (data?.class) {
    typeList.value = data.class;
  }
}

async function loadSinglePic(item) {
  if (picCache.has(item.vod_id)) {
    item.vod_pic = picCache.get(item.vod_id);
    item.__picLoading = false;
    return;
  }
  item.__picLoading = true;
  picLoadTimer = setTimeout(async () => {
    try {
      const d = await req({ ac: "detail", ids: item.vod_id }, 2500);
      if (d?.list?.[0]?.vod_pic) {
        item.vod_pic = d.list[0].vod_pic;
        picCache.set(item.vod_id, item.vod_pic);
      }
    } catch (e) {}
    item.__picLoading = false;
  }, 120);
}

async function fetchList() {
  if (fetchLock) return;
  fetchLock = true;
  loading.value = true;
  error.value = "";
  const data = await req({
    ac: "list",
    t: params.t,
    pg: params.pg,
    wd: params.wd,
  });
  if (data?.list) {
    vodList.value = data.list;
    total.value = data.total || 0;
    const pc =
      data.pagecount ??
      data.page?.pagecount ??
      Math.ceil(total.value / props.pageSize);
    totalPage.value = Math.max(1, pc);
    vodList.value.forEach((item) => loadSinglePic(item));
  } else {
    vodList.value = [];
    total.value = 0;
    totalPage.value = 0;
  }
  loading.value = false;
  fetchLock = false;
}

async function openVodDetail(vod, targetLineName = "", targetEpIdx = 0) {
  destroyArt();
  currTitle.value = vod.vod_name;
  showModal.value = true;
  localIntroSec.value = props.introSec;
  localOutroSec.value = props.outroSec;
  introSkipped = false;
  activeTab.value = "ep";
  const data = await req({ ac: "detail", ids: vod.vod_id });
  if (!data?.list?.[0]) {
    error.value = "获取影片详情失败";
    return;
  }
  const item = data.list[0];
  vodDetail.value = item;
  lineList.value = parseMultiLine(item.vod_play_from, item.vod_play_url);
  if (lineList.value.length === 0) {
    lineList.value = [];
    episodeList.value = [];
    currentEp.value = null;
    return;
  }
  let targetLine = lineList.value.find((l) => l.name === targetLineName);
  if (!targetLine) {
    targetLine =
      lineList.value.find((l) => l.name === "m3u8") || lineList.value[0];
  }
  currLineName.value = targetLine.name;
  episodeList.value = targetLine.epList;
  const epIdx = Math.min(targetEpIdx, episodeList.value.length - 1);
  currIndex.value = epIdx;
  const firstEp = episodeList.value[epIdx];
  currentEp.value = firstEp;
  addHistory(item, currLineName.value, currIndex.value, firstEp?.name ?? "");
  introSkipped = false;
  if (firstEp?.isM3u8) {
    playEp(firstEp, currIndex.value);
  } else {
    destroyArt();
  }
}

function parseMultiLine(fromStr, urlStr) {
  if (!fromStr || !urlStr) return [];
  const fromArr = fromStr.split("$$$");
  const urlArr = urlStr.split("$$$");
  const res = [];
  for (let i = 0; i < fromArr.length; i++) {
    const epStr = urlArr[i];
    const lineName = fromArr[i];
    if (!epStr) continue;
    const epList = epStr
      .split("#")
      .map((epItem) => {
        const [epName, epUrl] = epItem.split("$");
        if (!epUrl) return null;
        const isM3u8 = epUrl.includes(".m3u8");
        return {
          name: epName,
          url: epUrl,
          rawUrl: epUrl,
          isM3u8,
        };
      })
      .filter(Boolean);
    if (epList.length === 0) continue;
    res.push({ name: lineName, epList });
  }
  return res;
}

function switchLine(line) {
  currLineName.value = line.name;
  episodeList.value = line.epList;
  currIndex.value = 0;
  const firstEp = episodeList.value[0];
  if (!firstEp) {
    currentEp.value = null;
    destroyArt();
    return;
  }
  currentEp.value = firstEp;
  introSkipped = false;
  if (firstEp.isM3u8) {
    playEp(firstEp, 0);
  } else {
    destroyArt();
  }
}

function onLineChange() {
  const line = lineList.value.find((l) => l.name === currLineName.value);
  if (line) switchLine(line);
}

function onEpChange() {
  const ep = episodeList.value[currIndex.value];
  if (!ep) return;
  currentEp.value = ep;
  introSkipped = false;
  addHistory(vodDetail.value, currLineName.value, currIndex.value, ep.name);
  if (ep.isM3u8) {
    playEp(ep, currIndex.value);
  } else {
    destroyArt();
  }
}

function playEp(ep, idx) {
  currIndex.value = idx;
  currentEp.value = ep;
  destroyArt();
  introSkipped = false;
  if (!ep.isM3u8) return;
  nextTick(() => {
    if (!artRef.value || !window.Artplayer || !window.Hls) return;
    art = new Artplayer({
      container: artRef.value,
      url: ep.url,
      autoplay: true,
      muted: false,
      settings: [],
      fullscreen: true,
      fullscreenWeb: true,
      customType: {
        m3u8: function (video, url) {
          if (Hls.isSupported()) {
            hlsInstance = new Hls();
            hlsInstance.loadSource(url);
            hlsInstance.attachMedia(video);
            hlsInstance.on(Hls.Events.ERROR, (_, data) => {
              if (data.fatal) {
                error.value = "播放资源加载失败";
              }
            });
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          }
        },
      },
    });

    art.on("ready", () => {
      art.play();
      if (skipIntroOutro.value && localIntroSec.value > 0 && !introSkipped) {
        art.currentTime = localIntroSec.value;
        introSkipped = true;
      }
    });

    art.on("video:ended", () => {
      playNext();
    });

    art.on("video:timeupdate", () => {
      const dur = art.duration;
      const cur = art.currentTime;
      if (!dur || dur <= 0) return;
      if (skipIntroOutro.value && !introSkipped && cur < localIntroSec.value) {
        art.currentTime = localIntroSec.value;
        introSkipped = true;
      }
      if (skipIntroOutro.value && autoNext.value) {
        if (dur > localOutroSec.value && cur >= dur - localOutroSec.value) {
          clearTimeout(timeTimer);
          timeTimer = setTimeout(() => {
            playNext();
          }, 1000);
        }
      }
    });
  });
}

function handleImgError(e) {
  const parent = e.target.parentNode;
  e.target.remove();
  const placeholder = document.createElement("div");
  placeholder.className = "poster-placeholder";
  placeholder.innerHTML = "<span>图片失效</span>";
  parent.appendChild(placeholder);
}

function prevEp() {
  if (currIndex.value <= 0) return;
  currIndex.value -= 1;
  onEpChange();
}
function nextEp() {
  if (currIndex.value >= episodeList.value.length - 1) return;
  currIndex.value += 1;
  onEpChange();
}

function closePlayer() {
  showModal.value = false;
  destroyArt();
  currentEp.value = null;
}

function handleKeydown(e) {
  if (!showModal.value) return;
  if (e.code === "Escape") {
    closePlayer();
  }
  if (e.code === "ArrowLeft") {
    prevEp();
  }
  if (e.code === "ArrowRight") {
    nextEp();
  }
  if (e.code === "Space") {
    e.preventDefault();
    if (art && art.video) {
      if (art.video.paused) art.play();
      else art.pause();
    }
  }
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

/* ========== 弹窗新版样式【优化版，直接替换你原来这一块】 ========== */
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
  width: 94%;
  max-width: 1240px;
  background: #0f0f0f;
  color: #fff;
  padding: 18px;
  border-radius: 12px;
  max-height: 92vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid #222;
  gap: 14px;
}

.modal-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  font-weight: 500;
}

.ep-nav-btn-group {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}
.ep-nav-btn {
  border: 1px solid #333;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;
}
.ep-nav-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.18);
  color: #3b82f6;
}
.ep-nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .ep-nav-btn-group {
    display: none;
  }
}

.btn-close {
  border: 1px solid #333;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background: #ef4444;
  border-color: #ef4444;
}

.modal-body-wrap {
  display: grid;
  grid-template-columns: 73% 25%;
  gap: 2%;
}

.modal-left {
  width: 100%;
}

.player-container {
  width: 100%;
  height: 440px;
  background: #000;
  border-radius: 10px;
  overflow: hidden;
}
.player-empty {
  width: 100%;
  height: 440px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  border-radius: 10px;
}

.web-iframe {
  width: 100%;
  height: 440px;
  background: #fff;
  border-radius: 10px;
}

/* 右侧Tab面板：高度固定锁死 440px 和播放器一致 */
.modal-right {
  background: #181818;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  height: 440px;
  overflow: hidden;
}

.tab-header {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  border-bottom: 1px solid #272727;
}
.tab-btn {
  padding: 10px 16px;
  background: transparent;
  border: none;
  color: #aaa;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  font-size: 14px;
  transition: 0.2s;
}
.tab-btn.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}
.tab-btn:hover:not(.active) {
  color: #ddd;
  background: rgba(255, 255, 255, 0.05);
}

/* tab内容区域占剩余高度，超出滚动 + 美化滚动条 */
.tab-content {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
}
.tab-content::-webkit-scrollbar {
  width: 5px;
}
.tab-content::-webkit-scrollbar-thumb {
  background-color: #444;
  border-radius: 3px;
}
.tab-content::-webkit-scrollbar-track {
  background: #222;
}
.tab-panel {
  min-height: 0;
}

/* 剧集面板【重点优化：圆角、柔和选中色，不再生硬】 */
.ep-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 9px;
}
.ep-btn {
  padding: 7px 0;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid #2d2d2d;
  color: #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.ep-btn:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}
.ep-btn.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.35);
}

/* 详情面板 */
.info-item {
  display: flex;
  gap: 8px;
  padding: 6px 0;
  font-size: 14px;
}
.info-item label {
  color: #999;
  white-space: nowrap;
}
.info-desc {
  flex-direction: column;
}
.info-desc span {
  line-height: 1.6;
  color: #ddd;
}
.info-empty {
  color: #888;
  padding: 10px 0;
}

/* 历史面板样式 */
.history-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.clear-history-btn {
  border: 1px solid #444;
  background: #222;
  color: #eee;
  padding: 4px 9px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: 0.2s;
}
.clear-history-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
}
.empty-tip {
  color: #999;
  padding: 20px 0;
  text-align: center;
}
.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 10px;
}
.history-card {
  border-radius: 8px;
  overflow: hidden;
  background: #111;
  cursor: pointer;
  transition: 0.2s;
}
.history-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}
.history-pic {
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  display: block;
}
.history-name {
  font-size: 12px;
  color: #fff;
  padding: 3px 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.history-time {
  font-size: 10px;
  color: #aaa;
  padding: 0 4px 4px;
}

/* 设置面板 */
.setting-row-inline {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 8px 0;
}
.setting-row-inline .toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ccc;
  cursor: pointer;
}
.setting-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}
.setting-item label {
  width: 110px;
  color: #ccc;
}
.setting-item select,
.setting-item input[type="number"] {
  padding: 6px 8px;
  background: #181818;
  border: 1px solid #333;
  color: #fff;
  border-radius: 6px;
}

.loading,
.error {
  padding: 10px;
  color: #334155;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .vod-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .search-bar {
    flex-wrap: wrap;
  }
  .player-container,
  .web-iframe,
  .modal-right,
  .player-empty {
    height: 240px;
  }
  .pagination-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  .modal-body-wrap {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
