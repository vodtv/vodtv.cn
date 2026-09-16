# Emby Private Media Library User Guide
VODTV now supports the Emby private‑media‑library feature, you can directly access and play content from your Emby media server.

## Feature Highlights
- 🎬 **Multi‑source Management** — Each user is allowed to configure their own Emby server
- 👤 **Independent Configuration** — Every user has separate Emby settings without mutual interference
- 🌐 **Public Sources** — Administrators may set public Emby sources, automatically available for all users
- 📚 **Media Library Browsing** — Browse movies and TV shows categorized by library
- 🔍 **Smart Sorting** — Sort by name, date added, or premiere date
- ♾️ **Infinite Scroll** — Automatically load more content on scrolling
- 🎯 **Direct Playback** — Skip speed testing and start Emby media playback immediately
- 🔄 **Lazy Loading** — Episode details are loaded on‑demand to improve performance
- 🎵 **Multi‑audio‑track Support** — Auto‑select browser‑compatible audio tracks; manual audio‑track switching available
- 🔓 **Password‑Free Login** — Dual authentication modes: API key or username‑password credentials

## Configuration Steps
### 1. Open User Settings
Click the user menu in the top‑right corner, select **Settings**, and locate the **Emby Private Media Library** configuration panel.

### 2. Add an Emby Source
Click the **Add Source** button and fill in the fields below:

#### Required Fields
- **Identifier** — Unique identifier, e.g. `wumei`, `emby1`
  - Only editable at creation time, cannot be modified afterwards
  - Used for URL parameters; short alphanumeric names are recommended
- **Name** — Display name, e.g. `Home Emby`, `My Emby`
  - Friendly name shown inside the UI
- **Server URL** — Emby server address
  - Format: `https://emby.example.com`
  - Protocol (http / https) must be included

#### Optional Fields
- **API Key** — Emby API Key
  - Generated in your Emby server dashboard
  - Path: Settings → API Keys
- **Username / Password** — Emby account credentials
  - Can be left blank if an API key is provided
- **Enable this source** — Check to make this source visible for frontend usage

#### Advanced Options
- **Remove /emby prefix from playback URL** — Off by default
  - Strips `/emby` path segment from playback links when enabled
  - Only enable this if your Emby deployment does NOT use the `/emby` path prefix
  - **Keep disabled for most instances**
- **Append MediaSourceId parameter** — Off by default
  - Calls PlaybackInfo API to fetch MediaSourceId and append it to playback urls
  - Only required for special non‑standard Emby deployments
  - **Usually leave disabled**
- **Transcode to mp4** — Enable as needed
  - Uses HLS (`master.m3u8`) and forces audio transcoding to AAC
  - **Recommended to enable** for media containing EAC3, TrueHD and other browser‑unsupported audio formats
  - Also works for MKV container files
  - Emby transcodes audio on‑the‑fly during playback
  - Note: transcoding increases server CPU consumption
- **Video Playback Proxy** — Off by default
  - Routes video streams through the VODTV backend once enabled
  - Applicable scenarios:
    - Your Emby server has CORS restrictions
    - You wish to hide your raw Emby server address
    - Unstable network connections
  - Note: this raises backend bandwidth and server load
  - **Try direct playback first; enable proxy only when problems appear**

### 3. Test Connection
After filling out settings, click **Test Connection** to validate your configuration.

### 4. Save Configuration
Press the **Save** button to persist your source settings.

## Public Sources (Administrator‑Only Feature)
Inside the admin backend panel for **Emby Private Media Library**, administrators may mark an Emby source as a **Public Source**.
- Public sources automatically appear inside every user’s private‑library list
- End‑users can use them right away without manual configuration
- A read‑only public‑source section (purple area) is shown at the top of user‑side settings
- User‑owned private sources coexist with public sources; private sources take priority if identifiers collide

### How Administrators Configure a Public Source
1. Navigate to Admin Backend → **Emby Private Media Library** tab
2. Add new source or edit an existing one
3. Toggle on **Set as public source** (purple section) at the bottom of the form
4. Save; this source will now be available for all users automatically

## Usage Instructions
### Access Private Media Library
Once you have configured your own source or an admin has deployed public sources, an **Emby** navigation entry (indigo‑blue icon) will show up.
Route: `/emby`

### Select Emby Source
If multiple Emby servers are configured, a source dropdown selector appears at the top of the page.

### Filter Media Libraries
Use library filter dropdown to select your target library:
- **All** — Show media across all libraries
- **Movie Library** — Show movies only
- **TV‑Show Library** — Show series only
- Other custom‑named libraries

### Sorting Options
Click the sort button to pick your sorting mode:
- By Name — Alphabetical ordering
- By Date Added — Newly‑added items first
- By Premiere Date — Release‑date ordering
Ascending / descending toggle is available for every sorting mode.

### Play Media
Click a video card to open the playback page. Emby sources behave as follows:
- Skip speed‑checking and start playback directly
- Auto‑load episode list for TV series
- Source‑switching function is supported

