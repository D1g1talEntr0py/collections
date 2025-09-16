import { Node } from './node';

type KeyedNodeOptions<K, E> = Partial<Omit<KeyedNode<K, E>, 'value' | 'key'>> & { key: K, value: E };

/** JavaScript implementation of a Node that can be used in a linked list. */
export class KeyedNode<K, E> extends Node<E> {
	private $key: K | null;

	/**
	 * Creates a new node with the given value.
	 * @param options The options for the node, or the node to copy.
	 * @param [options.previous] The previous node.
	 * @param [options.next] The next node.
	 * @param options.key The key to be assigned to the node.
	 * @param options.value The value to be assigned to the node.
	 */
	constructor({ previous = null, next = null, key, value }: KeyedNodeOptions<K, E>) {
		super({ previous, next, value });
		this.$key = key;
	}

	/**
	 * Gets the key.
	 * @returns The key.
	 */
	get key(): K | null {
		return this.$key;
	}

	/**
	 * Sets the key.
	 * @param key The key.
	 */
	set key(key: K) {
		this.$key = key;
	}

	/**
	 * Gets the previous node.
	 * @returns The previous node.
	 */
	override get previous(): KeyedNode<K, E> | null {
		return this.$previous as KeyedNode<K, E>;
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
		return this.$next as KeyedNode<K, E>;
	}

	/**
	 * Sets the next node.
	 * @param next The next node.
	 */
	override set next(next: KeyedNode<K, E> | null) {
		this.$next = next;
	}

	/**
	 * Gets the value of the node.
	 * @returns The value of the node.
	 */
	override get value(): E {
		return this.$value;
	}

	/**
	 * Sets the value of the node.
	 * @param value The value of the node.
	 */
	override set value(value: E) {
		this.$value = value;
	}

	/**
	 * Gets the string description of the class.
	 * @returns The string description of the class.
	 */
	override get [Symbol.toStringTag](): string {
		return 'KeyedNode';
	}
}