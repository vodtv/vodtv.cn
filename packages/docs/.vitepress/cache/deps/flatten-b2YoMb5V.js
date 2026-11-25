import { c as isArrayLike, t as identity, u as isArray } from "./identity-BPEHP8g6.js";
import { E as arrayMap, d as baseIteratee, l as baseEach, s as baseFlatten, y as isSymbol } from "./reduce-CuNrUjhP.js";
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseMap.js
/**
* The base implementation of `_.map` without support for iteratee shorthands.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array} Returns the new mapped array.
*/
function baseMap(collection, iteratee) {
	var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
	baseEach(collection, function(value, key, collection) {
		result[++index] = iteratee(value, key, collection);
	});
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/map.js
/**
* Creates an array of values by running each element in `collection` thru
* `iteratee`. The iteratee is invoked with three arguments:
* (value, index|key, collection).
*
* Many lodash methods are guarded to work as iteratees for methods like
* `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
*
* The guarded methods are:
* `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
* `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
* `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
* `template`, `trim`, `trimEnd`, `trimStart`, and `words`
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @returns {Array} Returns the new mapped array.
* @example
*
* function square(n) {
*   return n * n;
* }
*
* _.map([4, 8], square);
* // => [16, 64]
*
* _.map({ 'a': 4, 'b': 8 }, square);
* // => [16, 64] (iteration order is not guaranteed)
*
* var users = [
*   { 'user': 'barney' },
*   { 'user': 'fred' }
* ];
*
* // The `_.property` iteratee shorthand.
* _.map(users, 'user');
* // => ['barney', 'fred']
*/
function map(collection, iteratee) {
	return (isArray(collection) ? arrayMap : baseMap)(collection, baseIteratee(iteratee, 3));
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseExtremum.js
/**
* The base implementation of methods like `_.max` and `_.min` which accepts a
* `comparator` to determine the extremum value.
*
* @private
* @param {Array} array The array to iterate over.
* @param {Function} iteratee The iteratee invoked per iteration.
* @param {Function} comparator The comparator used to compare values.
* @returns {*} Returns the extremum value.
*/
function baseExtremum(array, iteratee, comparator) {
	var index = -1, length = array.length;
	while (++index < length) {
		var value = array[index], current = iteratee(value);
		if (current != null && (computed === void 0 ? current === current && !isSymbol(current) : comparator(current, computed))) var computed = current, result = value;
	}
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseLt.js
/**
* The base implementation of `_.lt` which doesn't coerce arguments.
*
* @private
* @param {*} value The value to compare.
* @param {*} other The other value to compare.
* @returns {boolean} Returns `true` if `value` is less than `other`,
*  else `false`.
*/
function baseLt(value, other) {
	return value < other;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/min.js
/**
* Computes the minimum value of `array`. If `array` is empty or falsey,
* `undefined` is returned.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Math
* @param {Array} array The array to iterate over.
* @returns {*} Returns the minimum value.
* @example
*
* _.min([4, 2, 8, 6]);
* // => 2
*
* _.min([]);
* // => undefined
*/
function min(array) {
	return array && array.length ? baseExtremum(array, identity, baseLt) : void 0;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/flatten.js
/**
* Flattens `array` a single level deep.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {Array} array The array to flatten.
* @returns {Array} Returns the new flattened array.
* @example
*
* _.flatten([1, [2, [3, [4]], 5]]);
* // => [1, 2, [3, [4]], 5]
*/
function flatten(array) {
	return (array == null ? 0 : array.length) ? baseFlatten(array, 1) : [];
}
export { map as a, baseExtremum as i, min as n, baseMap as o, baseLt as r, flatten as t };
