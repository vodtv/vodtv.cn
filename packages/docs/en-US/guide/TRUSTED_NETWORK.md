# Trusted Network Mode
Trusted Network Mode allows devices from specified IP ranges to skip login authentication and automatically gain owner privileges. This feature is designed specifically for **intranet‑only deployments**.

## Applicable Scenarios
‑ Home intranet deployment: allow all your household devices to access without logging in
‑ Corporate / school intranet deployment: intranet users do not need to sign‑in
‑ Local Docker deployment: direct access from the host machine
‑ NAS / soft‑router deployment: LAN devices bypass authentication

## Security Warning
> **WARNING: Never add public‑facing IP addresses to your trusted list!**
>
> Devices inside trusted networks automatically receive full **owner privileges**. They can access every feature including the admin dashboard without any password.
>
> Only add trusted private intranet CIDR ranges such as `192.168.0.0/16`, `10.0.0.0/8`.

## Configuration Methods
### Method 1: Environment Variable (Recommended)
Set the `TRUSTED_NETWORK_IPS` environment variable. Separate multiple IPs / CIDRs with commas:
```bash
# Trust entire class‑C private subnet (192.168.x.x)
TRUSTED_NETWORK_IPS=192.168.0.0/16
# Trust multiple network ranges
TRUSTED_NETWORK_IPS=192.168.0.0/16,10.0.0.0/8,172.16.0.0/12
# Trust a specific IP plus subnet
TRUSTED_NETWORK_IPS=192.168.1.100,10.0.0.0/8
```

**Docker Compose example:**
```yaml
services:
  VODTV:
    image: ghcr.io/szemeng76/VODTV:latest
    environment:
      - PASSWORD=your_password
      - TRUSTED_NETWORK_IPS=192.168.0.0/16,172.17.0.0/16
```

**Vercel environment variable:**
Add environment variable `TRUSTED_NETWORK_IPS` inside your Vercel project settings.

### Method 2: Admin Dashboard Configuration
1. Log into the admin dashboard with owner credentials
2. Locate the "Trusted Network Configuration" panel
3. Toggle the enable switch
4. Add trusted IP addresses or CIDR entries
5. Save changes (takes effect immediately)

> Note: Environment variable configuration takes higher priority over database‑stored settings.

## Common Private Intranet CIDR List
| CIDR | Range | Description |
|---|---|---|
| `10.0.0.0/8` | 10.0.0.0‑10.255.255.255 | Class‑A private network (large enterprises) |
| `172.16.0.0/12` | 172.16.0.0‑172.31.255.255 | Class‑B private network (mid‑size enterprises) |
| `192.168.0.0/16` | 192.168.0.0‑192.168.255.255 | Class‑C private network (home / small office) |
| `127.0.0.1` | 127.0.0.1 | Local loopback IPv4 |
| `172.17.0.0/16` | 172.17.0.0‑172.17.255.255 | Default Docker bridge subnet |
| `::1` | ::1 | Local loopback IPv6 |

## Supported Formats
‑ Single IPv4 address: `192.168.1.100`
‑ IPv4 CIDR notation: `192.168.0.0/16`, `10.0.0.0/8`
‑ Single IPv6 address: `2001:db8::1`
‑ IPv6 CIDR notation: `2001:db8::/32`
‑ Wildcard: `*` (trust all IP addresses, **strongly discouraged**)

## Working Principle
1. Incoming user request arrives → Middleware retrieves client IP
2. Check whether client IP matches any entry inside trusted list (CIDR matching supported)
3. If matched → automatically set authentication cookie and grant owner‑level permissions
4. If unmatched → fall back to normal login workflow

## FAQ
### Q: Changes do not take effect after configuration?
1. Verify environment variable values are set correctly
2. Database‑saved config applies right away; cookie version notifies middleware to refresh cache
3. Double‑check your IP / CIDR syntax
4. If issues persist, hard‑refresh your browser page

### Q: How can I check my local intranet IP?
**Windows:**
```cmd
ipconfig
```
**Linux/macOS:**
```bash
ip addr
# or
ifconfig
```

### Q: Running behind Cloudflare, client IP is detected incorrectly?
Middleware resolves visitor IP in this priority order:
1. `x‑forwarded‑for` request header (first IP value)
2. `x‑real‑ip` request header
3. `cf‑connecting‑ip` request header (Cloudflare)
Make sure your reverse proxy forwards these headers properly.

### Q: Can I use environment variable together with dashboard database config?
Yes, but the environment variable has **higher precedence**. Once `TRUSTED_NETWORK_IPS` environment variable exists, database‑saved settings are ignored.

### Q: Is IPv6 supported?
IPv6 addresses and CIDRs are supported. Due to IPv6 complexity, it is recommended to keep entries simple:
‑ `::1` (localhost loopback)
‑ `fe80::/10` (link‑local addresses)
‑ `2001:db8::/32` (documentation example)

## Recommended Presets
**Home user (router assigns 192.168.x.x):**
```bash
TRUSTED_NETWORK_IPS=192.168.0.0/16
```

**Docker deployment (trust host machine plus Docker internal network):**
```bash
TRUSTED_NETWORK_IPS=127.0.0.1,172.17.0.0/16,192.168.0.0/16
```

**NAS deployment (Synology / QNAP etc.):**
```bash
TRUSTED_NETWORK_IPS=192.168.0.0/16,10.0.0.0/8
```

**Pure intranet deployment (trust all RFC1918 private subnets):**
```bash
TRUSTED_NETWORK_IPS=10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
```

This is documentation for a web‑based backend feature, work task mode can help you generate related config UI snippets, would you like to use it?