import { A as cloneTypedArray, C as keysIn, D as initCloneObject, E as isArrayLikeObject, M as cloneBuffer, O as getPrototype, T as assignValue, j as cloneArrayBuffer, k as copyArray, w as copyObject, x as constant, y as baseRest } from "./chunk-S3R3BYOJ-cEvSc8CE.js";
import { D as Symbol, T as isObject, _ as Stack, a as nodeUtil, f as isObjectLike, o as baseUnary, s as isBuffer, u as isArray, w as isFunction } from "./identity-BPEHP8g6.js";
import { n as _getTag_default, t as isEmpty } from "./isEmpty-MtiTqD5c.js";
import { C as stubArray, E as arrayMap, S as getSymbols, T as arrayPush, a as baseUniq, b as getAllKeys, c as filter, i as arrayEach, n as forEach, s as baseFlatten, t as reduce, w as baseGetAllKeys, x as keys } from "./reduce-CuNrUjhP.js";
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseAssign.js
/**
* The base implementation of `_.assign` without support for multiple sources
* or `customizer` functions.
*
* @private
* @param {Object} object The destination object.
* @param {Object} source The source object.
* @returns {Object} Returns `object`.
*/
function baseAssign(object, source) {
	return object && copyObject(source, keys(source), object);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseAssignIn.js
/**
* The base implementation of `_.assignIn` without support for multiple sources
* or `customizer` functions.
*
* @private
* @param {Object} object The destination object.
* @param {Object} source The source object.
* @returns {Object} Returns `object`.
*/
function baseAssignIn(object, source) {
	return object && copyObject(source, keysIn(source), object);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_copySymbols.js
/**
* Copies own symbols of `source` to `object`.
*
* @private
* @param {Object} source The object to copy symbols from.
* @param {Object} [object={}] The object to copy symbols to.
* @returns {Object} Returns `object`.
*/
function copySymbols(source, object) {
	return copyObject(source, getSymbols(source), object);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_getSymbolsIn.js
/**
* Creates an array of the own and inherited enumerable symbols of `object`.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of symbols.
*/
var getSymbolsIn = !Object.getOwnPropertySymbols ? stubArray : function(object) {
	var result = [];
	while (object) {
		arrayPush(result, getSymbols(object));
		object = getPrototype(object);
	}
	return result;
};
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_copySymbolsIn.js
/**
* Copies own and inherited symbols of `source` to `object`.
*
* @private
* @param {Object} source The object to copy symbols from.
* @param {Object} [object={}] The object to copy symbols to.
* @returns {Object} Returns `object`.
*/
function copySymbolsIn(source, object) {
	return copyObject(source, getSymbolsIn(source), object);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_getAllKeysIn.js
/**
* Creates an array of own and inherited enumerable property names and
* symbols of `object`.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names and symbols.
*/
function getAllKeysIn(object) {
	return baseGetAllKeys(object, keysIn, getSymbolsIn);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_initCloneArray.js
/** Used to check objects for own properties. */
var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
* Initializes an array clone.
*
* @private
* @param {Array} array The array to clone.
* @returns {Array} Returns the initialized clone.
*/
function initCloneArray(array) {
	var length = array.length, result = new array.constructor(length);
	if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
		result.index = array.index;
		result.input = array.input;
	}
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_cloneDataView.js
/**
* Creates a clone of `dataView`.
*
* @private
* @param {Object} dataView The data view to clone.
* @param {boolean} [isDeep] Specify a deep clone.
* @returns {Object} Returns the cloned data view.
*/
function cloneDataView(dataView, isDeep) {
	var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
	return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_cloneRegExp.js
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;
/**
* Creates a clone of `regexp`.
*
* @private
* @param {Object} regexp The regexp to clone.
* @returns {Object} Returns the cloned regexp.
*/
function cloneRegExp(regexp) {
	var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
	result.lastIndex = regexp.lastIndex;
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_cloneSymbol.js
/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : void 0;
var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
/**
* Creates a clone of the `symbol` object.
*
* @private
* @param {Object} symbol The symbol object to clone.
* @returns {Object} Returns the cloned symbol object.
*/
function cloneSymbol(symbol) {
	return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_initCloneByTag.js
/** `Object#toString` result references. */
var boolTag$1 = "[object Boolean]";
var dateTag$1 = "[object Date]";
var mapTag$2 = "[object Map]";
var numberTag$1 = "[object Number]";
var regexpTag$1 = "[object RegExp]";
var setTag$2 = "[object Set]";
var stringTag$1 = "[object String]";
var symbolTag$1 = "[object Symbol]";
var arrayBufferTag$1 = "[object ArrayBuffer]";
var dataViewTag$1 = "[object DataView]";
var float32Tag$1 = "[object Float32Array]";
var float64Tag$1 = "[object Float64Array]";
var int8Tag$1 = "[object Int8Array]";
var int16Tag$1 = "[object Int16Array]";
var int32Tag$1 = "[object Int32Array]";
var uint8Tag$1 = "[object Uint8Array]";
var uint8ClampedTag$1 = "[object Uint8ClampedArray]";
var uint16Tag$1 = "[object Uint16Array]";
var uint32Tag$1 = "[object Uint32Array]";
/**
* Initializes an object clone based on its `toStringTag`.
*
* **Note:** This function only supports cloning values with tags of
* `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
*
* @private
* @param {Object} object The object to clone.
* @param {string} tag The `toStringTag` of the object to clone.
* @param {boolean} [isDeep] Specify a deep clone.
* @returns {Object} Returns the initialized clone.
*/
function initCloneByTag(object, tag, isDeep) {
	var Ctor = object.constructor;
	switch (tag) {
		case arrayBufferTag$1: return cloneArrayBuffer(object);
		case boolTag$1:
		case dateTag$1: return new Ctor(+object);
		case dataViewTag$1: return cloneDataView(object, isDeep);
		case float32Tag$1:
		case float64Tag$1:
		case int8Tag$1:
		case int16Tag$1:
		case int32Tag$1:
		case uint8Tag$1:
		case uint8ClampedTag$1:
		case uint16Tag$1:
		case uint32Tag$1: return cloneTypedArray(object, isDeep);
		case mapTag$2: return new Ctor();
		case numberTag$1:
		case stringTag$1: return new Ctor(object);
		case regexpTag$1: return cloneRegExp(object);
		case setTag$2: return new Ctor();
		case symbolTag$1: return cloneSymbol(object);
	}
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseIsMap.js
/** `Object#toString` result references. */
var mapTag$1 = "[object Map]";
/**
* The base implementation of `_.isMap` without Node.js optimizations.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a map, else `false`.
*/
function baseIsMap(value) {
	return isObjectLike(value) && _getTag_default(value) == mapTag$1;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/isMap.js
var nodeIsMap = nodeUtil && nodeUtil.isMap;
/**
* Checks if `value` is classified as a `Map` object.
*
* @static
* @memberOf _
* @since 4.3.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a map, else `false`.
* @example
*
* _.isMap(new Map);
* // => true
*
* _.isMap(new WeakMap);
* // => false
*/
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseIsSet.js
/** `Object#toString` result references. */
var setTag$1 = "[object Set]";
/**
* The base implementation of `_.isSet` without Node.js optimizations.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a set, else `false`.
*/
function baseIsSet(value) {
	return isObjectLike(value) && _getTag_default(value) == setTag$1;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/isSet.js
var nodeIsSet = nodeUtil && nodeUtil.isSet;
/**
* Checks if `value` is classified as a `Set` object.
*
* @static
* @memberOf _
* @since 4.3.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a set, else `false`.
* @example
*
* _.isSet(new Set);
* // => true
*
* _.isSet(new WeakSet);
* // => false
*/
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseClone.js
/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;
var CLONE_FLAT_FLAG = 2;
var CLONE_SYMBOLS_FLAG = 4;
/** `Object#toString` result references. */
var argsTag = "[object Arguments]";
var arrayTag = "[object Array]";
var boolTag = "[object Boolean]";
var dateTag = "[object Date]";
var errorTag = "[object Error]";
var funcTag = "[object Function]";
var genTag = "[object GeneratorFunction]";
var mapTag = "[object Map]";
var numberTag = "[object Number]";
var objectTag = "[object Object]";
var regexpTag = "[object RegExp]";
var setTag = "[object Set]";
var stringTag = "[object String]";
var symbolTag = "[object Symbol]";
var weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]";
var dataViewTag = "[object DataView]";
var float32Tag = "[object Float32Array]";
var float64Tag = "[object Float64Array]";
var int8Tag = "[object Int8Array]";
var int16Tag = "[object Int16Array]";
var int32Tag = "[object Int32Array]";
var uint8Tag = "[object Uint8Array]";
var uint8ClampedTag = "[object Uint8ClampedArray]";
var uint16Tag = "[object Uint16Array]";
var uint32Tag = "[object Uint32Array]";
/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
/**
* The base implementation of `_.clone` and `_.cloneDeep` which tracks
* traversed objects.
*
* @private
* @param {*} value The value to clone.
* @param {boolean} bitmask The bitmask flags.
*  1 - Deep clone
*  2 - Flatten inherited properties
*  4 - Clone symbols
* @param {Function} [customizer] The function to customize cloning.
* @param {string} [key] The key of `value`.
* @param {Object} [object] The parent object of `value`.
* @param {Object} [stack] Tracks traversed objects and their clone counterparts.
* @returns {*} Returns the cloned value.
*/
function baseClone(value, bitmask, customizer, key, object, stack) {
	var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
	if (customizer) result = object ? customizer(value, key, object, stack) : customizer(value);
	if (result !== void 0) return result;
	if (!isObject(value)) return value;
	var isArr = isArray(value);
	if (isArr) {
		result = initCloneArray(value);
		if (!isDeep) return copyArray(value, result);
	} else {
		var tag = _getTag_default(value), isFunc = tag == funcTag || tag == genTag;
		if (isBuffer(value)) return cloneBuffer(value, isDeep);
		if (tag == objectTag || tag == argsTag || isFunc && !object) {
			result = isFlat || isFunc ? {} : initCloneObject(value);
			if (!isDeep) return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
		} else {
			if (!cloneableTags[tag]) return object ? value : {};
			result = initCloneByTag(value, tag, isDeep);
		}
	}
	stack || (stack = new Stack());
	var stacked = stack.get(value);
	if (stacked) return stacked;
	stack.set(value, result);
	if (isSet(value)) value.forEach(function(subValue) {
		result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
	});
	else if (isMap(value)) value.forEach(function(subValue, key) {
		result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
	});
	var props = isArr ? void 0 : (isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys)(value);
	arrayEach(props || value, function(subValue, key) {
		if (props) {
			key = subValue;
			subValue = value[key];
		}
		assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
	});
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseValues.js
/**
* The base implementation of `_.values` and `_.valuesIn` which creates an
* array of `object` property values corresponding to the property names
* of `props`.
*
* @private
* @param {Object} object The object to query.
* @param {Array} props The property names to get values for.
* @returns {Object} Returns the array of property values.
*/
function baseValues(object, props) {
	return arrayMap(props, function(key) {
		return object[key];
	});
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/values.js
/**
* Creates an array of the own enumerable string keyed property values of `object`.
*
* **Note:** Non-object values are coerced to objects.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Object
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property values.
* @example
*
* function Foo() {
*   this.a = 1;
*   this.b = 2;
* }
*
* Foo.prototype.c = 3;
*
* _.values(new Foo);
* // => [1, 2] (iteration order is not guaranteed)
*
* _.values('hi');
* // => ['h', 'i']
*/
function values(object) {
	return object == null ? [] : baseValues(object, keys(object));
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/isUndefined.js
/**
* Checks if `value` is `undefined`.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
* @example
*
* _.isUndefined(void 0);
* // => true
*
* _.isUndefined(null);
* // => false
*/
function isUndefined(value) {
	return value === void 0;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/union.js
/**
* Creates an array of unique values, in order, from all given arrays using
* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
* for equality comparisons.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {...Array} [arrays] The arrays to inspect.
* @returns {Array} Returns the new array of combined values.
* @example
*
* _.union([2], [1, 2]);
* // => [2, 1]
*/
var union = baseRest(function(arrays) {
	return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
});
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/lodash.js
/**
* @license
* Lodash (Custom Build) <https://lodash.com/>
* Build: `lodash modularize exports="es" --repo lodash/lodash#4.18.1 -o ./`
* Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
* Released under MIT license <https://lodash.com/license>
* Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
* Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
*/
// ../../node_modules/.pnpm/dagre-d3-es@7.0.13/node_modules/dagre-d3-es/src/graphlib/graph.js
var DEFAULT_EDGE_NAME = "\0";
var GRAPH_NODE = "\0";
var EDGE_KEY_DELIM = "";
var Graph = class {
	constructor(opts = {}) {
		this._isDirected = Object.prototype.hasOwnProperty.call(opts, "directed") ? opts.directed : true;
		this._isMultigraph = Object.prototype.hasOwnProperty.call(opts, "multigraph") ? opts.multigraph : false;
		this._isCompound = Object.prototype.hasOwnProperty.call(opts, "compound") ? opts.compound : false;
		this._label = void 0;
		this._defaultNodeLabelFn = constant(void 0);
		this._defaultEdgeLabelFn = constant(void 0);
		this._nodes = {};
		if (this._isCompound) {
			this._parent = {};
			this._children = {};
			this._children[GRAPH_NODE] = {};
		}
		this._in = {};
		this._preds = {};
		this._out = {};
		this._sucs = {};
		this._edgeObjs = {};
		this._edgeLabels = {};
	}
	isDirected() {
		return this._isDirected;
	}
	isMultigraph() {
		return this._isMultigraph;
	}
	isCompound() {
		return this._isCompound;
	}
	setGraph(label) {
		this._label = label;
		return this;
	}
	graph() {
		return this._label;
	}
	setDefaultNodeLabel(newDefault) {
		if (!isFunction(newDefault)) newDefault = constant(newDefault);
		this._defaultNodeLabelFn = newDefault;
		return this;
	}
	nodeCount() {
		return this._nodeCount;
	}
	nodes() {
		return keys(this._nodes);
	}
	sources() {
		var self = this;
		return filter(this.nodes(), function(v) {
			return isEmpty(self._in[v]);
		});
	}
	sinks() {
		var self = this;
		return filter(this.nodes(), function(v) {
			return isEmpty(self._out[v]);
		});
	}
	setNodes(vs, value) {
		var args = arguments;
		var self = this;
		forEach(vs, function(v) {
			if (args.length > 1) self.setNode(v, value);
			else self.setNode(v);
		});
		return this;
	}
	setNode(v, value) {
		if (Object.prototype.hasOwnProperty.call(this._nodes, v)) {
			if (arguments.length > 1) this._nodes[v] = value;
			return this;
		}
		this._nodes[v] = arguments.length > 1 ? value : this._defaultNodeLabelFn(v);
		if (this._isCompound) {
			this._parent[v] = GRAPH_NODE;
			this._children[v] = {};
			this._children[GRAPH_NODE][v] = true;
		}
		this._in[v] = {};
		this._preds[v] = {};
		this._out[v] = {};
		this._sucs[v] = {};
		++this._nodeCount;
		return this;
	}
	node(v) {
		return this._nodes[v];
	}
	hasNode(v) {
		return Object.prototype.hasOwnProperty.call(this._nodes, v);
	}
	removeNode(v) {
		if (Object.prototype.hasOwnProperty.call(this._nodes, v)) {
			var removeEdge = (e) => this.removeEdge(this._edgeObjs[e]);
			delete this._nodes[v];
			if (this._isCompound) {
				this._removeFromParentsChildList(v);
				delete this._parent[v];
				forEach(this.children(v), (child) => {
					this.setParent(child);
				});
				delete this._children[v];
			}
			forEach(keys(this._in[v]), removeEdge);
			delete this._in[v];
			delete this._preds[v];
			forEach(keys(this._out[v]), removeEdge);
			delete this._out[v];
			delete this._sucs[v];
			--this._nodeCount;
		}
		return this;
	}
	setParent(v, parent) {
		if (!this._isCompound) throw new Error("Cannot set parent in a non-compound graph");
		if (isUndefined(parent)) parent = GRAPH_NODE;
		else {
			parent += "";
			for (var ancestor = parent; !isUndefined(ancestor); ancestor = this.parent(ancestor)) if (ancestor === v) throw new Error("Setting " + parent + " as parent of " + v + " would create a cycle");
			this.setNode(parent);
		}
		this.setNode(v);
		this._removeFromParentsChildList(v);
		this._parent[v] = parent;
		this._children[parent][v] = true;
		return this;
	}
	_removeFromParentsChildList(v) {
		delete this._children[this._parent[v]][v];
	}
	parent(v) {
		if (this._isCompound) {
			var parent = this._parent[v];
			if (parent !== GRAPH_NODE) return parent;
		}
	}
	children(v) {
		if (isUndefined(v)) v = GRAPH_NODE;
		if (this._isCompound) {
			var children = this._children[v];
			if (children) return keys(children);
		} else if (v === GRAPH_NODE) return this.nodes();
		else if (this.hasNode(v)) return [];
	}
	predecessors(v) {
		var predsV = this._preds[v];
		if (predsV) return keys(predsV);
	}
	successors(v) {
		var sucsV = this._sucs[v];
		if (sucsV) return keys(sucsV);
	}
	neighbors(v) {
		var preds = this.predecessors(v);
		if (preds) return union(preds, this.successors(v));
	}
	isLeaf(v) {
		var neighbors;
		if (this.isDirected()) neighbors = this.successors(v);
		else neighbors = this.neighbors(v);
		return neighbors.length === 0;
	}
	filterNodes(filter) {
		var copy = new this.constructor({
			directed: this._isDirected,
			multigraph: this._isMultigraph,
			compound: this._isCompound
		});
		copy.setGraph(this.graph());
		var self = this;
		forEach(this._nodes, function(value, v) {
			if (filter(v)) copy.setNode(v, value);
		});
		forEach(this._edgeObjs, function(e) {
			if (copy.hasNode(e.v) && copy.hasNode(e.w)) copy.setEdge(e, self.edge(e));
		});
		var parents = {};
		function findParent(v) {
			var parent = self.parent(v);
			if (parent === void 0 || copy.hasNode(parent)) {
				parents[v] = parent;
				return parent;
			} else if (parent in parents) return parents[parent];
			else return findParent(parent);
		}
		if (this._isCompound) forEach(copy.nodes(), function(v) {
			copy.setParent(v, findParent(v));
		});
		return copy;
	}
	setDefaultEdgeLabel(newDefault) {
		if (!isFunction(newDefault)) newDefault = constant(newDefault);
		this._defaultEdgeLabelFn = newDefault;
		return this;
	}
	edgeCount() {
		return this._edgeCount;
	}
	edges() {
		return values(this._edgeObjs);
	}
	setPath(vs, value) {
		var self = this;
		var args = arguments;
		reduce(vs, function(v, w) {
			if (args.length > 1) self.setEdge(v, w, value);
			else self.setEdge(v, w);
			return w;
		});
		return this;
	}
	setEdge() {
		var v, w, name, value;
		var valueSpecified = false;
		var arg0 = arguments[0];
		if (typeof arg0 === "object" && arg0 !== null && "v" in arg0) {
			v = arg0.v;
			w = arg0.w;
			name = arg0.name;
			if (arguments.length === 2) {
				value = arguments[1];
				valueSpecified = true;
			}
		} else {
			v = arg0;
			w = arguments[1];
			name = arguments[3];
			if (arguments.length > 2) {
				value = arguments[2];
				valueSpecified = true;
			}
		}
		v = "" + v;
		w = "" + w;
		if (!isUndefined(name)) name = "" + name;
		var e = edgeArgsToId(this._isDirected, v, w, name);
		if (Object.prototype.hasOwnProperty.call(this._edgeLabels, e)) {
			if (valueSpecified) this._edgeLabels[e] = value;
			return this;
		}
		if (!isUndefined(name) && !this._isMultigraph) throw new Error("Cannot set a named edge when isMultigraph = false");
		this.setNode(v);
		this.setNode(w);
		this._edgeLabels[e] = valueSpecified ? value : this._defaultEdgeLabelFn(v, w, name);
		var edgeObj = edgeArgsToObj(this._isDirected, v, w, name);
		v = edgeObj.v;
		w = edgeObj.w;
		Object.freeze(edgeObj);
		this._edgeObjs[e] = edgeObj;
		incrementOrInitEntry(this._preds[w], v);
		incrementOrInitEntry(this._sucs[v], w);
		this._in[w][e] = edgeObj;
		this._out[v][e] = edgeObj;
		this._edgeCount++;
		return this;
	}
	edge(v, w, name) {
		var e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name);
		return this._edgeLabels[e];
	}
	hasEdge(v, w, name) {
		var e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name);
		return Object.prototype.hasOwnProperty.call(this._edgeLabels, e);
	}
	removeEdge(v, w, name) {
		var e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name);
		var edge = this._edgeObjs[e];
		if (edge) {
			v = edge.v;
			w = edge.w;
			delete this._edgeLabels[e];
			delete this._edgeObjs[e];
			decrementOrRemoveEntry(this._preds[w], v);
			decrementOrRemoveEntry(this._sucs[v], w);
			delete this._in[w][e];
			delete this._out[v][e];
			this._edgeCount--;
		}
		return this;
	}
	inEdges(v, u) {
		var inV = this._in[v];
		if (inV) {
			var edges = values(inV);
			if (!u) return edges;
			return filter(edges, function(edge) {
				return edge.v === u;
			});
		}
	}
	outEdges(v, w) {
		var outV = this._out[v];
		if (outV) {
			var edges = values(outV);
			if (!w) return edges;
			return filter(edges, function(edge) {
				return edge.w === w;
			});
		}
	}
	nodeEdges(v, w) {
		var inEdges = this.inEdges(v, w);
		if (inEdges) return inEdges.concat(this.outEdges(v, w));
	}
};
Graph.prototype._nodeCount = 0;
Graph.prototype._edgeCount = 0;
function incrementOrInitEntry(map, k) {
	if (map[k]) map[k]++;
	else map[k] = 1;
}
function decrementOrRemoveEntry(map, k) {
	if (!--map[k]) delete map[k];
}
function edgeArgsToId(isDirected, v_, w_, name) {
	var v = "" + v_;
	var w = "" + w_;
	if (!isDirected && v > w) {
		var tmp = v;
		v = w;
		w = tmp;
	}
	return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM + (isUndefined(name) ? DEFAULT_EDGE_NAME : name);
}
function edgeArgsToObj(isDirected, v_, w_, name) {
	var v = "" + v_;
	var w = "" + w_;
	if (!isDirected && v > w) {
		var tmp = v;
		v = w;
		w = tmp;
	}
	var edgeObj = {
		v,
		w
	};
	if (name) edgeObj.name = name;
	return edgeObj;
}
function edgeObjToId(isDirected, edgeObj) {
	return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name);
}
export { baseClone as i, isUndefined as n, values as r, Graph as t };
