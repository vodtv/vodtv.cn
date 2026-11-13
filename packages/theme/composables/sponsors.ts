import { ref, computed, onMounted } from "vue";

interface SponsorItem {
  name: string;
  amount: number;
  message: string;
  date: string;
}

const API_URL =
  "https://gh-proxy.com/raw.githubusercontent.com/hefung/hefung/refs/heads/main/sponsors-random.json";
// ========= 缓存配置 =========
const CACHE_KEY = "hefung_sponsors_data_cache";
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12小时，你想改成 1小时就写 1*60*60*1000
// ============================

const rawSponsors = ref<SponsorItem[]>([]);
const loading = ref(false);
const errorMsg = ref("");
let initialized = false;

// 读取本地缓存
function getCache() {
  const str = localStorage.getItem(CACHE_KEY);
  if (!str) return null;
  try {
    const obj = JSON.parse(str);
    // 判断有没有过期
    if (Date.now() - obj.timestamp < CACHE_TTL) {
      return obj.data;
    }
  } catch (e) {
    // 缓存损坏，丢弃
  }
  return null;
}

// 写入缓存，带上当前时间戳
function setCache(data: SponsorItem[]) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      timestamp: Date.now(),
      data,
    }),
  );
}

async function fetchSponsors() {
  if (initialized) return;

  // 优先读取有效缓存
  const cacheData = getCache();
  if (cacheData) {
    rawSponsors.value = cacheData;
    initialized = true;
    return;
  }

  loading.value = true;
  errorMsg.value = "";
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    rawSponsors.value = Array.isArray(data) ? data : [];
    // 拉取成功 → 存入本地缓存
    setCache(rawSponsors.value);
    initialized = true;
  } catch (err: any) {
    if (err.name === "AbortError") {
      errorMsg.value = "加载超时，请刷新重试";
    } else {
      errorMsg.value = "Sponsors数据加载失败";
    }
    rawSponsors.value = [];
  } finally {
    loading.value = false;
  }
}

const sponsors = computed(() => rawSponsors.value);
const stats = computed(() => {
  const list = sponsors.value;
  const totalAmount = list.reduce((sum, item) => sum + Number(item.amount), 0);
  return {
    totalAmount,
    totalSponsors: list.length,
  };
});

export function useSponsors() {
  onMounted(() => {
    fetchSponsors();
  });
  return { sponsors, stats, loading, errorMsg };
}
