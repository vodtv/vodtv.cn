# Watch‑Room Feature Deployment Guide

## 🚀 Feature Overview

The watch‑room feature enables synchronized video playback, real‑time text chat, and voice calls for multiple users. This guide walks you through deploying the external watch‑room server.

## Feature Highlights

✅ **Multi‑user synchronized playback**
‑ Play/pause/seek events are synchronised in real‑time
‑ The host controls playback progress; members follow automatically
‑ Automatic notification to members when switching videos or episodes

✅ **Screen‑sharing watch session**
‑ WebRTC real‑time screen‑sharing transmission
‑ Three quality presets available (Smooth 720p/15fps, HD 1080p/30fps, Ultra‑HD 1440p/30fps)
‑ Real‑time status monitoring: sharing duration, viewer count, connection state
‑ Automatic member connection handling; newly‑joined participants receive the stream immediately
‑ Full‑screen immersive UI with light‑dark theme switching

✅ **Real‑time chat system**
‑ Instant text message delivery
‑ Emoji support
‑ Unread‑message indicators

✅ **WebRTC voice call**
‑ P2P peer‑to‑peer voice connection
‑ Echo cancellation and noise suppression
‑ Independent microphone‑speaker controls

✅ **Room management**
‑ Public / private rooms
‑ Password‑protected access
‑ Host‑member permission management
‑ Real‑time updating of the room list
‑ Supports two room types: video sync mode and screen‑share mode

✅ **Connection‑state monitoring**
‑ Live connection‑status display
‑ Server‑side statistics
‑ Heartbeat detection mechanism

---

## Newly‑Added Feature Changelog

This section documents recently added and optimised watch‑room capabilities.

### 🎥 Screen‑Sharing Watch Room (v6.4.0)

**Feature summary**
‑ The host may share a browser tab or the entire screen to other participants inside the room
‑ Low‑latency real‑time transmission built upon WebRTC
‑ Multiple quality presets for variable‑network‑condition adaptation
‑ Full‑screen immersive UI supporting light and dark themes

**Quality presets**
‑ **Smooth**: 720p / 15fps — for poor‑network environments
‑ **HD**: 1080p / 30fps — balanced quality‑vs‑performance
‑ **Ultra‑HD**: 1440p / 30fps — maximum visual fidelity

**Real‑time status monitoring**
‑ Elapsed‑sharing‑duration timer
‑ Live viewer‑counter
‑ Connection‑status indicator (Connected / Disconnected)
‑ Actual capture parameters display (resolution, frame‑rate)

**Automatic member handling**
‑ Automatically establishes WebRTC connections when new users join
‑ Cleans‑up connection resources automatically on member leave
‑ Supports theoretically unlimited concurrent viewers

**Usage scenarios**
‑ Sharing streaming‑website content (YouTube, Netflix, etc.)
‑ Tutorial and workflow demonstrations
‑ Remote collaboration & meetings
‑ Game live‑streaming and gameplay watching

**Technical implementation**
‑ Screen capture via the `getDisplayMedia` API
‑ WebRTC PeerConnection for P2P link establishment
‑ Socket.IO signalling server to coordinate connection workflow
‑ Automated ICE candidate exchange and SDP negotiation

**Browser prerequisites**
‑ Host browser: modern browser supporting `getDisplayMedia` (Chrome, Edge, Firefox)
‑ Member browser: browser with WebRTC support
‑ Must run under HTTPS or `localhost`

### 🎯 Intelligent Playback Synchronisation

**Same‑show episode switching optimisation**
‑ When the host switches episodes within the same series, members follow automatically without page refresh
‑ `setCurrentEpisodeIndex` is invoked to switch episodes directly, preserving the WebSocket connection
‑ Jump to host playback timestamp after a 1‑second delay to allow episode loading
‑ Preserves room session state; avoids rejoining the room

**Cross‑show intelligent navigation**
‑ If host switches to an entirely different video, perform client‑side routing with `router.push`
‑ Avoid `window.location.href` which triggers page reload and WebSocket disconnection
‑ Append playback‑time and episode parameters for seamless navigation
‑ Members receive a pop‑up prompt, choose either "Follow Host" or "Watch Independently"

