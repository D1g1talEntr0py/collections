/**
 * A simple List class in ECMAScript. This class is based on the {@link Array} class.
 * The List class is a wrapper around the Array class and provides a more functional approach to working with arrays.
 * The List class is not meant to be a replacement for the Array class.
 */
export class List<E> {
	private readonly elements: Array<E> = [];

	/**
	 * Creates a new List from the shallow-copied array.
	 *
	 * @param {Array<E>} elements The initial elements in the list.
	 */
	constructor(elements: Array<E> = []) {
		this.elements = [ ...elements ];
	}

	/**
	 * Adds an element to the list.
	 * This method mutates the list and returns a reference to the same list.
	 *
	 * @param {E} element The element to add.
	 * @returns {List<E>} The updated list.
	 */
	add(element: E): List<E> {
		this.elements.push(element);

		return this;
	}

	/**
	 * Adds multiple elements to the list.
	 * This method mutates the list and returns a reference to the same list.
	 *
	 * @param {Array<E>} elements The elements to add.
	 * @returns {List<E>} The updated list.
	 */
	addAll(...elements: Array<E>): List<E> {
		this.elements.push(...elements);

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
	insert(index: number, element: E): List<E> {
		this.elements.splice(index, 0, element);

		return this;
	}

	/**
	 * Removes an element from the list.
	 *
	 * @param {E} element The element to remove.
	 * @returns {E} The element that was removed.
	 */
	remove(element: E): E | undefined {
		return this.removeAt(this.indexOf(element));
	}

	/**
	 * Removes an element at a specific index from the list.
	 *
	 * @param {number} index The index of the element to remove.
	 * @returns {E} The element that was removed.
	 */
	removeAt(index: number): E | undefined {
		if (index < 0 || this.elements.length <= index) {	throw new RangeError(`Index ${index} out of bounds.`) }

		return this.elements.splice(index, 1)[0];
	}

	/**
	 * Gets the element at a specific index in the list.
	 *
	 * @param {number} index The index of the element to get.
	 * @returns {E} The element at the given index.
	 */
	get(index: number): E | undefined {
		return this.elements[index];
	}

	/**
	 * Sets the value at the specified index.
	 * Replaces the element at the specified position in this list with the specified element.
	 *
	 * @param {number} index The index to set the value.
	 * @param {E} element The element to set.
	 * @returns {List<E>} The updated list.
	 */
	set(index: number, element: E): List<E> {
		if (index < 0 || this.elements.length <= index) {	throw new RangeError(`Index ${index} out of bounds.`) }

		this.elements.splice(index, 1, element);

		return this;
	}

	/**
	 * Returns the index of the first occurrence of the element in this list
	 *
	 * @param {E} element The element to search for.
	 * @param {number} [fromIndex=0] The index to start searching from.
	 * @returns {number} The index of the first occurrence of the specified element in this list, or -1 if this list does not contain the element.
	 */
	indexOf(element: E, fromIndex: number = 0): number {
		return this.elements.indexOf(element, fromIndex);
	}

	/**
	 * Returns the index of the last occurrence of the specified element in this list,
	 * or -1 if this list does not contain the element.
	 * More formally, returns the highest index i such that (element === this.get(i)),
	 * or -1 if there is no such index.
	 *
	 * @param {E} element The element to search for.
	 * @param {number} [fromIndex] The index to start searching from. If omitted, the search starts from the end of the list.
	 * @returns {number} The index of the last occurrence of the specified element in this list, or -1 if this list does not contain the element.
	 */
	lastIndexOf(element: E, fromIndex: number = this.elements.length - 1): number {
		return this.elements.lastIndexOf(element, fromIndex);
	}

	/**
	 * Removes the last element from the list and returns it.
	 * If the list is empty, null is returned and the list is not modified.
	 *
	 * @returns {E | null} The last element in the list or null.
	 */
	removeLast(): E | null {
		return this.elements.pop() ?? null;
	}

	/**
	 * Removes the first element from the list and returns it.
	 * If the list is empty, null is returned and the list is not modified.
	 *
	 * @returns {E | null} The first element in the list or null.
	 */
	removeFirst(): E | null {
		return this.elements.shift() ?? null;
	}

	/**
	 * Reverses the elements in the list in place.
	 * This method mutates the list and returns a reference to the same list.
	 *
	 * @returns {List<E>} The mutated list.
	 */
	reverse(): List<E> {
		this.elements.reverse();

		return this;
	}

	/**
	 * Checks if the list contains a specific element.
	 *
	 * @param {E} element The element to check for.
	 * @returns {boolean} `true` if the list contains the element, `false` otherwise.
	 */
	contains(element: E): boolean {
		return this.elements.includes(element);
	}

	/**
	 * Returns a new {@link List} with the elements from all the given lists.
	 * This method does not mutate the list.
	 *
	 * @param {Array<List<E>> | Array<E>} elements The lists to concatenate.
	 * @returns {List<E>} A new list with the elements from all the given lists.
	 */
	concat(...elements: List<E>[] | E[]): List<E> {
		const array = [ ...this.elements ];
		for (const element of elements) {
			if (element instanceof List) {
			  array.push(...element);
			} else {
			  array.push(element);
			}
		}

		return new List(array);
	}

	/**
	 * Adds all the elements of the list into a string, separated by the specified separator string.
	 *
	 * @param {string} [separator=','] A string used to separate one element of the list from the next in the resulting string.
	 * If omitted, the list elements are separated with a comma (",") by default. If separator is an empty string, all elements are joined without any characters in between them.
	 * @returns {string} A string with all the elements of the list joined. If the list has only one element, then that element will be returned without using the separator.
	 */
	join(separator: string = ','): string {
		return this.elements.join(separator);
	}

	/**
	 * Removes all elements from the list.
	 */
	clear(): void {
		this.elements.length = 0;
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
	every(predicate: (element: E, index: number | null, thisArg: unknown) => boolean, context?: unknown): boolean {
		return this.elements.every((element, index, thisArg) => predicate.call(context, element, index, thisArg), context);
	}

	/**
	 * Determines whether the specified callback function returns true for any element in the list.
	 *
	 * @param {function(E, number?, List<E>?): boolean} predicate A function that accepts up to three arguments. The some method calls
	 * the predicate function for each element in the list until the predicate returns a value
	 * which is coercible to the Boolean value true, or until the end of the list.
	 * @param {unknown} [context] An object to which the this keyword can refer in the predicate function. If context is omitted, undefined is used as the this value.
	 * @returns {boolean} true if any of the elements returns true from the predicate function, false otherwise.
	 */
	some(predicate: (element: E, index: number | null, thisArg: List<E> | null) => boolean, context?: List<E>): boolean {
		return this.elements.some((element, index) => predicate.call(context, element, index, this), context);
	}

	/**
	 * Returns the elements of the list that meet the condition specified in a predicate function.
	 * The method returns a new list with the elements that satisfy the condition.
	 *
	 * @param {function(E, number?, List<E>?): boolean} predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the list.
	 * @param {*} [context] An object to which the this keyword can refer in the predicate function. If context is omitted, undefined is used as the this value.
	 * @returns {List<E>} A new list of elements that satisfied the predicate condition.
	 */
	filter(predicate: (element: E, index: number | null, thisArg: List<E> | null) => boolean, context?: List<E>): List<E> {
		return new List(this.elements.filter((element, index) => predicate.call(context, element, index, this), context));
	}

	/**
	 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
	 *
	 * @param {function(E, number?, List<E>?): boolean} predicate find calls predicate once for each element of the array, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined.
	 * @param {*} [context] If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead.
	 * @returns {E} The element in the array.
	 */
	find(predicate: (element: E, index: number | null, thisArg: List<E> | null) => boolean, context?: List<E>): E | undefined {
		return this.elements.find((element, index) => predicate.call(context, element, index, this), context);
	}

	/**
	 * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
	 *
	 * @param {function(E, number?, List<E>?): boolean} predicate find calls predicate once for each element of the array, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found, findIndex immediately returns that element index. Otherwise, findIndex returns -1.
	 * @param {*} [context] If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead.
	 * @returns {number} The index found.
	 */
	findIndex(predicate: (element: E, index: number | null, thisArg: List<E> | null) => boolean, context?: List<E>): number {
		return this.elements.findIndex((element, index) => predicate.call(context, element, index, this), context);
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
	map(mapper: (element: E, index: number | null, thisArg: List<E> | null) => unknown, context?: unknown): List<unknown> {
		return new List(this.elements.map((element, index) => mapper.call(context, element, index, this), context));
	}

	/**
	 * Executes a user-supplied "reducer" callback function on each element of the list, in order,
	 * passing in the return value from the calculation on the preceding element. The final result
	 * of running the reducer across all elements of the list is a single value.
	 *
	 * @param {function(E, E, number, List<E>): *} reducer A function that accepts up to four arguments. The reduce method calls the reducer function one time for each element in the list.
	 * @param {*} [initialValue] If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an list value.
	 * @returns {*} The value that results from the reduction.
	 */
	reduce(reducer: (previousValue: E, currentValue: E, currentIndex: number, array: E[]) => E, initialValue: E): E {
		return this.elements.reduce(reducer, initialValue);
	}

	/**
	 * Returns a new list with the elements sorted.
	 * This method mutates the list and returns a reference to the same list.
	 *
	 * @example
	 * new List([50, 3, 20, 33, 9, 1]).sort(); // [1, 3, 9, 20, 33, 50]
	 *
	 * @param {function(E, E): number} [comparator] A function that defines the sort order. If omitted, the default (ascending order) comparator function will be used.
	 * @returns {List<E>} The sorted list.
	 */
	sort(comparator: (a: E, b: E) => number = (a: E, b: E) => typeof(a) === 'number' && typeof(b) === 'number' ? a - b : String(a).localeCompare(String(b))): List<E> {
		this.elements.sort(comparator);

		return this;
	}

	/**
	 * Performs the specified action for each element in an list.
	 *
	 * @param {function(E, number?, List<E>?): boolean} consumer A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
	 * @param {*} [context] An object to which the this keyword can refer in the consumer function. If context is omitted, this is used as the this value.
	 */
	forEach(consumer: (element: E, index: number | null, thisArg: List<E> | null) => boolean, context: List<E> = this): void {
		this.elements.forEach((element, index) => consumer(element, index, context));
	}

	/**
	 * Checks to see if the list is empty
	 *
	 * @returns {boolean} true if the list is empty, false otherwise.
	 */
	isEmpty(): boolean {
		return this.elements.length === 0;
	}

	/**
	 * Returns a shallow copy of the list into a new list.
	 *
	 * @returns {Array<E>} A new array that is a shallow copy of this list.
	 */
	toArray(): Array<E> {
		return [ ...this.elements ];
	}

	/**
	 * Returns the primitive value of the list.
	 *
	 * @returns {Object} The primitive value of the list.
	 */
	valueOf(): object {
		return this.elements.valueOf();
	}

	/**
	 * Returns the number of elements in the list.
	 *
	 * @returns {number} The number of elements in the list.
	 */
	get size(): number {
		return this.elements.length;
	}

	/**
	 * Returns an iterator for the keys in the list.
	 *
	 * @yields {IterableIterator<E>} An iterator for the keys in the list.
	 */
	*keys(): Generator<number, void, undefined> {
		yield* this.elements.keys();
	}

	/**
	 * Returns an iterator for the values in the list.
	 *
	 * @yields {IterableIterator<E>} An iterator for the values in the list.
	 */
	*values(): Generator<E, void, undefined> {
		yield* this.elements;
	}

	/**
	 * Returns an iterator for the entries in the list.
	 * Each entry is an array of [index, value].
	 *
	 * @yields {IterableIterator<Array<E>>} An iterator for the entries in the list.
	 */
	*entries(): Generator<[number, E], void, undefined> {
		yield* this.elements.entries();
	}

	/**
	 * Creates an iterator for the elements in the list.
	 * @yields {IterableIterator<E>} An iterator for the elements in the list.
	 */
	*[Symbol.iterator](): Generator<E, void, undefined> {
		yield* this.elements;
	}

	/**
	 * Returns a string representation of the list.
	 *
	 * @returns {string} A string representation of the list.
	 */
	toString(): string {
		return this.elements.toString();
	}

	/**
	 * Returns the string tag of the list.
	 * This property has the value "List".
	 *
	 * @returns {string} The string tag of the list.
	 */
	get [Symbol.toStringTag](): string {
		return 'List';
	}
}