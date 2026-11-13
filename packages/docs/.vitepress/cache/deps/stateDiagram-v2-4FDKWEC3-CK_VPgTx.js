import { i as styles_default, n as stateDiagram_default, r as stateRenderer_v3_unified_default, t as StateDB } from "./chunk-DI55MBZ5-xk8CdPng.js";
import "./chunk-55IACEB6-DrpZd9Y4.js";
import "./chunk-QN33PNHL-BH0NOB4Y.js";
import "./chunk-N4CR4FBY-BbBXtLTy.js";
import "./chunk-QXUST7PY-D3BPj7_R.js";
import "./chunk-HN2XXSSU-B7YYKQam.js";
import "./chunk-JZLCHNYA-DImHnceW.js";
import "./chunk-CVBHYZKI-e8yBbzbU.js";
import "./chunk-ATLVNIR6-jEvfyXQi.js";
import "./chunk-JA3XYJ7Z-BswxqsZx.js";
import "./chunk-S3R3BYOJ-cEvSc8CE.js";
import "./chunk-ABZYJK2D-DaRgM5H6.js";
import { B as __name } from "./src-DE2kHKEO.js";
// ../../node_modules/.pnpm/mermaid@11.12.2/node_modules/mermaid/dist/chunks/mermaid.core/stateDiagram-v2-4FDKWEC3.mjs
var diagram = {
	parser: stateDiagram_default,
	get db() {
		return new StateDB(2);
	},
	renderer: stateRenderer_v3_unified_default,
	styles: styles_default,
	init: /* @__PURE__ */ __name((cnf) => {
		if (!cnf.state) cnf.state = {};
		cnf.state.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
	}, "init")
};
export { diagram };
