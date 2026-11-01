import { naturalComparator } from './internal/comparator.js';
import type { Comparator } from './types.js';

/**
 * A set that keeps its values ordered in a sorted array.
 * Searches use binary search in O(log n); insertion and deletion take O(n).
 * Comparator equality (`compare(a, b) === 0`) defines whether two values are duplicates.
 * @template E The type of values in the set.
 */
export class SortedSet<E> implements Iterable<E> {
	#values: E[] = [];
	#comparator: Comparator<E>;

	/**
	 * Creates a sorted set, optionally initialized from an iterable.
	 * @param iterable Values to add to the set.
	 * @param comparator Comparator defining value order and equality.
	 */
	constructor(iterable?: Iterable<E>, comparator: Comparator<E> = naturalComparator<E>) {
		this.#comparator = comparator;

		if (iterable !== undefined) {
			const values = Array.from(iterable);

			// Array#sort places undefined last without consulting the comparator, so those inputs use ordered insertion.
			if (values.includes(undefined as E)) {
				for (const value of values) { this.add(value) }
			} else {
				this.#values = SortedSet.#sortedUnique(values.sort(comparator), comparator);
			}
		}
	}

	/**
	 * Adds a value if no comparator-equivalent value is already present.
	 * @param value Value to add.
	 * @returns This set.
	 */
	add(value: E): this {
		const index = this.#lowerBound(value);
		if (index === this.#values.length || this.#comparator(this.#values[index]!, value) !== 0) {
			this.#values.splice(index, 0, value);
		}

		return this;
	}

	/**
	 * Checks whether a comparator-equivalent value exists.
	 * @param value Value to find.
	 * @returns Whether the value exists.
	 */
	has(value: E): boolean {
		const index = this.#lowerBound(value);

		return index < this.#values.length && this.#comparator(this.#values[index]!, value) === 0;
	}

	/**
	 * Deletes a comparator-equivalent value.
	 * @param value Value to delete.
	 * @returns Whether a value was deleted.
	 */
	delete(value: E): boolean {
		const index = this.#lowerBound(value);
		if (index === this.#values.length || this.#comparator(this.#values[index]!, value) !== 0) { return false }

		this.#values.splice(index, 1);

		return true;
	}

	/**
	 * Returns the number of values in the set.
	 * @returns The number of values in the set.
	 */
	get size(): number {
		return this.#values.length;
	}

	/**
	 * Checks whether the set is empty.
	 * @returns Whether the set contains no values.
	 */
	isEmpty(): boolean {
		return this.#values.length === 0;
	}

	/**
	 * Removes every value from the set.
	 * @returns This set.
	 */
	clear(): this {
		this.#values.length = 0;

		return this;
	}

	/**
	 * Returns the least value, or `undefined` if the set is empty.
	 * @returns The least value.
	 */
	first(): E | undefined {
		return this.#values[0];
	}

	/**
	 * Returns the greatest value, or `undefined` if the set is empty.
	 * @returns The greatest value.
	 */
	last(): E | undefined {
		return this.#values.at(-1);
	}

	/**
	 * Returns the greatest value less than or equal to the argument.
	 * @param value Boundary value.
	 * @returns The floor value, or `undefined` if none exists.
	 */
	floor(value: E): E | undefined {
		const index = this.#upperBound(value) - 1;

		return index < 0 ? undefined : this.#values[index];
	}

	/**
	 * Returns the least value greater than or equal to the argument.
	 * @param value Boundary value.
	 * @returns The ceiling value, or `undefined` if none exists.
	 */
	ceiling(value: E): E | undefined {
		const index = this.#lowerBound(value);

		return this.#values[index];
	}

	/**
	 * Returns the greatest value strictly less than the argument.
	 * @param value Boundary value.
	 * @returns The lower value, or `undefined` if none exists.
	 */
	lower(value: E): E | undefined {
		const index = this.#lowerBound(value) - 1;

		return index < 0 ? undefined : this.#values[index];
	}

	/**
	 * Returns the least value strictly greater than the argument.
	 * @param value Boundary value.
	 * @returns The higher value, or `undefined` if none exists.
	 */
	higher(value: E): E | undefined {
		const index = this.#upperBound(value);

		return this.#values[index];
	}

	/**
	 * Iterates over values in the comparator-defined half-open range `[from, to)`.
	 * @param from Inclusive lower boundary.
	 * @param to Exclusive upper boundary.
	 * @returns An iterator over values in the range.
	 * @yields {E} Values in sorted order within the range.
	 */
	*range(from: E, to: E): Generator<E, void, unknown> {
		if (this.#comparator(from, to) >= 0) { return }

		const end = this.#lowerBound(to);

		for (let index = this.#lowerBound(from); index < end; index++) { yield this.#values[index] as E }
	}

	/**
	 * Returns a shallow array copy in sorted order.
	 * @returns The sorted values.
	 */
	toArray(): E[] {
		return this.#values.slice();
	}

	/**
	 * Iterates over values in sorted order.
	 * @returns An iterator over the values.
	 * @yields {E} Values in sorted order.
	 */
	*[Symbol.iterator](): Generator<E, void, unknown> {
		yield* this.#values;
	}

	/**
	 * Removes comparator-equivalent duplicates from a stably sorted array in place, keeping the first of each run.
	 * @param values The sorted values.
	 * @param comparator Comparator defining value equality.
	 * @returns The same array without duplicates.
	 */
	static #sortedUnique<E>(values: E[], comparator: Comparator<E>): E[] {
		let write = 0;
		const length = values.length;

		for (let read = 1; read < length; read++) {
			const value = values[read] as E;

			if (comparator(values[write] as E, value) !== 0) { values[++write] = value }
		}

		values.length = length === 0 ? 0 : write + 1;

		return values;
	}

	/**
	 * Finds the first index whose value is not less than the argument.
	 * @param value Search value.
	 * @returns The insertion index.
	 */
	#lowerBound(value: E): number {
		let low = 0;
		let high = this.#values.length;

		while (low < high) {
			const middle = low + Math.floor((high - low) / 2);

			if (this.#comparator(this.#values[middle]!, value) < 0) {
				low = middle + 1;
			} else {
				high = middle;
			}
		}

		return low;
	}

	/**
	 * Finds the first index whose value is greater than the argument.
	 * @param value Search value.
	 * @returns The insertion index.
	 */
	#upperBound(value: E): number {
		let low = 0;
		let high = this.#values.length;

		while (low < high) {
			const middle = low + Math.floor((high - low) / 2);

			if (this.#comparator(this.#values[middle]!, value) <= 0) {
				low = middle + 1;
			} else {
				high = middle;
			}
		}

		return low;
	}
}
