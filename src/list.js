/**
 * @template E
 * @type {List<E>} The list class.
 * A simple List class in ECMAScript.
 */
class List {
	/** @type {Array<E>} */
	#items = [];

	/**
	 * Creates a new List.
	 *
	 * @param {Array<E>} items - The initial items in the list.
	 */
	constructor(items = []) {
		this.#items = [...items];
	}

	/**
	 * Adds an item to the list.
	 * This method mutates the list and returns a reference to the same list.
	 *
	 * @param {E} item - The item to add.
	 * @returns {List<E>} The updated list.
	 */
	add(item) {
		this.#items.push(item);

		return this;
	}

	/**
	 * Adds multiple items to the list.
	 * This method mutates the list and returns a reference to the same list.
	 *
	 * @param {E[]} items - The items to add.
	 * @returns {List<E>} The updated list.
	 */
	addAll(...items) {
		this.#items.push(...items);

		return this;
	}

	/**
	 * Inserts the specified element at the specified position in this list.
	 * Shifts the element currently at that position (if any) and any subsequent
	 *
	 * @param {number} index The index to insert the new element.
	 * @param {E} element The entry to add to the list.
	 * @returns {List<E>} The updated list.
	 */
	insert(index, element) {
		this.#items.splice(index, 0, element);
	}

