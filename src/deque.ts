/**
 * A double-ended queue backed by a power-of-two ring buffer.
 * Iteration and {@link toArray} expose values from the front to the back.
 */
export class Deque<E> implements Iterable<E> {
	#head = 0;
	#size = 0;
	#buffer = new Array<E | undefined>(8);

	/**
	 * Creates a deque containing the values from an iterable.
	 * @param values The initial values, in front-to-back order.
	 */
	constructor(values: Iterable<E> = []) {
		for (const value of values) { this.pushBack(value) }
	}

	/**
	 * Adds a value to the front of the deque.
	 * @param value The value to add.
	 * @returns This deque.
	 */
	pushFront(value: E): this {
		this.#ensureCapacity();
		this.#head = (this.#head - 1) & (this.#buffer.length - 1);
		this.#buffer[this.#head] = value;
		this.#size++;

		return this;
	}

	/**
	 * Adds a value to the back of the deque.
	 * @param value The value to add.
	 * @returns This deque.
	 */
	pushBack(value: E): this {
		this.#ensureCapacity();
		// Compute the index for the new back element.
		this.#buffer[(this.#head + this.#size) & (this.#buffer.length - 1)] = value;
		this.#size++;

		return this;
	}

	/**
	 * Removes and returns the front value.
	 * Returns undefined if the deque is empty.
	 * @returns The removed value or undefined.
	 */
	popFront(): E | undefined {
		if (this.#size === 0) { return undefined }

		const value = this.#buffer[this.#head];
		this.#buffer[this.#head] = undefined;
		this.#size--;

		this.#head = this.#size === 0 ? 0 : (this.#head + 1) & (this.#buffer.length - 1);

		this.#shrinkIfNeeded();

		return value;
	}

	/**
	 * Removes and returns the back value.
	 * Returns undefined if the deque is empty.
	 * @returns The removed value or undefined.
	 */
	popBack(): E | undefined {
		if (this.#size === 0) { return undefined }

		const index = (this.#head + this.#size - 1) & (this.#buffer.length - 1);
		const value = this.#buffer[index];
		this.#buffer[index] = undefined;
		this.#size--;

		if (this.#size === 0) { this.#head = 0 }

		this.#shrinkIfNeeded();

		return value;
	}

	/**
	 * Returns the front value without removing it.
	 * Returns undefined if the deque is empty.
	 * @returns The front value or undefined.
	 */
	peekFront(): E | undefined {
		return this.#size === 0 ? undefined : this.#buffer[this.#head];
	}

	/**
	 * Returns the back value without removing it.
	 * Returns undefined if the deque is empty.
	 * @returns The back value or undefined.
	 */
	peekBack(): E | undefined {
		// Compute the index for the back element if the deque is not empty.
		return this.#size === 0 ? undefined : this.#buffer[(this.#head + this.#size - 1) & (this.#buffer.length - 1)];
	}

	/**
	 * Returns the value at an index, with negative indices counting back from the end.
	 * Returns undefined if the index is outside the deque, following {@link Array.at}.
	 * @param index The position to read.
	 * @returns The value at the index or undefined.
	 */
	at(index: number): E | undefined {
		const integerIndex = Number.isNaN(index) ? 0 : Math.trunc(index);
		const resolvedIndex = integerIndex < 0 ? this.#size + integerIndex : integerIndex;

		if (Number.isNaN(resolvedIndex) || resolvedIndex < 0 || resolvedIndex >= this.#size) { return undefined }

		// Compute the index for the resolved element within the circular buffer.
		return this.#buffer[(this.#head + resolvedIndex) & (this.#buffer.length - 1)];
	}

	/**
	 * Removes all values and releases the deque's retained element references.
	 * @returns This deque.
	 */
	clear(): this {
		this.#buffer = new Array<E | undefined>(8);
		this.#head = 0;
		this.#size = 0;

		return this;
	}

	/**
	 * Checks whether the deque contains no values.
	 * @returns True if the deque is empty.
	 */
	isEmpty(): boolean {
		return this.#size === 0;
	}

	/**
	 * Returns the number of values in the deque.
	 * @returns The deque size.
	 */
	get size(): number {
		return this.#size;
	}

	/**
	 * Returns a shallow copy of the values from front to back.
	 * @returns The deque values in iteration order.
	 */
	toArray(): Array<E> {
		const values = new Array<E>(this.#size);
		const mask = this.#buffer.length - 1;

		for (let index = 0; index < this.#size; index++) {
			values[index] = this.#buffer[(this.#head + index) & mask] as E;
		}

		return values;
	}

	/**
	 * Iterates from front to back without copying the deque.
	 * The iterator captures the initial size but reads values by their current
	 * front-relative index. Mutations during iteration can therefore change
	 * observed values or cause values to be skipped or repeated; values appended
	 * at positions beyond the initial size are not visited. If a mutation leaves
	 * no value at the iterator's next index, iteration ends.
	 * @returns An iterator over the deque's values.
	 */
	[Symbol.iterator](): IterableIterator<E> {
		return Deque.#iterate(this, this.#size);
	}

	/**
	 * Iterates a deque up to its size when iteration was requested.
	 * @param deque The deque to iterate.
	 * @param initialSize The size captured when the iterator was created.
	 * @returns An iterator over the deque's values.
	 * @yields {E} The next deque value.
	 */
	static *#iterate<E>(deque: Deque<E>, initialSize: number): IterableIterator<E> {
		for (let index = 0; index < initialSize; index++) {
			if (index >= deque.#size) { return }

			yield deque.#buffer[(deque.#head + index) & (deque.#buffer.length - 1)] as E;
		}
	}

	/** Doubles the buffer when it is full. */
	#ensureCapacity(): void {
		if (this.#size === this.#buffer.length) { this.#resize(this.#buffer.length * 2) }
	}

	/** Halves the buffer when it is at most quarter full, retaining a minimum capacity of eight. */
	#shrinkIfNeeded(): void {
		if (this.#buffer.length > 8 && this.#size <= this.#buffer.length / 4) { this.#resize(this.#buffer.length / 2) }
	}

	/**
	 * Resizes the buffer and copies values into front-to-back order.
	 * @param capacity The new power-of-two capacity.
	 */
	#resize(capacity: number): void {
		const buffer = new Array<E | undefined>(capacity);
		const mask = this.#buffer.length - 1;

		for (let index = 0; index < this.#size; index++) { buffer[index] = this.#buffer[(this.#head + index) & mask] }

		this.#buffer = buffer;
		this.#head = 0;
	}
}