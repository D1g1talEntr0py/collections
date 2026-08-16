import { KeyedNode } from './keyed-node';

type LinkedIterator<E> = IterableIterator<E> & {
	return: (value?: void) => IteratorResult<E, void>;
	throw: (error?: unknown) => never;
};

/**
 * Creates an iterator over a keyed node chain's keys.
 * @param first The first node to visit.
 * @returns An iterator over node keys.
 */
const createKeyIterator = <K, V>(first: KeyedNode<K, V> | null): LinkedIterator<K | null> => {
	let node = first;

	return {
		/** @returns This iterator. */
		[Symbol.iterator]() { return this },
		/** @returns The next iteration result. */
		next() {
			if (node === null) { return { done: true, value: undefined } }

			const current = node;
			node = current.next;

			return { done: false, value: current.key };
		},
		/**
		 * Completes iteration.
		 * @param _value The optional completion value.
		 * @returns A completed iteration result.
		 */
		return(_value?: void) {
			node = null;

			return { done: true, value: undefined };
		},
		/**
		 * Stops iteration and throws the provided error.
		 * @param error The error to throw.
		 */
		throw(error?: unknown): never {
			node = null;
			throw error;
		}
	};
};

/**
 * Creates an iterator over a keyed node chain's values.
 * @param first The first node to visit.
 * @returns An iterator over node values.
 */
const createValueIterator = <K, V>(first: KeyedNode<K, V> | null): LinkedIterator<V | null> => {
	let node = first;

	return {
		/** @returns This iterator. */
		[Symbol.iterator]() { return this },
		/** @returns The next iteration result. */
		next() {
			if (node === null) { return { done: true, value: undefined } }

			const current = node;
			node = current.next;

			return { done: false, value: current.value };
		},
		/**
		 * Completes iteration.
		 * @param _value The optional completion value.
		 * @returns A completed iteration result.
		 */
		return(_value?: void) {
			node = null;

			return { done: true, value: undefined };
		},
		/**
		 * Stops iteration and throws the provided error.
		 * @param error The error to throw.
		 */
		throw(error?: unknown): never {
			node = null;
			throw error;
		}
	};
};

/**
 * Creates an iterator over a keyed node chain's entries.
 * @param first The first node to visit.
 * @returns An iterator over node entries.
 */
const createEntryIterator = <K, V>(first: KeyedNode<K, V> | null): LinkedIterator<[K | null, V | null]> => {
	let node = first;

	return {
		/** @returns This iterator. */
		[Symbol.iterator]() { return this },
		/** @returns The next iteration result. */
		next() {
			if (node === null) { return { done: true, value: undefined } }

			const current = node;
			node = current.next;

			return { done: false, value: [ current.key, current.value ] };
		},
		/**
		 * Completes iteration.
		 * @param _value The optional completion value.
		 * @returns A completed iteration result.
		 */
		return(_value?: void) {
			node = null;

			return { done: true, value: undefined };
		},
		/**
		 * Stops iteration and throws the provided error.
		 * @param error The error to throw.
		 */
		throw(error?: unknown): never {
			node = null;
			throw error;
		}
	};
};

/** A Map that maintains an explicit linked order for its key-value pairs. */
export class LinkedMap<K, V> {
	#head: KeyedNode<K, V> | null = null;
	#tail: KeyedNode<K, V> | null = null;
	readonly #map: Map<K, KeyedNode<K, V>>;

