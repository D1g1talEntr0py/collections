/** A collection that stores each element with a count of its occurrences. */
export class MultiSet<E> implements Iterable<E> {
	#size = 0;
	#counts = new Map<E, number>();

	/**
	 * Creates a MultiSet, adding each occurrence from an optional iterable.
	 * @param iterable The elements to add, or undefined to create an empty MultiSet.
	 * @throws {RangeError} If the total occurrence count exceeds the maximum safe integer.
	 */
	constructor(iterable?: Iterable<E>) {
		if (iterable !== undefined) {
			for (const element of iterable) { this.add(element) }
		}
	}

	/**
	 * Adds one or more occurrences of an element.
	 * @param element The element to add.
	 * @param count The positive safe integer number of occurrences to add.
	 * @returns This MultiSet.
	 * @throws {RangeError} If count is not a positive safe integer or adding it would exceed the maximum safe occurrence count.
	 */
	add(element: E, count = 1): this {
		MultiSet.#validateCount(count);

		const currentCount = this.#counts.get(element) ?? 0;

		if (currentCount > Number.MAX_SAFE_INTEGER - count || this.#size > Number.MAX_SAFE_INTEGER - count) {
			throw new RangeError('Total occurrence count exceeds the maximum safe integer.');
		}

		this.#counts.set(element, currentCount + count);
		this.#size += count;

		return this;
	}

	/**
	 * Removes up to the requested number of occurrences of an element.
	 * The element is removed from the underlying collection when its count reaches zero.
	 * @param element The element to remove.
	 * @param count The positive safe integer number of occurrences to remove.
	 * @returns This MultiSet.
	 * @throws {RangeError} If count is not a positive safe integer.
	 */
	remove(element: E, count = 1): this {
		MultiSet.#validateCount(count);
		const currentCount = this.#counts.get(element);

		if (currentCount !== undefined) {
			const removedCount = Math.min(count, currentCount);
			this.#size -= removedCount;

			if (removedCount === currentCount) {
				this.#counts.delete(element);
			} else {
				this.#counts.set(element, currentCount - removedCount);
			}
		}

		return this;
	}

	/**
	 * Gets the number of occurrences of an element.
	 * @param element The element to count.
	 * @returns The number of occurrences, or zero when the element is absent.
	 */
	count(element: E): number {
		return this.#counts.get(element) ?? 0;
	}

	/**
	 * Checks whether the collection contains an element.
	 * @param element The element to check.
	 * @returns True when the element has at least one occurrence.
	 */
	has(element: E): boolean {
		return this.#counts.has(element);
	}

	/**
	 * Gets the total number of occurrences, including duplicates.
	 * @returns The total number of occurrences.
	 */
	get size(): number {
		return this.#size;
	}

	/**
	 * Gets the number of distinct elements.
	 * @returns The number of distinct elements.
	 */
	get uniqueSize(): number {
		return this.#counts.size;
	}

	/**
	 * Removes all elements.
	 * @returns This MultiSet.
	 */
	clear(): this {
		this.#counts.clear();
		this.#size = 0;

		return this;
	}

	/**
	 * Iterates over each distinct element and its occurrence count in insertion order.
	 * @returns An iterator of element-count pairs.
	 */
	entries(): IterableIterator<[E, number]> {
		return this.#counts.entries();
	}

	/**
	 * Creates an array containing every occurrence in insertion order.
	 * @returns An array with each element repeated according to its count.
	 */
	toArray(): E[] {
		const elements = new Array<E>(this.#size);
		let index = 0;

		for (const [ element, count ] of this.#counts) {
			for (const end = index + count; index < end; index++) { elements[index] = element }
		}

		return elements;
	}

	/**
	 * Iterates over each occurrence in element insertion order.
	 * @returns An iterator over all occurrences.
	 * @yields {E} The next element occurrence.
	 */
	*[Symbol.iterator](): IterableIterator<E> {
		for (const [element, count] of this.#counts) {
			for (let occurrence = 0; occurrence < count; occurrence++) { yield element }
		}
	}

	/**
	 * Validates a requested occurrence count.
	 * @param count The count to validate.
	 */
	static #validateCount(count: number): void {
		if (!Number.isSafeInteger(count) || count <= 0) { throw new RangeError('Count must be a positive safe integer.') }
	}
}
