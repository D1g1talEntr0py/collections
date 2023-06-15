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
			this.moveToLast(key);
		} else {
			const newNode = new KeyedNode({ key, value });

			if (this.#head === null) {
				this.#head = this.#tail = newNode;
			} else {
				newNode.previous = this.#tail;
				this.#tail.next = newNode;
				this.#tail = newNode;
			}

			this.#map.set(key, newNode);
		}
	}

	/**
	 * Removes the mapping for a key from this map if it is present.
	 *
	 * @param {K} key The key whose mapping is to be removed from the map.
	 * @returns {boolean} True if the map contained a mapping for the specified key, false otherwise.
	 */
	remove(key) {
		const node = this.#map.get(key);

		if (node === undefined) { return false }

		if (node.previous !== null) {
			node.previous.next = node.next;
		} else {
			this.#head = node.next;
			if (node.next !== null) {
				node.next.previous = null;
			}
		}

		if (node.next !== null) {
			node.next.previous = node.previous;
		} else {
			this.#tail = node.previous;
			if (node.previous !== null) {
				node.previous.next = null;
			}
		}

		return this.#map.delete(key);
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
		if (this.#map.has(key)) {
			this.moveToFirst(key); // if the key exists, move it to first
			this.#map.get(key).value = value; // update the value
		} else {
			const node = new KeyedNode({ key, value });

			if (this.#head === null) {
				this.#head = this.#tail = node;
			} else {
				node.next = this.#head;
				this.#head.previous = node;
				this.#head = node;
			}

			this.#map.set(key, node);
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
		if (this.#map.has(key)) {
			this.moveToLast(key); // if the key exists, move it to last
			this.#map.get(key).value = value; // update the value
		} else {
			const node = new KeyedNode({ key, value });

			if (this.#head === null) {
				this.#head = this.#tail = node;
			} else {
				node.previous = this.#tail;
				this.#tail.next = node;
				this.#tail = node;
			}

			this.#map.set(key, node);
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
		const node = this.#map.get(key);

		if (node === undefined || node === this.#head) { return }

		node.previous.next = node.next;

		if (node.next !== null) {
			node.next.previous = node.previous;
		} else {
			this.#tail.previous.next = null;
			this.#tail = node.previous;
		}

		node.previous = null;
		node.next = this.#head;
		this.#head.previous = node; // update the previous pointer of the new head
		this.#head = node;
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
		const node = this.#map.get(key);

		if (node === undefined || node === this.#tail) { return }

		if (node.previous !== null) {
			node.previous.next = node.next;
		} else {
			this.#head = node.next;
		}

		node.next.previous = node.previous;

		// Move the node to the end of the list
		node.previous = this.#tail;
		node.next = null;

		this.#tail.next = node;
		this.#tail = node;
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
		for (let [key] of this.entries()) {
			yield key;
		}
	}

	/**
	 * Returns an iterator that yields all values in the map in their insertion order.
	 *
	 * @yields {V} An iterator for the values in the map.
	 */
	*values() {
		for (let [, value] of this.entries()) {
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
	 * Executes a provided function once for each key-value pair in the map.
	 *
	 * @param {function(V, K, LinkedMap<K, V>): void} callback - Function to execute for each key-value pair.
	 * @param {any} [thisArg=this] - Value to use as `this` when executing the callback.
	 * @returns {void}
	 */
	forEach(callback, thisArg = this) {
		for (let [key, value] of this.entries()) {
			callback.call(thisArg, value, key, this);
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
}

export default LinkedMap;