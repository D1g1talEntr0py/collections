import KeyedNode from './keyed-node.js';

/**
 * A Map that maintains insertion order.
 *
 * @template K
 * @template V
 * @type {LinkedMap<K, V>}
 * @module {LinkedMap} linked-map
 */
class LinkedMap {
	/** @type {Map<K, KeyedNode<K, V>>} */
	#map;
	/** @type {KeyedNode<K, V>} */
	#head = null;
	/** @type {KeyedNode<K, V>} */
	#tail = null;

	/**
	 * Initializes an empty LinkedMap.
	 */
	constructor() {
		this.#map = new Map();
	}

	/**
	 * Retrieves the value associated with a given key.
	 *
	 * @param {K} key The key to retrieve.
	 * @returns {V|undefined} The value associated with the key, or undefined if the key is not in the map.
	 */
	get(key) {
		return this.#map.get(key)?.value;
	}

	/**
	 * Associates the specified value with the specified key in this map.
	 *
	 * @param {K} key The key with which the specified value is to be associated.
	 * @param {V} value The value to be associated with the specified key.
	 */
	set(key, value) {
		const node = this.#map.get(key);

		if (node) {
			node.value = value;
			this.#moveToLast(node);
		} else {
			this.#appendNewNode(key, value);
		}
	}

	/**
	 * Removes the mapping for a key from this map if it is present.
	 *
	 * @param {K} key The key whose mapping is to be removed from the map.
	 * @returns {boolean} True if the map contained a mapping for the specified key, false otherwise.
	 */
	remove(key) {
		return this.#unlinkNode(this.#map.get(key)) ? this.#map.delete(key) : false;
	}

	/**
	 * Adds a new node to the beginning of the list.
	 * If the key already exists, it will be moved to the beginning of the list.
	 * If the key does not exist, a new node will be created and added to the beginning of the list.
	 * If the list is empty, the new node will be both the head and the tail.
	 * If the list is not empty, the new node will be the head.
	 * If the key already exists, the value will be updated.
	 *
	 * @param {K} key The key of the new node.
	 * @param {V} value The value of the new node.
	 * @returns {void}
	 */
	addFirst(key, value) {
		const node = this.#map.get(key);

		if (node) {
			this.#moveToFirst(node);
			node.value = value;
		} else {
			this.#prependNewNode(key, value);
		}
	}

	/**
	 * Adds a new node to the end of the list.
	 * If the key already exists, it will be moved to the end of the list.
	 * If the key does not exist, a new node will be created and added to the end of the list.
	 * If the list is empty, the new node will be both the head and the tail.
	 * If the list is not empty, the new node will be the tail.
	 * If the key already exists, the value will be updated.
	 *
	 * @param {K} key The key of the new node.
	 * @param {V} value The value of the new node.
	 * @returns {void}
	 */
	addLast(key, value) {
		const node = this.#map.get(key);

		if (node) {
			this.#moveToLast(node);
			node.value = value;
		} else {
			this.#appendNewNode(key, value);
		}
	}

	/**
	 * Moves the node with the specified key to the beginning of the list.
	 * If the key does not exist, nothing will happen.
	 * If the node is already the head, nothing will happen.
	 * If the node is the tail, the tail will be updated to be the previous node.
	 * If the node is not the tail, the next node's previous pointer will be updated to point to the previous node.
	 * The node's previous pointer will be updated to point to null.
	 * The node's next pointer will be updated to point to the head.
	 * The head's previous pointer will be updated to point to the node.
	 * The head will be updated to point to the node.
	 * If the node is the tail, the tail will be updated to be the previous node.
	 * If the node is not the tail, the next node's previous pointer will be updated to point to the previous node.
	 *
	 * @param {K} key The key of the node to move to the beginning of the list.
	 * @returns {void}
	 */
	moveToFirst(key) {
		this.#moveToFirst(this.#map.get(key));
	}

	/**
	 * Moves the node with the specified key to the end of the list.
	 * If the key does not exist, nothing will happen.
	 * If the node is already the tail, nothing will happen.
	 * If the node is the head, the head will be updated to be the next node.
	 * If the node is neither the head nor the tail, the previous node's next pointer will be updated to point to the next node.
	 * The node's previous pointer will be updated to point to the old tail.
	 * The old tail's next pointer will be updated to point to the node.
	 * The tail will be updated to point to the node.
	 * The node's next pointer will be updated to point to null.
	 * If the key already exists, the value will be updated.
	 *
	 * @param {K} key The key of the node to move to the end of the list.
	 * @returns {void}
	 */
	moveToLast(key) {
		this.#moveToLast(this.#map.get(key));
	}

