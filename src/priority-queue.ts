import { naturalComparator } from './internal/comparator';
import type { Comparator } from './types';

/**
 * A binary min-heap ordered by a comparator.
 * Comparator-equal values have no guaranteed insertion order, and duplicate values are retained.
 */
export class PriorityQueue<E> implements Iterable<E> {
	readonly #heap: Array<E>;
	readonly #comparator: Comparator<E>;

	/**
	 * Creates a priority queue from an iterable.
	 * @param items The initial values.
	 * @param comparator Compares values by priority; defaults to natural ordering.
	 * @throws {RangeError} If the comparator is not a function.
	 */
	constructor(items: Iterable<E> = [], comparator: Comparator<E> = naturalComparator) {
		if (typeof comparator !== 'function') { throw new RangeError('Comparator must be a function.') }

		this.#heap = Array.from(items);
		this.#comparator = comparator;

		for (let index = Math.floor(this.#heap.length / 2) - 1; index >= 0; index--) { this.#siftDown(index) }
	}

	/**
	 * Creates a priority queue from an iterable using bottom-up heapification.
	 * @param items The initial values.
	 * @param comparator Compares values by priority; defaults to natural ordering.
	 * @returns A new priority queue.
	 */
	static from<E>(items: Iterable<E>, comparator: Comparator<E> = naturalComparator): PriorityQueue<E> {
		return new PriorityQueue(items, comparator);
	}

	/**
	 * Adds a value to the queue.
	 * @param value The value to add.
	 * @returns This queue.
	 */
	push(value: E): this {
		this.#heap.push(value);
		this.#siftUp(this.#heap.length - 1);

		return this;
	}

	/**
	 * Removes and returns the smallest value.
	 * @returns The removed value or undefined if the queue is empty.
	 */
	pop(): E | undefined {
		if (this.#heap.length === 0) { return undefined }

		const first = this.#heap[0] as E;
		const last = this.#heap.pop() as E;

		if (this.#heap.length > 0) {
			this.#heap[0] = last;
			this.#siftDown(0);
		}

		return first;
	}

	/**
	 * Returns the smallest value without removing it.
	 * @returns The smallest value or undefined if the queue is empty.
	 */
	peek(): E | undefined {
		return this.#heap[0];
	}

	/**
	 * Removes one comparator-equal value from the queue.
	 * When several values compare equally, the first one in the current heap layout is removed.
	 * @param value The value to remove.
	 * @returns True if a value was removed, otherwise false.
	 */
	remove(value: E): boolean {
		const heap = this.#heap;
		const comparator = this.#comparator;
		let index = 0;

		for (const length = heap.length; index < length && comparator(heap[index] as E, value) !== 0; index++);

		if (index === heap.length) { return false }

		const last = heap.pop() as E;

		if (index < heap.length) {
			heap[index] = last;

			// Restore heap order starting from the replaced index.
			if (index > 0 && comparator(last, heap[(index - 1) >>> 1] as E) < 0) {
				this.#siftUp(index);
			} else {
				this.#siftDown(index);
			}
		}

		return true;
	}

	/**
	 * Removes all values from the queue.
	 * @returns This queue.
	 */
	clear(): this {
		this.#heap.length = 0;

		return this;
	}

	/**
	 * Checks whether the queue contains no values.
	 * @returns True if the queue is empty, otherwise false.
	 */
	isEmpty(): boolean {
		return this.#heap.length === 0;
	}

	/**
	 * Gets the number of values in the queue.
	 * @returns The queue size.
	 */
	get size(): number {
		return this.#heap.length;
	}

	/**
	 * Returns a shallow copy in internal heap order, not priority order.
	 * @returns The heap-layout copy.
	 */
	toArray(): Array<E> {
		return this.#heap.slice();
	}

	/**
	 * Lazily removes and yields values in priority order as they are consumed.
	 * Unconsumed values remain in the queue; comparator-equal values have no stable order.
	 * @returns An iterator that drains the queue as it is consumed.
	 * @yields {E} The next value in priority order.
	 */
	*drain(): IterableIterator<E> {
		while (this.#heap.length > 0) {
			const value = this.#heap[0] as E;
			this.pop();

			yield value;
		}
	}

	/**
	 * Iterates over a snapshot in internal heap order, not priority order.
	 * @returns An iterator over a heap-layout snapshot.
	 */
	[Symbol.iterator](): IterableIterator<E> {
		return this.toArray()[Symbol.iterator]();
	}

	/**
	 * Restores heap order by moving a value toward the root.
	 * @param startIndex The starting index.
	 */
	#siftUp(startIndex: number): void {
		const heap = this.#heap;
		const comparator = this.#comparator;
		const value = heap[startIndex] as E;
		let index = startIndex;

		// Parents shift down into the hole; `finally` writes the value back even if the comparator throws.
		try {
			while (index > 0) {
				const parentIndex = (index - 1) >>> 1;
				const parent = heap[parentIndex] as E;

				if (comparator(value, parent) >= 0) { break }

				heap[index] = parent;
				index = parentIndex;
			}
		} finally {
			heap[index] = value;
		}
	}

	/**
	 * Restores heap order by moving a value toward a leaf.
	 * @param startIndex The starting index.
	 */
	#siftDown(startIndex: number): void {
		const heap = this.#heap;
		const comparator = this.#comparator;
		const length = heap.length;
		const value = heap[startIndex] as E;
		let index = startIndex;

		// Smaller children shift up into the hole; `finally` writes the value back even if the comparator throws.
		try {
			while (true) {
				const leftIndex = index * 2 + 1;

				if (leftIndex >= length) { break }

				const rightIndex = leftIndex + 1;
				let smallestIndex = index;
				let smallest = value;

				if (comparator(heap[leftIndex] as E, smallest) < 0) {
					smallestIndex = leftIndex;
					smallest = heap[leftIndex] as E;
				}

				if (rightIndex < length && comparator(heap[rightIndex] as E, smallest) < 0) {
					smallestIndex = rightIndex;
					smallest = heap[rightIndex] as E;
				}

				if (smallestIndex === index) { break }

				heap[index] = smallest;
				index = smallestIndex;
			}
		} finally {
			heap[index] = value;
		}
	}
}