	/** Initializes an empty LinkedMap. */
	constructor() {
		this.#map = new Map();
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
	 * If the key already exists, its value is updated and the key is moved to the end of the order.
	 * @param key The key with which the specified value is to be associated.
	 * @param value The value to be associated with the specified key.
	 */
	set(key: K, value: V): void {
		const node = this.#map.get(key);

		if (node !== undefined) {
			node.value = value;
			this.#moveToLast(node);
		} else {
			this.#appendNewNode(key, value);
		}
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
		const node = this.#map.get(key);

		if (node !== undefined) { return node.value }

		const value = callback(key);
		this.#appendNewNode(key, value);

		return value;
	}

	/**
	 * Removes the mapping for a key from this map if it is present.
	 * @param key The key whose mapping is to be removed from the map.
	 * @returns True if the map contained a mapping for the specified key, false otherwise.
	 */
	remove(key: K | null): boolean {
		if (key === null) { return false }

		return this.#unlinkNode(this.#map.get(key)) ? this.#map.delete(key) : false;
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
	 */
	addFirst(key: K, value: V): void {
		const node = this.#map.get(key);

		if (node !== undefined) {
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
	 * @param key The key of the new node.
	 * @param value The value of the new node.
	 */
	addLast(key: K, value: V): void {
		const node = this.#map.get(key);

		if (node !== undefined) {
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
	 * @param key The key of the node to move to the beginning of the list.
	 */
	moveToFirst(key: K): void {
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
	 * @param key The key of the node to move to the end of the list.
	 */
	moveToLast(key: K): void {
		this.#moveToLast(this.#map.get(key));
	}

	/**
	 * Returns the value to which the first key is mapped, or null if this map contains no mappings.
	 * @returns The value to which the first key is mapped, or null if this map contains no mappings.
	 */
	getFirst(): V | null {
		return this.#head?.value ?? null;
	}

	/**
	 * Returns the value to which the last key is mapped, or null if this map contains no mappings.
	 * @returns The value to which the last key is mapped, or null if this map contains no mappings.
	 */
	getLast(): V | null {
		return this.#tail?.value ?? null;
	}

	/**
	 * Removes the first key and its corresponding value from this map.
	 * If the map is empty, nothing will happen.
	 * If the map is not empty, the head will be updated to be the next node.
	 * If the map is not empty and the head is not null, the head's previous pointer will be updated to point to null.
	 * The node will be removed from the map.
	 * The node's previous and next pointers will be updated to point to null.
	 * @returns True if the first key and its corresponding value were removed, false otherwise.
	 */
	removeFirst(): boolean {
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
	 * @returns True if the last key and its corresponding value were removed, false otherwise.
	 */
	removeLast(): boolean {
		return this.#tail === null ? false : this.remove(this.#tail.key);
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
	 * @param [thisArg] The value to use as `this` when executing the callback. If omitted, this map is used.
	 */
	forEach(callback: (value: V | null, key: K | null, thisArg: LinkedMap<K, V>) => void, thisArg: unknown = this): void {
		for (let node = this.#head; node !== null; node = node.next) {
			callback.call(thisArg, node.value, node.key, this);
		}
	}

	/** Removes all of the mappings from this map. The map will be empty after this call returns. */
	clear(): void {
		this.#map.clear();
		this.#head = this.#tail = null;
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
	 * @returns An iterator for the keys in the map.
	 */
	keys(): LinkedIterator<K | null> {
		return createKeyIterator(this.#head);
	}

	/**
	 * Returns an iterator that yields all values in the map in their insertion order.
	 * The iterator follows the map's current linked order.
	 * @returns An iterator for the values in the map.
	 */
	values(): LinkedIterator<V | null> {
		return createValueIterator(this.#head);
	}

	/**
	 * Returns an iterator that yields all key-value pairs in the map as arrays in their insertion order.
	 * The iterator follows the map's current linked order.
	 * @returns An iterator for the key-value pairs in the map.
	 */
	entries(): LinkedIterator<[K | null, V | null]> {
		return this[Symbol.iterator]();
	}

	/**
	 * Returns an iterator that yields all key-value pairs in the map as arrays in their insertion order.
	 * The iterator follows the map's current linked order.
	 * @returns An iterator for the key-value pairs in the map.
	 */
	[Symbol.iterator](): LinkedIterator<[K | null, V | null]> {
		return createEntryIterator(this.#head);
	}

	/**
	 * Returns a string description of the class.
	 * @returns A string description of the class.
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
	 * @param node The node to move to the end of the list.
	 * @returns True if the node was moved to the end of the list, false otherwise.
	 */
	#unlinkNode(node?: KeyedNode<K, V>) {
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
	 * @param key The key of the node to add.
	 * @param value The value of the node to add.
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
	 * Adds a new node to the end of the list.
	 * If the key already exists, the node will be moved to the end of the list.
	 * If the key does not exist, a new node will be created and added to the end of the list.
	 * If the key already exists, the node's value will be updated to the new value.
	 * If the key does not exist, the node's value will be set to the new value.
	 * If the key already exists, the node will be moved to the end of the list.
	 * If the key does not exist, the node will be added to the end of the list.
	 * @param key The key of the node to add.
	 * @param value The value of the node to add.
	 */
	#appendNewNode(key: K, value: V) {
		const newNode = new KeyedNode({ key, value });

		this.#map.set(key, newNode);

		if (this.#head === null) {
			this.#head = this.#tail = newNode;
		} else {
			newNode.previous = this.#tail;
			this.#tail!.next = newNode;
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
	 * @param node The node to move to the beginning of the list.
	 */
	#moveToFirst(node?: KeyedNode<K, V>) {
		if (node === undefined || node === this.#head) { return }

		this.#unlinkNode(node);

		// Add the node at the start
		node.next = this.#head;
		this.#head!.previous = node;
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
	 * @param node The node to move to the end of the list.
	 */
	#moveToLast(node?: KeyedNode<K, V>) {
		if (node === undefined || node === this.#tail) { return }

		this.#unlinkNode(node);

		// Add the node at the end
		node.previous = this.#tail;
		this.#tail!.next = node;
		this.#tail = node;
	}
}