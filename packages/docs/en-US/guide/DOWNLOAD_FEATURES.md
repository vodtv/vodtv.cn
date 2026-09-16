# 📥 M3U8 Video Download Feature
## 🎉 Core Features
### ⚡ 6× Faster Download Speed
- **Multi‑thread concurrent downloading**: Fetches 6 video segments simultaneously
- **Intelligent retry**: Automatically retries failed segments up to 3 times
- **Up to 6‑times speed improvement**

### 💾 Stream‑to‑disk Saving (No Memory Limit)
- **Unlimited file size**: Bypasses browser memory constraints
- **Download ultra‑large videos**: Supports 10GB+ ultra‑HD video files
- **Write‑while‑downloading**: Writes data to disk during download to free RAM

### 🔄 Streaming MP4 Transcoding
- **Real‑time transcoding**: Download → transcode to MP4 → save on‑the‑fly
- **Memory‑efficient**: No need to load the entire file into memory at once
- **High‑quality output**: Converts into standard MP4 format perfectly

---
## 📊 Performance Comparison
| Metric | Regular Download | High‑Performance Download | Improvement |
|---|---|---|---|
| Download Time | 10 s | 1.7 s | **6× faster** |
| Memory Usage (2GB video) | 2GB | 50MB | **40× lower** |
| Max Supported File Size | ~2GB | Unlimited | **Unlimited** |
| Browser Crash Risk | High | Very low | **Greatly reduced** |

---
## 🌐 Browser Support
| Feature | Chrome | Firefox | Safari | Edge |
|---|---|---|---|---|
| 6‑thread concurrency | ✅ | ✅ | ✅ | ✅ |
| Stream‑to‑disk saving | ✅ | ✅ | ✅ | ✅ |
| Direct File‑System Write | ✅ | ❌ | ❌ | ✅ |
| Streaming Transcoding | ✅ | ✅ | ✅ | ✅ |

---
## 💡 Usage Guide
### 📖 Quick Start
#### 1. Start a download
1. Click the **Download** button on the playback page
2. The system automatically detects and selects the optimal download mode (no manual configuration required)
3. Download starts; you may monitor progress inside the download panel

#### 2. Check download progress
- The **download task list** panel opens automatically after a download starts
- Each task displays:
  - 📊 Real‑time progress bar (downloaded segments / total segments)
  - 🏷️ Current download mode tag (e.g. "🚀 Direct File‑System Write")
  - ⚙️ Task status (Downloading / Paused / Completed / Error)

#### 3. Manage download tasks
- **Pause**: Click the Pause button
- **Resume**: Click Start to continue downloading
- **Delete**: Click Delete to remove the task
- **Retry failed segments**: If some segments failed, click Retry Failed Segments

---
### ⚙️ Download Settings
#### Open the settings panel
1. Click the **⚙️ gear icon** at the top‑right corner of the download task list
2. The settings popup will appear with configurable options below:

#### Settings Options Description
**📊 Download Thread Count** (1‑16)
- Default: 6 threads
- Recommended: 4‑8 threads (balance of speed and stability)
- Note: Too many threads may trigger server‑side rate‑limiting

**🔄 Retry Attempts on Failure** (0‑10)
- Default: 3 retries
- Recommended: 3‑5 retries
- Description: Automatic retry count for failed video segments

**💾 Download Mode** (auto‑detects browser capabilities)
1. **🚀 Direct File‑System Write** (Recommended)
   - ✅ Supported: Chrome, Edge
   - ❌ Unsupported: Firefox, Safari
   - Features: Writes directly to disk, no file‑size limits, best‑in‑class performance
   - Best‑for: All file sizes

2. **⚡ Service‑Worker Streaming Download**
   - ✅ Supported: HTTPS or local localhost environment
   - ❌ Unsupported: Insecure plain HTTP
   - Features: Stream‑to‑disk saving with no file‑size limits
   - Best‑for: Extra‑large files (> 2GB)

3. **📦 Regular Mode** (Always available)
   - ✅ Supported by all browsers
   - Features: Download into memory, saves file once completed
   - Best‑for: Small files (< 500MB)
   - Limitation: Large files may cause out‑of‑memory issues

**💿 Default Output Format**
- **TS format**: Original transport‑stream format, no transcoding, faster
- **MP4 format**: Universal compatible format with automatic transcoding

#### Save Settings
- All preferences are **automatically saved** into browser local storage
- Your previous configuration will be restored next time you open the page

---
### 📋 Download Mode Summary
The system automatically detects browser support and picks the best available mode:
| Mode | Usage Scenario | File Size Limit | Browser Requirement |
|---|---|---|---|
| 🚀 Direct File‑System Write | **Recommended** | ✅ Unlimited | Chrome / Edge |
| ⚡ Service‑Worker Streaming | Very large videos | ✅ Unlimited | HTTPS environment |
| 📦 Regular Mode | Small‑size videos | ⚠️ ~2GB | All browsers |

---
### 🎯 Best Practices
#### For Chrome / Edge users (Recommended)
1. Use **Direct File‑System Write** mode
2. Thread count: 6‑8
3. Works well for videos of any size

#### For Firefox / Safari users
1. Small files (< 500MB): Use **Regular Mode**
2. Large files (> 500MB):
   - Ensure you are visiting over HTTPS
   - Enable **Service‑Worker Streaming** mode
3. Thread count: 4‑6

#### Unreliable / Poor network conditions
1. Lower thread count: 3‑4
2. Increase retry attempts: 5‑10
3. Use Service‑Worker or Direct File‑System Write (supports resume‑from‑breakpoint)

---
### ❓ Frequently Asked Questions
**Q: Why is Direct File‑System Write unavailable in my browser?**
- A: This API is only implemented for Chrome and Edge. Use those browsers for large‑file downloads.

**Q: Service‑Worker mode reports unsupported?**
- A: It requires HTTPS or localhost. If you are using plain HTTP, fall back to Regular Mode.

**Q: Download speed is slow, what can I do?**
- A: Try raising thread count to 8‑12. Be aware some servers enforce concurrency limits.

**Q: My download keeps failing.**
- A: Click "Retry Failed Segments" on the task card, or delete and restart the download task.

**Q: Downloaded video cannot be played?**
- A: Switch output format:
  - Incompatible TS → switch to MP4
  - Corrupted MP4 → switch back to TS

---
### 🚀 Performance Hints
- **Chrome / Edge users**: Direct File‑System Write is enabled by default for maximum performance
- **Large‑file downloading**: Stream‑to‑disk is automatically activated to avoid high memory usage
- **Concurrent tasks**: Multiple video downloads can run independently at the same time
- **Resume interrupted downloads**: You may continue after interruption without restarting from scratch

---
## 🔧 Technical Details
### Underlying Technologies
- **Concurrency controller**: 6 worker threads for segment downloading
- **Service Worker**: Stream‑to‑disk implementation
- **File System Access API**: Direct filesystem writes (Chrome / Edge only)
- **mux.js**: On‑the‑fly streaming TS‑to‑MP4 transmuxing
- **CryptoJS**: Decryption for AES‑encrypted video streams

### Reliability & Safety Features
- ✅ Intelligent retry (3 attempts)
- ✅ Skip over faulty segments
- ✅ File integrity validation
- ✅ Resume‑from‑breakpoint support

---
## 🙏 Acknowledgements
- **Download implementation**: Based on high‑performance download code from [MoonTV](https://github.com/Stardm0/MoonTV)
- **UI reference**: Interface design inspired by [MoonTVPlus](https://github.com/mtvpls/MoonTVPlus)

Thanks to the above open‑source projects for their contributions!
