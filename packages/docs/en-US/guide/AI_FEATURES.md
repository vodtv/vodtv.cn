# VODTV AI Function Documentation
## 📚 Table of Contents
- [Function Overview](#function-overview)
- [Function Features](#function-features)
- [Administrator Configuration Guide](#administrator-configuration-guide)
- [User Guide](#user-guide)
- [Technical Description](#technical-description)
- [FAQ](#faq)
---
## Function Overview
VODTV AI functions provide intelligent movie & TV recommendations and context-aware conversations. It is built on OpenAI-compatible APIs and supports optional web search.
### 🎯 Important Notes
**Three configuration modes for AI features:**
1. **AI Model Mode** - Configure AI API (OpenAI/Claude etc.) for intelligent chat and recommendations
2. **Tavily Search-Only Mode** - No AI API required, completely free, only Tavily web search available
3. **Hybrid Mode (Recommended)** - Configure both AI API and Tavily for best experience
**Key Points:**
- ✅ When AI is enabled, you may **leave AI API fields empty**
- ✅ Only Tavily Keys are needed to use **completely free** web search
- ✅ Consistent UI for users, only data source differs
### New Enhancements
✨ **8 Major AI Enhancements:**
1. **Markdown Rendering** - Professional formatting with code highlighting, links and lists
2. **AI Smart Orchestrator** - Intelligent intent analysis and automatic web search
3. **Video Context** - Context-aware conversations targeting specific media
4. **Smart UI Integration** - AI button on media cards
5. **Streaming Response** - Real-time word-by-word AI output
6. **Douban Data Boost** - Automatically inject real ratings, cast, director and plot info
7. **TMDB Data Boost** - Provide keyword tags and similar media recommendations
8. **🆕 Tavily Search-Only Mode** - No AI API required, fully free web search
---
## Function Features
### 1. Markdown Rendering
AI replies support GitHub-style Markdown, including:
- **Code blocks** with syntax highlighting
- **Clickable links**
- **Lists** (ordered & unordered)
- **Bold / italic** text formatting
- **Tables** for structured data
### 2. AI Smart Orchestrator
The orchestrator automatically analyzes user intent and decides whether web search for latest information is needed.
**Intent Types:**
- `recommendation` - Movie & TV show recommendations
- `query` - Actor / director information, news
- `detail` - Plot, reviews, ratings
- `general` - Other questions
**Conditions to trigger automatic web search:**
- Time-sensitive keywords (latest, this year, 2024, 2025, upcoming, release etc.)
- Person queries (actor, director, cast etc.)
- News requests (news, updates, official announcements etc.)
**Supported Search Service:**
- **Tavily** - 1000 free API calls per key per month
### 3. Video Context Support
When AI is launched from a media card, AI automatically knows:
- Movie / series title
- Release year
- Type (movie / tv series)
- Current episode (for tv series)
- Douban ID / TMDB ID
**Advantages:**
- No need to repeat movie title
- More accurate replies
- Natural conversation flow
- Targeted web search
### 4. Smart AI Button on Media Cards
**Desktop Experience:**
- Hover mouse over any media card
- AI button appears at card bottom center
- Smart positioning to avoid covering bottom tags
- Glassmorphism design with gradient color
**Mobile Experience:**
- Long press or right-click media card
- Select "Ask AI" from action menu
- Full-screen AI dialog
### 5. Streaming Response
AI outputs text word by word in real time:
- Better user experience
- Instant feedback
- Lower perceived latency
### 6. Douban Data Boost 🆕
When opening AI from media card, system fetches real Douban data and injects it into AI context automatically:
**Auto-fetched Data:**
- ⭐ **Douban Rating** - Real user rating (e.g. 8.5/10)
- 🎬 **Director Info** - Director list
- 👥 **Main Cast** - Top 5 actors
- 📝 **Plot Summary** - Official synopsis (max 300 characters)
- 🎭 **Genre Tags** - Suspense, crime, comedy etc.
- 🌍 **Production Region** - Mainland China, USA etc.
- 📺 **Episode Info** - Total episodes for tv series
**Advantages:**
- ✅ Replies based on real data instead of AI memory
- ✅ Accurate ratings from Douban users
- ✅ Complete cast list
- ✅ Official & authoritative plot intro
- ✅ No manual title input required
**Sample Conversation:**
### 8. Tavily Search-Only Mode 🆕
**Totally free AI option!** Use web search without AI API.
**Use Cases:**
- 🆓 Limited budget, no AI API cost
- 📰 Main requirement: query latest news & time-sensitive info
- 🔍 Prefer raw web results over AI-generated content
**How it works:**
1. User asks time-sensitive question (e.g. "new movies in 2025")
2. System detects web search required
3. Call Tavily API directly
4. Format search results into Markdown and return
5. No LLM invocation, fully free
**Setup Steps:**
1. Toggle on main AI switch
2. **Skip AI API configuration (leave empty)**
3. Enable Smart Orchestrator
4. Enable web search
5. Fill Tavily API Keys (1000 free calls per key / month)
**Result Example:**
```markdown
🌐 **Search Results** (From Tavily)
**You are viewing**: The Wandering Earth 2 (2023)
5 related results found:
### 1. Release confirmation for The Wandering Earth 2
Released during 2023 Spring Festival, box office over 4 billion...
📎 Source: [mtime.com](https://www.mtime.com/...)
---
💡 Tip: Information comes from live web search, please double-check.
