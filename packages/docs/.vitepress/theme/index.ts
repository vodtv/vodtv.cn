// 扩展默认主题
import Theme from "@vodtv/theme";
// 显式引入主题样式
import "@vodtv/theme/dist/index.css";

import GitHubMirrorTable from "./components/GitHubMirrorTable.vue";

export default {
  ...Theme,
  enhanceApp(ctx: any) {
    const { app } = ctx;

    app.component("GitHubMirrorTable", GitHubMirrorTable);

    Theme.enhanceApp(ctx);
  },
};
