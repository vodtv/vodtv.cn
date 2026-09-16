# MoonTV Deployment Configuration Documentation
## ⚙️ Configuration File
After deployment, the app starts as an empty shell. Fill in the configuration inside **Admin Dashboard > Configuration File**.

### 📝 Configuration File Format
```json
{
  "cache_time": 7200,
  "api_site": {
    "example_source": {
      "api": "[http://example.com/api.php/provide/vod](http://example.com/api.php/provide/vod)",
      "name": "Example Source Site",
      "detail": "[http://example.com](http://example.com)"
    }
  },
  "custom_category": [
    {
      "name": "Chinese‑language Movies",
      "type": "movie",
      "query": "Chinese‑language"
    },
    {
      "name": "US TV Series",
      "type": "tv",
      "query": "US TV Series"
    }
  ]
}
```

### 📖 Field Description
- **cache_time**: API response cache duration in seconds. Recommended range: 3600‑7200
- **api_site**: Video resource site configuration
  - `key`: Unique identifier (lowercase letters / digits)
  - `api`: Vod JSON API endpoint for resource source (supports Apple CMS V10 format)
  - `name`: Display name shown in UI
  - `detail`: (Optional) Root webpage URL used to scrape episode details
- **custom_category**: Custom categories based on Douban search
  - `name`: Category display name
  - `type`: `movie` for films or `tv` for TV series
  - `query`: Search keyword for Douban

### 🎯 Recommended Custom Categories
**Movie categories**: Hot, Latest, Classics, Douban High‑Score, Hidden Gems, Chinese‑language, Western, South Korean, Japanese, Action, Comedy, Romance, Sci‑Fi, Mystery, Horror, Healing
**TV‑Series categories**: Hot, US Shows, UK Shows, Korean Dramas, Japanese Dramas, Mainland China Dramas, Hong Kong Dramas, Japanese Anime, Variety Shows, Documentaries

You may also input specific keywords e.g. "Harry Potter", which directly performs a Douban search.

---
## 🌐 Environment Variables
### Required Variables
| Variable | Description | Example Value |
|---|---|---|
| `USERNAME` | Admin username | `admin` |
| `PASSWORD` | Admin password | `your_secure_password` |
| `NEXT_PUBLIC_STORAGE_TYPE` | Storage backend type | `kvrocks` / `redis` / `upstash` |

### Storage‑Related Configuration
| Variable | Description | Example Value |
|---|---|---|
| `KVROCKS_URL` | Kvrocks connection URL | `redis://moontv-kvrocks:6666` |
| `REDIS_URL` | Redis connection URL | `redis://moontv-redis:6379` |
| `UPSTASH_URL` | Upstash endpoint | `[https://xxx.upstash.io](https://xxx.upstash.io)` |
| `UPSTASH_TOKEN` | Upstash access token | `AxxxxxxxxxxxxxxxxxxxxxxxxxxxQ==` |

