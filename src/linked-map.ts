import { KeyedNode } from './keyed-node';
import { createNodeIterator, markNodeRemoved, type NodeSource } from './internal/node-iterator';

type LinkedIterator<E> = IteratorObject<E, undefined, unknown>;

/**
 * Projects a node to its key.
 * @param node The node to project.
 * @returns The node's key.
 */
function nodeKey<K, V>(node: KeyedNode<K, V>): K {
	return node.key;
}

/**
 * Projects a node to its value.
 * @param node The node to project.
 * @returns The node's value.
 */
function nodeValue<K, V>(node: KeyedNode<K, V>): V {
	return node.value;
}

/**
 * Projects a node to a new key-value entry.
 * @param node The node to project.
 * @returns The node's key-value entry.
 */
function nodeEntry<K, V>(node: KeyedNode<K, V>): [K, V] {
	return [ node.key, node.value ];
}

/** A Map that maintains an explicit linked order for its key-value pairs. */
export class LinkedMap<K, V> {
	#head: KeyedNode<K, V> | null = null;
	#tail: KeyedNode<K, V> | null = null;
	#generation: number = 0;
	#source: NodeSource<KeyedNode<K, V>> | null = null;
	readonly #map: Map<K, KeyedNode<K, V>>;

	/**
	 * Initializes a LinkedMap from an optional iterable of key-value entries.
	 * @param [entries] The key-value entries to initialize the map with.
	 */
	constructor(entries?: Iterable<readonly [K, V]>) {
		this.#map = new Map();
		if (entries !== undefined) {
			for (const [ key, value ] of entries) { this.set(key, value) }
		}
	}

	/**
	 * Retrieves the value associated with a given key.
	 * @param key The key to retrieve.
	 * @returns The value associated with the key, or undefined if the key is not in the map.
	 */
	get(key: K): V | undefined {
		return this.#map.get(key)?.value;
	}

	/**
	 * Associates the specified value with the specified key in this map.
	 * If the key already exists, its value is updated without changing its position.
	 * @param key The key with which the specified value is to be associated.
	 * @param value The value to be associated with the specified key.
	 * @returns This map.
	 */
	set(key: K, value: V): this {
		const node = this.#map.get(key);

		if (node !== undefined) {
			node.value = value;
		} else {
			this.#appendNewNode(key, value);
		}

		return this;
	}

	/**
	 * Returns a specified element from the Map object.
	 * If no element is associated with the specified key, a new element with the value `defaultValue` will be inserted into the Map and returned.
	 * @param key The key to retrieve.
	 * @param defaultValue The value to insert and return if the key is not already in the map.
	 * @returns The element associated with the specified key, which will be `defaultValue` if no element previously existed.
	 */
	getOrInsert(key: K, defaultValue: V): V {
		const node = this.#map.get(key);

		if (node !== undefined) { return node.value }

		this.#appendNewNode(key, defaultValue);

		return defaultValue;
	}

	/**
	 * Returns a specified element from the Map object.
	 * If no element is associated with the specified key, the result of passing the specified key to the `callback` function will be inserted into the Map and returned.
	 * @param key The key to retrieve.
	 * @param callback The function to compute a value to insert and return if the key is not already in the map.
	 * @returns The element associated with the specific key, which will be the newly computed value if no element previously existed.
	 */
	getOrInsertComputed(key: K, callback: (key: K) => V): V {
		const existingNode = this.#map.get(key);

		if (existingNode !== undefined) { return existingNode.value }

		const value = callback(key);
		const insertedNode = this.#map.get(key);

		if (insertedNode !== undefined) {
			insertedNode.value = value;

			return value;
		}

		this.#map.set(key, this.#createAppendedNode(key, value));

		return value;
	}

	/**
	 * Removes the mapping for a key from this map if it is present.
	 * @param key The key whose mapping is to be removed from the map.
	 * @returns True if the map contained a mapping for the specified key, false otherwise.
	 */
	delete(key: K): boolean {
		const node = this.#map.get(key);

		if (node === undefined) { return false }

		this.#unlinkNode(node);

		return this.#map.delete(key);
	}

	/**
	 * Removes the mapping for a key from this map if it is present.
	 * @deprecated Use {@link delete} instead.
	 * @param key The key whose mapping is to be removed from the map.
	 * @returns True if the map contained a mapping for the specified key, false otherwise.
	 */
	remove(key: K): boolean {
		return this.delete(key);
	}

	/**
	 * Adds a new node to the beginning of the list.
	 * If the key already exists, it will be moved to the beginning of the list.
	 * If the key does not exist, a new node will be created and added to the beginning of the list.
	 * If the list is empty, the new node will be both the head and the tail.
	 * If the list is not empty, the new node will be the head.
	 * If the key already exists, the value will be updated.
	 * @param key The key of the new node.
	 * @param value The value of the new node.
	 * @returns This map.
	 */
	addFirst(key: K, value: V): this {
		const node = this.#map.get(key);

		if (node !== undefined) {
			this.#moveToFirst(node);
			node.value = value;
		} else {
			this.#prependNewNode(key, value);
		}

		return this;
	}

