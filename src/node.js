/**
 * JavaScript implementation of a Node that can be used in a linked list.
 *
 * @template E
 * @type {Node<E>}
 * @module {Node} node
 */
class Node {
	/** @type {Node<E>} */
	#previous;
	/** @type {Node<E>} */
	#next;
	/** @type {E} */
	#value;

	/**
	 * Creates a new node with the given value.
	 *
	 * @param {Object} options The options for the node, or the node to copy.
	 * @param {Node<E>} [options.previous] The previous node.
	 * @param {Node<E>} [options.next] The next node.
	 * @param {E} [options.value] The value to be assigned to the node.
	 */
	constructor({ previous = null, next = null, value } = {}) {
		this.#previous = previous;
		this.#next = next;
		this.#value = value;
	}

	/**
	 * Gets the previous node.
	 *
	 * @returns {Node<E>} The previous node.
	 */
	get previous() {
		return this.#previous;
	}

	/**
	 * Sets the previous node.
	 *
	 * @param {Node<E>} previous The previous node.
	 * @returns {void}
	 */
	set previous(previous) {
		this.#previous = previous;
	}

	/**
	 * Gets the next node.
	 *
	 * @returns {Node<E>} The next node.
	 */
	get next() {
		return this.#next;
	}

	/**
	 * Sets the next node.
	 *
	 * @param {Node<E>} next The next node.
	 * @returns {void}
	 */
	set next(next) {
		this.#next = next;
	}

	/**
	 * Gets the value of the node.
	 *
	 * @returns {E} The value of the node.
	 */
	get value() {
		return this.#value;
	}

	/**
	 * Sets the value of the node.
	 *
	 * @param {E} value The value of the node.
	 * @returns {void}
	 */
	set value(value) {
		this.#value = value;
	}

	/**
	 * Unlinks this node from the list.
	 *
	 * @returns {void}
	 */
	unlink() {
		if (this.#previous != null) {
			this.#previous.next = this.#next;
		}

		if (this.#next != null) {
			this.#next.previous = this.#previous;
		}

		this.#previous = this.#next = null;
	}

	/**
	 * Returns a string description of the class.
	 *
	 * @override
	 * @returns {string} A string description of the class.
	 */
	get [Symbol.toStringTag]() {
		return 'Node';
	}
}

export default Node;