**Implementation snippet**

```
// Switch episode within the same show
if (isSameShow) {
  setCurrentEpisodeIndex(state.episode);
  setTimeout(() => artPlayer.currentTime = state.currentTime, 1000);
}
// Navigate to different media item via client‑side routing
else {
  router.push(`/play?${params.toString()}`);
}
```

### 📺 Now‑Watching Display

**Enhanced room information panel**
‑ After creating / joining a room, you may view the currently‑watching media entry
‑ Compact mini video card UI:

- Poster thumbnail (64×96 px)
- Media title
- Release‑year metadata
- Episode metadata for TV series
- Overlaid playback icon
‑ Click the mini‑card to jump directly to the playback page and sync progress
‑ Automatically carry the host’s current playback timestamp for synchronisation

**Enhanced room list**
‑ Each room entry in room‑list renders what media is currently being watched
‑ Full image‑fallback and placeholder handling
‑ SVG placeholder graphic shown when poster fails to load
‑ Clicking card navigates to playback page *without* timestamp parameter (user not joined yet)

**MiniVideoCard Component**
‑ Purpose‑built compact card for watch‑room UI
‑ Responsive styling with dark‑mode support
‑ Hover‑state interaction effects
‑ Optimised image loading using Next.js Image
‑ `referrerPolicy="no‑referrer"` to resolve cross‑origin poster‑loading issues

### 🎬 Episode‑Display Optimisation

**Intelligent conditional‑rendering logic**
‑ Uses field `totalEpisodes` to decide whether episode label should render
‑ **Movie (`totalEpisodes = 1`)**: omit redundant "Episode 1" label
‑ **TV Series (`totalEpisodes > 1`)**: render "Episode X"
‑ Eliminates confusing redundant episode labels for movies

**Implementation notes**
‑ Propagate `totalEpisodes` through the whole state pipeline:

- `PlayState` interface
- `OwnerPlayState` interface
 ‑ All Socket.IO broadcast events
 ‑ `MiniVideoCard` component
‑ Extract value automatically from media detail: `detail?.episodes?.length`

**Rendering logic snippet**

```
{totalEpisodes && totalEpisodes > 1 && episode !== undefined && (
  <span>Episode {episode + 1}</span>
)}
```

### 👤 Username‑Resolution Improvements

**Background problem**
‑ Browser cookies load asynchronously; on initial page load auth cookie may not yet be ready
‑ Result: newly‑joined user appears as "Guest" instead of real username
‑ Previously manual page refresh required to correct displayed username

**Solution: polling‑based username detection**
‑ `setInterval` periodically polls browser cookies for completed auth‑data loading
‑ Maximum of 20 polling attempts at 500 ms interval (total timeout: 10 seconds)
‑ Terminate polling immediately once valid username retrieved
‑ Halt polling after hitting maximum retry count to avoid infinite loops

**Code snippet**

```
const checkUsername = () => {
  const authInfo = getAuthInfoFromBrowserCookie();
  const username = authInfo?.username || 'Guest';

  if (username !== 'Guest') {
    setCurrentUserName(username);
    setUserNameLoaded(true);
    if (intervalId) clearInterval(intervalId);
  } else if (checkCount >= maxChecks) {
    setCurrentUserName('Guest');
    setUserNameLoaded(true);
    if (intervalId) clearInterval(intervalId);
  }
};
```

**UX improvement**
‑ Real username resolves on first load without manual refresh
‑ Member‑list renders correct participant names
‑ Chat messages show correct sender identity

### 🔄 Host Local‑State Synchronisation

**Background problem**
‑ Socket.IO server does not echo emitted events back to the sending client (sender loop‑back disabled)
‑ After host emits playback‑state update, host‑side room‑info panel would not refresh locally
‑ Symptom: host cannot see currently‑playing media inside panel, but remote members receive updates correctly

