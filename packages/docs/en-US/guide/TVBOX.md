# 📺 TVBox Compatibility Feature Usage Guide

## 🎯 Feature Introduction

VODTV delivers a full‑featured TVBox configuration interface for seamless import of your video sources into the TVBox application. It supports multiple output modes, intelligent Spider‑JAR management, secure access control and other advanced capabilities.

## 🚀 Quick Start

### 1. Access the configuration page

Inside the VODTV web UI, click **TVBox Configuration** on the left‑hand navigation bar, or visit directly:

```
https://your‑domain.com/tvbox
```

### 2. Select configuration mode

Four configuration modes are available to suit different scenarios:

#### 📊 **Standard Mode** (Recommended)

```
https://your‑domain.com/api/tvbox?format=json
```

‑ Full preset configuration (IJK tuning, ad‑filtering, DoH DNS)
‑ Hardware‑decoding and software‑decoding options
‑ Works well for most users

#### 🔒 **Safe Mode**

```
https://your‑domain.com/api/tvbox?format=json&mode=safe
```

‑ Only essential JSON fields retained
‑ Improved TVBox client compatibility
‑ Use this when facing compatibility failures

#### ⚡ **Fast Mode** (Newly added)

```
https://your‑domain.com/api/tvbox?format=json&mode=fast
```

‑ **Optimized source‑switching speed**, reduces stuttering
‑ Removes timeout / retry settings to eliminate waiting delays
‑ Mitigates SSL handshake errors
‑ **Ideal for users frequently switching between sources**

#### 🎬 **YingShiCang Mode**

```
https://your‑domain.com/api/tvbox?format=json&mode=yingshicang
```

‑ Optimized specifically for YingShiCang client
‑ Includes playback‑rule fixes for compatibility
‑ Supports resource sites such as Quantum & FeiFan

### 3. Choose output format

Two output formats are provided:
**JSON Format (Recommended):**

```
?format=json
```

‑ Standard JSON configuration, convenient for debugging
‑ Supported by mainstream TVBox forks
‑ Suitable for most scenarios

**Base64 Format:**

```
?format=base64
```

‑ Base64‑encoded config payload
‑ For special environments
‑ Required by a subset of TVBox variants

### 4. Import into TVBox

1. Copy your generated configuration link
2. Open the TVBox app
3. Navigate to Settings → Config address
4. Paste the URL and confirm import

## 🔐 Security Configuration

### Token Authentication

VODTV implements two token schemes: **Global Token** and **User‑Specific Token**.

#### Global Token (Legacy Mode)

Administrator defines one shared token in TVBox‑Security‑Config for everybody:

```
https://your‑domain.com/api/tvbox?format=json&token=GLOBAL_TOKEN
```

#### User‑Specific Token (Recommended)

**New feature**: Administrators may generate isolated TVBox tokens for individual users and constrain which video sources each user is permitted to access.

**Benefits:**
‑ 🎯 **Fine‑grained permission control**: different users get distinct source access lists
‑ 🔒 **Better security**: leakage of one token only impacts that single account
‑ 📊 **Usage tracing**: identify visitor identity from token
‑ 🔄 **Flexible maintenance**: regenerate token or adjust source permissions anytime for one user

**Setup Steps:**

1. Admin log‑in → open **User Management** backend page
2. Locate target user and click the **TVBox Token** button
3. Click Generate Token to create private token for this user
4. Select accessible video‑sources (leave blank = all sources permitted)
5. Save changes

**User‑side usage:**

```
https://your‑domain.com/api/tvbox?format=json&token=USER_SPECIFIC_TOKEN
```

**Fallback logic:**
‑ If a user owns a dedicated token, apply that user‑scoped source permission
‑ Without user‑specific token, fall back to global‑token scope (all sources accessible)

### IP Whitelist

Restrict incoming access to nominated IP addresses, CIDR notation supported:

```
192.168.1.0/24
10.0.0.1
```

### Request Rate‑Limiting

Prevent abusive scraping; default quota is 60 requests per minute.

## 🚀 Spider JAR Acceleration (Vercel‑Only Feature)

### 📦 What is Spider JAR?

Spider JAR (~276KB) is the core parsing component used by TVBox, normally hosted on GitHub.

### ⚡ Vercel Blob CDN Acceleration

**Only available for Vercel deployments.** VODTV enables global CDN acceleration automatically.

