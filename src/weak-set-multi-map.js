/**
 *
 * @typedef {Map<*, *>} MultiMap
 * @extends Map
 */
export default class WeakSetMultiMap extends Map {
	/**
	 * Adds a new element with a specified key and value to the MultiMap. If an element with the same key already exists, the value will be added to the underlying {@link Set}.
	 *
	 * @param {*} key The key to set.
	 * @param {*} value The value to add to the MultiMap
	 * @returns {MultiMap} The MultiMap with the updated key and value.
	 */
	set(key, value) {
		super.set(key, (super.get(key) ?? new WeakSet()).add(value));

		return this;
	}

	[Symbol.toStringTag]() {
		return 'WeakSetMultiMap';
	}
}