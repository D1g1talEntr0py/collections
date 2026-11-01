/**
 * Returns a value from a map, inserting the default value when the key is absent.
 * @param map The map to query and update.
 * @param key The key to look up.
 * @param defaultValue The value to insert when the key is absent.
 * @returns The existing value, or the inserted default value.
 * @template K The key type.
 * @template V The value type.
 */
export function getOrInsert<K, V>(map: Map<K, V>, key: K, defaultValue: V): V {
	const value = map.get(key);

	if (value !== undefined || map.has(key)) { return value as V }

	map.set(key, defaultValue);

	return defaultValue;
}

/**
 * Returns a value from a map, inserting the callback result when the key is absent.
 * @param map The map to query and update.
 * @param key The key to look up.
 * @param callback The function computing the value to insert when the key is absent.
 * @returns The existing value, or the computed value when inserted.
 * @template K The key type.
 * @template V The value type.
 */
export function getOrInsertComputed<K, V>(map: Map<K, V>, key: K, callback: (key: K) => V): V {
	const existing = map.get(key);

	if (existing !== undefined || map.has(key)) { return existing as V }

	const value = callback(key);
	map.set(key, value);

	return value;
}