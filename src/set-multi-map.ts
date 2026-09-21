import './map-upsert-polyfill';

/** A {@link Map} that can contain multiple, unique, values for the same key. */
export class SetMultiMap<K, V> extends Map<K, Set<V>> {
	/**
	 * Replaces the values associated with a key.
	 * @param key The key to set.
	 * @param value The set of values to associate with the key.
	 * @returns The SetMultiMap with the updated key and value.
	 */
	override set(key: K, value: Set<V>): this {
		return super.set(key, value);
	}

	/**
	 * Adds a value to the set associated with a key.
	 * @param key The key to add the value to.
	 * @param value The value to add.
	 * @returns The SetMultiMap with the updated key and value.
	 */
	add(key: K, value: V): this {
		super.getOrInsertComputed(key, () => new Set<V>()).add(value);

		return this;
	}

	/**
	 * Gets the values associated with a key, inserting the supplied Set when the key does not exist.
	 * @param key The key to get the values for.
	 * @param defaultValue The Set to insert if the key does not exist.
	 * @returns The Set associated with the key.
	 */
	override getOrInsert(key: K, defaultValue: Set<V>): Set<V> {
		return super.getOrInsert(key, defaultValue);
	}

	/**
	 * Gets the values associated with a key, computing and inserting a Set when the key does not exist.
	 * @param key The key to get the values for.
	 * @param compute The function to compute the Set to insert if the key does not exist.
	 * @returns The Set associated with the key.
	 */
	override getOrInsertComputed(key: K, compute: (key: K) => Set<V>): Set<V> {
		return super.getOrInsertComputed(key, compute);
	}

	/**
	 * Finds a value for a key using a predicate function.
	 * @param key The key to find the value for.
	 * @param predicate The predicate function to use to find the value.
	 * @returns The value that satisfies the predicate, otherwise `undefined`.
	 */
	find(key: K, predicate: (value: V) => boolean): V | undefined {
		const values = super.get(key);

		if (values === undefined) { return undefined }

		for (const value of values) {
			if (predicate(value)) { return value }
		}

		return undefined;
	}

	/**
	 * Checks if a key has a specific value.
	 * @param key The key to check.
	 * @param value The value to check.
	 * @returns True if the key has the value, false otherwise.
	 */
	hasValue(key: K, value: V): boolean {
		return super.get(key)?.has(value) ?? false;
	}

	/**
	 * Removes a specific value from a key.
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
