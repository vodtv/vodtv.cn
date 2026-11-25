import { b as getConfig2 } from "./chunk-ABZYJK2D-DaRgM5H6.js";
import { B as __name, R as select_default } from "./src-DE2kHKEO.js";
// ../../node_modules/.pnpm/mermaid@11.12.2/node_modules/mermaid/dist/chunks/mermaid.core/chunk-EXTU4WIE.mjs
var selectSvgElement = /* @__PURE__ */ __name((id) => {
	const { securityLevel } = getConfig2();
	let root = select_default("body");
	if (securityLevel === "sandbox") {
		const doc = select_default(`#i${id}`).node()?.contentDocument ?? document;
		root = select_default(doc.body);
	}
	return root.select(`#${id}`);
}, "selectSvgElement");
export { selectSvgElement as t };
