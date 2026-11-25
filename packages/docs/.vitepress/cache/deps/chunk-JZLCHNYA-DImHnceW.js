import { t as getSubGraphTitleMargins } from "./chunk-CVBHYZKI-e8yBbzbU.js";
import { a as userNodeOverrides, i as styles2String, r as solidStateFill, t as compileStyles } from "./chunk-ATLVNIR6-jEvfyXQi.js";
import { n as createText, r as getIconSVG } from "./chunk-JA3XYJ7Z-BswxqsZx.js";
import { f as parseFontSize, i as decodeEntities, l as handleUndefinedAttr, n as calculateTextWidth } from "./chunk-S3R3BYOJ-cEvSc8CE.js";
import { A as parseGenericTypes, I as sanitizeText, L as sanitizeText3, N as renderKatexSanitized, O as hasKatex, b as getConfig2, d as defaultConfig_default, h as evaluate, s as common_default, y as getConfig } from "./chunk-ABZYJK2D-DaRgM5H6.js";
import { B as __name, R as select_default, V as log } from "./src-DE2kHKEO.js";
// ../../node_modules/.pnpm/roughjs@4.6.6/node_modules/roughjs/bundled/rough.esm.js
function t(t, e, s) {
	if (t && t.length) {
		const [n, o] = e, a = Math.PI / 180 * s, h = Math.cos(a), r = Math.sin(a);
		for (const e of t) {
			const [t, s] = e;
			e[0] = (t - n) * h - (s - o) * r + n, e[1] = (t - n) * r + (s - o) * h + o;
		}
	}
}
function e(t, e) {
	return t[0] === e[0] && t[1] === e[1];
}
function s(s, n, o, a = 1) {
	const h = o, r = Math.max(n, .1), i = s[0] && s[0][0] && "number" == typeof s[0][0] ? [s] : s, c = [0, 0];
	if (h) for (const e of i) t(e, c, h);
	const l = function(t, s, n) {
		const o = [];
		for (const s of t) {
			const t = [...s];
			e(t[0], t[t.length - 1]) || t.push([t[0][0], t[0][1]]), t.length > 2 && o.push(t);
		}
		const a = [];
		s = Math.max(s, .1);
		const h = [];
		for (const t of o) for (let e = 0; e < t.length - 1; e++) {
			const s = t[e], n = t[e + 1];
			if (s[1] !== n[1]) {
				const t = Math.min(s[1], n[1]);
				h.push({
					ymin: t,
					ymax: Math.max(s[1], n[1]),
					x: t === s[1] ? s[0] : n[0],
					islope: (n[0] - s[0]) / (n[1] - s[1])
				});
			}
		}
		if (h.sort(((t, e) => t.ymin < e.ymin ? -1 : t.ymin > e.ymin ? 1 : t.x < e.x ? -1 : t.x > e.x ? 1 : t.ymax === e.ymax ? 0 : (t.ymax - e.ymax) / Math.abs(t.ymax - e.ymax))), !h.length) return a;
		let r = [], i = h[0].ymin, c = 0;
		for (; r.length || h.length;) {
			if (h.length) {
				let t = -1;
				for (let e = 0; e < h.length && !(h[e].ymin > i); e++) t = e;
				h.splice(0, t + 1).forEach(((t) => {
					r.push({
						s: i,
						edge: t
					});
				}));
			}
			if (r = r.filter(((t) => !(t.edge.ymax <= i))), r.sort(((t, e) => t.edge.x === e.edge.x ? 0 : (t.edge.x - e.edge.x) / Math.abs(t.edge.x - e.edge.x))), (1 !== n || c % s == 0) && r.length > 1) for (let t = 0; t < r.length; t += 2) {
				const e = t + 1;
				if (e >= r.length) break;
				const s = r[t].edge, n = r[e].edge;
				a.push([[Math.round(s.x), i], [Math.round(n.x), i]]);
			}
			i += n, r.forEach(((t) => {
				t.edge.x = t.edge.x + n * t.edge.islope;
			})), c++;
		}
		return a;
	}(i, r, a);
	if (h) {
		for (const e of i) t(e, c, -h);
		(function(e, s, n) {
			const o = [];
			e.forEach(((t) => o.push(...t))), t(o, s, n);
		})(l, c, -h);
	}
	return l;
}
function n(t, e) {
	var n;
	const o = e.hachureAngle + 90;
	let a = e.hachureGap;
	a < 0 && (a = 4 * e.strokeWidth), a = Math.round(Math.max(a, .1));
	let h = 1;
	return e.roughness >= 1 && ((null === (n = e.randomizer) || void 0 === n ? void 0 : n.next()) || Math.random()) > .7 && (h = a), s(t, a, o, h || 1);
}
var o = class {
	constructor(t) {
		this.helper = t;
	}
	fillPolygons(t, e) {
		return this._fillPolygons(t, e);
	}
	_fillPolygons(t, e) {
		const s = n(t, e);
		return {
			type: "fillSketch",
			ops: this.renderLines(s, e)
		};
	}
	renderLines(t, e) {
		const s = [];
		for (const n of t) s.push(...this.helper.doubleLineOps(n[0][0], n[0][1], n[1][0], n[1][1], e));
		return s;
	}
};
function a(t) {
	const e = t[0], s = t[1];
	return Math.sqrt(Math.pow(e[0] - s[0], 2) + Math.pow(e[1] - s[1], 2));
}
var h = class extends o {
	fillPolygons(t, e) {
		let s = e.hachureGap;
		s < 0 && (s = 4 * e.strokeWidth), s = Math.max(s, .1);
		const o = n(t, Object.assign({}, e, { hachureGap: s })), h = Math.PI / 180 * e.hachureAngle, r = [], i = .5 * s * Math.cos(h), c = .5 * s * Math.sin(h);
		for (const [t, e] of o) a([t, e]) && r.push([[t[0] - i, t[1] + c], [...e]], [[t[0] + i, t[1] - c], [...e]]);
		return {
			type: "fillSketch",
			ops: this.renderLines(r, e)
		};
	}
};
var r = class extends o {
	fillPolygons(t, e) {
		const s = this._fillPolygons(t, e), n = Object.assign({}, e, { hachureAngle: e.hachureAngle + 90 }), o = this._fillPolygons(t, n);
		return s.ops = s.ops.concat(o.ops), s;
	}
};
var i = class {
	constructor(t) {
		this.helper = t;
	}
	fillPolygons(t, e) {
		const s = n(t, e = Object.assign({}, e, { hachureAngle: 0 }));
		return this.dotsOnLines(s, e);
	}
	dotsOnLines(t, e) {
		const s = [];
		let n = e.hachureGap;
		n < 0 && (n = 4 * e.strokeWidth), n = Math.max(n, .1);
		let o = e.fillWeight;
		o < 0 && (o = e.strokeWidth / 2);
		const h = n / 4;
		for (const r of t) {
			const t = a(r), i = t / n, c = Math.ceil(i) - 1, l = t - c * n, u = (r[0][0] + r[1][0]) / 2 - n / 4, p = Math.min(r[0][1], r[1][1]);
			for (let t = 0; t < c; t++) {
				const a = p + l + t * n, r = u - h + 2 * Math.random() * h, i = a - h + 2 * Math.random() * h, c = this.helper.ellipse(r, i, o, o, e);
				s.push(...c.ops);
			}
		}
		return {
			type: "fillSketch",
			ops: s
		};
	}
};
var c = class {
	constructor(t) {
		this.helper = t;
	}
	fillPolygons(t, e) {
		const s = n(t, e);
		return {
			type: "fillSketch",
			ops: this.dashedLine(s, e)
		};
	}
	dashedLine(t, e) {
		const s = e.dashOffset < 0 ? e.hachureGap < 0 ? 4 * e.strokeWidth : e.hachureGap : e.dashOffset, n = e.dashGap < 0 ? e.hachureGap < 0 ? 4 * e.strokeWidth : e.hachureGap : e.dashGap, o = [];
		return t.forEach(((t) => {
			const h = a(t), r = Math.floor(h / (s + n)), i = (h + n - r * (s + n)) / 2;
			let c = t[0], l = t[1];
			c[0] > l[0] && (c = t[1], l = t[0]);
			const u = Math.atan((l[1] - c[1]) / (l[0] - c[0]));
			for (let t = 0; t < r; t++) {
				const a = t * (s + n), h = a + s, r = [c[0] + a * Math.cos(u) + i * Math.cos(u), c[1] + a * Math.sin(u) + i * Math.sin(u)], l = [c[0] + h * Math.cos(u) + i * Math.cos(u), c[1] + h * Math.sin(u) + i * Math.sin(u)];
				o.push(...this.helper.doubleLineOps(r[0], r[1], l[0], l[1], e));
			}
		})), o;
	}
};
var l = class {
	constructor(t) {
		this.helper = t;
	}
	fillPolygons(t, e) {
		const s = e.hachureGap < 0 ? 4 * e.strokeWidth : e.hachureGap, o = e.zigzagOffset < 0 ? s : e.zigzagOffset, a = n(t, e = Object.assign({}, e, { hachureGap: s + o }));
		return {
			type: "fillSketch",
			ops: this.zigzagLines(a, o, e)
		};
	}
	zigzagLines(t, e, s) {
		const n = [];
		return t.forEach(((t) => {
			const o = a(t), h = Math.round(o / (2 * e));
			let r = t[0], i = t[1];
			r[0] > i[0] && (r = t[1], i = t[0]);
			const c = Math.atan((i[1] - r[1]) / (i[0] - r[0]));
			for (let t = 0; t < h; t++) {
				const o = 2 * t * e, a = 2 * (t + 1) * e, h = Math.sqrt(2 * Math.pow(e, 2)), i = [r[0] + o * Math.cos(c), r[1] + o * Math.sin(c)], l = [r[0] + a * Math.cos(c), r[1] + a * Math.sin(c)], u = [i[0] + h * Math.cos(c + Math.PI / 4), i[1] + h * Math.sin(c + Math.PI / 4)];
				n.push(...this.helper.doubleLineOps(i[0], i[1], u[0], u[1], s), ...this.helper.doubleLineOps(u[0], u[1], l[0], l[1], s));
			}
		})), n;
	}
};
var u = {};
var p = class {
	constructor(t) {
		this.seed = t;
	}
	next() {
		return this.seed ? (2 ** 31 - 1 & (this.seed = Math.imul(48271, this.seed))) / 2 ** 31 : Math.random();
	}
};
var f = 0;
var d = 1;
var g = 2;
var M = {
	A: 7,
	a: 7,
	C: 6,
	c: 6,
	H: 1,
	h: 1,
	L: 2,
	l: 2,
	M: 2,
	m: 2,
	Q: 4,
	q: 4,
	S: 4,
	s: 4,
	T: 2,
	t: 2,
	V: 1,
	v: 1,
	Z: 0,
	z: 0
};
function k(t, e) {
	return t.type === e;
}
function b(t) {
	const e = [], s = function(t) {
		const e = new Array();
		for (; "" !== t;) if (t.match(/^([ \t\r\n,]+)/)) t = t.substr(RegExp.$1.length);
		else if (t.match(/^([aAcChHlLmMqQsStTvVzZ])/)) e[e.length] = {
			type: f,
			text: RegExp.$1
		}, t = t.substr(RegExp.$1.length);
		else {
			if (!t.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/)) return [];
			e[e.length] = {
				type: d,
				text: `${parseFloat(RegExp.$1)}`
			}, t = t.substr(RegExp.$1.length);
		}
		return e[e.length] = {
			type: g,
			text: ""
		}, e;
	}(t);
	let n = "BOD", o = 0, a = s[o];
	for (; !k(a, g);) {
		let h = 0;
		const r = [];
		if ("BOD" === n) {
			if ("M" !== a.text && "m" !== a.text) return b("M0,0" + t);
			o++, h = M[a.text], n = a.text;
		} else k(a, d) ? h = M[n] : (o++, h = M[a.text], n = a.text);
		if (!(o + h < s.length)) throw new Error("Path data ended short");
		for (let t = o; t < o + h; t++) {
			const e = s[t];
			if (!k(e, d)) throw new Error("Param not a number: " + n + "," + e.text);
			r[r.length] = +e.text;
		}
		if ("number" != typeof M[n]) throw new Error("Bad segment: " + n);
		{
			const t = {
				key: n,
				data: r
			};
			e.push(t), o += h, a = s[o], "M" === n && (n = "L"), "m" === n && (n = "l");
		}
	}
	return e;
}
function y(t) {
	let e = 0, s = 0, n = 0, o = 0;
	const a = [];
	for (const { key: h, data: r } of t) switch (h) {
		case "M":
			a.push({
				key: "M",
				data: [...r]
			}), [e, s] = r, [n, o] = r;
			break;
		case "m":
			e += r[0], s += r[1], a.push({
				key: "M",
				data: [e, s]
			}), n = e, o = s;
			break;
		case "L":
			a.push({
				key: "L",
				data: [...r]
			}), [e, s] = r;
			break;
		case "l":
			e += r[0], s += r[1], a.push({
				key: "L",
				data: [e, s]
			});
			break;
		case "C":
			a.push({
				key: "C",
				data: [...r]
			}), e = r[4], s = r[5];
			break;
		case "c": {
			const t = r.map(((t, n) => n % 2 ? t + s : t + e));
			a.push({
				key: "C",
				data: t
			}), e = t[4], s = t[5];
			break;
		}
		case "Q":
			a.push({
				key: "Q",
				data: [...r]
			}), e = r[2], s = r[3];
			break;
		case "q": {
			const t = r.map(((t, n) => n % 2 ? t + s : t + e));
			a.push({
				key: "Q",
				data: t
			}), e = t[2], s = t[3];
			break;
		}
		case "A":
			a.push({
				key: "A",
				data: [...r]
			}), e = r[5], s = r[6];
			break;
		case "a":
			e += r[5], s += r[6], a.push({
				key: "A",
				data: [
					r[0],
					r[1],
					r[2],
					r[3],
					r[4],
					e,
					s
				]
			});
			break;
		case "H":
			a.push({
				key: "H",
				data: [...r]
			}), e = r[0];
			break;
		case "h":
			e += r[0], a.push({
				key: "H",
				data: [e]
			});
			break;
		case "V":
			a.push({
				key: "V",
				data: [...r]
			}), s = r[0];
			break;
		case "v":
			s += r[0], a.push({
				key: "V",
				data: [s]
			});
			break;
		case "S":
			a.push({
				key: "S",
				data: [...r]
			}), e = r[2], s = r[3];
			break;
		case "s": {
			const t = r.map(((t, n) => n % 2 ? t + s : t + e));
			a.push({
				key: "S",
				data: t
			}), e = t[2], s = t[3];
			break;
		}
		case "T":
			a.push({
				key: "T",
				data: [...r]
			}), e = r[0], s = r[1];
			break;
		case "t":
			e += r[0], s += r[1], a.push({
				key: "T",
				data: [e, s]
			});
			break;
		case "Z":
		case "z": a.push({
			key: "Z",
			data: []
		}), e = n, s = o;
	}
	return a;
}
function m(t) {
	const e = [];
	let s = "", n = 0, o = 0, a = 0, h = 0, r = 0, i = 0;
	for (const { key: c, data: l } of t) {
		switch (c) {
			case "M":
				e.push({
					key: "M",
					data: [...l]
				}), [n, o] = l, [a, h] = l;
				break;
			case "C":
				e.push({
					key: "C",
					data: [...l]
				}), n = l[4], o = l[5], r = l[2], i = l[3];
				break;
			case "L":
				e.push({
					key: "L",
					data: [...l]
				}), [n, o] = l;
				break;
			case "H":
				n = l[0], e.push({
					key: "L",
					data: [n, o]
				});
				break;
			case "V":
				o = l[0], e.push({
					key: "L",
					data: [n, o]
				});
				break;
			case "S": {
				let t = 0, a = 0;
				"C" === s || "S" === s ? (t = n + (n - r), a = o + (o - i)) : (t = n, a = o), e.push({
					key: "C",
					data: [
						t,
						a,
						...l
					]
				}), r = l[0], i = l[1], n = l[2], o = l[3];
				break;
			}
			case "T": {
				const [t, a] = l;
				let h = 0, c = 0;
				"Q" === s || "T" === s ? (h = n + (n - r), c = o + (o - i)) : (h = n, c = o);
				const u = n + 2 * (h - n) / 3, p = o + 2 * (c - o) / 3, f = t + 2 * (h - t) / 3, d = a + 2 * (c - a) / 3;
				e.push({
					key: "C",
					data: [
						u,
						p,
						f,
						d,
						t,
						a
					]
				}), r = h, i = c, n = t, o = a;
				break;
			}
			case "Q": {
				const [t, s, a, h] = l, c = n + 2 * (t - n) / 3, u = o + 2 * (s - o) / 3, p = a + 2 * (t - a) / 3, f = h + 2 * (s - h) / 3;
				e.push({
					key: "C",
					data: [
						c,
						u,
						p,
						f,
						a,
						h
					]
				}), r = t, i = s, n = a, o = h;
				break;
			}
			case "A": {
				const t = Math.abs(l[0]), s = Math.abs(l[1]), a = l[2], h = l[3], r = l[4], i = l[5], c = l[6];
				if (0 === t || 0 === s) e.push({
					key: "C",
					data: [
						n,
						o,
						i,
						c,
						i,
						c
					]
				}), n = i, o = c;
				else if (n !== i || o !== c) x(n, o, i, c, t, s, a, h, r).forEach((function(t) {
					e.push({
						key: "C",
						data: t
					});
				})), n = i, o = c;
				break;
			}
			case "Z": e.push({
				key: "Z",
				data: []
			}), n = a, o = h;
		}
		s = c;
	}
	return e;
}
function w(t, e, s) {
	return [t * Math.cos(s) - e * Math.sin(s), t * Math.sin(s) + e * Math.cos(s)];
}
function x(t, e, s, n, o, a, h, r, i, c) {
	const l = (u = h, Math.PI * u / 180);
	var u;
	let p = [], f = 0, d = 0, g = 0, M = 0;
	if (c) [f, d, g, M] = c;
	else {
		[t, e] = w(t, e, -l), [s, n] = w(s, n, -l);
		const h = (t - s) / 2, c = (e - n) / 2;
		let u = h * h / (o * o) + c * c / (a * a);
		u > 1 && (u = Math.sqrt(u), o *= u, a *= u);
		const p = o * o, k = a * a, b = p * k - p * c * c - k * h * h, y = p * c * c + k * h * h, m = (r === i ? -1 : 1) * Math.sqrt(Math.abs(b / y));
		g = m * o * c / a + (t + s) / 2, M = m * -a * h / o + (e + n) / 2, f = Math.asin(parseFloat(((e - M) / a).toFixed(9))), d = Math.asin(parseFloat(((n - M) / a).toFixed(9))), t < g && (f = Math.PI - f), s < g && (d = Math.PI - d), f < 0 && (f = 2 * Math.PI + f), d < 0 && (d = 2 * Math.PI + d), i && f > d && (f -= 2 * Math.PI), !i && d > f && (d -= 2 * Math.PI);
	}
	let k = d - f;
	if (Math.abs(k) > 120 * Math.PI / 180) {
		const t = d, e = s, r = n;
		d = i && d > f ? f + 120 * Math.PI / 180 * 1 : f + 120 * Math.PI / 180 * -1, p = x(s = g + o * Math.cos(d), n = M + a * Math.sin(d), e, r, o, a, h, 0, i, [
			d,
			t,
			g,
			M
		]);
	}
	k = d - f;
	const b = Math.cos(f), y = Math.sin(f), m = Math.cos(d), P = Math.sin(d), v = Math.tan(k / 4), S = 4 / 3 * o * v, O = 4 / 3 * a * v, L = [t, e], T = [t + S * y, e - O * b], D = [s + S * P, n - O * m], A = [s, n];
	if (T[0] = 2 * L[0] - T[0], T[1] = 2 * L[1] - T[1], c) return [
		T,
		D,
		A
	].concat(p);
	{
		p = [
			T,
			D,
			A
		].concat(p);
		const t = [];
		for (let e = 0; e < p.length; e += 3) {
			const s = w(p[e][0], p[e][1], l), n = w(p[e + 1][0], p[e + 1][1], l), o = w(p[e + 2][0], p[e + 2][1], l);
			t.push([
				s[0],
				s[1],
				n[0],
				n[1],
				o[0],
				o[1]
			]);
		}
		return t;
	}
}
var P = {
	randOffset: function(t, e) {
		return G(t, e);
	},
	randOffsetWithRange: function(t, e, s) {
		return E(t, e, s);
	},
	ellipse: function(t, e, s, n, o) {
		return D(t, e, o, T(s, n, o)).opset;
	},
	doubleLineOps: function(t, e, s, n, o) {
		return $(t, e, s, n, o, !0);
	}
};
function v(t, e, s, n, o) {
	return {
		type: "path",
		ops: $(t, e, s, n, o)
	};
}
function S(t, e, s) {
	const n = (t || []).length;
	if (n > 2) {
		const o = [];
		for (let e = 0; e < n - 1; e++) o.push(...$(t[e][0], t[e][1], t[e + 1][0], t[e + 1][1], s));
		return e && o.push(...$(t[n - 1][0], t[n - 1][1], t[0][0], t[0][1], s)), {
			type: "path",
			ops: o
		};
	}
	return 2 === n ? v(t[0][0], t[0][1], t[1][0], t[1][1], s) : {
		type: "path",
		ops: []
	};
}
function O(t, e, s, n, o) {
	return function(t, e) {
		return S(t, !0, e);
	}([
		[t, e],
		[t + s, e],
		[t + s, e + n],
		[t, e + n]
	], o);
}
function L(t, e) {
	if (t.length) {
		const s = "number" == typeof t[0][0] ? [t] : t, n = j(s[0], 1 * (1 + .2 * e.roughness), e), o = e.disableMultiStroke ? [] : j(s[0], 1.5 * (1 + .22 * e.roughness), z(e));
		for (let t = 1; t < s.length; t++) {
			const a = s[t];
			if (a.length) {
				const t = j(a, 1 * (1 + .2 * e.roughness), e), s = e.disableMultiStroke ? [] : j(a, 1.5 * (1 + .22 * e.roughness), z(e));
				for (const e of t) "move" !== e.op && n.push(e);
				for (const t of s) "move" !== t.op && o.push(t);
			}
		}
		return {
			type: "path",
			ops: n.concat(o)
		};
	}
	return {
		type: "path",
		ops: []
	};
}
function T(t, e, s) {
	const n = Math.sqrt(2 * Math.PI * Math.sqrt((Math.pow(t / 2, 2) + Math.pow(e / 2, 2)) / 2)), o = Math.ceil(Math.max(s.curveStepCount, s.curveStepCount / Math.sqrt(200) * n)), a = 2 * Math.PI / o;
	let h = Math.abs(t / 2), r = Math.abs(e / 2);
	const i = 1 - s.curveFitting;
	return h += G(h * i, s), r += G(r * i, s), {
		increment: a,
		rx: h,
		ry: r
	};
}
function D(t, e, s, n) {
	const [o, a] = F(n.increment, t, e, n.rx, n.ry, 1, n.increment * E(.1, E(.4, 1, s), s), s);
	let h = q(o, null, s);
	if (!s.disableMultiStroke && 0 !== s.roughness) {
		const [o] = F(n.increment, t, e, n.rx, n.ry, 1.5, 0, s), a = q(o, null, s);
		h = h.concat(a);
	}
	return {
		estimatedPoints: a,
		opset: {
			type: "path",
			ops: h
		}
	};
}
function A(t, e, s, n, o, a, h, r, i) {
	const c = t, l = e;
	let u = Math.abs(s / 2), p = Math.abs(n / 2);
	u += G(.01 * u, i), p += G(.01 * p, i);
	let f = o, d = a;
	for (; f < 0;) f += 2 * Math.PI, d += 2 * Math.PI;
	d - f > 2 * Math.PI && (f = 0, d = 2 * Math.PI);
	const g = 2 * Math.PI / i.curveStepCount, M = Math.min(g / 2, (d - f) / 2), k = V(M, c, l, u, p, f, d, 1, i);
	if (!i.disableMultiStroke) {
		const t = V(M, c, l, u, p, f, d, 1.5, i);
		k.push(...t);
	}
	return h && (r ? k.push(...$(c, l, c + u * Math.cos(f), l + p * Math.sin(f), i), ...$(c, l, c + u * Math.cos(d), l + p * Math.sin(d), i)) : k.push({
		op: "lineTo",
		data: [c, l]
	}, {
		op: "lineTo",
		data: [c + u * Math.cos(f), l + p * Math.sin(f)]
	})), {
		type: "path",
		ops: k
	};
}
function _(t, e) {
	const s = m(y(b(t))), n = [];
	let o = [0, 0], a = [0, 0];
	for (const { key: t, data: h } of s) switch (t) {
		case "M":
			a = [h[0], h[1]], o = [h[0], h[1]];
			break;
		case "L":
			n.push(...$(a[0], a[1], h[0], h[1], e)), a = [h[0], h[1]];
			break;
		case "C": {
			const [t, s, o, r, i, c] = h;
			n.push(...Z(t, s, o, r, i, c, a, e)), a = [i, c];
			break;
		}
		case "Z": n.push(...$(a[0], a[1], o[0], o[1], e)), a = [o[0], o[1]];
	}
	return {
		type: "path",
		ops: n
	};
}
function I(t, e) {
	const s = [];
	for (const n of t) if (n.length) {
		const t = e.maxRandomnessOffset || 0, o = n.length;
		if (o > 2) {
			s.push({
				op: "move",
				data: [n[0][0] + G(t, e), n[0][1] + G(t, e)]
			});
			for (let a = 1; a < o; a++) s.push({
				op: "lineTo",
				data: [n[a][0] + G(t, e), n[a][1] + G(t, e)]
			});
		}
	}
	return {
		type: "fillPath",
		ops: s
	};
}
function C(t, e) {
	return function(t, e) {
		let s = t.fillStyle || "hachure";
		if (!u[s]) switch (s) {
			case "zigzag":
				u[s] || (u[s] = new h(e));
				break;
			case "cross-hatch":
				u[s] || (u[s] = new r(e));
				break;
			case "dots":
				u[s] || (u[s] = new i(e));
				break;
			case "dashed":
				u[s] || (u[s] = new c(e));
				break;
			case "zigzag-line":
				u[s] || (u[s] = new l(e));
				break;
			default: s = "hachure", u[s] || (u[s] = new o(e));
		}
		return u[s];
	}(e, P).fillPolygons(t, e);
}
function z(t) {
	const e = Object.assign({}, t);
	return e.randomizer = void 0, t.seed && (e.seed = t.seed + 1), e;
}
function W(t) {
	return t.randomizer || (t.randomizer = new p(t.seed || 0)), t.randomizer.next();
}
function E(t, e, s, n = 1) {
	return s.roughness * n * (W(s) * (e - t) + t);
}
function G(t, e, s = 1) {
	return E(-t, t, e, s);
}
function $(t, e, s, n, o, a = !1) {
	const h = a ? o.disableMultiStrokeFill : o.disableMultiStroke, r = R(t, e, s, n, o, !0, !1);
	if (h) return r;
	const i = R(t, e, s, n, o, !0, !0);
	return r.concat(i);
}
function R(t, e, s, n, o, a, h) {
	const r = Math.pow(t - s, 2) + Math.pow(e - n, 2), i = Math.sqrt(r);
	let c = 1;
	c = i < 200 ? 1 : i > 500 ? .4 : -.0016668 * i + 1.233334;
	let l = o.maxRandomnessOffset || 0;
	l * l * 100 > r && (l = i / 10);
	const u = l / 2, p = .2 + .2 * W(o);
	let f = o.bowing * o.maxRandomnessOffset * (n - e) / 200, d = o.bowing * o.maxRandomnessOffset * (t - s) / 200;
	f = G(f, o, c), d = G(d, o, c);
	const g = [], M = () => G(u, o, c), k = () => G(l, o, c), b = o.preserveVertices;
	return a && (h ? g.push({
		op: "move",
		data: [t + (b ? 0 : M()), e + (b ? 0 : M())]
	}) : g.push({
		op: "move",
		data: [t + (b ? 0 : G(l, o, c)), e + (b ? 0 : G(l, o, c))]
	})), h ? g.push({
		op: "bcurveTo",
		data: [
			f + t + (s - t) * p + M(),
			d + e + (n - e) * p + M(),
			f + t + 2 * (s - t) * p + M(),
			d + e + 2 * (n - e) * p + M(),
			s + (b ? 0 : M()),
			n + (b ? 0 : M())
		]
	}) : g.push({
		op: "bcurveTo",
		data: [
			f + t + (s - t) * p + k(),
			d + e + (n - e) * p + k(),
			f + t + 2 * (s - t) * p + k(),
			d + e + 2 * (n - e) * p + k(),
			s + (b ? 0 : k()),
			n + (b ? 0 : k())
		]
	}), g;
}
function j(t, e, s) {
	if (!t.length) return [];
	const n = [];
	n.push([t[0][0] + G(e, s), t[0][1] + G(e, s)]), n.push([t[0][0] + G(e, s), t[0][1] + G(e, s)]);
	for (let o = 1; o < t.length; o++) n.push([t[o][0] + G(e, s), t[o][1] + G(e, s)]), o === t.length - 1 && n.push([t[o][0] + G(e, s), t[o][1] + G(e, s)]);
	return q(n, null, s);
}
function q(t, e, s) {
	const n = t.length, o = [];
	if (n > 3) {
		const a = [], h = 1 - s.curveTightness;
		o.push({
			op: "move",
			data: [t[1][0], t[1][1]]
		});
		for (let e = 1; e + 2 < n; e++) {
			const s = t[e];
			a[0] = [s[0], s[1]], a[1] = [s[0] + (h * t[e + 1][0] - h * t[e - 1][0]) / 6, s[1] + (h * t[e + 1][1] - h * t[e - 1][1]) / 6], a[2] = [t[e + 1][0] + (h * t[e][0] - h * t[e + 2][0]) / 6, t[e + 1][1] + (h * t[e][1] - h * t[e + 2][1]) / 6], a[3] = [t[e + 1][0], t[e + 1][1]], o.push({
				op: "bcurveTo",
				data: [
					a[1][0],
					a[1][1],
					a[2][0],
					a[2][1],
					a[3][0],
					a[3][1]
				]
			});
		}
		if (e && 2 === e.length) {
			const t = s.maxRandomnessOffset;
			o.push({
				op: "lineTo",
				data: [e[0] + G(t, s), e[1] + G(t, s)]
			});
		}
	} else 3 === n ? (o.push({
		op: "move",
		data: [t[1][0], t[1][1]]
	}), o.push({
		op: "bcurveTo",
		data: [
			t[1][0],
			t[1][1],
			t[2][0],
			t[2][1],
			t[2][0],
			t[2][1]
		]
	})) : 2 === n && o.push(...R(t[0][0], t[0][1], t[1][0], t[1][1], s, !0, !0));
	return o;
}
function F(t, e, s, n, o, a, h, r) {
	const i = [], c = [];
	if (0 === r.roughness) {
		t /= 4, c.push([e + n * Math.cos(-t), s + o * Math.sin(-t)]);
		for (let a = 0; a <= 2 * Math.PI; a += t) {
			const t = [e + n * Math.cos(a), s + o * Math.sin(a)];
			i.push(t), c.push(t);
		}
		c.push([e + n * Math.cos(0), s + o * Math.sin(0)]), c.push([e + n * Math.cos(t), s + o * Math.sin(t)]);
	} else {
		const l = G(.5, r) - Math.PI / 2;
		c.push([G(a, r) + e + .9 * n * Math.cos(l - t), G(a, r) + s + .9 * o * Math.sin(l - t)]);
		const u = 2 * Math.PI + l - .01;
		for (let h = l; h < u; h += t) {
			const t = [G(a, r) + e + n * Math.cos(h), G(a, r) + s + o * Math.sin(h)];
			i.push(t), c.push(t);
		}
		c.push([G(a, r) + e + n * Math.cos(l + 2 * Math.PI + .5 * h), G(a, r) + s + o * Math.sin(l + 2 * Math.PI + .5 * h)]), c.push([G(a, r) + e + .98 * n * Math.cos(l + h), G(a, r) + s + .98 * o * Math.sin(l + h)]), c.push([G(a, r) + e + .9 * n * Math.cos(l + .5 * h), G(a, r) + s + .9 * o * Math.sin(l + .5 * h)]);
	}
	return [c, i];
}
function V(t, e, s, n, o, a, h, r, i) {
	const c = a + G(.1, i), l = [];
	l.push([G(r, i) + e + .9 * n * Math.cos(c - t), G(r, i) + s + .9 * o * Math.sin(c - t)]);
	for (let a = c; a <= h; a += t) l.push([G(r, i) + e + n * Math.cos(a), G(r, i) + s + o * Math.sin(a)]);
	return l.push([e + n * Math.cos(h), s + o * Math.sin(h)]), l.push([e + n * Math.cos(h), s + o * Math.sin(h)]), q(l, null, i);
}
function Z(t, e, s, n, o, a, h, r) {
	const i = [], c = [r.maxRandomnessOffset || 1, (r.maxRandomnessOffset || 1) + .3];
	let l = [0, 0];
	const u = r.disableMultiStroke ? 1 : 2, p = r.preserveVertices;
	for (let f = 0; f < u; f++) 0 === f ? i.push({
		op: "move",
		data: [h[0], h[1]]
	}) : i.push({
		op: "move",
		data: [h[0] + (p ? 0 : G(c[0], r)), h[1] + (p ? 0 : G(c[0], r))]
	}), l = p ? [o, a] : [o + G(c[f], r), a + G(c[f], r)], i.push({
		op: "bcurveTo",
		data: [
			t + G(c[f], r),
			e + G(c[f], r),
			s + G(c[f], r),
			n + G(c[f], r),
			l[0],
			l[1]
		]
	});
	return i;
}
function Q(t) {
	return [...t];
}
function H(t, e = 0) {
	const s = t.length;
	if (s < 3) throw new Error("A curve must have at least three points.");
	const n = [];
	if (3 === s) n.push(Q(t[0]), Q(t[1]), Q(t[2]), Q(t[2]));
	else {
		const s = [];
		s.push(t[0], t[0]);
		for (let e = 1; e < t.length; e++) s.push(t[e]), e === t.length - 1 && s.push(t[e]);
		const o = [], a = 1 - e;
		n.push(Q(s[0]));
		for (let t = 1; t + 2 < s.length; t++) {
			const e = s[t];
			o[0] = [e[0], e[1]], o[1] = [e[0] + (a * s[t + 1][0] - a * s[t - 1][0]) / 6, e[1] + (a * s[t + 1][1] - a * s[t - 1][1]) / 6], o[2] = [s[t + 1][0] + (a * s[t][0] - a * s[t + 2][0]) / 6, s[t + 1][1] + (a * s[t][1] - a * s[t + 2][1]) / 6], o[3] = [s[t + 1][0], s[t + 1][1]], n.push(o[1], o[2], o[3]);
		}
	}
	return n;
}
function N(t, e) {
	return Math.pow(t[0] - e[0], 2) + Math.pow(t[1] - e[1], 2);
}
function B(t, e, s) {
	const n = N(e, s);
	if (0 === n) return N(t, e);
	let o = ((t[0] - e[0]) * (s[0] - e[0]) + (t[1] - e[1]) * (s[1] - e[1])) / n;
	return o = Math.max(0, Math.min(1, o)), N(t, J(e, s, o));
}
function J(t, e, s) {
	return [t[0] + (e[0] - t[0]) * s, t[1] + (e[1] - t[1]) * s];
}
function K(t, e, s, n) {
	const o = n || [];
	if (function(t, e) {
		const s = t[e + 0], n = t[e + 1], o = t[e + 2], a = t[e + 3];
		let h = 3 * n[0] - 2 * s[0] - a[0];
		h *= h;
		let r = 3 * n[1] - 2 * s[1] - a[1];
		r *= r;
		let i = 3 * o[0] - 2 * a[0] - s[0];
		i *= i;
		let c = 3 * o[1] - 2 * a[1] - s[1];
		return c *= c, h < i && (h = i), r < c && (r = c), h + r;
	}(t, e) < s) {
		const s = t[e + 0];
		if (o.length) (a = o[o.length - 1], h = s, Math.sqrt(N(a, h))) > 1 && o.push(s);
		else o.push(s);
		o.push(t[e + 3]);
	} else {
		const n = .5, a = t[e + 0], h = t[e + 1], r = t[e + 2], i = t[e + 3], c = J(a, h, n), l = J(h, r, n), u = J(r, i, n), p = J(c, l, n), f = J(l, u, n), d = J(p, f, n);
		K([
			a,
			c,
			p,
			d
		], 0, s, o), K([
			d,
			f,
			u,
			i
		], 0, s, o);
	}
	var a, h;
	return o;
}
function U(t, e) {
	return X(t, 0, t.length, e);
}
function X(t, e, s, n, o) {
	const a = o || [], h = t[e], r = t[s - 1];
	let i = 0, c = 1;
	for (let n = e + 1; n < s - 1; ++n) {
		const e = B(t[n], h, r);
		e > i && (i = e, c = n);
	}
	return Math.sqrt(i) > n ? (X(t, e, c + 1, n, a), X(t, c, s, n, a)) : (a.length || a.push(h), a.push(r)), a;
}
function Y(t, e = .15, s) {
	const n = [], o = (t.length - 1) / 3;
	for (let s = 0; s < o; s++) K(t, 3 * s, e, n);
	return s && s > 0 ? X(n, 0, n.length, s) : n;
}
var tt = "none";
var et = class {
	constructor(t) {
		this.defaultOptions = {
			maxRandomnessOffset: 2,
			roughness: 1,
			bowing: 1,
			stroke: "#000",
			strokeWidth: 1,
			curveTightness: 0,
			curveFitting: .95,
			curveStepCount: 9,
			fillStyle: "hachure",
			fillWeight: -1,
			hachureAngle: -41,
			hachureGap: -1,
			dashOffset: -1,
			dashGap: -1,
			zigzagOffset: -1,
			seed: 0,
			disableMultiStroke: !1,
			disableMultiStrokeFill: !1,
			preserveVertices: !1,
			fillShapeRoughnessGain: .8
		}, this.config = t || {}, this.config.options && (this.defaultOptions = this._o(this.config.options));
	}
	static newSeed() {
		return Math.floor(Math.random() * 2 ** 31);
	}
	_o(t) {
		return t ? Object.assign({}, this.defaultOptions, t) : this.defaultOptions;
	}
	_d(t, e, s) {
		return {
			shape: t,
			sets: e || [],
			options: s || this.defaultOptions
		};
	}
	line(t, e, s, n, o) {
		const a = this._o(o);
		return this._d("line", [v(t, e, s, n, a)], a);
	}
	rectangle(t, e, s, n, o) {
		const a = this._o(o), h = [], r = O(t, e, s, n, a);
		if (a.fill) {
			const o = [
				[t, e],
				[t + s, e],
				[t + s, e + n],
				[t, e + n]
			];
			"solid" === a.fillStyle ? h.push(I([o], a)) : h.push(C([o], a));
		}
		return a.stroke !== tt && h.push(r), this._d("rectangle", h, a);
	}
	ellipse(t, e, s, n, o) {
		const a = this._o(o), h = [], r = T(s, n, a), i = D(t, e, a, r);
		if (a.fill) if ("solid" === a.fillStyle) {
			const s = D(t, e, a, r).opset;
			s.type = "fillPath", h.push(s);
		} else h.push(C([i.estimatedPoints], a));
		return a.stroke !== tt && h.push(i.opset), this._d("ellipse", h, a);
	}
	circle(t, e, s, n) {
		const o = this.ellipse(t, e, s, s, n);
		return o.shape = "circle", o;
	}
	linearPath(t, e) {
		const s = this._o(e);
		return this._d("linearPath", [S(t, !1, s)], s);
	}
	arc(t, e, s, n, o, a, h = !1, r) {
		const i = this._o(r), c = [], l = A(t, e, s, n, o, a, h, !0, i);
		if (h && i.fill) if ("solid" === i.fillStyle) {
			const h = Object.assign({}, i);
			h.disableMultiStroke = !0;
			const r = A(t, e, s, n, o, a, !0, !1, h);
			r.type = "fillPath", c.push(r);
		} else c.push(function(t, e, s, n, o, a, h) {
			const r = t, i = e;
			let c = Math.abs(s / 2), l = Math.abs(n / 2);
			c += G(.01 * c, h), l += G(.01 * l, h);
			let u = o, p = a;
			for (; u < 0;) u += 2 * Math.PI, p += 2 * Math.PI;
			p - u > 2 * Math.PI && (u = 0, p = 2 * Math.PI);
			const f = (p - u) / h.curveStepCount, d = [];
			for (let t = u; t <= p; t += f) d.push([r + c * Math.cos(t), i + l * Math.sin(t)]);
			return d.push([r + c * Math.cos(p), i + l * Math.sin(p)]), d.push([r, i]), C([d], h);
		}(t, e, s, n, o, a, i));
		return i.stroke !== tt && c.push(l), this._d("arc", c, i);
	}
	curve(t, e) {
		const s = this._o(e), n = [], o = L(t, s);
		if (s.fill && s.fill !== tt) if ("solid" === s.fillStyle) {
			const e = L(t, Object.assign(Object.assign({}, s), {
				disableMultiStroke: !0,
				roughness: s.roughness ? s.roughness + s.fillShapeRoughnessGain : 0
			}));
			n.push({
				type: "fillPath",
				ops: this._mergedShape(e.ops)
			});
		} else {
			const e = [], o = t;
			if (o.length) {
				const t = "number" == typeof o[0][0] ? [o] : o;
				for (const n of t) n.length < 3 ? e.push(...n) : 3 === n.length ? e.push(...Y(H([
					n[0],
					n[0],
					n[1],
					n[2]
				]), 10, (1 + s.roughness) / 2)) : e.push(...Y(H(n), 10, (1 + s.roughness) / 2));
			}
			e.length && n.push(C([e], s));
		}
		return s.stroke !== tt && n.push(o), this._d("curve", n, s);
	}
	polygon(t, e) {
		const s = this._o(e), n = [], o = S(t, !0, s);
		return s.fill && ("solid" === s.fillStyle ? n.push(I([t], s)) : n.push(C([t], s))), s.stroke !== tt && n.push(o), this._d("polygon", n, s);
	}
	path(t, e) {
		const s = this._o(e), n = [];
		if (!t) return this._d("path", n, s);
		t = (t || "").replace(/\n/g, " ").replace(/(-\s)/g, "-").replace("/(ss)/g", " ");
		const o = s.fill && "transparent" !== s.fill && s.fill !== tt, a = s.stroke !== tt, h = !!(s.simplification && s.simplification < 1), r = function(t, e, s) {
			const n = m(y(b(t))), o = [];
			let a = [], h = [0, 0], r = [];
			const i = () => {
				r.length >= 4 && a.push(...Y(r, e)), r = [];
			}, c = () => {
				i(), a.length && (o.push(a), a = []);
			};
			for (const { key: t, data: e } of n) switch (t) {
				case "M":
					c(), h = [e[0], e[1]], a.push(h);
					break;
				case "L":
					i(), a.push([e[0], e[1]]);
					break;
				case "C":
					if (!r.length) {
						const t = a.length ? a[a.length - 1] : h;
						r.push([t[0], t[1]]);
					}
					r.push([e[0], e[1]]), r.push([e[2], e[3]]), r.push([e[4], e[5]]);
					break;
				case "Z": i(), a.push([h[0], h[1]]);
			}
			if (c(), !s) return o;
			const l = [];
			for (const t of o) {
				const e = U(t, s);
				e.length && l.push(e);
			}
			return l;
		}(t, 1, h ? 4 - 4 * (s.simplification || 1) : (1 + s.roughness) / 2), i = _(t, s);
		if (o) if ("solid" === s.fillStyle) if (1 === r.length) {
			const e = _(t, Object.assign(Object.assign({}, s), {
				disableMultiStroke: !0,
				roughness: s.roughness ? s.roughness + s.fillShapeRoughnessGain : 0
			}));
			n.push({
				type: "fillPath",
				ops: this._mergedShape(e.ops)
			});
		} else n.push(I(r, s));
		else n.push(C(r, s));
		return a && (h ? r.forEach(((t) => {
			n.push(S(t, !1, s));
		})) : n.push(i)), this._d("path", n, s);
	}
	opsToPath(t, e) {
		let s = "";
		for (const n of t.ops) {
			const t = "number" == typeof e && e >= 0 ? n.data.map(((t) => +t.toFixed(e))) : n.data;
			switch (n.op) {
				case "move":
					s += `M${t[0]} ${t[1]} `;
					break;
				case "bcurveTo":
					s += `C${t[0]} ${t[1]}, ${t[2]} ${t[3]}, ${t[4]} ${t[5]} `;
					break;
				case "lineTo": s += `L${t[0]} ${t[1]} `;
			}
		}
		return s.trim();
	}
	toPaths(t) {
		const e = t.sets || [], s = t.options || this.defaultOptions, n = [];
		for (const t of e) {
			let e = null;
			switch (t.type) {
				case "path":
					e = {
						d: this.opsToPath(t),
						stroke: s.stroke,
						strokeWidth: s.strokeWidth,
						fill: tt
					};
					break;
				case "fillPath":
					e = {
						d: this.opsToPath(t),
						stroke: tt,
						strokeWidth: 0,
						fill: s.fill || tt
					};
					break;
				case "fillSketch": e = this.fillSketch(t, s);
			}
			e && n.push(e);
		}
		return n;
	}
	fillSketch(t, e) {
		let s = e.fillWeight;
		return s < 0 && (s = e.strokeWidth / 2), {
			d: this.opsToPath(t),
			stroke: e.fill || tt,
			strokeWidth: s,
			fill: tt
		};
	}
	_mergedShape(t) {
		return t.filter(((t, e) => 0 === e || "move" !== t.op));
	}
};
var st = class {
	constructor(t, e) {
		this.canvas = t, this.ctx = this.canvas.getContext("2d"), this.gen = new et(e);
	}
	draw(t) {
		const e = t.sets || [], s = t.options || this.getDefaultOptions(), n = this.ctx, o = t.options.fixedDecimalPlaceDigits;
		for (const a of e) switch (a.type) {
			case "path":
				n.save(), n.strokeStyle = "none" === s.stroke ? "transparent" : s.stroke, n.lineWidth = s.strokeWidth, s.strokeLineDash && n.setLineDash(s.strokeLineDash), s.strokeLineDashOffset && (n.lineDashOffset = s.strokeLineDashOffset), this._drawToContext(n, a, o), n.restore();
				break;
			case "fillPath": {
				n.save(), n.fillStyle = s.fill || "";
				const e = "curve" === t.shape || "polygon" === t.shape || "path" === t.shape ? "evenodd" : "nonzero";
				this._drawToContext(n, a, o, e), n.restore();
				break;
			}
			case "fillSketch": this.fillSketch(n, a, s);
		}
	}
	fillSketch(t, e, s) {
		let n = s.fillWeight;
		n < 0 && (n = s.strokeWidth / 2), t.save(), s.fillLineDash && t.setLineDash(s.fillLineDash), s.fillLineDashOffset && (t.lineDashOffset = s.fillLineDashOffset), t.strokeStyle = s.fill || "", t.lineWidth = n, this._drawToContext(t, e, s.fixedDecimalPlaceDigits), t.restore();
	}
	_drawToContext(t, e, s, n = "nonzero") {
		t.beginPath();
		for (const n of e.ops) {
			const e = "number" == typeof s && s >= 0 ? n.data.map(((t) => +t.toFixed(s))) : n.data;
			switch (n.op) {
				case "move":
					t.moveTo(e[0], e[1]);
					break;
				case "bcurveTo":
					t.bezierCurveTo(e[0], e[1], e[2], e[3], e[4], e[5]);
					break;
				case "lineTo": t.lineTo(e[0], e[1]);
			}
		}
		"fillPath" === e.type ? t.fill(n) : t.stroke();
	}
	get generator() {
		return this.gen;
	}
	getDefaultOptions() {
		return this.gen.defaultOptions;
	}
	line(t, e, s, n, o) {
		const a = this.gen.line(t, e, s, n, o);
		return this.draw(a), a;
	}
	rectangle(t, e, s, n, o) {
		const a = this.gen.rectangle(t, e, s, n, o);
		return this.draw(a), a;
	}
	ellipse(t, e, s, n, o) {
		const a = this.gen.ellipse(t, e, s, n, o);
		return this.draw(a), a;
	}
	circle(t, e, s, n) {
		const o = this.gen.circle(t, e, s, n);
		return this.draw(o), o;
	}
	linearPath(t, e) {
		const s = this.gen.linearPath(t, e);
		return this.draw(s), s;
	}
	polygon(t, e) {
		const s = this.gen.polygon(t, e);
		return this.draw(s), s;
	}
	arc(t, e, s, n, o, a, h = !1, r) {
		const i = this.gen.arc(t, e, s, n, o, a, h, r);
		return this.draw(i), i;
	}
	curve(t, e) {
		const s = this.gen.curve(t, e);
		return this.draw(s), s;
	}
	path(t, e) {
		const s = this.gen.path(t, e);
		return this.draw(s), s;
	}
};
var nt = "http://www.w3.org/2000/svg";
var ot = class {
	constructor(t, e) {
		this.svg = t, this.gen = new et(e);
	}
	draw(t) {
		const e = t.sets || [], s = t.options || this.getDefaultOptions(), n = this.svg.ownerDocument || window.document, o = n.createElementNS(nt, "g"), a = t.options.fixedDecimalPlaceDigits;
		for (const h of e) {
			let e = null;
			switch (h.type) {
				case "path":
					e = n.createElementNS(nt, "path"), e.setAttribute("d", this.opsToPath(h, a)), e.setAttribute("stroke", s.stroke), e.setAttribute("stroke-width", s.strokeWidth + ""), e.setAttribute("fill", "none"), s.strokeLineDash && e.setAttribute("stroke-dasharray", s.strokeLineDash.join(" ").trim()), s.strokeLineDashOffset && e.setAttribute("stroke-dashoffset", `${s.strokeLineDashOffset}`);
					break;
				case "fillPath":
					e = n.createElementNS(nt, "path"), e.setAttribute("d", this.opsToPath(h, a)), e.setAttribute("stroke", "none"), e.setAttribute("stroke-width", "0"), e.setAttribute("fill", s.fill || ""), "curve" !== t.shape && "polygon" !== t.shape || e.setAttribute("fill-rule", "evenodd");
					break;
				case "fillSketch": e = this.fillSketch(n, h, s);
			}
			e && o.appendChild(e);
		}
		return o;
	}
	fillSketch(t, e, s) {
		let n = s.fillWeight;
		n < 0 && (n = s.strokeWidth / 2);
		const o = t.createElementNS(nt, "path");
		return o.setAttribute("d", this.opsToPath(e, s.fixedDecimalPlaceDigits)), o.setAttribute("stroke", s.fill || ""), o.setAttribute("stroke-width", n + ""), o.setAttribute("fill", "none"), s.fillLineDash && o.setAttribute("stroke-dasharray", s.fillLineDash.join(" ").trim()), s.fillLineDashOffset && o.setAttribute("stroke-dashoffset", `${s.fillLineDashOffset}`), o;
	}
	get generator() {
		return this.gen;
	}
	getDefaultOptions() {
		return this.gen.defaultOptions;
	}
	opsToPath(t, e) {
		return this.gen.opsToPath(t, e);
	}
	line(t, e, s, n, o) {
		const a = this.gen.line(t, e, s, n, o);
		return this.draw(a);
	}
	rectangle(t, e, s, n, o) {
		const a = this.gen.rectangle(t, e, s, n, o);
		return this.draw(a);
	}
	ellipse(t, e, s, n, o) {
		const a = this.gen.ellipse(t, e, s, n, o);
		return this.draw(a);
	}
	circle(t, e, s, n) {
		const o = this.gen.circle(t, e, s, n);
		return this.draw(o);
	}
	linearPath(t, e) {
		const s = this.gen.linearPath(t, e);
		return this.draw(s);
	}
	polygon(t, e) {
		const s = this.gen.polygon(t, e);
		return this.draw(s);
	}
	arc(t, e, s, n, o, a, h = !1, r) {
		const i = this.gen.arc(t, e, s, n, o, a, h, r);
		return this.draw(i);
	}
	curve(t, e) {
		const s = this.gen.curve(t, e);
		return this.draw(s);
	}
	path(t, e) {
		const s = this.gen.path(t, e);
		return this.draw(s);
	}
};
var at = {
	canvas: (t, e) => new st(t, e),
	svg: (t, e) => new ot(t, e),
	generator: (t) => new et(t),
	newSeed: () => et.newSeed()
};
// ../../node_modules/.pnpm/mermaid@11.12.2/node_modules/mermaid/dist/chunks/mermaid.core/chunk-JZLCHNYA.mjs
var labelHelper = /* @__PURE__ */ __name(async (parent, node, _classes) => {
	let cssClasses;
	const useHtmlLabels = node.useHtmlLabels || evaluate(getConfig2()?.htmlLabels);
	if (!_classes) cssClasses = "node default";
	else cssClasses = _classes;
	const shapeSvg = parent.insert("g").attr("class", cssClasses).attr("id", node.domId || node.id);
	const labelEl = shapeSvg.insert("g").attr("class", "label").attr("style", handleUndefinedAttr(node.labelStyle));
	let label;
	if (node.label === void 0) label = "";
	else label = typeof node.label === "string" ? node.label : node.label[0];
	const text2 = await createText(labelEl, sanitizeText(decodeEntities(label), getConfig2()), {
		useHtmlLabels,
		width: node.width || getConfig2().flowchart?.wrappingWidth,
		cssClasses: "markdown-node-label",
		style: node.labelStyle,
		addSvgBackground: !!node.icon || !!node.img
	});
	let bbox = text2.getBBox();
	const halfPadding = (node?.padding ?? 0) / 2;
	if (useHtmlLabels) {
		const div = text2.children[0];
		const dv = select_default(text2);
		const images = div.getElementsByTagName("img");
		if (images) {
			const noImgText = label.replace(/<img[^>]*>/g, "").trim() === "";
			await Promise.all([...images].map((img) => new Promise((res) => {
				function setupImage() {
					img.style.display = "flex";
					img.style.flexDirection = "column";
					if (noImgText) {
						const bodyFontSize = getConfig2().fontSize ? getConfig2().fontSize : window.getComputedStyle(document.body).fontSize;
						const enlargingFactor = 5;
						const [parsedBodyFontSize = defaultConfig_default.fontSize] = parseFontSize(bodyFontSize);
						const width = parsedBodyFontSize * enlargingFactor + "px";
						img.style.minWidth = width;
						img.style.maxWidth = width;
					} else img.style.width = "100%";
					res(img);
				}
				__name(setupImage, "setupImage");
				setTimeout(() => {
					if (img.complete) setupImage();
				});
				img.addEventListener("error", setupImage);
				img.addEventListener("load", setupImage);
			})));
		}
		bbox = div.getBoundingClientRect();
		dv.attr("width", bbox.width);
		dv.attr("height", bbox.height);
	}
	if (useHtmlLabels) labelEl.attr("transform", "translate(" + -bbox.width / 2 + ", " + -bbox.height / 2 + ")");
	else labelEl.attr("transform", "translate(0, " + -bbox.height / 2 + ")");
	if (node.centerLabel) labelEl.attr("transform", "translate(" + -bbox.width / 2 + ", " + -bbox.height / 2 + ")");
	labelEl.insert("rect", ":first-child");
	return {
		shapeSvg,
		bbox,
		halfPadding,
		label: labelEl
	};
}, "labelHelper");
var insertLabel = /* @__PURE__ */ __name(async (parent, label, options) => {
	const useHtmlLabels = options.useHtmlLabels || evaluate(getConfig2()?.flowchart?.htmlLabels);
	const labelEl = parent.insert("g").attr("class", "label").attr("style", options.labelStyle || "");
	const text2 = await createText(labelEl, sanitizeText(decodeEntities(label), getConfig2()), {
		useHtmlLabels,
		width: options.width || getConfig2()?.flowchart?.wrappingWidth,
		style: options.labelStyle,
		addSvgBackground: !!options.icon || !!options.img
	});
	let bbox = text2.getBBox();
	const halfPadding = options.padding / 2;
	if (evaluate(getConfig2()?.flowchart?.htmlLabels)) {
		const div = text2.children[0];
		const dv = select_default(text2);
		bbox = div.getBoundingClientRect();
		dv.attr("width", bbox.width);
		dv.attr("height", bbox.height);
	}
	if (useHtmlLabels) labelEl.attr("transform", "translate(" + -bbox.width / 2 + ", " + -bbox.height / 2 + ")");
	else labelEl.attr("transform", "translate(0, " + -bbox.height / 2 + ")");
	if (options.centerLabel) labelEl.attr("transform", "translate(" + -bbox.width / 2 + ", " + -bbox.height / 2 + ")");
	labelEl.insert("rect", ":first-child");
	return {
		shapeSvg: parent,
		bbox,
		halfPadding,
		label: labelEl
	};
}, "insertLabel");
var updateNodeBounds = /* @__PURE__ */ __name((node, element) => {
	const bbox = element.node().getBBox();
	node.width = bbox.width;
	node.height = bbox.height;
}, "updateNodeBounds");
var getNodeClasses = /* @__PURE__ */ __name((node, extra) => (node.look === "handDrawn" ? "rough-node" : "node") + " " + node.cssClasses + " " + (extra || ""), "getNodeClasses");
function createPathFromPoints(points) {
	const pointStrings = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`);
	pointStrings.push("Z");
	return pointStrings.join(" ");
}
__name(createPathFromPoints, "createPathFromPoints");
function generateFullSineWavePoints(x1, y1, x2, y2, amplitude, numCycles) {
	const points = [];
	const steps = 50;
	const deltaX = x2 - x1;
	const deltaY = y2 - y1;
	const cycleLength = deltaX / numCycles;
	const frequency = 2 * Math.PI / cycleLength;
	const midY = y1 + deltaY / 2;
	for (let i = 0; i <= steps; i++) {
		const x = x1 + i / steps * deltaX;
		const y = midY + amplitude * Math.sin(frequency * (x - x1));
		points.push({
			x,
			y
		});
	}
	return points;
}
__name(generateFullSineWavePoints, "generateFullSineWavePoints");
function generateCirclePoints(centerX, centerY, radius, numPoints, startAngle, endAngle) {
	const points = [];
	const startAngleRad = startAngle * Math.PI / 180;
	const angleStep = (endAngle * Math.PI / 180 - startAngleRad) / (numPoints - 1);
	for (let i = 0; i < numPoints; i++) {
		const angle = startAngleRad + i * angleStep;
		const x = centerX + radius * Math.cos(angle);
		const y = centerY + radius * Math.sin(angle);
		points.push({
			x: -x,
			y: -y
		});
	}
	return points;
}
__name(generateCirclePoints, "generateCirclePoints");
var intersect_rect_default = /* @__PURE__ */ __name((node, point) => {
	var x = node.x;
	var y = node.y;
	var dx = point.x - x;
	var dy = point.y - y;
	var w = node.width / 2;
	var h = node.height / 2;
	var sx, sy;
	if (Math.abs(dy) * w > Math.abs(dx) * h) {
		if (dy < 0) h = -h;
		sx = dy === 0 ? 0 : h * dx / dy;
		sy = h;
	} else {
		if (dx < 0) w = -w;
		sx = w;
		sy = dx === 0 ? 0 : w * dy / dx;
	}
	return {
		x: x + sx,
		y: y + sy
	};
}, "intersectRect");
function applyStyle(dom, styleFn) {
	if (styleFn) dom.attr("style", styleFn);
}
__name(applyStyle, "applyStyle");
async function addHtmlLabel(node) {
	const fo = select_default(document.createElementNS("http://www.w3.org/2000/svg", "foreignObject"));
	const div = fo.append("xhtml:div");
	const config = getConfig2();
	let label = node.label;
	if (node.label && hasKatex(node.label)) label = await renderKatexSanitized(node.label.replace(common_default.lineBreakRegex, "\n"), config);
	const labelSpan = "<span class=\"" + (node.isNode ? "nodeLabel" : "edgeLabel") + "\" " + (node.labelStyle ? "style=\"" + node.labelStyle + "\"" : "") + ">" + label + "</span>";
	div.html(sanitizeText(labelSpan, config));
	applyStyle(div, node.labelStyle);
	div.style("display", "inline-block");
	div.style("padding-right", "1px");
	div.style("white-space", "nowrap");
	div.attr("xmlns", "http://www.w3.org/1999/xhtml");
	return fo.node();
}
__name(addHtmlLabel, "addHtmlLabel");
var createLabel_default = /* @__PURE__ */ __name(async (_vertexText, style, isTitle, isNode) => {
	let vertexText = _vertexText || "";
	if (typeof vertexText === "object") vertexText = vertexText[0];
	if (evaluate(getConfig2().flowchart.htmlLabels)) {
		vertexText = vertexText.replace(/\\n|\n/g, "<br />");
		log.info("vertexText" + vertexText);
		return await addHtmlLabel({
			isNode,
			label: decodeEntities(vertexText).replace(/fa[blrs]?:fa-[\w-]+/g, (s) => `<i class='${s.replace(":", " ")}'></i>`),
			labelStyle: style ? style.replace("fill:", "color:") : style
		});
	} else {
		const svgLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
		svgLabel.setAttribute("style", style.replace("color:", "fill:"));
		let rows = [];
		if (typeof vertexText === "string") rows = vertexText.split(/\\n|\n|<br\s*\/?>/gi);
		else if (Array.isArray(vertexText)) rows = vertexText;
		else rows = [];
		for (const row of rows) {
			const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
			tspan.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
			tspan.setAttribute("dy", "1em");
			tspan.setAttribute("x", "0");
			if (isTitle) tspan.setAttribute("class", "title-row");
			else tspan.setAttribute("class", "row");
			tspan.textContent = row.trim();
			svgLabel.appendChild(tspan);
		}
		return svgLabel;
	}
}, "createLabel");
var createRoundedRectPathD = /* @__PURE__ */ __name((x, y, totalWidth, totalHeight, radius) => [
	"M",
	x + radius,
	y,
	"H",
	x + totalWidth - radius,
	"A",
	radius,
	radius,
	0,
	0,
	1,
	x + totalWidth,
	y + radius,
	"V",
	y + totalHeight - radius,
	"A",
	radius,
	radius,
	0,
	0,
	1,
	x + totalWidth - radius,
	y + totalHeight,
	"H",
	x + radius,
	"A",
	radius,
	radius,
	0,
	0,
	1,
	x,
	y + totalHeight - radius,
	"V",
	y + radius,
	"A",
	radius,
	radius,
	0,
	0,
	1,
	x + radius,
	y,
	"Z"
].join(" "), "createRoundedRectPathD");
var rect = /* @__PURE__ */ __name(async (parent, node) => {
	log.info("Creating subgraph rect for ", node.id, node);
	const siteConfig = getConfig2();
	const { themeVariables, handDrawnSeed } = siteConfig;
	const { clusterBkg, clusterBorder } = themeVariables;
	const { labelStyles, nodeStyles, borderStyles, backgroundStyles } = styles2String(node);
	const shapeSvg = parent.insert("g").attr("class", "cluster " + node.cssClasses).attr("id", node.id).attr("data-look", node.look);
	const useHtmlLabels = evaluate(siteConfig.flowchart.htmlLabels);
	const labelEl = shapeSvg.insert("g").attr("class", "cluster-label ");
	const text2 = await createText(labelEl, node.label, {
		style: node.labelStyle,
		useHtmlLabels,
		isNode: true
	});
	let bbox = text2.getBBox();
	if (evaluate(siteConfig.flowchart.htmlLabels)) {
		const div = text2.children[0];
		const dv = select_default(text2);
		bbox = div.getBoundingClientRect();
		dv.attr("width", bbox.width);
		dv.attr("height", bbox.height);
	}
	const width = node.width <= bbox.width + node.padding ? bbox.width + node.padding : node.width;
	if (node.width <= bbox.width + node.padding) node.diff = (width - node.width) / 2 - node.padding;
	else node.diff = -node.padding;
	const height = node.height;
	const x = node.x - width / 2;
	const y = node.y - height / 2;
	log.trace("Data ", node, JSON.stringify(node));
	let rect2;
	if (node.look === "handDrawn") {
		const rc = at.svg(shapeSvg);
		const options = userNodeOverrides(node, {
			roughness: .7,
			fill: clusterBkg,
			stroke: clusterBorder,
			fillWeight: 3,
			seed: handDrawnSeed
		});
		const roughNode = rc.path(createRoundedRectPathD(x, y, width, height, 0), options);
		rect2 = shapeSvg.insert(() => {
			log.debug("Rough node insert CXC", roughNode);
			return roughNode;
		}, ":first-child");
		rect2.select("path:nth-child(2)").attr("style", borderStyles.join(";"));
		rect2.select("path").attr("style", backgroundStyles.join(";").replace("fill", "stroke"));
	} else {
		rect2 = shapeSvg.insert("rect", ":first-child");
		rect2.attr("style", nodeStyles).attr("rx", node.rx).attr("ry", node.ry).attr("x", x).attr("y", y).attr("width", width).attr("height", height);
	}
	const { subGraphTitleTopMargin } = getSubGraphTitleMargins(siteConfig);
	labelEl.attr("transform", `translate(${node.x - bbox.width / 2}, ${node.y - node.height / 2 + subGraphTitleTopMargin})`);
	if (labelStyles) {
		const span = labelEl.select("span");
		if (span) span.attr("style", labelStyles);
	}
	const rectBox = rect2.node().getBBox();
	node.offsetX = 0;
	node.width = rectBox.width;
	node.height = rectBox.height;
	node.offsetY = bbox.height - node.padding / 2;
	node.intersect = function(point) {
		return intersect_rect_default(node, point);
	};
	return {
		cluster: shapeSvg,
		labelBBox: bbox
	};
}, "rect");
var shapes = {
	rect,
	squareRect: rect,
	roundedWithTitle: /* @__PURE__ */ __name(async (parent, node) => {
		const siteConfig = getConfig2();
		const { themeVariables, handDrawnSeed } = siteConfig;
		const { altBackground, compositeBackground, compositeTitleBackground, nodeBorder } = themeVariables;
		const shapeSvg = parent.insert("g").attr("class", node.cssClasses).attr("id", node.id).attr("data-id", node.id).attr("data-look", node.look);
		const outerRectG = shapeSvg.insert("g", ":first-child");
		const label = shapeSvg.insert("g").attr("class", "cluster-label");
		let innerRect = shapeSvg.append("rect");
		const text2 = label.node().appendChild(await createLabel_default(node.label, node.labelStyle, void 0, true));
		let bbox = text2.getBBox();
		if (evaluate(siteConfig.flowchart.htmlLabels)) {
			const div = text2.children[0];
			const dv = select_default(text2);
			bbox = div.getBoundingClientRect();
			dv.attr("width", bbox.width);
			dv.attr("height", bbox.height);
		}
		const padding = 0 * node.padding;
		const halfPadding = padding / 2;
		const width = (node.width <= bbox.width + node.padding ? bbox.width + node.padding : node.width) + padding;
		if (node.width <= bbox.width + node.padding) node.diff = (width - node.width) / 2 - node.padding;
		else node.diff = -node.padding;
		const height = node.height + padding;
		const innerHeight = node.height + padding - bbox.height - 6;
		const x = node.x - width / 2;
		const y = node.y - height / 2;
		node.width = width;
		const innerY = node.y - node.height / 2 - halfPadding + bbox.height + 2;
		let rect2;
		if (node.look === "handDrawn") {
			const isAlt = node.cssClasses.includes("statediagram-cluster-alt");
			const rc = at.svg(shapeSvg);
			const roughOuterNode = node.rx || node.ry ? rc.path(createRoundedRectPathD(x, y, width, height, 10), {
				roughness: .7,
				fill: compositeTitleBackground,
				fillStyle: "solid",
				stroke: nodeBorder,
				seed: handDrawnSeed
			}) : rc.rectangle(x, y, width, height, { seed: handDrawnSeed });
			rect2 = shapeSvg.insert(() => roughOuterNode, ":first-child");
			const roughInnerNode = rc.rectangle(x, innerY, width, innerHeight, {
				fill: isAlt ? altBackground : compositeBackground,
				fillStyle: isAlt ? "hachure" : "solid",
				stroke: nodeBorder,
				seed: handDrawnSeed
			});
			rect2 = shapeSvg.insert(() => roughOuterNode, ":first-child");
			innerRect = shapeSvg.insert(() => roughInnerNode);
		} else {
			rect2 = outerRectG.insert("rect", ":first-child");
			rect2.attr("class", "outer").attr("x", x).attr("y", y).attr("width", width).attr("height", height).attr("data-look", node.look);
			innerRect.attr("class", "inner").attr("x", x).attr("y", innerY).attr("width", width).attr("height", innerHeight);
		}
		label.attr("transform", `translate(${node.x - bbox.width / 2}, ${y + 1 - (evaluate(siteConfig.flowchart.htmlLabels) ? 0 : 3)})`);
		node.height = rect2.node().getBBox().height;
		node.offsetX = 0;
		node.offsetY = bbox.height - node.padding / 2;
		node.labelBBox = bbox;
		node.intersect = function(point) {
			return intersect_rect_default(node, point);
		};
		return {
			cluster: shapeSvg,
			labelBBox: bbox
		};
	}, "roundedWithTitle"),
	noteGroup: /* @__PURE__ */ __name((parent, node) => {
		const shapeSvg = parent.insert("g").attr("class", "note-cluster").attr("id", node.id);
		const rect2 = shapeSvg.insert("rect", ":first-child");
		const padding = 0 * node.padding;
		const halfPadding = padding / 2;
		rect2.attr("rx", node.rx).attr("ry", node.ry).attr("x", node.x - node.width / 2 - halfPadding).attr("y", node.y - node.height / 2 - halfPadding).attr("width", node.width + padding).attr("height", node.height + padding).attr("fill", "none");
		const rectBox = rect2.node().getBBox();
		node.width = rectBox.width;
		node.height = rectBox.height;
		node.intersect = function(point) {
			return intersect_rect_default(node, point);
		};
		return {
			cluster: shapeSvg,
			labelBBox: {
				width: 0,
				height: 0
			}
		};
	}, "noteGroup"),
	divider: /* @__PURE__ */ __name((parent, node) => {
		const { themeVariables, handDrawnSeed } = getConfig2();
		const { nodeBorder } = themeVariables;
		const shapeSvg = parent.insert("g").attr("class", node.cssClasses).attr("id", node.id).attr("data-look", node.look);
		const outerRectG = shapeSvg.insert("g", ":first-child");
		const padding = 0 * node.padding;
		const width = node.width + padding;
		node.diff = -node.padding;
		const height = node.height + padding;
		const x = node.x - width / 2;
		const y = node.y - height / 2;
		node.width = width;
		let rect2;
		if (node.look === "handDrawn") {
			const roughOuterNode = at.svg(shapeSvg).rectangle(x, y, width, height, {
				fill: "lightgrey",
				roughness: .5,
				strokeLineDash: [5],
				stroke: nodeBorder,
				seed: handDrawnSeed
			});
			rect2 = shapeSvg.insert(() => roughOuterNode, ":first-child");
		} else {
			rect2 = outerRectG.insert("rect", ":first-child");
			rect2.attr("class", "divider").attr("x", x).attr("y", y).attr("width", width).attr("height", height).attr("data-look", node.look);
		}
		node.height = rect2.node().getBBox().height;
		node.offsetX = 0;
		node.offsetY = 0;
		node.intersect = function(point) {
			return intersect_rect_default(node, point);
		};
		return {
			cluster: shapeSvg,
			labelBBox: {}
		};
	}, "divider"),
	kanbanSection: /* @__PURE__ */ __name(async (parent, node) => {
		log.info("Creating subgraph rect for ", node.id, node);
		const siteConfig = getConfig2();
		const { themeVariables, handDrawnSeed } = siteConfig;
		const { clusterBkg, clusterBorder } = themeVariables;
		const { labelStyles, nodeStyles, borderStyles, backgroundStyles } = styles2String(node);
		const shapeSvg = parent.insert("g").attr("class", "cluster " + node.cssClasses).attr("id", node.id).attr("data-look", node.look);
		const useHtmlLabels = evaluate(siteConfig.flowchart.htmlLabels);
		const labelEl = shapeSvg.insert("g").attr("class", "cluster-label ");
		const text2 = await createText(labelEl, node.label, {
			style: node.labelStyle,
			useHtmlLabels,
			isNode: true,
			width: node.width
		});
		let bbox = text2.getBBox();
		if (evaluate(siteConfig.flowchart.htmlLabels)) {
			const div = text2.children[0];
			const dv = select_default(text2);
			bbox = div.getBoundingClientRect();
			dv.attr("width", bbox.width);
			dv.attr("height", bbox.height);
		}
		const width = node.width <= bbox.width + node.padding ? bbox.width + node.padding : node.width;
		if (node.width <= bbox.width + node.padding) node.diff = (width - node.width) / 2 - node.padding;
		else node.diff = -node.padding;
		const height = node.height;
		const x = node.x - width / 2;
		const y = node.y - height / 2;
		log.trace("Data ", node, JSON.stringify(node));
		let rect2;
		if (node.look === "handDrawn") {
			const rc = at.svg(shapeSvg);
			const options = userNodeOverrides(node, {
				roughness: .7,
				fill: clusterBkg,
				stroke: clusterBorder,
				fillWeight: 4,
				seed: handDrawnSeed
			});
			const roughNode = rc.path(createRoundedRectPathD(x, y, width, height, node.rx), options);
			rect2 = shapeSvg.insert(() => {
				log.debug("Rough node insert CXC", roughNode);
				return roughNode;
			}, ":first-child");
			rect2.select("path:nth-child(2)").attr("style", borderStyles.join(";"));
			rect2.select("path").attr("style", backgroundStyles.join(";").replace("fill", "stroke"));
		} else {
			rect2 = shapeSvg.insert("rect", ":first-child");
			rect2.attr("style", nodeStyles).attr("rx", node.rx).attr("ry", node.ry).attr("x", x).attr("y", y).attr("width", width).attr("height", height);
		}
		const { subGraphTitleTopMargin } = getSubGraphTitleMargins(siteConfig);
		labelEl.attr("transform", `translate(${node.x - bbox.width / 2}, ${node.y - node.height / 2 + subGraphTitleTopMargin})`);
		if (labelStyles) {
			const span = labelEl.select("span");
			if (span) span.attr("style", labelStyles);
		}
		const rectBox = rect2.node().getBBox();
		node.offsetX = 0;
		node.width = rectBox.width;
		node.height = rectBox.height;
		node.offsetY = bbox.height - node.padding / 2;
		node.intersect = function(point) {
			return intersect_rect_default(node, point);
		};
		return {
			cluster: shapeSvg,
			labelBBox: bbox
		};
	}, "kanbanSection")
};
var clusterElems = /* @__PURE__ */ new Map();
var insertCluster = /* @__PURE__ */ __name(async (elem, node) => {
	const cluster = await shapes[node.shape || "rect"](elem, node);
	clusterElems.set(node.id, cluster);
	return cluster;
}, "insertCluster");
var clear = /* @__PURE__ */ __name(() => {
	clusterElems = /* @__PURE__ */ new Map();
}, "clear");
function intersectNode(node, point) {
	return node.intersect(point);
}
__name(intersectNode, "intersectNode");
var intersect_node_default = intersectNode;
function intersectEllipse(node, rx, ry, point) {
	var cx = node.x;
	var cy = node.y;
	var px = cx - point.x;
	var py = cy - point.y;
	var det = Math.sqrt(rx * rx * py * py + ry * ry * px * px);
	var dx = Math.abs(rx * ry * px / det);
	if (point.x < cx) dx = -dx;
	var dy = Math.abs(rx * ry * py / det);
	if (point.y < cy) dy = -dy;
	return {
		x: cx + dx,
		y: cy + dy
	};
}
__name(intersectEllipse, "intersectEllipse");
var intersect_ellipse_default = intersectEllipse;
function intersectCircle(node, rx, point) {
	return intersect_ellipse_default(node, rx, rx, point);
}
__name(intersectCircle, "intersectCircle");
var intersect_circle_default = intersectCircle;
function intersectLine(p1, p2, q1, q2) {
	{
		const a1 = p2.y - p1.y;
		const b1 = p1.x - p2.x;
		const c1 = p2.x * p1.y - p1.x * p2.y;
		const r3 = a1 * q1.x + b1 * q1.y + c1;
		const r4 = a1 * q2.x + b1 * q2.y + c1;
		const epsilon = 1e-6;
		if (r3 !== 0 && r4 !== 0 && sameSign(r3, r4)) return;
		const a2 = q2.y - q1.y;
		const b2 = q1.x - q2.x;
		const c2 = q2.x * q1.y - q1.x * q2.y;
		const r1 = a2 * p1.x + b2 * p1.y + c2;
		const r2 = a2 * p2.x + b2 * p2.y + c2;
		if (Math.abs(r1) < epsilon && Math.abs(r2) < epsilon && sameSign(r1, r2)) return;
		const denom = a1 * b2 - a2 * b1;
		if (denom === 0) return;
		const offset = Math.abs(denom / 2);
		let num = b1 * c2 - b2 * c1;
		const x = num < 0 ? (num - offset) / denom : (num + offset) / denom;
		num = a2 * c1 - a1 * c2;
		return {
			x,
			y: num < 0 ? (num - offset) / denom : (num + offset) / denom
		};
	}
}
__name(intersectLine, "intersectLine");
function sameSign(r1, r2) {
	return r1 * r2 > 0;
}
__name(sameSign, "sameSign");
var intersect_line_default = intersectLine;
function intersectPolygon(node, polyPoints, point) {
	let x1 = node.x;
	let y1 = node.y;
	let intersections = [];
	let minX = Number.POSITIVE_INFINITY;
	let minY = Number.POSITIVE_INFINITY;
	if (typeof polyPoints.forEach === "function") polyPoints.forEach(function(entry) {
		minX = Math.min(minX, entry.x);
		minY = Math.min(minY, entry.y);
	});
	else {
		minX = Math.min(minX, polyPoints.x);
		minY = Math.min(minY, polyPoints.y);
	}
	let left = x1 - node.width / 2 - minX;
	let top = y1 - node.height / 2 - minY;
	for (let i = 0; i < polyPoints.length; i++) {
		let p1 = polyPoints[i];
		let p2 = polyPoints[i < polyPoints.length - 1 ? i + 1 : 0];
		let intersect = intersect_line_default(node, point, {
			x: left + p1.x,
			y: top + p1.y
		}, {
			x: left + p2.x,
			y: top + p2.y
		});
		if (intersect) intersections.push(intersect);
	}
	if (!intersections.length) return node;
	if (intersections.length > 1) intersections.sort(function(p, q) {
		let pdx = p.x - point.x;
		let pdy = p.y - point.y;
		let distp = Math.sqrt(pdx * pdx + pdy * pdy);
		let qdx = q.x - point.x;
		let qdy = q.y - point.y;
		let distq = Math.sqrt(qdx * qdx + qdy * qdy);
		return distp < distq ? -1 : distp === distq ? 0 : 1;
	});
	return intersections[0];
}
__name(intersectPolygon, "intersectPolygon");
var intersect_default = {
	node: intersect_node_default,
	circle: intersect_circle_default,
	ellipse: intersect_ellipse_default,
	polygon: intersectPolygon,
	rect: intersect_rect_default
};
function anchor(parent, node) {
	const { labelStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const classes = getNodeClasses(node);
	let cssClasses = classes;
	if (!classes) cssClasses = "anchor";
	const shapeSvg = parent.insert("g").attr("class", cssClasses).attr("id", node.domId || node.id);
	const radius = 1;
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {
		fill: "black",
		stroke: "none",
		fillStyle: "solid"
	});
	if (node.look !== "handDrawn") options.roughness = 0;
	const roughNode = rc.circle(0, 0, 2, options);
	const circleElem = shapeSvg.insert(() => roughNode, ":first-child");
	circleElem.attr("class", "anchor").attr("style", handleUndefinedAttr(cssStyles));
	updateNodeBounds(node, circleElem);
	node.intersect = function(point) {
		log.info("Circle intersect", node, radius, point);
		return intersect_default.circle(node, radius, point);
	};
	return shapeSvg;
}
__name(anchor, "anchor");
function generateArcPoints(x1, y1, x2, y2, rx, ry, clockwise) {
	const numPoints = 20;
	const midX = (x1 + x2) / 2;
	const midY = (y1 + y2) / 2;
	const angle = Math.atan2(y2 - y1, x2 - x1);
	const dx = (x2 - x1) / 2;
	const dy = (y2 - y1) / 2;
	const transformedX = dx / rx;
	const transformedY = dy / ry;
	const distance = Math.sqrt(transformedX ** 2 + transformedY ** 2);
	if (distance > 1) throw new Error("The given radii are too small to create an arc between the points.");
	const scaledCenterDistance = Math.sqrt(1 - distance ** 2);
	const centerX = midX + scaledCenterDistance * ry * Math.sin(angle) * (clockwise ? -1 : 1);
	const centerY = midY - scaledCenterDistance * rx * Math.cos(angle) * (clockwise ? -1 : 1);
	const startAngle = Math.atan2((y1 - centerY) / ry, (x1 - centerX) / rx);
	let angleRange = Math.atan2((y2 - centerY) / ry, (x2 - centerX) / rx) - startAngle;
	if (clockwise && angleRange < 0) angleRange += 2 * Math.PI;
	if (!clockwise && angleRange > 0) angleRange -= 2 * Math.PI;
	const points = [];
	for (let i = 0; i < numPoints; i++) {
		const angle2 = startAngle + i / 19 * angleRange;
		const x = centerX + rx * Math.cos(angle2);
		const y = centerY + ry * Math.sin(angle2);
		points.push({
			x,
			y
		});
	}
	return points;
}
__name(generateArcPoints, "generateArcPoints");
async function bowTieRect(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox } = await labelHelper(parent, node, getNodeClasses(node));
	const w = bbox.width + node.padding + 20;
	const h = bbox.height + node.padding;
	const ry = h / 2;
	const rx = ry / (2.5 + h / 50);
	const { cssStyles } = node;
	const points = [
		{
			x: w / 2,
			y: -h / 2
		},
		{
			x: -w / 2,
			y: -h / 2
		},
		...generateArcPoints(-w / 2, -h / 2, -w / 2, h / 2, rx, ry, false),
		{
			x: w / 2,
			y: h / 2
		},
		...generateArcPoints(w / 2, h / 2, w / 2, -h / 2, rx, ry, true)
	];
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const bowTieRectPath = createPathFromPoints(points);
	const bowTieRectShapePath = rc.path(bowTieRectPath, options);
	const bowTieRectShape = shapeSvg.insert(() => bowTieRectShapePath, ":first-child");
	bowTieRectShape.attr("class", "basic label-container");
	if (cssStyles && node.look !== "handDrawn") bowTieRectShape.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") bowTieRectShape.selectAll("path").attr("style", nodeStyles);
	bowTieRectShape.attr("transform", `translate(${rx / 2}, 0)`);
	updateNodeBounds(node, bowTieRectShape);
	node.intersect = function(point) {
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(bowTieRect, "bowTieRect");
function insertPolygonShape(parent, w, h, points) {
	return parent.insert("polygon", ":first-child").attr("points", points.map(function(d) {
		return d.x + "," + d.y;
	}).join(" ")).attr("class", "label-container").attr("transform", "translate(" + -w / 2 + "," + h / 2 + ")");
}
__name(insertPolygonShape, "insertPolygonShape");
async function card(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox } = await labelHelper(parent, node, getNodeClasses(node));
	const h = bbox.height + node.padding;
	const padding = 12;
	const w = bbox.width + node.padding + padding;
	const left = 0;
	const right = w;
	const top = -h;
	const bottom = 0;
	const points = [
		{
			x: 12,
			y: top
		},
		{
			x: right,
			y: top
		},
		{
			x: right,
			y: bottom
		},
		{
			x: left,
			y: bottom
		},
		{
			x: left,
			y: top + padding
		},
		{
			x: 12,
			y: top
		}
	];
	let polygon;
	const { cssStyles } = node;
	if (node.look === "handDrawn") {
		const rc = at.svg(shapeSvg);
		const options = userNodeOverrides(node, {});
		const pathData = createPathFromPoints(points);
		const roughNode = rc.path(pathData, options);
		polygon = shapeSvg.insert(() => roughNode, ":first-child").attr("transform", `translate(${-w / 2}, ${h / 2})`);
		if (cssStyles) polygon.attr("style", cssStyles);
	} else polygon = insertPolygonShape(shapeSvg, w, h, points);
	if (nodeStyles) polygon.attr("style", nodeStyles);
	updateNodeBounds(node, polygon);
	node.intersect = function(point) {
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(card, "card");
function choice(parent, node) {
	const { nodeStyles } = styles2String(node);
	node.label = "";
	const shapeSvg = parent.insert("g").attr("class", getNodeClasses(node)).attr("id", node.domId ?? node.id);
	const { cssStyles } = node;
	const s = Math.max(28, node.width ?? 0);
	const points = [
		{
			x: 0,
			y: s / 2
		},
		{
			x: s / 2,
			y: 0
		},
		{
			x: 0,
			y: -s / 2
		},
		{
			x: -s / 2,
			y: 0
		}
	];
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const choicePath = createPathFromPoints(points);
	const roughNode = rc.path(choicePath, options);
	const choiceShape = shapeSvg.insert(() => roughNode, ":first-child");
	if (cssStyles && node.look !== "handDrawn") choiceShape.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") choiceShape.selectAll("path").attr("style", nodeStyles);
	node.width = 28;
	node.height = 28;
	node.intersect = function(point) {
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(choice, "choice");
async function circle(parent, node, options) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, halfPadding } = await labelHelper(parent, node, getNodeClasses(node));
	const padding = options?.padding ?? halfPadding;
	const radius = bbox.width / 2 + padding;
	let circleElem;
	const { cssStyles } = node;
	if (node.look === "handDrawn") {
		const rc = at.svg(shapeSvg);
		const options2 = userNodeOverrides(node, {});
		const roughNode = rc.circle(0, 0, radius * 2, options2);
		circleElem = shapeSvg.insert(() => roughNode, ":first-child");
		circleElem.attr("class", "basic label-container").attr("style", handleUndefinedAttr(cssStyles));
	} else circleElem = shapeSvg.insert("circle", ":first-child").attr("class", "basic label-container").attr("style", nodeStyles).attr("r", radius).attr("cx", 0).attr("cy", 0);
	updateNodeBounds(node, circleElem);
	node.calcIntersect = function(bounds, point) {
		const radius2 = bounds.width / 2;
		return intersect_default.circle(bounds, radius2, point);
	};
	node.intersect = function(point) {
		log.info("Circle intersect", node, radius, point);
		return intersect_default.circle(node, radius, point);
	};
	return shapeSvg;
}
__name(circle, "circle");
function createLine(r) {
	const xAxis45 = Math.cos(Math.PI / 4);
	const yAxis45 = Math.sin(Math.PI / 4);
	const lineLength = r * 2;
	const pointQ1 = {
		x: lineLength / 2 * xAxis45,
		y: lineLength / 2 * yAxis45
	};
	const pointQ2 = {
		x: -(lineLength / 2) * xAxis45,
		y: lineLength / 2 * yAxis45
	};
	const pointQ3 = {
		x: -(lineLength / 2) * xAxis45,
		y: -(lineLength / 2) * yAxis45
	};
	const pointQ4 = {
		x: lineLength / 2 * xAxis45,
		y: -(lineLength / 2) * yAxis45
	};
	return `M ${pointQ2.x},${pointQ2.y} L ${pointQ4.x},${pointQ4.y}
                   M ${pointQ1.x},${pointQ1.y} L ${pointQ3.x},${pointQ3.y}`;
}
__name(createLine, "createLine");
function crossedCircle(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	node.label = "";
	const shapeSvg = parent.insert("g").attr("class", getNodeClasses(node)).attr("id", node.domId ?? node.id);
	const radius = Math.max(30, node?.width ?? 0);
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const circleNode = rc.circle(0, 0, radius * 2, options);
	const linePath = createLine(radius);
	const lineNode = rc.path(linePath, options);
	const crossedCircle2 = shapeSvg.insert(() => circleNode, ":first-child");
	crossedCircle2.insert(() => lineNode);
	if (cssStyles && node.look !== "handDrawn") crossedCircle2.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") crossedCircle2.selectAll("path").attr("style", nodeStyles);
	updateNodeBounds(node, crossedCircle2);
	node.intersect = function(point) {
		log.info("crossedCircle intersect", node, {
			radius,
			point
		});
		return intersect_default.circle(node, radius, point);
	};
	return shapeSvg;
}
__name(crossedCircle, "crossedCircle");
function generateCirclePoints2(centerX, centerY, radius, numPoints = 100, startAngle = 0, endAngle = 180) {
	const points = [];
	const startAngleRad = startAngle * Math.PI / 180;
	const angleStep = (endAngle * Math.PI / 180 - startAngleRad) / (numPoints - 1);
	for (let i = 0; i < numPoints; i++) {
		const angle = startAngleRad + i * angleStep;
		const x = centerX + radius * Math.cos(angle);
		const y = centerY + radius * Math.sin(angle);
		points.push({
			x: -x,
			y: -y
		});
	}
	return points;
}
__name(generateCirclePoints2, "generateCirclePoints");
async function curlyBraceLeft(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, getNodeClasses(node));
	const w = bbox.width + (node.padding ?? 0);
	const h = bbox.height + (node.padding ?? 0);
	const radius = Math.max(5, h * .1);
	const { cssStyles } = node;
	const points = [
		...generateCirclePoints2(w / 2, -h / 2, radius, 30, -90, 0),
		{
			x: -w / 2 - radius,
			y: radius
		},
		...generateCirclePoints2(w / 2 + radius * 2, -radius, radius, 20, -180, -270),
		...generateCirclePoints2(w / 2 + radius * 2, radius, radius, 20, -90, -180),
		{
			x: -w / 2 - radius,
			y: -h / 2
		},
		...generateCirclePoints2(w / 2, h / 2, radius, 20, 0, 90)
	];
	const rectPoints = [
		{
			x: w / 2,
			y: -h / 2 - radius
		},
		{
			x: -w / 2,
			y: -h / 2 - radius
		},
		...generateCirclePoints2(w / 2, -h / 2, radius, 20, -90, 0),
		{
			x: -w / 2 - radius,
			y: -radius
		},
		...generateCirclePoints2(w / 2 + w * .1, -radius, radius, 20, -180, -270),
		...generateCirclePoints2(w / 2 + w * .1, radius, radius, 20, -90, -180),
		{
			x: -w / 2 - radius,
			y: h / 2
		},
		...generateCirclePoints2(w / 2, h / 2, radius, 20, 0, 90),
		{
			x: -w / 2,
			y: h / 2 + radius
		},
		{
			x: w / 2,
			y: h / 2 + radius
		}
	];
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, { fill: "none" });
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const newCurlyBracePath = createPathFromPoints(points).replace("Z", "");
	const curlyBraceLeftNode = rc.path(newCurlyBracePath, options);
	const rectPath = createPathFromPoints(rectPoints);
	const rectShape = rc.path(rectPath, { ...options });
	const curlyBraceLeftShape = shapeSvg.insert("g", ":first-child");
	curlyBraceLeftShape.insert(() => rectShape, ":first-child").attr("stroke-opacity", 0);
	curlyBraceLeftShape.insert(() => curlyBraceLeftNode, ":first-child");
	curlyBraceLeftShape.attr("class", "text");
	if (cssStyles && node.look !== "handDrawn") curlyBraceLeftShape.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") curlyBraceLeftShape.selectAll("path").attr("style", nodeStyles);
	curlyBraceLeftShape.attr("transform", `translate(${radius}, 0)`);
	label.attr("transform", `translate(${-w / 2 + radius - (bbox.x - (bbox.left ?? 0))},${-h / 2 + (node.padding ?? 0) / 2 - (bbox.y - (bbox.top ?? 0))})`);
	updateNodeBounds(node, curlyBraceLeftShape);
	node.intersect = function(point) {
		return intersect_default.polygon(node, rectPoints, point);
	};
	return shapeSvg;
}
__name(curlyBraceLeft, "curlyBraceLeft");
function generateCirclePoints3(centerX, centerY, radius, numPoints = 100, startAngle = 0, endAngle = 180) {
	const points = [];
	const startAngleRad = startAngle * Math.PI / 180;
	const angleStep = (endAngle * Math.PI / 180 - startAngleRad) / (numPoints - 1);
	for (let i = 0; i < numPoints; i++) {
		const angle = startAngleRad + i * angleStep;
		const x = centerX + radius * Math.cos(angle);
		const y = centerY + radius * Math.sin(angle);
		points.push({
			x,
			y
		});
	}
	return points;
}
__name(generateCirclePoints3, "generateCirclePoints");
async function curlyBraceRight(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, getNodeClasses(node));
	const w = bbox.width + (node.padding ?? 0);
	const h = bbox.height + (node.padding ?? 0);
	const radius = Math.max(5, h * .1);
	const { cssStyles } = node;
	const points = [
		...generateCirclePoints3(w / 2, -h / 2, radius, 20, -90, 0),
		{
			x: w / 2 + radius,
			y: -radius
		},
		...generateCirclePoints3(w / 2 + radius * 2, -radius, radius, 20, -180, -270),
		...generateCirclePoints3(w / 2 + radius * 2, radius, radius, 20, -90, -180),
		{
			x: w / 2 + radius,
			y: h / 2
		},
		...generateCirclePoints3(w / 2, h / 2, radius, 20, 0, 90)
	];
	const rectPoints = [
		{
			x: -w / 2,
			y: -h / 2 - radius
		},
		{
			x: w / 2,
			y: -h / 2 - radius
		},
		...generateCirclePoints3(w / 2, -h / 2, radius, 20, -90, 0),
		{
			x: w / 2 + radius,
			y: -radius
		},
		...generateCirclePoints3(w / 2 + radius * 2, -radius, radius, 20, -180, -270),
		...generateCirclePoints3(w / 2 + radius * 2, radius, radius, 20, -90, -180),
		{
			x: w / 2 + radius,
			y: h / 2
		},
		...generateCirclePoints3(w / 2, h / 2, radius, 20, 0, 90),
		{
			x: w / 2,
			y: h / 2 + radius
		},
		{
			x: -w / 2,
			y: h / 2 + radius
		}
	];
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, { fill: "none" });
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const newCurlyBracePath = createPathFromPoints(points).replace("Z", "");
	const curlyBraceRightNode = rc.path(newCurlyBracePath, options);
	const rectPath = createPathFromPoints(rectPoints);
	const rectShape = rc.path(rectPath, { ...options });
	const curlyBraceRightShape = shapeSvg.insert("g", ":first-child");
	curlyBraceRightShape.insert(() => rectShape, ":first-child").attr("stroke-opacity", 0);
	curlyBraceRightShape.insert(() => curlyBraceRightNode, ":first-child");
	curlyBraceRightShape.attr("class", "text");
	if (cssStyles && node.look !== "handDrawn") curlyBraceRightShape.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") curlyBraceRightShape.selectAll("path").attr("style", nodeStyles);
	curlyBraceRightShape.attr("transform", `translate(${-radius}, 0)`);
	label.attr("transform", `translate(${-w / 2 + (node.padding ?? 0) / 2 - (bbox.x - (bbox.left ?? 0))},${-h / 2 + (node.padding ?? 0) / 2 - (bbox.y - (bbox.top ?? 0))})`);
	updateNodeBounds(node, curlyBraceRightShape);
	node.intersect = function(point) {
		return intersect_default.polygon(node, rectPoints, point);
	};
	return shapeSvg;
}
__name(curlyBraceRight, "curlyBraceRight");
function generateCirclePoints4(centerX, centerY, radius, numPoints = 100, startAngle = 0, endAngle = 180) {
	const points = [];
	const startAngleRad = startAngle * Math.PI / 180;
	const angleStep = (endAngle * Math.PI / 180 - startAngleRad) / (numPoints - 1);
	for (let i = 0; i < numPoints; i++) {
		const angle = startAngleRad + i * angleStep;
		const x = centerX + radius * Math.cos(angle);
		const y = centerY + radius * Math.sin(angle);
		points.push({
			x: -x,
			y: -y
		});
	}
	return points;
}
__name(generateCirclePoints4, "generateCirclePoints");
async function curlyBraces(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, getNodeClasses(node));
	const w = bbox.width + (node.padding ?? 0);
	const h = bbox.height + (node.padding ?? 0);
	const radius = Math.max(5, h * .1);
	const { cssStyles } = node;
	const leftCurlyBracePoints = [
		...generateCirclePoints4(w / 2, -h / 2, radius, 30, -90, 0),
		{
			x: -w / 2 - radius,
			y: radius
		},
		...generateCirclePoints4(w / 2 + radius * 2, -radius, radius, 20, -180, -270),
		...generateCirclePoints4(w / 2 + radius * 2, radius, radius, 20, -90, -180),
		{
			x: -w / 2 - radius,
			y: -h / 2
		},
		...generateCirclePoints4(w / 2, h / 2, radius, 20, 0, 90)
	];
	const rightCurlyBracePoints = [
		...generateCirclePoints4(-w / 2 + radius + radius / 2, -h / 2, radius, 20, -90, -180),
		{
			x: w / 2 - radius / 2,
			y: radius
		},
		...generateCirclePoints4(-w / 2 - radius / 2, -radius, radius, 20, 0, 90),
		...generateCirclePoints4(-w / 2 - radius / 2, radius, radius, 20, -90, 0),
		{
			x: w / 2 - radius / 2,
			y: -radius
		},
		...generateCirclePoints4(-w / 2 + radius + radius / 2, h / 2, radius, 30, -180, -270)
	];
	const rectPoints = [
		{
			x: w / 2,
			y: -h / 2 - radius
		},
		{
			x: -w / 2,
			y: -h / 2 - radius
		},
		...generateCirclePoints4(w / 2, -h / 2, radius, 20, -90, 0),
		{
			x: -w / 2 - radius,
			y: -radius
		},
		...generateCirclePoints4(w / 2 + radius * 2, -radius, radius, 20, -180, -270),
		...generateCirclePoints4(w / 2 + radius * 2, radius, radius, 20, -90, -180),
		{
			x: -w / 2 - radius,
			y: h / 2
		},
		...generateCirclePoints4(w / 2, h / 2, radius, 20, 0, 90),
		{
			x: -w / 2,
			y: h / 2 + radius
		},
		{
			x: w / 2 - radius - radius / 2,
			y: h / 2 + radius
		},
		...generateCirclePoints4(-w / 2 + radius + radius / 2, -h / 2, radius, 20, -90, -180),
		{
			x: w / 2 - radius / 2,
			y: radius
		},
		...generateCirclePoints4(-w / 2 - radius / 2, -radius, radius, 20, 0, 90),
		...generateCirclePoints4(-w / 2 - radius / 2, radius, radius, 20, -90, 0),
		{
			x: w / 2 - radius / 2,
			y: -radius
		},
		...generateCirclePoints4(-w / 2 + radius + radius / 2, h / 2, radius, 30, -180, -270)
	];
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, { fill: "none" });
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const newLeftCurlyBracePath = createPathFromPoints(leftCurlyBracePoints).replace("Z", "");
	const leftCurlyBraceNode = rc.path(newLeftCurlyBracePath, options);
	const newRightCurlyBracePath = createPathFromPoints(rightCurlyBracePoints).replace("Z", "");
	const rightCurlyBraceNode = rc.path(newRightCurlyBracePath, options);
	const rectPath = createPathFromPoints(rectPoints);
	const rectShape = rc.path(rectPath, { ...options });
	const curlyBracesShape = shapeSvg.insert("g", ":first-child");
	curlyBracesShape.insert(() => rectShape, ":first-child").attr("stroke-opacity", 0);
	curlyBracesShape.insert(() => leftCurlyBraceNode, ":first-child");
	curlyBracesShape.insert(() => rightCurlyBraceNode, ":first-child");
	curlyBracesShape.attr("class", "text");
	if (cssStyles && node.look !== "handDrawn") curlyBracesShape.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") curlyBracesShape.selectAll("path").attr("style", nodeStyles);
	curlyBracesShape.attr("transform", `translate(${radius - radius / 4}, 0)`);
	label.attr("transform", `translate(${-w / 2 + (node.padding ?? 0) / 2 - (bbox.x - (bbox.left ?? 0))},${-h / 2 + (node.padding ?? 0) / 2 - (bbox.y - (bbox.top ?? 0))})`);
	updateNodeBounds(node, curlyBracesShape);
	node.intersect = function(point) {
		return intersect_default.polygon(node, rectPoints, point);
	};
	return shapeSvg;
}
__name(curlyBraces, "curlyBraces");
async function curvedTrapezoid(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox } = await labelHelper(parent, node, getNodeClasses(node));
	const minWidth = 80, minHeight = 20;
	const w = Math.max(minWidth, (bbox.width + (node.padding ?? 0) * 2) * 1.25, node?.width ?? 0);
	const h = Math.max(minHeight, bbox.height + (node.padding ?? 0) * 2, node?.height ?? 0);
	const radius = h / 2;
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const totalWidth = w, totalHeight = h;
	const rw = totalWidth - radius;
	const tw = totalHeight / 4;
	const points = [
		{
			x: rw,
			y: 0
		},
		{
			x: tw,
			y: 0
		},
		{
			x: 0,
			y: totalHeight / 2
		},
		{
			x: tw,
			y: totalHeight
		},
		{
			x: rw,
			y: totalHeight
		},
		...generateCirclePoints(-rw, -totalHeight / 2, radius, 50, 270, 90)
	];
	const pathData = createPathFromPoints(points);
	const shapeNode = rc.path(pathData, options);
	const polygon = shapeSvg.insert(() => shapeNode, ":first-child");
	polygon.attr("class", "basic label-container");
	if (cssStyles && node.look !== "handDrawn") polygon.selectChildren("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") polygon.selectChildren("path").attr("style", nodeStyles);
	polygon.attr("transform", `translate(${-w / 2}, ${-h / 2})`);
	updateNodeBounds(node, polygon);
	node.intersect = function(point) {
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(curvedTrapezoid, "curvedTrapezoid");
var createCylinderPathD = /* @__PURE__ */ __name((x, y, width, height, rx, ry) => {
	return [
		`M${x},${y + ry}`,
		`a${rx},${ry} 0,0,0 ${width},0`,
		`a${rx},${ry} 0,0,0 ${-width},0`,
		`l0,${height}`,
		`a${rx},${ry} 0,0,0 ${width},0`,
		`l0,${-height}`
	].join(" ");
}, "createCylinderPathD");
var createOuterCylinderPathD = /* @__PURE__ */ __name((x, y, width, height, rx, ry) => {
	return [
		`M${x},${y + ry}`,
		`M${x + width},${y + ry}`,
		`a${rx},${ry} 0,0,0 ${-width},0`,
		`l0,${height}`,
		`a${rx},${ry} 0,0,0 ${width},0`,
		`l0,${-height}`
	].join(" ");
}, "createOuterCylinderPathD");
var createInnerCylinderPathD = /* @__PURE__ */ __name((x, y, width, height, rx, ry) => {
	return [`M${x - width / 2},${-height / 2}`, `a${rx},${ry} 0,0,0 ${width},0`].join(" ");
}, "createInnerCylinderPathD");
async function cylinder(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, getNodeClasses(node));
	const w = Math.max(bbox.width + node.padding, node.width ?? 0);
	const rx = w / 2;
	const ry = rx / (2.5 + w / 50);
	const h = Math.max(bbox.height + ry + node.padding, node.height ?? 0);
	let cylinder2;
	const { cssStyles } = node;
	if (node.look === "handDrawn") {
		const rc = at.svg(shapeSvg);
		const outerPathData = createOuterCylinderPathD(0, 0, w, h, rx, ry);
		const innerPathData = createInnerCylinderPathD(0, ry, w, h, rx, ry);
		const outerNode = rc.path(outerPathData, userNodeOverrides(node, {}));
		const innerLine = rc.path(innerPathData, userNodeOverrides(node, { fill: "none" }));
		cylinder2 = shapeSvg.insert(() => innerLine, ":first-child");
		cylinder2 = shapeSvg.insert(() => outerNode, ":first-child");
		cylinder2.attr("class", "basic label-container");
		if (cssStyles) cylinder2.attr("style", cssStyles);
	} else {
		const pathData = createCylinderPathD(0, 0, w, h, rx, ry);
		cylinder2 = shapeSvg.insert("path", ":first-child").attr("d", pathData).attr("class", "basic label-container").attr("style", handleUndefinedAttr(cssStyles)).attr("style", nodeStyles);
	}
	cylinder2.attr("label-offset-y", ry);
	cylinder2.attr("transform", `translate(${-w / 2}, ${-(h / 2 + ry)})`);
	updateNodeBounds(node, cylinder2);
	label.attr("transform", `translate(${-(bbox.width / 2) - (bbox.x - (bbox.left ?? 0))}, ${-(bbox.height / 2) + (node.padding ?? 0) / 1.5 - (bbox.y - (bbox.top ?? 0))})`);
	node.intersect = function(point) {
		const pos = intersect_default.rect(node, point);
		const x = pos.x - (node.x ?? 0);
		if (rx != 0 && (Math.abs(x) < (node.width ?? 0) / 2 || Math.abs(x) == (node.width ?? 0) / 2 && Math.abs(pos.y - (node.y ?? 0)) > (node.height ?? 0) / 2 - ry)) {
			let y = ry * ry * (1 - x * x / (rx * rx));
			if (y > 0) y = Math.sqrt(y);
			y = ry - y;
			if (point.y - (node.y ?? 0) > 0) y = -y;
			pos.y += y;
		}
		return pos;
	};
	return shapeSvg;
}
__name(cylinder, "cylinder");
async function dividedRectangle(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, getNodeClasses(node));
	const w = bbox.width + node.padding;
	const h = bbox.height + node.padding;
	const rectOffset = h * .2;
	const x = -w / 2;
	const y = -h / 2 - rectOffset / 2;
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const pts = [
		{
			x,
			y: y + rectOffset
		},
		{
			x: -x,
			y: y + rectOffset
		},
		{
			x: -x,
			y: -y
		},
		{
			x,
			y: -y
		},
		{
			x,
			y
		},
		{
			x: -x,
			y
		},
		{
			x: -x,
			y: y + rectOffset
		}
	];
	const poly = rc.polygon(pts.map((p) => [p.x, p.y]), options);
	const polygon = shapeSvg.insert(() => poly, ":first-child");
	polygon.attr("class", "basic label-container");
	if (cssStyles && node.look !== "handDrawn") polygon.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") polygon.selectAll("path").attr("style", nodeStyles);
	label.attr("transform", `translate(${x + (node.padding ?? 0) / 2 - (bbox.x - (bbox.left ?? 0))}, ${y + rectOffset + (node.padding ?? 0) / 2 - (bbox.y - (bbox.top ?? 0))})`);
	updateNodeBounds(node, polygon);
	node.intersect = function(point) {
		return intersect_default.rect(node, point);
	};
	return shapeSvg;
}
__name(dividedRectangle, "dividedRectangle");
async function doublecircle(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, halfPadding } = await labelHelper(parent, node, getNodeClasses(node));
	const outerRadius = bbox.width / 2 + halfPadding + 5;
	const innerRadius = bbox.width / 2 + halfPadding;
	let circleGroup;
	const { cssStyles } = node;
	if (node.look === "handDrawn") {
		const rc = at.svg(shapeSvg);
		const outerOptions = userNodeOverrides(node, {
			roughness: .2,
			strokeWidth: 2.5
		});
		const innerOptions = userNodeOverrides(node, {
			roughness: .2,
			strokeWidth: 1.5
		});
		const outerRoughNode = rc.circle(0, 0, outerRadius * 2, outerOptions);
		const innerRoughNode = rc.circle(0, 0, innerRadius * 2, innerOptions);
		circleGroup = shapeSvg.insert("g", ":first-child");
		circleGroup.attr("class", handleUndefinedAttr(node.cssClasses)).attr("style", handleUndefinedAttr(cssStyles));
		circleGroup.node()?.appendChild(outerRoughNode);
		circleGroup.node()?.appendChild(innerRoughNode);
	} else {
		circleGroup = shapeSvg.insert("g", ":first-child");
		const outerCircle = circleGroup.insert("circle", ":first-child");
		const innerCircle = circleGroup.insert("circle");
		circleGroup.attr("class", "basic label-container").attr("style", nodeStyles);
		outerCircle.attr("class", "outer-circle").attr("style", nodeStyles).attr("r", outerRadius).attr("cx", 0).attr("cy", 0);
		innerCircle.attr("class", "inner-circle").attr("style", nodeStyles).attr("r", innerRadius).attr("cx", 0).attr("cy", 0);
	}
	updateNodeBounds(node, circleGroup);
	node.intersect = function(point) {
		log.info("DoubleCircle intersect", node, outerRadius, point);
		return intersect_default.circle(node, outerRadius, point);
	};
	return shapeSvg;
}
__name(doublecircle, "doublecircle");
function filledCircle(parent, node, { config: { themeVariables } }) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.label = "";
	node.labelStyle = labelStyles;
	const shapeSvg = parent.insert("g").attr("class", getNodeClasses(node)).attr("id", node.domId ?? node.id);
	const radius = 7;
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const { nodeBorder } = themeVariables;
	const options = userNodeOverrides(node, { fillStyle: "solid" });
	if (node.look !== "handDrawn") options.roughness = 0;
	const circleNode = rc.circle(0, 0, 14, options);
	const filledCircle2 = shapeSvg.insert(() => circleNode, ":first-child");
	filledCircle2.selectAll("path").attr("style", `fill: ${nodeBorder} !important;`);
	if (cssStyles && cssStyles.length > 0 && node.look !== "handDrawn") filledCircle2.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") filledCircle2.selectAll("path").attr("style", nodeStyles);
	updateNodeBounds(node, filledCircle2);
	node.intersect = function(point) {
		log.info("filledCircle intersect", node, {
			radius,
			point
		});
		return intersect_default.circle(node, radius, point);
	};
	return shapeSvg;
}
__name(filledCircle, "filledCircle");
async function flippedTriangle(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, getNodeClasses(node));
	const w = bbox.width + (node.padding ?? 0);
	const h = w + bbox.height;
	const tw = w + bbox.height;
	const points = [
		{
			x: 0,
			y: -h
		},
		{
			x: tw,
			y: -h
		},
		{
			x: tw / 2,
			y: 0
		}
	];
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const pathData = createPathFromPoints(points);
	const roughNode = rc.path(pathData, options);
	const flippedTriangle2 = shapeSvg.insert(() => roughNode, ":first-child").attr("transform", `translate(${-h / 2}, ${h / 2})`);
	if (cssStyles && node.look !== "handDrawn") flippedTriangle2.selectChildren("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") flippedTriangle2.selectChildren("path").attr("style", nodeStyles);
	node.width = w;
	node.height = h;
	updateNodeBounds(node, flippedTriangle2);
	label.attr("transform", `translate(${-bbox.width / 2 - (bbox.x - (bbox.left ?? 0))}, ${-h / 2 + (node.padding ?? 0) / 2 + (bbox.y - (bbox.top ?? 0))})`);
	node.intersect = function(point) {
		log.info("Triangle intersect", node, points, point);
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(flippedTriangle, "flippedTriangle");
function forkJoin(parent, node, { dir, config: { state: state2, themeVariables } }) {
	const { nodeStyles } = styles2String(node);
	node.label = "";
	const shapeSvg = parent.insert("g").attr("class", getNodeClasses(node)).attr("id", node.domId ?? node.id);
	const { cssStyles } = node;
	let width = Math.max(70, node?.width ?? 0);
	let height = Math.max(10, node?.height ?? 0);
	if (dir === "LR") {
		width = Math.max(10, node?.width ?? 0);
		height = Math.max(70, node?.height ?? 0);
	}
	const x = -1 * width / 2;
	const y = -1 * height / 2;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {
		stroke: themeVariables.lineColor,
		fill: themeVariables.lineColor
	});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const roughNode = rc.rectangle(x, y, width, height, options);
	const shape = shapeSvg.insert(() => roughNode, ":first-child");
	if (cssStyles && node.look !== "handDrawn") shape.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") shape.selectAll("path").attr("style", nodeStyles);
	updateNodeBounds(node, shape);
	const padding = state2?.padding ?? 0;
	if (node.width && node.height) {
		node.width += padding / 2 || 0;
		node.height += padding / 2 || 0;
	}
	node.intersect = function(point) {
		return intersect_default.rect(node, point);
	};
	return shapeSvg;
}
__name(forkJoin, "forkJoin");
async function halfRoundedRectangle(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const minWidth = 80, minHeight = 50;
	const { shapeSvg, bbox } = await labelHelper(parent, node, getNodeClasses(node));
	const w = Math.max(minWidth, bbox.width + (node.padding ?? 0) * 2, node?.width ?? 0);
	const h = Math.max(minHeight, bbox.height + (node.padding ?? 0) * 2, node?.height ?? 0);
	const radius = h / 2;
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const points = [
		{
			x: -w / 2,
			y: -h / 2
		},
		{
			x: w / 2 - radius,
			y: -h / 2
		},
		...generateCirclePoints(-w / 2 + radius, 0, radius, 50, 90, 270),
		{
			x: w / 2 - radius,
			y: h / 2
		},
		{
			x: -w / 2,
			y: h / 2
		}
	];
	const pathData = createPathFromPoints(points);
	const shapeNode = rc.path(pathData, options);
	const polygon = shapeSvg.insert(() => shapeNode, ":first-child");
	polygon.attr("class", "basic label-container");
	if (cssStyles && node.look !== "handDrawn") polygon.selectChildren("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") polygon.selectChildren("path").attr("style", nodeStyles);
	updateNodeBounds(node, polygon);
	node.intersect = function(point) {
		log.info("Pill intersect", node, {
			radius,
			point
		});
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(halfRoundedRectangle, "halfRoundedRectangle");
async function hexagon(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox } = await labelHelper(parent, node, getNodeClasses(node));
	const h = bbox.height + (node.padding ?? 0);
	const w = bbox.width + (node.padding ?? 0) * 2.5;
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	let halfWidth = w / 2;
	const m = halfWidth / 6;
	halfWidth = halfWidth + m;
	const halfHeight = h / 2;
	const fixedLength = halfHeight / 2;
	const deducedWidth = halfWidth - fixedLength;
	const points = [
		{
			x: -deducedWidth,
			y: -halfHeight
		},
		{
			x: 0,
			y: -halfHeight
		},
		{
			x: deducedWidth,
			y: -halfHeight
		},
		{
			x: halfWidth,
			y: 0
		},
		{
			x: deducedWidth,
			y: halfHeight
		},
		{
			x: 0,
			y: halfHeight
		},
		{
			x: -deducedWidth,
			y: halfHeight
		},
		{
			x: -halfWidth,
			y: 0
		}
	];
	const pathData = createPathFromPoints(points);
	const shapeNode = rc.path(pathData, options);
	const polygon = shapeSvg.insert(() => shapeNode, ":first-child");
	polygon.attr("class", "basic label-container");
	if (cssStyles && node.look !== "handDrawn") polygon.selectChildren("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") polygon.selectChildren("path").attr("style", nodeStyles);
	node.width = w;
	node.height = h;
	updateNodeBounds(node, polygon);
	node.intersect = function(point) {
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(hexagon, "hexagon");
async function hourglass(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.label = "";
	node.labelStyle = labelStyles;
	const { shapeSvg } = await labelHelper(parent, node, getNodeClasses(node));
	const w = Math.max(30, node?.width ?? 0);
	const h = Math.max(30, node?.height ?? 0);
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const points = [
		{
			x: 0,
			y: 0
		},
		{
			x: w,
			y: 0
		},
		{
			x: 0,
			y: h
		},
		{
			x: w,
			y: h
		}
	];
	const pathData = createPathFromPoints(points);
	const shapeNode = rc.path(pathData, options);
	const polygon = shapeSvg.insert(() => shapeNode, ":first-child");
	polygon.attr("class", "basic label-container");
	if (cssStyles && node.look !== "handDrawn") polygon.selectChildren("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") polygon.selectChildren("path").attr("style", nodeStyles);
	polygon.attr("transform", `translate(${-w / 2}, ${-h / 2})`);
	updateNodeBounds(node, polygon);
	node.intersect = function(point) {
		log.info("Pill intersect", node, { points });
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(hourglass, "hourglass");
async function icon(parent, node, { config: { themeVariables, flowchart } }) {
	const { labelStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const assetHeight = node.assetHeight ?? 48;
	const assetWidth = node.assetWidth ?? 48;
	const iconSize = Math.max(assetHeight, assetWidth);
	const defaultWidth = flowchart?.wrappingWidth;
	node.width = Math.max(iconSize, defaultWidth ?? 0);
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, "icon-shape default");
	const topLabel = node.pos === "t";
	const height = iconSize;
	const width = iconSize;
	const { nodeBorder } = themeVariables;
	const { stylesMap } = compileStyles(node);
	const x = -width / 2;
	const y = -height / 2;
	const labelPadding = node.label ? 8 : 0;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {
		stroke: "none",
		fill: "none"
	});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const iconNode = rc.rectangle(x, y, width, height, options);
	const outerWidth = Math.max(width, bbox.width);
	const outerHeight = height + bbox.height + labelPadding;
	const outerNode = rc.rectangle(-outerWidth / 2, -outerHeight / 2, outerWidth, outerHeight, {
		...options,
		fill: "transparent",
		stroke: "none"
	});
	const iconShape = shapeSvg.insert(() => iconNode, ":first-child");
	const outerShape = shapeSvg.insert(() => outerNode);
	if (node.icon) {
		const iconElem = shapeSvg.append("g");
		iconElem.html(`<g>${await getIconSVG(node.icon, {
			height: iconSize,
			width: iconSize,
			fallbackPrefix: ""
		})}</g>`);
		const iconBBox = iconElem.node().getBBox();
		const iconWidth = iconBBox.width;
		const iconHeight = iconBBox.height;
		const iconX = iconBBox.x;
		const iconY = iconBBox.y;
		iconElem.attr("transform", `translate(${-iconWidth / 2 - iconX},${topLabel ? bbox.height / 2 + labelPadding / 2 - iconHeight / 2 - iconY : -bbox.height / 2 - labelPadding / 2 - iconHeight / 2 - iconY})`);
		iconElem.attr("style", `color: ${stylesMap.get("stroke") ?? nodeBorder};`);
	}
	label.attr("transform", `translate(${-bbox.width / 2 - (bbox.x - (bbox.left ?? 0))},${topLabel ? -outerHeight / 2 : outerHeight / 2 - bbox.height})`);
	iconShape.attr("transform", `translate(0,${topLabel ? bbox.height / 2 + labelPadding / 2 : -bbox.height / 2 - labelPadding / 2})`);
	updateNodeBounds(node, outerShape);
	node.intersect = function(point) {
		log.info("iconSquare intersect", node, point);
		if (!node.label) return intersect_default.rect(node, point);
		const dx = node.x ?? 0;
		const dy = node.y ?? 0;
		const nodeHeight = node.height ?? 0;
		let points = [];
		if (topLabel) points = [
			{
				x: dx - bbox.width / 2,
				y: dy - nodeHeight / 2
			},
			{
				x: dx + bbox.width / 2,
				y: dy - nodeHeight / 2
			},
			{
				x: dx + bbox.width / 2,
				y: dy - nodeHeight / 2 + bbox.height + labelPadding
			},
			{
				x: dx + width / 2,
				y: dy - nodeHeight / 2 + bbox.height + labelPadding
			},
			{
				x: dx + width / 2,
				y: dy + nodeHeight / 2
			},
			{
				x: dx - width / 2,
				y: dy + nodeHeight / 2
			},
			{
				x: dx - width / 2,
				y: dy - nodeHeight / 2 + bbox.height + labelPadding
			},
			{
				x: dx - bbox.width / 2,
				y: dy - nodeHeight / 2 + bbox.height + labelPadding
			}
		];
		else points = [
			{
				x: dx - width / 2,
				y: dy - nodeHeight / 2
			},
			{
				x: dx + width / 2,
				y: dy - nodeHeight / 2
			},
			{
				x: dx + width / 2,
				y: dy - nodeHeight / 2 + height
			},
			{
				x: dx + bbox.width / 2,
				y: dy - nodeHeight / 2 + height
			},
			{
				x: dx + bbox.width / 2 / 2,
				y: dy + nodeHeight / 2
			},
			{
				x: dx - bbox.width / 2,
				y: dy + nodeHeight / 2
			},
			{
				x: dx - bbox.width / 2,
				y: dy - nodeHeight / 2 + height
			},
			{
				x: dx - width / 2,
				y: dy - nodeHeight / 2 + height
			}
		];
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(icon, "icon");
async function iconCircle(parent, node, { config: { themeVariables, flowchart } }) {
	const { labelStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const assetHeight = node.assetHeight ?? 48;
	const assetWidth = node.assetWidth ?? 48;
	const iconSize = Math.max(assetHeight, assetWidth);
	const defaultWidth = flowchart?.wrappingWidth;
	node.width = Math.max(iconSize, defaultWidth ?? 0);
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, "icon-shape default");
	const labelPadding = node.label ? 8 : 0;
	const topLabel = node.pos === "t";
	const { nodeBorder, mainBkg } = themeVariables;
	const { stylesMap } = compileStyles(node);
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	options.stroke = stylesMap.get("fill") ?? mainBkg;
	const iconElem = shapeSvg.append("g");
	if (node.icon) iconElem.html(`<g>${await getIconSVG(node.icon, {
		height: iconSize,
		width: iconSize,
		fallbackPrefix: ""
	})}</g>`);
	const iconBBox = iconElem.node().getBBox();
	const iconWidth = iconBBox.width;
	const iconHeight = iconBBox.height;
	const iconX = iconBBox.x;
	const iconY = iconBBox.y;
	const diameter = Math.max(iconWidth, iconHeight) * Math.SQRT2 + 40;
	const iconNode = rc.circle(0, 0, diameter, options);
	const outerWidth = Math.max(diameter, bbox.width);
	const outerHeight = diameter + bbox.height + labelPadding;
	const outerNode = rc.rectangle(-outerWidth / 2, -outerHeight / 2, outerWidth, outerHeight, {
		...options,
		fill: "transparent",
		stroke: "none"
	});
	const iconShape = shapeSvg.insert(() => iconNode, ":first-child");
	const outerShape = shapeSvg.insert(() => outerNode);
	iconElem.attr("transform", `translate(${-iconWidth / 2 - iconX},${topLabel ? bbox.height / 2 + labelPadding / 2 - iconHeight / 2 - iconY : -bbox.height / 2 - labelPadding / 2 - iconHeight / 2 - iconY})`);
	iconElem.attr("style", `color: ${stylesMap.get("stroke") ?? nodeBorder};`);
	label.attr("transform", `translate(${-bbox.width / 2 - (bbox.x - (bbox.left ?? 0))},${topLabel ? -outerHeight / 2 : outerHeight / 2 - bbox.height})`);
	iconShape.attr("transform", `translate(0,${topLabel ? bbox.height / 2 + labelPadding / 2 : -bbox.height / 2 - labelPadding / 2})`);
	updateNodeBounds(node, outerShape);
	node.intersect = function(point) {
		log.info("iconSquare intersect", node, point);
		return intersect_default.rect(node, point);
	};
	return shapeSvg;
}
__name(iconCircle, "iconCircle");
async function iconRounded(parent, node, { config: { themeVariables, flowchart } }) {
	const { labelStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const assetHeight = node.assetHeight ?? 48;
	const assetWidth = node.assetWidth ?? 48;
	const iconSize = Math.max(assetHeight, assetWidth);
	const defaultWidth = flowchart?.wrappingWidth;
	node.width = Math.max(iconSize, defaultWidth ?? 0);
	const { shapeSvg, bbox, halfPadding, label } = await labelHelper(parent, node, "icon-shape default");
	const topLabel = node.pos === "t";
	const height = iconSize + halfPadding * 2;
	const width = iconSize + halfPadding * 2;
	const { nodeBorder, mainBkg } = themeVariables;
	const { stylesMap } = compileStyles(node);
	const x = -width / 2;
	const y = -height / 2;
	const labelPadding = node.label ? 8 : 0;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	options.stroke = stylesMap.get("fill") ?? mainBkg;
	const iconNode = rc.path(createRoundedRectPathD(x, y, width, height, 5), options);
	const outerWidth = Math.max(width, bbox.width);
	const outerHeight = height + bbox.height + labelPadding;
	const outerNode = rc.rectangle(-outerWidth / 2, -outerHeight / 2, outerWidth, outerHeight, {
		...options,
		fill: "transparent",
		stroke: "none"
	});
	const iconShape = shapeSvg.insert(() => iconNode, ":first-child").attr("class", "icon-shape2");
	const outerShape = shapeSvg.insert(() => outerNode);
	if (node.icon) {
		const iconElem = shapeSvg.append("g");
		iconElem.html(`<g>${await getIconSVG(node.icon, {
			height: iconSize,
			width: iconSize,
			fallbackPrefix: ""
		})}</g>`);
		const iconBBox = iconElem.node().getBBox();
		const iconWidth = iconBBox.width;
		const iconHeight = iconBBox.height;
		const iconX = iconBBox.x;
		const iconY = iconBBox.y;
		iconElem.attr("transform", `translate(${-iconWidth / 2 - iconX},${topLabel ? bbox.height / 2 + labelPadding / 2 - iconHeight / 2 - iconY : -bbox.height / 2 - labelPadding / 2 - iconHeight / 2 - iconY})`);
		iconElem.attr("style", `color: ${stylesMap.get("stroke") ?? nodeBorder};`);
	}
	label.attr("transform", `translate(${-bbox.width / 2 - (bbox.x - (bbox.left ?? 0))},${topLabel ? -outerHeight / 2 : outerHeight / 2 - bbox.height})`);
	iconShape.attr("transform", `translate(0,${topLabel ? bbox.height / 2 + labelPadding / 2 : -bbox.height / 2 - labelPadding / 2})`);
	updateNodeBounds(node, outerShape);
	node.intersect = function(point) {
		log.info("iconSquare intersect", node, point);
		if (!node.label) return intersect_default.rect(node, point);
		const dx = node.x ?? 0;
		const dy = node.y ?? 0;
		const nodeHeight = node.height ?? 0;
		let points = [];
		if (topLabel) points = [
			{
				x: dx - bbox.width / 2,
				y: dy - nodeHeight / 2
			},
			{
				x: dx + bbox.width / 2,
				y: dy - nodeHeight / 2
			},
			{
				x: dx + bbox.width / 2,
				y: dy - nodeHeight / 2 + bbox.height + labelPadding
			},
			{
				x: dx + width / 2,
				y: dy - nodeHeight / 2 + bbox.height + labelPadding
			},
			{
				x: dx + width / 2,
				y: dy + nodeHeight / 2
			},
			{
				x: dx - width / 2,
				y: dy + nodeHeight / 2
			},
			{
				x: dx - width / 2,
				y: dy - nodeHeight / 2 + bbox.height + labelPadding
			},
			{
				x: dx - bbox.width / 2,
				y: dy - nodeHeight / 2 + bbox.height + labelPadding
			}
		];
		else points = [
			{
				x: dx - width / 2,
				y: dy - nodeHeight / 2
			},
			{
				x: dx + width / 2,
				y: dy - nodeHeight / 2
			},
			{
				x: dx + width / 2,
				y: dy - nodeHeight / 2 + height
			},
			{
				x: dx + bbox.width / 2,
				y: dy - nodeHeight / 2 + height
			},
			{
				x: dx + bbox.width / 2 / 2,
				y: dy + nodeHeight / 2
			},
			{
				x: dx - bbox.width / 2,
				y: dy + nodeHeight / 2
			},
			{
				x: dx - bbox.width / 2,
				y: dy - nodeHeight / 2 + height
			},
			{
				x: dx - width / 2,
				y: dy - nodeHeight / 2 + height
			}
		];
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(iconRounded, "iconRounded");
async function iconSquare(parent, node, { config: { themeVariables, flowchart } }) {
	const { labelStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const assetHeight = node.assetHeight ?? 48;
	const assetWidth = node.assetWidth ?? 48;
	const iconSize = Math.max(assetHeight, assetWidth);
	const defaultWidth = flowchart?.wrappingWidth;
	node.width = Math.max(iconSize, defaultWidth ?? 0);
	const { shapeSvg, bbox, halfPadding, label } = await labelHelper(parent, node, "icon-shape default");
	const topLabel = node.pos === "t";
	const height = iconSize + halfPadding * 2;
	const width = iconSize + halfPadding * 2;
	const { nodeBorder, mainBkg } = themeVariables;
	const { stylesMap } = compileStyles(node);
	const x = -width / 2;
	const y = -height / 2;
	const labelPadding = node.label ? 8 : 0;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	options.stroke = stylesMap.get("fill") ?? mainBkg;
	const iconNode = rc.path(createRoundedRectPathD(x, y, width, height, .1), options);
	const outerWidth = Math.max(width, bbox.width);
	const outerHeight = height + bbox.height + labelPadding;
	const outerNode = rc.rectangle(-outerWidth / 2, -outerHeight / 2, outerWidth, outerHeight, {
		...options,
		fill: "transparent",
		stroke: "none"
	});
	const iconShape = shapeSvg.insert(() => iconNode, ":first-child");
	const outerShape = shapeSvg.insert(() => outerNode);
	if (node.icon) {
		const iconElem = shapeSvg.append("g");
		iconElem.html(`<g>${await getIconSVG(node.icon, {
			height: iconSize,
			width: iconSize,
			fallbackPrefix: ""
		})}</g>`);
		const iconBBox = iconElem.node().getBBox();
		const iconWidth = iconBBox.width;
		const iconHeight = iconBBox.height;
		const iconX = iconBBox.x;
		const iconY = iconBBox.y;
		iconElem.attr("transform", `translate(${-iconWidth / 2 - iconX},${topLabel ? bbox.height / 2 + labelPadding / 2 - iconHeight / 2 - iconY : -bbox.height / 2 - labelPadding / 2 - iconHeight / 2 - iconY})`);
		iconElem.attr("style", `color: ${stylesMap.get("stroke") ?? nodeBorder};`);
	}
	label.attr("transform", `translate(${-bbox.width / 2 - (bbox.x - (bbox.left ?? 0))},${topLabel ? -outerHeight / 2 : outerHeight / 2 - bbox.height})`);
	iconShape.attr("transform", `translate(0,${topLabel ? bbox.height / 2 + labelPadding / 2 : -bbox.height / 2 - labelPadding / 2})`);
	updateNodeBounds(node, outerShape);
	node.intersect = function(point) {
		log.info("iconSquare intersect", node, point);
		if (!node.label) return intersect_default.rect(node, point);
		const dx = node.x ?? 0;
		const dy = node.y ?? 0;
		const nodeHeight = node.height ?? 0;
		let points = [];
		if (topLabel) points = [
			{
				x: dx - bbox.width / 2,
				y: dy - nodeHeight / 2
			},
			{
				x: dx + bbox.width / 2,
				y: dy - nodeHeight / 2
			},
			{
				x: dx + bbox.width / 2,
				y: dy - nodeHeight / 2 + bbox.height + labelPadding
			},
			{
				x: dx + width / 2,
				y: dy - nodeHeight / 2 + bbox.height + labelPadding
			},
			{
				x: dx + width / 2,
				y: dy + nodeHeight / 2
			},
			{
				x: dx - width / 2,
				y: dy + nodeHeight / 2
			},
			{
				x: dx - width / 2,
				y: dy - nodeHeight / 2 + bbox.height + labelPadding
			},
			{
				x: dx - bbox.width / 2,
				y: dy - nodeHeight / 2 + bbox.height + labelPadding
			}
		];
		else points = [
			{
				x: dx - width / 2,
				y: dy - nodeHeight / 2
			},
			{
				x: dx + width / 2,
				y: dy - nodeHeight / 2
			},
			{
				x: dx + width / 2,
				y: dy - nodeHeight / 2 + height
			},
			{
				x: dx + bbox.width / 2,
				y: dy - nodeHeight / 2 + height
			},
			{
				x: dx + bbox.width / 2 / 2,
				y: dy + nodeHeight / 2
			},
			{
				x: dx - bbox.width / 2,
				y: dy + nodeHeight / 2
			},
			{
				x: dx - bbox.width / 2,
				y: dy - nodeHeight / 2 + height
			},
			{
				x: dx - width / 2,
				y: dy - nodeHeight / 2 + height
			}
		];
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(iconSquare, "iconSquare");
async function imageSquare(parent, node, { config: { flowchart } }) {
	const img = new Image();
	img.src = node?.img ?? "";
	await img.decode();
	const imageNaturalWidth = Number(img.naturalWidth.toString().replace("px", ""));
	const imageNaturalHeight = Number(img.naturalHeight.toString().replace("px", ""));
	node.imageAspectRatio = imageNaturalWidth / imageNaturalHeight;
	const { labelStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const defaultWidth = flowchart?.wrappingWidth;
	node.defaultWidth = flowchart?.wrappingWidth;
	const imageRawWidth = Math.max(node.label ? defaultWidth ?? 0 : 0, node?.assetWidth ?? imageNaturalWidth);
	const imageWidth = node.constraint === "on" ? node?.assetHeight ? node.assetHeight * node.imageAspectRatio : imageRawWidth : imageRawWidth;
	const imageHeight = node.constraint === "on" ? imageWidth / node.imageAspectRatio : node?.assetHeight ?? imageNaturalHeight;
	node.width = Math.max(imageWidth, defaultWidth ?? 0);
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, "image-shape default");
	const topLabel = node.pos === "t";
	const x = -imageWidth / 2;
	const y = -imageHeight / 2;
	const labelPadding = node.label ? 8 : 0;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const imageNode = rc.rectangle(x, y, imageWidth, imageHeight, options);
	const outerWidth = Math.max(imageWidth, bbox.width);
	const outerHeight = imageHeight + bbox.height + labelPadding;
	const outerNode = rc.rectangle(-outerWidth / 2, -outerHeight / 2, outerWidth, outerHeight, {
		...options,
		fill: "none",
		stroke: "none"
	});
	const iconShape = shapeSvg.insert(() => imageNode, ":first-child");
	const outerShape = shapeSvg.insert(() => outerNode);
	if (node.img) {
		const image = shapeSvg.append("image");
		image.attr("href", node.img);
		image.attr("width", imageWidth);
		image.attr("height", imageHeight);
		image.attr("preserveAspectRatio", "none");
		image.attr("transform", `translate(${-imageWidth / 2},${topLabel ? outerHeight / 2 - imageHeight : -outerHeight / 2})`);
	}
	label.attr("transform", `translate(${-bbox.width / 2 - (bbox.x - (bbox.left ?? 0))},${topLabel ? -imageHeight / 2 - bbox.height / 2 - labelPadding / 2 : imageHeight / 2 - bbox.height / 2 + labelPadding / 2})`);
	iconShape.attr("transform", `translate(0,${topLabel ? bbox.height / 2 + labelPadding / 2 : -bbox.height / 2 - labelPadding / 2})`);
	updateNodeBounds(node, outerShape);
	node.intersect = function(point) {
		log.info("iconSquare intersect", node, point);
		if (!node.label) return intersect_default.rect(node, point);
		const dx = node.x ?? 0;
		const dy = node.y ?? 0;
		const nodeHeight = node.height ?? 0;
		let points = [];
		if (topLabel) points = [
			{
				x: dx - bbox.width / 2,
				y: dy - nodeHeight / 2
			},
			{
				x: dx + bbox.width / 2,
				y: dy - nodeHeight / 2
			},
			{
				x: dx + bbox.width / 2,
				y: dy - nodeHeight / 2 + bbox.height + labelPadding
			},
			{
				x: dx + imageWidth / 2,
				y: dy - nodeHeight / 2 + bbox.height + labelPadding
			},
			{
				x: dx + imageWidth / 2,
				y: dy + nodeHeight / 2
			},
			{
				x: dx - imageWidth / 2,
				y: dy + nodeHeight / 2
			},
			{
				x: dx - imageWidth / 2,
				y: dy - nodeHeight / 2 + bbox.height + labelPadding
			},
			{
				x: dx - bbox.width / 2,
				y: dy - nodeHeight / 2 + bbox.height + labelPadding
			}
		];
		else points = [
			{
				x: dx - imageWidth / 2,
				y: dy - nodeHeight / 2
			},
			{
				x: dx + imageWidth / 2,
				y: dy - nodeHeight / 2
			},
			{
				x: dx + imageWidth / 2,
				y: dy - nodeHeight / 2 + imageHeight
			},
			{
				x: dx + bbox.width / 2,
				y: dy - nodeHeight / 2 + imageHeight
			},
			{
				x: dx + bbox.width / 2 / 2,
				y: dy + nodeHeight / 2
			},
			{
				x: dx - bbox.width / 2,
				y: dy + nodeHeight / 2
			},
			{
				x: dx - bbox.width / 2,
				y: dy - nodeHeight / 2 + imageHeight
			},
			{
				x: dx - imageWidth / 2,
				y: dy - nodeHeight / 2 + imageHeight
			}
		];
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(imageSquare, "imageSquare");
async function inv_trapezoid(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox } = await labelHelper(parent, node, getNodeClasses(node));
	const w = Math.max(bbox.width + (node.padding ?? 0) * 2, node?.width ?? 0);
	const h = Math.max(bbox.height + (node.padding ?? 0) * 2, node?.height ?? 0);
	const points = [
		{
			x: 0,
			y: 0
		},
		{
			x: w,
			y: 0
		},
		{
			x: w + 3 * h / 6,
			y: -h
		},
		{
			x: -3 * h / 6,
			y: -h
		}
	];
	let polygon;
	const { cssStyles } = node;
	if (node.look === "handDrawn") {
		const rc = at.svg(shapeSvg);
		const options = userNodeOverrides(node, {});
		const pathData = createPathFromPoints(points);
		const roughNode = rc.path(pathData, options);
		polygon = shapeSvg.insert(() => roughNode, ":first-child").attr("transform", `translate(${-w / 2}, ${h / 2})`);
		if (cssStyles) polygon.attr("style", cssStyles);
	} else polygon = insertPolygonShape(shapeSvg, w, h, points);
	if (nodeStyles) polygon.attr("style", nodeStyles);
	node.width = w;
	node.height = h;
	updateNodeBounds(node, polygon);
	node.intersect = function(point) {
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(inv_trapezoid, "inv_trapezoid");
async function drawRect(parent, node, options) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox } = await labelHelper(parent, node, getNodeClasses(node));
	const totalWidth = Math.max(bbox.width + options.labelPaddingX * 2, node?.width || 0);
	const totalHeight = Math.max(bbox.height + options.labelPaddingY * 2, node?.height || 0);
	const x = -totalWidth / 2;
	const y = -totalHeight / 2;
	let rect2;
	let { rx, ry } = node;
	const { cssStyles } = node;
	if (options?.rx && options.ry) {
		rx = options.rx;
		ry = options.ry;
	}
	if (node.look === "handDrawn") {
		const rc = at.svg(shapeSvg);
		const options2 = userNodeOverrides(node, {});
		const roughNode = rx || ry ? rc.path(createRoundedRectPathD(x, y, totalWidth, totalHeight, rx || 0), options2) : rc.rectangle(x, y, totalWidth, totalHeight, options2);
		rect2 = shapeSvg.insert(() => roughNode, ":first-child");
		rect2.attr("class", "basic label-container").attr("style", handleUndefinedAttr(cssStyles));
	} else {
		rect2 = shapeSvg.insert("rect", ":first-child");
		rect2.attr("class", "basic label-container").attr("style", nodeStyles).attr("rx", handleUndefinedAttr(rx)).attr("ry", handleUndefinedAttr(ry)).attr("x", x).attr("y", y).attr("width", totalWidth).attr("height", totalHeight);
	}
	updateNodeBounds(node, rect2);
	node.calcIntersect = function(bounds, point) {
		return intersect_default.rect(bounds, point);
	};
	node.intersect = function(point) {
		return intersect_default.rect(node, point);
	};
	return shapeSvg;
}
__name(drawRect, "drawRect");
async function labelRect(parent, node) {
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, "label");
	const rect2 = shapeSvg.insert("rect", ":first-child");
	rect2.attr("width", .1).attr("height", .1);
	shapeSvg.attr("class", "label edgeLabel");
	label.attr("transform", `translate(${-(bbox.width / 2) - (bbox.x - (bbox.left ?? 0))}, ${-(bbox.height / 2) - (bbox.y - (bbox.top ?? 0))})`);
	updateNodeBounds(node, rect2);
	node.intersect = function(point) {
		return intersect_default.rect(node, point);
	};
	return shapeSvg;
}
__name(labelRect, "labelRect");
async function lean_left(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox } = await labelHelper(parent, node, getNodeClasses(node));
	const w = Math.max(bbox.width + (node.padding ?? 0), node?.width ?? 0);
	const h = Math.max(bbox.height + (node.padding ?? 0), node?.height ?? 0);
	const points = [
		{
			x: 0,
			y: 0
		},
		{
			x: w + 3 * h / 6,
			y: 0
		},
		{
			x: w,
			y: -h
		},
		{
			x: -(3 * h) / 6,
			y: -h
		}
	];
	let polygon;
	const { cssStyles } = node;
	if (node.look === "handDrawn") {
		const rc = at.svg(shapeSvg);
		const options = userNodeOverrides(node, {});
		const pathData = createPathFromPoints(points);
		const roughNode = rc.path(pathData, options);
		polygon = shapeSvg.insert(() => roughNode, ":first-child").attr("transform", `translate(${-w / 2}, ${h / 2})`);
		if (cssStyles) polygon.attr("style", cssStyles);
	} else polygon = insertPolygonShape(shapeSvg, w, h, points);
	if (nodeStyles) polygon.attr("style", nodeStyles);
	node.width = w;
	node.height = h;
	updateNodeBounds(node, polygon);
	node.intersect = function(point) {
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(lean_left, "lean_left");
async function lean_right(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox } = await labelHelper(parent, node, getNodeClasses(node));
	const w = Math.max(bbox.width + (node.padding ?? 0), node?.width ?? 0);
	const h = Math.max(bbox.height + (node.padding ?? 0), node?.height ?? 0);
	const points = [
		{
			x: -3 * h / 6,
			y: 0
		},
		{
			x: w,
			y: 0
		},
		{
			x: w + 3 * h / 6,
			y: -h
		},
		{
			x: 0,
			y: -h
		}
	];
	let polygon;
	const { cssStyles } = node;
	if (node.look === "handDrawn") {
		const rc = at.svg(shapeSvg);
		const options = userNodeOverrides(node, {});
		const pathData = createPathFromPoints(points);
		const roughNode = rc.path(pathData, options);
		polygon = shapeSvg.insert(() => roughNode, ":first-child").attr("transform", `translate(${-w / 2}, ${h / 2})`);
		if (cssStyles) polygon.attr("style", cssStyles);
	} else polygon = insertPolygonShape(shapeSvg, w, h, points);
	if (nodeStyles) polygon.attr("style", nodeStyles);
	node.width = w;
	node.height = h;
	updateNodeBounds(node, polygon);
	node.intersect = function(point) {
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(lean_right, "lean_right");
function lightningBolt(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.label = "";
	node.labelStyle = labelStyles;
	const shapeSvg = parent.insert("g").attr("class", getNodeClasses(node)).attr("id", node.domId ?? node.id);
	const { cssStyles } = node;
	const width = Math.max(35, node?.width ?? 0);
	const height = Math.max(35, node?.height ?? 0);
	const gap = 7;
	const points = [
		{
			x: width,
			y: 0
		},
		{
			x: 0,
			y: height + gap / 2
		},
		{
			x: width - 14,
			y: height + gap / 2
		},
		{
			x: 0,
			y: 2 * height
		},
		{
			x: width,
			y: height - gap / 2
		},
		{
			x: 14,
			y: height - gap / 2
		}
	];
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const linePath = createPathFromPoints(points);
	const lineNode = rc.path(linePath, options);
	const lightningBolt2 = shapeSvg.insert(() => lineNode, ":first-child");
	if (cssStyles && node.look !== "handDrawn") lightningBolt2.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") lightningBolt2.selectAll("path").attr("style", nodeStyles);
	lightningBolt2.attr("transform", `translate(-${width / 2},${-height})`);
	updateNodeBounds(node, lightningBolt2);
	node.intersect = function(point) {
		log.info("lightningBolt intersect", node, point);
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(lightningBolt, "lightningBolt");
var createCylinderPathD2 = /* @__PURE__ */ __name((x, y, width, height, rx, ry, outerOffset) => {
	return [
		`M${x},${y + ry}`,
		`a${rx},${ry} 0,0,0 ${width},0`,
		`a${rx},${ry} 0,0,0 ${-width},0`,
		`l0,${height}`,
		`a${rx},${ry} 0,0,0 ${width},0`,
		`l0,${-height}`,
		`M${x},${y + ry + outerOffset}`,
		`a${rx},${ry} 0,0,0 ${width},0`
	].join(" ");
}, "createCylinderPathD");
var createOuterCylinderPathD2 = /* @__PURE__ */ __name((x, y, width, height, rx, ry, outerOffset) => {
	return [
		`M${x},${y + ry}`,
		`M${x + width},${y + ry}`,
		`a${rx},${ry} 0,0,0 ${-width},0`,
		`l0,${height}`,
		`a${rx},${ry} 0,0,0 ${width},0`,
		`l0,${-height}`,
		`M${x},${y + ry + outerOffset}`,
		`a${rx},${ry} 0,0,0 ${width},0`
	].join(" ");
}, "createOuterCylinderPathD");
var createInnerCylinderPathD2 = /* @__PURE__ */ __name((x, y, width, height, rx, ry) => {
	return [`M${x - width / 2},${-height / 2}`, `a${rx},${ry} 0,0,0 ${width},0`].join(" ");
}, "createInnerCylinderPathD");
async function linedCylinder(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, getNodeClasses(node));
	const w = Math.max(bbox.width + (node.padding ?? 0), node.width ?? 0);
	const rx = w / 2;
	const ry = rx / (2.5 + w / 50);
	const h = Math.max(bbox.height + ry + (node.padding ?? 0), node.height ?? 0);
	const outerOffset = h * .1;
	let cylinder2;
	const { cssStyles } = node;
	if (node.look === "handDrawn") {
		const rc = at.svg(shapeSvg);
		const outerPathData = createOuterCylinderPathD2(0, 0, w, h, rx, ry, outerOffset);
		const innerPathData = createInnerCylinderPathD2(0, ry, w, h, rx, ry);
		const options = userNodeOverrides(node, {});
		const outerNode = rc.path(outerPathData, options);
		const innerLine = rc.path(innerPathData, options);
		shapeSvg.insert(() => innerLine, ":first-child").attr("class", "line");
		cylinder2 = shapeSvg.insert(() => outerNode, ":first-child");
		cylinder2.attr("class", "basic label-container");
		if (cssStyles) cylinder2.attr("style", cssStyles);
	} else {
		const pathData = createCylinderPathD2(0, 0, w, h, rx, ry, outerOffset);
		cylinder2 = shapeSvg.insert("path", ":first-child").attr("d", pathData).attr("class", "basic label-container").attr("style", handleUndefinedAttr(cssStyles)).attr("style", nodeStyles);
	}
	cylinder2.attr("label-offset-y", ry);
	cylinder2.attr("transform", `translate(${-w / 2}, ${-(h / 2 + ry)})`);
	updateNodeBounds(node, cylinder2);
	label.attr("transform", `translate(${-(bbox.width / 2) - (bbox.x - (bbox.left ?? 0))}, ${-(bbox.height / 2) + ry - (bbox.y - (bbox.top ?? 0))})`);
	node.intersect = function(point) {
		const pos = intersect_default.rect(node, point);
		const x = pos.x - (node.x ?? 0);
		if (rx != 0 && (Math.abs(x) < (node.width ?? 0) / 2 || Math.abs(x) == (node.width ?? 0) / 2 && Math.abs(pos.y - (node.y ?? 0)) > (node.height ?? 0) / 2 - ry)) {
			let y = ry * ry * (1 - x * x / (rx * rx));
			if (y > 0) y = Math.sqrt(y);
			y = ry - y;
			if (point.y - (node.y ?? 0) > 0) y = -y;
			pos.y += y;
		}
		return pos;
	};
	return shapeSvg;
}
__name(linedCylinder, "linedCylinder");
async function linedWaveEdgedRect(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, getNodeClasses(node));
	const w = Math.max(bbox.width + (node.padding ?? 0) * 2, node?.width ?? 0);
	const h = Math.max(bbox.height + (node.padding ?? 0) * 2, node?.height ?? 0);
	const waveAmplitude = h / 4;
	const finalH = h + waveAmplitude;
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const points = [
		{
			x: -w / 2 - w / 2 * .1,
			y: -finalH / 2
		},
		{
			x: -w / 2 - w / 2 * .1,
			y: finalH / 2
		},
		...generateFullSineWavePoints(-w / 2 - w / 2 * .1, finalH / 2, w / 2 + w / 2 * .1, finalH / 2, waveAmplitude, .8),
		{
			x: w / 2 + w / 2 * .1,
			y: -finalH / 2
		},
		{
			x: -w / 2 - w / 2 * .1,
			y: -finalH / 2
		},
		{
			x: -w / 2,
			y: -finalH / 2
		},
		{
			x: -w / 2,
			y: finalH / 2 * 1.1
		},
		{
			x: -w / 2,
			y: -finalH / 2
		}
	];
	const poly = rc.polygon(points.map((p) => [p.x, p.y]), options);
	const waveEdgeRect = shapeSvg.insert(() => poly, ":first-child");
	waveEdgeRect.attr("class", "basic label-container");
	if (cssStyles && node.look !== "handDrawn") waveEdgeRect.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") waveEdgeRect.selectAll("path").attr("style", nodeStyles);
	waveEdgeRect.attr("transform", `translate(0,${-waveAmplitude / 2})`);
	label.attr("transform", `translate(${-w / 2 + (node.padding ?? 0) + w / 2 * .1 / 2 - (bbox.x - (bbox.left ?? 0))},${-h / 2 + (node.padding ?? 0) - waveAmplitude / 2 - (bbox.y - (bbox.top ?? 0))})`);
	updateNodeBounds(node, waveEdgeRect);
	node.intersect = function(point) {
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(linedWaveEdgedRect, "linedWaveEdgedRect");
async function multiRect(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, getNodeClasses(node));
	const w = Math.max(bbox.width + (node.padding ?? 0) * 2, node?.width ?? 0);
	const h = Math.max(bbox.height + (node.padding ?? 0) * 2, node?.height ?? 0);
	const rectOffset = 5;
	const x = -w / 2;
	const y = -h / 2;
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	const outerPathPoints = [
		{
			x: x - rectOffset,
			y: y + rectOffset
		},
		{
			x: x - rectOffset,
			y: y + h + rectOffset
		},
		{
			x: x + w - rectOffset,
			y: y + h + rectOffset
		},
		{
			x: x + w - rectOffset,
			y: y + h
		},
		{
			x: x + w,
			y: y + h
		},
		{
			x: x + w,
			y: y + h - rectOffset
		},
		{
			x: x + w + rectOffset,
			y: y + h - rectOffset
		},
		{
			x: x + w + rectOffset,
			y: y - rectOffset
		},
		{
			x: x + rectOffset,
			y: y - rectOffset
		},
		{
			x: x + rectOffset,
			y
		},
		{
			x,
			y
		},
		{
			x,
			y: y + rectOffset
		}
	];
	const innerPathPoints = [
		{
			x,
			y: y + rectOffset
		},
		{
			x: x + w - rectOffset,
			y: y + rectOffset
		},
		{
			x: x + w - rectOffset,
			y: y + h
		},
		{
			x: x + w,
			y: y + h
		},
		{
			x: x + w,
			y
		},
		{
			x,
			y
		}
	];
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const outerPath = createPathFromPoints(outerPathPoints);
	const outerNode = rc.path(outerPath, options);
	const innerPath = createPathFromPoints(innerPathPoints);
	const innerNode = rc.path(innerPath, {
		...options,
		fill: "none"
	});
	const multiRect2 = shapeSvg.insert(() => innerNode, ":first-child");
	multiRect2.insert(() => outerNode, ":first-child");
	multiRect2.attr("class", "basic label-container");
	if (cssStyles && node.look !== "handDrawn") multiRect2.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") multiRect2.selectAll("path").attr("style", nodeStyles);
	label.attr("transform", `translate(${-(bbox.width / 2) - rectOffset - (bbox.x - (bbox.left ?? 0))}, ${-(bbox.height / 2) + rectOffset - (bbox.y - (bbox.top ?? 0))})`);
	updateNodeBounds(node, multiRect2);
	node.intersect = function(point) {
		return intersect_default.polygon(node, outerPathPoints, point);
	};
	return shapeSvg;
}
__name(multiRect, "multiRect");
async function multiWaveEdgedRectangle(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, getNodeClasses(node));
	const w = Math.max(bbox.width + (node.padding ?? 0) * 2, node?.width ?? 0);
	const h = Math.max(bbox.height + (node.padding ?? 0) * 2, node?.height ?? 0);
	const waveAmplitude = h / 4;
	const finalH = h + waveAmplitude;
	const x = -w / 2;
	const y = -finalH / 2;
	const rectOffset = 5;
	const { cssStyles } = node;
	const wavePoints = generateFullSineWavePoints(x - rectOffset, y + finalH + rectOffset, x + w - rectOffset, y + finalH + rectOffset, waveAmplitude, .8);
	const lastWavePoint = wavePoints?.[wavePoints.length - 1];
	const outerPathPoints = [
		{
			x: x - rectOffset,
			y: y + rectOffset
		},
		{
			x: x - rectOffset,
			y: y + finalH + rectOffset
		},
		...wavePoints,
		{
			x: x + w - rectOffset,
			y: lastWavePoint.y - rectOffset
		},
		{
			x: x + w,
			y: lastWavePoint.y - rectOffset
		},
		{
			x: x + w,
			y: lastWavePoint.y - 10
		},
		{
			x: x + w + rectOffset,
			y: lastWavePoint.y - 10
		},
		{
			x: x + w + rectOffset,
			y: y - rectOffset
		},
		{
			x: x + rectOffset,
			y: y - rectOffset
		},
		{
			x: x + rectOffset,
			y
		},
		{
			x,
			y
		},
		{
			x,
			y: y + rectOffset
		}
	];
	const innerPathPoints = [
		{
			x,
			y: y + rectOffset
		},
		{
			x: x + w - rectOffset,
			y: y + rectOffset
		},
		{
			x: x + w - rectOffset,
			y: lastWavePoint.y - rectOffset
		},
		{
			x: x + w,
			y: lastWavePoint.y - rectOffset
		},
		{
			x: x + w,
			y
		},
		{
			x,
			y
		}
	];
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const outerPath = createPathFromPoints(outerPathPoints);
	const outerNode = rc.path(outerPath, options);
	const innerPath = createPathFromPoints(innerPathPoints);
	const innerNode = rc.path(innerPath, options);
	const shape = shapeSvg.insert(() => outerNode, ":first-child");
	shape.insert(() => innerNode);
	shape.attr("class", "basic label-container");
	if (cssStyles && node.look !== "handDrawn") shape.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") shape.selectAll("path").attr("style", nodeStyles);
	shape.attr("transform", `translate(0,${-waveAmplitude / 2})`);
	label.attr("transform", `translate(${-(bbox.width / 2) - rectOffset - (bbox.x - (bbox.left ?? 0))}, ${-(bbox.height / 2) + rectOffset - waveAmplitude / 2 - (bbox.y - (bbox.top ?? 0))})`);
	updateNodeBounds(node, shape);
	node.intersect = function(point) {
		return intersect_default.polygon(node, outerPathPoints, point);
	};
	return shapeSvg;
}
__name(multiWaveEdgedRectangle, "multiWaveEdgedRectangle");
async function note(parent, node, { config: { themeVariables } }) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	if (!(node.useHtmlLabels || getConfig().flowchart?.htmlLabels !== false)) node.centerLabel = true;
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, getNodeClasses(node));
	const totalWidth = Math.max(bbox.width + (node.padding ?? 0) * 2, node?.width ?? 0);
	const totalHeight = Math.max(bbox.height + (node.padding ?? 0) * 2, node?.height ?? 0);
	const x = -totalWidth / 2;
	const y = -totalHeight / 2;
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {
		fill: themeVariables.noteBkgColor,
		stroke: themeVariables.noteBorderColor
	});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const noteShapeNode = rc.rectangle(x, y, totalWidth, totalHeight, options);
	const rect2 = shapeSvg.insert(() => noteShapeNode, ":first-child");
	rect2.attr("class", "basic label-container");
	if (cssStyles && node.look !== "handDrawn") rect2.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") rect2.selectAll("path").attr("style", nodeStyles);
	label.attr("transform", `translate(${-bbox.width / 2 - (bbox.x - (bbox.left ?? 0))}, ${-(bbox.height / 2) - (bbox.y - (bbox.top ?? 0))})`);
	updateNodeBounds(node, rect2);
	node.intersect = function(point) {
		return intersect_default.rect(node, point);
	};
	return shapeSvg;
}
__name(note, "note");
var createDecisionBoxPathD = /* @__PURE__ */ __name((x, y, size) => {
	return [
		`M${x + size / 2},${y}`,
		`L${x + size},${y - size / 2}`,
		`L${x + size / 2},${y - size}`,
		`L${x},${y - size / 2}`,
		"Z"
	].join(" ");
}, "createDecisionBoxPathD");
async function question(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox } = await labelHelper(parent, node, getNodeClasses(node));
	const s = bbox.width + node.padding + (bbox.height + node.padding);
	const adjustment = .5;
	const points = [
		{
			x: s / 2,
			y: 0
		},
		{
			x: s,
			y: -s / 2
		},
		{
			x: s / 2,
			y: -s
		},
		{
			x: 0,
			y: -s / 2
		}
	];
	let polygon;
	const { cssStyles } = node;
	if (node.look === "handDrawn") {
		const rc = at.svg(shapeSvg);
		const options = userNodeOverrides(node, {});
		const pathData = createDecisionBoxPathD(0, 0, s);
		const roughNode = rc.path(pathData, options);
		polygon = shapeSvg.insert(() => roughNode, ":first-child").attr("transform", `translate(${-s / 2 + adjustment}, ${s / 2})`);
		if (cssStyles) polygon.attr("style", cssStyles);
	} else {
		polygon = insertPolygonShape(shapeSvg, s, s, points);
		polygon.attr("transform", `translate(${-s / 2 + adjustment}, ${s / 2})`);
	}
	if (nodeStyles) polygon.attr("style", nodeStyles);
	updateNodeBounds(node, polygon);
	node.calcIntersect = function(bounds, point) {
		const s2 = bounds.width;
		const points2 = [
			{
				x: s2 / 2,
				y: 0
			},
			{
				x: s2,
				y: -s2 / 2
			},
			{
				x: s2 / 2,
				y: -s2
			},
			{
				x: 0,
				y: -s2 / 2
			}
		];
		const res = intersect_default.polygon(bounds, points2, point);
		return {
			x: res.x - .5,
			y: res.y - .5
		};
	};
	node.intersect = function(point) {
		return this.calcIntersect(node, point);
	};
	return shapeSvg;
}
__name(question, "question");
async function rect_left_inv_arrow(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, getNodeClasses(node));
	const w = Math.max(bbox.width + (node.padding ?? 0), node?.width ?? 0);
	const h = Math.max(bbox.height + (node.padding ?? 0), node?.height ?? 0);
	const x = -w / 2;
	const y = -h / 2;
	const notch = y / 2;
	const points = [
		{
			x: x + notch,
			y
		},
		{
			x,
			y: 0
		},
		{
			x: x + notch,
			y: -y
		},
		{
			x: -x,
			y: -y
		},
		{
			x: -x,
			y
		}
	];
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const pathData = createPathFromPoints(points);
	const roughNode = rc.path(pathData, options);
	const polygon = shapeSvg.insert(() => roughNode, ":first-child");
	polygon.attr("class", "basic label-container");
	if (cssStyles && node.look !== "handDrawn") polygon.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") polygon.selectAll("path").attr("style", nodeStyles);
	polygon.attr("transform", `translate(${-notch / 2},0)`);
	label.attr("transform", `translate(${-notch / 2 - bbox.width / 2 - (bbox.x - (bbox.left ?? 0))}, ${-(bbox.height / 2) - (bbox.y - (bbox.top ?? 0))})`);
	updateNodeBounds(node, polygon);
	node.intersect = function(point) {
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(rect_left_inv_arrow, "rect_left_inv_arrow");
async function rectWithTitle(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	let classes;
	if (!node.cssClasses) classes = "node default";
	else classes = "node " + node.cssClasses;
	const shapeSvg = parent.insert("g").attr("class", classes).attr("id", node.domId || node.id);
	const g = shapeSvg.insert("g");
	const label = shapeSvg.insert("g").attr("class", "label").attr("style", nodeStyles);
	const description = node.description;
	const title = node.label;
	const text2 = label.node().appendChild(await createLabel_default(title, node.labelStyle, true, true));
	let bbox = {
		width: 0,
		height: 0
	};
	if (evaluate(getConfig2()?.flowchart?.htmlLabels)) {
		const div2 = text2.children[0];
		const dv2 = select_default(text2);
		bbox = div2.getBoundingClientRect();
		dv2.attr("width", bbox.width);
		dv2.attr("height", bbox.height);
	}
	log.info("Text 2", description);
	const textRows = description || [];
	const titleBox = text2.getBBox();
	const descr = label.node().appendChild(await createLabel_default(textRows.join ? textRows.join("<br/>") : textRows, node.labelStyle, true, true));
	const div = descr.children[0];
	const dv = select_default(descr);
	bbox = div.getBoundingClientRect();
	dv.attr("width", bbox.width);
	dv.attr("height", bbox.height);
	const halfPadding = (node.padding || 0) / 2;
	select_default(descr).attr("transform", "translate( " + (bbox.width > titleBox.width ? 0 : (titleBox.width - bbox.width) / 2) + ", " + (titleBox.height + halfPadding + 5) + ")");
	select_default(text2).attr("transform", "translate( " + (bbox.width < titleBox.width ? 0 : -(titleBox.width - bbox.width) / 2) + ", 0)");
	bbox = label.node().getBBox();
	label.attr("transform", "translate(" + -bbox.width / 2 + ", " + (-bbox.height / 2 - halfPadding + 3) + ")");
	const totalWidth = bbox.width + (node.padding || 0);
	const totalHeight = bbox.height + (node.padding || 0);
	const x = -bbox.width / 2 - halfPadding;
	const y = -bbox.height / 2 - halfPadding;
	let rect2;
	let innerLine;
	if (node.look === "handDrawn") {
		const rc = at.svg(shapeSvg);
		const options = userNodeOverrides(node, {});
		const roughNode = rc.path(createRoundedRectPathD(x, y, totalWidth, totalHeight, node.rx || 0), options);
		const roughLine = rc.line(-bbox.width / 2 - halfPadding, -bbox.height / 2 - halfPadding + titleBox.height + halfPadding, bbox.width / 2 + halfPadding, -bbox.height / 2 - halfPadding + titleBox.height + halfPadding, options);
		innerLine = shapeSvg.insert(() => {
			log.debug("Rough node insert CXC", roughNode);
			return roughLine;
		}, ":first-child");
		rect2 = shapeSvg.insert(() => {
			log.debug("Rough node insert CXC", roughNode);
			return roughNode;
		}, ":first-child");
	} else {
		rect2 = g.insert("rect", ":first-child");
		innerLine = g.insert("line");
		rect2.attr("class", "outer title-state").attr("style", nodeStyles).attr("x", -bbox.width / 2 - halfPadding).attr("y", -bbox.height / 2 - halfPadding).attr("width", bbox.width + (node.padding || 0)).attr("height", bbox.height + (node.padding || 0));
		innerLine.attr("class", "divider").attr("x1", -bbox.width / 2 - halfPadding).attr("x2", bbox.width / 2 + halfPadding).attr("y1", -bbox.height / 2 - halfPadding + titleBox.height + halfPadding).attr("y2", -bbox.height / 2 - halfPadding + titleBox.height + halfPadding);
	}
	updateNodeBounds(node, rect2);
	node.intersect = function(point) {
		return intersect_default.rect(node, point);
	};
	return shapeSvg;
}
__name(rectWithTitle, "rectWithTitle");
function generateArcPoints2(x1, y1, x2, y2, rx, ry, clockwise) {
	const numPoints = 20;
	const midX = (x1 + x2) / 2;
	const midY = (y1 + y2) / 2;
	const angle = Math.atan2(y2 - y1, x2 - x1);
	const dx = (x2 - x1) / 2;
	const dy = (y2 - y1) / 2;
	const transformedX = dx / rx;
	const transformedY = dy / ry;
	const distance = Math.sqrt(transformedX ** 2 + transformedY ** 2);
	if (distance > 1) throw new Error("The given radii are too small to create an arc between the points.");
	const scaledCenterDistance = Math.sqrt(1 - distance ** 2);
	const centerX = midX + scaledCenterDistance * ry * Math.sin(angle) * (clockwise ? -1 : 1);
	const centerY = midY - scaledCenterDistance * rx * Math.cos(angle) * (clockwise ? -1 : 1);
	const startAngle = Math.atan2((y1 - centerY) / ry, (x1 - centerX) / rx);
	let angleRange = Math.atan2((y2 - centerY) / ry, (x2 - centerX) / rx) - startAngle;
	if (clockwise && angleRange < 0) angleRange += 2 * Math.PI;
	if (!clockwise && angleRange > 0) angleRange -= 2 * Math.PI;
	const points = [];
	for (let i = 0; i < numPoints; i++) {
		const angle2 = startAngle + i / 19 * angleRange;
		const x = centerX + rx * Math.cos(angle2);
		const y = centerY + ry * Math.sin(angle2);
		points.push({
			x,
			y
		});
	}
	return points;
}
__name(generateArcPoints2, "generateArcPoints");
async function roundedRect(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox } = await labelHelper(parent, node, getNodeClasses(node));
	const labelPaddingX = node?.padding ?? 0;
	const labelPaddingY = node?.padding ?? 0;
	const w = (node?.width ? node?.width : bbox.width) + labelPaddingX * 2;
	const h = (node?.height ? node?.height : bbox.height) + labelPaddingY * 2;
	const radius = node.radius || 5;
	const taper = node.taper || 5;
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.stroke) options.stroke = node.stroke;
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const points = [
		{
			x: -w / 2 + taper,
			y: -h / 2
		},
		{
			x: w / 2 - taper,
			y: -h / 2
		},
		...generateArcPoints2(w / 2 - taper, -h / 2, w / 2, -h / 2 + taper, radius, radius, true),
		{
			x: w / 2,
			y: -h / 2 + taper
		},
		{
			x: w / 2,
			y: h / 2 - taper
		},
		...generateArcPoints2(w / 2, h / 2 - taper, w / 2 - taper, h / 2, radius, radius, true),
		{
			x: w / 2 - taper,
			y: h / 2
		},
		{
			x: -w / 2 + taper,
			y: h / 2
		},
		...generateArcPoints2(-w / 2 + taper, h / 2, -w / 2, h / 2 - taper, radius, radius, true),
		{
			x: -w / 2,
			y: h / 2 - taper
		},
		{
			x: -w / 2,
			y: -h / 2 + taper
		},
		...generateArcPoints2(-w / 2, -h / 2 + taper, -w / 2 + taper, -h / 2, radius, radius, true)
	];
	const pathData = createPathFromPoints(points);
	const shapeNode = rc.path(pathData, options);
	const polygon = shapeSvg.insert(() => shapeNode, ":first-child");
	polygon.attr("class", "basic label-container outer-path");
	if (cssStyles && node.look !== "handDrawn") polygon.selectChildren("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") polygon.selectChildren("path").attr("style", nodeStyles);
	updateNodeBounds(node, polygon);
	node.intersect = function(point) {
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(roundedRect, "roundedRect");
async function shadedProcess(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, getNodeClasses(node));
	const halfPadding = node?.padding ?? 0;
	const w = Math.max(bbox.width + (node.padding ?? 0) * 2, node?.width ?? 0);
	const h = Math.max(bbox.height + (node.padding ?? 0) * 2, node?.height ?? 0);
	const x = -bbox.width / 2 - halfPadding;
	const y = -bbox.height / 2 - halfPadding;
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const points = [
		{
			x,
			y
		},
		{
			x: x + w + 8,
			y
		},
		{
			x: x + w + 8,
			y: y + h
		},
		{
			x: x - 8,
			y: y + h
		},
		{
			x: x - 8,
			y
		},
		{
			x,
			y
		},
		{
			x,
			y: y + h
		}
	];
	const roughNode = rc.polygon(points.map((p) => [p.x, p.y]), options);
	const rect2 = shapeSvg.insert(() => roughNode, ":first-child");
	rect2.attr("class", "basic label-container").attr("style", handleUndefinedAttr(cssStyles));
	if (nodeStyles && node.look !== "handDrawn") rect2.selectAll("path").attr("style", nodeStyles);
	if (cssStyles && node.look !== "handDrawn") rect2.selectAll("path").attr("style", nodeStyles);
	label.attr("transform", `translate(${-w / 2 + 4 + (node.padding ?? 0) - (bbox.x - (bbox.left ?? 0))},${-h / 2 + (node.padding ?? 0) - (bbox.y - (bbox.top ?? 0))})`);
	updateNodeBounds(node, rect2);
	node.intersect = function(point) {
		return intersect_default.rect(node, point);
	};
	return shapeSvg;
}
__name(shadedProcess, "shadedProcess");
async function slopedRect(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, getNodeClasses(node));
	const w = Math.max(bbox.width + (node.padding ?? 0) * 2, node?.width ?? 0);
	const h = Math.max(bbox.height + (node.padding ?? 0) * 2, node?.height ?? 0);
	const x = -w / 2;
	const y = -h / 2;
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const points = [
		{
			x,
			y
		},
		{
			x,
			y: y + h
		},
		{
			x: x + w,
			y: y + h
		},
		{
			x: x + w,
			y: y - h / 2
		}
	];
	const pathData = createPathFromPoints(points);
	const shapeNode = rc.path(pathData, options);
	const polygon = shapeSvg.insert(() => shapeNode, ":first-child");
	polygon.attr("class", "basic label-container");
	if (cssStyles && node.look !== "handDrawn") polygon.selectChildren("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") polygon.selectChildren("path").attr("style", nodeStyles);
	polygon.attr("transform", `translate(0, ${h / 4})`);
	label.attr("transform", `translate(${-w / 2 + (node.padding ?? 0) - (bbox.x - (bbox.left ?? 0))}, ${-h / 4 + (node.padding ?? 0) - (bbox.y - (bbox.top ?? 0))})`);
	updateNodeBounds(node, polygon);
	node.intersect = function(point) {
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(slopedRect, "slopedRect");
async function squareRect2(parent, node) {
	return drawRect(parent, node, {
		rx: 0,
		ry: 0,
		classes: "",
		labelPaddingX: node.labelPaddingX ?? (node?.padding || 0) * 2,
		labelPaddingY: (node?.padding || 0) * 1
	});
}
__name(squareRect2, "squareRect");
async function stadium(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox } = await labelHelper(parent, node, getNodeClasses(node));
	const h = bbox.height + node.padding;
	const w = bbox.width + h / 4 + node.padding;
	const radius = h / 2;
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const points = [
		{
			x: -w / 2 + radius,
			y: -h / 2
		},
		{
			x: w / 2 - radius,
			y: -h / 2
		},
		...generateCirclePoints(-w / 2 + radius, 0, radius, 50, 90, 270),
		{
			x: w / 2 - radius,
			y: h / 2
		},
		...generateCirclePoints(w / 2 - radius, 0, radius, 50, 270, 450)
	];
	const pathData = createPathFromPoints(points);
	const shapeNode = rc.path(pathData, options);
	const polygon = shapeSvg.insert(() => shapeNode, ":first-child");
	polygon.attr("class", "basic label-container outer-path");
	if (cssStyles && node.look !== "handDrawn") polygon.selectChildren("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") polygon.selectChildren("path").attr("style", nodeStyles);
	updateNodeBounds(node, polygon);
	node.intersect = function(point) {
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(stadium, "stadium");
async function state(parent, node) {
	return drawRect(parent, node, {
		rx: 5,
		ry: 5,
		classes: "flowchart-node"
	});
}
__name(state, "state");
function stateEnd(parent, node, { config: { themeVariables } }) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { cssStyles } = node;
	const { lineColor, stateBorder, nodeBorder } = themeVariables;
	const shapeSvg = parent.insert("g").attr("class", "node default").attr("id", node.domId || node.id);
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const roughNode = rc.circle(0, 0, 14, {
		...options,
		stroke: lineColor,
		strokeWidth: 2
	});
	const innerFill = stateBorder ?? nodeBorder;
	const roughInnerNode = rc.circle(0, 0, 5, {
		...options,
		fill: innerFill,
		stroke: innerFill,
		strokeWidth: 2,
		fillStyle: "solid"
	});
	const circle2 = shapeSvg.insert(() => roughNode, ":first-child");
	circle2.insert(() => roughInnerNode);
	if (cssStyles) circle2.selectAll("path").attr("style", cssStyles);
	if (nodeStyles) circle2.selectAll("path").attr("style", nodeStyles);
	updateNodeBounds(node, circle2);
	node.intersect = function(point) {
		return intersect_default.circle(node, 7, point);
	};
	return shapeSvg;
}
__name(stateEnd, "stateEnd");
function stateStart(parent, node, { config: { themeVariables } }) {
	const { lineColor } = themeVariables;
	const shapeSvg = parent.insert("g").attr("class", "node default").attr("id", node.domId || node.id);
	let circle2;
	if (node.look === "handDrawn") {
		const roughNode = at.svg(shapeSvg).circle(0, 0, 14, solidStateFill(lineColor));
		circle2 = shapeSvg.insert(() => roughNode);
		circle2.attr("class", "state-start").attr("r", 7).attr("width", 14).attr("height", 14);
	} else {
		circle2 = shapeSvg.insert("circle", ":first-child");
		circle2.attr("class", "state-start").attr("r", 7).attr("width", 14).attr("height", 14);
	}
	updateNodeBounds(node, circle2);
	node.intersect = function(point) {
		return intersect_default.circle(node, 7, point);
	};
	return shapeSvg;
}
__name(stateStart, "stateStart");
async function subroutine(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox } = await labelHelper(parent, node, getNodeClasses(node));
	const halfPadding = (node?.padding || 0) / 2;
	const w = bbox.width + node.padding;
	const h = bbox.height + node.padding;
	const x = -bbox.width / 2 - halfPadding;
	const y = -bbox.height / 2 - halfPadding;
	const points = [
		{
			x: 0,
			y: 0
		},
		{
			x: w,
			y: 0
		},
		{
			x: w,
			y: -h
		},
		{
			x: 0,
			y: -h
		},
		{
			x: 0,
			y: 0
		},
		{
			x: -8,
			y: 0
		},
		{
			x: w + 8,
			y: 0
		},
		{
			x: w + 8,
			y: -h
		},
		{
			x: -8,
			y: -h
		},
		{
			x: -8,
			y: 0
		}
	];
	if (node.look === "handDrawn") {
		const rc = at.svg(shapeSvg);
		const options = userNodeOverrides(node, {});
		const roughNode = rc.rectangle(x - 8, y, w + 16, h, options);
		const l1 = rc.line(x, y, x, y + h, options);
		const l2 = rc.line(x + w, y, x + w, y + h, options);
		shapeSvg.insert(() => l1, ":first-child");
		shapeSvg.insert(() => l2, ":first-child");
		const rect2 = shapeSvg.insert(() => roughNode, ":first-child");
		const { cssStyles } = node;
		rect2.attr("class", "basic label-container").attr("style", handleUndefinedAttr(cssStyles));
		updateNodeBounds(node, rect2);
	} else {
		const el = insertPolygonShape(shapeSvg, w, h, points);
		if (nodeStyles) el.attr("style", nodeStyles);
		updateNodeBounds(node, el);
	}
	node.intersect = function(point) {
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(subroutine, "subroutine");
async function taggedRect(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox } = await labelHelper(parent, node, getNodeClasses(node));
	const w = Math.max(bbox.width + (node.padding ?? 0) * 2, node?.width ?? 0);
	const h = Math.max(bbox.height + (node.padding ?? 0) * 2, node?.height ?? 0);
	const x = -w / 2;
	const y = -h / 2;
	const tagWidth = .2 * h;
	const tagHeight = .2 * h;
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	const rectPoints = [
		{
			x: x - tagWidth / 2,
			y
		},
		{
			x: x + w + tagWidth / 2,
			y
		},
		{
			x: x + w + tagWidth / 2,
			y: y + h
		},
		{
			x: x - tagWidth / 2,
			y: y + h
		}
	];
	const tagPoints = [
		{
			x: x + w - tagWidth / 2,
			y: y + h
		},
		{
			x: x + w + tagWidth / 2,
			y: y + h
		},
		{
			x: x + w + tagWidth / 2,
			y: y + h - tagHeight
		}
	];
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const rectPath = createPathFromPoints(rectPoints);
	const rectNode = rc.path(rectPath, options);
	const tagPath = createPathFromPoints(tagPoints);
	const tagNode = rc.path(tagPath, {
		...options,
		fillStyle: "solid"
	});
	const taggedRect2 = shapeSvg.insert(() => tagNode, ":first-child");
	taggedRect2.insert(() => rectNode, ":first-child");
	taggedRect2.attr("class", "basic label-container");
	if (cssStyles && node.look !== "handDrawn") taggedRect2.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") taggedRect2.selectAll("path").attr("style", nodeStyles);
	updateNodeBounds(node, taggedRect2);
	node.intersect = function(point) {
		return intersect_default.polygon(node, rectPoints, point);
	};
	return shapeSvg;
}
__name(taggedRect, "taggedRect");
async function taggedWaveEdgedRectangle(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, getNodeClasses(node));
	const w = Math.max(bbox.width + (node.padding ?? 0) * 2, node?.width ?? 0);
	const h = Math.max(bbox.height + (node.padding ?? 0) * 2, node?.height ?? 0);
	const waveAmplitude = h / 4;
	const tagWidth = .2 * w;
	const tagHeight = .2 * h;
	const finalH = h + waveAmplitude;
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const points = [
		{
			x: -w / 2 - w / 2 * .1,
			y: finalH / 2
		},
		...generateFullSineWavePoints(-w / 2 - w / 2 * .1, finalH / 2, w / 2 + w / 2 * .1, finalH / 2, waveAmplitude, .8),
		{
			x: w / 2 + w / 2 * .1,
			y: -finalH / 2
		},
		{
			x: -w / 2 - w / 2 * .1,
			y: -finalH / 2
		}
	];
	const x = -w / 2 + w / 2 * .1;
	const y = -finalH / 2 - tagHeight * .4;
	const tagPoints = [
		{
			x: x + w - tagWidth,
			y: (y + h) * 1.4
		},
		{
			x: x + w,
			y: y + h - tagHeight
		},
		{
			x: x + w,
			y: (y + h) * .9
		},
		...generateFullSineWavePoints(x + w, (y + h) * 1.3, x + w - tagWidth, (y + h) * 1.5, -h * .03, .5)
	];
	const waveEdgeRectPath = createPathFromPoints(points);
	const waveEdgeRectNode = rc.path(waveEdgeRectPath, options);
	const taggedWaveEdgeRectPath = createPathFromPoints(tagPoints);
	const taggedWaveEdgeRectNode = rc.path(taggedWaveEdgeRectPath, {
		...options,
		fillStyle: "solid"
	});
	const waveEdgeRect = shapeSvg.insert(() => taggedWaveEdgeRectNode, ":first-child");
	waveEdgeRect.insert(() => waveEdgeRectNode, ":first-child");
	waveEdgeRect.attr("class", "basic label-container");
	if (cssStyles && node.look !== "handDrawn") waveEdgeRect.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") waveEdgeRect.selectAll("path").attr("style", nodeStyles);
	waveEdgeRect.attr("transform", `translate(0,${-waveAmplitude / 2})`);
	label.attr("transform", `translate(${-w / 2 + (node.padding ?? 0) - (bbox.x - (bbox.left ?? 0))},${-h / 2 + (node.padding ?? 0) - waveAmplitude / 2 - (bbox.y - (bbox.top ?? 0))})`);
	updateNodeBounds(node, waveEdgeRect);
	node.intersect = function(point) {
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(taggedWaveEdgedRectangle, "taggedWaveEdgedRectangle");
async function text(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox } = await labelHelper(parent, node, getNodeClasses(node));
	const totalWidth = Math.max(bbox.width + node.padding, node?.width || 0);
	const totalHeight = Math.max(bbox.height + node.padding, node?.height || 0);
	const x = -totalWidth / 2;
	const y = -totalHeight / 2;
	const rect2 = shapeSvg.insert("rect", ":first-child");
	rect2.attr("class", "text").attr("style", nodeStyles).attr("rx", 0).attr("ry", 0).attr("x", x).attr("y", y).attr("width", totalWidth).attr("height", totalHeight);
	updateNodeBounds(node, rect2);
	node.intersect = function(point) {
		return intersect_default.rect(node, point);
	};
	return shapeSvg;
}
__name(text, "text");
var createCylinderPathD3 = /* @__PURE__ */ __name((x, y, width, height, rx, ry) => {
	return `M${x},${y}
    a${rx},${ry} 0,0,1 0,${-height}
    l${width},0
    a${rx},${ry} 0,0,1 0,${height}
    M${width},${-height}
    a${rx},${ry} 0,0,0 0,${height}
    l${-width},0`;
}, "createCylinderPathD");
var createOuterCylinderPathD3 = /* @__PURE__ */ __name((x, y, width, height, rx, ry) => {
	return [
		`M${x},${y}`,
		`M${x + width},${y}`,
		`a${rx},${ry} 0,0,0 0,${-height}`,
		`l${-width},0`,
		`a${rx},${ry} 0,0,0 0,${height}`,
		`l${width},0`
	].join(" ");
}, "createOuterCylinderPathD");
var createInnerCylinderPathD3 = /* @__PURE__ */ __name((x, y, width, height, rx, ry) => {
	return [`M${x + width / 2},${-height / 2}`, `a${rx},${ry} 0,0,0 0,${height}`].join(" ");
}, "createInnerCylinderPathD");
async function tiltedCylinder(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, label, halfPadding } = await labelHelper(parent, node, getNodeClasses(node));
	const labelPadding = node.look === "neo" ? halfPadding * 2 : halfPadding;
	const h = bbox.height + labelPadding;
	const ry = h / 2;
	const rx = ry / (2.5 + h / 50);
	const w = bbox.width + rx + labelPadding;
	const { cssStyles } = node;
	let cylinder2;
	if (node.look === "handDrawn") {
		const rc = at.svg(shapeSvg);
		const outerPathData = createOuterCylinderPathD3(0, 0, w, h, rx, ry);
		const innerPathData = createInnerCylinderPathD3(0, 0, w, h, rx, ry);
		const outerNode = rc.path(outerPathData, userNodeOverrides(node, {}));
		const innerLine = rc.path(innerPathData, userNodeOverrides(node, { fill: "none" }));
		cylinder2 = shapeSvg.insert(() => innerLine, ":first-child");
		cylinder2 = shapeSvg.insert(() => outerNode, ":first-child");
		cylinder2.attr("class", "basic label-container");
		if (cssStyles) cylinder2.attr("style", cssStyles);
	} else {
		const pathData = createCylinderPathD3(0, 0, w, h, rx, ry);
		cylinder2 = shapeSvg.insert("path", ":first-child").attr("d", pathData).attr("class", "basic label-container").attr("style", handleUndefinedAttr(cssStyles)).attr("style", nodeStyles);
		cylinder2.attr("class", "basic label-container");
		if (cssStyles) cylinder2.selectAll("path").attr("style", cssStyles);
		if (nodeStyles) cylinder2.selectAll("path").attr("style", nodeStyles);
	}
	cylinder2.attr("label-offset-x", rx);
	cylinder2.attr("transform", `translate(${-w / 2}, ${h / 2} )`);
	label.attr("transform", `translate(${-(bbox.width / 2) - rx - (bbox.x - (bbox.left ?? 0))}, ${-(bbox.height / 2) - (bbox.y - (bbox.top ?? 0))})`);
	updateNodeBounds(node, cylinder2);
	node.intersect = function(point) {
		const pos = intersect_default.rect(node, point);
		const y = pos.y - (node.y ?? 0);
		if (ry != 0 && (Math.abs(y) < (node.height ?? 0) / 2 || Math.abs(y) == (node.height ?? 0) / 2 && Math.abs(pos.x - (node.x ?? 0)) > (node.width ?? 0) / 2 - rx)) {
			let x = rx * rx * (1 - y * y / (ry * ry));
			if (x != 0) x = Math.sqrt(Math.abs(x));
			x = rx - x;
			if (point.x - (node.x ?? 0) > 0) x = -x;
			pos.x += x;
		}
		return pos;
	};
	return shapeSvg;
}
__name(tiltedCylinder, "tiltedCylinder");
async function trapezoid(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox } = await labelHelper(parent, node, getNodeClasses(node));
	const w = bbox.width + node.padding;
	const h = bbox.height + node.padding;
	const points = [
		{
			x: -3 * h / 6,
			y: 0
		},
		{
			x: w + 3 * h / 6,
			y: 0
		},
		{
			x: w,
			y: -h
		},
		{
			x: 0,
			y: -h
		}
	];
	let polygon;
	const { cssStyles } = node;
	if (node.look === "handDrawn") {
		const rc = at.svg(shapeSvg);
		const options = userNodeOverrides(node, {});
		const pathData = createPathFromPoints(points);
		const roughNode = rc.path(pathData, options);
		polygon = shapeSvg.insert(() => roughNode, ":first-child").attr("transform", `translate(${-w / 2}, ${h / 2})`);
		if (cssStyles) polygon.attr("style", cssStyles);
	} else polygon = insertPolygonShape(shapeSvg, w, h, points);
	if (nodeStyles) polygon.attr("style", nodeStyles);
	node.width = w;
	node.height = h;
	updateNodeBounds(node, polygon);
	node.intersect = function(point) {
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(trapezoid, "trapezoid");
async function trapezoidalPentagon(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox } = await labelHelper(parent, node, getNodeClasses(node));
	const minWidth = 60, minHeight = 20;
	const w = Math.max(minWidth, bbox.width + (node.padding ?? 0) * 2, node?.width ?? 0);
	const h = Math.max(minHeight, bbox.height + (node.padding ?? 0) * 2, node?.height ?? 0);
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const points = [
		{
			x: -w / 2 * .8,
			y: -h / 2
		},
		{
			x: w / 2 * .8,
			y: -h / 2
		},
		{
			x: w / 2,
			y: -h / 2 * .6
		},
		{
			x: w / 2,
			y: h / 2
		},
		{
			x: -w / 2,
			y: h / 2
		},
		{
			x: -w / 2,
			y: -h / 2 * .6
		}
	];
	const pathData = createPathFromPoints(points);
	const shapeNode = rc.path(pathData, options);
	const polygon = shapeSvg.insert(() => shapeNode, ":first-child");
	polygon.attr("class", "basic label-container");
	if (cssStyles && node.look !== "handDrawn") polygon.selectChildren("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") polygon.selectChildren("path").attr("style", nodeStyles);
	updateNodeBounds(node, polygon);
	node.intersect = function(point) {
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(trapezoidalPentagon, "trapezoidalPentagon");
async function triangle(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, getNodeClasses(node));
	const useHtmlLabels = evaluate(getConfig2().flowchart?.htmlLabels);
	const w = bbox.width + (node.padding ?? 0);
	const h = w + bbox.height;
	const tw = w + bbox.height;
	const points = [
		{
			x: 0,
			y: 0
		},
		{
			x: tw,
			y: 0
		},
		{
			x: tw / 2,
			y: -h
		}
	];
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const pathData = createPathFromPoints(points);
	const roughNode = rc.path(pathData, options);
	const polygon = shapeSvg.insert(() => roughNode, ":first-child").attr("transform", `translate(${-h / 2}, ${h / 2})`);
	if (cssStyles && node.look !== "handDrawn") polygon.selectChildren("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") polygon.selectChildren("path").attr("style", nodeStyles);
	node.width = w;
	node.height = h;
	updateNodeBounds(node, polygon);
	label.attr("transform", `translate(${-bbox.width / 2 - (bbox.x - (bbox.left ?? 0))}, ${h / 2 - (bbox.height + (node.padding ?? 0) / (useHtmlLabels ? 2 : 1) - (bbox.y - (bbox.top ?? 0)))})`);
	node.intersect = function(point) {
		log.info("Triangle intersect", node, points, point);
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(triangle, "triangle");
async function waveEdgedRectangle(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, getNodeClasses(node));
	const w = Math.max(bbox.width + (node.padding ?? 0) * 2, node?.width ?? 0);
	const h = Math.max(bbox.height + (node.padding ?? 0) * 2, node?.height ?? 0);
	const waveAmplitude = h / 8;
	const finalH = h + waveAmplitude;
	const { cssStyles } = node;
	const widthDif = 70 - w;
	const extraW = widthDif > 0 ? widthDif / 2 : 0;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const points = [
		{
			x: -w / 2 - extraW,
			y: finalH / 2
		},
		...generateFullSineWavePoints(-w / 2 - extraW, finalH / 2, w / 2 + extraW, finalH / 2, waveAmplitude, .8),
		{
			x: w / 2 + extraW,
			y: -finalH / 2
		},
		{
			x: -w / 2 - extraW,
			y: -finalH / 2
		}
	];
	const waveEdgeRectPath = createPathFromPoints(points);
	const waveEdgeRectNode = rc.path(waveEdgeRectPath, options);
	const waveEdgeRect = shapeSvg.insert(() => waveEdgeRectNode, ":first-child");
	waveEdgeRect.attr("class", "basic label-container");
	if (cssStyles && node.look !== "handDrawn") waveEdgeRect.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") waveEdgeRect.selectAll("path").attr("style", nodeStyles);
	waveEdgeRect.attr("transform", `translate(0,${-waveAmplitude / 2})`);
	label.attr("transform", `translate(${-w / 2 + (node.padding ?? 0) - (bbox.x - (bbox.left ?? 0))},${-h / 2 + (node.padding ?? 0) - waveAmplitude - (bbox.y - (bbox.top ?? 0))})`);
	updateNodeBounds(node, waveEdgeRect);
	node.intersect = function(point) {
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(waveEdgedRectangle, "waveEdgedRectangle");
async function waveRectangle(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox } = await labelHelper(parent, node, getNodeClasses(node));
	const minWidth = 100;
	const minHeight = 50;
	const baseWidth = Math.max(bbox.width + (node.padding ?? 0) * 2, node?.width ?? 0);
	const baseHeight = Math.max(bbox.height + (node.padding ?? 0) * 2, node?.height ?? 0);
	const aspectRatio = baseWidth / baseHeight;
	let w = baseWidth;
	let h = baseHeight;
	if (w > h * aspectRatio) h = w / aspectRatio;
	else w = h * aspectRatio;
	w = Math.max(w, minWidth);
	h = Math.max(h, minHeight);
	const waveAmplitude = Math.min(h * .2, h / 4);
	const finalH = h + waveAmplitude * 2;
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const points = [
		{
			x: -w / 2,
			y: finalH / 2
		},
		...generateFullSineWavePoints(-w / 2, finalH / 2, w / 2, finalH / 2, waveAmplitude, 1),
		{
			x: w / 2,
			y: -finalH / 2
		},
		...generateFullSineWavePoints(w / 2, -finalH / 2, -w / 2, -finalH / 2, waveAmplitude, -1)
	];
	const waveRectPath = createPathFromPoints(points);
	const waveRectNode = rc.path(waveRectPath, options);
	const waveRect = shapeSvg.insert(() => waveRectNode, ":first-child");
	waveRect.attr("class", "basic label-container");
	if (cssStyles && node.look !== "handDrawn") waveRect.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") waveRect.selectAll("path").attr("style", nodeStyles);
	updateNodeBounds(node, waveRect);
	node.intersect = function(point) {
		return intersect_default.polygon(node, points, point);
	};
	return shapeSvg;
}
__name(waveRectangle, "waveRectangle");
async function windowPane(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, label } = await labelHelper(parent, node, getNodeClasses(node));
	const w = Math.max(bbox.width + (node.padding ?? 0) * 2, node?.width ?? 0);
	const h = Math.max(bbox.height + (node.padding ?? 0) * 2, node?.height ?? 0);
	const rectOffset = 5;
	const x = -w / 2;
	const y = -h / 2;
	const { cssStyles } = node;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	const outerPathPoints = [
		{
			x: x - rectOffset,
			y: y - rectOffset
		},
		{
			x: x - rectOffset,
			y: y + h
		},
		{
			x: x + w,
			y: y + h
		},
		{
			x: x + w,
			y: y - rectOffset
		}
	];
	const path = `M${x - rectOffset},${y - rectOffset} L${x + w},${y - rectOffset} L${x + w},${y + h} L${x - rectOffset},${y + h} L${x - rectOffset},${y - rectOffset}
                M${x - rectOffset},${y} L${x + w},${y}
                M${x},${y - rectOffset} L${x},${y + h}`;
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const no = rc.path(path, options);
	const windowPane2 = shapeSvg.insert(() => no, ":first-child");
	windowPane2.attr("transform", `translate(${rectOffset / 2}, ${rectOffset / 2})`);
	windowPane2.attr("class", "basic label-container");
	if (cssStyles && node.look !== "handDrawn") windowPane2.selectAll("path").attr("style", cssStyles);
	if (nodeStyles && node.look !== "handDrawn") windowPane2.selectAll("path").attr("style", nodeStyles);
	label.attr("transform", `translate(${-(bbox.width / 2) + rectOffset / 2 - (bbox.x - (bbox.left ?? 0))}, ${-(bbox.height / 2) + rectOffset / 2 - (bbox.y - (bbox.top ?? 0))})`);
	updateNodeBounds(node, windowPane2);
	node.intersect = function(point) {
		return intersect_default.polygon(node, outerPathPoints, point);
	};
	return shapeSvg;
}
__name(windowPane, "windowPane");
async function erBox(parent, node) {
	const entityNode = node;
	if (entityNode.alias) node.label = entityNode.alias;
	if (node.look === "handDrawn") {
		const { themeVariables: themeVariables2 } = getConfig();
		const { background } = themeVariables2;
		await erBox(parent, {
			...node,
			id: node.id + "-background",
			look: "default",
			cssStyles: ["stroke: none", `fill: ${background}`]
		});
	}
	const config = getConfig();
	node.useHtmlLabels = config.htmlLabels;
	let PADDING = config.er?.diagramPadding ?? 10;
	let TEXT_PADDING = config.er?.entityPadding ?? 6;
	const { cssStyles } = node;
	const { labelStyles, nodeStyles } = styles2String(node);
	if (entityNode.attributes.length === 0 && node.label) {
		const options2 = {
			rx: 0,
			ry: 0,
			labelPaddingX: PADDING,
			labelPaddingY: PADDING * 1.5,
			classes: ""
		};
		if (calculateTextWidth(node.label, config) + options2.labelPaddingX * 2 < config.er.minEntityWidth) node.width = config.er.minEntityWidth;
		const shapeSvg2 = await drawRect(parent, node, options2);
		if (!evaluate(config.htmlLabels)) {
			const textElement = shapeSvg2.select("text");
			const bbox = textElement.node()?.getBBox();
			textElement.attr("transform", `translate(${-bbox.width / 2}, 0)`);
		}
		return shapeSvg2;
	}
	if (!config.htmlLabels) {
		PADDING *= 1.25;
		TEXT_PADDING *= 1.25;
	}
	let cssClasses = getNodeClasses(node);
	if (!cssClasses) cssClasses = "node default";
	const shapeSvg = parent.insert("g").attr("class", cssClasses).attr("id", node.domId || node.id);
	const nameBBox = await addText(shapeSvg, node.label ?? "", config, 0, 0, ["name"], labelStyles);
	nameBBox.height += TEXT_PADDING;
	let yOffset = 0;
	const yOffsets = [];
	const rows = [];
	let maxTypeWidth = 0;
	let maxNameWidth = 0;
	let maxKeysWidth = 0;
	let maxCommentWidth = 0;
	let keysPresent = true;
	let commentPresent = true;
	for (const attribute of entityNode.attributes) {
		const typeBBox = await addText(shapeSvg, attribute.type, config, 0, yOffset, ["attribute-type"], labelStyles);
		maxTypeWidth = Math.max(maxTypeWidth, typeBBox.width + PADDING);
		const nameBBox2 = await addText(shapeSvg, attribute.name, config, 0, yOffset, ["attribute-name"], labelStyles);
		maxNameWidth = Math.max(maxNameWidth, nameBBox2.width + PADDING);
		const keysBBox = await addText(shapeSvg, attribute.keys.join(), config, 0, yOffset, ["attribute-keys"], labelStyles);
		maxKeysWidth = Math.max(maxKeysWidth, keysBBox.width + PADDING);
		const commentBBox = await addText(shapeSvg, attribute.comment, config, 0, yOffset, ["attribute-comment"], labelStyles);
		maxCommentWidth = Math.max(maxCommentWidth, commentBBox.width + PADDING);
		const rowHeight = Math.max(typeBBox.height, nameBBox2.height, keysBBox.height, commentBBox.height) + TEXT_PADDING;
		rows.push({
			yOffset,
			rowHeight
		});
		yOffset += rowHeight;
	}
	let totalWidthSections = 4;
	if (maxKeysWidth <= PADDING) {
		keysPresent = false;
		maxKeysWidth = 0;
		totalWidthSections--;
	}
	if (maxCommentWidth <= PADDING) {
		commentPresent = false;
		maxCommentWidth = 0;
		totalWidthSections--;
	}
	const shapeBBox = shapeSvg.node().getBBox();
	if (nameBBox.width + PADDING * 2 - (maxTypeWidth + maxNameWidth + maxKeysWidth + maxCommentWidth) > 0) {
		const difference = nameBBox.width + PADDING * 2 - (maxTypeWidth + maxNameWidth + maxKeysWidth + maxCommentWidth);
		maxTypeWidth += difference / totalWidthSections;
		maxNameWidth += difference / totalWidthSections;
		if (maxKeysWidth > 0) maxKeysWidth += difference / totalWidthSections;
		if (maxCommentWidth > 0) maxCommentWidth += difference / totalWidthSections;
	}
	const maxWidth = maxTypeWidth + maxNameWidth + maxKeysWidth + maxCommentWidth;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	let totalShapeBBoxHeight = 0;
	if (rows.length > 0) totalShapeBBoxHeight = rows.reduce((sum, row) => sum + (row?.rowHeight ?? 0), 0);
	const w = Math.max(shapeBBox.width + PADDING * 2, node?.width || 0, maxWidth);
	const h = Math.max((totalShapeBBoxHeight ?? 0) + nameBBox.height, node?.height || 0);
	const x = -w / 2;
	const y = -h / 2;
	shapeSvg.selectAll("g:not(:first-child)").each((_, i, nodes) => {
		const text2 = select_default(nodes[i]);
		const transform = text2.attr("transform");
		let translateX = 0;
		let translateY = 0;
		if (transform) {
			const translate = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(transform);
			if (translate) {
				translateX = parseFloat(translate[1]);
				translateY = parseFloat(translate[2]);
				if (text2.attr("class").includes("attribute-name")) translateX += maxTypeWidth;
				else if (text2.attr("class").includes("attribute-keys")) translateX += maxTypeWidth + maxNameWidth;
				else if (text2.attr("class").includes("attribute-comment")) translateX += maxTypeWidth + maxNameWidth + maxKeysWidth;
			}
		}
		text2.attr("transform", `translate(${x + PADDING / 2 + translateX}, ${translateY + y + nameBBox.height + TEXT_PADDING / 2})`);
	});
	shapeSvg.select(".name").attr("transform", "translate(" + -nameBBox.width / 2 + ", " + (y + TEXT_PADDING / 2) + ")");
	const roughRect = rc.rectangle(x, y, w, h, options);
	const rect2 = shapeSvg.insert(() => roughRect, ":first-child").attr("style", cssStyles.join(""));
	const { themeVariables } = getConfig();
	const { rowEven, rowOdd, nodeBorder } = themeVariables;
	yOffsets.push(0);
	for (const [i, row] of rows.entries()) {
		const isEven = (i + 1) % 2 === 0 && row.yOffset !== 0;
		const roughRect2 = rc.rectangle(x, nameBBox.height + y + row?.yOffset, w, row?.rowHeight, {
			...options,
			fill: isEven ? rowEven : rowOdd,
			stroke: nodeBorder
		});
		shapeSvg.insert(() => roughRect2, "g.label").attr("style", cssStyles.join("")).attr("class", `row-rect-${isEven ? "even" : "odd"}`);
	}
	let roughLine = rc.line(x, nameBBox.height + y, w + x, nameBBox.height + y, options);
	shapeSvg.insert(() => roughLine).attr("class", "divider");
	roughLine = rc.line(maxTypeWidth + x, nameBBox.height + y, maxTypeWidth + x, h + y, options);
	shapeSvg.insert(() => roughLine).attr("class", "divider");
	if (keysPresent) {
		roughLine = rc.line(maxTypeWidth + maxNameWidth + x, nameBBox.height + y, maxTypeWidth + maxNameWidth + x, h + y, options);
		shapeSvg.insert(() => roughLine).attr("class", "divider");
	}
	if (commentPresent) {
		roughLine = rc.line(maxTypeWidth + maxNameWidth + maxKeysWidth + x, nameBBox.height + y, maxTypeWidth + maxNameWidth + maxKeysWidth + x, h + y, options);
		shapeSvg.insert(() => roughLine).attr("class", "divider");
	}
	for (const yOffset2 of yOffsets) {
		roughLine = rc.line(x, nameBBox.height + y + yOffset2, w + x, nameBBox.height + y + yOffset2, options);
		shapeSvg.insert(() => roughLine).attr("class", "divider");
	}
	updateNodeBounds(node, rect2);
	if (nodeStyles && node.look !== "handDrawn") {
		const strokeStyles = nodeStyles.split(";")?.filter((e) => {
			return e.includes("stroke");
		})?.map((s) => `${s}`).join("; ");
		shapeSvg.selectAll("path").attr("style", strokeStyles ?? "");
		shapeSvg.selectAll(".row-rect-even path").attr("style", nodeStyles);
	}
	node.intersect = function(point) {
		return intersect_default.rect(node, point);
	};
	return shapeSvg;
}
__name(erBox, "erBox");
async function addText(shapeSvg, labelText, config, translateX = 0, translateY = 0, classes = [], style = "") {
	const label = shapeSvg.insert("g").attr("class", `label ${classes.join(" ")}`).attr("transform", `translate(${translateX}, ${translateY})`).attr("style", style);
	if (labelText !== parseGenericTypes(labelText)) {
		labelText = parseGenericTypes(labelText);
		labelText = labelText.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
	}
	const text2 = label.node().appendChild(await createText(label, labelText, {
		width: calculateTextWidth(labelText, config) + 100,
		style,
		useHtmlLabels: config.htmlLabels
	}, config));
	if (labelText.includes("&lt;") || labelText.includes("&gt;")) {
		let child = text2.children[0];
		child.textContent = child.textContent.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
		while (child.childNodes[0]) {
			child = child.childNodes[0];
			child.textContent = child.textContent.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
		}
	}
	let bbox = text2.getBBox();
	if (evaluate(config.htmlLabels)) {
		const div = text2.children[0];
		div.style.textAlign = "start";
		const dv = select_default(text2);
		bbox = div.getBoundingClientRect();
		dv.attr("width", bbox.width);
		dv.attr("height", bbox.height);
	}
	return bbox;
}
__name(addText, "addText");
async function textHelper(parent, node, config, useHtmlLabels, GAP = config.class.padding ?? 12) {
	const TEXT_PADDING = !useHtmlLabels ? 3 : 0;
	const shapeSvg = parent.insert("g").attr("class", getNodeClasses(node)).attr("id", node.domId || node.id);
	let annotationGroup = null;
	let labelGroup = null;
	let membersGroup = null;
	let methodsGroup = null;
	let annotationGroupHeight = 0;
	let labelGroupHeight = 0;
	let membersGroupHeight = 0;
	annotationGroup = shapeSvg.insert("g").attr("class", "annotation-group text");
	if (node.annotations.length > 0) {
		const annotation = node.annotations[0];
		await addText2(annotationGroup, { text: `\xAB${annotation}\xBB` }, 0);
		annotationGroupHeight = annotationGroup.node().getBBox().height;
	}
	labelGroup = shapeSvg.insert("g").attr("class", "label-group text");
	await addText2(labelGroup, node, 0, ["font-weight: bolder"]);
	const labelGroupBBox = labelGroup.node().getBBox();
	labelGroupHeight = labelGroupBBox.height;
	membersGroup = shapeSvg.insert("g").attr("class", "members-group text");
	let yOffset = 0;
	for (const member of node.members) {
		const height = await addText2(membersGroup, member, yOffset, [member.parseClassifier()]);
		yOffset += height + TEXT_PADDING;
	}
	membersGroupHeight = membersGroup.node().getBBox().height;
	if (membersGroupHeight <= 0) membersGroupHeight = GAP / 2;
	methodsGroup = shapeSvg.insert("g").attr("class", "methods-group text");
	let methodsYOffset = 0;
	for (const method of node.methods) {
		const height = await addText2(methodsGroup, method, methodsYOffset, [method.parseClassifier()]);
		methodsYOffset += height + TEXT_PADDING;
	}
	let bbox = shapeSvg.node().getBBox();
	if (annotationGroup !== null) {
		const annotationGroupBBox = annotationGroup.node().getBBox();
		annotationGroup.attr("transform", `translate(${-annotationGroupBBox.width / 2})`);
	}
	labelGroup.attr("transform", `translate(${-labelGroupBBox.width / 2}, ${annotationGroupHeight})`);
	bbox = shapeSvg.node().getBBox();
	membersGroup.attr("transform", `translate(0, ${annotationGroupHeight + labelGroupHeight + GAP * 2})`);
	bbox = shapeSvg.node().getBBox();
	methodsGroup.attr("transform", `translate(0, ${annotationGroupHeight + labelGroupHeight + (membersGroupHeight ? membersGroupHeight + GAP * 4 : GAP * 2)})`);
	bbox = shapeSvg.node().getBBox();
	return {
		shapeSvg,
		bbox
	};
}
__name(textHelper, "textHelper");
async function addText2(parentGroup, node, yOffset, styles = []) {
	const textEl = parentGroup.insert("g").attr("class", "label").attr("style", styles.join("; "));
	const config = getConfig();
	let useHtmlLabels = "useHtmlLabels" in node ? node.useHtmlLabels : evaluate(config.htmlLabels) ?? true;
	let textContent = "";
	if ("text" in node) textContent = node.text;
	else textContent = node.label;
	if (!useHtmlLabels && textContent.startsWith("\\")) textContent = textContent.substring(1);
	if (hasKatex(textContent)) useHtmlLabels = true;
	const text2 = await createText(textEl, sanitizeText3(decodeEntities(textContent)), {
		width: calculateTextWidth(textContent, config) + 50,
		classes: "markdown-node-label",
		useHtmlLabels
	}, config);
	let bbox;
	let numberOfLines = 1;
	if (!useHtmlLabels) {
		if (styles.includes("font-weight: bolder")) select_default(text2).selectAll("tspan").attr("font-weight", "");
		numberOfLines = text2.children.length;
		const textChild = text2.children[0];
		if (text2.textContent === "" || text2.textContent.includes("&gt")) {
			textChild.textContent = textContent[0] + textContent.substring(1).replaceAll("&gt;", ">").replaceAll("&lt;", "<").trim();
			if (textContent[1] === " ") textChild.textContent = textChild.textContent[0] + " " + textChild.textContent.substring(1);
		}
		if (textChild.textContent === "undefined") textChild.textContent = "";
		bbox = text2.getBBox();
	} else {
		const div = text2.children[0];
		const dv = select_default(text2);
		numberOfLines = div.innerHTML.split("<br>").length;
		if (div.innerHTML.includes("</math>")) numberOfLines += div.innerHTML.split("<mrow>").length - 1;
		const images = div.getElementsByTagName("img");
		if (images) {
			const noImgText = textContent.replace(/<img[^>]*>/g, "").trim() === "";
			await Promise.all([...images].map((img) => new Promise((res) => {
				function setupImage() {
					img.style.display = "flex";
					img.style.flexDirection = "column";
					if (noImgText) {
						const bodyFontSize = config.fontSize?.toString() ?? window.getComputedStyle(document.body).fontSize;
						const width = parseInt(bodyFontSize, 10) * 5 + "px";
						img.style.minWidth = width;
						img.style.maxWidth = width;
					} else img.style.width = "100%";
					res(img);
				}
				__name(setupImage, "setupImage");
				setTimeout(() => {
					if (img.complete) setupImage();
				});
				img.addEventListener("error", setupImage);
				img.addEventListener("load", setupImage);
			})));
		}
		bbox = div.getBoundingClientRect();
		dv.attr("width", bbox.width);
		dv.attr("height", bbox.height);
	}
	textEl.attr("transform", "translate(0," + (-bbox.height / (2 * numberOfLines) + yOffset) + ")");
	return bbox.height;
}
__name(addText2, "addText");
async function classBox(parent, node) {
	const config = getConfig2();
	const PADDING = config.class.padding ?? 12;
	const GAP = PADDING;
	const useHtmlLabels = node.useHtmlLabels ?? evaluate(config.htmlLabels) ?? true;
	const classNode = node;
	classNode.annotations = classNode.annotations ?? [];
	classNode.members = classNode.members ?? [];
	classNode.methods = classNode.methods ?? [];
	const { shapeSvg, bbox } = await textHelper(parent, node, config, useHtmlLabels, GAP);
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	node.cssStyles = classNode.styles || "";
	const styles = classNode.styles?.join(";") || nodeStyles || "";
	if (!node.cssStyles) node.cssStyles = styles.replaceAll("!important", "").split(";");
	const renderExtraBox = classNode.members.length === 0 && classNode.methods.length === 0 && !config.class?.hideEmptyMembersBox;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const w = bbox.width;
	let h = bbox.height;
	if (classNode.members.length === 0 && classNode.methods.length === 0) h += GAP;
	else if (classNode.members.length > 0 && classNode.methods.length === 0) h += GAP * 2;
	const x = -w / 2;
	const y = -h / 2;
	const roughRect = rc.rectangle(x - PADDING, y - PADDING - (renderExtraBox ? PADDING : classNode.members.length === 0 && classNode.methods.length === 0 ? -PADDING / 2 : 0), w + 2 * PADDING, h + 2 * PADDING + (renderExtraBox ? PADDING * 2 : classNode.members.length === 0 && classNode.methods.length === 0 ? -PADDING : 0), options);
	const rect2 = shapeSvg.insert(() => roughRect, ":first-child");
	rect2.attr("class", "basic label-container");
	const rectBBox = rect2.node().getBBox();
	shapeSvg.selectAll(".text").each((_, i, nodes) => {
		const text2 = select_default(nodes[i]);
		const transform = text2.attr("transform");
		let translateY = 0;
		if (transform) {
			const translate = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(transform);
			if (translate) translateY = parseFloat(translate[2]);
		}
		let newTranslateY = translateY + y + PADDING - (renderExtraBox ? PADDING : classNode.members.length === 0 && classNode.methods.length === 0 ? -PADDING / 2 : 0);
		if (!useHtmlLabels) newTranslateY -= 4;
		let newTranslateX = x;
		if (text2.attr("class").includes("label-group") || text2.attr("class").includes("annotation-group")) {
			newTranslateX = -text2.node()?.getBBox().width / 2 || 0;
			shapeSvg.selectAll("text").each(function(_2, i2, nodes2) {
				if (window.getComputedStyle(nodes2[i2]).textAnchor === "middle") newTranslateX = 0;
			});
		}
		text2.attr("transform", `translate(${newTranslateX}, ${newTranslateY})`);
	});
	const annotationGroupHeight = shapeSvg.select(".annotation-group").node().getBBox().height - (renderExtraBox ? PADDING / 2 : 0) || 0;
	const labelGroupHeight = shapeSvg.select(".label-group").node().getBBox().height - (renderExtraBox ? PADDING / 2 : 0) || 0;
	const membersGroupHeight = shapeSvg.select(".members-group").node().getBBox().height - (renderExtraBox ? PADDING / 2 : 0) || 0;
	if (classNode.members.length > 0 || classNode.methods.length > 0 || renderExtraBox) {
		const roughLine = rc.line(rectBBox.x, annotationGroupHeight + labelGroupHeight + y + PADDING, rectBBox.x + rectBBox.width, annotationGroupHeight + labelGroupHeight + y + PADDING, options);
		shapeSvg.insert(() => roughLine).attr("class", "divider").attr("style", styles);
	}
	if (renderExtraBox || classNode.members.length > 0 || classNode.methods.length > 0) {
		const roughLine = rc.line(rectBBox.x, annotationGroupHeight + labelGroupHeight + membersGroupHeight + y + GAP * 2 + PADDING, rectBBox.x + rectBBox.width, annotationGroupHeight + labelGroupHeight + membersGroupHeight + y + PADDING + GAP * 2, options);
		shapeSvg.insert(() => roughLine).attr("class", "divider").attr("style", styles);
	}
	if (classNode.look !== "handDrawn") shapeSvg.selectAll("path").attr("style", styles);
	rect2.select(":nth-child(2)").attr("style", styles);
	shapeSvg.selectAll(".divider").select("path").attr("style", styles);
	if (node.labelStyle) shapeSvg.selectAll("span").attr("style", node.labelStyle);
	else shapeSvg.selectAll("span").attr("style", styles);
	if (!useHtmlLabels) {
		const colorRegex = RegExp(/color\s*:\s*([^;]*)/);
		const match = colorRegex.exec(styles);
		if (match) {
			const colorStyle = match[0].replace("color", "fill");
			shapeSvg.selectAll("tspan").attr("style", colorStyle);
		} else if (labelStyles) {
			const match2 = colorRegex.exec(labelStyles);
			if (match2) {
				const colorStyle = match2[0].replace("color", "fill");
				shapeSvg.selectAll("tspan").attr("style", colorStyle);
			}
		}
	}
	updateNodeBounds(node, rect2);
	node.intersect = function(point) {
		return intersect_default.rect(node, point);
	};
	return shapeSvg;
}
__name(classBox, "classBox");
async function requirementBox(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const requirementNode = node;
	const elementNode = node;
	const padding = 20;
	const gap = 20;
	const isRequirementNode = "verifyMethod" in node;
	const classes = getNodeClasses(node);
	const shapeSvg = parent.insert("g").attr("class", classes).attr("id", node.domId ?? node.id);
	let typeHeight;
	if (isRequirementNode) typeHeight = await addText3(shapeSvg, `&lt;&lt;${requirementNode.type}&gt;&gt;`, 0, node.labelStyle);
	else typeHeight = await addText3(shapeSvg, "&lt;&lt;Element&gt;&gt;", 0, node.labelStyle);
	let accumulativeHeight = typeHeight;
	const nameHeight = await addText3(shapeSvg, requirementNode.name, accumulativeHeight, node.labelStyle + "; font-weight: bold;");
	accumulativeHeight += nameHeight + gap;
	if (isRequirementNode) {
		const idHeight = await addText3(shapeSvg, `${requirementNode.requirementId ? `ID: ${requirementNode.requirementId}` : ""}`, accumulativeHeight, node.labelStyle);
		accumulativeHeight += idHeight;
		const textHeight = await addText3(shapeSvg, `${requirementNode.text ? `Text: ${requirementNode.text}` : ""}`, accumulativeHeight, node.labelStyle);
		accumulativeHeight += textHeight;
		const riskHeight = await addText3(shapeSvg, `${requirementNode.risk ? `Risk: ${requirementNode.risk}` : ""}`, accumulativeHeight, node.labelStyle);
		accumulativeHeight += riskHeight;
		await addText3(shapeSvg, `${requirementNode.verifyMethod ? `Verification: ${requirementNode.verifyMethod}` : ""}`, accumulativeHeight, node.labelStyle);
	} else {
		const typeHeight2 = await addText3(shapeSvg, `${elementNode.type ? `Type: ${elementNode.type}` : ""}`, accumulativeHeight, node.labelStyle);
		accumulativeHeight += typeHeight2;
		await addText3(shapeSvg, `${elementNode.docRef ? `Doc Ref: ${elementNode.docRef}` : ""}`, accumulativeHeight, node.labelStyle);
	}
	const totalWidth = (shapeSvg.node()?.getBBox().width ?? 200) + padding;
	const totalHeight = (shapeSvg.node()?.getBBox().height ?? 200) + padding;
	const x = -totalWidth / 2;
	const y = -totalHeight / 2;
	const rc = at.svg(shapeSvg);
	const options = userNodeOverrides(node, {});
	if (node.look !== "handDrawn") {
		options.roughness = 0;
		options.fillStyle = "solid";
	}
	const roughRect = rc.rectangle(x, y, totalWidth, totalHeight, options);
	const rect2 = shapeSvg.insert(() => roughRect, ":first-child");
	rect2.attr("class", "basic label-container").attr("style", nodeStyles);
	shapeSvg.selectAll(".label").each((_, i, nodes) => {
		const text2 = select_default(nodes[i]);
		const transform = text2.attr("transform");
		let translateX = 0;
		let translateY = 0;
		if (transform) {
			const translate = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(transform);
			if (translate) {
				translateX = parseFloat(translate[1]);
				translateY = parseFloat(translate[2]);
			}
		}
		const newTranslateY = translateY - totalHeight / 2;
		let newTranslateX = x + padding / 2;
		if (i === 0 || i === 1) newTranslateX = translateX;
		text2.attr("transform", `translate(${newTranslateX}, ${newTranslateY + padding})`);
	});
	if (accumulativeHeight > typeHeight + nameHeight + gap) {
		const roughLine = rc.line(x, y + typeHeight + nameHeight + gap, x + totalWidth, y + typeHeight + nameHeight + gap, options);
		shapeSvg.insert(() => roughLine).attr("style", nodeStyles);
	}
	updateNodeBounds(node, rect2);
	node.intersect = function(point) {
		return intersect_default.rect(node, point);
	};
	return shapeSvg;
}
__name(requirementBox, "requirementBox");
async function addText3(parentGroup, inputText, yOffset, style = "") {
	if (inputText === "") return 0;
	const textEl = parentGroup.insert("g").attr("class", "label").attr("style", style);
	const config = getConfig2();
	const useHtmlLabels = config.htmlLabels ?? true;
	const text2 = await createText(textEl, sanitizeText3(decodeEntities(inputText)), {
		width: calculateTextWidth(inputText, config) + 50,
		classes: "markdown-node-label",
		useHtmlLabels,
		style
	}, config);
	let bbox;
	if (!useHtmlLabels) {
		const textChild = text2.children[0];
		for (const child of textChild.children) {
			child.textContent = child.textContent.replaceAll("&gt;", ">").replaceAll("&lt;", "<");
			if (style) child.setAttribute("style", style);
		}
		bbox = text2.getBBox();
		bbox.height += 6;
	} else {
		const div = text2.children[0];
		const dv = select_default(text2);
		bbox = div.getBoundingClientRect();
		dv.attr("width", bbox.width);
		dv.attr("height", bbox.height);
	}
	textEl.attr("transform", `translate(${-bbox.width / 2},${-bbox.height / 2 + yOffset})`);
	return bbox.height;
}
__name(addText3, "addText");
var colorFromPriority = /* @__PURE__ */ __name((priority) => {
	switch (priority) {
		case "Very High": return "red";
		case "High": return "orange";
		case "Medium": return null;
		case "Low": return "blue";
		case "Very Low": return "lightblue";
	}
}, "colorFromPriority");
async function kanbanItem(parent, kanbanNode, { config }) {
	const { labelStyles, nodeStyles } = styles2String(kanbanNode);
	kanbanNode.labelStyle = labelStyles || "";
	const orgWidth = kanbanNode.width;
	kanbanNode.width = (kanbanNode.width ?? 200) - 10;
	const { shapeSvg, bbox, label: labelElTitle } = await labelHelper(parent, kanbanNode, getNodeClasses(kanbanNode));
	const padding = kanbanNode.padding || 10;
	let ticketUrl = "";
	let link;
	if ("ticket" in kanbanNode && kanbanNode.ticket && config?.kanban?.ticketBaseUrl) {
		ticketUrl = config?.kanban?.ticketBaseUrl.replace("#TICKET#", kanbanNode.ticket);
		link = shapeSvg.insert("svg:a", ":first-child").attr("class", "kanban-ticket-link").attr("xlink:href", ticketUrl).attr("target", "_blank");
	}
	const options = {
		useHtmlLabels: kanbanNode.useHtmlLabels,
		labelStyle: kanbanNode.labelStyle || "",
		width: kanbanNode.width,
		img: kanbanNode.img,
		padding: kanbanNode.padding || 8,
		centerLabel: false
	};
	let labelEl, bbox2;
	if (link) ({label: labelEl, bbox: bbox2} = await insertLabel(link, "ticket" in kanbanNode && kanbanNode.ticket || "", options));
	else ({label: labelEl, bbox: bbox2} = await insertLabel(shapeSvg, "ticket" in kanbanNode && kanbanNode.ticket || "", options));
	const { label: labelElAssigned, bbox: bboxAssigned } = await insertLabel(shapeSvg, "assigned" in kanbanNode && kanbanNode.assigned || "", options);
	kanbanNode.width = orgWidth;
	const totalWidth = kanbanNode?.width || 0;
	const heightAdj = Math.max(bbox2.height, bboxAssigned.height) / 2;
	const totalHeight = Math.max(bbox.height + 20, kanbanNode?.height || 0) + heightAdj;
	const x = -totalWidth / 2;
	const y = -totalHeight / 2;
	labelElTitle.attr("transform", "translate(" + (padding - totalWidth / 2) + ", " + (-heightAdj - bbox.height / 2) + ")");
	labelEl.attr("transform", "translate(" + (padding - totalWidth / 2) + ", " + (-heightAdj + bbox.height / 2) + ")");
	labelElAssigned.attr("transform", "translate(" + (padding + totalWidth / 2 - bboxAssigned.width - 20) + ", " + (-heightAdj + bbox.height / 2) + ")");
	let rect2;
	const { rx, ry } = kanbanNode;
	const { cssStyles } = kanbanNode;
	if (kanbanNode.look === "handDrawn") {
		const rc = at.svg(shapeSvg);
		const options2 = userNodeOverrides(kanbanNode, {});
		const roughNode = rx || ry ? rc.path(createRoundedRectPathD(x, y, totalWidth, totalHeight, rx || 0), options2) : rc.rectangle(x, y, totalWidth, totalHeight, options2);
		rect2 = shapeSvg.insert(() => roughNode, ":first-child");
		rect2.attr("class", "basic label-container").attr("style", cssStyles ? cssStyles : null);
	} else {
		rect2 = shapeSvg.insert("rect", ":first-child");
		rect2.attr("class", "basic label-container __APA__").attr("style", nodeStyles).attr("rx", rx ?? 5).attr("ry", ry ?? 5).attr("x", x).attr("y", y).attr("width", totalWidth).attr("height", totalHeight);
		const priority = "priority" in kanbanNode && kanbanNode.priority;
		if (priority) {
			const line = shapeSvg.append("line");
			const lineX = x + 2;
			const y1 = y + Math.floor((rx ?? 0) / 2);
			const y2 = y + totalHeight - Math.floor((rx ?? 0) / 2);
			line.attr("x1", lineX).attr("y1", y1).attr("x2", lineX).attr("y2", y2).attr("stroke-width", "4").attr("stroke", colorFromPriority(priority));
		}
	}
	updateNodeBounds(kanbanNode, rect2);
	kanbanNode.height = totalHeight;
	kanbanNode.intersect = function(point) {
		return intersect_default.rect(kanbanNode, point);
	};
	return shapeSvg;
}
__name(kanbanItem, "kanbanItem");
async function bang(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, halfPadding, label } = await labelHelper(parent, node, getNodeClasses(node));
	const w = bbox.width + 10 * halfPadding;
	const h = bbox.height + 8 * halfPadding;
	const r = .15 * w;
	const { cssStyles } = node;
	const minWidth = bbox.width + 20;
	const minHeight = bbox.height + 20;
	const effectiveWidth = Math.max(w, minWidth);
	const effectiveHeight = Math.max(h, minHeight);
	label.attr("transform", `translate(${-bbox.width / 2}, ${-bbox.height / 2})`);
	let bangElem;
	const path = `M0 0 
    a${r},${r} 1 0,0 ${effectiveWidth * .25},${-1 * effectiveHeight * .1}
    a${r},${r} 1 0,0 ${effectiveWidth * .25},0
    a${r},${r} 1 0,0 ${effectiveWidth * .25},0
    a${r},${r} 1 0,0 ${effectiveWidth * .25},${effectiveHeight * .1}

    a${r},${r} 1 0,0 ${effectiveWidth * .15},${effectiveHeight * .33}
    a${r * .8},${r * .8} 1 0,0 0,${effectiveHeight * .34}
    a${r},${r} 1 0,0 ${-1 * effectiveWidth * .15},${effectiveHeight * .33}

    a${r},${r} 1 0,0 ${-1 * effectiveWidth * .25},${effectiveHeight * .15}
    a${r},${r} 1 0,0 ${-1 * effectiveWidth * .25},0
    a${r},${r} 1 0,0 ${-1 * effectiveWidth * .25},0
    a${r},${r} 1 0,0 ${-1 * effectiveWidth * .25},${-1 * effectiveHeight * .15}

    a${r},${r} 1 0,0 ${-1 * effectiveWidth * .1},${-1 * effectiveHeight * .33}
    a${r * .8},${r * .8} 1 0,0 0,${-1 * effectiveHeight * .34}
    a${r},${r} 1 0,0 ${effectiveWidth * .1},${-1 * effectiveHeight * .33}
  H0 V0 Z`;
	if (node.look === "handDrawn") {
		const rc = at.svg(shapeSvg);
		const options = userNodeOverrides(node, {});
		const roughNode = rc.path(path, options);
		bangElem = shapeSvg.insert(() => roughNode, ":first-child");
		bangElem.attr("class", "basic label-container").attr("style", handleUndefinedAttr(cssStyles));
	} else bangElem = shapeSvg.insert("path", ":first-child").attr("class", "basic label-container").attr("style", nodeStyles).attr("d", path);
	bangElem.attr("transform", `translate(${-effectiveWidth / 2}, ${-effectiveHeight / 2})`);
	updateNodeBounds(node, bangElem);
	node.calcIntersect = function(bounds, point) {
		return intersect_default.rect(bounds, point);
	};
	node.intersect = function(point) {
		log.info("Bang intersect", node, point);
		return intersect_default.rect(node, point);
	};
	return shapeSvg;
}
__name(bang, "bang");
async function cloud(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, halfPadding, label } = await labelHelper(parent, node, getNodeClasses(node));
	const w = bbox.width + 2 * halfPadding;
	const h = bbox.height + 2 * halfPadding;
	const r1 = .15 * w;
	const r2 = .25 * w;
	const r3 = .35 * w;
	const r4 = .2 * w;
	const { cssStyles } = node;
	let cloudElem;
	const path = `M0 0 
    a${r1},${r1} 0 0,1 ${w * .25},${-1 * w * .1}
    a${r3},${r3} 1 0,1 ${w * .4},${-1 * w * .1}
    a${r2},${r2} 1 0,1 ${w * .35},${w * .2}

    a${r1},${r1} 1 0,1 ${w * .15},${h * .35}
    a${r4},${r4} 1 0,1 ${-1 * w * .15},${h * .65}

    a${r2},${r1} 1 0,1 ${-1 * w * .25},${w * .15}
    a${r3},${r3} 1 0,1 ${-1 * w * .5},0
    a${r1},${r1} 1 0,1 ${-1 * w * .25},${-1 * w * .15}

    a${r1},${r1} 1 0,1 ${-1 * w * .1},${-1 * h * .35}
    a${r4},${r4} 1 0,1 ${w * .1},${-1 * h * .65}
  H0 V0 Z`;
	if (node.look === "handDrawn") {
		const rc = at.svg(shapeSvg);
		const options = userNodeOverrides(node, {});
		const roughNode = rc.path(path, options);
		cloudElem = shapeSvg.insert(() => roughNode, ":first-child");
		cloudElem.attr("class", "basic label-container").attr("style", handleUndefinedAttr(cssStyles));
	} else cloudElem = shapeSvg.insert("path", ":first-child").attr("class", "basic label-container").attr("style", nodeStyles).attr("d", path);
	label.attr("transform", `translate(${-bbox.width / 2}, ${-bbox.height / 2})`);
	cloudElem.attr("transform", `translate(${-w / 2}, ${-h / 2})`);
	updateNodeBounds(node, cloudElem);
	node.calcIntersect = function(bounds, point) {
		return intersect_default.rect(bounds, point);
	};
	node.intersect = function(point) {
		log.info("Cloud intersect", node, point);
		return intersect_default.rect(node, point);
	};
	return shapeSvg;
}
__name(cloud, "cloud");
async function defaultMindmapNode(parent, node) {
	const { labelStyles, nodeStyles } = styles2String(node);
	node.labelStyle = labelStyles;
	const { shapeSvg, bbox, halfPadding, label } = await labelHelper(parent, node, getNodeClasses(node));
	const w = bbox.width + 8 * halfPadding;
	const h = bbox.height + 2 * halfPadding;
	const rd = 5;
	const rectPath = `
    M${-w / 2} ${h / 2 - rd}
    v${-h + 10}
    q0,-${rd} ${rd},-${rd}
    h${w - 10}
    q${rd},0 ${rd},${rd}
    v${h - 10}
    q0,${rd} -${rd},${rd}
    h${-w + 10}
    q-${rd},0 -${rd},-${rd}
    Z
  `;
	const bg = shapeSvg.append("path").attr("id", "node-" + node.id).attr("class", "node-bkg node-" + node.type).attr("style", nodeStyles).attr("d", rectPath);
	shapeSvg.append("line").attr("class", "node-line-").attr("x1", -w / 2).attr("y1", h / 2).attr("x2", w / 2).attr("y2", h / 2);
	label.attr("transform", `translate(${-bbox.width / 2}, ${-bbox.height / 2})`);
	shapeSvg.append(() => label.node());
	updateNodeBounds(node, bg);
	node.calcIntersect = function(bounds, point) {
		return intersect_default.rect(bounds, point);
	};
	node.intersect = function(point) {
		return intersect_default.rect(node, point);
	};
	return shapeSvg;
}
__name(defaultMindmapNode, "defaultMindmapNode");
async function mindmapCircle(parent, node) {
	return circle(parent, node, { padding: node.padding ?? 0 });
}
__name(mindmapCircle, "mindmapCircle");
var shapesDefs = [
	{
		semanticName: "Process",
		name: "Rectangle",
		shortName: "rect",
		description: "Standard process shape",
		aliases: [
			"proc",
			"process",
			"rectangle"
		],
		internalAliases: ["squareRect"],
		handler: squareRect2
	},
	{
		semanticName: "Event",
		name: "Rounded Rectangle",
		shortName: "rounded",
		description: "Represents an event",
		aliases: ["event"],
		internalAliases: ["roundedRect"],
		handler: roundedRect
	},
	{
		semanticName: "Terminal Point",
		name: "Stadium",
		shortName: "stadium",
		description: "Terminal point",
		aliases: ["terminal", "pill"],
		handler: stadium
	},
	{
		semanticName: "Subprocess",
		name: "Framed Rectangle",
		shortName: "fr-rect",
		description: "Subprocess",
		aliases: [
			"subprocess",
			"subproc",
			"framed-rectangle",
			"subroutine"
		],
		handler: subroutine
	},
	{
		semanticName: "Database",
		name: "Cylinder",
		shortName: "cyl",
		description: "Database storage",
		aliases: [
			"db",
			"database",
			"cylinder"
		],
		handler: cylinder
	},
	{
		semanticName: "Start",
		name: "Circle",
		shortName: "circle",
		description: "Starting point",
		aliases: ["circ"],
		handler: circle
	},
	{
		semanticName: "Bang",
		name: "Bang",
		shortName: "bang",
		description: "Bang",
		aliases: ["bang"],
		handler: bang
	},
	{
		semanticName: "Cloud",
		name: "Cloud",
		shortName: "cloud",
		description: "cloud",
		aliases: ["cloud"],
		handler: cloud
	},
	{
		semanticName: "Decision",
		name: "Diamond",
		shortName: "diam",
		description: "Decision-making step",
		aliases: [
			"decision",
			"diamond",
			"question"
		],
		handler: question
	},
	{
		semanticName: "Prepare Conditional",
		name: "Hexagon",
		shortName: "hex",
		description: "Preparation or condition step",
		aliases: ["hexagon", "prepare"],
		handler: hexagon
	},
	{
		semanticName: "Data Input/Output",
		name: "Lean Right",
		shortName: "lean-r",
		description: "Represents input or output",
		aliases: ["lean-right", "in-out"],
		internalAliases: ["lean_right"],
		handler: lean_right
	},
	{
		semanticName: "Data Input/Output",
		name: "Lean Left",
		shortName: "lean-l",
		description: "Represents output or input",
		aliases: ["lean-left", "out-in"],
		internalAliases: ["lean_left"],
		handler: lean_left
	},
	{
		semanticName: "Priority Action",
		name: "Trapezoid Base Bottom",
		shortName: "trap-b",
		description: "Priority action",
		aliases: [
			"priority",
			"trapezoid-bottom",
			"trapezoid"
		],
		handler: trapezoid
	},
	{
		semanticName: "Manual Operation",
		name: "Trapezoid Base Top",
		shortName: "trap-t",
		description: "Represents a manual task",
		aliases: [
			"manual",
			"trapezoid-top",
			"inv-trapezoid"
		],
		internalAliases: ["inv_trapezoid"],
		handler: inv_trapezoid
	},
	{
		semanticName: "Stop",
		name: "Double Circle",
		shortName: "dbl-circ",
		description: "Represents a stop point",
		aliases: ["double-circle"],
		internalAliases: ["doublecircle"],
		handler: doublecircle
	},
	{
		semanticName: "Text Block",
		name: "Text Block",
		shortName: "text",
		description: "Text block",
		handler: text
	},
	{
		semanticName: "Card",
		name: "Notched Rectangle",
		shortName: "notch-rect",
		description: "Represents a card",
		aliases: ["card", "notched-rectangle"],
		handler: card
	},
	{
		semanticName: "Lined/Shaded Process",
		name: "Lined Rectangle",
		shortName: "lin-rect",
		description: "Lined process shape",
		aliases: [
			"lined-rectangle",
			"lined-process",
			"lin-proc",
			"shaded-process"
		],
		handler: shadedProcess
	},
	{
		semanticName: "Start",
		name: "Small Circle",
		shortName: "sm-circ",
		description: "Small starting point",
		aliases: ["start", "small-circle"],
		internalAliases: ["stateStart"],
		handler: stateStart
	},
	{
		semanticName: "Stop",
		name: "Framed Circle",
		shortName: "fr-circ",
		description: "Stop point",
		aliases: ["stop", "framed-circle"],
		internalAliases: ["stateEnd"],
		handler: stateEnd
	},
	{
		semanticName: "Fork/Join",
		name: "Filled Rectangle",
		shortName: "fork",
		description: "Fork or join in process flow",
		aliases: ["join"],
		internalAliases: ["forkJoin"],
		handler: forkJoin
	},
	{
		semanticName: "Collate",
		name: "Hourglass",
		shortName: "hourglass",
		description: "Represents a collate operation",
		aliases: ["hourglass", "collate"],
		handler: hourglass
	},
	{
		semanticName: "Comment",
		name: "Curly Brace",
		shortName: "brace",
		description: "Adds a comment",
		aliases: ["comment", "brace-l"],
		handler: curlyBraceLeft
	},
	{
		semanticName: "Comment Right",
		name: "Curly Brace",
		shortName: "brace-r",
		description: "Adds a comment",
		handler: curlyBraceRight
	},
	{
		semanticName: "Comment with braces on both sides",
		name: "Curly Braces",
		shortName: "braces",
		description: "Adds a comment",
		handler: curlyBraces
	},
	{
		semanticName: "Com Link",
		name: "Lightning Bolt",
		shortName: "bolt",
		description: "Communication link",
		aliases: ["com-link", "lightning-bolt"],
		handler: lightningBolt
	},
	{
		semanticName: "Document",
		name: "Document",
		shortName: "doc",
		description: "Represents a document",
		aliases: ["doc", "document"],
		handler: waveEdgedRectangle
	},
	{
		semanticName: "Delay",
		name: "Half-Rounded Rectangle",
		shortName: "delay",
		description: "Represents a delay",
		aliases: ["half-rounded-rectangle"],
		handler: halfRoundedRectangle
	},
	{
		semanticName: "Direct Access Storage",
		name: "Horizontal Cylinder",
		shortName: "h-cyl",
		description: "Direct access storage",
		aliases: ["das", "horizontal-cylinder"],
		handler: tiltedCylinder
	},
	{
		semanticName: "Disk Storage",
		name: "Lined Cylinder",
		shortName: "lin-cyl",
		description: "Disk storage",
		aliases: ["disk", "lined-cylinder"],
		handler: linedCylinder
	},
	{
		semanticName: "Display",
		name: "Curved Trapezoid",
		shortName: "curv-trap",
		description: "Represents a display",
		aliases: ["curved-trapezoid", "display"],
		handler: curvedTrapezoid
	},
	{
		semanticName: "Divided Process",
		name: "Divided Rectangle",
		shortName: "div-rect",
		description: "Divided process shape",
		aliases: [
			"div-proc",
			"divided-rectangle",
			"divided-process"
		],
		handler: dividedRectangle
	},
	{
		semanticName: "Extract",
		name: "Triangle",
		shortName: "tri",
		description: "Extraction process",
		aliases: ["extract", "triangle"],
		handler: triangle
	},
	{
		semanticName: "Internal Storage",
		name: "Window Pane",
		shortName: "win-pane",
		description: "Internal storage",
		aliases: ["internal-storage", "window-pane"],
		handler: windowPane
	},
	{
		semanticName: "Junction",
		name: "Filled Circle",
		shortName: "f-circ",
		description: "Junction point",
		aliases: ["junction", "filled-circle"],
		handler: filledCircle
	},
	{
		semanticName: "Loop Limit",
		name: "Trapezoidal Pentagon",
		shortName: "notch-pent",
		description: "Loop limit step",
		aliases: ["loop-limit", "notched-pentagon"],
		handler: trapezoidalPentagon
	},
	{
		semanticName: "Manual File",
		name: "Flipped Triangle",
		shortName: "flip-tri",
		description: "Manual file operation",
		aliases: ["manual-file", "flipped-triangle"],
		handler: flippedTriangle
	},
	{
		semanticName: "Manual Input",
		name: "Sloped Rectangle",
		shortName: "sl-rect",
		description: "Manual input step",
		aliases: ["manual-input", "sloped-rectangle"],
		handler: slopedRect
	},
	{
		semanticName: "Multi-Document",
		name: "Stacked Document",
		shortName: "docs",
		description: "Multiple documents",
		aliases: [
			"documents",
			"st-doc",
			"stacked-document"
		],
		handler: multiWaveEdgedRectangle
	},
	{
		semanticName: "Multi-Process",
		name: "Stacked Rectangle",
		shortName: "st-rect",
		description: "Multiple processes",
		aliases: [
			"procs",
			"processes",
			"stacked-rectangle"
		],
		handler: multiRect
	},
	{
		semanticName: "Stored Data",
		name: "Bow Tie Rectangle",
		shortName: "bow-rect",
		description: "Stored data",
		aliases: ["stored-data", "bow-tie-rectangle"],
		handler: bowTieRect
	},
	{
		semanticName: "Summary",
		name: "Crossed Circle",
		shortName: "cross-circ",
		description: "Summary",
		aliases: ["summary", "crossed-circle"],
		handler: crossedCircle
	},
	{
		semanticName: "Tagged Document",
		name: "Tagged Document",
		shortName: "tag-doc",
		description: "Tagged document",
		aliases: ["tag-doc", "tagged-document"],
		handler: taggedWaveEdgedRectangle
	},
	{
		semanticName: "Tagged Process",
		name: "Tagged Rectangle",
		shortName: "tag-rect",
		description: "Tagged process",
		aliases: [
			"tagged-rectangle",
			"tag-proc",
			"tagged-process"
		],
		handler: taggedRect
	},
	{
		semanticName: "Paper Tape",
		name: "Flag",
		shortName: "flag",
		description: "Paper tape",
		aliases: ["paper-tape"],
		handler: waveRectangle
	},
	{
		semanticName: "Odd",
		name: "Odd",
		shortName: "odd",
		description: "Odd shape",
		internalAliases: ["rect_left_inv_arrow"],
		handler: rect_left_inv_arrow
	},
	{
		semanticName: "Lined Document",
		name: "Lined Document",
		shortName: "lin-doc",
		description: "Lined document",
		aliases: ["lined-document"],
		handler: linedWaveEdgedRect
	}
];
var shapes2 = (/* @__PURE__ */ __name(() => {
	const entries = [...Object.entries({
		state,
		choice,
		note,
		rectWithTitle,
		labelRect,
		iconSquare,
		iconCircle,
		icon,
		iconRounded,
		imageSquare,
		anchor,
		kanbanItem,
		mindmapCircle,
		defaultMindmapNode,
		classBox,
		erBox,
		requirementBox
	}), ...shapesDefs.flatMap((shape) => {
		return [
			shape.shortName,
			..."aliases" in shape ? shape.aliases : [],
			..."internalAliases" in shape ? shape.internalAliases : []
		].map((alias) => [alias, shape.handler]);
	})];
	return Object.fromEntries(entries);
}, "generateShapeMap"))();
function isValidShape(shape) {
	return shape in shapes2;
}
__name(isValidShape, "isValidShape");
var nodeElems = /* @__PURE__ */ new Map();
async function insertNode(elem, node, renderOptions) {
	let newEl;
	let el;
	if (node.shape === "rect") {
		if (node.rx && node.ry) node.shape = "roundedRect";
		else node.shape = "squareRect";
	}
	const shapeHandler = node.shape ? shapes2[node.shape] : void 0;
	if (!shapeHandler) throw new Error(`No such shape: ${node.shape}. Please check your syntax.`);
	if (node.link) {
		let target;
		if (renderOptions.config.securityLevel === "sandbox") target = "_top";
		else if (node.linkTarget) target = node.linkTarget || "_blank";
		newEl = elem.insert("svg:a").attr("xlink:href", node.link).attr("target", target ?? null);
		el = await shapeHandler(newEl, node, renderOptions);
	} else {
		el = await shapeHandler(elem, node, renderOptions);
		newEl = el;
	}
	if (node.tooltip) el.attr("title", node.tooltip);
	nodeElems.set(node.id, newEl);
	if (node.haveCallback) newEl.attr("class", newEl.attr("class") + " clickable");
	return newEl;
}
__name(insertNode, "insertNode");
var setNodeElem = /* @__PURE__ */ __name((elem, node) => {
	nodeElems.set(node.id, elem);
}, "setNodeElem");
var clear2 = /* @__PURE__ */ __name(() => {
	nodeElems.clear();
}, "clear");
var positionNode = /* @__PURE__ */ __name((node) => {
	const el = nodeElems.get(node.id);
	log.trace("Transforming node", node.diff, node, "translate(" + (node.x - node.width / 2 - 5) + ", " + node.width / 2 + ")");
	const padding = 8;
	const diff = node.diff || 0;
	if (node.clusterNode) el.attr("transform", "translate(" + (node.x + diff - node.width / 2) + ", " + (node.y - node.height / 2 - padding) + ")");
	else el.attr("transform", "translate(" + node.x + ", " + node.y + ")");
	return diff;
}, "positionNode");
export { insertNode as a, positionNode as c, at as d, insertCluster as i, setNodeElem as l, clear2 as n, isValidShape as o, createLabel_default as r, labelHelper as s, clear as t, updateNodeBounds as u };
