// ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/math.js
var abs = Math.abs;
var atan2 = Math.atan2;
var cos = Math.cos;
var max = Math.max;
var min = Math.min;
var sin = Math.sin;
var sqrt = Math.sqrt;
var epsilon = 1e-12;
var pi = Math.PI;
var halfPi = pi / 2;
var tau = 2 * pi;
function acos(x) {
	return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
}
function asin(x) {
	return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
}
export { cos as a, max as c, sin as d, sqrt as f, atan2 as i, min as l, acos as n, epsilon as o, tau as p, asin as r, halfPi as s, abs as t, pi as u };
