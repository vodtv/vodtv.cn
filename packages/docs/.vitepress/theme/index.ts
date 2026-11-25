// 扩展默认主题
import VPTheme from "@vodtv/theme";
import { inBrowser } from "vitepress";
import type { Theme } from "vitepress";
import { nextTick, onMounted, defineAsyncComponent } from "vue";
import "@vodtv/theme/dist/index.css";

export default {
  extends: VPTheme,
  enhanceApp({ app }) {
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
    if (inBrowser) {
      /* 纸屑 */
    }
  },
  setup() {
    onMounted(() => {
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
    });
  },
} satisfies Theme;
