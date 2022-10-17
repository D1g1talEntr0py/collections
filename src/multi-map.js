import List from './list.js';

/**
 *
 * @template K
 * @template V
 * @typedef {Map<K, V>} MultiMap
 * @extends Map
 */
export default class MultiMap extends Map {
	/**
	 * Adds a new element with a specified key and value to the MultiMap.
	 * If an element with the same key already exists, the value will be added to the underlying {@link List}.
	 *
	 * @override
	 * @template K
	 * @template V
	 * @param {K} key The key to set.
	 * @param {V} value The value to add to the MultiMap
	 * @returns {MultiMap<K, V>} The MultiMap with the updated key and value.
	 */
	set(key, value) {
		super.set(key, (this.get(key) ?? new List()).add(value));

		return this;
	}

	[Symbol.toStringTag]() {
		return 'MultiMap';
	}
}