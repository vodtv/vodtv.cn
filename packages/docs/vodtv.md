---
layout: page
title: 影视点播
description: 本站不存储、不制作任何视频内容，仅用公开的数据检测和优化项目。
heroIcon: 🎬
align: center
heroColor: info
heroSize: md
maxWidth: max-w-7xl
---

<ClientOnly>
  <VodApiPlayer api="http://caiji.dyttzyapi.com/api.php/provide/vod" proxyUrl="https://mconfig.viptv.work/?url=" :intro-sec="25" :outro-sec="40" old_pic_domain="img.dytt-tupian.com" new_pic_domain="img.dytt-tupian.com"/>
</ClientOnly>
