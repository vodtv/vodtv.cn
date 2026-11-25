import { a as positionEdgeLabel, i as markers_default, n as insertEdge, r as insertEdgeLabel } from "./chunk-QXUST7PY-D3BPj7_R.js";
import { a as insertNode, i as insertCluster, s as labelHelper } from "./chunk-JZLCHNYA-DImHnceW.js";
import { u as interpolateToCurve } from "./chunk-S3R3BYOJ-cEvSc8CE.js";
import { s as common_default, y as getConfig } from "./chunk-ABZYJK2D-DaRgM5H6.js";
import { B as __name, V as log } from "./src-DE2kHKEO.js";
// ../../node_modules/.pnpm/mermaid@11.12.2/node_modules/mermaid/dist/chunks/mermaid.core/chunk-N4CR4FBY.mjs
var internalHelpers = {
	common: common_default,
	getConfig,
	insertCluster,
	insertEdge,
	insertEdgeLabel,
	insertMarkers: markers_default,
	insertNode,
	interpolateToCurve,
	labelHelper,
	log,
	positionEdgeLabel
};
var layoutAlgorithms = {};
var registerLayoutLoaders = /* @__PURE__ */ __name((loaders) => {
	for (const loader of loaders) layoutAlgorithms[loader.name] = loader;
}, "registerLayoutLoaders");
(/* @__PURE__ */ __name(() => {
	registerLayoutLoaders([{
		name: "dagre",
		loader: /* @__PURE__ */ __name(async () => await import("./dagre-6UL2VRFP-5sxN6v9N.js"), "loader")
	}, ...[{
		name: "cose-bilkent",
		loader: /* @__PURE__ */ __name(async () => await import("./cose-bilkent-S5V4N54A-DKMyX2im.js"), "loader")
	}]]);
}, "registerDefaultLayoutLoaders"))();
var render = /* @__PURE__ */ __name(async (data4Layout, svg) => {
	if (!(data4Layout.layoutAlgorithm in layoutAlgorithms)) throw new Error(`Unknown layout algorithm: ${data4Layout.layoutAlgorithm}`);
	const layoutDefinition = layoutAlgorithms[data4Layout.layoutAlgorithm];
	return (await layoutDefinition.loader()).render(data4Layout, svg, internalHelpers, { algorithm: layoutDefinition.algorithm });
}, "render");
var getRegisteredLayoutAlgorithm = /* @__PURE__ */ __name((algorithm = "", { fallback = "dagre" } = {}) => {
	if (algorithm in layoutAlgorithms) return algorithm;
	if (fallback in layoutAlgorithms) {
		log.warn(`Layout algorithm ${algorithm} is not registered. Using ${fallback} as fallback.`);
		return fallback;
	}
	throw new Error(`Both layout algorithms ${algorithm} and ${fallback} are not registered.`);
}, "getRegisteredLayoutAlgorithm");
export { registerLayoutLoaders as n, render as r, getRegisteredLayoutAlgorithm as t };
