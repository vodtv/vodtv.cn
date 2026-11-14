---
layout: page
title: 影视点播
description: 数据源来自网上公开的第三方接口，仅用于功能测试与学习。
heroIcon: 🎬
align: center
heroColor: info
heroSize: md
maxWidth: max-w-7xl
---

<ClientOnly>
<VodApiPlayer api="http://caiji.dyttzyapi.com/api.php/provide/vod" :use-proxy="true" :intro-sec="25" :outro-sec="40"/>
</ClientOnly>
