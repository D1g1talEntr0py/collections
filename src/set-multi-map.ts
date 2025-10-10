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
	override set(key: K, value: V | Set<V>): SetMultiMap<K, V> {
		super.set(key, value instanceof Set ? value : (super.get(key) ?? new Set<V>()).add(value));

		return this;
	}

	/**
	 * Finds a specific value for a specific key using an iterator function.
	 * @param key The key to find the value for.
	 * @param iterator The iterator function to use to find the value.
	 * @returns The value for the specified key
	 */
	find(key: K, iterator: (value: V) => boolean): V | undefined {
		const values = this.get(key);

		if (values !== undefined) {
			return Array.from(values).find(iterator);
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
		const values = super.get(key);

		return values ? values.has(value) : false;
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

			if (values.size === 0) {
				super.delete(key);
			}

			return deleted;
		}

		return false;
	}

	/**
	 * The string tag of the SetMultiMap.
	 * @returns The string tag of the SetMultiMap.
	 */
	override get [Symbol.toStringTag](): string {
		return 'SetMultiMap';
	}
}