## Multi‑source Configuration Examples
### Example 1: Home‑Local Emby Server
Identifier: home
Name: Home Emby
Server URL: [https://emby.home.local:8096](https://emby.home.local:8096)
API Key: your-api-key-here
Enabled: ✓

```

### Example 2: Public Emby Server
```

Identifier: public
Name: Public Emby
Server URL: [https://public-emby.example.com](https://public-emby.example.com)
Username: myusername
Password: mypassword
Enabled: ✓
Set as public source: ✓ (configured in admin backend)

```

## Technical Notes
### URL Format
When playing Emby media, playback URL format:
```

/play?source=emby_[identifier]&id=[mediaID]

```
Example:
```

/play?source=emby_wumei&id=12345

```

### API Endpoints
Backend API endpoints used for Emby integration:
- `GET /api/emby/sources` — Get all user‑enabled Emby sources (merged private + public)
- `GET /api/emby/public‑sources` — Retrieve administrator‑defined public source list
- `GET /api/emby/views` — Fetch library views
- `GET /api/emby/list` — Fetch media list (pagination, filtering, sorting supported)
- `GET /api/emby/detail` — Get media metadata plus episode list
- `GET /api/emby/play/[token]/[filename]` — Video stream proxy endpoint

### Cache Behaviour
- Media listing cache TTL: 6 hours
- In‑memory cache; cleared after service restart
- Manual cache‑clear available in admin backend

## FAQ
### Q: Why can I not see the Emby navigation entry?
A: Please verify:
1. You have added a user Emby source, or an administrator has set up public sources
2. At least one source is marked Enabled
3. Server URL is filled correctly

### Q: Connection test keeps failing
A: Check these points:
1. Server URL is valid with http/https protocol
2. API key or username‑password credentials are correct
3. Your Emby server is reachable over network
4. Firewall rules allow outbound connections

### Q: How many Emby sources may I configure?
A: There is no hard upper limit; it is recommended to keep ≤5 sources for clean UI.

### Q: Will Emby sources run speed‑testing?
A: No. Emby sources skip speed‑testing and start playback directly for faster startup.

### Q: Which Emby Server versions are supported?
A: Emby Server 4.x and newer. Using the latest stable release is recommended.

### Q: Can I connect Jellyfin?
A: Emby integration only at this moment. Jellyfin API is similar but compatibility issues may occur.

### Q: If public‑source and private‑source share the same identifier key?
A: User‑owned private source takes precedence; your local configuration overrides the public one.

## Security Recommendations
1. **Use HTTPS** — It is strongly advised to enable HTTPS for your Emby server
2. **Rotate API Keys periodically**
3. Each user’s Emby settings are independently persisted and isolated
4. Credentials for public sources are stored server‑side only, never exposed to browser clients
5. If your Emby instance lives inside LAN, access via VPN is suggested

## Troubleshooting
### Media list fails to load
1. Inspect browser developer console for error logs
2. Confirm Emby server is running normally
3. Clear cache and reload the page

### Playback failures
1. Video keeps buffering and will not start
  - Check media container format. For MKV files turn on **Transcode to mp4** in advanced source settings
  - Save settings and restart playback
2. EAC3 / TrueHD audio cannot play
  - These audio codecs are unsupported natively by browsers
  - Enable "Transcode to mp4", HLS will transcode audio stream into AAC
3. Unsupported video format
  - Browser native support: MP4(H.264+AAC), WebM
  - Transcoding required: MKV, AVI, FLV, EAC3 / TrueHD audio
  - Fix: turn on Transcode to mp4
4. CORS‑related playback errors
  - Activate the **Video Playback Proxy** option; video will stream via VODTV backend proxy
5. Double‑check Emby server transcoding settings
6. Confirm media files physically exist on disk
7. Verify network stability

### Episode list remains empty
1. Confirm episodes are scanned and visible from inside your Emby web UI
2. Verify library scan status in Emby
3. Try playing that series directly in Emby web client for validation

## Changelog
### v6.2.0 (2026‑03‑01)
- 🔍 **Enhanced Search**: Local full‑text index, fuzzy matching, traditional‑simplified Chinese search
- 📱 **Mobile UX Improvements**: Refined mobile layout, display total count for categories
- 🔄 **Manual Refresh Button**: Invalidate cached Emby responses manually
- 🎨 **UI Refinement**: Empty‑state hints, improved navigation visibility
- ⚡ **Performance**: Rewrote UserEmbyConfig uncontrolled input component for faster form rendering
- 🔐 **Auth Improvements**: Fully‑supported dual authentication (API key + username/password)
- 💾 **Config Caching**: Automatically clear cache after user updates their Emby settings
- 🎵 **Playback Fix**: Append PlaySessionId to HLS transcoding urls, resolves segment loading failures
- 📂 **Search Scope**: Restrict search results to the currently‑selected media library
- 🖼️ **Image Caching**: Module‑level image cache to eliminate flicker during fast scrolling

### v6.1.5 (2026‑02‑26)
- 🌐 New public‑source feature: admins can publish shared Emby sources for all users
- 🔀 Smart source merging: user private sources overlay public ones with higher priority
- 📍 Route changed: private library path updated from `/private‑library` to `/emby`
- 🎵 Transcode improvement: HLS master.m3u8 output; force‑AAC audio transcoding to resolve EAC3 / TrueHD incompatibility
- 🔧 Configuration bugfix: all user‑scoped APIs now load per‑user config correctly instead of global settings

### v6.1.4 (2026‑02‑25)
- 🔄 Major change: Emby configuration moved out of admin panel into user‑side settings
- 👤 Every user can maintain their own separate Emby server configuration
- 🔐 User configurations are isolated
- 📱 Emby settings panel is now located inside the user menu

### v6.1.3 (2026‑02‑24)
- ✨ Initial release for Emby private‑library integration
- 🎯 Multi‑source management
- 📚 Library filtering & sorting
- ♾️ Infinite scroll pagination
- 🔄 Integrated into the built‑in playback page
- ⚙️ Advanced configuration options
  - mp4 transcoding toggle
  - video playback proxy
  - MediaSourceId parameter toggle
  - Emby path prefix removal toggle

## Acknowledgements
This Emby integration refers to the Emby implementation from [MoonTVPlus](https://github.com/mtvpls/MoonTVPlus). Thanks for the open‑source contribution from the original author.

---
If you encounter bugs or have suggestions, please open an Issue on GitHub.
```