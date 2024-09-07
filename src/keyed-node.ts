import { Node } from './node';

type KeyedNodeOptions<K, E> = Partial<Omit<KeyedNode<K, E>, 'value' | 'key'>> & { key: K, value: E };

/** JavaScript implementation of a Node that can be used in a linked list. */
export class KeyedNode<K, E> extends Node<E> {
	private $key: K | null;

	/**
	 * Creates a new node with the given value.
	 *
	 * @param {Object} options The options for the node, or the node to copy.
	 * @param {KeyedNode<K, E>} [options.previous] The previous node.
	 * @param {KeyedNode<K, E>} [options.next] The next node.
	 * @param {K} options.key The key to be assigned to the node.
	 * @param {E} options.value The value to be assigned to the node.
	 */
	constructor({ previous = null, next = null, key, value }: KeyedNodeOptions<K, E>) {
		super({ previous, next, value });
		this.$key = key;
	}

	/**
	 * Gets the key.
	 *
	 * @returns {K | null} The key.
	 */
	get key(): K | null {
		return this.$key;
	}

	/**
	 * Sets the key.
	 *
	 * @param {K} key The key.
	 */
	set key(key: K) {
		this.$key = key;
	}

	/**
	 * Gets the previous node.
	 *
	 * @returns {KeyedNode<K, E> | null} The previous node.
	 */
	override get previous(): KeyedNode<K, E> | null {
		return this.$previous as KeyedNode<K, E>;
	}

	/**
	 * Sets the previous node.
	 *
	 * @param {Node<E> | null} previous The previous node.
	 */
	override set previous(previous: KeyedNode<K, E> | null) {
		this.$previous = previous;
	}

	/**
	 * Gets the next node.
	 *
	 * @returns {Node<E> | null} The next node.
	 */
	override get next(): KeyedNode<K, E> | null {
		return this.$next as KeyedNode<K, E>;
	}

	/**
	 * Sets the next node.
	 *
	 * @param {KeyedNode<K, E> | null} next The next node.
	 */
	override set next(next: KeyedNode<K, E> | null) {
		this.$next = next;
	}

	/**
	 * Gets the value of the node.
	 *
	 * @returns {E} The value of the node.
	 */
	override get value(): E {
		return this.$value;
	}

	/**
	 * Sets the value of the node.
	 *
	 * @param {E} value The value of the node.
	 */
	override set value(value: E) {
		this.$value = value;
	}

	/**
	 * Gets the string description of the class.
	 *
	 * @override
	 * @returns {string} The string description of the class.
	 */
	get [Symbol.toStringTag](): string {
		return 'KeyedNode';
	}
}