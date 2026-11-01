import { describe, expect, it } from 'vitest';
import { MultiSet } from '../src/multi-set';

describe('MultiSet', () => {
	it('constructs from an iterable with duplicates in element insertion order', () => {
		const multiSet = new MultiSet(['apple', 'pear', 'apple']);

		expect(multiSet.count('apple')).toBe(2);
		expect(multiSet.count('pear')).toBe(1);
		expect(multiSet.size).toBe(3);
		expect(multiSet.uniqueSize).toBe(2);
		expect([...multiSet.entries()]).toEqual([['apple', 2], ['pear', 1]]);
		expect([...multiSet]).toEqual(['apple', 'apple', 'pear']);
	});

	it('constructs from a generator iterable', () => {
		function* elements(): IterableIterator<number> {
			yield 2;
			yield 1;
			yield 2;
		}

		const multiSet = new MultiSet(elements());

		expect([...multiSet.entries()]).toEqual([[2, 2], [1, 1]]);
		expect(multiSet.size).toBe(3);
		expect(multiSet.uniqueSize).toBe(2);
	});

	it('constructs an empty collection when the iterable is omitted or undefined', () => {
		for (const multiSet of [new MultiSet<string>(), new MultiSet<string>(undefined)]) {
			expect(multiSet.size).toBe(0);
			expect(multiSet.uniqueSize).toBe(0);
			expect([...multiSet]).toEqual([]);
		}
	});

	it('preserves undefined occurrences from the constructor iterable', () => {
		const multiSet = new MultiSet([undefined, 'value', undefined]);

		expect(multiSet.has(undefined)).toBe(true);
		expect(multiSet.count(undefined)).toBe(2);
		expect(multiSet.size).toBe(3);
		expect(multiSet.uniqueSize).toBe(2);
		expect([...multiSet.entries()]).toEqual([[undefined, 2], ['value', 1]]);
	});

	it('tracks occurrence counts and fluent additions', () => {
		const multiSet = new MultiSet<string>();

		expect(multiSet.add('apple')).toBe(multiSet);
		expect(multiSet.add('apple', 2)).toBe(multiSet);
		multiSet.add('pear', 3);

		expect(multiSet.count('apple')).toBe(3);
		expect(multiSet.count('pear')).toBe(3);
		expect(multiSet.count('missing')).toBe(0);
		expect(multiSet.has('apple')).toBe(true);
		expect(multiSet.has('missing')).toBe(false);
		expect(multiSet.size).toBe(6);
		expect(multiSet.uniqueSize).toBe(2);
	});

	it('removes up to the requested count and re-adds at the end of insertion order', () => {
		const multiSet = new MultiSet<string>();
		multiSet.add('first', 3).add('second', 2);

		expect(multiSet.remove('first', 2)).toBe(multiSet);
		expect(multiSet.count('first')).toBe(1);
		expect(multiSet.remove('first', 10)).toBe(multiSet);
		expect(multiSet.has('first')).toBe(false);
		expect(multiSet.size).toBe(2);

		multiSet.add('first', 2);
		expect([...multiSet.entries()]).toEqual([['second', 2], ['first', 2]]);
		expect(multiSet.toArray()).toEqual(['second', 'second', 'first', 'first']);
	});

	it('stores undefined and null as ordinary elements', () => {
		const multiSet = new MultiSet<string | null | undefined>();
		multiSet.add(undefined, 2).add(null);

		expect(multiSet.has(undefined)).toBe(true);
		expect(multiSet.count(undefined)).toBe(2);
		expect(multiSet.has(null)).toBe(true);
		expect(multiSet.count(null)).toBe(1);
		expect([...multiSet.entries()]).toEqual([[undefined, 2], [null, 1]]);
		expect(multiSet.toArray()).toEqual([undefined, undefined, null]);
	});

	it('rejects invalid counts without changing the collection', () => {
		const multiSet = new MultiSet<string>();
		multiSet.add('kept', 2);

		for (const count of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1]) {
			expect(() => multiSet.add('new', count)).toThrow(RangeError);
			expect(() => multiSet.remove('kept', count)).toThrow(RangeError);
		}

		expect([...multiSet.entries()]).toEqual([['kept', 2]]);
	});

	it('rejects additions that exceed the maximum safe total without mutating state', () => {
		const multiSet = new MultiSet<string>();
		multiSet.add('kept', Number.MAX_SAFE_INTEGER);

		expect(() => multiSet.add('kept')).toThrow(RangeError);
		expect(() => multiSet.add('other')).toThrow(RangeError);
		expect(multiSet.count('kept')).toBe(Number.MAX_SAFE_INTEGER);
		expect(multiSet.has('other')).toBe(false);
		expect(multiSet.size).toBe(Number.MAX_SAFE_INTEGER);
	});

	it('clears all occurrences and returns itself', () => {
		const multiSet = new MultiSet<string>();
		multiSet.add('value', 3);

		expect(multiSet.clear()).toBe(multiSet);
		expect(multiSet.size).toBe(0);
		expect(multiSet.uniqueSize).toBe(0);
		expect([...multiSet]).toEqual([]);
	});

	it('keeps iteration, entries, and arrays consistent through a sequence of operations', () => {
		const multiSet = new MultiSet<number>();
		const expectedCounts = new Map<number, number>();

		for (let step = 0; step < 100; step++) {
			const element = step % 7;
			const count = (step % 4) + 1;

			if (step % 3 === 0) {
				multiSet.remove(element, count);
				const remaining = (expectedCounts.get(element) ?? 0) - count;

				if (remaining > 0) {
					expectedCounts.set(element, remaining);
				} else {
					expectedCounts.delete(element);
				}
			} else {
				multiSet.add(element, count);
				expectedCounts.set(element, (expectedCounts.get(element) ?? 0) + count);
			}

			const expectedArray = [...expectedCounts].flatMap(([value, occurrences]) =>
				Array.from({ length: occurrences }, () => value)
			);

			expect([...multiSet.entries()]).toEqual([...expectedCounts]);
			expect(multiSet.toArray()).toEqual(expectedArray);
			expect([...multiSet]).toEqual(expectedArray);
			expect(multiSet.size).toBe(expectedArray.length);
			expect(multiSet.uniqueSize).toBe(expectedCounts.size);

			for (let value = 0; value < 7; value++) {
				expect(multiSet.count(value)).toBe(expectedCounts.get(value) ?? 0);
				expect(multiSet.has(value)).toBe(expectedCounts.has(value));
			}
		}
	});
});
