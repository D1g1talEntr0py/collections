/**
 * A {@link List} is wrapper around an array which is intended to store a homogenous collection of elements.
 * Most of the array methods are implemented along with some additional methods.
 *
 * @template E
 * @typedef {Iterable<E>} List<E>
 */

/**
 * @template E
 * @type {List<E>}
 */
class List {
	/** @type {Array<E>} */
	#array;

	/**
	 * Creates a new List instance.
	 *
	 * @param {Iterable<E>} [iterable] An iterable to create a new list.
	 */
	constructor(iterable = []) {
		this.#array = Array.from(iterable);
	}

	/**
	 * Create a new {@link List} instance from a collection of elements.
	 * You can also pass a mapping function to transform the elements of the list.
	 *
	 * @param {Iterable<E>} elements The elements to create a list from.
	 * @param {function(E, number?): E} [mapper] The optional mapping function to call for every element in the list.
	 * @param {*} [context] The context to pass to the mapping function.
	 * @returns {List<E>} The new list.
	 */
	static from(elements, mapper, context) {
		return new List(Array.from(elements, mapper, context));
	}

	/**
	 * Create a new {@link List} with an initial capacity.
	 *
	 * @param {number} size The capacity of the new list
	 * @returns {List<E>} The new list with a capacity.
	 */
	static withCapacity(size) {
		return new List(new Array(size));
	}

	/**
	 * Add an element to the list.
	 *
	 * @param {E} element The element to add.
	 * @returns {List<E>} The updated list
	 */
	add(element) {
		this.#array.push(element);

		return this;
	}

	/**
	 * Add all the elements in the provided {@link Iterable}.
	 *
	 * @param {Iterable<E>} elements The elements to add.
	 * @returns {List<E>} The updated list.
	 */
	addAll(elements) {
		this.#array.push(...elements);

		return this;
	}

	/**
	 * Remove all the elements from the list.
	 */
	clear() {
		this.#array.length = 0;
	}

