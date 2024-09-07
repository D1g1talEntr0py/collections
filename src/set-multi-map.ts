/** A {@link Map} that can contain multiple, unique, values for the same key. */
export class SetMultiMap<K, V> extends Map<K, Set<V>>{
	/**
	 * Adds a new element with a specified key and value to the SetMultiMap.
	 * If an element with the same key already exists, the value will be added to the underlying {@link Set}.
	 * If the value already exists in the {@link Set}, it will not be added again.
	 *
	 * @param {K} key The key to set.
	 * @param {V} value The value to add to the SetMultiMap
	 * @returns {SetMultiMap<K, V>} The SetMultiMap with the updated key and value.
	 */
	// @ts-expect-error I am overriding the set method from the Map class
	override set(key: K, value: V): SetMultiMap<K, V> {
		super.set(key, (super.get(key) ?? new Set()).add(value));

		return this;
	}

	/**
	 * Checks if a specific key has a specific value.
	 *
	 * @param {K} key The key to check.
	 * @param {V} value The value to check.
	 * @returns {boolean} True if the key has the value, false otherwise.
	 */
	hasValue(key: K, value: V): boolean {
		const values = super.get(key);

		return values ? values.has(value) : false;
	}

	find(key: K, iterator: (value: V) => boolean): V | undefined {
		const values = this.get(key);

		if (values !== undefined) {
			return Array.from(values).find(iterator);
		}

		return undefined;
	}

	/**
	 * Removes a specific value from a specific key.
	 *
	 * @param {K} key The key to remove the value from.
	 * @param {V | undefined} value The value to remove.
	 * @returns {boolean} True if the value was removed, false otherwise.
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

	override get [Symbol.toStringTag](): string {
		return 'SetMultiMap';
	}
}