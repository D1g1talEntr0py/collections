/**
 * A simple cache class that uses a plain object as the underlying data structure.
 *
 * @template V The type of the values.
 * @type {Cache<string, V>} The cache class.
 */
class Cache {
	/** @type {Object<string, V>} */
	#entries;
	/** @type {number} */
	#size;

	constructor() {
		this.#entries = Object.create(null);
		this.#size = 0;
	}

	/**
	 * Returns true if the given key is in the cache, false otherwise.
	 *
	 * @param {string} key The key to check.
	 * @returns {boolean} True if the key is in the cache, false otherwise.
	 */
	has(key) {
		return key in this.#entries;
	}

	/**
	 * Returns the value associated with the given key from the cache.
	 * If the key is not in the cache, returns null.
	 *
	 * @param {string} key The key to get the value for.
	 * @returns {V|null} The associated value if the key is in the cache, or null otherwise.
	 */
	get(key) {
		return this.#entries[key];
	}

	/**
	 * Adds a new key-value pair to the cache.
	 * If the key is already in the cache, updates the value.
	 *
	 * @param {string} key The key to add.
	 * @param {V} value The value to add.
	 * @returns {void}
	 */
	set(key, value) {
		if (!this.has(key)) { this.#size++ }
		this.#entries[key] = value;
	}

	/**
	 * Returns the value associated with the given key from the cache.
	 * If the key is not in the cache, sets the value to the given default and returns it.
	 * This is equivalent to `cache.has(key) ? cache.get(key) : cache.set(key, defaultValue)`.
	 *
	 * @param {string} key The key to get the value for.
	 * @param {V} value The value to set if the key is not in the cache.
	 * @returns {V} The associated value if the key is in the cache, or the default value otherwise.
	 */
	getOrSet(key, value) {
		if (!this.has(key)) {	this.set(key, value) }

		return this.#entries[key];
	}

	/**
	 * Removes the given key from the cache.
	 * If the key is not in the cache, does nothing.
	 *
	 * @param {string} key The key to remove.
	 * @returns {void}
	 */
	delete(key) {
		if (this.has(key)) { this.#size-- }
		delete this.#entries[key];
	}

	/**
	 * Removes all key-value pairs from the cache.
	 *
	 * @returns {void}
	 */
	clear() {
		this.#entries = Object.create(null);
		this.#size = 0;
	}

	/**
	 * Returns the number of key-value pairs in the cache.
	 *
	 * @readonly
	 * @returns {number} The number of key-value pairs in the cache.
	 */
	get size() {
		return this.#size;
	}

	/**
	 * Returns the default string description of the class.
	 *
	 * @readonly
	 * @override
	 * @returns {string} The default string description of the class.
	 */
	get [Symbol.toStringTag]() {
		return 'Cache';
	}
}

export default Cache;