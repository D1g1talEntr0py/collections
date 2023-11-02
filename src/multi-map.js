import List from './list.js';

/**
 * @template K
 * @template V
 * @typedef {Map<K, List<V>>} MultiMap
 * @extends Map
 */

/**
 * A {@link Map} that can contain multiple values for the same key.
 *
 * @template K
 * @template V
 * @type {MultiMap<K, V>}
 */
export default class MultiMap extends Map {
	/**
	 * Adds a new element with a specified key and value to the MultiMap.
	 * If an element with the same key already exists, the value will be added to the underlying {@link List}.
	 *
	 * @override
	 * @param {K} key The key to set.
	 * @param {V} value The value to add to the MultiMap
	 * @returns {MultiMap<K, V>} The MultiMap with the updated key and value.
	 */
	set(key, value) {
		super.set(key, (this.get(key) ?? new List()).add(value));

		return this;
	}

	get [Symbol.toStringTag]() {
		return 'MultiMap';
	}
}