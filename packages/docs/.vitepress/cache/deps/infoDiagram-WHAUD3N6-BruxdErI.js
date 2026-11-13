import { t as package_default } from "./chunk-XAJISQIX-Bfy4Ie3x.js";
import { t as selectSvgElement } from "./chunk-EXTU4WIE-DNlr9DpJ.js";
import { c as configureSvgSize } from "./chunk-ABZYJK2D-DaRgM5H6.js";
import { B as __name, V as log } from "./src-DE2kHKEO.js";
import { t as parse } from "./mermaid-parser.core-CTQ3Yfiv.js";
// ../../node_modules/.pnpm/mermaid@11.12.2/node_modules/mermaid/dist/chunks/mermaid.core/infoDiagram-WHAUD3N6.mjs
var parser = { parse: /* @__PURE__ */ __name(async (input) => {
	const ast = await parse("info", input);
	log.debug(ast);
}, "parse") };
var DEFAULT_INFO_DB = { version: package_default.version + "" };
var diagram = {
	parser,
	db: { getVersion: /* @__PURE__ */ __name(() => DEFAULT_INFO_DB.version, "getVersion") },
	renderer: { draw: /* @__PURE__ */ __name((text, id, version) => {
		log.debug("rendering info diagram\n" + text);
		const svg = selectSvgElement(id);
		configureSvgSize(svg, 100, 400, true);
		svg.append("g").append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${version}`);
	}, "draw") }
};
export { diagram };