	/**
	 * Returns the value to which the first key is mapped, or null if this map contains no mappings.
	 *
	 * @returns {V|null} The value to which the first key is mapped, or null if this map contains no mappings.
	 */
	getFirst() {
		return this.#head?.value ?? null;
	}

	/**
	 * Returns the value to which the last key is mapped, or null if this map contains no mappings.
	 *
	 * @returns {V|null} The value to which the last key is mapped, or null if this map contains no mappings.
	 */
	getLast() {
		return this.#tail?.value ?? null;
	}

	/**
	 * Removes the first key and its corresponding value from this map.
	 * If the map is empty, nothing will happen.
	 * If the map is not empty, the head will be updated to be the next node.
	 * If the map is not empty and the head is not null, the head's previous pointer will be updated to point to null.
	 * The node will be removed from the map.
	 * The node's previous and next pointers will be updated to point to null.
	 *
	 * @returns {boolean} True if the first key and its corresponding value were removed, false otherwise.
	 */
	removeFirst() {
		return this.#head === null ? false : this.remove(this.#head.key);
	}

	/**
	 * Removes the last key and its corresponding value from this map.
	 * If the map is empty, nothing will happen.
	 * If the map is not empty, the tail will be updated to be the previous node.
	 * If the map is not empty and the tail is not null, the tail's next pointer will be updated to point to null.
	 * The node will be removed from the map.
	 * The node's previous and next pointers will be updated to point to null.
	 * If the key does not exist, nothing will happen.
	 * If the node is already the tail, nothing will happen.
	 *
	 * @returns {boolean} True if the last key and its corresponding value were removed, false otherwise.
	 */
	removeLast() {
		return this.#tail === null ? false : this.remove(this.#tail.key);
	}

	/**
	 * Returns a boolean indicating whether the map contains a specific key.
	 *
	 * @param {K} key The key to check.
	 * @returns {boolean} True if the map contains the key, false otherwise.
	 */
	has(key) {
		return this.#map.has(key);
	}

	/**
	 * Executes a provided function once for each key-value pair in the map.
	 *
	 * @param {function(V, K, LinkedMap<K, V>): void} callback - Function to execute for each key-value pair.
	 * @param {any} [thisArg=this] - Value to use as `this` when executing the callback.
	 * @returns {void}
	 */
	forEach(callback, thisArg = this) {
		for (let [key, value] of this) {
			callback.call(thisArg, value, key, this);
		}
	}

	/**
	 * Removes all of the mappings from this map. The map will be empty after this call returns.
	 */
	clear() {
		this.#map.clear();
		this.#head = this.#tail = null;
	}

	get size() {
		return this.#map.size;
	}

	/**
	 * Returns an iterator that yields all keys in the map in their insertion order.
	 *
	 * @yields {K} An iterator for the keys in the map.
	 */
	*keys() {
		for (let [key] of this) {
			yield key;
		}
	}

	/**
	 * Returns an iterator that yields all values in the map in their insertion order.
	 *
	 * @yields {V} An iterator for the values in the map.
	 */
	*values() {
		for (let [, value] of this) {
			yield value;
		}
	}

	/**
	 * Returns an iterator that yields all key-value pairs in the map as arrays in their insertion order.
	 *
	 * @yields {[K, V]} An iterator for the key-value pairs in the map.
	 */
	*entries() {
		for (let node = this.#head; node !== null; node = node.next) {
			yield [node.key, node.value];
		}
	}

	/**
	 * Returns an iterator that yields all key-value pairs in the map as arrays in their insertion order.
	 *
	 * @yields {[K, V]} An iterator for the key-value pairs in the map.
	 */
	*[Symbol.iterator]() {
		yield* this.entries();
	}

	/**
	 * Returns a string description of the class.
	 *
	 * @returns {string} A string description of the class.
	 */
	get [Symbol.toStringTag]() {
		return 'LinkedMap';
	}

