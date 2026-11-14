---
layout: page
title: Video On Demand
description: Data sources are from public third-party APIs on the Internet, for functional testing and learning only.
heroIcon: 🎬
align: center
heroColor: info
heroSize: md
maxWidth: max-w-7xl
---

<ClientOnly>
<VodApiPlayer api="http://caiji.dyttzyapi.com/api.php/provide/vod" :use-proxy="true" :intro-sec="25" :outro-sec="40"/>
</ClientOnly>
