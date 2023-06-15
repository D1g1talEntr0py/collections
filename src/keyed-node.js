import Node from './node.js';

/**
 * JavaScript implementation of a Node that can be used in a linked list.
 *
 * @template K
 * @template E
 * @type {KeyedNode<K, E>}
 * @module {KeyedNode} keyed-node
 */
class KeyedNode extends Node {
	/** @type {K|null} */
	#key;

	/**
	 * Creates a new node with the given value.
	 *
	 * @param {Object} options The options for the node, or the node to copy.
	 * @param {KeyedNode<K, E>} [options.previous] The previous node.
	 * @param {KeyedNode<K, E>} [options.next] The next node.
	 * @param {K} options.key The key to be assigned to the node.
	 * @param {E} options.value The value to be assigned to the node.
	 */
	constructor({ previous = null, next = null, key, value }) {
		super({ previous, next, value });
		this.#key = key;
	}

	/**
	 * Gets the key.
	 *
	 * @returns {K} The key.
	 */
	get key() {
		return this.#key;
	}

	/**
	 * Sets the key.
	 *
	 * @param {K} key The key.
	 * @returns {void}
	 */
	set key(key) {
		this.#key = key;
	}

	/**
	 * Gets the string description of the class.
	 *
	 * @override
	 * @returns {string} The string description of the class.
	 */
	get [Symbol.toStringTag]() {
		return 'KeyedNode';
	}
}

export default KeyedNode;