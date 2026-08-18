/**
 * Polyfill for the TC39 "upsert" proposal: `Map.prototype.getOrInsert` and `Map.prototype.getOrInsertComputed`.
 * Importing this module installs the methods only when the host runtime does not already provide them,
 * so native implementations are always preferred.
 */

declare global {
	interface Map<K, V> {
		/**
		 * Returns a specified element from the Map object.
		 * If no element is associated with the specified key, a new element with the value `defaultValue` will be inserted into the Map and returned.
		 * @param key The key to look up.
		 * @param defaultValue The value to insert when the key is absent.
		 * @returns The element associated with the specified key, which will be `defaultValue` if no element previously existed.
		 */
		// eslint-disable-next-line @typescript-eslint/method-signature-style -- must be method style to merge as an overload with lib.esnext.collection
		getOrInsert(key: K, defaultValue: V): V;

		/**
		 * Returns a specified element from the Map object.
		 * If no element is associated with the specified key, the result of passing the specified key to the `callback` function will be inserted into the Map and returned.
		 * @param key The key to look up.
		 * @param callback The function computing the value to insert when the key is absent.
		 * @returns The element associated with the specific key, which will be the newly computed value if no element previously existed.
		 */
		// eslint-disable-next-line @typescript-eslint/method-signature-style -- must be method style to merge as an overload with lib.esnext.collection
		getOrInsertComputed(key: K, callback: (key: K) => V): V;
	}
}

const { get: mapGet, has: mapHas, set: mapSet } = Map.prototype;

/**
 * Returns the value associated with `key`, inserting `defaultValue` first when the key is absent.
 * @param key The key to look up.
 * @param defaultValue The value to insert when the key is absent.
 * @returns The existing value, or `defaultValue` when it was inserted.
 * @template K The key type.
 * @template V The value type.
 */
function getOrInsert<K, V>(this: Map<K, V>, key: K, defaultValue: V): V {
	const value = mapGet.call<Map<K, V>, [K], V>(this, key);

	if (value !== undefined || mapHas.call(this, key)) { return value }

	mapSet.call(this, key, defaultValue);

	return defaultValue;
}

/**
 * Returns the value associated with `key`, inserting the result of `callback` first when the key is absent.
 * @param key The key to look up.
 * @param callback The function computing the value to insert when the key is absent.
 * @returns The existing value, or the newly computed value when it was inserted.
 * @template K The key type.
 * @template V The value type.
 */
function getOrInsertComputed<K, V>(this: Map<K, V>, key: K, callback: (key: K) => V): V {
	const value = mapGet.call<Map<K, V>, [K], V>(this, key);

	if (value !== undefined || mapHas.call(this, key)) { return value }

	const newValue = callback(key);
	mapSet.call(this, key, newValue);

	return newValue;
}

/** Installs the upsert methods on `Map.prototype` when the runtime does not already provide them. Repeat calls are no-ops. */
export const installMapUpsert = (): void => {
	const methods: PropertyDescriptorMap = {};

	if (typeof Map.prototype.getOrInsert !== 'function') {
		methods.getOrInsert = { value: getOrInsert, writable: true, enumerable: false, configurable: true };
	}

	if (typeof Map.prototype.getOrInsertComputed !== 'function') {
		methods.getOrInsertComputed = { value: getOrInsertComputed, writable: true, enumerable: false, configurable: true };
	}

	Object.defineProperties(Map.prototype, methods);
};

installMapUpsert();
