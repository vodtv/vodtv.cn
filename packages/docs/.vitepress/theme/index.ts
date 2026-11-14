// 扩展默认主题
import Theme from "@vodtv/theme";
// 显式引入主题样式
import "@vodtv/theme/dist/index.css";

import VodApiPlayer from "./components/VodApiPlayer.vue";
import GitHubMirrorTable from "./components/GitHubMirrorTable.vue";

export default {
  ...Theme,

  enhanceApp(ctx: any) {
    const { app } = ctx;
    app.component("VodApiPlayer", VodApiPlayer);
    app.component("GitHubMirrorTable", GitHubMirrorTable);

    Theme.enhanceApp(ctx);
  },
};