**Resolution**
‑ When host calls Socket.IO emit, also manually update local React‑state
‑ Add local‑state updates inside `updatePlayState`, `changeVideo`, `clearState` helpers

**Implementation snippet**

```
const updatePlayState = useCallback((state: PlayState) => {
  if (socket && connected) {
    socket.emit('play:update', state);
    // ✅ Local manual update, server does not echo‑back to sender
    setCurrentRoom((prev) => prev ? { ...prev, currentState: state } : null);
  }
}, [socket, connected]);
```

**Consistency outcome**
‑ Host and members view identical room‑state inside UI panels
‑ Room‑info panel reflects currently‑playing media instantly for host
‑ All participants can navigate directly to active media entry from room panel

### 🐛 Critical Bug Fixes

**Missing state updates (Critical)**
‑ **Problem**: event listeners inside `useWatchRoom.ts` only wrote debug logs and never invoked state‑setter
‑ **Impact**: room‑info panel, room‑list and all UI consuming `currentRoom.currentState` stopped functioning
‑ **Fix**: invoke `setCurrentRoom` within each socket‑event listener

```
socket.on('play:update', (state: PlayState) => {
  console.log('[WatchRoom] Play state updated:', state);
  setCurrentRoom((prev) => prev ? { ...prev, currentState: state } : null);
});
```

**Room‑list timestamp‑sync logic error**
‑ **Problem**: clicking mini‑card inside public room‑list would append playback‑time parameter even before user joins room
‑ **Impact**: unexpected auto‑seek to remote host timestamp when user has not entered the room
‑ **Fix**: omit `t` (timestamp) and `prefer` navigation params for room‑list clicks; only inject timestamp for navigation originating from inside the active‑room panel

**Incorrect type‑field naming**
‑ **Problem**: legacy property names `vod_name`, `vod_year` used instead of `SearchResult` interface fields `title`, `year`
‑ **Impact**: TypeScript compilation failures
‑ **Fix**: unify property naming across codebase

### 📝 Code‑base Changes

**New files created**
‑ `src/components/watch-room/MiniVideoCard.tsx` — compact media‑card component

**Modified source files**
‑ `src/types/watch-room.types.ts` — add `totalEpisodes` property
‑ `src/hooks/useWatchRoom.ts` — fix socket‑listener state updates; implement host local‑state patch
‑ `src/app/play/hooks/useWatchRoomSync.ts` — intelligent client‑side navigation logic; propagate `totalEpisodes`
‑ `src/components/WatchRoomProvider.tsx` — implement username polling‑detection
‑ `src/components/watch-room/ChatFloatingWindow.tsx` — consume MiniVideoCard, pass `totalEpisodes`
‑ `src/app/watch-room/page.tsx` — consume MiniVideoCard, correct room‑list navigation behaviour
‑ `src/app/play/page.tsx` — correct property naming; feed `setCurrentEpisodeIndex` parameters

**Key technical decisions**
‑ Prefer `router.push` over `window.location.href` to keep WebSocket session alive
‑ Polling via `setInterval` instead of single‑shot `setTimeout` for username detection
‑ Manually mirror emitted state locally for host because server does not loop‑back events
‑ Conditionally render episode label checking value of `totalEpisodes`

---

## Architecture Overview

The watch‑room system is split into two distinct components:

1. **LunaTV Front‑end**: already integrated inside this project; no separate deployment required
2. **Watch‑room Server**: standalone Socket.IO backend service you need to deploy externally

**Reason for separation:**
‑ Serverless platforms such as Vercel do not support persistent WebSocket long‑lived connections
‑ Independent deployment grants flexibility to select hosting infrastructure
‑ Optional feature; main application remains functional even without watch‑room backend

---

## Server Source Repository

