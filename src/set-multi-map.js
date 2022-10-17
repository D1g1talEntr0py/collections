/**
 *
 * @typedef {Map<*, *>} SetMultiMap
 * @extends Map
 */
export default class SetMultiMap extends Map {
	/**
	 * Adds a new element with a specified key and value to the SetMultiMap. If an element with the same key already exists, the value will be added to the underlying {@link Set}.
	 *
	 * @param {*} key The key to set.
	 * @param {*} value The value to add to the SetMultiMap
	 * @returns {SetMultiMap} The SetMultiMap with the updated key and value.
	 */
	set(key, value) {
		super.set(key, (super.get(key) ?? new Set()).add(value));

		return this;
	}

	[Symbol.toStringTag]() {
		return 'SetMultiMap';
	}
}