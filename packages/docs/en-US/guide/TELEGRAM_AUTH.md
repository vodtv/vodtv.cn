# Telegram Magic Link Authentication

## Overview

VODTV supports password‑less login via Telegram Bot (Magic Link). Users simply enter their Telegram username and complete login through a link delivered by the Bot.

## Feature Highlights

- 🔐 **Password‑less Login** — One‑time login link sent via Telegram Bot
- 🤖 **Auto‑registration** — Automatically create accounts for first‑time users
- ⏰ **Secure Expiry** — Login link expires automatically after 5 minutes
- 🌐 **Multi‑storage Support** — Token storage available for Kvrocks, Redis, Upstash
- 🔄 **Automatic Webhook Update** — Automatically sets webhook to your current domain

## Configuration Steps

### 1. Create your Telegram Bot

1. Open a conversation with [@BotFather](https://t.me/botfather) inside Telegram
2. Send command `/newbot` to create a new Bot
3. Follow prompts to set Bot name and Bot username
4. Save the returned **Bot Token** and **Bot Username** provided by BotFather

### 2. Configure environment variables

Set your storage backend inside `.env.local` or your deployment environment:

```
# Storage type: kvrocks, redis or upstash
NEXT_PUBLIC_STORAGE_TYPE=kvrocks
# Kvrocks connection URL (for Kvrocks deployments)
KVROCKS_URL=redis://moontv-kvrocks:6666
# Redis connection URL (for Redis deployments)
# REDIS_URL=redis://localhost:6379
# Upstash configuration (for Upstash deployments)
# UPSTASH_URL=https://xxx.upstash.io
# UPSTASH_TOKEN=your_token_here
```

### 3. Configure inside admin dashboard

1. Log into admin dashboard at `/admin`
2. Navigate to **Telegram Login Configuration** page
3. Fill out the fields below:
   - **Bot Token**: Token retrieved from BotFather
   - **Bot Username**: Bot username (without leading @ symbol)
   - **Enable auto‑registration**: Recommended on, permits automatic account creation for new users
4. Click **Save Configuration**

### 4. Set up Webhook (Optional)

The system will automatically configure the webhook for your current domain the first time a user clicks the Bot link.
To manually trigger webhook setup, run this snippet inside your browser Developer Console:

```
fetch('/api/telegram/set-webhook', {
  method: 'POST'
}).then(r => r.json()).then(console.log)
```

## How It Works

### Login Flow

```
User -> Input Telegram username
      -> System generates one‑time token (valid for 5 minutes)
      -> System sends deep‑link to user’s Telegram
      -> User clicks the /start link inside Telegram
      -> Bot replies with login URL
      -> User clicks URL to finish signing‑in
```

### Token Generation & Storage

```
// Token data structure
interface TelegramTokenData {
  telegramUsername: string;  // Telegram username
  expiresAt: number;         // Expiration timestamp
  baseUrl?: string;          // Domain where token was created
}
// Storage backend: Redis / Kvrocks
// Key: cache:telegram_token:{token_hash}
// TTL: 300 seconds (5 minutes)
```

### Automatic Webhook Update

Upon receiving incoming Telegram messages, the system validates whether the active webhook URL matches the current domain and updates automatically when mismatched:

```
// webhook.ts auto‑update logic
if (currentWebhookUrl !== expectedWebhookUrl) {
  await setWebhook(expectedWebhookUrl);
}
```

## Important Limitations

### ⚠️ A single Bot can only bind to one domain

Telegram Bot webhook restriction: **One Bot may only have one active webhook URL**.

**Solutions for multi‑instance deployments:**

1. **Option A: Separate Bot for each deployment**
   - Vercel deployment → Bot A
   - Self‑hosted server → Bot B
   - Pros: Deployments operate independently without conflicts
   - Cons: Multiple Bots require maintenance
2. **Option B: Activate Telegram login only on one domain**
   - Enable Telegram login for your primary domain
   - Disable Telegram login or use alternative auth methods for remaining deployments
   - Pros: Simple maintenance
   - Cons: Feature availability restricted

## API Endpoints

### POST `/api/telegram/send-magic-link`

Generate and dispatch the Magic Link
**Request Body:**

```
{
  "telegramUsername": "username"
}
```

**Response:**

```
{
  "success": true,
  "deepLink": "https://t.me/yourbot?start=token_hash",
  "botUsername": "yourbot"
}
```

### POST `/api/telegram/webhook`

Receive incoming messages from Telegram Bot servers (called externally by Telegram)

### GET/POST `/api/telegram/set-webhook`

Retrieve or update webhook URL settings

### GET `/api/telegram/verify`

Validate and consume token to complete login
**Query Parameters:**

- `token`: One‑time login token

## Troubleshooting

### Token expires immediately

**Symptom:** Clicking the Bot‑sent link returns "Login link expired or invalid"
**Potential causes:**

1. Webhook points toward a different domain (multi‑deployment conflict)
2. Token failed to persist into Redis / Kvrocks
3. Server system‑time is out‑of‑sync

**Resolution steps:**

```
# 1. Inspect active webhook configuration
curl shturl.cc/nOJYf0w6TpSCagm2JRJAswNwZwuJ2XwaKxAVEj
# 2. Manually set webhook for current domain
curl -X POST shturl.cc/nOJYf0w6TpSCagm2JRJAswNwZwuJ2XwaKxAVEj
# 3. Inspect stored tokens inside Kvrocks / Redis
redis-cli -h kvrocks-host -p 6666
KEYS cache:telegram_token:*
GET cache:telegram_token:{token_hash}
TTL cache:telegram_token:{token_hash}
```

### Webhook 401 error

**Symptom:** `getWebhookInfo` reports `last_error_message: "401 Unauthorized"`
**Cause:** Webhook endpoint returns HTTP 401 (typically wrong domain or path)
**Resolution:**

1. Confirm domain is publicly reachable (not blocked behind firewall)
2. Verify webhook endpoint path: `/api/telegram/webhook`
3. Check backend middleware is not intercepting webhook requests

### Webhook is not updated automatically

**Symptom:** No login URL is received after clicking Bot link
**Resolution:**

```
// Visit your domain in browser and execute within Developer Console
fetch('/api/telegram/set-webhook', {
  method: 'POST'
}).then(r => r.json()).then(console.log)
```

## Security Considerations

1. **One‑time‑use Token** — Token is deleted immediately upon successful verification via verify endpoint
2. **Short‑lived validity** — Token lifetime limited to 5 minutes
3. **Cryptographically random generation** — 64‑character token generated by crypto.randomBytes(32)
4. **Domain binding** — Origin domain is persisted with token to prevent cross‑domain reuse
5. **Automatic cleanup** — Redis/Kvrocks TTL evicts expired tokens automatically

## Development & Debugging

### Enable debug logging

Detailed logging is printed for all Telegram‑related workflows:

```
# View application runtime logs
docker logs <container-name> --tail 100 --follow | grep -E "\[TelegramToken\]|\[Webhook\]|\[Magic Link\]"
```

### Monitor live Kvrocks commands

```
# Watch real‑time Kvrocks command execution
docker exec -it moontv-kvrocks redis-cli -p 6666 MONITOR
```

### Manual token storage test

```
# Manually test token write‑read cycle in Kvrocks / Redis
docker exec -it moontv-kvrocks redis-cli -p 6666
# Set sample test token
SETEX cache:test_token 300 '{"telegramUsername":"test","expiresAt":1761999999999}'
# Read token value
GET cache:test_token
# Inspect remaining TTL
TTL cache:test_token
```

## Related Source Files

- `src/lib/telegram-tokens.ts` — Token management logic
- `src/app/api/telegram/send-magic-link/route.ts` — Magic link sending
- `src/app/api/telegram/webhook/route.ts` — Webhook handler & auto‑update logic
- `src/app/api/telegram/verify/route.ts` — Token validation & login workflow
- `src/app/api/telegram/set-webhook/route.ts` — Webhook configuration management
- `src/components/TelegramAuthConfig.tsx` — Admin backend configuration UI

## Changelog

- **v1.0.0** — Initial Telegram Magic Link login implementation
- **v1.1.0** — Added automatic webhook update capability
- **v1.2.0** — Added warning for multi‑deployment domain‑conflict scenarios