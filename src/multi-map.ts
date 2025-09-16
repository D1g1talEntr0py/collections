import { List } from './list';

/** A {@link Map} that can contain multiple values for the same key */
export class MultiMap<K, V> extends Map<K, List<V>> {
	/**
	 * Adds a new element with a specified key and value to the MultiMap.
	 * If an element with the same key already exists, the value will be added to the underlying {@link List}.
	 *
	 * @param key The key to set.
	 * @param value The value to add to the MultiMap
	 * @returns The MultiMap with the updated key and value.
	 */
	// @ts-expect-error I am overriding the set method from the Map class
	override set(key: K, value: V): MultiMap<K, V> {
		super.set(key, (this.get(key) ?? new List()).add(value));

		return this;
	}

	/**
	 * Gets the string tag for the class
	 * @returns The string tag of the class
	 */
	override get [Symbol.toStringTag]() {
		return 'MultiMap';
	}
}