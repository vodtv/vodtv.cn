## 🚀 Deployment

### 💻 Minimum System Requirements

To ensure smooth operation, your server should meet the following minimum specifications:

#### Docker Self‑Hosted Deployment
- **CPU**: 2 cores (4 cores recommended)
- **RAM**: 2GB RAM (4GB recommended)
- **Storage**: 10GB free space (20GB recommended for video cache and database)
- **Network**: 10Mbps uplink bandwidth (100Mbps recommended)

#### Vercel / Render / EdgeOne Cloud Deployment
- **No private server required**: Resources are allocated automatically by the platform
- **Vercel**: Serverless architecture with auto‑scaling on demand
- **Render**: Free tier provides 750 runtime hours per month for personal use
- **EdgeOne Pages**: Tencent Cloud edge‑computing platform with good access performance inside mainland China

#### ⚠️ Common Causes of Stuttering / Slow Performance
- ❌ **Insufficient CPU**: Single‑core or low‑frequency CPUs cause slow video transcoding and searching
- ❌ **Insufficient RAM**: Less than 2GB RAM leads to frequent OOM (out‑of‑memory) crashes
- ❌ **Low network bandwidth**: Uplink below 5Mbps results in stuttering video playback
- ❌ **Slow disk I/O**: HDDs degrade database and cache performance

**💡 Tip**: If you experience stuttering, first verify your server meets the minimum hardware requirements!

---

### 🐳 Docker Self‑Hosted Deployment

This project **only supports deployment via Docker or Docker‑compatible platforms** (Dockge, Portainer, Komodo, etc.).

### 📦 Recommended Deployment: Kvrocks Storage

Kvrocks is a persistent Redis‑compatible storage engine built on RocksDB, recommended for production use.

```yml
services:
  moontv-core:
    image: ghcr.io/szemeng76/VODTV:latest
    container_name: moontv-core
    restart: on-failure
    ports:
      - '3000:3000'
    environment:
      - USERNAME=admin
      - PASSWORD=your_secure_password
      - NEXT_PUBLIC_STORAGE_TYPE=kvrocks
      - KVROCKS_URL=redis://moontv-kvrocks:6666
      - VIDEO_CACHE_DIR=/app/video-cache  # Video cache directory
      # Optional site configuration
      - SITE_BASE=https://your-domain.com
      - NEXT_PUBLIC_SITE_NAME=VODTV Enhanced
    volumes:
      - video-cache:/app/video-cache  # Persist video cache
    networks:
      - moontv-network
    depends_on:
      - moontv-kvrocks

  moontv-kvrocks:
    image: apache/kvrocks
    container_name: moontv-kvrocks
    restart: unless-stopped
    volumes:
      - kvrocks-data:/var/lib/kvrocks
    networks:
      - moontv-network

networks:
  moontv-network:
    driver: bridge

volumes:
  kvrocks-data:
  video-cache:  # Video cache volume

```

### 🔴 Redis Storage (Risk of Data Loss)

Default Redis configuration may lose data; persistence must be enabled.

```
services:
  moontv-core:
    image: ghcr.io/szemeng76/VODTV:latest
    container_name: moontv-core
    restart: on-failure
    ports:
      - '3000:3000'
    environment:
      - USERNAME=admin
      - PASSWORD=your_secure_password
      - NEXT_PUBLIC_STORAGE_TYPE=redis
      - REDIS_URL=redis://moontv-redis:6379
    networks:
      - moontv-network
    depends_on:
      - moontv-redis

  moontv-redis:
    image: redis:alpine
    container_name: moontv-redis
    restart: unless-stopped
    command: redis-server --save 60 1 --loglevel warning
    volumes:
      - ./data:/data
    networks:
      - moontv-network

networks:
  moontv-network:
    driver: bridge
```

### ☁️ Upstash Cloud Storage (Docker)

Suitable when you cannot host your own database; fully‑managed Redis service.

