## 🚀 快速开始

### Docker 部署（推荐）

```bash
# 克隆项目
git clone https://github.com/SzeMeng76/LunaTV.git
cd LunaTV

# 复制环境变量配置
cp .env.example .env

# 编辑 .env 文件，配置必要的环境变量
nano .env

# 启动服务
docker-compose up -d
```

访问 `http://localhost:3000` 即可使用。

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

**详细部署指南**：[查看完整部署文档](DEPLOYMENT.md)

