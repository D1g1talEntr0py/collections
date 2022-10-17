import List from './list.js';

/**
 *
 * @template K
 * @template V
 * @typedef {Map<K, V>} MultiMap<K,V>
 * @extends Map
 */
export default class MultiMap<K, V> extends Map<K, V> {
    constructor();
    constructor(entries?: readonly (readonly [K, V])[]);
    constructor(iterable?: Iterable<readonly [K, V]>);
    /**
     * @param {K} key
     * @returns {List<V>}
     */
    get(key: K): List<V>;
    /**
     * Returns an iterable of key, value pairs for every entry in the MultiMap.
     *
     * @returns {IterableIterator<[K, List<V>]>}
     */
    entries(): IterableIterator<[K, List<V>]>;
    /**
     * Returns an iterable of values in the MultiMap.
     *
     * @returns {IterableIterator<List<V>>} The {@link IterableIterator} of values.
     */
    values(): IterableIterator<List<V>>;
    /**
     * Executes a provided function once per each key/value pair in the MultiMap, in insertion order.
     *
     * @param {function(List<V>, K, MultiMap<K, V>): void} callback The function called on each iteration.
     * @param {any} [thisArg] Optional object when binding 'this' to the callback.
     */
    forEach(callbackfn: (value: List<V>, key: K, multiMap: MultiMap<K, V>) => void, thisArg?: any): void;
    /** Returns an iterable of entries in the MultiMap. */
    [Symbol.iterator](): IterableIterator<[K, List<V>]>;
}

export type MultiMap<K, V> = Map<K, V>;