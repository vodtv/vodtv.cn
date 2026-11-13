Array.prototype.slice;
function array_default(x) {
	return typeof x === "object" && "length" in x ? x : Array.from(x);
}
export { array_default as t };