	/**
	 * Adds a new node to the end of the list.
	 * If the key already exists, it will be moved to the end of the list.
	 * If the key does not exist, a new node will be created and added to the end of the list.
	 * If the list is empty, the new node will be both the head and the tail.
	 * If the list is not empty, the new node will be the tail.
	 * If the key already exists, the value will be updated.
	 * @param key The key of the new node.
	 * @param value The value of the new node.
	 * @returns This map.
	 */
	addLast(key: K, value: V): this {
		const node = this.#map.get(key);

		if (node !== undefined) {
			this.#moveToLast(node);
			node.value = value;
		} else {
			this.#appendNewNode(key, value);
		}

		return this;
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
	 * @remarks Iterators active during reordering tolerate the change, but may skip or revisit entries.
	 * @param key The key of the node to move to the beginning of the list.
	 * @returns This map.
	 */
	moveToFirst(key: K): this {
		this.#moveToFirst(this.#map.get(key));

		return this;
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
	 * @remarks Iterators active during reordering tolerate the change, but may skip or revisit entries.
	 * @param key The key of the node to move to the end of the list.
	 * @returns This map.
	 */
	moveToLast(key: K): this {
		this.#moveToLast(this.#map.get(key));

		return this;
	}

	/**
	 * Returns the value to which the first key is mapped, or undefined if this map contains no mappings.
	 * @returns The value to which the first key is mapped, or undefined if this map contains no mappings.
	 */
	getFirst(): V | undefined {
		return this.#head?.value;
	}

	/**
	 * Returns the value to which the last key is mapped, or undefined if this map contains no mappings.
	 * @returns The value to which the last key is mapped, or undefined if this map contains no mappings.
	 */
	getLast(): V | undefined {
		return this.#tail?.value;
	}

	/**
	 * Returns the first key in the map, or undefined if the map is empty.
	 * @returns The first key, or undefined if the map is empty.
	 */
	firstKey(): K | undefined {
		return this.#head?.key;
	}

	/**
	 * Returns the last key in the map, or undefined if the map is empty.
	 * @returns The last key, or undefined if the map is empty.
	 */
	lastKey(): K | undefined {
		return this.#tail?.key;
	}

	/**
	 * Returns the first entry, or undefined if the map is empty.
	 * @returns The first entry, or undefined if the map is empty.
	 */
	firstEntry(): [K, V] | undefined {
		return this.#head === null ? undefined : [ this.#head.key, this.#head.value ];
	}

	/**
	 * Returns the last entry, or undefined if the map is empty.
	 * @returns The last entry, or undefined if the map is empty.
	 */
	lastEntry(): [K, V] | undefined {
		return this.#tail === null ? undefined : [ this.#tail.key, this.#tail.value ];
	}

	/**
	 * Removes and returns the first entry, or undefined if the map is empty.
	 * @returns The removed entry, or undefined if the map is empty.
	 */
	removeFirst(): [K, V] | undefined {
		return this.#removeNode(this.#head);
	}

	/**
	 * Removes and returns the last entry, or undefined if the map is empty.
	 * @returns The removed entry, or undefined if the map is empty.
	 */
	removeLast(): [K, V] | undefined {
		return this.#removeNode(this.#tail);
	}

	/**
	 * Returns a boolean indicating whether the map contains a specific key.
	 * @param key The key to check.
	 * @returns True if the map contains the key, false otherwise.
	 */
	has(key: K): boolean {
		return this.#map.has(key);
	}

	/**
	 * Executes a provided function once for each key-value pair in the map.
	 * The callback receives the value, key, and this map, matching the native {@link Map} convention.
	 * @param callback Function to execute for each key-value pair.
	 * @param [thisArg] The value to use as `this` when executing the callback.
	 */
	forEach(callback: (value: V, key: K, thisMap: LinkedMap<K, V>) => void, thisArg?: unknown): void {
		for (let node = this.#head; node !== null; node = node.next) { callback.call(thisArg, node.value, node.key, this) }
	}

	/**
	 * Removes all of the mappings from this map. The map will be empty after this call returns.
	 * @returns This map.
	 */
	clear(): this {
		this.#map.clear();
		this.#head = this.#tail = null;
		this.#generation++;

		return this;
	}

	/**
	 * Returns the number of key-value pairs in the map.
	 * @returns The number of key-value pairs in the map.
	 */
	get size(): number {
		return this.#map.size;
	}

	/**
	 * Returns an iterator that yields all keys in the map in their insertion order.
	 * The iterator follows the map's current linked order.
	 * @remarks Removed entries are skipped; after `clear()`, iteration resumes with newly added entries. Once done, an iterator stays done. Moving entries while iterating may skip or revisit entries.
	 * @returns An iterator for the keys in the map.
	 */
	keys(): LinkedIterator<K> {
		return createNodeIterator(this.#nodeSource(), nodeKey<K, V>);
	}

	/**
	 * Returns an iterator that yields all values in the map in their insertion order.
	 * The iterator follows the map's current linked order.
	 * @remarks Removed entries are skipped; after `clear()`, iteration resumes with newly added entries. Once done, an iterator stays done. Moving entries while iterating may skip or revisit entries.
	 * @returns An iterator for the values in the map.
	 */
	values(): LinkedIterator<V> {
		return createNodeIterator(this.#nodeSource(), nodeValue<K, V>);
	}

	/**
	 * Returns an iterator that yields all key-value pairs in the map as arrays in their insertion order.
	 * The iterator follows the map's current linked order.
	 * @remarks Removed entries are skipped; after `clear()`, iteration resumes with newly added entries. Once done, an iterator stays done. Moving entries while iterating may skip or revisit entries.
	 * @returns An iterator for the key-value pairs in the map.
	 */
	entries(): LinkedIterator<[K, V]> {
		return this[Symbol.iterator]();
	}

	/**
	 * Returns an iterator that yields all key-value pairs in the map as arrays in their insertion order.
	 * The iterator follows the map's current linked order.
	 * @remarks Removed entries are skipped; after `clear()`, iteration resumes with newly added entries. Once done, an iterator stays done. Moving entries while iterating may skip or revisit entries.
	 * @returns An iterator for the key-value pairs in the map.
	 */
	[Symbol.iterator](): LinkedIterator<[K, V]> {
		return createNodeIterator(this.#nodeSource(), nodeEntry<K, V>);
	}

	/**
	 * Returns a string description of the class.
	 * @returns A string description of the class.
	 */
	get [Symbol.toStringTag]() {
		return 'LinkedMap';
	}

	/**
	 * Gets the live head and generation accessors shared by this map's iterators, creating them on first use.
	 * @returns The node source for this map.
	 */
	#nodeSource(): NodeSource<KeyedNode<K, V>> {
		return this.#source ??= {
			/** @returns The current head node. */
			head: () => this.#head,
			/** @returns The current clear generation. */
			generation: () => this.#generation
		};
	}

	/**
	 * Removes a node from the list and the map.
	 * @param node The node to remove.
	 * @returns The removed entry, or undefined when no node was given.
	 */
	#removeNode(node: KeyedNode<K, V> | null): [K, V] | undefined {
		if (node === null) { return undefined }

		this.#unlinkNode(node);
		this.#map.delete(node.key);

		return [ node.key, node.value ];
	}

	/**
	 * Unlinks a node from the list.
	 * @param node The node to unlink.
	 * @param removed Whether to mark the node as removed for active iterators.
	 */
	#unlinkNode(node: KeyedNode<K, V>, removed: boolean = true) {
		const previous = node.previous;

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

		// Keep the forward link on removed nodes so parked iterators can advance.
		node.previous = null;
		if (removed) {
			markNodeRemoved(node, previous);
		} else {
			node.next = null;
		}
	}

	/**
	 * Creates and links a new node at the beginning of the list.
	 * @param key The key to associate with the node.
	 * @param value The value to store in the node.
	 */
	#prependNewNode(key: K, value: V) {
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
	 * Creates and links a new node at the end of the list, registering it in the map.
	 * @param key The key to associate with the node.
	 * @param value The value to store in the node.
	 */
	#appendNewNode(key: K, value: V) {
		this.#map.set(key, this.#createAppendedNode(key, value));
	}

	/**
	 * Creates a node and links it at the end of the list without registering it in the map.
	 * @param key The key of the node to create.
	 * @param value The value of the node to create.
	 * @returns The newly linked node.
	 */
	#createAppendedNode(key: K, value: V): KeyedNode<K, V> {
		const newNode = new KeyedNode({ key, value });

		if (this.#head === null) {
			this.#head = this.#tail = newNode;
		} else {
			newNode.previous = this.#tail;
			this.#tail!.next = newNode;
			this.#tail = newNode;
		}

		return newNode;
	}

	/**
	 * Moves an existing node to the beginning of the list.
	 * @param node The node to move.
	 */
	#moveToFirst(node?: KeyedNode<K, V>) {
		if (node === undefined || node === this.#head) { return }

		this.#unlinkNode(node, false);

		// Add the node at the start; a node other than the head implies a non-null head.
		node.next = this.#head;

		this.#head!.previous = node;
		this.#head = node;
	}

	/**
	 * Moves an existing node to the end of the list.
	 * @param node The node to move.
	 */
	#moveToLast(node?: KeyedNode<K, V>) {
		if (node === undefined || node === this.#tail) { return }

		this.#unlinkNode(node, false);

		// Add the node at the end; a node other than the tail implies a non-null tail.
		node.previous = this.#tail;

		this.#tail!.next = node;
		this.#tail = node;
	}
}