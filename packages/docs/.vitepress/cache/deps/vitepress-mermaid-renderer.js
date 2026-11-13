import { Ft as onMounted, K as createCommentVNode, Kn as ref, Ot as nextTick, Q as createStaticVNode, U as computed, Vt as openBlock, W as createBaseVNode, a as createApp, ar as normalizeClass, cr as toDisplayString, et as createVNode, nr as unref, nt as defineComponent, pt as h, q as createElementBlock, sr as normalizeStyle, ut as getCurrentInstance, zt as onUnmounted } from "./vue.runtime.esm-bundler-BCr2HRhV.js";
import { t as package_default } from "./chunk-XAJISQIX-Bfy4Ie3x.js";
import { t as selectSvgElement } from "./chunk-EXTU4WIE-DNlr9DpJ.js";
import { n as load, t as JSON_SCHEMA } from "./chunk-MI3HLSF2-CiC7xwkb.js";
import { n as registerLayoutLoaders } from "./chunk-N4CR4FBY-BbBXtLTy.js";
import "./chunk-QXUST7PY-D3BPj7_R.js";
import "./chunk-HN2XXSSU-B7YYKQam.js";
import "./chunk-JZLCHNYA-DImHnceW.js";
import "./chunk-CVBHYZKI-e8yBbzbU.js";
import "./chunk-ATLVNIR6-jEvfyXQi.js";
import { i as registerIconPacks, s as dedent } from "./chunk-JA3XYJ7Z-BswxqsZx.js";
import { a as encodeEntities, d as isDetailedError, h as utils_default, i as decodeEntities, m as removeDirectives, r as cleanAndMerge } from "./chunk-S3R3BYOJ-cEvSc8CE.js";
import { J as themes_default, M as registerLazyLoadedDiagrams, P as reset, R as saveConfigFromInitialize, S as getDiagramLoader, V as setConfig, W as setSiteConfig, X as purify, Y as updateSiteConfig, c as configureSvgSize, f as detectType, g as frontMatterRegex, h as evaluate, j as registerDiagram, l as defaultConfig, n as addDirective, p as detectors, q as styles_default, r as assignWithDepth_default, t as UnknownDiagramError, w as getSiteConfig, x as getDiagram, y as getConfig } from "./chunk-ABZYJK2D-DaRgM5H6.js";
import { B as __name, H as setLogLevel, R as select_default, V as log } from "./src-DE2kHKEO.js";
import { t as isEmpty } from "./isEmpty-MtiTqD5c.js";
// ../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Enum.js
var COMMENT = "comm";
var RULESET = "rule";
var DECLARATION = "decl";
var IMPORT = "@import";
var NAMESPACE = "@namespace";
var KEYFRAMES = "@keyframes";
var LAYER = "@layer";
// ../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Utility.js
/**
* @param {number}
* @return {number}
*/
var abs = Math.abs;
/**
* @param {number}
* @return {string}
*/
var from = String.fromCharCode;
/**
* @param {string} value
* @return {string}
*/
function trim(value) {
	return value.trim();
}
/**
* @param {string} value
* @param {(string|RegExp)} pattern
* @param {string} replacement
* @return {string}
*/
function replace(value, pattern, replacement) {
	return value.replace(pattern, replacement);
}
/**
* @param {string} value
* @param {number} index
* @return {number}
*/
function charat(value, index) {
	return value.charCodeAt(index) | 0;
}
/**
* @param {string} value
* @param {number} begin
* @param {number} end
* @return {string}
*/
function substr(value, begin, end) {
	return value.slice(begin, end);
}
/**
* @param {string} value
* @return {number}
*/
function strlen(value) {
	return value.length;
}
/**
* @param {any[]} value
* @return {number}
*/
function sizeof(value) {
	return value.length;
}
/**
* @param {any} value
* @param {any[]} array
* @return {any}
*/
function append(value, array) {
	return array.push(value), value;
}
// ../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Tokenizer.js
var line = 1;
var column = 1;
var length = 0;
var position = 0;
var character = 0;
var characters = "";
/**
* @param {string} value
* @param {object | null} root
* @param {object | null} parent
* @param {string} type
* @param {string[] | string} props
* @param {object[] | string} children
* @param {object[]} siblings
* @param {number} length
*/
function node(value, root, parent, type, props, children, length, siblings) {
	return {
		value,
		root,
		parent,
		type,
		props,
		children,
		line,
		column,
		length,
		return: "",
		siblings
	};
}
/**
* @return {number}
*/
function char() {
	return character;
}
/**
* @return {number}
*/
function prev() {
	character = position > 0 ? charat(characters, --position) : 0;
	if (column--, character === 10) column = 1, line--;
	return character;
}
/**
* @return {number}
*/
function next() {
	character = position < length ? charat(characters, position++) : 0;
	if (column++, character === 10) column = 1, line++;
	return character;
}
/**
* @return {number}
*/
function peek() {
	return charat(characters, position);
}
/**
* @return {number}
*/
function caret() {
	return position;
}
/**
* @param {number} begin
* @param {number} end
* @return {string}
*/
function slice(begin, end) {
	return substr(characters, begin, end);
}
/**
* @param {number} type
* @return {number}
*/
function token(type) {
	switch (type) {
		case 0:
		case 9:
		case 10:
		case 13:
		case 32: return 5;
		case 33:
		case 43:
		case 44:
		case 47:
		case 62:
		case 64:
		case 126:
		case 59:
		case 123:
		case 125: return 4;
		case 58: return 3;
		case 34:
		case 39:
		case 40:
		case 91: return 2;
		case 41:
		case 93: return 1;
	}
	return 0;
}
/**
* @param {string} value
* @return {any[]}
*/
function alloc(value) {
	return line = column = 1, length = strlen(characters = value), position = 0, [];
}
/**
* @param {any} value
* @return {any}
*/
function dealloc(value) {
	return characters = "", value;
}
/**
* @param {number} type
* @return {string}
*/
function delimit(type) {
	return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
}
/**
* @param {number} type
* @return {string}
*/
function whitespace(type) {
	while (character = peek()) if (character < 33) next();
	else break;
	return token(type) > 2 || token(character) > 3 ? "" : " ";
}
/**
* @param {number} index
* @param {number} count
* @return {string}
*/
function escaping(index, count) {
	while (--count && next()) if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97) break;
	return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32));
}
/**
* @param {number} type
* @return {number}
*/
function delimiter(type) {
	while (next()) switch (character) {
		case type: return position;
		case 34:
		case 39:
			if (type !== 34 && type !== 39) delimiter(character);
			break;
		case 40:
			if (type === 41) delimiter(type);
			break;
		case 92: next();
	}
	return position;
}
/**
* @param {number} type
* @param {number} index
* @return {number}
*/
function commenter(type, index) {
	while (next()) if (type + character === 57) break;
	else if (type + character === 84 && peek() === 47) break;
	return "/*" + slice(index, position - 1) + "*" + from(type === 47 ? type : next());
}
/**
* @param {number} index
* @return {string}
*/
function identifier(index) {
	while (!token(peek())) next();
	return slice(index, position);
}
// ../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Parser.js
/**
* @param {string} value
* @return {object[]}
*/
function compile(value) {
	return dealloc(parse$1("", null, null, null, [""], value = alloc(value), 0, [0], value));
}
/**
* @param {string} value
* @param {object} root
* @param {object?} parent
* @param {string[]} rule
* @param {string[]} rules
* @param {string[]} rulesets
* @param {number[]} pseudo
* @param {number[]} points
* @param {string[]} declarations
* @return {object}
*/
function parse$1(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
	var index = 0;
	var offset = 0;
	var length = pseudo;
	var atrule = 0;
	var property = 0;
	var previous = 0;
	var variable = 1;
	var scanning = 1;
	var ampersand = 1;
	var parens = 0;
	var character = 0;
	var type = "";
	var props = rules;
	var children = rulesets;
	var reference = rule;
	var characters = type;
	while (scanning) switch (previous = character, character = next()) {
		case 40:
			if (previous != 108 && charat(characters, length - 1) == 58) parens++, characters += "(";
			else characters += delimit(character);
			break;
		case 41:
			parens--, characters += ")";
			break;
		case 34:
		case 39:
		case 91:
			characters += delimit(character);
			break;
		case 9:
		case 10:
		case 13:
		case 32:
			if (parens > 0) {
				characters += from(character);
				break;
			}
			characters += whitespace(previous);
			break;
		case 92:
			characters += escaping(caret() - 1, 7);
			continue;
		case 47:
			switch (peek()) {
				case 42:
				case 47:
					append(comment(commenter(next(), caret()), root, parent, declarations), declarations);
					if ((token(previous || 1) == 5 || token(peek() || 1) == 5) && strlen(characters) && substr(characters, -1, void 0) !== " ") characters += " ";
					break;
				default: characters += "/";
			}
			break;
		case 123 * variable: points[index++] = strlen(characters) * ampersand;
		case 125 * variable:
		case 59:
		case 0:
			if (parens > 0 && character) {
				characters += from(character);
				break;
			}
			switch (character) {
				case 0:
				case 125: scanning = 0;
				case 59 + offset:
					if (ampersand == -1) characters = replace(characters, /\f/g, "");
					if (property > 0 && (strlen(characters) - length || variable === 0)) append(property > 32 ? declaration(characters + ";", rule, parent, length - 1, declarations) : declaration(replace(characters, " ", "") + ";", rule, parent, length - 2, declarations), declarations);
					break;
				case 59: characters += ";";
				default:
					append(reference = ruleset(characters, root, parent, index, offset, rules, points, type, props = [], children = [], length, rulesets), rulesets);
					if (character === 123) if (offset === 0) parse$1(characters, root, reference, reference, props, rulesets, length, points, children);
					else {
						switch (atrule) {
							case 99: if (charat(characters, 3) === 110) break;
							case 108: if (charat(characters, 2) === 97) break;
							default: offset = 0;
							case 100:
							case 109:
							case 115:
						}
						if (offset) parse$1(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length, children), children), rules, children, length, points, rule ? props : children);
						else parse$1(characters, reference, reference, reference, [""], children, 0, points, children);
					}
			}
			index = offset = property = 0, variable = ampersand = 1, type = characters = "", length = pseudo;
			break;
		case 58: length = 1 + strlen(characters), property = previous;
		default:
			if (variable < 1) {
				if (character == 123) --variable;
				else if (character == 125 && variable++ == 0 && prev() == 125) continue;
			}
			switch (characters += from(character), character * variable) {
				case 38:
					ampersand = offset > 0 ? 1 : (characters += "\f", -1);
					break;
				case 44:
					if (parens > 0) break;
					points[index++] = (strlen(characters) - 1) * ampersand, ampersand = 1;
					break;
				case 64:
					if (peek() === 45) characters += delimit(next());
					atrule = peek(), offset = length = strlen(type = characters += identifier(caret())), character++;
					break;
				case 45: if (previous === 45 && strlen(characters) == 2) variable = 0;
			}
	}
	return rulesets;
}
/**
* @param {string} value
* @param {object} root
* @param {object?} parent
* @param {number} index
* @param {number} offset
* @param {string[]} rules
* @param {number[]} points
* @param {string} type
* @param {string[]} props
* @param {string[]} children
* @param {number} length
* @param {object[]} siblings
* @return {object}
*/
function ruleset(value, root, parent, index, offset, rules, points, type, props, children, length, siblings) {
	var post = offset - 1;
	var rule = offset === 0 ? rules : [""];
	var size = sizeof(rule);
	for (var i = 0, j = 0, k = 0; i < index; ++i) for (var x = 0, y = substr(value, post + 1, post = abs(j = points[i])), z = value; x < size; ++x) if (z = trim(j > 0 ? rule[x] + " " + y : replace(y, /&\f/g, rule[x]))) props[k++] = z;
	return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length, siblings);
}
/**
* @param {number} value
* @param {object} root
* @param {object?} parent
* @param {object[]} siblings
* @return {object}
*/
function comment(value, root, parent, siblings) {
	return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0, siblings);
}
/**
* @param {string} value
* @param {object} root
* @param {object?} parent
* @param {number} length
* @param {object[]} siblings
* @return {object}
*/
function declaration(value, root, parent, length, siblings) {
	return node(value, root, parent, DECLARATION, substr(value, 0, length), substr(value, length + 1, -1), length, siblings);
}
// ../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Serializer.js
/**
* @param {object[]} children
* @param {function} callback
* @return {string}
*/
function serialize(children, callback) {
	var output = "";
	for (var i = 0; i < children.length; i++) output += callback(children[i], i, children, callback) || "";
	return output;
}
/**
* @param {object} element
* @param {number} index
* @param {object[]} children
* @param {function} callback
* @return {string}
*/
function stringify(element, index, children, callback) {
	switch (element.type) {
		case LAYER: if (element.children.length) break;
		case IMPORT:
		case NAMESPACE:
		case DECLARATION: return element.return = element.return || element.value;
		case COMMENT: return "";
		case KEYFRAMES: return element.return = element.value + "{" + serialize(element.children, callback) + "}";
		case RULESET: if (!strlen(element.value = element.props.join(","))) return "";
	}
	return strlen(children = serialize(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
}
// ../../node_modules/.pnpm/mermaid@11.12.2/node_modules/mermaid/dist/mermaid.core.mjs
var id = "c4";
var c4Detector_default = {
	id,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*C4Context|C4Container|C4Component|C4Dynamic|C4Deployment/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./c4Diagram-YG6GDRKO-CtbN3_8S.js");
		return {
			id,
			diagram: diagram2
		};
	}, "loader")
};
var id2 = "flowchart";
var flowDetector_default = {
	id: id2,
	detector: /* @__PURE__ */ __name((txt, config) => {
		if (config?.flowchart?.defaultRenderer === "dagre-wrapper" || config?.flowchart?.defaultRenderer === "elk") return false;
		return /^\s*graph/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./flowDiagram-NV44I4VS-BnLA-GQ6.js");
		return {
			id: id2,
			diagram: diagram2
		};
	}, "loader")
};
var id3 = "flowchart-v2";
var flowDetector_v2_default = {
	id: id3,
	detector: /* @__PURE__ */ __name((txt, config) => {
		if (config?.flowchart?.defaultRenderer === "dagre-d3") return false;
		if (config?.flowchart?.defaultRenderer === "elk") config.layout = "elk";
		if (/^\s*graph/.test(txt) && config?.flowchart?.defaultRenderer === "dagre-wrapper") return true;
		return /^\s*flowchart/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./flowDiagram-NV44I4VS-BnLA-GQ6.js");
		return {
			id: id3,
			diagram: diagram2
		};
	}, "loader")
};
var id4 = "er";
var erDetector_default = {
	id: id4,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*erDiagram/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./erDiagram-Q2GNP2WA-B_B_FLGN.js");
		return {
			id: id4,
			diagram: diagram2
		};
	}, "loader")
};
var id5 = "gitGraph";
var gitGraphDetector_default = {
	id: id5,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*gitGraph/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./gitGraphDiagram-NY62KEGX-Dkcq0Nz8.js");
		return {
			id: id5,
			diagram: diagram2
		};
	}, "loader")
};
var id6 = "gantt";
var ganttDetector_default = {
	id: id6,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*gantt/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./ganttDiagram-JELNMOA3-CqfT1blK.js");
		return {
			id: id6,
			diagram: diagram2
		};
	}, "loader")
};
var id7 = "info";
var info = {
	id: id7,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*info/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./infoDiagram-WHAUD3N6-BruxdErI.js");
		return {
			id: id7,
			diagram: diagram2
		};
	}, "loader")
};
var id8 = "pie";
var pie = {
	id: id8,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*pie/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./pieDiagram-ADFJNKIX-BpCm0XEC.js");
		return {
			id: id8,
			diagram: diagram2
		};
	}, "loader")
};
var id9 = "quadrantChart";
var quadrantDetector_default = {
	id: id9,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*quadrantChart/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./quadrantDiagram-AYHSOK5B-D_8TYego.js");
		return {
			id: id9,
			diagram: diagram2
		};
	}, "loader")
};
var id10 = "xychart";
var xychartDetector_default = {
	id: id10,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*xychart(-beta)?/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./xychartDiagram-PRI3JC2R-DR55d_Og.js");
		return {
			id: id10,
			diagram: diagram2
		};
	}, "loader")
};
var id11 = "requirement";
var requirementDetector_default = {
	id: id11,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*requirement(Diagram)?/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./requirementDiagram-UZGBJVZJ-Bcn6Kt5H.js");
		return {
			id: id11,
			diagram: diagram2
		};
	}, "loader")
};
var id12 = "sequence";
var sequenceDetector_default = {
	id: id12,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*sequenceDiagram/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./sequenceDiagram-WL72ISMW-BQw6to6T.js");
		return {
			id: id12,
			diagram: diagram2
		};
	}, "loader")
};
var id13 = "class";
var classDetector_default = {
	id: id13,
	detector: /* @__PURE__ */ __name((txt, config) => {
		if (config?.class?.defaultRenderer === "dagre-wrapper") return false;
		return /^\s*classDiagram/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./classDiagram-2ON5EDUG-9VWYznSU.js");
		return {
			id: id13,
			diagram: diagram2
		};
	}, "loader")
};
var id14 = "classDiagram";
var classDetector_V2_default = {
	id: id14,
	detector: /* @__PURE__ */ __name((txt, config) => {
		if (/^\s*classDiagram/.test(txt) && config?.class?.defaultRenderer === "dagre-wrapper") return true;
		return /^\s*classDiagram-v2/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./classDiagram-v2-WZHVMYZB-DoHAAxGj.js");
		return {
			id: id14,
			diagram: diagram2
		};
	}, "loader")
};
var id15 = "state";
var stateDetector_default = {
	id: id15,
	detector: /* @__PURE__ */ __name((txt, config) => {
		if (config?.state?.defaultRenderer === "dagre-wrapper") return false;
		return /^\s*stateDiagram/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./stateDiagram-FKZM4ZOC-Bq_Rm-HV.js");
		return {
			id: id15,
			diagram: diagram2
		};
	}, "loader")
};
var id16 = "stateDiagram";
var stateDetector_V2_default = {
	id: id16,
	detector: /* @__PURE__ */ __name((txt, config) => {
		if (/^\s*stateDiagram-v2/.test(txt)) return true;
		if (/^\s*stateDiagram/.test(txt) && config?.state?.defaultRenderer === "dagre-wrapper") return true;
		return false;
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./stateDiagram-v2-4FDKWEC3-CK_VPgTx.js");
		return {
			id: id16,
			diagram: diagram2
		};
	}, "loader")
};
var id17 = "journey";
var journeyDetector_default = {
	id: id17,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*journey/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./journeyDiagram-XKPGCS4Q-BeglInin.js");
		return {
			id: id17,
			diagram: diagram2
		};
	}, "loader")
};
var renderer = { draw: /* @__PURE__ */ __name((_text, id28, version) => {
	log.debug("rendering svg for syntax error\n");
	const svg = selectSvgElement(id28);
	const g = svg.append("g");
	svg.attr("viewBox", "0 0 2412 512");
	configureSvgSize(svg, 100, 512, true);
	g.append("path").attr("class", "error-icon").attr("d", "m411.313,123.313c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32-9.375,9.375-20.688-20.688c-12.484-12.5-32.766-12.5-45.25,0l-16,16c-1.261,1.261-2.304,2.648-3.31,4.051-21.739-8.561-45.324-13.426-70.065-13.426-105.867,0-192,86.133-192,192s86.133,192 192,192 192-86.133 192-192c0-24.741-4.864-48.327-13.426-70.065 1.402-1.007 2.79-2.049 4.051-3.31l16-16c12.5-12.492 12.5-32.758 0-45.25l-20.688-20.688 9.375-9.375 32.001-31.999zm-219.313,100.687c-52.938,0-96,43.063-96,96 0,8.836-7.164,16-16,16s-16-7.164-16-16c0-70.578 57.422-128 128-128 8.836,0 16,7.164 16,16s-7.164,16-16,16z");
	g.append("path").attr("class", "error-icon").attr("d", "m459.02,148.98c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l16,16c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16.001-16z");
	g.append("path").attr("class", "error-icon").attr("d", "m340.395,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16-16c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l15.999,16z");
	g.append("path").attr("class", "error-icon").attr("d", "m400,64c8.844,0 16-7.164 16-16v-32c0-8.836-7.156-16-16-16-8.844,0-16,7.164-16,16v32c0,8.836 7.156,16 16,16z");
	g.append("path").attr("class", "error-icon").attr("d", "m496,96.586h-32c-8.844,0-16,7.164-16,16 0,8.836 7.156,16 16,16h32c8.844,0 16-7.164 16-16 0-8.836-7.156-16-16-16z");
	g.append("path").attr("class", "error-icon").attr("d", "m436.98,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688l32-32c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32c-6.251,6.25-6.251,16.375-0.001,22.625z");
	g.append("text").attr("class", "error-text").attr("x", 1440).attr("y", 250).attr("font-size", "150px").style("text-anchor", "middle").text("Syntax error in text");
	g.append("text").attr("class", "error-text").attr("x", 1250).attr("y", 400).attr("font-size", "100px").style("text-anchor", "middle").text(`mermaid version ${version}`);
}, "draw") };
var errorRenderer_default = renderer;
var errorDiagram_default = {
	db: {},
	renderer,
	parser: { parse: /* @__PURE__ */ __name(() => {}, "parse") }
};
var id18 = "flowchart-elk";
var detector_default = {
	id: id18,
	detector: /* @__PURE__ */ __name((txt, config = {}) => {
		if (/^\s*flowchart-elk/.test(txt) || /^\s*(flowchart|graph)/.test(txt) && config?.flowchart?.defaultRenderer === "elk") {
			config.layout = "elk";
			return true;
		}
		return false;
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./flowDiagram-NV44I4VS-BnLA-GQ6.js");
		return {
			id: id18,
			diagram: diagram2
		};
	}, "loader")
};
var id19 = "timeline";
var detector_default2 = {
	id: id19,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*timeline/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./timeline-definition-IT6M3QCI-DLVbp5M_.js");
		return {
			id: id19,
			diagram: diagram2
		};
	}, "loader")
};
var id20 = "mindmap";
var detector_default3 = {
	id: id20,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*mindmap/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./mindmap-definition-VGOIOE7T-BTiT17KV.js");
		return {
			id: id20,
			diagram: diagram2
		};
	}, "loader")
};
var id21 = "kanban";
var detector_default4 = {
	id: id21,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*kanban/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./kanban-definition-3W4ZIXB7-aBnMhrp-.js");
		return {
			id: id21,
			diagram: diagram2
		};
	}, "loader")
};
var id22 = "sankey";
var sankeyDetector_default = {
	id: id22,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*sankey(-beta)?/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./sankeyDiagram-TZEHDZUN-CID1kg0u.js");
		return {
			id: id22,
			diagram: diagram2
		};
	}, "loader")
};
var id23 = "packet";
var packet = {
	id: id23,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*packet(-beta)?/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./diagram-S2PKOQOG-WuN51rEp.js");
		return {
			id: id23,
			diagram: diagram2
		};
	}, "loader")
};
var id24 = "radar";
var radar = {
	id: id24,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*radar-beta/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./diagram-QEK2KX5R-DoRydOxH.js");
		return {
			id: id24,
			diagram: diagram2
		};
	}, "loader")
};
var id25 = "block";
var blockDetector_default = {
	id: id25,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*block(-beta)?/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./blockDiagram-VD42YOAC-ezuQVHbu.js");
		return {
			id: id25,
			diagram: diagram2
		};
	}, "loader")
};
var id26 = "architecture";
var architectureDetector_default = {
	id: id26,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*architecture/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./architectureDiagram-VXUJARFQ-EhWiWF2B.js");
		return {
			id: id26,
			diagram: diagram2
		};
	}, "loader")
};
var id27 = "treemap";
var treemap = {
	id: id27,
	detector: /* @__PURE__ */ __name((txt) => {
		return /^\s*treemap/.test(txt);
	}, "detector"),
	loader: /* @__PURE__ */ __name(async () => {
		const { diagram: diagram2 } = await import("./diagram-PSM6KHXK-C-OXOuvd.js");
		return {
			id: id27,
			diagram: diagram2
		};
	}, "loader")
};
var hasLoadedDiagrams = false;
var addDiagrams = /* @__PURE__ */ __name(() => {
	if (hasLoadedDiagrams) return;
	hasLoadedDiagrams = true;
	registerDiagram("error", errorDiagram_default, (text) => {
		return text.toLowerCase().trim() === "error";
	});
	registerDiagram("---", {
		db: { clear: /* @__PURE__ */ __name(() => {}, "clear") },
		styles: {},
		renderer: { draw: /* @__PURE__ */ __name(() => {}, "draw") },
		parser: { parse: /* @__PURE__ */ __name(() => {
			throw new Error("Diagrams beginning with --- are not valid. If you were trying to use a YAML front-matter, please ensure that you've correctly opened and closed the YAML front-matter with un-indented `---` blocks");
		}, "parse") },
		init: /* @__PURE__ */ __name(() => null, "init")
	}, (text) => {
		return text.toLowerCase().trimStart().startsWith("---");
	});
	registerLazyLoadedDiagrams(detector_default, detector_default3, architectureDetector_default);
	registerLazyLoadedDiagrams(c4Detector_default, detector_default4, classDetector_V2_default, classDetector_default, erDetector_default, ganttDetector_default, info, pie, requirementDetector_default, sequenceDetector_default, flowDetector_v2_default, flowDetector_default, detector_default2, gitGraphDetector_default, stateDetector_V2_default, stateDetector_default, journeyDetector_default, quadrantDetector_default, sankeyDetector_default, packet, xychartDetector_default, blockDetector_default, radar, treemap);
}, "addDiagrams");
var loadRegisteredDiagrams = /* @__PURE__ */ __name(async () => {
	log.debug(`Loading registered diagrams`);
	const failed = (await Promise.allSettled(Object.entries(detectors).map(async ([key, { detector: detector28, loader: loader28 }]) => {
		if (!loader28) return;
		try {
			getDiagram(key);
		} catch {
			try {
				const { diagram: diagram2, id: id28 } = await loader28();
				registerDiagram(id28, diagram2, detector28);
			} catch (err) {
				log.error(`Failed to load external diagram with key ${key}. Removing from detectors.`);
				delete detectors[key];
				throw err;
			}
		}
	}))).filter((result) => result.status === "rejected");
	if (failed.length > 0) {
		log.error(`Failed to load ${failed.length} external diagrams`);
		for (const res of failed) log.error(res);
		throw new Error(`Failed to load ${failed.length} external diagrams`);
	}
}, "loadRegisteredDiagrams");
var SVG_ROLE = "graphics-document document";
function setA11yDiagramInfo(svg, diagramType) {
	svg.attr("role", SVG_ROLE);
	if (diagramType !== "") svg.attr("aria-roledescription", diagramType);
}
__name(setA11yDiagramInfo, "setA11yDiagramInfo");
function addSVGa11yTitleDescription(svg, a11yTitle, a11yDesc, baseId) {
	if (svg.insert === void 0) return;
	if (a11yDesc) {
		const descId = `chart-desc-${baseId}`;
		svg.attr("aria-describedby", descId);
		svg.insert("desc", ":first-child").attr("id", descId).text(a11yDesc);
	}
	if (a11yTitle) {
		const titleId = `chart-title-${baseId}`;
		svg.attr("aria-labelledby", titleId);
		svg.insert("title", ":first-child").attr("id", titleId).text(a11yTitle);
	}
}
__name(addSVGa11yTitleDescription, "addSVGa11yTitleDescription");
var Diagram = class _Diagram {
	constructor(type, text, db, parser, renderer2) {
		this.type = type;
		this.text = text;
		this.db = db;
		this.parser = parser;
		this.renderer = renderer2;
	}
	static {
		__name(this, "Diagram");
	}
	static async fromText(text, metadata = {}) {
		const config = getConfig();
		const type = detectType(text, config);
		text = encodeEntities(text) + "\n";
		try {
			getDiagram(type);
		} catch {
			const loader28 = getDiagramLoader(type);
			if (!loader28) throw new UnknownDiagramError(`Diagram ${type} not found.`);
			const { id: id28, diagram: diagram2 } = await loader28();
			registerDiagram(id28, diagram2);
		}
		const { db, parser, renderer: renderer2, init: init2 } = getDiagram(type);
		if (parser.parser) parser.parser.yy = db;
		db.clear?.();
		init2?.(config);
		if (metadata.title) db.setDiagramTitle?.(metadata.title);
		await parser.parse(text);
		return new _Diagram(type, text, db, parser, renderer2);
	}
	async render(id28, version) {
		await this.renderer.draw(this.text, id28, version, this);
	}
	getParser() {
		return this.parser;
	}
	getType() {
		return this.type;
	}
};
var interactionFunctions = [];
var attachFunctions = /* @__PURE__ */ __name(() => {
	interactionFunctions.forEach((f) => {
		f();
	});
	interactionFunctions = [];
}, "attachFunctions");
var cleanupComments = /* @__PURE__ */ __name((text) => {
	return text.replace(/^\s*%%(?!{)[^\n]+\n?/gm, "").trimStart();
}, "cleanupComments");
function extractFrontMatter(text) {
	const matches = text.match(frontMatterRegex);
	if (!matches) return {
		text,
		metadata: {}
	};
	let parsed = load(matches[1], { schema: JSON_SCHEMA }) ?? {};
	parsed = typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
	const metadata = {};
	if (parsed.displayMode) metadata.displayMode = parsed.displayMode.toString();
	if (parsed.title) metadata.title = parsed.title.toString();
	if (parsed.config) metadata.config = parsed.config;
	return {
		text: text.slice(matches[0].length),
		metadata
	};
}
__name(extractFrontMatter, "extractFrontMatter");
var cleanupText = /* @__PURE__ */ __name((code) => {
	return code.replace(/\r\n?/g, "\n").replace(/<(\w+)([^>]*)>/g, (match, tag, attributes) => "<" + tag + attributes.replace(/="([^"]*)"/g, "='$1'") + ">");
}, "cleanupText");
var processFrontmatter = /* @__PURE__ */ __name((code) => {
	const { text, metadata } = extractFrontMatter(code);
	const { displayMode, title, config = {} } = metadata;
	if (displayMode) {
		if (!config.gantt) config.gantt = {};
		config.gantt.displayMode = displayMode;
	}
	return {
		title,
		config,
		text
	};
}, "processFrontmatter");
var processDirectives = /* @__PURE__ */ __name((code) => {
	const initDirective = utils_default.detectInit(code) ?? {};
	const wrapDirectives = utils_default.detectDirective(code, "wrap");
	if (Array.isArray(wrapDirectives)) initDirective.wrap = wrapDirectives.some(({ type }) => type === "wrap");
	else if (wrapDirectives?.type === "wrap") initDirective.wrap = true;
	return {
		text: removeDirectives(code),
		directive: initDirective
	};
}, "processDirectives");
function preprocessDiagram(code) {
	const frontMatterResult = processFrontmatter(cleanupText(code));
	const directiveResult = processDirectives(frontMatterResult.text);
	const config = cleanAndMerge(frontMatterResult.config, directiveResult.directive);
	code = cleanupComments(directiveResult.text);
	return {
		code,
		title: frontMatterResult.title,
		config
	};
}
__name(preprocessDiagram, "preprocessDiagram");
function toBase64(str) {
	const utf8Bytes = new TextEncoder().encode(str);
	const utf8Str = Array.from(utf8Bytes, (byte) => String.fromCodePoint(byte)).join("");
	return btoa(utf8Str);
}
__name(toBase64, "toBase64");
var MAX_TEXTLENGTH = 5e4;
var MAX_TEXTLENGTH_EXCEEDED_MSG = "graph TB;a[Maximum text size in diagram exceeded];style a fill:#faa";
var SECURITY_LVL_SANDBOX = "sandbox";
var SECURITY_LVL_LOOSE = "loose";
var XMLNS_SVG_STD = "http://www.w3.org/2000/svg";
var XMLNS_XLINK_STD = "http://www.w3.org/1999/xlink";
var XMLNS_XHTML_STD = "http://www.w3.org/1999/xhtml";
var IFRAME_WIDTH = "100%";
var IFRAME_HEIGHT = "100%";
var IFRAME_STYLES = "border:0;margin:0;";
var IFRAME_BODY_STYLE = "margin:0";
var IFRAME_SANDBOX_OPTS = "allow-top-navigation-by-user-activation allow-popups";
var IFRAME_NOT_SUPPORTED_MSG = "The \"iframe\" tag is not supported by your browser.";
var DOMPURIFY_TAGS = ["foreignobject"];
var DOMPURIFY_ATTR = ["dominant-baseline"];
function processAndSetConfigs(text) {
	const processed = preprocessDiagram(text);
	reset();
	addDirective(processed.config ?? {});
	return processed;
}
__name(processAndSetConfigs, "processAndSetConfigs");
async function parse(text, parseOptions) {
	addDiagrams();
	try {
		const { code, config } = processAndSetConfigs(text);
		return {
			diagramType: (await getDiagramFromText(code)).type,
			config
		};
	} catch (error) {
		if (parseOptions?.suppressErrors) return false;
		throw error;
	}
}
__name(parse, "parse");
var cssImportantStyles = /* @__PURE__ */ __name((cssClass, element, cssClasses = []) => {
	return `
.${cssClass} ${element} { ${cssClasses.join(" !important; ")} !important; }`;
}, "cssImportantStyles");
var createCssStyles = /* @__PURE__ */ __name((config, classDefs = /* @__PURE__ */ new Map()) => {
	let cssStyles = "";
	if (config.themeCSS !== void 0) cssStyles += `
${config.themeCSS}`;
	if (config.fontFamily !== void 0) cssStyles += `
:root { --mermaid-font-family: ${config.fontFamily}}`;
	if (config.altFontFamily !== void 0) cssStyles += `
:root { --mermaid-alt-font-family: ${config.altFontFamily}}`;
	if (classDefs instanceof Map) {
		const cssElements = config.htmlLabels ?? config.flowchart?.htmlLabels ? ["> *", "span"] : [
			"rect",
			"polygon",
			"ellipse",
			"circle",
			"path"
		];
		classDefs.forEach((styleClassDef) => {
			if (!isEmpty(styleClassDef.styles)) cssElements.forEach((cssElement) => {
				cssStyles += cssImportantStyles(styleClassDef.id, cssElement, styleClassDef.styles);
			});
			if (!isEmpty(styleClassDef.textStyles)) cssStyles += cssImportantStyles(styleClassDef.id, "tspan", (styleClassDef?.textStyles || []).map((s) => s.replace("color", "fill")));
		});
	}
	return cssStyles;
}, "createCssStyles");
var createUserStyles = /* @__PURE__ */ __name((config, graphType, classDefs, svgId) => {
	const userCSSstyles = createCssStyles(config, classDefs);
	return serialize(compile(`${svgId}{${styles_default(graphType, userCSSstyles, config.themeVariables)}}`), stringify);
}, "createUserStyles");
var cleanUpSvgCode = /* @__PURE__ */ __name((svgCode = "", inSandboxMode, useArrowMarkerUrls) => {
	let cleanedUpSvg = svgCode;
	if (!useArrowMarkerUrls && !inSandboxMode) cleanedUpSvg = cleanedUpSvg.replace(/marker-end="url\([\d+./:=?A-Za-z-]*?#/g, "marker-end=\"url(#");
	cleanedUpSvg = decodeEntities(cleanedUpSvg);
	cleanedUpSvg = cleanedUpSvg.replace(/<br>/g, "<br/>");
	return cleanedUpSvg;
}, "cleanUpSvgCode");
var putIntoIFrame = /* @__PURE__ */ __name((svgCode = "", svgElement) => {
	return `<iframe style="width:${IFRAME_WIDTH};height:${svgElement?.viewBox?.baseVal?.height ? svgElement.viewBox.baseVal.height + "px" : IFRAME_HEIGHT};${IFRAME_STYLES}" src="data:text/html;charset=UTF-8;base64,${toBase64(`<body style="${IFRAME_BODY_STYLE}">${svgCode}</body>`)}" sandbox="${IFRAME_SANDBOX_OPTS}">
  ${IFRAME_NOT_SUPPORTED_MSG}
</iframe>`;
}, "putIntoIFrame");
var appendDivSvgG = /* @__PURE__ */ __name((parentRoot, id28, enclosingDivId, divStyle, svgXlink) => {
	const enclosingDiv = parentRoot.append("div");
	enclosingDiv.attr("id", enclosingDivId);
	if (divStyle) enclosingDiv.attr("style", divStyle);
	const svgNode = enclosingDiv.append("svg").attr("id", id28).attr("width", "100%").attr("xmlns", XMLNS_SVG_STD);
	if (svgXlink) svgNode.attr("xmlns:xlink", svgXlink);
	svgNode.append("g");
	return parentRoot;
}, "appendDivSvgG");
function sandboxedIframe(parentNode, iFrameId) {
	return parentNode.append("iframe").attr("id", iFrameId).attr("style", "width: 100%; height: 100%;").attr("sandbox", "");
}
__name(sandboxedIframe, "sandboxedIframe");
var removeExistingElements = /* @__PURE__ */ __name((doc, id28, divId, iFrameId) => {
	doc.getElementById(id28)?.remove();
	doc.getElementById(divId)?.remove();
	doc.getElementById(iFrameId)?.remove();
}, "removeExistingElements");
var render = /* @__PURE__ */ __name(async function(id28, text, svgContainingElement) {
	addDiagrams();
	const processed = processAndSetConfigs(text);
	text = processed.code;
	const config = getConfig();
	log.debug(config);
	if (text.length > (config?.maxTextSize ?? MAX_TEXTLENGTH)) text = MAX_TEXTLENGTH_EXCEEDED_MSG;
	const idSelector = "#" + id28;
	const iFrameID = "i" + id28;
	const iFrameID_selector = "#" + iFrameID;
	const enclosingDivID = "d" + id28;
	const enclosingDivID_selector = "#" + enclosingDivID;
	const removeTempElements = /* @__PURE__ */ __name(() => {
		const node = select_default(isSandboxed ? iFrameID_selector : enclosingDivID_selector).node();
		if (node && "remove" in node) node.remove();
	}, "removeTempElements");
	let root = select_default("body");
	const isSandboxed = config.securityLevel === SECURITY_LVL_SANDBOX;
	const isLooseSecurityLevel = config.securityLevel === SECURITY_LVL_LOOSE;
	const fontFamily = config.fontFamily;
	if (svgContainingElement !== void 0) {
		if (svgContainingElement) svgContainingElement.innerHTML = "";
		if (isSandboxed) {
			const iframe = sandboxedIframe(select_default(svgContainingElement), iFrameID);
			root = select_default(iframe.nodes()[0].contentDocument.body);
			root.node().style.margin = 0;
		} else root = select_default(svgContainingElement);
		appendDivSvgG(root, id28, enclosingDivID, `font-family: ${fontFamily}`, XMLNS_XLINK_STD);
	} else {
		removeExistingElements(document, id28, enclosingDivID, iFrameID);
		if (isSandboxed) {
			const iframe = sandboxedIframe(select_default("body"), iFrameID);
			root = select_default(iframe.nodes()[0].contentDocument.body);
			root.node().style.margin = 0;
		} else root = select_default("body");
		appendDivSvgG(root, id28, enclosingDivID);
	}
	let diag;
	let parseEncounteredException;
	try {
		diag = await Diagram.fromText(text, { title: processed.title });
	} catch (error) {
		if (config.suppressErrorRendering) {
			removeTempElements();
			throw error;
		}
		diag = await Diagram.fromText("error");
		parseEncounteredException = error;
	}
	const element = root.select(enclosingDivID_selector).node();
	const diagramType = diag.type;
	const svg = element.firstChild;
	const firstChild = svg.firstChild;
	const diagramClassDefs = diag.renderer.getClasses?.(text, diag);
	const rules = createUserStyles(config, diagramType, diagramClassDefs, idSelector);
	const style1 = document.createElement("style");
	style1.innerHTML = rules;
	svg.insertBefore(style1, firstChild);
	try {
		await diag.renderer.draw(text, id28, package_default.version, diag);
	} catch (e) {
		if (config.suppressErrorRendering) removeTempElements();
		else errorRenderer_default.draw(text, id28, package_default.version);
		throw e;
	}
	const svgNode = root.select(`${enclosingDivID_selector} svg`);
	const a11yTitle = diag.db.getAccTitle?.();
	const a11yDescr = diag.db.getAccDescription?.();
	addA11yInfo(diagramType, svgNode, a11yTitle, a11yDescr);
	root.select(`[id="${id28}"]`).selectAll("foreignobject > *").attr("xmlns", XMLNS_XHTML_STD);
	let svgCode = root.select(enclosingDivID_selector).node().innerHTML;
	log.debug("config.arrowMarkerAbsolute", config.arrowMarkerAbsolute);
	svgCode = cleanUpSvgCode(svgCode, isSandboxed, evaluate(config.arrowMarkerAbsolute));
	if (isSandboxed) {
		const svgEl = root.select(enclosingDivID_selector + " svg").node();
		svgCode = putIntoIFrame(svgCode, svgEl);
	} else if (!isLooseSecurityLevel) svgCode = purify.sanitize(svgCode, {
		ADD_TAGS: DOMPURIFY_TAGS,
		ADD_ATTR: DOMPURIFY_ATTR,
		HTML_INTEGRATION_POINTS: { foreignobject: true }
	});
	attachFunctions();
	if (parseEncounteredException) throw parseEncounteredException;
	removeTempElements();
	return {
		diagramType,
		svg: svgCode,
		bindFunctions: diag.db.bindFunctions
	};
}, "render");
function initialize(userOptions = {}) {
	const options = assignWithDepth_default({}, userOptions);
	if (options?.fontFamily && !options.themeVariables?.fontFamily) {
		if (!options.themeVariables) options.themeVariables = {};
		options.themeVariables.fontFamily = options.fontFamily;
	}
	saveConfigFromInitialize(options);
	if (options?.theme && options.theme in themes_default) options.themeVariables = themes_default[options.theme].getThemeVariables(options.themeVariables);
	else if (options) options.themeVariables = themes_default.default.getThemeVariables(options.themeVariables);
	const config = typeof options === "object" ? setSiteConfig(options) : getSiteConfig();
	setLogLevel(config.logLevel);
	addDiagrams();
}
__name(initialize, "initialize");
var getDiagramFromText = /* @__PURE__ */ __name((text, metadata = {}) => {
	const { code } = preprocessDiagram(text);
	return Diagram.fromText(code, metadata);
}, "getDiagramFromText");
function addA11yInfo(diagramType, svgNode, a11yTitle, a11yDescr) {
	setA11yDiagramInfo(svgNode, diagramType);
	addSVGa11yTitleDescription(svgNode, a11yTitle, a11yDescr, svgNode.attr("id"));
}
__name(addA11yInfo, "addA11yInfo");
var mermaidAPI = Object.freeze({
	render,
	parse,
	getDiagramFromText,
	initialize,
	getConfig,
	setConfig,
	getSiteConfig,
	updateSiteConfig,
	reset: /* @__PURE__ */ __name(() => {
		reset();
	}, "reset"),
	globalReset: /* @__PURE__ */ __name(() => {
		reset(defaultConfig);
	}, "globalReset"),
	defaultConfig
});
setLogLevel(getConfig().logLevel);
reset(getConfig());
var handleError = /* @__PURE__ */ __name((error, errors, parseError) => {
	log.warn(error);
	if (isDetailedError(error)) {
		if (parseError) parseError(error.str, error.hash);
		errors.push({
			...error,
			message: error.str,
			error
		});
	} else {
		if (parseError) parseError(error);
		if (error instanceof Error) errors.push({
			str: error.message,
			message: error.message,
			hash: error.name,
			error
		});
	}
}, "handleError");
var run = /* @__PURE__ */ __name(async function(options = { querySelector: ".mermaid" }) {
	try {
		await runThrowsErrors(options);
	} catch (e) {
		if (isDetailedError(e)) log.error(e.str);
		if (mermaid.parseError) mermaid.parseError(e);
		if (!options.suppressErrors) {
			log.error("Use the suppressErrors option to suppress these errors");
			throw e;
		}
	}
}, "run");
var runThrowsErrors = /* @__PURE__ */ __name(async function({ postRenderCallback, querySelector, nodes } = { querySelector: ".mermaid" }) {
	const conf = mermaidAPI.getConfig();
	log.debug(`${!postRenderCallback ? "No " : ""}Callback function found`);
	let nodesToProcess;
	if (nodes) nodesToProcess = nodes;
	else if (querySelector) nodesToProcess = document.querySelectorAll(querySelector);
	else throw new Error("Nodes and querySelector are both undefined");
	log.debug(`Found ${nodesToProcess.length} diagrams`);
	if (conf?.startOnLoad !== void 0) {
		log.debug("Start On Load: " + conf?.startOnLoad);
		mermaidAPI.updateSiteConfig({ startOnLoad: conf?.startOnLoad });
	}
	const idGenerator = new utils_default.InitIDGenerator(conf.deterministicIds, conf.deterministicIDSeed);
	let txt;
	const errors = [];
	for (const element of Array.from(nodesToProcess)) {
		log.info("Rendering diagram: " + element.id);
		if (element.getAttribute("data-processed")) continue;
		element.setAttribute("data-processed", "true");
		const id28 = `mermaid-${idGenerator.next()}`;
		txt = element.innerHTML;
		txt = dedent(utils_default.entityDecode(txt)).trim().replace(/<br\s*\/?>/gi, "<br/>");
		const init2 = utils_default.detectInit(txt);
		if (init2) log.debug("Detected early reinit: ", init2);
		try {
			const { svg, bindFunctions } = await render2(id28, txt, element);
			element.innerHTML = svg;
			if (postRenderCallback) await postRenderCallback(id28);
			if (bindFunctions) bindFunctions(element);
		} catch (error) {
			handleError(error, errors, mermaid.parseError);
		}
	}
	if (errors.length > 0) throw errors[0];
}, "runThrowsErrors");
var initialize2 = /* @__PURE__ */ __name(function(config) {
	mermaidAPI.initialize(config);
}, "initialize");
var init = /* @__PURE__ */ __name(async function(config, nodes, callback) {
	log.warn("mermaid.init is deprecated. Please use run instead.");
	if (config) initialize2(config);
	const runOptions = {
		postRenderCallback: callback,
		querySelector: ".mermaid"
	};
	if (typeof nodes === "string") runOptions.querySelector = nodes;
	else if (nodes) {
		if (nodes instanceof HTMLElement) runOptions.nodes = [nodes];
		else runOptions.nodes = nodes;
	}
	await run(runOptions);
}, "init");
var registerExternalDiagrams = /* @__PURE__ */ __name(async (diagrams, { lazyLoad = true } = {}) => {
	addDiagrams();
	registerLazyLoadedDiagrams(...diagrams);
	if (lazyLoad === false) await loadRegisteredDiagrams();
}, "registerExternalDiagrams");
var contentLoaded = /* @__PURE__ */ __name(function() {
	if (mermaid.startOnLoad) {
		const { startOnLoad } = mermaidAPI.getConfig();
		if (startOnLoad) mermaid.run().catch((err) => log.error("Mermaid failed to initialize", err));
	}
}, "contentLoaded");
if (typeof document !== "undefined") window.addEventListener("load", contentLoaded, false);
var setParseErrorHandler = /* @__PURE__ */ __name(function(parseErrorHandler) {
	mermaid.parseError = parseErrorHandler;
}, "setParseErrorHandler");
var executionQueue = [];
var executionQueueRunning = false;
var executeQueue = /* @__PURE__ */ __name(async () => {
	if (executionQueueRunning) return;
	executionQueueRunning = true;
	while (executionQueue.length > 0) {
		const f = executionQueue.shift();
		if (f) try {
			await f();
		} catch (e) {
			log.error("Error executing queue", e);
		}
	}
	executionQueueRunning = false;
}, "executeQueue");
var parse2 = /* @__PURE__ */ __name(async (text, parseOptions) => {
	return new Promise((resolve, reject) => {
		const performCall = /* @__PURE__ */ __name(() => new Promise((res, rej) => {
			mermaidAPI.parse(text, parseOptions).then((r) => {
				res(r);
				resolve(r);
			}, (e) => {
				log.error("Error parsing", e);
				mermaid.parseError?.(e);
				rej(e);
				reject(e);
			});
		}), "performCall");
		executionQueue.push(performCall);
		executeQueue().catch(reject);
	});
}, "parse");
var render2 = /* @__PURE__ */ __name((id28, text, container) => {
	return new Promise((resolve, reject) => {
		const performCall = /* @__PURE__ */ __name(() => new Promise((res, rej) => {
			mermaidAPI.render(id28, text, container).then((r) => {
				res(r);
				resolve(r);
			}, (e) => {
				log.error("Error parsing", e);
				mermaid.parseError?.(e);
				rej(e);
				reject(e);
			});
		}), "performCall");
		executionQueue.push(performCall);
		executeQueue().catch(reject);
	});
}, "render");
var mermaid = {
	startOnLoad: true,
	mermaidAPI,
	parse: parse2,
	render: render2,
	init,
	run,
	registerExternalDiagrams,
	registerLayoutLoaders,
	initialize: initialize2,
	parseError: void 0,
	contentLoaded,
	setParseErrorHandler,
	detectType,
	registerIconPacks,
	getRegisteredDiagramsMetadata: /* @__PURE__ */ __name(() => {
		return Object.keys(detectors).map((id28) => ({ id: id28 }));
	}, "getRegisteredDiagramsMetadata")
};
var mermaid_default = mermaid;
/*! Check if previously processed */
/*!
* Wait for document loaded before starting the execution
*/
// ../../node_modules/.pnpm/vitepress-mermaid-renderer@_44be283374f321f1bf2faa5d2b8192ac/node_modules/vitepress-mermaid-renderer/dist/vitepress-mermaid-renderer.js
var Ie = {
	key: 1,
	class: "zoom-level"
};
var We = {
	key: 0,
	class: "copied-notification"
};
var Ye = { class: "mobile-utility-controls" };
var Ue = {
	key: 1,
	class: "zoom-level mobile-zoom-level"
};
var Ve = {
	key: 0,
	class: "copied-notification"
};
var qe = /* @__PURE__ */ defineComponent({
	__name: "MermaidControls",
	props: {
		scale: {},
		code: {},
		isFullscreen: { type: Boolean },
		toolbar: {}
	},
	emits: [
		"zoomIn",
		"zoomOut",
		"resetView",
		"toggleFullscreen",
		"panUp",
		"panDown",
		"panLeft",
		"panRight",
		"download"
	],
	setup(t, { expose: e, emit: r }) {
		const o = t, a = () => o.isFullscreen ? o.toolbar.fullscreen : o.toolbar.desktop, p = () => o.isFullscreen ? o.toolbar.fullscreen : o.toolbar.mobile, d = (l) => a().buttons[l] === "enabled", w = (l) => p().buttons[l] === "enabled", z = r, C = ref(null), k = ref(null), M = ref(!1), y = (l) => [`toolbar-vertical-${l.vertical}`, `toolbar-horizontal-${l.horizontal}`], u = computed(() => {
			const l = a().positions;
			return y(l);
		}), L = computed(() => {
			const l = p().positions;
			return y(l);
		}), S = (l) => Object.values(l).some((n) => n === "enabled"), v = computed(() => a().zoomLevel === "enabled"), R = computed(() => p().zoomLevel === "enabled"), c = computed(() => {
			const l = a();
			return S(l.buttons) || v.value;
		}), Y = computed(() => {
			const l = p();
			return S(l.buttons) || R.value;
		}), D = async () => {
			try {
				if (!navigator.clipboard) throw new Error("Clipboard API not available in this browser.");
				await navigator.clipboard.writeText(o.code), M.value = !0, setTimeout(() => {
					M.value = !1;
				}, 1e3);
			} catch (l) {
				console.error("Failed to copy diagram code:", l), alert("Failed to copy to clipboard. Your browser might not support this feature.");
			}
		}, T = () => {
			z("download", o.toolbar.downloadFormat);
		}, X = () => {
			try {
				o.isFullscreen ? (C.value && C.value.classList.add("force-show"), k.value && k.value.classList.add("force-show")) : (C.value && C.value.classList.remove("force-show"), k.value && k.value.classList.remove("force-show"));
			} catch (l) {
				console.error("Error updating fullscreen controls:", l);
			}
		};
		return onMounted(() => {
			C.value && (C.value.style.opacity = "1", C.value.style.visibility = "visible"), k.value && (k.value.style.opacity = "1", k.value.style.visibility = "visible");
		}), e({ updateFullscreenControls: X }), (l, n) => (openBlock(), createElementBlock("div", null, [c.value ? (openBlock(), createElementBlock("div", {
			key: 0,
			class: normalizeClass(["desktop-controls controls visible-controls", u.value]),
			ref_key: "controls",
			ref: C
		}, [
			d("zoomIn") ? (openBlock(), createElementBlock("button", {
				key: 0,
				onClick: n[0] || (n[0] = (O) => l.$emit("zoomIn")),
				title: "Zoom In"
			}, [...n[8] || (n[8] = [createStaticVNode("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><circle cx=\"11\" cy=\"11\" r=\"8\"></circle><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"></line><line x1=\"11\" y1=\"8\" x2=\"11\" y2=\"14\"></line><line x1=\"8\" y1=\"11\" x2=\"14\" y2=\"11\"></line></svg>", 1)])])) : createCommentVNode("", !0),
			v.value ? (openBlock(), createElementBlock("span", Ie, toDisplayString(Math.round(t.scale * 100)) + "% ", 1)) : createCommentVNode("", !0),
			d("zoomOut") ? (openBlock(), createElementBlock("button", {
				key: 2,
				onClick: n[1] || (n[1] = (O) => l.$emit("zoomOut")),
				title: "Zoom Out"
			}, [...n[9] || (n[9] = [createBaseVNode("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: "20",
				height: "20",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor"
			}, [
				createBaseVNode("circle", {
					cx: "11",
					cy: "11",
					r: "8"
				}),
				createBaseVNode("line", {
					x1: "21",
					y1: "21",
					x2: "16.65",
					y2: "16.65"
				}),
				createBaseVNode("line", {
					x1: "8",
					y1: "11",
					x2: "14",
					y2: "11"
				})
			], -1)])])) : createCommentVNode("", !0),
			d("resetView") ? (openBlock(), createElementBlock("button", {
				key: 3,
				onClick: n[2] || (n[2] = (O) => l.$emit("resetView")),
				title: "Reset View"
			}, [...n[10] || (n[10] = [createBaseVNode("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: "20",
				height: "20",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor"
			}, [createBaseVNode("path", { d: "M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.9 3.2L21 8" }), createBaseVNode("path", { d: "M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.9-3.2L3 16" })], -1)])])) : createCommentVNode("", !0),
			d("copyCode") ? (openBlock(), createElementBlock("button", {
				key: 4,
				onClick: D,
				title: "Copy Code"
			}, [n[11] || (n[11] = createBaseVNode("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: "20",
				height: "20",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor"
			}, [createBaseVNode("rect", {
				x: "9",
				y: "9",
				width: "13",
				height: "13",
				rx: "2",
				ry: "2"
			}), createBaseVNode("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })], -1)), M.value ? (openBlock(), createElementBlock("span", We, "Copied")) : createCommentVNode("", !0)])) : createCommentVNode("", !0),
			d("download") ? (openBlock(), createElementBlock("button", {
				key: 5,
				onClick: T,
				title: "Download Diagram"
			}, [...n[12] || (n[12] = [createBaseVNode("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: "20",
				height: "20",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor"
			}, [
				createBaseVNode("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
				createBaseVNode("polyline", { points: "7 10 12 15 17 10" }),
				createBaseVNode("line", {
					x1: "12",
					y1: "15",
					x2: "12",
					y2: "3"
				})
			], -1)])])) : createCommentVNode("", !0),
			d("toggleFullscreen") ? (openBlock(), createElementBlock("button", {
				key: 6,
				onClick: n[3] || (n[3] = (O) => l.$emit("toggleFullscreen")),
				title: "Toggle Fullscreen"
			}, [...n[13] || (n[13] = [createBaseVNode("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: "20",
				height: "20",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor"
			}, [createBaseVNode("path", { d: "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" })], -1)])])) : createCommentVNode("", !0)
		], 2)) : createCommentVNode("", !0), Y.value ? (openBlock(), createElementBlock("div", {
			key: 1,
			class: normalizeClass(["mobile-controls controls visible-controls", L.value]),
			ref_key: "mobileControls",
			ref: k
		}, [createBaseVNode("div", Ye, [
			w("zoomIn") ? (openBlock(), createElementBlock("button", {
				key: 0,
				onClick: n[4] || (n[4] = (O) => l.$emit("zoomIn")),
				title: "Zoom In"
			}, [...n[14] || (n[14] = [createStaticVNode("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><circle cx=\"11\" cy=\"11\" r=\"8\"></circle><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"></line><line x1=\"11\" y1=\"8\" x2=\"11\" y2=\"14\"></line><line x1=\"8\" y1=\"11\" x2=\"14\" y2=\"11\"></line></svg>", 1)])])) : createCommentVNode("", !0),
			R.value ? (openBlock(), createElementBlock("span", Ue, toDisplayString(Math.round(t.scale * 100)) + "% ", 1)) : createCommentVNode("", !0),
			w("zoomOut") ? (openBlock(), createElementBlock("button", {
				key: 2,
				onClick: n[5] || (n[5] = (O) => l.$emit("zoomOut")),
				title: "Zoom Out"
			}, [...n[15] || (n[15] = [createBaseVNode("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: "20",
				height: "20",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor"
			}, [
				createBaseVNode("circle", {
					cx: "11",
					cy: "11",
					r: "8"
				}),
				createBaseVNode("line", {
					x1: "21",
					y1: "21",
					x2: "16.65",
					y2: "16.65"
				}),
				createBaseVNode("line", {
					x1: "8",
					y1: "11",
					x2: "14",
					y2: "11"
				})
			], -1)])])) : createCommentVNode("", !0),
			w("resetView") ? (openBlock(), createElementBlock("button", {
				key: 3,
				onClick: n[6] || (n[6] = (O) => l.$emit("resetView")),
				title: "Reset View"
			}, [...n[16] || (n[16] = [createBaseVNode("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: "20",
				height: "20",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor"
			}, [createBaseVNode("path", { d: "M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.9 3.2L21 8" }), createBaseVNode("path", { d: "M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.9-3.2L3 16" })], -1)])])) : createCommentVNode("", !0),
			w("copyCode") ? (openBlock(), createElementBlock("button", {
				key: 4,
				onClick: D,
				title: "Copy Code"
			}, [n[17] || (n[17] = createBaseVNode("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: "20",
				height: "20",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor"
			}, [createBaseVNode("rect", {
				x: "9",
				y: "9",
				width: "13",
				height: "13",
				rx: "2",
				ry: "2"
			}), createBaseVNode("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })], -1)), M.value ? (openBlock(), createElementBlock("span", Ve, "Copied")) : createCommentVNode("", !0)])) : createCommentVNode("", !0),
			w("download") ? (openBlock(), createElementBlock("button", {
				key: 5,
				onClick: T,
				title: "Download Diagram"
			}, [...n[18] || (n[18] = [createBaseVNode("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: "20",
				height: "20",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor"
			}, [
				createBaseVNode("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
				createBaseVNode("polyline", { points: "7 10 12 15 17 10" }),
				createBaseVNode("line", {
					x1: "12",
					y1: "15",
					x2: "12",
					y2: "3"
				})
			], -1)])])) : createCommentVNode("", !0),
			w("toggleFullscreen") ? (openBlock(), createElementBlock("button", {
				key: 6,
				onClick: n[7] || (n[7] = (O) => l.$emit("toggleFullscreen")),
				title: "Toggle Fullscreen"
			}, [...n[19] || (n[19] = [createBaseVNode("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: "20",
				height: "20",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor"
			}, [createBaseVNode("path", { d: "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" })], -1)])])) : createCommentVNode("", !0)
		])], 2)) : createCommentVNode("", !0)]));
	}
});
var Xe = {
	key: 0,
	class: "diagram-error"
};
var je = { class: "error-message" };
var He = {
	key: 0,
	class: "error-details"
};
var Ze = /* @__PURE__ */ defineComponent({
	__name: "MermaidError",
	props: {
		renderError: { type: Boolean },
		renderErrorDetails: {}
	},
	setup(t) {
		const e = ref(!1), r = () => {
			e.value = !e.value;
		};
		return (o, a) => t.renderError ? (openBlock(), createElementBlock("div", Xe, [createBaseVNode("div", je, [
			a[0] || (a[0] = createBaseVNode("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: "24",
				height: "24",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor"
			}, [
				createBaseVNode("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}),
				createBaseVNode("line", {
					x1: "12",
					y1: "8",
					x2: "12",
					y2: "12"
				}),
				createBaseVNode("line", {
					x1: "12",
					y1: "16",
					x2: "12.01",
					y2: "16"
				})
			], -1)),
			a[1] || (a[1] = createBaseVNode("span", null, "Failed to render diagram", -1)),
			createBaseVNode("button", {
				onClick: r,
				class: "error-toggle-button"
			}, toDisplayString(e.value ? "Hide Details" : "Show Details"), 1)
		]), e.value ? (openBlock(), createElementBlock("pre", He, toDisplayString(t.renderErrorDetails), 1)) : createCommentVNode("", !0)])) : createCommentVNode("", !0);
	}
});
var Ge = (t, e) => {
	const r = t.__vccOpts || t;
	for (const [o, a] of e) r[o] = a;
	return r;
};
var Qe = /* @__PURE__ */ Ge(Ze, [["__scopeId", "data-v-41babc14"]]);
function Ke() {
	const t = ref(1), e = ref(0), r = ref(0), o = ref(!1), a = ref(!1), p = ref(0), d = ref(0), w = ref(0), z = ref(!1), C = ref(0), k = ref(0), M = 50;
	return {
		scale: t,
		translateX: e,
		translateY: r,
		isPanning: o,
		isFullscreen: a,
		zoomIn: () => {
			t.value = t.value * 1.2;
		},
		zoomOut: () => {
			t.value > .2 && (t.value = t.value / 1.2);
		},
		resetView: () => {
			t.value = 1, e.value = 0, r.value = 0;
		},
		toggleFullscreen: (i) => {
			try {
				if (document.fullscreenElement) document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.msExitFullscreen && document.msExitFullscreen(), a.value = !1;
				else {
					if (i?.requestFullscreen) i.requestFullscreen();
					else if (i?.webkitRequestFullscreen) i.webkitRequestFullscreen();
					else if (i?.mozRequestFullScreen) i.mozRequestFullScreen();
					else if (i?.msRequestFullscreen) i.msRequestFullscreen();
					else throw new Error("Fullscreen API not available");
					a.value = !0;
				}
			} catch (x) {
				console.error("Fullscreen error:", x), alert("Fullscreen mode is not supported in this browser.");
			}
		},
		startPan: (i) => {
			o.value = !0, p.value = i.clientX, d.value = i.clientY;
		},
		pan: (i) => {
			if (!o.value) return;
			const x = i.clientX - p.value, F = i.clientY - d.value;
			e.value += x / t.value, r.value += F / t.value, p.value = i.clientX, d.value = i.clientY;
		},
		endPan: () => {
			o.value = !1;
		},
		handleWheel: (i) => {
			if (!(i.ctrlKey || a.value)) return;
			i.preventDefault();
			const F = -Math.sign(i.deltaY) * .1, P = t.value * (1 + F);
			P >= .2 && P <= 10 && (t.value = P);
		},
		handleTouchStart: (i) => {
			if (i.touches.length === 1) z.value = !0, C.value = i.touches[0].clientX, k.value = i.touches[0].clientY;
			else if (i.touches.length === 2) {
				z.value = !1;
				const x = i.touches[0], F = i.touches[1];
				w.value = Math.hypot(F.clientX - x.clientX, F.clientY - x.clientY);
			}
		},
		handleTouchMove: (i) => {
			if (i.preventDefault(), z.value && i.touches.length === 1) {
				const x = i.touches[0], F = x.clientX - C.value, P = x.clientY - k.value;
				e.value += F / t.value, r.value += P / t.value, C.value = x.clientX, k.value = x.clientY;
			} else if (i.touches.length === 2) {
				const x = i.touches[0], F = i.touches[1], P = Math.hypot(F.clientX - x.clientX, F.clientY - x.clientY);
				if (w.value > 0) {
					const J = P / w.value, A = t.value * (1 + (J - 1) * .2);
					A >= .2 && A <= 10 && (t.value = A), w.value = P;
				}
			}
		},
		handleTouchEnd: () => {
			z.value = !1, w.value = 0;
		},
		panUp: () => {
			r.value -= M / t.value;
		},
		panDown: () => {
			r.value += M / t.value;
		},
		panLeft: () => {
			e.value -= M / t.value;
		},
		panRight: () => {
			e.value += M / t.value;
		},
		updateFullscreenControls: (i) => {
			try {
				document.fullscreenElement ? (a.value = !0, i.controls && i.controls.classList.add("force-show"), i.mobileControls && i.mobileControls.classList.add("force-show")) : (a.value = !1, i.controls && i.controls.classList.remove("force-show"), i.mobileControls && i.mobileControls.classList.remove("force-show"));
			} catch (x) {
				console.error("Error updating fullscreen controls:", x);
			}
		}
	};
}
var ge = Promise.resolve();
var Je = (t) => {
	const e = ge.catch(() => {}).then(() => t());
	return ge = e.catch(() => {}), e;
};
function _e(t = {}) {
	const e = ref(!1), r = ref(!1), o = ref(!1), a = ref(""), p = ref({
		width: 0,
		height: 0
	}), d = ref(null), w = {
		theme: "default",
		securityLevel: "loose",
		startOnLoad: !1,
		flowchart: {
			useMaxWidth: !1,
			htmlLabels: !0
		},
		sequence: {
			diagramMarginX: 50,
			diagramMarginY: 10,
			actorMargin: 50,
			width: 150,
			height: 65,
			boxMargin: 10,
			boxTextMargin: 5,
			noteMargin: 10,
			messageMargin: 35,
			mirrorActors: !0,
			bottomMarginAdj: 1,
			useMaxWidth: !1,
			rightAngles: !1,
			showSequenceNumbers: !1
		},
		gantt: {
			useMaxWidth: !1,
			topPadding: 50,
			leftPadding: 50,
			rightPadding: 50,
			gridLineStartPadding: 35,
			barHeight: 50,
			barGap: 40,
			displayMode: "compact",
			axisFormat: "%Y-%m-%d",
			topAxis: !1,
			tickInterval: "day",
			useWidth: 2048
		},
		class: {
			arrowMarkerAbsolute: !1,
			useMaxWidth: !1
		},
		journey: { useMaxWidth: !1 },
		pie: {},
		c4: {
			useMaxWidth: !1,
			diagramMarginX: 20,
			diagramMarginY: 20
		},
		gitGraph: {
			useMaxWidth: !1,
			rotateCommitLabel: !1,
			showBranches: !0,
			showCommitLabel: !0,
			mainBranchName: "main"
		}
	}, z = (y) => {
		const u = {
			...w,
			...t.config,
			...y
		};
		mermaid_default.initialize({ ...u });
	}, C = (y) => {
		z(y.detail);
		const L = d.value;
		L && (r.value = !1, nextTick(() => {
			M(L.id, L.code);
		}));
	}, k = (y) => {
		const u = y.trim().toLowerCase();
		return u.startsWith("c4context") || u.startsWith("c4container") || u.startsWith("c4component") || u.startsWith("c4dynamic") || u.startsWith("c4deployment") ? "c4" : u.startsWith("gitgraph") || u.includes("gitgraph:") ? "gitgraph" : u.startsWith("flowchart") || u.startsWith("graph") ? "flowchart" : u.startsWith("sequencediagram") || u.startsWith("sequenceDiagram") ? "sequence" : u.startsWith("gantt") ? "gantt" : "unknown";
	}, M = async (y, u, L = 0, S = 3) => {
		try {
			let v = document.getElementById(y);
			if (!v) {
				if (console.warn(`[Mermaid] Diagram container element not found, attempt ${L + 1}/${S + 1}`), L < S) {
					const R = 100 * Math.pow(2, L);
					return await new Promise((c) => setTimeout(c, R)), M(y, u, L + 1, S);
				}
				throw new Error("Failed to find diagram container element");
			}
			d.value = {
				id: y,
				code: u
			}, v.textContent = u, v.removeAttribute("data-processed"), o.value = !1, a.value = "", r.value = !1, v.classList.add("mermaid-rendering"), await Je(async () => {
				const R = typeof window < "u";
				try {
					if (await mermaid_default.run({
						nodes: [v],
						suppressErrors: !1
					}), await new Promise((c) => setTimeout(c, R ? 150 : 50)), v.firstElementChild) {
						const c = v.querySelector("svg");
						if (c) {
							if (await new Promise((D) => setTimeout(D, R ? 150 : 50)), v.parentElement?.querySelector(".diagram-wrapper")) {
								const D = k(u);
								if (v.classList.add(`mermaid-${D}`), D === "c4" || D === "gitgraph") {
									if (c.style.width = "100%", c.style.height = "auto", c.style.maxWidth = "100%", c.style.display = "block", c.removeAttribute("width"), c.removeAttribute("height"), !c.getAttribute("viewBox")) try {
										const T = c.getBBox();
										T.width && T.height && (c.setAttribute("viewBox", `0 0 ${T.width} ${T.height}`), c.setAttribute("preserveAspectRatio", "xMidYMid meet"));
									} catch (T) {
										console.warn("Could not set viewBox for diagram:", T);
									}
									c.style.display = "none", c.offsetHeight, c.style.display = "block";
								}
							}
							p.value = {
								width: c.getBoundingClientRect().width,
								height: c.getBoundingClientRect().height
							};
						}
					}
					r.value = !0, o.value = !1, t.onRenderComplete?.({
						id: y,
						success: !0
					});
				} catch (c) {
					console.error("Failed to render mermaid diagram:", c), o.value = !0, a.value = c instanceof Error ? c.toString() : "Unknown error rendering diagram", r.value = !0, t.onRenderComplete?.({
						id: y,
						success: !1,
						error: c
					}), R && L === 0 && setTimeout(() => {
						M(y, u, L + 1, S);
					}, 1e3);
				} finally {
					v.classList.remove("mermaid-rendering");
				}
			});
		} catch (v) {
			console.error("Error in diagram initialization:", v), o.value = !0, a.value = v instanceof Error ? v.toString() : "Unknown error initializing component", t.onRenderComplete?.({
				id: y,
				success: !1,
				error: v
			});
		}
	};
	return onMounted(() => {
		e.value = !0, z(), document.addEventListener("vitepress-mermaid:config-updated", C);
	}), onUnmounted(() => {
		document.removeEventListener("vitepress-mermaid:config-updated", C);
	}), {
		mounted: e,
		isRendered: r,
		renderError: o,
		renderErrorDetails: a,
		originalDiagramSize: p,
		renderMermaidDiagram: M,
		detectDiagramType: k
	};
}
var et = (t) => {
	const e = t;
	return !!(e && e.desktop && typeof e.desktop == "object" && "buttons" in e.desktop && "positions" in e.desktop && "zoomLevel" in e.desktop && typeof e.showLanguageLabel == "boolean" && typeof e.downloadFormat == "string");
};
var V = {
	desktop: {
		buttons: {
			zoomIn: "enabled",
			zoomOut: "enabled",
			resetView: "enabled",
			copyCode: "enabled",
			toggleFullscreen: "enabled",
			download: "disabled"
		},
		positions: {
			vertical: "bottom",
			horizontal: "right"
		},
		zoomLevel: "enabled"
	},
	mobile: {
		buttons: {
			zoomIn: "disabled",
			zoomOut: "disabled",
			resetView: "enabled",
			copyCode: "enabled",
			toggleFullscreen: "enabled",
			download: "disabled"
		},
		positions: {
			vertical: "bottom",
			horizontal: "right"
		},
		zoomLevel: "enabled"
	},
	fullscreen: {
		buttons: {
			zoomIn: "disabled",
			zoomOut: "disabled",
			resetView: "disabled",
			copyCode: "disabled",
			toggleFullscreen: "enabled",
			download: "disabled"
		},
		positions: {
			vertical: "bottom",
			horizontal: "right"
		},
		zoomLevel: "enabled"
	},
	showLanguageLabel: !0,
	downloadFormat: "svg"
};
var tt = (t, e) => ({
	vertical: e?.vertical ?? t.vertical,
	horizontal: e?.horizontal ?? t.horizontal
});
var be = (t) => t === "enabled" || t === "disabled";
var ot = (t, e) => {
	if (!e) return { ...t };
	const r = { ...t };
	return Object.keys(e).forEach((o) => {
		if (o === "positions" || o === "zoomLevel") return;
		const a = o, p = e[a];
		be(p) && (r[a] = p);
	}), r;
};
var ee = (t, e) => ({
	buttons: ot(t.buttons, e),
	positions: tt(t.positions, e?.positions),
	zoomLevel: e?.zoomLevel && be(e.zoomLevel) ? e.zoomLevel : t.zoomLevel
});
var oe = (t) => {
	const e = t?.showLanguageLabel ?? V.showLanguageLabel, r = t?.downloadFormat ?? V.downloadFormat;
	return {
		desktop: ee(V.desktop, t?.desktop),
		mobile: ee(V.mobile, t?.mobile),
		fullscreen: ee(V.fullscreen, t?.fullscreen),
		showLanguageLabel: e,
		downloadFormat: r
	};
};
var rt = /* @__PURE__ */ defineComponent({
	__name: "MermaidDiagram",
	props: {
		code: {},
		config: {},
		toolbar: {}
	},
	emits: ["renderComplete"],
	setup(t, { emit: e }) {
		const r = e, o = t, a = computed(() => o.toolbar && et(o.toolbar) ? o.toolbar : oe(o.toolbar)), p = Ke(), d = _e({
			config: o.config,
			onRenderComplete: (f) => r("renderComplete", f)
		}), { scale: w, translateX: z, translateY: C, isPanning: k, isFullscreen: M, zoomIn: y, zoomOut: u, resetView: L, toggleFullscreen: S, startPan: v, pan: R, endPan: c, handleWheel: Y, handleTouchStart: D, handleTouchMove: T, handleTouchEnd: X, panUp: l, panDown: n, panLeft: O, panRight: ie, updateFullscreenControls: ae } = p, { mounted: i, isRendered: x, renderError: F, renderErrorDetails: P, renderMermaidDiagram: J } = d, A = ref(null), se = ref(null), _ = `mermaid-${getCurrentInstance()?.uid ?? Math.random().toString(36).slice(2)}`, ye = () => {
			S(se.value);
		}, xe = async (f) => {
			const j = document.getElementById(_)?.querySelector("svg");
			if (!j) {
				console.error("SVG element not found for download");
				return;
			}
			const le = j.cloneNode(!0);
			f !== "svg" && (le.style.backgroundColor = "white");
			const De = new XMLSerializer().serializeToString(le), Se = new Blob([De], { type: "image/svg+xml;charset=utf-8" }), U = URL.createObjectURL(Se), B = document.createElement("a");
			if (B.download = `diagram.${f}`, f === "svg") B.href = U, document.body.appendChild(B), B.click(), document.body.removeChild(B), URL.revokeObjectURL(U);
			else {
				const H = new Image();
				H.onload = () => {
					const W = document.createElement("canvas"), ce = j.viewBox.baseVal;
					let Z = ce?.width, G = ce?.height;
					if (!Z || !G) {
						const K = j.getBoundingClientRect();
						Z = K.width, G = K.height;
					}
					W.width = Z, W.height = G;
					const Q = W.getContext("2d");
					if (Q) {
						Q.fillStyle = "white", Q.fillRect(0, 0, Z, G), Q.drawImage(H, 0, 0);
						const K = f === "png" ? "image/png" : "image/jpeg", Pe = W.toDataURL(K);
						B.href = Pe, document.body.appendChild(B), B.click(), document.body.removeChild(B);
					}
					URL.revokeObjectURL(U);
				}, H.onerror = (W) => {
					console.error("Failed to load SVG for conversion", W), URL.revokeObjectURL(U);
				}, H.src = U;
			}
		}, Ce = (f) => {
			v(f);
		}, ke = (f) => {
			R(f);
		}, Ee = () => {
			c();
		}, Me = () => {
			c();
		}, Le = (f) => {
			Y(f);
		}, ze = (f) => {
			D(f);
		}, Fe = (f) => {
			T(f);
		}, Te = () => {
			X();
		}, $ = () => {
			const f = {
				controls: A.value?.$refs.controls,
				mobileControls: A.value?.$refs.mobileControls
			};
			ae(f);
		};
		return onMounted(async () => {
			try {
				await nextTick(), await J(_, o.code), document.addEventListener("fullscreenchange", $), document.addEventListener("webkitfullscreenchange", $), document.addEventListener("mozfullscreenchange", $), document.addEventListener("MSFullscreenChange", $);
			} catch (f) {
				console.error("Error in component initialization:", f);
			}
		}), onUnmounted(() => {
			document.removeEventListener("fullscreenchange", $), document.removeEventListener("webkitfullscreenchange", $), document.removeEventListener("mozfullscreenchange", $), document.removeEventListener("MSFullscreenChange", $);
		}), (f, Re) => unref(i) ? (openBlock(), createElementBlock("div", {
			key: 0,
			ref_key: "fullscreenWrapper",
			ref: se,
			class: "mermaid-container",
			"data-fullscreen-wrapper": ""
		}, [
			createVNode(qe, {
				ref_key: "controlsRef",
				ref: A,
				scale: unref(w),
				code: t.code,
				"is-fullscreen": unref(M),
				onZoomIn: unref(y),
				onZoomOut: unref(u),
				onResetView: unref(L),
				onToggleFullscreen: ye,
				onPanUp: unref(l),
				onPanDown: unref(n),
				onPanLeft: unref(O),
				onPanRight: unref(ie),
				onDownload: xe,
				toolbar: a.value
			}, null, 8, [
				"scale",
				"code",
				"is-fullscreen",
				"onZoomIn",
				"onZoomOut",
				"onResetView",
				"onPanUp",
				"onPanDown",
				"onPanLeft",
				"onPanRight",
				"toolbar"
			]),
			createVNode(Qe, {
				"render-error": unref(F),
				"render-error-details": unref(P)
			}, null, 8, ["render-error", "render-error-details"]),
			createBaseVNode("div", {
				class: "diagram-wrapper",
				onMousedown: Ce,
				onMousemove: ke,
				onMouseup: Ee,
				onMouseleave: Me,
				onWheel: Le,
				onTouchstart: ze,
				onTouchmove: Fe,
				onTouchend: Te
			}, [createBaseVNode("div", {
				id: _,
				class: "mermaid",
				style: normalizeStyle({
					opacity: unref(x) ? 1 : 0,
					transform: `scale(${unref(w)}) translate(${unref(z)}px, ${unref(C)}px)`,
					cursor: unref(k) ? "grabbing" : "grab"
				})
			}, toDisplayString(t.code), 5)], 32)
		], 512)) : createCommentVNode("", !0);
	}
});
var I = class I {
	static instance;
	config;
	toolbarConfig;
	initialized = !1;
	renderAttempts = 0;
	maxRenderAttempts = 15;
	retryTimeout = null;
	renderQueue = [];
	isRendering = !1;
	initialPageRenderComplete = !1;
	hydrationComplete = !1;
	mutationObserver = null;
	/**
	* Private constructor to enforce singleton pattern.
	* Initializes the configuration and sets up the renderer environment.
	*
	* @param config - Optional initial Mermaid configuration.
	*/
	constructor(e) {
		this.config = e ? { ...e } : {}, this.toolbarConfig = oe(), this.initialize();
	}
	/**
	* Returns the singleton renderer instance, creating it on first call and merging any
	* optional configuration overrides into the active Mermaid settings.
	* @param config Optional partial Mermaid configuration supplied by the caller.
	*/
	static getInstance(e) {
		return I.instance ? e && I.instance.setConfig(e) : I.instance = new I(e), I.instance;
	}
	/**
	* Merges the provided Mermaid options into the runtime config and notifies listeners so
	* already-mounted diagrams can react to the new settings.
	* @param config Partial Mermaid configuration object to merge.
	*/
	setConfig(e) {
		this.config = {
			...this.config,
			...e
		}, this.dispatchConfigUpdate();
	}
	/**
	* Resolves and stores toolbar options used by upcoming diagram mounts, falling back to
	* defaults when no explicit configuration is supplied.
	* @param toolbar Toolbar customization options, optional.
	*/
	setToolbar(e) {
		this.toolbarConfig = oe(e);
	}
	/**
	* Dispatches a custom event to notify other parts of the application
	* that the Mermaid configuration has been updated.
	*
	* @event vitepress-mermaid:config-updated
	*/
	dispatchConfigUpdate() {
		try {
			document.dispatchEvent(new CustomEvent("vitepress-mermaid:config-updated", { detail: { ...this.config } }));
		} catch (e) {
			console.error("Failed to dispatch Mermaid config update:", e);
		}
	}
	/**
	* Removes unnecessary UI elements (like copy buttons and language labels)
	* from the Mermaid wrapper element to prepare it for rendering.
	*
	* @param wrapper - The DOM element containing the Mermaid code block.
	*/
	cleanupMermaidWrapper(e) {
		const r = e.getElementsByClassName("copy");
		if (Array.from(r).forEach((o) => o.remove()), !this.toolbarConfig.showLanguageLabel) {
			const o = e.getElementsByClassName("lang");
			Array.from(o).forEach((a) => a.remove());
		}
	}
	/**
	* Creates a Virtual DOM node for the Mermaid diagram using Vue's `h` function.
	* Encapsulates the logic for creating the wrapper div and determining the component props.
	*
	* @param code - The Mermaid source code string to be rendered.
	* @returns An object containing the wrapper DOM element and the Vue component VNode, or null if creation fails.
	*/
	createMermaidComponent(e) {
		try {
			const r = document.createElement("div");
			return r.id = `mermaid-wrapper-${Math.random().toString(36).slice(2)}`, r.className = "mermaid-wrapper", {
				wrapper: r,
				component: h(rt, {
					code: e,
					config: this.config,
					toolbar: this.toolbarConfig
				})
			};
		} catch (r) {
			return console.error("Failed to create mermaid component:", r), null;
		}
	}
	/**
	* Processes the next diagram in the rendering queue.
	* This method ensures diagrams are rendered sequentially to avoid race conditions
	* or heavy load spikes, and handles the completion of the initial page render.
	*
	* @returns A promise that resolves when the next diagram has been processed.
	*/
	async renderNextDiagram() {
		if (this.renderQueue.length === 0 || this.isRendering) return;
		this.isRendering = !0;
		const e = this.renderQueue.shift();
		if (e) try {
			await this.renderMermaidDiagram(e);
		} catch (r) {
			console.error("Failed to render diagram:", r);
		}
		this.isRendering = !1, this.renderQueue.length > 0 ? await this.renderNextDiagram() : this.initialPageRenderComplete || (this.initialPageRenderComplete = !0, this.hydrationComplete = !0);
	}
	/**
	* Renders a single Mermaid diagram by replacing the original `<pre>` element
	* with a Vue-mounted component.
	*
	* @param element - The HTMLPreElement containing the Mermaid code.
	* @returns A promise that resolves when the diagram is successfully mounted and rendered.
	*/
	async renderMermaidDiagram(e) {
		try {
			if (!e || !e.parentNode) return;
			const r = e.textContent?.trim() || "", o = this.createMermaidComponent(r);
			if (!o) return;
			const { wrapper: a, component: p } = o;
			return e.parentNode.replaceChild(a, e), new Promise((d) => {
				createApp({ render: () => p }).mount(a), setTimeout(d, 200);
			});
		} catch (r) {
			console.error("Failed to render mermaid diagram:", r);
		}
	}
	/**
	* Initializes the renderer lifecycle exactly once by wiring DOM readiness hooks,
	* VitePress navigation listeners, and the initial render/retry loop.
	*/
	initialize() {
		if (!this.initialized) try {
			const e = () => {
				if (!document || !document.body) {
					console.warn("MermaidRenderer initialization failed: document or body not available");
					return;
				}
				Promise.resolve().then(() => {
					requestAnimationFrame(() => {
						try {
							this.setupDomMutationObserver(), this.initializeRenderer();
						} catch (o) {
							console.error("Failed to initialize MermaidRenderer:", o instanceof Error ? o.message : "Unknown error");
						}
					});
				});
			};
			switch (document.readyState) {
				case "loading":
					document.addEventListener("DOMContentLoaded", e, { once: !0 });
					break;
				case "interactive":
				case "complete":
					e();
					break;
				default: console.warn(`MermaidRenderer: Unexpected document.readyState: ${document.readyState}`), e();
			}
			const r = () => {
				try {
					this.handleRouteChange();
				} catch (o) {
					console.error("Error handling route change:", o instanceof Error ? o.message : "Unknown error");
				}
			};
			window.addEventListener("popstate", r), document.addEventListener("vitepress:routeChanged", r), document.addEventListener("vitepress:ready", () => {
				this.renderWithRetry();
			}, { once: !0 }), typeof window < "u" && setTimeout(() => {
				this.renderWithRetry();
			}, 500), this.initialized = !0;
		} catch (e) {
			throw console.error("Critical error during MermaidRenderer initialization:", e instanceof Error ? e.message : "Unknown error"), e;
		}
	}
	/**
	* Sets up a MutationObserver to detect dynamic changes in the DOM.
	* This is crucial for determining when new Mermaid blocks are added to the page,
	* for instance during client-side navigation or asynchronous content loading.
	*/
	setupDomMutationObserver() {
		if (typeof window > "u" || typeof MutationObserver > "u" || typeof document > "u") return;
		const e = document.getElementById("app") || document.querySelector(".Layout") || document.body;
		if (!e) return;
		this.mutationObserver && this.mutationObserver.disconnect();
		let r = !1;
		this.mutationObserver = new MutationObserver((o) => {
			this.hasNewMermaidNodes(o) && (r || (r = !0, requestAnimationFrame(() => {
				r = !1, this.handleRouteChange();
			})));
		});
		try {
			this.mutationObserver.observe(e, {
				childList: !0,
				subtree: !0
			});
		} catch (o) {
			console.error("Failed to observe DOM mutations for Mermaid:", o);
		}
	}
	/**
	* Checks if any of the mutated nodes contain Mermaid code blocks.
	*
	* @param mutations - The list of MutationRecords from the MutationObserver.
	* @returns `true` if a relevant Mermaid node was added, `false` otherwise.
	*/
	hasNewMermaidNodes(e) {
		return e.some((r) => Array.from(r.addedNodes).some((o) => this.nodeContainsMermaidCode(o)));
	}
	/**
	* Recursively checks if a DOM node or its children contain a Mermaid code block.
	*
	* @param node - The DOM node to inspect.
	* @returns `true` if the node is or contains a Mermaid code element, `false` otherwise.
	*/
	nodeContainsMermaidCode(e) {
		if (!e) return !1;
		if (e.nodeType === Node.ELEMENT_NODE) {
			const r = e;
			if (r.closest(".mermaid-wrapper")) return !1;
			if (r.classList.contains("language-mermaid") || r.matches?.("code.mermaid") || r.querySelector(".language-mermaid, pre.language-mermaid, code.language-mermaid, code.mermaid")) return !0;
		}
		return e.nodeType === Node.DOCUMENT_FRAGMENT_NODE && e.hasChildNodes() ? Array.from(e.childNodes).some((r) => this.nodeContainsMermaidCode(r)) : !1;
	}
	/**
	* Resets the rendering state and initiates the render-retry loop.
	* Typically called on page load or after a significant DOM change.
	*/
	initializeRenderer() {
		this.renderAttempts = 0, this.initialPageRenderComplete = !1, this.renderWithRetry();
	}
	/**
	* Handles route changes in the VitePress application.
	* Clears existing timeouts and resets the renderer to process diagrams on the new page.
	*/
	handleRouteChange() {
		this.renderAttempts = 0, this.initialPageRenderComplete = !1, this.retryTimeout && (clearTimeout(this.retryTimeout), this.retryTimeout = null), this.renderWithRetry();
	}
	/**
	* Attempts to discover and render Mermaid diagrams.
	* If no diagrams are found initially, it uses an exponential backoff strategy
	* to retry, accommodating slower environments or delayed hydration.
	*/
	renderWithRetry() {
		if (!this.renderMermaidDiagrams() && this.renderAttempts < this.maxRenderAttempts) {
			const r = Math.min(300 * Math.pow(1.4, this.renderAttempts), 1e4);
			this.retryTimeout && clearTimeout(this.retryTimeout), this.retryTimeout = setTimeout(() => {
				this.renderAttempts++, this.renderWithRetry();
			}, r);
		}
	}
	/**
	* Searches the document for Mermaid code blocks, cleans their wrappers, and pushes them
	* onto the rendering queue handled by the Vue-driven renderer.
	* @returns True if at least one diagram is discovered, otherwise false.
	*/
	renderMermaidDiagrams() {
		try {
			let e = document.getElementsByClassName("language-mermaid");
			if (e.length === 0) {
				const o = document.querySelectorAll("pre"), a = Array.from(o).filter((p) => {
					const d = p.querySelector("code");
					return !!(d && (d.className.includes("mermaid") || d.className.includes("language-mermaid")));
				});
				a.length > 0 && (e = {
					length: a.length,
					item(d) {
						return d >= 0 && d < a.length ? a[d] : null;
					},
					namedItem(d) {
						return null;
					},
					[Symbol.iterator]() {
						return a[Symbol.iterator]();
					},
					...a.reduce((d, w, z) => ({
						...d,
						[z]: w
					}), {})
				});
			}
			if (e.length === 0) return !1;
			Array.from(e).forEach((o) => this.cleanupMermaidWrapper(o));
			const r = Array.from(e).map((o) => {
				let a = o.querySelector("pre");
				return !a && o.tagName.toLowerCase() === "pre" && (a = o), a;
			}).filter((o) => o instanceof HTMLPreElement);
			return r.length > 0 && (this.renderQueue.push(...r), this.isRendering || this.renderNextDiagram()), r.length > 0;
		} catch (e) {
			return console.error("Error rendering Mermaid diagrams:", e), !1;
		}
	}
};
var nt = ".mermaid-container{position:relative;min-height:20rem;max-height:50vh;width:100%;overflow:hidden!important}.controls{--control-padding: .375rem;--control-gap: .25rem;--control-radius: .375rem;--control-shadow: 0 2px 4px rgba(0, 0, 0, .1);position:absolute;bottom:.75rem;right:.75rem;top:auto;left:auto;z-index:20;padding:var(--control-padding);border-radius:var(--control-radius);box-shadow:var(--control-shadow);opacity:0;visibility:visible;pointer-events:auto;transition:all .2s ease;background:var(--vp-c-bg)}.controls.toolbar-vertical-top{top:.75rem;bottom:auto}.controls.toolbar-vertical-bottom{bottom:.75rem;top:auto}.controls.toolbar-horizontal-left{left:.75rem;right:auto}.controls.toolbar-horizontal-right{right:.75rem;left:auto}.desktop-controls{display:inline-flex;align-items:center;gap:.375rem}.desktop-controls button{position:relative;padding:.375rem;border:none;background:var(--vp-c-bg);border-radius:.25rem;cursor:pointer;display:grid;place-items:center;color:var(--vp-c-text-1);transition:all .2s ease}.desktop-controls button:hover{background:var(--vp-c-bg-soft);transform:translateY(-1px);color:var(--vp-c-brand)}.desktop-controls button:active{transform:translateY(0)}.desktop-controls button svg{width:18px;height:18px;transition:transform .2s ease}.desktop-controls button:hover svg{transform:scale(1.1)}.mobile-controls{display:none;flex-direction:row;justify-content:center;gap:.5rem;padding:.75rem;width:auto;z-index:8}.mobile-utility-controls{display:flex;align-items:center;justify-content:center;gap:.5rem}.mobile-controls button{width:40px;height:40px;background:var(--vp-c-bg);border:1px solid var(--vp-c-border);border-radius:.25rem;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;transition:background .2s ease,transform .2s ease}.mobile-controls button:hover{background:var(--vp-c-bg-soft);transform:translateY(-1px)}.mobile-controls button:active{transform:translateY(0)}.mobile-controls button svg{width:20px;height:20px;stroke:var(--vp-c-text-1)}.zoom-level{min-width:3.25rem;text-align:center;font-size:.75rem;font-weight:500;color:var(--vp-c-text-2);-webkit-user-select:none;user-select:none;padding:.25rem .375rem;background:var(--vp-c-bg);border-radius:.25rem}.mobile-controls .zoom-level{margin-right:.5rem;min-width:3rem}.mobile-controls .mobile-zoom-level{order:-1}@media(max-width:768px){.desktop-controls{display:none}.mobile-controls{display:flex}}@media(min-width:769px){.mobile-controls{display:none}.desktop-controls{display:inline-flex}}.mermaid-container:hover .controls:not(.force-show){opacity:1;transform:translateY(0)}.mermaid-container:fullscreen .controls{opacity:1!important;transform:translateY(0)!important}.diagram-wrapper{overflow:hidden;position:relative;width:100%;height:100%;min-height:20rem;z-index:1}.mermaid-container:fullscreen .diagram-wrapper{background:var(--vp-c-bg);color:var(--vp-c-text-1);padding:20px;display:flex;align-items:center;justify-content:center;max-height:none}.mermaid{transition:opacity .3s ease-in-out;transform-origin:center center;display:inline-block}.mermaid-rendering{opacity:.5;position:relative}.mermaid-rendering:after{content:\"\";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:30px;height:30px;border:3px solid var(--vp-c-brand);border-top-color:transparent;border-radius:50%;animation:mermaid-spinner .8s linear infinite}@keyframes mermaid-spinner{to{transform:translate(-50%,-50%) rotate(360deg)}}.copied-notification{position:absolute;bottom:100%;left:50%;transform:translate(-50%);background:var(--vp-c-brand);color:#fff;padding:.375rem .75rem;border-radius:var(--control-radius);font-size:.75rem;font-weight:500;white-space:nowrap;margin-block-end:.5rem;opacity:0;animation:fadeInOut 2s ease-in-out;box-shadow:0 2px 4px #0000001a}@keyframes fadeInOut{0%{opacity:0;transform:translate(-50%,.5rem)}10%{opacity:1;transform:translate(-50%)}90%{opacity:1;transform:translate(-50%)}to{opacity:0;transform:translate(-50%,-.5rem)}}.visible-controls{opacity:1!important;visibility:visible!important;pointer-events:auto!important}.mobile-only{display:none!important}@media(max-width:768px){.mobile-only{display:grid!important}.controls{flex-direction:column;align-items:stretch}.zoom-level{text-align:center}}.diagram-error{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--vp-c-bg-soft);border:1px solid var(--vp-c-border);border-radius:.5rem;padding:1rem;max-width:90%;width:max-content;box-shadow:0 4px 8px #0000001a;z-index:10}.error-message{display:flex;align-items:center;gap:.75rem;color:var(--vp-c-danger);font-weight:500}.diagram-error .error-message svg{stroke:var(--vp-c-danger);flex-shrink:0}.error-toggle-button{margin-left:auto;background:var(--vp-c-bg);border:1px solid var(--vp-c-border);border-radius:.25rem;padding:.25rem .5rem;font-size:.75rem;cursor:pointer;transition:all .2s ease}.error-toggle-button:hover{background:var(--vp-c-bg-mute);transform:translateY(-1px)}.error-details{margin-top:1rem;padding:1rem;background:var(--vp-c-bg);border-radius:.25rem;white-space:pre-wrap;font-family:monospace;font-size:.85rem;overflow-x:auto;color:var(--vp-c-text-2);border:1px solid var(--vp-c-border);max-height:200px;overflow-y:auto}";
var pe = "vitepress-mermaid-renderer-styles";
var te = !1;
var it = () => {
	if (te || typeof document > "u") return;
	if (document.getElementById(pe)) {
		te = !0;
		return;
	}
	const t = document.createElement("style");
	t.id = pe, t.textContent = nt, document.head.appendChild(t), te = !0;
};
var we = typeof window < "u" && typeof document < "u";
var at = { setToolbar: () => {} };
we && it();
var dt = (t) => we ? I.getInstance(t) : at;
export { dt as createMermaidRenderer };
