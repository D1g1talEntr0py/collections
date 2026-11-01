import { naturalComparator } from './internal/comparator';

type Predicate<E> = (element: E, index: number, list: List<E>) => boolean;
type Mapper<E, R> = (element: E, index: number, list: List<E>) => R;
type Reducer<E, R> = (previousValue: R, currentValue: E, currentIndex: number, list: List<E>) => R;
type Comparator<E> = (a: E, b: E) => number;
type Consumer<E> = (element: E, index: number, list: List<E>) => void;

/**
 * A simple List class in ECMAScript based on the {@link Array} class.
 * The List class wraps an array and provides a fluent collection API while retaining array-style functional methods.
 * The List class is not meant to be a replacement for the Array class.
 */
export class List<E> {
	#elements: Array<E>;

	/**
	 * Creates a new List from the shallow-copied array.
	 * @param elements The initial elements in the list.
	 */
	constructor(elements: Iterable<E> = []) {
		this.#elements = Array.from(elements);
	}

	/**
	 * Adds an element to the list.
	 * This method mutates the list and returns a reference to the same list.
	 * @param element The element to add.
	 * @returns The updated list.
	 */
	add(element: E): this {
		this.#elements.push(element);

		return this;
	}

	/**
	 * Adds multiple elements to the list.
	 * This method mutates the list and returns a reference to the same list.
	 * @param elements The elements to add.
	 * @returns The updated list.
	 */
	addAll(...elements: Array<E>): this {
		for (const element of elements) { this.#elements.push(element) }

		return this;
	}

	/**
	 * Adds all elements from an iterable to the list.
	 * This method supports large or streaming inputs without expanding them into function arguments.
	 * @param elements The iterable whose elements to add.
	 * @returns The updated list.
	 */
	addAllFrom(elements: Iterable<E>): this {
		for (const element of elements) { this.#elements.push(element) }

		return this;
	}

	/**
	 * Inserts the specified element at the specified position in this list.
	 * Shifts the element currently at that position (if any) and any subsequent.
	 * @param index The index to insert the new element.
	 * @param element The entry to add to the list.
	 * @returns The updated list.
	 */
	insert(index: number, element: E): this {
		if (index < 0 || index > this.#elements.length) { throw new RangeError(`Index ${index} out of bounds.`) }

		this.#elements.splice(index, 0, element);

		return this;
	}

	/**
	 * Removes an element from the list.
	 * @param element The element to remove.
	 * @returns The element that was removed.
	 */
	remove(element: E): E | undefined {
		const index = this.indexOf(element);

		return index === -1 ? undefined : this.removeAt(index);
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
	set(index: number, element: E): this {
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
	 * If the list is empty, undefined is returned and the list is not modified.
	 * @returns The last element in the list or undefined.
	 */
	removeLast(): E | undefined {
		return this.#elements.pop();
	}

	/**
	 * Removes the first element from the list and returns it.
	 * If the list is empty, undefined is returned and the list is not modified.
	 * @returns The first element in the list or undefined.
	 */
	removeFirst(): E | undefined {
		return this.#elements.shift();
	}

	/**
	 * Reverses the elements in the list in place.
	 * This method mutates the list and returns a reference to the same list.
	 * @returns The mutated list.
	 */
	reverse(): this {
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
	 * Returns the element at the given index, counting from the end when the index is negative.
	 * @param index The index of the element to return.
	 * @returns The element at the index, or undefined if the index is out of range.
	 */
	at(index: number): E | undefined {
		return this.#elements.at(index);
	}

	/**
	 * Returns a new list containing the elements within the given range.
	 * @param start The zero-based index at which to begin, or an offset from the end when negative.
	 * @param end The zero-based index before which to end, or an offset from the end when negative.
	 * @returns A new list containing the selected elements.
	 */
	slice(start?: number, end?: number): List<E> {
		return List.#newInstance(this.#elements.slice(start, end));
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

	/**
	 * Removes all elements from the list.
	 * @returns This list.
	 */
	clear(): this {
		this.#elements.length = 0;

		return this;
	}

	/**
	 * Determines whether all the members of an list satisfy the specified test.
	 * @param predicate A function that receives the element, its index, and this list.
	 * The every method calls the predicate for each element until it returns false or until the end of the list.
	 * @param [context] The value to use as `this` when invoking the predicate. If omitted, `undefined` is used.
	 * @returns `true` if all elements satisfy the specified test, `false` otherwise.
	 */
	every(predicate: Predicate<E>, context?: unknown): boolean {
		const elements = this.#elements;

		for (let index = 0, length = elements.length; index < length && index < elements.length; index++) {
			if (!predicate.call(context, elements[index] as E, index, this)) { return false }
		}

		return true;
	}

	/**
	 * Determines whether the specified callback function returns true for any element in the list.
	 * @param predicate A function that receives the element, its index, and this list.
	 * The some method calls the predicate for each element until it returns true or until the end of the list.
	 * @param [context] The value to use as `this` when invoking the predicate. If omitted, `undefined` is used.
	 * @returns `true` if any element satisfies the predicate, `false` otherwise.
	 */
	some(predicate: Predicate<E>, context?: unknown): boolean {
		const elements = this.#elements;

		for (let index = 0, length = elements.length; index < length && index < elements.length; index++) {
			if (predicate.call(context, elements[index] as E, index, this)) { return true }
		}

		return false;
	}

	/**
	 * Returns the elements of the list that meet the condition specified in a predicate function.
	 * The method returns a new list with the elements that satisfy the condition.
	 * @param predicate A function that receives the element, its index, and this list.
	 * @param [context] The value to use as `this` when invoking the predicate. If omitted, `undefined` is used.
	 * @returns A new list of elements that satisfied the predicate condition.
	 */
	filter(predicate: Predicate<E>, context?: unknown): List<E> {
		const elements = this.#elements;
		const result: E[] = [];

		for (let index = 0, length = elements.length; index < length && index < elements.length; index++) {
			const element = elements[index] as E;

			if (predicate.call(context, element, index, this)) { result.push(element) }
		}

		return List.#newInstance(result);
	}

	/**
	 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
	 * @param predicate find calls predicate once for each element of the list, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined.
	 * @param [context] The value to use as `this` when invoking the predicate. If omitted, `undefined` is used.
	 * @returns The element in the array.
	 */
	find(predicate: Predicate<E>, context?: unknown): E | undefined {
		const elements = this.#elements;

		for (let index = 0, length = elements.length; index < length; index++) {
			const element = elements[index] as E;

			if (predicate.call(context, element, index, this)) { return element }
		}

		return undefined;
	}

	/**
	 * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
	 * @param predicate findIndex calls predicate once for each element of the list, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found, findIndex immediately returns that element index. Otherwise, findIndex returns -1.
	 * @param [context] The value to use as `this` when invoking the predicate. If omitted, `undefined` is used.
	 * @returns The index found.
	 */
	findIndex(predicate: Predicate<E>, context?: unknown): number {
		const elements = this.#elements;

		for (let index = 0, length = elements.length; index < length; index++) {
			if (predicate.call(context, elements[index] as E, index, this)) { return index }
		}

		return -1;
	}

	/**
	 * Returns the last element that satisfies the predicate, or undefined if none does.
	 * @param predicate A function that receives the element, its index, and this list.
	 * @param context The value to use as `this` when invoking the predicate.
	 * @returns The last matching element, or undefined.
	 */
	findLast(predicate: Predicate<E>, context?: unknown): E | undefined {
		const elements = this.#elements;

		for (let index = elements.length - 1; index >= 0; index--) {
			const element = elements[index] as E;

			if (predicate.call(context, element, index, this)) { return element }
		}

		return undefined;
	}

	/**
	 * Returns the index of the last element that satisfies the predicate, or -1 if none does.
	 * @param predicate A function that receives the element, its index, and this list.
	 * @param context The value to use as `this` when invoking the predicate.
	 * @returns The last matching index, or -1.
	 */
	findLastIndex(predicate: Predicate<E>, context?: unknown): number {
		const elements = this.#elements;

		for (let index = elements.length - 1; index >= 0; index--) {
			if (predicate.call(context, elements[index] as E, index, this)) { return index }
		}

		return -1;
	}

	/**
	 * Calls a defined callback function on each element of the list, and returns a list that contains the results.
	 * The callback receives the element, its index, and this list. If a context is provided, it is used as the this value for each invocation.
	 * The map method does not mutate the list on which it is called (although the callback may do so).
	 * @param mapper A function that returns the mapped value for each element.
	 * @param [context] The value to use as `this` when invoking the mapper. If omitted, `undefined` is used.
	 * @returns A new list containing the mapped values.
	 */
	map<R>(mapper: Mapper<E, R>, context?: unknown): List<R> {
		const elements = this.#elements;
		const length = elements.length;
		const result = new Array<R>(length);

		for (let index = 0; index < length && index < elements.length; index++) {
			result[index] = mapper.call(context, elements[index] as E, index, this);
		}

		return List.#newInstance(result);
	}

	/**
	 * Maps each element to a value or array of values, then flattens the results by one level.
	 * @param mapper A function that receives the element, its index, and this list.
	 * @param context The value to use as `this` when invoking the mapper.
	 * @returns A new list containing the mapped values flattened by one level.
	 */
	flatMap<R>(mapper: (element: E, index: number, list: List<E>) => R | ReadonlyArray<R>, context?: unknown): List<R> {
		const elements = this.#elements;
		const result: R[] = [];

		for (let index = 0, length = elements.length; index < length && index < elements.length; index++) {
			const mapped = mapper.call(context, elements[index] as E, index, this);

			if (Array.isArray(mapped)) {
				for (let inner = 0, innerLength = mapped.length; inner < innerLength; inner++) {
					if (inner in mapped) { result.push(mapped[inner] as R) }
				}
			} else {
				result.push(mapped as R);
			}
		}

		return List.#newInstance(result);
	}

	/**
	 * Executes a user-supplied "reducer" callback function on each element of the list, in order,
	 * passing in the return value from the calculation on the preceding element. The final result
	 * of running the reducer across all elements of the list is a single value.
	 * Without an initial value, an empty list throws a RangeError. Native Array.reduce throws a TypeError in this case.
	 * @param reducer A function that receives the accumulated value, the current element, its index, and this list.
	 * @param initialValue The initial value for the accumulation.
	 * @returns The value that results from the reduction.
	 */
	reduce(reducer: Reducer<E, E>): E;
	reduce<R>(reducer: Reducer<E, R>, initialValue: R): R;
	reduce<R>(reducer: Reducer<E, R>, initialValue?: R): R {
		const elements = this.#elements;
		const length = elements.length;
		let previousValue = initialValue as R;
		let index = 0;

		if (arguments.length === 1) {
			if (length === 0) { throw new RangeError('Reduce of empty list with no initial value.') }

			previousValue = elements[index++] as R;
		}

		for (; index < length && index < elements.length; index++) {
			previousValue = reducer(previousValue, elements[index] as E, index, this);
		}

		return previousValue;
	}

	/**
	 * Removes every element that satisfies the predicate.
	 * @param predicate A function that receives the element, its index, and this list.
	 * @param context The value to use as `this` when invoking the predicate.
	 * @returns The number of removed elements.
	 */
	removeIf(predicate: Predicate<E>, context?: unknown): number {
		const elements = this.#elements;
		const previousLength = elements.length;
		const remaining: E[] = [];

		for (let index = 0; index < previousLength && index < elements.length; index++) {
			const element = elements[index] as E;

			if (!predicate.call(context, element, index, this)) { remaining.push(element) }
		}

		const remainingLength = remaining.length;

		for (let index = 0; index < remainingLength; index++) { elements[index] = remaining[index] as E }

		elements.length = remainingLength;

		return previousLength - remainingLength;
	}

	/**
	 * Returns a new list with the elements sorted.
	 * This method mutates the list and returns a reference to the same list.
	 * @example
	 * new List([50, 3, 20, 33, 9, 1]).sort(); // [1, 3, 9, 20, 33, 50]
	 * @param [comparator] A function that defines the sort order. If omitted, the default (ascending order) comparator function will be used.
	 * @returns The sorted list.
	 */
	sort(comparator: Comparator<E> = naturalComparator): this {
		this.#elements.sort(comparator);

		return this;
	}

	/**
	 * Returns a sorted copy of this list without modifying it.
	 * @param comparator A function that defines the sort order. Defaults to naturalComparator.
	 * @returns A new sorted list.
	 */
	toSorted(comparator: Comparator<E> = naturalComparator): List<E> {
		return List.#newInstance(this.#elements.slice().sort(comparator));
	}

	/**
	 * Performs the specified action for each element in an list.
	 * @param consumer A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
	 * @param [context] The value to use as `this` when invoking the consumer. If omitted, `undefined` is used.
	 */
	forEach(consumer: Consumer<E>, context?: unknown): void {
		const elements = this.#elements;

		for (let index = 0, length = elements.length; index < length && index < elements.length; index++) {
			consumer.call(context, elements[index] as E, index, this);
		}
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
		return this.#elements.slice();
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
	 * Creates a list from an iterable, optionally mapping each element.
	 * When provided, the mapper receives the source List as its third argument.
	 * @param elements The iterable to copy.
	 * @param mapFn A function to call on every element.
	 * @returns The new list.
	 */
	static from<E>(elements: Iterable<E>): List<E>;
	static from<E, R>(elements: Iterable<E>, mapFn: Mapper<E, R>): List<R>;
	static from<E, R>(elements: Iterable<E>, mapFn?: Mapper<E, R>): List<E | R> {
		const source = new List(elements);

		return mapFn === undefined ? source : source.map<E | R>(mapFn);
	}

	/**
	 * Creates a list from the provided elements.
	 * @param elements The elements to include.
	 * @returns The new list.
	 */
	static of<E>(...elements: Array<E>): List<E> {
		return new List(elements);
	}

	/**
	 * Creates a list that takes ownership of an internally allocated array.
	 * @param elements The internally allocated elements.
	 * @returns A list backed by the provided array.
	 */
	static #newInstance<E>(elements: Array<E>) {
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
	static #concatMapper<E>(element: E | List<E>) {
		return element instanceof List ? element.#elements : [ element ];
	}
}