# OpenID Connect (OIDC) Authentication Configuration Guide

This document describes in detail how to configure OIDC Single Sign‑On (SSO) inside VODTV. It supports mainstream identity providers including Google, Microsoft, GitHub, Facebook, WeChat, Apple, LinuxDo and more.

## 📋 Table of Contents

- [What is OIDC](#what-is-oidc)
- [Pre‑configuration Checklist](#pre‑configuration-checklist)
- [Google OAuth 2.0 Setup](#google-oauth-20-setup)
- [Microsoft Entra ID Setup](#microsoft-entra-id-setup)
- [GitHub OAuth Setup](#github-oauth-setup)
- [Facebook OAuth Setup](#facebook-oauth-setup)
- [WeChat Open Platform Setup](#wechat-open-platform-setup)
- [Apple Sign In Setup](#apple-sign-in-setup)
- [LinuxDo Setup](#linuxdo-setup)
- [VODTV Admin Panel Configuration](#vodtv-admin-panel-configuration)
- [Frequently Asked Questions](#frequently-asked-questions)

---

## What is OIDC

OpenID Connect (OIDC) is an identity‑layer protocol built on top of OAuth 2.0. It enables users to log into your application using existing third‑party accounts without creating a separate local account.

### Benefits
- ✅ **Better User Experience**: One‑click login with familiar external accounts
- ✅ **Improved Security**: Password management handled by dedicated identity providers
- ✅ **Reduced Maintenance Overhead**: No need to host your own user password database
- ✅ **Cross‑device Support**: Single account works across multiple client devices

---

## Pre‑configuration Checklist

### 1. Confirm Redirect URI

All OIDC providers require you to supply a Redirect URI (Callback URL).

**Standard VODTV callback URL format**:
shturl.cc/dt39XuvL9cvJZ

```
8. **Authorized redirect URIs** (**required**):
```

shturl.cc/dTTnmQ59tLdtTqX5699pH6S4OLIDwBDtf5Gu

```
9. Click **Create**

### Step 4: Retrieve Credentials
After creation a popup will display:
‑ Client ID: `xxxxxx.apps.googleusercontent.com`
‑ Client secret: `GOCSPX‑xxxxxxxxxx`

⚠️ **Important note (2025 update)**:
‑ Starting June 2025, newly‑generated client secrets are visible only once at creation time
‑ Copy and store the secret immediately
‑ If lost you must regenerate a new secret

### Google OIDC Endpoints
Google supports OIDC auto‑discovery, only the **Issuer URL** is required:
```

Issuer URL: [https://accounts.google.com](https://accounts.google.com)

```
Auto‑discovery document:
```

[https://accounts.google.com/.well-known/openid-configuration](https://accounts.google.com/.well-known/openid-configuration)

```

Manual endpoint configuration fallback:
```

Authorization Endpoint: [https://accounts.google.com/o/oauth2/v2/auth](https://accounts.google.com/o/oauth2/v2/auth)
Token Endpoint:         [https://oauth2.googleapis.com/token](https://oauth2.googleapis.com/token)
UserInfo Endpoint:      [https://openidconnect.googleapis.com/v1/userinfo](https://openidconnect.googleapis.com/v1/userinfo)

```

### References
‑ [Setting up OAuth 2.0 ‑ Google Cloud Console Help](https://support.google.com/cloud/answer/6158849?hl=en)
‑ [OpenID Connect | Sign in with Google](https://developers.google.com/identity/openid-connect/openid-connect)
‑ [Get your Google API client ID](https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid)

---

## Microsoft Entra ID Setup

Microsoft Entra ID (formerly Azure Active Directory) provides enterprise‑grade identity services.

### Step 1: Register an Application
1. Sign‑in to [Microsoft Entra Admin Center](https://entra.microsoft.com/)
2. Navigate to **Applications** → **App registrations** → **New registration**
3. Fill in application properties:
   - **Name**: `VODTV`
   - **Supported account types**:
     - **Accounts in this organizational directory only** (single‑tenant, internal users only)
     - **Accounts in any organizational directory** (multi‑tenant, corporate accounts)
     - **Accounts in any organizational directory and personal Microsoft accounts** (recommended, supports Outlook/Xbox consumer accounts)
   - **Redirect URI**:
     - Platform: **Web**
     - URI: `shturl.cc/dTTnmQ59tLdtTqX5699pH6S4OLIDwBDtf5Gu`
4. Click **Register**

### Step 2: Configure Authentication
1. Inside your app registration page select **Authentication** from the sidebar
2. Under **Implicit grant and hybrid flows** check:
   - ✅ **ID tokens (used for implicit and hybrid flows)**
3. Click **Save**

### Step 3: Create a Client Secret
1. Open **Certificates & secrets** from sidebar
2. Switch to the **Client secrets** tab
3. Click **New client secret**
4. Description e.g. "VODTV Production"
5. Expiry options:
   - 6 months
   - 12 months
   - 24 months
   - **Custom** (max 2 years)
6. Click **Add**
7. **Copy and save the secret value right away (only shown once)**

### Step 4: Retrieve Endpoint Information
1. On the application overview page click **Endpoints**
2. Copy endpoint URLs:

Single‑tenant application:
```

Issuer URL: [https://login.microsoftonline.com/{tenant-id}/v2.0](https://login.microsoftonline.com/%7Btenant-id%7D/v2.0)

```

Multi‑tenant application (recommended):
```

Issuer URL: [https://login.microsoftonline.com/common/v2.0](https://login.microsoftonline.com/common/v2.0)

```
`{tenant‑id}` value can be found on overview page under **Directory (tenant) ID**.

Auto‑discovery document:
```

[https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration](https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration)

```

Manual fallback endpoints:
```

Authorization Endpoint: [https://login.microsoftonline.com/common/oauth2/v2.0/authorize](https://login.microsoftonline.com/common/oauth2/v2.0/authorize)
Token Endpoint:         [https://login.microsoftonline.com/common/oauth2/v2.0/token](https://login.microsoftonline.com/common/oauth2/v2.0/token)
UserInfo Endpoint:      [https://graph.microsoft.com/oidc/userinfo](https://graph.microsoft.com/oidc/userinfo)

```

### References
‑ [OpenID Connect (OIDC) on the Microsoft identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc)
‑ [How to register an app in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)
‑ [Microsoft identity platform UserInfo endpoint](https://learn.microsoft.com/en-us/entra/identity-platform/userinfo)

---

## GitHub OAuth Setup

GitHub provides OAuth 2.0 authentication. While it is not fully OIDC‑compliant, most of the workflow is compatible.

### Step 1: Create OAuth App
1. Log into GitHub, click avatar at top‑right → **Settings**
2. Scroll sidebar down to **Developer settings**
3. Open **OAuth Apps** → **New OAuth App**

### Step 2: Fill Application Information
‑ **Application name**: `VODTV`
‑ **Homepage URL**: `shturl.cc/dt39XuvL9cvJZ`
‑ **Application description** (optional): `VODTV media platform`
‑ **Authorization callback URL**: `shturl.cc/dTTnmQ59tLdtTqX5699pH6S4OLIDwBDtf5Gu`
‑ Click **Register application**

### Step 3: Retrieve Credentials
1. After creation your **Client ID** is visible directly on the page
2. Click **Generate a new client secret** to create the secret
3. **Copy Client Secret immediately; it is only displayed once**

⚠️ Security reminder:
‑ Never commit Client Secret to public source repositories
‑ Regenerate immediately if the secret is leaked

### GitHub OAuth Endpoints
GitHub OAuth 2.0 endpoint addresses:
```

Authorization Endpoint: [https://github.com/login/oauth/authorize](https://github.com/login/oauth/authorize)
Token Endpoint:         [https://github.com/login/oauth/access_token](https://github.com/login/oauth/access_token)
UserInfo Endpoint:      [https://api.github.com/user](https://api.github.com/user)

```

**Special note**:
‑ GitHub OAuth does not implement full OIDC, there is no Issuer URL for discovery
‑ All endpoints need to be entered manually within VODTV backend
‑ UserInfo returns native GitHub API‑formatted JSON

### Technical Implementation Notes

#### GitHub OAuth Differences
| Feature | Standard OIDC | GitHub OAuth | VODTV Handling |
|---|---|---|---|
| **OAuth Scope** | `openid profile email` | `read:user user:email` | ✅ Auto‑select GitHub scopes |
| **Token Response Format** | JSON | URL‑encoded (default) | ✅ Adds Accept header for JSON |
| **id_token** | Returned | ❌ Not provided | ✅ Uses access_token directly |
| **Email Visibility** | Public | May be null (private) | ✅ Auto‑fetch from `/user/emails` |
| **UserInfo Headers** | Standard Authorization | GitHub‑specific headers | ✅ Inject dedicated headers |

#### VODTV Adaptation Logic
1. **Scope auto‑adaptation**:
   - Standard OIDC uses `openid profile email`
   - GitHub automatically uses `read:user user:email`

2. **Token request Accept Header**:
   - Adds `Accept: application/json` header
   - Forces JSON‑formatted response instead of urlencoded data

3. **UserInfo API Headers**:
   - `Accept: application/vnd.github+json`
   - `X‑GitHub‑Api‑Version: 2022‑11‑28`

4. **Private email retrieval**:
   - If email from `/user` response is null
   - Automatically calls `/user/emails` endpoint
   - Prioritizes primary verified email address

5. **Unique user identifier**:
   - Uses GitHub `id` field instead of standard OIDC `sub`

#### Retrieved User Fields
VODTV fetches these properties from GitHub API:
‑ `id`: Numeric unique user identifier for account linking
‑ `login`: GitHub username
‑ `name`: User display name
‑ `email`: Email address (auto‑retrieved for private emails)
‑ `avatar_url`: User avatar image

> 📝 Privacy note: When user email is not public on GitHub profile, VODTV fetches primary verified email via `/user/emails` endpoint (requires `user:email` scope).

### References
‑ [Creating an OAuth app ‑ GitHub Docs](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
‑ [Authorizing OAuth apps ‑ GitHub Docs](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
‑ [Setting up Github OAuth 2.0](https://apidog.com/blog/set-up-github-oauth2/)

---

## Facebook OAuth Setup

Facebook provides OAuth 2.0 authentication with a large global user‑base. VODTV contains dedicated compatibility adaptations for Facebook implementation.

### Step 1: Create Facebook Application

#### 1.1 Register as Facebook Developer
1. Navigate to [Facebook for Developers](https://developers.facebook.com/)
2. Log‑in with your Facebook account
3. Complete developer registration, accept terms and verify your identity if this is your first visit.

#### 1.2 Create New App
1. After logging in click top‑right **My Apps**
2. Click **Create App**
3. Select app type:
  ‑ Recommended: **Consumer** or **None**
4. Fill app details:
   - **App Name**: e.g. `VODTV`
   - **App Contact Email**: valid email address
   - **App Purpose**: **Yourself or your own business**
5. Click **Create App**

### Step 2: Retrieve App Credentials

#### 2.1 Locate App ID and App Secret
1. Enter your newly created app dashboard
2. From sidebar go to **Settings** → **Basic**
3. You can view:
  ‑ **App ID** (this is your Client ID)
  ‑ **App Secret** click **Show** to reveal value (Client Secret)

> ⚠️ Important note:
> App Secret functions as a password. Do not expose it publicly. Copy it immediately. Regenerate in developer dashboard if leaked.

### Step 3: Add Facebook Login Product
1. Inside app dashboard sidebar click **Add Product**
2. Locate **Facebook Login**
3. Press **Set Up**

### Step 4: Configure OAuth Redirect URI
1. Sidebar → **Facebook Login** → **Settings**
2. Find **Valid OAuth Redirect URIs**
3. Add your callback address:
```

shturl.cc/dTTnmQ59tLdtTqX5699pH6S4OLIDwBDtf5Gu

```
Examples:
‑ Production: `https://VODTV.example.com/api/auth/oidc/callback`
‑ Local testing via ngrok: `https://abc123.ngrok.io/api/auth/oidc/callback`
4. Click **Save Changes**

> ⚠️ Note: Facebook mandates HTTPS protocol for redirect URIs (use ngrok for local testing).

### Step 5: Publish Application
Facebook apps start in **Development mode**, accessible only for app admins and designated test‑users.

#### Switch to Live production mode
1. Find the mode toggle switch at top of app dashboard
2. Current state shows "In development"
3. Toggle switch to enable **Live**
4. Confirm publish operation

> 💡 Tip: Before going live you may configure app icon and privacy policy URL, not strictly mandatory but improves user trust.

### Facebook OAuth Endpoints
Facebook OAuth 2.0 endpoint addresses:
```

Authorization Endpoint: [https://www.facebook.com/v24.0/dialog/oauth](https://www.facebook.com/v24.0/dialog/oauth)
Token Endpoint:         [https://graph.facebook.com/v24.0/oauth/access_token](https://graph.facebook.com/v24.0/oauth/access_token)
UserInfo Endpoint:      [https://graph.facebook.com/v24.0/me](https://graph.facebook.com/v24.0/me)

```

Version note:
‑ This example uses `v24.0` (2025 current version)
‑ Facebook periodically releases new Graph API versions, review changelog page
‑ Older API versions remain valid for minimum 2 years after release

### VODTV Backend Configuration (Facebook)
Inside VODTV admin dashboard → **System Settings** → **OIDC Authentication Configuration**:

Click **Add Provider** and fill values:

| Field | Value | Remarks |
|---|---|---|
| **Provider ID** | `facebook` | ⚠️ **MUST be lowercase `facebook`** to render Facebook logo button |
| **Enabled** | ✅ Checked | Activate this provider |
| **Button Text** | `Sign in with Facebook` | Optional, leave blank for default |
| **Allow Registration** | ✅ Checked (optional) | Permit new account creation via Facebook |
| **Issuer URL** | `https://www.facebook.com` | Facebook issuer |
| **Authorization Endpoint** | `https://www.facebook.com/v24.0/dialog/oauth` | Authorization URL |
| **Token Endpoint** | `https://graph.facebook.com/v24.0/oauth/access_token` | Token URL |
| **UserInfo Endpoint** | `https://graph.facebook.com/v24.0/me` | User profile endpoint |
| **Client ID** | Your App ID | Retrieved from Facebook developer console |
| **Client Secret** | Your App Secret | Retrieved from Facebook developer console |

#### Full JSON configuration example
```json
{
  "id": "facebook",
  "enabled": true,
  "buttonText": "Sign in with Facebook",
  "enableRegistration": true,
  "issuer": "https://www.facebook.com",
  "authorizationEndpoint": "https://www.facebook.com/v24.0/dialog/oauth",
  "tokenEndpoint": "https://graph.facebook.com/v24.0/oauth/access_token",
  "userInfoEndpoint": "https://graph.facebook.com/v24.0/me",
  "clientId": "1234567890123456",
  "clientSecret": "abcdef1234567890abcdef1234567890"
}
```

After saving, login page renders blue **Sign in with Facebook** button including official Facebook logo.

### Technical Implementation Notes

#### Facebook OAuth vs Standard OIDC Differences

VODTV internally handles these incompatibilities automatically:

表格

| Difference Item | Standard OIDC | Facebook OAuth | VODTV Handling |
| --- | --- | --- | --- |
| **Unique user identifier** | `sub` field | `id` field | ✅ Auto compatibility |
| **ID Token** | Returns `id_token` | Not guaranteed | ✅ Adapted |
| **UserInfo fields** | Returns basic fields automatically | Requires explicit `fields` parameter | ✅ Parameter appended automatically |

#### Retrieved User Information

VODTV obtains following fields:
‑ `id`: Unique identifier for account binding
‑ `name`: User full name
‑ `email`: Email (if user grants sharing permission)
‑ `picture`: Avatar image (640×640 px)

> 
> 📝 Note: Facebook users can deny sharing email address. VODTV uses `id` as primary unique identifier, email is not mandatory.

### FAQ for Facebook

#### Q1: After clicking login you get `redirect_uri_mismatch` error

**Cause**: Redirect URI mismatch
**Resolution**:

1. Verify "Valid OAuth Redirect URIs" value in Facebook developer dashboard exactly matches your domain
2. Confirm HTTPS protocol is used
3. Path must strictly equal `/api/auth/oidc/callback` (no trailing slash)
4. Domain letter case must match completely

#### Q2: Error message "App Not Set Up"

**Cause**: Facebook Login product is missing or misconfigured
**Resolution**:

1. Ensure you added the **Facebook Login** product to your application
2. Verify OAuth redirect URI is saved
3. Switch app status to **Live** for external user access

#### Q3: Login button displays generic "Sign in with OIDC" instead of Facebook logo

**Cause**: Wrong Provider‑ID setting
**Resolution**:

1. Double‑check Provider ID field in VODTV backend
2. It **must be lowercase `facebook`**, not `Facebook` / `fb`
3. Save configuration and refresh login page

#### Q4: "Failed to fetch user info" error

**Cause**: Wrong UserInfo Endpoint or insufficient permissions
**Resolution**:

1. Confirm UserInfo Endpoint URL
2. Inspect server log for detailed error messages
3. Validate App ID and App Secret correctness

#### Q5: How to test locally during development?

**Option1: ngrok (recommended)**

```
ngrok http 3000
```

Use the generated HTTPS ngrok address for redirect URI configuration.

**Option2: Test‑user accounts**

1. Inside Facebook app dashboard open **Roles** → **Test Users**
2. Create test user accounts
3. Keep app in Development mode and sign‑in with those test accounts.

#### Q6: Cannot retrieve user email after Facebook login?

**Explanation**:
Facebook users are allowed to refuse sharing email. VODTV relies on Facebook numeric user‑id for binding, email is not enforced. You may prompt user to supply email on first registration.

#### Q7: How to upgrade Graph‑API version?

1. Visit Facebook Graph‑API changelog page
2. Get latest version string e.g. `v20.0`
3. Update version number embedded in endpoint URLs in VODTV settings:

```
https://www.facebook.com/v20.0/dialog/oauth
https://graph.facebook.com/v20.0/oauth/access_token
https://graph.facebook.com/v20.0/me
```

### References

‑ https://developers.facebook.com/docs/
‑ https://developers.facebook.com/docs/facebook-login/
‑ https://developers.facebook.com/docs/graph-api/
‑ [Set up Facebook login with OAuth 2](https://baserow.io/user-docs/configure-facebook-for-oauth-2-sso)
‑ [Facebook OAuth 2.0 Access for Website](https://apidog.com/blog/facebook-oauth-2-0-access-for-website/)

---

## WeChat Open Platform Setup

WeChat Open Platform provides website QR‑code login. End‑users scan QR‑code with WeChat to sign‑in.

### Step 1: Register WeChat Open Platform Account

1. Visit [WeChat Open Platform](https://open.weixin.qq.com/)
2. Sign‑in via WeChat QR scan
3. Complete developer qualification authentication

> 
> ⚠️ Important note: Developer qualification authentication (300 CNY per year) is required to create website‑apps.

### Step 2: Create Website Application

1. After logging in go to **Management Center**
2. Click **Website Application** → **Create Website Application**
3. Fill application details:
   - **Application Name**: `VODTV`
   - **Brief Introduction**: Short description of your service
   - **Official Website**: `shturl.cc/dt39XuvL9cvJZ`
   - **Application Icon**: Upload icon (108×108 px)
4. Fill **Authorized Callback Domain**:

```
shturl.cc/koSIF
```

⚠️ Important: Enter domain name only, do **not** include `https://` or path suffix.

5. Submit application for review, waiting time typically 1‑7 working days.

### Step 3: Retrieve AppID and AppSecret

After review approval:

1. Management Center → Website Applications
2. Open your newly created application
3. Obtain credentials:
‑ **AppID**: Unique application identifier
‑ **AppSecret**: Application secret (click reveal to view)

> 
> ⚠️ Security reminder: Keep AppSecret safe, do not leak.

### WeChat OAuth 2.0 Endpoints

Website QR‑login endpoints:

```
Authorization Endpoint: https://open.weixin.qq.com/connect/qrconnect
Token Endpoint:         https://api.weixin.qq.com/sns/oauth2/access_token
UserInfo Endpoint:      https://api.weixin.qq.com/sns/userinfo
```

**Special notes**:
‑ WeChat uses `appid` / `secret` parameter names instead of standard `client_id` / `client_secret`
‑ Scope is fixed as `snsapi_login` for website QR login
‑ VODTV automatically handles these parameter differences internally.

### VODTV Backend Configuration (WeChat)

VODTV Admin → System Settings → OIDC Authentication Configuration

Click **Add Provider** and fill:

表格

| Field | Value | Remarks |
| --- | --- | --- |
| **Provider ID** | `wechat` | ⚠️ Must be lowercase `wechat` to render WeChat logo button |
| **Enabled** | ✅ Checked | Activate provider |
| **Button Text** | `Sign in with WeChat` | Optional, blank uses default |
| **Allow Registration** | ✅ Checked (optional) | Allow new user registration via WeChat |
| **Issuer URL** | `https://open.weixin.qq.com` | WeChat issuer address |
| **Authorization Endpoint** | `https://open.weixin.qq.com/connect/qrconnect` | QR authorization endpoint |
| **Token Endpoint** | `https://api.weixin.qq.com/sns/oauth2/access_token` | Token endpoint |
| **UserInfo Endpoint** | `https://api.weixin.qq.com/sns/userinfo` | User info endpoint |
| **Client ID** | Your AppID | From WeChat open platform |
| **Client Secret** | Your AppSecret | From WeChat open platform |

#### JSON configuration sample

```
{
  "id": "wechat",
  "enabled": true,
  "buttonText": "Sign in with WeChat",
  "enableRegistration": true,
  "issuer": "https://open.weixin.qq.com",
  "authorizationEndpoint": "https://open.weixin.qq.com/connect/qrconnect",
  "tokenEndpoint": "https://api.weixin.qq.com/sns/oauth2/access_token",
  "userInfoEndpoint": "https://api.weixin.qq.com/sns/userinfo",
  "clientId": "wx1234567890abcdef",
  "clientSecret": "abcdef1234567890abcdef1234567890"
}
```

After saving login page renders green **Sign in with WeChat** button with official logo.

### Technical Implementation Notes

#### WeChat OAuth differences against standard OIDC

VODTV automatically adapts these differences:

表格

| Item | Standard OIDC | WeChat OAuth | VODTV Handling |
| --- | --- | --- | --- |
| Client‑ID parameter name | `client_id` | `appid` | ✅ Auto‑remap |
| Client‑Secret parameter name | `client_secret` | `secret` | ✅ Auto‑remap |
| OAuth Scope | `openid profile email` | `snsapi_login` | ✅ Hard‑coded scope |
| User unique identifier | `sub` | `openid` | ✅ Auto‑compatible |
| UserInfo auth method | Bearer Authorization header | URL params `access_token` + `openid` | ✅ Build query params automatically |

#### Retrieved User Fields

‑ `openid`: Unique identifier for account binding
‑ `nickname`: User nickname
‑ `headimgurl`: Avatar URL
‑ `sex`: Gender (1=male,2=female,0=unknown)
‑ `province`, `city`, `country`: Location metadata

> 
> 📝 Note: WeChat does not always return email address. `openid` is used as primary unique identifier.

### WeChat‑Specific FAQ

#### Q1: Error "redirect_uri parameter error"

**Cause**: Incorrect authorized callback domain setting
**Resolution**:

1. Review authorized callback domain setting on WeChat open‑platform website‑app page
2. Only domain name should be entered, no protocol or path
3. Domain name must exactly match production access domain.

#### Q2: After scanning QR‑code it says "Application is not online"

**Cause**: Application remains in development state
**Resolution**:

1. Open WeChat Open Platform → Management Center → Website Application
2. Confirm status shows **Review passed**
3. During development you can use official WeChat test‑account feature.

#### Q3: Button shows generic "Sign in with OIDC" instead of WeChat logo

**Cause**: Wrong Provider‑ID
**Resolution**:

1. In VODTV settings confirm Provider ID = lowercase `wechat`
2. Not `WeChat` or `weixin`
3. Save config and refresh login page.

#### Q4: Local development testing

**Limitation**: WeChat does not accept plain [localhost](https://localhost) for callback domain.
**Recommended solution using ngrok**:

```
ngrok http 3000
```

Use generated temporary HTTPS ngrok domain as authorized callback domain inside WeChat Open Platform settings.

> 
> 💡 Note: Free ngrok resets domain after restart, you will need to re‑update WeChat platform settings every restart.

#### Q5: Is the developer authentication fee mandatory?

‑ Individual developer: Individual qualification available with feature limitations
‑ Enterprise deployment: Enterprise authentication (300 CNY/year) required for complete functionality
‑ Development testing: Official WeChat test‑accounts can be used for debugging.

#### Q6: How users revoke authorization

Users navigate WeChat app → Me → Settings → Privacy → Authorized management to revoke permissions for your application.

### References

‑ https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login

---

## Apple Sign In Setup

Sign in with Apple provides privacy‑friendly authentication for Apple ecosystem users, built upon standard OpenID‑Connect protocol.

### Step 1: Apple Developer Account

1. Visit [Apple Developer](https://developer.apple.com/)
2. Sign‑in using your Apple ID
3. Enroll in Apple Developer Program ($99/year individual, $299/year organization)

> 
> 💡 Note: Paid Apple Developer Program subscription is required to enable Sign‑in with Apple for web usage.

### Step 2: Create App ID

1. Open [Apple Developer Portal](https://developer.apple.com/account/)
2. Go to **Certificates, Identifiers & Profiles**
3. Select **Identifiers** → click **+** to create new identifier
4. Choose **App IDs** → **Continue**
5. Identifier type: **App**
6. Fill:
   - **Description**: `VODTV App`
   - **Bundle ID**: `com.yourcompany.VODTV`
7. Under Capabilities tick **Sign in with Apple**
8. Click **Continue** → **Register**

### Step 3: Create Services ID

1. Back to Identifiers page click **+** again
2. Choose **Services IDs** → **Continue**
3. Fill:
   - **Description**: `VODTV Web Login`
   - **Identifier**: `com.yourcompany.VODTV.web` (different string from App‑ID)
4. Check **Sign in with Apple**
5. Click **Configure**:
   - **Primary App ID**: Select previously created App‑ID
   - **Web Domain**: `your‑domain.com` (without https:// prefix)
   - **Return URLs**: `https://your‑domain.com/api/auth/oidc/callback`
6. Click **Save** → **Continue** → **Register**

> 
> 📝 Note: Services‑ID identifier value is your **Client ID**.

### Step 4: Generate Private Key for Client Secret

1. Navigate to **Keys** → click **+** new key
2. **Key Name**: `VODTV Sign in with Apple Key`
3. Check **Sign in with Apple** capability
4. Click **Configure**, pick your Primary App‑ID
5. Save → Continue → Register
6. **Download the .p8 private‑key file (⚠️ downloadable exactly once)**
7. Record your **Key ID** (10‑character string)

> 
> ⚠️ Critical reminder: Store .p8 securely, download link disappears permanently. Also note your account's **Team ID** visible on developer portal account page.

### Step 5: Generate dynamic Client Secret (JWT)

Apple Client‑Secret is a short‑lived JWT token with maximum lifetime of six months, regenerate before expiry.

#### Online generator (quick method)

‑ Third‑party tool repository: [Apple Client Secret Generator](https://github.com/LoginRadius/apple-client-secret-generator)
‑ Input parameters: Team ID, Client ID(Services‑ID), Key ID, contents of downloaded p8 key, expiry ≤180 days.

#### Node.js generation snippet for developers

```
const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync('AuthKey_XXXXXXXXXX.p8', 'utf8');

const token = jwt.sign({}, privateKey, {
  algorithm: 'ES256',
  expiresIn: '180d', // 6 months
  audience: 'https://appleid.apple.com',
  issuer: 'YOUR_TEAM_ID',
  subject: 'com.yourcompany.VODTV.web',
  keyid: 'YOUR_KEY_ID'
});

console.log(token);
```

> 
> ⏰ Reminder: Schedule calendar reminder to regenerate JWT before 6‑month expiry and update backend configuration.

### Apple Sign‑In Endpoints

Apple supports standard OIDC discovery document:

```
OIDC Discovery: https://appleid.apple.com/.well-known/openid-configuration
```

Manual fallback endpoint values:

```
Authorization Endpoint: https://appleid.apple.com/auth/authorize
Token Endpoint:         https://appleid.apple.com/auth/token
JWKS Endpoint:          https://appleid.apple.com/auth/keys
```

**Special notes**:
‑ Apple **does NOT expose a UserInfo Endpoint**
‑ All user profile data is embedded directly within returned `id_token` JWT
‑ User name and email fields are **only supplied during the very first authorization**
‑ VODTV automatically parses id_token payload.

### VODTV Backend Configuration (Apple)

Admin backend → System Settings → OIDC Authentication Configuration, click **Add Provider**

表格

| Field | Value | Remarks |
| --- | --- | --- |
| **Provider ID** | `apple` | ⚠️ Must be lowercase `apple` to render official logo button |
| **Enabled** | ✅ Checked | Activate provider |
| **Button Text** | `Sign in with Apple` | Optional, leave blank for default |
| **Allow Registration** | ✅ Checked (optional) | Allow new user registration |
| **Issuer URL** | `https://appleid.apple.com` | Apple issuer (supports auto‑discovery) |
| **Authorization Endpoint** | `https://appleid.apple.com/auth/authorize` | Auto‑filled during discovery |
| **Token Endpoint** | `https://appleid.apple.com/auth/token` | Auto‑filled during discovery |
| **JWKS URI** | `https://appleid.apple.com/auth/keys` | For id‑token signature validation |
| **Client ID** | `com.yourcompany.VODTV.web` | Your Services‑ID identifier |
| **Client Secret** | `eyJhbGc...` | Generated long JWT string |

#### JSON configuration example

```
{
  "id": "apple",
  "enabled": true,
  "buttonText": "Sign in with Apple",
  "enableRegistration": true,
  "issuer": "https://appleid.apple.com",
  "authorizationEndpoint": "https://appleid.apple.com/auth/authorize",
  "tokenEndpoint": "https://appleid.apple.com/auth/token",
  "userInfoEndpoint": "",
  "jwksUri": "https://appleid.apple.com/auth/keys",
  "clientId": "com.yourcompany.VODTV.web",
  "clientSecret": "eyJhbGciOiJFUzI1NiIsImtpZCI6IkFCQ0RFRjEyMzQifQ.eyJpc3MiOiJBQkMxMjM0NTY3IiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE2NTY1NDcyMDAsImF1ZCI6Imh0dHBzOi8vYXBwbGVpZC5hcHBsZS5jb20iLCJzdWIiOiJjb20ueW91cmNvbXBhbnkubHVuYXR2LndlYiJ9.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
}
```

After saving login page renders black official **Sign in with Apple** button.

### Technical Implementation Notes

#### Apple Sign‑In Special Properties

表格

| Feature | Standard OIDC | Apple Sign‑In | VODTV Handling |
| --- | --- | --- | --- |
| Client Secret | Static string | Dynamically generated JWT (max 6‑month lifetime) | ✅ Supports JWT client secret |
| UserInfo Endpoint | Provided | ❌ Not available | ✅ Parse profile fields from id_token |
| JWKS URI | Optional | ✅ Mandatory signature verification | ✅ Configurable JWKS URI |
| Response mode | Query GET params | form_post POST callback | ✅ Implements POST callback handler |
| User profile payload | Returned every login | Only first authorization returns name/email | ✅ Persist fields on first‑time registration |
| Email privacy mode | Real email always | Optional private relay email | ✅ Fully supports relay email addresses |

#### VODTV Adaptation Behaviour

1. **response_mode=form_post**:
Apple requires form‑POST callback, authorization response arrives via POST form‑data instead of URL query‑string. VODTV backend implements dedicated POST callback handler for Apple.
2. **id_token parsing**:
Since UserInfo endpoint does not exist, profile information is decoded directly from JWT payload.
3. **First‑login one‑shot profile data**:
Full name and email payload are sent **only once on initial user consent**. Subsequent logins only deliver `sub` user identifier. VODTV persists profile fields on first‑time registration.
4. **JWKS signature validation**:
Signature validation against Apple public keys from JWKS URI verifies authenticity of id‑token payload.

#### Retrieved User Fields from id_token

‑ `sub`: Stable unique user identifier for account linking
‑ `email`: User email address (may be Apple private relay address `xxx@privaterelay.appleid.com`)
‑ `email_verified`: Boolean flag confirming email validation status

> 
> 📝 Privacy relay note: End‑users can opt‑out of sharing real mailbox address, Apple generates relay forwarding email address for your application.

### Apple‑Specific FAQ

#### Q1: Client‑Secret JWT expired

‑ JWT maximum lifetime is six months
‑ Regenerate new JWT using same p8 private‑key before expiry
‑ Update Client‑Secret field in VODTV admin backend
‑ Set calendar reminder for renewal.

#### Q2: Local development testing

‑ Apple enforces HTTPS with valid public domain, [localhost](https://localhost) is not accepted
‑ Recommended workaround: ngrok

```
ngrok http 3000
```

‑ Register temporary ngrok HTTPS domain as Web Domain and Return‑URL value in Apple Developer Portal for testing.
‑ Free ngrok changes domain on restart requiring developer portal settings update every restart.

#### Q3: `invalid_client` error

‑ Root cause: malformed or expired JWT Client‑Secret
‑ Double‑check Team‑ID, Client‑ID, Key‑ID inputs used for JWT generation
‑ Regenerate fresh JWT token and update backend configuration.

#### Q4: No email value retrieved after login

‑ User selected private relay option or email payload only present on first consent
‑ VODTV uses `sub` identifier for binding, email is not mandatory. You can prompt user to supply email manually on first registration screen.

#### Q5: How to reset first‑time authorization consent for testing

1. Open [appleid.apple.com](https://appleid.apple.com/)
2. Navigate **Security** → **Apps Using Your Apple ID**
3. Revoke your application entry
4. Next login will trigger fresh first‑time consent dialog again.

#### Q6: Lost downloaded .p8 private‑key file

‑ Private‑key download link is one‑time only and cannot be recovered
‑ Create a brand‑new key entry in Apple Developer Portal
‑ Generate new JWT Client‑Secret and update VODTV backend configuration.

### References

‑ [Apple Sign In official documentation](https://developer.apple.com/sign-in-with-apple/)
‑ [Configure Sign in with Apple for the web](https://developer.apple.com/help/account/capabilities/configure-sign-in-with-apple-for-the-web)
‑ [Creating a Client Secret](https://developer.apple.com/documentation/accountorganizationaldatasharing/creating-a-client-secret)
‑ [Apple OAuth & OIDC endpoints](https://logto.io/oauth-providers-explorer/apple)

---

## LinuxDo Setup

LinuxDo is a Chinese Discourse‑based technical forum community providing OAuth2 authentication service called LinuxDo Connect for third‑party application login.

### Step 1: Register OAuth2 Application

1. Navigate to LinuxDo Connect application registration page:

```
https://connect.linux.do/dash/sso/new
```

2. Log‑in with your LinuxDo forum account
3. Complete registration form:

表格

| Field | Explanation | Example |
| --- | --- | --- |
| **Client Name** | Application display name | `VODTV Media Platform` |
| **Client URI** | Official homepage URL | `shturl.cc/dt39XuvL9cvJZ` |
| **Redirect URI** | Callback address (exact string match required) | `shturl.cc/dTTnmQ59tLdtTqX5699pH6S4OLIDwBDtf5Gu` |
| **Logo URI** | Application logo URL (optional) | `shturl.cc/dt39XuvL9cvJZ/logo.png` |
| **TOS URI** | Terms‑of‑service page (optional) | `shturl.cc/VQ7y3HQ2b3UVhPQbF2x` |
| **Policy URI** | Privacy policy page (optional) | `shturl.cc/qLb4ajGa4chET5rimOGjv` |
| **Software ID** | Software identifier (optional) | `com.yourcompany.VODTV` |
| **Software Version** | Application version string (optional) | `1.0.0` |

4. Submit form, application will go through manual review.

### Step 2: Retrieve Credentials

After review approval you receive:
‑ **Client ID**: Unique application identifier
‑ **Client Secret**: Application secret key, store securely.

⚠️ Security note: If secret leaks delete application and register a new one immediately.

### LinuxDo Connect OAuth2 Endpoints

Primary domain (recommended):

```
Authorization Endpoint: https://connect.linux.do/oauth2/authorize
Token Endpoint:         https://connect.linux.do/oauth2/token
UserInfo Endpoint:      https://connect.linux.do/api/user
```

Fallback alternate domain:

```
Authorization Endpoint: https://connect.linuxdo.org/oauth2/authorize
Token Endpoint:         https://connect.linuxdo.org/oauth2/token
UserInfo Endpoint:      https://connect.linuxdo.org/api/user
```

### Technical Implementation Notes

#### 1. Token request authentication method

LinuxDo Connect enforces **HTTP Basic Authentication** on token endpoint requests:

```
POST /oauth2/token HTTP/1.1
Host: connect.linux.do
Content‑Type: application/x‑www‑form‑urlencoded
Authorization: Basic <Base64(ClientId:ClientSecret)>

grant_type=authorization_code&code=xxx&redirect_uri=https://your‑domain.com/api/auth/oidc/callback
```

Base64 encoding logic:

```
const credentials = `${clientId}:${clientSecret}`;
const base64Credentials = Buffer.from(credentials).toString('base64');
const authHeader = `Basic ${base64Credentials}`;
```

#### 2. UserInfo Response JSON Schema

Sample returned payload:

```
{
  "id": 12345,
  "username": "johndoe",
  "name": "John Doe",
  "active": true,
  "trust_level": 2,
  "silenced": false
}
```

Field description:
‑ `id`: Numeric unique user identifier on LinuxDo
‑ `username`: Forum account username
‑ `name`: Public display name
‑ `active`: Boolean flag if user account is activated
‑ `trust_level`: Discourse trust‑level integer value 0‑4
‑ `silenced`: Boolean muted status flag

### Trust‑Level Explanation

LinuxDo inherits Discourse Trust‑Level system (TL0‑TL4) for user privilege grading:

表格

| Level | Name | Acquisition Condition | Behaviour |
| --- | --- | --- | --- |
| **TL0** | New User | Freshly registered account | Restricted permissions, spam prevention |
| **TL1** | Basic User | Reading topics and minimum site time | Normal posting permissions unlocked |
| **TL2** | Member | Continuous forum activity and receiving likes | Additional upload privileges |
| **TL3** | Senior Member | Long‑term high‑quality participation | Moderate re‑categorization permissions |
| **TL4** | Leader | Manually granted by forum administrators | Near‑moderator privileges |

**VODTV backend setting: minimum trust‑level (`minTrustLevel`)**
‑ `0`: No trust‑level filtering, all LinuxDo users can log‑in
‑ `1`: Only TL1+ users allowed (minimum activity requirement)
‑ `2`: Only TL2+ users allowed (**recommended**, filter low‑activity spam accounts)
‑ `3` / `4`: Restrict login exclusively to senior forum members (closed beta / invite‑only scenario)

⚠️ If value is `0`, trust‑level validation check is skipped entirely.

### VODTV Backend Configuration Example for LinuxDo

Inside VODTV admin OIDC settings page:

```
✅ Enable OIDC login
✅ Enable OIDC registration

Issuer URL:              leave blank (auto‑discovery unsupported)
Authorization Endpoint:  https://connect.linux.do/oauth2/authorize
Token Endpoint:          https://connect.linux.do/oauth2/token
UserInfo Endpoint:       https://connect.linux.do/api/user
Client ID:               your‑client‑id‑here
Client Secret:           your‑client‑secret‑here
Login button text:       Sign in with LinuxDo account
Minimum trust level:     2
```

### LinuxDo‑Specific FAQ

**Q1: My application status remains "Pending review"**
A: LinuxDo Connect applications require manual administrator review, normally finished within 1‑3 working days. You may send private message to forum admins for progress inquiry.

**Q2: Token POST request returns HTTP 401 Unauthorized**
A: Troubleshooting checklist:
‑ Verify Client‑ID and Client‑Secret correctness
‑ Confirm HTTP Basic Auth Base64 encoding is correctly implemented
‑ The Redirect URI value must match exactly what was registered on LinuxDo Connect page (case‑sensitive, full string match).

**Q3: Login rejected with message "Trust‑level requirement not satisfied"**
A: The logged‑in user's forum trust_level value is lower than your configured `minTrustLevel`.
‑ Lower the minimum trust‑level threshold in backend settings;
‑ Or advise user to become more active on LinuxDo forum to raise trust‑level.

**Q4: How can I debug OAuth workflow locally?**
A: Debugging suggestions:
‑ Use Postman / curl to manually test each OAuth endpoint
‑ Inspect browser developer‑tool network trace
‑ Review VODTV application server log entries for OIDC‑related error traces.

### References

‑ [LinuxDo Connect documentation](https://connect.linux.do/docs)
‑ [LinuxDo OAuth beginner tutorial](https://linux.do/t/topic/30578)
‑ [Discourse Trust‑Levels official blog article](https://blog.discourse.org/2018/06/understanding-discourse-trust-levels/)

---

## VODTV Admin Panel Configuration

### Navigate to OIDC Configuration Page

1. Log‑in to VODTV admin backend: `https://your‑domain.com/admin`
2. Scroll down to section labelled **OIDC Login Configuration**
3. Expand configuration card to edit settings

### Configuration Field Explanation

#### 1. Global Base Settings

表格

| Option | Explanation | Example |
| --- | --- | --- |
| **Enable OIDC Login** | Master toggle for whole OIDC subsystem | On |
| **Enable OIDC Registration** | Allow new local user accounts to be created automatically after external OIDC authentication | On (recommended) |
| **Login Button Text** | Label displayed on login‑page button | `Sign in with Google` |

#### 2. OIDC Provider Metadata

表格

| Field | Explanation | Where to obtain |
| --- | --- | --- |
| **Issuer URL** | Base identity‑provider URL for auto‑discovery | Refer per‑provider setup sections |
| **Client ID** | Unique application identifier | Created at identity‑provider developer console |
| **Client Secret** | Application secret key (confidential) | Generated within identity‑provider developer console |

#### 3. Endpoint Configuration

**Option A: Auto‑discovery (Recommended)**
‑ Fill out only **Issuer URL**. System fetches remaining endpoint addresses automatically from `{issuer}/.well‑known/openid‑configuration`.
‑ ✅ Supported: Google, Microsoft
‑ ❌ Not supported: GitHub (manual endpoint entry required)

**Option B: Manual Endpoint Entry**
Use manual entry if auto‑discovery fails or provider does not publish discovery document.

表格

| Endpoint | Explanation |
| --- | --- |
| **Authorization Endpoint** | User browser redirect URL for granting application permissions |
| **Token Endpoint** | Backend‑to‑backend API endpoint used to exchange authorization‑code for access‑token |
| **UserInfo Endpoint** | API endpoint for fetching authenticated user profile information |

#### 4. LinuxDo‑Exclusive Setting

表格

| Setting | Explanation | Recommended Value |
| --- | --- | --- |
| **Minimum Trust Level** | Enforce minimum Discourse trust‑level requirement for LinuxDo logins | `0` (no restriction) or `2` (spam‑filtering) |

‑ Value `0`: All LinuxDo accounts permitted
‑ Value `2`: Restrict login to TL2+ active forum users

### Configuration Examples

#### Google Example

```
Enable OIDC login: ✅
Enable OIDC registration: ✅
Login button text: Sign in with Google account

Issuer URL: https://accounts.google.com
Client ID: 123456789‑abcdefg.apps.googleusercontent.com
Client Secret: GOCSPX‑xxxxxxxxxxxxxx

Authorization Endpoint: (leave blank, auto‑discovery)
Token Endpoint: (leave blank, auto‑discovery)
UserInfo Endpoint: (leave blank, auto‑discovery)
```

#### Microsoft Example

```
Enable OIDC login: ✅
Enable OIDC registration: ✅
Login button text: Sign in with Microsoft account

Issuer URL: https://login.microsoftonline.com/common/v2.0
Client ID: 12345678‑1234‑1234‑1234‑123456789abc
Client Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxx

Authorization Endpoint: (leave blank, auto‑discovery)
Token Endpoint: (leave blank, auto‑discovery)
UserInfo Endpoint: (leave blank, auto‑discovery)
```

#### GitHub Example

```
Enable OIDC login: ✅
Enable OIDC registration: ✅
Login button text: Sign in with GitHub account

Issuer URL: (leave blank, GitHub discovery unsupported)
Client ID: Iv1.1234567890abcdef
Client Secret: 1234567890abcdef1234567890abcdef12345678

Authorization Endpoint: https://github.com/login/oauth/authorize
Token Endpoint:         https://github.com/login/oauth/access_token
UserInfo Endpoint:      https://api.github.com/user
```

#### Facebook Example

```
Provider ID: facebook
Enabled: ✅
Allow registration: ✅
Button text: Sign in with Facebook

Issuer URL: https://www.facebook.com
Client ID: 1234567890123456
Client Secret: abcdef1234567890abcdef1234567890

Authorization Endpoint: https://www.facebook.com/v19.0/dialog/oauth
Token Endpoint: https://graph.facebook.com/v19.0/oauth/access_token
UserInfo Endpoint: https://graph.facebook.com/v19.0/me
```

> 
> ⚠️ Important note: Provider‑ID must be lowercase string `facebook` for branded logo button rendering.

#### LinuxDo Example

```
Enable OIDC login: ✅
Enable OIDC registration: ✅
Login button text: Sign in with LinuxDo account

Issuer URL: leave blank (auto‑discovery unsupported)
Client ID: xxxxxxxxxx
Client Secret: xxxxxxxxxx

Authorization Endpoint: https://connect.linux.do/oauth2/authorize
Token Endpoint:         https://connect.linux.do/oauth2/token
UserInfo Endpoint:      https://connect.linux.do/api/user

Minimum trust level: 2
```

---

## Frequently Asked Questions

### Q1: OIDC login fails with `redirect_uri_mismatch` error

**Cause**: Callback Redirect URI mismatch between identity‑provider settings and VODTV actual URL.

**Troubleshooting steps**:

1. Confirm actual VODTV visiting address including protocol, domain and port
2. Ensure redirect URI registered on identity‑provider backend is exactly identical
3. Common pitfalls:
   - `http://localhost:3000` ≠ `http://127.0.0.1:3000`
   - `https://example.com` ≠ `https://www.example.com`
   - Trailing slash difference: `/api/auth/oidc/callback` ✅ vs `/api/auth/oidc/callback/` ❌

### Q2: Error message
