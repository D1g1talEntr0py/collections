/** A {@link Map} that can contain multiple, unique, values for the same key. */
export class SetMultiMap<K, V> extends Map<K, Set<V>>{
	/**
	 * Adds a new element with a specified key and value to the SetMultiMap.
	 * If an element with the same key already exists, the value will be added to the underlying {@link Set}.
	 * If the value already exists in the {@link Set}, it will not be added again.
	 *
	 * @param key - The key to set.
	 * @param value - The value to add to the SetMultiMap.
	 * @returns The SetMultiMap with the updated key and value.
	 */
	override set(key: K, value: V): this;
	/**
	 * Adds a new Set with a specified key and value to the SetMultiMap.
	 * If an element with the same key already exists, the value will be added to the underlying {@link Set}.
	 * If the value already exists in the {@link Set}, it will not be added again.
	 *
	 * @param key - The key to set.
	 * @param value - The set of values to add to the SetMultiMap.
	 * @returns The SetMultiMap with the updated key and value.
	 */
	override set(key: K, value: Set<V>): this;
	/**
	 * Adds a new element with a specified key and value to the SetMultiMap.
	 * If an element with the same key already exists, the value will be added to the underlying {@link Set}.
	 * If the value already exists in the {@link Set}, it will not be added again.
	 *
	 * @param key The key to set.
	 * @param value The value to add to the SetMultiMap
	 * @returns The SetMultiMap with the updated key and value.
	 */
	override set(key: K, value: V | Set<V>) {
		if (value instanceof Set) {
			super.set(key, value);
		} else {
			const values = super.get(key);
			if (values === undefined) {
				super.set(key, new Set<V>().add(value));
			} else {
				values.add(value);
			}
		}

		return this;
	}

	/**
	 * Gets the values associated with the specified key. If the key does not exist, it wraps the default value in a Set, inserts it, and returns that Set.
	 * @param key The key to get the value for.
	 * @param defaultValue The value to wrap in a Set and insert if the key does not exist.
	 * @returns The Set associated with the specified key, whether it was inserted or already existed.
	 */
	getOrInsert(key: K, defaultValue: V): Set<V>;

	/**
	 * Gets the values associated with the specified key. If the key does not exist, it inserts the supplied Set and returns it.
	 * @param key The key to get the value for.
	 * @param defaultValue The Set to insert if the key does not exist.
	 * @returns The Set associated with the specified key, whether it was inserted or already existed.
	 */
	getOrInsert(key: K, defaultValue: Set<V>): Set<V>;

	/**
	 * Gets the values associated with the specified key. If the key does not exist, it inserts the default value or Set and returns the resulting Set.
	 * @param key The key to get the value for.
	 * @param defaultValue The value or Set to insert if the key does not exist.
	 * @returns The Set associated with the specified key, whether it was inserted or already existed.
	 */
	getOrInsert(key: K, defaultValue: V | Set<V>): Set<V> {
		const values = super.get(key);

		if (values !== undefined) { return values }

		const newSet = defaultValue instanceof Set ? defaultValue : new Set<V>().add(defaultValue);
		super.set(key, newSet);

		return newSet;
	}

	/**
	 * Gets the values associated with the specified key. If the key does not exist, it computes a value, wraps it in a Set, inserts it, and returns that Set.
	 * @param key The key to get the value for.
	 * @param compute The function to compute the value to wrap in a Set and insert if the key does not exist.
	 * @returns The Set associated with the specified key, whether it was inserted or already existed.
	 */
	getOrInsertComputed(key: K, compute: (key: K) => V): Set<V>;

	/**
	 * Gets the values associated with the specified key. If the key does not exist, it computes a Set, inserts it, and returns it.
	 * @param key The key to get the value for.
	 * @param compute The function to compute the Set to insert if the key does not exist.
	 * @returns The Set associated with the specified key, whether it was inserted or already existed.
	 */
	getOrInsertComputed(key: K, compute: (key: K) => Set<V>): Set<V>;

	/**
	 * Gets the values associated with the specified key. If the key does not exist, it computes a value or Set, inserts the resulting Set, and returns it.
	 * @param key The key to get the value for.
	 * @param compute The function to compute the value or Set to insert if the key does not exist.
	 * @returns The Set associated with the specified key, whether it was inserted or already existed.
	 */
	getOrInsertComputed(key: K, compute: (key: K) => V | Set<V>): Set<V> {
		const values = super.get(key);

		if (values !== undefined) { return values }

		const defaultValue = compute(key);
		const newSet = defaultValue instanceof Set ? defaultValue : new Set<V>().add(defaultValue);
		super.set(key, newSet);

		return newSet;
	}

	/**
	 * Finds a specific value for a specific key using an iterator function.
	 * @param key The key to find the value for.
	 * @param iterator The iterator function to use to find the value.
	 * @returns The value for the specified key
	 */
	find(key: K, iterator: (value: V) => boolean): V | undefined {
		const values = super.get(key);

		if (values === undefined) { return undefined }

		for (const value of values) {
			if (iterator(value)) { return value }
		}

		return undefined;
	}

	/**
	 * Checks if a specific key has a specific value.
	 *
	 * @param key The key to check.
	 * @param value The value to check.
	 * @returns True if the key has the value, false otherwise.
	 */
	hasValue(key: K, value: V): boolean {
		return super.get(key)?.has(value) ?? false;
	}

	/**
	 * Removes a specific value from a specific key.
	 * @param key The key to remove the value from.
	 * @param value The value to remove.
	 * @returns True if the value was removed, false otherwise.
	 */
	deleteValue(key: K, value: V | undefined): boolean {
		if (value === undefined) { return this.delete(key) }

		const values = super.get(key);
		if (values) {
			const deleted = values.delete(value);

			if (values.size === 0) { super.delete(key) }

			return deleted;
		}

		return false;
	}

	/**
	 * The string tag of the SetMultiMap.
	 * @returns The string tag of the SetMultiMap.
	 */
	override get [Symbol.toStringTag]() {
		return 'SetMultiMap';
	}
}