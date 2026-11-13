---
layout: changelog
title: GitHub Mirror List
description: GitHub acceleration mirror endpoints, auto-tested with real-time latency, download speed and connectivity status
heroIcon: ⚡
align: center
heroColor: primary
heroSize: md
---

# GitHub Acceleration Mirrors

> - This page lists available GitHub proxy endpoints, auto re-tested every 12 hours
> - Real-time connectivity, latency and download speed are displayed for every mirror; always pick ones marked as "OK" first
> - Test results vary by local network, they are for reference only — no endpoint is guaranteed to stay online forever.

## Mirror List

<GitHubMirrorTable />

### ⚡ How to Use

1.  Click **Copy** to grab the mirror prefix, and prepend it to any original GitHub URL to speed up downloads
2.  Only endpoints marked as "OK" can be copied; buttons for timed-out / unsupported endpoints are disabled
    - _Unsupported_: this proxy format does not work for GitHub acceleration
    - _Timeout_: your current network cannot reach this node, just pick another one
3.  All mirrors are public third-party services — save a few backup nodes, and switch to another one if any stops working.
