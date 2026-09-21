import { List } from './list';
import './map-upsert-polyfill';

/** A {@link Map} that can contain multiple values for the same key. */
export class MultiMap<K, V> extends Map<K, List<V>> {
	/**
	 * Replaces the values associated with a key.
	 * @param key The key to set.
	 * @param value The list of values to associate with the key.
	 * @returns The MultiMap with the updated key and value.
	 */
	override set(key: K, value: List<V>): this {
		return super.set(key, value);
	}

	/**
	 * Adds a value to the list associated with a key.
	 * @param key The key to add the value to.
	 * @param value The value to add.
	 * @returns The MultiMap with the updated key and value.
	 */
	add(key: K, value: V): this {
		super.getOrInsertComputed(key, () => new List<V>()).add(value);

		return this;
	}

	/**
	 * Gets the values associated with a key, inserting the supplied List when the key does not exist.
	 * @param key The key to get the values for.
	 * @param defaultValue The List to insert if the key does not exist.
	 * @returns The List associated with the key.
	 */
	override getOrInsert(key: K, defaultValue: List<V>): List<V> {
		return super.getOrInsert(key, defaultValue);
	}

	/**
	 * Gets the values associated with a key, computing and inserting a List when the key does not exist.
	 * @param key The key to get the values for.
	 * @param compute The function to compute the List to insert if the key does not exist.
	 * @returns The List associated with the key.
	 */
	override getOrInsertComputed(key: K, compute: (key: K) => List<V>): List<V> {
		return super.getOrInsertComputed(key, compute);
	}

	/**
	 * Finds a value for a key using a predicate function.
	 * @param key The key to find the value for.
	 * @param predicate The predicate function to use to find the value.
	 * @returns The value that satisfies the predicate, otherwise `undefined`.
	 */
	find(key: K, predicate: (value: V) => boolean): V | undefined {
		return super.get(key)?.find(predicate);
	}

	/**
	 * Checks if a key has a specific value.
	 * @param key The key to check.
	 * @param value The value to check.
	 * @returns True if the key has the value, false otherwise.
	 */
	hasValue(key: K, value: V): boolean {
		return super.get(key)?.contains(value) ?? false;
	}

	/**
	 * Removes a specific value from a key.
	 * @param key The key to remove the value from.
	 * @param value The value to remove.
	 * @returns True if the value was removed, false otherwise.
	 */
	deleteValue(key: K, value?: V): boolean {
		if (value === undefined) { return this.delete(key) }

		const values = super.get(key);

		if (values) {
			const index = values.indexOf(value);

			if (index === -1) { return false }

			values.removeAt(index);

			if (values.size === 0) { super.delete(key) }

			return true;
		}

		return false;
	}

	/**
	 * Gets the string tag for the class.
	 * @returns The string tag of the class.
	 */
	override get [Symbol.toStringTag]() {
		return 'MultiMap';
	}
}
