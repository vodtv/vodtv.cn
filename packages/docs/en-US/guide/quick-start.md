## 🚀 Quick Start
### Docker Deployment (Recommended)
```bash
# Clone repository
git clone https://github.com/vodtv/vodtv.git
cd VODTV
# Copy environment variable configuration
cp .env.example .env
# Edit .env file to configure required environment variables
nano .env
# Start services
docker-compose up -d

```

Visit `http://localhost:3000` to use the application.

### Local Development

```bash
# Install dependencies
pnpm install

# Launch dev‑server
pnpm dev
```

**Full Deployment Guide**: [View complete deployment documentation](DEPLOYMENT.md)