	/**
	 * Removes an item from the list.
	 *
	 * @param {E} item - The item to remove.
	 * @returns {boolean} - True if the item was removed, false otherwise.
	 */
	remove(item) {
		return this.removeAt(this.#items.indexOf(item));
	}

	/**
	 * Removes an item at a specific index from the list.
	 *
	 * @param {number} index - The index of the item to remove.
	 * @returns {boolean} - True if the item was removed, false otherwise.
	 */
	removeAt(index) {
		if (index >= 0 && index < this.#items.length) {
			this.#items.splice(index, 1);
			return true;
		}

		return false;
	}

	/**
	 * Gets the item at a specific index in the list.
	 *
	 * @param {number} index - The index of the item to get.
	 * @return {E} - The item at the given index.
	 */
	get(index) {
		return this.#items[index];
	}

	/**
	 * Sets the value at the specified index.
	 * Replaces the element at the specified position in this list with the specified element.
	 *
	 * @param {number} index The index to set the value.
	 * @param {E} element The element to set.
	 * @returns {List<E>} The updated list.
	 */
	set(index, element) {
		if (index < 0 || index >= this.#items.length) { throw new Error('Index out of bounds') }

		this.#items.splice(index, 1, element);

		return this;
	}

	/**
	 * Returns the number of elements in this list.
	 * If this list contains more than Number.MAX_SAFE_INTEGER elements, returns Number.MAX_SAFE_INTEGER.
	 *
	 * @param {E} item The item to search for.
	 * @param {number} [fromIndex=0] The index to start searching from.
	 * @returns {number} The number of elements in this list.
	 */
	indexOf(item, fromIndex = 0) {
		return this.#items.indexOf(item, fromIndex);
	}

	/**
	 * Returns the index of the last occurrence of the specified element in this list,
	 * or -1 if this list does not contain the element.
	 * More formally, returns the highest index i such that (element === this.get(i)),
	 * or -1 if there is no such index.
	 *
	 * @param {E} item The item to search for.
	 * @param {number} [fromIndex=this.#items.length - 1] The index to start searching from.
	 * @returns {number} The index of the last occurrence of the specified element in this list, or -1 if this list does not contain the element.
	 */
	lastIndexOf(item, fromIndex = this.#items.length - 1) {
		return this.#items.lastIndexOf(item, fromIndex);
	}

	/**
	 * Removes the last element from the list and returns it.
	 * If the list is empty, undefined is returned and the list is not modified.
	 *
	 * @returns {E} The last item in the list or undefined.
	 */
	removeLast() {
		return this.#items.pop();
	}

	/**
	 * Removes the first element from the list and returns it.
	 * If the list is empty, undefined is returned and the list is not modified.
	 *
	 * @returns {E} The first item in the list or undefined.
	 */
	removeFirst() {
		return this.#items.shift();
	}

	/**
	 * Reverses the elements in the list in place.
	 * This method mutates the list and returns a reference to the same list.
	 *
	 * @returns {List<E>} The mutated list.
	 */
	reverse() {
		this.#items.reverse();

		return this;
	}

	/**
	 * Checks if the list contains a specific item.
	 *
	 * @param {E} item - The item to check for.
	 * @return {boolean} - True if the list contains the item, false otherwise.
	 */
	contains(item) {
		return this.#items.includes(item);
	}

	/**
	 * Removes all items from the list.
	 */
	clear() {
		this.#items.length = 0;
	}

	/**
	 * Determines whether all the members of an list satisfy the specified test.
	 *
	 * @param {function(E, number?, List<E>?): boolean} predicate A function that accepts up to three arguments. The every method calls
	 * the predicate function for each element in the list until the predicate returns a value
	 * which is coercible to the {@link Boolean} value false, or until the end of the list.
	 * @param {*} [context] An object to which the this keyword can refer in the predicate function. If context is omitted, undefined is used as the this value.
	 * @returns {boolean} true if all elements satisfy the specified test, false otherwise.
	 */
	every(predicate, context) {
		return this.#items.every((element, index) => predicate.apply(context, [element, index, this.#items]), context);
	}

	/**
	 * Determines whether the specified callback function returns true for any element in the list.
	 *
	 * @param {function(E, number?, List<E>?): boolean} predicate A function that accepts up to three arguments. The some method calls
	 * the predicate function for each element in the list until the predicate returns a value
	 * which is coercible to the Boolean value true, or until the end of the list.
	 * @param {*} [context] An object to which the this keyword can refer in the predicate function. If context is omitted, undefined is used as the this value.
	 * @returns {boolean} true if any of the elements returns true from the predicate function, false otherwise.
	 */
	some(predicate, context) {
		return this.#items.some((element, index) => predicate.apply(context, [element, index, this.#items]), context);
	}

	/**
	 * Returns the elements of the list that meet the condition specified in a predicate function.
	 * The method returns a new list with the elements that satisfy the condition.
	 *
	 * @param {function(E, number?, List<E>?): boolean} predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the list.
	 * @param {*} [context] An object to which the this keyword can refer in the predicate function. If context is omitted, undefined is used as the this value.
	 * @returns {List<E>} A new list of elements that satisfied the predicate condition.
	 */
	filter(predicate, context) {
		return new List(this.#items.filter((element, index) => predicate.apply(context, [element, index, this.#items]), context));
	}

	/**
	 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
	 *
	 * @param {function(E, number?, List<E>?): boolean} predicate find calls predicate once for each element of the array, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined.
	 * @param {*} [context] If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead.
	 * @returns {E} The element in the array.
	 */
	find(predicate, context) {
		return this.#items.find((element, index) => predicate.apply(context, [element, index, this.#items]), context);
	}

	/**
	 * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
	 *
	 * @param {function(E, number?, List<E>?): boolean} predicate find calls predicate once for each element of the array, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found, findIndex immediately returns that element index. Otherwise, findIndex returns -1.
	 * @param {*} [context] If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead.
	 * @returns {number} The index found.
	 */
	findIndex(predicate, context) {
		return this.#items.findIndex((element, index) => predicate.apply(context, [element, index, this.#items]), context);
	}

	/**
	 * Calls a defined callback function on each element of the list, and returns a list that contains the results.
	 * The callback function is called with up to three arguments: the value of the element, the index of the element,
	 * and the list object being traversed. If a thisArg parameter is provided, it will be used as the this value for each invocation of the callback.
	 * The map method does not mutate the list on which it is called (although callback, if invoked, may do so).
	 *
	 * @param {function(E, number?, List<E>?): *} mapper A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
	 * @param {*} [context] An object to which the this keyword can refer in the callbackfn function. If context is omitted, undefined is used as the this value.
	 * @returns {List<*>} A new list with each element being the result of the callback function.
	 */
	map(mapper, context) {
		return new List(this.#items.map((element, index) => mapper.apply(context, [element, index, this.#items]), context));
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
		return this.#items.reduce(reducer, initialValue);
	}

	/**
	 * Sorts the elements of a list in place and returns the reference to the same list, now sorted.
	 * The default sort order is ascending, built upon converting the elements into strings,
	 * then comparing their sequences of UTF-16 code units values.
	 *
	 * @example
	 * // returns
	 * new List([50, 3, 20, 33, 9, 1]).sort();
	 * @param {function(E, E): number} [comparator] A function that defines the sort order. If omitted, the list elements are converted to strings, then sorted according to each character's Unicode code point value.
	 * @returns {void}
	 */
	sort(comparator) {
		this.#items.sort(comparator);
	}

	/**
	 * Performs the specified action for each element in an list.
	 *
	 * @param {function(E, number?, List<E>?): boolean} consumer A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
	 * @param {*} [context] An object to which the this keyword can refer in the consumer function. If context is omitted, this is used as the this value.
	 */
	forEach(consumer, context = this) {
		this.#items.forEach((element, index) => consumer(element, index, context));
	}

	/**
	 * Checks to see if the list is empty
	 *
	 * @returns {boolean} true if the list is empty, false otherwise.
	 */
	isEmpty() {
		return this.#items.length === 0;
	}

	/**
	 * Returns a shallow copy of a portion of an list into a new list object.
	 *
	 * @returns {List<E>} A new list with the elements sliced from the original list.
	 */
	toArray() {
		return [...this.#items];
	}

	/**
	 * Returns the primitive value of the list.
	 *
	 * @returns {Array<E>} The primitive value of the list.
	 */
	valueOf() {
		return this.#items.valueOf();
	}

	/**
	 * Returns the number of elements in the list.
	 *
	 * @returns {number} The number of elements in the list.
	 */
	get size() {
		return this.#items.length;
	}

	/**
	 * Returns an iterator for the keys in the list.
	 *
	 * @returns {Generator<number>} An iterator for the keys in the list.
	 */
	*keys() {
		for (let index = 0, length = this.#items.length; index < length; index++) {
			yield index;
		}
	}

	/**
	 * Returns an iterator for the values in the list.
	 *
	 * @returns {Generator<E>} An iterator for the values in the list.
	 */
	*values() {
		for (let item of this.#items) {
			yield item;
		}
	}

	/**
	 * Returns an iterator for the entries in the list.
	 * Each entry is an array of [index, value].
	 *
	 * @returns {Generator<Array>} An iterator for the entries in the list.
	 */
	*entries() {
		for (let index = 0, length = this.#items.length; index < length; index++) {
			yield [index, this.#items[index]];
		}
	}

	/**
	 * Creates an iterator for the items in the list.
	 * @return {Generator} - An iterator for the items in the list.
	 */
	*[Symbol.iterator]() {
		for (const item of this.#items) {
			yield item;
		}
	}

	/**
	 * Returns a string representation of the list.
	 * @return {string} - A string representation of the list.
	 */
	toString() {
		return this.#items.toString();
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