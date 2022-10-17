/**
 *
 * @template K
 * @template V
 * @typedef {Map<K, V>} SetMultiMap
 * @extends Map
 */
export default class SetMultiMap<K, V> extends Map<K, V> {
    constructor();
    constructor(entries?: readonly (readonly [K, V])[]);
    constructor(iterable?: Iterable<readonly [K, V]>);
    /**
     * @param {K} key
     * @returns {Set<V>}
     */
    get(key: K): Set<V>;
    /**
     * Returns an iterable of key, value pairs for every entry in the SetMultiMap.
     *
     * @returns {IterableIterator<[K, Set<V>]>}
     */
    entries(): IterableIterator<[K, Set<V>]>;
    /**
     * Returns an iterable of values in the SetMultiMap.
     *
     * @returns {IterableIterator<Set<V>>} The {@link IterableIterator} of values.
     */
    values(): IterableIterator<Set<V>>;
    /**
     * Executes a provided function once per each key/value pair in the SetMultiMap, in insertion order.
     *
     * @param {function(Set<V>, K, SetMultiMap<K, V>): void} callback The function called on each iteration.
     * @param {any} [thisArg] Optional object when binding 'this' to the callback.
     */
    forEach(callbackfn: (value: Set<V>, key: K, multiMap: SetMultiMap<K, V>) => void, thisArg?: any): void;
    /** Returns an iterable of entries in the SetMultiMap. */
    [Symbol.iterator](): IterableIterator<[K, Set<V>]>;
}

export type SetMultiMap<K, V> = Map<K, V>;