**Advantages:**
‑ ✅ **Global acceleration** – clients download from nearest edge node (0.5s vs 2s)
‑ ✅ **Reduced origin load** – 99% traffic served via CDN, conserving server bandwidth
‑ ✅ **Auto‑refresh** – Cron job runs daily at 01:00 to fetch newest JAR
‑ ✅ Graceful fallback – proxy mode automatically used if Blob token missing
‑ ✅ Zero manual maintenance after token setup

**Workflow:**

```
First deployment → incoming user request → backend fetches from GitHub → async upload to Vercel Blob CDN
Subsequent requests → client downloads straight‑from CDN ✅ fast!
Daily 01:00 → Cron auto‑job pulls latest JAR & uploads to Blob
```

**Vercel Setup Steps:**

1. Add environment variable within your Vercel project settings:

```
BLOB_READ_WRITE_TOKEN=<your‑token>
```

2. Retrieve token:
‑ Vercel Dashboard → Storage → Create Database → Blob
‑ Copy generated `BLOB_READ_WRITE_TOKEN`
3. Redeploy project; functionality activates automatically.

**Cron‑Scheduled‑Task Details:**
The VODTV cron job (runs daily 01:00 UTC) executes these background jobs:
‑ 🕷️ **Spider‑JAR update**: pull newest jar from GitHub & upload to Blob CDN (Vercel + valid Blob‑token only)
‑ 📺 **Live‑channel refresh**: refresh channel counts for all live‑stream sources
‑ 📊 **Playback‑history sync**: update watch‑history & favorites, detect new episodes
‑ 🧹 **Inactive‑user cleanup**: purge stale user records (if enabled)
‑ 🔄 **Subscription sync**: sync remote config subscriptions (if enabled)

**Notes:**
‑ ⚠️ Without `BLOB_READ_WRITE_TOKEN`, Spider‑JAR CDN sync skips silently; remaining features keep working
‑ ✅ Cron schedule is defined inside `vercel.json`, defaults to daily 01:00 UTC
‑ ✅ Manual trigger available via `/api/cron` (administrator privilege required)

**Non‑Vercel deployments:**
‑ ✅ Gracefully falls back to server‑side proxy mode
‑ ✅ Full feature‑set remains operational
‑ ✅ No extra configuration necessary

## 🎛️ Advanced Features

### 🎯 Intelligent Search Proxy (New Feature)

Intelligent search proxy is enabled by default to fix imprecise TVBox search results.

**Capabilities:**
‑ ✅ **Smart result sorting**: higher‑relevance items prioritized
‑ ✅ **Adult‑content filtering**: sensitive entries filtered out (configurable)
‑ ✅ **Strict‑match mode**: return only strongly‑relevant matches
‑ ✅ Transparent operation: no TVBox‑side configuration needed

**Workflow:**

1. TVBox issues search request to upstream video source
2. VODTV intercepts & retrieves raw upstream search results
3. Smart ranking: exact match → prefix match → substring match → fuzzy match
4. Filter adult‑marked sources & sensitive keyword results
5. Deliver refined result list back to TVBox client

**Adult‑content filtering:**
Filtering is activated by default; over 29 sensitive keywords are matched:
‑ Ethics‑themed films, welfare‑content, adult‑oriented anime, uniform‑themed material etc.
‑ Sources flagged `is_adult=true` get fully filtered
‑ Categories containing sensitive keywords are stripped

**Filter‑control options:**
⭐ **Option1: Path prefix (Recommended)**
For clients like OrionTV which cannot append URL query‑parameters:

```
# Family safe mode (filter ON, default)
https://your‑domain.com/api/tvbox
# Unrestricted full‑content mode (filter OFF)
https://your‑domain.com/adult/api/tvbox
```

Paths prefixed `/adult/` internally rewrite request with implicit `?adult=1`, no manual parameter required.

💡 **Option2: URL query parameters**
For standard clients (TVBox, browser):

```
# Default (smart‑search + filter enabled)
https://your‑domain.com/api/tvbox
# Show adult‑tagged content
https://your‑domain.com/api/tvbox?adult=1
# alternative
https://your‑domain.com/api/tvbox?filter=off
# Disable intelligent search proxy (not recommended)
https://your‑domain.com/api/tvbox?proxy=off
# Strict‑match only mode
https://your‑domain.com/api/tvbox?strict=1
```

**Parameter precedence:**

1. `/adult/` path prefix → enable adult content
2. URL param `?filter=off` → deactivate filter
3. URL param `?adult=1` → enable adult content
4. Global backend config `DisableYellowFilter` → system default policy

