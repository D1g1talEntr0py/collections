import { List } from './list';

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
	override set(key: K, value: V | List<V>): MultiMap<K, V> {
		super.set(key, value instanceof List ? value : (super.get(key) ?? new List<V>()).add(value));

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

		return values ? values.contains(value) : false;
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
			try {
				const deleted = !!values.remove(value);

				if (values.size === 0) { super.delete(key) }

				return deleted;
			} catch {
				return false;
			}
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