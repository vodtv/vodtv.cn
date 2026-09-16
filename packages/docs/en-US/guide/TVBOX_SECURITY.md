# TVBox Security Configuration Guide

## 🔒 Security Concerns

The JSON interface of TVBox has no authentication by default and may be abused by others. Multiple optional security‑mechanisms have now been added.

## 🛠️ Admin Dashboard Configuration Page

All security settings are available under **Admin Dashboard > TVBox Security Configuration**. No environment‑variable or config‑file edits are required.

### 1. Token Authentication (Recommended)

#### 🌐 Global Token

All users share one single token:
**Configuration Steps:**

1. Admin Dashboard > TVBox Security Configuration
2. Enable "Token Verification"
3. The system auto‑generates a token (manual modification allowed)
4. Save configuration

**Usage:**

```
shturl.cc/acL1zW25EJlEWnt4qNSUDn6PQ5LBN6zOvKB2pQhJ
```

#### 👤 User‑Specific Token (Added in v5.5.7)

**Features:**

- 🎯 Independent token & source permissions for each user
- 🔒 Leaked token only impacts the corresponding individual user
- 📊 Access tracking per‑user
- 🔄 Flexible permission adjustment

**Configuration:**

1. Admin Dashboard > User Management
2. Click "TVBox Token" for target user
3. Generate token and select accessible sources
4. Save (leave blank = grant access to all sources)

**Priority:**
User‑specific Token > Global Token > No verification

### 2. IP Whitelist

Restrict access to designated IP addresses only:
**Dashboard configuration steps:**

1. Turn on "IP Whitelist" inside TVBox Security Configuration
2. Add permitted IP entries
3. Save settings

**Supported formats:**
‑ Single IPv4 address: `192.168.1.100`
‑ IPv4 CIDR notation: `192.168.1.0/24`, `10.0.0.0/8`
‑ Single IPv6 address: `2001:db8::1`
‑ IPv6 CIDR notation: `2001:db8::/32`
‑ Wildcard: `*` (allow all, not recommended)

### 3. Access Rate Limiting

Protect against abusive frequent requests:
**Dashboard configuration steps:**

1. Enable "Rate Limiting" from admin panel
2. Set maximum allowed requests per minute (default:60)
3. Save configuration

## 📱 TVBox Configuration Examples

### No security restriction (default)

```
shturl.cc/hs19zaTUJOhtQ3FpvT6XOTS
```

### Token verification enabled

```
shturl.cc/acL1zW25EJlEWnt4qNSUDn6PQ5LBN6zOvKB2pQhJ
```

### Base64 format config

```
shturl.cc/hs19zaTUJOhtQ3FpvT6XOTS?format=base64&token=your_token
```

## 💡 Usage Recommendations

### Home‑use deployment

‑ Simply enable "Token Verification" in backend
‑ Rotate token periodically for better security

### Public‑internet deployment

‑ It is advised to activate all three security controls:

1. Token verification (mandatory)
2. Rate limiting (recommended:30 requests/minute)
3. IP whitelist (if client IPs remain static)

### Intranet‑only deployment

‑ You may rely purely on IP whitelist for LAN‑only restriction
‑ Or enable token verification as an extra safety layer

## ⚠️ Notes

1. **TVBox Compatibility**: All security mechanisms are optional. Default unauthenticated mode preserves native TVBox compatibility.
2. **Backend configuration**: Settings take effect immediately after saving inside admin dashboard, server restart is unnecessary.
3. **Token security**: Once token authentication is turned on, you must supply the complete URL containing token parameter inside TVBox client.
4. **IP whitelist**: Works best for static‑IP environments; mobile clients often have changing public IPs.
5. **Rate limiting**: Guards against brute‑force access; normal daily usage will not trigger throttling.
6. **Combined activation**: Multiple security controls can work simultaneously.

## 🔧 Troubleshooting

### TVBox fails to load configuration

1. Verify URL includes correct token parameter
2. Confirm client IP exists inside whitelist
3. Check whether rate‑limit has been hit (wait one minute then retry)
4. Double‑check saved values in TVBox Security Configuration page

### Error message reference

‑ `Invalid token`: Token missing or incorrect
‑ `Access denied for IP`: Client IP is not present in whitelist
‑ `Rate limit exceeded`: Too many requests within current time window

## 📊 Configuration Management

Inside admin dashboard:

1. **Live preview**: Directly inspect generated TVBox configuration URL
2. **Security status overview**: Show currently‑enabled security modules
3. **Token management**: Auto‑generate or manually input token string
4. **IP management**: Visual UI to add / remove whitelist entries
5. **Rate‑limit adjustment**: Slider control for request‑quota

These utilities simplify TVBox security setup; manual config‑file editing is not required.

## 🛡️ Adult‑content Filtering (Defense‑in‑Depth)

VODTV implements a two‑layer defensive system for inappropriate‑content protection.

### Layer 1: Filtering at TVBox config endpoint

The TVBox config interface (`/api/tvbox`) respects the `filter` parameter to toggle adult‑source filtering.

**Default behaviour (filter enabled):**

```
shturl.cc/hs19zaTUJOhtQ3FpvT6XOTS?token=xxx
```

‑ Automatically excludes sources marked `is_adult=true`
‑ Prevents adult‑labelled sources from being delivered to client

**Explicitly disable filtering (administrator‑only):**

```
shturl.cc/hs19zaTUJOhtQ3FpvT6XOTS?token=xxx&filter=off
```

‑ Must explicitly pass `filter=off` query parameter
‑ Intended for admin debugging or special scenarios

