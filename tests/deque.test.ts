import { Deque } from '../src/deque';
import { describe, expect, test } from 'vitest';

describe('Deque', () => {
	test('initializes from an iterable in front-to-back order', () => {
		const deque = new Deque([1, 2, 3]);

		expect(deque.size).toBe(3);
		expect(deque.toArray()).toEqual([1, 2, 3]);
		expect([...deque]).toEqual([1, 2, 3]);
	});

	test('pushes and pops at both ends with fluent pushes', () => {
		const deque = new Deque<number>();

		expect(deque.pushBack(2)).toBe(deque);
		expect(deque.pushFront(1)).toBe(deque);
		expect(deque.pushBack(3)).toBe(deque);
		expect(deque.popFront()).toBe(1);
		expect(deque.popBack()).toBe(3);
		expect(deque.toArray()).toEqual([2]);
	});

	test('returns undefined for empty peeks and pops', () => {
		const deque = new Deque<number>();

		expect(deque.popFront()).toBeUndefined();
		expect(deque.popBack()).toBeUndefined();
		expect(deque.peekFront()).toBeUndefined();
		expect(deque.peekBack()).toBeUndefined();
	});

	test('preserves stored undefined values by tracking size', () => {
		const deque = new Deque<number | undefined>();
		deque.pushBack(undefined).pushBack(2).pushFront(undefined);

		expect(deque.size).toBe(3);
		expect(deque.isEmpty()).toBe(false);
		expect(deque.toArray()).toEqual([undefined, undefined, 2]);
		expect(deque.popFront()).toBeUndefined();
		expect(deque.size).toBe(2);
		expect(deque.popBack()).toBe(2);
		expect(deque.popBack()).toBeUndefined();
		expect(deque.isEmpty()).toBe(true);
	});

	test('supports Array.at negative indices and out-of-range values', () => {
		const deque = new Deque([10, 20, 30]);

		expect(deque.at(0)).toBe(10);
		expect(deque.at(-1)).toBe(30);
		expect(deque.at(-3)).toBe(10);
		expect(deque.at(3)).toBeUndefined();
		expect(deque.at(-4)).toBeUndefined();
		expect(deque.at(1.9)).toBe(20);
		expect(deque.at(Number.NaN)).toBe(10);
	});

	test('grows, wraps around, and shrinks while preserving order', () => {
		const deque = new Deque<number>();

		for (let value = 0; value < 40; value++) {
			deque.pushBack(value);
		}

		for (let value = 0; value < 12; value++) {
			expect(deque.popFront()).toBe(value);
		}

		for (let value = 40; value < 60; value++) {
			deque.pushBack(value);
		}

		for (let value = 11; value >= 0; value--) {
			deque.pushFront(value);
		}

		expect(deque.toArray()).toEqual([
			...Array.from({ length: 12 }, (_, index) => index),
			...Array.from({ length: 28 }, (_, index) => index + 12),
			...Array.from({ length: 20 }, (_, index) => index + 40)
		]);

		while (deque.size > 2) {
			deque.popBack();
		}

		expect(deque.toArray()).toEqual([0, 1]);
	});

	test('clear empties the deque and allows it to be reused', () => {
		const deque = new Deque([1, 2, 3]);

		expect(deque.clear()).toBe(deque);
		expect(deque.size).toBe(0);
		expect(deque.isEmpty()).toBe(true);
		expect(deque.toArray()).toEqual([]);
		expect(deque.peekFront()).toBeUndefined();
		expect(deque.pushBack(4).popFront()).toBe(4);
	});

	test('chains push and clear operations', () => {
		const deque = new Deque<number>();

		expect(deque.pushFront(2).pushBack(3).pushFront(1).clear()).toBe(deque);
		expect(deque.isEmpty()).toBe(true);
	});

	test('uses a bounded-state iterator whose reads reflect deque mutations', () => {
		const deque = new Deque([1, 2, 3]);
		const iterator = deque[Symbol.iterator]();

		deque.pushBack(4);

		expect(iterator.next()).toEqual({ done: false, value: 1 });
		expect(deque.popFront()).toBe(1);
		expect(iterator.next()).toEqual({ done: false, value: 3 });
		expect(iterator.next()).toEqual({ done: false, value: 4 });
		expect(iterator.next()).toEqual({ done: true, value: undefined });
	});

	test('ends iteration when mutations leave no value at the next index', () => {
		const deque = new Deque([1, 2, 3]);
		const iterator = deque[Symbol.iterator]();

		expect(iterator.next()).toEqual({ done: false, value: 1 });
		deque.popBack();
		deque.popBack();

		expect(iterator.next()).toEqual({ done: true, value: undefined });
	});

	test('stops a for-of loop when the deque is cleared during iteration', () => {
		const deque = new Deque([1, 2, 3]);
		const visited: number[] = [];

		for (const value of deque) {
			visited.push(value);
			deque.clear();
		}

		expect(visited).toEqual([1]);
	});

	test('matches an Array model for deterministic mixed operations', () => {
		const deque = new Deque<number | undefined>();
		const model: Array<number | undefined> = [];
		let seed = 0x12345678;
		const nextRandom = (): number => {
			seed = (seed * 1664525 + 1013904223) >>> 0;

			return seed;
		};

		for (let operation = 0; operation < 1000; operation++) {
			const choice = nextRandom() % 8;
			const value = nextRandom() % 7 === 0 ? undefined : nextRandom() % 100;

			switch (choice) {
				case 0:
					deque.pushFront(value);
					model.unshift(value);
					break;
				case 1:
					deque.pushBack(value);
					model.push(value);
					break;
				case 2:
					expect(deque.popFront()).toBe(model.shift());
					break;
				case 3:
					expect(deque.popBack()).toBe(model.pop());
					break;
				case 4: {
					const index = model.length === 0 ? 0 : nextRandom() % (model.length + 2) - 1;
					expect(deque.at(index)).toBe(model.at(index));
					break;
				}
				case 5:
					expect(deque.peekFront()).toBe(model[0]);
					break;
				case 6:
					expect(deque.peekBack()).toBe(model.at(-1));
					break;
				case 7:
					if (operation % 23 === 0) {
						deque.clear();
						model.length = 0;
					}
					break;
			}

			expect(deque.size).toBe(model.length);
			expect(deque.isEmpty()).toBe(model.length === 0);
			expect(deque.toArray()).toEqual(model);
			expect([...deque]).toEqual(model);
		}
	});
});
