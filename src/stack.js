/**
 * @template E
 * @type {Stack<E>} The stack class.
 * JavaScript implementation of a Stack.
 */
class Stack {
	/** @type {Array<E>} */
	#items;

	/**
	 * Creates a new stack.
	 * @constructor
	 */
	constructor() {
		this.#items = [];
	}

	/**
	 * Pushes a value onto the stack.
	 * @param {E} value - The value to be pushed.
	 * @returns {void}
	 */
	push(value) {
		this.#items.push(value);
	}

	/**
	 * Pops the top value off the stack and returns it.
	 * Returns undefined if the stack is empty.
	 * @returns {E} The popped value or undefined.
	 */
	pop() {
		return this.#items.pop();
	}

	/**
	 * Peeks at the top value on the stack without popping it.
	 * Returns undefined if the stack is empty.
	 * @returns {E} The top value of the stack or undefined.
	 */
	peek() {
		return this.#items[this.#items.length - 1];
	}

	/**
	 * Checks if the stack is empty.
	 * @returns {boolean} True if the stack is empty, false otherwise.
	 */
	isEmpty() {
		return this.#items.length === 0;
	}

	/**
	 * Returns the number of items in the stack.
	 * @returns {number} The number of items in the stack.
	 */
	get size() {
		return this.#items.length;
	}
}

export default Stack;