import { naturalComparator } from './internal/comparator.js';
import type { Comparator } from './types.js';

/**
 * A map that keeps keys ordered in a sorted array.
 * Searches use binary search in O(log n); insertion and deletion take O(n).
 * Comparator equality (`compare(a, b) === 0`) defines key matching. Setting an
 * equivalent key updates the value while preserving the original stored key.
 * @template K The type of keys in the map.
 * @template V The type of values in the map.
 */
export class SortedMap<K, V> implements Iterable<[K, V]> {
	#entries: [K, V][] = [];
	#comparator: Comparator<K>;

	/**
	 * Creates a sorted map, optionally initialized from entries.
	 * @param entries Entries to set in the map.
	 * @param comparator Comparator defining key order and equality.
	 */
	constructor(entries?: Iterable<readonly [K, V]>, comparator: Comparator<K> = naturalComparator<K>) {
		this.#comparator = comparator;

		if (entries) {
			const sorted = Array.from(entries, SortedMap.#toEntry<K, V>).sort((left, right) => comparator(left[0], right[0]));
			const length = sorted.length;
			let write = 0;

			// The stable sort keeps equivalent keys in input order: keep the first key and the last value.
			for (let read = 1; read < length; read++) {
				const entry = sorted[read]!;
				const kept = sorted[write]!;

				if (comparator(kept[0], entry[0]) === 0) {
					kept[1] = entry[1];
				} else {
					sorted[++write] = entry;
				}
			}

			sorted.length = length === 0 ? 0 : write + 1;
			this.#entries = sorted;
		}
	}

	/**
	 * Sets a value for a key, updating an existing comparator-equivalent key in place.
	 * @param key Key to set.
	 * @param value Value to associate with the key.
	 * @returns This map.
	 */
	set(key: K, value: V): this {
		const index = this.#lowerBound(key);

		if (index < this.#entries.length && this.#comparator(this.#entries[index]![0], key) === 0) {
			this.#entries[index]![1] = value;
		} else {
			this.#entries.splice(index, 0, [ key, value ]);
		}

		return this;
	}

	/**
	 * Returns the value for a comparator-equivalent key.
	 * @param key Key to find.
	 * @returns The associated value, or `undefined` if no key exists.
	 */
	get(key: K): V | undefined {
		const index = this.#findIndex(key);

		return index < 0 ? undefined : this.#entries[index]![1];
	}

	/**
	 * Checks whether a comparator-equivalent key exists.
	 * @param key Key to find.
	 * @returns Whether the key exists.
	 */
	has(key: K): boolean {
		return this.#findIndex(key) >= 0;
	}

	/**
	 * Deletes a comparator-equivalent key.
	 * @param key Key to delete.
	 * @returns Whether an entry was deleted.
	 */
	delete(key: K): boolean {
		const index = this.#findIndex(key);

		if (index < 0) { return false }

		this.#entries.splice(index, 1);

		return true;
	}

	/**
	 * Returns the number of entries in the map.
	 * @returns The number of entries.
	 */
	get size(): number {
		return this.#entries.length;
	}

	/**
	 * Checks whether the map is empty.
	 * @returns Whether the map contains no entries.
	 */
	isEmpty(): boolean {
		return this.#entries.length === 0;
	}

	/**
	 * Removes every entry from the map.
	 * @returns This map.
	 */
	clear(): this {
		this.#entries.length = 0;

		return this;
	}

	/**
	 * Returns the least key, or `undefined` if the map is empty.
	 * @returns The least key.
	 */
	firstKey(): K | undefined {
		return this.#entries[0]?.[0];
	}

	/**
	 * Returns the greatest key, or `undefined` if the map is empty.
	 * @returns The greatest key.
	 */
	lastKey(): K | undefined {
		return this.#entries.at(-1)?.[0];
	}

	/**
	 * Returns the least key-value pair, or `undefined` if the map is empty.
	 * @returns The first entry.
	 */
	firstEntry(): [K, V] | undefined {
		const entry = this.#entries[0];

		return entry ? [ entry[0], entry[1] ] : undefined;
	}

	/**
	 * Returns the greatest key-value pair, or `undefined` if the map is empty.
	 * @returns The last entry.
	 */
	lastEntry(): [K, V] | undefined {
		const entry = this.#entries.at(-1);

		return entry ? [ entry[0], entry[1] ] : undefined;
	}

	/**
	 * Returns the entry with the greatest key less than or equal to the argument.
	 * @param key Boundary key.
	 * @returns The floor entry, or `undefined` if none exists.
	 */
	floor(key: K): [K, V] | undefined {
		const index = this.#upperBound(key) - 1;

		return index < 0 ? undefined : this.#copyEntry(index);
	}

	/**
	 * Returns the entry with the least key greater than or equal to the argument.
	 * @param key Boundary key.
	 * @returns The ceiling entry, or `undefined` if none exists.
	 */
	ceiling(key: K): [K, V] | undefined {
		const index = this.#lowerBound(key);

		return index === this.#entries.length ? undefined : this.#copyEntry(index);
	}

	/**
	 * Returns the entry with the greatest key strictly less than the argument.
	 * @param key Boundary key.
	 * @returns The lower entry, or `undefined` if none exists.
	 */
	lower(key: K): [K, V] | undefined {
		const index = this.#lowerBound(key) - 1;

		return index < 0 ? undefined : this.#copyEntry(index);
	}

	/**
	 * Returns the entry with the least key strictly greater than the argument.
	 * @param key Boundary key.
	 * @returns The higher entry, or `undefined` if none exists.
	 */
	higher(key: K): [K, V] | undefined {
		const index = this.#upperBound(key);

		return index === this.#entries.length ? undefined : this.#copyEntry(index);
	}

	/**
	 * Iterates over entries in the comparator-defined half-open key range `[from, to)`.
	 * @param from Inclusive lower boundary.
	 * @param to Exclusive upper boundary.
	 * @returns An iterator over entries in the range.
	 * @yields {[K, V]} Entries in sorted key order within the range.
	 */
	*range(from: K, to: K): Generator<[K, V], void, unknown> {
		if (this.#comparator(from, to) >= 0) { return }

		const end = this.#lowerBound(to);

		for (let index = this.#lowerBound(from); index < end; index++) { yield this.#copyEntry(index) }
	}

	/**
	 * Returns a shallow array copy of entries in sorted key order.
	 * @returns The sorted entries.
	 */
	toArray(): [K, V][] {
		const entries = this.#entries;
		const length = entries.length;
		const copy = new Array<[K, V]>(length);

		for (let index = 0; index < length; index++) {
			const entry = entries[index]!;
			copy[index] = [ entry[0], entry[1] ];
		}

		return copy;
	}

	/**
	 * Iterates over keys in sorted order.
	 * @returns An iterator over the keys.
	 * @yields {K} Keys in sorted order.
	 */
	*keys(): Generator<K, void, unknown> {
		for (const [ key ] of this.#entries) { yield key }
	}

	/**
	 * Iterates over values in key-sorted order.
	 * @returns An iterator over the values.
	 * @yields {V} Values in key-sorted order.
	 */
	*values(): Generator<V, void, unknown> {
		for (const [ , value ] of this.#entries) { yield value }
	}

	/**
	 * Iterates over entries in sorted key order.
	 * @returns An iterator over the entries.
	 * @yields {[K, V]} Entries in sorted key order.
	 */
	*entries(): Generator<[K, V], void, unknown> {
		for (let index = 0; index < this.#entries.length; index++) { yield this.#copyEntry(index) }
	}

	/**
	 * Iterates over entries in sorted key order.
	 * @returns An iterator over the entries.
	 * @yields {[K, V]} Entries in sorted key order.
	 */
	*[Symbol.iterator](): Generator<[K, V], void, unknown> {
		yield* this.entries();
	}

	/**
	 * Copies an input entry into a mutable tuple owned by the map.
	 * @param entry The input entry.
	 * @returns A new key-value tuple.
	 */
	static #toEntry<K, V>([ key, value ]: readonly [K, V]): [K, V] {
		return [ key, value ];
	}

	/**
	 * Finds the index of a comparator-equivalent key, or `-1`.
	 * @param key Search key.
	 * @returns The matching index or `-1`.
	 */
	#findIndex(key: K): number {
		const index = this.#lowerBound(key);

		return index < this.#entries.length && this.#comparator(this.#entries[index]![0], key) === 0 ? index : -1;
	}

	/**
	 * Returns an independent tuple copy of an entry at an index.
	 * @param index Entry index.
	 * @returns The copied entry.
	 */
	#copyEntry(index: number): [K, V] {
		const entry = this.#entries[index]!;

		return [ entry[0], entry[1] ];
	}

	/**
	 * Finds the first index whose key is not less than the argument.
	 * @param key Search key.
	 * @returns The insertion index.
	 */
	#lowerBound(key: K): number {
		let low = 0;
		let high = this.#entries.length;

		while (low < high) {
			const middle = low + Math.floor((high - low) / 2);

			if (this.#comparator(this.#entries[middle]![0], key) < 0) {
				low = middle + 1;
			}	else {
				high = middle;
			}
		}

		return low;
	}

	/**
	 * Finds the first index whose key is greater than the argument.
	 * @param key Search key.
	 * @returns The insertion index.
	 */
	#upperBound(key: K): number {
		let low = 0;
		let high = this.#entries.length;

		while (low < high) {
			const middle = low + Math.floor((high - low) / 2);

			if (this.#comparator(this.#entries[middle]![0], key) <= 0) {
				low = middle + 1;
			} else {
				high = middle;
			}
		}

		return low;
	}
}