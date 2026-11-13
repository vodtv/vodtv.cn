import { C as toSource, E as baseGetTag, O as root, S as getNative, b as Map, c as isArrayLike, d as isArguments, i as isTypedArray, m as overArg, p as isPrototype, s as isBuffer, u as isArray } from "./identity-BPEHP8g6.js";
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_nativeKeys.js
var nativeKeys = overArg(Object.keys, Object);
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseKeys.js
/** Used to check objects for own properties. */
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
/**
* The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names.
*/
function baseKeys(object) {
	if (!isPrototype(object)) return nativeKeys(object);
	var result = [];
	for (var key in Object(object)) if (hasOwnProperty$1.call(object, key) && key != "constructor") result.push(key);
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_DataView.js
var DataView = getNative(root, "DataView");
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_Promise.js
var Promise$1 = getNative(root, "Promise");
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_Set.js
var Set = getNative(root, "Set");
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_WeakMap.js
var WeakMap = getNative(root, "WeakMap");
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_getTag.js
/** `Object#toString` result references. */
var mapTag$1 = "[object Map]";
var objectTag = "[object Object]";
var promiseTag = "[object Promise]";
var setTag$1 = "[object Set]";
var weakMapTag = "[object WeakMap]";
var dataViewTag = "[object DataView]";
/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView);
var mapCtorString = toSource(Map);
var promiseCtorString = toSource(Promise$1);
var setCtorString = toSource(Set);
var weakMapCtorString = toSource(WeakMap);
/**
* Gets the `toStringTag` of `value`.
*
* @private
* @param {*} value The value to query.
* @returns {string} Returns the `toStringTag`.
*/
var getTag = baseGetTag;
if (DataView && getTag(new DataView(/* @__PURE__ */ new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag$1 || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set && getTag(new Set()) != setTag$1 || WeakMap && getTag(new WeakMap()) != weakMapTag) getTag = function(value) {
	var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
	if (ctorString) switch (ctorString) {
		case dataViewCtorString: return dataViewTag;
		case mapCtorString: return mapTag$1;
		case promiseCtorString: return promiseTag;
		case setCtorString: return setTag$1;
		case weakMapCtorString: return weakMapTag;
	}
	return result;
};
var _getTag_default = getTag;
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/isEmpty.js
/** `Object#toString` result references. */
var mapTag = "[object Map]";
var setTag = "[object Set]";
/** Used to check objects for own properties. */
var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
* Checks if `value` is an empty object, collection, map, or set.
*
* Objects are considered empty if they have no own enumerable string keyed
* properties.
*
* Array-like values such as `arguments` objects, arrays, buffers, strings, or
* jQuery-like collections are considered empty if they have a `length` of `0`.
* Similarly, maps and sets are considered empty if they have a `size` of `0`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is empty, else `false`.
* @example
*
* _.isEmpty(null);
* // => true
*
* _.isEmpty(true);
* // => true
*
* _.isEmpty(1);
* // => true
*
* _.isEmpty([1, 2, 3]);
* // => false
*
* _.isEmpty({ 'a': 1 });
* // => false
*/
function isEmpty(value) {
	if (value == null) return true;
	if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) return !value.length;
	var tag = _getTag_default(value);
	if (tag == mapTag || tag == setTag) return !value.size;
	if (isPrototype(value)) return !baseKeys(value).length;
	for (var key in value) if (hasOwnProperty.call(value, key)) return false;
	return true;
}
export { baseKeys as i, _getTag_default as n, Set as r, isEmpty as t };
