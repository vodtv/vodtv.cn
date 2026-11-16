// 扩展默认主题
import Theme from "@vodtv/theme";
import { nextTick, onMounted } from "vue";
import "@vodtv/theme/dist/index.css";
import "./custom.css";
import { defineAsyncComponent } from "vue";
import type { EnhanceAppContext, inBrowser } from "vitepress";

export default {
  extends: Theme,
  enhanceApp(ctx: EnhanceAppContext) {
    const { app } = ctx;

    // 播放器异步懒加载
    const VodApiPlayer = defineAsyncComponent(() =>
      import("@vodtv/theme").then((m) => m.VodApiPlayer),
    );
    // GitHub镜像表格 异步懒加载
    const GitHubMirrorTable = defineAsyncComponent(() =>
      import("@vodtv/theme").then((m) => m.GitHubMirrorTable),
    );
    app.component("VodApiPlayer", VodApiPlayer);
    app.component("GitHubMirrorTable", GitHubMirrorTable);
  },
  setup() {
    onMounted(() => {
      setupExternalLinks();
    });
  },
};

function setupExternalLinks() {
  nextTick(() => {
    const navLinks = document.querySelectorAll(
      ".VPNavBarMenuLink, .VPNavBarMenuGroup",
    );
    navLinks.forEach((link) => {
      if (link.textContent?.includes("订阅")) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    });
  });
}
