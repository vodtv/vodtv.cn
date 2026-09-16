# 🚀 Cloudflare Worker Proxy Acceleration Configuration Guide

VODTV provides multiple independent Cloudflare Worker proxy configurations for TVBox subscriptions, web playback (including m3u8/video streams), Bangumi data/images, and TMDB data/images acceleration.

## 📋 Table of Contents

- [Feature Overview](#-feature-overview)
- [Configuration Steps](#%EF%B8%8F-configuration-steps)
- [Working Principle](#-working-principle)
- [Self-hosted Deployment](#-self-hosted-deployment)
- [FAQ](#-faq)

---

## 🎯 Feature Overview

### Multiple Independent Proxy Configurations

VODTV has several fully independent proxy toggles that do not interfere with each other:

表格

| Config Type | Location | Scope of Impact | Purpose |
| --- | --- | --- | --- |
| **TVBox Proxy** | TVBox Security Config | TVBox config API only | Acceleration for TVBox app |
| **Video Source Proxy** | Video Source Config | Web playback metadata + m3u8/video streams | Accelerate VODTV web playback (Emby sources skipped, requires custom auth headers) |
| **Bangumi Proxy** | User Settings / Admin Panel | Bangumi data & cover images | Reuse video source proxy address as an alternative to CMLiussss reverse proxy |
| **TMDB Proxy** | Reuse video source proxy toggle | TMDB API & images (poster/backdrop/logo) | Automatically enabled when video source proxy is turned on; direct connection otherwise |

**Why separate them?**

- 🎯 **Flexible Control**: Enable proxy only for TVBox while leaving web playback untouched
- 🔧 **Independent Troubleshooting**: Debug each component separately when issues arise
- 📊 **Traffic Management**: Control traffic for different use cases individually

---

## ⚙️ Configuration Steps

### 1. TVBox Proxy Configuration

**Use Case**: Accelerate video source access for the TVBox app

**Steps**:

1. Log in to the VODTV admin dashboard
2. Navigate to **TVBox Security Config**
3. Locate the **Cloudflare Worker Proxy (TVBox Only)** section
4. Toggle the proxy switch ON
5. Fill in the Worker endpoint (default: `https://corsapi.smone.workers.dev`)
6. Save configuration

**Behavior**:

- All sources inside the TVBox subscription endpoint (`/api/tvbox`) are automatically proxied
- Example: `https://lovedan.net/api.php/provide/vod`
→ `https://corsapi.smone.workers.dev/p/lovedan?url=https://lovedan.net/api.php/provide/vod`

---

### 2. Video Source Proxy Configuration

**Use Case**: Accelerate video source access for VODTV web playback (metadata + playback streams)

**Steps**:

1. Log in to the VODTV admin dashboard
2. Navigate to **Video Source Config**
3. Find the **Cloudflare Worker Proxy Acceleration** section at the top
4. Toggle the proxy switch ON
5. Fill in the Worker endpoint (default: `https://corsapi.smone.workers.dev`)
6. Save proxy configuration

**Behavior**:

- Metadata collection: All requests via `/api/proxy/cms` go through Worker proxy to speed up search and detail pages
- Playback stream acceleration: m3u8/video streams for regular sources and short drama sources are proxied. m3u8 uses `/m3u8` endpoint with automatic `.ts` sublink rewriting; other formats use the generic `/?url=` endpoint
- **Emby sources are automatically skipped**: Custom `X-Emby-Authorization` auth headers cannot be forwarded by Worker, and self-hosted Emby servers usually perform better with direct connection
- Automatic fallback: If proxy fails, playback falls back to original direct URL once. Worker outages will not break playback entirely

---

### 3. Bangumi Proxy Configuration

**Use Case**: Accelerate Bangumi anime metadata and cover images (`api.bgm.tv` / `lain.bgm.tv` may be blocked in some regions)

**Steps**:

1. Log into VODTV, open **User Settings** or admin **System Settings** panel
2. Find **Bangumi Data Source** / **Bangumi Image Proxy** option
3. Select proxy mode:
   - `server`: Direct connection from server
   - `cmliussss`: CMLiussss reverse proxy / CDN (recommended for mainland users)
   - `worker`: Reuse the video source proxy address configured above (video source proxy must be enabled and saved first)
4. Save configuration

**Behavior**:

- Bangumi anime info, calendar, cover images are forwarded according to selected mode
- The `worker` option acts as an alternative to CMLiussss, faster when hitting Cloudflare edge cache

---

### 4. TMDB Proxy Configuration

**Use Case**: Accelerate TMDB series details, ratings, poster/backdrop/logo images

**Steps**:
TMDB proxy **reuses the video source proxy toggle**, no separate configuration required:

1. Enable and save the Worker address following the **Video Source Proxy Configuration** steps above
2. Once enabled, TMDB API calls and image URLs will automatically route through the Worker
3. If video source proxy is disabled, TMDB requests remain direct, unaffected

---

## 🔧 Working Principle

### Intelligent Proxy Flow

```
Original Source URL
  ↓
Check for existing proxy (?url= parameter)
  ↓
If exists → extract real target URL
  ↓
Generate unique path /p/{sourceId}
  ↓
Construct Worker proxy URL
  ↓
Forward all API parameters (ac, ids, pg, etc.)
  ↓
Worker requests the origin server
  ↓
Return response
```

### Conversion Examples

**Scenario 1: Normal Source**

```
Original: https://lovedan.net/api.php/provide/vod
Proxied: https://corsapi.smone.workers.dev/p/lovedan?url=https://lovedan.net/api.php/provide/vod
```

**Scenario 2: Source already wrapped by old proxy**

```
Original: https://old-proxy.com/?url=https://lovedan.net/api.php/provide/vod
Extracted: https://lovedan.net/api.php/provide/vod
New proxy: https://corsapi.smone.workers.dev/p/lovedan?url=https://lovedan.net/api.php/provide/vod
```

**Scenario 3: API call with query parameters**

```
TVBox Request: /p/lovedan?url=https://lovedan.net/api.php/provide/vod&ac=list&pg=1
Worker Forward: https://lovedan.net/api.php/provide/vod?ac=list&pg=1
```

### VOD Playback Stream 3-level Fallback

Playback streams (m3u8/segments) run on a separate chain from CMS metadata proxy. Requests automatically degrade sequentially on failure to avoid playback interruption:

```
① Direct connect to origin
  ↓ On failure
② Worker proxy (/m3u8, /?url= endpoints)
  ↓ On failure
③ Native VODTV HLS proxy (local server proxy)
```

- `NETWORK_ERROR` from hls.js and `error` events from ArtPlayer trigger this fallback chain
- Emby sources are excluded from this chain and always connect directly due to auth header requirements

### Core Features

- ✅ **Auto Proxy Unwrap**: Detect and replace legacy proxy wrappers
- ✅ **Unique Path Routing**: Isolate each source with `/p/{sourceId}` to avoid conflicts
- ✅ **Parameter Forwarding**: Preserve all API parameters for TVBox and web requests
- ✅ **Fallback Mechanism**: CMS metadata falls back to local proxy on Worker failure; playback streams use the 3-level fallback above
- ✅ **Cache Optimization**: 5-minute response cache to reduce repeated requests

---

## 🚀 Self-hosted Deployment

Deploy your own Cloudflare Worker service:

### 1. Prerequisites

- Cloudflare account
- GitHub account (to fork the repository)

### 2. Deployment Steps

**Option A: Default Configuration (Recommended)**
Repository: [CORSAPI](https://github.com/SzeMeng76/CORSAPI)

1. Fork the repository to your GitHub account
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Go to **Workers & Pages**
4. Click **Create Application** → **Create Worker**
5. Paste `_worker.js` code
6. Click **Deploy**
7. Copy your Worker URL (e.g. `https://your-worker.workers.dev`)

**Option B: Bind Custom Domain (Optional)**

1. In Worker settings, open **Triggers**
2. Click **Add Custom Domain**
3. Enter your domain (e.g. `proxy.example.com`)
4. Wait for DNS validation

### 3. Configure in VODTV

1. Navigate to corresponding config page (TVBox or Video Source)
2. Enable proxy toggle
3. Paste your Worker URL into **Cloudflare Worker Address** input
4. Save configuration

---

## ❓ FAQ

### Q1: What is the difference between proxy configurations?

**A:**

- **TVBox Proxy**: Only affects TVBox subscription endpoint, rewrites source URLs inside TVBox config
- **Video Source Proxy**: Affects web metadata (search/detail) + m3u8/video playback streams; Emby sources skipped automatically
- **Bangumi Proxy**: User-selectable `server` / `cmliussss` / `worker` modes, controls Bangumi metadata and cover images
- **TMDB Proxy**: Shares video source proxy toggle; enabled automatically when video source proxy is on
- All configurations are independent and do not interfere with each other

### Q2: Do I need to enable all proxies?

**A:** No, enable only what you need:

- TVBox only → enable TVBox proxy
- Web playback only → enable video source proxy
- Bangumi access blocked → choose `worker` or `cmliussss` in user settings
- Slow TMDB loading → enable video source proxy to activate TMDB acceleration
- Mix and match freely

### Q3: Why are some sources already wrapped with proxy?

**A:** VODTV automatically detects legacy proxy wrappers:

- Detects `?url=` parameter in source URL
- Extracts the real underlying API address
- Replaces it with your configured new proxy
- Centralizes proxy management for all sources

### Q4: What happens when Worker proxy fails?

**A:** Automatic fallback handling:

- **CMS Metadata**: Falls back to VODTV local proxy
- **Playback Stream**: 3-level fallback chain (direct → Worker → local proxy), prevents playback failure
- **TVBox Proxy**: TVBox will use original source URL directly
- **Bangumi/TMDB**: Follow selected mode; falls back to direct connection or alternative proxy
- Service remains usable

### Q5: Can I keep using the default proxy `corsapi.smone.workers.dev` forever?

**A:** It works, but self-hosting is recommended:

- The default instance is public and subject to traffic limits
- Self-hosted Worker gives full control and better stability
- Cloudflare Worker free tier includes 100,000 requests per day, sufficient for personal use

### Q6: Will proxy affect speed?

**A:** Usually improves speed:

- Cloudflare global CDN routes requests to nearest edge node
- Speed gain may not be obvious if origin source is already fast

### Q7: How to verify proxy is working?

**TVBox Proxy**

1. Enable and save config
2. Visit TVBox diagnostic endpoint: `/api/tvbox/diagnose?token=YOUR_TOKEN`
3. Check if returned source URLs contain proxy host

**Video Source Proxy (CMS Metadata)**

1. Enable and save config
2. Open browser DevTools (F12) → Network tab
3. Perform search or open detail page
4. Check `/api/proxy/cms` requests for `/p/{sourceId}` path

**Video Source Proxy (Playback Stream)**

1. Enable and save config
2. Open browser DevTools (F12) → Network tab
3. Start video playback
4. Inspect m3u8 requests for `/m3u8` endpoint and rewritten `.ts` segments; other formats use `/?url=`
5. Emby sources should show direct requests without proxy

**Bangumi/TMDB Proxy**

1. Open browser DevTools (F12) → Network tab
2. Open anime calendar or media detail page
3. Check response headers of `/api/proxy/bangumi` or `/api/tmdb/*` requests to confirm proxy routing

### Q8: What is the Worker timeout limit?

**A:**

- Default timeout: 20 seconds
- Modify `setTimeout()` in Worker code to change this value

### Q9: Which CMS API formats are supported?

**A:** Supports all mainstream MacCMS APIs:

- `?ac=list` - List resources
- `?ac=detail` - Get item details
- `?ac=class` - Get categories
- `?ac=videolist` - Video list
- All query parameters are forwarded automatically

### Q10: Do I need to restart the service after saving proxy config?

**A:** No restart required!

- Changes take effect immediately after save
- Config cache clears automatically
- New requests use updated settings

---

## 📊 Configuration Comparison Table

表格

| Feature | TVBox Proxy | Video Source Proxy | Bangumi Proxy | TMDB Proxy |
| --- | --- | --- | --- | --- |
| **Config Location** | TVBox Security Config | Video Source Config | User Settings / Admin Panel | Reuse video source proxy toggle |
| **Affected Endpoints** | `/api/tvbox` | `/api/proxy/cms` + m3u8/video streams | `/api/proxy/bangumi` + images | `/api/tmdb/*` + images |
| **Use Case** | TVBox subscription feed | VODTV web playback (metadata + streams) | Bangumi anime info & covers | TMDB metadata & artwork |
| **Proxy Method** | Rewrite source URLs in subscription | Intercept CMS requests; m3u8 via `/m3u8`, others via `/?url=` | `worker` mode uses generic `/?url=` | Generic `/?url=` |
| **Failure Fallback** | Return original source URL | CMS: local proxy fallback; Playback: 3-level fallback | Switchable `server/cmliussss/worker`, no auto fallback | Direct connection on Worker failure |
| **Parameter Forwarding** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Auto Unwrap Old Proxy** | ✅ Yes | ✅ Yes | N/A | N/A |
| **Unique Path** | ✅ `/p/{sourceId}` | ✅ `/p/{sourceId}` | N/A | N/A |
| **Notes** | - | Emby sources bypass proxy | Alternative to CMLiussss | Follows video source proxy toggle |

---

## 🔒 Security Notes

### Whitelist Mechanism

Video source proxy is protected by whitelist:

- Only allows proxying URLs matching CMS API patterns
- Prevents abuse as an open general proxy
- Supported patterns: `?ac=`, `/api/vod`, `/provide/vod`, etc.

### Privacy

- No request logs stored at Worker level
- Sensitive data is not cached
- Self-host deployment available for full data control

---

## 📝 Changelog

### v1.1 - 2026-08-23

- ✨ **Video Source Proxy Enhancement**: Now accelerates m3u8/video playback streams. m3u8 uses `/m3u8` endpoint with automatic `.ts` sublink rewriting; other formats use `/?url=`
- ✨ **3-level Playback Fallback**: Playback automatically falls back through direct → Worker → local proxy to avoid single point of failure
- ✨ **Smart Emby Skip**: Emby sources bypass Worker due to `X-Emby-Authorization` header requirements
- ✨ **Bangumi Proxy Option**: Add CORSAPI Cloudflare Worker as an alternative proxy option alongside CMLiussss
- ✨ **TMDB Acceleration**: TMDB API and artwork reuse video source proxy toggle
- 📝 Updated documentation for playback stream, Bangumi and TMDB proxy

### v1.0 - 2025-01-04

- ✨ Added TVBox Proxy
- ✨ Added Video Source Proxy
- ✨ Auto detect and replace legacy proxy wrappers
- ✨ Unique per-source routing path
- ✨ Full query parameter forwarding
- ✨ Fallback mechanism
- 📝 Initial documentation

---

## 🤝 Contribute

Issues and pull requests are welcome to improve this feature!
Repositories:

- [VODTV](https://github.com/SzeMeng76/VODTV)
- [CORSAPI](https://github.com/SzeMeng76/CORSAPI)

---

## 📄 License

This feature follows the main project license, for learning and personal use only.

---

⭐ **If this guide helps you, please leave a Star!**

This English document is ready for direct copy-paste. Want to refine the wording further or split it into separate README files? You can also use work task mode to handle document formatting and release materials.