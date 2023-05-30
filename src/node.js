/**
 * JavaScript implementation of a Node.
 *
 * @module {Node} node
 */
class Node {
	/** @type {*} */
	#value;
	/** @type {Node} */
	#next;
	/** @type {Node} */
	#previous;

	/**
	 * Creates a new node with the given value.
	 *
	 * @param {*} value The value to be assigned to the node.
	 */
	constructor(value) {
		this.#value = value;
		this.#next = null;
		this.#previous = null;
	}

	/**
	 * Sets the value of the node.
	 *
	 * @param {*} value The value to be assigned to the node.
	 * @returns {void}
	 */
	set value(value) {
		this.#value = value;
	}

	/**
	 * Gets the value of the node.
	 *
	 * @returns {*} The value of the node.
	 */
	get value() {
		return this.#value;
	}

	/**
	 * Sets the next node.
	 *
	 * @param {Node} next The next node.
	 * @returns {void}
	 */
	set next(next) {
		this.#next = next;
	}

	/**
	 * Gets the next node.
	 *
	 * @returns {Node} The next node.
	 */
	get next() {
		return this.#next;
	}

	/**
	 * Sets the previous node.
	 *
	 * @param {Node} previous The previous node.
	 * @returns {void}
	 */
	set previous(previous) {
		this.#previous = previous;
	}

	/**
	 * Gets the previous node.
	 *
	 * @returns {Node} The previous node.
	 */
	get previous() {
		return this.#previous;
	}

	/**
	 * Gets the default description of the class.
	 *
	 * @returns {string} The default description of the class.
	 */
	get [Symbol.toStringTag]() {
		return 'Node';
	}
}

export default Node;