import LinkedList from './linked-list.js';

/**
 * JavaScript implementation of a Least Recently Used(LRU) Cache using a doubly linked list.
 *
 * @template K
 * @template V
 * @type {EvictingCache<K, V>}
 */
class EvictingCache {
	/** @type {number} */
	#capacity;
	/** @type {Map<K, V>} */
	#cache = new Map();
	/** @type {LinkedList<K>} */
	#keyList = new LinkedList(LinkedList.Type.Doubly);

	/**
	 * Creates a new LRU Cache with the given capacity.
	 *
	 * @param {number} capacity The maximum number of key-value pairs the cache can hold.
	 */
	constructor(capacity) {
		this.#capacity = capacity;
	}

	/**
	 * Returns the value associated with the given key from the cache and updates the LRU order.
	 *
	 * @param {K} key The key to get the value for.
	 * @returns {V|null} The associated value if the key is in the cache, or null otherwise.
	 */
	get(key) {
		const value = this.#cache.get(key);
		if (!value) return null;

		this.#moveToFront(key);

		return value;
	}

	/**
	 * Adds a new key-value pair to the cache and updates the LRU order.
	 * If adding the new pair will exceed the capacity, removes the least recently used pair from the cache.
	 *
	 * @param {K} key The key to add.
	 * @param {V} value The value to add.
	 */
	put(key, value) {
		if (this.#cache.has(key)) {
			// Key is already in the cache, update the value and move the key to the front
			this.#cache.set(key, value);
			this.#moveToFront(key);
		} else {
			// Key is not in the cache, add a new key to the front
			if (this.#cache.size === this.#capacity) {
				// Cache is at capacity, remove the least recently used key-value pair
				this.evict();
			}

			this.#keyList.addFirst(key);
			this.#cache.set(key, value);
		}
	}

	/**
	 * Removes the least recently used key-value pair from the cache.
	 *
	 * @returns {boolean} True if an item was removed, false otherwise.
	 */
	evict() {
		if (this.#keyList.size === 0) return false;

		const leastRecentlyUsedKey = this.#keyList.getLast();
		this.#keyList.removeLast();
		this.#cache.delete(leastRecentlyUsedKey);

		return true;
	}

	/**
	 * Clears the cache and the LRU list.
	 *
	 * @returns {void}
	 */
	clear() {
		this.#cache.clear();
		this.#keyList.clear();
	}

	/**
	 * Gets the capacity of the cache.
	 * This is the maximum number of key-value pairs the cache can hold.
	 * This is not the number of key-value pairs in the cache.
	 *
	 * @readonly
	 * @returns {number} The capacity of the cache.
	 */
	capacity() {
		return this.#capacity;
	}

	/**
	 * Gets the size of the cache.
	 * This is the number of key-value pairs in the cache.
	 * This is not the capacity of the cache.
	 * The capacity is the maximum number of key-value pairs the cache can hold.
	 * The size is the number of key-value pairs currently in the cache.
	 * The size will be less than or equal to the capacity.
	 *
	 * @returns {number} The size of the cache.
	 */
	size() {
		return this.#cache.size;
	}

	/**
	 * Moves the given key to the front of the LRU list.
	 *
	 * @private
	 * @param {K} key The key to move.
	 */
	#moveToFront(key) {
		// Remove the key from its current position and add it to the front
		this.#keyList.remove(key);
		this.#keyList.addFirst(key);
	}

	/**
	 * Gets the description of the object.
	 *
	 * @override
	 * @returns {string} The description of the object.
	 */
	get [Symbol.toStringTag]() {
		return 'EvictingCache';
	}
}

export default EvictingCache;