/**
 *
 * @template K
 * @template V
 * @typedef {Map<K, V>} WeakSetMultiMap
 * @extends Map
 */
export default class WeakSetMultiMap<K, V> extends Map<K, V> {
    constructor();
    constructor(entries?: readonly (readonly [K, V])[]);
    constructor(iterable?: Iterable<readonly [K, V]>);
    /**
     * @param {K} key
     * @returns {WeakSet<V>}
     */
    get(key: K): WeakSet<V>;
    /**
     * Returns an iterable of key, value pairs for every entry in the WeakSetMultiMap.
     *
     * @returns {IterableIterator<[K, WeakSet<V>]>}
     */
    entries(): IterableIterator<[K, WeakSet<V>]>;
    /**
     * Returns an iterable of values in the WeakSetMultiMap.
     *
     * @returns {IterableIterator<WeakSet<V>>} The {@link IterableIterator} of values.
     */
    values(): IterableIterator<WeakSet<V>>;
    /**
     * Executes a provided function once per each key/value pair in the WeakSetMultiMap, in insertion order.
     *
     * @param {function(WeakSet<V>, K, WeakSetMultiMap<K, V>): void} callback The function called on each iteration.
     * @param {any} [thisArg] Optional object when binding 'this' to the callback.
     */
    forEach(callbackfn: (value: WeakSet<V>, key: K, WeakSetMultiMap: WeakSetMultiMap<K, V>) => void, thisArg?: any): void;
    /** Returns an iterable of entries in the WeakSetMultiMap. */
    [Symbol.iterator](): IterableIterator<[K, WeakSet<V>]>;
}

export type WeakSetMultiMap<K, V> = Map<K, V>;