Open‑source repository for watch‑room backend: [watch‑room‑server](https://github.com/tgs9915/watch%5D(https://github.com/tgs9915/watch)%E2%80%91room%E2%80%91server)

**Multi‑arch Docker image**: `ghcr.io/szemeng76/watch‑room‑server:latest`
(Supports `linux/amd64` & `linux/arm64`; runs natively both on x86 and ARM hardware)

---

## Deployment Options

### Option 1: Fly.io Deployment (Recommended, free tier available)

Fly.io provides a free quota suitable for small‑scale usage.

#### Prerequisites

1. Register an account: [https://fly.io/app/sign](https://fly.io/app/sign)‑up
2. Install Fly CLI:

```
# macOS/Linux
curl -L [https://fly.io/install.sh](https://fly.io/install.sh) | sh

# Windows (PowerShell)
iwr [https://fly.io/install.ps1](https://fly.io/install.ps1) -useb | iex
```

3. Authenticate CLI:

```
flyctl auth login
```

#### Deployment Workflow

1. Clone repository locally:

```
git clone [https://github.com/tgs9915/watch-room-server.git](https://github.com/tgs9915/watch-room-server.git)
cd watch-room-server
```

2. Create your `fly.toml` configuration:

```
app = "your-watch-room-server"  # Change this to your globally‑unique app‑name

[build]
dockerfile = "Dockerfile"

[env]
PORT = "8080"
AUTH_KEY = "your-secure-random-key-here"  # Replace with strong secret

[[services]]
internal_port = 8080
protocol = "tcp"

[[services.ports]]
handlers = ["http"]
port = 80

[[services.ports]]
handlers = ["tls", "http"]
port = 443
```

3. Deploy to Fly.io:

```
flyctl launch --no-deploy
flyctl deploy
```

4. Retrieve your application URL:

```
flyctl info
```

Your final endpoint will resemble: `https://your‑watch‑room‑server.fly.dev`

#### Useful Fly.io management commands

```
# View runtime logs
flyctl logs

# Inspect application status
flyctl status

# Restart service
flyctl restart

# Fully destroy deployed app
flyctl destroy your-watch-room-server
```

---

### Option 2: Railway Deployment

Railway offers streamlined one‑click deployment with a limited free tier.

#### Deployment Steps

1. Log‑in to [Railway](https://railway.app/%5D(https://railway.app/))
2. Click "New Project" → "Deploy from GitHub repo"
3. Authorise access to your forked `watch‑room‑server` repository
4. Railway auto‑detects project and initiates build
5. Navigate to "Variables" tab and inject environment variables:
‑ `AUTH_KEY`: strong random secret (**mandatory**)
‑ `PORT`: 8080 (optional, defaults to 8080)
6. After deployment completes, go to "Settings" → "Networking" to generate public domain
7. Copy your public endpoint e.g. `https://your‑app.railway.app`

---

### Option 3: Docker Deployment (Self‑hosted VPS)

Best for your own dedicated virtual‑private‑server infrastructure.

#### Use pre‑built multi‑arch image (recommended)

```
# Pull container image
docker pull ghcr.io/szemeng76/watch-room-server:latest

# Start container
docker run -d \
  --name watch-room-server \
  --restart unless-stopped \
  -p 8080:8080 \
  -e AUTH_KEY=your-secure-random-key-here \
  -e PORT=8080 \
  ghcr.io/szemeng76/watch-room-server:latest

# Attach and inspect logs
docker logs -f watch-room-server
```

Alternative via `docker‑compose.yml`:

```
version: '3.8'

services:
  watch-room-server:
    image: ghcr.io/szemeng76/watch-room-server:latest
    container_name: watch-room-server
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      - AUTH_KEY=your-secure-random-key-here
      - PORT=8080
```

Run compose stack:

```
docker-compose up -d
docker-compose logs -f
```

#### Build image from source (optional customisation)

1. Clone repository

```
git clone [https://github.com/tgs9915/watch-room-server.git](https://github.com/tgs9915/watch-room-server.git)
cd watch-room-server
```

2. Create `.env` file

```
AUTH_KEY=your-secure-random-key-here
PORT=8080
```

3. Bring‑up compose stack

```
docker-compose up -d
```

4. Inspect runtime status

```
docker-compose ps
docker-compose logs -f
```

5. Optional Nginx reverse‑proxy config (recommended for public HTTPS):

```
server {
    listen 443 ssl http2;
    server_name watch-room.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass [http://localhost:8080](http://localhost:8080);
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X‑Real‑IP $remote_addr;
        proxy_set_header X‑Forwarded‑For $proxy_add_x_forwarded_for;
        proxy_set_header X‑Forwarded‑Proto $scheme;
    }
}
```

---

### Option 4: Run Directly on VPS with Node.js

For VPS environments with existing Node.js runtime.

#### Deployment workflow

1. Confirm installed Node.js ≥18

```
node --version
```

2. Clone repo & install dependencies

```
git clone [https://github.com/tgs9915/watch-room-server.git](https://github.com/tgs9915/watch-room-server.git)
cd watch-room-server
npm install
```

3. Prepare `.env`

```
AUTH_KEY=your-secure-random-key-here
PORT=8080
```

4. Build artifacts & launch application

```
npm run build
npm start
```

5. Use PM2 for daemon process management (recommended)

```
# Install pm2 globally
npm install -g pm2

# Start background service
pm2 start npm --name "watch-room-server" -- start

# Configure system startup persistence
pm2 startup
pm2 save

# View logs
pm2 logs watch-room-server

# Restart backend
pm2 restart watch-room-server
```

---

## LunaTV Application‑side Configuration

Once your external watch‑room backend is deployed, apply configuration within LunaTV admin dashboard:

1. Login to LunaTV admin panel (owner/admin privileges required)
2. Navigate to tab labelled "Watch‑Room Configuration"
3. Fill‑in configuration parameters:
‑ ✅ Enable watch‑room feature (checkbox)
‑ **Server URL**: full backend endpoint e.g. `https://your‑watch‑room‑server.fly.dev`
‑ **Authentication Key**: secret string exactly matching backend environment variable `AUTH_KEY`
4. Click "Test Connection" to validate connectivity
5. Save configuration
6. Inspect server‑stats panel to confirm successful handshake

### Configuration Notes

‑ Server URL **must** include protocol scheme (`http://` / `https://`)
‑ Authentication key authenticates LunaTV frontend against backend; prevents unauthorised access
‑ Use a secure random string of at least 32 characters
‑ You may generate secure random strings with online tooling such as [Random.org](https://www.random.org/strings/%5D(https://www.random.org/strings/))

### ⚠️ Multi‑site Shared‑server Warning

**Important note if multiple LunaTV instances reuse identical watch‑room backend:**
‑ ✅ All sites will share one unified pool of active rooms
‑ ✅ Rooms created from Site‑A are discoverable and joinable for users from Site‑B
‑ ⚠️ This behaviour may cause confusing cross‑site user‑experience
‑ 💡 Recommendation: provision an independent watch‑room backend for every LunaTV deployment
‑ 💡 If cross‑site shared watching is your intended goal, document origin site explicitly within room names

---

## Functional Validation & Testing

After saving configuration validate all watch‑room capabilities.

### 1. Room Management Test

1. Open LunaTV navigation sidebar and enter Watch‑Room page
2. Verify connection status indicator displays "Connected"
3. Create a test‑room:
‑ Input room display name
‑ Optional: assign room password
‑ Toggle public / private visibility
4. Confirm room creation succeeds, inspect room‑id & participant‑list
5. Join same test‑room from a separate browser‑session or second device

### 2. Chat Functionality Test

1. Open chat floating panel (green speech‑bubble icon)
2. Send plain‑text message and verify real‑time delivery
3. Test emoji sending
4. Close chat panel, validate unread‑message notification badge appears

### 3. Synchronised Playback Test

1. Navigate both browser sessions into same media playback page
2. Host performs playback controls:
‑ Play → remote members automatically start playback
‑ Pause → remote members automatically pause
‑ Seek progress slider → remote members jump to identical timestamp
‑ Switch episodes → members receive pop‑up notification prompt
3. Member‑side verification:
‑ Player reacts automatically to host‑issued events
‑ Inspect browser dev‑tools console for sync debug logs prefixed `[PlaySync]`

### 4. Voice‑Call Functionality Test

1. Inside chat panel click microphone button
2. Grant browser microphone permission on prompt
3. Second participant also enables microphone
4. Verify bidirectional voice audio works correctly
5. Mute/unmute speaker controls validation

### 5. Final Room‑Management Validation

1. Open room‑information panel (blue info‑icon)
2. Inspect room metadata & live participant roster
3. Test "Leave Room" / "Dissolve Room" host operation
4. Confirm all connected participants get kicked after host dissolves room

---

## Frequently Asked Questions

### Q1: Troubleshooting connection failures

**Check‑list for diagnostics:**
‑ Is backend service healthy? Access endpoint `https://your‑server‑url/health` should reply `{"status":"ok"}`
‑ Is server URL configured correctly in LunaTV admin?
‑ Does LunaTV‑configured `AUTH_KEY` exactly match backend environment variable?
‑ Are firewall rules opening target port on hosting server?
‑ Inspect browser console for CORS‑related error traces

### Q2: What exactly is AUTH_KEY?

`AUTH_KEY` is shared secret for authenticating frontend clients against watch‑room backend. It is a mandatory environment variable; backend refuses startup without it.

**How‑to assign:**
‑ Fly.io: define variable within `fly.toml` env section
‑ Railway: add variable inside project Variables dashboard
‑ Docker: inject via `.env` file or container runtime‑e flag
‑ Bare‑metal VPS: define within `.env` file

### Q3: Generate secure random AUTH_KEY

```
# Linux/macOS openssl
openssl rand -base64 32

# Node.js one‑liner
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Q4: Is Fly.io free quota sufficient?

Fly.io free tier resource allocation:
‑ 3 shared‑CPU VMs (256 MB RAM each)
‑ 3 GB persistent block storage
‑ 160 GB monthly outbound network transfer

Fully adequate for small‑scale deployment (<10 concurrent online participants).

### Q5: Playback synchronisation is not working

Debugging workflow:

1. Open browser developer console (F12)
2. Filter logs searching for `[PlaySync]`
3. Confirm host outputs log: `Setting up player event listeners`
4. Confirm member receives event trace: `Received play:play/pause/seek event`
5. Missing logs checklist:
‑ Confirm you are currently on media playback route
‑ Confirm player finished initialisation (`playerReady=true`)
‑ Hard‑refresh browser session and retry

### Q6: Cannot hear remote party inside voice call

Potential root causes:
‑ Browser microphone permission was denied; review browser site‑permission settings
‑ Local speaker output muted inside watch‑room UI
‑ NAT‑traversal / STUN‑server connectivity issue from network environment
‑ Browser lacks WebRTC support; switch to Chrome / Edge / Firefox

### Q7: Are active rooms persisted after server restart?

**No, all room state is stored in backend memory:**
‑ Restart watch‑room backend → all existing rooms are destroyed
‑ Redeploying only LunaTV frontend on Vercel leaves watch‑room backend state untouched
‑ Redeploy watch‑room server → all active sessions get cleared

This is intentional design; watch‑rooms are ephemeral temporary collaboration sessions.

### Q8: How to perform backend service updates

**Fly.io:**

```
cd watch-room-server
git pull
flyctl deploy
```

**Railway:**
‑ Push updated source‑code to GitHub repository; Railway triggers automatic rebuild & redeploy

**Docker Compose:**

```
cd watch-room-server
git pull
docker-compose down
docker-compose build
docker-compose up -d
```

**VPS PM2:**

```
cd watch-room-server
git pull
npm install
npm run build
pm2 restart watch-room-server
```

### Q9: Where can I view backend runtime logs?

‑ **Fly.io**: `flyctl logs`
‑ **Railway**: Dashboard → Deployments → target deployment entry → Logs
‑ **Docker Compose**: `docker-compose logs -f`
‑ **PM2**: `pm2 logs watch-room-server`

### Q10: Can chat‑voice features run outside playback page?

Current implementation: playback synchronisation is only functional on playback page. Chat & voice floating‑window UI technically may render on other routes.

---

## Security Recommendations

1. **Enforce HTTPS**: backend endpoint should run under TLS (Fly.io & Railway supply HTTPS by default)
2. **Strong secret AUTH_KEY**: use cryptographically random 32+ character secrets
3. **Regular upstream updates**: monitor `watch‑room‑server` repository releases
4. **Resource monitoring**: periodically inspect backend CPU/memory consumption
5. **Backup secrets**: safely archive your `AUTH_KEY` secret
6. **Independent backend per‑instance**: deploy dedicated watch‑room server for each separate LunaTV site to avoid cross‑site room leakage

---

## Technical Architecture

### Front‑end Stack

‑ Framework: React + Next.js 16.1.0
‑ Socket.IO‑Client for real‑time bidirectional communication
‑ Integration with ArtPlayer HTML5 video player for playback events
‑ WebRTC P2P voice signalling
‑ React Context API for state management

### Back‑end Stack

‑ Socket.IO backend handling WebSocket persistent connections
‑ In‑memory runtime storage for active rooms & participant sessions
‑ JWT‑style authentication via shared `AUTH_KEY` secret
‑ Heartbeat‑based stale‑connection cleanup

### Play‑Synchronisation Data‑Flow

```
Host UI Action → ArtPlayer player events → Socket.IO emit → Server broadcast → Remote members receive → Command local player instance
```

**Loop‑broad‑back prevention:**
‑ Ref flag `isHandlingRemoteCommandRef` guards against echo‑loop; events triggered remotely are not re‑broadcast back to server

**Periodic resync mechanism:**
‑ Full playback‑state broadcast sent every 5 seconds
‑ Mitigates gradual playback‑drift for long‑running viewing sessions

---

## Uninstall & Decommissioning

### Disable watch‑room on LunaTV frontend

Untick "Enable watch‑room feature" within admin configuration panel. Navigation menu entry will disappear automatically for users.

### Destroy deployed backend server

‑ Fly.io: `flyctl destroy your‑app‑name`
‑ Railway: navigate project settings → Delete Project
‑ Docker Compose: `docker‑compose down -v`
‑ PM2 managed VPS: `pm2 delete watch‑room‑server`

---

## Acknowledgements

LunaTV watch‑room feature builds upon these open‑source projects:

### Core Back‑end Dependency

‑ **[watch‑room‑server](https://github.com/tgs9915/watch%5D(https://github.com/tgs9915/watch)%E2%80%91room%E2%80%91server)** — external Socket.IO watch‑room backend
‑ Author: [@tgs9915](https://github.com/tgs9915%5D(https://github.com/tgs9915))
‑ License: MIT

### Reference Implementation

‑ **[MoonTVPlus](https://github.com/mtvpls/MoonTVPlus%5D(https://github.com/mtvpls/MoonTVPlus))** — synchronised playback hook reference
‑ Play‑sync hook design ideas inspired by MoonTVPlus `usePlaySync`
‑ Author: [@mtvpls](https://github.com/mtvpls%5D(https://github.com/mtvpls))

### Underlying Technology Stack

‑ Socket.IO — WebSocket real‑time communication
‑ WebRTC — peer‑to‑peer real‑time voice/video
‑ ArtPlayer — HTML5 media player
‑ React — frontend UI library

Gratitude to all open‑source contributors 🙏

---

## Licensing

‑ LunaTV watch‑room frontend source governed under main LunaTV project license
‑ Watch‑room backend server repository: MIT license, see [watch‑room‑server](https://github.com/tgs9915/watch%5D(https://github.com/tgs9915/watch)%E2%80%91room%E2%80%91server)

---

## Technical Support

‑ Backend‑specific bugs & feature‑requests: open GitHub Issue on [watch‑room‑server](https://github.com/tgs9915/watch%5D(https://github.com/tgs9915/watch)%E2%80%91room%E2%80%91server)
‑ LunaTV frontend integration‑related issues: submit Issue within LunaTV repository
‑ Feature suggestions welcome via GitHub Feature‑Request

---

**Enjoy watching videos together with your friends!** 🎬🍿