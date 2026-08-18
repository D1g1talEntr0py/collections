import { List } from './list';
import './map-upsert-polyfill';

/** A {@link Map} that can contain multiple values for the same key */
export class MultiMap<K, V> extends Map<K, List<V>> {
	/**
	 * Adds a new element with a specified key and value to the MultiMap.
	 * If an element with the same key already exists, the value will be added to the underlying {@link List}.
	 * @param key - The key to set.
	 * @param value - The value to add to the MultiMap.
	 * @returns The MultiMap with the updated key and value.
	 */
	override set(key: K, value: V): this;

	/**
	 * Adds a new List with a specified key and value to the MultiMap.
	 * If an element with the same key already exists, the value will be added to the underlying {@link List}.
	 * @param key The key to set.
	 * @param value The list of values to add to the MultiMap.
	 * @returns The MultiMap with the updated key and value.
	 */
	override set(key: K, value: List<V>): this;

	/**
	 * Adds a new element with a specified key and value to the MultiMap.
	 * If an element with the same key already exists, the value will be added to the underlying {@link List}.
	 * @param key The key to set.
	 * @param value The value to add to the MultiMap
	 * @returns The MultiMap with the updated key and value.
	 */
	override set(key: K, value: V | List<V>) {
		if (value instanceof List) {
			super.set(key, value);
		} else {
			const values = super.get(key);
			if (values === undefined) {
				super.set(key, new List<V>().add(value));
			} else {
				values.add(value);
			}
		}

		return this;
	}

	/**
	 * Gets the values associated with the specified key. If the key does not exist, it wraps the default value in a List, inserts it, and returns that List.
	 * @param key The key to get the value for.
	 * @param defaultValue The value to wrap in a List and insert if the key does not exist.
	 * @returns The List associated with the specified key, whether it was inserted or already existed.
	 */
	override getOrInsert(key: K, defaultValue: V): List<V>;

	/**
	 * Gets the values associated with the specified key. If the key does not exist, it inserts the supplied List and returns it.
	 * @param key The key to get the value for.
	 * @param defaultValue The List to insert if the key does not exist.
	 * @returns The List associated with the specified key, whether it was inserted or already existed.
	 */
	override getOrInsert(key: K, defaultValue: List<V>): List<V>;

	/**
	 * Gets the values associated with the specified key. If the key does not exist, it inserts the default value or List and returns the resulting List.
	 * @param key The key to get the value for.
	 * @param defaultValue The value or List to insert if the key does not exist.
	 * @returns The List associated with the specified key, whether it was inserted or already existed.
	 */
	override getOrInsert(key: K, defaultValue: V | List<V>): List<V> {
		return defaultValue instanceof List ? super.getOrInsert(key, defaultValue) : super.getOrInsertComputed(key, () => new List<V>().add(defaultValue));
	}

	/**
	 * Gets the values associated with the specified key. If the key does not exist, it computes a value, wraps it in a List, inserts it, and returns that List.
	 * @param key The key to get the value for.
	 * @param compute The function to compute the value to wrap in a List and insert if the key does not exist.
	 * @returns The List associated with the specified key, whether it was inserted or already existed.
	 */
	override getOrInsertComputed(key: K, compute: (key: K) => V): List<V>;

	/**
	 * Gets the values associated with the specified key. If the key does not exist, it computes a List, inserts it, and returns it.
	 * @param key The key to get the value for.
	 * @param compute The function to compute the List to insert if the key does not exist.
	 * @returns The List associated with the specified key, whether it was inserted or already existed.
	 */
	override getOrInsertComputed(key: K, compute: (key: K) => List<V>): List<V>;

	/**
	 * Gets the values associated with the specified key. If the key does not exist, it computes a value or List, inserts the resulting List, and returns it.
	 * @param key The key to get the value for.
	 * @param compute The function to compute the value or List to insert if the key does not exist.
	 * @returns The List associated with the specified key, whether it was inserted or already existed.
	 */
	override getOrInsertComputed(key: K, compute: (key: K) => V | List<V>): List<V> {
		return super.getOrInsertComputed(key, (insertedKey) => {
			const defaultValue = compute(insertedKey);

			return defaultValue instanceof List ? defaultValue : new List<V>().add(defaultValue);
		});
	}

	/**
	 * Finds a specific value for a specific key using an iterator function.
	 * @param key The key to find the value for.
	 * @param predicate The iterator function to use to find the value.
	 * @returns The value for the specified key that satisfies the predicate function, otherwise `undefined`.
	 */
	find(key: K, predicate: (value: V) => boolean): V | undefined {
		return super.get(key)?.find(predicate);
	}

	/**
	 * Checks if a specific key has a specific value.
	 *
	 * @param key The key to check.
	 * @param value The value to check.
	 * @returns True if the key has the value, false otherwise.
	 */
	hasValue(key: K, value: V): boolean {
		return super.get(key)?.contains(value) ?? false;
	}

	/**
	 * Removes a specific value from a specific key.
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
	 * Gets the string tag for the class
	 * @returns The string tag of the class
	 */
	override get [Symbol.toStringTag]() {
		return 'MultiMap';
	}
}