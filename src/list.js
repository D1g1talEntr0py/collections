import { _arrayIsEmpty, _arrayRemove } from '@d1g1tal/chrysalis';

/**
 *
 * @template E
 * @typedef {Iterable<E>} List<E>
 */

/**
 * @template E
 * @type {List<E>}
 */
export default class List {
	/** @type {Array<E>} */
	#array;

	/**
	 *
	 * @param {Iterable<E>} [iterable]
	 */
	constructor(iterable = []) {
		this.#array = Array.of(...iterable);
	}

	/**
	 *
	 * @param {Iterable<E>} iterable
	 * @param {function(E, number?)} mapper
	 * @param {*} context
	 * @returns {List<E>}
	 */
	static from(iterable, mapper, context) {
		return new List(Array.from(iterable, mapper, context));
	}

	static withSize(size) {
		return new List(new Array(size));
	}

	/**
	 *
	 * @param {E} element
	 * @returns {List<E>} The updated list
	 */
	add(element) {
		this.#array.push(element);

		return this;
	}

	/**
	 *
	 * @param {Iterable<E>} iterable
	 * @returns {List<E>} The updated list
	 */
	addAll(iterable) {
		this.#array.push(...iterable);

		return this;
	}

	clear() {
		this.#array.length = 0;
	}

	/**
	 *
	 * @param {E} elements
	 * @returns {List<E>}
	 */
	concat(elements) {
		return this(this.#array.concat(...elements));
	}

	/**
	 *
	 * @param {function(E, number?, List<E>?): boolean} predicate
	 * @returns {boolean}
	 */
	every(predicate) {
		return this.#array.every((element, index) => predicate(element, index, this));
	}

	/**
	 *
	 * @param {function(E, number?, List<E>?): boolean} predicate
	 * @returns {boolean}
	 */
	some(predicate) {
		return this.#array.some((element, index) => predicate(element, index, this));
	}

	/**
	 *
	 * @param {function(E, number?, List<E>?): boolean} predicate
	 * @returns {List<E>}
	 */
	filter(predicate) {
		return new List(this.#array.filter((element, index) => predicate(element, index, this)));
	}

	/**
	 *
	 * @param {function(E, number?, List<E>?): boolean} predicate
	 * @param {*} [context] Optional object to use as this when calling the predicate function
	 * @returns {E}
	 */
	find(predicate, context) {
		return this.#array.find((element, index) => predicate(element, index, this), context);
	}

	/**
	 *
	 * @param {function(E, number?, List<E>?): boolean} predicate
	 * @param {*} [context] Optional object to use as this when calling the predicate function
	 * @returns {number}
	 */
	findIndex(predicate, context) {
		return this.#array.findIndex((element, index) => predicate(element, index, this), context);
	}

	/**
	 *
	 * @param {function(E, number?, List<E>?)} mapper
	 * @returns {List<E>}
	 */
	map(mapper) {
		return new List(this.#array.map((element, index) => mapper(element, index, this)));
	}

	/**
	 * Executes a user-supplied "reducer" callback function on each element of the list, in order,
	 * passing in the return value from the calculation on the preceding element. The final result
	 * of running the reducer across all elements of the array is a single value.
	 *
	 * @param {function(E, E, *)} reducer
	 * @param {*} [initialValue]
	 * @returns {*}
	 */
	reduce(reducer, initialValue) {
		return this.#array.reduce(reducer, initialValue);
	}

	/**
	 * Sorts the elements of a list in place and returns the reference to the same list, now sorted.
	 * The default sort order is ascending, built upon converting the elements into strings,
	 * then comparing their sequences of UTF-16 code units values.
	 *
	 * The sort() method preserves empty slots. If the source list is sparse, the empty slots are moved to the end of the list, and always come after all the undefined values.
	 *
	 * @example
	 * // returns
	 * new List([50, 3, 20, 33, 9, 1]).sort();
	 * @param {function(E, E): number} [comparator] A function that defines the sort order. If omitted, the list elements are converted to strings, then sorted according to each character's Unicode code point value.
	 * @returns {List<E>} The reference to the original list, now sorted. Note that the list is sorted in place, and no copy is made.
	 */
	sort(comparator) {
		this.#array.sort(comparator);

		return this;
	}

	/**
	 *
	 * @param {function(E, number?, List<E>?): boolean} consumer
	 */
	forEach(consumer) {
		this.#array.forEach((element, index) => consumer(element, index, this));
	}

	/**
	 *
	 * @param {E} element
	 * @param {number} [fromIndex]
	 * @returns {E}
	 */
	get(element, fromIndex = 0) {
		return this.#array.at(this.#array.indexOf(element, fromIndex));
	}

	/**
	 *
	 * @param {E} element
	 * @returns {boolean}
	 */
	has(element) {
		return this.#array.includes(element);
	}

	/**
	 * Inserts the entry in a sorted list in the correct position.
	 * The list must be sorted in ascending order to work.
	 *
	 * @param {number} index
	 * @param {E} element The entry to add to the list.
	 */
	insert(index, element) {
		this.#array.splice(index, 0, element);
	}

	/**
	 * Removes the element associated to the value and returns a boolean asserting whether an element was successfully removed or not.
	 *
	 * @param {E} element The element to remove
	 * @returns {boolean} true if element was already in {@link List}; otherwise false.
	 */
	delete(element) {
		return this.#array.length > _arrayRemove(this.#array, this.#array.indexOf(element));
	}

	/**
	 * Removes the element at the specified index and returns a boolean asserting whether an element was successfully removed or not.
	 *
	 * @param {number} index The element to remove
	 * @returns {boolean} true if element was already in {@link List}; otherwise false.
	 */
	deleteAt(index) {
		return this.#array.length > _arrayRemove(this.#array, index);
	}

	keys() {
		return this.#array.keys();
	}

	/**
	 *
	 * @returns {IterableIterator<E>}
	 */
	values() {
		return this[Symbol.iterator]();
	}

	/**
	 *
	 * @returns {IterableIterator<number, E>}
	 */
	entries() {
		return this.#array.entries();
	}

	/**
	 * Checks to see if the list is empty
	 *
	 * @returns {boolean} true if the list is empty, false otherwise.
	 */
	isEmpty() {
		return _arrayIsEmpty(this.#array);
	}

	toArray() {
		return [...this.#array];
	}

	toString() {
		return this.#array.toString();
	}

	valueOf() {
		return this.#array.valueOf();
	}

	get size() {
		return this.#array.length;
	}

	[Symbol.iterator]() {
		return this.#array[Symbol.iterator]();
	}

	get [Symbol.toStringTag]() {
		return 'List';
	}
}