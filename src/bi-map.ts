/**
 * Compares values using the same equality semantics as native Map keys.
 * @param left The first value to compare.
 * @param right The second value to compare.
 * @returns Whether the values are equal using SameValueZero semantics.
 */
function sameValueZero(left: unknown, right: unknown) {
	return left === right || Object.is(left, right);
}

/**
 * A one-to-one map between keys and values. Each key and each value can appear
 * in at most one pair. Insertion order follows the most recent insertion of
 * each pair.
 */
export class BiMap<K, V> implements Iterable<[K, V]> {
	#forward: Map<K, V>;
	#reverse: Map<V, K>;

	/**
	 * Initializes a BiMap from an optional iterable of key-value entries.
	 * Conflicting entries are resolved using the same eviction rules as {@link set}.
	 * @param [entries] The key-value entries to initialize the map with.
	 */
	constructor(entries?: Iterable<readonly [K, V]>) {
		this.#forward = new Map();
		this.#reverse = new Map();

		if (entries !== undefined) {
			for (const [ key, value ] of entries) { this.set(key, value) }
		}
	}

	/**
	 * Gets the value associated with a key.
	 * @param key The key to look up.
	 * @returns The associated value, or undefined if the key is absent.
	 */
	get(key: K): V | undefined {
		return this.#forward.get(key);
	}

	/**
	 * Gets the key associated with a value.
	 * @param value The value to look up.
	 * @returns The associated key, or undefined if the value is absent.
	 */
	getKey(value: V): K | undefined {
		return this.#reverse.get(value);
	}

	/**
	 * Associates a key with a value, evicting any existing pair that conflicts
	 * by key or by value. Setting an existing pair leaves its insertion position
	 * unchanged.
	 * @param key The key to associate.
	 * @param value The value to associate.
	 * @returns This BiMap.
	 */
	set(key: K, value: V): this {
		const previousValue = this.#forward.get(key);
		const hasKey = previousValue !== undefined || this.#forward.has(key);
		const previousKey = this.#reverse.get(value);
		const hasValue = previousKey !== undefined || this.#reverse.has(value);

		if (hasKey && hasValue && sameValueZero(previousValue, value) && sameValueZero(previousKey, key)) {
			return this;
		}

		if (hasKey) {
			this.#forward.delete(key);
			this.#reverse.delete(previousValue as V);
		}

		if (hasValue) {
			this.#reverse.delete(value);
			this.#forward.delete(previousKey as K);
		}

		this.#forward.set(key, value);
		this.#reverse.set(value, key);

		return this;
	}

	/**
	 * Checks whether a key is present.
	 * @param key The key to check.
	 * @returns True if the key is present.
	 */
	has(key: K): boolean {
		return this.#forward.has(key);
	}

	/**
	 * Checks whether a value is present.
	 * @param value The value to check.
	 * @returns True if the value is present.
	 */
	hasValue(value: V): boolean {
		return this.#reverse.has(value);
	}

	/**
	 * Removes the pair associated with a key.
	 * @param key The key whose pair should be removed.
	 * @returns True if a pair was removed.
	 */
	delete(key: K): boolean {
		const value = this.#forward.get(key);

		if (value === undefined && !this.#forward.has(key)) { return false }

		this.#reverse.delete(value as V);
		this.#forward.delete(key);

		return true;
	}

	/**
	 * Removes the pair associated with a value.
	 * @param value The value whose pair should be removed.
	 * @returns True if a pair was removed.
	 */
	deleteValue(value: V): boolean {
		const key = this.#reverse.get(value);

		if (key === undefined && !this.#reverse.has(value)) { return false }

		this.#forward.delete(key as K);
		this.#reverse.delete(value);

		return true;
	}

	/**
	 * Returns a live inverse view sharing this BiMap's two backing Maps. Changes
	 * through either view are immediately visible through the other. The returned
	 * view is a separate wrapper; its iteration order follows the shared map's
	 * current insertion order.
	 * @returns A live BiMap view with keys and values reversed.
	 */
	inverse(): BiMap<V, K> {
		return BiMap.#fromMaps(this.#reverse, this.#forward);
	}

	/**
	 * Removes all pairs.
	 * @returns This BiMap.
	 */
	clear(): this {
		this.#forward.clear();
		this.#reverse.clear();

		return this;
	}

	/**
	 * Gets the number of pairs.
	 * @returns The number of pairs in this BiMap.
	 */
	get size(): number {
		return this.#forward.size;
	}

	/**
	 * Returns an iterator over keys in insertion order.
	 * @returns An iterator over keys.
	 */
	keys(): MapIterator<K> {
		return this.#forward.keys();
	}

	/**
	 * Returns an iterator over values in insertion order.
	 * @returns An iterator over values.
	 */
	values(): MapIterator<V> {
		return this.#forward.values();
	}

	/**
	 * Returns an iterator over key-value pairs in insertion order.
	 * @returns An iterator over key-value pairs.
	 */
	entries(): MapIterator<[K, V]> {
		return this.#forward.entries();
	}

	/**
	 * Calls a callback for each pair in insertion order.
	 * @param callbackfn The function called with each value, key, and this BiMap.
	 * @param [thisArg] The value to use as this when calling the callback.
	 */
	forEach(callbackfn: (value: V, key: K, map: BiMap<K, V>) => void, thisArg?: unknown): void {
		this.#forward.forEach((value, key) => callbackfn.call(thisArg, value, key, this));
	}

	/**
	 * Returns an iterator over key-value pairs in insertion order.
	 * @returns An iterator over key-value pairs.
	 */
	[Symbol.iterator](): MapIterator<[K, V]> {
		return this.entries();
	}

	/**
	 * Creates a BiMap wrapper over an existing pair of maps.
	 * @param forward The key-to-value map.
	 * @param reverse The value-to-key map.
	 * @returns A BiMap sharing the supplied maps.
	 */
	static #fromMaps<K, V>(forward: Map<K, V>, reverse: Map<V, K>): BiMap<K, V> {
		const map = new BiMap<K, V>();
		map.#forward = forward;
		map.#reverse = reverse;

		return map;
	}
}
