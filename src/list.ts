type Predicate<E> = (element: E, index: number, array: E[]) => boolean;
type Mapper<E, R> = (element: E, index: number, array: E[]) => R;
type Reducer<E, R> = (previousValue: R, currentValue: E, currentIndex: number, array: E[]) => R;
type Comparator<E> = (a: E, b: E) => number;
type Consumer<E> = (element: E, index: number, array: E[]) => void;

/**
 * A simple List class in ECMAScript based on the {@link Array} class.
 * The List class wraps an array and provides a fluent collection API while retaining array-style functional methods.
 * The List class is not meant to be a replacement for the Array class.
 */
export class List<E> {
	#elements: Array<E> = [];

	/**
	 * Creates a new List from the shallow-copied array.
	 * @param elements The initial elements in the list.
	 */
	constructor(elements: Array<E> = []) {
		this.#elements = [ ...elements ];
	}

	/**
	 * Adds an element to the list.
	 * This method mutates the list and returns a reference to the same list.
	 * @param element The element to add.
	 * @returns The updated list.
	 */
	add(element: E): List<E> {
		this.#elements.push(element);

		return this;
	}

	/**
	 * Adds multiple elements to the list.
	 * This method mutates the list and returns a reference to the same list.
	 * @param elements The elements to add.
	 * @returns The updated list.
	 */
	addAll(...elements: Array<E>): List<E> {
		this.#elements.push(...elements);

		return this;
	}

	/**
	 * Inserts the specified element at the specified position in this list.
	 * Shifts the element currently at that position (if any) and any subsequent.
	 * @param index The index to insert the new element.
	 * @param element The entry to add to the list.
	 * @returns The updated list.
	 */
	insert(index: number, element: E): List<E> {
		this.#elements.splice(index, 0, element);

		return this;
	}

	/**
	 * Removes an element from the list.
	 * @param element The element to remove.
	 * @returns The element that was removed.
	 */
	remove(element: E): E | undefined {
		return this.removeAt(this.indexOf(element));
	}

