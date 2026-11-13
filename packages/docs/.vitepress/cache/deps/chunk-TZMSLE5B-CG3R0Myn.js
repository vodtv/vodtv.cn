import { k as lineBreakRegex } from "./chunk-ABZYJK2D-DaRgM5H6.js";
import { B as __name } from "./src-DE2kHKEO.js";
import { t as e } from "./sanitize-url-BcqO16k2.js";
// ../../node_modules/.pnpm/mermaid@11.12.2/node_modules/mermaid/dist/chunks/mermaid.core/chunk-TZMSLE5B.mjs
var drawRect = /* @__PURE__ */ __name((element, rectData) => {
	const rectElement = element.append("rect");
	rectElement.attr("x", rectData.x);
	rectElement.attr("y", rectData.y);
	rectElement.attr("fill", rectData.fill);
	rectElement.attr("stroke", rectData.stroke);
	rectElement.attr("width", rectData.width);
	rectElement.attr("height", rectData.height);
	if (rectData.name) rectElement.attr("name", rectData.name);
	if (rectData.rx) rectElement.attr("rx", rectData.rx);
	if (rectData.ry) rectElement.attr("ry", rectData.ry);
	if (rectData.attrs !== void 0) for (const attrKey in rectData.attrs) rectElement.attr(attrKey, rectData.attrs[attrKey]);
	if (rectData.class) rectElement.attr("class", rectData.class);
	return rectElement;
}, "drawRect");
var drawBackgroundRect = /* @__PURE__ */ __name((element, bounds) => {
	drawRect(element, {
		x: bounds.startx,
		y: bounds.starty,
		width: bounds.stopx - bounds.startx,
		height: bounds.stopy - bounds.starty,
		fill: bounds.fill,
		stroke: bounds.stroke,
		class: "rect"
	}).lower();
}, "drawBackgroundRect");
var drawText = /* @__PURE__ */ __name((element, textData) => {
	const nText = textData.text.replace(lineBreakRegex, " ");
	const textElem = element.append("text");
	textElem.attr("x", textData.x);
	textElem.attr("y", textData.y);
	textElem.attr("class", "legend");
	textElem.style("text-anchor", textData.anchor);
	if (textData.class) textElem.attr("class", textData.class);
	const tspan = textElem.append("tspan");
	tspan.attr("x", textData.x + textData.textMargin * 2);
	tspan.text(nText);
	return textElem;
}, "drawText");
var drawImage = /* @__PURE__ */ __name((elem, x, y, link) => {
	const imageElement = elem.append("image");
	imageElement.attr("x", x);
	imageElement.attr("y", y);
	const sanitizedLink = e(link);
	imageElement.attr("xlink:href", sanitizedLink);
}, "drawImage");
var drawEmbeddedImage = /* @__PURE__ */ __name((element, x, y, link) => {
	const imageElement = element.append("use");
	imageElement.attr("x", x);
	imageElement.attr("y", y);
	const sanitizedLink = e(link);
	imageElement.attr("xlink:href", `#${sanitizedLink}`);
}, "drawEmbeddedImage");
var getNoteRect = /* @__PURE__ */ __name(() => {
	return {
		x: 0,
		y: 0,
		width: 100,
		height: 100,
		fill: "#EDF2AE",
		stroke: "#666",
		anchor: "start",
		rx: 0,
		ry: 0
	};
}, "getNoteRect");
var getTextObj = /* @__PURE__ */ __name(() => {
	return {
		x: 0,
		y: 0,
		width: 100,
		height: 100,
		"text-anchor": "start",
		style: "#666",
		textMargin: 0,
		rx: 0,
		ry: 0,
		tspan: true
	};
}, "getTextObj");
export { drawText as a, drawRect as i, drawEmbeddedImage as n, getNoteRect as o, drawImage as r, getTextObj as s, drawBackgroundRect as t };