1. Register an account at [upstash.com](https://upstash.com/) and create a new Redis instance
2. Copy your **HTTPS ENDPOINT** and **TOKEN**
3. Use the following compose configuration:

```
services:
  moontv-core:
    image: ghcr.io/szemeng76/VODTV:latest
    container_name: moontv-core
    restart: on-failure
    ports:
      - '3000:3000'
    environment:
      - USERNAME=admin
      - PASSWORD=your_secure_password
      - NEXT_PUBLIC_STORAGE_TYPE=upstash
      - UPSTASH_URL=https://your-instance.upstash.io
      - UPSTASH_TOKEN=your_upstash_token
```

### 🚀 fnOS (FeiNiu OS) Deployment

fnOS is a domestic free NAS system with native Docker Compose support, ideal for home‑NAS users.

#### Deployment Option 1: Web UI Deployment (Recommended)

1. **Log into fnOS admin panel**
   - Open the fnOS web management page
   - Navigate to "Docker" or "Container Management"
2. **Create Compose project**
   - Click "New Compose Project" or "Add Service"
   - Project name: `VODTV`
   - Paste the [Kvrocks storage config](#-recommended-deployment-kvrocks-storage) into the editor
3. **Modify configuration**
   - Change `PASSWORD` to a strong password
   - (Optional) Update `SITE_BASE` to your public access URL
4. **Start services**
   - Click "Start" or "Deploy"
   - Wait for containers to finish starting
5. **Access the application**
   - Open browser: `http://<fnOS‑IP>:3000`
   - Log in with your configured administrator credentials

#### Deployment Option 2: SSH Command‑Line Deployment

```
# SSH into fnOS
ssh root@<fnOS‑IP>

# Create project folder
mkdir -p /volume1/docker/VODTV
cd /volume1/docker/VODTV

# Create docker-compose.yml
nano docker-compose.yml
# Paste the Kvrocks compose config, save and exit

# Start containers
docker-compose up -d

# View logs
docker-compose logs -f
```

#### 📝 fnOS Deployment Notes

- **Docker mirror acceleration**: It is recommended to configure Docker registry mirror in fnOS (Settings → Docker → Registry Mirrors)
- **Port conflict**: Ensure port 3000 is free. If occupied, remap e.g. `3001:3000`
- **Data persistence**: The `kvrocks-data` volume will be automatically created inside fnOS Docker data directory
- **Reverse proxy**: Use fnOS built‑in reverse‑proxy to enable custom domain names and HTTPS
- **Updating images**: Inside Docker management UI, select container → update image → restart

#### ✨ fnOS Deployment Benefits

- ✅ **Graphical management**: Intuitive web interface
- ✅ **One‑click image updates**: Built‑in container update function
- ✅ **NAS‑grade data safety & backup**
- ✅ **Docker registry mirror support**
- ✅ **Live resource monitoring for containers**

---

### 🤗 Hugging Face Space Deployment (Free)

[Hugging Face Spaces](https://huggingface.co/spaces) provides free Docker container hosting: **2‑core CPU, 16GB RAM, 50GB storage**, great for personal usage.

#### Deployment Steps

1. **Create Hugging Face account**
   - Register at [huggingface.co](https://huggingface.co/)
2. **Create a new Space**
   - Go to [huggingface.co/new-space](https://huggingface.co/new-space)
   - Enter your Space name e.g. `VODTV`
   - **Space SDK**: select `Docker`
   - **Space hardware**: select `CPU basic` (free tier)
   - Click `Create Space`
3. **Configure README.md metadata**

At repository root, create/edit `README.md` and add the YAML frontmatter:

```
---
title: VODTV
emoji: 🎬
colorFrom: green
colorTo: blue
sdk: docker
app_port: 3000
pinned: false
---
```

> 
> 💡 **Critical setting**: `app_port: 3000` tells Hugging Face the application listens on port 3000

4. **Create Dockerfile**

At repository root create `Dockerfile` with one line:

```
FROM ghcr.io/szemeng76/VODTV:latest
```

> 
> 💡 This directly pulls the official prebuilt Docker image, no local build required

5. **Set environment secrets**

Inside your Space page open `Settings` > `Variables and secrets`, add these secrets:

表格

| Variable Name | Description | Example Value |
| --- | --- | --- |
| `USERNAME` | Admin username | `admin` |
| `PASSWORD` | Admin password | `your_secure_password` |
| `NEXT_PUBLIC_STORAGE_TYPE` | Storage backend type | `upstash` |
| `UPSTASH_URL` | Upstash REST URL | `https://xxx.upstash.io` |
| `UPSTASH_TOKEN` | Upstash Token | `AxxxQ==` |
| `DISABLE_HERO_TRAILER` | Disable homepage trailer | `true` |

> 
> ⚠️ **Notice**: HF Spaces have no persistent local storage, you **must** use an external database like Upstash
> 
> 
> 💡 **Recommendation**: Set `DISABLE_HERO_TRAILER=true`. Trailer URLs are time‑limited and cannot be cached on ephemeral platforms.

6. **Wait for deployment**
   - Commit your files; Hugging Face will fetch the image and boot automatically
   - When finished, open `https://huggingface.co/spaces/<your‑username>/VODTV`

#### 📁 Complete File Structure

```
your-space/
├── README.md      # Contains YAML front‑matter
└── Dockerfile     # FROM ghcr.io/szemeng76/VODTV:latest
```

#### ✨ Hugging Face Space Benefits

- ✅ **100% free**: 2‑core CPU,16GB RAM,50GB storage
- ✅ **No private server needed**: Fully hosted
- ✅ **Auto‑HTTPS**: Built‑in SSL certificate
- ✅ **Minimal setup**: Only two required files
- ✅ **Official prebuilt image**: Direct pull without building locally

#### ⚠️ Hugging Face Space Caveats

- **No local persistent storage**: External database (Upstash) mandatory
- **Cold start**: First load after idle is slow (~30‑60 seconds)
- **48‑hour sleep**: Free tier suspends after 48 hours without traffic, restarts on next visit
- **Public repository**: Space repo is public by default (secrets remain hidden)
- **Traffic quota limits**: Free tier has bandwidth limits, sufficient for personal use

#### 🔗 Useful Links

- https://huggingface.co/docs/hub/spaces
- https://huggingface.co/docs/hub/spaces-sdks-docker
- [Upstash free Redis](https://upstash.com/)

---

### 🌐 EdgeOne Pages Deployment (Free)

[EdgeOne Pages](https://edgeone.ai/products/pages) is a Tencent Cloud edge‑computing platform similar to Vercel, supporting Next.js SSR / SSG / ISR, with good performance for users inside China.

> 
> 💡 This repository includes a built‑in `edgeone.json` config. After connecting your Git repository, EdgeOne automatically reads build settings; **no manual build‑command configuration is needed**.

#### Deployment Steps

1. **Prerequisites**
   - Register an account on [EdgeOne](https://edgeone.ai/)
   - Create a Redis instance at [Upstash](https://upstash.com/) (EdgeOne Pages has no persistent local storage; SQLite is not supported)
   - Fork this repository to your GitHub/GitLab account
2. **Create Pages project**
   - Sign into EdgeOne console
   - Open "Pages" → "Create Project"
   - Choose "Connect Git repository"
   - Authorize and select your forked VODTV repository
3. **Verify build settings**

`edgeone.json` in repo root pre‑configures all build parameters; EdgeOne reads automatically:

表格

| Setting | Value | Description |
| --- | --- | --- |
| Install command | `pnpm install --frozen-lockfile` | Auto‑loaded |
| Build command | `pnpm edgeone:build` | Auto‑loaded |
| Output directory | `.edgeone` | Auto‑loaded |
| Node.js version | `24` | Auto‑loaded |
| Max function duration | `120s` | Auto‑loaded |

> 
> ⚠️ If console shows `pnpm build`, manually change build command to `pnpm edgeone:build`, output folder to `.edgeone`, Node.js version to `24`.

4. **Configure environment variables**

Add these environment variables in project settings:

```
# Required admin credentials
USERNAME=admin
PASSWORD=your_secure_password

# Required storage (must use Upstash / Redis / Kvrocks, SQLite unsupported)
NEXT_PUBLIC_STORAGE_TYPE=upstash
UPSTASH_URL=https://your-redis-instance.upstash.io
UPSTASH_TOKEN=AxxxxxxxxxxxxxxxxxxxxxxxxxxxQ==

# Recommended: disable homepage trailer for ephemeral platforms
DISABLE_HERO_TRAILER=true

# Optional site settings
SITE_BASE=https://your-project.edgeone.app
NEXT_PUBLIC_SITE_NAME=VODTV Enhanced

# Optional Douban proxy (recommended)
NEXT_PUBLIC_DOUBAN_PROXY_TYPE=cmliussss-cdn-tencent
NEXT_PUBLIC_DOUBAN_IMAGE_PROXY_TYPE=cmliussss-cdn-tencent
```

5. **Deploy the project**
   - Click "Deploy"
   - Wait for build (~3‑5 minutes for first deployment)
   - After deployment you get a `xxx.edgeone.app` domain
6. **(Optional) Bind custom domain**
   - In project settings open "Domains"
   - Add your custom domain and configure DNS records

#### ✨ EdgeOne Pages Benefits

- ✅ **Good access inside China**: Tencent edge nodes
- ✅ **Generous free tier**: 3 000 000 monthly Edge Function requests, 1 000 000 Cloud Function requests, 500 builds per month, unlimited traffic
- ✅ **Automatic HTTPS**: Free SSL certificates
- ✅ **Git‑triggered deploy**: Rebuild automatically on git push
- ✅ **Full Next.js SSR support**
- ✅ **Zero‑config builds**: Uses built‑in `edgeone.json`

#### ⚠️ EdgeOne Pages Caveats

- **No Docker runtime**: Source‑only serverless deployment
- **SQLite not supported**: Ephemeral filesystem; data resets after cold restart, must use Upstash / Redis / Kvrocks
- **Function timeout**: Maximum single request execution time 120s (configured in `edgeone.json`)
- **Video cache unavailable**: No persistent local filesystem

#### 🔗 Useful Links

- [EdgeOne Pages Free Tier](https://pages.edgeone.ai/pricing)
- [EdgeOne Pages Docs (International)](https://edgeone.ai/zh/document/160427672961769472)
- [EdgeOne Pages Docs (CN)](https://cloud.tencent.com/document/product/1552/127366)
- [Upstash free Redis](https://upstash.com/)

---

### ▲ Vercel Deployment

[Vercel](https://vercel.com/) is the official recommended deployment platform for Next.js. Serverless with auto‑scaling, suitable for global audiences.

#### Deployment Steps

1. **Prerequisites**
   - Register a [Vercel](https://vercel.com/) account
   - Create Redis instance at [Upstash](https://upstash.com/) (Vercel has no persistent disk storage)
   - Fork the repository into your GitHub account
2. **Import project**
   - Open Vercel dashboard
   - Click "Add New..." > "Project"
   - Select your forked VODTV repository to import
3. **Verify build configuration**
   - **Framework Preset**: `Next.js` (auto‑detected)
   - **Build Command**: `pnpm build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `pnpm install` (default)
4. **Set environment variables**

Go to Project Settings > Environment Variables and add:

```
# Required admin credentials
USERNAME=admin
PASSWORD=your_secure_password

# Required storage backend (Upstash mandatory)
NEXT_PUBLIC_STORAGE_TYPE=upstash
UPSTASH_URL=https://your-redis-instance.upstash.io
UPSTASH_TOKEN=AxxxxxxxxxxxxxxxxxxxxxxxxxxxQ==

# Recommended: disable homepage trailer for serverless platforms
DISABLE_HERO_TRAILER=true

# Optional site configuration
SITE_BASE=https://your-project.vercel.app
NEXT_PUBLIC_SITE_NAME=VODTV Enhanced
```

5. **Deploy project**
   - Click "Deploy"
   - Wait for first build (~3‑5 minutes)
   - You will receive a `xxx.vercel.app` domain after deployment completes
6. **(Optional) Custom domain binding**
   - Go to Settings > Domains, add your custom domain and configure DNS records

#### ✨ Vercel Deployment Benefits

- ✅ **Official Next.js platform**: Best compatibility & optimizations
- ✅ **Automatic HTTPS**: Free SSL certificates
- ✅ **Global CDN edge network**
- ✅ **Git‑triggered automatic deployments**
- ✅ **Serverless auto‑scaling, no server management needed**
- ✅ **Preview deployments for every Pull Request**

#### ⚠️ Vercel Caveats

- **Upstash is mandatory**: No persistent local disk storage
- **Function timeout limit**: Hobby plan serverless function max 60‑second execution
- **Video cache unavailable**: No local persistent filesystem
- **Bandwidth quota**: Hobby plan monthly bandwidth cap at 100GB
- **Mainland China connectivity**: Custom domain may be required to improve access from China

---

### 🟢 Render Deployment (Free Tier)

[Render](https://render.com/) offers free Web Service hosting with native Docker support for personal projects.

#### Option 1: Docker Deployment (Recommended)

1. **Prerequisites**
   - Register a [Render](https://render.com/) account
   - Provision Redis instance at [Upstash](https://upstash.com/)
   - Fork repository to your GitHub account
2. **Create new Web Service**
   - Open Render Dashboard
   - Click "New +" > "Web Service"
   - Connect GitHub account and select your forked VODTV repository
3. **Service configuration**
   - **Name**: `VODTV` (customizable)
   - **Region**: Pick region closest to your users
   - **Runtime**: `Docker`
   - **Instance Type**: `Free` or upgrade as needed
4. **Environment variables**

Add these variables inside Environment panel:

```
# Required admin credentials
USERNAME=admin
PASSWORD=your_secure_password

# Required storage backend (Upstash recommended)
NEXT_PUBLIC_STORAGE_TYPE=upstash
UPSTASH_URL=https://your-redis-instance.upstash.io
UPSTASH_TOKEN=AxxxxxxxxxxxxxxxxxxxxxxxxxxxQ==

# Recommended: disable homepage trailer
DISABLE_HERO_TRAILER=true

# Optional site configuration
SITE_BASE=https://your-service.onrender.com
NEXT_PUBLIC_SITE_NAME=VODTV Enhanced
```

5. **Launch deployment**
   - Click "Create Web Service"
   - Render will build from repository Dockerfile automatically
   - First build takes approx 5‑10 minutes
   - Your service is available at `xxx.onrender.com` after deployment

#### Option 2: Native Node.js Deployment

If you prefer not to run via Docker, deploy directly as a Node.js service:

1. Create Web Service and select your Git repository
2. Build runtime settings
   - **Runtime**: `Node`
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`
   - Set environment variable `NODE_VERSION=20`
3. Use identical environment variables listed above

#### ✨ Render Deployment Benefits

- ✅ **Free tier available**: 750 runtime hours per month
- ✅ **Native Docker support**: Uses repository Dockerfile directly
- ✅ **Automatic HTTPS**: Free SSL certificates
- ✅ **Git‑based auto deployments on push**
- ✅ **Web UI configuration, no local CLI required**

#### ⚠️ Render Caveats

- **Free tier cold‑start**: Service sleeps after 15‑minute inactivity; ~30‑60s wake‑up delay
- **Free tier resource limits**: 512MB RAM, 0.1 vCPU
- **External database recommended**: Free tier disk storage is non‑persistent
- **Build‑time quota**: 750 build minutes per month for free tier
- **Custom domains are supported for free tier**

#### 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- https://render.com/docs/deploy-nextjs-app
- [Upstash free Redis](https://upstash.com/)