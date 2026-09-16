## 🔐 Security & Privacy Reminders

### ⚠️ Important Security Recommendations

1. **Set a strong password**: Use a complex `PASSWORD` environment variable
2. **Disable public registration**: Turn‑off user registration in the admin dashboard
3. **For personal use only**: Do not publicly share or distribute your instance URL
4. **Comply with local laws**: Ensure your usage complies with applicable local laws and regulations
5. **SSRF protection**: Keep SSRF protection enabled for public deployments (default setting). You may disable it on private NAS / intranet deployments as‑needed.

### 🛡️ SSRF Protection Explanation

This project enables SSRF (Server‑Side Request Forgery) protection by default to block proxy access to internal‑network resources.

**Blocked address ranges:**
‑ Private LAN IPs: `10.x.x.x`, `192.168.x.x`, `172.16‑31.x.x`
‑ Local addresses: `127.0.0.1`, `localhost`
‑ Link‑local addresses: `169.254.x.x`
‑ Cloud metadata endpoints: `metadata.google.internal`

**When you need to disable SSRF protection:**
If you deploy on a **NAS, home server or intranet environment**, and your video sources / images / CMS APIs reside on private‑network addresses, set the environment variable:

```
DISABLE_SSRF_PROTECTION=true
```

**⚠️ Security Warning:**
‑ Disabling SSRF protection permits the proxy to reach internal‑network resources.
‑ **Only for private deployments** (NAS, home LAN, corporate intranet).
‑ **Strongly keep it enabled for public deployments**, otherwise attackers may abuse the proxy to reach internal services.
‑ If unsure, stick with the default (protection turned on).

**Typical deployment scenarios:**
‑ ✅ Public VPS / cloud server → keep SSRF protection enabled (default)
‑ ✅ Vercel / Netlify and similar platforms → keep SSRF protection enabled (default)
‑ ⚠️ NAS (Synology/QNAP) Docker deployment → disable only if your video sources are located on your LAN
‑ ⚠️ Home server → disable only when accessing local‑area network resources

### 📋 Disclaimer

‑ This project is for learning and personal‑use purposes only.
‑ Do not use it commercially or run it as a public service.
‑ All content originates from third‑party websites; no video assets are stored on this service.
‑ You are fully legally responsible for any issues caused by public sharing of your instance.
‑ Project developers accept no legal liability for how end‑users operate this software.
‑ **This project is not intended for service within mainland China.** Any legal risks arising from usage inside that region fall solely on the end‑user and are unrelated to the project authors.