**Permission priority logic:**
‑ Priority: User config > User‑group config > Global config
‑ Both `filter` parameter and user permission must be satisfied before adult sources are returned.

### Layer 2: Interception inside CMS proxy endpoint

Even if a client bypasses the first‑layer filter, the second‑layer proxy will block API calls targeting adult sources.

**Working principle:**

1. Client invokes external CMS via `/api/proxy/cms`
2. Proxy checks request origin against adult‑source registry
3. If target is an adult source without `filter=off`, respond with empty list:

```
{
  "code": 200,
  "list": [],
  "total": 0
}
```

4. Silently drop payload to avoid client‑side errors

**Prerequisite configuration:**
‑ Mark your adult sources as `is_adult: true` inside Backend Source Management panel
‑ The system will automatically intercept subsequent API requests for those entries.

### Configuration Snippets

**Mark an adult source:**

```
// inside source configuration
{
  "key": "adult_source",
  "name": "Adult Video Source",
  "api": "[http://adult-api.com/api.php](http://adult-api.com/api.php)",
  "is_adult": true  // ← critical flag
}
```

**User permission settings:**

```
// Option1: User‑level (highest priority)
{
  "username": "user1",
  "showAdultContent": false  // deny this user
}
// Option2: User‑group level
{
  "tagName": "vip",
  "showAdultContent": true   // grant for VIP group
}
// Option3: Global‑level (system default)
{
  "ShowAdultContent": false  // globally disabled by default
}
```

### Defence flow diagram

```
Client requests TVBox config
        ↓
Layer1: evaluate filter param & user permissions
        ↓ (filter active)
Strip out sources with is_adult=true
        ↓
Client receives sanitized source list
        ↓
Client makes API call for one video source
        ↓
Layer2: CMS proxy validates whether target is adult source
        ↓ (adult source & no filter=off)
Return empty list payload, block content loading
```

### Log Monitoring

Runtime filtering logs are printed:

```
# Layer‑1 filtering log
[TVBox] 🛡️ Adult filter enabled (filter=default, showAdultContent=false), remaining sources:15
# Layer‑2 proxy block log
[CMS Proxy] 🛡️ Blocked adult source: [http://adult-api.com](http://adult-api.com)
```

## 🌐 CMS Proxy Endpoint

VODTV supplies the CMS proxy interface to resolve:
‑ Mixed‑Content errors (HTTPS frontend cannot directly fetch HTTP APIs)
‑ CORS cross‑origin restrictions from third‑party CMS backends
‑ Compatibility issues with legacy CMS implementations

### Endpoint URL

```
/api/proxy/cms?url=<targetURL>
```

### Built‑in Safe Whitelist

Only whitelisted CMS request patterns can be proxied:
‑ `?ac=class` – fetch categories
‑ `?ac=list` – fetch vod list
‑ `?ac=videolist` – fetch video entries
‑ `?ac=detail` – fetch item detail
‑ `/api/vod` – generic api route
‑ `/index.php` – php entry point
‑ `/provide/vod` – provide api endpoint

### Usage Example

```
// Original direct request (may hit CORS block)
const apiUrl = '[http://example.com/api.php?ac=list](http://example.com/api.php?ac=list)';
// Request via backend proxy
const proxiedUrl = `/api/proxy/cms?url=${encodeURIComponent(apiUrl)}`;
const response = await fetch(proxiedUrl);
```

### Advanced Features

**1. Adult‑content interception**

```
/api/proxy/cms?url=[http://adult-api.com/api.php?ac=list](http://adult-api.com/api.php?ac=list)
```

‑ Auto‑detect and return empty payload for adult sources
‑ Interception can be lifted by supplying `filter=off`

**2. Full browser header spoofing**
‑ Mimic User‑Agent, Accept, Referer and other headers
‑ Improve compatibility for older CMS services

**3. Timeout & retry handling**
‑ Hard 20‑second request timeout
‑ Granular error classification: DNS, connection, SSL etc.

**4. Response post‑processing**
‑ Strip BOM markers and extra whitespace
‑ Works with JSON as well as non‑JSON responses
‑ 5‑minute in‑memory cache to reduce duplicate upstream traffic

### Error Reference Table

| Error Type | Description | Status Code |
| --- | --- | --- |
| `Missing required parameter: url` | Missing url query argument | 400 |
| `Invalid URL format` | Malformed url value | 400 |
| `URL not in whitelist` | Target endpoint is not whitelisted | 403 |
| `TIMEOUT` | Upstream request timed out (20s) | 502 |
| `DNS_ERROR` | Domain name resolution failure | 502 |
| `CONNECTION_REFUSED` | Remote host refused TCP connection | 502 |
| `SSL_ERROR` | TLS / SSL certificate negotiation failure | 502 |

### Deployment Advice

**Public internet deployment:**
‑ Whitelist is baked‑in, no extra configuration needed
‑ Recommended to pair with TVBox token authentication
‑ Monitor proxy logs to spot abuse behaviour

**Intranet‑only deployment:**
‑ Ready to use out‑of‑the‑box with minimal security concerns
‑ Primarily solves Mixed‑Content browser restrictions

---

## 🙏 Acknowledgements

The **CMS proxy interface** and defence‑in‑depth filtering strategy in this documentation draw excellent implementation ideas from [DecoTV](https://github.com/Decohererk/DecoTV%5D(https://github.com/Decohererk/DecoTV)). Special thanks to that project.

This is technical documentation for the backend feature. If you want to turn it into a nicely arranged tutorial post, work‑task‑mode can help refine headings, tips and supplementary content, would you like to give it a try?