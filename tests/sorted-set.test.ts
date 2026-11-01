import { describe, expect, it } from 'vitest';
import { SortedSet } from '../src/sorted-set.js';

describe('SortedSet', () => {
	it('constructs, iterates, and returns fluent mutation results', () => {
		const set = new SortedSet([ 4, 1, 3, 1 ]);

		expect(set.toArray()).toEqual([ 1, 3, 4 ]);
		expect([ ...set ]).toEqual([ 1, 3, 4 ]);
		expect(set.add(2)).toBe(set);
		expect(set.add(3)).toBe(set);
		expect(set.toArray()).toEqual([ 1, 2, 3, 4 ]);
		expect(set.size).toBe(4);
		expect(set.isEmpty()).toBe(false);
		expect(set.has(2)).toBe(true);
		expect(set.delete(2)).toBe(true);
		expect(set.delete(2)).toBe(false);
		expect(set.clear()).toBe(set);
		expect(set.size).toBe(0);
		expect(set.isEmpty()).toBe(true);
	});

	it('constructs an empty set from an empty iterable', () => {
		const set = new SortedSet<number>([]);

		expect(set.size).toBe(0);
		expect(set.isEmpty()).toBe(true);
		expect(set.toArray()).toEqual([]);
		expect([ ...set ]).toEqual([]);
		expect(set.add(1).toArray()).toEqual([ 1 ]);
	});

	it('supports inclusive and strict navigation at and beyond boundaries', () => {
		const set = new SortedSet([ 10, 20, 30 ]);

		expect(set.first()).toBe(10);
		expect(set.last()).toBe(30);
		expect(set.floor(20)).toBe(20);
		expect(set.ceiling(20)).toBe(20);
		expect(set.lower(20)).toBe(10);
		expect(set.higher(20)).toBe(30);
		expect(set.floor(5)).toBeUndefined();
		expect(set.lower(10)).toBeUndefined();
		expect(set.ceiling(35)).toBeUndefined();
		expect(set.higher(30)).toBeUndefined();
		expect(new SortedSet<number>().first()).toBeUndefined();
		expect(new SortedSet<number>().last()).toBeUndefined();
	});

	it('uses comparator equality for uniqueness and orders with a custom comparator', () => {
		const caseInsensitive = (left: string, right: string): number => left.toLowerCase().localeCompare(right.toLowerCase());
		const set = new SortedSet([ 'Pear', 'fig', 'plum', 'kiwi' ], caseInsensitive);

		expect(set.toArray()).toEqual([ 'fig', 'kiwi', 'Pear', 'plum' ]);
		expect(set.has('PEAR')).toBe(true);
		expect(set.add('PEAR')).toBe(set);
		expect(set.toArray()).toEqual([ 'fig', 'kiwi', 'Pear', 'plum' ]);
		expect(set.delete('PLUM')).toBe(true);
		expect(set.toArray()).toEqual([ 'fig', 'kiwi', 'Pear' ]);
	});

	it('keeps the first of comparator-equivalent constructor values', () => {
		const compare = (left: string, right: string): number => left.toLowerCase().localeCompare(right.toLowerCase());

		expect(new SortedSet([ 'b', 'A', 'B', 'a', 'c' ], compare).toArray()).toEqual([ 'A', 'b', 'c' ]);
	});

	it('orders undefined constructor values with the comparator', () => {
		const compare = (left: number | undefined, right: number | undefined): number => (left ?? -Infinity) - (right ?? -Infinity) || 0;

		expect(new SortedSet([ 3, undefined, 1, undefined ], compare).toArray()).toEqual([ undefined, 1, 3 ]);
	});

	it('sorts numeric NaN values consistently and treats duplicate NaN values as equal', () => {
		const set = new SortedSet([ Number.NaN, 2, Number.NaN, 1 ]);

		expect(set.toArray().slice(0, 2)).toEqual([ 1, 2 ]);
		expect(set.size).toBe(3);
		expect(set.has(Number.NaN)).toBe(true);
	});

	it('iterates half-open ranges and returns empty iterators for reversed or empty ranges', () => {
		const set = new SortedSet([ 1, 2, 3, 4, 5 ]);

		expect([ ...set.range(2, 5) ]).toEqual([ 2, 3, 4 ]);
		expect([ ...set.range(0, 2) ]).toEqual([ 1 ]);
		expect([ ...set.range(5, 5) ]).toEqual([]);
		expect([ ...set.range(6, 3) ]).toEqual([]);
		expect([ ...set.range(0, 10) ]).toEqual([ 1, 2, 3, 4, 5 ]);
	});

	it('matches a sorted-array model through a fixed-seed operation sequence', () => {
		const set = new SortedSet<number>();
		const model: number[] = [];
		let seed = 0x5eed1234;
		const random = (): number => {
			seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;

			return seed;
		};

		for (let operation = 0; operation < 500; operation++) {
			const value = random() % 61 - 30;
			switch (random() % 4) {
				case 0: {
					expect(set.add(value)).toBe(set);
					if (!model.includes(value)) {
						model.push(value);
						model.sort((left, right) => left - right);
					}
					break;
				}
				case 1: {
					const index = model.indexOf(value);
					expect(set.delete(value)).toBe(index >= 0);
					if (index >= 0) { model.splice(index, 1); }
					break;
				}
				case 2:
					expect(set.has(value)).toBe(model.includes(value));
					break;
				default:
					expect([ ...set.range(value, value + 8) ]).toEqual(model.filter((entry) => entry >= value && entry < value + 8));
			}

			expect(set.toArray()).toEqual(model);
			expect(set.size).toBe(model.length);
			expect([ ...set ]).toEqual(model);
		}
	});
});