	/**
	 * Removes an element at a specific index from the list.
	 * @param index The index of the element to remove.
	 * @returns The element that was removed.
	 */
	removeAt(index: number): E | undefined {
		if (index < 0 || this.#elements.length <= index) { throw new RangeError(`Index ${index} out of bounds.`) }

		return this.#elements.splice(index, 1)[0];
	}

	/**
	 * Gets the element at a specific index in the list.
	 * @param index The index of the element to get.
	 * @returns The element at the given index.
	 */
	get(index: number): E | undefined {
		return this.#elements[index];
	}

	/**
	 * Sets the value at the specified index.
	 * Replaces the element at the specified position in this list with the specified element.
	 * @param index The index to set the value.
	 * @param element The element to set.
	 * @returns The updated list.
	 */
	set(index: number, element: E): List<E> {
		if (index < 0 || this.#elements.length <= index) { throw new RangeError(`Index ${index} out of bounds.`) }

		this.#elements[index] = element;

		return this;
	}

	/**
	 * Returns the index of the first occurrence of the element in this list.
	 * @param element The element to search for.
	 * @param [fromIndex=0] The index to start searching from.
	 * @returns The index of the first occurrence of the specified element in this list, or -1 if this list does not contain the element.
	 */
	indexOf(element: E, fromIndex: number = 0): number {
		return this.#elements.indexOf(element, fromIndex);
	}

	/**
	 * Returns the index of the last occurrence of the specified element in this list,
	 * or -1 if this list does not contain the element.
	 * More formally, returns the highest index i such that (element === this.get(i)),
	 * or -1 if there is no such index.
	 * @param element The element to search for.
	 * @param [fromIndex] The index to start searching from. If omitted, the search starts from the end of the list.
	 * @returns The index of the last occurrence of the specified element in this list, or -1 if this list does not contain the element.
	 */
	lastIndexOf(element: E, fromIndex: number = this.#elements.length - 1): number {
		return this.#elements.lastIndexOf(element, fromIndex);
	}

	/**
	 * Removes the last element from the list and returns it.
	 * If the list is empty, null is returned and the list is not modified.
	 * @returns The last element in the list or null.
	 */
	removeLast(): E | null {
		return this.#elements.pop() ?? null;
	}

	/**
	 * Removes the first element from the list and returns it.
	 * If the list is empty, null is returned and the list is not modified.
	 * @returns The first element in the list or null.
	 */
	removeFirst(): E | null {
		return this.#elements.shift() ?? null;
	}

	/**
	 * Reverses the elements in the list in place.
	 * This method mutates the list and returns a reference to the same list.
	 * @returns The mutated list.
	 */
	reverse(): List<E> {
		this.#elements.reverse();

		return this;
	}

	/**
	 * Checks if the list contains a specific element.
	 * @param element The element to check for.
	 * @returns `true` if the list contains the element, `false` otherwise.
	 */
	contains(element: E): boolean {
		return this.#elements.includes(element);
	}

	/**
	 * Returns a new {@link List} with the elements from all the given lists and values.
	 * This method does not mutate the list.
	 * @param elements The lists and values to concatenate.
	 * @returns A new list with the elements from all the given lists and values.
	 */
	concat(...elements: Array<E | List<E>>): List<E> {
		return List.#newInstance(this.#elements.concat(...elements.map(List.#concatMapper<E>)));
	}

	/**
	 * Adds all the elements of the list into a string, separated by the specified separator string.
	 * @param [separator=','] A string used to separate one element of the list from the next in the resulting string.
	 * If omitted, the list elements are separated with a comma (",") by default. If separator is an empty string, all elements are joined without any characters in between them.
	 * @returns A string with all the elements of the list joined. If the list has only one element, then that element will be returned without using the separator.
	 */
	join(separator: string = ','): string {
		return this.#elements.join(separator);
	}

	/** Removes all elements from the list. */
	clear(): void {
		this.#elements.length = 0;
	}

	/**
	 * Determines whether all the members of an list satisfy the specified test.
	 * @param predicate A function that receives the element, its index, and the list's backing array.
	 * The every method calls the predicate for each element until it returns false or until the end of the list.
	 * @param [context] The value to use as `this` when invoking the predicate. If omitted, `undefined` is used.
	 * @returns `true` if all elements satisfy the specified test, `false` otherwise.
	 */
	every(predicate: Predicate<E>, context?: unknown): boolean {
		return this.#elements.every(predicate, context);
	}

	/**
	 * Determines whether the specified callback function returns true for any element in the list.
	 * @param predicate A function that receives the element, its index, and the list's backing array.
	 * The some method calls the predicate for each element until it returns true or until the end of the list.
	 * @param [context] The value to use as `this` when invoking the predicate. If omitted, `undefined` is used.
	 * @returns `true` if any element satisfies the predicate, `false` otherwise.
	 */
	some(predicate: Predicate<E>, context?: unknown): boolean {
		return this.#elements.some(predicate, context);
	}

	/**
	 * Returns the elements of the list that meet the condition specified in a predicate function.
	 * The method returns a new list with the elements that satisfy the condition.
	 * @param predicate A function that receives the element, its index, and the list's backing array.
	 * @param [context] The value to use as `this` when invoking the predicate. If omitted, `undefined` is used.
	 * @returns A new list of elements that satisfied the predicate condition.
	 */
	filter(predicate: Predicate<E>, context?: unknown): List<E> {
		return List.#newInstance(this.#elements.filter(predicate, context));
	}

	/**
	 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
	 * @param predicate find calls predicate once for each element of the list, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined.
	 * @param [context] The value to use as `this` when invoking the predicate. If omitted, `undefined` is used.
	 * @returns The element in the array.
	 */
	find(predicate: Predicate<E>, context?: unknown): E | undefined {
		return this.#elements.find(predicate, context);
	}

	/**
	 * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
	 * @param predicate findIndex calls predicate once for each element of the list, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found, findIndex immediately returns that element index. Otherwise, findIndex returns -1.
	 * @param [context] The value to use as `this` when invoking the predicate. If omitted, `undefined` is used.
	 * @returns The index found.
	 */
	findIndex(predicate: Predicate<E>, context?: unknown): number {
		return this.#elements.findIndex(predicate, context);
	}

	/**
	 * Calls a defined callback function on each element of the list, and returns a list that contains the results.
	 * The callback receives the element, its index, and the list's backing array. If a context is provided, it is used as the this value for each invocation.
	 * The map method does not mutate the list on which it is called (although the callback may do so).
	 * @param mapper A function that returns the mapped value for each element.
	 * @param [context] The value to use as `this` when invoking the mapper. If omitted, `undefined` is used.
	 * @returns A new list containing the mapped values.
	 */
	map<R>(mapper: Mapper<E, R>, context?: unknown): List<R> {
		return List.#newInstance(this.#elements.map(mapper, context));
	}

	/**
	 * Executes a user-supplied "reducer" callback function on each element of the list, in order,
	 * passing in the return value from the calculation on the preceding element. The final result
	 * of running the reducer across all elements of the list is a single value.
	 * @param reducer A function that receives the accumulated value, the current element, its index, and the list's backing array.
	 * @param initialValue The initial value for the accumulation.
	 * @returns The value that results from the reduction.
	 */
	reduce<R>(reducer: Reducer<E, R>, initialValue: R): R {
		return this.#elements.reduce(reducer, initialValue);
	}

	/**
	 * Returns a new list with the elements sorted.
	 * This method mutates the list and returns a reference to the same list.
	 * @example
	 * new List([50, 3, 20, 33, 9, 1]).sort(); // [1, 3, 9, 20, 33, 50]
	 * @param [comparator] A function that defines the sort order. If omitted, the default (ascending order) comparator function will be used.
	 * @returns The sorted list.
	 */
	sort(comparator: Comparator<E> = List.#defaultComparator): List<E> {
		this.#elements.sort(comparator);

		return this;
	}

	/**
	 * Performs the specified action for each element in an list.
	 * @param consumer A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
	 * @param [context] The value to use as `this` when invoking the consumer. If omitted, `undefined` is used.
	 */
	forEach(consumer: Consumer<E>, context?: unknown): void {
		this.#elements.forEach(consumer, context);
	}

	/**
	 * Checks to see if the list is empty.
	 * @returns true if the list is empty, false otherwise.
	 */
	isEmpty(): boolean {
		return this.#elements.length === 0;
	}

	/**
	 * Returns a shallow copy of the list into a new list.
	 * @returns A new array that is a shallow copy of this list.
	 */
	toArray(): E[] {
		return [ ...this.#elements ];
	}

	/**
	 * Returns the primitive value of the list.
	 * @returns The primitive value of the list.
	 */
	valueOf(): object {
		return this.#elements.valueOf();
	}

	/**
	 * Returns the number of elements in the list.
	 * @returns The number of elements in the list.
	 */
	get size(): number {
		return this.#elements.length;
	}

	/**
	 * Returns an iterator for the keys in the list.
	 * @returns An iterator for the keys in the list.
	 */
	keys(): ArrayIterator<number> {
		return this.#elements.keys();
	}

	/**
	 * Returns an iterator for the values in the list.
	 * @returns An iterator for the values in the list.
	 */
	values(): ArrayIterator<E> {
		return this.#elements.values();
	}

	/**
	 * Returns an iterator for the entries in the list.
	 * Each entry is an array of [index, value].
	 * @returns An iterator for the entries in the list.
	 */
	entries(): ArrayIterator<[number, E]> {
		return this.#elements.entries();
	}

	/**
	 * Creates an iterator for the elements in the list.
	 * @returns An iterator for the elements in the list.
	 */
	[Symbol.iterator](): ArrayIterator<E> {
		return this.#elements[Symbol.iterator]();
	}

	/**
	 * Returns a string representation of the list.
	 * @returns A string representation of the list.
	 */
	toString(): string {
		return this.#elements.toString();
	}

	/**
	 * Returns the string tag of the list.
	 * This property has the value "List".
	 * @returns The string tag of the list.
	 */
	get [Symbol.toStringTag](): string {
		return 'List';
	}

	/**
	 * A default comparator function that compares two elements of the list.
	 * @param a The first element to compare.
	 * @param b The second element to compare.
	 * @returns A negative number if a < b, zero if a === b, a positive number if a > b.
	 */
	static #defaultComparator<E>(a: E, b: E): number {
		return typeof(a) === 'number' && typeof(b) === 'number' ? a - b : String(a).localeCompare(String(b));
	}

	/**
	 * Creates a list that takes ownership of an internally allocated array.
	 * @param elements The internally allocated elements.
	 * @returns A list backed by the provided array.
	 */
	static #newInstance<E>(elements: Array<E>): List<E> {
		const list = new List<E>();
		list.#elements = elements;

		return list;
	}

	/**
	 * A helper function that maps an element to an array of elements.
	 * If the element is a List, it returns the elements of the List as an array.
	 * If the element is not a List, it returns an array with the element as its only item.
	 * @param element The element to map.
	 * @returns An array of elements.
	 */
	static #concatMapper<E>(element: E | List<E>): E[] {
		return element instanceof List ? element.#elements : [ element ];
	}
}