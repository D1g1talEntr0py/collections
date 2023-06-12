/**
 * @template K
 * @template V
 * @typedef {Map<K, Set<V>>} SetMultiMap
 * @extends Map
 */

/**
 * A {@link Map} that can contain multiple, unique, values for the same key.
 *
 * @template K
 * @template V
 * @type {SetMultiMap<K, V>}
 */
class SetMultiMap extends Map {
	/**
	 * Adds a new element with a specified key and value to the SetMultiMap.
	 * If an element with the same key already exists, the value will be added to the underlying {@link Set}.
	 * If the value already exists in the {@link Set}, it will not be added again.
	 *
	 * @param {K} key The key to set.
	 * @param {V} value The value to add to the SetMultiMap
	 * @returns {SetMultiMap<K, V>} The SetMultiMap with the updated key and value.
	 */
	set(key, value) {
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
	hasValue(key, value) {
		const values = super.get(key);

		return values ? values.has(value) : false;
	}

	/**
	 * Removes a specific value from a specific key.
	 *
	 * @param {K} key The key to remove the value from.
	 * @param {V} value The value to remove.
	 * @returns {boolean} True if the value was removed, false otherwise.
	 */
	deleteValue(key, value) {
		const values = super.get(key);
		if (values) {
			return values.delete(value);
		}
		
		return false;
	}

	get [Symbol.toStringTag]() {
		return 'SetMultiMap';
	}
}

export default SetMultiMap;