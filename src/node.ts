type NodeOptions<E> = { previous?: Node<E> | null, next?: Node<E> | null, value: E };

/** JavaScript implementation of a Node that can be used in a linked list */
export class Node<E> {
	protected $value: E;
	protected $previous: Node<E> | null;
	protected $next: Node<E> | null;

	/**
	 * Creates a new node with the given value.
	 * @param options The options for the node, or the node to copy.
	 * @param options.value The value to be assigned to the node.
	 * @param options.previous The previous node.
	 * @param options.next The next node.
	 */
	constructor({ value, previous = null, next = null }: NodeOptions<E>) {
		this.$value = value;
		this.$previous = previous;
		this.$next = next;
	}

	/**
	 * Gets the value of the node.
	 * @returns The value of the node.
	 */
	get value() {
		return this.$value;
	}

	/**
	 * Gets the previous node.
	 * @returns The previous node.
	 */
	get previous() {
		return this.$previous;
	}

	/**
	 * Sets the previous node.
	 * @param previous The previous node.
	 */
	set previous(previous: Node<E> | null) {
		this.$previous = previous;
	}

	/**
	 * Gets the next node.
	 * @returns The next node.
	 */
	get next() {
		return this.$next;
	}

	/**
	 * Sets the next node.
	 * @param next The next node.
	 */
	set next(next: Node<E> | null) {
		this.$next = next;
	}

	/**
	 * Sets the value of the node.
	 * @param value The value of the node.
	 */
	set value(value: E) {
		this.$value = value;
	}

	/** Unlinks this node from the list */
	unlink(): void {
		if (this.$previous !== null) { this.$previous.next = this.$next }

		if (this.$next !== null) { this.$next.previous = this.$previous }

		this.$previous = this.$next = null;
	}

	/**
	 * Returns a string description of the class.
	 * @returns A string description of the class.
	 */
	get [Symbol.toStringTag]() {
		return 'Node';
	}
}