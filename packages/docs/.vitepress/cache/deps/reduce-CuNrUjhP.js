import { D as Symbol, E as baseGetTag, T as isObject, _ as Stack, c as isArrayLike, d as isArguments, f as isObjectLike, g as baseFor, h as Uint8Array, i as isTypedArray, l as isLength, n as arrayLikeKeys, r as isIndex, s as isBuffer, t as identity, u as isArray, v as memoize, x as eq, y as MapCache } from "./identity-BPEHP8g6.js";
import { i as baseKeys, n as _getTag_default, r as Set } from "./isEmpty-MtiTqD5c.js";
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_arrayMap.js
/**
* A specialized version of `_.map` for arrays without support for iteratee
* shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array} Returns the new mapped array.
*/
function arrayMap(array, iteratee) {
	var index = -1, length = array == null ? 0 : array.length, result = Array(length);
	while (++index < length) result[index] = iteratee(array[index], index, array);
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_setCacheAdd.js
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = "__lodash_hash_undefined__";
/**
* Adds `value` to the array cache.
*
* @private
* @name add
* @memberOf SetCache
* @alias push
* @param {*} value The value to cache.
* @returns {Object} Returns the cache instance.
*/
function setCacheAdd(value) {
	this.__data__.set(value, HASH_UNDEFINED);
	return this;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_setCacheHas.js
/**
* Checks if `value` is in the array cache.
*
* @private
* @name has
* @memberOf SetCache
* @param {*} value The value to search for.
* @returns {boolean} Returns `true` if `value` is found, else `false`.
*/
function setCacheHas(value) {
	return this.__data__.has(value);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_SetCache.js
/**
*
* Creates an array cache object to store unique values.
*
* @private
* @constructor
* @param {Array} [values] The values to cache.
*/
function SetCache(values) {
	var index = -1, length = values == null ? 0 : values.length;
	this.__data__ = new MapCache();
	while (++index < length) this.add(values[index]);
}
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_arraySome.js
/**
* A specialized version of `_.some` for arrays without support for iteratee
* shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} predicate The function invoked per iteration.
* @returns {boolean} Returns `true` if any element passes the predicate check,
*  else `false`.
*/
function arraySome(array, predicate) {
	var index = -1, length = array == null ? 0 : array.length;
	while (++index < length) if (predicate(array[index], index, array)) return true;
	return false;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_cacheHas.js
/**
* Checks if a `cache` value for `key` exists.
*
* @private
* @param {Object} cache The cache to query.
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function cacheHas(cache, key) {
	return cache.has(key);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_equalArrays.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1;
var COMPARE_UNORDERED_FLAG$3 = 2;
/**
* A specialized version of `baseIsEqualDeep` for arrays with support for
* partial deep comparisons.
*
* @private
* @param {Array} array The array to compare.
* @param {Array} other The other array to compare.
* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
* @param {Function} customizer The function to customize comparisons.
* @param {Function} equalFunc The function to determine equivalents of values.
* @param {Object} stack Tracks traversed `array` and `other` objects.
* @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
*/
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
	var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5, arrLength = array.length, othLength = other.length;
	if (arrLength != othLength && !(isPartial && othLength > arrLength)) return false;
	var arrStacked = stack.get(array);
	var othStacked = stack.get(other);
	if (arrStacked && othStacked) return arrStacked == other && othStacked == array;
	var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : void 0;
	stack.set(array, other);
	stack.set(other, array);
	while (++index < arrLength) {
		var arrValue = array[index], othValue = other[index];
		if (customizer) var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
		if (compared !== void 0) {
			if (compared) continue;
			result = false;
			break;
		}
		if (seen) {
			if (!arraySome(other, function(othValue, othIndex) {
				if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) return seen.push(othIndex);
			})) {
				result = false;
				break;
			}
		} else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
			result = false;
			break;
		}
	}
	stack["delete"](array);
	stack["delete"](other);
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_mapToArray.js
/**
* Converts `map` to its key-value pairs.
*
* @private
* @param {Object} map The map to convert.
* @returns {Array} Returns the key-value pairs.
*/
function mapToArray(map) {
	var index = -1, result = Array(map.size);
	map.forEach(function(value, key) {
		result[++index] = [key, value];
	});
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_setToArray.js
/**
* Converts `set` to an array of its values.
*
* @private
* @param {Object} set The set to convert.
* @returns {Array} Returns the values.
*/
function setToArray(set) {
	var index = -1, result = Array(set.size);
	set.forEach(function(value) {
		result[++index] = value;
	});
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_equalByTag.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1;
var COMPARE_UNORDERED_FLAG$2 = 2;
/** `Object#toString` result references. */
var boolTag = "[object Boolean]";
var dateTag = "[object Date]";
var errorTag = "[object Error]";
var mapTag = "[object Map]";
var numberTag = "[object Number]";
var regexpTag = "[object RegExp]";
var setTag = "[object Set]";
var stringTag = "[object String]";
var symbolTag$1 = "[object Symbol]";
var arrayBufferTag = "[object ArrayBuffer]";
var dataViewTag = "[object DataView]";
/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = Symbol ? Symbol.prototype : void 0;
var symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : void 0;
/**
* A specialized version of `baseIsEqualDeep` for comparing objects of
* the same `toStringTag`.
*
* **Note:** This function only supports comparing values with tags of
* `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
*
* @private
* @param {Object} object The object to compare.
* @param {Object} other The other object to compare.
* @param {string} tag The `toStringTag` of the objects to compare.
* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
* @param {Function} customizer The function to customize comparisons.
* @param {Function} equalFunc The function to determine equivalents of values.
* @param {Object} stack Tracks traversed `object` and `other` objects.
* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
*/
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
	switch (tag) {
		case dataViewTag:
			if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) return false;
			object = object.buffer;
			other = other.buffer;
		case arrayBufferTag:
			if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) return false;
			return true;
		case boolTag:
		case dateTag:
		case numberTag: return eq(+object, +other);
		case errorTag: return object.name == other.name && object.message == other.message;
		case regexpTag:
		case stringTag: return object == other + "";
		case mapTag: var convert = mapToArray;
		case setTag:
			var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
			convert || (convert = setToArray);
			if (object.size != other.size && !isPartial) return false;
			var stacked = stack.get(object);
			if (stacked) return stacked == other;
			bitmask |= COMPARE_UNORDERED_FLAG$2;
			stack.set(object, other);
			var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
			stack["delete"](object);
			return result;
		case symbolTag$1: if (symbolValueOf) return symbolValueOf.call(object) == symbolValueOf.call(other);
	}
	return false;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_arrayPush.js
/**
* Appends the elements of `values` to `array`.
*
* @private
* @param {Array} array The array to modify.
* @param {Array} values The values to append.
* @returns {Array} Returns `array`.
*/
function arrayPush(array, values) {
	var index = -1, length = values.length, offset = array.length;
	while (++index < length) array[offset + index] = values[index];
	return array;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseGetAllKeys.js
/**
* The base implementation of `getAllKeys` and `getAllKeysIn` which uses
* `keysFunc` and `symbolsFunc` to get the enumerable property names and
* symbols of `object`.
*
* @private
* @param {Object} object The object to query.
* @param {Function} keysFunc The function to get the keys of `object`.
* @param {Function} symbolsFunc The function to get the symbols of `object`.
* @returns {Array} Returns the array of property names and symbols.
*/
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
	var result = keysFunc(object);
	return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_arrayFilter.js
/**
* A specialized version of `_.filter` for arrays without support for
* iteratee shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} predicate The function invoked per iteration.
* @returns {Array} Returns the new filtered array.
*/
function arrayFilter(array, predicate) {
	var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
	while (++index < length) {
		var value = array[index];
		if (predicate(value, index, array)) result[resIndex++] = value;
	}
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/stubArray.js
/**
* This method returns a new empty array.
*
* @static
* @memberOf _
* @since 4.13.0
* @category Util
* @returns {Array} Returns the new empty array.
* @example
*
* var arrays = _.times(2, _.stubArray);
*
* console.log(arrays);
* // => [[], []]
*
* console.log(arrays[0] === arrays[1]);
* // => false
*/
function stubArray() {
	return [];
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_getSymbols.js
/** Built-in value references. */
var propertyIsEnumerable = Object.prototype.propertyIsEnumerable;
var nativeGetSymbols = Object.getOwnPropertySymbols;
/**
* Creates an array of the own enumerable symbols of `object`.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of symbols.
*/
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
	if (object == null) return [];
	object = Object(object);
	return arrayFilter(nativeGetSymbols(object), function(symbol) {
		return propertyIsEnumerable.call(object, symbol);
	});
};
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/keys.js
/**
* Creates an array of the own enumerable property names of `object`.
*
* **Note:** Non-object values are coerced to objects. See the
* [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
* for more details.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Object
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names.
* @example
*
* function Foo() {
*   this.a = 1;
*   this.b = 2;
* }
*
* Foo.prototype.c = 3;
*
* _.keys(new Foo);
* // => ['a', 'b'] (iteration order is not guaranteed)
*
* _.keys('hi');
* // => ['0', '1']
*/
function keys(object) {
	return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_getAllKeys.js
/**
* Creates an array of own enumerable property names and symbols of `object`.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names and symbols.
*/
function getAllKeys(object) {
	return baseGetAllKeys(object, keys, getSymbols);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_equalObjects.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;
/** Used to check objects for own properties. */
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
/**
* A specialized version of `baseIsEqualDeep` for objects with support for
* partial deep comparisons.
*
* @private
* @param {Object} object The object to compare.
* @param {Object} other The other object to compare.
* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
* @param {Function} customizer The function to customize comparisons.
* @param {Function} equalFunc The function to determine equivalents of values.
* @param {Object} stack Tracks traversed `object` and `other` objects.
* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
*/
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
	var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, objProps = getAllKeys(object), objLength = objProps.length;
	if (objLength != getAllKeys(other).length && !isPartial) return false;
	var index = objLength;
	while (index--) {
		var key = objProps[index];
		if (!(isPartial ? key in other : hasOwnProperty$1.call(other, key))) return false;
	}
	var objStacked = stack.get(object);
	var othStacked = stack.get(other);
	if (objStacked && othStacked) return objStacked == other && othStacked == object;
	var result = true;
	stack.set(object, other);
	stack.set(other, object);
	var skipCtor = isPartial;
	while (++index < objLength) {
		key = objProps[index];
		var objValue = object[key], othValue = other[key];
		if (customizer) var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
		if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
			result = false;
			break;
		}
		skipCtor || (skipCtor = key == "constructor");
	}
	if (result && !skipCtor) {
		var objCtor = object.constructor, othCtor = other.constructor;
		if (objCtor != othCtor && "constructor" in object && "constructor" in other && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) result = false;
	}
	stack["delete"](object);
	stack["delete"](other);
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseIsEqualDeep.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;
/** `Object#toString` result references. */
var argsTag = "[object Arguments]";
var arrayTag = "[object Array]";
var objectTag = "[object Object]";
/** Used to check objects for own properties. */
var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
* A specialized version of `baseIsEqual` for arrays and objects which performs
* deep comparisons and tracks traversed objects enabling objects with circular
* references to be compared.
*
* @private
* @param {Object} object The object to compare.
* @param {Object} other The other object to compare.
* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
* @param {Function} customizer The function to customize comparisons.
* @param {Function} equalFunc The function to determine equivalents of values.
* @param {Object} [stack] Tracks traversed `object` and `other` objects.
* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
*/
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
	var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : _getTag_default(object), othTag = othIsArr ? arrayTag : _getTag_default(other);
	objTag = objTag == argsTag ? objectTag : objTag;
	othTag = othTag == argsTag ? objectTag : othTag;
	var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
	if (isSameTag && isBuffer(object)) {
		if (!isBuffer(other)) return false;
		objIsArr = true;
		objIsObj = false;
	}
	if (isSameTag && !objIsObj) {
		stack || (stack = new Stack());
		return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
	}
	if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
		var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
		if (objIsWrapped || othIsWrapped) {
			var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
			stack || (stack = new Stack());
			return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
		}
	}
	if (!isSameTag) return false;
	stack || (stack = new Stack());
	return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseIsEqual.js
/**
* The base implementation of `_.isEqual` which supports partial comparisons
* and tracks traversed objects.
*
* @private
* @param {*} value The value to compare.
* @param {*} other The other value to compare.
* @param {boolean} bitmask The bitmask flags.
*  1 - Unordered comparison
*  2 - Partial comparison
* @param {Function} [customizer] The function to customize comparisons.
* @param {Object} [stack] Tracks traversed `value` and `other` objects.
* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
*/
function baseIsEqual(value, other, bitmask, customizer, stack) {
	if (value === other) return true;
	if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) return value !== value && other !== other;
	return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseIsMatch.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1;
var COMPARE_UNORDERED_FLAG$1 = 2;
/**
* The base implementation of `_.isMatch` without support for iteratee shorthands.
*
* @private
* @param {Object} object The object to inspect.
* @param {Object} source The object of property values to match.
* @param {Array} matchData The property names, values, and compare flags to match.
* @param {Function} [customizer] The function to customize comparisons.
* @returns {boolean} Returns `true` if `object` is a match, else `false`.
*/
function baseIsMatch(object, source, matchData, customizer) {
	var index = matchData.length, length = index, noCustomizer = !customizer;
	if (object == null) return !length;
	object = Object(object);
	while (index--) {
		var data = matchData[index];
		if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) return false;
	}
	while (++index < length) {
		data = matchData[index];
		var key = data[0], objValue = object[key], srcValue = data[1];
		if (noCustomizer && data[2]) {
			if (objValue === void 0 && !(key in object)) return false;
		} else {
			var stack = new Stack();
			if (customizer) var result = customizer(objValue, srcValue, key, object, source, stack);
			if (!(result === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack) : result)) return false;
		}
	}
	return true;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_isStrictComparable.js
/**
* Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` if suitable for strict
*  equality comparisons, else `false`.
*/
function isStrictComparable(value) {
	return value === value && !isObject(value);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_getMatchData.js
/**
* Gets the property names, values, and compare flags of `object`.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the match data of `object`.
*/
function getMatchData(object) {
	var result = keys(object), length = result.length;
	while (length--) {
		var key = result[length], value = object[key];
		result[length] = [
			key,
			value,
			isStrictComparable(value)
		];
	}
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_matchesStrictComparable.js
/**
* A specialized version of `matchesProperty` for source values suitable
* for strict equality comparisons, i.e. `===`.
*
* @private
* @param {string} key The key of the property to get.
* @param {*} srcValue The value to match.
* @returns {Function} Returns the new spec function.
*/
function matchesStrictComparable(key, srcValue) {
	return function(object) {
		if (object == null) return false;
		return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
	};
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseMatches.js
/**
* The base implementation of `_.matches` which doesn't clone `source`.
*
* @private
* @param {Object} source The object of property values to match.
* @returns {Function} Returns the new spec function.
*/
function baseMatches(source) {
	var matchData = getMatchData(source);
	if (matchData.length == 1 && matchData[0][2]) return matchesStrictComparable(matchData[0][0], matchData[0][1]);
	return function(object) {
		return object === source || baseIsMatch(object, source, matchData);
	};
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/isSymbol.js
/** `Object#toString` result references. */
var symbolTag = "[object Symbol]";
/**
* Checks if `value` is classified as a `Symbol` primitive or object.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
* @example
*
* _.isSymbol(Symbol.iterator);
* // => true
*
* _.isSymbol('abc');
* // => false
*/
function isSymbol(value) {
	return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_isKey.js
/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;
/**
* Checks if `value` is a property name and not a property path.
*
* @private
* @param {*} value The value to check.
* @param {Object} [object] The object to query keys on.
* @returns {boolean} Returns `true` if `value` is a property name, else `false`.
*/
function isKey(value, object) {
	if (isArray(value)) return false;
	var type = typeof value;
	if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) return true;
	return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_memoizeCapped.js
/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;
/**
* A specialized version of `_.memoize` which clears the memoized function's
* cache when it exceeds `MAX_MEMOIZE_SIZE`.
*
* @private
* @param {Function} func The function to have its output memoized.
* @returns {Function} Returns the new memoized function.
*/
function memoizeCapped(func) {
	var result = memoize(func, function(key) {
		if (cache.size === MAX_MEMOIZE_SIZE) cache.clear();
		return key;
	});
	var cache = result.cache;
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_stringToPath.js
/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;
/**
* Converts `string` to a property path array.
*
* @private
* @param {string} string The string to convert.
* @returns {Array} Returns the property path array.
*/
var stringToPath = memoizeCapped(function(string) {
	var result = [];
	if (string.charCodeAt(0) === 46) result.push("");
	string.replace(rePropName, function(match, number, quote, subString) {
		result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
	});
	return result;
});
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseToString.js
/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;
/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : void 0;
var symbolToString = symbolProto ? symbolProto.toString : void 0;
/**
* The base implementation of `_.toString` which doesn't convert nullish
* values to empty strings.
*
* @private
* @param {*} value The value to process.
* @returns {string} Returns the string.
*/
function baseToString(value) {
	if (typeof value == "string") return value;
	if (isArray(value)) return arrayMap(value, baseToString) + "";
	if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : "";
	var result = value + "";
	return result == "0" && 1 / value == -INFINITY$1 ? "-0" : result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/toString.js
/**
* Converts `value` to a string. An empty string is returned for `null`
* and `undefined` values. The sign of `-0` is preserved.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to convert.
* @returns {string} Returns the converted string.
* @example
*
* _.toString(null);
* // => ''
*
* _.toString(-0);
* // => '-0'
*
* _.toString([1, 2, 3]);
* // => '1,2,3'
*/
function toString(value) {
	return value == null ? "" : baseToString(value);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_castPath.js
/**
* Casts `value` to a path array if it's not one.
*
* @private
* @param {*} value The value to inspect.
* @param {Object} [object] The object to query keys on.
* @returns {Array} Returns the cast property path array.
*/
function castPath(value, object) {
	if (isArray(value)) return value;
	return isKey(value, object) ? [value] : stringToPath(toString(value));
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_toKey.js
/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;
/**
* Converts `value` to a string key if it's not a string or symbol.
*
* @private
* @param {*} value The value to inspect.
* @returns {string|symbol} Returns the key.
*/
function toKey(value) {
	if (typeof value == "string" || isSymbol(value)) return value;
	var result = value + "";
	return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseGet.js
/**
* The base implementation of `_.get` without support for default values.
*
* @private
* @param {Object} object The object to query.
* @param {Array|string} path The path of the property to get.
* @returns {*} Returns the resolved value.
*/
function baseGet(object, path) {
	path = castPath(path, object);
	var index = 0, length = path.length;
	while (object != null && index < length) object = object[toKey(path[index++])];
	return index && index == length ? object : void 0;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/get.js
/**
* Gets the value at `path` of `object`. If the resolved value is
* `undefined`, the `defaultValue` is returned in its place.
*
* @static
* @memberOf _
* @since 3.7.0
* @category Object
* @param {Object} object The object to query.
* @param {Array|string} path The path of the property to get.
* @param {*} [defaultValue] The value returned for `undefined` resolved values.
* @returns {*} Returns the resolved value.
* @example
*
* var object = { 'a': [{ 'b': { 'c': 3 } }] };
*
* _.get(object, 'a[0].b.c');
* // => 3
*
* _.get(object, ['a', '0', 'b', 'c']);
* // => 3
*
* _.get(object, 'a.b.c', 'default');
* // => 'default'
*/
function get(object, path, defaultValue) {
	var result = object == null ? void 0 : baseGet(object, path);
	return result === void 0 ? defaultValue : result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseHasIn.js
/**
* The base implementation of `_.hasIn` without support for deep paths.
*
* @private
* @param {Object} [object] The object to query.
* @param {Array|string} key The key to check.
* @returns {boolean} Returns `true` if `key` exists, else `false`.
*/
function baseHasIn(object, key) {
	return object != null && key in Object(object);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_hasPath.js
/**
* Checks if `path` exists on `object`.
*
* @private
* @param {Object} object The object to query.
* @param {Array|string} path The path to check.
* @param {Function} hasFunc The function to check properties.
* @returns {boolean} Returns `true` if `path` exists, else `false`.
*/
function hasPath(object, path, hasFunc) {
	path = castPath(path, object);
	var index = -1, length = path.length, result = false;
	while (++index < length) {
		var key = toKey(path[index]);
		if (!(result = object != null && hasFunc(object, key))) break;
		object = object[key];
	}
	if (result || ++index != length) return result;
	length = object == null ? 0 : object.length;
	return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/hasIn.js
/**
* Checks if `path` is a direct or inherited property of `object`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Object
* @param {Object} object The object to query.
* @param {Array|string} path The path to check.
* @returns {boolean} Returns `true` if `path` exists, else `false`.
* @example
*
* var object = _.create({ 'a': _.create({ 'b': 2 }) });
*
* _.hasIn(object, 'a');
* // => true
*
* _.hasIn(object, 'a.b');
* // => true
*
* _.hasIn(object, ['a', 'b']);
* // => true
*
* _.hasIn(object, 'b');
* // => false
*/
function hasIn(object, path) {
	return object != null && hasPath(object, path, baseHasIn);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseMatchesProperty.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;
var COMPARE_UNORDERED_FLAG = 2;
/**
* The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
*
* @private
* @param {string} path The path of the property to get.
* @param {*} srcValue The value to match.
* @returns {Function} Returns the new spec function.
*/
function baseMatchesProperty(path, srcValue) {
	if (isKey(path) && isStrictComparable(srcValue)) return matchesStrictComparable(toKey(path), srcValue);
	return function(object) {
		var objValue = get(object, path);
		return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
	};
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseProperty.js
/**
* The base implementation of `_.property` without support for deep paths.
*
* @private
* @param {string} key The key of the property to get.
* @returns {Function} Returns the new accessor function.
*/
function baseProperty(key) {
	return function(object) {
		return object == null ? void 0 : object[key];
	};
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_basePropertyDeep.js
/**
* A specialized version of `baseProperty` which supports deep paths.
*
* @private
* @param {Array|string} path The path of the property to get.
* @returns {Function} Returns the new accessor function.
*/
function basePropertyDeep(path) {
	return function(object) {
		return baseGet(object, path);
	};
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/property.js
/**
* Creates a function that returns the value at `path` of a given object.
*
* @static
* @memberOf _
* @since 2.4.0
* @category Util
* @param {Array|string} path The path of the property to get.
* @returns {Function} Returns the new accessor function.
* @example
*
* var objects = [
*   { 'a': { 'b': 2 } },
*   { 'a': { 'b': 1 } }
* ];
*
* _.map(objects, _.property('a.b'));
* // => [2, 1]
*
* _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
* // => [1, 2]
*/
function property(path) {
	return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseIteratee.js
/**
* The base implementation of `_.iteratee`.
*
* @private
* @param {*} [value=_.identity] The value to convert to an iteratee.
* @returns {Function} Returns the iteratee.
*/
function baseIteratee(value) {
	if (typeof value == "function") return value;
	if (value == null) return identity;
	if (typeof value == "object") return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
	return property(value);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseForOwn.js
/**
* The base implementation of `_.forOwn` without support for iteratee shorthands.
*
* @private
* @param {Object} object The object to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Object} Returns `object`.
*/
function baseForOwn(object, iteratee) {
	return object && baseFor(object, iteratee, keys);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_createBaseEach.js
/**
* Creates a `baseEach` or `baseEachRight` function.
*
* @private
* @param {Function} eachFunc The function to iterate over a collection.
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {Function} Returns the new base function.
*/
function createBaseEach(eachFunc, fromRight) {
	return function(collection, iteratee) {
		if (collection == null) return collection;
		if (!isArrayLike(collection)) return eachFunc(collection, iteratee);
		var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
		while (fromRight ? index-- : ++index < length) if (iteratee(iterable[index], index, iterable) === false) break;
		return collection;
	};
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseEach.js
/**
* The base implementation of `_.forEach` without support for iteratee shorthands.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array|Object} Returns `collection`.
*/
var baseEach = createBaseEach(baseForOwn);
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseFilter.js
/**
* The base implementation of `_.filter` without support for iteratee shorthands.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} predicate The function invoked per iteration.
* @returns {Array} Returns the new filtered array.
*/
function baseFilter(collection, predicate) {
	var result = [];
	baseEach(collection, function(value, index, collection) {
		if (predicate(value, index, collection)) result.push(value);
	});
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/filter.js
/**
* Iterates over elements of `collection`, returning an array of all elements
* `predicate` returns truthy for. The predicate is invoked with three
* arguments: (value, index|key, collection).
*
* **Note:** Unlike `_.remove`, this method returns a new array.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @returns {Array} Returns the new filtered array.
* @see _.reject
* @example
*
* var users = [
*   { 'user': 'barney', 'age': 36, 'active': true },
*   { 'user': 'fred',   'age': 40, 'active': false }
* ];
*
* _.filter(users, function(o) { return !o.active; });
* // => objects for ['fred']
*
* // The `_.matches` iteratee shorthand.
* _.filter(users, { 'age': 36, 'active': true });
* // => objects for ['barney']
*
* // The `_.matchesProperty` iteratee shorthand.
* _.filter(users, ['active', false]);
* // => objects for ['fred']
*
* // The `_.property` iteratee shorthand.
* _.filter(users, 'active');
* // => objects for ['barney']
*
* // Combining several predicates using `_.overEvery` or `_.overSome`.
* _.filter(users, _.overSome([{ 'age': 36 }, ['age', 40]]));
* // => objects for ['fred', 'barney']
*/
function filter(collection, predicate) {
	return (isArray(collection) ? arrayFilter : baseFilter)(collection, baseIteratee(predicate, 3));
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_isFlattenable.js
/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : void 0;
/**
* Checks if `value` is a flattenable `arguments` object or array.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
*/
function isFlattenable(value) {
	return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseFlatten.js
/**
* The base implementation of `_.flatten` with support for restricting flattening.
*
* @private
* @param {Array} array The array to flatten.
* @param {number} depth The maximum recursion depth.
* @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
* @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
* @param {Array} [result=[]] The initial result value.
* @returns {Array} Returns the new flattened array.
*/
function baseFlatten(array, depth, predicate, isStrict, result) {
	var index = -1, length = array.length;
	predicate || (predicate = isFlattenable);
	result || (result = []);
	while (++index < length) {
		var value = array[index];
		if (depth > 0 && predicate(value)) {
			if (depth > 1) baseFlatten(value, depth - 1, predicate, isStrict, result);
			else arrayPush(result, value);
		} else if (!isStrict) result[result.length] = value;
	}
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseFindIndex.js
/**
* The base implementation of `_.findIndex` and `_.findLastIndex` without
* support for iteratee shorthands.
*
* @private
* @param {Array} array The array to inspect.
* @param {Function} predicate The function invoked per iteration.
* @param {number} fromIndex The index to search from.
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function baseFindIndex(array, predicate, fromIndex, fromRight) {
	var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
	while (fromRight ? index-- : ++index < length) if (predicate(array[index], index, array)) return index;
	return -1;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseIsNaN.js
/**
* The base implementation of `_.isNaN` without support for number objects.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
*/
function baseIsNaN(value) {
	return value !== value;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_strictIndexOf.js
/**
* A specialized version of `_.indexOf` which performs strict equality
* comparisons of values, i.e. `===`.
*
* @private
* @param {Array} array The array to inspect.
* @param {*} value The value to search for.
* @param {number} fromIndex The index to search from.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function strictIndexOf(array, value, fromIndex) {
	var index = fromIndex - 1, length = array.length;
	while (++index < length) if (array[index] === value) return index;
	return -1;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseIndexOf.js
/**
* The base implementation of `_.indexOf` without `fromIndex` bounds checks.
*
* @private
* @param {Array} array The array to inspect.
* @param {*} value The value to search for.
* @param {number} fromIndex The index to search from.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function baseIndexOf(array, value, fromIndex) {
	return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_arrayIncludes.js
/**
* A specialized version of `_.includes` for arrays without support for
* specifying an index to search from.
*
* @private
* @param {Array} [array] The array to inspect.
* @param {*} target The value to search for.
* @returns {boolean} Returns `true` if `target` is found, else `false`.
*/
function arrayIncludes(array, value) {
	return !!(array == null ? 0 : array.length) && baseIndexOf(array, value, 0) > -1;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_arrayIncludesWith.js
/**
* This function is like `arrayIncludes` except that it accepts a comparator.
*
* @private
* @param {Array} [array] The array to inspect.
* @param {*} target The value to search for.
* @param {Function} comparator The comparator invoked per element.
* @returns {boolean} Returns `true` if `target` is found, else `false`.
*/
function arrayIncludesWith(array, value, comparator) {
	var index = -1, length = array == null ? 0 : array.length;
	while (++index < length) if (comparator(value, array[index])) return true;
	return false;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/noop.js
/**
* This method returns `undefined`.
*
* @static
* @memberOf _
* @since 2.3.0
* @category Util
* @example
*
* _.times(2, _.noop);
* // => [undefined, undefined]
*/
function noop() {}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_createSet.js
/**
* Creates a set object of `values`.
*
* @private
* @param {Array} values The values to add to the set.
* @returns {Object} Returns the new set.
*/
var createSet = !(Set && 1 / setToArray(new Set([, -0]))[1] == 1 / 0) ? noop : function(values) {
	return new Set(values);
};
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseUniq.js
/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;
/**
* The base implementation of `_.uniqBy` without support for iteratee shorthands.
*
* @private
* @param {Array} array The array to inspect.
* @param {Function} [iteratee] The iteratee invoked per element.
* @param {Function} [comparator] The comparator invoked per element.
* @returns {Array} Returns the new duplicate free array.
*/
function baseUniq(array, iteratee, comparator) {
	var index = -1, includes = arrayIncludes, length = array.length, isCommon = true, result = [], seen = result;
	if (comparator) {
		isCommon = false;
		includes = arrayIncludesWith;
	} else if (length >= LARGE_ARRAY_SIZE) {
		var set = iteratee ? null : createSet(array);
		if (set) return setToArray(set);
		isCommon = false;
		includes = cacheHas;
		seen = new SetCache();
	} else seen = iteratee ? [] : result;
	outer: while (++index < length) {
		var value = array[index], computed = iteratee ? iteratee(value) : value;
		value = comparator || value !== 0 ? value : 0;
		if (isCommon && computed === computed) {
			var seenIndex = seen.length;
			while (seenIndex--) if (seen[seenIndex] === computed) continue outer;
			if (iteratee) seen.push(computed);
			result.push(value);
		} else if (!includes(seen, computed, comparator)) {
			if (seen !== result) seen.push(computed);
			result.push(value);
		}
	}
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_arrayEach.js
/**
* A specialized version of `_.forEach` for arrays without support for
* iteratee shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array} Returns `array`.
*/
function arrayEach(array, iteratee) {
	var index = -1, length = array == null ? 0 : array.length;
	while (++index < length) if (iteratee(array[index], index, array) === false) break;
	return array;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_castFunction.js
/**
* Casts `value` to `identity` if it's not a function.
*
* @private
* @param {*} value The value to inspect.
* @returns {Function} Returns cast function.
*/
function castFunction(value) {
	return typeof value == "function" ? value : identity;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/forEach.js
/**
* Iterates over elements of `collection` and invokes `iteratee` for each element.
* The iteratee is invoked with three arguments: (value, index|key, collection).
* Iteratee functions may exit iteration early by explicitly returning `false`.
*
* **Note:** As with other "Collections" methods, objects with a "length"
* property are iterated like arrays. To avoid this behavior use `_.forIn`
* or `_.forOwn` for object iteration.
*
* @static
* @memberOf _
* @since 0.1.0
* @alias each
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @returns {Array|Object} Returns `collection`.
* @see _.forEachRight
* @example
*
* _.forEach([1, 2], function(value) {
*   console.log(value);
* });
* // => Logs `1` then `2`.
*
* _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
*   console.log(key);
* });
* // => Logs 'a' then 'b' (iteration order is not guaranteed).
*/
function forEach(collection, iteratee) {
	return (isArray(collection) ? arrayEach : baseEach)(collection, castFunction(iteratee));
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_arrayReduce.js
/**
* A specialized version of `_.reduce` for arrays without support for
* iteratee shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @param {*} [accumulator] The initial value.
* @param {boolean} [initAccum] Specify using the first element of `array` as
*  the initial value.
* @returns {*} Returns the accumulated value.
*/
function arrayReduce(array, iteratee, accumulator, initAccum) {
	var index = -1, length = array == null ? 0 : array.length;
	if (initAccum && length) accumulator = array[++index];
	while (++index < length) accumulator = iteratee(accumulator, array[index], index, array);
	return accumulator;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseReduce.js
/**
* The base implementation of `_.reduce` and `_.reduceRight`, without support
* for iteratee shorthands, which iterates over `collection` using `eachFunc`.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @param {*} accumulator The initial value.
* @param {boolean} initAccum Specify using the first or last element of
*  `collection` as the initial value.
* @param {Function} eachFunc The function to iterate over `collection`.
* @returns {*} Returns the accumulated value.
*/
function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
	eachFunc(collection, function(value, index, collection) {
		accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection);
	});
	return accumulator;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/reduce.js
/**
* Reduces `collection` to a value which is the accumulated result of running
* each element in `collection` thru `iteratee`, where each successive
* invocation is supplied the return value of the previous. If `accumulator`
* is not given, the first element of `collection` is used as the initial
* value. The iteratee is invoked with four arguments:
* (accumulator, value, index|key, collection).
*
* Many lodash methods are guarded to work as iteratees for methods like
* `_.reduce`, `_.reduceRight`, and `_.transform`.
*
* The guarded methods are:
* `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
* and `sortBy`
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @param {*} [accumulator] The initial value.
* @returns {*} Returns the accumulated value.
* @see _.reduceRight
* @example
*
* _.reduce([1, 2], function(sum, n) {
*   return sum + n;
* }, 0);
* // => 3
*
* _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
*   (result[value] || (result[value] = [])).push(key);
*   return result;
* }, {});
* // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
*/
function reduce(collection, iteratee, accumulator) {
	var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
	return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
}
export { stubArray as C, arrayMap as E, getSymbols as S, arrayPush as T, castPath as _, baseUniq as a, getAllKeys as b, filter as c, baseIteratee as d, baseProperty as f, toKey as g, baseGet as h, arrayEach as i, baseEach as l, hasPath as m, forEach as n, baseFindIndex as o, hasIn as p, castFunction as r, baseFlatten as s, reduce as t, baseForOwn as u, toString as v, baseGetAllKeys as w, keys as x, isSymbol as y };
