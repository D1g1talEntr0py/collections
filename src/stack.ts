/** JavaScript implementation of a Stack */
export class Stack<E> {
	private readonly items: Array<E>;

	/**
	 * Creates a new stack.
	 * @class
	 */
	constructor() {
		this.items = [];
	}

	/**
	 * Pushes a value onto the stack.
	 * @param {E} value - The value to be pushed.
	 * @returns {void}
	 */
	push(value: E): void {
		this.items.push(value);
	}

	/**
	 * Pops the top value off the stack and returns it.
	 * Returns undefined if the stack is empty.
	 * @returns {E | undefined} The popped value or undefined.
	 */
	pop(): E | undefined {
		return this.items.pop();
	}

	/**
	 * Peeks at the top value on the stack without popping it.
	 * Returns undefined if the stack is empty.
	 * @returns {E | undefined} The top value of the stack or undefined.
	 */
	peek(): E | undefined {
		return this.items[this.items.length - 1];
	}

	/**
	 * Checks if the stack is empty.
	 * @returns {boolean} True if the stack is empty, false otherwise.
	 */
	isEmpty(): boolean {
		return this.items.length === 0;
	}

	/**
	 * Returns the number of items in the stack.
	 * @returns {number} The number of items in the stack.
	 */
	get size(): number {
		return this.items.length;
	}
}