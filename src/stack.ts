/**
 * A last-in, first-out collection.
 * Iteration and {@link toArray} expose values from the top of the stack to the bottom.
 */
export class Stack<E> {
	readonly #items: Array<E>;

	/**
	 * Creates a new stack from an iterable.
	 * The last item in the iterable becomes the top of the stack.
	 * @param items The initial items, in bottom-to-top order.
	 */
	constructor(items: Iterable<E> = []) {
		this.#items = Array.from(items);
	}

	/**
	 * Pushes a value onto the stack.
	 * @param value - The value to be pushed.
	 * @returns This stack.
	 */
	push(value: E): this {
		this.#items.push(value);

		return this;
	}

	/**
	 * Pops the top value off the stack and returns it.
	 * Returns undefined if the stack is empty.
	 * @returns The popped value or undefined.
	 */
	pop(): E | undefined {
		return this.#items.pop();
	}

	/**
	 * Peeks at the top value on the stack without popping it.
	 * Returns undefined if the stack is empty.
	 * @returns The top value of the stack or undefined.
	 */
	peek(): E | undefined {
		return this.#items[this.#items.length - 1];
	}

	/**
	 * Removes all items from the stack.
	 * @returns This stack.
	 */
	clear(): this {
		this.#items.length = 0;

		return this;
	}

	/**
	 * Checks if the stack is empty.
	 * @returns True if the stack is empty, false otherwise.
	 */
	isEmpty(): boolean {
		return this.#items.length === 0;
	}

	/**
	 * Returns the number of items in the stack.
	 * @returns The number of items in the stack.
	 */
	get size(): number {
		return this.#items.length;
	}

	/**
	 * Returns a shallow copy of the stack's values, from top to bottom.
	 * @returns The stack values in iteration order.
	 */
	toArray(): Array<E> {
		return this.#items.slice().reverse();
	}

	/**
	 * Iterates over the stack from top to bottom.
	 * @returns An iterator over a snapshot of the stack's values.
	 */
	[Symbol.iterator](): IterableIterator<E> {
		return this.toArray()[Symbol.iterator]();
	}

	/**
	 * Gets the string tag for the class.
	 * @returns The string tag of the Stack class.
	 */
	get [Symbol.toStringTag](): string {
		return 'Stack';
	}
}