**Usage scenarios:**
‑ Family deployment: stick to default URL with filtering active
‑ OrionTV client: leverage `/adult/` path prefix toggle
‑ Multi‑device household: different URLs for different device policies
‑ Personal private‑use: append `?adult=1` or use `/adult/` endpoint for unrestricted view

### ☁️ Cloudflare Worker Proxy Acceleration

VODTV can leverage Cloudflare Worker to add global CDN acceleration for upstream video‑source APIs.

**Features:**
‑ ✅ Global acceleration via worldwide Cloudflare edge nodes
‑ ✅ Smart detection & replacement for legacy pre‑existing proxy URLs saved in sources
‑ ✅ Central management: one toggle in admin panel applies proxy to all sources
‑ ✅ Self‑hosted custom Worker deployment is supported

**Configuration Steps:**

1. Backend admin panel setup
‑ Log into VODTV administrator dashboard
‑ Navigate to **TVBox Security Configuration**
‑ Locate the **Cloudflare Worker Proxy** section
‑ Toggle activation and input Worker endpoint (default: `[https://corsapi.smone.workers.dev](https://corsapi.smone.workers.dev)`)
‑ Save settings
2. Self‑deploy option (optional)
If you want to run your own Worker instance:
‑ Project repo: [CORSAPI](https://github.com/SzeMeng76/CORSAPI%5D(https://github.com/SzeMeng76/CORSAPI))
‑ Deploy to Cloudflare Workers
‑ Paste your own Worker URL into admin settings

**Working principle:**

1. Original source API: `[https://lovedan.net/api.php/provide/vod](https://lovedan.net/api.php/provide/vod)`
2. After proxy activation it becomes:
`[https://corsapi.smone.workers.dev/p/lovedan?url=https://lovedan.net/api.php/provide/vod](https://corsapi.smone.workers.dev/p/lovedan?url=https://lovedan.net/api.php/provide/vod)`
3. TVBox appends API parameters at call‑time: `...?url=...&ac=list&pg=1`
4. Worker transparently forwards all query arguments to upstream origin:
`[https://lovedan.net/api.php/provide/vod?ac=list&pg=1](https://lovedan.net/api.php/provide/vod?ac=list&pg=1)`

**Intelligent processing logic:**
‑ 🔄 **Automatic de‑duplication**: when source entry already wraps an existing `?url=` proxy parameter, unwrap to extract raw upstream URL then substitute with your new Worker proxy
‑ 🎯 **Distinct path per source**: each assigned `/p/{sourceId}` route prevents TVBox mis‑identifying all proxied sources as identical endpoints
‑ 📦 Full parameter forwarding: pass‑through all TVBox API query arguments (`ac`, `ids`, `pg` etc.)

**Transformation example:**
Assume an existing source entry wrapped inside an old proxy:

```
https://old‑proxy.com/?url=https://lovedan.net/api.php/provide/vod
```

After enabling new Worker proxy the backend automatically:

1. Detects existing `?url=` wrapper
2. Extract the genuine upstream address `[https://lovedan.net/api.php/provide/vod](https://lovedan.net/api.php/provide/vod)`
3. Rewrap using new configured Worker:
`[https://corsapi.smone.workers.dev/p/lovedan?url=https://lovedan.net/api.php/provide/vod](https://corsapi.smone.workers.dev/p/lovedan?url=https://lovedan.net/api.php/provide/vod)`
Unified proxy management & migration is thus achieved.

### 🔄 Spider Jar Intelligent Management

VODTV autonomously manages Spider‑JAR files to maximize reliability:

**Workflow:**

1. Backend probes multiple mirror endpoints (GitCode, Gitee, GitHub etc.)
2. On success return public remote URL to offload server bandwidth
3. On failure roll over randomly among backup mirrors to eliminate single‑point failure
4. 6‑hour cache lifetime with real MD5 integrity validation

**Advantages:**
‑ ✅ Auto‑select lowest‑latency mirror
‑ ✅ Grace degrade on SSL errors
‑ ✅ Prevent 404 missing‑file errors
‑ ✅ Zero server bandwidth consumption (direct client‑to‑CDN download)

**Diagnostic debug fields embedded in output config:**

```
{
  "spider_url": "actual downloaded mirror url",
  "spider_md5": "verified MD5 hash",
  "spider_cached": true,
  "spider_real_size": 283672,
  "spider_tried": 1,
  "spider_success": true,
  "spider_backup": "fallback mirror address",
  "spider_candidates": ["mirror candidate list"]
}
```

### 📋 Configuration Mode Comparison

| Function | Standard Mode | Safe Mode | Fast Mode | YingShiCang Mode |
| --- | --- | --- | --- | --- |
| **IJK Player preset** | ✅ Full | ❌ Omitted | ❌ Omitted | ✅ Full |
| **DoH DNS entries** | ✅ Included | ❌ Omitted | ❌ Omitted | ❌ Omitted |
| **Ad‑filtering preset** | ✅ Included | ❌ Omitted | ❌ Omitted | ✅ Included |
| **Timeout settings** | ✅ 10s/15s | ❌ Omitted | ❌ **Removed entirely** | ❌ Omitted |
| **Retry attempts** | ✅ 1‑2 retries | ❌ Omitted | ❌ **Removed entirely** | ❌ Omitted |
| **Custom playback rules** | ❌ Absent | ❌ Absent | ❌ Absent | ✅ Complete set |
| **Home‑page entry count** | Default | Default | **15 entries** | 20 entries |
| **Resolver list count** | 4 resolvers | 1 resolver | 2 high‑speed resolvers | 4 resolvers |
| **Recommended usage scenario** | Daily regular use | Troubleshooting compatibility bugs | **Frequent source‑switching** | Exclusive for YingShiCang client |

### 🎯 Sites Source‑Config Tuning

Automatically inject optimized headers & timeouts based on source API type:

**MacCMS sources (type 0/1):**

```
{
  "timeout": 10000,
  "retry": 2,
  "header": {
    "User‑Agent": "Mozilla/5.0 (Linux; Android 11; SM‑G973F)...",
    "Accept": "application/json, text/plain, */*",
    "Connection": "close",
    "Cache‑Control": "no‑cache"
  }
}
```

**CSP sources (type 3):**

```
{
  "timeout": 15000,
  "retry": 1,
  "header": {
    "User‑Agent": "okhttp/3.15",
    "Accept": "*/*",
    "Connection": "close"
  }
}
```

### 🌐 DoH (DNS over HTTPS)

Mitigate DNS pollution; Standard‑mode embeds this preset:

```
{
  "doh": [
    {
      "name": "AliDNS",
      "url": "[https://dns.alidns.com/dns](https://dns.alidns.com/dns)‑query",
      "ips": ["223.5.5.5", "223.6.6.6"]
    },
    {
      "name": "Tencent DNS",
      "url": "[https://doh.pub/dns](https://doh.pub/dns)‑query",
      "ips": ["119.29.29.29", "119.28.28.28"]
    },
    {
      "name": "Google DNS",
      "url": "[https://dns.google/dns](https://dns.google/dns)‑query",
      "ips": ["8.8.8.8", "8.8.4.4"]
    }
  ]
}
```

### 🎬 IJK Player Configuration

Hardware‑decoding and software‑decoding presets available:
**Hardware decoding (Recommended):**
‑ `mediacodec: 1` enable hardware acceleration
‑ `mediacodec‑auto‑rotate: 1` auto handle screen rotation
‑ `mediacodec‑handle‑resolution‑change: 1` adapt resolution switching

**Software decoding:**
‑ `mediacodec: 0` disable hardware acceleration
‑ For devices suffering hardware‑decoder compatibility failures

## 📝 API Parameter Reference

### Full URL examples

```
# Standard mode + JSON output
https://your‑domain.com/api/tvbox?format=json
# Fast mode + Base64 + token auth
https://your‑domain.com/api/tvbox?format=base64&mode=fast&token=YOUR_TOKEN
# YingShiCang mode + force refresh spider cache
https://your‑domain.com/api/tvbox?format=json&mode=yingshicang&forceSpiderRefresh=1
```

### Parameter table

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `format` | string | `json` | Output format: `json` / `base64` |
| `mode` | string | `standard` | Config mode: `standard`/`safe`/`fast`/`yingshicang` |
| `token` | string | ‑ | Access token, required when authentication is activated |
| `forceSpiderRefresh` | string | `0` | Bypass spider cache refresh: `1` = trigger refresh |
| `adult` | string | ‑ | Adult‑content toggle: `1`/`true` show, `0`/`false` hide |
| `filter` | string | ‑ | Content filter: `on`/`enable` activate; `off`/`disable` deactivate |
| `proxy` | string | ‑ | Intelligent search proxy: `off`/`disable` to turn proxy off (enabled by default) |
| `strict` | string | `0` | Strict‑search mode toggle: `1` enable high‑relevance‑only results |

## 🔄 Configuration Refresh Behaviour

### Real‑time sync

‑ ✅ Source‑list changes take effect instantly
‑ ✅ No front‑end caching (Cache‑Control: no‑store)
‑ ✅ Spider‑JAR cached for six hours
‑ ✅ Category metadata dynamically resolved on‑the‑fly

### Manual refresh options

Inside TVBox app: Settings → Config address → Refresh
Force‑expire Spider‑JAR cache by appending parameter:

```
?forceSpiderRefresh=1
```

## 🛠️ Troubleshooting

### 🎯 Intelligent Search Issues

**Symptom: Too‑few search hits**
‑ Strict‑match mode may be active, remove `?strict=1`
‑ Filtering rules may suppress matches; test `?filter=off`
‑ Verify original upstream source itself returns search hits

**Symptom: Search returns many irrelevant entries**
‑ Turn strict‑matching on: `?strict=1`
‑ Built‑in relevance sorting automatically lifts better‑matched items higher
‑ Check whether your search keyword is overly‑broad

**Symptom: Want to inspect filtered‑out results**
‑ Append URL param `?adult=1`
‑ Or `?filter=off` fully disables content‑filtering
‑ Note: this affects every subsequent search query

**Symptom: Search feels slow**
‑ Intelligent proxy processing latency normally < 1 second
‑ To bypass proxy and query source directly add `?proxy=off` (not recommended)
‑ Inspect network latency & upstream source response‑time

### ⚡ Fast‑Mode Related Problems

**Symptom: Source‑switching still stutters**
‑ Confirm you are actually using `?mode=fast`
‑ Check client‑side network stability
‑ Re‑import configuration link in TVBox

**Symptom: SSL handshake error persists**
‑ Fast‑mode optimizes request headers with `Connection: close`
‑ Spider‑JAR resolver prioritizes domestic stable mirrors
‑ 15‑second overall timeout prevents hanging SSL connections

### 🔐 Security‑Related Errors

**401 Unauthorized**
‑ Double‑check token correctness
‑ Confirm token parameter is appended inside URL
‑ Request administrator for valid token string

**403 Forbidden**
‑ Client IP is excluded from IP‑whitelist
‑ Ask admin to add your IP; CIDR subnet notation is supported e.g. `192.168.1.0/24`

**429 Too Many Requests**
‑ Rate‑limit threshold hit
‑ Wait for one minute before retrying
‑ Reduce manual refresh frequency in client

### 🕷️ Spider‑JAR Troubleshooting

**Symptom: Spider parsing fails**
‑ Backend automatically falls over to backup mirror mirrors
‑ Inspect `spider_success` value from diagnose endpoint
‑ Force refresh cache via `?forceSpiderRefresh=1`

**Diagnostic output: fallback jar in use**
‑ All public remote mirrors temporarily unreachable
‑ Minimal fallback JAR is served as safety guarantee
‑ Normal mirror availability will self‑restore later

### 📺 General TVBox Client Issues

**Configuration import fails**
‑ Verify server network reachability
‑ Toggle output format between json/base64
‑ Confirm your VODTV instance is online

**Source list empty after import**
‑ Confirm sources are not disabled inside backend
‑ Validate source API addresses in admin panel
‑ Trigger config refresh in TVBox

**Video playback failure**
‑ Check upstream source operational status
‑ Try alternative video‑resolver endpoints
‑ Switch to fast‑mode to reduce timeout‑related failures

## 📊 Diagnostic Endpoints

### Config health inspection endpoint

```
GET /api/tvbox/diagnose?token=YOUR_TOKEN
```

Sample returned payload:

```
{
  "ok": true,
  "status": 200,
  "sitesCount": 10,
  "livesCount": 1,
  "parsesCount": 4,
  "spider": "[https://gitcode.net/.../XC.jar;md5;xxx](https://gitcode.net/.../XC.jar;md5;xxx)",
  "spiderReachable": true,
  "spiderSizeKB": 277,
  "spider_url": "actual mirror url",
  "spider_md5": "verified MD5",
  "spider_cached": true,
  "spider_tried": 1,
  "spider_success": true,
  "issues": []
}
```

### Spider‑JAR connectivity health‑check

```
GET /api/tvbox/health?url=JAR_URL
```

Test whether given Spider‑JAR download URL is reachable.

## 🎯 Best Practices

### Mode‑selection recommendations

1. Daily viewing → Standard Mode
2. TVBox runtime errors → Safe Mode
3. Frequently switching video sources → ⚡ Fast Mode
4. Using YingShiCang client → YingShiCang Mode

### Performance tuning advice

‑ ✅ Enable Fast‑Mode for snappier source navigation
‑ ✅ Activate DoH DNS to work around DNS‑resolution issues
‑ ✅ Prefer hardware decoding if device GPU permits
‑ ✅ Periodically refresh configuration link to sync latest upstream‑source updates

### Security hardening tips

‑ ✅ Turn on Token authentication
‑ ✅ Maintain IP‑whitelist where feasible
‑ ✅ Always serve VODTV over HTTPS
‑ ✅ Never publicly share full URLs containing your private token

## 🔗 Related Documentation Links

‑ [Security Configuration Reference](TVBOX_SECURITY.md)
‑ [VODTV Main Project](https://github.com/SzeMeng76/VODTV%5D(https://github.com/SzeMeng76/VODTV))
‑ [Open‑Source TVBox](https://github.com/o0HalfLife0o/TVBoxOSC%5D(https://github.com/o0HalfLife0o/TVBoxOSC))

## 🙏 Acknowledgements

‑ Spider‑JAR management logic referenced [DecoTV](https://github.com/Decohererk/DecoTV%5D(https://github.com/Decohererk/DecoTV))
‑ TVBox configuration design referenced [KatelyaTV](https://github.com/katelya77/KatelyaTV%5D(https://github.com/katelya77/KatelyaTV))
‑ Thanks to the whole open‑source community

---

## 📄 License

This feature inherits main repository license; for personal‑study and private‑use only. Comply with local laws & regulations, commercial usage prohibited.

## 🆕 Changelog

### v3.1 - 2025‑01‑04

‑ ✨ **Cloudflare‑Worker Proxy Acceleration** – global CDN acceleration for upstream source APIs
 ‑ Toggle & configure Worker endpoint from admin dashboard
 ‑ Auto unwrap‑and‑replace legacy pre‑saved proxy URLs inside existing sources
 ‑ Unique per‑source `/p/{sourceId}` routing prevents TVBox source‑identity collision
 ‑ Full transparent forwarding of all TVBox API query parameters (`ac`, `ids`, `pg` etc.)
 ‑ Self‑host custom Worker deployment supported
‑ 🔧 Improved proxy deduplication & substitution logic
‑ 📝 Extended documentation for Worker‑proxy configuration

### v3.0 - 2025‑11‑01

‑ ✨ **Intelligent Search Proxy** enabled by default, improves poor TVBox search‑relevance
 ‑ Relevance ranking logic: exact > prefix > substring > fuzzy match
 ‑ Levenshtein edit‑distance algorithm for refined scoring
 ‑ Release‑year & rating weighted sorting
‑ ✨ **Automatic adult‑content filtering** triggered by 29+ sensitive keyword rules
 ‑ Source‑level filtering respecting `is_adult` source flag
 ‑ Category‑name keyword‑based filtering
 ‑ Flexible runtime control via URL params (`adult`/`filter`/`proxy`/`strict`)
‑ ✨ **Strict‑match mode** `?strict=1` returns only highly‑relevant search results
‑ 🔧 Search‑result cache optimized (5‑min TTL)
‑ 📝 Expanded documentation & troubleshooting section

### v2.0 - 2025‑01‑04

‑ ✨ New Fast‑Mode (`mode=fast`) to improve source‑switch responsiveness
‑ ✨ Intelligent Spider‑JAR management (6‑hour cache + real MD5 validation)
‑ ✨ Multiple fallback mirror selection to eliminate single‑point download failure
‑ ✨ Per‑source Sites timeout & retry header tuning
‑ 🔧 SSL handshake error mitigation (remove HEAD requests, enhance HTTP headers)
‑ 🔧 Built‑in DoH DNS resolver preset
‑ 🔧 IJK hardware‑ / software‑decoder configuration
‑ 🔐 Access‑security controls: Token auth, IP whitelist, request rate‑limiting

### v1.0‑Initial Release

‑ Base TVBox JSON config generation
‑ JSON / Base64 output format support
‑ Automatic source‑list synchronization

If you want to reorganize this technical document into friendlier tutorial content, work task mode can help refine headings, tips and supplementary material, would you like to try?