import { i as __toESM, n as __exportAll, r as __reExport, t as __commonJSMin } from "./rolldown-runtime-2Bq2VkyB.js";
import { t as isEmpty$1 } from "./isEmpty-MtiTqD5c.js";
import { a as baseUniq$1, c as filter$1, d as baseIteratee$1, n as forEach$1, s as baseFlatten$1, t as reduce$1 } from "./reduce-CuNrUjhP.js";
import { a as map$1, n as min, t as flatten$1 } from "./flatten-b2YoMb5V.js";
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/syntax-tree.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
function isAstNode(obj) {
	return typeof obj === "object" && obj !== null && typeof obj.$type === "string";
}
function isReference(obj) {
	return typeof obj === "object" && obj !== null && typeof obj.$refText === "string";
}
function isAstNodeDescription(obj) {
	return typeof obj === "object" && obj !== null && typeof obj.name === "string" && typeof obj.type === "string" && typeof obj.path === "string";
}
function isLinkingError(obj) {
	return typeof obj === "object" && obj !== null && isAstNode(obj.container) && isReference(obj.reference) && typeof obj.message === "string";
}
/**
* An abstract implementation of the {@link AstReflection} interface.
* Serves to cache subtype computation results to improve performance throughout different parts of Langium.
*/
var AbstractAstReflection = class {
	constructor() {
		this.subtypes = {};
		this.allSubtypes = {};
	}
	isInstance(node, type) {
		return isAstNode(node) && this.isSubtype(node.$type, type);
	}
	isSubtype(subtype, supertype) {
		if (subtype === supertype) return true;
		let nested = this.subtypes[subtype];
		if (!nested) nested = this.subtypes[subtype] = {};
		const existing = nested[supertype];
		if (existing !== void 0) return existing;
		else {
			const result = this.computeIsSubtype(subtype, supertype);
			nested[supertype] = result;
			return result;
		}
	}
	getAllSubTypes(type) {
		const existing = this.allSubtypes[type];
		if (existing) return existing;
		else {
			const allTypes = this.getAllTypes();
			const types = [];
			for (const possibleSubType of allTypes) if (this.isSubtype(possibleSubType, type)) types.push(possibleSubType);
			this.allSubtypes[type] = types;
			return types;
		}
	}
};
function isCompositeCstNode(node) {
	return typeof node === "object" && node !== null && Array.isArray(node.content);
}
function isLeafCstNode(node) {
	return typeof node === "object" && node !== null && typeof node.tokenType === "object";
}
function isRootCstNode(node) {
	return isCompositeCstNode(node) && typeof node.fullText === "string";
}
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/utils/stream.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
/**
* The default implementation of `Stream` works with two input functions:
*  - The first function creates the initial state of an iteration.
*  - The second function gets the current state as argument and returns an `IteratorResult`.
*/
var StreamImpl = class StreamImpl {
	constructor(startFn, nextFn) {
		this.startFn = startFn;
		this.nextFn = nextFn;
	}
	iterator() {
		const iterator = {
			state: this.startFn(),
			next: () => this.nextFn(iterator.state),
			[Symbol.iterator]: () => iterator
		};
		return iterator;
	}
	[Symbol.iterator]() {
		return this.iterator();
	}
	isEmpty() {
		const iterator = this.iterator();
		return Boolean(iterator.next().done);
	}
	count() {
		const iterator = this.iterator();
		let count = 0;
		let next = iterator.next();
		while (!next.done) {
			count++;
			next = iterator.next();
		}
		return count;
	}
	toArray() {
		const result = [];
		const iterator = this.iterator();
		let next;
		do {
			next = iterator.next();
			if (next.value !== void 0) result.push(next.value);
		} while (!next.done);
		return result;
	}
	toSet() {
		return new Set(this);
	}
	toMap(keyFn, valueFn) {
		const entryStream = this.map((element) => [keyFn ? keyFn(element) : element, valueFn ? valueFn(element) : element]);
		return new Map(entryStream);
	}
	toString() {
		return this.join();
	}
	concat(other) {
		return new StreamImpl(() => ({
			first: this.startFn(),
			firstDone: false,
			iterator: other[Symbol.iterator]()
		}), (state) => {
			let result;
			if (!state.firstDone) {
				do {
					result = this.nextFn(state.first);
					if (!result.done) return result;
				} while (!result.done);
				state.firstDone = true;
			}
			do {
				result = state.iterator.next();
				if (!result.done) return result;
			} while (!result.done);
			return DONE_RESULT;
		});
	}
	join(separator = ",") {
		const iterator = this.iterator();
		let value = "";
		let result;
		let addSeparator = false;
		do {
			result = iterator.next();
			if (!result.done) {
				if (addSeparator) value += separator;
				value += toString$1(result.value);
			}
			addSeparator = true;
		} while (!result.done);
		return value;
	}
	indexOf(searchElement, fromIndex = 0) {
		const iterator = this.iterator();
		let index = 0;
		let next = iterator.next();
		while (!next.done) {
			if (index >= fromIndex && next.value === searchElement) return index;
			next = iterator.next();
			index++;
		}
		return -1;
	}
	every(predicate) {
		const iterator = this.iterator();
		let next = iterator.next();
		while (!next.done) {
			if (!predicate(next.value)) return false;
			next = iterator.next();
		}
		return true;
	}
	some(predicate) {
		const iterator = this.iterator();
		let next = iterator.next();
		while (!next.done) {
			if (predicate(next.value)) return true;
			next = iterator.next();
		}
		return false;
	}
	forEach(callbackfn) {
		const iterator = this.iterator();
		let index = 0;
		let next = iterator.next();
		while (!next.done) {
			callbackfn(next.value, index);
			next = iterator.next();
			index++;
		}
	}
	map(callbackfn) {
		return new StreamImpl(this.startFn, (state) => {
			const { done, value } = this.nextFn(state);
			if (done) return DONE_RESULT;
			else return {
				done: false,
				value: callbackfn(value)
			};
		});
	}
	filter(predicate) {
		return new StreamImpl(this.startFn, (state) => {
			let result;
			do {
				result = this.nextFn(state);
				if (!result.done && predicate(result.value)) return result;
			} while (!result.done);
			return DONE_RESULT;
		});
	}
	nonNullable() {
		return this.filter((e) => e !== void 0 && e !== null);
	}
	reduce(callbackfn, initialValue) {
		const iterator = this.iterator();
		let previousValue = initialValue;
		let next = iterator.next();
		while (!next.done) {
			if (previousValue === void 0) previousValue = next.value;
			else previousValue = callbackfn(previousValue, next.value);
			next = iterator.next();
		}
		return previousValue;
	}
	reduceRight(callbackfn, initialValue) {
		return this.recursiveReduce(this.iterator(), callbackfn, initialValue);
	}
	recursiveReduce(iterator, callbackfn, initialValue) {
		const next = iterator.next();
		if (next.done) return initialValue;
		const previousValue = this.recursiveReduce(iterator, callbackfn, initialValue);
		if (previousValue === void 0) return next.value;
		return callbackfn(previousValue, next.value);
	}
	find(predicate) {
		const iterator = this.iterator();
		let next = iterator.next();
		while (!next.done) {
			if (predicate(next.value)) return next.value;
			next = iterator.next();
		}
	}
	findIndex(predicate) {
		const iterator = this.iterator();
		let index = 0;
		let next = iterator.next();
		while (!next.done) {
			if (predicate(next.value)) return index;
			next = iterator.next();
			index++;
		}
		return -1;
	}
	includes(searchElement) {
		const iterator = this.iterator();
		let next = iterator.next();
		while (!next.done) {
			if (next.value === searchElement) return true;
			next = iterator.next();
		}
		return false;
	}
	flatMap(callbackfn) {
		return new StreamImpl(() => ({ this: this.startFn() }), (state) => {
			do {
				if (state.iterator) {
					const next = state.iterator.next();
					if (next.done) state.iterator = void 0;
					else return next;
				}
				const { done, value } = this.nextFn(state.this);
				if (!done) {
					const mapped = callbackfn(value);
					if (isIterable(mapped)) state.iterator = mapped[Symbol.iterator]();
					else return {
						done: false,
						value: mapped
					};
				}
			} while (state.iterator);
			return DONE_RESULT;
		});
	}
	flat(depth) {
		if (depth === void 0) depth = 1;
		if (depth <= 0) return this;
		const stream = depth > 1 ? this.flat(depth - 1) : this;
		return new StreamImpl(() => ({ this: stream.startFn() }), (state) => {
			do {
				if (state.iterator) {
					const next = state.iterator.next();
					if (next.done) state.iterator = void 0;
					else return next;
				}
				const { done, value } = stream.nextFn(state.this);
				if (!done) {
					if (isIterable(value)) state.iterator = value[Symbol.iterator]();
					else return {
						done: false,
						value
					};
				}
			} while (state.iterator);
			return DONE_RESULT;
		});
	}
	head() {
		const result = this.iterator().next();
		if (result.done) return;
		return result.value;
	}
	tail(skipCount = 1) {
		return new StreamImpl(() => {
			const state = this.startFn();
			for (let i = 0; i < skipCount; i++) if (this.nextFn(state).done) return state;
			return state;
		}, this.nextFn);
	}
	limit(maxSize) {
		return new StreamImpl(() => ({
			size: 0,
			state: this.startFn()
		}), (state) => {
			state.size++;
			if (state.size > maxSize) return DONE_RESULT;
			return this.nextFn(state.state);
		});
	}
	distinct(by) {
		return new StreamImpl(() => ({
			set: /* @__PURE__ */ new Set(),
			internalState: this.startFn()
		}), (state) => {
			let result;
			do {
				result = this.nextFn(state.internalState);
				if (!result.done) {
					const value = by ? by(result.value) : result.value;
					if (!state.set.has(value)) {
						state.set.add(value);
						return result;
					}
				}
			} while (!result.done);
			return DONE_RESULT;
		});
	}
	exclude(other, key) {
		const otherKeySet = /* @__PURE__ */ new Set();
		for (const item of other) {
			const value = key ? key(item) : item;
			otherKeySet.add(value);
		}
		return this.filter((e) => {
			const ownKey = key ? key(e) : e;
			return !otherKeySet.has(ownKey);
		});
	}
};
function toString$1(item) {
	if (typeof item === "string") return item;
	if (typeof item === "undefined") return "undefined";
	if (typeof item.toString === "function") return item.toString();
	return Object.prototype.toString.call(item);
}
function isIterable(obj) {
	return !!obj && typeof obj[Symbol.iterator] === "function";
}
/**
* An empty stream of any type.
*/
var EMPTY_STREAM = new StreamImpl(() => void 0, () => DONE_RESULT);
/**
* Use this `IteratorResult` when implementing a `StreamImpl` to indicate that there are no more elements in the stream.
*/
var DONE_RESULT = Object.freeze({
	done: true,
	value: void 0
});
/**
* Create a stream from one or more iterables or array-likes.
*/
function stream(...collections) {
	if (collections.length === 1) {
		const collection = collections[0];
		if (collection instanceof StreamImpl) return collection;
		if (isIterable(collection)) return new StreamImpl(() => collection[Symbol.iterator](), (iterator) => iterator.next());
		if (typeof collection.length === "number") return new StreamImpl(() => ({ index: 0 }), (state) => {
			if (state.index < collection.length) return {
				done: false,
				value: collection[state.index++]
			};
			else return DONE_RESULT;
		});
	}
	if (collections.length > 1) return new StreamImpl(() => ({
		collIndex: 0,
		arrIndex: 0
	}), (state) => {
		do {
			if (state.iterator) {
				const next = state.iterator.next();
				if (!next.done) return next;
				state.iterator = void 0;
			}
			if (state.array) {
				if (state.arrIndex < state.array.length) return {
					done: false,
					value: state.array[state.arrIndex++]
				};
				state.array = void 0;
				state.arrIndex = 0;
			}
			if (state.collIndex < collections.length) {
				const collection = collections[state.collIndex++];
				if (isIterable(collection)) state.iterator = collection[Symbol.iterator]();
				else if (collection && typeof collection.length === "number") state.array = collection;
			}
		} while (state.iterator || state.array || state.collIndex < collections.length);
		return DONE_RESULT;
	});
	return EMPTY_STREAM;
}
/**
* The default implementation of `TreeStream` takes a root element and a function that computes the
* children of its argument. Whether the root node included in the stream is controlled with the
* `includeRoot` option, which defaults to `false`.
*/
var TreeStreamImpl = class extends StreamImpl {
	constructor(root, children, options) {
		super(() => ({
			iterators: (options === null || options === void 0 ? void 0 : options.includeRoot) ? [[root][Symbol.iterator]()] : [children(root)[Symbol.iterator]()],
			pruned: false
		}), (state) => {
			if (state.pruned) {
				state.iterators.pop();
				state.pruned = false;
			}
			while (state.iterators.length > 0) {
				const next = state.iterators[state.iterators.length - 1].next();
				if (next.done) state.iterators.pop();
				else {
					state.iterators.push(children(next.value)[Symbol.iterator]());
					return next;
				}
			}
			return DONE_RESULT;
		});
	}
	iterator() {
		const iterator = {
			state: this.startFn(),
			next: () => this.nextFn(iterator.state),
			prune: () => {
				iterator.state.pruned = true;
			},
			[Symbol.iterator]: () => iterator
		};
		return iterator;
	}
};
/**
* A set of utility functions that reduce a stream to a single value.
*/
var Reduction;
(function(Reduction) {
	/**
	* Compute the sum of a number stream.
	*/
	function sum(stream) {
		return stream.reduce((a, b) => a + b, 0);
	}
	Reduction.sum = sum;
	/**
	* Compute the product of a number stream.
	*/
	function product(stream) {
		return stream.reduce((a, b) => a * b, 0);
	}
	Reduction.product = product;
	/**
	* Compute the minimum of a number stream. Returns `undefined` if the stream is empty.
	*/
	function min(stream) {
		return stream.reduce((a, b) => Math.min(a, b));
	}
	Reduction.min = min;
	/**
	* Compute the maximum of a number stream. Returns `undefined` if the stream is empty.
	*/
	function max(stream) {
		return stream.reduce((a, b) => Math.max(a, b));
	}
	Reduction.max = max;
})(Reduction || (Reduction = {}));
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/utils/cst-utils.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var cst_utils_exports = /* @__PURE__ */ __exportAll({
	DefaultNameRegexp: () => DefaultNameRegexp,
	RangeComparison: () => RangeComparison,
	compareRange: () => compareRange,
	findCommentNode: () => findCommentNode,
	findDeclarationNodeAtOffset: () => findDeclarationNodeAtOffset,
	findLeafNodeAtOffset: () => findLeafNodeAtOffset,
	findLeafNodeBeforeOffset: () => findLeafNodeBeforeOffset,
	flattenCst: () => flattenCst,
	getInteriorNodes: () => getInteriorNodes,
	getNextNode: () => getNextNode,
	getPreviousNode: () => getPreviousNode,
	getStartlineNode: () => getStartlineNode,
	inRange: () => inRange,
	isChildNode: () => isChildNode,
	isCommentNode: () => isCommentNode,
	streamCst: () => streamCst,
	toDocumentSegment: () => toDocumentSegment,
	tokenToRange: () => tokenToRange
});
/**
* Create a stream of all CST nodes that are directly and indirectly contained in the given root node,
* including the root node itself.
*/
function streamCst(node) {
	return new TreeStreamImpl(node, (element) => {
		if (isCompositeCstNode(element)) return element.content;
		else return [];
	}, { includeRoot: true });
}
/**
* Create a stream of all leaf nodes that are directly and indirectly contained in the given root node.
*/
function flattenCst(node) {
	return streamCst(node).filter(isLeafCstNode);
}
/**
* Determines whether the specified cst node is a child of the specified parent node.
*/
function isChildNode(child, parent) {
	while (child.container) {
		child = child.container;
		if (child === parent) return true;
	}
	return false;
}
function tokenToRange(token) {
	return {
		start: {
			character: token.startColumn - 1,
			line: token.startLine - 1
		},
		end: {
			character: token.endColumn,
			line: token.endLine - 1
		}
	};
}
function toDocumentSegment(node) {
	if (!node) return;
	const { offset, end, range } = node;
	return {
		range,
		offset,
		end,
		length: end - offset
	};
}
var RangeComparison;
(function(RangeComparison) {
	RangeComparison[RangeComparison["Before"] = 0] = "Before";
	RangeComparison[RangeComparison["After"] = 1] = "After";
	RangeComparison[RangeComparison["OverlapFront"] = 2] = "OverlapFront";
	RangeComparison[RangeComparison["OverlapBack"] = 3] = "OverlapBack";
	RangeComparison[RangeComparison["Inside"] = 4] = "Inside";
	RangeComparison[RangeComparison["Outside"] = 5] = "Outside";
})(RangeComparison || (RangeComparison = {}));
function compareRange(range, to) {
	if (range.end.line < to.start.line || range.end.line === to.start.line && range.end.character <= to.start.character) return RangeComparison.Before;
	else if (range.start.line > to.end.line || range.start.line === to.end.line && range.start.character >= to.end.character) return RangeComparison.After;
	const startInside = range.start.line > to.start.line || range.start.line === to.start.line && range.start.character >= to.start.character;
	const endInside = range.end.line < to.end.line || range.end.line === to.end.line && range.end.character <= to.end.character;
	if (startInside && endInside) return RangeComparison.Inside;
	else if (startInside) return RangeComparison.OverlapBack;
	else if (endInside) return RangeComparison.OverlapFront;
	else return RangeComparison.Outside;
}
function inRange(range, to) {
	return compareRange(range, to) > RangeComparison.After;
}
var DefaultNameRegexp = /^[\w\p{L}]$/u;
/**
* Performs `findLeafNodeAtOffset` with a minor difference: When encountering a character that matches the `nameRegexp` argument,
* it will instead return the leaf node at the `offset - 1` position.
*
* For LSP services, users expect that the declaration of an element is available if the cursor is directly after the element.
*/
function findDeclarationNodeAtOffset(cstNode, offset, nameRegexp = DefaultNameRegexp) {
	if (cstNode) {
		if (offset > 0) {
			const localOffset = offset - cstNode.offset;
			const textAtOffset = cstNode.text.charAt(localOffset);
			if (!nameRegexp.test(textAtOffset)) offset--;
		}
		return findLeafNodeAtOffset(cstNode, offset);
	}
}
function findCommentNode(cstNode, commentNames) {
	if (cstNode) {
		const previous = getPreviousNode(cstNode, true);
		if (previous && isCommentNode(previous, commentNames)) return previous;
		if (isRootCstNode(cstNode)) {
			const endIndex = cstNode.content.findIndex((e) => !e.hidden);
			for (let i = endIndex - 1; i >= 0; i--) {
				const child = cstNode.content[i];
				if (isCommentNode(child, commentNames)) return child;
			}
		}
	}
}
function isCommentNode(cstNode, commentNames) {
	return isLeafCstNode(cstNode) && commentNames.includes(cstNode.tokenType.name);
}
/**
* Finds the leaf CST node at the specified 0-based string offset.
* Note that the given offset will be within the range of the returned leaf node.
*
* If the offset does not point to a CST node (but just white space), this method will return `undefined`.
*
* @param node The CST node to search through.
* @param offset The specified offset.
* @returns The CST node at the specified offset.
*/
function findLeafNodeAtOffset(node, offset) {
	if (isLeafCstNode(node)) return node;
	else if (isCompositeCstNode(node)) {
		const searchResult = binarySearch(node, offset, false);
		if (searchResult) return findLeafNodeAtOffset(searchResult, offset);
	}
}
/**
* Finds the leaf CST node at the specified 0-based string offset.
* If no CST node exists at the specified position, it will return the leaf node before it.
*
* If there is no leaf node before the specified offset, this method will return `undefined`.
*
* @param node The CST node to search through.
* @param offset The specified offset.
* @returns The CST node closest to the specified offset.
*/
function findLeafNodeBeforeOffset(node, offset) {
	if (isLeafCstNode(node)) return node;
	else if (isCompositeCstNode(node)) {
		const searchResult = binarySearch(node, offset, true);
		if (searchResult) return findLeafNodeBeforeOffset(searchResult, offset);
	}
}
function binarySearch(node, offset, closest) {
	let left = 0;
	let right = node.content.length - 1;
	let closestNode = void 0;
	while (left <= right) {
		const middle = Math.floor((left + right) / 2);
		const middleNode = node.content[middle];
		if (middleNode.offset <= offset && middleNode.end > offset) return middleNode;
		if (middleNode.end <= offset) {
			closestNode = closest ? middleNode : void 0;
			left = middle + 1;
		} else right = middle - 1;
	}
	return closestNode;
}
function getPreviousNode(node, hidden = true) {
	while (node.container) {
		const parent = node.container;
		let index = parent.content.indexOf(node);
		while (index > 0) {
			index--;
			const previous = parent.content[index];
			if (hidden || !previous.hidden) return previous;
		}
		node = parent;
	}
}
function getNextNode(node, hidden = true) {
	while (node.container) {
		const parent = node.container;
		let index = parent.content.indexOf(node);
		const last = parent.content.length - 1;
		while (index < last) {
			index++;
			const next = parent.content[index];
			if (hidden || !next.hidden) return next;
		}
		node = parent;
	}
}
function getStartlineNode(node) {
	if (node.range.start.character === 0) return node;
	const line = node.range.start.line;
	let last = node;
	let index;
	while (node.container) {
		const parent = node.container;
		const selfIndex = index !== null && index !== void 0 ? index : parent.content.indexOf(node);
		if (selfIndex === 0) {
			node = parent;
			index = void 0;
		} else {
			index = selfIndex - 1;
			node = parent.content[index];
		}
		if (node.range.start.line !== line) break;
		last = node;
	}
	return last;
}
function getInteriorNodes(start, end) {
	const commonParent = getCommonParent(start, end);
	if (!commonParent) return [];
	return commonParent.parent.content.slice(commonParent.a + 1, commonParent.b);
}
function getCommonParent(a, b) {
	const aParents = getParentChain(a);
	const bParents = getParentChain(b);
	let current;
	for (let i = 0; i < aParents.length && i < bParents.length; i++) {
		const aParent = aParents[i];
		const bParent = bParents[i];
		if (aParent.parent === bParent.parent) current = {
			parent: aParent.parent,
			a: aParent.index,
			b: bParent.index
		};
		else break;
	}
	return current;
}
function getParentChain(node) {
	const chain = [];
	while (node.container) {
		const parent = node.container;
		const index = parent.content.indexOf(node);
		chain.push({
			parent,
			index
		});
		node = parent;
	}
	return chain.reverse();
}
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/utils/errors.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var ErrorWithLocation = class extends Error {
	constructor(node, message) {
		super(node ? `${message} at ${node.range.start.line}:${node.range.start.character}` : message);
	}
};
function assertUnreachable(_) {
	throw new Error("Error! The input value was not handled.");
}
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/languages/generated/ast.js
/******************************************************************************
* This file was generated by langium-cli 3.3.0.
* DO NOT EDIT MANUALLY!
******************************************************************************/
var ast_exports = /* @__PURE__ */ __exportAll({
	AbstractElement: () => AbstractElement,
	AbstractRule: () => AbstractRule,
	AbstractType: () => AbstractType,
	Action: () => Action,
	Alternatives: () => Alternatives,
	ArrayLiteral: () => ArrayLiteral,
	ArrayType: () => ArrayType,
	Assignment: () => Assignment,
	BooleanLiteral: () => BooleanLiteral,
	CharacterRange: () => CharacterRange,
	Condition: () => Condition,
	Conjunction: () => Conjunction,
	CrossReference: () => CrossReference,
	Disjunction: () => Disjunction,
	EndOfFile: () => EndOfFile,
	Grammar: () => Grammar,
	GrammarImport: () => GrammarImport,
	Group: () => Group$1,
	InferredType: () => InferredType,
	Interface: () => Interface,
	Keyword: () => Keyword,
	LangiumGrammarAstReflection: () => LangiumGrammarAstReflection,
	LangiumGrammarTerminals: () => LangiumGrammarTerminals,
	NamedArgument: () => NamedArgument,
	NegatedToken: () => NegatedToken,
	Negation: () => Negation,
	NumberLiteral: () => NumberLiteral,
	Parameter: () => Parameter,
	ParameterReference: () => ParameterReference,
	ParserRule: () => ParserRule,
	ReferenceType: () => ReferenceType,
	RegexToken: () => RegexToken,
	ReturnType: () => ReturnType,
	RuleCall: () => RuleCall,
	SimpleType: () => SimpleType,
	StringLiteral: () => StringLiteral,
	TerminalAlternatives: () => TerminalAlternatives,
	TerminalGroup: () => TerminalGroup,
	TerminalRule: () => TerminalRule,
	TerminalRuleCall: () => TerminalRuleCall,
	Type: () => Type,
	TypeAttribute: () => TypeAttribute,
	TypeDefinition: () => TypeDefinition,
	UnionType: () => UnionType,
	UnorderedGroup: () => UnorderedGroup,
	UntilToken: () => UntilToken,
	ValueLiteral: () => ValueLiteral,
	Wildcard: () => Wildcard,
	isAbstractElement: () => isAbstractElement,
	isAbstractRule: () => isAbstractRule,
	isAbstractType: () => isAbstractType,
	isAction: () => isAction,
	isAlternatives: () => isAlternatives,
	isArrayLiteral: () => isArrayLiteral,
	isArrayType: () => isArrayType,
	isAssignment: () => isAssignment,
	isBooleanLiteral: () => isBooleanLiteral,
	isCharacterRange: () => isCharacterRange,
	isCondition: () => isCondition,
	isConjunction: () => isConjunction,
	isCrossReference: () => isCrossReference,
	isDisjunction: () => isDisjunction,
	isEndOfFile: () => isEndOfFile,
	isFeatureName: () => isFeatureName,
	isGrammar: () => isGrammar,
	isGrammarImport: () => isGrammarImport,
	isGroup: () => isGroup,
	isInferredType: () => isInferredType,
	isInterface: () => isInterface,
	isKeyword: () => isKeyword,
	isNamedArgument: () => isNamedArgument,
	isNegatedToken: () => isNegatedToken,
	isNegation: () => isNegation,
	isNumberLiteral: () => isNumberLiteral,
	isParameter: () => isParameter,
	isParameterReference: () => isParameterReference,
	isParserRule: () => isParserRule,
	isPrimitiveType: () => isPrimitiveType,
	isReferenceType: () => isReferenceType,
	isRegexToken: () => isRegexToken,
	isReturnType: () => isReturnType,
	isRuleCall: () => isRuleCall,
	isSimpleType: () => isSimpleType,
	isStringLiteral: () => isStringLiteral,
	isTerminalAlternatives: () => isTerminalAlternatives,
	isTerminalGroup: () => isTerminalGroup,
	isTerminalRule: () => isTerminalRule,
	isTerminalRuleCall: () => isTerminalRuleCall,
	isType: () => isType,
	isTypeAttribute: () => isTypeAttribute,
	isTypeDefinition: () => isTypeDefinition,
	isUnionType: () => isUnionType,
	isUnorderedGroup: () => isUnorderedGroup,
	isUntilToken: () => isUntilToken,
	isValueLiteral: () => isValueLiteral,
	isWildcard: () => isWildcard,
	reflection: () => reflection$1
});
var LangiumGrammarTerminals = {
	ID: /\^?[_a-zA-Z][\w_]*/,
	STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/,
	NUMBER: /NaN|-?((\d*\.\d+|\d+)([Ee][+-]?\d+)?|Infinity)/,
	RegexLiteral: /\/(?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+\/[a-z]*/,
	WS: /\s+/,
	ML_COMMENT: /\/\*[\s\S]*?\*\//,
	SL_COMMENT: /\/\/[^\n\r]*/
};
var AbstractRule = "AbstractRule";
function isAbstractRule(item) {
	return reflection$1.isInstance(item, AbstractRule);
}
var AbstractType = "AbstractType";
function isAbstractType(item) {
	return reflection$1.isInstance(item, AbstractType);
}
var Condition = "Condition";
function isCondition(item) {
	return reflection$1.isInstance(item, Condition);
}
function isFeatureName(item) {
	return isPrimitiveType(item) || item === "current" || item === "entry" || item === "extends" || item === "false" || item === "fragment" || item === "grammar" || item === "hidden" || item === "import" || item === "interface" || item === "returns" || item === "terminal" || item === "true" || item === "type" || item === "infer" || item === "infers" || item === "with" || typeof item === "string" && /\^?[_a-zA-Z][\w_]*/.test(item);
}
function isPrimitiveType(item) {
	return item === "string" || item === "number" || item === "boolean" || item === "Date" || item === "bigint";
}
var TypeDefinition = "TypeDefinition";
function isTypeDefinition(item) {
	return reflection$1.isInstance(item, TypeDefinition);
}
var ValueLiteral = "ValueLiteral";
function isValueLiteral(item) {
	return reflection$1.isInstance(item, ValueLiteral);
}
var AbstractElement = "AbstractElement";
function isAbstractElement(item) {
	return reflection$1.isInstance(item, AbstractElement);
}
var ArrayLiteral = "ArrayLiteral";
function isArrayLiteral(item) {
	return reflection$1.isInstance(item, ArrayLiteral);
}
var ArrayType = "ArrayType";
function isArrayType(item) {
	return reflection$1.isInstance(item, ArrayType);
}
var BooleanLiteral = "BooleanLiteral";
function isBooleanLiteral(item) {
	return reflection$1.isInstance(item, BooleanLiteral);
}
var Conjunction = "Conjunction";
function isConjunction(item) {
	return reflection$1.isInstance(item, Conjunction);
}
var Disjunction = "Disjunction";
function isDisjunction(item) {
	return reflection$1.isInstance(item, Disjunction);
}
var Grammar = "Grammar";
function isGrammar(item) {
	return reflection$1.isInstance(item, Grammar);
}
var GrammarImport = "GrammarImport";
function isGrammarImport(item) {
	return reflection$1.isInstance(item, GrammarImport);
}
var InferredType = "InferredType";
function isInferredType(item) {
	return reflection$1.isInstance(item, InferredType);
}
var Interface = "Interface";
function isInterface(item) {
	return reflection$1.isInstance(item, Interface);
}
var NamedArgument = "NamedArgument";
function isNamedArgument(item) {
	return reflection$1.isInstance(item, NamedArgument);
}
var Negation = "Negation";
function isNegation(item) {
	return reflection$1.isInstance(item, Negation);
}
var NumberLiteral = "NumberLiteral";
function isNumberLiteral(item) {
	return reflection$1.isInstance(item, NumberLiteral);
}
var Parameter = "Parameter";
function isParameter(item) {
	return reflection$1.isInstance(item, Parameter);
}
var ParameterReference = "ParameterReference";
function isParameterReference(item) {
	return reflection$1.isInstance(item, ParameterReference);
}
var ParserRule = "ParserRule";
function isParserRule(item) {
	return reflection$1.isInstance(item, ParserRule);
}
var ReferenceType = "ReferenceType";
function isReferenceType(item) {
	return reflection$1.isInstance(item, ReferenceType);
}
var ReturnType = "ReturnType";
function isReturnType(item) {
	return reflection$1.isInstance(item, ReturnType);
}
var SimpleType = "SimpleType";
function isSimpleType(item) {
	return reflection$1.isInstance(item, SimpleType);
}
var StringLiteral = "StringLiteral";
function isStringLiteral(item) {
	return reflection$1.isInstance(item, StringLiteral);
}
var TerminalRule = "TerminalRule";
function isTerminalRule(item) {
	return reflection$1.isInstance(item, TerminalRule);
}
var Type = "Type";
function isType(item) {
	return reflection$1.isInstance(item, Type);
}
var TypeAttribute = "TypeAttribute";
function isTypeAttribute(item) {
	return reflection$1.isInstance(item, TypeAttribute);
}
var UnionType = "UnionType";
function isUnionType(item) {
	return reflection$1.isInstance(item, UnionType);
}
var Action = "Action";
function isAction(item) {
	return reflection$1.isInstance(item, Action);
}
var Alternatives = "Alternatives";
function isAlternatives(item) {
	return reflection$1.isInstance(item, Alternatives);
}
var Assignment = "Assignment";
function isAssignment(item) {
	return reflection$1.isInstance(item, Assignment);
}
var CharacterRange = "CharacterRange";
function isCharacterRange(item) {
	return reflection$1.isInstance(item, CharacterRange);
}
var CrossReference = "CrossReference";
function isCrossReference(item) {
	return reflection$1.isInstance(item, CrossReference);
}
var EndOfFile = "EndOfFile";
function isEndOfFile(item) {
	return reflection$1.isInstance(item, EndOfFile);
}
var Group$1 = "Group";
function isGroup(item) {
	return reflection$1.isInstance(item, Group$1);
}
var Keyword = "Keyword";
function isKeyword(item) {
	return reflection$1.isInstance(item, Keyword);
}
var NegatedToken = "NegatedToken";
function isNegatedToken(item) {
	return reflection$1.isInstance(item, NegatedToken);
}
var RegexToken = "RegexToken";
function isRegexToken(item) {
	return reflection$1.isInstance(item, RegexToken);
}
var RuleCall = "RuleCall";
function isRuleCall(item) {
	return reflection$1.isInstance(item, RuleCall);
}
var TerminalAlternatives = "TerminalAlternatives";
function isTerminalAlternatives(item) {
	return reflection$1.isInstance(item, TerminalAlternatives);
}
var TerminalGroup = "TerminalGroup";
function isTerminalGroup(item) {
	return reflection$1.isInstance(item, TerminalGroup);
}
var TerminalRuleCall = "TerminalRuleCall";
function isTerminalRuleCall(item) {
	return reflection$1.isInstance(item, TerminalRuleCall);
}
var UnorderedGroup = "UnorderedGroup";
function isUnorderedGroup(item) {
	return reflection$1.isInstance(item, UnorderedGroup);
}
var UntilToken = "UntilToken";
function isUntilToken(item) {
	return reflection$1.isInstance(item, UntilToken);
}
var Wildcard = "Wildcard";
function isWildcard(item) {
	return reflection$1.isInstance(item, Wildcard);
}
var LangiumGrammarAstReflection = class extends AbstractAstReflection {
	getAllTypes() {
		return [
			AbstractElement,
			AbstractRule,
			AbstractType,
			Action,
			Alternatives,
			ArrayLiteral,
			ArrayType,
			Assignment,
			BooleanLiteral,
			CharacterRange,
			Condition,
			Conjunction,
			CrossReference,
			Disjunction,
			EndOfFile,
			Grammar,
			GrammarImport,
			Group$1,
			InferredType,
			Interface,
			Keyword,
			NamedArgument,
			NegatedToken,
			Negation,
			NumberLiteral,
			Parameter,
			ParameterReference,
			ParserRule,
			ReferenceType,
			RegexToken,
			ReturnType,
			RuleCall,
			SimpleType,
			StringLiteral,
			TerminalAlternatives,
			TerminalGroup,
			TerminalRule,
			TerminalRuleCall,
			Type,
			TypeAttribute,
			TypeDefinition,
			UnionType,
			UnorderedGroup,
			UntilToken,
			ValueLiteral,
			Wildcard
		];
	}
	computeIsSubtype(subtype, supertype) {
		switch (subtype) {
			case Action:
			case Alternatives:
			case Assignment:
			case CharacterRange:
			case CrossReference:
			case EndOfFile:
			case Group$1:
			case Keyword:
			case NegatedToken:
			case RegexToken:
			case RuleCall:
			case TerminalAlternatives:
			case TerminalGroup:
			case TerminalRuleCall:
			case UnorderedGroup:
			case UntilToken:
			case Wildcard: return this.isSubtype(AbstractElement, supertype);
			case ArrayLiteral:
			case NumberLiteral:
			case StringLiteral: return this.isSubtype(ValueLiteral, supertype);
			case ArrayType:
			case ReferenceType:
			case SimpleType:
			case UnionType: return this.isSubtype(TypeDefinition, supertype);
			case BooleanLiteral: return this.isSubtype("Condition", supertype) || this.isSubtype("ValueLiteral", supertype);
			case Conjunction:
			case Disjunction:
			case Negation:
			case ParameterReference: return this.isSubtype(Condition, supertype);
			case InferredType:
			case Interface:
			case Type: return this.isSubtype(AbstractType, supertype);
			case ParserRule: return this.isSubtype("AbstractRule", supertype) || this.isSubtype("AbstractType", supertype);
			case TerminalRule: return this.isSubtype(AbstractRule, supertype);
			default: return false;
		}
	}
	getReferenceType(refInfo) {
		const referenceId = `${refInfo.container.$type}:${refInfo.property}`;
		switch (referenceId) {
			case "Action:type":
			case "CrossReference:type":
			case "Interface:superTypes":
			case "ParserRule:returnType":
			case "SimpleType:typeRef": return AbstractType;
			case "Grammar:hiddenTokens":
			case "ParserRule:hiddenTokens":
			case "RuleCall:rule": return AbstractRule;
			case "Grammar:usedGrammars": return Grammar;
			case "NamedArgument:parameter":
			case "ParameterReference:parameter": return Parameter;
			case "TerminalRuleCall:rule": return TerminalRule;
			default: throw new Error(`${referenceId} is not a valid reference id.`);
		}
	}
	getTypeMetaData(type) {
		switch (type) {
			case AbstractElement: return {
				name: AbstractElement,
				properties: [{ name: "cardinality" }, { name: "lookahead" }]
			};
			case ArrayLiteral: return {
				name: ArrayLiteral,
				properties: [{
					name: "elements",
					defaultValue: []
				}]
			};
			case ArrayType: return {
				name: ArrayType,
				properties: [{ name: "elementType" }]
			};
			case BooleanLiteral: return {
				name: BooleanLiteral,
				properties: [{
					name: "true",
					defaultValue: false
				}]
			};
			case Conjunction: return {
				name: Conjunction,
				properties: [{ name: "left" }, { name: "right" }]
			};
			case Disjunction: return {
				name: Disjunction,
				properties: [{ name: "left" }, { name: "right" }]
			};
			case Grammar: return {
				name: Grammar,
				properties: [
					{
						name: "definesHiddenTokens",
						defaultValue: false
					},
					{
						name: "hiddenTokens",
						defaultValue: []
					},
					{
						name: "imports",
						defaultValue: []
					},
					{
						name: "interfaces",
						defaultValue: []
					},
					{
						name: "isDeclared",
						defaultValue: false
					},
					{ name: "name" },
					{
						name: "rules",
						defaultValue: []
					},
					{
						name: "types",
						defaultValue: []
					},
					{
						name: "usedGrammars",
						defaultValue: []
					}
				]
			};
			case GrammarImport: return {
				name: GrammarImport,
				properties: [{ name: "path" }]
			};
			case InferredType: return {
				name: InferredType,
				properties: [{ name: "name" }]
			};
			case Interface: return {
				name: Interface,
				properties: [
					{
						name: "attributes",
						defaultValue: []
					},
					{ name: "name" },
					{
						name: "superTypes",
						defaultValue: []
					}
				]
			};
			case NamedArgument: return {
				name: NamedArgument,
				properties: [
					{
						name: "calledByName",
						defaultValue: false
					},
					{ name: "parameter" },
					{ name: "value" }
				]
			};
			case Negation: return {
				name: Negation,
				properties: [{ name: "value" }]
			};
			case NumberLiteral: return {
				name: NumberLiteral,
				properties: [{ name: "value" }]
			};
			case Parameter: return {
				name: Parameter,
				properties: [{ name: "name" }]
			};
			case ParameterReference: return {
				name: ParameterReference,
				properties: [{ name: "parameter" }]
			};
			case ParserRule: return {
				name: ParserRule,
				properties: [
					{ name: "dataType" },
					{
						name: "definesHiddenTokens",
						defaultValue: false
					},
					{ name: "definition" },
					{
						name: "entry",
						defaultValue: false
					},
					{
						name: "fragment",
						defaultValue: false
					},
					{
						name: "hiddenTokens",
						defaultValue: []
					},
					{ name: "inferredType" },
					{ name: "name" },
					{
						name: "parameters",
						defaultValue: []
					},
					{ name: "returnType" },
					{
						name: "wildcard",
						defaultValue: false
					}
				]
			};
			case ReferenceType: return {
				name: ReferenceType,
				properties: [{ name: "referenceType" }]
			};
			case ReturnType: return {
				name: ReturnType,
				properties: [{ name: "name" }]
			};
			case SimpleType: return {
				name: SimpleType,
				properties: [
					{ name: "primitiveType" },
					{ name: "stringType" },
					{ name: "typeRef" }
				]
			};
			case StringLiteral: return {
				name: StringLiteral,
				properties: [{ name: "value" }]
			};
			case TerminalRule: return {
				name: TerminalRule,
				properties: [
					{ name: "definition" },
					{
						name: "fragment",
						defaultValue: false
					},
					{
						name: "hidden",
						defaultValue: false
					},
					{ name: "name" },
					{ name: "type" }
				]
			};
			case Type: return {
				name: Type,
				properties: [{ name: "name" }, { name: "type" }]
			};
			case TypeAttribute: return {
				name: TypeAttribute,
				properties: [
					{ name: "defaultValue" },
					{
						name: "isOptional",
						defaultValue: false
					},
					{ name: "name" },
					{ name: "type" }
				]
			};
			case UnionType: return {
				name: UnionType,
				properties: [{
					name: "types",
					defaultValue: []
				}]
			};
			case Action: return {
				name: Action,
				properties: [
					{ name: "cardinality" },
					{ name: "feature" },
					{ name: "inferredType" },
					{ name: "lookahead" },
					{ name: "operator" },
					{ name: "type" }
				]
			};
			case Alternatives: return {
				name: Alternatives,
				properties: [
					{ name: "cardinality" },
					{
						name: "elements",
						defaultValue: []
					},
					{ name: "lookahead" }
				]
			};
			case Assignment: return {
				name: Assignment,
				properties: [
					{ name: "cardinality" },
					{ name: "feature" },
					{ name: "lookahead" },
					{ name: "operator" },
					{ name: "terminal" }
				]
			};
			case CharacterRange: return {
				name: CharacterRange,
				properties: [
					{ name: "cardinality" },
					{ name: "left" },
					{ name: "lookahead" },
					{ name: "right" }
				]
			};
			case CrossReference: return {
				name: CrossReference,
				properties: [
					{ name: "cardinality" },
					{
						name: "deprecatedSyntax",
						defaultValue: false
					},
					{ name: "lookahead" },
					{ name: "terminal" },
					{ name: "type" }
				]
			};
			case EndOfFile: return {
				name: EndOfFile,
				properties: [{ name: "cardinality" }, { name: "lookahead" }]
			};
			case Group$1: return {
				name: Group$1,
				properties: [
					{ name: "cardinality" },
					{
						name: "elements",
						defaultValue: []
					},
					{ name: "guardCondition" },
					{ name: "lookahead" }
				]
			};
			case Keyword: return {
				name: Keyword,
				properties: [
					{ name: "cardinality" },
					{ name: "lookahead" },
					{ name: "value" }
				]
			};
			case NegatedToken: return {
				name: NegatedToken,
				properties: [
					{ name: "cardinality" },
					{ name: "lookahead" },
					{ name: "terminal" }
				]
			};
			case RegexToken: return {
				name: RegexToken,
				properties: [
					{ name: "cardinality" },
					{ name: "lookahead" },
					{ name: "regex" }
				]
			};
			case RuleCall: return {
				name: RuleCall,
				properties: [
					{
						name: "arguments",
						defaultValue: []
					},
					{ name: "cardinality" },
					{ name: "lookahead" },
					{ name: "rule" }
				]
			};
			case TerminalAlternatives: return {
				name: TerminalAlternatives,
				properties: [
					{ name: "cardinality" },
					{
						name: "elements",
						defaultValue: []
					},
					{ name: "lookahead" }
				]
			};
			case TerminalGroup: return {
				name: TerminalGroup,
				properties: [
					{ name: "cardinality" },
					{
						name: "elements",
						defaultValue: []
					},
					{ name: "lookahead" }
				]
			};
			case TerminalRuleCall: return {
				name: TerminalRuleCall,
				properties: [
					{ name: "cardinality" },
					{ name: "lookahead" },
					{ name: "rule" }
				]
			};
			case UnorderedGroup: return {
				name: UnorderedGroup,
				properties: [
					{ name: "cardinality" },
					{
						name: "elements",
						defaultValue: []
					},
					{ name: "lookahead" }
				]
			};
			case UntilToken: return {
				name: UntilToken,
				properties: [
					{ name: "cardinality" },
					{ name: "lookahead" },
					{ name: "terminal" }
				]
			};
			case Wildcard: return {
				name: Wildcard,
				properties: [{ name: "cardinality" }, { name: "lookahead" }]
			};
			default: return {
				name: type,
				properties: []
			};
		}
	}
};
var reflection$1 = new LangiumGrammarAstReflection();
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/utils/ast-utils.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var ast_utils_exports = /* @__PURE__ */ __exportAll({
	assignMandatoryProperties: () => assignMandatoryProperties,
	copyAstNode: () => copyAstNode,
	findLocalReferences: () => findLocalReferences,
	findRootNode: () => findRootNode,
	getContainerOfType: () => getContainerOfType,
	getDocument: () => getDocument,
	hasContainerOfType: () => hasContainerOfType,
	linkContentToContainer: () => linkContentToContainer,
	streamAllContents: () => streamAllContents,
	streamAst: () => streamAst,
	streamContents: () => streamContents,
	streamReferences: () => streamReferences
});
/**
* Link the `$container` and other related properties of every AST node that is directly contained
* in the given `node`.
*/
function linkContentToContainer(node) {
	for (const [name, value] of Object.entries(node)) if (!name.startsWith("$")) {
		if (Array.isArray(value)) value.forEach((item, index) => {
			if (isAstNode(item)) {
				item.$container = node;
				item.$containerProperty = name;
				item.$containerIndex = index;
			}
		});
		else if (isAstNode(value)) {
			value.$container = node;
			value.$containerProperty = name;
		}
	}
}
/**
* Walk along the hierarchy of containers from the given AST node to the root and return the first
* node that matches the type predicate. If the start node itself matches, it is returned.
* If no container matches, `undefined` is returned.
*/
function getContainerOfType(node, typePredicate) {
	let item = node;
	while (item) {
		if (typePredicate(item)) return item;
		item = item.$container;
	}
}
/**
* Walk along the hierarchy of containers from the given AST node to the root and check for existence
* of a container that matches the given predicate. The start node is included in the checks.
*/
function hasContainerOfType(node, predicate) {
	let item = node;
	while (item) {
		if (predicate(item)) return true;
		item = item.$container;
	}
	return false;
}
/**
* Retrieve the document in which the given AST node is contained. A reference to the document is
* usually held by the root node of the AST.
*
* @throws an error if the node is not contained in a document.
*/
function getDocument(node) {
	const result = findRootNode(node).$document;
	if (!result) throw new Error("AST node has no document.");
	return result;
}
/**
* Returns the root node of the given AST node by following the `$container` references.
*/
function findRootNode(node) {
	while (node.$container) node = node.$container;
	return node;
}
/**
* Create a stream of all AST nodes that are directly contained in the given node. This includes
* single-valued as well as multi-valued (array) properties.
*/
function streamContents(node, options) {
	if (!node) throw new Error("Node must be an AstNode.");
	const range = options === null || options === void 0 ? void 0 : options.range;
	return new StreamImpl(() => ({
		keys: Object.keys(node),
		keyIndex: 0,
		arrayIndex: 0
	}), (state) => {
		while (state.keyIndex < state.keys.length) {
			const property = state.keys[state.keyIndex];
			if (!property.startsWith("$")) {
				const value = node[property];
				if (isAstNode(value)) {
					state.keyIndex++;
					if (isAstNodeInRange(value, range)) return {
						done: false,
						value
					};
				} else if (Array.isArray(value)) {
					while (state.arrayIndex < value.length) {
						const element = value[state.arrayIndex++];
						if (isAstNode(element) && isAstNodeInRange(element, range)) return {
							done: false,
							value: element
						};
					}
					state.arrayIndex = 0;
				}
			}
			state.keyIndex++;
		}
		return DONE_RESULT;
	});
}
/**
* Create a stream of all AST nodes that are directly and indirectly contained in the given root node.
* This does not include the root node itself.
*/
function streamAllContents(root, options) {
	if (!root) throw new Error("Root node must be an AstNode.");
	return new TreeStreamImpl(root, (node) => streamContents(node, options));
}
/**
* Create a stream of all AST nodes that are directly and indirectly contained in the given root node,
* including the root node itself.
*/
function streamAst(root, options) {
	if (!root) throw new Error("Root node must be an AstNode.");
	else if ((options === null || options === void 0 ? void 0 : options.range) && !isAstNodeInRange(root, options.range)) return new TreeStreamImpl(root, () => []);
	return new TreeStreamImpl(root, (node) => streamContents(node, options), { includeRoot: true });
}
function isAstNodeInRange(astNode, range) {
	var _a;
	if (!range) return true;
	const nodeRange = (_a = astNode.$cstNode) === null || _a === void 0 ? void 0 : _a.range;
	if (!nodeRange) return false;
	return inRange(nodeRange, range);
}
/**
* Create a stream of all cross-references that are held by the given AST node. This includes
* single-valued as well as multi-valued (array) properties.
*/
function streamReferences(node) {
	return new StreamImpl(() => ({
		keys: Object.keys(node),
		keyIndex: 0,
		arrayIndex: 0
	}), (state) => {
		while (state.keyIndex < state.keys.length) {
			const property = state.keys[state.keyIndex];
			if (!property.startsWith("$")) {
				const value = node[property];
				if (isReference(value)) {
					state.keyIndex++;
					return {
						done: false,
						value: {
							reference: value,
							container: node,
							property
						}
					};
				} else if (Array.isArray(value)) {
					while (state.arrayIndex < value.length) {
						const index = state.arrayIndex++;
						const element = value[index];
						if (isReference(element)) return {
							done: false,
							value: {
								reference: element,
								container: node,
								property,
								index
							}
						};
					}
					state.arrayIndex = 0;
				}
			}
			state.keyIndex++;
		}
		return DONE_RESULT;
	});
}
/**
* Returns a Stream of references to the target node from the AstNode tree
*
* @param targetNode AstNode we are looking for
* @param lookup AstNode where we search for references. If not provided, the root node of the document is used as the default value
*/
function findLocalReferences(targetNode, lookup = getDocument(targetNode).parseResult.value) {
	const refs = [];
	streamAst(lookup).forEach((node) => {
		streamReferences(node).forEach((refInfo) => {
			if (refInfo.reference.ref === targetNode) refs.push(refInfo.reference);
		});
	});
	return stream(refs);
}
/**
* Assigns all mandatory AST properties to the specified node.
*
* @param reflection Reflection object used to gather mandatory properties for the node.
* @param node Specified node is modified in place and properties are directly assigned.
*/
function assignMandatoryProperties(reflection, node) {
	const typeMetaData = reflection.getTypeMetaData(node.$type);
	const genericNode = node;
	for (const property of typeMetaData.properties) if (property.defaultValue !== void 0 && genericNode[property.name] === void 0) genericNode[property.name] = copyDefaultValue(property.defaultValue);
}
function copyDefaultValue(propertyType) {
	if (Array.isArray(propertyType)) return [...propertyType.map(copyDefaultValue)];
	else return propertyType;
}
/**
* Creates a deep copy of the specified AST node.
* The resulting copy will only contain semantically relevant information, such as the `$type` property and AST properties.
*
* References are copied without resolved cross reference. The specified function is used to rebuild them.
*/
function copyAstNode(node, buildReference) {
	const copy = { $type: node.$type };
	for (const [name, value] of Object.entries(node)) if (!name.startsWith("$")) {
		if (isAstNode(value)) copy[name] = copyAstNode(value, buildReference);
		else if (isReference(value)) copy[name] = buildReference(copy, name, value.$refNode, value.$refText);
		else if (Array.isArray(value)) {
			const copiedArray = [];
			for (const element of value) if (isAstNode(element)) copiedArray.push(copyAstNode(element, buildReference));
			else if (isReference(element)) copiedArray.push(buildReference(copy, name, element.$refNode, element.$refText));
			else copiedArray.push(element);
			copy[name] = copiedArray;
		} else copy[name] = value;
	}
	linkContentToContainer(copy);
	return copy;
}
// ../../node_modules/.pnpm/@chevrotain+regexp-to-ast@11.0.3/node_modules/@chevrotain/regexp-to-ast/lib/src/utils.js
function cc(char) {
	return char.charCodeAt(0);
}
function insertToSet(item, set) {
	if (Array.isArray(item)) item.forEach(function(subItem) {
		set.push(subItem);
	});
	else set.push(item);
}
function addFlag(flagObj, flagKey) {
	if (flagObj[flagKey] === true) throw "duplicate flag " + flagKey;
	flagObj[flagKey];
	flagObj[flagKey] = true;
}
function ASSERT_EXISTS(obj) {
	// istanbul ignore next
	if (obj === void 0) throw Error("Internal Error - Should never get here!");
	return true;
}
// istanbul ignore next
function ASSERT_NEVER_REACH_HERE() {
	throw Error("Internal Error - Should never get here!");
}
function isCharacter(obj) {
	return obj["type"] === "Character";
}
// ../../node_modules/.pnpm/@chevrotain+regexp-to-ast@11.0.3/node_modules/@chevrotain/regexp-to-ast/lib/src/character-classes.js
var digitsCharCodes = [];
for (let i = cc("0"); i <= cc("9"); i++) digitsCharCodes.push(i);
var wordCharCodes = [cc("_")].concat(digitsCharCodes);
for (let i = cc("a"); i <= cc("z"); i++) wordCharCodes.push(i);
for (let i = cc("A"); i <= cc("Z"); i++) wordCharCodes.push(i);
var whitespaceCodes = [
	cc(" "),
	cc("\f"),
	cc("\n"),
	cc("\r"),
	cc("	"),
	cc("\v"),
	cc("	"),
	cc("\xA0"),
	cc(" "),
	cc(" "),
	cc(" "),
	cc(" "),
	cc(" "),
	cc(" "),
	cc(" "),
	cc(" "),
	cc(" "),
	cc(" "),
	cc(" "),
	cc(" "),
	cc("\u2028"),
	cc("\u2029"),
	cc(" "),
	cc(" "),
	cc("　"),
	cc("﻿")
];
// ../../node_modules/.pnpm/@chevrotain+regexp-to-ast@11.0.3/node_modules/@chevrotain/regexp-to-ast/lib/src/regexp-parser.js
var hexDigitPattern = /[0-9a-fA-F]/;
var decimalPattern = /[0-9]/;
var decimalPatternNoZero = /[1-9]/;
var RegExpParser = class {
	constructor() {
		this.idx = 0;
		this.input = "";
		this.groupIdx = 0;
	}
	saveState() {
		return {
			idx: this.idx,
			input: this.input,
			groupIdx: this.groupIdx
		};
	}
	restoreState(newState) {
		this.idx = newState.idx;
		this.input = newState.input;
		this.groupIdx = newState.groupIdx;
	}
	pattern(input) {
		this.idx = 0;
		this.input = input;
		this.groupIdx = 0;
		this.consumeChar("/");
		const value = this.disjunction();
		this.consumeChar("/");
		const flags = {
			type: "Flags",
			loc: {
				begin: this.idx,
				end: input.length
			},
			global: false,
			ignoreCase: false,
			multiLine: false,
			unicode: false,
			sticky: false
		};
		while (this.isRegExpFlag()) switch (this.popChar()) {
			case "g":
				addFlag(flags, "global");
				break;
			case "i":
				addFlag(flags, "ignoreCase");
				break;
			case "m":
				addFlag(flags, "multiLine");
				break;
			case "u":
				addFlag(flags, "unicode");
				break;
			case "y": addFlag(flags, "sticky");
		}
		if (this.idx !== this.input.length) throw Error("Redundant input: " + this.input.substring(this.idx));
		return {
			type: "Pattern",
			flags,
			value,
			loc: this.loc(0)
		};
	}
	disjunction() {
		const alts = [];
		const begin = this.idx;
		alts.push(this.alternative());
		while (this.peekChar() === "|") {
			this.consumeChar("|");
			alts.push(this.alternative());
		}
		return {
			type: "Disjunction",
			value: alts,
			loc: this.loc(begin)
		};
	}
	alternative() {
		const terms = [];
		const begin = this.idx;
		while (this.isTerm()) terms.push(this.term());
		return {
			type: "Alternative",
			value: terms,
			loc: this.loc(begin)
		};
	}
	term() {
		if (this.isAssertion()) return this.assertion();
		else return this.atom();
	}
	assertion() {
		const begin = this.idx;
		switch (this.popChar()) {
			case "^": return {
				type: "StartAnchor",
				loc: this.loc(begin)
			};
			case "$": return {
				type: "EndAnchor",
				loc: this.loc(begin)
			};
			case "\\":
				switch (this.popChar()) {
					case "b": return {
						type: "WordBoundary",
						loc: this.loc(begin)
					};
					case "B": return {
						type: "NonWordBoundary",
						loc: this.loc(begin)
					};
				}
				// istanbul ignore next
				throw Error("Invalid Assertion Escape");
			case "(":
				this.consumeChar("?");
				let type;
				switch (this.popChar()) {
					case "=":
						type = "Lookahead";
						break;
					case "!": type = "NegativeLookahead";
				}
				ASSERT_EXISTS(type);
				const disjunction = this.disjunction();
				this.consumeChar(")");
				return {
					type,
					value: disjunction,
					loc: this.loc(begin)
				};
		}
		// istanbul ignore next
		return ASSERT_NEVER_REACH_HERE();
	}
	quantifier(isBacktracking = false) {
		let range = void 0;
		const begin = this.idx;
		switch (this.popChar()) {
			case "*":
				range = {
					atLeast: 0,
					atMost: Infinity
				};
				break;
			case "+":
				range = {
					atLeast: 1,
					atMost: Infinity
				};
				break;
			case "?":
				range = {
					atLeast: 0,
					atMost: 1
				};
				break;
			case "{":
				const atLeast = this.integerIncludingZero();
				switch (this.popChar()) {
					case "}":
						range = {
							atLeast,
							atMost: atLeast
						};
						break;
					case ",":
						let atMost;
						if (this.isDigit()) {
							atMost = this.integerIncludingZero();
							range = {
								atLeast,
								atMost
							};
						} else range = {
							atLeast,
							atMost: Infinity
						};
						this.consumeChar("}");
				}
				if (isBacktracking === true && range === void 0) return;
				ASSERT_EXISTS(range);
		}
		if (isBacktracking === true && range === void 0) return;
		// istanbul ignore else
		if (ASSERT_EXISTS(range)) {
			if (this.peekChar(0) === "?") {
				this.consumeChar("?");
				range.greedy = false;
			} else range.greedy = true;
			range.type = "Quantifier";
			range.loc = this.loc(begin);
			return range;
		}
	}
	atom() {
		let atom;
		const begin = this.idx;
		switch (this.peekChar()) {
			case ".":
				atom = this.dotAll();
				break;
			case "\\":
				atom = this.atomEscape();
				break;
			case "[":
				atom = this.characterClass();
				break;
			case "(": atom = this.group();
		}
		if (atom === void 0 && this.isPatternCharacter()) atom = this.patternCharacter();
		// istanbul ignore else
		if (ASSERT_EXISTS(atom)) {
			atom.loc = this.loc(begin);
			if (this.isQuantifier()) atom.quantifier = this.quantifier();
			return atom;
		}
		// istanbul ignore next
		return ASSERT_NEVER_REACH_HERE();
	}
	dotAll() {
		this.consumeChar(".");
		return {
			type: "Set",
			complement: true,
			value: [
				cc("\n"),
				cc("\r"),
				cc("\u2028"),
				cc("\u2029")
			]
		};
	}
	atomEscape() {
		this.consumeChar("\\");
		switch (this.peekChar()) {
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9": return this.decimalEscapeAtom();
			case "d":
			case "D":
			case "s":
			case "S":
			case "w":
			case "W": return this.characterClassEscape();
			case "f":
			case "n":
			case "r":
			case "t":
			case "v": return this.controlEscapeAtom();
			case "c": return this.controlLetterEscapeAtom();
			case "0": return this.nulCharacterAtom();
			case "x": return this.hexEscapeSequenceAtom();
			case "u": return this.regExpUnicodeEscapeSequenceAtom();
			default: return this.identityEscapeAtom();
		}
	}
	decimalEscapeAtom() {
		return {
			type: "GroupBackReference",
			value: this.positiveInteger()
		};
	}
	characterClassEscape() {
		let set;
		let complement = false;
		switch (this.popChar()) {
			case "d":
				set = digitsCharCodes;
				break;
			case "D":
				set = digitsCharCodes;
				complement = true;
				break;
			case "s":
				set = whitespaceCodes;
				break;
			case "S":
				set = whitespaceCodes;
				complement = true;
				break;
			case "w":
				set = wordCharCodes;
				break;
			case "W":
				set = wordCharCodes;
				complement = true;
		}
		// istanbul ignore else
		if (ASSERT_EXISTS(set)) return {
			type: "Set",
			value: set,
			complement
		};
		// istanbul ignore next
		return ASSERT_NEVER_REACH_HERE();
	}
	controlEscapeAtom() {
		let escapeCode;
		switch (this.popChar()) {
			case "f":
				escapeCode = cc("\f");
				break;
			case "n":
				escapeCode = cc("\n");
				break;
			case "r":
				escapeCode = cc("\r");
				break;
			case "t":
				escapeCode = cc("	");
				break;
			case "v": escapeCode = cc("\v");
		}
		// istanbul ignore else
		if (ASSERT_EXISTS(escapeCode)) return {
			type: "Character",
			value: escapeCode
		};
		// istanbul ignore next
		return ASSERT_NEVER_REACH_HERE();
	}
	controlLetterEscapeAtom() {
		this.consumeChar("c");
		const letter = this.popChar();
		if (/[a-zA-Z]/.test(letter) === false) throw Error("Invalid ");
		return {
			type: "Character",
			value: letter.toUpperCase().charCodeAt(0) - 64
		};
	}
	nulCharacterAtom() {
		this.consumeChar("0");
		return {
			type: "Character",
			value: cc("\0")
		};
	}
	hexEscapeSequenceAtom() {
		this.consumeChar("x");
		return this.parseHexDigits(2);
	}
	regExpUnicodeEscapeSequenceAtom() {
		this.consumeChar("u");
		return this.parseHexDigits(4);
	}
	identityEscapeAtom() {
		return {
			type: "Character",
			value: cc(this.popChar())
		};
	}
	classPatternCharacterAtom() {
		switch (this.peekChar()) {
			// istanbul ignore next
			case "\n":
			// istanbul ignore next
			case "\r":
			// istanbul ignore next
			case "\u2028":
			// istanbul ignore next
			case "\u2029":
			// istanbul ignore next
			case "\\":
			// istanbul ignore next
			case "]": throw Error("TBD");
			default: return {
				type: "Character",
				value: cc(this.popChar())
			};
		}
	}
	characterClass() {
		const set = [];
		let complement = false;
		this.consumeChar("[");
		if (this.peekChar(0) === "^") {
			this.consumeChar("^");
			complement = true;
		}
		while (this.isClassAtom()) {
			const from = this.classAtom();
			from.type;
			if (isCharacter(from) && this.isRangeDash()) {
				this.consumeChar("-");
				const to = this.classAtom();
				to.type;
				if (isCharacter(to)) {
					if (to.value < from.value) throw Error("Range out of order in character class");
					set.push({
						from: from.value,
						to: to.value
					});
				} else {
					insertToSet(from.value, set);
					set.push(cc("-"));
					insertToSet(to.value, set);
				}
			} else insertToSet(from.value, set);
		}
		this.consumeChar("]");
		return {
			type: "Set",
			complement,
			value: set
		};
	}
	classAtom() {
		switch (this.peekChar()) {
			// istanbul ignore next
			case "]":
			// istanbul ignore next
			case "\n":
			// istanbul ignore next
			case "\r":
			// istanbul ignore next
			case "\u2028":
			// istanbul ignore next
			case "\u2029": throw Error("TBD");
			case "\\": return this.classEscape();
			default: return this.classPatternCharacterAtom();
		}
	}
	classEscape() {
		this.consumeChar("\\");
		switch (this.peekChar()) {
			case "b":
				this.consumeChar("b");
				return {
					type: "Character",
					value: cc("\b")
				};
			case "d":
			case "D":
			case "s":
			case "S":
			case "w":
			case "W": return this.characterClassEscape();
			case "f":
			case "n":
			case "r":
			case "t":
			case "v": return this.controlEscapeAtom();
			case "c": return this.controlLetterEscapeAtom();
			case "0": return this.nulCharacterAtom();
			case "x": return this.hexEscapeSequenceAtom();
			case "u": return this.regExpUnicodeEscapeSequenceAtom();
			default: return this.identityEscapeAtom();
		}
	}
	group() {
		let capturing = true;
		this.consumeChar("(");
		switch (this.peekChar(0)) {
			case "?":
				this.consumeChar("?");
				this.consumeChar(":");
				capturing = false;
				break;
			default: this.groupIdx++;
		}
		const value = this.disjunction();
		this.consumeChar(")");
		const groupAst = {
			type: "Group",
			capturing,
			value
		};
		if (capturing) groupAst["idx"] = this.groupIdx;
		return groupAst;
	}
	positiveInteger() {
		let number = this.popChar();
		// istanbul ignore next - can't ever get here due to previous lookahead checks
		if (decimalPatternNoZero.test(number) === false) throw Error("Expecting a positive integer");
		while (decimalPattern.test(this.peekChar(0))) number += this.popChar();
		return parseInt(number, 10);
	}
	integerIncludingZero() {
		let number = this.popChar();
		if (decimalPattern.test(number) === false) throw Error("Expecting an integer");
		while (decimalPattern.test(this.peekChar(0))) number += this.popChar();
		return parseInt(number, 10);
	}
	patternCharacter() {
		const nextChar = this.popChar();
		switch (nextChar) {
			// istanbul ignore next
			case "\n":
			// istanbul ignore next
			case "\r":
			// istanbul ignore next
			case "\u2028":
			// istanbul ignore next
			case "\u2029":
			// istanbul ignore next
			case "^":
			// istanbul ignore next
			case "$":
			// istanbul ignore next
			case "\\":
			// istanbul ignore next
			case ".":
			// istanbul ignore next
			case "*":
			// istanbul ignore next
			case "+":
			// istanbul ignore next
			case "?":
			// istanbul ignore next
			case "(":
			// istanbul ignore next
			case ")":
			// istanbul ignore next
			case "[":
			// istanbul ignore next
			case "|":
 // istanbul ignore next
			throw Error("TBD");
			default: return {
				type: "Character",
				value: cc(nextChar)
			};
		}
	}
	isRegExpFlag() {
		switch (this.peekChar(0)) {
			case "g":
			case "i":
			case "m":
			case "u":
			case "y": return true;
			default: return false;
		}
	}
	isRangeDash() {
		return this.peekChar() === "-" && this.isClassAtom(1);
	}
	isDigit() {
		return decimalPattern.test(this.peekChar(0));
	}
	isClassAtom(howMuch = 0) {
		switch (this.peekChar(howMuch)) {
			case "]":
			case "\n":
			case "\r":
			case "\u2028":
			case "\u2029": return false;
			default: return true;
		}
	}
	isTerm() {
		return this.isAtom() || this.isAssertion();
	}
	isAtom() {
		if (this.isPatternCharacter()) return true;
		switch (this.peekChar(0)) {
			case ".":
			case "\\":
			case "[":
			case "(": return true;
			default: return false;
		}
	}
	isAssertion() {
		switch (this.peekChar(0)) {
			case "^":
			case "$": return true;
			case "\\": switch (this.peekChar(1)) {
				case "b":
				case "B": return true;
				default: return false;
			}
			case "(": return this.peekChar(1) === "?" && (this.peekChar(2) === "=" || this.peekChar(2) === "!");
			default: return false;
		}
	}
	isQuantifier() {
		const prevState = this.saveState();
		try {
			return this.quantifier(true) !== void 0;
		} catch (e) {
			return false;
		} finally {
			this.restoreState(prevState);
		}
	}
	isPatternCharacter() {
		switch (this.peekChar()) {
			case "^":
			case "$":
			case "\\":
			case ".":
			case "*":
			case "+":
			case "?":
			case "(":
			case ")":
			case "[":
			case "|":
			case "/":
			case "\n":
			case "\r":
			case "\u2028":
			case "\u2029": return false;
			default: return true;
		}
	}
	parseHexDigits(howMany) {
		let hexString = "";
		for (let i = 0; i < howMany; i++) {
			const hexChar = this.popChar();
			if (hexDigitPattern.test(hexChar) === false) throw Error("Expecting a HexDecimal digits");
			hexString += hexChar;
		}
		return {
			type: "Character",
			value: parseInt(hexString, 16)
		};
	}
	peekChar(howMuch = 0) {
		return this.input[this.idx + howMuch];
	}
	popChar() {
		const nextChar = this.peekChar(0);
		this.consumeChar(void 0);
		return nextChar;
	}
	consumeChar(char) {
		if (char !== void 0 && this.input[this.idx] !== char) throw Error("Expected: '" + char + "' but found: '" + this.input[this.idx] + "' at offset: " + this.idx);
		if (this.idx >= this.input.length) throw Error("Unexpected end of input");
		this.idx++;
	}
	loc(begin) {
		return {
			begin,
			end: this.idx
		};
	}
};
// ../../node_modules/.pnpm/@chevrotain+regexp-to-ast@11.0.3/node_modules/@chevrotain/regexp-to-ast/lib/src/base-regexp-visitor.js
var BaseRegExpVisitor = class {
	visitChildren(node) {
		for (const key in node) {
			const child = node[key];
			/* istanbul ignore else */
			if (node.hasOwnProperty(key)) {
				if (child.type !== void 0) this.visit(child);
				else if (Array.isArray(child)) child.forEach((subChild) => {
					this.visit(subChild);
				}, this);
			}
		}
	}
	visit(node) {
		switch (node.type) {
			case "Pattern":
				this.visitPattern(node);
				break;
			case "Flags":
				this.visitFlags(node);
				break;
			case "Disjunction":
				this.visitDisjunction(node);
				break;
			case "Alternative":
				this.visitAlternative(node);
				break;
			case "StartAnchor":
				this.visitStartAnchor(node);
				break;
			case "EndAnchor":
				this.visitEndAnchor(node);
				break;
			case "WordBoundary":
				this.visitWordBoundary(node);
				break;
			case "NonWordBoundary":
				this.visitNonWordBoundary(node);
				break;
			case "Lookahead":
				this.visitLookahead(node);
				break;
			case "NegativeLookahead":
				this.visitNegativeLookahead(node);
				break;
			case "Character":
				this.visitCharacter(node);
				break;
			case "Set":
				this.visitSet(node);
				break;
			case "Group":
				this.visitGroup(node);
				break;
			case "GroupBackReference":
				this.visitGroupBackReference(node);
				break;
			case "Quantifier": this.visitQuantifier(node);
		}
		this.visitChildren(node);
	}
	visitPattern(node) {}
	visitFlags(node) {}
	visitDisjunction(node) {}
	visitAlternative(node) {}
	visitStartAnchor(node) {}
	visitEndAnchor(node) {}
	visitWordBoundary(node) {}
	visitNonWordBoundary(node) {}
	visitLookahead(node) {}
	visitNegativeLookahead(node) {}
	visitCharacter(node) {}
	visitSet(node) {}
	visitGroup(node) {}
	visitGroupBackReference(node) {}
	visitQuantifier(node) {}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/utils/regexp-utils.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var regexp_utils_exports = /* @__PURE__ */ __exportAll({
	NEWLINE_REGEXP: () => NEWLINE_REGEXP,
	escapeRegExp: () => escapeRegExp,
	getCaseInsensitivePattern: () => getCaseInsensitivePattern,
	getTerminalParts: () => getTerminalParts,
	isMultilineComment: () => isMultilineComment,
	isWhitespace: () => isWhitespace,
	partialMatches: () => partialMatches,
	partialRegExp: () => partialRegExp,
	whitespaceCharacters: () => whitespaceCharacters
});
var NEWLINE_REGEXP = /\r?\n/gm;
var regexpParser = new RegExpParser();
/**
* This class is in charge of heuristically identifying start/end tokens of terminals.
*
* The way this works is by doing the following:
* 1. Traverse the regular expression in the "start state"
* 2. Add any encountered sets/single characters to the "start regexp"
* 3. Once we encounter any variable-length content (i.e. with quantifiers such as +/?/*), we enter the "end state"
* 4. In the end state, any sets/single characters are added to an "end stack".
* 5. If we re-encounter any variable-length content we reset the end stack
* 6. We continue visiting the regex until the end, reseting the end stack and rebuilding it as necessary
*
* After traversing a regular expression the `startRegexp/endRegexp` properties allow access to the stored start/end of the terminal
*/
var TerminalRegExpVisitor = class extends BaseRegExpVisitor {
	constructor() {
		super(...arguments);
		this.isStarting = true;
		this.endRegexpStack = [];
		this.multiline = false;
	}
	get endRegex() {
		return this.endRegexpStack.join("");
	}
	reset(regex) {
		this.multiline = false;
		this.regex = regex;
		this.startRegexp = "";
		this.isStarting = true;
		this.endRegexpStack = [];
	}
	visitGroup(node) {
		if (node.quantifier) {
			this.isStarting = false;
			this.endRegexpStack = [];
		}
	}
	visitCharacter(node) {
		const char = String.fromCharCode(node.value);
		if (!this.multiline && char === "\n") this.multiline = true;
		if (node.quantifier) {
			this.isStarting = false;
			this.endRegexpStack = [];
		} else {
			const escapedChar = escapeRegExp(char);
			this.endRegexpStack.push(escapedChar);
			if (this.isStarting) this.startRegexp += escapedChar;
		}
	}
	visitSet(node) {
		if (!this.multiline) {
			const set = this.regex.substring(node.loc.begin, node.loc.end);
			const regex = new RegExp(set);
			this.multiline = Boolean("\n".match(regex));
		}
		if (node.quantifier) {
			this.isStarting = false;
			this.endRegexpStack = [];
		} else {
			const set = this.regex.substring(node.loc.begin, node.loc.end);
			this.endRegexpStack.push(set);
			if (this.isStarting) this.startRegexp += set;
		}
	}
	visitChildren(node) {
		if (node.type === "Group") {
			if (node.quantifier) return;
		}
		super.visitChildren(node);
	}
};
var visitor = new TerminalRegExpVisitor();
function getTerminalParts(regexp) {
	try {
		if (typeof regexp !== "string") regexp = regexp.source;
		regexp = `/${regexp}/`;
		const pattern = regexpParser.pattern(regexp);
		const parts = [];
		for (const alternative of pattern.value.value) {
			visitor.reset(regexp);
			visitor.visit(alternative);
			parts.push({
				start: visitor.startRegexp,
				end: visitor.endRegex
			});
		}
		return parts;
	} catch (_a) {
		return [];
	}
}
function isMultilineComment(regexp) {
	try {
		if (typeof regexp === "string") regexp = new RegExp(regexp);
		regexp = regexp.toString();
		visitor.reset(regexp);
		visitor.visit(regexpParser.pattern(regexp));
		return visitor.multiline;
	} catch (_a) {
		return false;
	}
}
/**
* A set of all characters that are considered whitespace by the '\s' RegExp character class.
* Taken from [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Character_classes).
*/
var whitespaceCharacters = "\f\n\r	\v \xA0            \u2028\u2029  　﻿".split("");
function isWhitespace(value) {
	const regexp = typeof value === "string" ? new RegExp(value) : value;
	return whitespaceCharacters.some((ws) => regexp.test(ws));
}
function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function getCaseInsensitivePattern(keyword) {
	return Array.prototype.map.call(keyword, (letter) => /\w/.test(letter) ? `[${letter.toLowerCase()}${letter.toUpperCase()}]` : escapeRegExp(letter)).join("");
}
/**
* Determines whether the given input has a partial match with the specified regex.
* @param regex The regex to partially match against
* @param input The input string
* @returns Whether any match exists.
*/
function partialMatches(regex, input) {
	const partial = partialRegExp(regex);
	const match = input.match(partial);
	return !!match && match[0].length > 0;
}
/**
* Builds a partial regex from the input regex. A partial regex is able to match incomplete input strings. E.g.
* a partial regex constructed from `/ab/` is able to match the string `a` without needing a following `b` character. However it won't match `b` alone.
* @param regex The input regex to be converted.
* @returns A partial regex constructed from the input regex.
*/
function partialRegExp(regex) {
	if (typeof regex === "string") regex = new RegExp(regex);
	const re = regex, source = regex.source;
	let i = 0;
	function process() {
		let result = "", tmp;
		function appendRaw(nbChars) {
			result += source.substr(i, nbChars);
			i += nbChars;
		}
		function appendOptional(nbChars) {
			result += "(?:" + source.substr(i, nbChars) + "|$)";
			i += nbChars;
		}
		while (i < source.length) switch (source[i]) {
			case "\\":
				switch (source[i + 1]) {
					case "c":
						appendOptional(3);
						break;
					case "x":
						appendOptional(4);
						break;
					case "u":
						if (re.unicode) {
							if (source[i + 2] === "{") appendOptional(source.indexOf("}", i) - i + 1);
							else appendOptional(6);
						} else appendOptional(2);
						break;
					case "p":
					case "P":
						if (re.unicode) appendOptional(source.indexOf("}", i) - i + 1);
						else appendOptional(2);
						break;
					case "k":
						appendOptional(source.indexOf(">", i) - i + 1);
						break;
					default: appendOptional(2);
				}
				break;
			case "[":
				tmp = /\[(?:\\.|.)*?\]/g;
				tmp.lastIndex = i;
				tmp = tmp.exec(source) || [];
				appendOptional(tmp[0].length);
				break;
			case "|":
			case "^":
			case "$":
			case "*":
			case "+":
			case "?":
				appendRaw(1);
				break;
			case "{":
				tmp = /\{\d+,?\d*\}/g;
				tmp.lastIndex = i;
				tmp = tmp.exec(source);
				if (tmp) appendRaw(tmp[0].length);
				else appendOptional(1);
				break;
			case "(":
				if (source[i + 1] === "?") switch (source[i + 2]) {
					case ":":
						result += "(?:";
						i += 3;
						result += process() + "|$)";
						break;
					case "=":
						result += "(?=";
						i += 3;
						result += process() + ")";
						break;
					case "!":
						tmp = i;
						i += 3;
						process();
						result += source.substr(tmp, i - tmp);
						break;
					case "<": switch (source[i + 3]) {
						case "=":
						case "!":
							tmp = i;
							i += 4;
							process();
							result += source.substr(tmp, i - tmp);
							break;
						default:
							appendRaw(source.indexOf(">", i) - i + 1);
							result += process() + "|$)";
					}
				}
				else {
					appendRaw(1);
					result += process() + "|$)";
				}
				break;
			case ")":
				++i;
				return result;
			default: appendOptional(1);
		}
		return result;
	}
	return new RegExp(process(), regex.flags);
}
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/utils/grammar-utils.js
/******************************************************************************
* Copyright 2021-2022 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var grammar_utils_exports = /* @__PURE__ */ __exportAll({
	findAssignment: () => findAssignment,
	findNameAssignment: () => findNameAssignment,
	findNodeForKeyword: () => findNodeForKeyword,
	findNodeForProperty: () => findNodeForProperty,
	findNodesForKeyword: () => findNodesForKeyword,
	findNodesForKeywordInternal: () => findNodesForKeywordInternal,
	findNodesForProperty: () => findNodesForProperty,
	getActionAtElement: () => getActionAtElement,
	getActionType: () => getActionType,
	getAllReachableRules: () => getAllReachableRules,
	getCrossReferenceTerminal: () => getCrossReferenceTerminal,
	getEntryRule: () => getEntryRule,
	getExplicitRuleType: () => getExplicitRuleType,
	getHiddenRules: () => getHiddenRules,
	getRuleType: () => getRuleType,
	getRuleTypeName: () => getRuleTypeName,
	getTypeName: () => getTypeName,
	isArrayCardinality: () => isArrayCardinality,
	isArrayOperator: () => isArrayOperator,
	isCommentTerminal: () => isCommentTerminal,
	isDataType: () => isDataType,
	isDataTypeRule: () => isDataTypeRule,
	isOptionalCardinality: () => isOptionalCardinality,
	terminalRegex: () => terminalRegex
});
/**
* Returns the entry rule of the given grammar, if any. If the grammar file does not contain an entry rule,
* the result is `undefined`.
*/
function getEntryRule(grammar) {
	return grammar.rules.find((e) => isParserRule(e) && e.entry);
}
/**
* Returns all hidden terminal rules of the given grammar, if any.
*/
function getHiddenRules(grammar) {
	return grammar.rules.filter((e) => isTerminalRule(e) && e.hidden);
}
/**
* Returns all rules that can be reached from the topmost rules of the specified grammar (entry and hidden terminal rules).
*
* @param grammar The grammar that contains all rules
* @param allTerminals Whether or not to include terminals that are referenced only by other terminals
* @returns A list of referenced parser and terminal rules. If the grammar contains no entry rule,
*      this function returns all rules of the specified grammar.
*/
function getAllReachableRules(grammar, allTerminals) {
	const ruleNames = /* @__PURE__ */ new Set();
	const entryRule = getEntryRule(grammar);
	if (!entryRule) return new Set(grammar.rules);
	const topMostRules = [entryRule].concat(getHiddenRules(grammar));
	for (const rule of topMostRules) ruleDfs(rule, ruleNames, allTerminals);
	const rules = /* @__PURE__ */ new Set();
	for (const rule of grammar.rules) if (ruleNames.has(rule.name) || isTerminalRule(rule) && rule.hidden) rules.add(rule);
	return rules;
}
function ruleDfs(rule, visitedSet, allTerminals) {
	visitedSet.add(rule.name);
	streamAllContents(rule).forEach((node) => {
		if (isRuleCall(node) || allTerminals && isTerminalRuleCall(node)) {
			const refRule = node.rule.ref;
			if (refRule && !visitedSet.has(refRule.name)) ruleDfs(refRule, visitedSet, allTerminals);
		}
	});
}
/**
* Determines the grammar expression used to parse a cross-reference (usually a reference to a terminal rule).
* A cross-reference can declare this expression explicitly in the form `[Type : Terminal]`, but if `Terminal`
* is omitted, this function attempts to infer it from the name of the referenced `Type` (using `findNameAssignment`).
*
* Returns the grammar expression used to parse the given cross-reference, or `undefined` if it is not declared
* and cannot be inferred.
*/
function getCrossReferenceTerminal(crossRef) {
	if (crossRef.terminal) return crossRef.terminal;
	else if (crossRef.type.ref) {
		const nameAssigment = findNameAssignment(crossRef.type.ref);
		return nameAssigment === null || nameAssigment === void 0 ? void 0 : nameAssigment.terminal;
	}
}
/**
* Determines whether the given terminal rule represents a comment. This is true if the rule is marked
* as `hidden` and it does not match white space. This means every hidden token (i.e. excluded from the AST)
* that contains visible characters is considered a comment.
*/
function isCommentTerminal(terminalRule) {
	return terminalRule.hidden && !isWhitespace(terminalRegex(terminalRule));
}
/**
* Find all CST nodes within the given node that contribute to the specified property.
*
* @param node A CST node in which to look for property assignments. If this is undefined, the result is an empty array.
* @param property A property name of the constructed AST node. If this is undefined, the result is an empty array.
*/
function findNodesForProperty(node, property) {
	if (!node || !property) return [];
	return findNodesForPropertyInternal(node, property, node.astNode, true);
}
/**
* Find a single CST node within the given node that contributes to the specified property.
*
* @param node A CST node in which to look for property assignments. If this is undefined, the result is `undefined`.
* @param property A property name of the constructed AST node. If this is undefined, the result is `undefined`.
* @param index If no index is specified or the index is less than zero, the first found node is returned. If the
*        specified index exceeds the number of assignments to the property, the last found node is returned. Otherwise,
*        the node with the specified index is returned.
*/
function findNodeForProperty(node, property, index) {
	if (!node || !property) return;
	const nodes = findNodesForPropertyInternal(node, property, node.astNode, true);
	if (nodes.length === 0) return;
	if (index !== void 0) index = Math.max(0, Math.min(index, nodes.length - 1));
	else index = 0;
	return nodes[index];
}
function findNodesForPropertyInternal(node, property, element, first) {
	if (!first) {
		const nodeFeature = getContainerOfType(node.grammarSource, isAssignment);
		if (nodeFeature && nodeFeature.feature === property) return [node];
	}
	if (isCompositeCstNode(node) && node.astNode === element) return node.content.flatMap((e) => findNodesForPropertyInternal(e, property, element, false));
	return [];
}
/**
* Find all CST nodes within the given node that correspond to the specified keyword.
*
* @param node A CST node in which to look for keywords. If this is undefined, the result is an empty array.
* @param keyword A keyword as specified in the grammar.
*/
function findNodesForKeyword(node, keyword) {
	if (!node) return [];
	return findNodesForKeywordInternal(node, keyword, node === null || node === void 0 ? void 0 : node.astNode);
}
/**
* Find a single CST node within the given node that corresponds to the specified keyword.
*
* @param node A CST node in which to look for keywords. If this is undefined, the result is `undefined`.
* @param keyword A keyword as specified in the grammar.
* @param index If no index is specified or the index is less than zero, the first found node is returned. If the
*        specified index exceeds the number of keyword occurrences, the last found node is returned. Otherwise,
*        the node with the specified index is returned.
*/
function findNodeForKeyword(node, keyword, index) {
	if (!node) return;
	const nodes = findNodesForKeywordInternal(node, keyword, node === null || node === void 0 ? void 0 : node.astNode);
	if (nodes.length === 0) return;
	if (index !== void 0) index = Math.max(0, Math.min(index, nodes.length - 1));
	else index = 0;
	return nodes[index];
}
function findNodesForKeywordInternal(node, keyword, element) {
	if (node.astNode !== element) return [];
	if (isKeyword(node.grammarSource) && node.grammarSource.value === keyword) return [node];
	const treeIterator = streamCst(node).iterator();
	let result;
	const keywordNodes = [];
	do {
		result = treeIterator.next();
		if (!result.done) {
			const childNode = result.value;
			if (childNode.astNode === element) {
				if (isKeyword(childNode.grammarSource) && childNode.grammarSource.value === keyword) keywordNodes.push(childNode);
			} else treeIterator.prune();
		}
	} while (!result.done);
	return keywordNodes;
}
/**
* If the given CST node was parsed in the context of a property assignment, the respective `Assignment` grammar
* node is returned. If no assignment is found, the result is `undefined`.
*
* @param cstNode A CST node for which to find a property assignment.
*/
function findAssignment(cstNode) {
	var _a;
	const astNode = cstNode.astNode;
	while (astNode === ((_a = cstNode.container) === null || _a === void 0 ? void 0 : _a.astNode)) {
		const assignment = getContainerOfType(cstNode.grammarSource, isAssignment);
		if (assignment) return assignment;
		cstNode = cstNode.container;
	}
}
/**
* Find an assignment to the `name` property for the given grammar type. This requires the `type` to be inferred
* from a parser rule, and that rule must contain an assignment to the `name` property. In all other cases,
* this function returns `undefined`.
*/
function findNameAssignment(type) {
	let startNode = type;
	if (isInferredType(startNode)) {
		if (isAction(startNode.$container)) startNode = startNode.$container.$container;
		else if (isParserRule(startNode.$container)) startNode = startNode.$container;
		else assertUnreachable(startNode.$container);
	}
	return findNameAssignmentInternal(type, startNode, /* @__PURE__ */ new Map());
}
function findNameAssignmentInternal(type, startNode, cache) {
	var _a;
	function go(node, refType) {
		let childAssignment = void 0;
		if (!getContainerOfType(node, isAssignment)) childAssignment = findNameAssignmentInternal(refType, refType, cache);
		cache.set(type, childAssignment);
		return childAssignment;
	}
	if (cache.has(type)) return cache.get(type);
	cache.set(type, void 0);
	for (const node of streamAllContents(startNode)) if (isAssignment(node) && node.feature.toLowerCase() === "name") {
		cache.set(type, node);
		return node;
	} else if (isRuleCall(node) && isParserRule(node.rule.ref)) return go(node, node.rule.ref);
	else if (isSimpleType(node) && ((_a = node.typeRef) === null || _a === void 0 ? void 0 : _a.ref)) return go(node, node.typeRef.ref);
}
function getActionAtElement(element) {
	const parent = element.$container;
	if (isGroup(parent)) {
		const elements = parent.elements;
		const index = elements.indexOf(element);
		for (let i = index - 1; i >= 0; i--) {
			const item = elements[i];
			if (isAction(item)) return item;
			else {
				const action = streamAllContents(elements[i]).find(isAction);
				if (action) return action;
			}
		}
	}
	if (isAbstractElement(parent)) return getActionAtElement(parent);
	else return;
}
function isOptionalCardinality(cardinality, element) {
	return cardinality === "?" || cardinality === "*" || isGroup(element) && Boolean(element.guardCondition);
}
function isArrayCardinality(cardinality) {
	return cardinality === "*" || cardinality === "+";
}
function isArrayOperator(operator) {
	return operator === "+=";
}
/**
* Determines whether the given parser rule is a _data type rule_, meaning that it has a
* primitive return type like `number`, `boolean`, etc.
*/
function isDataTypeRule(rule) {
	return isDataTypeRuleInternal(rule, /* @__PURE__ */ new Set());
}
function isDataTypeRuleInternal(rule, visited) {
	if (visited.has(rule)) return true;
	else visited.add(rule);
	for (const node of streamAllContents(rule)) if (isRuleCall(node)) {
		if (!node.rule.ref) return false;
		if (isParserRule(node.rule.ref) && !isDataTypeRuleInternal(node.rule.ref, visited)) return false;
	} else if (isAssignment(node)) return false;
	else if (isAction(node)) return false;
	return Boolean(rule.definition);
}
function isDataType(type) {
	return isDataTypeInternal(type.type, /* @__PURE__ */ new Set());
}
function isDataTypeInternal(type, visited) {
	if (visited.has(type)) return true;
	else visited.add(type);
	if (isArrayType(type)) return false;
	else if (isReferenceType(type)) return false;
	else if (isUnionType(type)) return type.types.every((e) => isDataTypeInternal(e, visited));
	else if (isSimpleType(type)) {
		if (type.primitiveType !== void 0) return true;
		else if (type.stringType !== void 0) return true;
		else if (type.typeRef !== void 0) {
			const ref = type.typeRef.ref;
			if (isType(ref)) return isDataTypeInternal(ref.type, visited);
			else return false;
		} else return false;
	} else return false;
}
function getExplicitRuleType(rule) {
	if (rule.inferredType) return rule.inferredType.name;
	else if (rule.dataType) return rule.dataType;
	else if (rule.returnType) {
		const refType = rule.returnType.ref;
		if (refType) {
			if (isParserRule(refType)) return refType.name;
			else if (isInterface(refType) || isType(refType)) return refType.name;
		}
	}
}
function getTypeName(type) {
	var _a;
	if (isParserRule(type)) return isDataTypeRule(type) ? type.name : (_a = getExplicitRuleType(type)) !== null && _a !== void 0 ? _a : type.name;
	else if (isInterface(type) || isType(type) || isReturnType(type)) return type.name;
	else if (isAction(type)) {
		const actionType = getActionType(type);
		if (actionType) return actionType;
	} else if (isInferredType(type)) return type.name;
	throw new Error("Cannot get name of Unknown Type");
}
function getActionType(action) {
	var _a;
	if (action.inferredType) return action.inferredType.name;
	else if ((_a = action.type) === null || _a === void 0 ? void 0 : _a.ref) return getTypeName(action.type.ref);
}
/**
* This function is used at development time (for code generation and the internal type system) to get the type of the AST node produced by the given rule.
* For data type rules, the name of the rule is returned,
* e.g. "INT_value returns number: MY_INT;" returns "INT_value".
* @param rule the given rule
* @returns the name of the AST node type of the rule
*/
function getRuleTypeName(rule) {
	var _a, _b, _c;
	if (isTerminalRule(rule)) return (_b = (_a = rule.type) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "string";
	else return isDataTypeRule(rule) ? rule.name : (_c = getExplicitRuleType(rule)) !== null && _c !== void 0 ? _c : rule.name;
}
/**
* This function is used at runtime to get the actual type of the values produced by the given rule at runtime.
* For data type rules, the name of the declared return type of the rule is returned (if any),
* e.g. "INT_value returns number: MY_INT;" returns "number".
* @param rule the given rule
* @returns the name of the type of the produced values of the rule at runtime
*/
function getRuleType(rule) {
	var _a, _b, _c;
	if (isTerminalRule(rule)) return (_b = (_a = rule.type) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "string";
	else return (_c = getExplicitRuleType(rule)) !== null && _c !== void 0 ? _c : rule.name;
}
function terminalRegex(terminalRule) {
	const flags = {
		s: false,
		i: false,
		u: false
	};
	const source = abstractElementToRegex(terminalRule.definition, flags);
	const flagText = Object.entries(flags).filter(([, value]) => value).map(([name]) => name).join("");
	return new RegExp(source, flagText);
}
var WILDCARD = /[\s\S]/.source;
function abstractElementToRegex(element, flags) {
	if (isTerminalAlternatives(element)) return terminalAlternativesToRegex(element);
	else if (isTerminalGroup(element)) return terminalGroupToRegex(element);
	else if (isCharacterRange(element)) return characterRangeToRegex(element);
	else if (isTerminalRuleCall(element)) {
		const rule = element.rule.ref;
		if (!rule) throw new Error("Missing rule reference.");
		return withCardinality(abstractElementToRegex(rule.definition), {
			cardinality: element.cardinality,
			lookahead: element.lookahead
		});
	} else if (isNegatedToken(element)) return negateTokenToRegex(element);
	else if (isUntilToken(element)) return untilTokenToRegex(element);
	else if (isRegexToken(element)) {
		const lastSlash = element.regex.lastIndexOf("/");
		const source = element.regex.substring(1, lastSlash);
		const regexFlags = element.regex.substring(lastSlash + 1);
		if (flags) {
			flags.i = regexFlags.includes("i");
			flags.s = regexFlags.includes("s");
			flags.u = regexFlags.includes("u");
		}
		return withCardinality(source, {
			cardinality: element.cardinality,
			lookahead: element.lookahead,
			wrap: false
		});
	} else if (isWildcard(element)) return withCardinality(WILDCARD, {
		cardinality: element.cardinality,
		lookahead: element.lookahead
	});
	else throw new Error(`Invalid terminal element: ${element === null || element === void 0 ? void 0 : element.$type}`);
}
function terminalAlternativesToRegex(alternatives) {
	return withCardinality(alternatives.elements.map((e) => abstractElementToRegex(e)).join("|"), {
		cardinality: alternatives.cardinality,
		lookahead: alternatives.lookahead
	});
}
function terminalGroupToRegex(group) {
	return withCardinality(group.elements.map((e) => abstractElementToRegex(e)).join(""), {
		cardinality: group.cardinality,
		lookahead: group.lookahead
	});
}
function untilTokenToRegex(until) {
	return withCardinality(`${WILDCARD}*?${abstractElementToRegex(until.terminal)}`, {
		cardinality: until.cardinality,
		lookahead: until.lookahead
	});
}
function negateTokenToRegex(negate) {
	return withCardinality(`(?!${abstractElementToRegex(negate.terminal)})${WILDCARD}*?`, {
		cardinality: negate.cardinality,
		lookahead: negate.lookahead
	});
}
function characterRangeToRegex(range) {
	if (range.right) return withCardinality(`[${keywordToRegex(range.left)}-${keywordToRegex(range.right)}]`, {
		cardinality: range.cardinality,
		lookahead: range.lookahead,
		wrap: false
	});
	return withCardinality(keywordToRegex(range.left), {
		cardinality: range.cardinality,
		lookahead: range.lookahead,
		wrap: false
	});
}
function keywordToRegex(keyword) {
	return escapeRegExp(keyword.value);
}
function withCardinality(regex, options) {
	var _a;
	if (options.wrap !== false || options.lookahead) regex = `(${(_a = options.lookahead) !== null && _a !== void 0 ? _a : ""}${regex})`;
	if (options.cardinality) return `${regex}${options.cardinality}`;
	return regex;
}
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/languages/grammar-config.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
/**
* Create the default grammar configuration (used by `createDefaultModule`). This can be overridden in a
* language-specific module.
*/
function createGrammarConfig(services) {
	const rules = [];
	const grammar = services.Grammar;
	for (const rule of grammar.rules) if (isTerminalRule(rule) && isCommentTerminal(rule) && isMultilineComment(terminalRegex(rule))) rules.push(rule.name);
	return {
		multilineCommentRules: rules,
		nameRegexp: DefaultNameRegexp
	};
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_freeGlobal.js
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_root.js
/** Detect free variable `self`. */
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function("return this")();
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Symbol.js
/** Built-in value references. */
var Symbol$1 = root.Symbol;
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getRawTag.js
/** Used for built-in method references. */
var objectProto$4 = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$16 = objectProto$4.hasOwnProperty;
/**
* Used to resolve the
* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
* of values.
*/
var nativeObjectToString$1 = objectProto$4.toString;
/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
/**
* A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
*
* @private
* @param {*} value The value to query.
* @returns {string} Returns the raw `toStringTag`.
*/
function getRawTag(value) {
	var isOwn = hasOwnProperty$16.call(value, symToStringTag$1), tag = value[symToStringTag$1];
	try {
		value[symToStringTag$1] = void 0;
		var unmasked = true;
	} catch (e) {}
	var result = nativeObjectToString$1.call(value);
	if (unmasked) {
		if (isOwn) value[symToStringTag$1] = tag;
		else delete value[symToStringTag$1];
	}
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_objectToString.js
/**
* Used to resolve the
* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
* of values.
*/
var nativeObjectToString = Object.prototype.toString;
/**
* Converts `value` to a string using `Object.prototype.toString`.
*
* @private
* @param {*} value The value to convert.
* @returns {string} Returns the converted string.
*/
function objectToString(value) {
	return nativeObjectToString.call(value);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseGetTag.js
/** `Object#toString` result references. */
var nullTag = "[object Null]";
var undefinedTag = "[object Undefined]";
/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
/**
* The base implementation of `getTag` without fallbacks for buggy environments.
*
* @private
* @param {*} value The value to query.
* @returns {string} Returns the `toStringTag`.
*/
function baseGetTag(value) {
	if (value == null) return value === void 0 ? undefinedTag : nullTag;
	return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isObjectLike.js
/**
* Checks if `value` is object-like. A value is object-like if it's not `null`
* and has a `typeof` result of "object".
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is object-like, else `false`.
* @example
*
* _.isObjectLike({});
* // => true
*
* _.isObjectLike([1, 2, 3]);
* // => true
*
* _.isObjectLike(_.noop);
* // => false
*
* _.isObjectLike(null);
* // => false
*/
function isObjectLike(value) {
	return value != null && typeof value == "object";
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isSymbol.js
/** `Object#toString` result references. */
var symbolTag$3 = "[object Symbol]";
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
	return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag$3;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayMap.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isArray.js
/**
* Checks if `value` is classified as an `Array` object.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an array, else `false`.
* @example
*
* _.isArray([1, 2, 3]);
* // => true
*
* _.isArray(document.body.children);
* // => false
*
* _.isArray('abc');
* // => false
*
* _.isArray(_.noop);
* // => false
*/
var isArray = Array.isArray;
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseToString.js
/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0;
/** Used to convert symbols to primitives and strings. */
var symbolProto$2 = Symbol$1 ? Symbol$1.prototype : void 0;
var symbolToString = symbolProto$2 ? symbolProto$2.toString : void 0;
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
	return result == "0" && 1 / value == -INFINITY$2 ? "-0" : result;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_trimmedEndIndex.js
/** Used to match a single whitespace character. */
var reWhitespace = /\s/;
/**
* Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
* character of `string`.
*
* @private
* @param {string} string The string to inspect.
* @returns {number} Returns the index of the last non-whitespace character.
*/
function trimmedEndIndex(string) {
	var index = string.length;
	while (index-- && reWhitespace.test(string.charAt(index)));
	return index;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseTrim.js
/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;
/**
* The base implementation of `_.trim`.
*
* @private
* @param {string} string The string to trim.
* @returns {string} Returns the trimmed string.
*/
function baseTrim(string) {
	return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isObject.js
/**
* Checks if `value` is the
* [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
* of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an object, else `false`.
* @example
*
* _.isObject({});
* // => true
*
* _.isObject([1, 2, 3]);
* // => true
*
* _.isObject(_.noop);
* // => true
*
* _.isObject(null);
* // => false
*/
function isObject(value) {
	var type = typeof value;
	return value != null && (type == "object" || type == "function");
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/toNumber.js
/** Used as references for various `Number` constants. */
var NAN = NaN;
/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;
/**
* Converts `value` to a number.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to process.
* @returns {number} Returns the number.
* @example
*
* _.toNumber(3.2);
* // => 3.2
*
* _.toNumber(Number.MIN_VALUE);
* // => 5e-324
*
* _.toNumber(Infinity);
* // => Infinity
*
* _.toNumber('3.2');
* // => 3.2
*/
function toNumber(value) {
	if (typeof value == "number") return value;
	if (isSymbol(value)) return NAN;
	if (isObject(value)) {
		var other = typeof value.valueOf == "function" ? value.valueOf() : value;
		value = isObject(other) ? other + "" : other;
	}
	if (typeof value != "string") return value === 0 ? value : +value;
	value = baseTrim(value);
	var isBinary = reIsBinary.test(value);
	return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/toFinite.js
/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;
var MAX_INTEGER = 17976931348623157e292;
/**
* Converts `value` to a finite number.
*
* @static
* @memberOf _
* @since 4.12.0
* @category Lang
* @param {*} value The value to convert.
* @returns {number} Returns the converted number.
* @example
*
* _.toFinite(3.2);
* // => 3.2
*
* _.toFinite(Number.MIN_VALUE);
* // => 5e-324
*
* _.toFinite(Infinity);
* // => 1.7976931348623157e+308
*
* _.toFinite('3.2');
* // => 3.2
*/
function toFinite(value) {
	if (!value) return value === 0 ? value : 0;
	value = toNumber(value);
	if (value === INFINITY$1 || value === -INFINITY$1) return (value < 0 ? -1 : 1) * MAX_INTEGER;
	return value === value ? value : 0;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/toInteger.js
/**
* Converts `value` to an integer.
*
* **Note:** This method is loosely based on
* [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to convert.
* @returns {number} Returns the converted integer.
* @example
*
* _.toInteger(3.2);
* // => 3
*
* _.toInteger(Number.MIN_VALUE);
* // => 0
*
* _.toInteger(Infinity);
* // => 1.7976931348623157e+308
*
* _.toInteger('3.2');
* // => 3
*/
function toInteger(value) {
	var result = toFinite(value), remainder = result % 1;
	return result === result ? remainder ? result - remainder : result : 0;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/identity.js
/**
* This method returns the first argument it receives.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Util
* @param {*} value Any value.
* @returns {*} Returns `value`.
* @example
*
* var object = { 'a': 1 };
*
* console.log(_.identity(object) === object);
* // => true
*/
function identity(value) {
	return value;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isFunction.js
/** `Object#toString` result references. */
var asyncTag = "[object AsyncFunction]";
var funcTag$2 = "[object Function]";
var genTag$1 = "[object GeneratorFunction]";
var proxyTag = "[object Proxy]";
/**
* Checks if `value` is classified as a `Function` object.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a function, else `false`.
* @example
*
* _.isFunction(_);
* // => true
*
* _.isFunction(/abc/);
* // => false
*/
function isFunction(value) {
	if (!isObject(value)) return false;
	var tag = baseGetTag(value);
	return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_coreJsData.js
/** Used to detect overreaching core-js shims. */
var coreJsData = root["__core-js_shared__"];
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isMasked.js
/** Used to detect methods masquerading as native. */
var maskSrcKey = function() {
	var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
	return uid ? "Symbol(src)_1." + uid : "";
}();
/**
* Checks if `func` has its source masked.
*
* @private
* @param {Function} func The function to check.
* @returns {boolean} Returns `true` if `func` is masked, else `false`.
*/
function isMasked(func) {
	return !!maskSrcKey && maskSrcKey in func;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_toSource.js
/** Used to resolve the decompiled source of functions. */
var funcToString$1 = Function.prototype.toString;
/**
* Converts `func` to its source code.
*
* @private
* @param {Function} func The function to convert.
* @returns {string} Returns the source code.
*/
function toSource(func) {
	if (func != null) {
		try {
			return funcToString$1.call(func);
		} catch (e) {}
		try {
			return func + "";
		} catch (e) {}
	}
	return "";
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsNative.js
/**
* Used to match `RegExp`
* [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
*/
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;
/** Used for built-in method references. */
var funcProto = Function.prototype;
var objectProto$3 = Object.prototype;
/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;
/** Used to check objects for own properties. */
var hasOwnProperty$15 = objectProto$3.hasOwnProperty;
/** Used to detect if a method is native. */
var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty$15).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
/**
* The base implementation of `_.isNative` without bad shim checks.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a native function,
*  else `false`.
*/
function baseIsNative(value) {
	if (!isObject(value) || isMasked(value)) return false;
	return (isFunction(value) ? reIsNative : reIsHostCtor).test(toSource(value));
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getValue.js
/**
* Gets the value at `key` of `object`.
*
* @private
* @param {Object} [object] The object to query.
* @param {string} key The key of the property to get.
* @returns {*} Returns the property value.
*/
function getValue(object, key) {
	return object == null ? void 0 : object[key];
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getNative.js
/**
* Gets the native function at `key` of `object`.
*
* @private
* @param {Object} object The object to query.
* @param {string} key The key of the method to get.
* @returns {*} Returns the function if it's native, else `undefined`.
*/
function getNative(object, key) {
	var value = getValue(object, key);
	return baseIsNative(value) ? value : void 0;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_WeakMap.js
var WeakMap = getNative(root, "WeakMap");
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseCreate.js
/** Built-in value references. */
var objectCreate = Object.create;
/**
* The base implementation of `_.create` without support for assigning
* properties to the created object.
*
* @private
* @param {Object} proto The object to inherit from.
* @returns {Object} Returns the new object.
*/
var baseCreate = function() {
	function object() {}
	return function(proto) {
		if (!isObject(proto)) return {};
		if (objectCreate) return objectCreate(proto);
		object.prototype = proto;
		var result = new object();
		object.prototype = void 0;
		return result;
	};
}();
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_apply.js
/**
* A faster alternative to `Function#apply`, this function invokes `func`
* with the `this` binding of `thisArg` and the arguments of `args`.
*
* @private
* @param {Function} func The function to invoke.
* @param {*} thisArg The `this` binding of `func`.
* @param {Array} args The arguments to invoke `func` with.
* @returns {*} Returns the result of `func`.
*/
function apply(func, thisArg, args) {
	switch (args.length) {
		case 0: return func.call(thisArg);
		case 1: return func.call(thisArg, args[0]);
		case 2: return func.call(thisArg, args[0], args[1]);
		case 3: return func.call(thisArg, args[0], args[1], args[2]);
	}
	return func.apply(thisArg, args);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/noop.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_copyArray.js
/**
* Copies the values of `source` to `array`.
*
* @private
* @param {Array} source The array to copy values from.
* @param {Array} [array=[]] The array to copy values to.
* @returns {Array} Returns `array`.
*/
function copyArray(source, array) {
	var index = -1, length = source.length;
	array || (array = Array(length));
	while (++index < length) array[index] = source[index];
	return array;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_shortOut.js
/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800;
var HOT_SPAN = 16;
var nativeNow = Date.now;
/**
* Creates a function that'll short out and invoke `identity` instead
* of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
* milliseconds.
*
* @private
* @param {Function} func The function to restrict.
* @returns {Function} Returns the new shortable function.
*/
function shortOut(func) {
	var count = 0, lastCalled = 0;
	return function() {
		var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
		lastCalled = stamp;
		if (remaining > 0) {
			if (++count >= HOT_COUNT) return arguments[0];
		} else count = 0;
		return func.apply(void 0, arguments);
	};
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/constant.js
/**
* Creates a function that returns `value`.
*
* @static
* @memberOf _
* @since 2.4.0
* @category Util
* @param {*} value The value to return from the new function.
* @returns {Function} Returns the new constant function.
* @example
*
* var objects = _.times(2, _.constant({ 'a': 1 }));
*
* console.log(objects);
* // => [{ 'a': 1 }, { 'a': 1 }]
*
* console.log(objects[0] === objects[1]);
* // => true
*/
function constant(value) {
	return function() {
		return value;
	};
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_defineProperty.js
var defineProperty = function() {
	try {
		var func = getNative(Object, "defineProperty");
		func({}, "", {});
		return func;
	} catch (e) {}
}();
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_setToString.js
/**
* Sets the `toString` method of `func` to return `string`.
*
* @private
* @param {Function} func The function to modify.
* @param {Function} string The `toString` result.
* @returns {Function} Returns `func`.
*/
var setToString = shortOut(!defineProperty ? identity : function(func, string) {
	return defineProperty(func, "toString", {
		"configurable": true,
		"enumerable": false,
		"value": constant(string),
		"writable": true
	});
});
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayEach.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseFindIndex.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsNaN.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_strictIndexOf.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIndexOf.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayIncludes.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isIndex.js
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;
/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;
/**
* Checks if `value` is a valid array-like index.
*
* @private
* @param {*} value The value to check.
* @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
* @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
*/
function isIndex(value, length) {
	var type = typeof value;
	length = length == null ? MAX_SAFE_INTEGER$1 : length;
	return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseAssignValue.js
/**
* The base implementation of `assignValue` and `assignMergeValue` without
* value checks.
*
* @private
* @param {Object} object The object to modify.
* @param {string} key The key of the property to assign.
* @param {*} value The value to assign.
*/
function baseAssignValue(object, key, value) {
	if (key == "__proto__" && defineProperty) defineProperty(object, key, {
		"configurable": true,
		"enumerable": true,
		"value": value,
		"writable": true
	});
	else object[key] = value;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/eq.js
/**
* Performs a
* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
* comparison between two values to determine if they are equivalent.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to compare.
* @param {*} other The other value to compare.
* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
* @example
*
* var object = { 'a': 1 };
* var other = { 'a': 1 };
*
* _.eq(object, object);
* // => true
*
* _.eq(object, other);
* // => false
*
* _.eq('a', 'a');
* // => true
*
* _.eq('a', Object('a'));
* // => false
*
* _.eq(NaN, NaN);
* // => true
*/
function eq(value, other) {
	return value === other || value !== value && other !== other;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_assignValue.js
/** Used to check objects for own properties. */
var hasOwnProperty$14 = Object.prototype.hasOwnProperty;
/**
* Assigns `value` to `key` of `object` if the existing value is not equivalent
* using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
* for equality comparisons.
*
* @private
* @param {Object} object The object to modify.
* @param {string} key The key of the property to assign.
* @param {*} value The value to assign.
*/
function assignValue(object, key, value) {
	var objValue = object[key];
	if (!(hasOwnProperty$14.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) baseAssignValue(object, key, value);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_copyObject.js
/**
* Copies properties of `source` to `object`.
*
* @private
* @param {Object} source The object to copy properties from.
* @param {Array} props The property identifiers to copy.
* @param {Object} [object={}] The object to copy properties to.
* @param {Function} [customizer] The function to customize copied values.
* @returns {Object} Returns `object`.
*/
function copyObject(source, props, object, customizer) {
	var isNew = !object;
	object || (object = {});
	var index = -1, length = props.length;
	while (++index < length) {
		var key = props[index];
		var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
		if (newValue === void 0) newValue = source[key];
		if (isNew) baseAssignValue(object, key, newValue);
		else assignValue(object, key, newValue);
	}
	return object;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_overRest.js
var nativeMax$3 = Math.max;
/**
* A specialized version of `baseRest` which transforms the rest array.
*
* @private
* @param {Function} func The function to apply a rest parameter to.
* @param {number} [start=func.length-1] The start position of the rest parameter.
* @param {Function} transform The rest array transform.
* @returns {Function} Returns the new function.
*/
function overRest(func, start, transform) {
	start = nativeMax$3(start === void 0 ? func.length - 1 : start, 0);
	return function() {
		var args = arguments, index = -1, length = nativeMax$3(args.length - start, 0), array = Array(length);
		while (++index < length) array[index] = args[start + index];
		index = -1;
		var otherArgs = Array(start + 1);
		while (++index < start) otherArgs[index] = args[index];
		otherArgs[start] = transform(array);
		return apply(func, this, otherArgs);
	};
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseRest.js
/**
* The base implementation of `_.rest` which doesn't validate or coerce arguments.
*
* @private
* @param {Function} func The function to apply a rest parameter to.
* @param {number} [start=func.length-1] The start position of the rest parameter.
* @returns {Function} Returns the new function.
*/
function baseRest(func, start) {
	return setToString(overRest(func, start, identity), func + "");
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isLength.js
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;
/**
* Checks if `value` is a valid array-like length.
*
* **Note:** This method is loosely based on
* [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
* @example
*
* _.isLength(3);
* // => true
*
* _.isLength(Number.MIN_VALUE);
* // => false
*
* _.isLength(Infinity);
* // => false
*
* _.isLength('3');
* // => false
*/
function isLength(value) {
	return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isArrayLike.js
/**
* Checks if `value` is array-like. A value is considered array-like if it's
* not a function and has a `value.length` that's an integer greater than or
* equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is array-like, else `false`.
* @example
*
* _.isArrayLike([1, 2, 3]);
* // => true
*
* _.isArrayLike(document.body.children);
* // => true
*
* _.isArrayLike('abc');
* // => true
*
* _.isArrayLike(_.noop);
* // => false
*/
function isArrayLike(value) {
	return value != null && isLength(value.length) && !isFunction(value);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isIterateeCall.js
/**
* Checks if the given arguments are from an iteratee call.
*
* @private
* @param {*} value The potential iteratee value argument.
* @param {*} index The potential iteratee index or key argument.
* @param {*} object The potential iteratee object argument.
* @returns {boolean} Returns `true` if the arguments are from an iteratee call,
*  else `false`.
*/
function isIterateeCall(value, index, object) {
	if (!isObject(object)) return false;
	var type = typeof index;
	if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) return eq(object[index], value);
	return false;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createAssigner.js
/**
* Creates a function like `_.assign`.
*
* @private
* @param {Function} assigner The function to assign values.
* @returns {Function} Returns the new assigner function.
*/
function createAssigner(assigner) {
	return baseRest(function(object, sources) {
		var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
		customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
		if (guard && isIterateeCall(sources[0], sources[1], guard)) {
			customizer = length < 3 ? void 0 : customizer;
			length = 1;
		}
		object = Object(object);
		while (++index < length) {
			var source = sources[index];
			if (source) assigner(object, source, index, customizer);
		}
		return object;
	});
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isPrototype.js
/** Used for built-in method references. */
var objectProto$2 = Object.prototype;
/**
* Checks if `value` is likely a prototype object.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
*/
function isPrototype(value) {
	var Ctor = value && value.constructor;
	return value === (typeof Ctor == "function" && Ctor.prototype || objectProto$2);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseTimes.js
/**
* The base implementation of `_.times` without support for iteratee shorthands
* or max array length checks.
*
* @private
* @param {number} n The number of times to invoke `iteratee`.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array} Returns the array of results.
*/
function baseTimes(n, iteratee) {
	var index = -1, result = Array(n);
	while (++index < n) result[index] = iteratee(index);
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsArguments.js
/** `Object#toString` result references. */
var argsTag$3 = "[object Arguments]";
/**
* The base implementation of `_.isArguments`.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an `arguments` object,
*/
function baseIsArguments(value) {
	return isObjectLike(value) && baseGetTag(value) == argsTag$3;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isArguments.js
/** Used for built-in method references. */
var objectProto$1 = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$13 = objectProto$1.hasOwnProperty;
/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$1.propertyIsEnumerable;
/**
* Checks if `value` is likely an `arguments` object.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an `arguments` object,
*  else `false`.
* @example
*
* _.isArguments(function() { return arguments; }());
* // => true
*
* _.isArguments([1, 2, 3]);
* // => false
*/
var isArguments = baseIsArguments(function() {
	return arguments;
}()) ? baseIsArguments : function(value) {
	return isObjectLike(value) && hasOwnProperty$13.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
};
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/stubFalse.js
/**
* This method returns `false`.
*
* @static
* @memberOf _
* @since 4.13.0
* @category Util
* @returns {boolean} Returns `false`.
* @example
*
* _.times(2, _.stubFalse);
* // => [false, false]
*/
function stubFalse() {
	return false;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isBuffer.js
/** Detect free variable `exports`. */
var freeExports$2 = typeof exports == "object" && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */
var freeModule$2 = freeExports$2 && typeof module == "object" && module && !module.nodeType && module;
/** Built-in value references. */
var Buffer$1 = freeModule$2 && freeModule$2.exports === freeExports$2 ? root.Buffer : void 0;
/**
* Checks if `value` is a buffer.
*
* @static
* @memberOf _
* @since 4.3.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
* @example
*
* _.isBuffer(new Buffer(2));
* // => true
*
* _.isBuffer(new Uint8Array(2));
* // => false
*/
var isBuffer = (Buffer$1 ? Buffer$1.isBuffer : void 0) || stubFalse;
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsTypedArray.js
/** `Object#toString` result references. */
var argsTag$2 = "[object Arguments]";
var arrayTag$2 = "[object Array]";
var boolTag$3 = "[object Boolean]";
var dateTag$3 = "[object Date]";
var errorTag$2 = "[object Error]";
var funcTag$1 = "[object Function]";
var mapTag$6 = "[object Map]";
var numberTag$3 = "[object Number]";
var objectTag$3 = "[object Object]";
var regexpTag$4 = "[object RegExp]";
var setTag$6 = "[object Set]";
var stringTag$4 = "[object String]";
var weakMapTag$2 = "[object WeakMap]";
var arrayBufferTag$3 = "[object ArrayBuffer]";
var dataViewTag$4 = "[object DataView]";
var float32Tag$2 = "[object Float32Array]";
var float64Tag$2 = "[object Float64Array]";
var int8Tag$2 = "[object Int8Array]";
var int16Tag$2 = "[object Int16Array]";
var int32Tag$2 = "[object Int32Array]";
var uint8Tag$2 = "[object Uint8Array]";
var uint8ClampedTag$2 = "[object Uint8ClampedArray]";
var uint16Tag$2 = "[object Uint16Array]";
var uint32Tag$2 = "[object Uint32Array]";
/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] = typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] = typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] = typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] = typedArrayTags[uint32Tag$2] = true;
typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$2] = typedArrayTags[arrayBufferTag$3] = typedArrayTags[boolTag$3] = typedArrayTags[dataViewTag$4] = typedArrayTags[dateTag$3] = typedArrayTags[errorTag$2] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$6] = typedArrayTags[numberTag$3] = typedArrayTags[objectTag$3] = typedArrayTags[regexpTag$4] = typedArrayTags[setTag$6] = typedArrayTags[stringTag$4] = typedArrayTags[weakMapTag$2] = false;
/**
* The base implementation of `_.isTypedArray` without Node.js optimizations.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
*/
function baseIsTypedArray(value) {
	return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseUnary.js
/**
* The base implementation of `_.unary` without support for storing metadata.
*
* @private
* @param {Function} func The function to cap arguments for.
* @returns {Function} Returns the new capped function.
*/
function baseUnary(func) {
	return function(value) {
		return func(value);
	};
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_nodeUtil.js
/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
/** Detect free variable `process` from Node.js. */
var freeProcess = freeModule$1 && freeModule$1.exports === freeExports$1 && freeGlobal.process;
/** Used to access faster Node.js helpers. */
var nodeUtil = function() {
	try {
		var types = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
		if (types) return types;
		return freeProcess && freeProcess.binding && freeProcess.binding("util");
	} catch (e) {}
}();
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isTypedArray.js
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
/**
* Checks if `value` is classified as a typed array.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
* @example
*
* _.isTypedArray(new Uint8Array);
* // => true
*
* _.isTypedArray([]);
* // => false
*/
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayLikeKeys.js
/** Used to check objects for own properties. */
var hasOwnProperty$12 = Object.prototype.hasOwnProperty;
/**
* Creates an array of the enumerable property names of the array-like `value`.
*
* @private
* @param {*} value The value to query.
* @param {boolean} inherited Specify returning inherited property names.
* @returns {Array} Returns the array of property names.
*/
function arrayLikeKeys(value, inherited) {
	var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
	for (var key in value) if ((inherited || hasOwnProperty$12.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) result.push(key);
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_overArg.js
/**
* Creates a unary function that invokes `func` with its argument transformed.
*
* @private
* @param {Function} func The function to wrap.
* @param {Function} transform The argument transform.
* @returns {Function} Returns the new function.
*/
function overArg(func, transform) {
	return function(arg) {
		return func(transform(arg));
	};
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_nativeKeys.js
var nativeKeys = overArg(Object.keys, Object);
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseKeys.js
/** Used to check objects for own properties. */
var hasOwnProperty$11 = Object.prototype.hasOwnProperty;
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
	for (var key in Object(object)) if (hasOwnProperty$11.call(object, key) && key != "constructor") result.push(key);
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/keys.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/assign.js
/** Used to check objects for own properties. */
var hasOwnProperty$10 = Object.prototype.hasOwnProperty;
/**
* Assigns own enumerable string keyed properties of source objects to the
* destination object. Source objects are applied from left to right.
* Subsequent sources overwrite property assignments of previous sources.
*
* **Note:** This method mutates `object` and is loosely based on
* [`Object.assign`](https://mdn.io/Object/assign).
*
* @static
* @memberOf _
* @since 0.10.0
* @category Object
* @param {Object} object The destination object.
* @param {...Object} [sources] The source objects.
* @returns {Object} Returns `object`.
* @see _.assignIn
* @example
*
* function Foo() {
*   this.a = 1;
* }
*
* function Bar() {
*   this.c = 3;
* }
*
* Foo.prototype.b = 2;
* Bar.prototype.d = 4;
*
* _.assign({ 'a': 0 }, new Foo, new Bar);
* // => { 'a': 1, 'c': 3 }
*/
var assign = createAssigner(function(object, source) {
	if (isPrototype(source) || isArrayLike(source)) {
		copyObject(source, keys(source), object);
		return;
	}
	for (var key in source) if (hasOwnProperty$10.call(source, key)) assignValue(object, key, source[key]);
});
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_nativeKeysIn.js
/**
* This function is like
* [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
* except that it includes inherited enumerable properties.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names.
*/
function nativeKeysIn(object) {
	var result = [];
	if (object != null) for (var key in Object(object)) result.push(key);
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseKeysIn.js
/** Used to check objects for own properties. */
var hasOwnProperty$9 = Object.prototype.hasOwnProperty;
/**
* The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names.
*/
function baseKeysIn(object) {
	if (!isObject(object)) return nativeKeysIn(object);
	var isProto = isPrototype(object), result = [];
	for (var key in object) if (!(key == "constructor" && (isProto || !hasOwnProperty$9.call(object, key)))) result.push(key);
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/keysIn.js
/**
* Creates an array of the own and inherited enumerable property names of `object`.
*
* **Note:** Non-object values are coerced to objects.
*
* @static
* @memberOf _
* @since 3.0.0
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
* _.keysIn(new Foo);
* // => ['a', 'b', 'c'] (iteration order is not guaranteed)
*/
function keysIn(object) {
	return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isKey.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_nativeCreate.js
var nativeCreate = getNative(Object, "create");
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashClear.js
/**
* Removes all key-value entries from the hash.
*
* @private
* @name clear
* @memberOf Hash
*/
function hashClear() {
	this.__data__ = nativeCreate ? nativeCreate(null) : {};
	this.size = 0;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashDelete.js
/**
* Removes `key` and its value from the hash.
*
* @private
* @name delete
* @memberOf Hash
* @param {Object} hash The hash to modify.
* @param {string} key The key of the value to remove.
* @returns {boolean} Returns `true` if the entry was removed, else `false`.
*/
function hashDelete(key) {
	var result = this.has(key) && delete this.__data__[key];
	this.size -= result ? 1 : 0;
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashGet.js
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
/** Used to check objects for own properties. */
var hasOwnProperty$8 = Object.prototype.hasOwnProperty;
/**
* Gets the hash value for `key`.
*
* @private
* @name get
* @memberOf Hash
* @param {string} key The key of the value to get.
* @returns {*} Returns the entry value.
*/
function hashGet(key) {
	var data = this.__data__;
	if (nativeCreate) {
		var result = data[key];
		return result === HASH_UNDEFINED$2 ? void 0 : result;
	}
	return hasOwnProperty$8.call(data, key) ? data[key] : void 0;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashHas.js
/** Used to check objects for own properties. */
var hasOwnProperty$7 = Object.prototype.hasOwnProperty;
/**
* Checks if a hash value for `key` exists.
*
* @private
* @name has
* @memberOf Hash
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function hashHas(key) {
	var data = this.__data__;
	return nativeCreate ? data[key] !== void 0 : hasOwnProperty$7.call(data, key);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashSet.js
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
/**
* Sets the hash `key` to `value`.
*
* @private
* @name set
* @memberOf Hash
* @param {string} key The key of the value to set.
* @param {*} value The value to set.
* @returns {Object} Returns the hash instance.
*/
function hashSet(key, value) {
	var data = this.__data__;
	this.size += this.has(key) ? 0 : 1;
	data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED$1 : value;
	return this;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Hash.js
/**
* Creates a hash object.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function Hash(entries) {
	var index = -1, length = entries == null ? 0 : entries.length;
	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}
Hash.prototype.clear = hashClear;
Hash.prototype["delete"] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheClear.js
/**
* Removes all key-value entries from the list cache.
*
* @private
* @name clear
* @memberOf ListCache
*/
function listCacheClear() {
	this.__data__ = [];
	this.size = 0;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_assocIndexOf.js
/**
* Gets the index at which the `key` is found in `array` of key-value pairs.
*
* @private
* @param {Array} array The array to inspect.
* @param {*} key The key to search for.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function assocIndexOf(array, key) {
	var length = array.length;
	while (length--) if (eq(array[length][0], key)) return length;
	return -1;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheDelete.js
/** Built-in value references. */
var splice = Array.prototype.splice;
/**
* Removes `key` and its value from the list cache.
*
* @private
* @name delete
* @memberOf ListCache
* @param {string} key The key of the value to remove.
* @returns {boolean} Returns `true` if the entry was removed, else `false`.
*/
function listCacheDelete(key) {
	var data = this.__data__, index = assocIndexOf(data, key);
	if (index < 0) return false;
	if (index == data.length - 1) data.pop();
	else splice.call(data, index, 1);
	--this.size;
	return true;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheGet.js
/**
* Gets the list cache value for `key`.
*
* @private
* @name get
* @memberOf ListCache
* @param {string} key The key of the value to get.
* @returns {*} Returns the entry value.
*/
function listCacheGet(key) {
	var data = this.__data__, index = assocIndexOf(data, key);
	return index < 0 ? void 0 : data[index][1];
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheHas.js
/**
* Checks if a list cache value for `key` exists.
*
* @private
* @name has
* @memberOf ListCache
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function listCacheHas(key) {
	return assocIndexOf(this.__data__, key) > -1;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheSet.js
/**
* Sets the list cache `key` to `value`.
*
* @private
* @name set
* @memberOf ListCache
* @param {string} key The key of the value to set.
* @param {*} value The value to set.
* @returns {Object} Returns the list cache instance.
*/
function listCacheSet(key, value) {
	var data = this.__data__, index = assocIndexOf(data, key);
	if (index < 0) {
		++this.size;
		data.push([key, value]);
	} else data[index][1] = value;
	return this;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_ListCache.js
/**
* Creates an list cache object.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function ListCache(entries) {
	var index = -1, length = entries == null ? 0 : entries.length;
	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}
ListCache.prototype.clear = listCacheClear;
ListCache.prototype["delete"] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Map.js
var Map$1 = getNative(root, "Map");
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheClear.js
/**
* Removes all key-value entries from the map.
*
* @private
* @name clear
* @memberOf MapCache
*/
function mapCacheClear() {
	this.size = 0;
	this.__data__ = {
		"hash": new Hash(),
		"map": new (Map$1 || ListCache)(),
		"string": new Hash()
	};
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isKeyable.js
/**
* Checks if `value` is suitable for use as unique object key.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is suitable, else `false`.
*/
function isKeyable(value) {
	var type = typeof value;
	return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getMapData.js
/**
* Gets the data for `map`.
*
* @private
* @param {Object} map The map to query.
* @param {string} key The reference key.
* @returns {*} Returns the map data.
*/
function getMapData(map, key) {
	var data = map.__data__;
	return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheDelete.js
/**
* Removes `key` and its value from the map.
*
* @private
* @name delete
* @memberOf MapCache
* @param {string} key The key of the value to remove.
* @returns {boolean} Returns `true` if the entry was removed, else `false`.
*/
function mapCacheDelete(key) {
	var result = getMapData(this, key)["delete"](key);
	this.size -= result ? 1 : 0;
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheGet.js
/**
* Gets the map value for `key`.
*
* @private
* @name get
* @memberOf MapCache
* @param {string} key The key of the value to get.
* @returns {*} Returns the entry value.
*/
function mapCacheGet(key) {
	return getMapData(this, key).get(key);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheHas.js
/**
* Checks if a map value for `key` exists.
*
* @private
* @name has
* @memberOf MapCache
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function mapCacheHas(key) {
	return getMapData(this, key).has(key);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheSet.js
/**
* Sets the map `key` to `value`.
*
* @private
* @name set
* @memberOf MapCache
* @param {string} key The key of the value to set.
* @param {*} value The value to set.
* @returns {Object} Returns the map cache instance.
*/
function mapCacheSet(key, value) {
	var data = getMapData(this, key), size = data.size;
	data.set(key, value);
	this.size += data.size == size ? 0 : 1;
	return this;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_MapCache.js
/**
* Creates a map cache object to store key-value pairs.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function MapCache(entries) {
	var index = -1, length = entries == null ? 0 : entries.length;
	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype["delete"] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/memoize.js
/** Error message constants. */
var FUNC_ERROR_TEXT$1 = "Expected a function";
/**
* Creates a function that memoizes the result of `func`. If `resolver` is
* provided, it determines the cache key for storing the result based on the
* arguments provided to the memoized function. By default, the first argument
* provided to the memoized function is used as the map cache key. The `func`
* is invoked with the `this` binding of the memoized function.
*
* **Note:** The cache is exposed as the `cache` property on the memoized
* function. Its creation may be customized by replacing the `_.memoize.Cache`
* constructor with one whose instances implement the
* [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
* method interface of `clear`, `delete`, `get`, `has`, and `set`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Function
* @param {Function} func The function to have its output memoized.
* @param {Function} [resolver] The function to resolve the cache key.
* @returns {Function} Returns the new memoized function.
* @example
*
* var object = { 'a': 1, 'b': 2 };
* var other = { 'c': 3, 'd': 4 };
*
* var values = _.memoize(_.values);
* values(object);
* // => [1, 2]
*
* values(other);
* // => [3, 4]
*
* object.a = 2;
* values(object);
* // => [1, 2]
*
* // Modify the result cache.
* values.cache.set(object, ['a', 'b']);
* values(object);
* // => ['a', 'b']
*
* // Replace `_.memoize.Cache`.
* _.memoize.Cache = WeakMap;
*/
function memoize(func, resolver) {
	if (typeof func != "function" || resolver != null && typeof resolver != "function") throw new TypeError(FUNC_ERROR_TEXT$1);
	var memoized = function() {
		var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
		if (cache.has(key)) return cache.get(key);
		var result = func.apply(this, args);
		memoized.cache = cache.set(key, result) || cache;
		return result;
	};
	memoized.cache = new (memoize.Cache || MapCache)();
	return memoized;
}
memoize.Cache = MapCache;
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_memoizeCapped.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stringToPath.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/toString.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_castPath.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_toKey.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseGet.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/get.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayPush.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isFlattenable.js
/** Built-in value references. */
var spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : void 0;
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseFlatten.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/flatten.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getPrototype.js
/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseSlice.js
/**
* The base implementation of `_.slice` without an iteratee call guard.
*
* @private
* @param {Array} array The array to slice.
* @param {number} [start=0] The start position.
* @param {number} [end=array.length] The end position.
* @returns {Array} Returns the slice of `array`.
*/
function baseSlice(array, start, end) {
	var index = -1, length = array.length;
	if (start < 0) start = -start > length ? 0 : length + start;
	end = end > length ? length : end;
	if (end < 0) end += length;
	length = start > end ? 0 : end - start >>> 0;
	start >>>= 0;
	var result = Array(length);
	while (++index < length) result[index] = array[index + start];
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayReduce.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackClear.js
/**
* Removes all key-value entries from the stack.
*
* @private
* @name clear
* @memberOf Stack
*/
function stackClear() {
	this.__data__ = new ListCache();
	this.size = 0;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackDelete.js
/**
* Removes `key` and its value from the stack.
*
* @private
* @name delete
* @memberOf Stack
* @param {string} key The key of the value to remove.
* @returns {boolean} Returns `true` if the entry was removed, else `false`.
*/
function stackDelete(key) {
	var data = this.__data__, result = data["delete"](key);
	this.size = data.size;
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackGet.js
/**
* Gets the stack value for `key`.
*
* @private
* @name get
* @memberOf Stack
* @param {string} key The key of the value to get.
* @returns {*} Returns the entry value.
*/
function stackGet(key) {
	return this.__data__.get(key);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackHas.js
/**
* Checks if a stack value for `key` exists.
*
* @private
* @name has
* @memberOf Stack
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function stackHas(key) {
	return this.__data__.has(key);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackSet.js
/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE$2 = 200;
/**
* Sets the stack `key` to `value`.
*
* @private
* @name set
* @memberOf Stack
* @param {string} key The key of the value to set.
* @param {*} value The value to set.
* @returns {Object} Returns the stack cache instance.
*/
function stackSet(key, value) {
	var data = this.__data__;
	if (data instanceof ListCache) {
		var pairs = data.__data__;
		if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE$2 - 1) {
			pairs.push([key, value]);
			this.size = ++data.size;
			return this;
		}
		data = this.__data__ = new MapCache(pairs);
	}
	data.set(key, value);
	this.size = data.size;
	return this;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Stack.js
/**
* Creates a stack cache object to store key-value pairs.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function Stack(entries) {
	var data = this.__data__ = new ListCache(entries);
	this.size = data.size;
}
Stack.prototype.clear = stackClear;
Stack.prototype["delete"] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseAssign.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseAssignIn.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_cloneBuffer.js
/** Detect free variable `exports`. */
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
/** Built-in value references. */
var Buffer = freeModule && freeModule.exports === freeExports ? root.Buffer : void 0;
var allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
/**
* Creates a clone of  `buffer`.
*
* @private
* @param {Buffer} buffer The buffer to clone.
* @param {boolean} [isDeep] Specify a deep clone.
* @returns {Buffer} Returns the cloned buffer.
*/
function cloneBuffer(buffer, isDeep) {
	if (isDeep) return buffer.slice();
	var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
	buffer.copy(result);
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayFilter.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/stubArray.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getSymbols.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_copySymbols.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getSymbolsIn.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_copySymbolsIn.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseGetAllKeys.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getAllKeys.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getAllKeysIn.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_DataView.js
var DataView = getNative(root, "DataView");
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Promise.js
var Promise$1 = getNative(root, "Promise");
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Set.js
var Set$1 = getNative(root, "Set");
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getTag.js
/** `Object#toString` result references. */
var mapTag$5 = "[object Map]";
var objectTag$2 = "[object Object]";
var promiseTag = "[object Promise]";
var setTag$5 = "[object Set]";
var weakMapTag$1 = "[object WeakMap]";
var dataViewTag$3 = "[object DataView]";
/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView);
var mapCtorString = toSource(Map$1);
var promiseCtorString = toSource(Promise$1);
var setCtorString = toSource(Set$1);
var weakMapCtorString = toSource(WeakMap);
/**
* Gets the `toStringTag` of `value`.
*
* @private
* @param {*} value The value to query.
* @returns {string} Returns the `toStringTag`.
*/
var getTag = baseGetTag;
if (DataView && getTag(new DataView(/* @__PURE__ */ new ArrayBuffer(1))) != dataViewTag$3 || Map$1 && getTag(new Map$1()) != mapTag$5 || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set$1 && getTag(new Set$1()) != setTag$5 || WeakMap && getTag(new WeakMap()) != weakMapTag$1) getTag = function(value) {
	var result = baseGetTag(value), Ctor = result == objectTag$2 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
	if (ctorString) switch (ctorString) {
		case dataViewCtorString: return dataViewTag$3;
		case mapCtorString: return mapTag$5;
		case promiseCtorString: return promiseTag;
		case setCtorString: return setTag$5;
		case weakMapCtorString: return weakMapTag$1;
	}
	return result;
};
var _getTag_default = getTag;
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_initCloneArray.js
/** Used to check objects for own properties. */
var hasOwnProperty$6 = Object.prototype.hasOwnProperty;
/**
* Initializes an array clone.
*
* @private
* @param {Array} array The array to clone.
* @returns {Array} Returns the initialized clone.
*/
function initCloneArray(array) {
	var length = array.length, result = new array.constructor(length);
	if (length && typeof array[0] == "string" && hasOwnProperty$6.call(array, "index")) {
		result.index = array.index;
		result.input = array.input;
	}
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Uint8Array.js
/** Built-in value references. */
var Uint8Array = root.Uint8Array;
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_cloneArrayBuffer.js
/**
* Creates a clone of `arrayBuffer`.
*
* @private
* @param {ArrayBuffer} arrayBuffer The array buffer to clone.
* @returns {ArrayBuffer} Returns the cloned array buffer.
*/
function cloneArrayBuffer(arrayBuffer) {
	var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
	new Uint8Array(result).set(new Uint8Array(arrayBuffer));
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_cloneDataView.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_cloneRegExp.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_cloneSymbol.js
/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : void 0;
var symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : void 0;
/**
* Creates a clone of the `symbol` object.
*
* @private
* @param {Object} symbol The symbol object to clone.
* @returns {Object} Returns the cloned symbol object.
*/
function cloneSymbol(symbol) {
	return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_cloneTypedArray.js
/**
* Creates a clone of `typedArray`.
*
* @private
* @param {Object} typedArray The typed array to clone.
* @param {boolean} [isDeep] Specify a deep clone.
* @returns {Object} Returns the cloned typed array.
*/
function cloneTypedArray(typedArray, isDeep) {
	var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
	return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_initCloneByTag.js
/** `Object#toString` result references. */
var boolTag$2 = "[object Boolean]";
var dateTag$2 = "[object Date]";
var mapTag$4 = "[object Map]";
var numberTag$2 = "[object Number]";
var regexpTag$3 = "[object RegExp]";
var setTag$4 = "[object Set]";
var stringTag$3 = "[object String]";
var symbolTag$2 = "[object Symbol]";
var arrayBufferTag$2 = "[object ArrayBuffer]";
var dataViewTag$2 = "[object DataView]";
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
		case arrayBufferTag$2: return cloneArrayBuffer(object);
		case boolTag$2:
		case dateTag$2: return new Ctor(+object);
		case dataViewTag$2: return cloneDataView(object, isDeep);
		case float32Tag$1:
		case float64Tag$1:
		case int8Tag$1:
		case int16Tag$1:
		case int32Tag$1:
		case uint8Tag$1:
		case uint8ClampedTag$1:
		case uint16Tag$1:
		case uint32Tag$1: return cloneTypedArray(object, isDeep);
		case mapTag$4: return new Ctor();
		case numberTag$2:
		case stringTag$3: return new Ctor(object);
		case regexpTag$3: return cloneRegExp(object);
		case setTag$4: return new Ctor();
		case symbolTag$2: return cloneSymbol(object);
	}
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_initCloneObject.js
/**
* Initializes an object clone.
*
* @private
* @param {Object} object The object to clone.
* @returns {Object} Returns the initialized clone.
*/
function initCloneObject(object) {
	return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsMap.js
/** `Object#toString` result references. */
var mapTag$3 = "[object Map]";
/**
* The base implementation of `_.isMap` without Node.js optimizations.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a map, else `false`.
*/
function baseIsMap(value) {
	return isObjectLike(value) && _getTag_default(value) == mapTag$3;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isMap.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsSet.js
/** `Object#toString` result references. */
var setTag$3 = "[object Set]";
/**
* The base implementation of `_.isSet` without Node.js optimizations.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a set, else `false`.
*/
function baseIsSet(value) {
	return isObjectLike(value) && _getTag_default(value) == setTag$3;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isSet.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseClone.js
/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;
var CLONE_FLAT_FLAG = 2;
var CLONE_SYMBOLS_FLAG$1 = 4;
/** `Object#toString` result references. */
var argsTag$1 = "[object Arguments]";
var arrayTag$1 = "[object Array]";
var boolTag$1 = "[object Boolean]";
var dateTag$1 = "[object Date]";
var errorTag$1 = "[object Error]";
var funcTag = "[object Function]";
var genTag = "[object GeneratorFunction]";
var mapTag$2 = "[object Map]";
var numberTag$1 = "[object Number]";
var objectTag$1 = "[object Object]";
var regexpTag$2 = "[object RegExp]";
var setTag$2 = "[object Set]";
var stringTag$2 = "[object String]";
var symbolTag$1 = "[object Symbol]";
var weakMapTag = "[object WeakMap]";
var arrayBufferTag$1 = "[object ArrayBuffer]";
var dataViewTag$1 = "[object DataView]";
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
cloneableTags[argsTag$1] = cloneableTags[arrayTag$1] = cloneableTags[arrayBufferTag$1] = cloneableTags[dataViewTag$1] = cloneableTags[boolTag$1] = cloneableTags[dateTag$1] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag$2] = cloneableTags[numberTag$1] = cloneableTags[objectTag$1] = cloneableTags[regexpTag$2] = cloneableTags[setTag$2] = cloneableTags[stringTag$2] = cloneableTags[symbolTag$1] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag$1] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
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
	var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG$1;
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
		if (tag == objectTag$1 || tag == argsTag$1 || isFunc && !object) {
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/clone.js
/** Used to compose bitmasks for cloning. */
var CLONE_SYMBOLS_FLAG = 4;
/**
* Creates a shallow clone of `value`.
*
* **Note:** This method is loosely based on the
* [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
* and supports cloning arrays, array buffers, booleans, date objects, maps,
* numbers, `Object` objects, regexes, sets, strings, symbols, and typed
* arrays. The own enumerable properties of `arguments` objects are cloned
* as plain objects. An empty object is returned for uncloneable values such
* as error objects, functions, DOM nodes, and WeakMaps.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to clone.
* @returns {*} Returns the cloned value.
* @see _.cloneDeep
* @example
*
* var objects = [{ 'a': 1 }, { 'b': 2 }];
*
* var shallow = _.clone(objects);
* console.log(shallow[0] === objects[0]);
* // => true
*/
function clone(value) {
	return baseClone(value, CLONE_SYMBOLS_FLAG);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/compact.js
/**
* Creates an array with all falsey values removed. The values `false`, `null`,
* `0`, `""`, `undefined`, and `NaN` are falsey.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {Array} array The array to compact.
* @returns {Array} Returns the new array of filtered values.
* @example
*
* _.compact([0, 1, false, 2, '', 3]);
* // => [1, 2, 3]
*/
function compact(array) {
	var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
	while (++index < length) {
		var value = array[index];
		if (value) result[resIndex++] = value;
	}
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_setCacheAdd.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_setCacheHas.js
/**
* Checks if `value` is in the array cache.
*
* @private
* @name has
* @memberOf SetCache
* @param {*} value The value to search for.
* @returns {number} Returns `true` if `value` is found, else `false`.
*/
function setCacheHas(value) {
	return this.__data__.has(value);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_SetCache.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arraySome.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_cacheHas.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_equalArrays.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapToArray.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_setToArray.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_equalByTag.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1;
var COMPARE_UNORDERED_FLAG$2 = 2;
/** `Object#toString` result references. */
var boolTag = "[object Boolean]";
var dateTag = "[object Date]";
var errorTag = "[object Error]";
var mapTag$1 = "[object Map]";
var numberTag = "[object Number]";
var regexpTag$1 = "[object RegExp]";
var setTag$1 = "[object Set]";
var stringTag$1 = "[object String]";
var symbolTag = "[object Symbol]";
var arrayBufferTag = "[object ArrayBuffer]";
var dataViewTag = "[object DataView]";
/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0;
var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
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
		case regexpTag$1:
		case stringTag$1: return object == other + "";
		case mapTag$1: var convert = mapToArray;
		case setTag$1:
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
		case symbolTag: if (symbolValueOf) return symbolValueOf.call(object) == symbolValueOf.call(other);
	}
	return false;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_equalObjects.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;
/** Used to check objects for own properties. */
var hasOwnProperty$5 = Object.prototype.hasOwnProperty;
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
		if (!(isPartial ? key in other : hasOwnProperty$5.call(other, key))) return false;
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsEqualDeep.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;
/** `Object#toString` result references. */
var argsTag = "[object Arguments]";
var arrayTag = "[object Array]";
var objectTag = "[object Object]";
/** Used to check objects for own properties. */
var hasOwnProperty$4 = Object.prototype.hasOwnProperty;
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
		var objIsWrapped = objIsObj && hasOwnProperty$4.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty$4.call(other, "__wrapped__");
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsEqual.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsMatch.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isStrictComparable.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getMatchData.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_matchesStrictComparable.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseMatches.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseHasIn.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hasPath.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/hasIn.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseMatchesProperty.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseProperty.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_basePropertyDeep.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/property.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIteratee.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayAggregator.js
/**
* A specialized version of `baseAggregator` for arrays.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} setter The function to set `accumulator` values.
* @param {Function} iteratee The iteratee to transform keys.
* @param {Object} accumulator The initial aggregated object.
* @returns {Function} Returns `accumulator`.
*/
function arrayAggregator(array, setter, iteratee, accumulator) {
	var index = -1, length = array == null ? 0 : array.length;
	while (++index < length) {
		var value = array[index];
		setter(accumulator, value, iteratee(value), array);
	}
	return accumulator;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createBaseFor.js
/**
* Creates a base function for methods like `_.forIn` and `_.forOwn`.
*
* @private
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {Function} Returns the new base function.
*/
function createBaseFor(fromRight) {
	return function(object, iteratee, keysFunc) {
		var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
		while (length--) {
			var key = props[fromRight ? length : ++index];
			if (iteratee(iterable[key], key, iterable) === false) break;
		}
		return object;
	};
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseFor.js
/**
* The base implementation of `baseForOwn` which iterates over `object`
* properties returned by `keysFunc` and invokes `iteratee` for each property.
* Iteratee functions may exit iteration early by explicitly returning `false`.
*
* @private
* @param {Object} object The object to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @param {Function} keysFunc The function to get the keys of `object`.
* @returns {Object} Returns `object`.
*/
var baseFor = createBaseFor();
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseForOwn.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createBaseEach.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseEach.js
/**
* The base implementation of `_.forEach` without support for iteratee shorthands.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array|Object} Returns `collection`.
*/
var baseEach = createBaseEach(baseForOwn);
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseAggregator.js
/**
* Aggregates elements of `collection` on `accumulator` with keys transformed
* by `iteratee` and values set by `setter`.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} setter The function to set `accumulator` values.
* @param {Function} iteratee The iteratee to transform keys.
* @param {Object} accumulator The initial aggregated object.
* @returns {Function} Returns `accumulator`.
*/
function baseAggregator(collection, setter, iteratee, accumulator) {
	baseEach(collection, function(value, key, collection) {
		setter(accumulator, value, iteratee(value), collection);
	});
	return accumulator;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createAggregator.js
/**
* Creates a function like `_.groupBy`.
*
* @private
* @param {Function} setter The function to set accumulator values.
* @param {Function} [initializer] The accumulator object initializer.
* @returns {Function} Returns the new aggregator function.
*/
function createAggregator(setter, initializer) {
	return function(collection, iteratee) {
		var func = isArray(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
		return func(collection, setter, baseIteratee(iteratee, 2), accumulator);
	};
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/defaults.js
/** Used for built-in method references. */
var objectProto = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto.hasOwnProperty;
/**
* Assigns own and inherited enumerable string keyed properties of source
* objects to the destination object for all destination properties that
* resolve to `undefined`. Source objects are applied from left to right.
* Once a property is set, additional values of the same property are ignored.
*
* **Note:** This method mutates `object`.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Object
* @param {Object} object The destination object.
* @param {...Object} [sources] The source objects.
* @returns {Object} Returns `object`.
* @see _.defaultsDeep
* @example
*
* _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
* // => { 'a': 1, 'b': 2 }
*/
var defaults = baseRest(function(object, sources) {
	object = Object(object);
	var index = -1;
	var length = sources.length;
	var guard = length > 2 ? sources[2] : void 0;
	if (guard && isIterateeCall(sources[0], sources[1], guard)) length = 1;
	while (++index < length) {
		var source = sources[index];
		var props = keysIn(source);
		var propsIndex = -1;
		var propsLength = props.length;
		while (++propsIndex < propsLength) {
			var key = props[propsIndex];
			var value = object[key];
			if (value === void 0 || eq(value, objectProto[key]) && !hasOwnProperty$3.call(object, key)) object[key] = source[key];
		}
	}
	return object;
});
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isArrayLikeObject.js
/**
* This method is like `_.isArrayLike` except that it also checks if `value`
* is an object.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an array-like object,
*  else `false`.
* @example
*
* _.isArrayLikeObject([1, 2, 3]);
* // => true
*
* _.isArrayLikeObject(document.body.children);
* // => true
*
* _.isArrayLikeObject('abc');
* // => false
*
* _.isArrayLikeObject(_.noop);
* // => false
*/
function isArrayLikeObject(value) {
	return isObjectLike(value) && isArrayLike(value);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayIncludesWith.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseDifference.js
/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE$1 = 200;
/**
* The base implementation of methods like `_.difference` without support
* for excluding multiple arrays or iteratee shorthands.
*
* @private
* @param {Array} array The array to inspect.
* @param {Array} values The values to exclude.
* @param {Function} [iteratee] The iteratee invoked per element.
* @param {Function} [comparator] The comparator invoked per element.
* @returns {Array} Returns the new array of filtered values.
*/
function baseDifference(array, values, iteratee, comparator) {
	var index = -1, includes = arrayIncludes, isCommon = true, length = array.length, result = [], valuesLength = values.length;
	if (!length) return result;
	if (iteratee) values = arrayMap(values, baseUnary(iteratee));
	if (comparator) {
		includes = arrayIncludesWith;
		isCommon = false;
	} else if (values.length >= LARGE_ARRAY_SIZE$1) {
		includes = cacheHas;
		isCommon = false;
		values = new SetCache(values);
	}
	outer: while (++index < length) {
		var value = array[index], computed = iteratee == null ? value : iteratee(value);
		value = comparator || value !== 0 ? value : 0;
		if (isCommon && computed === computed) {
			var valuesIndex = valuesLength;
			while (valuesIndex--) if (values[valuesIndex] === computed) continue outer;
			result.push(value);
		} else if (!includes(values, computed, comparator)) result.push(value);
	}
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/difference.js
/**
* Creates an array of `array` values not included in the other given arrays
* using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
* for equality comparisons. The order and references of result values are
* determined by the first array.
*
* **Note:** Unlike `_.pullAll`, this method returns a new array.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {Array} array The array to inspect.
* @param {...Array} [values] The values to exclude.
* @returns {Array} Returns the new array of filtered values.
* @see _.without, _.xor
* @example
*
* _.difference([2, 1], [2, 3]);
* // => [1]
*/
var difference = baseRest(function(array, values) {
	return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true)) : [];
});
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/last.js
/**
* Gets the last element of `array`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {Array} array The array to query.
* @returns {*} Returns the last element of `array`.
* @example
*
* _.last([1, 2, 3]);
* // => 3
*/
function last(array) {
	var length = array == null ? 0 : array.length;
	return length ? array[length - 1] : void 0;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/drop.js
/**
* Creates a slice of `array` with `n` elements dropped from the beginning.
*
* @static
* @memberOf _
* @since 0.5.0
* @category Array
* @param {Array} array The array to query.
* @param {number} [n=1] The number of elements to drop.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {Array} Returns the slice of `array`.
* @example
*
* _.drop([1, 2, 3]);
* // => [2, 3]
*
* _.drop([1, 2, 3], 2);
* // => [3]
*
* _.drop([1, 2, 3], 5);
* // => []
*
* _.drop([1, 2, 3], 0);
* // => [1, 2, 3]
*/
function drop(array, n, guard) {
	var length = array == null ? 0 : array.length;
	if (!length) return [];
	n = guard || n === void 0 ? 1 : toInteger(n);
	return baseSlice(array, n < 0 ? 0 : n, length);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/dropRight.js
/**
* Creates a slice of `array` with `n` elements dropped from the end.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Array
* @param {Array} array The array to query.
* @param {number} [n=1] The number of elements to drop.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {Array} Returns the slice of `array`.
* @example
*
* _.dropRight([1, 2, 3]);
* // => [1, 2]
*
* _.dropRight([1, 2, 3], 2);
* // => [1]
*
* _.dropRight([1, 2, 3], 5);
* // => []
*
* _.dropRight([1, 2, 3], 0);
* // => [1, 2, 3]
*/
function dropRight(array, n, guard) {
	var length = array == null ? 0 : array.length;
	if (!length) return [];
	n = guard || n === void 0 ? 1 : toInteger(n);
	n = length - n;
	return baseSlice(array, 0, n < 0 ? 0 : n);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_castFunction.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/forEach.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayEvery.js
/**
* A specialized version of `_.every` for arrays without support for
* iteratee shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} predicate The function invoked per iteration.
* @returns {boolean} Returns `true` if all elements pass the predicate check,
*  else `false`.
*/
function arrayEvery(array, predicate) {
	var index = -1, length = array == null ? 0 : array.length;
	while (++index < length) if (!predicate(array[index], index, array)) return false;
	return true;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseEvery.js
/**
* The base implementation of `_.every` without support for iteratee shorthands.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} predicate The function invoked per iteration.
* @returns {boolean} Returns `true` if all elements pass the predicate check,
*  else `false`
*/
function baseEvery(collection, predicate) {
	var result = true;
	baseEach(collection, function(value, index, collection) {
		result = !!predicate(value, index, collection);
		return result;
	});
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/every.js
/**
* Checks if `predicate` returns truthy for **all** elements of `collection`.
* Iteration is stopped once `predicate` returns falsey. The predicate is
* invoked with three arguments: (value, index|key, collection).
*
* **Note:** This method returns `true` for
* [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
* [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
* elements of empty collections.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {boolean} Returns `true` if all elements pass the predicate check,
*  else `false`.
* @example
*
* _.every([true, 1, null, 'yes'], Boolean);
* // => false
*
* var users = [
*   { 'user': 'barney', 'age': 36, 'active': false },
*   { 'user': 'fred',   'age': 40, 'active': false }
* ];
*
* // The `_.matches` iteratee shorthand.
* _.every(users, { 'user': 'barney', 'active': false });
* // => false
*
* // The `_.matchesProperty` iteratee shorthand.
* _.every(users, ['active', false]);
* // => true
*
* // The `_.property` iteratee shorthand.
* _.every(users, 'active');
* // => false
*/
function every(collection, predicate, guard) {
	var func = isArray(collection) ? arrayEvery : baseEvery;
	if (guard && isIterateeCall(collection, predicate, guard)) predicate = void 0;
	return func(collection, baseIteratee(predicate, 3));
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseFilter.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/filter.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createFind.js
/**
* Creates a `_.find` or `_.findLast` function.
*
* @private
* @param {Function} findIndexFunc The function to find the collection index.
* @returns {Function} Returns the new find function.
*/
function createFind(findIndexFunc) {
	return function(collection, predicate, fromIndex) {
		var iterable = Object(collection);
		if (!isArrayLike(collection)) {
			var iteratee = baseIteratee(predicate, 3);
			collection = keys(collection);
			predicate = function(key) {
				return iteratee(iterable[key], key, iterable);
			};
		}
		var index = findIndexFunc(collection, predicate, fromIndex);
		return index > -1 ? iterable[iteratee ? collection[index] : index] : void 0;
	};
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/findIndex.js
var nativeMax$2 = Math.max;
/**
* This method is like `_.find` except that it returns the index of the first
* element `predicate` returns truthy for instead of the element itself.
*
* @static
* @memberOf _
* @since 1.1.0
* @category Array
* @param {Array} array The array to inspect.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @param {number} [fromIndex=0] The index to search from.
* @returns {number} Returns the index of the found element, else `-1`.
* @example
*
* var users = [
*   { 'user': 'barney',  'active': false },
*   { 'user': 'fred',    'active': false },
*   { 'user': 'pebbles', 'active': true }
* ];
*
* _.findIndex(users, function(o) { return o.user == 'barney'; });
* // => 0
*
* // The `_.matches` iteratee shorthand.
* _.findIndex(users, { 'user': 'fred', 'active': false });
* // => 1
*
* // The `_.matchesProperty` iteratee shorthand.
* _.findIndex(users, ['active', false]);
* // => 0
*
* // The `_.property` iteratee shorthand.
* _.findIndex(users, 'active');
* // => 2
*/
function findIndex(array, predicate, fromIndex) {
	var length = array == null ? 0 : array.length;
	if (!length) return -1;
	var index = fromIndex == null ? 0 : toInteger(fromIndex);
	if (index < 0) index = nativeMax$2(length + index, 0);
	return baseFindIndex(array, baseIteratee(predicate, 3), index);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/find.js
/**
* Iterates over elements of `collection`, returning the first element
* `predicate` returns truthy for. The predicate is invoked with three
* arguments: (value, index|key, collection).
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object} collection The collection to inspect.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @param {number} [fromIndex=0] The index to search from.
* @returns {*} Returns the matched element, else `undefined`.
* @example
*
* var users = [
*   { 'user': 'barney',  'age': 36, 'active': true },
*   { 'user': 'fred',    'age': 40, 'active': false },
*   { 'user': 'pebbles', 'age': 1,  'active': true }
* ];
*
* _.find(users, function(o) { return o.age < 40; });
* // => object for 'barney'
*
* // The `_.matches` iteratee shorthand.
* _.find(users, { 'age': 1, 'active': true });
* // => object for 'pebbles'
*
* // The `_.matchesProperty` iteratee shorthand.
* _.find(users, ['active', false]);
* // => object for 'fred'
*
* // The `_.property` iteratee shorthand.
* _.find(users, 'active');
* // => object for 'barney'
*/
var find = createFind(findIndex);
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/head.js
/**
* Gets the first element of `array`.
*
* @static
* @memberOf _
* @since 0.1.0
* @alias first
* @category Array
* @param {Array} array The array to query.
* @returns {*} Returns the first element of `array`.
* @example
*
* _.head([1, 2, 3]);
* // => 1
*
* _.head([]);
* // => undefined
*/
function head(array) {
	return array && array.length ? array[0] : void 0;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseMap.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/map.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/flatMap.js
/**
* Creates a flattened array of values by running each element in `collection`
* thru `iteratee` and flattening the mapped results. The iteratee is invoked
* with three arguments: (value, index|key, collection).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @returns {Array} Returns the new flattened array.
* @example
*
* function duplicate(n) {
*   return [n, n];
* }
*
* _.flatMap([1, 2], duplicate);
* // => [1, 1, 2, 2]
*/
function flatMap$1(collection, iteratee) {
	return baseFlatten(map(collection, iteratee), 1);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/groupBy.js
/** Used to check objects for own properties. */
var hasOwnProperty$2 = Object.prototype.hasOwnProperty;
/**
* Creates an object composed of keys generated from the results of running
* each element of `collection` thru `iteratee`. The order of grouped values
* is determined by the order they occur in `collection`. The corresponding
* value of each key is an array of elements responsible for generating the
* key. The iteratee is invoked with one argument: (value).
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [iteratee=_.identity] The iteratee to transform keys.
* @returns {Object} Returns the composed aggregate object.
* @example
*
* _.groupBy([6.1, 4.2, 6.3], Math.floor);
* // => { '4': [4.2], '6': [6.1, 6.3] }
*
* // The `_.property` iteratee shorthand.
* _.groupBy(['one', 'two', 'three'], 'length');
* // => { '3': ['one', 'two'], '5': ['three'] }
*/
var groupBy = createAggregator(function(result, value, key) {
	if (hasOwnProperty$2.call(result, key)) result[key].push(value);
	else baseAssignValue(result, key, [value]);
});
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseHas.js
/** Used to check objects for own properties. */
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
/**
* The base implementation of `_.has` without support for deep paths.
*
* @private
* @param {Object} [object] The object to query.
* @param {Array|string} key The key to check.
* @returns {boolean} Returns `true` if `key` exists, else `false`.
*/
function baseHas(object, key) {
	return object != null && hasOwnProperty$1.call(object, key);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/has.js
/**
* Checks if `path` is a direct property of `object`.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Object
* @param {Object} object The object to query.
* @param {Array|string} path The path to check.
* @returns {boolean} Returns `true` if `path` exists, else `false`.
* @example
*
* var object = { 'a': { 'b': 2 } };
* var other = _.create({ 'a': _.create({ 'b': 2 }) });
*
* _.has(object, 'a');
* // => true
*
* _.has(object, 'a.b');
* // => true
*
* _.has(object, ['a', 'b']);
* // => true
*
* _.has(other, 'a');
* // => false
*/
function has(object, path) {
	return object != null && hasPath(object, path, baseHas);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isString.js
/** `Object#toString` result references. */
var stringTag = "[object String]";
/**
* Checks if `value` is classified as a `String` primitive or object.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a string, else `false`.
* @example
*
* _.isString('abc');
* // => true
*
* _.isString(1);
* // => false
*/
function isString(value) {
	return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseValues.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/values.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/includes.js
var nativeMax$1 = Math.max;
/**
* Checks if `value` is in `collection`. If `collection` is a string, it's
* checked for a substring of `value`, otherwise
* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
* is used for equality comparisons. If `fromIndex` is negative, it's used as
* the offset from the end of `collection`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object|string} collection The collection to inspect.
* @param {*} value The value to search for.
* @param {number} [fromIndex=0] The index to search from.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
* @returns {boolean} Returns `true` if `value` is found, else `false`.
* @example
*
* _.includes([1, 2, 3], 1);
* // => true
*
* _.includes([1, 2, 3], 1, 2);
* // => false
*
* _.includes({ 'a': 1, 'b': 2 }, 1);
* // => true
*
* _.includes('abcd', 'bc');
* // => true
*/
function includes(collection, value, fromIndex, guard) {
	collection = isArrayLike(collection) ? collection : values(collection);
	fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
	var length = collection.length;
	if (fromIndex < 0) fromIndex = nativeMax$1(length + fromIndex, 0);
	return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/indexOf.js
var nativeMax = Math.max;
/**
* Gets the index at which the first occurrence of `value` is found in `array`
* using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
* for equality comparisons. If `fromIndex` is negative, it's used as the
* offset from the end of `array`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {Array} array The array to inspect.
* @param {*} value The value to search for.
* @param {number} [fromIndex=0] The index to search from.
* @returns {number} Returns the index of the matched value, else `-1`.
* @example
*
* _.indexOf([1, 2, 1, 2], 2);
* // => 1
*
* // Search from the `fromIndex`.
* _.indexOf([1, 2, 1, 2], 2, 2);
* // => 3
*/
function indexOf(array, value, fromIndex) {
	var length = array == null ? 0 : array.length;
	if (!length) return -1;
	var index = fromIndex == null ? 0 : toInteger(fromIndex);
	if (index < 0) index = nativeMax(length + index, 0);
	return baseIndexOf(array, value, index);
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isEmpty.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsRegExp.js
/** `Object#toString` result references. */
var regexpTag = "[object RegExp]";
/**
* The base implementation of `_.isRegExp` without Node.js optimizations.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
*/
function baseIsRegExp(value) {
	return isObjectLike(value) && baseGetTag(value) == regexpTag;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isRegExp.js
var nodeIsRegExp = nodeUtil && nodeUtil.isRegExp;
/**
* Checks if `value` is classified as a `RegExp` object.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
* @example
*
* _.isRegExp(/abc/);
* // => true
*
* _.isRegExp('/abc/');
* // => false
*/
var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isUndefined.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/negate.js
/** Error message constants. */
var FUNC_ERROR_TEXT = "Expected a function";
/**
* Creates a function that negates the result of the predicate `func`. The
* `func` predicate is invoked with the `this` binding and arguments of the
* created function.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Function
* @param {Function} predicate The predicate to negate.
* @returns {Function} Returns the new negated function.
* @example
*
* function isEven(n) {
*   return n % 2 == 0;
* }
*
* _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
* // => [1, 3, 5]
*/
function negate(predicate) {
	if (typeof predicate != "function") throw new TypeError(FUNC_ERROR_TEXT);
	return function() {
		var args = arguments;
		switch (args.length) {
			case 0: return !predicate.call(this);
			case 1: return !predicate.call(this, args[0]);
			case 2: return !predicate.call(this, args[0], args[1]);
			case 3: return !predicate.call(this, args[0], args[1], args[2]);
		}
		return !predicate.apply(this, args);
	};
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseSet.js
/**
* The base implementation of `_.set`.
*
* @private
* @param {Object} object The object to modify.
* @param {Array|string} path The path of the property to set.
* @param {*} value The value to set.
* @param {Function} [customizer] The function to customize path creation.
* @returns {Object} Returns `object`.
*/
function baseSet(object, path, value, customizer) {
	if (!isObject(object)) return object;
	path = castPath(path, object);
	var index = -1, length = path.length, lastIndex = length - 1, nested = object;
	while (nested != null && ++index < length) {
		var key = toKey(path[index]), newValue = value;
		if (key === "__proto__" || key === "constructor" || key === "prototype") return object;
		if (index != lastIndex) {
			var objValue = nested[key];
			newValue = customizer ? customizer(objValue, key, nested) : void 0;
			if (newValue === void 0) newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
		}
		assignValue(nested, key, newValue);
		nested = nested[key];
	}
	return object;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_basePickBy.js
/**
* The base implementation of  `_.pickBy` without support for iteratee shorthands.
*
* @private
* @param {Object} object The source object.
* @param {string[]} paths The property paths to pick.
* @param {Function} predicate The function invoked per property.
* @returns {Object} Returns the new object.
*/
function basePickBy(object, paths, predicate) {
	var index = -1, length = paths.length, result = {};
	while (++index < length) {
		var path = paths[index], value = baseGet(object, path);
		if (predicate(value, path)) baseSet(result, castPath(path, object), value);
	}
	return result;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/pickBy.js
/**
* Creates an object composed of the `object` properties `predicate` returns
* truthy for. The predicate is invoked with two arguments: (value, key).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Object
* @param {Object} object The source object.
* @param {Function} [predicate=_.identity] The function invoked per property.
* @returns {Object} Returns the new object.
* @example
*
* var object = { 'a': 1, 'b': '2', 'c': 3 };
*
* _.pickBy(object, _.isNumber);
* // => { 'a': 1, 'c': 3 }
*/
function pickBy(object, predicate) {
	if (object == null) return {};
	var props = arrayMap(getAllKeysIn(object), function(prop) {
		return [prop];
	});
	predicate = baseIteratee(predicate);
	return basePickBy(object, props, function(value, path) {
		return predicate(value, path[0]);
	});
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseReduce.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/reduce.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/reject.js
/**
* The opposite of `_.filter`; this method returns the elements of `collection`
* that `predicate` does **not** return truthy for.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @returns {Array} Returns the new filtered array.
* @see _.filter
* @example
*
* var users = [
*   { 'user': 'barney', 'age': 36, 'active': false },
*   { 'user': 'fred',   'age': 40, 'active': true }
* ];
*
* _.reject(users, function(o) { return !o.active; });
* // => objects for ['fred']
*
* // The `_.matches` iteratee shorthand.
* _.reject(users, { 'age': 40, 'active': true });
* // => objects for ['barney']
*
* // The `_.matchesProperty` iteratee shorthand.
* _.reject(users, ['active', false]);
* // => objects for ['fred']
*
* // The `_.property` iteratee shorthand.
* _.reject(users, 'active');
* // => objects for ['barney']
*/
function reject(collection, predicate) {
	return (isArray(collection) ? arrayFilter : baseFilter)(collection, negate(baseIteratee(predicate, 3)));
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseSome.js
/**
* The base implementation of `_.some` without support for iteratee shorthands.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} predicate The function invoked per iteration.
* @returns {boolean} Returns `true` if any element passes the predicate check,
*  else `false`.
*/
function baseSome(collection, predicate) {
	var result;
	baseEach(collection, function(value, index, collection) {
		result = predicate(value, index, collection);
		return !result;
	});
	return !!result;
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/some.js
/**
* Checks if `predicate` returns truthy for **any** element of `collection`.
* Iteration is stopped once `predicate` returns truthy. The predicate is
* invoked with three arguments: (value, index|key, collection).
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
* @returns {boolean} Returns `true` if any element passes the predicate check,
*  else `false`.
* @example
*
* _.some([null, 0, 'yes', false], Boolean);
* // => true
*
* var users = [
*   { 'user': 'barney', 'active': true },
*   { 'user': 'fred',   'active': false }
* ];
*
* // The `_.matches` iteratee shorthand.
* _.some(users, { 'user': 'barney', 'active': false });
* // => false
*
* // The `_.matchesProperty` iteratee shorthand.
* _.some(users, ['active', false]);
* // => true
*
* // The `_.property` iteratee shorthand.
* _.some(users, 'active');
* // => true
*/
function some(collection, predicate, guard) {
	var func = isArray(collection) ? arraySome : baseSome;
	if (guard && isIterateeCall(collection, predicate, guard)) predicate = void 0;
	return func(collection, baseIteratee(predicate, 3));
}
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createSet.js
/**
* Creates a set object of `values`.
*
* @private
* @param {Array} values The values to add to the set.
* @returns {Object} Returns the new set.
*/
var createSet = !(Set$1 && 1 / setToArray(new Set$1([, -0]))[1] == 1 / 0) ? noop : function(values) {
	return new Set$1(values);
};
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseUniq.js
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
// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/uniq.js
/**
* Creates a duplicate-free version of an array, using
* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
* for equality comparisons, in which only the first occurrence of each element
* is kept. The order of result values is determined by the order they occur
* in the array.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {Array} array The array to inspect.
* @returns {Array} Returns the new duplicate free array.
* @example
*
* _.uniq([2, 1, 2]);
* // => [2, 1]
*/
function uniq(array) {
	return array && array.length ? baseUniq(array) : [];
}
// ../../node_modules/.pnpm/@chevrotain+utils@11.0.3/node_modules/@chevrotain/utils/lib/src/print.js
function PRINT_ERROR(msg) {
	/* istanbul ignore else - can't override global.console in node.js */
	if (console && console.error) console.error(`Error: ${msg}`);
}
function PRINT_WARNING(msg) {
	/* istanbul ignore else - can't override global.console in node.js*/
	if (console && console.warn) console.warn(`Warning: ${msg}`);
}
// ../../node_modules/.pnpm/@chevrotain+utils@11.0.3/node_modules/@chevrotain/utils/lib/src/timer.js
function timer(func) {
	const start = (/* @__PURE__ */ new Date()).getTime();
	const val = func();
	return {
		time: (/* @__PURE__ */ new Date()).getTime() - start,
		value: val
	};
}
// ../../node_modules/.pnpm/@chevrotain+utils@11.0.3/node_modules/@chevrotain/utils/lib/src/to-fast-properties.js
function toFastProperties(toBecomeFast) {
	function FakeConstructor() {}
	FakeConstructor.prototype = toBecomeFast;
	const fakeInstance = new FakeConstructor();
	function fakeAccess() {
		return typeof fakeInstance.bar;
	}
	fakeAccess();
	fakeAccess();
	return toBecomeFast;
}
// ../../node_modules/.pnpm/@chevrotain+gast@11.0.3/node_modules/@chevrotain/gast/lib/src/model.js
function tokenLabel$1(tokType) {
	if (hasTokenLabel$1(tokType)) return tokType.LABEL;
	else return tokType.name;
}
function hasTokenLabel$1(obj) {
	return isString(obj.LABEL) && obj.LABEL !== "";
}
var AbstractProduction = class {
	get definition() {
		return this._definition;
	}
	set definition(value) {
		this._definition = value;
	}
	constructor(_definition) {
		this._definition = _definition;
	}
	accept(visitor) {
		visitor.visit(this);
		forEach(this.definition, (prod) => {
			prod.accept(visitor);
		});
	}
};
var NonTerminal = class extends AbstractProduction {
	constructor(options) {
		super([]);
		this.idx = 1;
		assign(this, pickBy(options, (v) => v !== void 0));
	}
	set definition(definition) {}
	get definition() {
		if (this.referencedRule !== void 0) return this.referencedRule.definition;
		return [];
	}
	accept(visitor) {
		visitor.visit(this);
	}
};
var Rule = class extends AbstractProduction {
	constructor(options) {
		super(options.definition);
		this.orgText = "";
		assign(this, pickBy(options, (v) => v !== void 0));
	}
};
var Alternative = class extends AbstractProduction {
	constructor(options) {
		super(options.definition);
		this.ignoreAmbiguities = false;
		assign(this, pickBy(options, (v) => v !== void 0));
	}
};
var Option$1 = class extends AbstractProduction {
	constructor(options) {
		super(options.definition);
		this.idx = 1;
		assign(this, pickBy(options, (v) => v !== void 0));
	}
};
var RepetitionMandatory = class extends AbstractProduction {
	constructor(options) {
		super(options.definition);
		this.idx = 1;
		assign(this, pickBy(options, (v) => v !== void 0));
	}
};
var RepetitionMandatoryWithSeparator = class extends AbstractProduction {
	constructor(options) {
		super(options.definition);
		this.idx = 1;
		assign(this, pickBy(options, (v) => v !== void 0));
	}
};
var Repetition = class extends AbstractProduction {
	constructor(options) {
		super(options.definition);
		this.idx = 1;
		assign(this, pickBy(options, (v) => v !== void 0));
	}
};
var RepetitionWithSeparator = class extends AbstractProduction {
	constructor(options) {
		super(options.definition);
		this.idx = 1;
		assign(this, pickBy(options, (v) => v !== void 0));
	}
};
var Alternation = class extends AbstractProduction {
	get definition() {
		return this._definition;
	}
	set definition(value) {
		this._definition = value;
	}
	constructor(options) {
		super(options.definition);
		this.idx = 1;
		this.ignoreAmbiguities = false;
		this.hasPredicates = false;
		assign(this, pickBy(options, (v) => v !== void 0));
	}
};
var Terminal = class {
	constructor(options) {
		this.idx = 1;
		assign(this, pickBy(options, (v) => v !== void 0));
	}
	accept(visitor) {
		visitor.visit(this);
	}
};
function serializeGrammar(topRules) {
	return map(topRules, serializeProduction);
}
function serializeProduction(node) {
	function convertDefinition(definition) {
		return map(definition, serializeProduction);
	}
	/* istanbul ignore else */
	if (node instanceof NonTerminal) {
		const serializedNonTerminal = {
			type: "NonTerminal",
			name: node.nonTerminalName,
			idx: node.idx
		};
		if (isString(node.label)) serializedNonTerminal.label = node.label;
		return serializedNonTerminal;
	} else if (node instanceof Alternative) return {
		type: "Alternative",
		definition: convertDefinition(node.definition)
	};
	else if (node instanceof Option$1) return {
		type: "Option",
		idx: node.idx,
		definition: convertDefinition(node.definition)
	};
	else if (node instanceof RepetitionMandatory) return {
		type: "RepetitionMandatory",
		idx: node.idx,
		definition: convertDefinition(node.definition)
	};
	else if (node instanceof RepetitionMandatoryWithSeparator) return {
		type: "RepetitionMandatoryWithSeparator",
		idx: node.idx,
		separator: serializeProduction(new Terminal({ terminalType: node.separator })),
		definition: convertDefinition(node.definition)
	};
	else if (node instanceof RepetitionWithSeparator) return {
		type: "RepetitionWithSeparator",
		idx: node.idx,
		separator: serializeProduction(new Terminal({ terminalType: node.separator })),
		definition: convertDefinition(node.definition)
	};
	else if (node instanceof Repetition) return {
		type: "Repetition",
		idx: node.idx,
		definition: convertDefinition(node.definition)
	};
	else if (node instanceof Alternation) return {
		type: "Alternation",
		idx: node.idx,
		definition: convertDefinition(node.definition)
	};
	else if (node instanceof Terminal) {
		const serializedTerminal = {
			type: "Terminal",
			name: node.terminalType.name,
			label: tokenLabel$1(node.terminalType),
			idx: node.idx
		};
		if (isString(node.label)) serializedTerminal.terminalLabel = node.label;
		const pattern = node.terminalType.PATTERN;
		if (node.terminalType.PATTERN) serializedTerminal.pattern = isRegExp(pattern) ? pattern.source : pattern;
		return serializedTerminal;
	} else if (node instanceof Rule) return {
		type: "Rule",
		name: node.name,
		orgText: node.orgText,
		definition: convertDefinition(node.definition)
	};
	else throw Error("non exhaustive match");
}
// ../../node_modules/.pnpm/@chevrotain+gast@11.0.3/node_modules/@chevrotain/gast/lib/src/visitor.js
var GAstVisitor = class {
	visit(node) {
		const nodeAny = node;
		switch (nodeAny.constructor) {
			case NonTerminal: return this.visitNonTerminal(nodeAny);
			case Alternative: return this.visitAlternative(nodeAny);
			case Option$1: return this.visitOption(nodeAny);
			case RepetitionMandatory: return this.visitRepetitionMandatory(nodeAny);
			case RepetitionMandatoryWithSeparator: return this.visitRepetitionMandatoryWithSeparator(nodeAny);
			case RepetitionWithSeparator: return this.visitRepetitionWithSeparator(nodeAny);
			case Repetition: return this.visitRepetition(nodeAny);
			case Alternation: return this.visitAlternation(nodeAny);
			case Terminal: return this.visitTerminal(nodeAny);
			case Rule: return this.visitRule(nodeAny);
			/* c8 ignore next 2 */
			default: throw Error("non exhaustive match");
		}
	}
	/* c8 ignore next */
	visitNonTerminal(node) {}
	/* c8 ignore next */
	visitAlternative(node) {}
	/* c8 ignore next */
	visitOption(node) {}
	/* c8 ignore next */
	visitRepetition(node) {}
	/* c8 ignore next */
	visitRepetitionMandatory(node) {}
	/* c8 ignore next 3 */
	visitRepetitionMandatoryWithSeparator(node) {}
	/* c8 ignore next */
	visitRepetitionWithSeparator(node) {}
	/* c8 ignore next */
	visitAlternation(node) {}
	/* c8 ignore next */
	visitTerminal(node) {}
	/* c8 ignore next */
	visitRule(node) {}
};
// ../../node_modules/.pnpm/@chevrotain+gast@11.0.3/node_modules/@chevrotain/gast/lib/src/helpers.js
function isSequenceProd(prod) {
	return prod instanceof Alternative || prod instanceof Option$1 || prod instanceof Repetition || prod instanceof RepetitionMandatory || prod instanceof RepetitionMandatoryWithSeparator || prod instanceof RepetitionWithSeparator || prod instanceof Terminal || prod instanceof Rule;
}
function isOptionalProd(prod, alreadyVisited = []) {
	if (prod instanceof Option$1 || prod instanceof Repetition || prod instanceof RepetitionWithSeparator) return true;
	if (prod instanceof Alternation) return some(prod.definition, (subProd) => {
		return isOptionalProd(subProd, alreadyVisited);
	});
	else if (prod instanceof NonTerminal && includes(alreadyVisited, prod)) return false;
	else if (prod instanceof AbstractProduction) {
		if (prod instanceof NonTerminal) alreadyVisited.push(prod);
		return every(prod.definition, (subProd) => {
			return isOptionalProd(subProd, alreadyVisited);
		});
	} else return false;
}
function isBranchingProd(prod) {
	return prod instanceof Alternation;
}
function getProductionDslName$1(prod) {
	/* istanbul ignore else */
	if (prod instanceof NonTerminal) return "SUBRULE";
	else if (prod instanceof Option$1) return "OPTION";
	else if (prod instanceof Alternation) return "OR";
	else if (prod instanceof RepetitionMandatory) return "AT_LEAST_ONE";
	else if (prod instanceof RepetitionMandatoryWithSeparator) return "AT_LEAST_ONE_SEP";
	else if (prod instanceof RepetitionWithSeparator) return "MANY_SEP";
	else if (prod instanceof Repetition) return "MANY";
	else if (prod instanceof Terminal) return "CONSUME";
	else throw Error("non exhaustive match");
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/grammar/rest.js
/**
*  A Grammar Walker that computes the "remaining" grammar "after" a productions in the grammar.
*/
var RestWalker = class {
	walk(prod, prevRest = []) {
		forEach(prod.definition, (subProd, index) => {
			const currRest = drop(prod.definition, index + 1);
			/* istanbul ignore else */
			if (subProd instanceof NonTerminal) this.walkProdRef(subProd, currRest, prevRest);
			else if (subProd instanceof Terminal) this.walkTerminal(subProd, currRest, prevRest);
			else if (subProd instanceof Alternative) this.walkFlat(subProd, currRest, prevRest);
			else if (subProd instanceof Option$1) this.walkOption(subProd, currRest, prevRest);
			else if (subProd instanceof RepetitionMandatory) this.walkAtLeastOne(subProd, currRest, prevRest);
			else if (subProd instanceof RepetitionMandatoryWithSeparator) this.walkAtLeastOneSep(subProd, currRest, prevRest);
			else if (subProd instanceof RepetitionWithSeparator) this.walkManySep(subProd, currRest, prevRest);
			else if (subProd instanceof Repetition) this.walkMany(subProd, currRest, prevRest);
			else if (subProd instanceof Alternation) this.walkOr(subProd, currRest, prevRest);
			else throw Error("non exhaustive match");
		});
	}
	walkTerminal(terminal, currRest, prevRest) {}
	walkProdRef(refProd, currRest, prevRest) {}
	walkFlat(flatProd, currRest, prevRest) {
		const fullOrRest = currRest.concat(prevRest);
		this.walk(flatProd, fullOrRest);
	}
	walkOption(optionProd, currRest, prevRest) {
		const fullOrRest = currRest.concat(prevRest);
		this.walk(optionProd, fullOrRest);
	}
	walkAtLeastOne(atLeastOneProd, currRest, prevRest) {
		const fullAtLeastOneRest = [new Option$1({ definition: atLeastOneProd.definition })].concat(currRest, prevRest);
		this.walk(atLeastOneProd, fullAtLeastOneRest);
	}
	walkAtLeastOneSep(atLeastOneSepProd, currRest, prevRest) {
		const fullAtLeastOneSepRest = restForRepetitionWithSeparator(atLeastOneSepProd, currRest, prevRest);
		this.walk(atLeastOneSepProd, fullAtLeastOneSepRest);
	}
	walkMany(manyProd, currRest, prevRest) {
		const fullManyRest = [new Option$1({ definition: manyProd.definition })].concat(currRest, prevRest);
		this.walk(manyProd, fullManyRest);
	}
	walkManySep(manySepProd, currRest, prevRest) {
		const fullManySepRest = restForRepetitionWithSeparator(manySepProd, currRest, prevRest);
		this.walk(manySepProd, fullManySepRest);
	}
	walkOr(orProd, currRest, prevRest) {
		const fullOrRest = currRest.concat(prevRest);
		forEach(orProd.definition, (alt) => {
			const prodWrapper = new Alternative({ definition: [alt] });
			this.walk(prodWrapper, fullOrRest);
		});
	}
};
function restForRepetitionWithSeparator(repSepProd, currRest, prevRest) {
	return [new Option$1({ definition: [new Terminal({ terminalType: repSepProd.separator })].concat(repSepProd.definition) })].concat(currRest, prevRest);
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/grammar/first.js
function first(prod) {
	/* istanbul ignore else */
	if (prod instanceof NonTerminal) return first(prod.referencedRule);
	else if (prod instanceof Terminal) return firstForTerminal(prod);
	else if (isSequenceProd(prod)) return firstForSequence(prod);
	else if (isBranchingProd(prod)) return firstForBranching(prod);
	else throw Error("non exhaustive match");
}
function firstForSequence(prod) {
	let firstSet = [];
	const seq = prod.definition;
	let nextSubProdIdx = 0;
	let hasInnerProdsRemaining = seq.length > nextSubProdIdx;
	let currSubProd;
	let isLastInnerProdOptional = true;
	while (hasInnerProdsRemaining && isLastInnerProdOptional) {
		currSubProd = seq[nextSubProdIdx];
		isLastInnerProdOptional = isOptionalProd(currSubProd);
		firstSet = firstSet.concat(first(currSubProd));
		nextSubProdIdx = nextSubProdIdx + 1;
		hasInnerProdsRemaining = seq.length > nextSubProdIdx;
	}
	return uniq(firstSet);
}
function firstForBranching(prod) {
	return uniq(flatten(map(prod.definition, (innerProd) => {
		return first(innerProd);
	})));
}
function firstForTerminal(terminal) {
	return [terminal.terminalType];
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/constants.js
var IN = "_~IN~_";
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/grammar/follow.js
var ResyncFollowsWalker = class extends RestWalker {
	constructor(topProd) {
		super();
		this.topProd = topProd;
		this.follows = {};
	}
	startWalking() {
		this.walk(this.topProd);
		return this.follows;
	}
	walkTerminal(terminal, currRest, prevRest) {}
	walkProdRef(refProd, currRest, prevRest) {
		const followName = buildBetweenProdsFollowPrefix(refProd.referencedRule, refProd.idx) + this.topProd.name;
		const t_in_topProd_follows = first(new Alternative({ definition: currRest.concat(prevRest) }));
		this.follows[followName] = t_in_topProd_follows;
	}
};
function computeAllProdsFollows(topProductions) {
	const reSyncFollows = {};
	forEach(topProductions, (topProd) => {
		const currRefsFollow = new ResyncFollowsWalker(topProd).startWalking();
		assign(reSyncFollows, currRefsFollow);
	});
	return reSyncFollows;
}
function buildBetweenProdsFollowPrefix(inner, occurenceInParent) {
	return inner.name + occurenceInParent + IN;
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/scan/reg_exp_parser.js
var regExpAstCache = {};
var regExpParser = new RegExpParser();
function getRegExpAst(regExp) {
	const regExpStr = regExp.toString();
	if (regExpAstCache.hasOwnProperty(regExpStr)) return regExpAstCache[regExpStr];
	else {
		const regExpAst = regExpParser.pattern(regExpStr);
		regExpAstCache[regExpStr] = regExpAst;
		return regExpAst;
	}
}
function clearRegExpParserCache() {
	regExpAstCache = {};
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/scan/reg_exp.js
var complementErrorMessage = "Complement Sets are not supported for first char optimization";
var failedOptimizationPrefixMsg = "Unable to use \"first char\" lexer optimizations:\n";
function getOptimizedStartCodesIndices(regExp, ensureOptimizations = false) {
	try {
		const ast = getRegExpAst(regExp);
		return firstCharOptimizedIndices(ast.value, {}, ast.flags.ignoreCase);
	} catch (e) {
		/* istanbul ignore next */
		if (e.message === complementErrorMessage) {
			if (ensureOptimizations) PRINT_WARNING(`${failedOptimizationPrefixMsg}\tUnable to optimize: < ${regExp.toString()} >\n	Complement Sets cannot be automatically optimized.
	This will disable the lexer's first char optimizations.
	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#COMPLEMENT for details.`);
		} else {
			let msgSuffix = "";
			if (ensureOptimizations) msgSuffix = "\n	This will disable the lexer's first char optimizations.\n	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#REGEXP_PARSING for details.";
			PRINT_ERROR(`${failedOptimizationPrefixMsg}\n\tFailed parsing: < ${regExp.toString()} >\n\tUsing the @chevrotain/regexp-to-ast library\n	Please open an issue at: https://github.com/chevrotain/chevrotain/issues` + msgSuffix);
		}
	}
	return [];
}
function firstCharOptimizedIndices(ast, result, ignoreCase) {
	switch (ast.type) {
		case "Disjunction":
			for (let i = 0; i < ast.value.length; i++) firstCharOptimizedIndices(ast.value[i], result, ignoreCase);
			break;
		case "Alternative":
			const terms = ast.value;
			for (let i = 0; i < terms.length; i++) {
				const term = terms[i];
				switch (term.type) {
					case "EndAnchor":
					case "GroupBackReference":
					case "Lookahead":
					case "NegativeLookahead":
					case "StartAnchor":
					case "WordBoundary":
					case "NonWordBoundary": continue;
				}
				const atom = term;
				switch (atom.type) {
					case "Character":
						addOptimizedIdxToResult(atom.value, result, ignoreCase);
						break;
					case "Set":
						if (atom.complement === true) throw Error(complementErrorMessage);
						forEach(atom.value, (code) => {
							if (typeof code === "number") addOptimizedIdxToResult(code, result, ignoreCase);
							else {
								const range = code;
								if (ignoreCase === true) for (let rangeCode = range.from; rangeCode <= range.to; rangeCode++) addOptimizedIdxToResult(rangeCode, result, ignoreCase);
								else {
									for (let rangeCode = range.from; rangeCode <= range.to && rangeCode < 256; rangeCode++) addOptimizedIdxToResult(rangeCode, result, ignoreCase);
									if (range.to >= 256) {
										const minUnOptVal = range.from >= 256 ? range.from : 256;
										const maxUnOptVal = range.to;
										const minOptIdx = charCodeToOptimizedIndex(minUnOptVal);
										const maxOptIdx = charCodeToOptimizedIndex(maxUnOptVal);
										for (let currOptIdx = minOptIdx; currOptIdx <= maxOptIdx; currOptIdx++) result[currOptIdx] = currOptIdx;
									}
								}
							}
						});
						break;
					case "Group":
						firstCharOptimizedIndices(atom.value, result, ignoreCase);
						break;
					/* istanbul ignore next */
					default: throw Error("Non Exhaustive Match");
				}
				const isOptionalQuantifier = atom.quantifier !== void 0 && atom.quantifier.atLeast === 0;
				if (atom.type === "Group" && isWholeOptional(atom) === false || atom.type !== "Group" && isOptionalQuantifier === false) break;
			}
			break;
		/* istanbul ignore next */
		default: throw Error("non exhaustive match!");
	}
	return values(result);
}
function addOptimizedIdxToResult(code, result, ignoreCase) {
	const optimizedCharIdx = charCodeToOptimizedIndex(code);
	result[optimizedCharIdx] = optimizedCharIdx;
	if (ignoreCase === true) handleIgnoreCase(code, result);
}
function handleIgnoreCase(code, result) {
	const char = String.fromCharCode(code);
	const upperChar = char.toUpperCase();
	/* istanbul ignore else */
	if (upperChar !== char) {
		const optimizedCharIdx = charCodeToOptimizedIndex(upperChar.charCodeAt(0));
		result[optimizedCharIdx] = optimizedCharIdx;
	} else {
		const lowerChar = char.toLowerCase();
		if (lowerChar !== char) {
			const optimizedCharIdx = charCodeToOptimizedIndex(lowerChar.charCodeAt(0));
			result[optimizedCharIdx] = optimizedCharIdx;
		}
	}
}
function findCode(setNode, targetCharCodes) {
	return find(setNode.value, (codeOrRange) => {
		if (typeof codeOrRange === "number") return includes(targetCharCodes, codeOrRange);
		else {
			const range = codeOrRange;
			return find(targetCharCodes, (targetCode) => range.from <= targetCode && targetCode <= range.to) !== void 0;
		}
	});
}
function isWholeOptional(ast) {
	const quantifier = ast.quantifier;
	if (quantifier && quantifier.atLeast === 0) return true;
	if (!ast.value) return false;
	return isArray(ast.value) ? every(ast.value, isWholeOptional) : isWholeOptional(ast.value);
}
var CharCodeFinder = class extends BaseRegExpVisitor {
	constructor(targetCharCodes) {
		super();
		this.targetCharCodes = targetCharCodes;
		this.found = false;
	}
	visitChildren(node) {
		if (this.found === true) return;
		switch (node.type) {
			case "Lookahead":
				this.visitLookahead(node);
				return;
			case "NegativeLookahead":
				this.visitNegativeLookahead(node);
				return;
		}
		super.visitChildren(node);
	}
	visitCharacter(node) {
		if (includes(this.targetCharCodes, node.value)) this.found = true;
	}
	visitSet(node) {
		if (node.complement) {
			if (findCode(node, this.targetCharCodes) === void 0) this.found = true;
		} else if (findCode(node, this.targetCharCodes) !== void 0) this.found = true;
	}
};
function canMatchCharCode(charCodes, pattern) {
	if (pattern instanceof RegExp) {
		const ast = getRegExpAst(pattern);
		const charCodeFinder = new CharCodeFinder(charCodes);
		charCodeFinder.visit(ast);
		return charCodeFinder.found;
	} else return find(pattern, (char) => {
		return includes(charCodes, char.charCodeAt(0));
	}) !== void 0;
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/scan/lexer.js
var PATTERN = "PATTERN";
var DEFAULT_MODE = "defaultMode";
var SUPPORT_STICKY = typeof (/* @__PURE__ */ new RegExp("(?:)")).sticky === "boolean";
function analyzeTokenTypes(tokenTypes, options) {
	options = defaults(options, {
		useSticky: SUPPORT_STICKY,
		debug: false,
		safeMode: false,
		positionTracking: "full",
		lineTerminatorCharacters: ["\r", "\n"],
		tracer: (msg, action) => action()
	});
	const tracer = options.tracer;
	tracer("initCharCodeToOptimizedIndexMap", () => {
		initCharCodeToOptimizedIndexMap();
	});
	let onlyRelevantTypes;
	tracer("Reject Lexer.NA", () => {
		onlyRelevantTypes = reject(tokenTypes, (currType) => {
			return currType[PATTERN] === Lexer.NA;
		});
	});
	let hasCustom = false;
	let allTransformedPatterns;
	tracer("Transform Patterns", () => {
		hasCustom = false;
		allTransformedPatterns = map(onlyRelevantTypes, (currType) => {
			const currPattern = currType[PATTERN];
			/* istanbul ignore else */
			if (isRegExp(currPattern)) {
				const regExpSource = currPattern.source;
				if (regExpSource.length === 1 && regExpSource !== "^" && regExpSource !== "$" && regExpSource !== "." && !currPattern.ignoreCase) return regExpSource;
				else if (regExpSource.length === 2 && regExpSource[0] === "\\" && !includes([
					"d",
					"D",
					"s",
					"S",
					"t",
					"r",
					"n",
					"t",
					"0",
					"c",
					"b",
					"B",
					"f",
					"v",
					"w",
					"W"
				], regExpSource[1])) return regExpSource[1];
				else return options.useSticky ? addStickyFlag(currPattern) : addStartOfInput(currPattern);
			} else if (isFunction(currPattern)) {
				hasCustom = true;
				return { exec: currPattern };
			} else if (typeof currPattern === "object") {
				hasCustom = true;
				return currPattern;
			} else if (typeof currPattern === "string") {
				if (currPattern.length === 1) return currPattern;
				else {
					const escapedRegExpString = currPattern.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
					const wrappedRegExp = new RegExp(escapedRegExpString);
					return options.useSticky ? addStickyFlag(wrappedRegExp) : addStartOfInput(wrappedRegExp);
				}
			} else throw Error("non exhaustive match");
		});
	});
	let patternIdxToType;
	let patternIdxToGroup;
	let patternIdxToLongerAltIdxArr;
	let patternIdxToPushMode;
	let patternIdxToPopMode;
	tracer("misc mapping", () => {
		patternIdxToType = map(onlyRelevantTypes, (currType) => currType.tokenTypeIdx);
		patternIdxToGroup = map(onlyRelevantTypes, (clazz) => {
			const groupName = clazz.GROUP;
			/* istanbul ignore next */
			if (groupName === Lexer.SKIPPED) return;
			else if (isString(groupName)) return groupName;
			else if (isUndefined(groupName)) return false;
			else throw Error("non exhaustive match");
		});
		patternIdxToLongerAltIdxArr = map(onlyRelevantTypes, (clazz) => {
			const longerAltType = clazz.LONGER_ALT;
			if (longerAltType) return isArray(longerAltType) ? map(longerAltType, (type) => indexOf(onlyRelevantTypes, type)) : [indexOf(onlyRelevantTypes, longerAltType)];
		});
		patternIdxToPushMode = map(onlyRelevantTypes, (clazz) => clazz.PUSH_MODE);
		patternIdxToPopMode = map(onlyRelevantTypes, (clazz) => has(clazz, "POP_MODE"));
	});
	let patternIdxToCanLineTerminator;
	tracer("Line Terminator Handling", () => {
		const lineTerminatorCharCodes = getCharCodes(options.lineTerminatorCharacters);
		patternIdxToCanLineTerminator = map(onlyRelevantTypes, (tokType) => false);
		if (options.positionTracking !== "onlyOffset") patternIdxToCanLineTerminator = map(onlyRelevantTypes, (tokType) => {
			if (has(tokType, "LINE_BREAKS")) return !!tokType.LINE_BREAKS;
			else return checkLineBreaksIssues(tokType, lineTerminatorCharCodes) === false && canMatchCharCode(lineTerminatorCharCodes, tokType.PATTERN);
		});
	});
	let patternIdxToIsCustom;
	let patternIdxToShort;
	let emptyGroups;
	let patternIdxToConfig;
	tracer("Misc Mapping #2", () => {
		patternIdxToIsCustom = map(onlyRelevantTypes, isCustomPattern);
		patternIdxToShort = map(allTransformedPatterns, isShortPattern);
		emptyGroups = reduce(onlyRelevantTypes, (acc, clazz) => {
			const groupName = clazz.GROUP;
			if (isString(groupName) && !(groupName === Lexer.SKIPPED)) acc[groupName] = [];
			return acc;
		}, {});
		patternIdxToConfig = map(allTransformedPatterns, (x, idx) => {
			return {
				pattern: allTransformedPatterns[idx],
				longerAlt: patternIdxToLongerAltIdxArr[idx],
				canLineTerminator: patternIdxToCanLineTerminator[idx],
				isCustom: patternIdxToIsCustom[idx],
				short: patternIdxToShort[idx],
				group: patternIdxToGroup[idx],
				push: patternIdxToPushMode[idx],
				pop: patternIdxToPopMode[idx],
				tokenTypeIdx: patternIdxToType[idx],
				tokenType: onlyRelevantTypes[idx]
			};
		});
	});
	let canBeOptimized = true;
	let charCodeToPatternIdxToConfig = [];
	if (!options.safeMode) tracer("First Char Optimization", () => {
		charCodeToPatternIdxToConfig = reduce(onlyRelevantTypes, (result, currTokType, idx) => {
			if (typeof currTokType.PATTERN === "string") addToMapOfArrays(result, charCodeToOptimizedIndex(currTokType.PATTERN.charCodeAt(0)), patternIdxToConfig[idx]);
			else if (isArray(currTokType.START_CHARS_HINT)) {
				let lastOptimizedIdx;
				forEach(currTokType.START_CHARS_HINT, (charOrInt) => {
					const currOptimizedIdx = charCodeToOptimizedIndex(typeof charOrInt === "string" ? charOrInt.charCodeAt(0) : charOrInt);
					/* istanbul ignore else */
					if (lastOptimizedIdx !== currOptimizedIdx) {
						lastOptimizedIdx = currOptimizedIdx;
						addToMapOfArrays(result, currOptimizedIdx, patternIdxToConfig[idx]);
					}
				});
			} else if (isRegExp(currTokType.PATTERN)) {
				if (currTokType.PATTERN.unicode) {
					canBeOptimized = false;
					if (options.ensureOptimizations) PRINT_ERROR(`${failedOptimizationPrefixMsg}\tUnable to analyze < ${currTokType.PATTERN.toString()} > pattern.\n	The regexp unicode flag is not currently supported by the regexp-to-ast library.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNICODE_OPTIMIZE`);
				} else {
					const optimizedCodes = getOptimizedStartCodesIndices(currTokType.PATTERN, options.ensureOptimizations);
					/* istanbul ignore if */
					if (isEmpty(optimizedCodes)) canBeOptimized = false;
					forEach(optimizedCodes, (code) => {
						addToMapOfArrays(result, code, patternIdxToConfig[idx]);
					});
				}
			} else {
				if (options.ensureOptimizations) PRINT_ERROR(`${failedOptimizationPrefixMsg}\tTokenType: <${currTokType.name}> is using a custom token pattern without providing <start_chars_hint> parameter.\n	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_OPTIMIZE`);
				canBeOptimized = false;
			}
			return result;
		}, []);
	});
	return {
		emptyGroups,
		patternIdxToConfig,
		charCodeToPatternIdxToConfig,
		hasCustom,
		canBeOptimized
	};
}
function validatePatterns(tokenTypes, validModesNames) {
	let errors = [];
	const missingResult = findMissingPatterns(tokenTypes);
	errors = errors.concat(missingResult.errors);
	const invalidResult = findInvalidPatterns(missingResult.valid);
	const validTokenTypes = invalidResult.valid;
	errors = errors.concat(invalidResult.errors);
	errors = errors.concat(validateRegExpPattern(validTokenTypes));
	errors = errors.concat(findInvalidGroupType(validTokenTypes));
	errors = errors.concat(findModesThatDoNotExist(validTokenTypes, validModesNames));
	errors = errors.concat(findUnreachablePatterns(validTokenTypes));
	return errors;
}
function validateRegExpPattern(tokenTypes) {
	let errors = [];
	const withRegExpPatterns = filter(tokenTypes, (currTokType) => isRegExp(currTokType[PATTERN]));
	errors = errors.concat(findEndOfInputAnchor(withRegExpPatterns));
	errors = errors.concat(findStartOfInputAnchor(withRegExpPatterns));
	errors = errors.concat(findUnsupportedFlags(withRegExpPatterns));
	errors = errors.concat(findDuplicatePatterns(withRegExpPatterns));
	errors = errors.concat(findEmptyMatchRegExps(withRegExpPatterns));
	return errors;
}
function findMissingPatterns(tokenTypes) {
	const tokenTypesWithMissingPattern = filter(tokenTypes, (currType) => {
		return !has(currType, PATTERN);
	});
	return {
		errors: map(tokenTypesWithMissingPattern, (currType) => {
			return {
				message: "Token Type: ->" + currType.name + "<- missing static 'PATTERN' property",
				type: LexerDefinitionErrorType.MISSING_PATTERN,
				tokenTypes: [currType]
			};
		}),
		valid: difference(tokenTypes, tokenTypesWithMissingPattern)
	};
}
function findInvalidPatterns(tokenTypes) {
	const tokenTypesWithInvalidPattern = filter(tokenTypes, (currType) => {
		const pattern = currType[PATTERN];
		return !isRegExp(pattern) && !isFunction(pattern) && !has(pattern, "exec") && !isString(pattern);
	});
	return {
		errors: map(tokenTypesWithInvalidPattern, (currType) => {
			return {
				message: "Token Type: ->" + currType.name + "<- static 'PATTERN' can only be a RegExp, a Function matching the {CustomPatternMatcherFunc} type or an Object matching the {ICustomPattern} interface.",
				type: LexerDefinitionErrorType.INVALID_PATTERN,
				tokenTypes: [currType]
			};
		}),
		valid: difference(tokenTypes, tokenTypesWithInvalidPattern)
	};
}
var end_of_input = /[^\\][$]/;
function findEndOfInputAnchor(tokenTypes) {
	class EndAnchorFinder extends BaseRegExpVisitor {
		constructor() {
			super(...arguments);
			this.found = false;
		}
		visitEndAnchor(node) {
			this.found = true;
		}
	}
	return map(filter(tokenTypes, (currType) => {
		const pattern = currType.PATTERN;
		try {
			const regexpAst = getRegExpAst(pattern);
			const endAnchorVisitor = new EndAnchorFinder();
			endAnchorVisitor.visit(regexpAst);
			return endAnchorVisitor.found;
		} catch (e) {
			/* istanbul ignore next - cannot ensure an error in regexp-to-ast*/
			return end_of_input.test(pattern.source);
		}
	}), (currType) => {
		return {
			message: "Unexpected RegExp Anchor Error:\n	Token Type: ->" + currType.name + "<- static 'PATTERN' cannot contain end of input anchor '$'\n	See chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.",
			type: LexerDefinitionErrorType.EOI_ANCHOR_FOUND,
			tokenTypes: [currType]
		};
	});
}
function findEmptyMatchRegExps(tokenTypes) {
	return map(filter(tokenTypes, (currType) => {
		return currType.PATTERN.test("");
	}), (currType) => {
		return {
			message: "Token Type: ->" + currType.name + "<- static 'PATTERN' must not match an empty string",
			type: LexerDefinitionErrorType.EMPTY_MATCH_PATTERN,
			tokenTypes: [currType]
		};
	});
}
var start_of_input = /[^\\[][\^]|^\^/;
function findStartOfInputAnchor(tokenTypes) {
	class StartAnchorFinder extends BaseRegExpVisitor {
		constructor() {
			super(...arguments);
			this.found = false;
		}
		visitStartAnchor(node) {
			this.found = true;
		}
	}
	return map(filter(tokenTypes, (currType) => {
		const pattern = currType.PATTERN;
		try {
			const regexpAst = getRegExpAst(pattern);
			const startAnchorVisitor = new StartAnchorFinder();
			startAnchorVisitor.visit(regexpAst);
			return startAnchorVisitor.found;
		} catch (e) {
			/* istanbul ignore next - cannot ensure an error in regexp-to-ast*/
			return start_of_input.test(pattern.source);
		}
	}), (currType) => {
		return {
			message: "Unexpected RegExp Anchor Error:\n	Token Type: ->" + currType.name + "<- static 'PATTERN' cannot contain start of input anchor '^'\n	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.",
			type: LexerDefinitionErrorType.SOI_ANCHOR_FOUND,
			tokenTypes: [currType]
		};
	});
}
function findUnsupportedFlags(tokenTypes) {
	return map(filter(tokenTypes, (currType) => {
		const pattern = currType[PATTERN];
		return pattern instanceof RegExp && (pattern.multiline || pattern.global);
	}), (currType) => {
		return {
			message: "Token Type: ->" + currType.name + "<- static 'PATTERN' may NOT contain global('g') or multiline('m')",
			type: LexerDefinitionErrorType.UNSUPPORTED_FLAGS_FOUND,
			tokenTypes: [currType]
		};
	});
}
function findDuplicatePatterns(tokenTypes) {
	const found = [];
	let identicalPatterns = map(tokenTypes, (outerType) => {
		return reduce(tokenTypes, (result, innerType) => {
			if (outerType.PATTERN.source === innerType.PATTERN.source && !includes(found, innerType) && innerType.PATTERN !== Lexer.NA) {
				found.push(innerType);
				result.push(innerType);
				return result;
			}
			return result;
		}, []);
	});
	identicalPatterns = compact(identicalPatterns);
	return map(filter(identicalPatterns, (currIdenticalSet) => {
		return currIdenticalSet.length > 1;
	}), (setOfIdentical) => {
		const tokenTypeNames = map(setOfIdentical, (currType) => {
			return currType.name;
		});
		return {
			message: `The same RegExp pattern ->${head(setOfIdentical).PATTERN}<-has been used in all of the following Token Types: ${tokenTypeNames.join(", ")} <-`,
			type: LexerDefinitionErrorType.DUPLICATE_PATTERNS_FOUND,
			tokenTypes: setOfIdentical
		};
	});
}
function findInvalidGroupType(tokenTypes) {
	return map(filter(tokenTypes, (clazz) => {
		if (!has(clazz, "GROUP")) return false;
		const group = clazz.GROUP;
		return group !== Lexer.SKIPPED && group !== Lexer.NA && !isString(group);
	}), (currType) => {
		return {
			message: "Token Type: ->" + currType.name + "<- static 'GROUP' can only be Lexer.SKIPPED/Lexer.NA/A String",
			type: LexerDefinitionErrorType.INVALID_GROUP_TYPE_FOUND,
			tokenTypes: [currType]
		};
	});
}
function findModesThatDoNotExist(tokenTypes, validModes) {
	return map(filter(tokenTypes, (clazz) => {
		return clazz.PUSH_MODE !== void 0 && !includes(validModes, clazz.PUSH_MODE);
	}), (tokType) => {
		return {
			message: `Token Type: ->${tokType.name}<- static 'PUSH_MODE' value cannot refer to a Lexer Mode ->${tokType.PUSH_MODE}<-which does not exist`,
			type: LexerDefinitionErrorType.PUSH_MODE_DOES_NOT_EXIST,
			tokenTypes: [tokType]
		};
	});
}
function findUnreachablePatterns(tokenTypes) {
	const errors = [];
	const canBeTested = reduce(tokenTypes, (result, tokType, idx) => {
		const pattern = tokType.PATTERN;
		if (pattern === Lexer.NA) return result;
		if (isString(pattern)) result.push({
			str: pattern,
			idx,
			tokenType: tokType
		});
		else if (isRegExp(pattern) && noMetaChar(pattern)) result.push({
			str: pattern.source,
			idx,
			tokenType: tokType
		});
		return result;
	}, []);
	forEach(tokenTypes, (tokType, testIdx) => {
		forEach(canBeTested, ({ str, idx, tokenType }) => {
			if (testIdx < idx && testTokenType(str, tokType.PATTERN)) {
				const msg = `Token: ->${tokenType.name}<- can never be matched.\nBecause it appears AFTER the Token Type ->${tokType.name}<-in the lexer's definition.\nSee https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNREACHABLE`;
				errors.push({
					message: msg,
					type: LexerDefinitionErrorType.UNREACHABLE_PATTERN,
					tokenTypes: [tokType, tokenType]
				});
			}
		});
	});
	return errors;
}
function testTokenType(str, pattern) {
	/* istanbul ignore else */
	if (isRegExp(pattern)) {
		const regExpArray = pattern.exec(str);
		return regExpArray !== null && regExpArray.index === 0;
	} else if (isFunction(pattern)) return pattern(str, 0, [], {});
	else if (has(pattern, "exec")) return pattern.exec(str, 0, [], {});
	else if (typeof pattern === "string") return pattern === str;
	else throw Error("non exhaustive match");
}
function noMetaChar(regExp) {
	return find([
		".",
		"\\",
		"[",
		"]",
		"|",
		"^",
		"$",
		"(",
		")",
		"?",
		"*",
		"+",
		"{"
	], (char) => regExp.source.indexOf(char) !== -1) === void 0;
}
function addStartOfInput(pattern) {
	const flags = pattern.ignoreCase ? "i" : "";
	return new RegExp(`^(?:${pattern.source})`, flags);
}
function addStickyFlag(pattern) {
	const flags = pattern.ignoreCase ? "iy" : "y";
	return new RegExp(`${pattern.source}`, flags);
}
function performRuntimeChecks(lexerDefinition, trackLines, lineTerminatorCharacters) {
	const errors = [];
	if (!has(lexerDefinition, "defaultMode")) errors.push({
		message: "A MultiMode Lexer cannot be initialized without a <defaultMode> property in its definition\n",
		type: LexerDefinitionErrorType.MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE
	});
	if (!has(lexerDefinition, "modes")) errors.push({
		message: "A MultiMode Lexer cannot be initialized without a <modes> property in its definition\n",
		type: LexerDefinitionErrorType.MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY
	});
	if (has(lexerDefinition, "modes") && has(lexerDefinition, "defaultMode") && !has(lexerDefinition.modes, lexerDefinition.defaultMode)) errors.push({
		message: `A MultiMode Lexer cannot be initialized with a ${DEFAULT_MODE}: <${lexerDefinition.defaultMode}>which does not exist\n`,
		type: LexerDefinitionErrorType.MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST
	});
	if (has(lexerDefinition, "modes")) forEach(lexerDefinition.modes, (currModeValue, currModeName) => {
		forEach(currModeValue, (currTokType, currIdx) => {
			if (isUndefined(currTokType)) errors.push({
				message: `A Lexer cannot be initialized using an undefined Token Type. Mode:<${currModeName}> at index: <${currIdx}>\n`,
				type: LexerDefinitionErrorType.LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED
			});
			else if (has(currTokType, "LONGER_ALT")) forEach(isArray(currTokType.LONGER_ALT) ? currTokType.LONGER_ALT : [currTokType.LONGER_ALT], (currLongerAlt) => {
				if (!isUndefined(currLongerAlt) && !includes(currModeValue, currLongerAlt)) errors.push({
					message: `A MultiMode Lexer cannot be initialized with a longer_alt <${currLongerAlt.name}> on token <${currTokType.name}> outside of mode <${currModeName}>\n`,
					type: LexerDefinitionErrorType.MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE
				});
			});
		});
	});
	return errors;
}
function performWarningRuntimeChecks(lexerDefinition, trackLines, lineTerminatorCharacters) {
	const warnings = [];
	let hasAnyLineBreak = false;
	const concreteTokenTypes = reject(compact(flatten(values(lexerDefinition.modes))), (currType) => currType[PATTERN] === Lexer.NA);
	const terminatorCharCodes = getCharCodes(lineTerminatorCharacters);
	if (trackLines) forEach(concreteTokenTypes, (tokType) => {
		const currIssue = checkLineBreaksIssues(tokType, terminatorCharCodes);
		if (currIssue !== false) {
			const warningDescriptor = {
				message: buildLineBreakIssueMessage(tokType, currIssue),
				type: currIssue.issue,
				tokenType: tokType
			};
			warnings.push(warningDescriptor);
		} else if (has(tokType, "LINE_BREAKS")) {
			if (tokType.LINE_BREAKS === true) hasAnyLineBreak = true;
		} else if (canMatchCharCode(terminatorCharCodes, tokType.PATTERN)) hasAnyLineBreak = true;
	});
	if (trackLines && !hasAnyLineBreak) warnings.push({
		message: "Warning: No LINE_BREAKS Found.\n	This Lexer has been defined to track line and column information,\n	But none of the Token Types can be identified as matching a line terminator.\n	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#LINE_BREAKS \n	for details.",
		type: LexerDefinitionErrorType.NO_LINE_BREAKS_FLAGS
	});
	return warnings;
}
function cloneEmptyGroups(emptyGroups) {
	const clonedResult = {};
	forEach(keys(emptyGroups), (currKey) => {
		const currGroupValue = emptyGroups[currKey];
		/* istanbul ignore else */
		if (isArray(currGroupValue)) clonedResult[currKey] = [];
		else throw Error("non exhaustive match");
	});
	return clonedResult;
}
function isCustomPattern(tokenType) {
	const pattern = tokenType.PATTERN;
	/* istanbul ignore else */
	if (isRegExp(pattern)) return false;
	else if (isFunction(pattern)) return true;
	else if (has(pattern, "exec")) return true;
	else if (isString(pattern)) return false;
	else throw Error("non exhaustive match");
}
function isShortPattern(pattern) {
	if (isString(pattern) && pattern.length === 1) return pattern.charCodeAt(0);
	else return false;
}
/**
* Faster than using a RegExp for default newline detection during lexing.
*/
var LineTerminatorOptimizedTester = {
	test: function(text) {
		const len = text.length;
		for (let i = this.lastIndex; i < len; i++) {
			const c = text.charCodeAt(i);
			if (c === 10) {
				this.lastIndex = i + 1;
				return true;
			} else if (c === 13) {
				if (text.charCodeAt(i + 1) === 10) this.lastIndex = i + 2;
				else this.lastIndex = i + 1;
				return true;
			}
		}
		return false;
	},
	lastIndex: 0
};
function checkLineBreaksIssues(tokType, lineTerminatorCharCodes) {
	if (has(tokType, "LINE_BREAKS")) return false;
	else if (isRegExp(tokType.PATTERN)) {
		try {
			canMatchCharCode(lineTerminatorCharCodes, tokType.PATTERN);
		} catch (e) {
			/* istanbul ignore next - to test this we would have to mock <canMatchCharCode> to throw an error */
			return {
				issue: LexerDefinitionErrorType.IDENTIFY_TERMINATOR,
				errMsg: e.message
			};
		}
		return false;
	} else if (isString(tokType.PATTERN)) return false;
	else if (isCustomPattern(tokType)) return { issue: LexerDefinitionErrorType.CUSTOM_LINE_BREAK };
	else throw Error("non exhaustive match");
}
function buildLineBreakIssueMessage(tokType, details) {
	/* istanbul ignore else */
	if (details.issue === LexerDefinitionErrorType.IDENTIFY_TERMINATOR) return `Warning: unable to identify line terminator usage in pattern.
\tThe problem is in the <${tokType.name}> Token Type\n\t Root cause: ${details.errMsg}.\n	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#IDENTIFY_TERMINATOR`;
	else if (details.issue === LexerDefinitionErrorType.CUSTOM_LINE_BREAK) return `Warning: A Custom Token Pattern should specify the <line_breaks> option.
\tThe problem is in the <${tokType.name}> Token Type\n	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_LINE_BREAK`;
	else throw Error("non exhaustive match");
}
function getCharCodes(charsOrCodes) {
	return map(charsOrCodes, (numOrString) => {
		if (isString(numOrString)) return numOrString.charCodeAt(0);
		else return numOrString;
	});
}
function addToMapOfArrays(map, key, value) {
	if (map[key] === void 0) map[key] = [value];
	else map[key].push(value);
}
/**
* We are mapping charCode above ASCI (256) into buckets each in the size of 256.
* This is because ASCI are the most common start chars so each one of those will get its own
* possible token configs vector.
*
* Tokens starting with charCodes "above" ASCI are uncommon, so we can "afford"
* to place these into buckets of possible token configs, What we gain from
* this is avoiding the case of creating an optimization 'charCodeToPatternIdxToConfig'
* which would contain 10,000+ arrays of small size (e.g unicode Identifiers scenario).
* Our 'charCodeToPatternIdxToConfig' max size will now be:
* 256 + (2^16 / 2^8) - 1 === 511
*
* note the hack for fast division integer part extraction
* See: https://stackoverflow.com/a/4228528
*/
var charCodeToOptimizedIdxMap = [];
function charCodeToOptimizedIndex(charCode) {
	return charCode < 256 ? charCode : charCodeToOptimizedIdxMap[charCode];
}
/**
* This is a compromise between cold start / hot running performance
* Creating this array takes ~3ms on a modern machine,
* But if we perform the computation at runtime as needed the CSS Lexer benchmark
* performance degrades by ~10%
*
* TODO: Perhaps it should be lazy initialized only if a charCode > 255 is used.
*/
function initCharCodeToOptimizedIndexMap() {
	if (isEmpty(charCodeToOptimizedIdxMap)) {
		charCodeToOptimizedIdxMap = new Array(65536);
		for (let i = 0; i < 65536; i++) charCodeToOptimizedIdxMap[i] = i > 255 ? 255 + ~~(i / 255) : i;
	}
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/scan/tokens.js
function tokenStructuredMatcher(tokInstance, tokConstructor) {
	const instanceType = tokInstance.tokenTypeIdx;
	if (instanceType === tokConstructor.tokenTypeIdx) return true;
	else return tokConstructor.isParent === true && tokConstructor.categoryMatchesMap[instanceType] === true;
}
function tokenStructuredMatcherNoCategories(token, tokType) {
	return token.tokenTypeIdx === tokType.tokenTypeIdx;
}
var tokenShortNameIdx = 1;
var tokenIdxToClass = {};
function augmentTokenTypes(tokenTypes) {
	const tokenTypesAndParents = expandCategories(tokenTypes);
	assignTokenDefaultProps(tokenTypesAndParents);
	assignCategoriesMapProp(tokenTypesAndParents);
	assignCategoriesTokensProp(tokenTypesAndParents);
	forEach(tokenTypesAndParents, (tokType) => {
		tokType.isParent = tokType.categoryMatches.length > 0;
	});
}
function expandCategories(tokenTypes) {
	let result = clone(tokenTypes);
	let categories = tokenTypes;
	let searching = true;
	while (searching) {
		categories = compact(flatten(map(categories, (currTokType) => currTokType.CATEGORIES)));
		const newCategories = difference(categories, result);
		result = result.concat(newCategories);
		if (isEmpty(newCategories)) searching = false;
		else categories = newCategories;
	}
	return result;
}
function assignTokenDefaultProps(tokenTypes) {
	forEach(tokenTypes, (currTokType) => {
		if (!hasShortKeyProperty(currTokType)) {
			tokenIdxToClass[tokenShortNameIdx] = currTokType;
			currTokType.tokenTypeIdx = tokenShortNameIdx++;
		}
		if (hasCategoriesProperty(currTokType) && !isArray(currTokType.CATEGORIES)) currTokType.CATEGORIES = [currTokType.CATEGORIES];
		if (!hasCategoriesProperty(currTokType)) currTokType.CATEGORIES = [];
		if (!hasExtendingTokensTypesProperty(currTokType)) currTokType.categoryMatches = [];
		if (!hasExtendingTokensTypesMapProperty(currTokType)) currTokType.categoryMatchesMap = {};
	});
}
function assignCategoriesTokensProp(tokenTypes) {
	forEach(tokenTypes, (currTokType) => {
		currTokType.categoryMatches = [];
		forEach(currTokType.categoryMatchesMap, (val, key) => {
			currTokType.categoryMatches.push(tokenIdxToClass[key].tokenTypeIdx);
		});
	});
}
function assignCategoriesMapProp(tokenTypes) {
	forEach(tokenTypes, (currTokType) => {
		singleAssignCategoriesToksMap([], currTokType);
	});
}
function singleAssignCategoriesToksMap(path, nextNode) {
	forEach(path, (pathNode) => {
		nextNode.categoryMatchesMap[pathNode.tokenTypeIdx] = true;
	});
	forEach(nextNode.CATEGORIES, (nextCategory) => {
		const newPath = path.concat(nextNode);
		if (!includes(newPath, nextCategory)) singleAssignCategoriesToksMap(newPath, nextCategory);
	});
}
function hasShortKeyProperty(tokType) {
	return has(tokType, "tokenTypeIdx");
}
function hasCategoriesProperty(tokType) {
	return has(tokType, "CATEGORIES");
}
function hasExtendingTokensTypesProperty(tokType) {
	return has(tokType, "categoryMatches");
}
function hasExtendingTokensTypesMapProperty(tokType) {
	return has(tokType, "categoryMatchesMap");
}
function isTokenType(tokType) {
	return has(tokType, "tokenTypeIdx");
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/scan/lexer_errors_public.js
var defaultLexerErrorProvider = {
	buildUnableToPopLexerModeMessage(token) {
		return `Unable to pop Lexer Mode after encountering Token ->${token.image}<- The Mode Stack is empty`;
	},
	buildUnexpectedCharactersMessage(fullText, startOffset, length, line, column) {
		return `unexpected character: ->${fullText.charAt(startOffset)}<- at offset: ${startOffset}, skipped ${length} characters.`;
	}
};
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/scan/lexer_public.js
var LexerDefinitionErrorType;
(function(LexerDefinitionErrorType) {
	LexerDefinitionErrorType[LexerDefinitionErrorType["MISSING_PATTERN"] = 0] = "MISSING_PATTERN";
	LexerDefinitionErrorType[LexerDefinitionErrorType["INVALID_PATTERN"] = 1] = "INVALID_PATTERN";
	LexerDefinitionErrorType[LexerDefinitionErrorType["EOI_ANCHOR_FOUND"] = 2] = "EOI_ANCHOR_FOUND";
	LexerDefinitionErrorType[LexerDefinitionErrorType["UNSUPPORTED_FLAGS_FOUND"] = 3] = "UNSUPPORTED_FLAGS_FOUND";
	LexerDefinitionErrorType[LexerDefinitionErrorType["DUPLICATE_PATTERNS_FOUND"] = 4] = "DUPLICATE_PATTERNS_FOUND";
	LexerDefinitionErrorType[LexerDefinitionErrorType["INVALID_GROUP_TYPE_FOUND"] = 5] = "INVALID_GROUP_TYPE_FOUND";
	LexerDefinitionErrorType[LexerDefinitionErrorType["PUSH_MODE_DOES_NOT_EXIST"] = 6] = "PUSH_MODE_DOES_NOT_EXIST";
	LexerDefinitionErrorType[LexerDefinitionErrorType["MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE"] = 7] = "MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE";
	LexerDefinitionErrorType[LexerDefinitionErrorType["MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY"] = 8] = "MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY";
	LexerDefinitionErrorType[LexerDefinitionErrorType["MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST"] = 9] = "MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST";
	LexerDefinitionErrorType[LexerDefinitionErrorType["LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED"] = 10] = "LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED";
	LexerDefinitionErrorType[LexerDefinitionErrorType["SOI_ANCHOR_FOUND"] = 11] = "SOI_ANCHOR_FOUND";
	LexerDefinitionErrorType[LexerDefinitionErrorType["EMPTY_MATCH_PATTERN"] = 12] = "EMPTY_MATCH_PATTERN";
	LexerDefinitionErrorType[LexerDefinitionErrorType["NO_LINE_BREAKS_FLAGS"] = 13] = "NO_LINE_BREAKS_FLAGS";
	LexerDefinitionErrorType[LexerDefinitionErrorType["UNREACHABLE_PATTERN"] = 14] = "UNREACHABLE_PATTERN";
	LexerDefinitionErrorType[LexerDefinitionErrorType["IDENTIFY_TERMINATOR"] = 15] = "IDENTIFY_TERMINATOR";
	LexerDefinitionErrorType[LexerDefinitionErrorType["CUSTOM_LINE_BREAK"] = 16] = "CUSTOM_LINE_BREAK";
	LexerDefinitionErrorType[LexerDefinitionErrorType["MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE"] = 17] = "MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE";
})(LexerDefinitionErrorType || (LexerDefinitionErrorType = {}));
var DEFAULT_LEXER_CONFIG = {
	deferDefinitionErrorsHandling: false,
	positionTracking: "full",
	lineTerminatorsPattern: /\n|\r\n?/g,
	lineTerminatorCharacters: ["\n", "\r"],
	ensureOptimizations: false,
	safeMode: false,
	errorMessageProvider: defaultLexerErrorProvider,
	traceInitPerf: false,
	skipValidations: false,
	recoveryEnabled: true
};
Object.freeze(DEFAULT_LEXER_CONFIG);
var Lexer = class {
	constructor(lexerDefinition, config = DEFAULT_LEXER_CONFIG) {
		this.lexerDefinition = lexerDefinition;
		this.lexerDefinitionErrors = [];
		this.lexerDefinitionWarning = [];
		this.patternIdxToConfig = {};
		this.charCodeToPatternIdxToConfig = {};
		this.modes = [];
		this.emptyGroups = {};
		this.trackStartLines = true;
		this.trackEndLines = true;
		this.hasCustom = false;
		this.canModeBeOptimized = {};
		this.TRACE_INIT = (phaseDesc, phaseImpl) => {
			if (this.traceInitPerf === true) {
				this.traceInitIndent++;
				const indent = new Array(this.traceInitIndent + 1).join("	");
				if (this.traceInitIndent < this.traceInitMaxIdent) console.log(`${indent}--> <${phaseDesc}>`);
				const { time, value } = timer(phaseImpl);
				/* istanbul ignore next - Difficult to reproduce specific performance behavior (>10ms) in tests */
				const traceMethod = time > 10 ? console.warn : console.log;
				if (this.traceInitIndent < this.traceInitMaxIdent) traceMethod(`${indent}<-- <${phaseDesc}> time: ${time}ms`);
				this.traceInitIndent--;
				return value;
			} else return phaseImpl();
		};
		if (typeof config === "boolean") throw Error("The second argument to the Lexer constructor is now an ILexerConfig Object.\na boolean 2nd argument is no longer supported");
		this.config = assign({}, DEFAULT_LEXER_CONFIG, config);
		const traceInitVal = this.config.traceInitPerf;
		if (traceInitVal === true) {
			this.traceInitMaxIdent = Infinity;
			this.traceInitPerf = true;
		} else if (typeof traceInitVal === "number") {
			this.traceInitMaxIdent = traceInitVal;
			this.traceInitPerf = true;
		}
		this.traceInitIndent = -1;
		this.TRACE_INIT("Lexer Constructor", () => {
			let actualDefinition;
			let hasOnlySingleMode = true;
			this.TRACE_INIT("Lexer Config handling", () => {
				if (this.config.lineTerminatorsPattern === DEFAULT_LEXER_CONFIG.lineTerminatorsPattern) this.config.lineTerminatorsPattern = LineTerminatorOptimizedTester;
				else if (this.config.lineTerminatorCharacters === DEFAULT_LEXER_CONFIG.lineTerminatorCharacters) throw Error("Error: Missing <lineTerminatorCharacters> property on the Lexer config.\n	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#MISSING_LINE_TERM_CHARS");
				if (config.safeMode && config.ensureOptimizations) throw Error("\"safeMode\" and \"ensureOptimizations\" flags are mutually exclusive.");
				this.trackStartLines = /full|onlyStart/i.test(this.config.positionTracking);
				this.trackEndLines = /full/i.test(this.config.positionTracking);
				if (isArray(lexerDefinition)) actualDefinition = {
					modes: { defaultMode: clone(lexerDefinition) },
					defaultMode: DEFAULT_MODE
				};
				else {
					hasOnlySingleMode = false;
					actualDefinition = clone(lexerDefinition);
				}
			});
			if (this.config.skipValidations === false) {
				this.TRACE_INIT("performRuntimeChecks", () => {
					this.lexerDefinitionErrors = this.lexerDefinitionErrors.concat(performRuntimeChecks(actualDefinition, this.trackStartLines, this.config.lineTerminatorCharacters));
				});
				this.TRACE_INIT("performWarningRuntimeChecks", () => {
					this.lexerDefinitionWarning = this.lexerDefinitionWarning.concat(performWarningRuntimeChecks(actualDefinition, this.trackStartLines, this.config.lineTerminatorCharacters));
				});
			}
			actualDefinition.modes = actualDefinition.modes ? actualDefinition.modes : {};
			forEach(actualDefinition.modes, (currModeValue, currModeName) => {
				actualDefinition.modes[currModeName] = reject(currModeValue, (currTokType) => isUndefined(currTokType));
			});
			const allModeNames = keys(actualDefinition.modes);
			forEach(actualDefinition.modes, (currModDef, currModName) => {
				this.TRACE_INIT(`Mode: <${currModName}> processing`, () => {
					this.modes.push(currModName);
					if (this.config.skipValidations === false) this.TRACE_INIT(`validatePatterns`, () => {
						this.lexerDefinitionErrors = this.lexerDefinitionErrors.concat(validatePatterns(currModDef, allModeNames));
					});
					if (isEmpty(this.lexerDefinitionErrors)) {
						augmentTokenTypes(currModDef);
						let currAnalyzeResult;
						this.TRACE_INIT(`analyzeTokenTypes`, () => {
							currAnalyzeResult = analyzeTokenTypes(currModDef, {
								lineTerminatorCharacters: this.config.lineTerminatorCharacters,
								positionTracking: config.positionTracking,
								ensureOptimizations: config.ensureOptimizations,
								safeMode: config.safeMode,
								tracer: this.TRACE_INIT
							});
						});
						this.patternIdxToConfig[currModName] = currAnalyzeResult.patternIdxToConfig;
						this.charCodeToPatternIdxToConfig[currModName] = currAnalyzeResult.charCodeToPatternIdxToConfig;
						this.emptyGroups = assign({}, this.emptyGroups, currAnalyzeResult.emptyGroups);
						this.hasCustom = currAnalyzeResult.hasCustom || this.hasCustom;
						this.canModeBeOptimized[currModName] = currAnalyzeResult.canBeOptimized;
					}
				});
			});
			this.defaultMode = actualDefinition.defaultMode;
			if (!isEmpty(this.lexerDefinitionErrors) && !this.config.deferDefinitionErrorsHandling) {
				const allErrMessagesString = map(this.lexerDefinitionErrors, (error) => {
					return error.message;
				}).join("-----------------------\n");
				throw new Error("Errors detected in definition of Lexer:\n" + allErrMessagesString);
			}
			forEach(this.lexerDefinitionWarning, (warningDescriptor) => {
				PRINT_WARNING(warningDescriptor.message);
			});
			this.TRACE_INIT("Choosing sub-methods implementations", () => {
				if (SUPPORT_STICKY) {
					this.chopInput = identity;
					this.match = this.matchWithTest;
				} else {
					this.updateLastIndex = noop;
					this.match = this.matchWithExec;
				}
				if (hasOnlySingleMode) this.handleModes = noop;
				if (this.trackStartLines === false) this.computeNewColumn = identity;
				if (this.trackEndLines === false) this.updateTokenEndLineColumnLocation = noop;
				if (/full/i.test(this.config.positionTracking)) this.createTokenInstance = this.createFullToken;
				else if (/onlyStart/i.test(this.config.positionTracking)) this.createTokenInstance = this.createStartOnlyToken;
				else if (/onlyOffset/i.test(this.config.positionTracking)) this.createTokenInstance = this.createOffsetOnlyToken;
				else throw Error(`Invalid <positionTracking> config option: "${this.config.positionTracking}"`);
				if (this.hasCustom) {
					this.addToken = this.addTokenUsingPush;
					this.handlePayload = this.handlePayloadWithCustom;
				} else {
					this.addToken = this.addTokenUsingMemberAccess;
					this.handlePayload = this.handlePayloadNoCustom;
				}
			});
			this.TRACE_INIT("Failed Optimization Warnings", () => {
				const unOptimizedModes = reduce(this.canModeBeOptimized, (cannotBeOptimized, canBeOptimized, modeName) => {
					if (canBeOptimized === false) cannotBeOptimized.push(modeName);
					return cannotBeOptimized;
				}, []);
				if (config.ensureOptimizations && !isEmpty(unOptimizedModes)) throw Error(`Lexer Modes: < ${unOptimizedModes.join(", ")} > cannot be optimized.\n	 Disable the "ensureOptimizations" lexer config flag to silently ignore this and run the lexer in an un-optimized mode.
	 Or inspect the console log for details on how to resolve these issues.`);
			});
			this.TRACE_INIT("clearRegExpParserCache", () => {
				clearRegExpParserCache();
			});
			this.TRACE_INIT("toFastProperties", () => {
				toFastProperties(this);
			});
		});
	}
	tokenize(text, initialMode = this.defaultMode) {
		if (!isEmpty(this.lexerDefinitionErrors)) {
			const allErrMessagesString = map(this.lexerDefinitionErrors, (error) => {
				return error.message;
			}).join("-----------------------\n");
			throw new Error("Unable to Tokenize because Errors detected in definition of Lexer:\n" + allErrMessagesString);
		}
		return this.tokenizeInternal(text, initialMode);
	}
	tokenizeInternal(text, initialMode) {
		let i, j, k, matchAltImage, longerAlt, matchedImage, payload, altPayload, imageLength, group, tokType, newToken, errLength, msg, match;
		const orgText = text;
		const orgLength = orgText.length;
		let offset = 0;
		let matchedTokensIndex = 0;
		const guessedNumberOfTokens = this.hasCustom ? 0 : Math.floor(text.length / 10);
		const matchedTokens = new Array(guessedNumberOfTokens);
		const errors = [];
		let line = this.trackStartLines ? 1 : void 0;
		let column = this.trackStartLines ? 1 : void 0;
		const groups = cloneEmptyGroups(this.emptyGroups);
		const trackLines = this.trackStartLines;
		const lineTerminatorPattern = this.config.lineTerminatorsPattern;
		let currModePatternsLength = 0;
		let patternIdxToConfig = [];
		let currCharCodeToPatternIdxToConfig = [];
		const modeStack = [];
		const emptyArray = [];
		Object.freeze(emptyArray);
		let getPossiblePatterns;
		function getPossiblePatternsSlow() {
			return patternIdxToConfig;
		}
		function getPossiblePatternsOptimized(charCode) {
			const optimizedCharIdx = charCodeToOptimizedIndex(charCode);
			const possiblePatterns = currCharCodeToPatternIdxToConfig[optimizedCharIdx];
			if (possiblePatterns === void 0) return emptyArray;
			else return possiblePatterns;
		}
		const pop_mode = (popToken) => {
			if (modeStack.length === 1 && popToken.tokenType.PUSH_MODE === void 0) {
				const msg = this.config.errorMessageProvider.buildUnableToPopLexerModeMessage(popToken);
				errors.push({
					offset: popToken.startOffset,
					line: popToken.startLine,
					column: popToken.startColumn,
					length: popToken.image.length,
					message: msg
				});
			} else {
				modeStack.pop();
				const newMode = last(modeStack);
				patternIdxToConfig = this.patternIdxToConfig[newMode];
				currCharCodeToPatternIdxToConfig = this.charCodeToPatternIdxToConfig[newMode];
				currModePatternsLength = patternIdxToConfig.length;
				const modeCanBeOptimized = this.canModeBeOptimized[newMode] && this.config.safeMode === false;
				if (currCharCodeToPatternIdxToConfig && modeCanBeOptimized) getPossiblePatterns = getPossiblePatternsOptimized;
				else getPossiblePatterns = getPossiblePatternsSlow;
			}
		};
		function push_mode(newMode) {
			modeStack.push(newMode);
			currCharCodeToPatternIdxToConfig = this.charCodeToPatternIdxToConfig[newMode];
			patternIdxToConfig = this.patternIdxToConfig[newMode];
			currModePatternsLength = patternIdxToConfig.length;
			currModePatternsLength = patternIdxToConfig.length;
			const modeCanBeOptimized = this.canModeBeOptimized[newMode] && this.config.safeMode === false;
			if (currCharCodeToPatternIdxToConfig && modeCanBeOptimized) getPossiblePatterns = getPossiblePatternsOptimized;
			else getPossiblePatterns = getPossiblePatternsSlow;
		}
		push_mode.call(this, initialMode);
		let currConfig;
		const recoveryEnabled = this.config.recoveryEnabled;
		while (offset < orgLength) {
			matchedImage = null;
			const nextCharCode = orgText.charCodeAt(offset);
			const chosenPatternIdxToConfig = getPossiblePatterns(nextCharCode);
			const chosenPatternsLength = chosenPatternIdxToConfig.length;
			for (i = 0; i < chosenPatternsLength; i++) {
				currConfig = chosenPatternIdxToConfig[i];
				const currPattern = currConfig.pattern;
				payload = null;
				const singleCharCode = currConfig.short;
				if (singleCharCode !== false) {
					if (nextCharCode === singleCharCode) matchedImage = currPattern;
				} else if (currConfig.isCustom === true) {
					match = currPattern.exec(orgText, offset, matchedTokens, groups);
					if (match !== null) {
						matchedImage = match[0];
						if (match.payload !== void 0) payload = match.payload;
					} else matchedImage = null;
				} else {
					this.updateLastIndex(currPattern, offset);
					matchedImage = this.match(currPattern, text, offset);
				}
				if (matchedImage !== null) {
					longerAlt = currConfig.longerAlt;
					if (longerAlt !== void 0) {
						const longerAltLength = longerAlt.length;
						for (k = 0; k < longerAltLength; k++) {
							const longerAltConfig = patternIdxToConfig[longerAlt[k]];
							const longerAltPattern = longerAltConfig.pattern;
							altPayload = null;
							if (longerAltConfig.isCustom === true) {
								match = longerAltPattern.exec(orgText, offset, matchedTokens, groups);
								if (match !== null) {
									matchAltImage = match[0];
									if (match.payload !== void 0) altPayload = match.payload;
								} else matchAltImage = null;
							} else {
								this.updateLastIndex(longerAltPattern, offset);
								matchAltImage = this.match(longerAltPattern, text, offset);
							}
							if (matchAltImage && matchAltImage.length > matchedImage.length) {
								matchedImage = matchAltImage;
								payload = altPayload;
								currConfig = longerAltConfig;
								break;
							}
						}
					}
					break;
				}
			}
			if (matchedImage !== null) {
				imageLength = matchedImage.length;
				group = currConfig.group;
				if (group !== void 0) {
					tokType = currConfig.tokenTypeIdx;
					newToken = this.createTokenInstance(matchedImage, offset, tokType, currConfig.tokenType, line, column, imageLength);
					this.handlePayload(newToken, payload);
					if (group === false) matchedTokensIndex = this.addToken(matchedTokens, matchedTokensIndex, newToken);
					else groups[group].push(newToken);
				}
				text = this.chopInput(text, imageLength);
				offset = offset + imageLength;
				column = this.computeNewColumn(column, imageLength);
				if (trackLines === true && currConfig.canLineTerminator === true) {
					let numOfLTsInMatch = 0;
					let foundTerminator;
					let lastLTEndOffset;
					lineTerminatorPattern.lastIndex = 0;
					do {
						foundTerminator = lineTerminatorPattern.test(matchedImage);
						if (foundTerminator === true) {
							lastLTEndOffset = lineTerminatorPattern.lastIndex - 1;
							numOfLTsInMatch++;
						}
					} while (foundTerminator === true);
					if (numOfLTsInMatch !== 0) {
						line = line + numOfLTsInMatch;
						column = imageLength - lastLTEndOffset;
						this.updateTokenEndLineColumnLocation(newToken, group, lastLTEndOffset, numOfLTsInMatch, line, column, imageLength);
					}
				}
				this.handleModes(currConfig, pop_mode, push_mode, newToken);
			} else {
				const errorStartOffset = offset;
				const errorLine = line;
				const errorColumn = column;
				let foundResyncPoint = recoveryEnabled === false;
				while (foundResyncPoint === false && offset < orgLength) {
					text = this.chopInput(text, 1);
					offset++;
					for (j = 0; j < currModePatternsLength; j++) {
						const currConfig = patternIdxToConfig[j];
						const currPattern = currConfig.pattern;
						const singleCharCode = currConfig.short;
						if (singleCharCode !== false) {
							if (orgText.charCodeAt(offset) === singleCharCode) foundResyncPoint = true;
						} else if (currConfig.isCustom === true) foundResyncPoint = currPattern.exec(orgText, offset, matchedTokens, groups) !== null;
						else {
							this.updateLastIndex(currPattern, offset);
							foundResyncPoint = currPattern.exec(text) !== null;
						}
						if (foundResyncPoint === true) break;
					}
				}
				errLength = offset - errorStartOffset;
				column = this.computeNewColumn(column, errLength);
				msg = this.config.errorMessageProvider.buildUnexpectedCharactersMessage(orgText, errorStartOffset, errLength, errorLine, errorColumn);
				errors.push({
					offset: errorStartOffset,
					line: errorLine,
					column: errorColumn,
					length: errLength,
					message: msg
				});
				if (recoveryEnabled === false) break;
			}
		}
		if (!this.hasCustom) matchedTokens.length = matchedTokensIndex;
		return {
			tokens: matchedTokens,
			groups,
			errors
		};
	}
	handleModes(config, pop_mode, push_mode, newToken) {
		if (config.pop === true) {
			const pushMode = config.push;
			pop_mode(newToken);
			if (pushMode !== void 0) push_mode.call(this, pushMode);
		} else if (config.push !== void 0) push_mode.call(this, config.push);
	}
	chopInput(text, length) {
		return text.substring(length);
	}
	updateLastIndex(regExp, newLastIndex) {
		regExp.lastIndex = newLastIndex;
	}
	updateTokenEndLineColumnLocation(newToken, group, lastLTIdx, numOfLTsInMatch, line, column, imageLength) {
		let lastCharIsLT, fixForEndingInLT;
		if (group !== void 0) {
			lastCharIsLT = lastLTIdx === imageLength - 1;
			fixForEndingInLT = lastCharIsLT ? -1 : 0;
			if (!(numOfLTsInMatch === 1 && lastCharIsLT === true)) {
				newToken.endLine = line + fixForEndingInLT;
				newToken.endColumn = column - 1 + -fixForEndingInLT;
			}
		}
	}
	computeNewColumn(oldColumn, imageLength) {
		return oldColumn + imageLength;
	}
	createOffsetOnlyToken(image, startOffset, tokenTypeIdx, tokenType) {
		return {
			image,
			startOffset,
			tokenTypeIdx,
			tokenType
		};
	}
	createStartOnlyToken(image, startOffset, tokenTypeIdx, tokenType, startLine, startColumn) {
		return {
			image,
			startOffset,
			startLine,
			startColumn,
			tokenTypeIdx,
			tokenType
		};
	}
	createFullToken(image, startOffset, tokenTypeIdx, tokenType, startLine, startColumn, imageLength) {
		return {
			image,
			startOffset,
			endOffset: startOffset + imageLength - 1,
			startLine,
			endLine: startLine,
			startColumn,
			endColumn: startColumn + imageLength - 1,
			tokenTypeIdx,
			tokenType
		};
	}
	addTokenUsingPush(tokenVector, index, tokenToAdd) {
		tokenVector.push(tokenToAdd);
		return index;
	}
	addTokenUsingMemberAccess(tokenVector, index, tokenToAdd) {
		tokenVector[index] = tokenToAdd;
		index++;
		return index;
	}
	handlePayloadNoCustom(token, payload) {}
	handlePayloadWithCustom(token, payload) {
		if (payload !== null) token.payload = payload;
	}
	matchWithTest(pattern, text, offset) {
		if (pattern.test(text) === true) return text.substring(offset, pattern.lastIndex);
		return null;
	}
	matchWithExec(pattern, text) {
		const regExpArray = pattern.exec(text);
		return regExpArray !== null ? regExpArray[0] : null;
	}
};
Lexer.SKIPPED = "This marks a skipped Token pattern, this means each token identified by it willbe consumed and then thrown into oblivion, this can be used to for example to completely ignore whitespace.";
Lexer.NA = /NOT_APPLICABLE/;
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/scan/tokens_public.js
function tokenLabel(tokType) {
	if (hasTokenLabel(tokType)) return tokType.LABEL;
	else return tokType.name;
}
function hasTokenLabel(obj) {
	return isString(obj.LABEL) && obj.LABEL !== "";
}
var PARENT = "parent";
var CATEGORIES = "categories";
var LABEL = "label";
var GROUP = "group";
var PUSH_MODE = "push_mode";
var POP_MODE = "pop_mode";
var LONGER_ALT = "longer_alt";
var LINE_BREAKS = "line_breaks";
var START_CHARS_HINT = "start_chars_hint";
function createToken(config) {
	return createTokenInternal(config);
}
function createTokenInternal(config) {
	const pattern = config.pattern;
	const tokenType = {};
	tokenType.name = config.name;
	if (!isUndefined(pattern)) tokenType.PATTERN = pattern;
	if (has(config, PARENT)) throw "The parent property is no longer supported.\nSee: https://github.com/chevrotain/chevrotain/issues/564#issuecomment-349062346 for details.";
	if (has(config, CATEGORIES)) tokenType.CATEGORIES = config[CATEGORIES];
	augmentTokenTypes([tokenType]);
	if (has(config, LABEL)) tokenType.LABEL = config[LABEL];
	if (has(config, GROUP)) tokenType.GROUP = config[GROUP];
	if (has(config, POP_MODE)) tokenType.POP_MODE = config[POP_MODE];
	if (has(config, PUSH_MODE)) tokenType.PUSH_MODE = config[PUSH_MODE];
	if (has(config, LONGER_ALT)) tokenType.LONGER_ALT = config[LONGER_ALT];
	if (has(config, LINE_BREAKS)) tokenType.LINE_BREAKS = config[LINE_BREAKS];
	if (has(config, START_CHARS_HINT)) tokenType.START_CHARS_HINT = config[START_CHARS_HINT];
	return tokenType;
}
var EOF = createToken({
	name: "EOF",
	pattern: Lexer.NA
});
augmentTokenTypes([EOF]);
function createTokenInstance(tokType, image, startOffset, endOffset, startLine, endLine, startColumn, endColumn) {
	return {
		image,
		startOffset,
		endOffset,
		startLine,
		endLine,
		startColumn,
		endColumn,
		tokenTypeIdx: tokType.tokenTypeIdx,
		tokenType: tokType
	};
}
function tokenMatcher(token, tokType) {
	return tokenStructuredMatcher(token, tokType);
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/errors_public.js
var defaultParserErrorProvider = {
	buildMismatchTokenMessage({ expected, actual, previous, ruleName }) {
		return `Expecting ${hasTokenLabel(expected) ? `--> ${tokenLabel(expected)} <--` : `token of type --> ${expected.name} <--`} but found --> '${actual.image}' <--`;
	},
	buildNotAllInputParsedMessage({ firstRedundant, ruleName }) {
		return "Redundant input, expecting EOF but found: " + firstRedundant.image;
	},
	buildNoViableAltMessage({ expectedPathsPerAlt, actual, previous, customUserDescription, ruleName }) {
		const errPrefix = "Expecting: ";
		const errSuffix = "\nbut found: '" + head(actual).image + "'";
		if (customUserDescription) return errPrefix + customUserDescription + errSuffix;
		else return `Expecting: one of these possible Token sequences:\n${map(map(reduce(expectedPathsPerAlt, (result, currAltPaths) => result.concat(currAltPaths), []), (currPath) => `[${map(currPath, (currTokenType) => tokenLabel(currTokenType)).join(", ")}]`), (itemMsg, idx) => `  ${idx + 1}. ${itemMsg}`).join("\n")}` + errSuffix;
	},
	buildEarlyExitMessage({ expectedIterationPaths, actual, customUserDescription, ruleName }) {
		const errPrefix = "Expecting: ";
		const errSuffix = "\nbut found: '" + head(actual).image + "'";
		if (customUserDescription) return errPrefix + customUserDescription + errSuffix;
		else return `Expecting: expecting at least one iteration which starts with one of these possible Token sequences::\n  <${map(expectedIterationPaths, (currPath) => `[${map(currPath, (currTokenType) => tokenLabel(currTokenType)).join(",")}]`).join(" ,")}>` + errSuffix;
	}
};
Object.freeze(defaultParserErrorProvider);
var defaultGrammarResolverErrorProvider = { buildRuleNotFoundError(topLevelRule, undefinedRule) {
	return "Invalid grammar, reference to a rule which is not defined: ->" + undefinedRule.nonTerminalName + "<-\ninside top level rule: ->" + topLevelRule.name + "<-";
} };
var defaultGrammarValidatorErrorProvider = {
	buildDuplicateFoundError(topLevelRule, duplicateProds) {
		function getExtraProductionArgument(prod) {
			if (prod instanceof Terminal) return prod.terminalType.name;
			else if (prod instanceof NonTerminal) return prod.nonTerminalName;
			else return "";
		}
		const topLevelName = topLevelRule.name;
		const duplicateProd = head(duplicateProds);
		const index = duplicateProd.idx;
		const dslName = getProductionDslName$1(duplicateProd);
		const extraArgument = getExtraProductionArgument(duplicateProd);
		let msg = `->${dslName}${index > 0 ? index : ""}<- ${extraArgument ? `with argument: ->${extraArgument}<-` : ""}
                  appears more than once (${duplicateProds.length} times) in the top level rule: ->${topLevelName}<-.                  
                  For further details see: https://chevrotain.io/docs/FAQ.html#NUMERICAL_SUFFIXES 
                  `;
		msg = msg.replace(/[ \t]+/g, " ");
		msg = msg.replace(/\s\s+/g, "\n");
		return msg;
	},
	buildNamespaceConflictError(rule) {
		return `Namespace conflict found in grammar.\nThe grammar has both a Terminal(Token) and a Non-Terminal(Rule) named: <${rule.name}>.\nTo resolve this make sure each Terminal and Non-Terminal names are unique\nThis is easy to accomplish by using the convention that Terminal names start with an uppercase letter\nand Non-Terminal names start with a lower case letter.`;
	},
	buildAlternationPrefixAmbiguityError(options) {
		const pathMsg = map(options.prefixPath, (currTok) => tokenLabel(currTok)).join(", ");
		const occurrence = options.alternation.idx === 0 ? "" : options.alternation.idx;
		return `Ambiguous alternatives: <${options.ambiguityIndices.join(" ,")}> due to common lookahead prefix\nin <OR${occurrence}> inside <${options.topLevelRule.name}> Rule,\n<${pathMsg}> may appears as a prefix path in all these alternatives.\nSee: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#COMMON_PREFIX\nFor Further details.`;
	},
	buildAlternationAmbiguityError(options) {
		const pathMsg = map(options.prefixPath, (currtok) => tokenLabel(currtok)).join(", ");
		const occurrence = options.alternation.idx === 0 ? "" : options.alternation.idx;
		let currMessage = `Ambiguous Alternatives Detected: <${options.ambiguityIndices.join(" ,")}> in <OR${occurrence}> inside <${options.topLevelRule.name}> Rule,\n<${pathMsg}> may appears as a prefix path in all these alternatives.\n`;
		currMessage = currMessage + "See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES\nFor Further details.";
		return currMessage;
	},
	buildEmptyRepetitionError(options) {
		let dslName = getProductionDslName$1(options.repetition);
		if (options.repetition.idx !== 0) dslName += options.repetition.idx;
		return `The repetition <${dslName}> within Rule <${options.topLevelRule.name}> can never consume any tokens.\nThis could lead to an infinite loop.`;
	},
	buildTokenNameError(options) {
		/* istanbul ignore next */
		return "deprecated";
	},
	buildEmptyAlternationError(options) {
		return `Ambiguous empty alternative: <${options.emptyChoiceIdx + 1}> in <OR${options.alternation.idx}> inside <${options.topLevelRule.name}> Rule.\nOnly the last alternative may be an empty alternative.`;
	},
	buildTooManyAlternativesError(options) {
		return `An Alternation cannot have more than 256 alternatives:\n<OR${options.alternation.idx}> inside <${options.topLevelRule.name}> Rule.\n has ${options.alternation.definition.length + 1} alternatives.`;
	},
	buildLeftRecursionError(options) {
		const ruleName = options.topLevelRule.name;
		return `Left Recursion found in grammar.\nrule: <${ruleName}> can be invoked from itself (directly or indirectly)\nwithout consuming any Tokens. The grammar path that causes this is: \n ${`${ruleName} --> ${map(options.leftRecursionPath, (currRule) => currRule.name).concat([ruleName]).join(" --> ")}`}\n To fix this refactor your grammar to remove the left recursion.\nsee: https://en.wikipedia.org/wiki/LL_parser#Left_factoring.`;
	},
	buildInvalidRuleNameError(options) {
		/* istanbul ignore next */
		return "deprecated";
	},
	buildDuplicateRuleNameError(options) {
		let ruleName;
		if (options.topLevelRule instanceof Rule) ruleName = options.topLevelRule.name;
		else ruleName = options.topLevelRule;
		return `Duplicate definition, rule: ->${ruleName}<- is already defined in the grammar: ->${options.grammarName}<-`;
	}
};
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/grammar/resolver.js
function resolveGrammar$1(topLevels, errMsgProvider) {
	const refResolver = new GastRefResolverVisitor(topLevels, errMsgProvider);
	refResolver.resolveRefs();
	return refResolver.errors;
}
var GastRefResolverVisitor = class extends GAstVisitor {
	constructor(nameToTopRule, errMsgProvider) {
		super();
		this.nameToTopRule = nameToTopRule;
		this.errMsgProvider = errMsgProvider;
		this.errors = [];
	}
	resolveRefs() {
		forEach(values(this.nameToTopRule), (prod) => {
			this.currTopLevel = prod;
			prod.accept(this);
		});
	}
	visitNonTerminal(node) {
		const ref = this.nameToTopRule[node.nonTerminalName];
		if (!ref) {
			const msg = this.errMsgProvider.buildRuleNotFoundError(this.currTopLevel, node);
			this.errors.push({
				message: msg,
				type: ParserDefinitionErrorType.UNRESOLVED_SUBRULE_REF,
				ruleName: this.currTopLevel.name,
				unresolvedRefName: node.nonTerminalName
			});
		} else node.referencedRule = ref;
	}
};
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/grammar/interpreter.js
var AbstractNextPossibleTokensWalker = class extends RestWalker {
	constructor(topProd, path) {
		super();
		this.topProd = topProd;
		this.path = path;
		this.possibleTokTypes = [];
		this.nextProductionName = "";
		this.nextProductionOccurrence = 0;
		this.found = false;
		this.isAtEndOfPath = false;
	}
	startWalking() {
		this.found = false;
		if (this.path.ruleStack[0] !== this.topProd.name) throw Error("The path does not start with the walker's top Rule!");
		this.ruleStack = clone(this.path.ruleStack).reverse();
		this.occurrenceStack = clone(this.path.occurrenceStack).reverse();
		this.ruleStack.pop();
		this.occurrenceStack.pop();
		this.updateExpectedNext();
		this.walk(this.topProd);
		return this.possibleTokTypes;
	}
	walk(prod, prevRest = []) {
		if (!this.found) super.walk(prod, prevRest);
	}
	walkProdRef(refProd, currRest, prevRest) {
		if (refProd.referencedRule.name === this.nextProductionName && refProd.idx === this.nextProductionOccurrence) {
			const fullRest = currRest.concat(prevRest);
			this.updateExpectedNext();
			this.walk(refProd.referencedRule, fullRest);
		}
	}
	updateExpectedNext() {
		if (isEmpty(this.ruleStack)) {
			this.nextProductionName = "";
			this.nextProductionOccurrence = 0;
			this.isAtEndOfPath = true;
		} else {
			this.nextProductionName = this.ruleStack.pop();
			this.nextProductionOccurrence = this.occurrenceStack.pop();
		}
	}
};
var NextAfterTokenWalker = class extends AbstractNextPossibleTokensWalker {
	constructor(topProd, path) {
		super(topProd, path);
		this.path = path;
		this.nextTerminalName = "";
		this.nextTerminalOccurrence = 0;
		this.nextTerminalName = this.path.lastTok.name;
		this.nextTerminalOccurrence = this.path.lastTokOccurrence;
	}
	walkTerminal(terminal, currRest, prevRest) {
		if (this.isAtEndOfPath && terminal.terminalType.name === this.nextTerminalName && terminal.idx === this.nextTerminalOccurrence && !this.found) {
			const restProd = new Alternative({ definition: currRest.concat(prevRest) });
			this.possibleTokTypes = first(restProd);
			this.found = true;
		}
	}
};
/**
* This walker only "walks" a single "TOP" level in the Grammar Ast, this means
* it never "follows" production refs
*/
var AbstractNextTerminalAfterProductionWalker = class extends RestWalker {
	constructor(topRule, occurrence) {
		super();
		this.topRule = topRule;
		this.occurrence = occurrence;
		this.result = {
			token: void 0,
			occurrence: void 0,
			isEndOfRule: void 0
		};
	}
	startWalking() {
		this.walk(this.topRule);
		return this.result;
	}
};
var NextTerminalAfterManyWalker = class extends AbstractNextTerminalAfterProductionWalker {
	walkMany(manyProd, currRest, prevRest) {
		if (manyProd.idx === this.occurrence) {
			const firstAfterMany = head(currRest.concat(prevRest));
			this.result.isEndOfRule = firstAfterMany === void 0;
			if (firstAfterMany instanceof Terminal) {
				this.result.token = firstAfterMany.terminalType;
				this.result.occurrence = firstAfterMany.idx;
			}
		} else super.walkMany(manyProd, currRest, prevRest);
	}
};
var NextTerminalAfterManySepWalker = class extends AbstractNextTerminalAfterProductionWalker {
	walkManySep(manySepProd, currRest, prevRest) {
		if (manySepProd.idx === this.occurrence) {
			const firstAfterManySep = head(currRest.concat(prevRest));
			this.result.isEndOfRule = firstAfterManySep === void 0;
			if (firstAfterManySep instanceof Terminal) {
				this.result.token = firstAfterManySep.terminalType;
				this.result.occurrence = firstAfterManySep.idx;
			}
		} else super.walkManySep(manySepProd, currRest, prevRest);
	}
};
var NextTerminalAfterAtLeastOneWalker = class extends AbstractNextTerminalAfterProductionWalker {
	walkAtLeastOne(atLeastOneProd, currRest, prevRest) {
		if (atLeastOneProd.idx === this.occurrence) {
			const firstAfterAtLeastOne = head(currRest.concat(prevRest));
			this.result.isEndOfRule = firstAfterAtLeastOne === void 0;
			if (firstAfterAtLeastOne instanceof Terminal) {
				this.result.token = firstAfterAtLeastOne.terminalType;
				this.result.occurrence = firstAfterAtLeastOne.idx;
			}
		} else super.walkAtLeastOne(atLeastOneProd, currRest, prevRest);
	}
};
var NextTerminalAfterAtLeastOneSepWalker = class extends AbstractNextTerminalAfterProductionWalker {
	walkAtLeastOneSep(atleastOneSepProd, currRest, prevRest) {
		if (atleastOneSepProd.idx === this.occurrence) {
			const firstAfterfirstAfterAtLeastOneSep = head(currRest.concat(prevRest));
			this.result.isEndOfRule = firstAfterfirstAfterAtLeastOneSep === void 0;
			if (firstAfterfirstAfterAtLeastOneSep instanceof Terminal) {
				this.result.token = firstAfterfirstAfterAtLeastOneSep.terminalType;
				this.result.occurrence = firstAfterfirstAfterAtLeastOneSep.idx;
			}
		} else super.walkAtLeastOneSep(atleastOneSepProd, currRest, prevRest);
	}
};
function possiblePathsFrom(targetDef, maxLength, currPath = []) {
	currPath = clone(currPath);
	let result = [];
	let i = 0;
	function remainingPathWith(nextDef) {
		return nextDef.concat(drop(targetDef, i + 1));
	}
	function getAlternativesForProd(definition) {
		const alternatives = possiblePathsFrom(remainingPathWith(definition), maxLength, currPath);
		return result.concat(alternatives);
	}
	/**
	* Mandatory productions will halt the loop as the paths computed from their recursive calls will already contain the
	* following (rest) of the targetDef.
	*
	* For optional productions (Option/Repetition/...) the loop will continue to represent the paths that do not include the
	* the optional production.
	*/
	while (currPath.length < maxLength && i < targetDef.length) {
		const prod = targetDef[i];
		/* istanbul ignore else */
		if (prod instanceof Alternative) return getAlternativesForProd(prod.definition);
		else if (prod instanceof NonTerminal) return getAlternativesForProd(prod.definition);
		else if (prod instanceof Option$1) result = getAlternativesForProd(prod.definition);
		else if (prod instanceof RepetitionMandatory) return getAlternativesForProd(prod.definition.concat([new Repetition({ definition: prod.definition })]));
		else if (prod instanceof RepetitionMandatoryWithSeparator) return getAlternativesForProd([new Alternative({ definition: prod.definition }), new Repetition({ definition: [new Terminal({ terminalType: prod.separator })].concat(prod.definition) })]);
		else if (prod instanceof RepetitionWithSeparator) result = getAlternativesForProd(prod.definition.concat([new Repetition({ definition: [new Terminal({ terminalType: prod.separator })].concat(prod.definition) })]));
		else if (prod instanceof Repetition) result = getAlternativesForProd(prod.definition.concat([new Repetition({ definition: prod.definition })]));
		else if (prod instanceof Alternation) {
			forEach(prod.definition, (currAlt) => {
				if (isEmpty(currAlt.definition) === false) result = getAlternativesForProd(currAlt.definition);
			});
			return result;
		} else if (prod instanceof Terminal) currPath.push(prod.terminalType);
		else throw Error("non exhaustive match");
		i++;
	}
	result.push({
		partialPath: currPath,
		suffixDef: drop(targetDef, i)
	});
	return result;
}
function nextPossibleTokensAfter(initialDef, tokenVector, tokMatcher, maxLookAhead) {
	const EXIT_NON_TERMINAL = "EXIT_NONE_TERMINAL";
	const EXIT_NON_TERMINAL_ARR = [EXIT_NON_TERMINAL];
	const EXIT_ALTERNATIVE = "EXIT_ALTERNATIVE";
	let foundCompletePath = false;
	const tokenVectorLength = tokenVector.length;
	const minimalAlternativesIndex = tokenVectorLength - maxLookAhead - 1;
	const result = [];
	const possiblePaths = [];
	possiblePaths.push({
		idx: -1,
		def: initialDef,
		ruleStack: [],
		occurrenceStack: []
	});
	while (!isEmpty(possiblePaths)) {
		const currPath = possiblePaths.pop();
		if (currPath === EXIT_ALTERNATIVE) {
			if (foundCompletePath && last(possiblePaths).idx <= minimalAlternativesIndex) possiblePaths.pop();
			continue;
		}
		const currDef = currPath.def;
		const currIdx = currPath.idx;
		const currRuleStack = currPath.ruleStack;
		const currOccurrenceStack = currPath.occurrenceStack;
		if (isEmpty(currDef)) continue;
		const prod = currDef[0];
		/* istanbul ignore else */
		if (prod === EXIT_NON_TERMINAL) {
			const nextPath = {
				idx: currIdx,
				def: drop(currDef),
				ruleStack: dropRight(currRuleStack),
				occurrenceStack: dropRight(currOccurrenceStack)
			};
			possiblePaths.push(nextPath);
		} else if (prod instanceof Terminal) {
			/* istanbul ignore else */
			if (currIdx < tokenVectorLength - 1) {
				const nextIdx = currIdx + 1;
				const actualToken = tokenVector[nextIdx];
				if (tokMatcher(actualToken, prod.terminalType)) {
					const nextPath = {
						idx: nextIdx,
						def: drop(currDef),
						ruleStack: currRuleStack,
						occurrenceStack: currOccurrenceStack
					};
					possiblePaths.push(nextPath);
				}
			} else if (currIdx === tokenVectorLength - 1) {
				result.push({
					nextTokenType: prod.terminalType,
					nextTokenOccurrence: prod.idx,
					ruleStack: currRuleStack,
					occurrenceStack: currOccurrenceStack
				});
				foundCompletePath = true;
			} else throw Error("non exhaustive match");
		} else if (prod instanceof NonTerminal) {
			const newRuleStack = clone(currRuleStack);
			newRuleStack.push(prod.nonTerminalName);
			const newOccurrenceStack = clone(currOccurrenceStack);
			newOccurrenceStack.push(prod.idx);
			const nextPath = {
				idx: currIdx,
				def: prod.definition.concat(EXIT_NON_TERMINAL_ARR, drop(currDef)),
				ruleStack: newRuleStack,
				occurrenceStack: newOccurrenceStack
			};
			possiblePaths.push(nextPath);
		} else if (prod instanceof Option$1) {
			const nextPathWithout = {
				idx: currIdx,
				def: drop(currDef),
				ruleStack: currRuleStack,
				occurrenceStack: currOccurrenceStack
			};
			possiblePaths.push(nextPathWithout);
			possiblePaths.push(EXIT_ALTERNATIVE);
			const nextPathWith = {
				idx: currIdx,
				def: prod.definition.concat(drop(currDef)),
				ruleStack: currRuleStack,
				occurrenceStack: currOccurrenceStack
			};
			possiblePaths.push(nextPathWith);
		} else if (prod instanceof RepetitionMandatory) {
			const secondIteration = new Repetition({
				definition: prod.definition,
				idx: prod.idx
			});
			const nextPath = {
				idx: currIdx,
				def: prod.definition.concat([secondIteration], drop(currDef)),
				ruleStack: currRuleStack,
				occurrenceStack: currOccurrenceStack
			};
			possiblePaths.push(nextPath);
		} else if (prod instanceof RepetitionMandatoryWithSeparator) {
			const secondIteration = new Repetition({
				definition: [new Terminal({ terminalType: prod.separator })].concat(prod.definition),
				idx: prod.idx
			});
			const nextPath = {
				idx: currIdx,
				def: prod.definition.concat([secondIteration], drop(currDef)),
				ruleStack: currRuleStack,
				occurrenceStack: currOccurrenceStack
			};
			possiblePaths.push(nextPath);
		} else if (prod instanceof RepetitionWithSeparator) {
			const nextPathWithout = {
				idx: currIdx,
				def: drop(currDef),
				ruleStack: currRuleStack,
				occurrenceStack: currOccurrenceStack
			};
			possiblePaths.push(nextPathWithout);
			possiblePaths.push(EXIT_ALTERNATIVE);
			const nthRepetition = new Repetition({
				definition: [new Terminal({ terminalType: prod.separator })].concat(prod.definition),
				idx: prod.idx
			});
			const nextPathWith = {
				idx: currIdx,
				def: prod.definition.concat([nthRepetition], drop(currDef)),
				ruleStack: currRuleStack,
				occurrenceStack: currOccurrenceStack
			};
			possiblePaths.push(nextPathWith);
		} else if (prod instanceof Repetition) {
			const nextPathWithout = {
				idx: currIdx,
				def: drop(currDef),
				ruleStack: currRuleStack,
				occurrenceStack: currOccurrenceStack
			};
			possiblePaths.push(nextPathWithout);
			possiblePaths.push(EXIT_ALTERNATIVE);
			const nthRepetition = new Repetition({
				definition: prod.definition,
				idx: prod.idx
			});
			const nextPathWith = {
				idx: currIdx,
				def: prod.definition.concat([nthRepetition], drop(currDef)),
				ruleStack: currRuleStack,
				occurrenceStack: currOccurrenceStack
			};
			possiblePaths.push(nextPathWith);
		} else if (prod instanceof Alternation) for (let i = prod.definition.length - 1; i >= 0; i--) {
			const currAltPath = {
				idx: currIdx,
				def: prod.definition[i].definition.concat(drop(currDef)),
				ruleStack: currRuleStack,
				occurrenceStack: currOccurrenceStack
			};
			possiblePaths.push(currAltPath);
			possiblePaths.push(EXIT_ALTERNATIVE);
		}
		else if (prod instanceof Alternative) possiblePaths.push({
			idx: currIdx,
			def: prod.definition.concat(drop(currDef)),
			ruleStack: currRuleStack,
			occurrenceStack: currOccurrenceStack
		});
		else if (prod instanceof Rule) possiblePaths.push(expandTopLevelRule(prod, currIdx, currRuleStack, currOccurrenceStack));
		else throw Error("non exhaustive match");
	}
	return result;
}
function expandTopLevelRule(topRule, currIdx, currRuleStack, currOccurrenceStack) {
	const newRuleStack = clone(currRuleStack);
	newRuleStack.push(topRule.name);
	const newCurrOccurrenceStack = clone(currOccurrenceStack);
	newCurrOccurrenceStack.push(1);
	return {
		idx: currIdx,
		def: topRule.definition,
		ruleStack: newRuleStack,
		occurrenceStack: newCurrOccurrenceStack
	};
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/grammar/lookahead.js
var PROD_TYPE;
(function(PROD_TYPE) {
	PROD_TYPE[PROD_TYPE["OPTION"] = 0] = "OPTION";
	PROD_TYPE[PROD_TYPE["REPETITION"] = 1] = "REPETITION";
	PROD_TYPE[PROD_TYPE["REPETITION_MANDATORY"] = 2] = "REPETITION_MANDATORY";
	PROD_TYPE[PROD_TYPE["REPETITION_MANDATORY_WITH_SEPARATOR"] = 3] = "REPETITION_MANDATORY_WITH_SEPARATOR";
	PROD_TYPE[PROD_TYPE["REPETITION_WITH_SEPARATOR"] = 4] = "REPETITION_WITH_SEPARATOR";
	PROD_TYPE[PROD_TYPE["ALTERNATION"] = 5] = "ALTERNATION";
})(PROD_TYPE || (PROD_TYPE = {}));
function getProdType$1(prod) {
	/* istanbul ignore else */
	if (prod instanceof Option$1 || prod === "Option") return PROD_TYPE.OPTION;
	else if (prod instanceof Repetition || prod === "Repetition") return PROD_TYPE.REPETITION;
	else if (prod instanceof RepetitionMandatory || prod === "RepetitionMandatory") return PROD_TYPE.REPETITION_MANDATORY;
	else if (prod instanceof RepetitionMandatoryWithSeparator || prod === "RepetitionMandatoryWithSeparator") return PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR;
	else if (prod instanceof RepetitionWithSeparator || prod === "RepetitionWithSeparator") return PROD_TYPE.REPETITION_WITH_SEPARATOR;
	else if (prod instanceof Alternation || prod === "Alternation") return PROD_TYPE.ALTERNATION;
	else throw Error("non exhaustive match");
}
function getLookaheadPaths(options) {
	const { occurrence, rule, prodType, maxLookahead } = options;
	const type = getProdType$1(prodType);
	if (type === PROD_TYPE.ALTERNATION) return getLookaheadPathsForOr(occurrence, rule, maxLookahead);
	else return getLookaheadPathsForOptionalProd(occurrence, rule, type, maxLookahead);
}
function buildLookaheadFuncForOr(occurrence, ruleGrammar, maxLookahead, hasPredicates, dynamicTokensEnabled, laFuncBuilder) {
	const lookAheadPaths = getLookaheadPathsForOr(occurrence, ruleGrammar, maxLookahead);
	return laFuncBuilder(lookAheadPaths, hasPredicates, areTokenCategoriesNotUsed(lookAheadPaths) ? tokenStructuredMatcherNoCategories : tokenStructuredMatcher, dynamicTokensEnabled);
}
/**
*  When dealing with an Optional production (OPTION/MANY/2nd iteration of AT_LEAST_ONE/...) we need to compare
*  the lookahead "inside" the production and the lookahead immediately "after" it in the same top level rule (context free).
*
*  Example: given a production:
*  ABC(DE)?DF
*
*  The optional '(DE)?' should only be entered if we see 'DE'. a single Token 'D' is not sufficient to distinguish between the two
*  alternatives.
*
*  @returns A Lookahead function which will return true IFF the parser should parse the Optional production.
*/
function buildLookaheadFuncForOptionalProd(occurrence, ruleGrammar, k, dynamicTokensEnabled, prodType, lookaheadBuilder) {
	const lookAheadPaths = getLookaheadPathsForOptionalProd(occurrence, ruleGrammar, prodType, k);
	const tokenMatcher = areTokenCategoriesNotUsed(lookAheadPaths) ? tokenStructuredMatcherNoCategories : tokenStructuredMatcher;
	return lookaheadBuilder(lookAheadPaths[0], tokenMatcher, dynamicTokensEnabled);
}
function buildAlternativesLookAheadFunc(alts, hasPredicates, tokenMatcher, dynamicTokensEnabled) {
	const numOfAlts = alts.length;
	const areAllOneTokenLookahead = every(alts, (currAlt) => {
		return every(currAlt, (currPath) => {
			return currPath.length === 1;
		});
	});
	if (hasPredicates)
 /**
	* @returns {number} - The chosen alternative index
	*/
	return function(orAlts) {
		const predicates = map(orAlts, (currAlt) => currAlt.GATE);
		for (let t = 0; t < numOfAlts; t++) {
			const currAlt = alts[t];
			const currNumOfPaths = currAlt.length;
			const currPredicate = predicates[t];
			if (currPredicate !== void 0 && currPredicate.call(this) === false) continue;
			nextPath: for (let j = 0; j < currNumOfPaths; j++) {
				const currPath = currAlt[j];
				const currPathLength = currPath.length;
				for (let i = 0; i < currPathLength; i++) if (tokenMatcher(this.LA(i + 1), currPath[i]) === false) continue nextPath;
				return t;
			}
		}
	};
	else if (areAllOneTokenLookahead && !dynamicTokensEnabled) {
		const choiceToAlt = reduce(map(alts, (currAlt) => {
			return flatten(currAlt);
		}), (result, currAlt, idx) => {
			forEach(currAlt, (currTokType) => {
				if (!has(result, currTokType.tokenTypeIdx)) result[currTokType.tokenTypeIdx] = idx;
				forEach(currTokType.categoryMatches, (currExtendingType) => {
					if (!has(result, currExtendingType)) result[currExtendingType] = idx;
				});
			});
			return result;
		}, {});
		/**
		* @returns {number} - The chosen alternative index
		*/
		return function() {
			const nextToken = this.LA(1);
			return choiceToAlt[nextToken.tokenTypeIdx];
		};
	} else
 /**
	* @returns {number} - The chosen alternative index
	*/
	return function() {
		for (let t = 0; t < numOfAlts; t++) {
			const currAlt = alts[t];
			const currNumOfPaths = currAlt.length;
			nextPath: for (let j = 0; j < currNumOfPaths; j++) {
				const currPath = currAlt[j];
				const currPathLength = currPath.length;
				for (let i = 0; i < currPathLength; i++) if (tokenMatcher(this.LA(i + 1), currPath[i]) === false) continue nextPath;
				return t;
			}
		}
	};
}
function buildSingleAlternativeLookaheadFunction(alt, tokenMatcher, dynamicTokensEnabled) {
	const areAllOneTokenLookahead = every(alt, (currPath) => {
		return currPath.length === 1;
	});
	const numOfPaths = alt.length;
	if (areAllOneTokenLookahead && !dynamicTokensEnabled) {
		const singleTokensTypes = flatten(alt);
		if (singleTokensTypes.length === 1 && isEmpty(singleTokensTypes[0].categoryMatches)) {
			const expectedTokenUniqueKey = singleTokensTypes[0].tokenTypeIdx;
			return function() {
				return this.LA(1).tokenTypeIdx === expectedTokenUniqueKey;
			};
		} else {
			const choiceToAlt = reduce(singleTokensTypes, (result, currTokType, idx) => {
				result[currTokType.tokenTypeIdx] = true;
				forEach(currTokType.categoryMatches, (currExtendingType) => {
					result[currExtendingType] = true;
				});
				return result;
			}, []);
			return function() {
				const nextToken = this.LA(1);
				return choiceToAlt[nextToken.tokenTypeIdx] === true;
			};
		}
	} else return function() {
		nextPath: for (let j = 0; j < numOfPaths; j++) {
			const currPath = alt[j];
			const currPathLength = currPath.length;
			for (let i = 0; i < currPathLength; i++) if (tokenMatcher(this.LA(i + 1), currPath[i]) === false) continue nextPath;
			return true;
		}
		return false;
	};
}
var RestDefinitionFinderWalker = class extends RestWalker {
	constructor(topProd, targetOccurrence, targetProdType) {
		super();
		this.topProd = topProd;
		this.targetOccurrence = targetOccurrence;
		this.targetProdType = targetProdType;
	}
	startWalking() {
		this.walk(this.topProd);
		return this.restDef;
	}
	checkIsTarget(node, expectedProdType, currRest, prevRest) {
		if (node.idx === this.targetOccurrence && this.targetProdType === expectedProdType) {
			this.restDef = currRest.concat(prevRest);
			return true;
		}
		return false;
	}
	walkOption(optionProd, currRest, prevRest) {
		if (!this.checkIsTarget(optionProd, PROD_TYPE.OPTION, currRest, prevRest)) super.walkOption(optionProd, currRest, prevRest);
	}
	walkAtLeastOne(atLeastOneProd, currRest, prevRest) {
		if (!this.checkIsTarget(atLeastOneProd, PROD_TYPE.REPETITION_MANDATORY, currRest, prevRest)) super.walkOption(atLeastOneProd, currRest, prevRest);
	}
	walkAtLeastOneSep(atLeastOneSepProd, currRest, prevRest) {
		if (!this.checkIsTarget(atLeastOneSepProd, PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR, currRest, prevRest)) super.walkOption(atLeastOneSepProd, currRest, prevRest);
	}
	walkMany(manyProd, currRest, prevRest) {
		if (!this.checkIsTarget(manyProd, PROD_TYPE.REPETITION, currRest, prevRest)) super.walkOption(manyProd, currRest, prevRest);
	}
	walkManySep(manySepProd, currRest, prevRest) {
		if (!this.checkIsTarget(manySepProd, PROD_TYPE.REPETITION_WITH_SEPARATOR, currRest, prevRest)) super.walkOption(manySepProd, currRest, prevRest);
	}
};
/**
* Returns the definition of a target production in a top level level rule.
*/
var InsideDefinitionFinderVisitor = class extends GAstVisitor {
	constructor(targetOccurrence, targetProdType, targetRef) {
		super();
		this.targetOccurrence = targetOccurrence;
		this.targetProdType = targetProdType;
		this.targetRef = targetRef;
		this.result = [];
	}
	checkIsTarget(node, expectedProdName) {
		if (node.idx === this.targetOccurrence && this.targetProdType === expectedProdName && (this.targetRef === void 0 || node === this.targetRef)) this.result = node.definition;
	}
	visitOption(node) {
		this.checkIsTarget(node, PROD_TYPE.OPTION);
	}
	visitRepetition(node) {
		this.checkIsTarget(node, PROD_TYPE.REPETITION);
	}
	visitRepetitionMandatory(node) {
		this.checkIsTarget(node, PROD_TYPE.REPETITION_MANDATORY);
	}
	visitRepetitionMandatoryWithSeparator(node) {
		this.checkIsTarget(node, PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR);
	}
	visitRepetitionWithSeparator(node) {
		this.checkIsTarget(node, PROD_TYPE.REPETITION_WITH_SEPARATOR);
	}
	visitAlternation(node) {
		this.checkIsTarget(node, PROD_TYPE.ALTERNATION);
	}
};
function initializeArrayOfArrays(size) {
	const result = new Array(size);
	for (let i = 0; i < size; i++) result[i] = [];
	return result;
}
/**
* A sort of hash function between a Path in the grammar and a string.
* Note that this returns multiple "hashes" to support the scenario of token categories.
* -  A single path with categories may match multiple **actual** paths.
*/
function pathToHashKeys(path) {
	let keys = [""];
	for (let i = 0; i < path.length; i++) {
		const tokType = path[i];
		const longerKeys = [];
		for (let j = 0; j < keys.length; j++) {
			const currShorterKey = keys[j];
			longerKeys.push(currShorterKey + "_" + tokType.tokenTypeIdx);
			for (let t = 0; t < tokType.categoryMatches.length; t++) {
				const categoriesKeySuffix = "_" + tokType.categoryMatches[t];
				longerKeys.push(currShorterKey + categoriesKeySuffix);
			}
		}
		keys = longerKeys;
	}
	return keys;
}
/**
* Imperative style due to being called from a hot spot
*/
function isUniquePrefixHash(altKnownPathsKeys, searchPathKeys, idx) {
	for (let currAltIdx = 0; currAltIdx < altKnownPathsKeys.length; currAltIdx++) {
		if (currAltIdx === idx) continue;
		const otherAltKnownPathsKeys = altKnownPathsKeys[currAltIdx];
		for (let searchIdx = 0; searchIdx < searchPathKeys.length; searchIdx++) if (otherAltKnownPathsKeys[searchPathKeys[searchIdx]] === true) return false;
	}
	return true;
}
function lookAheadSequenceFromAlternatives(altsDefs, k) {
	const partialAlts = map(altsDefs, (currAlt) => possiblePathsFrom([currAlt], 1));
	const finalResult = initializeArrayOfArrays(partialAlts.length);
	const altsHashes = map(partialAlts, (currAltPaths) => {
		const dict = {};
		forEach(currAltPaths, (item) => {
			forEach(pathToHashKeys(item.partialPath), (currKey) => {
				dict[currKey] = true;
			});
		});
		return dict;
	});
	let newData = partialAlts;
	for (let pathLength = 1; pathLength <= k; pathLength++) {
		const currDataset = newData;
		newData = initializeArrayOfArrays(currDataset.length);
		for (let altIdx = 0; altIdx < currDataset.length; altIdx++) {
			const currAltPathsAndSuffixes = currDataset[altIdx];
			for (let currPathIdx = 0; currPathIdx < currAltPathsAndSuffixes.length; currPathIdx++) {
				const currPathPrefix = currAltPathsAndSuffixes[currPathIdx].partialPath;
				const suffixDef = currAltPathsAndSuffixes[currPathIdx].suffixDef;
				const prefixKeys = pathToHashKeys(currPathPrefix);
				if (isUniquePrefixHash(altsHashes, prefixKeys, altIdx) || isEmpty(suffixDef) || currPathPrefix.length === k) {
					const currAltResult = finalResult[altIdx];
					if (containsPath(currAltResult, currPathPrefix) === false) {
						currAltResult.push(currPathPrefix);
						for (let j = 0; j < prefixKeys.length; j++) {
							const currKey = prefixKeys[j];
							altsHashes[altIdx][currKey] = true;
						}
					}
				} else {
					const newPartialPathsAndSuffixes = possiblePathsFrom(suffixDef, pathLength + 1, currPathPrefix);
					newData[altIdx] = newData[altIdx].concat(newPartialPathsAndSuffixes);
					forEach(newPartialPathsAndSuffixes, (item) => {
						forEach(pathToHashKeys(item.partialPath), (key) => {
							altsHashes[altIdx][key] = true;
						});
					});
				}
			}
		}
	}
	return finalResult;
}
function getLookaheadPathsForOr(occurrence, ruleGrammar, k, orProd) {
	const visitor = new InsideDefinitionFinderVisitor(occurrence, PROD_TYPE.ALTERNATION, orProd);
	ruleGrammar.accept(visitor);
	return lookAheadSequenceFromAlternatives(visitor.result, k);
}
function getLookaheadPathsForOptionalProd(occurrence, ruleGrammar, prodType, k) {
	const insideDefVisitor = new InsideDefinitionFinderVisitor(occurrence, prodType);
	ruleGrammar.accept(insideDefVisitor);
	const insideDef = insideDefVisitor.result;
	const afterDef = new RestDefinitionFinderWalker(ruleGrammar, occurrence, prodType).startWalking();
	return lookAheadSequenceFromAlternatives([new Alternative({ definition: insideDef }), new Alternative({ definition: afterDef })], k);
}
function containsPath(alternative, searchPath) {
	compareOtherPath: for (let i = 0; i < alternative.length; i++) {
		const otherPath = alternative[i];
		if (otherPath.length !== searchPath.length) continue;
		for (let j = 0; j < otherPath.length; j++) {
			const searchTok = searchPath[j];
			const otherTok = otherPath[j];
			if ((searchTok === otherTok || otherTok.categoryMatchesMap[searchTok.tokenTypeIdx] !== void 0) === false) continue compareOtherPath;
		}
		return true;
	}
	return false;
}
function isStrictPrefixOfPath(prefix, other) {
	return prefix.length < other.length && every(prefix, (tokType, idx) => {
		const otherTokType = other[idx];
		return tokType === otherTokType || otherTokType.categoryMatchesMap[tokType.tokenTypeIdx];
	});
}
function areTokenCategoriesNotUsed(lookAheadPaths) {
	return every(lookAheadPaths, (singleAltPaths) => every(singleAltPaths, (singlePath) => every(singlePath, (token) => isEmpty(token.categoryMatches))));
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/grammar/checks.js
function validateLookahead(options) {
	return map(options.lookaheadStrategy.validate({
		rules: options.rules,
		tokenTypes: options.tokenTypes,
		grammarName: options.grammarName
	}), (errorMessage) => Object.assign({ type: ParserDefinitionErrorType.CUSTOM_LOOKAHEAD_VALIDATION }, errorMessage));
}
function validateGrammar$1(topLevels, tokenTypes, errMsgProvider, grammarName) {
	const duplicateErrors = flatMap$1(topLevels, (currTopLevel) => validateDuplicateProductions(currTopLevel, errMsgProvider));
	const termsNamespaceConflictErrors = checkTerminalAndNoneTerminalsNameSpace(topLevels, tokenTypes, errMsgProvider);
	const tooManyAltsErrors = flatMap$1(topLevels, (curRule) => validateTooManyAlts(curRule, errMsgProvider));
	const duplicateRulesError = flatMap$1(topLevels, (curRule) => validateRuleDoesNotAlreadyExist(curRule, topLevels, grammarName, errMsgProvider));
	return duplicateErrors.concat(termsNamespaceConflictErrors, tooManyAltsErrors, duplicateRulesError);
}
function validateDuplicateProductions(topLevelRule, errMsgProvider) {
	const collectorVisitor = new OccurrenceValidationCollector();
	topLevelRule.accept(collectorVisitor);
	const allRuleProductions = collectorVisitor.allProductions;
	return map(values(pickBy(groupBy(allRuleProductions, identifyProductionForDuplicates), (currGroup) => {
		return currGroup.length > 1;
	})), (currDuplicates) => {
		const firstProd = head(currDuplicates);
		const msg = errMsgProvider.buildDuplicateFoundError(topLevelRule, currDuplicates);
		const dslName = getProductionDslName$1(firstProd);
		const defError = {
			message: msg,
			type: ParserDefinitionErrorType.DUPLICATE_PRODUCTIONS,
			ruleName: topLevelRule.name,
			dslName,
			occurrence: firstProd.idx
		};
		const param = getExtraProductionArgument(firstProd);
		if (param) defError.parameter = param;
		return defError;
	});
}
function identifyProductionForDuplicates(prod) {
	return `${getProductionDslName$1(prod)}_#_${prod.idx}_#_${getExtraProductionArgument(prod)}`;
}
function getExtraProductionArgument(prod) {
	if (prod instanceof Terminal) return prod.terminalType.name;
	else if (prod instanceof NonTerminal) return prod.nonTerminalName;
	else return "";
}
var OccurrenceValidationCollector = class extends GAstVisitor {
	constructor() {
		super(...arguments);
		this.allProductions = [];
	}
	visitNonTerminal(subrule) {
		this.allProductions.push(subrule);
	}
	visitOption(option) {
		this.allProductions.push(option);
	}
	visitRepetitionWithSeparator(manySep) {
		this.allProductions.push(manySep);
	}
	visitRepetitionMandatory(atLeastOne) {
		this.allProductions.push(atLeastOne);
	}
	visitRepetitionMandatoryWithSeparator(atLeastOneSep) {
		this.allProductions.push(atLeastOneSep);
	}
	visitRepetition(many) {
		this.allProductions.push(many);
	}
	visitAlternation(or) {
		this.allProductions.push(or);
	}
	visitTerminal(terminal) {
		this.allProductions.push(terminal);
	}
};
function validateRuleDoesNotAlreadyExist(rule, allRules, className, errMsgProvider) {
	const errors = [];
	if (reduce(allRules, (result, curRule) => {
		if (curRule.name === rule.name) return result + 1;
		return result;
	}, 0) > 1) {
		const errMsg = errMsgProvider.buildDuplicateRuleNameError({
			topLevelRule: rule,
			grammarName: className
		});
		errors.push({
			message: errMsg,
			type: ParserDefinitionErrorType.DUPLICATE_RULE_NAME,
			ruleName: rule.name
		});
	}
	return errors;
}
function validateRuleIsOverridden(ruleName, definedRulesNames, className) {
	const errors = [];
	let errMsg;
	if (!includes(definedRulesNames, ruleName)) {
		errMsg = `Invalid rule override, rule: ->${ruleName}<- cannot be overridden in the grammar: ->${className}<-as it is not defined in any of the super grammars `;
		errors.push({
			message: errMsg,
			type: ParserDefinitionErrorType.INVALID_RULE_OVERRIDE,
			ruleName
		});
	}
	return errors;
}
function validateNoLeftRecursion(topRule, currRule, errMsgProvider, path = []) {
	const errors = [];
	const nextNonTerminals = getFirstNoneTerminal(currRule.definition);
	if (isEmpty(nextNonTerminals)) return [];
	else {
		const ruleName = topRule.name;
		if (includes(nextNonTerminals, topRule)) errors.push({
			message: errMsgProvider.buildLeftRecursionError({
				topLevelRule: topRule,
				leftRecursionPath: path
			}),
			type: ParserDefinitionErrorType.LEFT_RECURSION,
			ruleName
		});
		const errorsFromNextSteps = flatMap$1(difference(nextNonTerminals, path.concat([topRule])), (currRefRule) => {
			const newPath = clone(path);
			newPath.push(currRefRule);
			return validateNoLeftRecursion(topRule, currRefRule, errMsgProvider, newPath);
		});
		return errors.concat(errorsFromNextSteps);
	}
}
function getFirstNoneTerminal(definition) {
	let result = [];
	if (isEmpty(definition)) return result;
	const firstProd = head(definition);
	/* istanbul ignore else */
	if (firstProd instanceof NonTerminal) result.push(firstProd.referencedRule);
	else if (firstProd instanceof Alternative || firstProd instanceof Option$1 || firstProd instanceof RepetitionMandatory || firstProd instanceof RepetitionMandatoryWithSeparator || firstProd instanceof RepetitionWithSeparator || firstProd instanceof Repetition) result = result.concat(getFirstNoneTerminal(firstProd.definition));
	else if (firstProd instanceof Alternation) result = flatten(map(firstProd.definition, (currSubDef) => getFirstNoneTerminal(currSubDef.definition)));
	else if (firstProd instanceof Terminal) {} else throw Error("non exhaustive match");
	const isFirstOptional = isOptionalProd(firstProd);
	const hasMore = definition.length > 1;
	if (isFirstOptional && hasMore) {
		const rest = drop(definition);
		return result.concat(getFirstNoneTerminal(rest));
	} else return result;
}
var OrCollector = class extends GAstVisitor {
	constructor() {
		super(...arguments);
		this.alternations = [];
	}
	visitAlternation(node) {
		this.alternations.push(node);
	}
};
function validateEmptyOrAlternative(topLevelRule, errMsgProvider) {
	const orCollector = new OrCollector();
	topLevelRule.accept(orCollector);
	const ors = orCollector.alternations;
	return flatMap$1(ors, (currOr) => {
		return flatMap$1(dropRight(currOr.definition), (currAlternative, currAltIdx) => {
			if (isEmpty(nextPossibleTokensAfter([currAlternative], [], tokenStructuredMatcher, 1))) return [{
				message: errMsgProvider.buildEmptyAlternationError({
					topLevelRule,
					alternation: currOr,
					emptyChoiceIdx: currAltIdx
				}),
				type: ParserDefinitionErrorType.NONE_LAST_EMPTY_ALT,
				ruleName: topLevelRule.name,
				occurrence: currOr.idx,
				alternative: currAltIdx + 1
			}];
			else return [];
		});
	});
}
function validateAmbiguousAlternationAlternatives(topLevelRule, globalMaxLookahead, errMsgProvider) {
	const orCollector = new OrCollector();
	topLevelRule.accept(orCollector);
	let ors = orCollector.alternations;
	ors = reject(ors, (currOr) => currOr.ignoreAmbiguities === true);
	return flatMap$1(ors, (currOr) => {
		const currOccurrence = currOr.idx;
		const alternatives = getLookaheadPathsForOr(currOccurrence, topLevelRule, currOr.maxLookahead || globalMaxLookahead, currOr);
		const altsAmbiguityErrors = checkAlternativesAmbiguities(alternatives, currOr, topLevelRule, errMsgProvider);
		const altsPrefixAmbiguityErrors = checkPrefixAlternativesAmbiguities(alternatives, currOr, topLevelRule, errMsgProvider);
		return altsAmbiguityErrors.concat(altsPrefixAmbiguityErrors);
	});
}
var RepetitionCollector = class extends GAstVisitor {
	constructor() {
		super(...arguments);
		this.allProductions = [];
	}
	visitRepetitionWithSeparator(manySep) {
		this.allProductions.push(manySep);
	}
	visitRepetitionMandatory(atLeastOne) {
		this.allProductions.push(atLeastOne);
	}
	visitRepetitionMandatoryWithSeparator(atLeastOneSep) {
		this.allProductions.push(atLeastOneSep);
	}
	visitRepetition(many) {
		this.allProductions.push(many);
	}
};
function validateTooManyAlts(topLevelRule, errMsgProvider) {
	const orCollector = new OrCollector();
	topLevelRule.accept(orCollector);
	const ors = orCollector.alternations;
	return flatMap$1(ors, (currOr) => {
		if (currOr.definition.length > 255) return [{
			message: errMsgProvider.buildTooManyAlternativesError({
				topLevelRule,
				alternation: currOr
			}),
			type: ParserDefinitionErrorType.TOO_MANY_ALTS,
			ruleName: topLevelRule.name,
			occurrence: currOr.idx
		}];
		else return [];
	});
}
function validateSomeNonEmptyLookaheadPath(topLevelRules, maxLookahead, errMsgProvider) {
	const errors = [];
	forEach(topLevelRules, (currTopRule) => {
		const collectorVisitor = new RepetitionCollector();
		currTopRule.accept(collectorVisitor);
		const allRuleProductions = collectorVisitor.allProductions;
		forEach(allRuleProductions, (currProd) => {
			const prodType = getProdType$1(currProd);
			const actualMaxLookahead = currProd.maxLookahead || maxLookahead;
			const currOccurrence = currProd.idx;
			const pathsInsideProduction = getLookaheadPathsForOptionalProd(currOccurrence, currTopRule, prodType, actualMaxLookahead)[0];
			if (isEmpty(flatten(pathsInsideProduction))) {
				const errMsg = errMsgProvider.buildEmptyRepetitionError({
					topLevelRule: currTopRule,
					repetition: currProd
				});
				errors.push({
					message: errMsg,
					type: ParserDefinitionErrorType.NO_NON_EMPTY_LOOKAHEAD,
					ruleName: currTopRule.name
				});
			}
		});
	});
	return errors;
}
function checkAlternativesAmbiguities(alternatives, alternation, rule, errMsgProvider) {
	const foundAmbiguousPaths = [];
	return map(reduce(alternatives, (result, currAlt, currAltIdx) => {
		if (alternation.definition[currAltIdx].ignoreAmbiguities === true) return result;
		forEach(currAlt, (currPath) => {
			const altsCurrPathAppearsIn = [currAltIdx];
			forEach(alternatives, (currOtherAlt, currOtherAltIdx) => {
				if (currAltIdx !== currOtherAltIdx && containsPath(currOtherAlt, currPath) && alternation.definition[currOtherAltIdx].ignoreAmbiguities !== true) altsCurrPathAppearsIn.push(currOtherAltIdx);
			});
			if (altsCurrPathAppearsIn.length > 1 && !containsPath(foundAmbiguousPaths, currPath)) {
				foundAmbiguousPaths.push(currPath);
				result.push({
					alts: altsCurrPathAppearsIn,
					path: currPath
				});
			}
		});
		return result;
	}, []), (currAmbDescriptor) => {
		const ambgIndices = map(currAmbDescriptor.alts, (currAltIdx) => currAltIdx + 1);
		return {
			message: errMsgProvider.buildAlternationAmbiguityError({
				topLevelRule: rule,
				alternation,
				ambiguityIndices: ambgIndices,
				prefixPath: currAmbDescriptor.path
			}),
			type: ParserDefinitionErrorType.AMBIGUOUS_ALTS,
			ruleName: rule.name,
			occurrence: alternation.idx,
			alternatives: currAmbDescriptor.alts
		};
	});
}
function checkPrefixAlternativesAmbiguities(alternatives, alternation, rule, errMsgProvider) {
	const pathsAndIndices = reduce(alternatives, (result, currAlt, idx) => {
		const currPathsAndIdx = map(currAlt, (currPath) => {
			return {
				idx,
				path: currPath
			};
		});
		return result.concat(currPathsAndIdx);
	}, []);
	return compact(flatMap$1(pathsAndIndices, (currPathAndIdx) => {
		if (alternation.definition[currPathAndIdx.idx].ignoreAmbiguities === true) return [];
		const targetIdx = currPathAndIdx.idx;
		const targetPath = currPathAndIdx.path;
		return map(filter(pathsAndIndices, (searchPathAndIdx) => {
			return alternation.definition[searchPathAndIdx.idx].ignoreAmbiguities !== true && searchPathAndIdx.idx < targetIdx && isStrictPrefixOfPath(searchPathAndIdx.path, targetPath);
		}), (currAmbPathAndIdx) => {
			const ambgIndices = [currAmbPathAndIdx.idx + 1, targetIdx + 1];
			const occurrence = alternation.idx === 0 ? "" : alternation.idx;
			return {
				message: errMsgProvider.buildAlternationPrefixAmbiguityError({
					topLevelRule: rule,
					alternation,
					ambiguityIndices: ambgIndices,
					prefixPath: currAmbPathAndIdx.path
				}),
				type: ParserDefinitionErrorType.AMBIGUOUS_PREFIX_ALTS,
				ruleName: rule.name,
				occurrence,
				alternatives: ambgIndices
			};
		});
	}));
}
function checkTerminalAndNoneTerminalsNameSpace(topLevels, tokenTypes, errMsgProvider) {
	const errors = [];
	const tokenNames = map(tokenTypes, (currToken) => currToken.name);
	forEach(topLevels, (currRule) => {
		const currRuleName = currRule.name;
		if (includes(tokenNames, currRuleName)) {
			const errMsg = errMsgProvider.buildNamespaceConflictError(currRule);
			errors.push({
				message: errMsg,
				type: ParserDefinitionErrorType.CONFLICT_TOKENS_RULES_NAMESPACE,
				ruleName: currRuleName
			});
		}
	});
	return errors;
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/grammar/gast/gast_resolver_public.js
function resolveGrammar(options) {
	const actualOptions = defaults(options, { errMsgProvider: defaultGrammarResolverErrorProvider });
	const topRulesTable = {};
	forEach(options.rules, (rule) => {
		topRulesTable[rule.name] = rule;
	});
	return resolveGrammar$1(topRulesTable, actualOptions.errMsgProvider);
}
function validateGrammar(options) {
	options = defaults(options, { errMsgProvider: defaultGrammarValidatorErrorProvider });
	return validateGrammar$1(options.rules, options.tokenTypes, options.errMsgProvider, options.grammarName);
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/exceptions_public.js
var MISMATCHED_TOKEN_EXCEPTION = "MismatchedTokenException";
var NO_VIABLE_ALT_EXCEPTION = "NoViableAltException";
var EARLY_EXIT_EXCEPTION = "EarlyExitException";
var NOT_ALL_INPUT_PARSED_EXCEPTION = "NotAllInputParsedException";
var RECOGNITION_EXCEPTION_NAMES = [
	MISMATCHED_TOKEN_EXCEPTION,
	NO_VIABLE_ALT_EXCEPTION,
	EARLY_EXIT_EXCEPTION,
	NOT_ALL_INPUT_PARSED_EXCEPTION
];
Object.freeze(RECOGNITION_EXCEPTION_NAMES);
function isRecognitionException(error) {
	return includes(RECOGNITION_EXCEPTION_NAMES, error.name);
}
var RecognitionException = class extends Error {
	constructor(message, token) {
		super(message);
		this.token = token;
		this.resyncedTokens = [];
		Object.setPrototypeOf(this, new.target.prototype);
		/* istanbul ignore next - V8 workaround to remove constructor from stacktrace when typescript target is ES5 */
		if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
	}
};
var MismatchedTokenException = class extends RecognitionException {
	constructor(message, token, previousToken) {
		super(message, token);
		this.previousToken = previousToken;
		this.name = MISMATCHED_TOKEN_EXCEPTION;
	}
};
var NoViableAltException = class extends RecognitionException {
	constructor(message, token, previousToken) {
		super(message, token);
		this.previousToken = previousToken;
		this.name = NO_VIABLE_ALT_EXCEPTION;
	}
};
var NotAllInputParsedException = class extends RecognitionException {
	constructor(message, token) {
		super(message, token);
		this.name = NOT_ALL_INPUT_PARSED_EXCEPTION;
	}
};
var EarlyExitException = class extends RecognitionException {
	constructor(message, token, previousToken) {
		super(message, token);
		this.previousToken = previousToken;
		this.name = EARLY_EXIT_EXCEPTION;
	}
};
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/parser/traits/recoverable.js
var EOF_FOLLOW_KEY = {};
var IN_RULE_RECOVERY_EXCEPTION = "InRuleRecoveryException";
var InRuleRecoveryException = class extends Error {
	constructor(message) {
		super(message);
		this.name = IN_RULE_RECOVERY_EXCEPTION;
	}
};
/**
* This trait is responsible for the error recovery and fault tolerant logic
*/
var Recoverable = class {
	initRecoverable(config) {
		this.firstAfterRepMap = {};
		this.resyncFollows = {};
		this.recoveryEnabled = has(config, "recoveryEnabled") ? config.recoveryEnabled : DEFAULT_PARSER_CONFIG.recoveryEnabled;
		if (this.recoveryEnabled) this.attemptInRepetitionRecovery = attemptInRepetitionRecovery;
	}
	getTokenToInsert(tokType) {
		const tokToInsert = createTokenInstance(tokType, "", NaN, NaN, NaN, NaN, NaN, NaN);
		tokToInsert.isInsertedInRecovery = true;
		return tokToInsert;
	}
	canTokenTypeBeInsertedInRecovery(tokType) {
		return true;
	}
	canTokenTypeBeDeletedInRecovery(tokType) {
		return true;
	}
	tryInRepetitionRecovery(grammarRule, grammarRuleArgs, lookAheadFunc, expectedTokType) {
		const reSyncTokType = this.findReSyncTokenType();
		const savedLexerState = this.exportLexerState();
		const resyncedTokens = [];
		let passedResyncPoint = false;
		const nextTokenWithoutResync = this.LA(1);
		let currToken = this.LA(1);
		const generateErrorMessage = () => {
			const previousToken = this.LA(0);
			const error = new MismatchedTokenException(this.errorMessageProvider.buildMismatchTokenMessage({
				expected: expectedTokType,
				actual: nextTokenWithoutResync,
				previous: previousToken,
				ruleName: this.getCurrRuleFullName()
			}), nextTokenWithoutResync, this.LA(0));
			error.resyncedTokens = dropRight(resyncedTokens);
			this.SAVE_ERROR(error);
		};
		while (!passedResyncPoint) if (this.tokenMatcher(currToken, expectedTokType)) {
			generateErrorMessage();
			return;
		} else if (lookAheadFunc.call(this)) {
			generateErrorMessage();
			grammarRule.apply(this, grammarRuleArgs);
			return;
		} else if (this.tokenMatcher(currToken, reSyncTokType)) passedResyncPoint = true;
		else {
			currToken = this.SKIP_TOKEN();
			this.addToResyncTokens(currToken, resyncedTokens);
		}
		this.importLexerState(savedLexerState);
	}
	shouldInRepetitionRecoveryBeTried(expectTokAfterLastMatch, nextTokIdx, notStuck) {
		if (notStuck === false) return false;
		if (this.tokenMatcher(this.LA(1), expectTokAfterLastMatch)) return false;
		if (this.isBackTracking()) return false;
		if (this.canPerformInRuleRecovery(expectTokAfterLastMatch, this.getFollowsForInRuleRecovery(expectTokAfterLastMatch, nextTokIdx))) return false;
		return true;
	}
	getFollowsForInRuleRecovery(tokType, tokIdxInRule) {
		const grammarPath = this.getCurrentGrammarPath(tokType, tokIdxInRule);
		return this.getNextPossibleTokenTypes(grammarPath);
	}
	tryInRuleRecovery(expectedTokType, follows) {
		if (this.canRecoverWithSingleTokenInsertion(expectedTokType, follows)) return this.getTokenToInsert(expectedTokType);
		if (this.canRecoverWithSingleTokenDeletion(expectedTokType)) {
			const nextTok = this.SKIP_TOKEN();
			this.consumeToken();
			return nextTok;
		}
		throw new InRuleRecoveryException("sad sad panda");
	}
	canPerformInRuleRecovery(expectedToken, follows) {
		return this.canRecoverWithSingleTokenInsertion(expectedToken, follows) || this.canRecoverWithSingleTokenDeletion(expectedToken);
	}
	canRecoverWithSingleTokenInsertion(expectedTokType, follows) {
		if (!this.canTokenTypeBeInsertedInRecovery(expectedTokType)) return false;
		if (isEmpty(follows)) return false;
		const mismatchedTok = this.LA(1);
		return find(follows, (possibleFollowsTokType) => {
			return this.tokenMatcher(mismatchedTok, possibleFollowsTokType);
		}) !== void 0;
	}
	canRecoverWithSingleTokenDeletion(expectedTokType) {
		if (!this.canTokenTypeBeDeletedInRecovery(expectedTokType)) return false;
		return this.tokenMatcher(this.LA(2), expectedTokType);
	}
	isInCurrentRuleReSyncSet(tokenTypeIdx) {
		const followKey = this.getCurrFollowKey();
		return includes(this.getFollowSetFromFollowKey(followKey), tokenTypeIdx);
	}
	findReSyncTokenType() {
		const allPossibleReSyncTokTypes = this.flattenFollowSet();
		let nextToken = this.LA(1);
		let k = 2;
		while (true) {
			const foundMatch = find(allPossibleReSyncTokTypes, (resyncTokType) => {
				return tokenMatcher(nextToken, resyncTokType);
			});
			if (foundMatch !== void 0) return foundMatch;
			nextToken = this.LA(k);
			k++;
		}
	}
	getCurrFollowKey() {
		if (this.RULE_STACK.length === 1) return EOF_FOLLOW_KEY;
		const currRuleShortName = this.getLastExplicitRuleShortName();
		const currRuleIdx = this.getLastExplicitRuleOccurrenceIndex();
		const prevRuleShortName = this.getPreviousExplicitRuleShortName();
		return {
			ruleName: this.shortRuleNameToFullName(currRuleShortName),
			idxInCallingRule: currRuleIdx,
			inRule: this.shortRuleNameToFullName(prevRuleShortName)
		};
	}
	buildFullFollowKeyStack() {
		const explicitRuleStack = this.RULE_STACK;
		const explicitOccurrenceStack = this.RULE_OCCURRENCE_STACK;
		return map(explicitRuleStack, (ruleName, idx) => {
			if (idx === 0) return EOF_FOLLOW_KEY;
			return {
				ruleName: this.shortRuleNameToFullName(ruleName),
				idxInCallingRule: explicitOccurrenceStack[idx],
				inRule: this.shortRuleNameToFullName(explicitRuleStack[idx - 1])
			};
		});
	}
	flattenFollowSet() {
		return flatten(map(this.buildFullFollowKeyStack(), (currKey) => {
			return this.getFollowSetFromFollowKey(currKey);
		}));
	}
	getFollowSetFromFollowKey(followKey) {
		if (followKey === EOF_FOLLOW_KEY) return [EOF];
		const followName = followKey.ruleName + followKey.idxInCallingRule + IN + followKey.inRule;
		return this.resyncFollows[followName];
	}
	addToResyncTokens(token, resyncTokens) {
		if (!this.tokenMatcher(token, EOF)) resyncTokens.push(token);
		return resyncTokens;
	}
	reSyncTo(tokType) {
		const resyncedTokens = [];
		let nextTok = this.LA(1);
		while (this.tokenMatcher(nextTok, tokType) === false) {
			nextTok = this.SKIP_TOKEN();
			this.addToResyncTokens(nextTok, resyncedTokens);
		}
		return dropRight(resyncedTokens);
	}
	attemptInRepetitionRecovery(prodFunc, args, lookaheadFunc, dslMethodIdx, prodOccurrence, nextToksWalker, notStuck) {}
	getCurrentGrammarPath(tokType, tokIdxInRule) {
		return {
			ruleStack: this.getHumanReadableRuleStack(),
			occurrenceStack: clone(this.RULE_OCCURRENCE_STACK),
			lastTok: tokType,
			lastTokOccurrence: tokIdxInRule
		};
	}
	getHumanReadableRuleStack() {
		return map(this.RULE_STACK, (currShortName) => this.shortRuleNameToFullName(currShortName));
	}
};
function attemptInRepetitionRecovery(prodFunc, args, lookaheadFunc, dslMethodIdx, prodOccurrence, nextToksWalker, notStuck) {
	const key = this.getKeyForAutomaticLookahead(dslMethodIdx, prodOccurrence);
	let firstAfterRepInfo = this.firstAfterRepMap[key];
	if (firstAfterRepInfo === void 0) {
		const currRuleName = this.getCurrRuleFullName();
		const ruleGrammar = this.getGAstProductions()[currRuleName];
		firstAfterRepInfo = new nextToksWalker(ruleGrammar, prodOccurrence).startWalking();
		this.firstAfterRepMap[key] = firstAfterRepInfo;
	}
	let expectTokAfterLastMatch = firstAfterRepInfo.token;
	let nextTokIdx = firstAfterRepInfo.occurrence;
	const isEndOfRule = firstAfterRepInfo.isEndOfRule;
	if (this.RULE_STACK.length === 1 && isEndOfRule && expectTokAfterLastMatch === void 0) {
		expectTokAfterLastMatch = EOF;
		nextTokIdx = 1;
	}
	if (expectTokAfterLastMatch === void 0 || nextTokIdx === void 0) return;
	if (this.shouldInRepetitionRecoveryBeTried(expectTokAfterLastMatch, nextTokIdx, notStuck)) this.tryInRepetitionRecovery(prodFunc, args, lookaheadFunc, expectTokAfterLastMatch);
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/grammar/keys.js
var AT_LEAST_ONE_IDX = 1024;
var MANY_SEP_IDX = 1280;
var AT_LEAST_ONE_SEP_IDX = 1536;
function getKeyForAutomaticLookahead(ruleIdx, dslMethodIdx, occurrence) {
	return occurrence | dslMethodIdx | ruleIdx;
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/grammar/llk_lookahead.js
var LLkLookaheadStrategy = class {
	constructor(options) {
		var _a;
		this.maxLookahead = (_a = options === null || options === void 0 ? void 0 : options.maxLookahead) !== null && _a !== void 0 ? _a : DEFAULT_PARSER_CONFIG.maxLookahead;
	}
	validate(options) {
		const leftRecursionErrors = this.validateNoLeftRecursion(options.rules);
		if (isEmpty(leftRecursionErrors)) {
			const emptyAltErrors = this.validateEmptyOrAlternatives(options.rules);
			const ambiguousAltsErrors = this.validateAmbiguousAlternationAlternatives(options.rules, this.maxLookahead);
			const emptyRepetitionErrors = this.validateSomeNonEmptyLookaheadPath(options.rules, this.maxLookahead);
			return [
				...leftRecursionErrors,
				...emptyAltErrors,
				...ambiguousAltsErrors,
				...emptyRepetitionErrors
			];
		}
		return leftRecursionErrors;
	}
	validateNoLeftRecursion(rules) {
		return flatMap$1(rules, (currTopRule) => validateNoLeftRecursion(currTopRule, currTopRule, defaultGrammarValidatorErrorProvider));
	}
	validateEmptyOrAlternatives(rules) {
		return flatMap$1(rules, (currTopRule) => validateEmptyOrAlternative(currTopRule, defaultGrammarValidatorErrorProvider));
	}
	validateAmbiguousAlternationAlternatives(rules, maxLookahead) {
		return flatMap$1(rules, (currTopRule) => validateAmbiguousAlternationAlternatives(currTopRule, maxLookahead, defaultGrammarValidatorErrorProvider));
	}
	validateSomeNonEmptyLookaheadPath(rules, maxLookahead) {
		return validateSomeNonEmptyLookaheadPath(rules, maxLookahead, defaultGrammarValidatorErrorProvider);
	}
	buildLookaheadForAlternation(options) {
		return buildLookaheadFuncForOr(options.prodOccurrence, options.rule, options.maxLookahead, options.hasPredicates, options.dynamicTokensEnabled, buildAlternativesLookAheadFunc);
	}
	buildLookaheadForOptional(options) {
		return buildLookaheadFuncForOptionalProd(options.prodOccurrence, options.rule, options.maxLookahead, options.dynamicTokensEnabled, getProdType$1(options.prodType), buildSingleAlternativeLookaheadFunction);
	}
};
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/parser/traits/looksahead.js
/**
* Trait responsible for the lookahead related utilities and optimizations.
*/
var LooksAhead = class {
	initLooksAhead(config) {
		this.dynamicTokensEnabled = has(config, "dynamicTokensEnabled") ? config.dynamicTokensEnabled : DEFAULT_PARSER_CONFIG.dynamicTokensEnabled;
		this.maxLookahead = has(config, "maxLookahead") ? config.maxLookahead : DEFAULT_PARSER_CONFIG.maxLookahead;
		this.lookaheadStrategy = has(config, "lookaheadStrategy") ? config.lookaheadStrategy : new LLkLookaheadStrategy({ maxLookahead: this.maxLookahead });
		this.lookAheadFuncsCache = /* @__PURE__ */ new Map();
	}
	preComputeLookaheadFunctions(rules) {
		forEach(rules, (currRule) => {
			this.TRACE_INIT(`${currRule.name} Rule Lookahead`, () => {
				const { alternation, repetition, option, repetitionMandatory, repetitionMandatoryWithSeparator, repetitionWithSeparator } = collectMethods(currRule);
				forEach(alternation, (currProd) => {
					const prodIdx = currProd.idx === 0 ? "" : currProd.idx;
					this.TRACE_INIT(`${getProductionDslName$1(currProd)}${prodIdx}`, () => {
						const laFunc = this.lookaheadStrategy.buildLookaheadForAlternation({
							prodOccurrence: currProd.idx,
							rule: currRule,
							maxLookahead: currProd.maxLookahead || this.maxLookahead,
							hasPredicates: currProd.hasPredicates,
							dynamicTokensEnabled: this.dynamicTokensEnabled
						});
						const key = getKeyForAutomaticLookahead(this.fullRuleNameToShort[currRule.name], 256, currProd.idx);
						this.setLaFuncCache(key, laFunc);
					});
				});
				forEach(repetition, (currProd) => {
					this.computeLookaheadFunc(currRule, currProd.idx, 768, "Repetition", currProd.maxLookahead, getProductionDslName$1(currProd));
				});
				forEach(option, (currProd) => {
					this.computeLookaheadFunc(currRule, currProd.idx, 512, "Option", currProd.maxLookahead, getProductionDslName$1(currProd));
				});
				forEach(repetitionMandatory, (currProd) => {
					this.computeLookaheadFunc(currRule, currProd.idx, AT_LEAST_ONE_IDX, "RepetitionMandatory", currProd.maxLookahead, getProductionDslName$1(currProd));
				});
				forEach(repetitionMandatoryWithSeparator, (currProd) => {
					this.computeLookaheadFunc(currRule, currProd.idx, AT_LEAST_ONE_SEP_IDX, "RepetitionMandatoryWithSeparator", currProd.maxLookahead, getProductionDslName$1(currProd));
				});
				forEach(repetitionWithSeparator, (currProd) => {
					this.computeLookaheadFunc(currRule, currProd.idx, MANY_SEP_IDX, "RepetitionWithSeparator", currProd.maxLookahead, getProductionDslName$1(currProd));
				});
			});
		});
	}
	computeLookaheadFunc(rule, prodOccurrence, prodKey, prodType, prodMaxLookahead, dslMethodName) {
		this.TRACE_INIT(`${dslMethodName}${prodOccurrence === 0 ? "" : prodOccurrence}`, () => {
			const laFunc = this.lookaheadStrategy.buildLookaheadForOptional({
				prodOccurrence,
				rule,
				maxLookahead: prodMaxLookahead || this.maxLookahead,
				dynamicTokensEnabled: this.dynamicTokensEnabled,
				prodType
			});
			const key = getKeyForAutomaticLookahead(this.fullRuleNameToShort[rule.name], prodKey, prodOccurrence);
			this.setLaFuncCache(key, laFunc);
		});
	}
	getKeyForAutomaticLookahead(dslMethodIdx, occurrence) {
		return getKeyForAutomaticLookahead(this.getLastExplicitRuleShortName(), dslMethodIdx, occurrence);
	}
	getLaFuncFromCache(key) {
		return this.lookAheadFuncsCache.get(key);
	}
	/* istanbul ignore next */
	setLaFuncCache(key, value) {
		this.lookAheadFuncsCache.set(key, value);
	}
};
var DslMethodsCollectorVisitor = class extends GAstVisitor {
	constructor() {
		super(...arguments);
		this.dslMethods = {
			option: [],
			alternation: [],
			repetition: [],
			repetitionWithSeparator: [],
			repetitionMandatory: [],
			repetitionMandatoryWithSeparator: []
		};
	}
	reset() {
		this.dslMethods = {
			option: [],
			alternation: [],
			repetition: [],
			repetitionWithSeparator: [],
			repetitionMandatory: [],
			repetitionMandatoryWithSeparator: []
		};
	}
	visitOption(option) {
		this.dslMethods.option.push(option);
	}
	visitRepetitionWithSeparator(manySep) {
		this.dslMethods.repetitionWithSeparator.push(manySep);
	}
	visitRepetitionMandatory(atLeastOne) {
		this.dslMethods.repetitionMandatory.push(atLeastOne);
	}
	visitRepetitionMandatoryWithSeparator(atLeastOneSep) {
		this.dslMethods.repetitionMandatoryWithSeparator.push(atLeastOneSep);
	}
	visitRepetition(many) {
		this.dslMethods.repetition.push(many);
	}
	visitAlternation(or) {
		this.dslMethods.alternation.push(or);
	}
};
var collectorVisitor = new DslMethodsCollectorVisitor();
function collectMethods(rule) {
	collectorVisitor.reset();
	rule.accept(collectorVisitor);
	const dslMethods = collectorVisitor.dslMethods;
	collectorVisitor.reset();
	return dslMethods;
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/cst/cst.js
/**
* This nodeLocation tracking is not efficient and should only be used
* when error recovery is enabled or the Token Vector contains virtual Tokens
* (e.g, Python Indent/Outdent)
* As it executes the calculation for every single terminal/nonTerminal
* and does not rely on the fact the token vector is **sorted**
*/
function setNodeLocationOnlyOffset(currNodeLocation, newLocationInfo) {
	if (isNaN(currNodeLocation.startOffset) === true) {
		currNodeLocation.startOffset = newLocationInfo.startOffset;
		currNodeLocation.endOffset = newLocationInfo.endOffset;
	} else if (currNodeLocation.endOffset < newLocationInfo.endOffset === true) currNodeLocation.endOffset = newLocationInfo.endOffset;
}
/**
* This nodeLocation tracking is not efficient and should only be used
* when error recovery is enabled or the Token Vector contains virtual Tokens
* (e.g, Python Indent/Outdent)
* As it executes the calculation for every single terminal/nonTerminal
* and does not rely on the fact the token vector is **sorted**
*/
function setNodeLocationFull(currNodeLocation, newLocationInfo) {
	if (isNaN(currNodeLocation.startOffset) === true) {
		currNodeLocation.startOffset = newLocationInfo.startOffset;
		currNodeLocation.startColumn = newLocationInfo.startColumn;
		currNodeLocation.startLine = newLocationInfo.startLine;
		currNodeLocation.endOffset = newLocationInfo.endOffset;
		currNodeLocation.endColumn = newLocationInfo.endColumn;
		currNodeLocation.endLine = newLocationInfo.endLine;
	} else if (currNodeLocation.endOffset < newLocationInfo.endOffset === true) {
		currNodeLocation.endOffset = newLocationInfo.endOffset;
		currNodeLocation.endColumn = newLocationInfo.endColumn;
		currNodeLocation.endLine = newLocationInfo.endLine;
	}
}
function addTerminalToCst(node, token, tokenTypeName) {
	if (node.children[tokenTypeName] === void 0) node.children[tokenTypeName] = [token];
	else node.children[tokenTypeName].push(token);
}
function addNoneTerminalToCst(node, ruleName, ruleResult) {
	if (node.children[ruleName] === void 0) node.children[ruleName] = [ruleResult];
	else node.children[ruleName].push(ruleResult);
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/lang/lang_extensions.js
var NAME = "name";
function defineNameProp(obj, nameValue) {
	Object.defineProperty(obj, NAME, {
		enumerable: false,
		configurable: true,
		writable: false,
		value: nameValue
	});
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/cst/cst_visitor.js
function defaultVisit(ctx, param) {
	const childrenNames = keys(ctx);
	const childrenNamesLength = childrenNames.length;
	for (let i = 0; i < childrenNamesLength; i++) {
		const currChildArray = ctx[childrenNames[i]];
		const currChildArrayLength = currChildArray.length;
		for (let j = 0; j < currChildArrayLength; j++) {
			const currChild = currChildArray[j];
			if (currChild.tokenTypeIdx === void 0) this[currChild.name](currChild.children, param);
		}
	}
}
function createBaseSemanticVisitorConstructor(grammarName, ruleNames) {
	const derivedConstructor = function() {};
	defineNameProp(derivedConstructor, grammarName + "BaseSemantics");
	derivedConstructor.prototype = {
		visit: function(cstNode, param) {
			if (isArray(cstNode)) cstNode = cstNode[0];
			if (isUndefined(cstNode)) return;
			return this[cstNode.name](cstNode.children, param);
		},
		validateVisitor: function() {
			const semanticDefinitionErrors = validateVisitor(this, ruleNames);
			if (!isEmpty(semanticDefinitionErrors)) {
				const errorMessages = map(semanticDefinitionErrors, (currDefError) => currDefError.msg);
				throw Error(`Errors Detected in CST Visitor <${this.constructor.name}>:\n\t${errorMessages.join("\n\n").replace(/\n/g, "\n	")}`);
			}
		}
	};
	derivedConstructor.prototype.constructor = derivedConstructor;
	derivedConstructor._RULE_NAMES = ruleNames;
	return derivedConstructor;
}
function createBaseVisitorConstructorWithDefaults(grammarName, ruleNames, baseConstructor) {
	const derivedConstructor = function() {};
	defineNameProp(derivedConstructor, grammarName + "BaseSemanticsWithDefaults");
	const withDefaultsProto = Object.create(baseConstructor.prototype);
	forEach(ruleNames, (ruleName) => {
		withDefaultsProto[ruleName] = defaultVisit;
	});
	derivedConstructor.prototype = withDefaultsProto;
	derivedConstructor.prototype.constructor = derivedConstructor;
	return derivedConstructor;
}
var CstVisitorDefinitionError;
(function(CstVisitorDefinitionError) {
	CstVisitorDefinitionError[CstVisitorDefinitionError["REDUNDANT_METHOD"] = 0] = "REDUNDANT_METHOD";
	CstVisitorDefinitionError[CstVisitorDefinitionError["MISSING_METHOD"] = 1] = "MISSING_METHOD";
})(CstVisitorDefinitionError || (CstVisitorDefinitionError = {}));
function validateVisitor(visitorInstance, ruleNames) {
	return validateMissingCstMethods(visitorInstance, ruleNames);
}
function validateMissingCstMethods(visitorInstance, ruleNames) {
	return compact(map(filter(ruleNames, (currRuleName) => {
		return isFunction(visitorInstance[currRuleName]) === false;
	}), (currRuleName) => {
		return {
			msg: `Missing visitor method: <${currRuleName}> on ${visitorInstance.constructor.name} CST Visitor.`,
			type: CstVisitorDefinitionError.MISSING_METHOD,
			methodName: currRuleName
		};
	}));
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/parser/traits/tree_builder.js
/**
* This trait is responsible for the CST building logic.
*/
var TreeBuilder = class {
	initTreeBuilder(config) {
		this.CST_STACK = [];
		this.outputCst = config.outputCst;
		this.nodeLocationTracking = has(config, "nodeLocationTracking") ? config.nodeLocationTracking : DEFAULT_PARSER_CONFIG.nodeLocationTracking;
		if (!this.outputCst) {
			this.cstInvocationStateUpdate = noop;
			this.cstFinallyStateUpdate = noop;
			this.cstPostTerminal = noop;
			this.cstPostNonTerminal = noop;
			this.cstPostRule = noop;
		} else if (/full/i.test(this.nodeLocationTracking)) {
			if (this.recoveryEnabled) {
				this.setNodeLocationFromToken = setNodeLocationFull;
				this.setNodeLocationFromNode = setNodeLocationFull;
				this.cstPostRule = noop;
				this.setInitialNodeLocation = this.setInitialNodeLocationFullRecovery;
			} else {
				this.setNodeLocationFromToken = noop;
				this.setNodeLocationFromNode = noop;
				this.cstPostRule = this.cstPostRuleFull;
				this.setInitialNodeLocation = this.setInitialNodeLocationFullRegular;
			}
		} else if (/onlyOffset/i.test(this.nodeLocationTracking)) {
			if (this.recoveryEnabled) {
				this.setNodeLocationFromToken = setNodeLocationOnlyOffset;
				this.setNodeLocationFromNode = setNodeLocationOnlyOffset;
				this.cstPostRule = noop;
				this.setInitialNodeLocation = this.setInitialNodeLocationOnlyOffsetRecovery;
			} else {
				this.setNodeLocationFromToken = noop;
				this.setNodeLocationFromNode = noop;
				this.cstPostRule = this.cstPostRuleOnlyOffset;
				this.setInitialNodeLocation = this.setInitialNodeLocationOnlyOffsetRegular;
			}
		} else if (/none/i.test(this.nodeLocationTracking)) {
			this.setNodeLocationFromToken = noop;
			this.setNodeLocationFromNode = noop;
			this.cstPostRule = noop;
			this.setInitialNodeLocation = noop;
		} else throw Error(`Invalid <nodeLocationTracking> config option: "${config.nodeLocationTracking}"`);
	}
	setInitialNodeLocationOnlyOffsetRecovery(cstNode) {
		cstNode.location = {
			startOffset: NaN,
			endOffset: NaN
		};
	}
	setInitialNodeLocationOnlyOffsetRegular(cstNode) {
		cstNode.location = {
			startOffset: this.LA(1).startOffset,
			endOffset: NaN
		};
	}
	setInitialNodeLocationFullRecovery(cstNode) {
		cstNode.location = {
			startOffset: NaN,
			startLine: NaN,
			startColumn: NaN,
			endOffset: NaN,
			endLine: NaN,
			endColumn: NaN
		};
	}
	/**
	*  @see setInitialNodeLocationOnlyOffsetRegular for explanation why this work
	
	* @param cstNode
	*/
	setInitialNodeLocationFullRegular(cstNode) {
		const nextToken = this.LA(1);
		cstNode.location = {
			startOffset: nextToken.startOffset,
			startLine: nextToken.startLine,
			startColumn: nextToken.startColumn,
			endOffset: NaN,
			endLine: NaN,
			endColumn: NaN
		};
	}
	cstInvocationStateUpdate(fullRuleName) {
		const cstNode = {
			name: fullRuleName,
			children: Object.create(null)
		};
		this.setInitialNodeLocation(cstNode);
		this.CST_STACK.push(cstNode);
	}
	cstFinallyStateUpdate() {
		this.CST_STACK.pop();
	}
	cstPostRuleFull(ruleCstNode) {
		const prevToken = this.LA(0);
		const loc = ruleCstNode.location;
		if (loc.startOffset <= prevToken.startOffset === true) {
			loc.endOffset = prevToken.endOffset;
			loc.endLine = prevToken.endLine;
			loc.endColumn = prevToken.endColumn;
		} else {
			loc.startOffset = NaN;
			loc.startLine = NaN;
			loc.startColumn = NaN;
		}
	}
	cstPostRuleOnlyOffset(ruleCstNode) {
		const prevToken = this.LA(0);
		const loc = ruleCstNode.location;
		if (loc.startOffset <= prevToken.startOffset === true) loc.endOffset = prevToken.endOffset;
		else loc.startOffset = NaN;
	}
	cstPostTerminal(key, consumedToken) {
		const rootCst = this.CST_STACK[this.CST_STACK.length - 1];
		addTerminalToCst(rootCst, consumedToken, key);
		this.setNodeLocationFromToken(rootCst.location, consumedToken);
	}
	cstPostNonTerminal(ruleCstResult, ruleName) {
		const preCstNode = this.CST_STACK[this.CST_STACK.length - 1];
		addNoneTerminalToCst(preCstNode, ruleName, ruleCstResult);
		this.setNodeLocationFromNode(preCstNode.location, ruleCstResult.location);
	}
	getBaseCstVisitorConstructor() {
		if (isUndefined(this.baseCstVisitorConstructor)) {
			const newBaseCstVisitorConstructor = createBaseSemanticVisitorConstructor(this.className, keys(this.gastProductionsCache));
			this.baseCstVisitorConstructor = newBaseCstVisitorConstructor;
			return newBaseCstVisitorConstructor;
		}
		return this.baseCstVisitorConstructor;
	}
	getBaseCstVisitorConstructorWithDefaults() {
		if (isUndefined(this.baseCstVisitorWithDefaultsConstructor)) {
			const newConstructor = createBaseVisitorConstructorWithDefaults(this.className, keys(this.gastProductionsCache), this.getBaseCstVisitorConstructor());
			this.baseCstVisitorWithDefaultsConstructor = newConstructor;
			return newConstructor;
		}
		return this.baseCstVisitorWithDefaultsConstructor;
	}
	getLastExplicitRuleShortName() {
		const ruleStack = this.RULE_STACK;
		return ruleStack[ruleStack.length - 1];
	}
	getPreviousExplicitRuleShortName() {
		const ruleStack = this.RULE_STACK;
		return ruleStack[ruleStack.length - 2];
	}
	getLastExplicitRuleOccurrenceIndex() {
		const occurrenceStack = this.RULE_OCCURRENCE_STACK;
		return occurrenceStack[occurrenceStack.length - 1];
	}
};
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/parser/traits/lexer_adapter.js
/**
* Trait responsible abstracting over the interaction with Lexer output (Token vector).
*
* This could be generalized to support other kinds of lexers, e.g.
* - Just in Time Lexing / Lexer-Less parsing.
* - Streaming Lexer.
*/
var LexerAdapter = class {
	initLexerAdapter() {
		this.tokVector = [];
		this.tokVectorLength = 0;
		this.currIdx = -1;
	}
	set input(newInput) {
		if (this.selfAnalysisDone !== true) throw Error(`Missing <performSelfAnalysis> invocation at the end of the Parser's constructor.`);
		this.reset();
		this.tokVector = newInput;
		this.tokVectorLength = newInput.length;
	}
	get input() {
		return this.tokVector;
	}
	SKIP_TOKEN() {
		if (this.currIdx <= this.tokVector.length - 2) {
			this.consumeToken();
			return this.LA(1);
		} else return END_OF_FILE;
	}
	LA(howMuch) {
		const soughtIdx = this.currIdx + howMuch;
		if (soughtIdx < 0 || this.tokVectorLength <= soughtIdx) return END_OF_FILE;
		else return this.tokVector[soughtIdx];
	}
	consumeToken() {
		this.currIdx++;
	}
	exportLexerState() {
		return this.currIdx;
	}
	importLexerState(newState) {
		this.currIdx = newState;
	}
	resetLexerState() {
		this.currIdx = -1;
	}
	moveToTerminatedState() {
		this.currIdx = this.tokVector.length - 1;
	}
	getLexerPosition() {
		return this.exportLexerState();
	}
};
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/parser/traits/recognizer_api.js
/**
* This trait is responsible for implementing the public API
* for defining Chevrotain parsers, i.e:
* - CONSUME
* - RULE
* - OPTION
* - ...
*/
var RecognizerApi = class {
	ACTION(impl) {
		return impl.call(this);
	}
	consume(idx, tokType, options) {
		return this.consumeInternal(tokType, idx, options);
	}
	subrule(idx, ruleToCall, options) {
		return this.subruleInternal(ruleToCall, idx, options);
	}
	option(idx, actionORMethodDef) {
		return this.optionInternal(actionORMethodDef, idx);
	}
	or(idx, altsOrOpts) {
		return this.orInternal(altsOrOpts, idx);
	}
	many(idx, actionORMethodDef) {
		return this.manyInternal(idx, actionORMethodDef);
	}
	atLeastOne(idx, actionORMethodDef) {
		return this.atLeastOneInternal(idx, actionORMethodDef);
	}
	CONSUME(tokType, options) {
		return this.consumeInternal(tokType, 0, options);
	}
	CONSUME1(tokType, options) {
		return this.consumeInternal(tokType, 1, options);
	}
	CONSUME2(tokType, options) {
		return this.consumeInternal(tokType, 2, options);
	}
	CONSUME3(tokType, options) {
		return this.consumeInternal(tokType, 3, options);
	}
	CONSUME4(tokType, options) {
		return this.consumeInternal(tokType, 4, options);
	}
	CONSUME5(tokType, options) {
		return this.consumeInternal(tokType, 5, options);
	}
	CONSUME6(tokType, options) {
		return this.consumeInternal(tokType, 6, options);
	}
	CONSUME7(tokType, options) {
		return this.consumeInternal(tokType, 7, options);
	}
	CONSUME8(tokType, options) {
		return this.consumeInternal(tokType, 8, options);
	}
	CONSUME9(tokType, options) {
		return this.consumeInternal(tokType, 9, options);
	}
	SUBRULE(ruleToCall, options) {
		return this.subruleInternal(ruleToCall, 0, options);
	}
	SUBRULE1(ruleToCall, options) {
		return this.subruleInternal(ruleToCall, 1, options);
	}
	SUBRULE2(ruleToCall, options) {
		return this.subruleInternal(ruleToCall, 2, options);
	}
	SUBRULE3(ruleToCall, options) {
		return this.subruleInternal(ruleToCall, 3, options);
	}
	SUBRULE4(ruleToCall, options) {
		return this.subruleInternal(ruleToCall, 4, options);
	}
	SUBRULE5(ruleToCall, options) {
		return this.subruleInternal(ruleToCall, 5, options);
	}
	SUBRULE6(ruleToCall, options) {
		return this.subruleInternal(ruleToCall, 6, options);
	}
	SUBRULE7(ruleToCall, options) {
		return this.subruleInternal(ruleToCall, 7, options);
	}
	SUBRULE8(ruleToCall, options) {
		return this.subruleInternal(ruleToCall, 8, options);
	}
	SUBRULE9(ruleToCall, options) {
		return this.subruleInternal(ruleToCall, 9, options);
	}
	OPTION(actionORMethodDef) {
		return this.optionInternal(actionORMethodDef, 0);
	}
	OPTION1(actionORMethodDef) {
		return this.optionInternal(actionORMethodDef, 1);
	}
	OPTION2(actionORMethodDef) {
		return this.optionInternal(actionORMethodDef, 2);
	}
	OPTION3(actionORMethodDef) {
		return this.optionInternal(actionORMethodDef, 3);
	}
	OPTION4(actionORMethodDef) {
		return this.optionInternal(actionORMethodDef, 4);
	}
	OPTION5(actionORMethodDef) {
		return this.optionInternal(actionORMethodDef, 5);
	}
	OPTION6(actionORMethodDef) {
		return this.optionInternal(actionORMethodDef, 6);
	}
	OPTION7(actionORMethodDef) {
		return this.optionInternal(actionORMethodDef, 7);
	}
	OPTION8(actionORMethodDef) {
		return this.optionInternal(actionORMethodDef, 8);
	}
	OPTION9(actionORMethodDef) {
		return this.optionInternal(actionORMethodDef, 9);
	}
	OR(altsOrOpts) {
		return this.orInternal(altsOrOpts, 0);
	}
	OR1(altsOrOpts) {
		return this.orInternal(altsOrOpts, 1);
	}
	OR2(altsOrOpts) {
		return this.orInternal(altsOrOpts, 2);
	}
	OR3(altsOrOpts) {
		return this.orInternal(altsOrOpts, 3);
	}
	OR4(altsOrOpts) {
		return this.orInternal(altsOrOpts, 4);
	}
	OR5(altsOrOpts) {
		return this.orInternal(altsOrOpts, 5);
	}
	OR6(altsOrOpts) {
		return this.orInternal(altsOrOpts, 6);
	}
	OR7(altsOrOpts) {
		return this.orInternal(altsOrOpts, 7);
	}
	OR8(altsOrOpts) {
		return this.orInternal(altsOrOpts, 8);
	}
	OR9(altsOrOpts) {
		return this.orInternal(altsOrOpts, 9);
	}
	MANY(actionORMethodDef) {
		this.manyInternal(0, actionORMethodDef);
	}
	MANY1(actionORMethodDef) {
		this.manyInternal(1, actionORMethodDef);
	}
	MANY2(actionORMethodDef) {
		this.manyInternal(2, actionORMethodDef);
	}
	MANY3(actionORMethodDef) {
		this.manyInternal(3, actionORMethodDef);
	}
	MANY4(actionORMethodDef) {
		this.manyInternal(4, actionORMethodDef);
	}
	MANY5(actionORMethodDef) {
		this.manyInternal(5, actionORMethodDef);
	}
	MANY6(actionORMethodDef) {
		this.manyInternal(6, actionORMethodDef);
	}
	MANY7(actionORMethodDef) {
		this.manyInternal(7, actionORMethodDef);
	}
	MANY8(actionORMethodDef) {
		this.manyInternal(8, actionORMethodDef);
	}
	MANY9(actionORMethodDef) {
		this.manyInternal(9, actionORMethodDef);
	}
	MANY_SEP(options) {
		this.manySepFirstInternal(0, options);
	}
	MANY_SEP1(options) {
		this.manySepFirstInternal(1, options);
	}
	MANY_SEP2(options) {
		this.manySepFirstInternal(2, options);
	}
	MANY_SEP3(options) {
		this.manySepFirstInternal(3, options);
	}
	MANY_SEP4(options) {
		this.manySepFirstInternal(4, options);
	}
	MANY_SEP5(options) {
		this.manySepFirstInternal(5, options);
	}
	MANY_SEP6(options) {
		this.manySepFirstInternal(6, options);
	}
	MANY_SEP7(options) {
		this.manySepFirstInternal(7, options);
	}
	MANY_SEP8(options) {
		this.manySepFirstInternal(8, options);
	}
	MANY_SEP9(options) {
		this.manySepFirstInternal(9, options);
	}
	AT_LEAST_ONE(actionORMethodDef) {
		this.atLeastOneInternal(0, actionORMethodDef);
	}
	AT_LEAST_ONE1(actionORMethodDef) {
		return this.atLeastOneInternal(1, actionORMethodDef);
	}
	AT_LEAST_ONE2(actionORMethodDef) {
		this.atLeastOneInternal(2, actionORMethodDef);
	}
	AT_LEAST_ONE3(actionORMethodDef) {
		this.atLeastOneInternal(3, actionORMethodDef);
	}
	AT_LEAST_ONE4(actionORMethodDef) {
		this.atLeastOneInternal(4, actionORMethodDef);
	}
	AT_LEAST_ONE5(actionORMethodDef) {
		this.atLeastOneInternal(5, actionORMethodDef);
	}
	AT_LEAST_ONE6(actionORMethodDef) {
		this.atLeastOneInternal(6, actionORMethodDef);
	}
	AT_LEAST_ONE7(actionORMethodDef) {
		this.atLeastOneInternal(7, actionORMethodDef);
	}
	AT_LEAST_ONE8(actionORMethodDef) {
		this.atLeastOneInternal(8, actionORMethodDef);
	}
	AT_LEAST_ONE9(actionORMethodDef) {
		this.atLeastOneInternal(9, actionORMethodDef);
	}
	AT_LEAST_ONE_SEP(options) {
		this.atLeastOneSepFirstInternal(0, options);
	}
	AT_LEAST_ONE_SEP1(options) {
		this.atLeastOneSepFirstInternal(1, options);
	}
	AT_LEAST_ONE_SEP2(options) {
		this.atLeastOneSepFirstInternal(2, options);
	}
	AT_LEAST_ONE_SEP3(options) {
		this.atLeastOneSepFirstInternal(3, options);
	}
	AT_LEAST_ONE_SEP4(options) {
		this.atLeastOneSepFirstInternal(4, options);
	}
	AT_LEAST_ONE_SEP5(options) {
		this.atLeastOneSepFirstInternal(5, options);
	}
	AT_LEAST_ONE_SEP6(options) {
		this.atLeastOneSepFirstInternal(6, options);
	}
	AT_LEAST_ONE_SEP7(options) {
		this.atLeastOneSepFirstInternal(7, options);
	}
	AT_LEAST_ONE_SEP8(options) {
		this.atLeastOneSepFirstInternal(8, options);
	}
	AT_LEAST_ONE_SEP9(options) {
		this.atLeastOneSepFirstInternal(9, options);
	}
	RULE(name, implementation, config = DEFAULT_RULE_CONFIG) {
		if (includes(this.definedRulesNames, name)) {
			const error = {
				message: defaultGrammarValidatorErrorProvider.buildDuplicateRuleNameError({
					topLevelRule: name,
					grammarName: this.className
				}),
				type: ParserDefinitionErrorType.DUPLICATE_RULE_NAME,
				ruleName: name
			};
			this.definitionErrors.push(error);
		}
		this.definedRulesNames.push(name);
		const ruleImplementation = this.defineRule(name, implementation, config);
		this[name] = ruleImplementation;
		return ruleImplementation;
	}
	OVERRIDE_RULE(name, impl, config = DEFAULT_RULE_CONFIG) {
		const ruleErrors = validateRuleIsOverridden(name, this.definedRulesNames, this.className);
		this.definitionErrors = this.definitionErrors.concat(ruleErrors);
		const ruleImplementation = this.defineRule(name, impl, config);
		this[name] = ruleImplementation;
		return ruleImplementation;
	}
	BACKTRACK(grammarRule, args) {
		return function() {
			this.isBackTrackingStack.push(1);
			const orgState = this.saveRecogState();
			try {
				grammarRule.apply(this, args);
				return true;
			} catch (e) {
				if (isRecognitionException(e)) return false;
				else throw e;
			} finally {
				this.reloadRecogState(orgState);
				this.isBackTrackingStack.pop();
			}
		};
	}
	getGAstProductions() {
		return this.gastProductionsCache;
	}
	getSerializedGastProductions() {
		return serializeGrammar(values(this.gastProductionsCache));
	}
};
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/parser/traits/recognizer_engine.js
/**
* This trait is responsible for the runtime parsing engine
* Used by the official API (recognizer_api.ts)
*/
var RecognizerEngine = class {
	initRecognizerEngine(tokenVocabulary, config) {
		this.className = this.constructor.name;
		this.shortRuleNameToFull = {};
		this.fullRuleNameToShort = {};
		this.ruleShortNameIdx = 256;
		this.tokenMatcher = tokenStructuredMatcherNoCategories;
		this.subruleIdx = 0;
		this.definedRulesNames = [];
		this.tokensMap = {};
		this.isBackTrackingStack = [];
		this.RULE_STACK = [];
		this.RULE_OCCURRENCE_STACK = [];
		this.gastProductionsCache = {};
		if (has(config, "serializedGrammar")) throw Error("The Parser's configuration can no longer contain a <serializedGrammar> property.\n	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_6-0-0\n	For Further details.");
		if (isArray(tokenVocabulary)) {
			if (isEmpty(tokenVocabulary)) throw Error("A Token Vocabulary cannot be empty.\n	Note that the first argument for the parser constructor\n	is no longer a Token vector (since v4.0).");
			if (typeof tokenVocabulary[0].startOffset === "number") throw Error("The Parser constructor no longer accepts a token vector as the first argument.\n	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_4-0-0\n	For Further details.");
		}
		if (isArray(tokenVocabulary)) this.tokensMap = reduce(tokenVocabulary, (acc, tokType) => {
			acc[tokType.name] = tokType;
			return acc;
		}, {});
		else if (has(tokenVocabulary, "modes") && every(flatten(values(tokenVocabulary.modes)), isTokenType)) {
			const uniqueTokens = uniq(flatten(values(tokenVocabulary.modes)));
			this.tokensMap = reduce(uniqueTokens, (acc, tokType) => {
				acc[tokType.name] = tokType;
				return acc;
			}, {});
		} else if (isObject(tokenVocabulary)) this.tokensMap = clone(tokenVocabulary);
		else throw new Error("<tokensDictionary> argument must be An Array of Token constructors, A dictionary of Token constructors or an IMultiModeLexerDefinition");
		this.tokensMap["EOF"] = EOF;
		const noTokenCategoriesUsed = every(has(tokenVocabulary, "modes") ? flatten(values(tokenVocabulary.modes)) : values(tokenVocabulary), (tokenConstructor) => isEmpty(tokenConstructor.categoryMatches));
		this.tokenMatcher = noTokenCategoriesUsed ? tokenStructuredMatcherNoCategories : tokenStructuredMatcher;
		augmentTokenTypes(values(this.tokensMap));
	}
	defineRule(ruleName, impl, config) {
		if (this.selfAnalysisDone) throw Error(`Grammar rule <${ruleName}> may not be defined after the 'performSelfAnalysis' method has been called'\nMake sure that all grammar rule definitions are done before 'performSelfAnalysis' is called.`);
		const resyncEnabled = has(config, "resyncEnabled") ? config.resyncEnabled : DEFAULT_RULE_CONFIG.resyncEnabled;
		const recoveryValueFunc = has(config, "recoveryValueFunc") ? config.recoveryValueFunc : DEFAULT_RULE_CONFIG.recoveryValueFunc;
		const shortName = this.ruleShortNameIdx << 12;
		this.ruleShortNameIdx++;
		this.shortRuleNameToFull[shortName] = ruleName;
		this.fullRuleNameToShort[ruleName] = shortName;
		let invokeRuleWithTry;
		if (this.outputCst === true) invokeRuleWithTry = function invokeRuleWithTry(...args) {
			try {
				this.ruleInvocationStateUpdate(shortName, ruleName, this.subruleIdx);
				impl.apply(this, args);
				const cst = this.CST_STACK[this.CST_STACK.length - 1];
				this.cstPostRule(cst);
				return cst;
			} catch (e) {
				return this.invokeRuleCatch(e, resyncEnabled, recoveryValueFunc);
			} finally {
				this.ruleFinallyStateUpdate();
			}
		};
		else invokeRuleWithTry = function invokeRuleWithTryCst(...args) {
			try {
				this.ruleInvocationStateUpdate(shortName, ruleName, this.subruleIdx);
				return impl.apply(this, args);
			} catch (e) {
				return this.invokeRuleCatch(e, resyncEnabled, recoveryValueFunc);
			} finally {
				this.ruleFinallyStateUpdate();
			}
		};
		return Object.assign(invokeRuleWithTry, {
			ruleName,
			originalGrammarAction: impl
		});
	}
	invokeRuleCatch(e, resyncEnabledConfig, recoveryValueFunc) {
		const isFirstInvokedRule = this.RULE_STACK.length === 1;
		const reSyncEnabled = resyncEnabledConfig && !this.isBackTracking() && this.recoveryEnabled;
		if (isRecognitionException(e)) {
			const recogError = e;
			if (reSyncEnabled) {
				const reSyncTokType = this.findReSyncTokenType();
				if (this.isInCurrentRuleReSyncSet(reSyncTokType)) {
					recogError.resyncedTokens = this.reSyncTo(reSyncTokType);
					if (this.outputCst) {
						const partialCstResult = this.CST_STACK[this.CST_STACK.length - 1];
						partialCstResult.recoveredNode = true;
						return partialCstResult;
					} else return recoveryValueFunc(e);
				} else {
					if (this.outputCst) {
						const partialCstResult = this.CST_STACK[this.CST_STACK.length - 1];
						partialCstResult.recoveredNode = true;
						recogError.partialCstResult = partialCstResult;
					}
					throw recogError;
				}
			} else if (isFirstInvokedRule) {
				this.moveToTerminatedState();
				return recoveryValueFunc(e);
			} else throw recogError;
		} else throw e;
	}
	optionInternal(actionORMethodDef, occurrence) {
		const key = this.getKeyForAutomaticLookahead(512, occurrence);
		return this.optionInternalLogic(actionORMethodDef, occurrence, key);
	}
	optionInternalLogic(actionORMethodDef, occurrence, key) {
		let lookAheadFunc = this.getLaFuncFromCache(key);
		let action;
		if (typeof actionORMethodDef !== "function") {
			action = actionORMethodDef.DEF;
			const predicate = actionORMethodDef.GATE;
			if (predicate !== void 0) {
				const orgLookaheadFunction = lookAheadFunc;
				lookAheadFunc = () => {
					return predicate.call(this) && orgLookaheadFunction.call(this);
				};
			}
		} else action = actionORMethodDef;
		if (lookAheadFunc.call(this) === true) return action.call(this);
	}
	atLeastOneInternal(prodOccurrence, actionORMethodDef) {
		const laKey = this.getKeyForAutomaticLookahead(AT_LEAST_ONE_IDX, prodOccurrence);
		return this.atLeastOneInternalLogic(prodOccurrence, actionORMethodDef, laKey);
	}
	atLeastOneInternalLogic(prodOccurrence, actionORMethodDef, key) {
		let lookAheadFunc = this.getLaFuncFromCache(key);
		let action;
		if (typeof actionORMethodDef !== "function") {
			action = actionORMethodDef.DEF;
			const predicate = actionORMethodDef.GATE;
			if (predicate !== void 0) {
				const orgLookaheadFunction = lookAheadFunc;
				lookAheadFunc = () => {
					return predicate.call(this) && orgLookaheadFunction.call(this);
				};
			}
		} else action = actionORMethodDef;
		if (lookAheadFunc.call(this) === true) {
			let notStuck = this.doSingleRepetition(action);
			while (lookAheadFunc.call(this) === true && notStuck === true) notStuck = this.doSingleRepetition(action);
		} else throw this.raiseEarlyExitException(prodOccurrence, PROD_TYPE.REPETITION_MANDATORY, actionORMethodDef.ERR_MSG);
		this.attemptInRepetitionRecovery(this.atLeastOneInternal, [prodOccurrence, actionORMethodDef], lookAheadFunc, AT_LEAST_ONE_IDX, prodOccurrence, NextTerminalAfterAtLeastOneWalker);
	}
	atLeastOneSepFirstInternal(prodOccurrence, options) {
		const laKey = this.getKeyForAutomaticLookahead(AT_LEAST_ONE_SEP_IDX, prodOccurrence);
		this.atLeastOneSepFirstInternalLogic(prodOccurrence, options, laKey);
	}
	atLeastOneSepFirstInternalLogic(prodOccurrence, options, key) {
		const action = options.DEF;
		const separator = options.SEP;
		if (this.getLaFuncFromCache(key).call(this) === true) {
			action.call(this);
			const separatorLookAheadFunc = () => {
				return this.tokenMatcher(this.LA(1), separator);
			};
			while (this.tokenMatcher(this.LA(1), separator) === true) {
				this.CONSUME(separator);
				action.call(this);
			}
			this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
				prodOccurrence,
				separator,
				separatorLookAheadFunc,
				action,
				NextTerminalAfterAtLeastOneSepWalker
			], separatorLookAheadFunc, AT_LEAST_ONE_SEP_IDX, prodOccurrence, NextTerminalAfterAtLeastOneSepWalker);
		} else throw this.raiseEarlyExitException(prodOccurrence, PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR, options.ERR_MSG);
	}
	manyInternal(prodOccurrence, actionORMethodDef) {
		const laKey = this.getKeyForAutomaticLookahead(768, prodOccurrence);
		return this.manyInternalLogic(prodOccurrence, actionORMethodDef, laKey);
	}
	manyInternalLogic(prodOccurrence, actionORMethodDef, key) {
		let lookaheadFunction = this.getLaFuncFromCache(key);
		let action;
		if (typeof actionORMethodDef !== "function") {
			action = actionORMethodDef.DEF;
			const predicate = actionORMethodDef.GATE;
			if (predicate !== void 0) {
				const orgLookaheadFunction = lookaheadFunction;
				lookaheadFunction = () => {
					return predicate.call(this) && orgLookaheadFunction.call(this);
				};
			}
		} else action = actionORMethodDef;
		let notStuck = true;
		while (lookaheadFunction.call(this) === true && notStuck === true) notStuck = this.doSingleRepetition(action);
		this.attemptInRepetitionRecovery(this.manyInternal, [prodOccurrence, actionORMethodDef], lookaheadFunction, 768, prodOccurrence, NextTerminalAfterManyWalker, notStuck);
	}
	manySepFirstInternal(prodOccurrence, options) {
		const laKey = this.getKeyForAutomaticLookahead(MANY_SEP_IDX, prodOccurrence);
		this.manySepFirstInternalLogic(prodOccurrence, options, laKey);
	}
	manySepFirstInternalLogic(prodOccurrence, options, key) {
		const action = options.DEF;
		const separator = options.SEP;
		if (this.getLaFuncFromCache(key).call(this) === true) {
			action.call(this);
			const separatorLookAheadFunc = () => {
				return this.tokenMatcher(this.LA(1), separator);
			};
			while (this.tokenMatcher(this.LA(1), separator) === true) {
				this.CONSUME(separator);
				action.call(this);
			}
			this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
				prodOccurrence,
				separator,
				separatorLookAheadFunc,
				action,
				NextTerminalAfterManySepWalker
			], separatorLookAheadFunc, MANY_SEP_IDX, prodOccurrence, NextTerminalAfterManySepWalker);
		}
	}
	repetitionSepSecondInternal(prodOccurrence, separator, separatorLookAheadFunc, action, nextTerminalAfterWalker) {
		while (separatorLookAheadFunc()) {
			this.CONSUME(separator);
			action.call(this);
		}
		/* istanbul ignore else */
		this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
			prodOccurrence,
			separator,
			separatorLookAheadFunc,
			action,
			nextTerminalAfterWalker
		], separatorLookAheadFunc, AT_LEAST_ONE_SEP_IDX, prodOccurrence, nextTerminalAfterWalker);
	}
	doSingleRepetition(action) {
		const beforeIteration = this.getLexerPosition();
		action.call(this);
		return this.getLexerPosition() > beforeIteration;
	}
	orInternal(altsOrOpts, occurrence) {
		const laKey = this.getKeyForAutomaticLookahead(256, occurrence);
		const alts = isArray(altsOrOpts) ? altsOrOpts : altsOrOpts.DEF;
		const altIdxToTake = this.getLaFuncFromCache(laKey).call(this, alts);
		if (altIdxToTake !== void 0) return alts[altIdxToTake].ALT.call(this);
		this.raiseNoAltException(occurrence, altsOrOpts.ERR_MSG);
	}
	ruleFinallyStateUpdate() {
		this.RULE_STACK.pop();
		this.RULE_OCCURRENCE_STACK.pop();
		this.cstFinallyStateUpdate();
		if (this.RULE_STACK.length === 0 && this.isAtEndOfInput() === false) {
			const firstRedundantTok = this.LA(1);
			const errMsg = this.errorMessageProvider.buildNotAllInputParsedMessage({
				firstRedundant: firstRedundantTok,
				ruleName: this.getCurrRuleFullName()
			});
			this.SAVE_ERROR(new NotAllInputParsedException(errMsg, firstRedundantTok));
		}
	}
	subruleInternal(ruleToCall, idx, options) {
		let ruleResult;
		try {
			const args = options !== void 0 ? options.ARGS : void 0;
			this.subruleIdx = idx;
			ruleResult = ruleToCall.apply(this, args);
			this.cstPostNonTerminal(ruleResult, options !== void 0 && options.LABEL !== void 0 ? options.LABEL : ruleToCall.ruleName);
			return ruleResult;
		} catch (e) {
			throw this.subruleInternalError(e, options, ruleToCall.ruleName);
		}
	}
	subruleInternalError(e, options, ruleName) {
		if (isRecognitionException(e) && e.partialCstResult !== void 0) {
			this.cstPostNonTerminal(e.partialCstResult, options !== void 0 && options.LABEL !== void 0 ? options.LABEL : ruleName);
			delete e.partialCstResult;
		}
		throw e;
	}
	consumeInternal(tokType, idx, options) {
		let consumedToken;
		try {
			const nextToken = this.LA(1);
			if (this.tokenMatcher(nextToken, tokType) === true) {
				this.consumeToken();
				consumedToken = nextToken;
			} else this.consumeInternalError(tokType, nextToken, options);
		} catch (eFromConsumption) {
			consumedToken = this.consumeInternalRecovery(tokType, idx, eFromConsumption);
		}
		this.cstPostTerminal(options !== void 0 && options.LABEL !== void 0 ? options.LABEL : tokType.name, consumedToken);
		return consumedToken;
	}
	consumeInternalError(tokType, nextToken, options) {
		let msg;
		const previousToken = this.LA(0);
		if (options !== void 0 && options.ERR_MSG) msg = options.ERR_MSG;
		else msg = this.errorMessageProvider.buildMismatchTokenMessage({
			expected: tokType,
			actual: nextToken,
			previous: previousToken,
			ruleName: this.getCurrRuleFullName()
		});
		throw this.SAVE_ERROR(new MismatchedTokenException(msg, nextToken, previousToken));
	}
	consumeInternalRecovery(tokType, idx, eFromConsumption) {
		if (this.recoveryEnabled && eFromConsumption.name === "MismatchedTokenException" && !this.isBackTracking()) {
			const follows = this.getFollowsForInRuleRecovery(tokType, idx);
			try {
				return this.tryInRuleRecovery(tokType, follows);
			} catch (eFromInRuleRecovery) {
				if (eFromInRuleRecovery.name === "InRuleRecoveryException") throw eFromConsumption;
				else throw eFromInRuleRecovery;
			}
		} else throw eFromConsumption;
	}
	saveRecogState() {
		const savedErrors = this.errors;
		const savedRuleStack = clone(this.RULE_STACK);
		return {
			errors: savedErrors,
			lexerState: this.exportLexerState(),
			RULE_STACK: savedRuleStack,
			CST_STACK: this.CST_STACK
		};
	}
	reloadRecogState(newState) {
		this.errors = newState.errors;
		this.importLexerState(newState.lexerState);
		this.RULE_STACK = newState.RULE_STACK;
	}
	ruleInvocationStateUpdate(shortName, fullName, idxInCallingRule) {
		this.RULE_OCCURRENCE_STACK.push(idxInCallingRule);
		this.RULE_STACK.push(shortName);
		this.cstInvocationStateUpdate(fullName);
	}
	isBackTracking() {
		return this.isBackTrackingStack.length !== 0;
	}
	getCurrRuleFullName() {
		const shortName = this.getLastExplicitRuleShortName();
		return this.shortRuleNameToFull[shortName];
	}
	shortRuleNameToFullName(shortName) {
		return this.shortRuleNameToFull[shortName];
	}
	isAtEndOfInput() {
		return this.tokenMatcher(this.LA(1), EOF);
	}
	reset() {
		this.resetLexerState();
		this.subruleIdx = 0;
		this.isBackTrackingStack = [];
		this.errors = [];
		this.RULE_STACK = [];
		this.CST_STACK = [];
		this.RULE_OCCURRENCE_STACK = [];
	}
};
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/parser/traits/error_handler.js
/**
* Trait responsible for runtime parsing errors.
*/
var ErrorHandler = class {
	initErrorHandler(config) {
		this._errors = [];
		this.errorMessageProvider = has(config, "errorMessageProvider") ? config.errorMessageProvider : DEFAULT_PARSER_CONFIG.errorMessageProvider;
	}
	SAVE_ERROR(error) {
		if (isRecognitionException(error)) {
			error.context = {
				ruleStack: this.getHumanReadableRuleStack(),
				ruleOccurrenceStack: clone(this.RULE_OCCURRENCE_STACK)
			};
			this._errors.push(error);
			return error;
		} else throw Error("Trying to save an Error which is not a RecognitionException");
	}
	get errors() {
		return clone(this._errors);
	}
	set errors(newErrors) {
		this._errors = newErrors;
	}
	raiseEarlyExitException(occurrence, prodType, userDefinedErrMsg) {
		const ruleName = this.getCurrRuleFullName();
		const ruleGrammar = this.getGAstProductions()[ruleName];
		const insideProdPaths = getLookaheadPathsForOptionalProd(occurrence, ruleGrammar, prodType, this.maxLookahead)[0];
		const actualTokens = [];
		for (let i = 1; i <= this.maxLookahead; i++) actualTokens.push(this.LA(i));
		const msg = this.errorMessageProvider.buildEarlyExitMessage({
			expectedIterationPaths: insideProdPaths,
			actual: actualTokens,
			previous: this.LA(0),
			customUserDescription: userDefinedErrMsg,
			ruleName
		});
		throw this.SAVE_ERROR(new EarlyExitException(msg, this.LA(1), this.LA(0)));
	}
	raiseNoAltException(occurrence, errMsgTypes) {
		const ruleName = this.getCurrRuleFullName();
		const ruleGrammar = this.getGAstProductions()[ruleName];
		const lookAheadPathsPerAlternative = getLookaheadPathsForOr(occurrence, ruleGrammar, this.maxLookahead);
		const actualTokens = [];
		for (let i = 1; i <= this.maxLookahead; i++) actualTokens.push(this.LA(i));
		const previousToken = this.LA(0);
		const errMsg = this.errorMessageProvider.buildNoViableAltMessage({
			expectedPathsPerAlt: lookAheadPathsPerAlternative,
			actual: actualTokens,
			previous: previousToken,
			customUserDescription: errMsgTypes,
			ruleName: this.getCurrRuleFullName()
		});
		throw this.SAVE_ERROR(new NoViableAltException(errMsg, this.LA(1), previousToken));
	}
};
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/parser/traits/context_assist.js
var ContentAssist = class {
	initContentAssist() {}
	computeContentAssist(startRuleName, precedingInput) {
		const startRuleGast = this.gastProductionsCache[startRuleName];
		if (isUndefined(startRuleGast)) throw Error(`Rule ->${startRuleName}<- does not exist in this grammar.`);
		return nextPossibleTokensAfter([startRuleGast], precedingInput, this.tokenMatcher, this.maxLookahead);
	}
	getNextPossibleTokenTypes(grammarPath) {
		const topRuleName = head(grammarPath.ruleStack);
		const topProduction = this.getGAstProductions()[topRuleName];
		return new NextAfterTokenWalker(topProduction, grammarPath).startWalking();
	}
};
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/parser/traits/gast_recorder.js
var RECORDING_NULL_OBJECT = { description: "This Object indicates the Parser is during Recording Phase" };
Object.freeze(RECORDING_NULL_OBJECT);
var HANDLE_SEPARATOR = true;
var MAX_METHOD_IDX = Math.pow(2, 8) - 1;
var RFT = createToken({
	name: "RECORDING_PHASE_TOKEN",
	pattern: Lexer.NA
});
augmentTokenTypes([RFT]);
var RECORDING_PHASE_TOKEN = createTokenInstance(RFT, "This IToken indicates the Parser is in Recording Phase\n	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details", -1, -1, -1, -1, -1, -1);
Object.freeze(RECORDING_PHASE_TOKEN);
var RECORDING_PHASE_CSTNODE = {
	name: "This CSTNode indicates the Parser is in Recording Phase\n	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details",
	children: {}
};
/**
* This trait handles the creation of the GAST structure for Chevrotain Grammars
*/
var GastRecorder = class {
	initGastRecorder(config) {
		this.recordingProdStack = [];
		this.RECORDING_PHASE = false;
	}
	enableRecording() {
		this.RECORDING_PHASE = true;
		this.TRACE_INIT("Enable Recording", () => {
			/**
			* Warning Dark Voodoo Magic upcoming!
			* We are "replacing" the public parsing DSL methods API
			* With **new** alternative implementations on the Parser **instance**
			*
			* So far this is the only way I've found to avoid performance regressions during parsing time.
			* - Approx 30% performance regression was measured on Chrome 75 Canary when attempting to replace the "internal"
			*   implementations directly instead.
			*/
			for (let i = 0; i < 10; i++) {
				const idx = i > 0 ? i : "";
				this[`CONSUME${idx}`] = function(arg1, arg2) {
					return this.consumeInternalRecord(arg1, i, arg2);
				};
				this[`SUBRULE${idx}`] = function(arg1, arg2) {
					return this.subruleInternalRecord(arg1, i, arg2);
				};
				this[`OPTION${idx}`] = function(arg1) {
					return this.optionInternalRecord(arg1, i);
				};
				this[`OR${idx}`] = function(arg1) {
					return this.orInternalRecord(arg1, i);
				};
				this[`MANY${idx}`] = function(arg1) {
					this.manyInternalRecord(i, arg1);
				};
				this[`MANY_SEP${idx}`] = function(arg1) {
					this.manySepFirstInternalRecord(i, arg1);
				};
				this[`AT_LEAST_ONE${idx}`] = function(arg1) {
					this.atLeastOneInternalRecord(i, arg1);
				};
				this[`AT_LEAST_ONE_SEP${idx}`] = function(arg1) {
					this.atLeastOneSepFirstInternalRecord(i, arg1);
				};
			}
			this[`consume`] = function(idx, arg1, arg2) {
				return this.consumeInternalRecord(arg1, idx, arg2);
			};
			this[`subrule`] = function(idx, arg1, arg2) {
				return this.subruleInternalRecord(arg1, idx, arg2);
			};
			this[`option`] = function(idx, arg1) {
				return this.optionInternalRecord(arg1, idx);
			};
			this[`or`] = function(idx, arg1) {
				return this.orInternalRecord(arg1, idx);
			};
			this[`many`] = function(idx, arg1) {
				this.manyInternalRecord(idx, arg1);
			};
			this[`atLeastOne`] = function(idx, arg1) {
				this.atLeastOneInternalRecord(idx, arg1);
			};
			this.ACTION = this.ACTION_RECORD;
			this.BACKTRACK = this.BACKTRACK_RECORD;
			this.LA = this.LA_RECORD;
		});
	}
	disableRecording() {
		this.RECORDING_PHASE = false;
		this.TRACE_INIT("Deleting Recording methods", () => {
			const that = this;
			for (let i = 0; i < 10; i++) {
				const idx = i > 0 ? i : "";
				delete that[`CONSUME${idx}`];
				delete that[`SUBRULE${idx}`];
				delete that[`OPTION${idx}`];
				delete that[`OR${idx}`];
				delete that[`MANY${idx}`];
				delete that[`MANY_SEP${idx}`];
				delete that[`AT_LEAST_ONE${idx}`];
				delete that[`AT_LEAST_ONE_SEP${idx}`];
			}
			delete that[`consume`];
			delete that[`subrule`];
			delete that[`option`];
			delete that[`or`];
			delete that[`many`];
			delete that[`atLeastOne`];
			delete that.ACTION;
			delete that.BACKTRACK;
			delete that.LA;
		});
	}
	ACTION_RECORD(impl) {}
	BACKTRACK_RECORD(grammarRule, args) {
		return () => true;
	}
	LA_RECORD(howMuch) {
		return END_OF_FILE;
	}
	topLevelRuleRecord(name, def) {
		try {
			const newTopLevelRule = new Rule({
				definition: [],
				name
			});
			newTopLevelRule.name = name;
			this.recordingProdStack.push(newTopLevelRule);
			def.call(this);
			this.recordingProdStack.pop();
			return newTopLevelRule;
		} catch (originalError) {
			if (originalError.KNOWN_RECORDER_ERROR !== true) try {
				originalError.message = originalError.message + "\n	 This error was thrown during the \"grammar recording phase\" For more info see:\n	https://chevrotain.io/docs/guide/internals.html#grammar-recording";
			} catch (mutabilityError) {
				throw originalError;
			}
			throw originalError;
		}
	}
	optionInternalRecord(actionORMethodDef, occurrence) {
		return recordProd.call(this, Option$1, actionORMethodDef, occurrence);
	}
	atLeastOneInternalRecord(occurrence, actionORMethodDef) {
		recordProd.call(this, RepetitionMandatory, actionORMethodDef, occurrence);
	}
	atLeastOneSepFirstInternalRecord(occurrence, options) {
		recordProd.call(this, RepetitionMandatoryWithSeparator, options, occurrence, HANDLE_SEPARATOR);
	}
	manyInternalRecord(occurrence, actionORMethodDef) {
		recordProd.call(this, Repetition, actionORMethodDef, occurrence);
	}
	manySepFirstInternalRecord(occurrence, options) {
		recordProd.call(this, RepetitionWithSeparator, options, occurrence, HANDLE_SEPARATOR);
	}
	orInternalRecord(altsOrOpts, occurrence) {
		return recordOrProd.call(this, altsOrOpts, occurrence);
	}
	subruleInternalRecord(ruleToCall, occurrence, options) {
		assertMethodIdxIsValid(occurrence);
		if (!ruleToCall || has(ruleToCall, "ruleName") === false) {
			const error = /* @__PURE__ */ new Error(`<SUBRULE${getIdxSuffix(occurrence)}> argument is invalid expecting a Parser method reference but got: <${JSON.stringify(ruleToCall)}>\n inside top level rule: <${this.recordingProdStack[0].name}>`);
			error.KNOWN_RECORDER_ERROR = true;
			throw error;
		}
		const prevProd = last(this.recordingProdStack);
		const ruleName = ruleToCall.ruleName;
		const newNoneTerminal = new NonTerminal({
			idx: occurrence,
			nonTerminalName: ruleName,
			label: options === null || options === void 0 ? void 0 : options.LABEL,
			referencedRule: void 0
		});
		prevProd.definition.push(newNoneTerminal);
		return this.outputCst ? RECORDING_PHASE_CSTNODE : RECORDING_NULL_OBJECT;
	}
	consumeInternalRecord(tokType, occurrence, options) {
		assertMethodIdxIsValid(occurrence);
		if (!hasShortKeyProperty(tokType)) {
			const error = /* @__PURE__ */ new Error(`<CONSUME${getIdxSuffix(occurrence)}> argument is invalid expecting a TokenType reference but got: <${JSON.stringify(tokType)}>\n inside top level rule: <${this.recordingProdStack[0].name}>`);
			error.KNOWN_RECORDER_ERROR = true;
			throw error;
		}
		const prevProd = last(this.recordingProdStack);
		const newNoneTerminal = new Terminal({
			idx: occurrence,
			terminalType: tokType,
			label: options === null || options === void 0 ? void 0 : options.LABEL
		});
		prevProd.definition.push(newNoneTerminal);
		return RECORDING_PHASE_TOKEN;
	}
};
function recordProd(prodConstructor, mainProdArg, occurrence, handleSep = false) {
	assertMethodIdxIsValid(occurrence);
	const prevProd = last(this.recordingProdStack);
	const grammarAction = isFunction(mainProdArg) ? mainProdArg : mainProdArg.DEF;
	const newProd = new prodConstructor({
		definition: [],
		idx: occurrence
	});
	if (handleSep) newProd.separator = mainProdArg.SEP;
	if (has(mainProdArg, "MAX_LOOKAHEAD")) newProd.maxLookahead = mainProdArg.MAX_LOOKAHEAD;
	this.recordingProdStack.push(newProd);
	grammarAction.call(this);
	prevProd.definition.push(newProd);
	this.recordingProdStack.pop();
	return RECORDING_NULL_OBJECT;
}
function recordOrProd(mainProdArg, occurrence) {
	assertMethodIdxIsValid(occurrence);
	const prevProd = last(this.recordingProdStack);
	const hasOptions = isArray(mainProdArg) === false;
	const alts = hasOptions === false ? mainProdArg : mainProdArg.DEF;
	const newOrProd = new Alternation({
		definition: [],
		idx: occurrence,
		ignoreAmbiguities: hasOptions && mainProdArg.IGNORE_AMBIGUITIES === true
	});
	if (has(mainProdArg, "MAX_LOOKAHEAD")) newOrProd.maxLookahead = mainProdArg.MAX_LOOKAHEAD;
	newOrProd.hasPredicates = some(alts, (currAlt) => isFunction(currAlt.GATE));
	prevProd.definition.push(newOrProd);
	forEach(alts, (currAlt) => {
		const currAltFlat = new Alternative({ definition: [] });
		newOrProd.definition.push(currAltFlat);
		if (has(currAlt, "IGNORE_AMBIGUITIES")) currAltFlat.ignoreAmbiguities = currAlt.IGNORE_AMBIGUITIES;
		else if (has(currAlt, "GATE")) currAltFlat.ignoreAmbiguities = true;
		this.recordingProdStack.push(currAltFlat);
		currAlt.ALT.call(this);
		this.recordingProdStack.pop();
	});
	return RECORDING_NULL_OBJECT;
}
function getIdxSuffix(idx) {
	return idx === 0 ? "" : `${idx}`;
}
function assertMethodIdxIsValid(idx) {
	if (idx < 0 || idx > MAX_METHOD_IDX) {
		const error = /* @__PURE__ */ new Error(`Invalid DSL Method idx value: <${idx}>\n\tIdx value must be a none negative value smaller than ${MAX_METHOD_IDX + 1}`);
		error.KNOWN_RECORDER_ERROR = true;
		throw error;
	}
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/parser/traits/perf_tracer.js
/**
* Trait responsible for runtime parsing errors.
*/
var PerformanceTracer = class {
	initPerformanceTracer(config) {
		if (has(config, "traceInitPerf")) {
			const userTraceInitPerf = config.traceInitPerf;
			const traceIsNumber = typeof userTraceInitPerf === "number";
			this.traceInitMaxIdent = traceIsNumber ? userTraceInitPerf : Infinity;
			this.traceInitPerf = traceIsNumber ? userTraceInitPerf > 0 : userTraceInitPerf;
		} else {
			this.traceInitMaxIdent = 0;
			this.traceInitPerf = DEFAULT_PARSER_CONFIG.traceInitPerf;
		}
		this.traceInitIndent = -1;
	}
	TRACE_INIT(phaseDesc, phaseImpl) {
		if (this.traceInitPerf === true) {
			this.traceInitIndent++;
			const indent = new Array(this.traceInitIndent + 1).join("	");
			if (this.traceInitIndent < this.traceInitMaxIdent) console.log(`${indent}--> <${phaseDesc}>`);
			const { time, value } = timer(phaseImpl);
			/* istanbul ignore next - Difficult to reproduce specific performance behavior (>10ms) in tests */
			const traceMethod = time > 10 ? console.warn : console.log;
			if (this.traceInitIndent < this.traceInitMaxIdent) traceMethod(`${indent}<-- <${phaseDesc}> time: ${time}ms`);
			this.traceInitIndent--;
			return value;
		} else return phaseImpl();
	}
};
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/parser/utils/apply_mixins.js
function applyMixins(derivedCtor, baseCtors) {
	baseCtors.forEach((baseCtor) => {
		const baseProto = baseCtor.prototype;
		Object.getOwnPropertyNames(baseProto).forEach((propName) => {
			if (propName === "constructor") return;
			const basePropDescriptor = Object.getOwnPropertyDescriptor(baseProto, propName);
			if (basePropDescriptor && (basePropDescriptor.get || basePropDescriptor.set)) Object.defineProperty(derivedCtor.prototype, propName, basePropDescriptor);
			else derivedCtor.prototype[propName] = baseCtor.prototype[propName];
		});
	});
}
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/parse/parser/parser.js
var END_OF_FILE = createTokenInstance(EOF, "", NaN, NaN, NaN, NaN, NaN, NaN);
Object.freeze(END_OF_FILE);
var DEFAULT_PARSER_CONFIG = Object.freeze({
	recoveryEnabled: false,
	maxLookahead: 3,
	dynamicTokensEnabled: false,
	outputCst: true,
	errorMessageProvider: defaultParserErrorProvider,
	nodeLocationTracking: "none",
	traceInitPerf: false,
	skipValidations: false
});
var DEFAULT_RULE_CONFIG = Object.freeze({
	recoveryValueFunc: () => void 0,
	resyncEnabled: true
});
var ParserDefinitionErrorType;
(function(ParserDefinitionErrorType) {
	ParserDefinitionErrorType[ParserDefinitionErrorType["INVALID_RULE_NAME"] = 0] = "INVALID_RULE_NAME";
	ParserDefinitionErrorType[ParserDefinitionErrorType["DUPLICATE_RULE_NAME"] = 1] = "DUPLICATE_RULE_NAME";
	ParserDefinitionErrorType[ParserDefinitionErrorType["INVALID_RULE_OVERRIDE"] = 2] = "INVALID_RULE_OVERRIDE";
	ParserDefinitionErrorType[ParserDefinitionErrorType["DUPLICATE_PRODUCTIONS"] = 3] = "DUPLICATE_PRODUCTIONS";
	ParserDefinitionErrorType[ParserDefinitionErrorType["UNRESOLVED_SUBRULE_REF"] = 4] = "UNRESOLVED_SUBRULE_REF";
	ParserDefinitionErrorType[ParserDefinitionErrorType["LEFT_RECURSION"] = 5] = "LEFT_RECURSION";
	ParserDefinitionErrorType[ParserDefinitionErrorType["NONE_LAST_EMPTY_ALT"] = 6] = "NONE_LAST_EMPTY_ALT";
	ParserDefinitionErrorType[ParserDefinitionErrorType["AMBIGUOUS_ALTS"] = 7] = "AMBIGUOUS_ALTS";
	ParserDefinitionErrorType[ParserDefinitionErrorType["CONFLICT_TOKENS_RULES_NAMESPACE"] = 8] = "CONFLICT_TOKENS_RULES_NAMESPACE";
	ParserDefinitionErrorType[ParserDefinitionErrorType["INVALID_TOKEN_NAME"] = 9] = "INVALID_TOKEN_NAME";
	ParserDefinitionErrorType[ParserDefinitionErrorType["NO_NON_EMPTY_LOOKAHEAD"] = 10] = "NO_NON_EMPTY_LOOKAHEAD";
	ParserDefinitionErrorType[ParserDefinitionErrorType["AMBIGUOUS_PREFIX_ALTS"] = 11] = "AMBIGUOUS_PREFIX_ALTS";
	ParserDefinitionErrorType[ParserDefinitionErrorType["TOO_MANY_ALTS"] = 12] = "TOO_MANY_ALTS";
	ParserDefinitionErrorType[ParserDefinitionErrorType["CUSTOM_LOOKAHEAD_VALIDATION"] = 13] = "CUSTOM_LOOKAHEAD_VALIDATION";
})(ParserDefinitionErrorType || (ParserDefinitionErrorType = {}));
function EMPTY_ALT(value = void 0) {
	return function() {
		return value;
	};
}
var Parser = class Parser {
	/**
	*  @deprecated use the **instance** method with the same name instead
	*/
	static performSelfAnalysis(parserInstance) {
		throw Error("The **static** `performSelfAnalysis` method has been deprecated.	\nUse the **instance** method with the same name instead.");
	}
	performSelfAnalysis() {
		this.TRACE_INIT("performSelfAnalysis", () => {
			let defErrorsMsgs;
			this.selfAnalysisDone = true;
			const className = this.className;
			this.TRACE_INIT("toFastProps", () => {
				toFastProperties(this);
			});
			this.TRACE_INIT("Grammar Recording", () => {
				try {
					this.enableRecording();
					forEach(this.definedRulesNames, (currRuleName) => {
						const originalGrammarAction = this[currRuleName]["originalGrammarAction"];
						let recordedRuleGast;
						this.TRACE_INIT(`${currRuleName} Rule`, () => {
							recordedRuleGast = this.topLevelRuleRecord(currRuleName, originalGrammarAction);
						});
						this.gastProductionsCache[currRuleName] = recordedRuleGast;
					});
				} finally {
					this.disableRecording();
				}
			});
			let resolverErrors = [];
			this.TRACE_INIT("Grammar Resolving", () => {
				resolverErrors = resolveGrammar({ rules: values(this.gastProductionsCache) });
				this.definitionErrors = this.definitionErrors.concat(resolverErrors);
			});
			this.TRACE_INIT("Grammar Validations", () => {
				if (isEmpty(resolverErrors) && this.skipValidations === false) {
					const validationErrors = validateGrammar({
						rules: values(this.gastProductionsCache),
						tokenTypes: values(this.tokensMap),
						errMsgProvider: defaultGrammarValidatorErrorProvider,
						grammarName: className
					});
					const lookaheadValidationErrors = validateLookahead({
						lookaheadStrategy: this.lookaheadStrategy,
						rules: values(this.gastProductionsCache),
						tokenTypes: values(this.tokensMap),
						grammarName: className
					});
					this.definitionErrors = this.definitionErrors.concat(validationErrors, lookaheadValidationErrors);
				}
			});
			if (isEmpty(this.definitionErrors)) {
				if (this.recoveryEnabled) this.TRACE_INIT("computeAllProdsFollows", () => {
					const allFollows = computeAllProdsFollows(values(this.gastProductionsCache));
					this.resyncFollows = allFollows;
				});
				this.TRACE_INIT("ComputeLookaheadFunctions", () => {
					var _a, _b;
					(_b = (_a = this.lookaheadStrategy).initialize) === null || _b === void 0 || _b.call(_a, { rules: values(this.gastProductionsCache) });
					this.preComputeLookaheadFunctions(values(this.gastProductionsCache));
				});
			}
			if (!Parser.DEFER_DEFINITION_ERRORS_HANDLING && !isEmpty(this.definitionErrors)) {
				defErrorsMsgs = map(this.definitionErrors, (defError) => defError.message);
				throw new Error(`Parser Definition Errors detected:\n ${defErrorsMsgs.join("\n-------------------------------\n")}`);
			}
		});
	}
	constructor(tokenVocabulary, config) {
		this.definitionErrors = [];
		this.selfAnalysisDone = false;
		const that = this;
		that.initErrorHandler(config);
		that.initLexerAdapter();
		that.initLooksAhead(config);
		that.initRecognizerEngine(tokenVocabulary, config);
		that.initRecoverable(config);
		that.initTreeBuilder(config);
		that.initContentAssist();
		that.initGastRecorder(config);
		that.initPerformanceTracer(config);
		if (has(config, "ignoredIssues")) throw new Error("The <ignoredIssues> IParserConfig property has been deprecated.\n	Please use the <IGNORE_AMBIGUITIES> flag on the relevant DSL method instead.\n	See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#IGNORING_AMBIGUITIES\n	For further details.");
		this.skipValidations = has(config, "skipValidations") ? config.skipValidations : DEFAULT_PARSER_CONFIG.skipValidations;
	}
};
Parser.DEFER_DEFINITION_ERRORS_HANDLING = false;
applyMixins(Parser, [
	Recoverable,
	LooksAhead,
	TreeBuilder,
	LexerAdapter,
	RecognizerEngine,
	RecognizerApi,
	ErrorHandler,
	ContentAssist,
	GastRecorder,
	PerformanceTracer
]);
var EmbeddedActionsParser = class extends Parser {
	constructor(tokenVocabulary, config = DEFAULT_PARSER_CONFIG) {
		const configClone = clone(config);
		configClone.outputCst = false;
		super(tokenVocabulary, configClone);
	}
};
// ../../node_modules/.pnpm/chevrotain@11.0.3/node_modules/chevrotain/lib/src/api.js
/* istanbul ignore file - tricky to import some things from this module during testing */
// ../../node_modules/.pnpm/chevrotain-allstar@0.3.1_chevrotain@11.0.3/node_modules/chevrotain-allstar/lib/atn.js
/******************************************************************************
* Copyright 2022 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
function buildATNKey(rule, type, occurrence) {
	return `${rule.name}_${type}_${occurrence}`;
}
var AbstractTransition = class {
	constructor(target) {
		this.target = target;
	}
	isEpsilon() {
		return false;
	}
};
var AtomTransition = class extends AbstractTransition {
	constructor(target, tokenType) {
		super(target);
		this.tokenType = tokenType;
	}
};
var EpsilonTransition = class extends AbstractTransition {
	constructor(target) {
		super(target);
	}
	isEpsilon() {
		return true;
	}
};
var RuleTransition = class extends AbstractTransition {
	constructor(ruleStart, rule, followState) {
		super(ruleStart);
		this.rule = rule;
		this.followState = followState;
	}
	isEpsilon() {
		return true;
	}
};
function createATN(rules) {
	const atn = {
		decisionMap: {},
		decisionStates: [],
		ruleToStartState: /* @__PURE__ */ new Map(),
		ruleToStopState: /* @__PURE__ */ new Map(),
		states: []
	};
	createRuleStartAndStopATNStates(atn, rules);
	const ruleLength = rules.length;
	for (let i = 0; i < ruleLength; i++) {
		const rule = rules[i];
		const ruleBlock = block(atn, rule, rule);
		if (ruleBlock === void 0) continue;
		buildRuleHandle(atn, rule, ruleBlock);
	}
	return atn;
}
function createRuleStartAndStopATNStates(atn, rules) {
	const ruleLength = rules.length;
	for (let i = 0; i < ruleLength; i++) {
		const rule = rules[i];
		const start = newState(atn, rule, void 0, { type: 2 });
		const stop = newState(atn, rule, void 0, { type: 7 });
		start.stop = stop;
		atn.ruleToStartState.set(rule, start);
		atn.ruleToStopState.set(rule, stop);
	}
}
function atom(atn, rule, production) {
	if (production instanceof Terminal) return tokenRef(atn, rule, production.terminalType, production);
	else if (production instanceof NonTerminal) return ruleRef(atn, rule, production);
	else if (production instanceof Alternation) return alternation(atn, rule, production);
	else if (production instanceof Option$1) return option(atn, rule, production);
	else if (production instanceof Repetition) return repetition(atn, rule, production);
	else if (production instanceof RepetitionWithSeparator) return repetitionSep(atn, rule, production);
	else if (production instanceof RepetitionMandatory) return repetitionMandatory(atn, rule, production);
	else if (production instanceof RepetitionMandatoryWithSeparator) return repetitionMandatorySep(atn, rule, production);
	else return block(atn, rule, production);
}
function repetition(atn, rule, repetition) {
	const starState = newState(atn, rule, repetition, { type: 5 });
	defineDecisionState(atn, starState);
	return star(atn, rule, repetition, makeAlts(atn, rule, starState, repetition, block(atn, rule, repetition)));
}
function repetitionSep(atn, rule, repetition) {
	const starState = newState(atn, rule, repetition, { type: 5 });
	defineDecisionState(atn, starState);
	return star(atn, rule, repetition, makeAlts(atn, rule, starState, repetition, block(atn, rule, repetition)), tokenRef(atn, rule, repetition.separator, repetition));
}
function repetitionMandatory(atn, rule, repetition) {
	const plusState = newState(atn, rule, repetition, { type: 4 });
	defineDecisionState(atn, plusState);
	return plus(atn, rule, repetition, makeAlts(atn, rule, plusState, repetition, block(atn, rule, repetition)));
}
function repetitionMandatorySep(atn, rule, repetition) {
	const plusState = newState(atn, rule, repetition, { type: 4 });
	defineDecisionState(atn, plusState);
	return plus(atn, rule, repetition, makeAlts(atn, rule, plusState, repetition, block(atn, rule, repetition)), tokenRef(atn, rule, repetition.separator, repetition));
}
function alternation(atn, rule, alternation) {
	const start = newState(atn, rule, alternation, { type: 1 });
	defineDecisionState(atn, start);
	return makeAlts(atn, rule, start, alternation, ...map$1(alternation.definition, (e) => atom(atn, rule, e)));
}
function option(atn, rule, option) {
	const start = newState(atn, rule, option, { type: 1 });
	defineDecisionState(atn, start);
	return optional(atn, rule, option, makeAlts(atn, rule, start, option, block(atn, rule, option)));
}
function block(atn, rule, block) {
	const handles = filter$1(map$1(block.definition, (e) => atom(atn, rule, e)), (e) => e !== void 0);
	if (handles.length === 1) return handles[0];
	else if (handles.length === 0) return;
	else return makeBlock(atn, handles);
}
function plus(atn, rule, plus, handle, sep) {
	const blkStart = handle.left;
	const blkEnd = handle.right;
	const loop = newState(atn, rule, plus, { type: 11 });
	defineDecisionState(atn, loop);
	const end = newState(atn, rule, plus, { type: 12 });
	blkStart.loopback = loop;
	end.loopback = loop;
	atn.decisionMap[buildATNKey(rule, sep ? "RepetitionMandatoryWithSeparator" : "RepetitionMandatory", plus.idx)] = loop;
	epsilon(blkEnd, loop);
	if (sep === void 0) {
		epsilon(loop, blkStart);
		epsilon(loop, end);
	} else {
		epsilon(loop, end);
		epsilon(loop, sep.left);
		epsilon(sep.right, blkStart);
	}
	return {
		left: blkStart,
		right: end
	};
}
function star(atn, rule, star, handle, sep) {
	const start = handle.left;
	const end = handle.right;
	const entry = newState(atn, rule, star, { type: 10 });
	defineDecisionState(atn, entry);
	const loopEnd = newState(atn, rule, star, { type: 12 });
	const loop = newState(atn, rule, star, { type: 9 });
	entry.loopback = loop;
	loopEnd.loopback = loop;
	epsilon(entry, start);
	epsilon(entry, loopEnd);
	epsilon(end, loop);
	if (sep !== void 0) {
		epsilon(loop, loopEnd);
		epsilon(loop, sep.left);
		epsilon(sep.right, start);
	} else epsilon(loop, entry);
	atn.decisionMap[buildATNKey(rule, sep ? "RepetitionWithSeparator" : "Repetition", star.idx)] = entry;
	return {
		left: entry,
		right: loopEnd
	};
}
function optional(atn, rule, optional, handle) {
	const start = handle.left;
	const end = handle.right;
	epsilon(start, end);
	atn.decisionMap[buildATNKey(rule, "Option", optional.idx)] = start;
	return handle;
}
function defineDecisionState(atn, state) {
	atn.decisionStates.push(state);
	state.decision = atn.decisionStates.length - 1;
	return state.decision;
}
function makeAlts(atn, rule, start, production, ...alts) {
	const end = newState(atn, rule, production, {
		type: 8,
		start
	});
	start.end = end;
	for (const alt of alts) if (alt !== void 0) {
		epsilon(start, alt.left);
		epsilon(alt.right, end);
	} else epsilon(start, end);
	const handle = {
		left: start,
		right: end
	};
	atn.decisionMap[buildATNKey(rule, getProdType(production), production.idx)] = start;
	return handle;
}
function getProdType(production) {
	if (production instanceof Alternation) return "Alternation";
	else if (production instanceof Option$1) return "Option";
	else if (production instanceof Repetition) return "Repetition";
	else if (production instanceof RepetitionWithSeparator) return "RepetitionWithSeparator";
	else if (production instanceof RepetitionMandatory) return "RepetitionMandatory";
	else if (production instanceof RepetitionMandatoryWithSeparator) return "RepetitionMandatoryWithSeparator";
	else throw new Error("Invalid production type encountered");
}
function makeBlock(atn, alts) {
	const altsLength = alts.length;
	for (let i = 0; i < altsLength - 1; i++) {
		const handle = alts[i];
		let transition;
		if (handle.left.transitions.length === 1) transition = handle.left.transitions[0];
		const isRuleTransition = transition instanceof RuleTransition;
		const ruleTransition = transition;
		const next = alts[i + 1].left;
		if (handle.left.type === 1 && handle.right.type === 1 && transition !== void 0 && (isRuleTransition && ruleTransition.followState === handle.right || transition.target === handle.right)) {
			if (isRuleTransition) ruleTransition.followState = next;
			else transition.target = next;
			removeState(atn, handle.right);
		} else epsilon(handle.right, next);
	}
	const first = alts[0];
	const last = alts[altsLength - 1];
	return {
		left: first.left,
		right: last.right
	};
}
function tokenRef(atn, rule, tokenType, production) {
	const left = newState(atn, rule, production, { type: 1 });
	const right = newState(atn, rule, production, { type: 1 });
	addTransition(left, new AtomTransition(right, tokenType));
	return {
		left,
		right
	};
}
function ruleRef(atn, currentRule, nonTerminal) {
	const rule = nonTerminal.referencedRule;
	const start = atn.ruleToStartState.get(rule);
	const left = newState(atn, currentRule, nonTerminal, { type: 1 });
	const right = newState(atn, currentRule, nonTerminal, { type: 1 });
	addTransition(left, new RuleTransition(start, rule, right));
	return {
		left,
		right
	};
}
function buildRuleHandle(atn, rule, block) {
	const start = atn.ruleToStartState.get(rule);
	epsilon(start, block.left);
	const stop = atn.ruleToStopState.get(rule);
	epsilon(block.right, stop);
	return {
		left: start,
		right: stop
	};
}
function epsilon(a, b) {
	addTransition(a, new EpsilonTransition(b));
}
function newState(atn, rule, production, partial) {
	const t = Object.assign({
		atn,
		production,
		epsilonOnlyTransitions: false,
		rule,
		transitions: [],
		nextTokenWithinRule: [],
		stateNumber: atn.states.length
	}, partial);
	atn.states.push(t);
	return t;
}
function addTransition(state, transition) {
	if (state.transitions.length === 0) state.epsilonOnlyTransitions = transition.isEpsilon();
	state.transitions.push(transition);
}
function removeState(atn, state) {
	atn.states.splice(atn.states.indexOf(state), 1);
}
// ../../node_modules/.pnpm/chevrotain-allstar@0.3.1_chevrotain@11.0.3/node_modules/chevrotain-allstar/lib/dfa.js
/******************************************************************************
* Copyright 2022 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var DFA_ERROR = {};
var ATNConfigSet = class {
	constructor() {
		this.map = {};
		this.configs = [];
	}
	get size() {
		return this.configs.length;
	}
	finalize() {
		this.map = {};
	}
	add(config) {
		const key = getATNConfigKey(config);
		if (!(key in this.map)) {
			this.map[key] = this.configs.length;
			this.configs.push(config);
		}
	}
	get elements() {
		return this.configs;
	}
	get alts() {
		return map$1(this.configs, (e) => e.alt);
	}
	get key() {
		let value = "";
		for (const k in this.map) value += k + ":";
		return value;
	}
};
function getATNConfigKey(config, alt = true) {
	return `${alt ? `a${config.alt}` : ""}s${config.state.stateNumber}:${config.stack.map((e) => e.stateNumber.toString()).join("_")}`;
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/flatMap.js
/**
* Creates a flattened array of values by running each element in `collection`
* thru `iteratee` and flattening the mapped results. The iteratee is invoked
* with three arguments: (value, index|key, collection).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @returns {Array} Returns the new flattened array.
* @example
*
* function duplicate(n) {
*   return [n, n];
* }
*
* _.flatMap([1, 2], duplicate);
* // => [1, 1, 2, 2]
*/
function flatMap(collection, iteratee) {
	return baseFlatten$1(map$1(collection, iteratee), 1);
}
// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/uniqBy.js
/**
* This method is like `_.uniq` except that it accepts `iteratee` which is
* invoked for each element in `array` to generate the criterion by which
* uniqueness is computed. The order of result values is determined by the
* order they occur in the array. The iteratee is invoked with one argument:
* (value).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Array
* @param {Array} array The array to inspect.
* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
* @returns {Array} Returns the new duplicate free array.
* @example
*
* _.uniqBy([2.1, 1.2, 2.3], Math.floor);
* // => [2.1, 1.2]
*
* // The `_.property` iteratee shorthand.
* _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
* // => [{ 'x': 1 }, { 'x': 2 }]
*/
function uniqBy(array, iteratee) {
	return array && array.length ? baseUniq$1(array, baseIteratee$1(iteratee, 2)) : [];
}
// ../../node_modules/.pnpm/chevrotain-allstar@0.3.1_chevrotain@11.0.3/node_modules/chevrotain-allstar/lib/all-star-lookahead.js
/******************************************************************************
* Copyright 2022 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
function createDFACache(startState, decision) {
	const map = {};
	return (predicateSet) => {
		const key = predicateSet.toString();
		let existing = map[key];
		if (existing !== void 0) return existing;
		else {
			existing = {
				atnStartState: startState,
				decision,
				states: {}
			};
			map[key] = existing;
			return existing;
		}
	};
}
var PredicateSet = class {
	constructor() {
		this.predicates = [];
	}
	is(index) {
		return index >= this.predicates.length || this.predicates[index];
	}
	set(index, value) {
		this.predicates[index] = value;
	}
	toString() {
		let value = "";
		const size = this.predicates.length;
		for (let i = 0; i < size; i++) value += this.predicates[i] === true ? "1" : "0";
		return value;
	}
};
var EMPTY_PREDICATES = new PredicateSet();
var LLStarLookaheadStrategy = class extends LLkLookaheadStrategy {
	constructor(options) {
		var _a;
		super();
		this.logging = (_a = options === null || options === void 0 ? void 0 : options.logging) !== null && _a !== void 0 ? _a : ((message) => console.log(message));
	}
	initialize(options) {
		this.atn = createATN(options.rules);
		this.dfas = initATNSimulator(this.atn);
	}
	validateAmbiguousAlternationAlternatives() {
		return [];
	}
	validateEmptyOrAlternatives() {
		return [];
	}
	buildLookaheadForAlternation(options) {
		const { prodOccurrence, rule, hasPredicates, dynamicTokensEnabled } = options;
		const dfas = this.dfas;
		const logging = this.logging;
		const key = buildATNKey(rule, "Alternation", prodOccurrence);
		const decisionIndex = this.atn.decisionMap[key].decision;
		const partialAlts = map$1(getLookaheadPaths({
			maxLookahead: 1,
			occurrence: prodOccurrence,
			prodType: "Alternation",
			rule
		}), (currAlt) => map$1(currAlt, (path) => path[0]));
		if (isLL1Sequence(partialAlts, false) && !dynamicTokensEnabled) {
			const choiceToAlt = reduce$1(partialAlts, (result, currAlt, idx) => {
				forEach$1(currAlt, (currTokType) => {
					if (currTokType) {
						result[currTokType.tokenTypeIdx] = idx;
						forEach$1(currTokType.categoryMatches, (currExtendingType) => {
							result[currExtendingType] = idx;
						});
					}
				});
				return result;
			}, {});
			if (hasPredicates) return function(orAlts) {
				var _a;
				const nextToken = this.LA(1);
				const prediction = choiceToAlt[nextToken.tokenTypeIdx];
				if (orAlts !== void 0 && prediction !== void 0) {
					const gate = (_a = orAlts[prediction]) === null || _a === void 0 ? void 0 : _a.GATE;
					if (gate !== void 0 && gate.call(this) === false) return;
				}
				return prediction;
			};
			else return function() {
				const nextToken = this.LA(1);
				return choiceToAlt[nextToken.tokenTypeIdx];
			};
		} else if (hasPredicates) return function(orAlts) {
			const predicates = new PredicateSet();
			const length = orAlts === void 0 ? 0 : orAlts.length;
			for (let i = 0; i < length; i++) {
				const gate = orAlts === null || orAlts === void 0 ? void 0 : orAlts[i].GATE;
				predicates.set(i, gate === void 0 || gate.call(this));
			}
			const result = adaptivePredict.call(this, dfas, decisionIndex, predicates, logging);
			return typeof result === "number" ? result : void 0;
		};
		else return function() {
			const result = adaptivePredict.call(this, dfas, decisionIndex, EMPTY_PREDICATES, logging);
			return typeof result === "number" ? result : void 0;
		};
	}
	buildLookaheadForOptional(options) {
		const { prodOccurrence, rule, prodType, dynamicTokensEnabled } = options;
		const dfas = this.dfas;
		const logging = this.logging;
		const key = buildATNKey(rule, prodType, prodOccurrence);
		const decisionIndex = this.atn.decisionMap[key].decision;
		const alts = map$1(getLookaheadPaths({
			maxLookahead: 1,
			occurrence: prodOccurrence,
			prodType,
			rule
		}), (e) => {
			return map$1(e, (g) => g[0]);
		});
		if (isLL1Sequence(alts) && alts[0][0] && !dynamicTokensEnabled) {
			const alt = alts[0];
			const singleTokensTypes = flatten$1(alt);
			if (singleTokensTypes.length === 1 && isEmpty$1(singleTokensTypes[0].categoryMatches)) {
				const expectedTokenUniqueKey = singleTokensTypes[0].tokenTypeIdx;
				return function() {
					return this.LA(1).tokenTypeIdx === expectedTokenUniqueKey;
				};
			} else {
				const choiceToAlt = reduce$1(singleTokensTypes, (result, currTokType) => {
					if (currTokType !== void 0) {
						result[currTokType.tokenTypeIdx] = true;
						forEach$1(currTokType.categoryMatches, (currExtendingType) => {
							result[currExtendingType] = true;
						});
					}
					return result;
				}, {});
				return function() {
					const nextToken = this.LA(1);
					return choiceToAlt[nextToken.tokenTypeIdx] === true;
				};
			}
		}
		return function() {
			const result = adaptivePredict.call(this, dfas, decisionIndex, EMPTY_PREDICATES, logging);
			return typeof result === "object" ? false : result === 0;
		};
	}
};
function isLL1Sequence(sequences, allowEmpty = true) {
	const fullSet = /* @__PURE__ */ new Set();
	for (const alt of sequences) {
		const altSet = /* @__PURE__ */ new Set();
		for (const tokType of alt) {
			if (tokType === void 0) {
				if (allowEmpty) break;
				else return false;
			}
			const indices = [tokType.tokenTypeIdx].concat(tokType.categoryMatches);
			for (const index of indices) if (fullSet.has(index)) {
				if (!altSet.has(index)) return false;
			} else {
				fullSet.add(index);
				altSet.add(index);
			}
		}
	}
	return true;
}
function initATNSimulator(atn) {
	const decisionLength = atn.decisionStates.length;
	const decisionToDFA = Array(decisionLength);
	for (let i = 0; i < decisionLength; i++) decisionToDFA[i] = createDFACache(atn.decisionStates[i], i);
	return decisionToDFA;
}
function adaptivePredict(dfaCaches, decision, predicateSet, logging) {
	const dfa = dfaCaches[decision](predicateSet);
	let start = dfa.start;
	if (start === void 0) {
		start = addDFAState(dfa, newDFAState(computeStartState(dfa.atnStartState)));
		dfa.start = start;
	}
	return performLookahead.apply(this, [
		dfa,
		start,
		predicateSet,
		logging
	]);
}
function performLookahead(dfa, s0, predicateSet, logging) {
	let previousD = s0;
	let i = 1;
	const path = [];
	let t = this.LA(i++);
	while (true) {
		let d = getExistingTargetState(previousD, t);
		if (d === void 0) d = computeLookaheadTarget.apply(this, [
			dfa,
			previousD,
			t,
			i,
			predicateSet,
			logging
		]);
		if (d === DFA_ERROR) return buildAdaptivePredictError(path, previousD, t);
		if (d.isAcceptState === true) return d.prediction;
		previousD = d;
		path.push(t);
		t = this.LA(i++);
	}
}
function computeLookaheadTarget(dfa, previousD, token, lookahead, predicateSet, logging) {
	const reach = computeReachSet(previousD.configs, token, predicateSet);
	if (reach.size === 0) {
		addDFAEdge(dfa, previousD, token, DFA_ERROR);
		return DFA_ERROR;
	}
	let newState = newDFAState(reach);
	const predictedAlt = getUniqueAlt(reach, predicateSet);
	if (predictedAlt !== void 0) {
		newState.isAcceptState = true;
		newState.prediction = predictedAlt;
		newState.configs.uniqueAlt = predictedAlt;
	} else if (hasConflictTerminatingPrediction(reach)) {
		const prediction = min(reach.alts);
		newState.isAcceptState = true;
		newState.prediction = prediction;
		newState.configs.uniqueAlt = prediction;
		reportLookaheadAmbiguity.apply(this, [
			dfa,
			lookahead,
			reach.alts,
			logging
		]);
	}
	newState = addDFAEdge(dfa, previousD, token, newState);
	return newState;
}
function reportLookaheadAmbiguity(dfa, lookahead, ambiguityIndices, logging) {
	const prefixPath = [];
	for (let i = 1; i <= lookahead; i++) prefixPath.push(this.LA(i).tokenType);
	const atnState = dfa.atnStartState;
	const topLevelRule = atnState.rule;
	const production = atnState.production;
	logging(buildAmbiguityError({
		topLevelRule,
		ambiguityIndices,
		production,
		prefixPath
	}));
}
function buildAmbiguityError(options) {
	const pathMsg = map$1(options.prefixPath, (currtok) => tokenLabel(currtok)).join(", ");
	const occurrence = options.production.idx === 0 ? "" : options.production.idx;
	let currMessage = `Ambiguous Alternatives Detected: <${options.ambiguityIndices.join(", ")}> in <${getProductionDslName(options.production)}${occurrence}> inside <${options.topLevelRule.name}> Rule,\n<${pathMsg}> may appears as a prefix path in all these alternatives.\n`;
	currMessage = currMessage + "See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES\nFor Further details.";
	return currMessage;
}
function getProductionDslName(prod) {
	if (prod instanceof NonTerminal) return "SUBRULE";
	else if (prod instanceof Option$1) return "OPTION";
	else if (prod instanceof Alternation) return "OR";
	else if (prod instanceof RepetitionMandatory) return "AT_LEAST_ONE";
	else if (prod instanceof RepetitionMandatoryWithSeparator) return "AT_LEAST_ONE_SEP";
	else if (prod instanceof RepetitionWithSeparator) return "MANY_SEP";
	else if (prod instanceof Repetition) return "MANY";
	else if (prod instanceof Terminal) return "CONSUME";
	else throw Error("non exhaustive match");
}
function buildAdaptivePredictError(path, previous, current) {
	return {
		actualToken: current,
		possibleTokenTypes: uniqBy(flatMap(previous.configs.elements, (e) => e.state.transitions).filter((e) => e instanceof AtomTransition).map((e) => e.tokenType), (e) => e.tokenTypeIdx),
		tokenPath: path
	};
}
function getExistingTargetState(state, token) {
	return state.edges[token.tokenTypeIdx];
}
function computeReachSet(configs, token, predicateSet) {
	const intermediate = new ATNConfigSet();
	const skippedStopStates = [];
	for (const c of configs.elements) {
		if (predicateSet.is(c.alt) === false) continue;
		if (c.state.type === 7) {
			skippedStopStates.push(c);
			continue;
		}
		const transitionLength = c.state.transitions.length;
		for (let i = 0; i < transitionLength; i++) {
			const transition = c.state.transitions[i];
			const target = getReachableTarget(transition, token);
			if (target !== void 0) intermediate.add({
				state: target,
				alt: c.alt,
				stack: c.stack
			});
		}
	}
	let reach;
	if (skippedStopStates.length === 0 && intermediate.size === 1) reach = intermediate;
	if (reach === void 0) {
		reach = new ATNConfigSet();
		for (const c of intermediate.elements) closure(c, reach);
	}
	if (skippedStopStates.length > 0 && !hasConfigInRuleStopState(reach)) for (const c of skippedStopStates) reach.add(c);
	return reach;
}
function getReachableTarget(transition, token) {
	if (transition instanceof AtomTransition && tokenMatcher(token, transition.tokenType)) return transition.target;
}
function getUniqueAlt(configs, predicateSet) {
	let alt;
	for (const c of configs.elements) if (predicateSet.is(c.alt) === true) {
		if (alt === void 0) alt = c.alt;
		else if (alt !== c.alt) return;
	}
	return alt;
}
function newDFAState(closure) {
	return {
		configs: closure,
		edges: {},
		isAcceptState: false,
		prediction: -1
	};
}
function addDFAEdge(dfa, from, token, to) {
	to = addDFAState(dfa, to);
	from.edges[token.tokenTypeIdx] = to;
	return to;
}
function addDFAState(dfa, state) {
	if (state === DFA_ERROR) return state;
	const mapKey = state.configs.key;
	const existing = dfa.states[mapKey];
	if (existing !== void 0) return existing;
	state.configs.finalize();
	dfa.states[mapKey] = state;
	return state;
}
function computeStartState(atnState) {
	const configs = new ATNConfigSet();
	const numberOfTransitions = atnState.transitions.length;
	for (let i = 0; i < numberOfTransitions; i++) closure({
		state: atnState.transitions[i].target,
		alt: i,
		stack: []
	}, configs);
	return configs;
}
function closure(config, configs) {
	const p = config.state;
	if (p.type === 7) {
		if (config.stack.length > 0) {
			const atnStack = [...config.stack];
			closure({
				state: atnStack.pop(),
				alt: config.alt,
				stack: atnStack
			}, configs);
		} else configs.add(config);
		return;
	}
	if (!p.epsilonOnlyTransitions) configs.add(config);
	const transitionLength = p.transitions.length;
	for (let i = 0; i < transitionLength; i++) {
		const transition = p.transitions[i];
		const c = getEpsilonTarget(config, transition);
		if (c !== void 0) closure(c, configs);
	}
}
function getEpsilonTarget(config, transition) {
	if (transition instanceof EpsilonTransition) return {
		state: transition.target,
		alt: config.alt,
		stack: config.stack
	};
	else if (transition instanceof RuleTransition) {
		const stack = [...config.stack, transition.followState];
		return {
			state: transition.target,
			alt: config.alt,
			stack
		};
	}
}
function hasConfigInRuleStopState(configs) {
	for (const c of configs.elements) if (c.state.type === 7) return true;
	return false;
}
function allConfigsInRuleStopStates(configs) {
	for (const c of configs.elements) if (c.state.type !== 7) return false;
	return true;
}
function hasConflictTerminatingPrediction(configs) {
	if (allConfigsInRuleStopStates(configs)) return true;
	const altSets = getConflictingAltSets(configs.elements);
	return hasConflictingAltSet(altSets) && !hasStateAssociatedWithOneAlt(altSets);
}
function getConflictingAltSets(configs) {
	const configToAlts = /* @__PURE__ */ new Map();
	for (const c of configs) {
		const key = getATNConfigKey(c, false);
		let alts = configToAlts.get(key);
		if (alts === void 0) {
			alts = {};
			configToAlts.set(key, alts);
		}
		alts[c.alt] = true;
	}
	return configToAlts;
}
function hasConflictingAltSet(altSets) {
	for (const value of Array.from(altSets.values())) if (Object.keys(value).length > 1) return true;
	return false;
}
function hasStateAssociatedWithOneAlt(altSets) {
	for (const value of Array.from(altSets.values())) if (Object.keys(value).length === 1) return true;
	return false;
}
// ../../node_modules/.pnpm/vscode-languageserver-types@3.17.5/node_modules/vscode-languageserver-types/lib/esm/main.js
var DocumentUri;
(function(DocumentUri) {
	function is(value) {
		return typeof value === "string";
	}
	DocumentUri.is = is;
})(DocumentUri || (DocumentUri = {}));
var URI$1;
(function(URI) {
	function is(value) {
		return typeof value === "string";
	}
	URI.is = is;
})(URI$1 || (URI$1 = {}));
var integer;
(function(integer) {
	integer.MIN_VALUE = -2147483648;
	integer.MAX_VALUE = 2147483647;
	function is(value) {
		return typeof value === "number" && integer.MIN_VALUE <= value && value <= integer.MAX_VALUE;
	}
	integer.is = is;
})(integer || (integer = {}));
var uinteger;
(function(uinteger) {
	uinteger.MIN_VALUE = 0;
	uinteger.MAX_VALUE = 2147483647;
	function is(value) {
		return typeof value === "number" && uinteger.MIN_VALUE <= value && value <= uinteger.MAX_VALUE;
	}
	uinteger.is = is;
})(uinteger || (uinteger = {}));
/**
* The Position namespace provides helper functions to work with
* {@link Position} literals.
*/
var Position;
(function(Position) {
	/**
	* Creates a new Position literal from the given line and character.
	* @param line The position's line.
	* @param character The position's character.
	*/
	function create(line, character) {
		if (line === Number.MAX_VALUE) line = uinteger.MAX_VALUE;
		if (character === Number.MAX_VALUE) character = uinteger.MAX_VALUE;
		return {
			line,
			character
		};
	}
	Position.create = create;
	/**
	* Checks whether the given literal conforms to the {@link Position} interface.
	*/
	function is(value) {
		let candidate = value;
		return Is.objectLiteral(candidate) && Is.uinteger(candidate.line) && Is.uinteger(candidate.character);
	}
	Position.is = is;
})(Position || (Position = {}));
/**
* The Range namespace provides helper functions to work with
* {@link Range} literals.
*/
var Range;
(function(Range) {
	function create(one, two, three, four) {
		if (Is.uinteger(one) && Is.uinteger(two) && Is.uinteger(three) && Is.uinteger(four)) return {
			start: Position.create(one, two),
			end: Position.create(three, four)
		};
		else if (Position.is(one) && Position.is(two)) return {
			start: one,
			end: two
		};
		else throw new Error(`Range#create called with invalid arguments[${one}, ${two}, ${three}, ${four}]`);
	}
	Range.create = create;
	/**
	* Checks whether the given literal conforms to the {@link Range} interface.
	*/
	function is(value) {
		let candidate = value;
		return Is.objectLiteral(candidate) && Position.is(candidate.start) && Position.is(candidate.end);
	}
	Range.is = is;
})(Range || (Range = {}));
/**
* The Location namespace provides helper functions to work with
* {@link Location} literals.
*/
var Location;
(function(Location) {
	/**
	* Creates a Location literal.
	* @param uri The location's uri.
	* @param range The location's range.
	*/
	function create(uri, range) {
		return {
			uri,
			range
		};
	}
	Location.create = create;
	/**
	* Checks whether the given literal conforms to the {@link Location} interface.
	*/
	function is(value) {
		let candidate = value;
		return Is.objectLiteral(candidate) && Range.is(candidate.range) && (Is.string(candidate.uri) || Is.undefined(candidate.uri));
	}
	Location.is = is;
})(Location || (Location = {}));
/**
* The LocationLink namespace provides helper functions to work with
* {@link LocationLink} literals.
*/
var LocationLink;
(function(LocationLink) {
	/**
	* Creates a LocationLink literal.
	* @param targetUri The definition's uri.
	* @param targetRange The full range of the definition.
	* @param targetSelectionRange The span of the symbol definition at the target.
	* @param originSelectionRange The span of the symbol being defined in the originating source file.
	*/
	function create(targetUri, targetRange, targetSelectionRange, originSelectionRange) {
		return {
			targetUri,
			targetRange,
			targetSelectionRange,
			originSelectionRange
		};
	}
	LocationLink.create = create;
	/**
	* Checks whether the given literal conforms to the {@link LocationLink} interface.
	*/
	function is(value) {
		let candidate = value;
		return Is.objectLiteral(candidate) && Range.is(candidate.targetRange) && Is.string(candidate.targetUri) && Range.is(candidate.targetSelectionRange) && (Range.is(candidate.originSelectionRange) || Is.undefined(candidate.originSelectionRange));
	}
	LocationLink.is = is;
})(LocationLink || (LocationLink = {}));
/**
* The Color namespace provides helper functions to work with
* {@link Color} literals.
*/
var Color;
(function(Color) {
	/**
	* Creates a new Color literal.
	*/
	function create(red, green, blue, alpha) {
		return {
			red,
			green,
			blue,
			alpha
		};
	}
	Color.create = create;
	/**
	* Checks whether the given literal conforms to the {@link Color} interface.
	*/
	function is(value) {
		const candidate = value;
		return Is.objectLiteral(candidate) && Is.numberRange(candidate.red, 0, 1) && Is.numberRange(candidate.green, 0, 1) && Is.numberRange(candidate.blue, 0, 1) && Is.numberRange(candidate.alpha, 0, 1);
	}
	Color.is = is;
})(Color || (Color = {}));
/**
* The ColorInformation namespace provides helper functions to work with
* {@link ColorInformation} literals.
*/
var ColorInformation;
(function(ColorInformation) {
	/**
	* Creates a new ColorInformation literal.
	*/
	function create(range, color) {
		return {
			range,
			color
		};
	}
	ColorInformation.create = create;
	/**
	* Checks whether the given literal conforms to the {@link ColorInformation} interface.
	*/
	function is(value) {
		const candidate = value;
		return Is.objectLiteral(candidate) && Range.is(candidate.range) && Color.is(candidate.color);
	}
	ColorInformation.is = is;
})(ColorInformation || (ColorInformation = {}));
/**
* The Color namespace provides helper functions to work with
* {@link ColorPresentation} literals.
*/
var ColorPresentation;
(function(ColorPresentation) {
	/**
	* Creates a new ColorInformation literal.
	*/
	function create(label, textEdit, additionalTextEdits) {
		return {
			label,
			textEdit,
			additionalTextEdits
		};
	}
	ColorPresentation.create = create;
	/**
	* Checks whether the given literal conforms to the {@link ColorInformation} interface.
	*/
	function is(value) {
		const candidate = value;
		return Is.objectLiteral(candidate) && Is.string(candidate.label) && (Is.undefined(candidate.textEdit) || TextEdit.is(candidate)) && (Is.undefined(candidate.additionalTextEdits) || Is.typedArray(candidate.additionalTextEdits, TextEdit.is));
	}
	ColorPresentation.is = is;
})(ColorPresentation || (ColorPresentation = {}));
/**
* A set of predefined range kinds.
*/
var FoldingRangeKind;
(function(FoldingRangeKind) {
	/**
	* Folding range for a comment
	*/
	FoldingRangeKind.Comment = "comment";
	/**
	* Folding range for an import or include
	*/
	FoldingRangeKind.Imports = "imports";
	/**
	* Folding range for a region (e.g. `#region`)
	*/
	FoldingRangeKind.Region = "region";
})(FoldingRangeKind || (FoldingRangeKind = {}));
/**
* The folding range namespace provides helper functions to work with
* {@link FoldingRange} literals.
*/
var FoldingRange;
(function(FoldingRange) {
	/**
	* Creates a new FoldingRange literal.
	*/
	function create(startLine, endLine, startCharacter, endCharacter, kind, collapsedText) {
		const result = {
			startLine,
			endLine
		};
		if (Is.defined(startCharacter)) result.startCharacter = startCharacter;
		if (Is.defined(endCharacter)) result.endCharacter = endCharacter;
		if (Is.defined(kind)) result.kind = kind;
		if (Is.defined(collapsedText)) result.collapsedText = collapsedText;
		return result;
	}
	FoldingRange.create = create;
	/**
	* Checks whether the given literal conforms to the {@link FoldingRange} interface.
	*/
	function is(value) {
		const candidate = value;
		return Is.objectLiteral(candidate) && Is.uinteger(candidate.startLine) && Is.uinteger(candidate.startLine) && (Is.undefined(candidate.startCharacter) || Is.uinteger(candidate.startCharacter)) && (Is.undefined(candidate.endCharacter) || Is.uinteger(candidate.endCharacter)) && (Is.undefined(candidate.kind) || Is.string(candidate.kind));
	}
	FoldingRange.is = is;
})(FoldingRange || (FoldingRange = {}));
/**
* The DiagnosticRelatedInformation namespace provides helper functions to work with
* {@link DiagnosticRelatedInformation} literals.
*/
var DiagnosticRelatedInformation;
(function(DiagnosticRelatedInformation) {
	/**
	* Creates a new DiagnosticRelatedInformation literal.
	*/
	function create(location, message) {
		return {
			location,
			message
		};
	}
	DiagnosticRelatedInformation.create = create;
	/**
	* Checks whether the given literal conforms to the {@link DiagnosticRelatedInformation} interface.
	*/
	function is(value) {
		let candidate = value;
		return Is.defined(candidate) && Location.is(candidate.location) && Is.string(candidate.message);
	}
	DiagnosticRelatedInformation.is = is;
})(DiagnosticRelatedInformation || (DiagnosticRelatedInformation = {}));
/**
* The diagnostic's severity.
*/
var DiagnosticSeverity;
(function(DiagnosticSeverity) {
	/**
	* Reports an error.
	*/
	DiagnosticSeverity.Error = 1;
	/**
	* Reports a warning.
	*/
	DiagnosticSeverity.Warning = 2;
	/**
	* Reports an information.
	*/
	DiagnosticSeverity.Information = 3;
	/**
	* Reports a hint.
	*/
	DiagnosticSeverity.Hint = 4;
})(DiagnosticSeverity || (DiagnosticSeverity = {}));
/**
* The diagnostic tags.
*
* @since 3.15.0
*/
var DiagnosticTag;
(function(DiagnosticTag) {
	/**
	* Unused or unnecessary code.
	*
	* Clients are allowed to render diagnostics with this tag faded out instead of having
	* an error squiggle.
	*/
	DiagnosticTag.Unnecessary = 1;
	/**
	* Deprecated or obsolete code.
	*
	* Clients are allowed to rendered diagnostics with this tag strike through.
	*/
	DiagnosticTag.Deprecated = 2;
})(DiagnosticTag || (DiagnosticTag = {}));
/**
* The CodeDescription namespace provides functions to deal with descriptions for diagnostic codes.
*
* @since 3.16.0
*/
var CodeDescription;
(function(CodeDescription) {
	function is(value) {
		const candidate = value;
		return Is.objectLiteral(candidate) && Is.string(candidate.href);
	}
	CodeDescription.is = is;
})(CodeDescription || (CodeDescription = {}));
/**
* The Diagnostic namespace provides helper functions to work with
* {@link Diagnostic} literals.
*/
var Diagnostic;
(function(Diagnostic) {
	/**
	* Creates a new Diagnostic literal.
	*/
	function create(range, message, severity, code, source, relatedInformation) {
		let result = {
			range,
			message
		};
		if (Is.defined(severity)) result.severity = severity;
		if (Is.defined(code)) result.code = code;
		if (Is.defined(source)) result.source = source;
		if (Is.defined(relatedInformation)) result.relatedInformation = relatedInformation;
		return result;
	}
	Diagnostic.create = create;
	/**
	* Checks whether the given literal conforms to the {@link Diagnostic} interface.
	*/
	function is(value) {
		var _a;
		let candidate = value;
		return Is.defined(candidate) && Range.is(candidate.range) && Is.string(candidate.message) && (Is.number(candidate.severity) || Is.undefined(candidate.severity)) && (Is.integer(candidate.code) || Is.string(candidate.code) || Is.undefined(candidate.code)) && (Is.undefined(candidate.codeDescription) || Is.string((_a = candidate.codeDescription) === null || _a === void 0 ? void 0 : _a.href)) && (Is.string(candidate.source) || Is.undefined(candidate.source)) && (Is.undefined(candidate.relatedInformation) || Is.typedArray(candidate.relatedInformation, DiagnosticRelatedInformation.is));
	}
	Diagnostic.is = is;
})(Diagnostic || (Diagnostic = {}));
/**
* The Command namespace provides helper functions to work with
* {@link Command} literals.
*/
var Command;
(function(Command) {
	/**
	* Creates a new Command literal.
	*/
	function create(title, command, ...args) {
		let result = {
			title,
			command
		};
		if (Is.defined(args) && args.length > 0) result.arguments = args;
		return result;
	}
	Command.create = create;
	/**
	* Checks whether the given literal conforms to the {@link Command} interface.
	*/
	function is(value) {
		let candidate = value;
		return Is.defined(candidate) && Is.string(candidate.title) && Is.string(candidate.command);
	}
	Command.is = is;
})(Command || (Command = {}));
/**
* The TextEdit namespace provides helper function to create replace,
* insert and delete edits more easily.
*/
var TextEdit;
(function(TextEdit) {
	/**
	* Creates a replace text edit.
	* @param range The range of text to be replaced.
	* @param newText The new text.
	*/
	function replace(range, newText) {
		return {
			range,
			newText
		};
	}
	TextEdit.replace = replace;
	/**
	* Creates an insert text edit.
	* @param position The position to insert the text at.
	* @param newText The text to be inserted.
	*/
	function insert(position, newText) {
		return {
			range: {
				start: position,
				end: position
			},
			newText
		};
	}
	TextEdit.insert = insert;
	/**
	* Creates a delete text edit.
	* @param range The range of text to be deleted.
	*/
	function del(range) {
		return {
			range,
			newText: ""
		};
	}
	TextEdit.del = del;
	function is(value) {
		const candidate = value;
		return Is.objectLiteral(candidate) && Is.string(candidate.newText) && Range.is(candidate.range);
	}
	TextEdit.is = is;
})(TextEdit || (TextEdit = {}));
var ChangeAnnotation;
(function(ChangeAnnotation) {
	function create(label, needsConfirmation, description) {
		const result = { label };
		if (needsConfirmation !== void 0) result.needsConfirmation = needsConfirmation;
		if (description !== void 0) result.description = description;
		return result;
	}
	ChangeAnnotation.create = create;
	function is(value) {
		const candidate = value;
		return Is.objectLiteral(candidate) && Is.string(candidate.label) && (Is.boolean(candidate.needsConfirmation) || candidate.needsConfirmation === void 0) && (Is.string(candidate.description) || candidate.description === void 0);
	}
	ChangeAnnotation.is = is;
})(ChangeAnnotation || (ChangeAnnotation = {}));
var ChangeAnnotationIdentifier;
(function(ChangeAnnotationIdentifier) {
	function is(value) {
		const candidate = value;
		return Is.string(candidate);
	}
	ChangeAnnotationIdentifier.is = is;
})(ChangeAnnotationIdentifier || (ChangeAnnotationIdentifier = {}));
var AnnotatedTextEdit;
(function(AnnotatedTextEdit) {
	/**
	* Creates an annotated replace text edit.
	*
	* @param range The range of text to be replaced.
	* @param newText The new text.
	* @param annotation The annotation.
	*/
	function replace(range, newText, annotation) {
		return {
			range,
			newText,
			annotationId: annotation
		};
	}
	AnnotatedTextEdit.replace = replace;
	/**
	* Creates an annotated insert text edit.
	*
	* @param position The position to insert the text at.
	* @param newText The text to be inserted.
	* @param annotation The annotation.
	*/
	function insert(position, newText, annotation) {
		return {
			range: {
				start: position,
				end: position
			},
			newText,
			annotationId: annotation
		};
	}
	AnnotatedTextEdit.insert = insert;
	/**
	* Creates an annotated delete text edit.
	*
	* @param range The range of text to be deleted.
	* @param annotation The annotation.
	*/
	function del(range, annotation) {
		return {
			range,
			newText: "",
			annotationId: annotation
		};
	}
	AnnotatedTextEdit.del = del;
	function is(value) {
		const candidate = value;
		return TextEdit.is(candidate) && (ChangeAnnotation.is(candidate.annotationId) || ChangeAnnotationIdentifier.is(candidate.annotationId));
	}
	AnnotatedTextEdit.is = is;
})(AnnotatedTextEdit || (AnnotatedTextEdit = {}));
/**
* The TextDocumentEdit namespace provides helper function to create
* an edit that manipulates a text document.
*/
var TextDocumentEdit;
(function(TextDocumentEdit) {
	/**
	* Creates a new `TextDocumentEdit`
	*/
	function create(textDocument, edits) {
		return {
			textDocument,
			edits
		};
	}
	TextDocumentEdit.create = create;
	function is(value) {
		let candidate = value;
		return Is.defined(candidate) && OptionalVersionedTextDocumentIdentifier.is(candidate.textDocument) && Array.isArray(candidate.edits);
	}
	TextDocumentEdit.is = is;
})(TextDocumentEdit || (TextDocumentEdit = {}));
var CreateFile;
(function(CreateFile) {
	function create(uri, options, annotation) {
		let result = {
			kind: "create",
			uri
		};
		if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) result.options = options;
		if (annotation !== void 0) result.annotationId = annotation;
		return result;
	}
	CreateFile.create = create;
	function is(value) {
		let candidate = value;
		return candidate && candidate.kind === "create" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
	}
	CreateFile.is = is;
})(CreateFile || (CreateFile = {}));
var RenameFile;
(function(RenameFile) {
	function create(oldUri, newUri, options, annotation) {
		let result = {
			kind: "rename",
			oldUri,
			newUri
		};
		if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) result.options = options;
		if (annotation !== void 0) result.annotationId = annotation;
		return result;
	}
	RenameFile.create = create;
	function is(value) {
		let candidate = value;
		return candidate && candidate.kind === "rename" && Is.string(candidate.oldUri) && Is.string(candidate.newUri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
	}
	RenameFile.is = is;
})(RenameFile || (RenameFile = {}));
var DeleteFile;
(function(DeleteFile) {
	function create(uri, options, annotation) {
		let result = {
			kind: "delete",
			uri
		};
		if (options !== void 0 && (options.recursive !== void 0 || options.ignoreIfNotExists !== void 0)) result.options = options;
		if (annotation !== void 0) result.annotationId = annotation;
		return result;
	}
	DeleteFile.create = create;
	function is(value) {
		let candidate = value;
		return candidate && candidate.kind === "delete" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.recursive === void 0 || Is.boolean(candidate.options.recursive)) && (candidate.options.ignoreIfNotExists === void 0 || Is.boolean(candidate.options.ignoreIfNotExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
	}
	DeleteFile.is = is;
})(DeleteFile || (DeleteFile = {}));
var WorkspaceEdit;
(function(WorkspaceEdit) {
	function is(value) {
		let candidate = value;
		return candidate && (candidate.changes !== void 0 || candidate.documentChanges !== void 0) && (candidate.documentChanges === void 0 || candidate.documentChanges.every((change) => {
			if (Is.string(change.kind)) return CreateFile.is(change) || RenameFile.is(change) || DeleteFile.is(change);
			else return TextDocumentEdit.is(change);
		}));
	}
	WorkspaceEdit.is = is;
})(WorkspaceEdit || (WorkspaceEdit = {}));
/**
* The TextDocumentIdentifier namespace provides helper functions to work with
* {@link TextDocumentIdentifier} literals.
*/
var TextDocumentIdentifier;
(function(TextDocumentIdentifier) {
	/**
	* Creates a new TextDocumentIdentifier literal.
	* @param uri The document's uri.
	*/
	function create(uri) {
		return { uri };
	}
	TextDocumentIdentifier.create = create;
	/**
	* Checks whether the given literal conforms to the {@link TextDocumentIdentifier} interface.
	*/
	function is(value) {
		let candidate = value;
		return Is.defined(candidate) && Is.string(candidate.uri);
	}
	TextDocumentIdentifier.is = is;
})(TextDocumentIdentifier || (TextDocumentIdentifier = {}));
/**
* The VersionedTextDocumentIdentifier namespace provides helper functions to work with
* {@link VersionedTextDocumentIdentifier} literals.
*/
var VersionedTextDocumentIdentifier;
(function(VersionedTextDocumentIdentifier) {
	/**
	* Creates a new VersionedTextDocumentIdentifier literal.
	* @param uri The document's uri.
	* @param version The document's version.
	*/
	function create(uri, version) {
		return {
			uri,
			version
		};
	}
	VersionedTextDocumentIdentifier.create = create;
	/**
	* Checks whether the given literal conforms to the {@link VersionedTextDocumentIdentifier} interface.
	*/
	function is(value) {
		let candidate = value;
		return Is.defined(candidate) && Is.string(candidate.uri) && Is.integer(candidate.version);
	}
	VersionedTextDocumentIdentifier.is = is;
})(VersionedTextDocumentIdentifier || (VersionedTextDocumentIdentifier = {}));
/**
* The OptionalVersionedTextDocumentIdentifier namespace provides helper functions to work with
* {@link OptionalVersionedTextDocumentIdentifier} literals.
*/
var OptionalVersionedTextDocumentIdentifier;
(function(OptionalVersionedTextDocumentIdentifier) {
	/**
	* Creates a new OptionalVersionedTextDocumentIdentifier literal.
	* @param uri The document's uri.
	* @param version The document's version.
	*/
	function create(uri, version) {
		return {
			uri,
			version
		};
	}
	OptionalVersionedTextDocumentIdentifier.create = create;
	/**
	* Checks whether the given literal conforms to the {@link OptionalVersionedTextDocumentIdentifier} interface.
	*/
	function is(value) {
		let candidate = value;
		return Is.defined(candidate) && Is.string(candidate.uri) && (candidate.version === null || Is.integer(candidate.version));
	}
	OptionalVersionedTextDocumentIdentifier.is = is;
})(OptionalVersionedTextDocumentIdentifier || (OptionalVersionedTextDocumentIdentifier = {}));
/**
* The TextDocumentItem namespace provides helper functions to work with
* {@link TextDocumentItem} literals.
*/
var TextDocumentItem;
(function(TextDocumentItem) {
	/**
	* Creates a new TextDocumentItem literal.
	* @param uri The document's uri.
	* @param languageId The document's language identifier.
	* @param version The document's version number.
	* @param text The document's text.
	*/
	function create(uri, languageId, version, text) {
		return {
			uri,
			languageId,
			version,
			text
		};
	}
	TextDocumentItem.create = create;
	/**
	* Checks whether the given literal conforms to the {@link TextDocumentItem} interface.
	*/
	function is(value) {
		let candidate = value;
		return Is.defined(candidate) && Is.string(candidate.uri) && Is.string(candidate.languageId) && Is.integer(candidate.version) && Is.string(candidate.text);
	}
	TextDocumentItem.is = is;
})(TextDocumentItem || (TextDocumentItem = {}));
/**
* Describes the content type that a client supports in various
* result literals like `Hover`, `ParameterInfo` or `CompletionItem`.
*
* Please note that `MarkupKinds` must not start with a `$`. This kinds
* are reserved for internal usage.
*/
var MarkupKind;
(function(MarkupKind) {
	/**
	* Plain text is supported as a content format
	*/
	MarkupKind.PlainText = "plaintext";
	/**
	* Markdown is supported as a content format
	*/
	MarkupKind.Markdown = "markdown";
	/**
	* Checks whether the given value is a value of the {@link MarkupKind} type.
	*/
	function is(value) {
		const candidate = value;
		return candidate === MarkupKind.PlainText || candidate === MarkupKind.Markdown;
	}
	MarkupKind.is = is;
})(MarkupKind || (MarkupKind = {}));
var MarkupContent;
(function(MarkupContent) {
	/**
	* Checks whether the given value conforms to the {@link MarkupContent} interface.
	*/
	function is(value) {
		const candidate = value;
		return Is.objectLiteral(value) && MarkupKind.is(candidate.kind) && Is.string(candidate.value);
	}
	MarkupContent.is = is;
})(MarkupContent || (MarkupContent = {}));
/**
* The kind of a completion entry.
*/
var CompletionItemKind;
(function(CompletionItemKind) {
	CompletionItemKind.Text = 1;
	CompletionItemKind.Method = 2;
	CompletionItemKind.Function = 3;
	CompletionItemKind.Constructor = 4;
	CompletionItemKind.Field = 5;
	CompletionItemKind.Variable = 6;
	CompletionItemKind.Class = 7;
	CompletionItemKind.Interface = 8;
	CompletionItemKind.Module = 9;
	CompletionItemKind.Property = 10;
	CompletionItemKind.Unit = 11;
	CompletionItemKind.Value = 12;
	CompletionItemKind.Enum = 13;
	CompletionItemKind.Keyword = 14;
	CompletionItemKind.Snippet = 15;
	CompletionItemKind.Color = 16;
	CompletionItemKind.File = 17;
	CompletionItemKind.Reference = 18;
	CompletionItemKind.Folder = 19;
	CompletionItemKind.EnumMember = 20;
	CompletionItemKind.Constant = 21;
	CompletionItemKind.Struct = 22;
	CompletionItemKind.Event = 23;
	CompletionItemKind.Operator = 24;
	CompletionItemKind.TypeParameter = 25;
})(CompletionItemKind || (CompletionItemKind = {}));
/**
* Defines whether the insert text in a completion item should be interpreted as
* plain text or a snippet.
*/
var InsertTextFormat;
(function(InsertTextFormat) {
	/**
	* The primary text to be inserted is treated as a plain string.
	*/
	InsertTextFormat.PlainText = 1;
	/**
	* The primary text to be inserted is treated as a snippet.
	*
	* A snippet can define tab stops and placeholders with `$1`, `$2`
	* and `${3:foo}`. `$0` defines the final tab stop, it defaults to
	* the end of the snippet. Placeholders with equal identifiers are linked,
	* that is typing in one will update others too.
	*
	* See also: https://microsoft.github.io/language-server-protocol/specifications/specification-current/#snippet_syntax
	*/
	InsertTextFormat.Snippet = 2;
})(InsertTextFormat || (InsertTextFormat = {}));
/**
* Completion item tags are extra annotations that tweak the rendering of a completion
* item.
*
* @since 3.15.0
*/
var CompletionItemTag;
(function(CompletionItemTag) {
	/**
	* Render a completion as obsolete, usually using a strike-out.
	*/
	CompletionItemTag.Deprecated = 1;
})(CompletionItemTag || (CompletionItemTag = {}));
/**
* The InsertReplaceEdit namespace provides functions to deal with insert / replace edits.
*
* @since 3.16.0
*/
var InsertReplaceEdit;
(function(InsertReplaceEdit) {
	/**
	* Creates a new insert / replace edit
	*/
	function create(newText, insert, replace) {
		return {
			newText,
			insert,
			replace
		};
	}
	InsertReplaceEdit.create = create;
	/**
	* Checks whether the given literal conforms to the {@link InsertReplaceEdit} interface.
	*/
	function is(value) {
		const candidate = value;
		return candidate && Is.string(candidate.newText) && Range.is(candidate.insert) && Range.is(candidate.replace);
	}
	InsertReplaceEdit.is = is;
})(InsertReplaceEdit || (InsertReplaceEdit = {}));
/**
* How whitespace and indentation is handled during completion
* item insertion.
*
* @since 3.16.0
*/
var InsertTextMode;
(function(InsertTextMode) {
	/**
	* The insertion or replace strings is taken as it is. If the
	* value is multi line the lines below the cursor will be
	* inserted using the indentation defined in the string value.
	* The client will not apply any kind of adjustments to the
	* string.
	*/
	InsertTextMode.asIs = 1;
	/**
	* The editor adjusts leading whitespace of new lines so that
	* they match the indentation up to the cursor of the line for
	* which the item is accepted.
	*
	* Consider a line like this: <2tabs><cursor><3tabs>foo. Accepting a
	* multi line completion item is indented using 2 tabs and all
	* following lines inserted will be indented using 2 tabs as well.
	*/
	InsertTextMode.adjustIndentation = 2;
})(InsertTextMode || (InsertTextMode = {}));
var CompletionItemLabelDetails;
(function(CompletionItemLabelDetails) {
	function is(value) {
		const candidate = value;
		return candidate && (Is.string(candidate.detail) || candidate.detail === void 0) && (Is.string(candidate.description) || candidate.description === void 0);
	}
	CompletionItemLabelDetails.is = is;
})(CompletionItemLabelDetails || (CompletionItemLabelDetails = {}));
/**
* The CompletionItem namespace provides functions to deal with
* completion items.
*/
var CompletionItem;
(function(CompletionItem) {
	/**
	* Create a completion item and seed it with a label.
	* @param label The completion item's label
	*/
	function create(label) {
		return { label };
	}
	CompletionItem.create = create;
})(CompletionItem || (CompletionItem = {}));
/**
* The CompletionList namespace provides functions to deal with
* completion lists.
*/
var CompletionList;
(function(CompletionList) {
	/**
	* Creates a new completion list.
	*
	* @param items The completion items.
	* @param isIncomplete The list is not complete.
	*/
	function create(items, isIncomplete) {
		return {
			items: items ? items : [],
			isIncomplete: !!isIncomplete
		};
	}
	CompletionList.create = create;
})(CompletionList || (CompletionList = {}));
var MarkedString;
(function(MarkedString) {
	/**
	* Creates a marked string from plain text.
	*
	* @param plainText The plain text.
	*/
	function fromPlainText(plainText) {
		return plainText.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
	}
	MarkedString.fromPlainText = fromPlainText;
	/**
	* Checks whether the given value conforms to the {@link MarkedString} type.
	*/
	function is(value) {
		const candidate = value;
		return Is.string(candidate) || Is.objectLiteral(candidate) && Is.string(candidate.language) && Is.string(candidate.value);
	}
	MarkedString.is = is;
})(MarkedString || (MarkedString = {}));
var Hover;
(function(Hover) {
	/**
	* Checks whether the given value conforms to the {@link Hover} interface.
	*/
	function is(value) {
		let candidate = value;
		return !!candidate && Is.objectLiteral(candidate) && (MarkupContent.is(candidate.contents) || MarkedString.is(candidate.contents) || Is.typedArray(candidate.contents, MarkedString.is)) && (value.range === void 0 || Range.is(value.range));
	}
	Hover.is = is;
})(Hover || (Hover = {}));
/**
* The ParameterInformation namespace provides helper functions to work with
* {@link ParameterInformation} literals.
*/
var ParameterInformation;
(function(ParameterInformation) {
	/**
	* Creates a new parameter information literal.
	*
	* @param label A label string.
	* @param documentation A doc string.
	*/
	function create(label, documentation) {
		return documentation ? {
			label,
			documentation
		} : { label };
	}
	ParameterInformation.create = create;
})(ParameterInformation || (ParameterInformation = {}));
/**
* The SignatureInformation namespace provides helper functions to work with
* {@link SignatureInformation} literals.
*/
var SignatureInformation;
(function(SignatureInformation) {
	function create(label, documentation, ...parameters) {
		let result = { label };
		if (Is.defined(documentation)) result.documentation = documentation;
		if (Is.defined(parameters)) result.parameters = parameters;
		else result.parameters = [];
		return result;
	}
	SignatureInformation.create = create;
})(SignatureInformation || (SignatureInformation = {}));
/**
* A document highlight kind.
*/
var DocumentHighlightKind;
(function(DocumentHighlightKind) {
	/**
	* A textual occurrence.
	*/
	DocumentHighlightKind.Text = 1;
	/**
	* Read-access of a symbol, like reading a variable.
	*/
	DocumentHighlightKind.Read = 2;
	/**
	* Write-access of a symbol, like writing to a variable.
	*/
	DocumentHighlightKind.Write = 3;
})(DocumentHighlightKind || (DocumentHighlightKind = {}));
/**
* DocumentHighlight namespace to provide helper functions to work with
* {@link DocumentHighlight} literals.
*/
var DocumentHighlight;
(function(DocumentHighlight) {
	/**
	* Create a DocumentHighlight object.
	* @param range The range the highlight applies to.
	* @param kind The highlight kind
	*/
	function create(range, kind) {
		let result = { range };
		if (Is.number(kind)) result.kind = kind;
		return result;
	}
	DocumentHighlight.create = create;
})(DocumentHighlight || (DocumentHighlight = {}));
/**
* A symbol kind.
*/
var SymbolKind;
(function(SymbolKind) {
	SymbolKind.File = 1;
	SymbolKind.Module = 2;
	SymbolKind.Namespace = 3;
	SymbolKind.Package = 4;
	SymbolKind.Class = 5;
	SymbolKind.Method = 6;
	SymbolKind.Property = 7;
	SymbolKind.Field = 8;
	SymbolKind.Constructor = 9;
	SymbolKind.Enum = 10;
	SymbolKind.Interface = 11;
	SymbolKind.Function = 12;
	SymbolKind.Variable = 13;
	SymbolKind.Constant = 14;
	SymbolKind.String = 15;
	SymbolKind.Number = 16;
	SymbolKind.Boolean = 17;
	SymbolKind.Array = 18;
	SymbolKind.Object = 19;
	SymbolKind.Key = 20;
	SymbolKind.Null = 21;
	SymbolKind.EnumMember = 22;
	SymbolKind.Struct = 23;
	SymbolKind.Event = 24;
	SymbolKind.Operator = 25;
	SymbolKind.TypeParameter = 26;
})(SymbolKind || (SymbolKind = {}));
/**
* Symbol tags are extra annotations that tweak the rendering of a symbol.
*
* @since 3.16
*/
var SymbolTag;
(function(SymbolTag) {
	/**
	* Render a symbol as obsolete, usually using a strike-out.
	*/
	SymbolTag.Deprecated = 1;
})(SymbolTag || (SymbolTag = {}));
var SymbolInformation;
(function(SymbolInformation) {
	/**
	* Creates a new symbol information literal.
	*
	* @param name The name of the symbol.
	* @param kind The kind of the symbol.
	* @param range The range of the location of the symbol.
	* @param uri The resource of the location of symbol.
	* @param containerName The name of the symbol containing the symbol.
	*/
	function create(name, kind, range, uri, containerName) {
		let result = {
			name,
			kind,
			location: {
				uri,
				range
			}
		};
		if (containerName) result.containerName = containerName;
		return result;
	}
	SymbolInformation.create = create;
})(SymbolInformation || (SymbolInformation = {}));
var WorkspaceSymbol;
(function(WorkspaceSymbol) {
	/**
	* Create a new workspace symbol.
	*
	* @param name The name of the symbol.
	* @param kind The kind of the symbol.
	* @param uri The resource of the location of the symbol.
	* @param range An options range of the location.
	* @returns A WorkspaceSymbol.
	*/
	function create(name, kind, uri, range) {
		return range !== void 0 ? {
			name,
			kind,
			location: {
				uri,
				range
			}
		} : {
			name,
			kind,
			location: { uri }
		};
	}
	WorkspaceSymbol.create = create;
})(WorkspaceSymbol || (WorkspaceSymbol = {}));
var DocumentSymbol;
(function(DocumentSymbol) {
	/**
	* Creates a new symbol information literal.
	*
	* @param name The name of the symbol.
	* @param detail The detail of the symbol.
	* @param kind The kind of the symbol.
	* @param range The range of the symbol.
	* @param selectionRange The selectionRange of the symbol.
	* @param children Children of the symbol.
	*/
	function create(name, detail, kind, range, selectionRange, children) {
		let result = {
			name,
			detail,
			kind,
			range,
			selectionRange
		};
		if (children !== void 0) result.children = children;
		return result;
	}
	DocumentSymbol.create = create;
	/**
	* Checks whether the given literal conforms to the {@link DocumentSymbol} interface.
	*/
	function is(value) {
		let candidate = value;
		return candidate && Is.string(candidate.name) && Is.number(candidate.kind) && Range.is(candidate.range) && Range.is(candidate.selectionRange) && (candidate.detail === void 0 || Is.string(candidate.detail)) && (candidate.deprecated === void 0 || Is.boolean(candidate.deprecated)) && (candidate.children === void 0 || Array.isArray(candidate.children)) && (candidate.tags === void 0 || Array.isArray(candidate.tags));
	}
	DocumentSymbol.is = is;
})(DocumentSymbol || (DocumentSymbol = {}));
/**
* A set of predefined code action kinds
*/
var CodeActionKind;
(function(CodeActionKind) {
	/**
	* Empty kind.
	*/
	CodeActionKind.Empty = "";
	/**
	* Base kind for quickfix actions: 'quickfix'
	*/
	CodeActionKind.QuickFix = "quickfix";
	/**
	* Base kind for refactoring actions: 'refactor'
	*/
	CodeActionKind.Refactor = "refactor";
	/**
	* Base kind for refactoring extraction actions: 'refactor.extract'
	*
	* Example extract actions:
	*
	* - Extract method
	* - Extract function
	* - Extract variable
	* - Extract interface from class
	* - ...
	*/
	CodeActionKind.RefactorExtract = "refactor.extract";
	/**
	* Base kind for refactoring inline actions: 'refactor.inline'
	*
	* Example inline actions:
	*
	* - Inline function
	* - Inline variable
	* - Inline constant
	* - ...
	*/
	CodeActionKind.RefactorInline = "refactor.inline";
	/**
	* Base kind for refactoring rewrite actions: 'refactor.rewrite'
	*
	* Example rewrite actions:
	*
	* - Convert JavaScript function to class
	* - Add or remove parameter
	* - Encapsulate field
	* - Make method static
	* - Move method to base class
	* - ...
	*/
	CodeActionKind.RefactorRewrite = "refactor.rewrite";
	/**
	* Base kind for source actions: `source`
	*
	* Source code actions apply to the entire file.
	*/
	CodeActionKind.Source = "source";
	/**
	* Base kind for an organize imports source action: `source.organizeImports`
	*/
	CodeActionKind.SourceOrganizeImports = "source.organizeImports";
	/**
	* Base kind for auto-fix source actions: `source.fixAll`.
	*
	* Fix all actions automatically fix errors that have a clear fix that do not require user input.
	* They should not suppress errors or perform unsafe fixes such as generating new types or classes.
	*
	* @since 3.15.0
	*/
	CodeActionKind.SourceFixAll = "source.fixAll";
})(CodeActionKind || (CodeActionKind = {}));
/**
* The reason why code actions were requested.
*
* @since 3.17.0
*/
var CodeActionTriggerKind;
(function(CodeActionTriggerKind) {
	/**
	* Code actions were explicitly requested by the user or by an extension.
	*/
	CodeActionTriggerKind.Invoked = 1;
	/**
	* Code actions were requested automatically.
	*
	* This typically happens when current selection in a file changes, but can
	* also be triggered when file content changes.
	*/
	CodeActionTriggerKind.Automatic = 2;
})(CodeActionTriggerKind || (CodeActionTriggerKind = {}));
/**
* The CodeActionContext namespace provides helper functions to work with
* {@link CodeActionContext} literals.
*/
var CodeActionContext;
(function(CodeActionContext) {
	/**
	* Creates a new CodeActionContext literal.
	*/
	function create(diagnostics, only, triggerKind) {
		let result = { diagnostics };
		if (only !== void 0 && only !== null) result.only = only;
		if (triggerKind !== void 0 && triggerKind !== null) result.triggerKind = triggerKind;
		return result;
	}
	CodeActionContext.create = create;
	/**
	* Checks whether the given literal conforms to the {@link CodeActionContext} interface.
	*/
	function is(value) {
		let candidate = value;
		return Is.defined(candidate) && Is.typedArray(candidate.diagnostics, Diagnostic.is) && (candidate.only === void 0 || Is.typedArray(candidate.only, Is.string)) && (candidate.triggerKind === void 0 || candidate.triggerKind === CodeActionTriggerKind.Invoked || candidate.triggerKind === CodeActionTriggerKind.Automatic);
	}
	CodeActionContext.is = is;
})(CodeActionContext || (CodeActionContext = {}));
var CodeAction;
(function(CodeAction) {
	function create(title, kindOrCommandOrEdit, kind) {
		let result = { title };
		let checkKind = true;
		if (typeof kindOrCommandOrEdit === "string") {
			checkKind = false;
			result.kind = kindOrCommandOrEdit;
		} else if (Command.is(kindOrCommandOrEdit)) result.command = kindOrCommandOrEdit;
		else result.edit = kindOrCommandOrEdit;
		if (checkKind && kind !== void 0) result.kind = kind;
		return result;
	}
	CodeAction.create = create;
	function is(value) {
		let candidate = value;
		return candidate && Is.string(candidate.title) && (candidate.diagnostics === void 0 || Is.typedArray(candidate.diagnostics, Diagnostic.is)) && (candidate.kind === void 0 || Is.string(candidate.kind)) && (candidate.edit !== void 0 || candidate.command !== void 0) && (candidate.command === void 0 || Command.is(candidate.command)) && (candidate.isPreferred === void 0 || Is.boolean(candidate.isPreferred)) && (candidate.edit === void 0 || WorkspaceEdit.is(candidate.edit));
	}
	CodeAction.is = is;
})(CodeAction || (CodeAction = {}));
/**
* The CodeLens namespace provides helper functions to work with
* {@link CodeLens} literals.
*/
var CodeLens;
(function(CodeLens) {
	/**
	* Creates a new CodeLens literal.
	*/
	function create(range, data) {
		let result = { range };
		if (Is.defined(data)) result.data = data;
		return result;
	}
	CodeLens.create = create;
	/**
	* Checks whether the given literal conforms to the {@link CodeLens} interface.
	*/
	function is(value) {
		let candidate = value;
		return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.command) || Command.is(candidate.command));
	}
	CodeLens.is = is;
})(CodeLens || (CodeLens = {}));
/**
* The FormattingOptions namespace provides helper functions to work with
* {@link FormattingOptions} literals.
*/
var FormattingOptions;
(function(FormattingOptions) {
	/**
	* Creates a new FormattingOptions literal.
	*/
	function create(tabSize, insertSpaces) {
		return {
			tabSize,
			insertSpaces
		};
	}
	FormattingOptions.create = create;
	/**
	* Checks whether the given literal conforms to the {@link FormattingOptions} interface.
	*/
	function is(value) {
		let candidate = value;
		return Is.defined(candidate) && Is.uinteger(candidate.tabSize) && Is.boolean(candidate.insertSpaces);
	}
	FormattingOptions.is = is;
})(FormattingOptions || (FormattingOptions = {}));
/**
* The DocumentLink namespace provides helper functions to work with
* {@link DocumentLink} literals.
*/
var DocumentLink;
(function(DocumentLink) {
	/**
	* Creates a new DocumentLink literal.
	*/
	function create(range, target, data) {
		return {
			range,
			target,
			data
		};
	}
	DocumentLink.create = create;
	/**
	* Checks whether the given literal conforms to the {@link DocumentLink} interface.
	*/
	function is(value) {
		let candidate = value;
		return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.target) || Is.string(candidate.target));
	}
	DocumentLink.is = is;
})(DocumentLink || (DocumentLink = {}));
/**
* The SelectionRange namespace provides helper function to work with
* SelectionRange literals.
*/
var SelectionRange;
(function(SelectionRange) {
	/**
	* Creates a new SelectionRange
	* @param range the range.
	* @param parent an optional parent.
	*/
	function create(range, parent) {
		return {
			range,
			parent
		};
	}
	SelectionRange.create = create;
	function is(value) {
		let candidate = value;
		return Is.objectLiteral(candidate) && Range.is(candidate.range) && (candidate.parent === void 0 || SelectionRange.is(candidate.parent));
	}
	SelectionRange.is = is;
})(SelectionRange || (SelectionRange = {}));
/**
* A set of predefined token types. This set is not fixed
* an clients can specify additional token types via the
* corresponding client capabilities.
*
* @since 3.16.0
*/
var SemanticTokenTypes;
(function(SemanticTokenTypes) {
	SemanticTokenTypes["namespace"] = "namespace";
	/**
	* Represents a generic type. Acts as a fallback for types which can't be mapped to
	* a specific type like class or enum.
	*/
	SemanticTokenTypes["type"] = "type";
	SemanticTokenTypes["class"] = "class";
	SemanticTokenTypes["enum"] = "enum";
	SemanticTokenTypes["interface"] = "interface";
	SemanticTokenTypes["struct"] = "struct";
	SemanticTokenTypes["typeParameter"] = "typeParameter";
	SemanticTokenTypes["parameter"] = "parameter";
	SemanticTokenTypes["variable"] = "variable";
	SemanticTokenTypes["property"] = "property";
	SemanticTokenTypes["enumMember"] = "enumMember";
	SemanticTokenTypes["event"] = "event";
	SemanticTokenTypes["function"] = "function";
	SemanticTokenTypes["method"] = "method";
	SemanticTokenTypes["macro"] = "macro";
	SemanticTokenTypes["keyword"] = "keyword";
	SemanticTokenTypes["modifier"] = "modifier";
	SemanticTokenTypes["comment"] = "comment";
	SemanticTokenTypes["string"] = "string";
	SemanticTokenTypes["number"] = "number";
	SemanticTokenTypes["regexp"] = "regexp";
	SemanticTokenTypes["operator"] = "operator";
	/**
	* @since 3.17.0
	*/
	SemanticTokenTypes["decorator"] = "decorator";
})(SemanticTokenTypes || (SemanticTokenTypes = {}));
/**
* A set of predefined token modifiers. This set is not fixed
* an clients can specify additional token types via the
* corresponding client capabilities.
*
* @since 3.16.0
*/
var SemanticTokenModifiers;
(function(SemanticTokenModifiers) {
	SemanticTokenModifiers["declaration"] = "declaration";
	SemanticTokenModifiers["definition"] = "definition";
	SemanticTokenModifiers["readonly"] = "readonly";
	SemanticTokenModifiers["static"] = "static";
	SemanticTokenModifiers["deprecated"] = "deprecated";
	SemanticTokenModifiers["abstract"] = "abstract";
	SemanticTokenModifiers["async"] = "async";
	SemanticTokenModifiers["modification"] = "modification";
	SemanticTokenModifiers["documentation"] = "documentation";
	SemanticTokenModifiers["defaultLibrary"] = "defaultLibrary";
})(SemanticTokenModifiers || (SemanticTokenModifiers = {}));
/**
* @since 3.16.0
*/
var SemanticTokens;
(function(SemanticTokens) {
	function is(value) {
		const candidate = value;
		return Is.objectLiteral(candidate) && (candidate.resultId === void 0 || typeof candidate.resultId === "string") && Array.isArray(candidate.data) && (candidate.data.length === 0 || typeof candidate.data[0] === "number");
	}
	SemanticTokens.is = is;
})(SemanticTokens || (SemanticTokens = {}));
/**
* The InlineValueText namespace provides functions to deal with InlineValueTexts.
*
* @since 3.17.0
*/
var InlineValueText;
(function(InlineValueText) {
	/**
	* Creates a new InlineValueText literal.
	*/
	function create(range, text) {
		return {
			range,
			text
		};
	}
	InlineValueText.create = create;
	function is(value) {
		const candidate = value;
		return candidate !== void 0 && candidate !== null && Range.is(candidate.range) && Is.string(candidate.text);
	}
	InlineValueText.is = is;
})(InlineValueText || (InlineValueText = {}));
/**
* The InlineValueVariableLookup namespace provides functions to deal with InlineValueVariableLookups.
*
* @since 3.17.0
*/
var InlineValueVariableLookup;
(function(InlineValueVariableLookup) {
	/**
	* Creates a new InlineValueText literal.
	*/
	function create(range, variableName, caseSensitiveLookup) {
		return {
			range,
			variableName,
			caseSensitiveLookup
		};
	}
	InlineValueVariableLookup.create = create;
	function is(value) {
		const candidate = value;
		return candidate !== void 0 && candidate !== null && Range.is(candidate.range) && Is.boolean(candidate.caseSensitiveLookup) && (Is.string(candidate.variableName) || candidate.variableName === void 0);
	}
	InlineValueVariableLookup.is = is;
})(InlineValueVariableLookup || (InlineValueVariableLookup = {}));
/**
* The InlineValueEvaluatableExpression namespace provides functions to deal with InlineValueEvaluatableExpression.
*
* @since 3.17.0
*/
var InlineValueEvaluatableExpression;
(function(InlineValueEvaluatableExpression) {
	/**
	* Creates a new InlineValueEvaluatableExpression literal.
	*/
	function create(range, expression) {
		return {
			range,
			expression
		};
	}
	InlineValueEvaluatableExpression.create = create;
	function is(value) {
		const candidate = value;
		return candidate !== void 0 && candidate !== null && Range.is(candidate.range) && (Is.string(candidate.expression) || candidate.expression === void 0);
	}
	InlineValueEvaluatableExpression.is = is;
})(InlineValueEvaluatableExpression || (InlineValueEvaluatableExpression = {}));
/**
* The InlineValueContext namespace provides helper functions to work with
* {@link InlineValueContext} literals.
*
* @since 3.17.0
*/
var InlineValueContext;
(function(InlineValueContext) {
	/**
	* Creates a new InlineValueContext literal.
	*/
	function create(frameId, stoppedLocation) {
		return {
			frameId,
			stoppedLocation
		};
	}
	InlineValueContext.create = create;
	/**
	* Checks whether the given literal conforms to the {@link InlineValueContext} interface.
	*/
	function is(value) {
		const candidate = value;
		return Is.defined(candidate) && Range.is(value.stoppedLocation);
	}
	InlineValueContext.is = is;
})(InlineValueContext || (InlineValueContext = {}));
/**
* Inlay hint kinds.
*
* @since 3.17.0
*/
var InlayHintKind;
(function(InlayHintKind) {
	/**
	* An inlay hint that for a type annotation.
	*/
	InlayHintKind.Type = 1;
	/**
	* An inlay hint that is for a parameter.
	*/
	InlayHintKind.Parameter = 2;
	function is(value) {
		return value === 1 || value === 2;
	}
	InlayHintKind.is = is;
})(InlayHintKind || (InlayHintKind = {}));
var InlayHintLabelPart;
(function(InlayHintLabelPart) {
	function create(value) {
		return { value };
	}
	InlayHintLabelPart.create = create;
	function is(value) {
		const candidate = value;
		return Is.objectLiteral(candidate) && (candidate.tooltip === void 0 || Is.string(candidate.tooltip) || MarkupContent.is(candidate.tooltip)) && (candidate.location === void 0 || Location.is(candidate.location)) && (candidate.command === void 0 || Command.is(candidate.command));
	}
	InlayHintLabelPart.is = is;
})(InlayHintLabelPart || (InlayHintLabelPart = {}));
var InlayHint;
(function(InlayHint) {
	function create(position, label, kind) {
		const result = {
			position,
			label
		};
		if (kind !== void 0) result.kind = kind;
		return result;
	}
	InlayHint.create = create;
	function is(value) {
		const candidate = value;
		return Is.objectLiteral(candidate) && Position.is(candidate.position) && (Is.string(candidate.label) || Is.typedArray(candidate.label, InlayHintLabelPart.is)) && (candidate.kind === void 0 || InlayHintKind.is(candidate.kind)) && candidate.textEdits === void 0 || Is.typedArray(candidate.textEdits, TextEdit.is) && (candidate.tooltip === void 0 || Is.string(candidate.tooltip) || MarkupContent.is(candidate.tooltip)) && (candidate.paddingLeft === void 0 || Is.boolean(candidate.paddingLeft)) && (candidate.paddingRight === void 0 || Is.boolean(candidate.paddingRight));
	}
	InlayHint.is = is;
})(InlayHint || (InlayHint = {}));
var StringValue;
(function(StringValue) {
	function createSnippet(value) {
		return {
			kind: "snippet",
			value
		};
	}
	StringValue.createSnippet = createSnippet;
})(StringValue || (StringValue = {}));
var InlineCompletionItem;
(function(InlineCompletionItem) {
	function create(insertText, filterText, range, command) {
		return {
			insertText,
			filterText,
			range,
			command
		};
	}
	InlineCompletionItem.create = create;
})(InlineCompletionItem || (InlineCompletionItem = {}));
var InlineCompletionList;
(function(InlineCompletionList) {
	function create(items) {
		return { items };
	}
	InlineCompletionList.create = create;
})(InlineCompletionList || (InlineCompletionList = {}));
/**
* Describes how an {@link InlineCompletionItemProvider inline completion provider} was triggered.
*
* @since 3.18.0
* @proposed
*/
var InlineCompletionTriggerKind;
(function(InlineCompletionTriggerKind) {
	/**
	* Completion was triggered explicitly by a user gesture.
	*/
	InlineCompletionTriggerKind.Invoked = 0;
	/**
	* Completion was triggered automatically while editing.
	*/
	InlineCompletionTriggerKind.Automatic = 1;
})(InlineCompletionTriggerKind || (InlineCompletionTriggerKind = {}));
var SelectedCompletionInfo;
(function(SelectedCompletionInfo) {
	function create(range, text) {
		return {
			range,
			text
		};
	}
	SelectedCompletionInfo.create = create;
})(SelectedCompletionInfo || (SelectedCompletionInfo = {}));
var InlineCompletionContext;
(function(InlineCompletionContext) {
	function create(triggerKind, selectedCompletionInfo) {
		return {
			triggerKind,
			selectedCompletionInfo
		};
	}
	InlineCompletionContext.create = create;
})(InlineCompletionContext || (InlineCompletionContext = {}));
var WorkspaceFolder;
(function(WorkspaceFolder) {
	function is(value) {
		const candidate = value;
		return Is.objectLiteral(candidate) && URI$1.is(candidate.uri) && Is.string(candidate.name);
	}
	WorkspaceFolder.is = is;
})(WorkspaceFolder || (WorkspaceFolder = {}));
/**
* @deprecated Use the text document from the new vscode-languageserver-textdocument package.
*/
var TextDocument$1;
(function(TextDocument) {
	/**
	* Creates a new ITextDocument literal from the given uri and content.
	* @param uri The document's uri.
	* @param languageId The document's language Id.
	* @param version The document's version.
	* @param content The document's content.
	*/
	function create(uri, languageId, version, content) {
		return new FullTextDocument$1(uri, languageId, version, content);
	}
	TextDocument.create = create;
	/**
	* Checks whether the given literal conforms to the {@link ITextDocument} interface.
	*/
	function is(value) {
		let candidate = value;
		return Is.defined(candidate) && Is.string(candidate.uri) && (Is.undefined(candidate.languageId) || Is.string(candidate.languageId)) && Is.uinteger(candidate.lineCount) && Is.func(candidate.getText) && Is.func(candidate.positionAt) && Is.func(candidate.offsetAt) ? true : false;
	}
	TextDocument.is = is;
	function applyEdits(document, edits) {
		let text = document.getText();
		let sortedEdits = mergeSort(edits, (a, b) => {
			let diff = a.range.start.line - b.range.start.line;
			if (diff === 0) return a.range.start.character - b.range.start.character;
			return diff;
		});
		let lastModifiedOffset = text.length;
		for (let i = sortedEdits.length - 1; i >= 0; i--) {
			let e = sortedEdits[i];
			let startOffset = document.offsetAt(e.range.start);
			let endOffset = document.offsetAt(e.range.end);
			if (endOffset <= lastModifiedOffset) text = text.substring(0, startOffset) + e.newText + text.substring(endOffset, text.length);
			else throw new Error("Overlapping edit");
			lastModifiedOffset = startOffset;
		}
		return text;
	}
	TextDocument.applyEdits = applyEdits;
	function mergeSort(data, compare) {
		if (data.length <= 1) return data;
		const p = data.length / 2 | 0;
		const left = data.slice(0, p);
		const right = data.slice(p);
		mergeSort(left, compare);
		mergeSort(right, compare);
		let leftIdx = 0;
		let rightIdx = 0;
		let i = 0;
		while (leftIdx < left.length && rightIdx < right.length) if (compare(left[leftIdx], right[rightIdx]) <= 0) data[i++] = left[leftIdx++];
		else data[i++] = right[rightIdx++];
		while (leftIdx < left.length) data[i++] = left[leftIdx++];
		while (rightIdx < right.length) data[i++] = right[rightIdx++];
		return data;
	}
})(TextDocument$1 || (TextDocument$1 = {}));
/**
* @deprecated Use the text document from the new vscode-languageserver-textdocument package.
*/
var FullTextDocument$1 = class {
	constructor(uri, languageId, version, content) {
		this._uri = uri;
		this._languageId = languageId;
		this._version = version;
		this._content = content;
		this._lineOffsets = void 0;
	}
	get uri() {
		return this._uri;
	}
	get languageId() {
		return this._languageId;
	}
	get version() {
		return this._version;
	}
	getText(range) {
		if (range) {
			let start = this.offsetAt(range.start);
			let end = this.offsetAt(range.end);
			return this._content.substring(start, end);
		}
		return this._content;
	}
	update(event, version) {
		this._content = event.text;
		this._version = version;
		this._lineOffsets = void 0;
	}
	getLineOffsets() {
		if (this._lineOffsets === void 0) {
			let lineOffsets = [];
			let text = this._content;
			let isLineStart = true;
			for (let i = 0; i < text.length; i++) {
				if (isLineStart) {
					lineOffsets.push(i);
					isLineStart = false;
				}
				let ch = text.charAt(i);
				isLineStart = ch === "\r" || ch === "\n";
				if (ch === "\r" && i + 1 < text.length && text.charAt(i + 1) === "\n") i++;
			}
			if (isLineStart && text.length > 0) lineOffsets.push(text.length);
			this._lineOffsets = lineOffsets;
		}
		return this._lineOffsets;
	}
	positionAt(offset) {
		offset = Math.max(Math.min(offset, this._content.length), 0);
		let lineOffsets = this.getLineOffsets();
		let low = 0, high = lineOffsets.length;
		if (high === 0) return Position.create(0, offset);
		while (low < high) {
			let mid = Math.floor((low + high) / 2);
			if (lineOffsets[mid] > offset) high = mid;
			else low = mid + 1;
		}
		let line = low - 1;
		return Position.create(line, offset - lineOffsets[line]);
	}
	offsetAt(position) {
		let lineOffsets = this.getLineOffsets();
		if (position.line >= lineOffsets.length) return this._content.length;
		else if (position.line < 0) return 0;
		let lineOffset = lineOffsets[position.line];
		let nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : this._content.length;
		return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
	}
	get lineCount() {
		return this.getLineOffsets().length;
	}
};
var Is;
(function(Is) {
	const toString = Object.prototype.toString;
	function defined(value) {
		return typeof value !== "undefined";
	}
	Is.defined = defined;
	function undefined(value) {
		return typeof value === "undefined";
	}
	Is.undefined = undefined;
	function boolean(value) {
		return value === true || value === false;
	}
	Is.boolean = boolean;
	function string(value) {
		return toString.call(value) === "[object String]";
	}
	Is.string = string;
	function number(value) {
		return toString.call(value) === "[object Number]";
	}
	Is.number = number;
	function numberRange(value, min, max) {
		return toString.call(value) === "[object Number]" && min <= value && value <= max;
	}
	Is.numberRange = numberRange;
	function integer(value) {
		return toString.call(value) === "[object Number]" && -2147483648 <= value && value <= 2147483647;
	}
	Is.integer = integer;
	function uinteger(value) {
		return toString.call(value) === "[object Number]" && 0 <= value && value <= 2147483647;
	}
	Is.uinteger = uinteger;
	function func(value) {
		return toString.call(value) === "[object Function]";
	}
	Is.func = func;
	function objectLiteral(value) {
		return value !== null && typeof value === "object";
	}
	Is.objectLiteral = objectLiteral;
	function typedArray(value, check) {
		return Array.isArray(value) && value.every(check);
	}
	Is.typedArray = typedArray;
})(Is || (Is = {}));
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/parser/cst-node-builder.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var CstNodeBuilder = class {
	constructor() {
		this.nodeStack = [];
	}
	get current() {
		var _a;
		return (_a = this.nodeStack[this.nodeStack.length - 1]) !== null && _a !== void 0 ? _a : this.rootNode;
	}
	buildRootNode(input) {
		this.rootNode = new RootCstNodeImpl(input);
		this.rootNode.root = this.rootNode;
		this.nodeStack = [this.rootNode];
		return this.rootNode;
	}
	buildCompositeNode(feature) {
		const compositeNode = new CompositeCstNodeImpl();
		compositeNode.grammarSource = feature;
		compositeNode.root = this.rootNode;
		this.current.content.push(compositeNode);
		this.nodeStack.push(compositeNode);
		return compositeNode;
	}
	buildLeafNode(token, feature) {
		const leafNode = new LeafCstNodeImpl(token.startOffset, token.image.length, tokenToRange(token), token.tokenType, !feature);
		leafNode.grammarSource = feature;
		leafNode.root = this.rootNode;
		this.current.content.push(leafNode);
		return leafNode;
	}
	removeNode(node) {
		const parent = node.container;
		if (parent) {
			const index = parent.content.indexOf(node);
			if (index >= 0) parent.content.splice(index, 1);
		}
	}
	addHiddenNodes(tokens) {
		const nodes = [];
		for (const token of tokens) {
			const leafNode = new LeafCstNodeImpl(token.startOffset, token.image.length, tokenToRange(token), token.tokenType, true);
			leafNode.root = this.rootNode;
			nodes.push(leafNode);
		}
		let current = this.current;
		let added = false;
		if (current.content.length > 0) {
			current.content.push(...nodes);
			return;
		}
		while (current.container) {
			const index = current.container.content.indexOf(current);
			if (index > 0) {
				current.container.content.splice(index, 0, ...nodes);
				added = true;
				break;
			}
			current = current.container;
		}
		if (!added) this.rootNode.content.unshift(...nodes);
	}
	construct(item) {
		const current = this.current;
		if (typeof item.$type === "string") this.current.astNode = item;
		item.$cstNode = current;
		const node = this.nodeStack.pop();
		if ((node === null || node === void 0 ? void 0 : node.content.length) === 0) this.removeNode(node);
	}
};
var AbstractCstNode = class {
	/** @deprecated use `container` instead. */
	get parent() {
		return this.container;
	}
	/** @deprecated use `grammarSource` instead. */
	get feature() {
		return this.grammarSource;
	}
	get hidden() {
		return false;
	}
	get astNode() {
		var _a, _b;
		const node = typeof ((_a = this._astNode) === null || _a === void 0 ? void 0 : _a.$type) === "string" ? this._astNode : (_b = this.container) === null || _b === void 0 ? void 0 : _b.astNode;
		if (!node) throw new Error("This node has no associated AST element");
		return node;
	}
	set astNode(value) {
		this._astNode = value;
	}
	/** @deprecated use `astNode` instead. */
	get element() {
		return this.astNode;
	}
	get text() {
		return this.root.fullText.substring(this.offset, this.end);
	}
};
var LeafCstNodeImpl = class extends AbstractCstNode {
	get offset() {
		return this._offset;
	}
	get length() {
		return this._length;
	}
	get end() {
		return this._offset + this._length;
	}
	get hidden() {
		return this._hidden;
	}
	get tokenType() {
		return this._tokenType;
	}
	get range() {
		return this._range;
	}
	constructor(offset, length, range, tokenType, hidden = false) {
		super();
		this._hidden = hidden;
		this._offset = offset;
		this._tokenType = tokenType;
		this._length = length;
		this._range = range;
	}
};
var CompositeCstNodeImpl = class extends AbstractCstNode {
	constructor() {
		super(...arguments);
		this.content = new CstNodeContainer(this);
	}
	/** @deprecated use `content` instead. */
	get children() {
		return this.content;
	}
	get offset() {
		var _a, _b;
		return (_b = (_a = this.firstNonHiddenNode) === null || _a === void 0 ? void 0 : _a.offset) !== null && _b !== void 0 ? _b : 0;
	}
	get length() {
		return this.end - this.offset;
	}
	get end() {
		var _a, _b;
		return (_b = (_a = this.lastNonHiddenNode) === null || _a === void 0 ? void 0 : _a.end) !== null && _b !== void 0 ? _b : 0;
	}
	get range() {
		const firstNode = this.firstNonHiddenNode;
		const lastNode = this.lastNonHiddenNode;
		if (firstNode && lastNode) {
			if (this._rangeCache === void 0) {
				const { range: firstRange } = firstNode;
				const { range: lastRange } = lastNode;
				this._rangeCache = {
					start: firstRange.start,
					end: lastRange.end.line < firstRange.start.line ? firstRange.start : lastRange.end
				};
			}
			return this._rangeCache;
		} else return {
			start: Position.create(0, 0),
			end: Position.create(0, 0)
		};
	}
	get firstNonHiddenNode() {
		for (const child of this.content) if (!child.hidden) return child;
		return this.content[0];
	}
	get lastNonHiddenNode() {
		for (let i = this.content.length - 1; i >= 0; i--) {
			const child = this.content[i];
			if (!child.hidden) return child;
		}
		return this.content[this.content.length - 1];
	}
};
var CstNodeContainer = class CstNodeContainer extends Array {
	constructor(parent) {
		super();
		this.parent = parent;
		Object.setPrototypeOf(this, CstNodeContainer.prototype);
	}
	push(...items) {
		this.addParents(items);
		return super.push(...items);
	}
	unshift(...items) {
		this.addParents(items);
		return super.unshift(...items);
	}
	splice(start, count, ...items) {
		this.addParents(items);
		return super.splice(start, count, ...items);
	}
	addParents(items) {
		for (const item of items) item.container = this.parent;
	}
};
var RootCstNodeImpl = class extends CompositeCstNodeImpl {
	get text() {
		return this._text.substring(this.offset, this.end);
	}
	get fullText() {
		return this._text;
	}
	constructor(input) {
		super();
		this._text = "";
		this._text = input !== null && input !== void 0 ? input : "";
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/parser/langium-parser.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var DatatypeSymbol = Symbol("Datatype");
function isDataTypeNode(node) {
	return node.$type === DatatypeSymbol;
}
var ruleSuffix = "​";
var withRuleSuffix = (name) => name.endsWith(ruleSuffix) ? name : name + ruleSuffix;
var AbstractLangiumParser = class {
	constructor(services) {
		this._unorderedGroups = /* @__PURE__ */ new Map();
		this.allRules = /* @__PURE__ */ new Map();
		this.lexer = services.parser.Lexer;
		const tokens = this.lexer.definition;
		const production = services.LanguageMetaData.mode === "production";
		this.wrapper = new ChevrotainWrapper(tokens, Object.assign(Object.assign({}, services.parser.ParserConfig), {
			skipValidations: production,
			errorMessageProvider: services.parser.ParserErrorMessageProvider
		}));
	}
	alternatives(idx, choices) {
		this.wrapper.wrapOr(idx, choices);
	}
	optional(idx, callback) {
		this.wrapper.wrapOption(idx, callback);
	}
	many(idx, callback) {
		this.wrapper.wrapMany(idx, callback);
	}
	atLeastOne(idx, callback) {
		this.wrapper.wrapAtLeastOne(idx, callback);
	}
	getRule(name) {
		return this.allRules.get(name);
	}
	isRecording() {
		return this.wrapper.IS_RECORDING;
	}
	get unorderedGroups() {
		return this._unorderedGroups;
	}
	getRuleStack() {
		return this.wrapper.RULE_STACK;
	}
	finalize() {
		this.wrapper.wrapSelfAnalysis();
	}
};
var LangiumParser = class extends AbstractLangiumParser {
	get current() {
		return this.stack[this.stack.length - 1];
	}
	constructor(services) {
		super(services);
		this.nodeBuilder = new CstNodeBuilder();
		this.stack = [];
		this.assignmentMap = /* @__PURE__ */ new Map();
		this.linker = services.references.Linker;
		this.converter = services.parser.ValueConverter;
		this.astReflection = services.shared.AstReflection;
	}
	rule(rule, impl) {
		const type = this.computeRuleType(rule);
		const ruleMethod = this.wrapper.DEFINE_RULE(withRuleSuffix(rule.name), this.startImplementation(type, impl).bind(this));
		this.allRules.set(rule.name, ruleMethod);
		if (rule.entry) this.mainRule = ruleMethod;
		return ruleMethod;
	}
	computeRuleType(rule) {
		if (rule.fragment) return;
		else if (isDataTypeRule(rule)) return DatatypeSymbol;
		else {
			const explicit = getExplicitRuleType(rule);
			return explicit !== null && explicit !== void 0 ? explicit : rule.name;
		}
	}
	parse(input, options = {}) {
		this.nodeBuilder.buildRootNode(input);
		const lexerResult = this.lexerResult = this.lexer.tokenize(input);
		this.wrapper.input = lexerResult.tokens;
		const ruleMethod = options.rule ? this.allRules.get(options.rule) : this.mainRule;
		if (!ruleMethod) throw new Error(options.rule ? `No rule found with name '${options.rule}'` : "No main rule available.");
		const result = ruleMethod.call(this.wrapper, {});
		this.nodeBuilder.addHiddenNodes(lexerResult.hidden);
		this.unorderedGroups.clear();
		this.lexerResult = void 0;
		return {
			value: result,
			lexerErrors: lexerResult.errors,
			lexerReport: lexerResult.report,
			parserErrors: this.wrapper.errors
		};
	}
	startImplementation($type, implementation) {
		return (args) => {
			const createNode = !this.isRecording() && $type !== void 0;
			if (createNode) {
				const node = { $type };
				this.stack.push(node);
				if ($type === DatatypeSymbol) node.value = "";
			}
			let result;
			try {
				result = implementation(args);
			} catch (err) {
				result = void 0;
			}
			if (result === void 0 && createNode) result = this.construct();
			return result;
		};
	}
	extractHiddenTokens(token) {
		const hiddenTokens = this.lexerResult.hidden;
		if (!hiddenTokens.length) return [];
		const offset = token.startOffset;
		for (let i = 0; i < hiddenTokens.length; i++) if (hiddenTokens[i].startOffset > offset) return hiddenTokens.splice(0, i);
		return hiddenTokens.splice(0, hiddenTokens.length);
	}
	consume(idx, tokenType, feature) {
		const token = this.wrapper.wrapConsume(idx, tokenType);
		if (!this.isRecording() && this.isValidToken(token)) {
			const hiddenTokens = this.extractHiddenTokens(token);
			this.nodeBuilder.addHiddenNodes(hiddenTokens);
			const leafNode = this.nodeBuilder.buildLeafNode(token, feature);
			const { assignment, isCrossRef } = this.getAssignment(feature);
			const current = this.current;
			if (assignment) {
				const convertedValue = isKeyword(feature) ? token.image : this.converter.convert(token.image, leafNode);
				this.assign(assignment.operator, assignment.feature, convertedValue, leafNode, isCrossRef);
			} else if (isDataTypeNode(current)) {
				let text = token.image;
				if (!isKeyword(feature)) text = this.converter.convert(text, leafNode).toString();
				current.value += text;
			}
		}
	}
	/**
	* Most consumed parser tokens are valid. However there are two cases in which they are not valid:
	*
	* 1. They were inserted during error recovery by the parser. These tokens don't really exist and should not be further processed
	* 2. They contain invalid token ranges. This might include the special EOF token, or other tokens produced by invalid token builders.
	*/
	isValidToken(token) {
		return !token.isInsertedInRecovery && !isNaN(token.startOffset) && typeof token.endOffset === "number" && !isNaN(token.endOffset);
	}
	subrule(idx, rule, fragment, feature, args) {
		let cstNode;
		if (!this.isRecording() && !fragment) cstNode = this.nodeBuilder.buildCompositeNode(feature);
		const subruleResult = this.wrapper.wrapSubrule(idx, rule, args);
		if (!this.isRecording() && cstNode && cstNode.length > 0) this.performSubruleAssignment(subruleResult, feature, cstNode);
	}
	performSubruleAssignment(result, feature, cstNode) {
		const { assignment, isCrossRef } = this.getAssignment(feature);
		if (assignment) this.assign(assignment.operator, assignment.feature, result, cstNode, isCrossRef);
		else if (!assignment) {
			const current = this.current;
			if (isDataTypeNode(current)) current.value += result.toString();
			else if (typeof result === "object" && result) {
				const newItem = this.assignWithoutOverride(result, current);
				this.stack.pop();
				this.stack.push(newItem);
			}
		}
	}
	action($type, action) {
		if (!this.isRecording()) {
			let last = this.current;
			if (action.feature && action.operator) {
				last = this.construct();
				this.nodeBuilder.removeNode(last.$cstNode);
				this.nodeBuilder.buildCompositeNode(action).content.push(last.$cstNode);
				const newItem = { $type };
				this.stack.push(newItem);
				this.assign(action.operator, action.feature, last, last.$cstNode, false);
			} else last.$type = $type;
		}
	}
	construct() {
		if (this.isRecording()) return;
		const obj = this.current;
		linkContentToContainer(obj);
		this.nodeBuilder.construct(obj);
		this.stack.pop();
		if (isDataTypeNode(obj)) return this.converter.convert(obj.value, obj.$cstNode);
		else assignMandatoryProperties(this.astReflection, obj);
		return obj;
	}
	getAssignment(feature) {
		if (!this.assignmentMap.has(feature)) {
			const assignment = getContainerOfType(feature, isAssignment);
			this.assignmentMap.set(feature, {
				assignment,
				isCrossRef: assignment ? isCrossReference(assignment.terminal) : false
			});
		}
		return this.assignmentMap.get(feature);
	}
	assign(operator, feature, value, cstNode, isCrossRef) {
		const obj = this.current;
		let item;
		if (isCrossRef && typeof value === "string") item = this.linker.buildReference(obj, feature, cstNode, value);
		else item = value;
		switch (operator) {
			case "=":
				obj[feature] = item;
				break;
			case "?=":
				obj[feature] = true;
				break;
			case "+=":
				if (!Array.isArray(obj[feature])) obj[feature] = [];
				obj[feature].push(item);
		}
	}
	assignWithoutOverride(target, source) {
		for (const [name, existingValue] of Object.entries(source)) {
			const newValue = target[name];
			if (newValue === void 0) target[name] = existingValue;
			else if (Array.isArray(newValue) && Array.isArray(existingValue)) {
				existingValue.push(...newValue);
				target[name] = existingValue;
			}
		}
		const targetCstNode = target.$cstNode;
		if (targetCstNode) {
			targetCstNode.astNode = void 0;
			target.$cstNode = void 0;
		}
		return target;
	}
	get definitionErrors() {
		return this.wrapper.definitionErrors;
	}
};
var AbstractParserErrorMessageProvider = class {
	buildMismatchTokenMessage(options) {
		return defaultParserErrorProvider.buildMismatchTokenMessage(options);
	}
	buildNotAllInputParsedMessage(options) {
		return defaultParserErrorProvider.buildNotAllInputParsedMessage(options);
	}
	buildNoViableAltMessage(options) {
		return defaultParserErrorProvider.buildNoViableAltMessage(options);
	}
	buildEarlyExitMessage(options) {
		return defaultParserErrorProvider.buildEarlyExitMessage(options);
	}
};
var LangiumParserErrorMessageProvider = class extends AbstractParserErrorMessageProvider {
	buildMismatchTokenMessage({ expected, actual }) {
		return `Expecting ${expected.LABEL ? "`" + expected.LABEL + "`" : expected.name.endsWith(":KW") ? `keyword '${expected.name.substring(0, expected.name.length - 3)}'` : `token of type '${expected.name}'`} but found \`${actual.image}\`.`;
	}
	buildNotAllInputParsedMessage({ firstRedundant }) {
		return `Expecting end of file but found \`${firstRedundant.image}\`.`;
	}
};
var LangiumCompletionParser = class extends AbstractLangiumParser {
	constructor() {
		super(...arguments);
		this.tokens = [];
		this.elementStack = [];
		this.lastElementStack = [];
		this.nextTokenIndex = 0;
		this.stackSize = 0;
	}
	action() {}
	construct() {}
	parse(input) {
		this.resetState();
		const tokens = this.lexer.tokenize(input, { mode: "partial" });
		this.tokens = tokens.tokens;
		this.wrapper.input = [...this.tokens];
		this.mainRule.call(this.wrapper, {});
		this.unorderedGroups.clear();
		return {
			tokens: this.tokens,
			elementStack: [...this.lastElementStack],
			tokenIndex: this.nextTokenIndex
		};
	}
	rule(rule, impl) {
		const ruleMethod = this.wrapper.DEFINE_RULE(withRuleSuffix(rule.name), this.startImplementation(impl).bind(this));
		this.allRules.set(rule.name, ruleMethod);
		if (rule.entry) this.mainRule = ruleMethod;
		return ruleMethod;
	}
	resetState() {
		this.elementStack = [];
		this.lastElementStack = [];
		this.nextTokenIndex = 0;
		this.stackSize = 0;
	}
	startImplementation(implementation) {
		return (args) => {
			const size = this.keepStackSize();
			try {
				implementation(args);
			} finally {
				this.resetStackSize(size);
			}
		};
	}
	removeUnexpectedElements() {
		this.elementStack.splice(this.stackSize);
	}
	keepStackSize() {
		const size = this.elementStack.length;
		this.stackSize = size;
		return size;
	}
	resetStackSize(size) {
		this.removeUnexpectedElements();
		this.stackSize = size;
	}
	consume(idx, tokenType, feature) {
		this.wrapper.wrapConsume(idx, tokenType);
		if (!this.isRecording()) {
			this.lastElementStack = [...this.elementStack, feature];
			this.nextTokenIndex = this.currIdx + 1;
		}
	}
	subrule(idx, rule, fragment, feature, args) {
		this.before(feature);
		this.wrapper.wrapSubrule(idx, rule, args);
		this.after(feature);
	}
	before(element) {
		if (!this.isRecording()) this.elementStack.push(element);
	}
	after(element) {
		if (!this.isRecording()) {
			const index = this.elementStack.lastIndexOf(element);
			if (index >= 0) this.elementStack.splice(index);
		}
	}
	get currIdx() {
		return this.wrapper.currIdx;
	}
};
var defaultConfig = {
	recoveryEnabled: true,
	nodeLocationTracking: "full",
	skipValidations: true,
	errorMessageProvider: new LangiumParserErrorMessageProvider()
};
/**
* This class wraps the embedded actions parser of chevrotain and exposes protected methods.
* This way, we can build the `LangiumParser` as a composition.
*/
var ChevrotainWrapper = class extends EmbeddedActionsParser {
	constructor(tokens, config) {
		const useDefaultLookahead = config && "maxLookahead" in config;
		super(tokens, Object.assign(Object.assign(Object.assign({}, defaultConfig), { lookaheadStrategy: useDefaultLookahead ? new LLkLookaheadStrategy({ maxLookahead: config.maxLookahead }) : new LLStarLookaheadStrategy({ logging: config.skipValidations ? () => {} : void 0 }) }), config));
	}
	get IS_RECORDING() {
		return this.RECORDING_PHASE;
	}
	DEFINE_RULE(name, impl) {
		return this.RULE(name, impl);
	}
	wrapSelfAnalysis() {
		this.performSelfAnalysis();
	}
	wrapConsume(idx, tokenType) {
		return this.consume(idx, tokenType);
	}
	wrapSubrule(idx, rule, args) {
		return this.subrule(idx, rule, { ARGS: [args] });
	}
	wrapOr(idx, choices) {
		this.or(idx, choices);
	}
	wrapOption(idx, callback) {
		this.option(idx, callback);
	}
	wrapMany(idx, callback) {
		this.many(idx, callback);
	}
	wrapAtLeastOne(idx, callback) {
		this.atLeastOne(idx, callback);
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/parser/parser-builder-base.js
/******************************************************************************
* Copyright 2022 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
function createParser(grammar, parser, tokens) {
	buildRules({
		parser,
		tokens,
		ruleNames: /* @__PURE__ */ new Map()
	}, grammar);
	return parser;
}
function buildRules(parserContext, grammar) {
	const reachable = getAllReachableRules(grammar, false);
	const parserRules = stream(grammar.rules).filter(isParserRule).filter((rule) => reachable.has(rule));
	for (const rule of parserRules) {
		const ctx = Object.assign(Object.assign({}, parserContext), {
			consume: 1,
			optional: 1,
			subrule: 1,
			many: 1,
			or: 1
		});
		parserContext.parser.rule(rule, buildElement(ctx, rule.definition));
	}
}
function buildElement(ctx, element, ignoreGuard = false) {
	let method;
	if (isKeyword(element)) method = buildKeyword(ctx, element);
	else if (isAction(element)) method = buildAction(ctx, element);
	else if (isAssignment(element)) method = buildElement(ctx, element.terminal);
	else if (isCrossReference(element)) method = buildCrossReference(ctx, element);
	else if (isRuleCall(element)) method = buildRuleCall(ctx, element);
	else if (isAlternatives(element)) method = buildAlternatives(ctx, element);
	else if (isUnorderedGroup(element)) method = buildUnorderedGroup(ctx, element);
	else if (isGroup(element)) method = buildGroup(ctx, element);
	else if (isEndOfFile(element)) {
		const idx = ctx.consume++;
		method = () => ctx.parser.consume(idx, EOF, element);
	} else throw new ErrorWithLocation(element.$cstNode, `Unexpected element type: ${element.$type}`);
	return wrap(ctx, ignoreGuard ? void 0 : getGuardCondition(element), method, element.cardinality);
}
function buildAction(ctx, action) {
	const actionType = getTypeName(action);
	return () => ctx.parser.action(actionType, action);
}
function buildRuleCall(ctx, ruleCall) {
	const rule = ruleCall.rule.ref;
	if (isParserRule(rule)) {
		const idx = ctx.subrule++;
		const fragment = rule.fragment;
		const predicate = ruleCall.arguments.length > 0 ? buildRuleCallPredicate(rule, ruleCall.arguments) : () => ({});
		return (args) => ctx.parser.subrule(idx, getRule(ctx, rule), fragment, ruleCall, predicate(args));
	} else if (isTerminalRule(rule)) {
		const idx = ctx.consume++;
		const method = getToken(ctx, rule.name);
		return () => ctx.parser.consume(idx, method, ruleCall);
	} else if (!rule) throw new ErrorWithLocation(ruleCall.$cstNode, `Undefined rule: ${ruleCall.rule.$refText}`);
	else assertUnreachable(rule);
}
function buildRuleCallPredicate(rule, namedArgs) {
	const predicates = namedArgs.map((e) => buildPredicate(e.value));
	return (args) => {
		const ruleArgs = {};
		for (let i = 0; i < predicates.length; i++) {
			const ruleTarget = rule.parameters[i];
			const predicate = predicates[i];
			ruleArgs[ruleTarget.name] = predicate(args);
		}
		return ruleArgs;
	};
}
function buildPredicate(condition) {
	if (isDisjunction(condition)) {
		const left = buildPredicate(condition.left);
		const right = buildPredicate(condition.right);
		return (args) => left(args) || right(args);
	} else if (isConjunction(condition)) {
		const left = buildPredicate(condition.left);
		const right = buildPredicate(condition.right);
		return (args) => left(args) && right(args);
	} else if (isNegation(condition)) {
		const value = buildPredicate(condition.value);
		return (args) => !value(args);
	} else if (isParameterReference(condition)) {
		const name = condition.parameter.ref.name;
		return (args) => args !== void 0 && args[name] === true;
	} else if (isBooleanLiteral(condition)) {
		const value = Boolean(condition.true);
		return () => value;
	}
	assertUnreachable(condition);
}
function buildAlternatives(ctx, alternatives) {
	if (alternatives.elements.length === 1) return buildElement(ctx, alternatives.elements[0]);
	else {
		const methods = [];
		for (const element of alternatives.elements) {
			const predicatedMethod = { ALT: buildElement(ctx, element, true) };
			const guard = getGuardCondition(element);
			if (guard) predicatedMethod.GATE = buildPredicate(guard);
			methods.push(predicatedMethod);
		}
		const idx = ctx.or++;
		return (args) => ctx.parser.alternatives(idx, methods.map((method) => {
			const alt = { ALT: () => method.ALT(args) };
			const gate = method.GATE;
			if (gate) alt.GATE = () => gate(args);
			return alt;
		}));
	}
}
function buildUnorderedGroup(ctx, group) {
	if (group.elements.length === 1) return buildElement(ctx, group.elements[0]);
	const methods = [];
	for (const element of group.elements) {
		const predicatedMethod = { ALT: buildElement(ctx, element, true) };
		const guard = getGuardCondition(element);
		if (guard) predicatedMethod.GATE = buildPredicate(guard);
		methods.push(predicatedMethod);
	}
	const orIdx = ctx.or++;
	const idFunc = (groupIdx, lParser) => {
		return `uGroup_${groupIdx}_${lParser.getRuleStack().join("-")}`;
	};
	const alternatives = (args) => ctx.parser.alternatives(orIdx, methods.map((method, idx) => {
		const alt = { ALT: () => true };
		const parser = ctx.parser;
		alt.ALT = () => {
			method.ALT(args);
			if (!parser.isRecording()) {
				const key = idFunc(orIdx, parser);
				if (!parser.unorderedGroups.get(key)) parser.unorderedGroups.set(key, []);
				const groupState = parser.unorderedGroups.get(key);
				if (typeof (groupState === null || groupState === void 0 ? void 0 : groupState[idx]) === "undefined") groupState[idx] = true;
			}
		};
		const gate = method.GATE;
		if (gate) alt.GATE = () => gate(args);
		else alt.GATE = () => {
			const trackedAlternatives = parser.unorderedGroups.get(idFunc(orIdx, parser));
			return !(trackedAlternatives === null || trackedAlternatives === void 0 ? void 0 : trackedAlternatives[idx]);
		};
		return alt;
	}));
	const wrapped = wrap(ctx, getGuardCondition(group), alternatives, "*");
	return (args) => {
		wrapped(args);
		if (!ctx.parser.isRecording()) ctx.parser.unorderedGroups.delete(idFunc(orIdx, ctx.parser));
	};
}
function buildGroup(ctx, group) {
	const methods = group.elements.map((e) => buildElement(ctx, e));
	return (args) => methods.forEach((method) => method(args));
}
function getGuardCondition(element) {
	if (isGroup(element)) return element.guardCondition;
}
function buildCrossReference(ctx, crossRef, terminal = crossRef.terminal) {
	if (!terminal) {
		if (!crossRef.type.ref) throw new Error("Could not resolve reference to type: " + crossRef.type.$refText);
		const assignment = findNameAssignment(crossRef.type.ref);
		const assignTerminal = assignment === null || assignment === void 0 ? void 0 : assignment.terminal;
		if (!assignTerminal) throw new Error("Could not find name assignment for type: " + getTypeName(crossRef.type.ref));
		return buildCrossReference(ctx, crossRef, assignTerminal);
	} else if (isRuleCall(terminal) && isParserRule(terminal.rule.ref)) {
		const rule = terminal.rule.ref;
		const idx = ctx.subrule++;
		return (args) => ctx.parser.subrule(idx, getRule(ctx, rule), false, crossRef, args);
	} else if (isRuleCall(terminal) && isTerminalRule(terminal.rule.ref)) {
		const idx = ctx.consume++;
		const terminalRule = getToken(ctx, terminal.rule.ref.name);
		return () => ctx.parser.consume(idx, terminalRule, crossRef);
	} else if (isKeyword(terminal)) {
		const idx = ctx.consume++;
		const keyword = getToken(ctx, terminal.value);
		return () => ctx.parser.consume(idx, keyword, crossRef);
	} else throw new Error("Could not build cross reference parser");
}
function buildKeyword(ctx, keyword) {
	const idx = ctx.consume++;
	const token = ctx.tokens[keyword.value];
	if (!token) throw new Error("Could not find token for keyword: " + keyword.value);
	return () => ctx.parser.consume(idx, token, keyword);
}
function wrap(ctx, guard, method, cardinality) {
	const gate = guard && buildPredicate(guard);
	if (!cardinality) {
		if (gate) {
			const idx = ctx.or++;
			return (args) => ctx.parser.alternatives(idx, [{
				ALT: () => method(args),
				GATE: () => gate(args)
			}, {
				ALT: EMPTY_ALT(),
				GATE: () => !gate(args)
			}]);
		} else return method;
	}
	if (cardinality === "*") {
		const idx = ctx.many++;
		return (args) => ctx.parser.many(idx, {
			DEF: () => method(args),
			GATE: gate ? () => gate(args) : void 0
		});
	} else if (cardinality === "+") {
		const idx = ctx.many++;
		if (gate) {
			const orIdx = ctx.or++;
			return (args) => ctx.parser.alternatives(orIdx, [{
				ALT: () => ctx.parser.atLeastOne(idx, { DEF: () => method(args) }),
				GATE: () => gate(args)
			}, {
				ALT: EMPTY_ALT(),
				GATE: () => !gate(args)
			}]);
		} else return (args) => ctx.parser.atLeastOne(idx, { DEF: () => method(args) });
	} else if (cardinality === "?") {
		const idx = ctx.optional++;
		return (args) => ctx.parser.optional(idx, {
			DEF: () => method(args),
			GATE: gate ? () => gate(args) : void 0
		});
	} else assertUnreachable(cardinality);
}
function getRule(ctx, element) {
	const name = getRuleName(ctx, element);
	const rule = ctx.parser.getRule(name);
	if (!rule) throw new Error(`Rule "${name}" not found."`);
	return rule;
}
function getRuleName(ctx, element) {
	if (isParserRule(element)) return element.name;
	else if (ctx.ruleNames.has(element)) return ctx.ruleNames.get(element);
	else {
		let item = element;
		let parent = item.$container;
		let ruleName = element.$type;
		while (!isParserRule(parent)) {
			if (isGroup(parent) || isAlternatives(parent) || isUnorderedGroup(parent)) ruleName = parent.elements.indexOf(item).toString() + ":" + ruleName;
			item = parent;
			parent = parent.$container;
		}
		ruleName = parent.name + ":" + ruleName;
		ctx.ruleNames.set(element, ruleName);
		return ruleName;
	}
}
function getToken(ctx, name) {
	const token = ctx.tokens[name];
	if (!token) throw new Error(`Token "${name}" not found."`);
	return token;
}
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/parser/completion-parser-builder.js
/******************************************************************************
* Copyright 2022 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
function createCompletionParser(services) {
	const grammar = services.Grammar;
	const lexer = services.parser.Lexer;
	const parser = new LangiumCompletionParser(services);
	createParser(grammar, parser, lexer.definition);
	parser.finalize();
	return parser;
}
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/parser/langium-parser-builder.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
/**
* Create and finalize a Langium parser. The parser rules are derived from the grammar, which is
* available at `services.Grammar`.
*/
function createLangiumParser(services) {
	const parser = prepareLangiumParser(services);
	parser.finalize();
	return parser;
}
/**
* Create a Langium parser without finalizing it. This is used to extract more detailed error
* information when the parser is initially validated.
*/
function prepareLangiumParser(services) {
	const grammar = services.Grammar;
	const lexer = services.parser.Lexer;
	return createParser(grammar, new LangiumParser(services), lexer.definition);
}
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/parser/token-builder.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var DefaultTokenBuilder = class {
	constructor() {
		/**
		* The list of diagnostics stored during the lexing process of a single text.
		*/
		this.diagnostics = [];
	}
	buildTokens(grammar, options) {
		const reachableRules = stream(getAllReachableRules(grammar, false));
		const terminalTokens = this.buildTerminalTokens(reachableRules);
		const tokens = this.buildKeywordTokens(reachableRules, terminalTokens, options);
		terminalTokens.forEach((terminalToken) => {
			const pattern = terminalToken.PATTERN;
			if (typeof pattern === "object" && pattern && "test" in pattern && isWhitespace(pattern)) tokens.unshift(terminalToken);
			else tokens.push(terminalToken);
		});
		return tokens;
	}
	flushLexingReport(text) {
		return { diagnostics: this.popDiagnostics() };
	}
	popDiagnostics() {
		const diagnostics = [...this.diagnostics];
		this.diagnostics = [];
		return diagnostics;
	}
	buildTerminalTokens(rules) {
		return rules.filter(isTerminalRule).filter((e) => !e.fragment).map((terminal) => this.buildTerminalToken(terminal)).toArray();
	}
	buildTerminalToken(terminal) {
		const regex = terminalRegex(terminal);
		const pattern = this.requiresCustomPattern(regex) ? this.regexPatternFunction(regex) : regex;
		const tokenType = {
			name: terminal.name,
			PATTERN: pattern
		};
		if (typeof pattern === "function") tokenType.LINE_BREAKS = true;
		if (terminal.hidden) tokenType.GROUP = isWhitespace(regex) ? Lexer.SKIPPED : "hidden";
		return tokenType;
	}
	requiresCustomPattern(regex) {
		if (regex.flags.includes("u") || regex.flags.includes("s")) return true;
		else if (regex.source.includes("?<=") || regex.source.includes("?<!")) return true;
		else return false;
	}
	regexPatternFunction(regex) {
		const stickyRegex = new RegExp(regex, regex.flags + "y");
		return (text, offset) => {
			stickyRegex.lastIndex = offset;
			return stickyRegex.exec(text);
		};
	}
	buildKeywordTokens(rules, terminalTokens, options) {
		return rules.filter(isParserRule).flatMap((rule) => streamAllContents(rule).filter(isKeyword)).distinct((e) => e.value).toArray().sort((a, b) => b.value.length - a.value.length).map((keyword) => this.buildKeywordToken(keyword, terminalTokens, Boolean(options === null || options === void 0 ? void 0 : options.caseInsensitive)));
	}
	buildKeywordToken(keyword, terminalTokens, caseInsensitive) {
		const keywordPattern = this.buildKeywordPattern(keyword, caseInsensitive);
		const tokenType = {
			name: keyword.value,
			PATTERN: keywordPattern,
			LONGER_ALT: this.findLongerAlt(keyword, terminalTokens)
		};
		if (typeof keywordPattern === "function") tokenType.LINE_BREAKS = true;
		return tokenType;
	}
	buildKeywordPattern(keyword, caseInsensitive) {
		return caseInsensitive ? new RegExp(getCaseInsensitivePattern(keyword.value)) : keyword.value;
	}
	findLongerAlt(keyword, terminalTokens) {
		return terminalTokens.reduce((longerAlts, token) => {
			const pattern = token === null || token === void 0 ? void 0 : token.PATTERN;
			if ((pattern === null || pattern === void 0 ? void 0 : pattern.source) && partialMatches("^" + pattern.source + "$", keyword.value)) longerAlts.push(token);
			return longerAlts;
		}, []);
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/parser/value-converter.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var DefaultValueConverter = class {
	convert(input, cstNode) {
		let feature = cstNode.grammarSource;
		if (isCrossReference(feature)) feature = getCrossReferenceTerminal(feature);
		if (isRuleCall(feature)) {
			const rule = feature.rule.ref;
			if (!rule) throw new Error("This cst node was not parsed by a rule.");
			return this.runConverter(rule, input, cstNode);
		}
		return input;
	}
	runConverter(rule, input, cstNode) {
		var _a;
		switch (rule.name.toUpperCase()) {
			case "INT": return ValueConverter.convertInt(input);
			case "STRING": return ValueConverter.convertString(input);
			case "ID": return ValueConverter.convertID(input);
		}
		switch ((_a = getRuleType(rule)) === null || _a === void 0 ? void 0 : _a.toLowerCase()) {
			case "number": return ValueConverter.convertNumber(input);
			case "boolean": return ValueConverter.convertBoolean(input);
			case "bigint": return ValueConverter.convertBigint(input);
			case "date": return ValueConverter.convertDate(input);
			default: return input;
		}
	}
};
var ValueConverter;
(function(ValueConverter) {
	function convertString(input) {
		let result = "";
		for (let i = 1; i < input.length - 1; i++) {
			const c = input.charAt(i);
			if (c === "\\") {
				const c1 = input.charAt(++i);
				result += convertEscapeCharacter(c1);
			} else result += c;
		}
		return result;
	}
	ValueConverter.convertString = convertString;
	function convertEscapeCharacter(char) {
		switch (char) {
			case "b": return "\b";
			case "f": return "\f";
			case "n": return "\n";
			case "r": return "\r";
			case "t": return "	";
			case "v": return "\v";
			case "0": return "\0";
			default: return char;
		}
	}
	function convertID(input) {
		if (input.charAt(0) === "^") return input.substring(1);
		else return input;
	}
	ValueConverter.convertID = convertID;
	function convertInt(input) {
		return parseInt(input);
	}
	ValueConverter.convertInt = convertInt;
	function convertBigint(input) {
		return BigInt(input);
	}
	ValueConverter.convertBigint = convertBigint;
	function convertDate(input) {
		return new Date(input);
	}
	ValueConverter.convertDate = convertDate;
	function convertNumber(input) {
		return Number(input);
	}
	ValueConverter.convertNumber = convertNumber;
	function convertBoolean(input) {
		return input.toLowerCase() === "true";
	}
	ValueConverter.convertBoolean = convertBoolean;
})(ValueConverter || (ValueConverter = {}));
// ../../node_modules/.pnpm/vscode-jsonrpc@8.2.0/node_modules/vscode-jsonrpc/lib/common/ral.js
var require_ral = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _ral;
	function RAL() {
		if (_ral === void 0) throw new Error(`No runtime abstraction layer installed`);
		return _ral;
	}
	(function(RAL) {
		function install(ral) {
			if (ral === void 0) throw new Error(`No runtime abstraction layer provided`);
			_ral = ral;
		}
		RAL.install = install;
	})(RAL || (RAL = {}));
	exports.default = RAL;
}));
// ../../node_modules/.pnpm/vscode-jsonrpc@8.2.0/node_modules/vscode-jsonrpc/lib/common/is.js
var require_is = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.stringArray = exports.array = exports.func = exports.error = exports.number = exports.string = exports.boolean = void 0;
	function boolean(value) {
		return value === true || value === false;
	}
	exports.boolean = boolean;
	function string(value) {
		return typeof value === "string" || value instanceof String;
	}
	exports.string = string;
	function number(value) {
		return typeof value === "number" || value instanceof Number;
	}
	exports.number = number;
	function error(value) {
		return value instanceof Error;
	}
	exports.error = error;
	function func(value) {
		return typeof value === "function";
	}
	exports.func = func;
	function array(value) {
		return Array.isArray(value);
	}
	exports.array = array;
	function stringArray(value) {
		return array(value) && value.every((elem) => string(elem));
	}
	exports.stringArray = stringArray;
}));
// ../../node_modules/.pnpm/vscode-jsonrpc@8.2.0/node_modules/vscode-jsonrpc/lib/common/events.js
var require_events = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Emitter = exports.Event = void 0;
	var ral_1 = require_ral();
	var Event;
	(function(Event) {
		const _disposable = { dispose() {} };
		Event.None = function() {
			return _disposable;
		};
	})(Event || (exports.Event = Event = {}));
	var CallbackList = class {
		add(callback, context = null, bucket) {
			if (!this._callbacks) {
				this._callbacks = [];
				this._contexts = [];
			}
			this._callbacks.push(callback);
			this._contexts.push(context);
			if (Array.isArray(bucket)) bucket.push({ dispose: () => this.remove(callback, context) });
		}
		remove(callback, context = null) {
			if (!this._callbacks) return;
			let foundCallbackWithDifferentContext = false;
			for (let i = 0, len = this._callbacks.length; i < len; i++) if (this._callbacks[i] === callback) {
				if (this._contexts[i] === context) {
					this._callbacks.splice(i, 1);
					this._contexts.splice(i, 1);
					return;
				} else foundCallbackWithDifferentContext = true;
			}
			if (foundCallbackWithDifferentContext) throw new Error("When adding a listener with a context, you should remove it with the same context");
		}
		invoke(...args) {
			if (!this._callbacks) return [];
			const ret = [], callbacks = this._callbacks.slice(0), contexts = this._contexts.slice(0);
			for (let i = 0, len = callbacks.length; i < len; i++) try {
				ret.push(callbacks[i].apply(contexts[i], args));
			} catch (e) {
				(0, ral_1.default)().console.error(e);
			}
			return ret;
		}
		isEmpty() {
			return !this._callbacks || this._callbacks.length === 0;
		}
		dispose() {
			this._callbacks = void 0;
			this._contexts = void 0;
		}
	};
	var Emitter = class Emitter {
		constructor(_options) {
			this._options = _options;
		}
		/**
		* For the public to allow to subscribe
		* to events from this Emitter
		*/
		get event() {
			if (!this._event) this._event = (listener, thisArgs, disposables) => {
				if (!this._callbacks) this._callbacks = new CallbackList();
				if (this._options && this._options.onFirstListenerAdd && this._callbacks.isEmpty()) this._options.onFirstListenerAdd(this);
				this._callbacks.add(listener, thisArgs);
				const result = { dispose: () => {
					if (!this._callbacks) return;
					this._callbacks.remove(listener, thisArgs);
					result.dispose = Emitter._noop;
					if (this._options && this._options.onLastListenerRemove && this._callbacks.isEmpty()) this._options.onLastListenerRemove(this);
				} };
				if (Array.isArray(disposables)) disposables.push(result);
				return result;
			};
			return this._event;
		}
		/**
		* To be kept private to fire an event to
		* subscribers
		*/
		fire(event) {
			if (this._callbacks) this._callbacks.invoke.call(this._callbacks, event);
		}
		dispose() {
			if (this._callbacks) {
				this._callbacks.dispose();
				this._callbacks = void 0;
			}
		}
	};
	exports.Emitter = Emitter;
	Emitter._noop = function() {};
}));
// ../../node_modules/.pnpm/vscode-jsonrpc@8.2.0/node_modules/vscode-jsonrpc/lib/common/cancellation.js
var require_cancellation = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CancellationTokenSource = exports.CancellationToken = void 0;
	var ral_1 = require_ral();
	var Is = require_is();
	var events_1 = require_events();
	var CancellationToken;
	(function(CancellationToken) {
		CancellationToken.None = Object.freeze({
			isCancellationRequested: false,
			onCancellationRequested: events_1.Event.None
		});
		CancellationToken.Cancelled = Object.freeze({
			isCancellationRequested: true,
			onCancellationRequested: events_1.Event.None
		});
		function is(value) {
			const candidate = value;
			return candidate && (candidate === CancellationToken.None || candidate === CancellationToken.Cancelled || Is.boolean(candidate.isCancellationRequested) && !!candidate.onCancellationRequested);
		}
		CancellationToken.is = is;
	})(CancellationToken || (exports.CancellationToken = CancellationToken = {}));
	var shortcutEvent = Object.freeze(function(callback, context) {
		const handle = (0, ral_1.default)().timer.setTimeout(callback.bind(context), 0);
		return { dispose() {
			handle.dispose();
		} };
	});
	var MutableToken = class {
		constructor() {
			this._isCancelled = false;
		}
		cancel() {
			if (!this._isCancelled) {
				this._isCancelled = true;
				if (this._emitter) {
					this._emitter.fire(void 0);
					this.dispose();
				}
			}
		}
		get isCancellationRequested() {
			return this._isCancelled;
		}
		get onCancellationRequested() {
			if (this._isCancelled) return shortcutEvent;
			if (!this._emitter) this._emitter = new events_1.Emitter();
			return this._emitter.event;
		}
		dispose() {
			if (this._emitter) {
				this._emitter.dispose();
				this._emitter = void 0;
			}
		}
	};
	var CancellationTokenSource = class {
		get token() {
			if (!this._token) this._token = new MutableToken();
			return this._token;
		}
		cancel() {
			if (!this._token) this._token = CancellationToken.Cancelled;
			else this._token.cancel();
		}
		dispose() {
			if (!this._token) this._token = CancellationToken.None;
			else if (this._token instanceof MutableToken) this._token.dispose();
		}
	};
	exports.CancellationTokenSource = CancellationTokenSource;
}));
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/utils/cancellation.js
var cancellation_exports = /* @__PURE__ */ __exportAll({});
__reExport(cancellation_exports, /* @__PURE__ */ __toESM(require_cancellation(), 1));
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/utils/promise-utils.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
/**
* Delays the execution of the current code to the next tick of the event loop.
* Don't call this method directly in a tight loop to prevent too many promises from being created.
*/
function delayNextTick() {
	return new Promise((resolve) => {
		if (typeof setImmediate === "undefined") setTimeout(resolve, 0);
		else setImmediate(resolve);
	});
}
var lastTick = 0;
var globalInterruptionPeriod = 10;
/**
* Reset the global interruption period and create a cancellation token source.
*/
function startCancelableOperation() {
	lastTick = performance.now();
	return new cancellation_exports.CancellationTokenSource();
}
/**
* Change the period duration for `interruptAndCheck` to the given number of milliseconds.
* The default value is 10ms.
*/
function setInterruptionPeriod(period) {
	globalInterruptionPeriod = period;
}
/**
* This symbol may be thrown in an asynchronous context by any Langium service that receives
* a `CancellationToken`. This means that the promise returned by such a service is rejected with
* this symbol as rejection reason.
*/
var OperationCancelled = Symbol("OperationCancelled");
/**
* Use this in a `catch` block to check whether the thrown object indicates that the operation
* has been cancelled.
*/
function isOperationCancelled(err) {
	return err === OperationCancelled;
}
/**
* This function does two things:
*  1. Check the elapsed time since the last call to this function or to `startCancelableOperation`. If the predefined
*     period (configured with `setInterruptionPeriod`) is exceeded, execution is delayed with `delayNextTick`.
*  2. If the predefined period is not met yet or execution is resumed after an interruption, the given cancellation
*     token is checked, and if cancellation is requested, `OperationCanceled` is thrown.
*
* All services in Langium that receive a `CancellationToken` may potentially call this function, so the
* `CancellationToken` must be caught (with an `async` try-catch block or a `catch` callback attached to
* the promise) to avoid that event being exposed as an error.
*/
async function interruptAndCheck(token) {
	if (token === cancellation_exports.CancellationToken.None) return;
	const current = performance.now();
	if (current - lastTick >= globalInterruptionPeriod) {
		lastTick = current;
		await delayNextTick();
		lastTick = performance.now();
	}
	if (token.isCancellationRequested) throw OperationCancelled;
}
/**
* Simple implementation of the deferred pattern.
* An object that exposes a promise and functions to resolve and reject it.
*/
var Deferred = class {
	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.resolve = (arg) => {
				resolve(arg);
				return this;
			};
			this.reject = (err) => {
				reject(err);
				return this;
			};
		});
	}
};
// ../../node_modules/.pnpm/vscode-languageserver-textdocument@1.0.14/node_modules/vscode-languageserver-textdocument/lib/esm/main.js
var FullTextDocument = class FullTextDocument {
	constructor(uri, languageId, version, content) {
		this._uri = uri;
		this._languageId = languageId;
		this._version = version;
		this._content = content;
		this._lineOffsets = void 0;
	}
	get uri() {
		return this._uri;
	}
	get languageId() {
		return this._languageId;
	}
	get version() {
		return this._version;
	}
	getText(range) {
		if (range) {
			const start = this.offsetAt(range.start);
			const end = this.offsetAt(range.end);
			return this._content.substring(start, end);
		}
		return this._content;
	}
	update(changes, version) {
		for (const change of changes) if (FullTextDocument.isIncremental(change)) {
			const range = getWellformedRange(change.range);
			const startOffset = this.offsetAt(range.start);
			const endOffset = this.offsetAt(range.end);
			this._content = this._content.substring(0, startOffset) + change.text + this._content.substring(endOffset, this._content.length);
			const startLine = Math.max(range.start.line, 0);
			const endLine = Math.max(range.end.line, 0);
			let lineOffsets = this._lineOffsets;
			const addedLineOffsets = computeLineOffsets(change.text, false, startOffset);
			if (endLine - startLine === addedLineOffsets.length) for (let i = 0, len = addedLineOffsets.length; i < len; i++) lineOffsets[i + startLine + 1] = addedLineOffsets[i];
			else if (addedLineOffsets.length < 1e4) lineOffsets.splice(startLine + 1, endLine - startLine, ...addedLineOffsets);
			else this._lineOffsets = lineOffsets = lineOffsets.slice(0, startLine + 1).concat(addedLineOffsets, lineOffsets.slice(endLine + 1));
			const diff = change.text.length - (endOffset - startOffset);
			if (diff !== 0) for (let i = startLine + 1 + addedLineOffsets.length, len = lineOffsets.length; i < len; i++) lineOffsets[i] = lineOffsets[i] + diff;
		} else if (FullTextDocument.isFull(change)) {
			this._content = change.text;
			this._lineOffsets = void 0;
		} else throw new Error("Unknown change event received");
		this._version = version;
	}
	getLineOffsets() {
		if (this._lineOffsets === void 0) this._lineOffsets = computeLineOffsets(this._content, true);
		return this._lineOffsets;
	}
	positionAt(offset) {
		offset = Math.max(Math.min(offset, this._content.length), 0);
		const lineOffsets = this.getLineOffsets();
		let low = 0, high = lineOffsets.length;
		if (high === 0) return {
			line: 0,
			character: offset
		};
		while (low < high) {
			const mid = Math.floor((low + high) / 2);
			if (lineOffsets[mid] > offset) high = mid;
			else low = mid + 1;
		}
		const line = low - 1;
		offset = this.ensureBeforeEOL(offset, lineOffsets[line]);
		return {
			line,
			character: offset - lineOffsets[line]
		};
	}
	offsetAt(position) {
		const lineOffsets = this.getLineOffsets();
		if (position.line >= lineOffsets.length) return this._content.length;
		else if (position.line < 0) return 0;
		const lineOffset = lineOffsets[position.line];
		if (position.character <= 0) return lineOffset;
		const nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : this._content.length;
		const offset = Math.min(lineOffset + position.character, nextLineOffset);
		return this.ensureBeforeEOL(offset, lineOffset);
	}
	getLineRange(line) {
		const lineOffsets = this.getLineOffsets();
		if (line >= lineOffsets.length) {
			const lastLine = lineOffsets.length - 1;
			return {
				start: {
					line: lastLine,
					character: 0
				},
				end: {
					line: lastLine,
					character: this._content.length - lineOffsets[lastLine]
				}
			};
		} else if (line < 0) return {
			start: {
				line: 0,
				character: 0
			},
			end: {
				line: 0,
				character: 0
			}
		};
		const startOffset = lineOffsets[line];
		const nextLineOffset = line + 1 < lineOffsets.length ? lineOffsets[line + 1] : this._content.length;
		const endOffset = this.ensureBeforeEOL(nextLineOffset, startOffset);
		return {
			start: {
				line,
				character: 0
			},
			end: {
				line,
				character: endOffset - startOffset
			}
		};
	}
	getEOLCharacters(line) {
		const lineOffsets = this.getLineOffsets();
		if (line >= lineOffsets.length) return "";
		else if (line < 0) return "";
		const nextLineOffset = line + 1 < lineOffsets.length ? lineOffsets[line + 1] : this._content.length;
		const eolOffset = this.ensureBeforeEOL(nextLineOffset, lineOffsets[line]);
		return this._content.substring(eolOffset, nextLineOffset);
	}
	ensureBeforeEOL(offset, lineOffset) {
		while (offset > lineOffset && isEOL(this._content.charCodeAt(offset - 1))) offset--;
		return offset;
	}
	get lineCount() {
		return this.getLineOffsets().length;
	}
	static isIncremental(event) {
		const candidate = event;
		return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range !== void 0 && (candidate.rangeLength === void 0 || typeof candidate.rangeLength === "number");
	}
	static isFull(event) {
		const candidate = event;
		return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range === void 0 && candidate.rangeLength === void 0;
	}
};
var TextDocument;
(function(TextDocument) {
	/**
	* Creates a new text document.
	*
	* @param uri The document's uri.
	* @param languageId  The document's language Id.
	* @param version The document's initial version number.
	* @param content The document's content.
	*/
	function create(uri, languageId, version, content) {
		return new FullTextDocument(uri, languageId, version, content);
	}
	TextDocument.create = create;
	/**
	* Updates a TextDocument by modifying its content.
	*
	* @param document the document to update. Only documents created by TextDocument.create are valid inputs.
	* @param changes the changes to apply to the document.
	* @param version the changes version for the document.
	* @returns The updated TextDocument. Note: That's the same document instance passed in as first parameter.
	*
	*/
	function update(document, changes, version) {
		if (document instanceof FullTextDocument) {
			document.update(changes, version);
			return document;
		} else throw new Error("TextDocument.update: document must be created by TextDocument.create");
	}
	TextDocument.update = update;
	function applyEdits(document, edits) {
		const text = document.getText();
		const sortedEdits = mergeSort(edits.map(getWellformedEdit), (a, b) => {
			const diff = a.range.start.line - b.range.start.line;
			if (diff === 0) return a.range.start.character - b.range.start.character;
			return diff;
		});
		let lastModifiedOffset = 0;
		const spans = [];
		for (const e of sortedEdits) {
			const startOffset = document.offsetAt(e.range.start);
			if (startOffset < lastModifiedOffset) throw new Error("Overlapping edit");
			else if (startOffset > lastModifiedOffset) spans.push(text.substring(lastModifiedOffset, startOffset));
			if (e.newText.length) spans.push(e.newText);
			lastModifiedOffset = document.offsetAt(e.range.end);
		}
		spans.push(text.substr(lastModifiedOffset));
		return spans.join("");
	}
	TextDocument.applyEdits = applyEdits;
})(TextDocument || (TextDocument = {}));
function mergeSort(data, compare) {
	if (data.length <= 1) return data;
	const p = data.length / 2 | 0;
	const left = data.slice(0, p);
	const right = data.slice(p);
	mergeSort(left, compare);
	mergeSort(right, compare);
	let leftIdx = 0;
	let rightIdx = 0;
	let i = 0;
	while (leftIdx < left.length && rightIdx < right.length) if (compare(left[leftIdx], right[rightIdx]) <= 0) data[i++] = left[leftIdx++];
	else data[i++] = right[rightIdx++];
	while (leftIdx < left.length) data[i++] = left[leftIdx++];
	while (rightIdx < right.length) data[i++] = right[rightIdx++];
	return data;
}
function computeLineOffsets(text, isAtLineStart, textOffset = 0) {
	const result = isAtLineStart ? [textOffset] : [];
	for (let i = 0; i < text.length; i++) {
		const ch = text.charCodeAt(i);
		if (isEOL(ch)) {
			if (ch === 13 && i + 1 < text.length && text.charCodeAt(i + 1) === 10) i++;
			result.push(textOffset + i + 1);
		}
	}
	return result;
}
function isEOL(char) {
	return char === 13 || char === 10;
}
function getWellformedRange(range) {
	const start = range.start;
	const end = range.end;
	if (start.line > end.line || start.line === end.line && start.character > end.character) return {
		start: end,
		end: start
	};
	return range;
}
function getWellformedEdit(textEdit) {
	const range = getWellformedRange(textEdit.range);
	if (range !== textEdit.range) return {
		newText: textEdit.newText,
		range
	};
	return textEdit;
}
// ../../node_modules/.pnpm/vscode-uri@3.0.8/node_modules/vscode-uri/lib/esm/index.mjs
var LIB;
(() => {
	"use strict";
	var t = { 470: (t) => {
		function e(t) {
			if ("string" != typeof t) throw new TypeError("Path must be a string. Received " + JSON.stringify(t));
		}
		function r(t, e) {
			for (var r, n = "", i = 0, o = -1, s = 0, h = 0; h <= t.length; ++h) {
				if (h < t.length) r = t.charCodeAt(h);
				else {
					if (47 === r) break;
					r = 47;
				}
				if (47 === r) {
					if (o === h - 1 || 1 === s);
					else if (o !== h - 1 && 2 === s) {
						if (n.length < 2 || 2 !== i || 46 !== n.charCodeAt(n.length - 1) || 46 !== n.charCodeAt(n.length - 2)) {
							if (n.length > 2) {
								var a = n.lastIndexOf("/");
								if (a !== n.length - 1) {
									-1 === a ? (n = "", i = 0) : i = (n = n.slice(0, a)).length - 1 - n.lastIndexOf("/"), o = h, s = 0;
									continue;
								}
							} else if (2 === n.length || 1 === n.length) {
								n = "", i = 0, o = h, s = 0;
								continue;
							}
						}
						e && (n.length > 0 ? n += "/.." : n = "..", i = 2);
					} else n.length > 0 ? n += "/" + t.slice(o + 1, h) : n = t.slice(o + 1, h), i = h - o - 1;
					o = h, s = 0;
				} else 46 === r && -1 !== s ? ++s : s = -1;
			}
			return n;
		}
		var n = {
			resolve: function() {
				for (var t, n = "", i = !1, o = arguments.length - 1; o >= -1 && !i; o--) {
					var s;
					o >= 0 ? s = arguments[o] : (void 0 === t && (t = process.cwd()), s = t), e(s), 0 !== s.length && (n = s + "/" + n, i = 47 === s.charCodeAt(0));
				}
				return n = r(n, !i), i ? n.length > 0 ? "/" + n : "/" : n.length > 0 ? n : ".";
			},
			normalize: function(t) {
				if (e(t), 0 === t.length) return ".";
				var n = 47 === t.charCodeAt(0), i = 47 === t.charCodeAt(t.length - 1);
				return 0 !== (t = r(t, !n)).length || n || (t = "."), t.length > 0 && i && (t += "/"), n ? "/" + t : t;
			},
			isAbsolute: function(t) {
				return e(t), t.length > 0 && 47 === t.charCodeAt(0);
			},
			join: function() {
				if (0 === arguments.length) return ".";
				for (var t, r = 0; r < arguments.length; ++r) {
					var i = arguments[r];
					e(i), i.length > 0 && (void 0 === t ? t = i : t += "/" + i);
				}
				return void 0 === t ? "." : n.normalize(t);
			},
			relative: function(t, r) {
				if (e(t), e(r), t === r) return "";
				if ((t = n.resolve(t)) === (r = n.resolve(r))) return "";
				for (var i = 1; i < t.length && 47 === t.charCodeAt(i); ++i);
				for (var o = t.length, s = o - i, h = 1; h < r.length && 47 === r.charCodeAt(h); ++h);
				for (var a = r.length - h, c = s < a ? s : a, f = -1, u = 0; u <= c; ++u) {
					if (u === c) {
						if (a > c) {
							if (47 === r.charCodeAt(h + u)) return r.slice(h + u + 1);
							if (0 === u) return r.slice(h + u);
						} else s > c && (47 === t.charCodeAt(i + u) ? f = u : 0 === u && (f = 0));
						break;
					}
					var l = t.charCodeAt(i + u);
					if (l !== r.charCodeAt(h + u)) break;
					47 === l && (f = u);
				}
				var g = "";
				for (u = i + f + 1; u <= o; ++u) u !== o && 47 !== t.charCodeAt(u) || (0 === g.length ? g += ".." : g += "/..");
				return g.length > 0 ? g + r.slice(h + f) : (h += f, 47 === r.charCodeAt(h) && ++h, r.slice(h));
			},
			_makeLong: function(t) {
				return t;
			},
			dirname: function(t) {
				if (e(t), 0 === t.length) return ".";
				for (var r = t.charCodeAt(0), n = 47 === r, i = -1, o = !0, s = t.length - 1; s >= 1; --s) if (47 === (r = t.charCodeAt(s))) {
					if (!o) {
						i = s;
						break;
					}
				} else o = !1;
				return -1 === i ? n ? "/" : "." : n && 1 === i ? "//" : t.slice(0, i);
			},
			basename: function(t, r) {
				if (void 0 !== r && "string" != typeof r) throw new TypeError("\"ext\" argument must be a string");
				e(t);
				var n, i = 0, o = -1, s = !0;
				if (void 0 !== r && r.length > 0 && r.length <= t.length) {
					if (r.length === t.length && r === t) return "";
					var h = r.length - 1, a = -1;
					for (n = t.length - 1; n >= 0; --n) {
						var c = t.charCodeAt(n);
						if (47 === c) {
							if (!s) {
								i = n + 1;
								break;
							}
						} else -1 === a && (s = !1, a = n + 1), h >= 0 && (c === r.charCodeAt(h) ? -1 == --h && (o = n) : (h = -1, o = a));
					}
					return i === o ? o = a : -1 === o && (o = t.length), t.slice(i, o);
				}
				for (n = t.length - 1; n >= 0; --n) if (47 === t.charCodeAt(n)) {
					if (!s) {
						i = n + 1;
						break;
					}
				} else -1 === o && (s = !1, o = n + 1);
				return -1 === o ? "" : t.slice(i, o);
			},
			extname: function(t) {
				e(t);
				for (var r = -1, n = 0, i = -1, o = !0, s = 0, h = t.length - 1; h >= 0; --h) {
					var a = t.charCodeAt(h);
					if (47 !== a) -1 === i && (o = !1, i = h + 1), 46 === a ? -1 === r ? r = h : 1 !== s && (s = 1) : -1 !== r && (s = -1);
					else if (!o) {
						n = h + 1;
						break;
					}
				}
				return -1 === r || -1 === i || 0 === s || 1 === s && r === i - 1 && r === n + 1 ? "" : t.slice(r, i);
			},
			format: function(t) {
				if (null === t || "object" != typeof t) throw new TypeError("The \"pathObject\" argument must be of type Object. Received type " + typeof t);
				return function(t, e) {
					var r = e.dir || e.root, n = e.base || (e.name || "") + (e.ext || "");
					return r ? r === e.root ? r + n : r + "/" + n : n;
				}(0, t);
			},
			parse: function(t) {
				e(t);
				var r = {
					root: "",
					dir: "",
					base: "",
					ext: "",
					name: ""
				};
				if (0 === t.length) return r;
				var n, i = t.charCodeAt(0), o = 47 === i;
				o ? (r.root = "/", n = 1) : n = 0;
				for (var s = -1, h = 0, a = -1, c = !0, f = t.length - 1, u = 0; f >= n; --f) if (47 !== (i = t.charCodeAt(f))) -1 === a && (c = !1, a = f + 1), 46 === i ? -1 === s ? s = f : 1 !== u && (u = 1) : -1 !== s && (u = -1);
				else if (!c) {
					h = f + 1;
					break;
				}
				return -1 === s || -1 === a || 0 === u || 1 === u && s === a - 1 && s === h + 1 ? -1 !== a && (r.base = r.name = 0 === h && o ? t.slice(1, a) : t.slice(h, a)) : (0 === h && o ? (r.name = t.slice(1, s), r.base = t.slice(1, a)) : (r.name = t.slice(h, s), r.base = t.slice(h, a)), r.ext = t.slice(s, a)), h > 0 ? r.dir = t.slice(0, h - 1) : o && (r.dir = "/"), r;
			},
			sep: "/",
			delimiter: ":",
			win32: null,
			posix: null
		};
		n.posix = n, t.exports = n;
	} }, e = {};
	function r(n) {
		var i = e[n];
		if (void 0 !== i) return i.exports;
		var o = e[n] = { exports: {} };
		return t[n](o, o.exports, r), o.exports;
	}
	r.d = (t, e) => {
		for (var n in e) r.o(e, n) && !r.o(t, n) && Object.defineProperty(t, n, {
			enumerable: !0,
			get: e[n]
		});
	}, r.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e), r.r = (t) => {
		"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 });
	};
	var n = {};
	(() => {
		let t;
		if (r.r(n), r.d(n, {
			URI: () => f,
			Utils: () => P
		}), "object" == typeof process) t = "win32" === process.platform;
		else if ("object" == typeof navigator) t = navigator.userAgent.indexOf("Windows") >= 0;
		const e = /^\w[\w\d+.-]*$/, i = /^\//, o = /^\/\//;
		function s(t, r) {
			if (!t.scheme && r) throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${t.authority}", path: "${t.path}", query: "${t.query}", fragment: "${t.fragment}"}`);
			if (t.scheme && !e.test(t.scheme)) throw new Error("[UriError]: Scheme contains illegal characters.");
			if (t.path) {
				if (t.authority) {
					if (!i.test(t.path)) throw new Error("[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash (\"/\") character");
				} else if (o.test(t.path)) throw new Error("[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters (\"//\")");
			}
		}
		const h = "", a = "/", c = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
		class f {
			static isUri(t) {
				return t instanceof f || !!t && "string" == typeof t.authority && "string" == typeof t.fragment && "string" == typeof t.path && "string" == typeof t.query && "string" == typeof t.scheme && "string" == typeof t.fsPath && "function" == typeof t.with && "function" == typeof t.toString;
			}
			scheme;
			authority;
			path;
			query;
			fragment;
			constructor(t, e, r, n, i, o = !1) {
				"object" == typeof t ? (this.scheme = t.scheme || h, this.authority = t.authority || h, this.path = t.path || h, this.query = t.query || h, this.fragment = t.fragment || h) : (this.scheme = function(t, e) {
					return t || e ? t : "file";
				}(t, o), this.authority = e || h, this.path = function(t, e) {
					switch (t) {
						case "https":
						case "http":
						case "file": e ? e[0] !== a && (e = a + e) : e = a;
					}
					return e;
				}(this.scheme, r || h), this.query = n || h, this.fragment = i || h, s(this, o));
			}
			get fsPath() {
				return m(this, !1);
			}
			with(t) {
				if (!t) return this;
				let { scheme: e, authority: r, path: n, query: i, fragment: o } = t;
				return void 0 === e ? e = this.scheme : null === e && (e = h), void 0 === r ? r = this.authority : null === r && (r = h), void 0 === n ? n = this.path : null === n && (n = h), void 0 === i ? i = this.query : null === i && (i = h), void 0 === o ? o = this.fragment : null === o && (o = h), e === this.scheme && r === this.authority && n === this.path && i === this.query && o === this.fragment ? this : new l(e, r, n, i, o);
			}
			static parse(t, e = !1) {
				const r = c.exec(t);
				return r ? new l(r[2] || h, C(r[4] || h), C(r[5] || h), C(r[7] || h), C(r[9] || h), e) : new l(h, h, h, h, h);
			}
			static file(e) {
				let r = h;
				if (t && (e = e.replace(/\\/g, a)), e[0] === a && e[1] === a) {
					const t = e.indexOf(a, 2);
					-1 === t ? (r = e.substring(2), e = a) : (r = e.substring(2, t), e = e.substring(t) || a);
				}
				return new l("file", r, e, h, h);
			}
			static from(t) {
				const e = new l(t.scheme, t.authority, t.path, t.query, t.fragment);
				return s(e, !0), e;
			}
			toString(t = !1) {
				return y(this, t);
			}
			toJSON() {
				return this;
			}
			static revive(t) {
				if (t) {
					if (t instanceof f) return t;
					{
						const e = new l(t);
						return e._formatted = t.external, e._fsPath = t._sep === u ? t.fsPath : null, e;
					}
				}
				return t;
			}
		}
		const u = t ? 1 : void 0;
		class l extends f {
			_formatted = null;
			_fsPath = null;
			get fsPath() {
				return this._fsPath || (this._fsPath = m(this, !1)), this._fsPath;
			}
			toString(t = !1) {
				return t ? y(this, !0) : (this._formatted || (this._formatted = y(this, !1)), this._formatted);
			}
			toJSON() {
				const t = { $mid: 1 };
				return this._fsPath && (t.fsPath = this._fsPath, t._sep = u), this._formatted && (t.external = this._formatted), this.path && (t.path = this.path), this.scheme && (t.scheme = this.scheme), this.authority && (t.authority = this.authority), this.query && (t.query = this.query), this.fragment && (t.fragment = this.fragment), t;
			}
		}
		const g = {
			58: "%3A",
			47: "%2F",
			63: "%3F",
			35: "%23",
			91: "%5B",
			93: "%5D",
			64: "%40",
			33: "%21",
			36: "%24",
			38: "%26",
			39: "%27",
			40: "%28",
			41: "%29",
			42: "%2A",
			43: "%2B",
			44: "%2C",
			59: "%3B",
			61: "%3D",
			32: "%20"
		};
		function d(t, e, r) {
			let n, i = -1;
			for (let o = 0; o < t.length; o++) {
				const s = t.charCodeAt(o);
				if (s >= 97 && s <= 122 || s >= 65 && s <= 90 || s >= 48 && s <= 57 || 45 === s || 46 === s || 95 === s || 126 === s || e && 47 === s || r && 91 === s || r && 93 === s || r && 58 === s) -1 !== i && (n += encodeURIComponent(t.substring(i, o)), i = -1), void 0 !== n && (n += t.charAt(o));
				else {
					void 0 === n && (n = t.substr(0, o));
					const e = g[s];
					void 0 !== e ? (-1 !== i && (n += encodeURIComponent(t.substring(i, o)), i = -1), n += e) : -1 === i && (i = o);
				}
			}
			return -1 !== i && (n += encodeURIComponent(t.substring(i))), void 0 !== n ? n : t;
		}
		function p(t) {
			let e;
			for (let r = 0; r < t.length; r++) {
				const n = t.charCodeAt(r);
				35 === n || 63 === n ? (void 0 === e && (e = t.substr(0, r)), e += g[n]) : void 0 !== e && (e += t[r]);
			}
			return void 0 !== e ? e : t;
		}
		function m(e, r) {
			let n;
			return n = e.authority && e.path.length > 1 && "file" === e.scheme ? `//${e.authority}${e.path}` : 47 === e.path.charCodeAt(0) && (e.path.charCodeAt(1) >= 65 && e.path.charCodeAt(1) <= 90 || e.path.charCodeAt(1) >= 97 && e.path.charCodeAt(1) <= 122) && 58 === e.path.charCodeAt(2) ? r ? e.path.substr(1) : e.path[1].toLowerCase() + e.path.substr(2) : e.path, t && (n = n.replace(/\//g, "\\")), n;
		}
		function y(t, e) {
			const r = e ? p : d;
			let n = "", { scheme: i, authority: o, path: s, query: h, fragment: c } = t;
			if (i && (n += i, n += ":"), (o || "file" === i) && (n += a, n += a), o) {
				let t = o.indexOf("@");
				if (-1 !== t) {
					const e = o.substr(0, t);
					o = o.substr(t + 1), t = e.lastIndexOf(":"), -1 === t ? n += r(e, !1, !1) : (n += r(e.substr(0, t), !1, !1), n += ":", n += r(e.substr(t + 1), !1, !0)), n += "@";
				}
				o = o.toLowerCase(), t = o.lastIndexOf(":"), -1 === t ? n += r(o, !1, !0) : (n += r(o.substr(0, t), !1, !0), n += o.substr(t));
			}
			if (s) {
				if (s.length >= 3 && 47 === s.charCodeAt(0) && 58 === s.charCodeAt(2)) {
					const t = s.charCodeAt(1);
					t >= 65 && t <= 90 && (s = `/${String.fromCharCode(t + 32)}:${s.substr(3)}`);
				} else if (s.length >= 2 && 58 === s.charCodeAt(1)) {
					const t = s.charCodeAt(0);
					t >= 65 && t <= 90 && (s = `${String.fromCharCode(t + 32)}:${s.substr(2)}`);
				}
				n += r(s, !0, !1);
			}
			return h && (n += "?", n += r(h, !1, !1)), c && (n += "#", n += e ? c : d(c, !1, !1)), n;
		}
		function v(t) {
			try {
				return decodeURIComponent(t);
			} catch {
				return t.length > 3 ? t.substr(0, 3) + v(t.substr(3)) : t;
			}
		}
		const b = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
		function C(t) {
			return t.match(b) ? t.replace(b, ((t) => v(t))) : t;
		}
		var A = r(470);
		const w = A.posix || A, x = "/";
		var P;
		(function(t) {
			t.joinPath = function(t, ...e) {
				return t.with({ path: w.join(t.path, ...e) });
			}, t.resolvePath = function(t, ...e) {
				let r = t.path, n = !1;
				r[0] !== x && (r = x + r, n = !0);
				let i = w.resolve(r, ...e);
				return n && i[0] === x && !t.authority && (i = i.substring(1)), t.with({ path: i });
			}, t.dirname = function(t) {
				if (0 === t.path.length || t.path === x) return t;
				let e = w.dirname(t.path);
				return 1 === e.length && 46 === e.charCodeAt(0) && (e = ""), t.with({ path: e });
			}, t.basename = function(t) {
				return w.basename(t.path);
			}, t.extname = function(t) {
				return w.extname(t.path);
			};
		})(P || (P = {}));
	})(), LIB = n;
})();
var { URI, Utils } = LIB;
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/utils/uri-utils.js
/******************************************************************************
* Copyright 2022 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var UriUtils;
(function(UriUtils) {
	UriUtils.basename = Utils.basename;
	UriUtils.dirname = Utils.dirname;
	UriUtils.extname = Utils.extname;
	UriUtils.joinPath = Utils.joinPath;
	UriUtils.resolvePath = Utils.resolvePath;
	function equals(a, b) {
		return (a === null || a === void 0 ? void 0 : a.toString()) === (b === null || b === void 0 ? void 0 : b.toString());
	}
	UriUtils.equals = equals;
	function relative(from, to) {
		const fromPath = typeof from === "string" ? from : from.path;
		const toPath = typeof to === "string" ? to : to.path;
		const fromParts = fromPath.split("/").filter((e) => e.length > 0);
		const toParts = toPath.split("/").filter((e) => e.length > 0);
		let i = 0;
		for (; i < fromParts.length; i++) if (fromParts[i] !== toParts[i]) break;
		return "../".repeat(fromParts.length - i) + toParts.slice(i).join("/");
	}
	UriUtils.relative = relative;
	function normalize(uri) {
		return URI.parse(uri.toString()).toString();
	}
	UriUtils.normalize = normalize;
})(UriUtils || (UriUtils = {}));
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/workspace/documents.js
/**
* A document is subject to several phases that are run in predefined order. Any state value implies that
* smaller state values are finished as well.
*/
var DocumentState;
(function(DocumentState) {
	/**
	* The text content has changed and needs to be parsed again. The AST held by this outdated
	* document instance is no longer valid.
	*/
	DocumentState[DocumentState["Changed"] = 0] = "Changed";
	/**
	* An AST has been created from the text content. The document structure can be traversed,
	* but cross-references cannot be resolved yet. If necessary, the structure can be manipulated
	* at this stage as a preprocessing step.
	*/
	DocumentState[DocumentState["Parsed"] = 1] = "Parsed";
	/**
	* The `IndexManager` service has processed AST nodes of this document. This means the
	* exported symbols are available in the global scope and can be resolved from other documents.
	*/
	DocumentState[DocumentState["IndexedContent"] = 2] = "IndexedContent";
	/**
	* The `ScopeComputation` service has processed this document. This means the local symbols
	* are stored in a MultiMap so they can be looked up by the `ScopeProvider` service.
	* Once a document has reached this state, you may follow every reference - it will lazily
	* resolve its `ref` property and yield either the target AST node or `undefined` in case
	* the target is not in scope.
	*/
	DocumentState[DocumentState["ComputedScopes"] = 3] = "ComputedScopes";
	/**
	* The `Linker` service has processed this document. All outgoing references have been
	* resolved or marked as erroneous.
	*/
	DocumentState[DocumentState["Linked"] = 4] = "Linked";
	/**
	* The `IndexManager` service has processed AST node references of this document. This is
	* necessary to determine which documents are affected by a change in one of the workspace
	* documents.
	*/
	DocumentState[DocumentState["IndexedReferences"] = 5] = "IndexedReferences";
	/**
	* The `DocumentValidator` service has processed this document. The language server listens
	* to the results of this phase and sends diagnostics to the client.
	*/
	DocumentState[DocumentState["Validated"] = 6] = "Validated";
})(DocumentState || (DocumentState = {}));
var DefaultLangiumDocumentFactory = class {
	constructor(services) {
		this.serviceRegistry = services.ServiceRegistry;
		this.textDocuments = services.workspace.TextDocuments;
		this.fileSystemProvider = services.workspace.FileSystemProvider;
	}
	async fromUri(uri, cancellationToken = cancellation_exports.CancellationToken.None) {
		const content = await this.fileSystemProvider.readFile(uri);
		return this.createAsync(uri, content, cancellationToken);
	}
	fromTextDocument(textDocument, uri, token) {
		uri = uri !== null && uri !== void 0 ? uri : URI.parse(textDocument.uri);
		if (cancellation_exports.CancellationToken.is(token)) return this.createAsync(uri, textDocument, token);
		else return this.create(uri, textDocument, token);
	}
	fromString(text, uri, token) {
		if (cancellation_exports.CancellationToken.is(token)) return this.createAsync(uri, text, token);
		else return this.create(uri, text, token);
	}
	fromModel(model, uri) {
		return this.create(uri, { $model: model });
	}
	create(uri, content, options) {
		if (typeof content === "string") {
			const parseResult = this.parse(uri, content, options);
			return this.createLangiumDocument(parseResult, uri, void 0, content);
		} else if ("$model" in content) {
			const parseResult = {
				value: content.$model,
				parserErrors: [],
				lexerErrors: []
			};
			return this.createLangiumDocument(parseResult, uri);
		} else {
			const parseResult = this.parse(uri, content.getText(), options);
			return this.createLangiumDocument(parseResult, uri, content);
		}
	}
	async createAsync(uri, content, cancelToken) {
		if (typeof content === "string") {
			const parseResult = await this.parseAsync(uri, content, cancelToken);
			return this.createLangiumDocument(parseResult, uri, void 0, content);
		} else {
			const parseResult = await this.parseAsync(uri, content.getText(), cancelToken);
			return this.createLangiumDocument(parseResult, uri, content);
		}
	}
	/**
	* Create a LangiumDocument from a given parse result.
	*
	* A TextDocument is created on demand if it is not provided as argument here. Usually this
	* should not be necessary because the main purpose of the TextDocument is to convert between
	* text ranges and offsets, which is done solely in LSP request handling.
	*
	* With the introduction of {@link update} below this method is supposed to be mainly called
	* during workspace initialization and on addition/recognition of new files, while changes in
	* existing documents are processed via {@link update}.
	*/
	createLangiumDocument(parseResult, uri, textDocument, text) {
		let document;
		if (textDocument) document = {
			parseResult,
			uri,
			state: DocumentState.Parsed,
			references: [],
			textDocument
		};
		else {
			const textDocumentGetter = this.createTextDocumentGetter(uri, text);
			document = {
				parseResult,
				uri,
				state: DocumentState.Parsed,
				references: [],
				get textDocument() {
					return textDocumentGetter();
				}
			};
		}
		parseResult.value.$document = document;
		return document;
	}
	async update(document, cancellationToken) {
		var _a, _b;
		const oldText = (_a = document.parseResult.value.$cstNode) === null || _a === void 0 ? void 0 : _a.root.fullText;
		const textDocument = (_b = this.textDocuments) === null || _b === void 0 ? void 0 : _b.get(document.uri.toString());
		const text = textDocument ? textDocument.getText() : await this.fileSystemProvider.readFile(document.uri);
		if (textDocument) Object.defineProperty(document, "textDocument", { value: textDocument });
		else {
			const textDocumentGetter = this.createTextDocumentGetter(document.uri, text);
			Object.defineProperty(document, "textDocument", { get: textDocumentGetter });
		}
		if (oldText !== text) {
			document.parseResult = await this.parseAsync(document.uri, text, cancellationToken);
			document.parseResult.value.$document = document;
		}
		document.state = DocumentState.Parsed;
		return document;
	}
	parse(uri, text, options) {
		return this.serviceRegistry.getServices(uri).parser.LangiumParser.parse(text, options);
	}
	parseAsync(uri, text, cancellationToken) {
		return this.serviceRegistry.getServices(uri).parser.AsyncParser.parse(text, cancellationToken);
	}
	createTextDocumentGetter(uri, text) {
		const serviceRegistry = this.serviceRegistry;
		let textDoc = void 0;
		return () => {
			return textDoc !== null && textDoc !== void 0 ? textDoc : textDoc = TextDocument.create(uri.toString(), serviceRegistry.getServices(uri).LanguageMetaData.languageId, 0, text !== null && text !== void 0 ? text : "");
		};
	}
};
var DefaultLangiumDocuments = class {
	constructor(services) {
		this.documentMap = /* @__PURE__ */ new Map();
		this.langiumDocumentFactory = services.workspace.LangiumDocumentFactory;
		this.serviceRegistry = services.ServiceRegistry;
	}
	get all() {
		return stream(this.documentMap.values());
	}
	addDocument(document) {
		const uriString = document.uri.toString();
		if (this.documentMap.has(uriString)) throw new Error(`A document with the URI '${uriString}' is already present.`);
		this.documentMap.set(uriString, document);
	}
	getDocument(uri) {
		const uriString = uri.toString();
		return this.documentMap.get(uriString);
	}
	async getOrCreateDocument(uri, cancellationToken) {
		let document = this.getDocument(uri);
		if (document) return document;
		document = await this.langiumDocumentFactory.fromUri(uri, cancellationToken);
		this.addDocument(document);
		return document;
	}
	createDocument(uri, text, cancellationToken) {
		if (cancellationToken) return this.langiumDocumentFactory.fromString(text, uri, cancellationToken).then((document) => {
			this.addDocument(document);
			return document;
		});
		else {
			const document = this.langiumDocumentFactory.fromString(text, uri);
			this.addDocument(document);
			return document;
		}
	}
	hasDocument(uri) {
		return this.documentMap.has(uri.toString());
	}
	invalidateDocument(uri) {
		const uriString = uri.toString();
		const langiumDoc = this.documentMap.get(uriString);
		if (langiumDoc) {
			this.serviceRegistry.getServices(uri).references.Linker.unlink(langiumDoc);
			langiumDoc.state = DocumentState.Changed;
			langiumDoc.precomputedScopes = void 0;
			langiumDoc.diagnostics = void 0;
		}
		return langiumDoc;
	}
	deleteDocument(uri) {
		const uriString = uri.toString();
		const langiumDoc = this.documentMap.get(uriString);
		if (langiumDoc) {
			langiumDoc.state = DocumentState.Changed;
			this.documentMap.delete(uriString);
		}
		return langiumDoc;
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/references/linker.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var ref_resolving = Symbol("ref_resolving");
var DefaultLinker = class {
	constructor(services) {
		this.reflection = services.shared.AstReflection;
		this.langiumDocuments = () => services.shared.workspace.LangiumDocuments;
		this.scopeProvider = services.references.ScopeProvider;
		this.astNodeLocator = services.workspace.AstNodeLocator;
	}
	async link(document, cancelToken = cancellation_exports.CancellationToken.None) {
		for (const node of streamAst(document.parseResult.value)) {
			await interruptAndCheck(cancelToken);
			streamReferences(node).forEach((ref) => this.doLink(ref, document));
		}
	}
	doLink(refInfo, document) {
		var _a;
		const ref = refInfo.reference;
		if (ref._ref === void 0) {
			ref._ref = ref_resolving;
			try {
				const description = this.getCandidate(refInfo);
				if (isLinkingError(description)) ref._ref = description;
				else {
					ref._nodeDescription = description;
					if (this.langiumDocuments().hasDocument(description.documentUri)) {
						const linkedNode = this.loadAstNode(description);
						ref._ref = linkedNode !== null && linkedNode !== void 0 ? linkedNode : this.createLinkingError(refInfo, description);
					} else ref._ref = void 0;
				}
			} catch (err) {
				console.error(`An error occurred while resolving reference to '${ref.$refText}':`, err);
				const errorMessage = (_a = err.message) !== null && _a !== void 0 ? _a : String(err);
				ref._ref = Object.assign(Object.assign({}, refInfo), { message: `An error occurred while resolving reference to '${ref.$refText}': ${errorMessage}` });
			}
			document.references.push(ref);
		}
	}
	unlink(document) {
		for (const ref of document.references) {
			delete ref._ref;
			delete ref._nodeDescription;
		}
		document.references = [];
	}
	getCandidate(refInfo) {
		const description = this.scopeProvider.getScope(refInfo).getElement(refInfo.reference.$refText);
		return description !== null && description !== void 0 ? description : this.createLinkingError(refInfo);
	}
	buildReference(node, property, refNode, refText) {
		const linker = this;
		const reference = {
			$refNode: refNode,
			$refText: refText,
			get ref() {
				var _a;
				if (isAstNode(this._ref)) return this._ref;
				else if (isAstNodeDescription(this._nodeDescription)) {
					const linkedNode = linker.loadAstNode(this._nodeDescription);
					this._ref = linkedNode !== null && linkedNode !== void 0 ? linkedNode : linker.createLinkingError({
						reference,
						container: node,
						property
					}, this._nodeDescription);
				} else if (this._ref === void 0) {
					this._ref = ref_resolving;
					const document = findRootNode(node).$document;
					const refData = linker.getLinkedNode({
						reference,
						container: node,
						property
					});
					if (refData.error && document && document.state < DocumentState.ComputedScopes) {
						this._ref = void 0;
						return;
					}
					this._ref = (_a = refData.node) !== null && _a !== void 0 ? _a : refData.error;
					this._nodeDescription = refData.descr;
					document === null || document === void 0 || document.references.push(this);
				} else if (this._ref === ref_resolving) throw new Error(`Cyclic reference resolution detected: ${linker.astNodeLocator.getAstNodePath(node)}/${property} (symbol '${refText}')`);
				return isAstNode(this._ref) ? this._ref : void 0;
			},
			get $nodeDescription() {
				return this._nodeDescription;
			},
			get error() {
				return isLinkingError(this._ref) ? this._ref : void 0;
			}
		};
		return reference;
	}
	getLinkedNode(refInfo) {
		var _a;
		try {
			const description = this.getCandidate(refInfo);
			if (isLinkingError(description)) return { error: description };
			const linkedNode = this.loadAstNode(description);
			if (linkedNode) return {
				node: linkedNode,
				descr: description
			};
			else return {
				descr: description,
				error: this.createLinkingError(refInfo, description)
			};
		} catch (err) {
			console.error(`An error occurred while resolving reference to '${refInfo.reference.$refText}':`, err);
			const errorMessage = (_a = err.message) !== null && _a !== void 0 ? _a : String(err);
			return { error: Object.assign(Object.assign({}, refInfo), { message: `An error occurred while resolving reference to '${refInfo.reference.$refText}': ${errorMessage}` }) };
		}
	}
	loadAstNode(nodeDescription) {
		if (nodeDescription.node) return nodeDescription.node;
		const doc = this.langiumDocuments().getDocument(nodeDescription.documentUri);
		if (!doc) return;
		return this.astNodeLocator.getAstNode(doc.parseResult.value, nodeDescription.path);
	}
	createLinkingError(refInfo, targetDescription) {
		const document = findRootNode(refInfo.container).$document;
		if (document && document.state < DocumentState.ComputedScopes) console.warn(`Attempted reference resolution before document reached ComputedScopes state (${document.uri}).`);
		const referenceType = this.reflection.getReferenceType(refInfo);
		return Object.assign(Object.assign({}, refInfo), {
			message: `Could not resolve reference to ${referenceType} named '${refInfo.reference.$refText}'.`,
			targetDescription
		});
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/references/name-provider.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
function isNamed(node) {
	return typeof node.name === "string";
}
var DefaultNameProvider = class {
	getName(node) {
		if (isNamed(node)) return node.name;
	}
	getNameNode(node) {
		return findNodeForProperty(node.$cstNode, "name");
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/references/references.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var DefaultReferences = class {
	constructor(services) {
		this.nameProvider = services.references.NameProvider;
		this.index = services.shared.workspace.IndexManager;
		this.nodeLocator = services.workspace.AstNodeLocator;
	}
	findDeclaration(sourceCstNode) {
		if (sourceCstNode) {
			const assignment = findAssignment(sourceCstNode);
			const nodeElem = sourceCstNode.astNode;
			if (assignment && nodeElem) {
				const reference = nodeElem[assignment.feature];
				if (isReference(reference)) return reference.ref;
				else if (Array.isArray(reference)) {
					for (const ref of reference) if (isReference(ref) && ref.$refNode && ref.$refNode.offset <= sourceCstNode.offset && ref.$refNode.end >= sourceCstNode.end) return ref.ref;
				}
			}
			if (nodeElem) {
				const nameNode = this.nameProvider.getNameNode(nodeElem);
				if (nameNode && (nameNode === sourceCstNode || isChildNode(sourceCstNode, nameNode))) return nodeElem;
			}
		}
	}
	findDeclarationNode(sourceCstNode) {
		const astNode = this.findDeclaration(sourceCstNode);
		if (astNode === null || astNode === void 0 ? void 0 : astNode.$cstNode) {
			const targetNode = this.nameProvider.getNameNode(astNode);
			return targetNode !== null && targetNode !== void 0 ? targetNode : astNode.$cstNode;
		}
	}
	findReferences(targetNode, options) {
		const refs = [];
		if (options.includeDeclaration) {
			const ref = this.getReferenceToSelf(targetNode);
			if (ref) refs.push(ref);
		}
		let indexReferences = this.index.findAllReferences(targetNode, this.nodeLocator.getAstNodePath(targetNode));
		if (options.documentUri) indexReferences = indexReferences.filter((ref) => UriUtils.equals(ref.sourceUri, options.documentUri));
		refs.push(...indexReferences);
		return stream(refs);
	}
	getReferenceToSelf(targetNode) {
		const nameNode = this.nameProvider.getNameNode(targetNode);
		if (nameNode) {
			const doc = getDocument(targetNode);
			const path = this.nodeLocator.getAstNodePath(targetNode);
			return {
				sourceUri: doc.uri,
				sourcePath: path,
				targetUri: doc.uri,
				targetPath: path,
				segment: toDocumentSegment(nameNode),
				local: true
			};
		}
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/utils/collections.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
/**
* A multimap is a variation of a Map that has potentially multiple values for every key.
*/
var MultiMap = class {
	constructor(elements) {
		this.map = /* @__PURE__ */ new Map();
		if (elements) for (const [key, value] of elements) this.add(key, value);
	}
	/**
	* The total number of values in the multimap.
	*/
	get size() {
		return Reduction.sum(stream(this.map.values()).map((a) => a.length));
	}
	/**
	* Clear all entries in the multimap.
	*/
	clear() {
		this.map.clear();
	}
	/**
	* Operates differently depending on whether a `value` is given:
	*  * With a value, this method deletes the specific key / value pair from the multimap.
	*  * Without a value, all values associated with the given key are deleted.
	*
	* @returns `true` if a value existed and has been removed, or `false` if the specified
	*     key / value does not exist.
	*/
	delete(key, value) {
		if (value === void 0) return this.map.delete(key);
		else {
			const values = this.map.get(key);
			if (values) {
				const index = values.indexOf(value);
				if (index >= 0) {
					if (values.length === 1) this.map.delete(key);
					else values.splice(index, 1);
					return true;
				}
			}
			return false;
		}
	}
	/**
	* Returns an array of all values associated with the given key. If no value exists,
	* an empty array is returned.
	*
	* _Note:_ The returned array is assumed not to be modified. Use the `set` method to add a
	* value and `delete` to remove a value from the multimap.
	*/
	get(key) {
		var _a;
		return (_a = this.map.get(key)) !== null && _a !== void 0 ? _a : [];
	}
	/**
	* Operates differently depending on whether a `value` is given:
	*  * With a value, this method returns `true` if the specific key / value pair is present in the multimap.
	*  * Without a value, this method returns `true` if the given key is present in the multimap.
	*/
	has(key, value) {
		if (value === void 0) return this.map.has(key);
		else {
			const values = this.map.get(key);
			if (values) return values.indexOf(value) >= 0;
			return false;
		}
	}
	/**
	* Add the given key / value pair to the multimap.
	*/
	add(key, value) {
		if (this.map.has(key)) this.map.get(key).push(value);
		else this.map.set(key, [value]);
		return this;
	}
	/**
	* Add the given set of key / value pairs to the multimap.
	*/
	addAll(key, values) {
		if (this.map.has(key)) this.map.get(key).push(...values);
		else this.map.set(key, Array.from(values));
		return this;
	}
	/**
	* Invokes the given callback function for every key / value pair in the multimap.
	*/
	forEach(callbackfn) {
		this.map.forEach((array, key) => array.forEach((value) => callbackfn(value, key, this)));
	}
	/**
	* Returns an iterator of key, value pairs for every entry in the map.
	*/
	[Symbol.iterator]() {
		return this.entries().iterator();
	}
	/**
	* Returns a stream of key, value pairs for every entry in the map.
	*/
	entries() {
		return stream(this.map.entries()).flatMap(([key, array]) => array.map((value) => [key, value]));
	}
	/**
	* Returns a stream of keys in the map.
	*/
	keys() {
		return stream(this.map.keys());
	}
	/**
	* Returns a stream of values in the map.
	*/
	values() {
		return stream(this.map.values()).flat();
	}
	/**
	* Returns a stream of key, value set pairs for every key in the map.
	*/
	entriesGroupedByKey() {
		return stream(this.map.entries());
	}
};
var BiMap = class {
	get size() {
		return this.map.size;
	}
	constructor(elements) {
		this.map = /* @__PURE__ */ new Map();
		this.inverse = /* @__PURE__ */ new Map();
		if (elements) for (const [key, value] of elements) this.set(key, value);
	}
	clear() {
		this.map.clear();
		this.inverse.clear();
	}
	set(key, value) {
		this.map.set(key, value);
		this.inverse.set(value, key);
		return this;
	}
	get(key) {
		return this.map.get(key);
	}
	getKey(value) {
		return this.inverse.get(value);
	}
	delete(key) {
		const value = this.map.get(key);
		if (value !== void 0) {
			this.map.delete(key);
			this.inverse.delete(value);
			return true;
		}
		return false;
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/references/scope-computation.js
/******************************************************************************
* Copyright 2021-2022 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
/**
* The default scope computation creates and collectes descriptions of the AST nodes to be exported into the
* _global_ scope from the given document. By default those are the document's root AST node and its directly
* contained child nodes.
*
* Besides, it gathers all AST nodes that have a name (according to the `NameProvider` service) and includes them
* in the local scope of their particular container nodes. As a result, for every cross-reference in the AST,
* target elements from the same level (siblings) and further up towards the root (parents and siblings of parents)
* are visible. Elements being nested inside lower levels (children, children of siblings and parents' siblings)
* are _invisible_ by default, but that can be changed by customizing this service.
*/
var DefaultScopeComputation = class {
	constructor(services) {
		this.nameProvider = services.references.NameProvider;
		this.descriptions = services.workspace.AstNodeDescriptionProvider;
	}
	async computeExports(document, cancelToken = cancellation_exports.CancellationToken.None) {
		return this.computeExportsForNode(document.parseResult.value, document, void 0, cancelToken);
	}
	/**
	* Creates {@link AstNodeDescription AstNodeDescriptions} for the given {@link AstNode parentNode} and its children.
	* The list of children to be considered is determined by the function parameter {@link children}.
	* By default only the direct children of {@link parentNode} are visited, nested nodes are not exported.
	*
	* @param parentNode AST node to be exported, i.e., of which an {@link AstNodeDescription} shall be added to the returned list.
	* @param document The document containing the AST node to be exported.
	* @param children A function called with {@link parentNode} as single argument and returning an {@link Iterable} supplying the children to be visited, which must be directly or transitively contained in {@link parentNode}.
	* @param cancelToken Indicates when to cancel the current operation.
	* @throws `OperationCancelled` if a user action occurs during execution.
	* @returns A list of {@link AstNodeDescription AstNodeDescriptions} to be published to index.
	*/
	async computeExportsForNode(parentNode, document, children = streamContents, cancelToken = cancellation_exports.CancellationToken.None) {
		const exports = [];
		this.exportNode(parentNode, exports, document);
		for (const node of children(parentNode)) {
			await interruptAndCheck(cancelToken);
			this.exportNode(node, exports, document);
		}
		return exports;
	}
	/**
	* Add a single node to the list of exports if it has a name. Override this method to change how
	* symbols are exported, e.g. by modifying their exported name.
	*/
	exportNode(node, exports, document) {
		const name = this.nameProvider.getName(node);
		if (name) exports.push(this.descriptions.createDescription(node, name, document));
	}
	async computeLocalScopes(document, cancelToken = cancellation_exports.CancellationToken.None) {
		const rootNode = document.parseResult.value;
		const scopes = new MultiMap();
		for (const node of streamAllContents(rootNode)) {
			await interruptAndCheck(cancelToken);
			this.processNode(node, document, scopes);
		}
		return scopes;
	}
	/**
	* Process a single node during scopes computation. The default implementation makes the node visible
	* in the subtree of its container (if the node has a name). Override this method to change this,
	* e.g. by increasing the visibility to a higher level in the AST.
	*/
	processNode(node, document, scopes) {
		const container = node.$container;
		if (container) {
			const name = this.nameProvider.getName(node);
			if (name) scopes.add(container, this.descriptions.createDescription(node, name, document));
		}
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/references/scope.js
/******************************************************************************
* Copyright 2023 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
/**
* The default scope implementation is based on a `Stream`. It has an optional _outer scope_ describing
* the next level of elements, which are queried when a target element is not found in the stream provided
* to this scope.
*/
var StreamScope = class {
	constructor(elements, outerScope, options) {
		var _a;
		this.elements = elements;
		this.outerScope = outerScope;
		this.caseInsensitive = (_a = options === null || options === void 0 ? void 0 : options.caseInsensitive) !== null && _a !== void 0 ? _a : false;
	}
	getAllElements() {
		if (this.outerScope) return this.elements.concat(this.outerScope.getAllElements());
		else return this.elements;
	}
	getElement(name) {
		const local = this.caseInsensitive ? this.elements.find((e) => e.name.toLowerCase() === name.toLowerCase()) : this.elements.find((e) => e.name === name);
		if (local) return local;
		if (this.outerScope) return this.outerScope.getElement(name);
	}
};
var MapScope = class {
	constructor(elements, outerScope, options) {
		var _a;
		this.elements = /* @__PURE__ */ new Map();
		this.caseInsensitive = (_a = options === null || options === void 0 ? void 0 : options.caseInsensitive) !== null && _a !== void 0 ? _a : false;
		for (const element of elements) {
			const name = this.caseInsensitive ? element.name.toLowerCase() : element.name;
			this.elements.set(name, element);
		}
		this.outerScope = outerScope;
	}
	getElement(name) {
		const localName = this.caseInsensitive ? name.toLowerCase() : name;
		const local = this.elements.get(localName);
		if (local) return local;
		if (this.outerScope) return this.outerScope.getElement(name);
	}
	getAllElements() {
		let elementStream = stream(this.elements.values());
		if (this.outerScope) elementStream = elementStream.concat(this.outerScope.getAllElements());
		return elementStream;
	}
};
var EMPTY_SCOPE = {
	getElement() {},
	getAllElements() {
		return EMPTY_STREAM;
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/utils/caching.js
/******************************************************************************
* Copyright 2023 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var DisposableCache = class {
	constructor() {
		this.toDispose = [];
		this.isDisposed = false;
	}
	onDispose(disposable) {
		this.toDispose.push(disposable);
	}
	dispose() {
		this.throwIfDisposed();
		this.clear();
		this.isDisposed = true;
		this.toDispose.forEach((disposable) => disposable.dispose());
	}
	throwIfDisposed() {
		if (this.isDisposed) throw new Error("This cache has already been disposed");
	}
};
var SimpleCache = class extends DisposableCache {
	constructor() {
		super(...arguments);
		this.cache = /* @__PURE__ */ new Map();
	}
	has(key) {
		this.throwIfDisposed();
		return this.cache.has(key);
	}
	set(key, value) {
		this.throwIfDisposed();
		this.cache.set(key, value);
	}
	get(key, provider) {
		this.throwIfDisposed();
		if (this.cache.has(key)) return this.cache.get(key);
		else if (provider) {
			const value = provider();
			this.cache.set(key, value);
			return value;
		} else return;
	}
	delete(key) {
		this.throwIfDisposed();
		return this.cache.delete(key);
	}
	clear() {
		this.throwIfDisposed();
		this.cache.clear();
	}
};
var ContextCache = class extends DisposableCache {
	constructor(converter) {
		super();
		this.cache = /* @__PURE__ */ new Map();
		this.converter = converter !== null && converter !== void 0 ? converter : ((value) => value);
	}
	has(contextKey, key) {
		this.throwIfDisposed();
		return this.cacheForContext(contextKey).has(key);
	}
	set(contextKey, key, value) {
		this.throwIfDisposed();
		this.cacheForContext(contextKey).set(key, value);
	}
	get(contextKey, key, provider) {
		this.throwIfDisposed();
		const contextCache = this.cacheForContext(contextKey);
		if (contextCache.has(key)) return contextCache.get(key);
		else if (provider) {
			const value = provider();
			contextCache.set(key, value);
			return value;
		} else return;
	}
	delete(contextKey, key) {
		this.throwIfDisposed();
		return this.cacheForContext(contextKey).delete(key);
	}
	clear(contextKey) {
		this.throwIfDisposed();
		if (contextKey) {
			const mapKey = this.converter(contextKey);
			this.cache.delete(mapKey);
		} else this.cache.clear();
	}
	cacheForContext(contextKey) {
		const mapKey = this.converter(contextKey);
		let documentCache = this.cache.get(mapKey);
		if (!documentCache) {
			documentCache = /* @__PURE__ */ new Map();
			this.cache.set(mapKey, documentCache);
		}
		return documentCache;
	}
};
/**
* Every key/value pair in this cache is scoped to a document.
* If this document is changed or deleted, all associated key/value pairs are deleted.
*/
var DocumentCache = class extends ContextCache {
	/**
	* Creates a new document cache.
	*
	* @param sharedServices Service container instance to hook into document lifecycle events.
	* @param state Optional document state on which the cache should evict.
	* If not provided, the cache will evict on `DocumentBuilder#onUpdate`.
	* *Deleted* documents are considered in both cases.
	*
	* Providing a state here will use `DocumentBuilder#onDocumentPhase` instead,
	* which triggers on all documents that have been affected by this change, assuming that the
	* state is `DocumentState.Linked` or a later state.
	*/
	constructor(sharedServices, state) {
		super((uri) => uri.toString());
		if (state) {
			this.toDispose.push(sharedServices.workspace.DocumentBuilder.onDocumentPhase(state, (document) => {
				this.clear(document.uri.toString());
			}));
			this.toDispose.push(sharedServices.workspace.DocumentBuilder.onUpdate((_changed, deleted) => {
				for (const uri of deleted) this.clear(uri);
			}));
		} else this.toDispose.push(sharedServices.workspace.DocumentBuilder.onUpdate((changed, deleted) => {
			const allUris = changed.concat(deleted);
			for (const uri of allUris) this.clear(uri);
		}));
	}
};
/**
* Every key/value pair in this cache is scoped to the whole workspace.
* If any document in the workspace is added, changed or deleted, the whole cache is evicted.
*/
var WorkspaceCache = class extends SimpleCache {
	/**
	* Creates a new workspace cache.
	*
	* @param sharedServices Service container instance to hook into document lifecycle events.
	* @param state Optional document state on which the cache should evict.
	* If not provided, the cache will evict on `DocumentBuilder#onUpdate`.
	* *Deleted* documents are considered in both cases.
	*/
	constructor(sharedServices, state) {
		super();
		if (state) {
			this.toDispose.push(sharedServices.workspace.DocumentBuilder.onBuildPhase(state, () => {
				this.clear();
			}));
			this.toDispose.push(sharedServices.workspace.DocumentBuilder.onUpdate((_changed, deleted) => {
				if (deleted.length > 0) this.clear();
			}));
		} else this.toDispose.push(sharedServices.workspace.DocumentBuilder.onUpdate(() => {
			this.clear();
		}));
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/references/scope-provider.js
/******************************************************************************
* Copyright 2021-2022 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var DefaultScopeProvider = class {
	constructor(services) {
		this.reflection = services.shared.AstReflection;
		this.nameProvider = services.references.NameProvider;
		this.descriptions = services.workspace.AstNodeDescriptionProvider;
		this.indexManager = services.shared.workspace.IndexManager;
		this.globalScopeCache = new WorkspaceCache(services.shared);
	}
	getScope(context) {
		const scopes = [];
		const referenceType = this.reflection.getReferenceType(context);
		const precomputed = getDocument(context.container).precomputedScopes;
		if (precomputed) {
			let currentNode = context.container;
			do {
				const allDescriptions = precomputed.get(currentNode);
				if (allDescriptions.length > 0) scopes.push(stream(allDescriptions).filter((desc) => this.reflection.isSubtype(desc.type, referenceType)));
				currentNode = currentNode.$container;
			} while (currentNode);
		}
		let result = this.getGlobalScope(referenceType, context);
		for (let i = scopes.length - 1; i >= 0; i--) result = this.createScope(scopes[i], result);
		return result;
	}
	/**
	* Create a scope for the given collection of AST node descriptions.
	*/
	createScope(elements, outerScope, options) {
		return new StreamScope(stream(elements), outerScope, options);
	}
	/**
	* Create a scope for the given collection of AST nodes, which need to be transformed into respective
	* descriptions first. This is done using the `NameProvider` and `AstNodeDescriptionProvider` services.
	*/
	createScopeForNodes(elements, outerScope, options) {
		return new StreamScope(stream(elements).map((e) => {
			const name = this.nameProvider.getName(e);
			if (name) return this.descriptions.createDescription(e, name);
		}).nonNullable(), outerScope, options);
	}
	/**
	* Create a global scope filtered for the given reference type.
	*/
	getGlobalScope(referenceType, _context) {
		return this.globalScopeCache.get(referenceType, () => new MapScope(this.indexManager.allElements(referenceType)));
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/serializer/json-serializer.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
function isAstNodeWithComment(node) {
	return typeof node.$comment === "string";
}
function isIntermediateReference(obj) {
	return typeof obj === "object" && !!obj && ("$ref" in obj || "$error" in obj);
}
var DefaultJsonSerializer = class {
	constructor(services) {
		/** The set of AstNode properties to be ignored by the serializer. */
		this.ignoreProperties = /* @__PURE__ */ new Set([
			"$container",
			"$containerProperty",
			"$containerIndex",
			"$document",
			"$cstNode"
		]);
		this.langiumDocuments = services.shared.workspace.LangiumDocuments;
		this.astNodeLocator = services.workspace.AstNodeLocator;
		this.nameProvider = services.references.NameProvider;
		this.commentProvider = services.documentation.CommentProvider;
	}
	serialize(node, options) {
		const serializeOptions = options !== null && options !== void 0 ? options : {};
		const specificReplacer = options === null || options === void 0 ? void 0 : options.replacer;
		const defaultReplacer = (key, value) => this.replacer(key, value, serializeOptions);
		const replacer = specificReplacer ? (key, value) => specificReplacer(key, value, defaultReplacer) : defaultReplacer;
		try {
			this.currentDocument = getDocument(node);
			return JSON.stringify(node, replacer, options === null || options === void 0 ? void 0 : options.space);
		} finally {
			this.currentDocument = void 0;
		}
	}
	deserialize(content, options) {
		const deserializeOptions = options !== null && options !== void 0 ? options : {};
		const root = JSON.parse(content);
		this.linkNode(root, root, deserializeOptions);
		return root;
	}
	replacer(key, value, { refText, sourceText, textRegions, comments, uriConverter }) {
		var _a, _b, _c, _d;
		if (this.ignoreProperties.has(key)) return;
		else if (isReference(value)) {
			const refValue = value.ref;
			const $refText = refText ? value.$refText : void 0;
			if (refValue) {
				const targetDocument = getDocument(refValue);
				let targetUri = "";
				if (this.currentDocument && this.currentDocument !== targetDocument) {
					if (uriConverter) targetUri = uriConverter(targetDocument.uri, value);
					else targetUri = targetDocument.uri.toString();
				}
				const targetPath = this.astNodeLocator.getAstNodePath(refValue);
				return {
					$ref: `${targetUri}#${targetPath}`,
					$refText
				};
			} else return {
				$error: (_b = (_a = value.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "Could not resolve reference",
				$refText
			};
		} else if (isAstNode(value)) {
			let astNode = void 0;
			if (textRegions) {
				astNode = this.addAstNodeRegionWithAssignmentsTo(Object.assign({}, value));
				if ((!key || value.$document) && (astNode === null || astNode === void 0 ? void 0 : astNode.$textRegion)) astNode.$textRegion.documentURI = (_c = this.currentDocument) === null || _c === void 0 ? void 0 : _c.uri.toString();
			}
			if (sourceText && !key) {
				astNode !== null && astNode !== void 0 || (astNode = Object.assign({}, value));
				astNode.$sourceText = (_d = value.$cstNode) === null || _d === void 0 ? void 0 : _d.text;
			}
			if (comments) {
				astNode !== null && astNode !== void 0 || (astNode = Object.assign({}, value));
				const comment = this.commentProvider.getComment(value);
				if (comment) astNode.$comment = comment.replace(/\r/g, "");
			}
			return astNode !== null && astNode !== void 0 ? astNode : value;
		} else return value;
	}
	addAstNodeRegionWithAssignmentsTo(node) {
		const createDocumentSegment = (cstNode) => ({
			offset: cstNode.offset,
			end: cstNode.end,
			length: cstNode.length,
			range: cstNode.range
		});
		if (node.$cstNode) {
			const textRegion = node.$textRegion = createDocumentSegment(node.$cstNode);
			const assignments = textRegion.assignments = {};
			Object.keys(node).filter((key) => !key.startsWith("$")).forEach((key) => {
				const propertyAssignments = findNodesForProperty(node.$cstNode, key).map(createDocumentSegment);
				if (propertyAssignments.length !== 0) assignments[key] = propertyAssignments;
			});
			return node;
		}
	}
	linkNode(node, root, options, container, containerProperty, containerIndex) {
		for (const [propertyName, item] of Object.entries(node)) if (Array.isArray(item)) for (let index = 0; index < item.length; index++) {
			const element = item[index];
			if (isIntermediateReference(element)) item[index] = this.reviveReference(node, propertyName, root, element, options);
			else if (isAstNode(element)) this.linkNode(element, root, options, node, propertyName, index);
		}
		else if (isIntermediateReference(item)) node[propertyName] = this.reviveReference(node, propertyName, root, item, options);
		else if (isAstNode(item)) this.linkNode(item, root, options, node, propertyName);
		const mutable = node;
		mutable.$container = container;
		mutable.$containerProperty = containerProperty;
		mutable.$containerIndex = containerIndex;
	}
	reviveReference(container, property, root, reference, options) {
		let refText = reference.$refText;
		let error = reference.$error;
		if (reference.$ref) {
			const ref = this.getRefNode(root, reference.$ref, options.uriConverter);
			if (isAstNode(ref)) {
				if (!refText) refText = this.nameProvider.getName(ref);
				return {
					$refText: refText !== null && refText !== void 0 ? refText : "",
					ref
				};
			} else error = ref;
		}
		if (error) {
			const ref = { $refText: refText !== null && refText !== void 0 ? refText : "" };
			ref.error = {
				container,
				property,
				message: error,
				reference: ref
			};
			return ref;
		} else return;
	}
	getRefNode(root, uri, uriConverter) {
		try {
			const fragmentIndex = uri.indexOf("#");
			if (fragmentIndex === 0) {
				const node = this.astNodeLocator.getAstNode(root, uri.substring(1));
				if (!node) return "Could not resolve path: " + uri;
				return node;
			}
			if (fragmentIndex < 0) {
				const documentUri = uriConverter ? uriConverter(uri) : URI.parse(uri);
				const document = this.langiumDocuments.getDocument(documentUri);
				if (!document) return "Could not find document for URI: " + uri;
				return document.parseResult.value;
			}
			const documentUri = uriConverter ? uriConverter(uri.substring(0, fragmentIndex)) : URI.parse(uri.substring(0, fragmentIndex));
			const document = this.langiumDocuments.getDocument(documentUri);
			if (!document) return "Could not find document for URI: " + uri;
			if (fragmentIndex === uri.length - 1) return document.parseResult.value;
			const node = this.astNodeLocator.getAstNode(document.parseResult.value, uri.substring(fragmentIndex + 1));
			if (!node) return "Could not resolve URI: " + uri;
			return node;
		} catch (err) {
			return String(err);
		}
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/service-registry.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
/**
* Generic registry for Langium services, but capable of being used with extending service sets as well (such as the lsp-complete LangiumCoreServices set)
*/
var DefaultServiceRegistry = class {
	/**
	* @deprecated Use the new `fileExtensionMap` (or `languageIdMap`) property instead.
	*/
	get map() {
		return this.fileExtensionMap;
	}
	constructor(services) {
		this.languageIdMap = /* @__PURE__ */ new Map();
		this.fileExtensionMap = /* @__PURE__ */ new Map();
		this.textDocuments = services === null || services === void 0 ? void 0 : services.workspace.TextDocuments;
	}
	register(language) {
		const data = language.LanguageMetaData;
		for (const ext of data.fileExtensions) {
			if (this.fileExtensionMap.has(ext)) console.warn(`The file extension ${ext} is used by multiple languages. It is now assigned to '${data.languageId}'.`);
			this.fileExtensionMap.set(ext, language);
		}
		this.languageIdMap.set(data.languageId, language);
		if (this.languageIdMap.size === 1) this.singleton = language;
		else this.singleton = void 0;
	}
	getServices(uri) {
		var _a, _b;
		if (this.singleton !== void 0) return this.singleton;
		if (this.languageIdMap.size === 0) throw new Error("The service registry is empty. Use `register` to register the services of a language.");
		const languageId = (_b = (_a = this.textDocuments) === null || _a === void 0 ? void 0 : _a.get(uri)) === null || _b === void 0 ? void 0 : _b.languageId;
		if (languageId !== void 0) {
			const services = this.languageIdMap.get(languageId);
			if (services) return services;
		}
		const ext = UriUtils.extname(uri);
		const services = this.fileExtensionMap.get(ext);
		if (!services) {
			if (languageId) throw new Error(`The service registry contains no services for the extension '${ext}' for language '${languageId}'.`);
			else throw new Error(`The service registry contains no services for the extension '${ext}'.`);
		}
		return services;
	}
	hasServices(uri) {
		try {
			this.getServices(uri);
			return true;
		} catch (_a) {
			return false;
		}
	}
	get all() {
		return Array.from(this.languageIdMap.values());
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/validation/validation-registry.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
/**
* Create DiagnosticData for a given diagnostic code. The result can be put into the `data` field of a DiagnosticInfo.
*/
function diagnosticData(code) {
	return { code };
}
var ValidationCategory;
(function(ValidationCategory) {
	ValidationCategory.all = [
		"fast",
		"slow",
		"built-in"
	];
})(ValidationCategory || (ValidationCategory = {}));
/**
* Manages a set of `ValidationCheck`s to be applied when documents are validated.
*/
var ValidationRegistry = class {
	constructor(services) {
		this.entries = new MultiMap();
		this.entriesBefore = [];
		this.entriesAfter = [];
		this.reflection = services.shared.AstReflection;
	}
	/**
	* Register a set of validation checks. Each value in the record can be either a single validation check (i.e. a function)
	* or an array of validation checks.
	*
	* @param checksRecord Set of validation checks to register.
	* @param category Optional category for the validation checks (defaults to `'fast'`).
	* @param thisObj Optional object to be used as `this` when calling the validation check functions.
	*/
	register(checksRecord, thisObj = this, category = "fast") {
		if (category === "built-in") throw new Error("The 'built-in' category is reserved for lexer, parser, and linker errors.");
		for (const [type, ch] of Object.entries(checksRecord)) {
			const callbacks = ch;
			if (Array.isArray(callbacks)) for (const check of callbacks) {
				const entry = {
					check: this.wrapValidationException(check, thisObj),
					category
				};
				this.addEntry(type, entry);
			}
			else if (typeof callbacks === "function") {
				const entry = {
					check: this.wrapValidationException(callbacks, thisObj),
					category
				};
				this.addEntry(type, entry);
			} else assertUnreachable(callbacks);
		}
	}
	wrapValidationException(check, thisObj) {
		return async (node, accept, cancelToken) => {
			await this.handleException(() => check.call(thisObj, node, accept, cancelToken), "An error occurred during validation", accept, node);
		};
	}
	async handleException(functionality, messageContext, accept, node) {
		try {
			await functionality();
		} catch (err) {
			if (isOperationCancelled(err)) throw err;
			console.error(`${messageContext}:`, err);
			if (err instanceof Error && err.stack) console.error(err.stack);
			accept("error", `${messageContext}: ${err instanceof Error ? err.message : String(err)}`, { node });
		}
	}
	addEntry(type, entry) {
		if (type === "AstNode") {
			this.entries.add("AstNode", entry);
			return;
		}
		for (const subtype of this.reflection.getAllSubTypes(type)) this.entries.add(subtype, entry);
	}
	getChecks(type, categories) {
		let checks = stream(this.entries.get(type)).concat(this.entries.get("AstNode"));
		if (categories) checks = checks.filter((entry) => categories.includes(entry.category));
		return checks.map((entry) => entry.check);
	}
	/**
	* Register logic which will be executed once before validating all the nodes of an AST/Langium document.
	* This helps to prepare or initialize some information which are required or reusable for the following checks on the AstNodes.
	*
	* As an example, for validating unique fully-qualified names of nodes in the AST,
	* here the map for mapping names to nodes could be established.
	* During the usual checks on the nodes, they are put into this map with their name.
	*
	* Note that this approach makes validations stateful, which is relevant e.g. when cancelling the validation.
	* Therefore it is recommended to clear stored information
	* _before_ validating an AST to validate each AST unaffected from other ASTs
	* AND _after_ validating the AST to free memory by information which are no longer used.
	*
	* @param checkBefore a set-up function which will be called once before actually validating an AST
	* @param thisObj Optional object to be used as `this` when calling the validation check functions.
	*/
	registerBeforeDocument(checkBefore, thisObj = this) {
		this.entriesBefore.push(this.wrapPreparationException(checkBefore, "An error occurred during set-up of the validation", thisObj));
	}
	/**
	* Register logic which will be executed once after validating all the nodes of an AST/Langium document.
	* This helps to finally evaluate information which are collected during the checks on the AstNodes.
	*
	* As an example, for validating unique fully-qualified names of nodes in the AST,
	* here the map with all the collected nodes and their names is checked
	* and validation hints are created for all nodes with the same name.
	*
	* Note that this approach makes validations stateful, which is relevant e.g. when cancelling the validation.
	* Therefore it is recommended to clear stored information
	* _before_ validating an AST to validate each AST unaffected from other ASTs
	* AND _after_ validating the AST to free memory by information which are no longer used.
	*
	* @param checkBefore a set-up function which will be called once before actually validating an AST
	* @param thisObj Optional object to be used as `this` when calling the validation check functions.
	*/
	registerAfterDocument(checkAfter, thisObj = this) {
		this.entriesAfter.push(this.wrapPreparationException(checkAfter, "An error occurred during tear-down of the validation", thisObj));
	}
	wrapPreparationException(check, messageContext, thisObj) {
		return async (rootNode, accept, categories, cancelToken) => {
			await this.handleException(() => check.call(thisObj, rootNode, accept, categories, cancelToken), messageContext, accept, rootNode);
		};
	}
	get checksBefore() {
		return this.entriesBefore;
	}
	get checksAfter() {
		return this.entriesAfter;
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/validation/document-validator.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var DefaultDocumentValidator = class {
	constructor(services) {
		this.validationRegistry = services.validation.ValidationRegistry;
		this.metadata = services.LanguageMetaData;
	}
	async validateDocument(document, options = {}, cancelToken = cancellation_exports.CancellationToken.None) {
		const parseResult = document.parseResult;
		const diagnostics = [];
		await interruptAndCheck(cancelToken);
		if (!options.categories || options.categories.includes("built-in")) {
			this.processLexingErrors(parseResult, diagnostics, options);
			if (options.stopAfterLexingErrors && diagnostics.some((d) => {
				var _a;
				return ((_a = d.data) === null || _a === void 0 ? void 0 : _a.code) === DocumentValidator.LexingError;
			})) return diagnostics;
			this.processParsingErrors(parseResult, diagnostics, options);
			if (options.stopAfterParsingErrors && diagnostics.some((d) => {
				var _a;
				return ((_a = d.data) === null || _a === void 0 ? void 0 : _a.code) === DocumentValidator.ParsingError;
			})) return diagnostics;
			this.processLinkingErrors(document, diagnostics, options);
			if (options.stopAfterLinkingErrors && diagnostics.some((d) => {
				var _a;
				return ((_a = d.data) === null || _a === void 0 ? void 0 : _a.code) === DocumentValidator.LinkingError;
			})) return diagnostics;
		}
		try {
			diagnostics.push(...await this.validateAst(parseResult.value, options, cancelToken));
		} catch (err) {
			if (isOperationCancelled(err)) throw err;
			console.error("An error occurred during validation:", err);
		}
		await interruptAndCheck(cancelToken);
		return diagnostics;
	}
	processLexingErrors(parseResult, diagnostics, _options) {
		var _a, _b, _c;
		const lexerDiagnostics = [...parseResult.lexerErrors, ...(_b = (_a = parseResult.lexerReport) === null || _a === void 0 ? void 0 : _a.diagnostics) !== null && _b !== void 0 ? _b : []];
		for (const lexerDiagnostic of lexerDiagnostics) {
			const severity = (_c = lexerDiagnostic.severity) !== null && _c !== void 0 ? _c : "error";
			const diagnostic = {
				severity: toDiagnosticSeverity(severity),
				range: {
					start: {
						line: lexerDiagnostic.line - 1,
						character: lexerDiagnostic.column - 1
					},
					end: {
						line: lexerDiagnostic.line - 1,
						character: lexerDiagnostic.column + lexerDiagnostic.length - 1
					}
				},
				message: lexerDiagnostic.message,
				data: toDiagnosticData(severity),
				source: this.getSource()
			};
			diagnostics.push(diagnostic);
		}
	}
	processParsingErrors(parseResult, diagnostics, _options) {
		for (const parserError of parseResult.parserErrors) {
			let range = void 0;
			if (isNaN(parserError.token.startOffset)) {
				if ("previousToken" in parserError) {
					const token = parserError.previousToken;
					if (!isNaN(token.startOffset)) {
						const position = {
							line: token.endLine - 1,
							character: token.endColumn
						};
						range = {
							start: position,
							end: position
						};
					} else {
						const position = {
							line: 0,
							character: 0
						};
						range = {
							start: position,
							end: position
						};
					}
				}
			} else range = tokenToRange(parserError.token);
			if (range) {
				const diagnostic = {
					severity: toDiagnosticSeverity("error"),
					range,
					message: parserError.message,
					data: diagnosticData(DocumentValidator.ParsingError),
					source: this.getSource()
				};
				diagnostics.push(diagnostic);
			}
		}
	}
	processLinkingErrors(document, diagnostics, _options) {
		for (const reference of document.references) {
			const linkingError = reference.error;
			if (linkingError) {
				const info = {
					node: linkingError.container,
					property: linkingError.property,
					index: linkingError.index,
					data: {
						code: DocumentValidator.LinkingError,
						containerType: linkingError.container.$type,
						property: linkingError.property,
						refText: linkingError.reference.$refText
					}
				};
				diagnostics.push(this.toDiagnostic("error", linkingError.message, info));
			}
		}
	}
	async validateAst(rootNode, options, cancelToken = cancellation_exports.CancellationToken.None) {
		const validationItems = [];
		const acceptor = (severity, message, info) => {
			validationItems.push(this.toDiagnostic(severity, message, info));
		};
		await this.validateAstBefore(rootNode, options, acceptor, cancelToken);
		await this.validateAstNodes(rootNode, options, acceptor, cancelToken);
		await this.validateAstAfter(rootNode, options, acceptor, cancelToken);
		return validationItems;
	}
	async validateAstBefore(rootNode, options, acceptor, cancelToken = cancellation_exports.CancellationToken.None) {
		var _a;
		const checksBefore = this.validationRegistry.checksBefore;
		for (const checkBefore of checksBefore) {
			await interruptAndCheck(cancelToken);
			await checkBefore(rootNode, acceptor, (_a = options.categories) !== null && _a !== void 0 ? _a : [], cancelToken);
		}
	}
	async validateAstNodes(rootNode, options, acceptor, cancelToken = cancellation_exports.CancellationToken.None) {
		await Promise.all(streamAst(rootNode).map(async (node) => {
			await interruptAndCheck(cancelToken);
			const checks = this.validationRegistry.getChecks(node.$type, options.categories);
			for (const check of checks) await check(node, acceptor, cancelToken);
		}));
	}
	async validateAstAfter(rootNode, options, acceptor, cancelToken = cancellation_exports.CancellationToken.None) {
		var _a;
		const checksAfter = this.validationRegistry.checksAfter;
		for (const checkAfter of checksAfter) {
			await interruptAndCheck(cancelToken);
			await checkAfter(rootNode, acceptor, (_a = options.categories) !== null && _a !== void 0 ? _a : [], cancelToken);
		}
	}
	toDiagnostic(severity, message, info) {
		return {
			message,
			range: getDiagnosticRange(info),
			severity: toDiagnosticSeverity(severity),
			code: info.code,
			codeDescription: info.codeDescription,
			tags: info.tags,
			relatedInformation: info.relatedInformation,
			data: info.data,
			source: this.getSource()
		};
	}
	getSource() {
		return this.metadata.languageId;
	}
};
function getDiagnosticRange(info) {
	if (info.range) return info.range;
	let cstNode;
	if (typeof info.property === "string") cstNode = findNodeForProperty(info.node.$cstNode, info.property, info.index);
	else if (typeof info.keyword === "string") cstNode = findNodeForKeyword(info.node.$cstNode, info.keyword, info.index);
	cstNode !== null && cstNode !== void 0 || (cstNode = info.node.$cstNode);
	if (!cstNode) return {
		start: {
			line: 0,
			character: 0
		},
		end: {
			line: 0,
			character: 0
		}
	};
	return cstNode.range;
}
/**
* Transforms the diagnostic severity from the {@link LexingDiagnosticSeverity} format to LSP's `DiagnosticSeverity` format.
*
* @param severity The lexing diagnostic severity
* @returns Diagnostic severity according to `vscode-languageserver-types/lib/esm/main.js#DiagnosticSeverity`
*/
function toDiagnosticSeverity(severity) {
	switch (severity) {
		case "error": return 1;
		case "warning": return 2;
		case "info": return 3;
		case "hint": return 4;
		default: throw new Error("Invalid diagnostic severity: " + severity);
	}
}
function toDiagnosticData(severity) {
	switch (severity) {
		case "error": return diagnosticData(DocumentValidator.LexingError);
		case "warning": return diagnosticData(DocumentValidator.LexingWarning);
		case "info": return diagnosticData(DocumentValidator.LexingInfo);
		case "hint": return diagnosticData(DocumentValidator.LexingHint);
		default: throw new Error("Invalid diagnostic severity: " + severity);
	}
}
var DocumentValidator;
(function(DocumentValidator) {
	DocumentValidator.LexingError = "lexing-error";
	DocumentValidator.LexingWarning = "lexing-warning";
	DocumentValidator.LexingInfo = "lexing-info";
	DocumentValidator.LexingHint = "lexing-hint";
	DocumentValidator.ParsingError = "parsing-error";
	DocumentValidator.LinkingError = "linking-error";
})(DocumentValidator || (DocumentValidator = {}));
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/workspace/ast-descriptions.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var DefaultAstNodeDescriptionProvider = class {
	constructor(services) {
		this.astNodeLocator = services.workspace.AstNodeLocator;
		this.nameProvider = services.references.NameProvider;
	}
	createDescription(node, name, document) {
		const doc = document !== null && document !== void 0 ? document : getDocument(node);
		name !== null && name !== void 0 || (name = this.nameProvider.getName(node));
		const path = this.astNodeLocator.getAstNodePath(node);
		if (!name) throw new Error(`Node at path ${path} has no name.`);
		let nameNodeSegment;
		const nameSegmentGetter = () => {
			var _a;
			return nameNodeSegment !== null && nameNodeSegment !== void 0 ? nameNodeSegment : nameNodeSegment = toDocumentSegment((_a = this.nameProvider.getNameNode(node)) !== null && _a !== void 0 ? _a : node.$cstNode);
		};
		return {
			node,
			name,
			get nameSegment() {
				return nameSegmentGetter();
			},
			selectionSegment: toDocumentSegment(node.$cstNode),
			type: node.$type,
			documentUri: doc.uri,
			path
		};
	}
};
var DefaultReferenceDescriptionProvider = class {
	constructor(services) {
		this.nodeLocator = services.workspace.AstNodeLocator;
	}
	async createDescriptions(document, cancelToken = cancellation_exports.CancellationToken.None) {
		const descr = [];
		const rootNode = document.parseResult.value;
		for (const astNode of streamAst(rootNode)) {
			await interruptAndCheck(cancelToken);
			streamReferences(astNode).filter((refInfo) => !isLinkingError(refInfo)).forEach((refInfo) => {
				const description = this.createDescription(refInfo);
				if (description) descr.push(description);
			});
		}
		return descr;
	}
	createDescription(refInfo) {
		const targetNodeDescr = refInfo.reference.$nodeDescription;
		const refCstNode = refInfo.reference.$refNode;
		if (!targetNodeDescr || !refCstNode) return;
		const docUri = getDocument(refInfo.container).uri;
		return {
			sourceUri: docUri,
			sourcePath: this.nodeLocator.getAstNodePath(refInfo.container),
			targetUri: targetNodeDescr.documentUri,
			targetPath: targetNodeDescr.path,
			segment: toDocumentSegment(refCstNode),
			local: UriUtils.equals(targetNodeDescr.documentUri, docUri)
		};
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/workspace/ast-node-locator.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var DefaultAstNodeLocator = class {
	constructor() {
		this.segmentSeparator = "/";
		this.indexSeparator = "@";
	}
	getAstNodePath(node) {
		if (node.$container) {
			const containerPath = this.getAstNodePath(node.$container);
			const newSegment = this.getPathSegment(node);
			return containerPath + this.segmentSeparator + newSegment;
		}
		return "";
	}
	getPathSegment({ $containerProperty, $containerIndex }) {
		if (!$containerProperty) throw new Error("Missing '$containerProperty' in AST node.");
		if ($containerIndex !== void 0) return $containerProperty + this.indexSeparator + $containerIndex;
		return $containerProperty;
	}
	getAstNode(node, path) {
		return path.split(this.segmentSeparator).reduce((previousValue, currentValue) => {
			if (!previousValue || currentValue.length === 0) return previousValue;
			const propertyIndex = currentValue.indexOf(this.indexSeparator);
			if (propertyIndex > 0) {
				const property = currentValue.substring(0, propertyIndex);
				const arrayIndex = parseInt(currentValue.substring(propertyIndex + 1));
				const array = previousValue[property];
				return array === null || array === void 0 ? void 0 : array[arrayIndex];
			}
			return previousValue[currentValue];
		}, node);
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/utils/event.js
var event_exports = /* @__PURE__ */ __exportAll({});
__reExport(event_exports, /* @__PURE__ */ __toESM(require_events(), 1));
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/workspace/configuration.js
/******************************************************************************
* Copyright 2022 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
/**
* Base configuration provider for building up other configuration providers
*/
var DefaultConfigurationProvider = class {
	constructor(services) {
		this._ready = new Deferred();
		this.settings = {};
		this.workspaceConfig = false;
		this.onConfigurationSectionUpdateEmitter = new event_exports.Emitter();
		this.serviceRegistry = services.ServiceRegistry;
	}
	get ready() {
		return this._ready.promise;
	}
	initialize(params) {
		var _a, _b;
		this.workspaceConfig = (_b = (_a = params.capabilities.workspace) === null || _a === void 0 ? void 0 : _a.configuration) !== null && _b !== void 0 ? _b : false;
	}
	async initialized(params) {
		if (this.workspaceConfig) {
			if (params.register) {
				const languages = this.serviceRegistry.all;
				params.register({ section: languages.map((lang) => this.toSectionName(lang.LanguageMetaData.languageId)) });
			}
			if (params.fetchConfiguration) {
				const configToUpdate = this.serviceRegistry.all.map((lang) => ({ section: this.toSectionName(lang.LanguageMetaData.languageId) }));
				const configs = await params.fetchConfiguration(configToUpdate);
				configToUpdate.forEach((conf, idx) => {
					this.updateSectionConfiguration(conf.section, configs[idx]);
				});
			}
		}
		this._ready.resolve();
	}
	/**
	*  Updates the cached configurations using the `change` notification parameters.
	*
	* @param change The parameters of a change configuration notification.
	* `settings` property of the change object could be expressed as `Record<string, Record<string, any>>`
	*/
	updateConfiguration(change) {
		if (!change.settings) return;
		Object.keys(change.settings).forEach((section) => {
			const configuration = change.settings[section];
			this.updateSectionConfiguration(section, configuration);
			this.onConfigurationSectionUpdateEmitter.fire({
				section,
				configuration
			});
		});
	}
	updateSectionConfiguration(section, configuration) {
		this.settings[section] = configuration;
	}
	/**
	* Returns a configuration value stored for the given language.
	*
	* @param language The language id
	* @param configuration Configuration name
	*/
	async getConfiguration(language, configuration) {
		await this.ready;
		const sectionName = this.toSectionName(language);
		if (this.settings[sectionName]) return this.settings[sectionName][configuration];
	}
	toSectionName(languageId) {
		return `${languageId}`;
	}
	get onConfigurationSectionUpdate() {
		return this.onConfigurationSectionUpdateEmitter.event;
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/utils/disposable.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var Disposable;
(function(Disposable) {
	function create(callback) {
		return { dispose: async () => await callback() };
	}
	Disposable.create = create;
})(Disposable || (Disposable = {}));
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/workspace/document-builder.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var DefaultDocumentBuilder = class {
	constructor(services) {
		this.updateBuildOptions = { validation: { categories: ["built-in", "fast"] } };
		this.updateListeners = [];
		this.buildPhaseListeners = new MultiMap();
		this.documentPhaseListeners = new MultiMap();
		this.buildState = /* @__PURE__ */ new Map();
		this.documentBuildWaiters = /* @__PURE__ */ new Map();
		this.currentState = DocumentState.Changed;
		this.langiumDocuments = services.workspace.LangiumDocuments;
		this.langiumDocumentFactory = services.workspace.LangiumDocumentFactory;
		this.textDocuments = services.workspace.TextDocuments;
		this.indexManager = services.workspace.IndexManager;
		this.serviceRegistry = services.ServiceRegistry;
	}
	async build(documents, options = {}, cancelToken = cancellation_exports.CancellationToken.None) {
		var _a, _b;
		for (const document of documents) {
			const key = document.uri.toString();
			if (document.state === DocumentState.Validated) {
				if (typeof options.validation === "boolean" && options.validation) {
					document.state = DocumentState.IndexedReferences;
					document.diagnostics = void 0;
					this.buildState.delete(key);
				} else if (typeof options.validation === "object") {
					const buildState = this.buildState.get(key);
					const previousCategories = (_a = buildState === null || buildState === void 0 ? void 0 : buildState.result) === null || _a === void 0 ? void 0 : _a.validationChecks;
					if (previousCategories) {
						const categories = ((_b = options.validation.categories) !== null && _b !== void 0 ? _b : ValidationCategory.all).filter((c) => !previousCategories.includes(c));
						if (categories.length > 0) {
							this.buildState.set(key, {
								completed: false,
								options: { validation: Object.assign(Object.assign({}, options.validation), { categories }) },
								result: buildState.result
							});
							document.state = DocumentState.IndexedReferences;
						}
					}
				}
			} else this.buildState.delete(key);
		}
		this.currentState = DocumentState.Changed;
		await this.emitUpdate(documents.map((e) => e.uri), []);
		await this.buildDocuments(documents, options, cancelToken);
	}
	async update(changed, deleted, cancelToken = cancellation_exports.CancellationToken.None) {
		this.currentState = DocumentState.Changed;
		for (const deletedUri of deleted) {
			this.langiumDocuments.deleteDocument(deletedUri);
			this.buildState.delete(deletedUri.toString());
			this.indexManager.remove(deletedUri);
		}
		for (const changedUri of changed) {
			if (!this.langiumDocuments.invalidateDocument(changedUri)) {
				const newDocument = this.langiumDocumentFactory.fromModel({ $type: "INVALID" }, changedUri);
				newDocument.state = DocumentState.Changed;
				this.langiumDocuments.addDocument(newDocument);
			}
			this.buildState.delete(changedUri.toString());
		}
		const allChangedUris = stream(changed).concat(deleted).map((uri) => uri.toString()).toSet();
		this.langiumDocuments.all.filter((doc) => !allChangedUris.has(doc.uri.toString()) && this.shouldRelink(doc, allChangedUris)).forEach((doc) => {
			this.serviceRegistry.getServices(doc.uri).references.Linker.unlink(doc);
			doc.state = Math.min(doc.state, DocumentState.ComputedScopes);
			doc.diagnostics = void 0;
		});
		await this.emitUpdate(changed, deleted);
		await interruptAndCheck(cancelToken);
		const rebuildDocuments = this.sortDocuments(this.langiumDocuments.all.filter((doc) => {
			var _a;
			return doc.state < DocumentState.Linked || !((_a = this.buildState.get(doc.uri.toString())) === null || _a === void 0 ? void 0 : _a.completed);
		}).toArray());
		await this.buildDocuments(rebuildDocuments, this.updateBuildOptions, cancelToken);
	}
	async emitUpdate(changed, deleted) {
		await Promise.all(this.updateListeners.map((listener) => listener(changed, deleted)));
	}
	/**
	* Sort the given documents by priority. By default, documents with an open text document are prioritized.
	* This is useful to ensure that visible documents show their diagnostics before all other documents.
	*
	* This improves the responsiveness in large workspaces as users usually don't care about diagnostics
	* in files that are currently not opened in the editor.
	*/
	sortDocuments(documents) {
		let left = 0;
		let right = documents.length - 1;
		while (left < right) {
			while (left < documents.length && this.hasTextDocument(documents[left])) left++;
			while (right >= 0 && !this.hasTextDocument(documents[right])) right--;
			if (left < right) [documents[left], documents[right]] = [documents[right], documents[left]];
		}
		return documents;
	}
	hasTextDocument(doc) {
		var _a;
		return Boolean((_a = this.textDocuments) === null || _a === void 0 ? void 0 : _a.get(doc.uri));
	}
	/**
	* Check whether the given document should be relinked after changes were found in the given URIs.
	*/
	shouldRelink(document, changedUris) {
		if (document.references.some((ref) => ref.error !== void 0)) return true;
		return this.indexManager.isAffected(document, changedUris);
	}
	onUpdate(callback) {
		this.updateListeners.push(callback);
		return Disposable.create(() => {
			const index = this.updateListeners.indexOf(callback);
			if (index >= 0) this.updateListeners.splice(index, 1);
		});
	}
	/**
	* Build the given documents by stepping through all build phases. If a document's state indicates
	* that a certain build phase is already done, the phase is skipped for that document.
	*
	* @param documents The documents to build.
	* @param options the {@link BuildOptions} to use.
	* @param cancelToken A cancellation token that can be used to cancel the build.
	* @returns A promise that resolves when the build is done.
	*/
	async buildDocuments(documents, options, cancelToken) {
		this.prepareBuild(documents, options);
		await this.runCancelable(documents, DocumentState.Parsed, cancelToken, (doc) => this.langiumDocumentFactory.update(doc, cancelToken));
		await this.runCancelable(documents, DocumentState.IndexedContent, cancelToken, (doc) => this.indexManager.updateContent(doc, cancelToken));
		await this.runCancelable(documents, DocumentState.ComputedScopes, cancelToken, async (doc) => {
			doc.precomputedScopes = await this.serviceRegistry.getServices(doc.uri).references.ScopeComputation.computeLocalScopes(doc, cancelToken);
		});
		await this.runCancelable(documents, DocumentState.Linked, cancelToken, (doc) => {
			return this.serviceRegistry.getServices(doc.uri).references.Linker.link(doc, cancelToken);
		});
		await this.runCancelable(documents, DocumentState.IndexedReferences, cancelToken, (doc) => this.indexManager.updateReferences(doc, cancelToken));
		const toBeValidated = documents.filter((doc) => this.shouldValidate(doc));
		await this.runCancelable(toBeValidated, DocumentState.Validated, cancelToken, (doc) => this.validate(doc, cancelToken));
		for (const doc of documents) {
			const state = this.buildState.get(doc.uri.toString());
			if (state) state.completed = true;
		}
	}
	/**
	* Runs prior to beginning the build process to update the {@link DocumentBuildState} for each document
	*
	* @param documents collection of documents to be built
	* @param options the {@link BuildOptions} to use
	*/
	prepareBuild(documents, options) {
		for (const doc of documents) {
			const key = doc.uri.toString();
			const state = this.buildState.get(key);
			if (!state || state.completed) this.buildState.set(key, {
				completed: false,
				options,
				result: state === null || state === void 0 ? void 0 : state.result
			});
		}
	}
	/**
	* Runs a cancelable operation on a set of documents to bring them to a specified {@link DocumentState}.
	*
	* @param documents The array of documents to process.
	* @param targetState The target {@link DocumentState} to bring the documents to.
	* @param cancelToken A token that can be used to cancel the operation.
	* @param callback A function to be called for each document.
	* @returns A promise that resolves when all documents have been processed or the operation is canceled.
	* @throws Will throw `OperationCancelled` if the operation is canceled via a `CancellationToken`.
	*/
	async runCancelable(documents, targetState, cancelToken, callback) {
		const filtered = documents.filter((doc) => doc.state < targetState);
		for (const document of filtered) {
			await interruptAndCheck(cancelToken);
			await callback(document);
			document.state = targetState;
			await this.notifyDocumentPhase(document, targetState, cancelToken);
		}
		const targetStateDocs = documents.filter((doc) => doc.state === targetState);
		await this.notifyBuildPhase(targetStateDocs, targetState, cancelToken);
		this.currentState = targetState;
	}
	onBuildPhase(targetState, callback) {
		this.buildPhaseListeners.add(targetState, callback);
		return Disposable.create(() => {
			this.buildPhaseListeners.delete(targetState, callback);
		});
	}
	onDocumentPhase(targetState, callback) {
		this.documentPhaseListeners.add(targetState, callback);
		return Disposable.create(() => {
			this.documentPhaseListeners.delete(targetState, callback);
		});
	}
	waitUntil(state, uriOrToken, cancelToken) {
		let uri = void 0;
		if (uriOrToken && "path" in uriOrToken) uri = uriOrToken;
		else cancelToken = uriOrToken;
		cancelToken !== null && cancelToken !== void 0 || (cancelToken = cancellation_exports.CancellationToken.None);
		if (uri) {
			const document = this.langiumDocuments.getDocument(uri);
			if (document && document.state > state) return Promise.resolve(uri);
		}
		if (this.currentState >= state) return Promise.resolve(void 0);
		else if (cancelToken.isCancellationRequested) return Promise.reject(OperationCancelled);
		return new Promise((resolve, reject) => {
			const buildDisposable = this.onBuildPhase(state, () => {
				buildDisposable.dispose();
				cancelDisposable.dispose();
				if (uri) {
					const document = this.langiumDocuments.getDocument(uri);
					resolve(document === null || document === void 0 ? void 0 : document.uri);
				} else resolve(void 0);
			});
			const cancelDisposable = cancelToken.onCancellationRequested(() => {
				buildDisposable.dispose();
				cancelDisposable.dispose();
				reject(OperationCancelled);
			});
		});
	}
	async notifyDocumentPhase(document, state, cancelToken) {
		const listenersCopy = this.documentPhaseListeners.get(state).slice();
		for (const listener of listenersCopy) try {
			await listener(document, cancelToken);
		} catch (err) {
			if (!isOperationCancelled(err)) throw err;
		}
	}
	async notifyBuildPhase(documents, state, cancelToken) {
		if (documents.length === 0) return;
		const listenersCopy = this.buildPhaseListeners.get(state).slice();
		for (const listener of listenersCopy) {
			await interruptAndCheck(cancelToken);
			await listener(documents, cancelToken);
		}
	}
	/**
	* Determine whether the given document should be validated during a build. The default
	* implementation checks the `validation` property of the build options. If it's set to `true`
	* or a `ValidationOptions` object, the document is included in the validation phase.
	*/
	shouldValidate(document) {
		return Boolean(this.getBuildOptions(document).validation);
	}
	/**
	* Run validation checks on the given document and store the resulting diagnostics in the document.
	* If the document already contains diagnostics, the new ones are added to the list.
	*/
	async validate(document, cancelToken) {
		var _a, _b;
		const validator = this.serviceRegistry.getServices(document.uri).validation.DocumentValidator;
		const validationSetting = this.getBuildOptions(document).validation;
		const options = typeof validationSetting === "object" ? validationSetting : void 0;
		const diagnostics = await validator.validateDocument(document, options, cancelToken);
		if (document.diagnostics) document.diagnostics.push(...diagnostics);
		else document.diagnostics = diagnostics;
		const state = this.buildState.get(document.uri.toString());
		if (state) {
			(_a = state.result) !== null && _a !== void 0 || (state.result = {});
			const newCategories = (_b = options === null || options === void 0 ? void 0 : options.categories) !== null && _b !== void 0 ? _b : ValidationCategory.all;
			if (state.result.validationChecks) state.result.validationChecks.push(...newCategories);
			else state.result.validationChecks = [...newCategories];
		}
	}
	getBuildOptions(document) {
		var _a, _b;
		return (_b = (_a = this.buildState.get(document.uri.toString())) === null || _a === void 0 ? void 0 : _a.options) !== null && _b !== void 0 ? _b : {};
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/workspace/index-manager.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var DefaultIndexManager = class {
	constructor(services) {
		/**
		* The symbol index stores all `AstNodeDescription` items exported by a document.
		* The key used in this map is the string representation of the specific document URI.
		*/
		this.symbolIndex = /* @__PURE__ */ new Map();
		/**
		* This is a cache for the `allElements()` method.
		* It caches the descriptions from `symbolIndex` grouped by types.
		*/
		this.symbolByTypeIndex = new ContextCache();
		/**
		* This index keeps track of all `ReferenceDescription` items exported by a document.
		* This is used to compute which elements are affected by a document change
		* and for finding references to an AST node.
		*/
		this.referenceIndex = /* @__PURE__ */ new Map();
		this.documents = services.workspace.LangiumDocuments;
		this.serviceRegistry = services.ServiceRegistry;
		this.astReflection = services.AstReflection;
	}
	findAllReferences(targetNode, astNodePath) {
		const targetDocUri = getDocument(targetNode).uri;
		const result = [];
		this.referenceIndex.forEach((docRefs) => {
			docRefs.forEach((refDescr) => {
				if (UriUtils.equals(refDescr.targetUri, targetDocUri) && refDescr.targetPath === astNodePath) result.push(refDescr);
			});
		});
		return stream(result);
	}
	allElements(nodeType, uris) {
		let documentUris = stream(this.symbolIndex.keys());
		if (uris) documentUris = documentUris.filter((uri) => !uris || uris.has(uri));
		return documentUris.map((uri) => this.getFileDescriptions(uri, nodeType)).flat();
	}
	getFileDescriptions(uri, nodeType) {
		var _a;
		if (!nodeType) return (_a = this.symbolIndex.get(uri)) !== null && _a !== void 0 ? _a : [];
		return this.symbolByTypeIndex.get(uri, nodeType, () => {
			var _a;
			return ((_a = this.symbolIndex.get(uri)) !== null && _a !== void 0 ? _a : []).filter((e) => this.astReflection.isSubtype(e.type, nodeType));
		});
	}
	remove(uri) {
		const uriString = uri.toString();
		this.symbolIndex.delete(uriString);
		this.symbolByTypeIndex.clear(uriString);
		this.referenceIndex.delete(uriString);
	}
	async updateContent(document, cancelToken = cancellation_exports.CancellationToken.None) {
		const exports = await this.serviceRegistry.getServices(document.uri).references.ScopeComputation.computeExports(document, cancelToken);
		const uri = document.uri.toString();
		this.symbolIndex.set(uri, exports);
		this.symbolByTypeIndex.clear(uri);
	}
	async updateReferences(document, cancelToken = cancellation_exports.CancellationToken.None) {
		const indexData = await this.serviceRegistry.getServices(document.uri).workspace.ReferenceDescriptionProvider.createDescriptions(document, cancelToken);
		this.referenceIndex.set(document.uri.toString(), indexData);
	}
	isAffected(document, changedUris) {
		const references = this.referenceIndex.get(document.uri.toString());
		if (!references) return false;
		return references.some((ref) => !ref.local && changedUris.has(ref.targetUri.toString()));
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/workspace/workspace-manager.js
/******************************************************************************
* Copyright 2022 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var DefaultWorkspaceManager = class {
	constructor(services) {
		this.initialBuildOptions = {};
		this._ready = new Deferred();
		this.serviceRegistry = services.ServiceRegistry;
		this.langiumDocuments = services.workspace.LangiumDocuments;
		this.documentBuilder = services.workspace.DocumentBuilder;
		this.fileSystemProvider = services.workspace.FileSystemProvider;
		this.mutex = services.workspace.WorkspaceLock;
	}
	get ready() {
		return this._ready.promise;
	}
	get workspaceFolders() {
		return this.folders;
	}
	initialize(params) {
		var _a;
		this.folders = (_a = params.workspaceFolders) !== null && _a !== void 0 ? _a : void 0;
	}
	initialized(_params) {
		return this.mutex.write((token) => {
			var _a;
			return this.initializeWorkspace((_a = this.folders) !== null && _a !== void 0 ? _a : [], token);
		});
	}
	async initializeWorkspace(folders, cancelToken = cancellation_exports.CancellationToken.None) {
		const documents = await this.performStartup(folders);
		await interruptAndCheck(cancelToken);
		await this.documentBuilder.build(documents, this.initialBuildOptions, cancelToken);
	}
	/**
	* Performs the uninterruptable startup sequence of the workspace manager.
	* This methods loads all documents in the workspace and other documents and returns them.
	*/
	async performStartup(folders) {
		const fileExtensions = this.serviceRegistry.all.flatMap((e) => e.LanguageMetaData.fileExtensions);
		const documents = [];
		const collector = (document) => {
			documents.push(document);
			if (!this.langiumDocuments.hasDocument(document.uri)) this.langiumDocuments.addDocument(document);
		};
		await this.loadAdditionalDocuments(folders, collector);
		await Promise.all(folders.map((wf) => [wf, this.getRootFolder(wf)]).map(async (entry) => this.traverseFolder(...entry, fileExtensions, collector)));
		this._ready.resolve();
		return documents;
	}
	/**
	* Load all additional documents that shall be visible in the context of the given workspace
	* folders and add them to the collector. This can be used to include built-in libraries of
	* your language, which can be either loaded from provided files or constructed in memory.
	*/
	loadAdditionalDocuments(_folders, _collector) {
		return Promise.resolve();
	}
	/**
	* Determine the root folder of the source documents in the given workspace folder.
	* The default implementation returns the URI of the workspace folder, but you can override
	* this to return a subfolder like `src` instead.
	*/
	getRootFolder(workspaceFolder) {
		return URI.parse(workspaceFolder.uri);
	}
	/**
	* Traverse the file system folder identified by the given URI and its subfolders. All
	* contained files that match the file extensions are added to the collector.
	*/
	async traverseFolder(workspaceFolder, folderPath, fileExtensions, collector) {
		const content = await this.fileSystemProvider.readDirectory(folderPath);
		await Promise.all(content.map(async (entry) => {
			if (this.includeEntry(workspaceFolder, entry, fileExtensions)) {
				if (entry.isDirectory) await this.traverseFolder(workspaceFolder, entry.uri, fileExtensions, collector);
				else if (entry.isFile) collector(await this.langiumDocuments.getOrCreateDocument(entry.uri));
			}
		}));
	}
	/**
	* Determine whether the given folder entry shall be included while indexing the workspace.
	*/
	includeEntry(_workspaceFolder, entry, fileExtensions) {
		const name = UriUtils.basename(entry.uri);
		if (name.startsWith(".")) return false;
		if (entry.isDirectory) return name !== "node_modules" && name !== "out";
		else if (entry.isFile) {
			const extname = UriUtils.extname(entry.uri);
			return fileExtensions.includes(extname);
		}
		return false;
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/parser/lexer.js
/******************************************************************************
* Copyright 2022 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var DefaultLexerErrorMessageProvider = class {
	buildUnexpectedCharactersMessage(fullText, startOffset, length, line, column) {
		return defaultLexerErrorProvider.buildUnexpectedCharactersMessage(fullText, startOffset, length, line, column);
	}
	buildUnableToPopLexerModeMessage(token) {
		return defaultLexerErrorProvider.buildUnableToPopLexerModeMessage(token);
	}
};
var DEFAULT_TOKENIZE_OPTIONS = { mode: "full" };
var DefaultLexer = class {
	constructor(services) {
		this.errorMessageProvider = services.parser.LexerErrorMessageProvider;
		this.tokenBuilder = services.parser.TokenBuilder;
		const tokens = this.tokenBuilder.buildTokens(services.Grammar, { caseInsensitive: services.LanguageMetaData.caseInsensitive });
		this.tokenTypes = this.toTokenTypeDictionary(tokens);
		const lexerTokens = isTokenTypeDictionary(tokens) ? Object.values(tokens) : tokens;
		const production = services.LanguageMetaData.mode === "production";
		this.chevrotainLexer = new Lexer(lexerTokens, {
			positionTracking: "full",
			skipValidations: production,
			errorMessageProvider: this.errorMessageProvider
		});
	}
	get definition() {
		return this.tokenTypes;
	}
	tokenize(text, _options = DEFAULT_TOKENIZE_OPTIONS) {
		var _a, _b, _c;
		const chevrotainResult = this.chevrotainLexer.tokenize(text);
		return {
			tokens: chevrotainResult.tokens,
			errors: chevrotainResult.errors,
			hidden: (_a = chevrotainResult.groups.hidden) !== null && _a !== void 0 ? _a : [],
			report: (_c = (_b = this.tokenBuilder).flushLexingReport) === null || _c === void 0 ? void 0 : _c.call(_b, text)
		};
	}
	toTokenTypeDictionary(buildTokens) {
		if (isTokenTypeDictionary(buildTokens)) return buildTokens;
		const tokens = isIMultiModeLexerDefinition(buildTokens) ? Object.values(buildTokens.modes).flat() : buildTokens;
		const res = {};
		tokens.forEach((token) => res[token.name] = token);
		return res;
	}
};
/**
* Returns a check whether the given TokenVocabulary is TokenType array
*/
function isTokenTypeArray(tokenVocabulary) {
	return Array.isArray(tokenVocabulary) && (tokenVocabulary.length === 0 || "name" in tokenVocabulary[0]);
}
/**
* Returns a check whether the given TokenVocabulary is IMultiModeLexerDefinition
*/
function isIMultiModeLexerDefinition(tokenVocabulary) {
	return tokenVocabulary && "modes" in tokenVocabulary && "defaultMode" in tokenVocabulary;
}
/**
* Returns a check whether the given TokenVocabulary is TokenTypeDictionary
*/
function isTokenTypeDictionary(tokenVocabulary) {
	return !isTokenTypeArray(tokenVocabulary) && !isIMultiModeLexerDefinition(tokenVocabulary);
}
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/documentation/jsdoc.js
/******************************************************************************
* Copyright 2023 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
function parseJSDoc(node, start, options) {
	let opts;
	let position;
	if (typeof node === "string") {
		position = start;
		opts = options;
	} else {
		position = node.range.start;
		opts = start;
	}
	if (!position) position = Position.create(0, 0);
	const lines = getLines(node);
	const normalizedOptions = normalizeOptions(opts);
	return parseJSDocComment({
		index: 0,
		tokens: tokenize({
			lines,
			position,
			options: normalizedOptions
		}),
		position
	});
}
function isJSDoc(node, options) {
	const normalizedOptions = normalizeOptions(options);
	const lines = getLines(node);
	if (lines.length === 0) return false;
	const first = lines[0];
	const last = lines[lines.length - 1];
	const firstRegex = normalizedOptions.start;
	const lastRegex = normalizedOptions.end;
	return Boolean(firstRegex === null || firstRegex === void 0 ? void 0 : firstRegex.exec(first)) && Boolean(lastRegex === null || lastRegex === void 0 ? void 0 : lastRegex.exec(last));
}
function getLines(node) {
	let content = "";
	if (typeof node === "string") content = node;
	else content = node.text;
	return content.split(NEWLINE_REGEXP);
}
var tagRegex = /\s*(@([\p{L}][\p{L}\p{N}]*)?)/uy;
var inlineTagRegex = /\{(@[\p{L}][\p{L}\p{N}]*)(\s*)([^\r\n}]+)?\}/gu;
function tokenize(context) {
	var _a, _b, _c;
	const tokens = [];
	let currentLine = context.position.line;
	let currentCharacter = context.position.character;
	for (let i = 0; i < context.lines.length; i++) {
		const first = i === 0;
		const last = i === context.lines.length - 1;
		let line = context.lines[i];
		let index = 0;
		if (first && context.options.start) {
			const match = (_a = context.options.start) === null || _a === void 0 ? void 0 : _a.exec(line);
			if (match) index = match.index + match[0].length;
		} else {
			const match = (_b = context.options.line) === null || _b === void 0 ? void 0 : _b.exec(line);
			if (match) index = match.index + match[0].length;
		}
		if (last) {
			const match = (_c = context.options.end) === null || _c === void 0 ? void 0 : _c.exec(line);
			if (match) line = line.substring(0, match.index);
		}
		line = line.substring(0, lastCharacter(line));
		if (skipWhitespace(line, index) >= line.length) {
			if (tokens.length > 0) {
				const position = Position.create(currentLine, currentCharacter);
				tokens.push({
					type: "break",
					content: "",
					range: Range.create(position, position)
				});
			}
		} else {
			tagRegex.lastIndex = index;
			const tagMatch = tagRegex.exec(line);
			if (tagMatch) {
				const fullMatch = tagMatch[0];
				const value = tagMatch[1];
				const start = Position.create(currentLine, currentCharacter + index);
				const end = Position.create(currentLine, currentCharacter + index + fullMatch.length);
				tokens.push({
					type: "tag",
					content: value,
					range: Range.create(start, end)
				});
				index += fullMatch.length;
				index = skipWhitespace(line, index);
			}
			if (index < line.length) {
				const rest = line.substring(index);
				const inlineTagMatches = Array.from(rest.matchAll(inlineTagRegex));
				tokens.push(...buildInlineTokens(inlineTagMatches, rest, currentLine, currentCharacter + index));
			}
		}
		currentLine++;
		currentCharacter = 0;
	}
	if (tokens.length > 0 && tokens[tokens.length - 1].type === "break") return tokens.slice(0, -1);
	return tokens;
}
function buildInlineTokens(tags, line, lineIndex, characterIndex) {
	const tokens = [];
	if (tags.length === 0) {
		const start = Position.create(lineIndex, characterIndex);
		const end = Position.create(lineIndex, characterIndex + line.length);
		tokens.push({
			type: "text",
			content: line,
			range: Range.create(start, end)
		});
	} else {
		let lastIndex = 0;
		for (const match of tags) {
			const matchIndex = match.index;
			const startContent = line.substring(lastIndex, matchIndex);
			if (startContent.length > 0) tokens.push({
				type: "text",
				content: line.substring(lastIndex, matchIndex),
				range: Range.create(Position.create(lineIndex, lastIndex + characterIndex), Position.create(lineIndex, matchIndex + characterIndex))
			});
			let offset = startContent.length + 1;
			const tagName = match[1];
			tokens.push({
				type: "inline-tag",
				content: tagName,
				range: Range.create(Position.create(lineIndex, lastIndex + offset + characterIndex), Position.create(lineIndex, lastIndex + offset + tagName.length + characterIndex))
			});
			offset += tagName.length;
			if (match.length === 4) {
				offset += match[2].length;
				const value = match[3];
				tokens.push({
					type: "text",
					content: value,
					range: Range.create(Position.create(lineIndex, lastIndex + offset + characterIndex), Position.create(lineIndex, lastIndex + offset + value.length + characterIndex))
				});
			} else tokens.push({
				type: "text",
				content: "",
				range: Range.create(Position.create(lineIndex, lastIndex + offset + characterIndex), Position.create(lineIndex, lastIndex + offset + characterIndex))
			});
			lastIndex = matchIndex + match[0].length;
		}
		const endContent = line.substring(lastIndex);
		if (endContent.length > 0) tokens.push({
			type: "text",
			content: endContent,
			range: Range.create(Position.create(lineIndex, lastIndex + characterIndex), Position.create(lineIndex, lastIndex + characterIndex + endContent.length))
		});
	}
	return tokens;
}
var nonWhitespaceRegex = /\S/;
var whitespaceEndRegex = /\s*$/;
function skipWhitespace(line, index) {
	const match = line.substring(index).match(nonWhitespaceRegex);
	if (match) return index + match.index;
	else return line.length;
}
function lastCharacter(line) {
	const match = line.match(whitespaceEndRegex);
	if (match && typeof match.index === "number") return match.index;
}
function parseJSDocComment(context) {
	var _a, _b, _c, _d;
	const startPosition = Position.create(context.position.line, context.position.character);
	if (context.tokens.length === 0) return new JSDocCommentImpl([], Range.create(startPosition, startPosition));
	const elements = [];
	while (context.index < context.tokens.length) {
		const element = parseJSDocElement(context, elements[elements.length - 1]);
		if (element) elements.push(element);
	}
	const start = (_b = (_a = elements[0]) === null || _a === void 0 ? void 0 : _a.range.start) !== null && _b !== void 0 ? _b : startPosition;
	const end = (_d = (_c = elements[elements.length - 1]) === null || _c === void 0 ? void 0 : _c.range.end) !== null && _d !== void 0 ? _d : startPosition;
	return new JSDocCommentImpl(elements, Range.create(start, end));
}
function parseJSDocElement(context, last) {
	const next = context.tokens[context.index];
	if (next.type === "tag") return parseJSDocTag(context, false);
	else if (next.type === "text" || next.type === "inline-tag") return parseJSDocText(context);
	else {
		appendEmptyLine(next, last);
		context.index++;
		return;
	}
}
function appendEmptyLine(token, element) {
	if (element) {
		const line = new JSDocLineImpl("", token.range);
		if ("inlines" in element) element.inlines.push(line);
		else element.content.inlines.push(line);
	}
}
function parseJSDocText(context) {
	let token = context.tokens[context.index];
	const firstToken = token;
	let lastToken = token;
	const lines = [];
	while (token && token.type !== "break" && token.type !== "tag") {
		lines.push(parseJSDocInline(context));
		lastToken = token;
		token = context.tokens[context.index];
	}
	return new JSDocTextImpl(lines, Range.create(firstToken.range.start, lastToken.range.end));
}
function parseJSDocInline(context) {
	if (context.tokens[context.index].type === "inline-tag") return parseJSDocTag(context, true);
	else return parseJSDocLine(context);
}
function parseJSDocTag(context, inline) {
	const tagToken = context.tokens[context.index++];
	const name = tagToken.content.substring(1);
	const nextToken = context.tokens[context.index];
	if ((nextToken === null || nextToken === void 0 ? void 0 : nextToken.type) === "text") {
		if (inline) {
			const docLine = parseJSDocLine(context);
			return new JSDocTagImpl(name, new JSDocTextImpl([docLine], docLine.range), inline, Range.create(tagToken.range.start, docLine.range.end));
		} else {
			const textDoc = parseJSDocText(context);
			return new JSDocTagImpl(name, textDoc, inline, Range.create(tagToken.range.start, textDoc.range.end));
		}
	} else {
		const range = tagToken.range;
		return new JSDocTagImpl(name, new JSDocTextImpl([], range), inline, range);
	}
}
function parseJSDocLine(context) {
	const token = context.tokens[context.index++];
	return new JSDocLineImpl(token.content, token.range);
}
function normalizeOptions(options) {
	if (!options) return normalizeOptions({
		start: "/**",
		end: "*/",
		line: "*"
	});
	const { start, end, line } = options;
	return {
		start: normalizeOption(start, true),
		end: normalizeOption(end, false),
		line: normalizeOption(line, true)
	};
}
function normalizeOption(option, start) {
	if (typeof option === "string" || typeof option === "object") {
		const escaped = typeof option === "string" ? escapeRegExp(option) : option.source;
		if (start) return new RegExp(`^\\s*${escaped}`);
		else return new RegExp(`\\s*${escaped}\\s*$`);
	} else return option;
}
var JSDocCommentImpl = class {
	constructor(elements, range) {
		this.elements = elements;
		this.range = range;
	}
	getTag(name) {
		return this.getAllTags().find((e) => e.name === name);
	}
	getTags(name) {
		return this.getAllTags().filter((e) => e.name === name);
	}
	getAllTags() {
		return this.elements.filter((e) => "name" in e);
	}
	toString() {
		let value = "";
		for (const element of this.elements) if (value.length === 0) value = element.toString();
		else {
			const text = element.toString();
			value += fillNewlines(value) + text;
		}
		return value.trim();
	}
	toMarkdown(options) {
		let value = "";
		for (const element of this.elements) if (value.length === 0) value = element.toMarkdown(options);
		else {
			const text = element.toMarkdown(options);
			value += fillNewlines(value) + text;
		}
		return value.trim();
	}
};
var JSDocTagImpl = class {
	constructor(name, content, inline, range) {
		this.name = name;
		this.content = content;
		this.inline = inline;
		this.range = range;
	}
	toString() {
		let text = `@${this.name}`;
		const content = this.content.toString();
		if (this.content.inlines.length === 1) text = `${text} ${content}`;
		else if (this.content.inlines.length > 1) text = `${text}\n${content}`;
		if (this.inline) return `{${text}}`;
		else return text;
	}
	toMarkdown(options) {
		var _a, _b;
		return (_b = (_a = options === null || options === void 0 ? void 0 : options.renderTag) === null || _a === void 0 ? void 0 : _a.call(options, this)) !== null && _b !== void 0 ? _b : this.toMarkdownDefault(options);
	}
	toMarkdownDefault(options) {
		const content = this.content.toMarkdown(options);
		if (this.inline) {
			const rendered = renderInlineTag(this.name, content, options !== null && options !== void 0 ? options : {});
			if (typeof rendered === "string") return rendered;
		}
		let marker = "";
		if ((options === null || options === void 0 ? void 0 : options.tag) === "italic" || (options === null || options === void 0 ? void 0 : options.tag) === void 0) marker = "*";
		else if ((options === null || options === void 0 ? void 0 : options.tag) === "bold") marker = "**";
		else if ((options === null || options === void 0 ? void 0 : options.tag) === "bold-italic") marker = "***";
		let text = `${marker}@${this.name}${marker}`;
		if (this.content.inlines.length === 1) text = `${text} — ${content}`;
		else if (this.content.inlines.length > 1) text = `${text}\n${content}`;
		if (this.inline) return `{${text}}`;
		else return text;
	}
};
function renderInlineTag(tag, content, options) {
	var _a, _b;
	if (tag === "linkplain" || tag === "linkcode" || tag === "link") {
		const index = content.indexOf(" ");
		let display = content;
		if (index > 0) {
			const displayStart = skipWhitespace(content, index);
			display = content.substring(displayStart);
			content = content.substring(0, index);
		}
		if (tag === "linkcode" || tag === "link" && options.link === "code") display = `\`${display}\``;
		return (_b = (_a = options.renderLink) === null || _a === void 0 ? void 0 : _a.call(options, content, display)) !== null && _b !== void 0 ? _b : renderLinkDefault(content, display);
	}
}
function renderLinkDefault(content, display) {
	try {
		URI.parse(content, true);
		return `[${display}](${content})`;
	} catch (_a) {
		return content;
	}
}
var JSDocTextImpl = class {
	constructor(lines, range) {
		this.inlines = lines;
		this.range = range;
	}
	toString() {
		let text = "";
		for (let i = 0; i < this.inlines.length; i++) {
			const inline = this.inlines[i];
			const next = this.inlines[i + 1];
			text += inline.toString();
			if (next && next.range.start.line > inline.range.start.line) text += "\n";
		}
		return text;
	}
	toMarkdown(options) {
		let text = "";
		for (let i = 0; i < this.inlines.length; i++) {
			const inline = this.inlines[i];
			const next = this.inlines[i + 1];
			text += inline.toMarkdown(options);
			if (next && next.range.start.line > inline.range.start.line) text += "\n";
		}
		return text;
	}
};
var JSDocLineImpl = class {
	constructor(text, range) {
		this.text = text;
		this.range = range;
	}
	toString() {
		return this.text;
	}
	toMarkdown() {
		return this.text;
	}
};
function fillNewlines(text) {
	if (text.endsWith("\n")) return "\n";
	else return "\n\n";
}
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/documentation/documentation-provider.js
/******************************************************************************
* Copyright 2023 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var JSDocDocumentationProvider = class {
	constructor(services) {
		this.indexManager = services.shared.workspace.IndexManager;
		this.commentProvider = services.documentation.CommentProvider;
	}
	getDocumentation(node) {
		const comment = this.commentProvider.getComment(node);
		if (comment && isJSDoc(comment)) return parseJSDoc(comment).toMarkdown({
			renderLink: (link, display) => {
				return this.documentationLinkRenderer(node, link, display);
			},
			renderTag: (tag) => {
				return this.documentationTagRenderer(node, tag);
			}
		});
	}
	documentationLinkRenderer(node, name, display) {
		var _a;
		const description = (_a = this.findNameInPrecomputedScopes(node, name)) !== null && _a !== void 0 ? _a : this.findNameInGlobalScope(node, name);
		if (description && description.nameSegment) {
			const line = description.nameSegment.range.start.line + 1;
			const character = description.nameSegment.range.start.character + 1;
			return `[${display}](${description.documentUri.with({ fragment: `L${line},${character}` }).toString()})`;
		} else return;
	}
	documentationTagRenderer(_node, _tag) {}
	findNameInPrecomputedScopes(node, name) {
		const precomputed = getDocument(node).precomputedScopes;
		if (!precomputed) return;
		let currentNode = node;
		do {
			const description = precomputed.get(currentNode).find((e) => e.name === name);
			if (description) return description;
			currentNode = currentNode.$container;
		} while (currentNode);
	}
	findNameInGlobalScope(node, name) {
		return this.indexManager.allElements().find((e) => e.name === name);
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/documentation/comment-provider.js
/******************************************************************************
* Copyright 2023 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var DefaultCommentProvider = class {
	constructor(services) {
		this.grammarConfig = () => services.parser.GrammarConfig;
	}
	getComment(node) {
		var _a;
		if (isAstNodeWithComment(node)) return node.$comment;
		return (_a = findCommentNode(node.$cstNode, this.grammarConfig().multilineCommentRules)) === null || _a === void 0 ? void 0 : _a.text;
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/parser/async-parser.js
/******************************************************************************
* Copyright 2023 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
/**
* Default implementation of the async parser which simply wraps the sync parser in a promise.
*
* @remarks
* A real implementation would create worker threads or web workers to offload the parsing work.
*/
var DefaultAsyncParser = class {
	constructor(services) {
		this.syncParser = services.parser.LangiumParser;
	}
	parse(text, _cancelToken) {
		return Promise.resolve(this.syncParser.parse(text));
	}
};
var AbstractThreadedAsyncParser = class {
	constructor(services) {
		/**
		* The thread count determines how many threads are used to parse files in parallel.
		* The default value is 8. Decreasing this value increases startup performance, but decreases parallel parsing performance.
		*/
		this.threadCount = 8;
		/**
		* The termination delay determines how long the parser waits for a thread to finish after a cancellation request.
		* The default value is 200(ms).
		*/
		this.terminationDelay = 200;
		this.workerPool = [];
		this.queue = [];
		this.hydrator = services.serializer.Hydrator;
	}
	initializeWorkers() {
		while (this.workerPool.length < this.threadCount) {
			const worker = this.createWorker();
			worker.onReady(() => {
				if (this.queue.length > 0) {
					const deferred = this.queue.shift();
					if (deferred) {
						worker.lock();
						deferred.resolve(worker);
					}
				}
			});
			this.workerPool.push(worker);
		}
	}
	async parse(text, cancelToken) {
		const worker = await this.acquireParserWorker(cancelToken);
		const deferred = new Deferred();
		let timeout;
		const cancellation = cancelToken.onCancellationRequested(() => {
			timeout = setTimeout(() => {
				this.terminateWorker(worker);
			}, this.terminationDelay);
		});
		worker.parse(text).then((result) => {
			const hydrated = this.hydrator.hydrate(result);
			deferred.resolve(hydrated);
		}).catch((err) => {
			deferred.reject(err);
		}).finally(() => {
			cancellation.dispose();
			clearTimeout(timeout);
		});
		return deferred.promise;
	}
	terminateWorker(worker) {
		worker.terminate();
		const index = this.workerPool.indexOf(worker);
		if (index >= 0) this.workerPool.splice(index, 1);
	}
	async acquireParserWorker(cancelToken) {
		this.initializeWorkers();
		for (const worker of this.workerPool) if (worker.ready) {
			worker.lock();
			return worker;
		}
		const deferred = new Deferred();
		cancelToken.onCancellationRequested(() => {
			const index = this.queue.indexOf(deferred);
			if (index >= 0) this.queue.splice(index, 1);
			deferred.reject(OperationCancelled);
		});
		this.queue.push(deferred);
		return deferred.promise;
	}
};
var ParserWorker = class {
	get ready() {
		return this._ready;
	}
	get onReady() {
		return this.onReadyEmitter.event;
	}
	constructor(sendMessage, onMessage, onError, terminate) {
		this.onReadyEmitter = new event_exports.Emitter();
		this.deferred = new Deferred();
		this._ready = true;
		this._parsing = false;
		this.sendMessage = sendMessage;
		this._terminate = terminate;
		onMessage((result) => {
			const parseResult = result;
			this.deferred.resolve(parseResult);
			this.unlock();
		});
		onError((error) => {
			this.deferred.reject(error);
			this.unlock();
		});
	}
	terminate() {
		this.deferred.reject(OperationCancelled);
		this._terminate();
	}
	lock() {
		this._ready = false;
	}
	unlock() {
		this._parsing = false;
		this._ready = true;
		this.onReadyEmitter.fire();
	}
	parse(text) {
		if (this._parsing) throw new Error("Parser worker is busy");
		this._parsing = true;
		this.deferred = new Deferred();
		this.sendMessage(text);
		return this.deferred.promise;
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/workspace/workspace-lock.js
/******************************************************************************
* Copyright 2023 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var DefaultWorkspaceLock = class {
	constructor() {
		this.previousTokenSource = new cancellation_exports.CancellationTokenSource();
		this.writeQueue = [];
		this.readQueue = [];
		this.done = true;
	}
	write(action) {
		this.cancelWrite();
		const tokenSource = startCancelableOperation();
		this.previousTokenSource = tokenSource;
		return this.enqueue(this.writeQueue, action, tokenSource.token);
	}
	read(action) {
		return this.enqueue(this.readQueue, action);
	}
	enqueue(queue, action, cancellationToken = cancellation_exports.CancellationToken.None) {
		const deferred = new Deferred();
		const entry = {
			action,
			deferred,
			cancellationToken
		};
		queue.push(entry);
		this.performNextOperation();
		return deferred.promise;
	}
	async performNextOperation() {
		if (!this.done) return;
		const entries = [];
		if (this.writeQueue.length > 0) entries.push(this.writeQueue.shift());
		else if (this.readQueue.length > 0) entries.push(...this.readQueue.splice(0, this.readQueue.length));
		else return;
		this.done = false;
		await Promise.all(entries.map(async ({ action, deferred, cancellationToken }) => {
			try {
				const result = await Promise.resolve().then(() => action(cancellationToken));
				deferred.resolve(result);
			} catch (err) {
				if (isOperationCancelled(err)) deferred.resolve(void 0);
				else deferred.reject(err);
			}
		}));
		this.done = true;
		this.performNextOperation();
	}
	cancelWrite() {
		this.previousTokenSource.cancel();
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/serializer/hydrator.js
/******************************************************************************
* Copyright 2024 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var DefaultHydrator = class {
	constructor(services) {
		this.grammarElementIdMap = new BiMap();
		this.tokenTypeIdMap = new BiMap();
		this.grammar = services.Grammar;
		this.lexer = services.parser.Lexer;
		this.linker = services.references.Linker;
	}
	dehydrate(result) {
		return {
			lexerErrors: result.lexerErrors,
			lexerReport: result.lexerReport ? this.dehydrateLexerReport(result.lexerReport) : void 0,
			parserErrors: result.parserErrors.map((e) => Object.assign(Object.assign({}, e), { message: e.message })),
			value: this.dehydrateAstNode(result.value, this.createDehyrationContext(result.value))
		};
	}
	dehydrateLexerReport(lexerReport) {
		return lexerReport;
	}
	createDehyrationContext(node) {
		const astNodes = /* @__PURE__ */ new Map();
		const cstNodes = /* @__PURE__ */ new Map();
		for (const astNode of streamAst(node)) astNodes.set(astNode, {});
		if (node.$cstNode) for (const cstNode of streamCst(node.$cstNode)) cstNodes.set(cstNode, {});
		return {
			astNodes,
			cstNodes
		};
	}
	dehydrateAstNode(node, context) {
		const obj = context.astNodes.get(node);
		obj.$type = node.$type;
		obj.$containerIndex = node.$containerIndex;
		obj.$containerProperty = node.$containerProperty;
		if (node.$cstNode !== void 0) obj.$cstNode = this.dehydrateCstNode(node.$cstNode, context);
		for (const [name, value] of Object.entries(node)) {
			if (name.startsWith("$")) continue;
			if (Array.isArray(value)) {
				const arr = [];
				obj[name] = arr;
				for (const item of value) if (isAstNode(item)) arr.push(this.dehydrateAstNode(item, context));
				else if (isReference(item)) arr.push(this.dehydrateReference(item, context));
				else arr.push(item);
			} else if (isAstNode(value)) obj[name] = this.dehydrateAstNode(value, context);
			else if (isReference(value)) obj[name] = this.dehydrateReference(value, context);
			else if (value !== void 0) obj[name] = value;
		}
		return obj;
	}
	dehydrateReference(reference, context) {
		const obj = {};
		obj.$refText = reference.$refText;
		if (reference.$refNode) obj.$refNode = context.cstNodes.get(reference.$refNode);
		return obj;
	}
	dehydrateCstNode(node, context) {
		const cstNode = context.cstNodes.get(node);
		if (isRootCstNode(node)) cstNode.fullText = node.fullText;
		else cstNode.grammarSource = this.getGrammarElementId(node.grammarSource);
		cstNode.hidden = node.hidden;
		cstNode.astNode = context.astNodes.get(node.astNode);
		if (isCompositeCstNode(node)) cstNode.content = node.content.map((child) => this.dehydrateCstNode(child, context));
		else if (isLeafCstNode(node)) {
			cstNode.tokenType = node.tokenType.name;
			cstNode.offset = node.offset;
			cstNode.length = node.length;
			cstNode.startLine = node.range.start.line;
			cstNode.startColumn = node.range.start.character;
			cstNode.endLine = node.range.end.line;
			cstNode.endColumn = node.range.end.character;
		}
		return cstNode;
	}
	hydrate(result) {
		const node = result.value;
		const context = this.createHydrationContext(node);
		if ("$cstNode" in node) this.hydrateCstNode(node.$cstNode, context);
		return {
			lexerErrors: result.lexerErrors,
			lexerReport: result.lexerReport,
			parserErrors: result.parserErrors,
			value: this.hydrateAstNode(node, context)
		};
	}
	createHydrationContext(node) {
		const astNodes = /* @__PURE__ */ new Map();
		const cstNodes = /* @__PURE__ */ new Map();
		for (const astNode of streamAst(node)) astNodes.set(astNode, {});
		let root;
		if (node.$cstNode) for (const cstNode of streamCst(node.$cstNode)) {
			let cst;
			if ("fullText" in cstNode) {
				cst = new RootCstNodeImpl(cstNode.fullText);
				root = cst;
			} else if ("content" in cstNode) cst = new CompositeCstNodeImpl();
			else if ("tokenType" in cstNode) cst = this.hydrateCstLeafNode(cstNode);
			if (cst) {
				cstNodes.set(cstNode, cst);
				cst.root = root;
			}
		}
		return {
			astNodes,
			cstNodes
		};
	}
	hydrateAstNode(node, context) {
		const astNode = context.astNodes.get(node);
		astNode.$type = node.$type;
		astNode.$containerIndex = node.$containerIndex;
		astNode.$containerProperty = node.$containerProperty;
		if (node.$cstNode) astNode.$cstNode = context.cstNodes.get(node.$cstNode);
		for (const [name, value] of Object.entries(node)) {
			if (name.startsWith("$")) continue;
			if (Array.isArray(value)) {
				const arr = [];
				astNode[name] = arr;
				for (const item of value) if (isAstNode(item)) arr.push(this.setParent(this.hydrateAstNode(item, context), astNode));
				else if (isReference(item)) arr.push(this.hydrateReference(item, astNode, name, context));
				else arr.push(item);
			} else if (isAstNode(value)) astNode[name] = this.setParent(this.hydrateAstNode(value, context), astNode);
			else if (isReference(value)) astNode[name] = this.hydrateReference(value, astNode, name, context);
			else if (value !== void 0) astNode[name] = value;
		}
		return astNode;
	}
	setParent(node, parent) {
		node.$container = parent;
		return node;
	}
	hydrateReference(reference, node, name, context) {
		return this.linker.buildReference(node, name, context.cstNodes.get(reference.$refNode), reference.$refText);
	}
	hydrateCstNode(cstNode, context, num = 0) {
		const cstNodeObj = context.cstNodes.get(cstNode);
		if (typeof cstNode.grammarSource === "number") cstNodeObj.grammarSource = this.getGrammarElement(cstNode.grammarSource);
		cstNodeObj.astNode = context.astNodes.get(cstNode.astNode);
		if (isCompositeCstNode(cstNodeObj)) for (const child of cstNode.content) {
			const hydrated = this.hydrateCstNode(child, context, num++);
			cstNodeObj.content.push(hydrated);
		}
		return cstNodeObj;
	}
	hydrateCstLeafNode(cstNode) {
		const tokenType = this.getTokenType(cstNode.tokenType);
		const offset = cstNode.offset;
		const length = cstNode.length;
		const startLine = cstNode.startLine;
		const startColumn = cstNode.startColumn;
		const endLine = cstNode.endLine;
		const endColumn = cstNode.endColumn;
		const hidden = cstNode.hidden;
		return new LeafCstNodeImpl(offset, length, {
			start: {
				line: startLine,
				character: startColumn
			},
			end: {
				line: endLine,
				character: endColumn
			}
		}, tokenType, hidden);
	}
	getTokenType(name) {
		return this.lexer.definition[name];
	}
	getGrammarElementId(node) {
		if (!node) return;
		if (this.grammarElementIdMap.size === 0) this.createGrammarElementIdMap();
		return this.grammarElementIdMap.get(node);
	}
	getGrammarElement(id) {
		if (this.grammarElementIdMap.size === 0) this.createGrammarElementIdMap();
		return this.grammarElementIdMap.getKey(id);
	}
	createGrammarElementIdMap() {
		let id = 0;
		for (const element of streamAst(this.grammar)) if (isAbstractElement(element)) this.grammarElementIdMap.set(element, id++);
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/default-module.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
/**
* Creates a dependency injection module configuring the default core services.
* This is a set of services that are dedicated to a specific language.
*/
function createDefaultCoreModule(context) {
	return {
		documentation: {
			CommentProvider: (services) => new DefaultCommentProvider(services),
			DocumentationProvider: (services) => new JSDocDocumentationProvider(services)
		},
		parser: {
			AsyncParser: (services) => new DefaultAsyncParser(services),
			GrammarConfig: (services) => createGrammarConfig(services),
			LangiumParser: (services) => createLangiumParser(services),
			CompletionParser: (services) => createCompletionParser(services),
			ValueConverter: () => new DefaultValueConverter(),
			TokenBuilder: () => new DefaultTokenBuilder(),
			Lexer: (services) => new DefaultLexer(services),
			ParserErrorMessageProvider: () => new LangiumParserErrorMessageProvider(),
			LexerErrorMessageProvider: () => new DefaultLexerErrorMessageProvider()
		},
		workspace: {
			AstNodeLocator: () => new DefaultAstNodeLocator(),
			AstNodeDescriptionProvider: (services) => new DefaultAstNodeDescriptionProvider(services),
			ReferenceDescriptionProvider: (services) => new DefaultReferenceDescriptionProvider(services)
		},
		references: {
			Linker: (services) => new DefaultLinker(services),
			NameProvider: () => new DefaultNameProvider(),
			ScopeProvider: (services) => new DefaultScopeProvider(services),
			ScopeComputation: (services) => new DefaultScopeComputation(services),
			References: (services) => new DefaultReferences(services)
		},
		serializer: {
			Hydrator: (services) => new DefaultHydrator(services),
			JsonSerializer: (services) => new DefaultJsonSerializer(services)
		},
		validation: {
			DocumentValidator: (services) => new DefaultDocumentValidator(services),
			ValidationRegistry: (services) => new ValidationRegistry(services)
		},
		shared: () => context.shared
	};
}
/**
* Creates a dependency injection module configuring the default shared core services.
* This is the set of services that are shared between multiple languages.
*/
function createDefaultSharedCoreModule(context) {
	return {
		ServiceRegistry: (services) => new DefaultServiceRegistry(services),
		workspace: {
			LangiumDocuments: (services) => new DefaultLangiumDocuments(services),
			LangiumDocumentFactory: (services) => new DefaultLangiumDocumentFactory(services),
			DocumentBuilder: (services) => new DefaultDocumentBuilder(services),
			IndexManager: (services) => new DefaultIndexManager(services),
			WorkspaceManager: (services) => new DefaultWorkspaceManager(services),
			FileSystemProvider: (services) => context.fileSystemProvider(services),
			WorkspaceLock: () => new DefaultWorkspaceLock(),
			ConfigurationProvider: (services) => new DefaultConfigurationProvider(services)
		}
	};
}
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/dependency-injection.js
/******************************************************************************
* Copyright 2021 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var Module;
(function(Module) {
	Module.merge = (m1, m2) => _merge(_merge({}, m1), m2);
})(Module || (Module = {}));
/**
* Given a set of modules, the inject function returns a lazily evaluated injector
* that injects dependencies into the requested service when it is requested the
* first time. Subsequent requests will return the same service.
*
* In the case of cyclic dependencies, an Error will be thrown. This can be fixed
* by injecting a provider `() => T` instead of a `T`.
*
* Please note that the arguments may be objects or arrays. However, the result will
* be an object. Using it with for..of will have no effect.
*
* @param module1 first Module
* @param module2 (optional) second Module
* @param module3 (optional) third Module
* @param module4 (optional) fourth Module
* @param module5 (optional) fifth Module
* @param module6 (optional) sixth Module
* @param module7 (optional) seventh Module
* @param module8 (optional) eighth Module
* @param module9 (optional) ninth Module
* @returns a new object of type I
*/
function inject(module1, module2, module3, module4, module5, module6, module7, module8, module9) {
	return _inject([
		module1,
		module2,
		module3,
		module4,
		module5,
		module6,
		module7,
		module8,
		module9
	].reduce(_merge, {}));
}
var isProxy = Symbol("isProxy");
/**
* Eagerly load all services in the given dependency injection container. This is sometimes
* necessary because services can register event listeners in their constructors.
*/
function eagerLoad(item) {
	if (item && item[isProxy]) for (const value of Object.values(item)) eagerLoad(value);
	return item;
}
/**
* Helper function that returns an injector by creating a proxy.
* Invariant: injector is of type I. If injector is undefined, then T = I.
*/
function _inject(module, injector) {
	const proxy = new Proxy({}, {
		deleteProperty: () => false,
		set: () => {
			throw new Error("Cannot set property on injected service container");
		},
		get: (obj, prop) => {
			if (prop === isProxy) return true;
			else return _resolve(obj, prop, module, injector || proxy);
		},
		getOwnPropertyDescriptor: (obj, prop) => (_resolve(obj, prop, module, injector || proxy), Object.getOwnPropertyDescriptor(obj, prop)),
		has: (_, prop) => prop in module,
		ownKeys: () => [...Object.getOwnPropertyNames(module)]
	});
	return proxy;
}
/**
* Internally used to tag a requested dependency, directly before calling the factory.
* This allows us to find cycles during instance creation.
*/
var __requested__ = Symbol();
/**
* Returns the value `obj[prop]`. If the value does not exist, yet, it is resolved from
* the module description. The result of service factories is cached. Groups are
* recursively proxied.
*
* @param obj an object holding all group proxies and services
* @param prop the key of a value within obj
* @param module an object containing groups and service factories
* @param injector the first level proxy that provides access to all values
* @returns the requested value `obj[prop]`
* @throws Error if a dependency cycle is detected
*/
function _resolve(obj, prop, module, injector) {
	if (prop in obj) {
		if (obj[prop] instanceof Error) throw new Error("Construction failure. Please make sure that your dependencies are constructable.", { cause: obj[prop] });
		if (obj[prop] === __requested__) throw new Error("Cycle detected. Please make \"" + String(prop) + "\" lazy. Visit https://langium.org/docs/reference/configuration-services/#resolving-cyclic-dependencies");
		return obj[prop];
	} else if (prop in module) {
		const value = module[prop];
		obj[prop] = __requested__;
		try {
			obj[prop] = typeof value === "function" ? value(injector) : _inject(value, injector);
		} catch (error) {
			obj[prop] = error instanceof Error ? error : void 0;
			throw error;
		}
		return obj[prop];
	} else return;
}
/**
* Performs a deep-merge of two modules by writing source entries into the target module.
*
* @param target the module which is written
* @param source the module which is read
* @returns the target module
*/
function _merge(target, source) {
	if (source) {
		for (const [key, value2] of Object.entries(source)) if (value2 !== void 0) {
			const value1 = target[key];
			if (value1 !== null && value2 !== null && typeof value1 === "object" && typeof value2 === "object") target[key] = _merge(value1, value2);
			else target[key] = value2;
		}
	}
	return target;
}
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/parser/indentation-aware.js
/******************************************************************************
* Copyright 2024 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var indentationBuilderDefaultOptions = {
	indentTokenName: "INDENT",
	dedentTokenName: "DEDENT",
	whitespaceTokenName: "WS",
	ignoreIndentationDelimiters: []
};
var LexingMode;
(function(LexingMode) {
	LexingMode["REGULAR"] = "indentation-sensitive";
	LexingMode["IGNORE_INDENTATION"] = "ignore-indentation";
})(LexingMode || (LexingMode = {}));
/**
* A token builder that is sensitive to indentation in the input text.
* It will generate tokens for indentation and dedentation based on the indentation level.
*
* The first generic parameter corresponds to the names of terminal tokens,
* while the second one corresponds to the names of keyword tokens.
* Both parameters are optional and can be imported from `./generated/ast.js`.
*
* Inspired by https://github.com/chevrotain/chevrotain/blob/master/examples/lexer/python_indentation/python_indentation.js
*/
var IndentationAwareTokenBuilder = class extends DefaultTokenBuilder {
	constructor(options = indentationBuilderDefaultOptions) {
		super();
		/**
		* The stack stores all the previously matched indentation levels to understand how deeply the next tokens are nested.
		* The stack is valid for lexing
		*/
		this.indentationStack = [0];
		/**
		* A regular expression to match a series of tabs and/or spaces.
		* Override this to customize what the indentation is allowed to consist of.
		*/
		this.whitespaceRegExp = /[ \t]+/y;
		this.options = Object.assign(Object.assign({}, indentationBuilderDefaultOptions), options);
		this.indentTokenType = createToken({
			name: this.options.indentTokenName,
			pattern: this.indentMatcher.bind(this),
			line_breaks: false
		});
		this.dedentTokenType = createToken({
			name: this.options.dedentTokenName,
			pattern: this.dedentMatcher.bind(this),
			line_breaks: false
		});
	}
	buildTokens(grammar, options) {
		const tokenTypes = super.buildTokens(grammar, options);
		if (!isTokenTypeArray(tokenTypes)) throw new Error("Invalid tokens built by default builder");
		const { indentTokenName, dedentTokenName, whitespaceTokenName, ignoreIndentationDelimiters } = this.options;
		let dedent;
		let indent;
		let ws;
		const otherTokens = [];
		for (const tokenType of tokenTypes) {
			for (const [begin, end] of ignoreIndentationDelimiters) if (tokenType.name === begin) tokenType.PUSH_MODE = LexingMode.IGNORE_INDENTATION;
			else if (tokenType.name === end) tokenType.POP_MODE = true;
			if (tokenType.name === dedentTokenName) dedent = tokenType;
			else if (tokenType.name === indentTokenName) indent = tokenType;
			else if (tokenType.name === whitespaceTokenName) ws = tokenType;
			else otherTokens.push(tokenType);
		}
		if (!dedent || !indent || !ws) throw new Error("Some indentation/whitespace tokens not found!");
		if (ignoreIndentationDelimiters.length > 0) return {
			modes: {
				[LexingMode.REGULAR]: [
					dedent,
					indent,
					...otherTokens,
					ws
				],
				[LexingMode.IGNORE_INDENTATION]: [...otherTokens, ws]
			},
			defaultMode: LexingMode.REGULAR
		};
		else return [
			dedent,
			indent,
			ws,
			...otherTokens
		];
	}
	flushLexingReport(text) {
		const result = super.flushLexingReport(text);
		return Object.assign(Object.assign({}, result), { remainingDedents: this.flushRemainingDedents(text) });
	}
	/**
	* Helper function to check if the current position is the start of a new line.
	*
	* @param text The full input string.
	* @param offset The current position at which to check
	* @returns Whether the current position is the start of a new line
	*/
	isStartOfLine(text, offset) {
		return offset === 0 || "\r\n".includes(text[offset - 1]);
	}
	/**
	* A helper function used in matching both indents and dedents.
	*
	* @param text The full input string.
	* @param offset The current position at which to attempt a match
	* @param tokens Previously scanned tokens
	* @param groups Token Groups
	* @returns The current and previous indentation levels and the matched whitespace
	*/
	matchWhitespace(text, offset, tokens, groups) {
		var _a;
		this.whitespaceRegExp.lastIndex = offset;
		const match = this.whitespaceRegExp.exec(text);
		return {
			currIndentLevel: (_a = match === null || match === void 0 ? void 0 : match[0].length) !== null && _a !== void 0 ? _a : 0,
			prevIndentLevel: this.indentationStack.at(-1),
			match
		};
	}
	/**
	* Helper function to create an instance of an indentation token.
	*
	* @param tokenType Indent or dedent token type
	* @param text Full input string, used to calculate the line number
	* @param image The original image of the token (tabs or spaces)
	* @param offset Current position in the input string
	* @returns The indentation token instance
	*/
	createIndentationTokenInstance(tokenType, text, image, offset) {
		const lineNumber = this.getLineNumber(text, offset);
		return createTokenInstance(tokenType, image, offset, offset + image.length, lineNumber, lineNumber, 1, image.length);
	}
	/**
	* Helper function to get the line number at a given offset.
	*
	* @param text Full input string, used to calculate the line number
	* @param offset Current position in the input string
	* @returns The line number at the given offset
	*/
	getLineNumber(text, offset) {
		return text.substring(0, offset).split(/\r\n|\r|\n/).length;
	}
	/**
	* A custom pattern for matching indents
	*
	* @param text The full input string.
	* @param offset The offset at which to attempt a match
	* @param tokens Previously scanned tokens
	* @param groups Token Groups
	*/
	indentMatcher(text, offset, tokens, groups) {
		if (!this.isStartOfLine(text, offset)) return null;
		const { currIndentLevel, prevIndentLevel, match } = this.matchWhitespace(text, offset, tokens, groups);
		if (currIndentLevel <= prevIndentLevel) return null;
		this.indentationStack.push(currIndentLevel);
		return match;
	}
	/**
	* A custom pattern for matching dedents
	*
	* @param text The full input string.
	* @param offset The offset at which to attempt a match
	* @param tokens Previously scanned tokens
	* @param groups Token Groups
	*/
	dedentMatcher(text, offset, tokens, groups) {
		var _a, _b, _c, _d;
		if (!this.isStartOfLine(text, offset)) return null;
		const { currIndentLevel, prevIndentLevel, match } = this.matchWhitespace(text, offset, tokens, groups);
		if (currIndentLevel >= prevIndentLevel) return null;
		const matchIndentIndex = this.indentationStack.lastIndexOf(currIndentLevel);
		if (matchIndentIndex === -1) {
			this.diagnostics.push({
				severity: "error",
				message: `Invalid dedent level ${currIndentLevel} at offset: ${offset}. Current indentation stack: ${this.indentationStack}`,
				offset,
				length: (_b = (_a = match === null || match === void 0 ? void 0 : match[0]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0,
				line: this.getLineNumber(text, offset),
				column: 1
			});
			return null;
		}
		const numberOfDedents = this.indentationStack.length - matchIndentIndex - 1;
		const newlinesBeforeDedent = (_d = (_c = text.substring(0, offset).match(/[\r\n]+$/)) === null || _c === void 0 ? void 0 : _c[0].length) !== null && _d !== void 0 ? _d : 1;
		for (let i = 0; i < numberOfDedents; i++) {
			const token = this.createIndentationTokenInstance(this.dedentTokenType, text, "", offset - (newlinesBeforeDedent - 1));
			tokens.push(token);
			this.indentationStack.pop();
		}
		return null;
	}
	buildTerminalToken(terminal) {
		const tokenType = super.buildTerminalToken(terminal);
		const { indentTokenName, dedentTokenName, whitespaceTokenName } = this.options;
		if (tokenType.name === indentTokenName) return this.indentTokenType;
		else if (tokenType.name === dedentTokenName) return this.dedentTokenType;
		else if (tokenType.name === whitespaceTokenName) return createToken({
			name: whitespaceTokenName,
			pattern: this.whitespaceRegExp,
			group: Lexer.SKIPPED
		});
		return tokenType;
	}
	/**
	* Resets the indentation stack between different runs of the lexer
	*
	* @param text Full text that was tokenized
	* @returns Remaining dedent tokens to match all previous indents at the end of the file
	*/
	flushRemainingDedents(text) {
		const remainingDedents = [];
		while (this.indentationStack.length > 1) {
			remainingDedents.push(this.createIndentationTokenInstance(this.dedentTokenType, text, "", text.length));
			this.indentationStack.pop();
		}
		this.indentationStack = [0];
		return remainingDedents;
	}
};
/**
* A lexer that is aware of indentation in the input text.
* The only purpose of this lexer is to reset the internal state of the {@link IndentationAwareTokenBuilder}
* between the tokenization of different text inputs.
*
* In your module, you can override the default lexer with this one as such:
* ```ts
* parser: {
*    TokenBuilder: () => new IndentationAwareTokenBuilder(),
*    Lexer: (services) => new IndentationAwareLexer(services),
* }
* ```
*/
var IndentationAwareLexer = class extends DefaultLexer {
	constructor(services) {
		super(services);
		if (services.parser.TokenBuilder instanceof IndentationAwareTokenBuilder) this.indentationTokenBuilder = services.parser.TokenBuilder;
		else throw new Error("IndentationAwareLexer requires an accompanying IndentationAwareTokenBuilder");
	}
	tokenize(text, options = DEFAULT_TOKENIZE_OPTIONS) {
		const result = super.tokenize(text);
		const report = result.report;
		if ((options === null || options === void 0 ? void 0 : options.mode) === "full") result.tokens.push(...report.remainingDedents);
		report.remainingDedents = [];
		const { indentTokenType, dedentTokenType } = this.indentationTokenBuilder;
		const indentTokenIdx = indentTokenType.tokenTypeIdx;
		const dedentTokenIdx = dedentTokenType.tokenTypeIdx;
		const cleanTokens = [];
		const length = result.tokens.length - 1;
		for (let i = 0; i < length; i++) {
			const token = result.tokens[i];
			const nextToken = result.tokens[i + 1];
			if (token.tokenTypeIdx === indentTokenIdx && nextToken.tokenTypeIdx === dedentTokenIdx) {
				i++;
				continue;
			}
			cleanTokens.push(token);
		}
		if (length >= 0) cleanTokens.push(result.tokens[length]);
		result.tokens = cleanTokens;
		return result;
	}
};
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/workspace/file-system-provider.js
/******************************************************************************
* Copyright 2022 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var EmptyFileSystemProvider = class {
	readFile() {
		throw new Error("No file system is available.");
	}
	async readDirectory() {
		return [];
	}
};
var EmptyFileSystem = { fileSystemProvider: () => new EmptyFileSystemProvider() };
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/utils/grammar-loader.js
/******************************************************************************
* Copyright 2023 TypeFox GmbH
* This program and the accompanying materials are made available under the
* terms of the MIT License, which is available in the project root.
******************************************************************************/
var minimalGrammarModule = {
	Grammar: () => void 0,
	LanguageMetaData: () => ({
		caseInsensitive: false,
		fileExtensions: [".langium"],
		languageId: "langium"
	})
};
var minimalSharedGrammarModule = { AstReflection: () => new LangiumGrammarAstReflection() };
function createMinimalGrammarServices() {
	const shared = inject(createDefaultSharedCoreModule(EmptyFileSystem), minimalSharedGrammarModule);
	const grammar = inject(createDefaultCoreModule({ shared }), minimalGrammarModule);
	shared.ServiceRegistry.register(grammar);
	return grammar;
}
/**
* Load a Langium grammar for your language from a JSON string. This is used by several services,
* most notably the parser builder which interprets the grammar to create a parser.
*/
function loadGrammarFromJson(json) {
	var _a;
	const services = createMinimalGrammarServices();
	const astNode = services.serializer.JsonSerializer.deserialize(json);
	services.shared.workspace.LangiumDocumentFactory.fromModel(astNode, URI.parse(`memory://${(_a = astNode.name) !== null && _a !== void 0 ? _a : "grammar"}.langium`));
	return astNode;
}
// ../../node_modules/.pnpm/langium@3.3.1/node_modules/langium/lib/utils/index.js
var utils_exports = /* @__PURE__ */ __exportAll({
	AstUtils: () => ast_utils_exports,
	BiMap: () => BiMap,
	Cancellation: () => cancellation_exports,
	ContextCache: () => ContextCache,
	CstUtils: () => cst_utils_exports,
	DONE_RESULT: () => DONE_RESULT,
	Deferred: () => Deferred,
	Disposable: () => Disposable,
	DisposableCache: () => DisposableCache,
	DocumentCache: () => DocumentCache,
	EMPTY_STREAM: () => EMPTY_STREAM,
	ErrorWithLocation: () => ErrorWithLocation,
	GrammarUtils: () => grammar_utils_exports,
	MultiMap: () => MultiMap,
	OperationCancelled: () => OperationCancelled,
	Reduction: () => Reduction,
	RegExpUtils: () => regexp_utils_exports,
	SimpleCache: () => SimpleCache,
	StreamImpl: () => StreamImpl,
	TreeStreamImpl: () => TreeStreamImpl,
	URI: () => URI,
	UriUtils: () => UriUtils,
	WorkspaceCache: () => WorkspaceCache,
	assertUnreachable: () => assertUnreachable,
	delayNextTick: () => delayNextTick,
	interruptAndCheck: () => interruptAndCheck,
	isOperationCancelled: () => isOperationCancelled,
	loadGrammarFromJson: () => loadGrammarFromJson,
	setInterruptionPeriod: () => setInterruptionPeriod,
	startCancelableOperation: () => startCancelableOperation,
	stream: () => stream
});
__reExport(utils_exports, event_exports);
__reExport(/* @__PURE__ */ __exportAll({
	AbstractAstReflection: () => AbstractAstReflection,
	AbstractCstNode: () => AbstractCstNode,
	AbstractLangiumParser: () => AbstractLangiumParser,
	AbstractParserErrorMessageProvider: () => AbstractParserErrorMessageProvider,
	AbstractThreadedAsyncParser: () => AbstractThreadedAsyncParser,
	AstUtils: () => ast_utils_exports,
	BiMap: () => BiMap,
	Cancellation: () => cancellation_exports,
	CompositeCstNodeImpl: () => CompositeCstNodeImpl,
	ContextCache: () => ContextCache,
	CstNodeBuilder: () => CstNodeBuilder,
	CstUtils: () => cst_utils_exports,
	DEFAULT_TOKENIZE_OPTIONS: () => DEFAULT_TOKENIZE_OPTIONS,
	DONE_RESULT: () => DONE_RESULT,
	DatatypeSymbol: () => DatatypeSymbol,
	DefaultAstNodeDescriptionProvider: () => DefaultAstNodeDescriptionProvider,
	DefaultAstNodeLocator: () => DefaultAstNodeLocator,
	DefaultAsyncParser: () => DefaultAsyncParser,
	DefaultCommentProvider: () => DefaultCommentProvider,
	DefaultConfigurationProvider: () => DefaultConfigurationProvider,
	DefaultDocumentBuilder: () => DefaultDocumentBuilder,
	DefaultDocumentValidator: () => DefaultDocumentValidator,
	DefaultHydrator: () => DefaultHydrator,
	DefaultIndexManager: () => DefaultIndexManager,
	DefaultJsonSerializer: () => DefaultJsonSerializer,
	DefaultLangiumDocumentFactory: () => DefaultLangiumDocumentFactory,
	DefaultLangiumDocuments: () => DefaultLangiumDocuments,
	DefaultLexer: () => DefaultLexer,
	DefaultLexerErrorMessageProvider: () => DefaultLexerErrorMessageProvider,
	DefaultLinker: () => DefaultLinker,
	DefaultNameProvider: () => DefaultNameProvider,
	DefaultReferenceDescriptionProvider: () => DefaultReferenceDescriptionProvider,
	DefaultReferences: () => DefaultReferences,
	DefaultScopeComputation: () => DefaultScopeComputation,
	DefaultScopeProvider: () => DefaultScopeProvider,
	DefaultServiceRegistry: () => DefaultServiceRegistry,
	DefaultTokenBuilder: () => DefaultTokenBuilder,
	DefaultValueConverter: () => DefaultValueConverter,
	DefaultWorkspaceLock: () => DefaultWorkspaceLock,
	DefaultWorkspaceManager: () => DefaultWorkspaceManager,
	Deferred: () => Deferred,
	Disposable: () => Disposable,
	DisposableCache: () => DisposableCache,
	DocumentCache: () => DocumentCache,
	DocumentState: () => DocumentState,
	DocumentValidator: () => DocumentValidator,
	EMPTY_SCOPE: () => EMPTY_SCOPE,
	EMPTY_STREAM: () => EMPTY_STREAM,
	EmptyFileSystem: () => EmptyFileSystem,
	EmptyFileSystemProvider: () => EmptyFileSystemProvider,
	ErrorWithLocation: () => ErrorWithLocation,
	GrammarAST: () => ast_exports,
	GrammarUtils: () => grammar_utils_exports,
	IndentationAwareLexer: () => IndentationAwareLexer,
	IndentationAwareTokenBuilder: () => IndentationAwareTokenBuilder,
	JSDocDocumentationProvider: () => JSDocDocumentationProvider,
	LangiumCompletionParser: () => LangiumCompletionParser,
	LangiumParser: () => LangiumParser,
	LangiumParserErrorMessageProvider: () => LangiumParserErrorMessageProvider,
	LeafCstNodeImpl: () => LeafCstNodeImpl,
	LexingMode: () => LexingMode,
	MapScope: () => MapScope,
	Module: () => Module,
	MultiMap: () => MultiMap,
	OperationCancelled: () => OperationCancelled,
	ParserWorker: () => ParserWorker,
	Reduction: () => Reduction,
	RegExpUtils: () => regexp_utils_exports,
	RootCstNodeImpl: () => RootCstNodeImpl,
	SimpleCache: () => SimpleCache,
	StreamImpl: () => StreamImpl,
	StreamScope: () => StreamScope,
	TextDocument: () => TextDocument,
	TreeStreamImpl: () => TreeStreamImpl,
	URI: () => URI,
	UriUtils: () => UriUtils,
	ValidationCategory: () => ValidationCategory,
	ValidationRegistry: () => ValidationRegistry,
	ValueConverter: () => ValueConverter,
	WorkspaceCache: () => WorkspaceCache,
	assertUnreachable: () => assertUnreachable,
	createCompletionParser: () => createCompletionParser,
	createDefaultCoreModule: () => createDefaultCoreModule,
	createDefaultSharedCoreModule: () => createDefaultSharedCoreModule,
	createGrammarConfig: () => createGrammarConfig,
	createLangiumParser: () => createLangiumParser,
	createParser: () => createParser,
	delayNextTick: () => delayNextTick,
	diagnosticData: () => diagnosticData,
	eagerLoad: () => eagerLoad,
	getDiagnosticRange: () => getDiagnosticRange,
	indentationBuilderDefaultOptions: () => indentationBuilderDefaultOptions,
	inject: () => inject,
	interruptAndCheck: () => interruptAndCheck,
	isAstNode: () => isAstNode,
	isAstNodeDescription: () => isAstNodeDescription,
	isAstNodeWithComment: () => isAstNodeWithComment,
	isCompositeCstNode: () => isCompositeCstNode,
	isIMultiModeLexerDefinition: () => isIMultiModeLexerDefinition,
	isJSDoc: () => isJSDoc,
	isLeafCstNode: () => isLeafCstNode,
	isLinkingError: () => isLinkingError,
	isNamed: () => isNamed,
	isOperationCancelled: () => isOperationCancelled,
	isReference: () => isReference,
	isRootCstNode: () => isRootCstNode,
	isTokenTypeArray: () => isTokenTypeArray,
	isTokenTypeDictionary: () => isTokenTypeDictionary,
	loadGrammarFromJson: () => loadGrammarFromJson,
	parseJSDoc: () => parseJSDoc,
	prepareLangiumParser: () => prepareLangiumParser,
	setInterruptionPeriod: () => setInterruptionPeriod,
	startCancelableOperation: () => startCancelableOperation,
	stream: () => stream,
	toDiagnosticData: () => toDiagnosticData,
	toDiagnosticSeverity: () => toDiagnosticSeverity
}), utils_exports);
// ../../node_modules/.pnpm/@mermaid-js+parser@0.6.3/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-FPAJGGOC.mjs
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", {
	value,
	configurable: true
});
var Statement = "Statement";
var Architecture = "Architecture";
function isArchitecture(item) {
	return reflection.isInstance(item, Architecture);
}
__name(isArchitecture, "isArchitecture");
var Axis = "Axis";
var Branch = "Branch";
function isBranch(item) {
	return reflection.isInstance(item, Branch);
}
__name(isBranch, "isBranch");
var Checkout = "Checkout";
var CherryPicking = "CherryPicking";
var ClassDefStatement = "ClassDefStatement";
var Commit = "Commit";
function isCommit(item) {
	return reflection.isInstance(item, Commit);
}
__name(isCommit, "isCommit");
var Curve = "Curve";
var Edge = "Edge";
var Entry = "Entry";
var GitGraph = "GitGraph";
function isGitGraph(item) {
	return reflection.isInstance(item, GitGraph);
}
__name(isGitGraph, "isGitGraph");
var Group = "Group";
var Info = "Info";
function isInfo(item) {
	return reflection.isInstance(item, Info);
}
__name(isInfo, "isInfo");
var Item = "Item";
var Junction = "Junction";
var Merge = "Merge";
function isMerge(item) {
	return reflection.isInstance(item, Merge);
}
__name(isMerge, "isMerge");
var Option = "Option";
var Packet = "Packet";
function isPacket(item) {
	return reflection.isInstance(item, Packet);
}
__name(isPacket, "isPacket");
var PacketBlock = "PacketBlock";
function isPacketBlock(item) {
	return reflection.isInstance(item, PacketBlock);
}
__name(isPacketBlock, "isPacketBlock");
function isPie(item) {
	return reflection.isInstance(item, "Pie");
}
__name(isPie, "isPie");
var PieSection = "PieSection";
function isPieSection(item) {
	return reflection.isInstance(item, PieSection);
}
__name(isPieSection, "isPieSection");
var Radar = "Radar";
var Service = "Service";
var Treemap = "Treemap";
function isTreemap(item) {
	return reflection.isInstance(item, Treemap);
}
__name(isTreemap, "isTreemap");
var TreemapRow = "TreemapRow";
var Direction = "Direction";
var Leaf = "Leaf";
var Section = "Section";
var MermaidAstReflection = class extends AbstractAstReflection {
	static {
		__name(this, "MermaidAstReflection");
	}
	getAllTypes() {
		return [
			Architecture,
			Axis,
			Branch,
			Checkout,
			CherryPicking,
			ClassDefStatement,
			Commit,
			Curve,
			Direction,
			Edge,
			Entry,
			GitGraph,
			Group,
			Info,
			Item,
			Junction,
			Leaf,
			Merge,
			Option,
			Packet,
			PacketBlock,
			"Pie",
			PieSection,
			Radar,
			Section,
			Service,
			Statement,
			Treemap,
			TreemapRow
		];
	}
	computeIsSubtype(subtype, supertype) {
		switch (subtype) {
			case Branch:
			case Checkout:
			case CherryPicking:
			case Commit:
			case Merge: return this.isSubtype(Statement, supertype);
			case Direction: return this.isSubtype(GitGraph, supertype);
			case Leaf:
			case Section: return this.isSubtype(Item, supertype);
			default: return false;
		}
	}
	getReferenceType(refInfo) {
		const referenceId = `${refInfo.container.$type}:${refInfo.property}`;
		switch (referenceId) {
			case "Entry:axis": return Axis;
			default: throw new Error(`${referenceId} is not a valid reference id.`);
		}
	}
	getTypeMetaData(type) {
		switch (type) {
			case Architecture: return {
				name: Architecture,
				properties: [
					{ name: "accDescr" },
					{ name: "accTitle" },
					{
						name: "edges",
						defaultValue: []
					},
					{
						name: "groups",
						defaultValue: []
					},
					{
						name: "junctions",
						defaultValue: []
					},
					{
						name: "services",
						defaultValue: []
					},
					{ name: "title" }
				]
			};
			case Axis: return {
				name: Axis,
				properties: [{ name: "label" }, { name: "name" }]
			};
			case Branch: return {
				name: Branch,
				properties: [{ name: "name" }, { name: "order" }]
			};
			case Checkout: return {
				name: Checkout,
				properties: [{ name: "branch" }]
			};
			case CherryPicking: return {
				name: CherryPicking,
				properties: [
					{ name: "id" },
					{ name: "parent" },
					{
						name: "tags",
						defaultValue: []
					}
				]
			};
			case ClassDefStatement: return {
				name: ClassDefStatement,
				properties: [{ name: "className" }, { name: "styleText" }]
			};
			case Commit: return {
				name: Commit,
				properties: [
					{ name: "id" },
					{ name: "message" },
					{
						name: "tags",
						defaultValue: []
					},
					{ name: "type" }
				]
			};
			case Curve: return {
				name: Curve,
				properties: [
					{
						name: "entries",
						defaultValue: []
					},
					{ name: "label" },
					{ name: "name" }
				]
			};
			case Edge: return {
				name: Edge,
				properties: [
					{ name: "lhsDir" },
					{
						name: "lhsGroup",
						defaultValue: false
					},
					{ name: "lhsId" },
					{
						name: "lhsInto",
						defaultValue: false
					},
					{ name: "rhsDir" },
					{
						name: "rhsGroup",
						defaultValue: false
					},
					{ name: "rhsId" },
					{
						name: "rhsInto",
						defaultValue: false
					},
					{ name: "title" }
				]
			};
			case Entry: return {
				name: Entry,
				properties: [{ name: "axis" }, { name: "value" }]
			};
			case GitGraph: return {
				name: GitGraph,
				properties: [
					{ name: "accDescr" },
					{ name: "accTitle" },
					{
						name: "statements",
						defaultValue: []
					},
					{ name: "title" }
				]
			};
			case Group: return {
				name: Group,
				properties: [
					{ name: "icon" },
					{ name: "id" },
					{ name: "in" },
					{ name: "title" }
				]
			};
			case Info: return {
				name: Info,
				properties: [
					{ name: "accDescr" },
					{ name: "accTitle" },
					{ name: "title" }
				]
			};
			case Item: return {
				name: Item,
				properties: [{ name: "classSelector" }, { name: "name" }]
			};
			case Junction: return {
				name: Junction,
				properties: [{ name: "id" }, { name: "in" }]
			};
			case Merge: return {
				name: Merge,
				properties: [
					{ name: "branch" },
					{ name: "id" },
					{
						name: "tags",
						defaultValue: []
					},
					{ name: "type" }
				]
			};
			case Option: return {
				name: Option,
				properties: [{ name: "name" }, {
					name: "value",
					defaultValue: false
				}]
			};
			case Packet: return {
				name: Packet,
				properties: [
					{ name: "accDescr" },
					{ name: "accTitle" },
					{
						name: "blocks",
						defaultValue: []
					},
					{ name: "title" }
				]
			};
			case PacketBlock: return {
				name: PacketBlock,
				properties: [
					{ name: "bits" },
					{ name: "end" },
					{ name: "label" },
					{ name: "start" }
				]
			};
			case "Pie": return {
				name: "Pie",
				properties: [
					{ name: "accDescr" },
					{ name: "accTitle" },
					{
						name: "sections",
						defaultValue: []
					},
					{
						name: "showData",
						defaultValue: false
					},
					{ name: "title" }
				]
			};
			case PieSection: return {
				name: PieSection,
				properties: [{ name: "label" }, { name: "value" }]
			};
			case Radar: return {
				name: Radar,
				properties: [
					{ name: "accDescr" },
					{ name: "accTitle" },
					{
						name: "axes",
						defaultValue: []
					},
					{
						name: "curves",
						defaultValue: []
					},
					{
						name: "options",
						defaultValue: []
					},
					{ name: "title" }
				]
			};
			case Service: return {
				name: Service,
				properties: [
					{ name: "icon" },
					{ name: "iconText" },
					{ name: "id" },
					{ name: "in" },
					{ name: "title" }
				]
			};
			case Treemap: return {
				name: Treemap,
				properties: [
					{ name: "accDescr" },
					{ name: "accTitle" },
					{ name: "title" },
					{
						name: "TreemapRows",
						defaultValue: []
					}
				]
			};
			case TreemapRow: return {
				name: TreemapRow,
				properties: [{ name: "indent" }, { name: "item" }]
			};
			case Direction: return {
				name: Direction,
				properties: [
					{ name: "accDescr" },
					{ name: "accTitle" },
					{ name: "dir" },
					{
						name: "statements",
						defaultValue: []
					},
					{ name: "title" }
				]
			};
			case Leaf: return {
				name: Leaf,
				properties: [
					{ name: "classSelector" },
					{ name: "name" },
					{ name: "value" }
				]
			};
			case Section: return {
				name: Section,
				properties: [{ name: "classSelector" }, { name: "name" }]
			};
			default: return {
				name: type,
				properties: []
			};
		}
	}
};
var reflection = new MermaidAstReflection();
var loadedInfoGrammar;
var InfoGrammar = /* @__PURE__ */ __name(() => loadedInfoGrammar ?? (loadedInfoGrammar = loadGrammarFromJson(`{"$type":"Grammar","isDeclared":true,"name":"Info","imports":[],"rules":[{"$type":"ParserRule","entry":true,"name":"Info","definition":{"$type":"Group","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@12"},"arguments":[],"cardinality":"*"},{"$type":"Keyword","value":"info"},{"$type":"RuleCall","rule":{"$ref":"#/rules@12"},"arguments":[],"cardinality":"*"},{"$type":"Group","elements":[{"$type":"Keyword","value":"showInfo"},{"$type":"RuleCall","rule":{"$ref":"#/rules@12"},"arguments":[],"cardinality":"*"}],"cardinality":"?"},{"$type":"RuleCall","rule":{"$ref":"#/rules@2"},"arguments":[],"cardinality":"?"}]},"definesHiddenTokens":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","fragment":true,"name":"EOL","dataType":"string","definition":{"$type":"Alternatives","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@12"},"arguments":[],"cardinality":"+"},{"$type":"EndOfFile"}]},"definesHiddenTokens":false,"entry":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","fragment":true,"name":"TitleAndAccessibilities","definition":{"$type":"Group","elements":[{"$type":"Alternatives","elements":[{"$type":"Assignment","feature":"accDescr","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@4"},"arguments":[]}},{"$type":"Assignment","feature":"accTitle","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@5"},"arguments":[]}},{"$type":"Assignment","feature":"title","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@6"},"arguments":[]}}]},{"$type":"RuleCall","rule":{"$ref":"#/rules@1"},"arguments":[]}],"cardinality":"+"},"definesHiddenTokens":false,"entry":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"TerminalRule","name":"BOOLEAN","type":{"$type":"ReturnType","name":"boolean"},"definition":{"$type":"TerminalAlternatives","elements":[{"$type":"CharacterRange","left":{"$type":"Keyword","value":"true"}},{"$type":"CharacterRange","left":{"$type":"Keyword","value":"false"}}]},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ACC_DESCR","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*accDescr(?:[\\\\t ]*:([^\\\\n\\\\r]*?(?=%%)|[^\\\\n\\\\r]*)|\\\\s*{([^}]*)})/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ACC_TITLE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*accTitle[\\\\t ]*:(?:[^\\\\n\\\\r]*?(?=%%)|[^\\\\n\\\\r]*)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"TITLE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*title(?:[\\\\t ][^\\\\n\\\\r]*?(?=%%)|[\\\\t ][^\\\\n\\\\r]*|)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"FLOAT","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"RegexToken","regex":"/[0-9]+\\\\.[0-9]+(?!\\\\.)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"INT","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"RegexToken","regex":"/0|[1-9][0-9]*(?!\\\\.)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"NUMBER","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"TerminalAlternatives","elements":[{"$type":"TerminalRuleCall","rule":{"$ref":"#/rules@7"}},{"$type":"TerminalRuleCall","rule":{"$ref":"#/rules@8"}}]},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"STRING","type":{"$type":"ReturnType","name":"string"},"definition":{"$type":"RegexToken","regex":"/\\"([^\\"\\\\\\\\]|\\\\\\\\.)*\\"|'([^'\\\\\\\\]|\\\\\\\\.)*'/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ID","type":{"$type":"ReturnType","name":"string"},"definition":{"$type":"RegexToken","regex":"/[\\\\w]([-\\\\w]*\\\\w)?/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"NEWLINE","definition":{"$type":"RegexToken","regex":"/\\\\r?\\\\n/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","hidden":true,"name":"WHITESPACE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]+/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"YAML","definition":{"$type":"RegexToken","regex":"/---[\\\\t ]*\\\\r?\\\\n(?:[\\\\S\\\\s]*?\\\\r?\\\\n)?---(?:\\\\r?\\\\n|(?!\\\\S))/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"DIRECTIVE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*%%{[\\\\S\\\\s]*?}%%(?:\\\\r?\\\\n|(?!\\\\S))/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"SINGLE_LINE_COMMENT","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*%%[^\\\\n\\\\r]*/"},"fragment":false}],"definesHiddenTokens":false,"hiddenTokens":[],"interfaces":[],"types":[],"usedGrammars":[]}`)), "InfoGrammar");
var loadedPacketGrammar;
var PacketGrammar = /* @__PURE__ */ __name(() => loadedPacketGrammar ?? (loadedPacketGrammar = loadGrammarFromJson(`{"$type":"Grammar","isDeclared":true,"name":"Packet","imports":[],"rules":[{"$type":"ParserRule","entry":true,"name":"Packet","definition":{"$type":"Group","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@13"},"arguments":[],"cardinality":"*"},{"$type":"Alternatives","elements":[{"$type":"Keyword","value":"packet"},{"$type":"Keyword","value":"packet-beta"}]},{"$type":"Alternatives","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@3"},"arguments":[]},{"$type":"Assignment","feature":"blocks","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@1"},"arguments":[]}},{"$type":"RuleCall","rule":{"$ref":"#/rules@13"},"arguments":[]}],"cardinality":"*"}]},"definesHiddenTokens":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"PacketBlock","definition":{"$type":"Group","elements":[{"$type":"Alternatives","elements":[{"$type":"Group","elements":[{"$type":"Assignment","feature":"start","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@9"},"arguments":[]}},{"$type":"Group","elements":[{"$type":"Keyword","value":"-"},{"$type":"Assignment","feature":"end","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@9"},"arguments":[]}}],"cardinality":"?"}]},{"$type":"Group","elements":[{"$type":"Keyword","value":"+"},{"$type":"Assignment","feature":"bits","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@9"},"arguments":[]}}]}]},{"$type":"Keyword","value":":"},{"$type":"Assignment","feature":"label","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@11"},"arguments":[]}},{"$type":"RuleCall","rule":{"$ref":"#/rules@2"},"arguments":[]}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","fragment":true,"name":"EOL","dataType":"string","definition":{"$type":"Alternatives","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@13"},"arguments":[],"cardinality":"+"},{"$type":"EndOfFile"}]},"definesHiddenTokens":false,"entry":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","fragment":true,"name":"TitleAndAccessibilities","definition":{"$type":"Group","elements":[{"$type":"Alternatives","elements":[{"$type":"Assignment","feature":"accDescr","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@5"},"arguments":[]}},{"$type":"Assignment","feature":"accTitle","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@6"},"arguments":[]}},{"$type":"Assignment","feature":"title","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@7"},"arguments":[]}}]},{"$type":"RuleCall","rule":{"$ref":"#/rules@2"},"arguments":[]}],"cardinality":"+"},"definesHiddenTokens":false,"entry":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"TerminalRule","name":"BOOLEAN","type":{"$type":"ReturnType","name":"boolean"},"definition":{"$type":"TerminalAlternatives","elements":[{"$type":"CharacterRange","left":{"$type":"Keyword","value":"true"}},{"$type":"CharacterRange","left":{"$type":"Keyword","value":"false"}}]},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ACC_DESCR","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*accDescr(?:[\\\\t ]*:([^\\\\n\\\\r]*?(?=%%)|[^\\\\n\\\\r]*)|\\\\s*{([^}]*)})/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ACC_TITLE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*accTitle[\\\\t ]*:(?:[^\\\\n\\\\r]*?(?=%%)|[^\\\\n\\\\r]*)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"TITLE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*title(?:[\\\\t ][^\\\\n\\\\r]*?(?=%%)|[\\\\t ][^\\\\n\\\\r]*|)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"FLOAT","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"RegexToken","regex":"/[0-9]+\\\\.[0-9]+(?!\\\\.)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"INT","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"RegexToken","regex":"/0|[1-9][0-9]*(?!\\\\.)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"NUMBER","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"TerminalAlternatives","elements":[{"$type":"TerminalRuleCall","rule":{"$ref":"#/rules@8"}},{"$type":"TerminalRuleCall","rule":{"$ref":"#/rules@9"}}]},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"STRING","type":{"$type":"ReturnType","name":"string"},"definition":{"$type":"RegexToken","regex":"/\\"([^\\"\\\\\\\\]|\\\\\\\\.)*\\"|'([^'\\\\\\\\]|\\\\\\\\.)*'/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ID","type":{"$type":"ReturnType","name":"string"},"definition":{"$type":"RegexToken","regex":"/[\\\\w]([-\\\\w]*\\\\w)?/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"NEWLINE","definition":{"$type":"RegexToken","regex":"/\\\\r?\\\\n/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","hidden":true,"name":"WHITESPACE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]+/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"YAML","definition":{"$type":"RegexToken","regex":"/---[\\\\t ]*\\\\r?\\\\n(?:[\\\\S\\\\s]*?\\\\r?\\\\n)?---(?:\\\\r?\\\\n|(?!\\\\S))/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"DIRECTIVE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*%%{[\\\\S\\\\s]*?}%%(?:\\\\r?\\\\n|(?!\\\\S))/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"SINGLE_LINE_COMMENT","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*%%[^\\\\n\\\\r]*/"},"fragment":false}],"definesHiddenTokens":false,"hiddenTokens":[],"interfaces":[],"types":[],"usedGrammars":[]}`)), "PacketGrammar");
var loadedPieGrammar;
var PieGrammar = /* @__PURE__ */ __name(() => loadedPieGrammar ?? (loadedPieGrammar = loadGrammarFromJson(`{"$type":"Grammar","isDeclared":true,"name":"Pie","imports":[],"rules":[{"$type":"ParserRule","entry":true,"name":"Pie","definition":{"$type":"Group","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@16"},"arguments":[],"cardinality":"*"},{"$type":"Keyword","value":"pie"},{"$type":"Assignment","feature":"showData","operator":"?=","terminal":{"$type":"Keyword","value":"showData"},"cardinality":"?"},{"$type":"Alternatives","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@6"},"arguments":[]},{"$type":"Assignment","feature":"sections","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@1"},"arguments":[]}},{"$type":"RuleCall","rule":{"$ref":"#/rules@16"},"arguments":[]}],"cardinality":"*"}]},"definesHiddenTokens":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"PieSection","definition":{"$type":"Group","elements":[{"$type":"Assignment","feature":"label","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@14"},"arguments":[]}},{"$type":"Keyword","value":":"},{"$type":"Assignment","feature":"value","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@4"},"arguments":[]}},{"$type":"RuleCall","rule":{"$ref":"#/rules@5"},"arguments":[]}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"TerminalRule","name":"FLOAT_PIE","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"RegexToken","regex":"/-?[0-9]+\\\\.[0-9]+(?!\\\\.)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"INT_PIE","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"RegexToken","regex":"/-?(0|[1-9][0-9]*)(?!\\\\.)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"NUMBER_PIE","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"TerminalAlternatives","elements":[{"$type":"TerminalRuleCall","rule":{"$ref":"#/rules@2"}},{"$type":"TerminalRuleCall","rule":{"$ref":"#/rules@3"}}]},"fragment":false,"hidden":false},{"$type":"ParserRule","fragment":true,"name":"EOL","dataType":"string","definition":{"$type":"Alternatives","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@16"},"arguments":[],"cardinality":"+"},{"$type":"EndOfFile"}]},"definesHiddenTokens":false,"entry":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","fragment":true,"name":"TitleAndAccessibilities","definition":{"$type":"Group","elements":[{"$type":"Alternatives","elements":[{"$type":"Assignment","feature":"accDescr","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@8"},"arguments":[]}},{"$type":"Assignment","feature":"accTitle","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@9"},"arguments":[]}},{"$type":"Assignment","feature":"title","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@10"},"arguments":[]}}]},{"$type":"RuleCall","rule":{"$ref":"#/rules@5"},"arguments":[]}],"cardinality":"+"},"definesHiddenTokens":false,"entry":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"TerminalRule","name":"BOOLEAN","type":{"$type":"ReturnType","name":"boolean"},"definition":{"$type":"TerminalAlternatives","elements":[{"$type":"CharacterRange","left":{"$type":"Keyword","value":"true"}},{"$type":"CharacterRange","left":{"$type":"Keyword","value":"false"}}]},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ACC_DESCR","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*accDescr(?:[\\\\t ]*:([^\\\\n\\\\r]*?(?=%%)|[^\\\\n\\\\r]*)|\\\\s*{([^}]*)})/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ACC_TITLE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*accTitle[\\\\t ]*:(?:[^\\\\n\\\\r]*?(?=%%)|[^\\\\n\\\\r]*)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"TITLE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*title(?:[\\\\t ][^\\\\n\\\\r]*?(?=%%)|[\\\\t ][^\\\\n\\\\r]*|)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"FLOAT","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"RegexToken","regex":"/[0-9]+\\\\.[0-9]+(?!\\\\.)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"INT","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"RegexToken","regex":"/0|[1-9][0-9]*(?!\\\\.)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"NUMBER","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"TerminalAlternatives","elements":[{"$type":"TerminalRuleCall","rule":{"$ref":"#/rules@11"}},{"$type":"TerminalRuleCall","rule":{"$ref":"#/rules@12"}}]},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"STRING","type":{"$type":"ReturnType","name":"string"},"definition":{"$type":"RegexToken","regex":"/\\"([^\\"\\\\\\\\]|\\\\\\\\.)*\\"|'([^'\\\\\\\\]|\\\\\\\\.)*'/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ID","type":{"$type":"ReturnType","name":"string"},"definition":{"$type":"RegexToken","regex":"/[\\\\w]([-\\\\w]*\\\\w)?/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"NEWLINE","definition":{"$type":"RegexToken","regex":"/\\\\r?\\\\n/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","hidden":true,"name":"WHITESPACE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]+/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"YAML","definition":{"$type":"RegexToken","regex":"/---[\\\\t ]*\\\\r?\\\\n(?:[\\\\S\\\\s]*?\\\\r?\\\\n)?---(?:\\\\r?\\\\n|(?!\\\\S))/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"DIRECTIVE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*%%{[\\\\S\\\\s]*?}%%(?:\\\\r?\\\\n|(?!\\\\S))/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"SINGLE_LINE_COMMENT","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*%%[^\\\\n\\\\r]*/"},"fragment":false}],"definesHiddenTokens":false,"hiddenTokens":[],"interfaces":[],"types":[],"usedGrammars":[]}`)), "PieGrammar");
var loadedArchitectureGrammar;
var ArchitectureGrammar = /* @__PURE__ */ __name(() => loadedArchitectureGrammar ?? (loadedArchitectureGrammar = loadGrammarFromJson(`{"$type":"Grammar","isDeclared":true,"name":"Architecture","imports":[],"rules":[{"$type":"ParserRule","entry":true,"name":"Architecture","definition":{"$type":"Group","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@23"},"arguments":[],"cardinality":"*"},{"$type":"Keyword","value":"architecture-beta"},{"$type":"Alternatives","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@23"},"arguments":[]},{"$type":"RuleCall","rule":{"$ref":"#/rules@13"},"arguments":[]},{"$type":"RuleCall","rule":{"$ref":"#/rules@1"},"arguments":[]}],"cardinality":"*"}]},"definesHiddenTokens":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","fragment":true,"name":"Statement","definition":{"$type":"Alternatives","elements":[{"$type":"Assignment","feature":"groups","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@5"},"arguments":[]}},{"$type":"Assignment","feature":"services","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@6"},"arguments":[]}},{"$type":"Assignment","feature":"junctions","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@7"},"arguments":[]}},{"$type":"Assignment","feature":"edges","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@8"},"arguments":[]}}]},"definesHiddenTokens":false,"entry":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","fragment":true,"name":"LeftPort","definition":{"$type":"Group","elements":[{"$type":"Keyword","value":":"},{"$type":"Assignment","feature":"lhsDir","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@9"},"arguments":[]}}]},"definesHiddenTokens":false,"entry":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","fragment":true,"name":"RightPort","definition":{"$type":"Group","elements":[{"$type":"Assignment","feature":"rhsDir","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@9"},"arguments":[]}},{"$type":"Keyword","value":":"}]},"definesHiddenTokens":false,"entry":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","fragment":true,"name":"Arrow","definition":{"$type":"Group","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@2"},"arguments":[]},{"$type":"Assignment","feature":"lhsInto","operator":"?=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@11"},"arguments":[]},"cardinality":"?"},{"$type":"Alternatives","elements":[{"$type":"Keyword","value":"--"},{"$type":"Group","elements":[{"$type":"Keyword","value":"-"},{"$type":"Assignment","feature":"title","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@29"},"arguments":[]}},{"$type":"Keyword","value":"-"}]}]},{"$type":"Assignment","feature":"rhsInto","operator":"?=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@11"},"arguments":[]},"cardinality":"?"},{"$type":"RuleCall","rule":{"$ref":"#/rules@3"},"arguments":[]}]},"definesHiddenTokens":false,"entry":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"Group","definition":{"$type":"Group","elements":[{"$type":"Keyword","value":"group"},{"$type":"Assignment","feature":"id","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@22"},"arguments":[]}},{"$type":"Assignment","feature":"icon","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@28"},"arguments":[]},"cardinality":"?"},{"$type":"Assignment","feature":"title","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@29"},"arguments":[]},"cardinality":"?"},{"$type":"Group","elements":[{"$type":"Keyword","value":"in"},{"$type":"Assignment","feature":"in","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@22"},"arguments":[]}}],"cardinality":"?"},{"$type":"RuleCall","rule":{"$ref":"#/rules@12"},"arguments":[]}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"Service","definition":{"$type":"Group","elements":[{"$type":"Keyword","value":"service"},{"$type":"Assignment","feature":"id","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@22"},"arguments":[]}},{"$type":"Alternatives","elements":[{"$type":"Assignment","feature":"iconText","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@21"},"arguments":[]}},{"$type":"Assignment","feature":"icon","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@28"},"arguments":[]}}],"cardinality":"?"},{"$type":"Assignment","feature":"title","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@29"},"arguments":[]},"cardinality":"?"},{"$type":"Group","elements":[{"$type":"Keyword","value":"in"},{"$type":"Assignment","feature":"in","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@22"},"arguments":[]}}],"cardinality":"?"},{"$type":"RuleCall","rule":{"$ref":"#/rules@12"},"arguments":[]}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"Junction","definition":{"$type":"Group","elements":[{"$type":"Keyword","value":"junction"},{"$type":"Assignment","feature":"id","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@22"},"arguments":[]}},{"$type":"Group","elements":[{"$type":"Keyword","value":"in"},{"$type":"Assignment","feature":"in","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@22"},"arguments":[]}}],"cardinality":"?"},{"$type":"RuleCall","rule":{"$ref":"#/rules@12"},"arguments":[]}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"Edge","definition":{"$type":"Group","elements":[{"$type":"Assignment","feature":"lhsId","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@22"},"arguments":[]}},{"$type":"Assignment","feature":"lhsGroup","operator":"?=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@10"},"arguments":[]},"cardinality":"?"},{"$type":"RuleCall","rule":{"$ref":"#/rules@4"},"arguments":[]},{"$type":"Assignment","feature":"rhsId","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@22"},"arguments":[]}},{"$type":"Assignment","feature":"rhsGroup","operator":"?=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@10"},"arguments":[]},"cardinality":"?"},{"$type":"RuleCall","rule":{"$ref":"#/rules@12"},"arguments":[]}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"TerminalRule","name":"ARROW_DIRECTION","definition":{"$type":"TerminalAlternatives","elements":[{"$type":"TerminalAlternatives","elements":[{"$type":"TerminalAlternatives","elements":[{"$type":"CharacterRange","left":{"$type":"Keyword","value":"L"}},{"$type":"CharacterRange","left":{"$type":"Keyword","value":"R"}}]},{"$type":"CharacterRange","left":{"$type":"Keyword","value":"T"}}]},{"$type":"CharacterRange","left":{"$type":"Keyword","value":"B"}}]},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ARROW_GROUP","definition":{"$type":"RegexToken","regex":"/\\\\{group\\\\}/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ARROW_INTO","definition":{"$type":"RegexToken","regex":"/<|>/"},"fragment":false,"hidden":false},{"$type":"ParserRule","fragment":true,"name":"EOL","dataType":"string","definition":{"$type":"Alternatives","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@23"},"arguments":[],"cardinality":"+"},{"$type":"EndOfFile"}]},"definesHiddenTokens":false,"entry":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","fragment":true,"name":"TitleAndAccessibilities","definition":{"$type":"Group","elements":[{"$type":"Alternatives","elements":[{"$type":"Assignment","feature":"accDescr","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@15"},"arguments":[]}},{"$type":"Assignment","feature":"accTitle","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@16"},"arguments":[]}},{"$type":"Assignment","feature":"title","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@17"},"arguments":[]}}]},{"$type":"RuleCall","rule":{"$ref":"#/rules@12"},"arguments":[]}],"cardinality":"+"},"definesHiddenTokens":false,"entry":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"TerminalRule","name":"BOOLEAN","type":{"$type":"ReturnType","name":"boolean"},"definition":{"$type":"TerminalAlternatives","elements":[{"$type":"CharacterRange","left":{"$type":"Keyword","value":"true"}},{"$type":"CharacterRange","left":{"$type":"Keyword","value":"false"}}]},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ACC_DESCR","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*accDescr(?:[\\\\t ]*:([^\\\\n\\\\r]*?(?=%%)|[^\\\\n\\\\r]*)|\\\\s*{([^}]*)})/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ACC_TITLE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*accTitle[\\\\t ]*:(?:[^\\\\n\\\\r]*?(?=%%)|[^\\\\n\\\\r]*)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"TITLE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*title(?:[\\\\t ][^\\\\n\\\\r]*?(?=%%)|[\\\\t ][^\\\\n\\\\r]*|)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"FLOAT","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"RegexToken","regex":"/[0-9]+\\\\.[0-9]+(?!\\\\.)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"INT","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"RegexToken","regex":"/0|[1-9][0-9]*(?!\\\\.)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"NUMBER","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"TerminalAlternatives","elements":[{"$type":"TerminalRuleCall","rule":{"$ref":"#/rules@18"}},{"$type":"TerminalRuleCall","rule":{"$ref":"#/rules@19"}}]},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"STRING","type":{"$type":"ReturnType","name":"string"},"definition":{"$type":"RegexToken","regex":"/\\"([^\\"\\\\\\\\]|\\\\\\\\.)*\\"|'([^'\\\\\\\\]|\\\\\\\\.)*'/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ID","type":{"$type":"ReturnType","name":"string"},"definition":{"$type":"RegexToken","regex":"/[\\\\w]([-\\\\w]*\\\\w)?/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"NEWLINE","definition":{"$type":"RegexToken","regex":"/\\\\r?\\\\n/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","hidden":true,"name":"WHITESPACE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]+/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"YAML","definition":{"$type":"RegexToken","regex":"/---[\\\\t ]*\\\\r?\\\\n(?:[\\\\S\\\\s]*?\\\\r?\\\\n)?---(?:\\\\r?\\\\n|(?!\\\\S))/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"DIRECTIVE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*%%{[\\\\S\\\\s]*?}%%(?:\\\\r?\\\\n|(?!\\\\S))/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"SINGLE_LINE_COMMENT","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*%%[^\\\\n\\\\r]*/"},"fragment":false},{"$type":"TerminalRule","name":"ARCH_ICON","definition":{"$type":"RegexToken","regex":"/\\\\([\\\\w-:]+\\\\)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ARCH_TITLE","definition":{"$type":"RegexToken","regex":"/\\\\[[\\\\w ]+\\\\]/"},"fragment":false,"hidden":false}],"definesHiddenTokens":false,"hiddenTokens":[],"interfaces":[],"types":[],"usedGrammars":[]}`)), "ArchitectureGrammar");
var loadedGitGraphGrammar;
var GitGraphGrammar = /* @__PURE__ */ __name(() => loadedGitGraphGrammar ?? (loadedGitGraphGrammar = loadGrammarFromJson(`{"$type":"Grammar","isDeclared":true,"name":"GitGraph","imports":[],"rules":[{"$type":"ParserRule","entry":true,"name":"GitGraph","definition":{"$type":"Group","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@19"},"arguments":[],"cardinality":"*"},{"$type":"Alternatives","elements":[{"$type":"Keyword","value":"gitGraph"},{"$type":"Group","elements":[{"$type":"Keyword","value":"gitGraph"},{"$type":"Keyword","value":":"}]},{"$type":"Keyword","value":"gitGraph:"},{"$type":"Group","elements":[{"$type":"Keyword","value":"gitGraph"},{"$type":"RuleCall","rule":{"$ref":"#/rules@2"},"arguments":[]},{"$type":"Keyword","value":":"}]}]},{"$type":"Alternatives","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@19"},"arguments":[]},{"$type":"RuleCall","rule":{"$ref":"#/rules@9"},"arguments":[]},{"$type":"Assignment","feature":"statements","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@1"},"arguments":[]}}],"cardinality":"*"}]},"definesHiddenTokens":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"Statement","definition":{"$type":"Alternatives","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@3"},"arguments":[]},{"$type":"RuleCall","rule":{"$ref":"#/rules@4"},"arguments":[]},{"$type":"RuleCall","rule":{"$ref":"#/rules@5"},"arguments":[]},{"$type":"RuleCall","rule":{"$ref":"#/rules@6"},"arguments":[]},{"$type":"RuleCall","rule":{"$ref":"#/rules@7"},"arguments":[]}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"Direction","definition":{"$type":"Assignment","feature":"dir","operator":"=","terminal":{"$type":"Alternatives","elements":[{"$type":"Keyword","value":"LR"},{"$type":"Keyword","value":"TB"},{"$type":"Keyword","value":"BT"}]}},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"Commit","definition":{"$type":"Group","elements":[{"$type":"Keyword","value":"commit"},{"$type":"Alternatives","elements":[{"$type":"Group","elements":[{"$type":"Keyword","value":"id:"},{"$type":"Assignment","feature":"id","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@17"},"arguments":[]}}]},{"$type":"Group","elements":[{"$type":"Keyword","value":"msg:","cardinality":"?"},{"$type":"Assignment","feature":"message","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@17"},"arguments":[]}}]},{"$type":"Group","elements":[{"$type":"Keyword","value":"tag:"},{"$type":"Assignment","feature":"tags","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@17"},"arguments":[]}}]},{"$type":"Group","elements":[{"$type":"Keyword","value":"type:"},{"$type":"Assignment","feature":"type","operator":"=","terminal":{"$type":"Alternatives","elements":[{"$type":"Keyword","value":"NORMAL"},{"$type":"Keyword","value":"REVERSE"},{"$type":"Keyword","value":"HIGHLIGHT"}]}}]}],"cardinality":"*"},{"$type":"RuleCall","rule":{"$ref":"#/rules@8"},"arguments":[]}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"Branch","definition":{"$type":"Group","elements":[{"$type":"Keyword","value":"branch"},{"$type":"Assignment","feature":"name","operator":"=","terminal":{"$type":"Alternatives","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@24"},"arguments":[]},{"$type":"RuleCall","rule":{"$ref":"#/rules@17"},"arguments":[]}]}},{"$type":"Group","elements":[{"$type":"Keyword","value":"order:"},{"$type":"Assignment","feature":"order","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@15"},"arguments":[]}}],"cardinality":"?"},{"$type":"RuleCall","rule":{"$ref":"#/rules@8"},"arguments":[]}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"Merge","definition":{"$type":"Group","elements":[{"$type":"Keyword","value":"merge"},{"$type":"Assignment","feature":"branch","operator":"=","terminal":{"$type":"Alternatives","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@24"},"arguments":[]},{"$type":"RuleCall","rule":{"$ref":"#/rules@17"},"arguments":[]}]}},{"$type":"Alternatives","elements":[{"$type":"Group","elements":[{"$type":"Keyword","value":"id:"},{"$type":"Assignment","feature":"id","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@17"},"arguments":[]}}]},{"$type":"Group","elements":[{"$type":"Keyword","value":"tag:"},{"$type":"Assignment","feature":"tags","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@17"},"arguments":[]}}]},{"$type":"Group","elements":[{"$type":"Keyword","value":"type:"},{"$type":"Assignment","feature":"type","operator":"=","terminal":{"$type":"Alternatives","elements":[{"$type":"Keyword","value":"NORMAL"},{"$type":"Keyword","value":"REVERSE"},{"$type":"Keyword","value":"HIGHLIGHT"}]}}]}],"cardinality":"*"},{"$type":"RuleCall","rule":{"$ref":"#/rules@8"},"arguments":[]}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"Checkout","definition":{"$type":"Group","elements":[{"$type":"Alternatives","elements":[{"$type":"Keyword","value":"checkout"},{"$type":"Keyword","value":"switch"}]},{"$type":"Assignment","feature":"branch","operator":"=","terminal":{"$type":"Alternatives","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@24"},"arguments":[]},{"$type":"RuleCall","rule":{"$ref":"#/rules@17"},"arguments":[]}]}},{"$type":"RuleCall","rule":{"$ref":"#/rules@8"},"arguments":[]}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"CherryPicking","definition":{"$type":"Group","elements":[{"$type":"Keyword","value":"cherry-pick"},{"$type":"Alternatives","elements":[{"$type":"Group","elements":[{"$type":"Keyword","value":"id:"},{"$type":"Assignment","feature":"id","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@17"},"arguments":[]}}]},{"$type":"Group","elements":[{"$type":"Keyword","value":"tag:"},{"$type":"Assignment","feature":"tags","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@17"},"arguments":[]}}]},{"$type":"Group","elements":[{"$type":"Keyword","value":"parent:"},{"$type":"Assignment","feature":"parent","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@17"},"arguments":[]}}]}],"cardinality":"*"},{"$type":"RuleCall","rule":{"$ref":"#/rules@8"},"arguments":[]}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","fragment":true,"name":"EOL","dataType":"string","definition":{"$type":"Alternatives","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@19"},"arguments":[],"cardinality":"+"},{"$type":"EndOfFile"}]},"definesHiddenTokens":false,"entry":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","fragment":true,"name":"TitleAndAccessibilities","definition":{"$type":"Group","elements":[{"$type":"Alternatives","elements":[{"$type":"Assignment","feature":"accDescr","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@11"},"arguments":[]}},{"$type":"Assignment","feature":"accTitle","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@12"},"arguments":[]}},{"$type":"Assignment","feature":"title","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@13"},"arguments":[]}}]},{"$type":"RuleCall","rule":{"$ref":"#/rules@8"},"arguments":[]}],"cardinality":"+"},"definesHiddenTokens":false,"entry":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"TerminalRule","name":"BOOLEAN","type":{"$type":"ReturnType","name":"boolean"},"definition":{"$type":"TerminalAlternatives","elements":[{"$type":"CharacterRange","left":{"$type":"Keyword","value":"true"}},{"$type":"CharacterRange","left":{"$type":"Keyword","value":"false"}}]},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ACC_DESCR","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*accDescr(?:[\\\\t ]*:([^\\\\n\\\\r]*?(?=%%)|[^\\\\n\\\\r]*)|\\\\s*{([^}]*)})/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ACC_TITLE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*accTitle[\\\\t ]*:(?:[^\\\\n\\\\r]*?(?=%%)|[^\\\\n\\\\r]*)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"TITLE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*title(?:[\\\\t ][^\\\\n\\\\r]*?(?=%%)|[\\\\t ][^\\\\n\\\\r]*|)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"FLOAT","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"RegexToken","regex":"/[0-9]+\\\\.[0-9]+(?!\\\\.)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"INT","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"RegexToken","regex":"/0|[1-9][0-9]*(?!\\\\.)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"NUMBER","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"TerminalAlternatives","elements":[{"$type":"TerminalRuleCall","rule":{"$ref":"#/rules@14"}},{"$type":"TerminalRuleCall","rule":{"$ref":"#/rules@15"}}]},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"STRING","type":{"$type":"ReturnType","name":"string"},"definition":{"$type":"RegexToken","regex":"/\\"([^\\"\\\\\\\\]|\\\\\\\\.)*\\"|'([^'\\\\\\\\]|\\\\\\\\.)*'/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ID","type":{"$type":"ReturnType","name":"string"},"definition":{"$type":"RegexToken","regex":"/[\\\\w]([-\\\\w]*\\\\w)?/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"NEWLINE","definition":{"$type":"RegexToken","regex":"/\\\\r?\\\\n/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","hidden":true,"name":"WHITESPACE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]+/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"YAML","definition":{"$type":"RegexToken","regex":"/---[\\\\t ]*\\\\r?\\\\n(?:[\\\\S\\\\s]*?\\\\r?\\\\n)?---(?:\\\\r?\\\\n|(?!\\\\S))/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"DIRECTIVE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*%%{[\\\\S\\\\s]*?}%%(?:\\\\r?\\\\n|(?!\\\\S))/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"SINGLE_LINE_COMMENT","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*%%[^\\\\n\\\\r]*/"},"fragment":false},{"$type":"TerminalRule","name":"REFERENCE","type":{"$type":"ReturnType","name":"string"},"definition":{"$type":"RegexToken","regex":"/\\\\w([-\\\\./\\\\w]*[-\\\\w])?/"},"fragment":false,"hidden":false}],"definesHiddenTokens":false,"hiddenTokens":[],"interfaces":[],"types":[],"usedGrammars":[]}`)), "GitGraphGrammar");
var loadedRadarGrammar;
var RadarGrammar = /* @__PURE__ */ __name(() => loadedRadarGrammar ?? (loadedRadarGrammar = loadGrammarFromJson(`{"$type":"Grammar","isDeclared":true,"name":"Radar","imports":[],"rules":[{"$type":"ParserRule","entry":true,"name":"Radar","definition":{"$type":"Group","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@20"},"arguments":[],"cardinality":"*"},{"$type":"Alternatives","elements":[{"$type":"Keyword","value":"radar-beta"},{"$type":"Keyword","value":"radar-beta:"},{"$type":"Group","elements":[{"$type":"Keyword","value":"radar-beta"},{"$type":"Keyword","value":":"}]}]},{"$type":"RuleCall","rule":{"$ref":"#/rules@20"},"arguments":[],"cardinality":"*"},{"$type":"Alternatives","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@10"},"arguments":[]},{"$type":"Group","elements":[{"$type":"Keyword","value":"axis"},{"$type":"Assignment","feature":"axes","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@2"},"arguments":[]}},{"$type":"Group","elements":[{"$type":"Keyword","value":","},{"$type":"Assignment","feature":"axes","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@2"},"arguments":[]}}],"cardinality":"*"}]},{"$type":"Group","elements":[{"$type":"Keyword","value":"curve"},{"$type":"Assignment","feature":"curves","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@3"},"arguments":[]}},{"$type":"Group","elements":[{"$type":"Keyword","value":","},{"$type":"Assignment","feature":"curves","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@3"},"arguments":[]}}],"cardinality":"*"}]},{"$type":"Group","elements":[{"$type":"Assignment","feature":"options","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@7"},"arguments":[]}},{"$type":"Group","elements":[{"$type":"Keyword","value":","},{"$type":"Assignment","feature":"options","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@7"},"arguments":[]}}],"cardinality":"*"}]},{"$type":"RuleCall","rule":{"$ref":"#/rules@20"},"arguments":[]}],"cardinality":"*"}]},"definesHiddenTokens":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","fragment":true,"name":"Label","definition":{"$type":"Group","elements":[{"$type":"Keyword","value":"["},{"$type":"Assignment","feature":"label","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@18"},"arguments":[]}},{"$type":"Keyword","value":"]"}]},"definesHiddenTokens":false,"entry":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"Axis","definition":{"$type":"Group","elements":[{"$type":"Assignment","feature":"name","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@19"},"arguments":[]}},{"$type":"RuleCall","rule":{"$ref":"#/rules@1"},"arguments":[],"cardinality":"?"}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"Curve","definition":{"$type":"Group","elements":[{"$type":"Assignment","feature":"name","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@19"},"arguments":[]}},{"$type":"RuleCall","rule":{"$ref":"#/rules@1"},"arguments":[],"cardinality":"?"},{"$type":"Keyword","value":"{"},{"$type":"RuleCall","rule":{"$ref":"#/rules@4"},"arguments":[]},{"$type":"Keyword","value":"}"}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","fragment":true,"name":"Entries","definition":{"$type":"Alternatives","elements":[{"$type":"Group","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@20"},"arguments":[],"cardinality":"*"},{"$type":"Assignment","feature":"entries","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@6"},"arguments":[]}},{"$type":"Group","elements":[{"$type":"Keyword","value":","},{"$type":"RuleCall","rule":{"$ref":"#/rules@20"},"arguments":[],"cardinality":"*"},{"$type":"Assignment","feature":"entries","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@6"},"arguments":[]}}],"cardinality":"*"},{"$type":"RuleCall","rule":{"$ref":"#/rules@20"},"arguments":[],"cardinality":"*"}]},{"$type":"Group","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@20"},"arguments":[],"cardinality":"*"},{"$type":"Assignment","feature":"entries","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@5"},"arguments":[]}},{"$type":"Group","elements":[{"$type":"Keyword","value":","},{"$type":"RuleCall","rule":{"$ref":"#/rules@20"},"arguments":[],"cardinality":"*"},{"$type":"Assignment","feature":"entries","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@5"},"arguments":[]}}],"cardinality":"*"},{"$type":"RuleCall","rule":{"$ref":"#/rules@20"},"arguments":[],"cardinality":"*"}]}]},"definesHiddenTokens":false,"entry":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"DetailedEntry","returnType":{"$ref":"#/interfaces@0"},"definition":{"$type":"Group","elements":[{"$type":"Assignment","feature":"axis","operator":"=","terminal":{"$type":"CrossReference","type":{"$ref":"#/rules@2"},"terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@19"},"arguments":[]},"deprecatedSyntax":false}},{"$type":"Keyword","value":":","cardinality":"?"},{"$type":"Assignment","feature":"value","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@17"},"arguments":[]}}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"NumberEntry","returnType":{"$ref":"#/interfaces@0"},"definition":{"$type":"Assignment","feature":"value","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@17"},"arguments":[]}},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"Option","definition":{"$type":"Alternatives","elements":[{"$type":"Group","elements":[{"$type":"Assignment","feature":"name","operator":"=","terminal":{"$type":"Keyword","value":"showLegend"}},{"$type":"Assignment","feature":"value","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@11"},"arguments":[]}}]},{"$type":"Group","elements":[{"$type":"Assignment","feature":"name","operator":"=","terminal":{"$type":"Keyword","value":"ticks"}},{"$type":"Assignment","feature":"value","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@17"},"arguments":[]}}]},{"$type":"Group","elements":[{"$type":"Assignment","feature":"name","operator":"=","terminal":{"$type":"Keyword","value":"max"}},{"$type":"Assignment","feature":"value","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@17"},"arguments":[]}}]},{"$type":"Group","elements":[{"$type":"Assignment","feature":"name","operator":"=","terminal":{"$type":"Keyword","value":"min"}},{"$type":"Assignment","feature":"value","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@17"},"arguments":[]}}]},{"$type":"Group","elements":[{"$type":"Assignment","feature":"name","operator":"=","terminal":{"$type":"Keyword","value":"graticule"}},{"$type":"Assignment","feature":"value","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@8"},"arguments":[]}}]}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"TerminalRule","name":"GRATICULE","type":{"$type":"ReturnType","name":"string"},"definition":{"$type":"TerminalAlternatives","elements":[{"$type":"CharacterRange","left":{"$type":"Keyword","value":"circle"}},{"$type":"CharacterRange","left":{"$type":"Keyword","value":"polygon"}}]},"fragment":false,"hidden":false},{"$type":"ParserRule","fragment":true,"name":"EOL","dataType":"string","definition":{"$type":"Alternatives","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@20"},"arguments":[],"cardinality":"+"},{"$type":"EndOfFile"}]},"definesHiddenTokens":false,"entry":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","fragment":true,"name":"TitleAndAccessibilities","definition":{"$type":"Group","elements":[{"$type":"Alternatives","elements":[{"$type":"Assignment","feature":"accDescr","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@12"},"arguments":[]}},{"$type":"Assignment","feature":"accTitle","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@13"},"arguments":[]}},{"$type":"Assignment","feature":"title","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@14"},"arguments":[]}}]},{"$type":"RuleCall","rule":{"$ref":"#/rules@9"},"arguments":[]}],"cardinality":"+"},"definesHiddenTokens":false,"entry":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"TerminalRule","name":"BOOLEAN","type":{"$type":"ReturnType","name":"boolean"},"definition":{"$type":"TerminalAlternatives","elements":[{"$type":"CharacterRange","left":{"$type":"Keyword","value":"true"}},{"$type":"CharacterRange","left":{"$type":"Keyword","value":"false"}}]},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ACC_DESCR","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*accDescr(?:[\\\\t ]*:([^\\\\n\\\\r]*?(?=%%)|[^\\\\n\\\\r]*)|\\\\s*{([^}]*)})/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ACC_TITLE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*accTitle[\\\\t ]*:(?:[^\\\\n\\\\r]*?(?=%%)|[^\\\\n\\\\r]*)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"TITLE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*title(?:[\\\\t ][^\\\\n\\\\r]*?(?=%%)|[\\\\t ][^\\\\n\\\\r]*|)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"FLOAT","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"RegexToken","regex":"/[0-9]+\\\\.[0-9]+(?!\\\\.)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"INT","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"RegexToken","regex":"/0|[1-9][0-9]*(?!\\\\.)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"NUMBER","type":{"$type":"ReturnType","name":"number"},"definition":{"$type":"TerminalAlternatives","elements":[{"$type":"TerminalRuleCall","rule":{"$ref":"#/rules@15"}},{"$type":"TerminalRuleCall","rule":{"$ref":"#/rules@16"}}]},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"STRING","type":{"$type":"ReturnType","name":"string"},"definition":{"$type":"RegexToken","regex":"/\\"([^\\"\\\\\\\\]|\\\\\\\\.)*\\"|'([^'\\\\\\\\]|\\\\\\\\.)*'/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ID","type":{"$type":"ReturnType","name":"string"},"definition":{"$type":"RegexToken","regex":"/[\\\\w]([-\\\\w]*\\\\w)?/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"NEWLINE","definition":{"$type":"RegexToken","regex":"/\\\\r?\\\\n/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","hidden":true,"name":"WHITESPACE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]+/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"YAML","definition":{"$type":"RegexToken","regex":"/---[\\\\t ]*\\\\r?\\\\n(?:[\\\\S\\\\s]*?\\\\r?\\\\n)?---(?:\\\\r?\\\\n|(?!\\\\S))/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"DIRECTIVE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*%%{[\\\\S\\\\s]*?}%%(?:\\\\r?\\\\n|(?!\\\\S))/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"SINGLE_LINE_COMMENT","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*%%[^\\\\n\\\\r]*/"},"fragment":false}],"interfaces":[{"$type":"Interface","name":"Entry","attributes":[{"$type":"TypeAttribute","name":"axis","isOptional":true,"type":{"$type":"ReferenceType","referenceType":{"$type":"SimpleType","typeRef":{"$ref":"#/rules@2"}}}},{"$type":"TypeAttribute","name":"value","type":{"$type":"SimpleType","primitiveType":"number"},"isOptional":false}],"superTypes":[]}],"definesHiddenTokens":false,"hiddenTokens":[],"types":[],"usedGrammars":[]}`)), "RadarGrammar");
var loadedTreemapGrammar;
var TreemapGrammar = /* @__PURE__ */ __name(() => loadedTreemapGrammar ?? (loadedTreemapGrammar = loadGrammarFromJson(`{"$type":"Grammar","isDeclared":true,"name":"Treemap","rules":[{"$type":"ParserRule","fragment":true,"name":"TitleAndAccessibilities","definition":{"$type":"Alternatives","elements":[{"$type":"Assignment","feature":"accDescr","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@2"},"arguments":[]}},{"$type":"Assignment","feature":"accTitle","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@3"},"arguments":[]}},{"$type":"Assignment","feature":"title","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@4"},"arguments":[]}}],"cardinality":"+"},"definesHiddenTokens":false,"entry":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"TerminalRule","name":"BOOLEAN","type":{"$type":"ReturnType","name":"boolean"},"definition":{"$type":"TerminalAlternatives","elements":[{"$type":"CharacterRange","left":{"$type":"Keyword","value":"true"}},{"$type":"CharacterRange","left":{"$type":"Keyword","value":"false"}}]},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ACC_DESCR","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*accDescr(?:[\\\\t ]*:([^\\\\n\\\\r]*?(?=%%)|[^\\\\n\\\\r]*)|\\\\s*{([^}]*)})/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ACC_TITLE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*accTitle[\\\\t ]*:(?:[^\\\\n\\\\r]*?(?=%%)|[^\\\\n\\\\r]*)/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"TITLE","definition":{"$type":"RegexToken","regex":"/[\\\\t ]*title(?:[\\\\t ][^\\\\n\\\\r]*?(?=%%)|[\\\\t ][^\\\\n\\\\r]*|)/"},"fragment":false,"hidden":false},{"$type":"ParserRule","entry":true,"name":"Treemap","returnType":{"$ref":"#/interfaces@4"},"definition":{"$type":"Group","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@6"},"arguments":[]},{"$type":"Alternatives","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@0"},"arguments":[]},{"$type":"Assignment","feature":"TreemapRows","operator":"+=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@14"},"arguments":[]}}],"cardinality":"*"}]},"definesHiddenTokens":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"TerminalRule","name":"TREEMAP_KEYWORD","definition":{"$type":"TerminalAlternatives","elements":[{"$type":"CharacterRange","left":{"$type":"Keyword","value":"treemap-beta"}},{"$type":"CharacterRange","left":{"$type":"Keyword","value":"treemap"}}]},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"CLASS_DEF","definition":{"$type":"RegexToken","regex":"/classDef\\\\s+([a-zA-Z_][a-zA-Z0-9_]+)(?:\\\\s+([^;\\\\r\\\\n]*))?(?:;)?/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"STYLE_SEPARATOR","definition":{"$type":"CharacterRange","left":{"$type":"Keyword","value":":::"}},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"SEPARATOR","definition":{"$type":"CharacterRange","left":{"$type":"Keyword","value":":"}},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"COMMA","definition":{"$type":"CharacterRange","left":{"$type":"Keyword","value":","}},"fragment":false,"hidden":false},{"$type":"TerminalRule","hidden":true,"name":"WS","definition":{"$type":"RegexToken","regex":"/[ \\\\t]+/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"ML_COMMENT","definition":{"$type":"RegexToken","regex":"/\\\\%\\\\%[^\\\\n]*/"},"fragment":false},{"$type":"TerminalRule","hidden":true,"name":"NL","definition":{"$type":"RegexToken","regex":"/\\\\r?\\\\n/"},"fragment":false},{"$type":"ParserRule","name":"TreemapRow","definition":{"$type":"Group","elements":[{"$type":"Assignment","feature":"indent","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@19"},"arguments":[]},"cardinality":"?"},{"$type":"Alternatives","elements":[{"$type":"Assignment","feature":"item","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@16"},"arguments":[]}},{"$type":"RuleCall","rule":{"$ref":"#/rules@15"},"arguments":[]}]}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"ClassDef","dataType":"string","definition":{"$type":"RuleCall","rule":{"$ref":"#/rules@7"},"arguments":[]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"Item","returnType":{"$ref":"#/interfaces@0"},"definition":{"$type":"Alternatives","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@18"},"arguments":[]},{"$type":"RuleCall","rule":{"$ref":"#/rules@17"},"arguments":[]}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"Section","returnType":{"$ref":"#/interfaces@1"},"definition":{"$type":"Group","elements":[{"$type":"Assignment","feature":"name","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@23"},"arguments":[]}},{"$type":"Group","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@8"},"arguments":[]},{"$type":"Assignment","feature":"classSelector","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@20"},"arguments":[]}}],"cardinality":"?"}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"ParserRule","name":"Leaf","returnType":{"$ref":"#/interfaces@2"},"definition":{"$type":"Group","elements":[{"$type":"Assignment","feature":"name","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@23"},"arguments":[]}},{"$type":"RuleCall","rule":{"$ref":"#/rules@19"},"arguments":[],"cardinality":"?"},{"$type":"Alternatives","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@9"},"arguments":[]},{"$type":"RuleCall","rule":{"$ref":"#/rules@10"},"arguments":[]}]},{"$type":"RuleCall","rule":{"$ref":"#/rules@19"},"arguments":[],"cardinality":"?"},{"$type":"Assignment","feature":"value","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@22"},"arguments":[]}},{"$type":"Group","elements":[{"$type":"RuleCall","rule":{"$ref":"#/rules@8"},"arguments":[]},{"$type":"Assignment","feature":"classSelector","operator":"=","terminal":{"$type":"RuleCall","rule":{"$ref":"#/rules@20"},"arguments":[]}}],"cardinality":"?"}]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"TerminalRule","name":"INDENTATION","definition":{"$type":"RegexToken","regex":"/[ \\\\t]{1,}/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"ID2","definition":{"$type":"RegexToken","regex":"/[a-zA-Z_][a-zA-Z0-9_]*/"},"fragment":false,"hidden":false},{"$type":"TerminalRule","name":"NUMBER2","definition":{"$type":"RegexToken","regex":"/[0-9_\\\\.\\\\,]+/"},"fragment":false,"hidden":false},{"$type":"ParserRule","name":"MyNumber","dataType":"number","definition":{"$type":"RuleCall","rule":{"$ref":"#/rules@21"},"arguments":[]},"definesHiddenTokens":false,"entry":false,"fragment":false,"hiddenTokens":[],"parameters":[],"wildcard":false},{"$type":"TerminalRule","name":"STRING2","definition":{"$type":"RegexToken","regex":"/\\"[^\\"]*\\"|'[^']*'/"},"fragment":false,"hidden":false}],"interfaces":[{"$type":"Interface","name":"Item","attributes":[{"$type":"TypeAttribute","name":"name","type":{"$type":"SimpleType","primitiveType":"string"},"isOptional":false},{"$type":"TypeAttribute","name":"classSelector","isOptional":true,"type":{"$type":"SimpleType","primitiveType":"string"}}],"superTypes":[]},{"$type":"Interface","name":"Section","superTypes":[{"$ref":"#/interfaces@0"}],"attributes":[]},{"$type":"Interface","name":"Leaf","superTypes":[{"$ref":"#/interfaces@0"}],"attributes":[{"$type":"TypeAttribute","name":"value","type":{"$type":"SimpleType","primitiveType":"number"},"isOptional":false}]},{"$type":"Interface","name":"ClassDefStatement","attributes":[{"$type":"TypeAttribute","name":"className","type":{"$type":"SimpleType","primitiveType":"string"},"isOptional":false},{"$type":"TypeAttribute","name":"styleText","type":{"$type":"SimpleType","primitiveType":"string"},"isOptional":false}],"superTypes":[]},{"$type":"Interface","name":"Treemap","attributes":[{"$type":"TypeAttribute","name":"TreemapRows","type":{"$type":"ArrayType","elementType":{"$type":"SimpleType","typeRef":{"$ref":"#/rules@14"}}},"isOptional":false},{"$type":"TypeAttribute","name":"title","isOptional":true,"type":{"$type":"SimpleType","primitiveType":"string"}},{"$type":"TypeAttribute","name":"accTitle","isOptional":true,"type":{"$type":"SimpleType","primitiveType":"string"}},{"$type":"TypeAttribute","name":"accDescr","isOptional":true,"type":{"$type":"SimpleType","primitiveType":"string"}}],"superTypes":[]}],"definesHiddenTokens":false,"hiddenTokens":[],"imports":[],"types":[],"usedGrammars":[],"$comment":"/**\\n * Treemap grammar for Langium\\n * Converted from mindmap grammar\\n *\\n * The ML_COMMENT and NL hidden terminals handle whitespace, comments, and newlines\\n * before the treemap keyword, allowing for empty lines and comments before the\\n * treemap declaration.\\n */"}`)), "TreemapGrammar");
var InfoLanguageMetaData = {
	languageId: "info",
	fileExtensions: [".mmd", ".mermaid"],
	caseInsensitive: false,
	mode: "production"
};
var PacketLanguageMetaData = {
	languageId: "packet",
	fileExtensions: [".mmd", ".mermaid"],
	caseInsensitive: false,
	mode: "production"
};
var PieLanguageMetaData = {
	languageId: "pie",
	fileExtensions: [".mmd", ".mermaid"],
	caseInsensitive: false,
	mode: "production"
};
var ArchitectureLanguageMetaData = {
	languageId: "architecture",
	fileExtensions: [".mmd", ".mermaid"],
	caseInsensitive: false,
	mode: "production"
};
var GitGraphLanguageMetaData = {
	languageId: "gitGraph",
	fileExtensions: [".mmd", ".mermaid"],
	caseInsensitive: false,
	mode: "production"
};
var RadarLanguageMetaData = {
	languageId: "radar",
	fileExtensions: [".mmd", ".mermaid"],
	caseInsensitive: false,
	mode: "production"
};
var TreemapLanguageMetaData = {
	languageId: "treemap",
	fileExtensions: [".mmd", ".mermaid"],
	caseInsensitive: false,
	mode: "production"
};
var MermaidGeneratedSharedModule = { AstReflection: /* @__PURE__ */ __name(() => new MermaidAstReflection(), "AstReflection") };
var InfoGeneratedModule = {
	Grammar: /* @__PURE__ */ __name(() => InfoGrammar(), "Grammar"),
	LanguageMetaData: /* @__PURE__ */ __name(() => InfoLanguageMetaData, "LanguageMetaData"),
	parser: {}
};
var PacketGeneratedModule = {
	Grammar: /* @__PURE__ */ __name(() => PacketGrammar(), "Grammar"),
	LanguageMetaData: /* @__PURE__ */ __name(() => PacketLanguageMetaData, "LanguageMetaData"),
	parser: {}
};
var PieGeneratedModule = {
	Grammar: /* @__PURE__ */ __name(() => PieGrammar(), "Grammar"),
	LanguageMetaData: /* @__PURE__ */ __name(() => PieLanguageMetaData, "LanguageMetaData"),
	parser: {}
};
var ArchitectureGeneratedModule = {
	Grammar: /* @__PURE__ */ __name(() => ArchitectureGrammar(), "Grammar"),
	LanguageMetaData: /* @__PURE__ */ __name(() => ArchitectureLanguageMetaData, "LanguageMetaData"),
	parser: {}
};
var GitGraphGeneratedModule = {
	Grammar: /* @__PURE__ */ __name(() => GitGraphGrammar(), "Grammar"),
	LanguageMetaData: /* @__PURE__ */ __name(() => GitGraphLanguageMetaData, "LanguageMetaData"),
	parser: {}
};
var RadarGeneratedModule = {
	Grammar: /* @__PURE__ */ __name(() => RadarGrammar(), "Grammar"),
	LanguageMetaData: /* @__PURE__ */ __name(() => RadarLanguageMetaData, "LanguageMetaData"),
	parser: {}
};
var TreemapGeneratedModule = {
	Grammar: /* @__PURE__ */ __name(() => TreemapGrammar(), "Grammar"),
	LanguageMetaData: /* @__PURE__ */ __name(() => TreemapLanguageMetaData, "LanguageMetaData"),
	parser: {}
};
var rulesRegexes = {
	ACC_DESCR: /accDescr(?:[\t ]*:([^\n\r]*)|\s*{([^}]*)})/,
	ACC_TITLE: /accTitle[\t ]*:([^\n\r]*)/,
	TITLE: /title([\t ][^\n\r]*|)/
};
var AbstractMermaidValueConverter = class extends DefaultValueConverter {
	static {
		__name(this, "AbstractMermaidValueConverter");
	}
	runConverter(rule, input, cstNode) {
		let value = this.runCommonConverter(rule, input, cstNode);
		if (value === void 0) value = this.runCustomConverter(rule, input, cstNode);
		if (value === void 0) return super.runConverter(rule, input, cstNode);
		return value;
	}
	runCommonConverter(rule, input, _cstNode) {
		const regex = rulesRegexes[rule.name];
		if (regex === void 0) return;
		const match = regex.exec(input);
		if (match === null) return;
		if (match[1] !== void 0) return match[1].trim().replace(/[\t ]{2,}/gm, " ");
		if (match[2] !== void 0) return match[2].replace(/^\s*/gm, "").replace(/\s+$/gm, "").replace(/[\t ]{2,}/gm, " ").replace(/[\n\r]{2,}/gm, "\n");
	}
};
var CommonValueConverter = class extends AbstractMermaidValueConverter {
	static {
		__name(this, "CommonValueConverter");
	}
	runCustomConverter(_rule, _input, _cstNode) {}
};
var AbstractMermaidTokenBuilder = class extends DefaultTokenBuilder {
	static {
		__name(this, "AbstractMermaidTokenBuilder");
	}
	constructor(keywords) {
		super();
		this.keywords = new Set(keywords);
	}
	buildKeywordTokens(rules, terminalTokens, options) {
		const tokenTypes = super.buildKeywordTokens(rules, terminalTokens, options);
		tokenTypes.forEach((tokenType) => {
			if (this.keywords.has(tokenType.name) && tokenType.PATTERN !== void 0) tokenType.PATTERN = new RegExp(tokenType.PATTERN.toString() + "(?:(?=%%)|(?!\\S))");
		});
		return tokenTypes;
	}
};
var CommonTokenBuilder = class extends AbstractMermaidTokenBuilder {
	static {
		__name(this, "CommonTokenBuilder");
	}
};
export { GitGraphGeneratedModule as a, PacketGeneratedModule as c, TreemapGeneratedModule as d, __name as f, createDefaultSharedCoreModule as g, createDefaultCoreModule as h, CommonValueConverter as i, PieGeneratedModule as l, inject as m, AbstractMermaidValueConverter as n, InfoGeneratedModule as o, EmptyFileSystem as p, ArchitectureGeneratedModule as r, MermaidGeneratedSharedModule as s, AbstractMermaidTokenBuilder as t, RadarGeneratedModule as u };
