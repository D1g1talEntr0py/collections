import { describe, expect, test } from 'vitest';
import { PriorityQueue } from '../src/priority-queue';

const compareNumbers = (left: number, right: number): number => left - right;

describe('PriorityQueue', () => {
	test('handles empty and singleton queues', () => {
		const queue = new PriorityQueue<number>();

		expect(queue.size).toBe(0);
		expect(queue.isEmpty()).toBe(true);
		expect(queue.peek()).toBeUndefined();
		expect(queue.pop()).toBeUndefined();

		queue.push(7);
		expect(queue.peek()).toBe(7);
		expect(queue.pop()).toBe(7);
		expect(queue.isEmpty()).toBe(true);
	});

	test('pushes, peeks, pops and clears with fluent returns', () => {
		const queue = new PriorityQueue<number>();

		expect(queue.push(4).push(1).push(3)).toBe(queue);
		expect(queue.size).toBe(3);
		expect(queue.isEmpty()).toBe(false);
		expect(queue.peek()).toBe(1);
		expect(queue.pop()).toBe(1);
		expect(queue.clear()).toBe(queue);
		expect(queue.size).toBe(0);
		expect(queue.isEmpty()).toBe(true);
	});

	test('retains duplicates and does not promise stable order for comparator ties', () => {
		const queue = new PriorityQueue([2, 1, 2, 1]);

		expect([queue.pop(), queue.pop(), queue.pop(), queue.pop()]).toEqual([1, 1, 2, 2]);
		expect(queue.pop()).toBeUndefined();
	});

	test('supports custom priority order', () => {
		const queue = new PriorityQueue([1, 4, 2, 3], (left, right) => right - left);

		expect([queue.pop(), queue.pop(), queue.pop(), queue.pop()]).toEqual([4, 3, 2, 1]);
	});

	test('returns an unordered heap-layout copy and iterates a snapshot', () => {
		const queue = new PriorityQueue([5, 2, 8, 1, 4]);
		const copy = queue.toArray();
		const iterator = queue[Symbol.iterator]();

		copy.pop();
		queue.push(0);

		expect(queue.toArray().slice().sort(compareNumbers)).toEqual([0, 1, 2, 4, 5, 8]);
		expect([...iterator].slice().sort(compareNumbers)).toEqual([1, 2, 4, 5, 8]);
		expect([...queue].slice().sort(compareNumbers)).toEqual([0, 1, 2, 4, 5, 8]);
	});

	test('removes one comparator-equal value and restores heap order', () => {
		const queue = new PriorityQueue([9, 3, 7, 1, 5, 3]);

		expect(queue.remove(7)).toBe(true);
		expect(queue.remove(3)).toBe(true);
		expect(queue.remove(100)).toBe(false);
		expect(queue.size).toBe(4);
		expect([queue.pop(), queue.pop(), queue.pop(), queue.pop()]).toEqual([1, 3, 5, 9]);
	});

	test('removes only one value when several compare equally', () => {
		type Item = { priority: number; name: string };
		const compareItems = (left: Item, right: Item): number => left.priority - right.priority;
		const queue = new PriorityQueue<Item>([
			{ priority: 2, name: 'first' },
			{ priority: 1, name: 'target' },
			{ priority: 1, name: 'other' }
		], compareItems);

		expect(queue.remove({ priority: 1, name: 'not-present-by-identity' })).toBe(true);
		expect(queue.size).toBe(2);
		expect(queue.pop()?.priority).toBe(1);
		expect(queue.pop()?.priority).toBe(2);
	});

	test('drains lazily in priority order and retains unconsumed values', () => {
		const queue = new PriorityQueue([6, 2, 5, 1, 4, 3]);
		const drain = queue.drain();

		expect(queue.size).toBe(6);
		expect(drain.next()).toEqual({ value: 1, done: false });
		expect(queue.size).toBe(5);
		expect(drain.next()).toEqual({ value: 2, done: false });
		expect(queue.size).toBe(4);
		expect([...drain]).toEqual([3, 4, 5, 6]);
		expect(queue.isEmpty()).toBe(true);
	});

	test('heapifies through static from with a custom comparator', () => {
		const queue = PriorityQueue.from([1, 8, 3, 7, 2, 9, 4], (left, right) => right - left);

		expect(queue.size).toBe(7);
		expect([queue.pop(), queue.pop(), queue.pop(), queue.pop(), queue.pop(), queue.pop(), queue.pop()])
			.toEqual([9, 8, 7, 4, 3, 2, 1]);
	});

	test('heapifies in linear comparator work', () => {
		let comparisons = 0;
		const comparator = (left: number, right: number): number => {
			comparisons++;

			return left - right;
		};
		const values = Array.from({ length: 255 }, (_, index) => 254 - index);

		PriorityQueue.from(values, comparator);

		expect(comparisons).toBeLessThan(values.length * 3);
	});

	test('uses a deterministic operation sequence against a sorted-array model', () => {
		let seed = 0x5eed;
		const random = (): number => {
			seed = (seed * 1664525 + 1013904223) >>> 0;

			return seed / 0x100000000;
		};
		const queue = new PriorityQueue<number>();
		const model: Array<number> = [];

		for (let operation = 0; operation < 500; operation++) {
			const choice = Math.floor(random() * 4);

			if (choice < 2) {
				const value = Math.floor(random() * 31) - 15;
				queue.push(value);
				model.push(value);
			} else if (choice === 2) {
				model.sort(compareNumbers);
				expect(queue.pop()).toBe(model.shift());
			} else {
				const value = Math.floor(random() * 31) - 15;
				const index = model.indexOf(value);

				expect(queue.remove(value)).toBe(index !== -1);
				if (index !== -1) { model.splice(index, 1) }
			}

			expect(queue.size).toBe(model.length);
			expect(queue.peek()).toBe(model.length > 0 ? Math.min(...model) : undefined);
			expect(queue.toArray().slice().sort(compareNumbers)).toEqual(model.slice().sort(compareNumbers));
		}

		model.sort(compareNumbers);
		expect([...queue.drain()]).toEqual(model);
		expect(queue.isEmpty()).toBe(true);
	});

	test('keeps every value when the comparator throws while restoring heap order', () => {
		let callsBeforeFailure = Infinity;
		const queue = new PriorityQueue([ 5, 3, 8, 1, 9, 2, 7 ], (left: number, right: number): number => {
			if (--callsBeforeFailure <= 0) { throw new Error('comparator failed') }

			return left - right;
		});

		callsBeforeFailure = 2;
		expect(() => queue.push(0)).toThrow('comparator failed');
		callsBeforeFailure = Infinity;
		expect(queue.toArray().toSorted(compareNumbers)).toEqual([ 0, 1, 2, 3, 5, 7, 8, 9 ]);

		const first = queue.peek();
		callsBeforeFailure = 3;
		expect(() => queue.pop()).toThrow('comparator failed');
		callsBeforeFailure = Infinity;
		expect(queue.toArray().toSorted(compareNumbers)).toEqual([ 0, 1, 2, 3, 5, 7, 8, 9 ].filter((value) => value !== first));
	});

	test('throws RangeError for an invalid comparator', () => {
		expect(() => new PriorityQueue<number>([], null as unknown as (left: number, right: number) => number))
			.toThrow(RangeError);
	});
});
