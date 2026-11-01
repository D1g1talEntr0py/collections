import { Node } from './node';

type KeyedNodeOptions<K, E> = {
	previous?: KeyedNode<K, E> | null,
	next?: KeyedNode<K, E> | null,
	key: K,
	value: E
};

/** JavaScript implementation of a Node that can be used in a linked list. */
export class KeyedNode<K, E> extends Node<E> {
	#key: K;
	protected override $previous: KeyedNode<K, E> | null;
	protected override $next: KeyedNode<K, E> | null;

	/**
	 * Creates a new node with the given value.
	 * @param options The options for the node, or the node to copy.
	 * @param [options.previous] The previous node.
	 * @param [options.next] The next node.
	 * @param options.key The key to be assigned to the node.
	 * @param options.value The value to be assigned to the node.
	 */
	constructor({ previous = null, next = null, key, value }: KeyedNodeOptions<K, E>) {
		super({ value });
		this.$previous = previous;
		this.$next = next;
		this.#key = key;
	}

	/**
	 * Gets the key.
	 * @returns The key.
	 */
	get key(): K {
		return this.#key;
	}

	/**
	 * Sets the key.
	 * @param key The key.
	 */
	set key(key: K) {
		this.#key = key;
	}

	/**
	 * Gets the previous node.
	 * @returns The previous node.
	 */
	override get previous(): KeyedNode<K, E> | null {
		return this.$previous;
	}

	/**
	 * Sets the previous node.
	 * @param previous The previous node.
	 */
	override set previous(previous: KeyedNode<K, E> | null) {
		this.$previous = previous;
	}

	/**
	 * Gets the next node.
	 * @returns The next node.
	 */
	override get next(): KeyedNode<K, E> | null {
		return this.$next;
	}

	/**
	 * Sets the next node.
	 * @param next The next node.
	 */
	override set next(next: KeyedNode<K, E> | null) {
		this.$next = next;
	}

	/**
	 * Gets the string description of the class.
	 * @returns The string description of the class.
	 */
	override get [Symbol.toStringTag]() {
		return 'KeyedNode';
	}
}