	/**
	 * Combines two or more lists.
	 * This method returns a new list without modifying any existing list.
	 *
	 * @param {List<E>} elements Additional lists and/or items to add to the end of the list.
	 * @returns {List<E>} A new list with the elements provided appended to the current list.
	 */
	concat(elements) {
		return new List(this.#array.concat(...elements));
	}

	/**
	 * Determines whether all the members of an list satisfy the specified test.
	 *
	 * @param {function(E, number?, List<E>?): boolean} predicate A function that accepts up to three arguments. The every method calls
	 * the predicate function for each element in the list until the predicate returns a value
	 * which is coercible to the {@link Boolean} value false, or until the end of the list.
	 * @param {*} [context=this] An object to which the this keyword can refer in the predicate function.
	 * If context is omitted, this is used as the this value.
	 * @returns {boolean} true if all elements satisfy the specified test, false otherwise.
	 */
	every(predicate, context = this) {
		return this.#array.every((element, index) => predicate(element, index, context));
	}

	/**
	 * Determines whether the specified callback function returns true for any element in the list.
	 *
	 * @param {function(E, number?, List<E>?): boolean} predicate A function that accepts up to three arguments. The some method calls
	 * the predicate function for each element in the list until the predicate returns a value
	 * which is coercible to the Boolean value true, or until the end of the list.
	 * @param {*} [context=this] An object to which the this keyword can refer in the predicate function.
	 * If context is omitted, this is used as the this value.
	 * @returns {boolean} true if any of the elements returns true from the predicate function, false otherwise.
	 */
	some(predicate, context = this) {
		return this.#array.some((element, index) => predicate(element, index, context));
	}

	/**
	 * Returns the elements of the list that meet the condition specified in a predicate function.
	 *
	 * @param {function(E, number?, List<E>?): boolean} predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the list.
	 * @param {*} [context=this] An object to which the this keyword can refer in the predicate function. If context is omitted, this is used as the this value.
	 * @returns {List<E>} A new list of elements that satisfied the predicate condition.
	 */
	filter(predicate, context = this) {
		return new List(this.#array.filter((element, index) => predicate(element, index, context)));
	}

	/**
	 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
	 *
	 * @param {function(E, number?, List<E>?): boolean} predicate find calls predicate once for each element of the array, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined.
	 * @param {*} [context=this] If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead.
	 * @returns {E} The element in the array.
	 */
	find(predicate, context = this) {
		return this.#array.find((element, index) => predicate(element, index, this), context);
	}

	/**
	 * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
	 *
	 * @param {function(E, number?, List<E>?): boolean} predicate find calls predicate once for each element of the array, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found, findIndex immediately returns that element index. Otherwise, findIndex returns -1.
	 * @param {*} [context=this] If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead.
	 * @returns {number} The index found.
	 */
	findIndex(predicate, context = this) {
		return this.#array.findIndex((element, index) => predicate(element, index, this), context);
	}

	/**
	 * Calls a defined callback function on each element of the list, and returns a list that contains the results.
	 *
	 * @param {function(E, number?, List<E>?): *} mapper A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
	 * @param {*} [context=this] An object to which the this keyword can refer in the callbackfn function. If context is omitted, undefined is used as the this value.
	 * @returns {List<*>} The resulting list
	 */
	map(mapper, context = this) {
		return new List(this.#array.map((element, index) => mapper(element, index, context)));
	}

	/**
	 * Executes a user-supplied "reducer" callback function on each element of the list, in order,
	 * passing in the return value from the calculation on the preceding element. The final result
	 * of running the reducer across all elements of the list is a single value.
	 *
	 * @param {function(E, E, number, List<E>): *} reducer A function that accepts up to four arguments. The reduce method calls the reducer function one time for each element in the list.
	 * @param {E} [initialValue] If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the reducer function provides this value as an argument instead of a list value.
	 * @returns {E} The resulting element.
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
	 * Performs the specified action for each element in an list.
	 *
	 * @param {function(E, number?, List<E>?): boolean} consumer A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
	 * @param {*} [context] An object to which the this keyword can refer in the consumer function. If context is omitted, this is used as the this value.
	 */
	forEach(consumer, context = this) {
		this.#array.forEach((element, index) => consumer(element, index, context));
	}

	/**
	 * Returns the item located at the specified index.
	 *
	 * @param {number} index The zero-based index of the desired code unit. A negative index will count back from the last item.
	 * @returns {E} The element at the provided index
	 */
	get(index) {
		return this.#array.at(index);
	}

	/**
	 * Sets the value at the specified index.
	 *
	 * @param {number} index The index to set the value.
	 * @param {E} element The element to set.
	 * @returns {List<E>} The updated list.
	 */
	set(index, element) {
		this.#array.splice(index, 1, element).at(0);

		return this;
	}

	/**
	 * Checks the list to see if the provided element exists in the list.
	 *
	 * @param {E} element The element to check.
	 * @returns {boolean} true if the element is in the list, false otherwise
	 */
	has(element) {
		return this.#array.includes(element);
	}

	/**
	 * Inserts the entry in a sorted list in the correct position.
	 * The list must be sorted in ascending order to work.
	 *
	 * @param {number} index The index to insert the new element.
	 * @param {E} element The entry to add to the list.
	 * @returns {List<E>} The updated list.
	 */
	insert(index, element) {
		this.#array.splice(index, 0, element);

		return this;
	}

	/**
	 * Removes the element associated to the value and returns a boolean asserting whether an element was successfully removed or not.
	 *
	 * @param {E} element The element to remove
	 * @returns {boolean} true if element was already in {@link List}; otherwise false.
	 */
	delete(element) {
		const index = this.#array.indexOf(element);
		if (index !== -1) {
			this.#array.splice(index, 1);
			return true;
		}

		return false;
	}

	/**
	 * Removes the element at the specified index and returns a boolean asserting whether an element was successfully removed or not.
	 *
	 * @param {number} index The element to remove
	 * @returns {boolean} true if element was already in {@link List}; otherwise false.
	 */
	deleteAt(index) {
		if (index >= 0 && index < this.#array.length) {
			this.#array.splice(index, 1);
			return true;
		}

		return false;
	}

	/**
	 * Removes the last element from the list and returns it.
	 * If the list is empty, undefined is returned and the list is not modified.
	 *
	 * @returns {E} The last item in the list or undefined.
	 */
	removeLast() {
		return this.#array.pop();
	}

	/**
	 * Removes the first element from the list and returns it.
	 * If the list is empty, undefined is returned and the list is not modified.
	 *
	 * @returns {E} The first item in the list or undefined.
	 */
	removeFirst() {
		return this.#array.shift();
	}

	/**
	 * Reverses the elements in the list in place.
	 * This method mutates the list and returns a reference to the same list.
	 *
	 * @returns {List<E>} The mutated list.
	 */
	reverse() {
		this.#array.reverse();

		return this;
	}

	/**
	 * Returns an iterable of keys (indices) in the list.
	 *
	 * @returns {IterableIterator<number>} An iterable of keys
	 */
	keys() {
		return this.#array.keys();
	}

	/**
	 * Returns an iterable of values (elements) in the list.
	 *
	 * @yields {IterableIterator<E>} An iterable of values
	 */
	*values() {
		yield* this.#array;
	}

	/**
	 * Returns an iterable of key (index), value (element) pairs for every entry in the list.
	 *
	 * @returns {IterableIterator<number, E>} An iterable of entries
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
		return this.#array.length === 0;
	}

	/**
	 * Returns a shallow copy of a portion of an list into a new list object.
	 *
	 * @returns {List<E>} A new list with the elements sliced from the original list.
	 */
	toArray() {
		return [...this.#array];
	}

	/**
	 * Returns a string representation of the list.
	 *
	 * @returns {string} A string representation of the list.
	 */
	toString() {
		return this.#array.toString();
	}

	/**
	 * Returns the primitive value of the list.
	 *
	 * @returns {Array<E>} The primitive value of the list.
	 */
	valueOf() {
		return this.#array.valueOf();
	}

	/**
	 * Returns the number of elements in the list.
	 *
	 * @returns {number} The number of elements in the list.
	 */
	get size() {
		return this.#array.length;
	}

	/**
	 * Allows instances of List to be used wherever an iterable is expected.
	 *
	 * @yields {IterableIterator<E>}
	 */
	*[Symbol.iterator]() {
		yield* this.#array;
	}

	/**
	 * Returns the string tag of the list.
	 * This property has the value "List".
	 *
	 * @returns {string} The string tag of the list.
	 */
	get [Symbol.toStringTag]() {
		return 'List';
	}
}

export default List;