> 💡 **Redis‑compatible services**: `REDIS_URL` works with any Redis‑protocol‑compatible service:
> - Self‑hosted Redis / Kvrocks
> - [Redis Cloud](https://redis.io/cloud/) — Official cloud service, free tier 30 MB
> - [Aiven Valkey](https://aiven.io/valkey) — Free tier 1 GB, Redis 7.2 compatible
> - [Northflank](https://northflank.com/dbaas/managed-redis) — Free tier 256 MB
>
> ⚠️ **For Vercel deployment use Upstash only**:
> Vercel Serverless functions are stateless and cold‑start new instances on incoming requests.
> TCP‑based Redis services (Redis Cloud, Aiven, Northflank etc.) suffer from broken connection pools, high cold‑start latency and exhausted connection limits.
> Upstash uses HTTP REST API, natively built for serverless environments and is the only recommended storage option for Vercel.

### Optional Configuration
| Variable | Description | Default Value | Available Options |
|---|---|---|---|
| `SITE_BASE` | Website base URL | Empty | `[https://example.com](https://example.com)` |
| `NEXT_PUBLIC_SITE_NAME` | Website display name | `MoonTV` | Arbitrary string |
| `ANNOUNCEMENT` | Site announcement | Default announcement | Arbitrary string |
| `NEXT_PUBLIC_SEARCH_MAX_PAGE` | Max search result pages | `5` | `1‑50` |
| `NEXT_PUBLIC_DOUBAN_PROXY_TYPE` | Douban metadata proxy type | `direct` | `direct` / `cors-proxy-zwei` / `cmliussss-cdn-tencent` / `cmliussss-cdn-ali` / `custom` |
| `NEXT_PUBLIC_DOUBAN_PROXY` | Custom Douban metadata proxy | Empty | URL prefix |
| `NEXT_PUBLIC_DOUBAN_IMAGE_PROXY_TYPE` | Douban image proxy type | `direct` | `direct` / `server` / `img3` / `cmliussss-cdn-tencent` / `cmliussss-cdn-ali` / `custom` |
| `NEXT_PUBLIC_DOUBAN_IMAGE_PROXY` | Custom Douban image proxy | Empty | URL prefix |
| `NEXT_PUBLIC_DISABLE_YELLOW_FILTER` | Disable adult‑content filter | `false` | `true` / `false` |
| `NEXT_PUBLIC_FLUID_SEARCH` | Enable streaming search output | `true` | `true` / `false` |
| `DISABLE_HERO_TRAILER` | Disable homepage hero banner trailer | `false` | `true` / `false` |
| `DISABLE_SSRF_PROTECTION` | Disable SSRF protection | `false` | `true` / `false` |

> 💡 **DISABLE_HERO_TRAILER**:
> Hero‑banner trailers consume bandwidth, trailer URLs include timestamps and expire periodically.
> - **Vercel**: Automatically disabled, no extra variable needed.
> - **Docker/VPS (persistent volume available)**: Leave enabled; trailers cache locally under `VIDEO_CACHE_DIR`, expired URLs refresh automatically.
> - **ClawCloud, HF Space, EdgeOne Pages & other platforms without persistent storage**: Set `DISABLE_HERO_TRAILER=true`. Without local cache, expired trailers will be re‑downloaded on every page refresh.
>
> ⚠️ **DISABLE_SSRF_PROTECTION**:
> SSRF (Server‑Side Request Forgery) protection is enabled by default and blocks outgoing requests targeting private LAN addresses.
> - **Public deployment (VPS / Cloud Server / Vercel)**: Keep default (`false`), prevents exploitation to access internal network services.
> - **Private deployment (NAS / Home Server / LAN‑only)**: If your video sources or CMS APIs live inside private LAN (`192.168.x.x`, `10.x.x.x`), set `DISABLE_SSRF_PROTECTION=true`.
> - **Security Warning**: Disabling SSRF protection allows outbound requests to your internal network; use only for private‑LAN deployments. Refer to [security document](SECURITY.md#‑ssrf‑防护说明).

### Douban Proxy Explanation
**DOUBAN_PROXY_TYPE options**:
- `direct`: Server sends requests directly to Douban (may be blocked)
- `cors‑proxy‑zwei`: Proxy service provided by [Zwei](https://github.com/bestzwei)
- `cmliussss‑cdn‑tencent`: Tencent Cloud CDN proxy by [CMLiussss](https://github.com/cmliu)
- `cmliussss‑cdn‑ali`: Alibaba Cloud CDN proxy by [CMLiussss](https://github.com/cmliu)
- `custom`: Self‑supplied proxy, you must also define `NEXT_PUBLIC_DOUBAN_PROXY`

**DOUBAN_IMAGE_PROXY_TYPE options**:
- `direct`: Browser fetches Douban images directly
- `server`: Images are proxied through backend server
- `img3`: Official Douban Alibaba CDN
- `cmliussss‑cdn‑tencent`: Tencent Cloud CDN proxy by CMLiussss
- `cmliussss‑cdn‑ali`: Alibaba Cloud CDN proxy by CMLiussss
- `custom`: Self‑supplied image proxy, you must also define `NEXT_PUBLIC_DOUBAN_IMAGE_PROXY`

---
## 🎛️ Feature Configuration
Almost all settings can be changed from the **Admin Dashboard**. No source‑code edits or service restarts are required.

### Admin Dashboard Entry
Visit `http://your-domain:3000/admin` and log in with your admin credentials.

### Admin Dashboard Modules
Some modules are restricted to super‑admin accounts only.
#### 📁 Configuration File (Admin‑Only)
- **Remote config subscription**:
  - Subscription URL configuration
  - Auto‑pull remote configuration
  - Supports Base58‑encoded JSON payload
- **Inline config editor**:
  - Built‑in JSON editor
  - Save configuration online

#### ⚙️ Site Settings
- **Basic Settings**:
  - Site name
  - Site announcement
- **Douban Metadata Proxy**:
  - Direct / CORS‑Proxy / CDN / Custom proxy selection
  - Custom proxy URL input
- **Douban Image Proxy**:
  - Direct / Server‑side proxy / Official CDN / Custom proxy selection
  - Custom image proxy URL input
- **Search Settings**:
  - Max search result pages (1‑50)
  - API cache time (seconds)
  - Toggle streaming search
- **Content Filtering**:
  - Toggle adult‑content filter
- **TMDB Actor Search**:
  - TMDB API Key input
  - Language selection (CN / EN / JP / KR)
  - Feature enable/disable switch

#### 👥 User Management
- **Registration Settings (Admin‑Only)**:
  - Toggle public user registration
  - Auto‑clean inactive users
  - Retention day configuration
- **User Group Management**:
  - Add / Edit / Delete user groups
  - Assign accessible video‑source permissions per group
- **User List**:
  - Bulk assign user groups
  - Manual create / modify users
  - Reset passwords
  - Ban / unban accounts
  - Grant administrator privileges
  - Delete users

#### 🎬 Video Source Management
- **Video Source List**:
  - Add new video sources (name + API endpoint)
  - Bulk enable/disable/delete
  - Import & export source list for backup or migration
  - Source health validation check
  - One‑click select invalid sources
  - Drag‑and‑drop reordering
  - Edit or delete individual entries
- **Source Tester & Browser**:
  - Browse & test content of configured API sources
  - Source health inspection
  - Mobile‑responsive layout
  - Side drawer to display test output

#### 📺 Live Stream Source Management
- **Live source management**:
  - Add live streams (name + m3u/m3u8 URL)
  - Refresh live‑source metadata
  - Drag‑and‑drop sorting
  - Edit / delete live entries

#### 🏷️ Category Settings
- **Custom Category**:
  - Add / modify custom categories
  - Drag‑and‑drop sort
  - Category backed by Douban search query

#### 🔍 Cloud‑Disk Search Settings
- **Basic Configuration**:
  - Master toggle for cloud‑disk search feature
  - PanSou backend service URL
  - Request timeout value
- **Supported cloud drives**:
  - Baidu Netdisk, Aliyundrive, Quark Cloud, Tianyi Cloud
  - UC Cloud, China Mobile Cloud, 115 Cloud, PikPak
  - Xunlei Cloud, 123 Cloud
  - Magnet links, eD2k links

#### 🤖 AI Recommendation Settings
- OpenAI API configuration
- Model selection & parameter tuning
- Manage custom AI‑prompt templates

#### 🎥 YouTube Integration
- YouTube Data API v3 key
- Search and cache configuration
- Feature toggle switch

#### 🔐 TVBox Security Settings
- IP whitelist management
- Token authentication configuration
- TVBox API endpoint options

#### 🗄️ Cache Management (Admin‑Only)
- Inspect cache statistics for different subsystems
- Clear caches for YouTube, cloud‑disk, Douban, danmaku

#### 📦 Data Migration (Admin‑Only)
- Full‑site import / export backup
- Database migration helper tool