	/**
	 * Moves the node to the end of the list.
	 * If the node is already the tail, nothing will happen.
	 * If the node is not in the map, nothing will happen.
	 * If the node is the head, the head will be updated to be the next node.
	 * If the node is not the head, the node's previous pointer will be updated to point to the node's next node.
	 * If the node is not the tail, the node's next pointer will be updated to point to null.
	 * The node will be added to the end of the list.
	 * The node's previous pointer will be updated to point to the current tail.
	 * The current tail's next pointer will be updated to point to the node.
	 *
	 * @private
	 * @param {KeyedNode<K, V>} node The node to move to the end of the list.
	 * @returns {boolean} True if the node was moved to the end of the list, false otherwise.
	 */
	#unlinkNode(node) {
		if (node === undefined) { return false }

		// Handle previous node
		if (node.previous !== null) {
			node.previous.next = node.next;
		} else {
			this.#head = node.next;
		}

		// Handle next node
		if (node.next !== null) {
			node.next.previous = node.previous;
		} else {
			this.#tail = node.previous;
		}

		// Clean up the removed node's pointers
		node.previous = null;
		node.next = null;

		return true;
	}

	/**
	 * Adds a new node to the beginning of the list.
	 * If the key already exists, the node will be moved to the beginning of the list.
	 * If the key does not exist, a new node will be created and added to the beginning of the list.
	 * If the key already exists, the node's value will be updated to the new value.
	 * If the key does not exist, the node's value will be set to the new value.
	 * If the key already exists, the node will be moved to the beginning of the list.
	 * If the key does not exist, the node will be added to the beginning of the list.
	 *
	 * @private
	 * @param {K} key The key of the node to add.
	 * @param {V} value The value of the node to add.
	 * @returns {void}
	 */
	#prependNewNode(key, value) {
		const newNode = new KeyedNode({ key, value });

		this.#map.set(key, newNode);

		if (this.#head === null) {
			this.#head = this.#tail = newNode;
		} else {
			newNode.next = this.#head;
			this.#head.previous = newNode;
			this.#head = newNode;
		}
	}

	/**
	 * Adds a new node to the end of the list.
	 * If the key already exists, the node will be moved to the end of the list.
	 * If the key does not exist, a new node will be created and added to the end of the list.
	 * If the key already exists, the node's value will be updated to the new value.
	 * If the key does not exist, the node's value will be set to the new value.
	 * If the key already exists, the node will be moved to the end of the list.
	 * If the key does not exist, the node will be added to the end of the list.
	 *
	 * @private
	 * @param {K} key The key of the node to add.
	 * @param {V} value The value of the node to add.
	 * @returns {void}
	 */
	#appendNewNode(key, value) {
		const newNode = new KeyedNode({ key, value });

		this.#map.set(key, newNode);

		if (this.#head === null) {
			this.#head = this.#tail = newNode;
		} else {
			newNode.previous = this.#tail;
			this.#tail.next = newNode;
			this.#tail = newNode;
		}
	}

	/**
	 * Moves the node to the beginning of the list.
	 * If the node is already the head, nothing will happen.
	 * If the node is not in the map, nothing will happen.
	 * If the node is the tail, the tail will be updated to be the previous node.
	 * If the node is not the tail, the node's next pointer will be updated to point to the node's previous node.
	 * If the node is not the head, the node's previous pointer will be updated to point to null.
	 * The node will be added to the beginning of the list.
	 * The node's next pointer will be updated to point to the current head.
	 * The current head's previous pointer will be updated to point to the node.
	 *
	 * @private
	 * @param {KeyedNode<K, V>} node The node to move to the beginning of the list.
	 * @returns {void}
	 */
	#moveToFirst(node) {
		if (node === undefined || node === this.#head) { return }

		this.#unlinkNode(node);

		// Add the node at the start
		node.next = this.#head;
		this.#head.previous = node;
		this.#head = node;
	}

	/**
	 * Moves the node to the end of the list.
	 * If the node is already the tail, nothing will happen.
	 * If the node is not in the map, nothing will happen.
	 * If the node is the head, the head will be updated to be the next node.
	 * If the node is not the head, the node's previous pointer will be updated to point to the node's next node.
	 * If the node is not the tail, the node's next pointer will be updated to point to null.
	 * The node will be added to the end of the list.
	 * The node's previous pointer will be updated to point to the current tail.
	 *
	 * @private
	 * @param {KeyedNode<K, V>} node The node to move to the end of the list.
	 * @returns {void}
	 */
	#moveToLast(node) {
		if (node === undefined || node === this.#tail) { return }

		this.#unlinkNode(node);

		// Add the node at the end
		node.previous = this.#tail;
		this.#tail.next = node;
		this.#tail = node;
	}
}

export default LinkedMap;