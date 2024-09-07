type NodeOptions<E> = Partial<Omit<Node<E>, 'value'>> & { value: E };

/**
 * JavaScript implementation of a Node that can be used in a linked list.
 */
export class Node<E> {
	protected $previous: Node<E> | null;
	protected $next: Node<E> | null;
	protected $value: E;

	/**
	 * Creates a new node with the given value.
	 *
	 * @param {Node<E>} options The options for the node, or the node to copy.
	 * @param {Node<E>} [options.previous] The previous node.
	 * @param {Node<E>} [options.next] The next node.
	 * @param {E} options.value The value to be assigned to the node.
	 */
	constructor({ previous = null, next = null, value }: NodeOptions<E>) {
		this.$previous = previous;
		this.$next = next;
		this.$value = value;
	}

	/**
	 * Gets the previous node.
	 *
	 * @returns {Node<E> | null} The previous node.
	 */
	get previous(): Node<E> | null {
		return this.$previous;
	}

	/**
	 * Sets the previous node.
	 *
	 * @param {Node<E> | null} previous The previous node.
	 */
	set previous(previous: Node<E> | null) {
		this.$previous = previous;
	}

	/**
	 * Gets the next node.
	 *
	 * @returns {Node<E> | null} The next node.
	 */
	get next(): Node<E> | null {
		return this.$next;
	}

	/**
	 * Sets the next node.
	 *
	 * @param {Node<E> | null} next The next node.
	 */
	set next(next: Node<E> | null) {
		this.$next = next;
	}

	/**
	 * Gets the value of the node.
	 *
	 * @returns {E} The value of the node.
	 */
	get value(): E {
		return this.$value;
	}

	/**
	 * Sets the value of the node.
	 *
	 * @param {E} value The value of the node.
	 */
	set value(value: E) {
		this.$value = value;
	}

	/**
	 * Unlinks this node from the list.
	 *
	 * @returns {void}
	 */
	unlink(): void {
		if (this.$previous !== null) { this.$previous.next = this.$next }

		if (this.$next !== null) { this.$next.previous = this.$previous }

		this.$previous = this.$next = null;
	}

	/**
	 * Returns a string description of the class.
	 *
	 * @override
	 * @returns {string} A string description of the class.
	 */
	get [Symbol.toStringTag](): string {
		return 'Node';
	}
}