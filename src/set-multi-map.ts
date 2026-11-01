import { getOrInsert, getOrInsertComputed } from './internal/map-upsert';

/**
 * Creates an empty set for a newly added key.
 * @returns A new empty set.
 */
function createSet<V>(): Set<V> {
	return new Set<V>();
}

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
		getOrInsertComputed(this, key, createSet<V>).add(value);

		return this;
	}

	/**
	 * Gets the values associated with a key, inserting the supplied Set when the key does not exist.
	 * @param key The key to get the values for.
	 * @param defaultValue The Set to insert if the key does not exist.
	 * @returns The Set associated with the key.
	 */
	override getOrInsert(key: K, defaultValue: Set<V>): Set<V> {
		return getOrInsert(this, key, defaultValue);
	}

	/**
	 * Gets the values associated with a key, computing and inserting a Set when the key does not exist.
	 * @param key The key to get the values for.
	 * @param compute The function to compute the Set to insert if the key does not exist.
	 * @returns The Set associated with the key.
	 */
	override getOrInsertComputed(key: K, compute: (key: K) => Set<V>): Set<V> {
		return getOrInsertComputed(this, key, compute);
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
	 * `undefined` is treated as a value; use the inherited `delete(key)` to remove the whole key.
	 * @param key The key to remove the value from.
	 * @param value The value to remove.
	 * @returns True if the value was removed, false otherwise.
	 */
	deleteValue(key: K, value: V): boolean {
		const values = super.get(key);

		if (values) {
			const deleted = values.delete(value);

			if (values.size === 0) { super.delete(key) }

			return deleted;
		}

		return false;
	}

	/**
	 * Gets the total number of unique values across all keys.
	 * This getter iterates over every key and runs in O(number of keys).
	 * @returns The number of stored key-value associations.
	 */
	get valueCount(): number {
		let count = 0;

		for (const values of super.values()) { count += values.size }

		return count;
	}

	/**
	 * Iterates over all values in key insertion order and then value insertion order.
	 * @returns An iterator over all stored values.
	 * @yields {V} The next stored value.
	 */
	*flatValues(): IterableIterator<V> {
		for (const values of super.values()) { yield* values }
	}

	/**
	 * The string tag of the SetMultiMap.
	 * @returns The string tag of the SetMultiMap.
	 */
	override get [Symbol.toStringTag]() {
		return 'SetMultiMap';
	}
}
