import { B as __name } from "./src-DE2kHKEO.js";
// ../../node_modules/.pnpm/mermaid@11.12.2/node_modules/mermaid/dist/chunks/mermaid.core/chunk-CVBHYZKI.mjs
var getSubGraphTitleMargins = /* @__PURE__ */ __name(({ flowchart }) => {
	const subGraphTitleTopMargin = flowchart?.subGraphTitleMargin?.top ?? 0;
	const subGraphTitleBottomMargin = flowchart?.subGraphTitleMargin?.bottom ?? 0;
	return {
		subGraphTitleTopMargin,
		subGraphTitleBottomMargin,
		subGraphTitleTotalMargin: subGraphTitleTopMargin + subGraphTitleBottomMargin
	};
}, "getSubGraphTitleMargins");
export { getSubGraphTitleMargins as t };
