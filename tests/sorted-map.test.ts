import { describe, expect, it } from 'vitest';
import { SortedMap } from '../src/sorted-map.js';

describe('SortedMap', () => {
	it('constructs in key order and exposes sorted map iterators', () => {
		const map = new SortedMap([ [ 3, 'three' ], [ 1, 'one' ], [ 2, 'two' ] ]);

		expect(map.toArray()).toEqual([ [ 1, 'one' ], [ 2, 'two' ], [ 3, 'three' ] ]);
		expect([ ...map ]).toEqual(map.toArray());
		expect([ ...map.entries() ]).toEqual(map.toArray());
		expect([ ...map.keys() ]).toEqual([ 1, 2, 3 ]);
		expect([ ...map.values() ]).toEqual([ 'one', 'two', 'three' ]);
		expect(map.firstKey()).toBe(1);
		expect(map.lastKey()).toBe(3);
		expect(map.firstEntry()).toEqual([ 1, 'one' ]);
		expect(map.lastEntry()).toEqual([ 3, 'three' ]);
	});

	it('updates comparator-equivalent keys without replacing the stored key or its order', () => {
		const compare = (left: string, right: string): number => left.toLowerCase().localeCompare(right.toLowerCase());
		const map = new SortedMap([ [ 'Bravo', 2 ], [ 'alpha', 1 ], [ 'CHARLIE', 3 ] ], compare);

		expect(map.toArray()).toEqual([ [ 'alpha', 1 ], [ 'Bravo', 2 ], [ 'CHARLIE', 3 ] ]);
		expect(map.set('bRaVo', 20)).toBe(map);
		expect(map.get('BRAVO')).toBe(20);
		expect(map.has('bravo')).toBe(true);
		expect(map.toArray()).toEqual([ [ 'alpha', 1 ], [ 'Bravo', 20 ], [ 'CHARLIE', 3 ] ]);
		expect(map.delete('cHaRLiE')).toBe(true);
		expect(map.delete('charlie')).toBe(false);
		expect(map.toArray()).toEqual([ [ 'alpha', 1 ], [ 'Bravo', 20 ] ]);
	});

	it('keeps the first key and the last value for comparator-equivalent constructor entries', () => {
		const compare = (left: string, right: string): number => left.toLowerCase().localeCompare(right.toLowerCase());
		const map = new SortedMap([ [ 'b', 1 ], [ 'A', 2 ], [ 'B', 3 ], [ 'a', 4 ], [ 'c', 5 ] ], compare);

		expect(map.toArray()).toEqual([ [ 'A', 4 ], [ 'b', 3 ], [ 'c', 5 ] ]);
		expect(map.size).toBe(3);
	});

	it('constructs an empty map from an empty iterable', () => {
		const map = new SortedMap<number, string>([]);

		expect(map.size).toBe(0);
		expect(map.set(1, 'one').toArray()).toEqual([ [ 1, 'one' ] ]);
	});

	it('does not share constructor entry tuples or toArray tuples with the map', () => {
		const entry: [ number, string ] = [ 1, 'one' ];
		const map = new SortedMap([ entry ]);
		entry[1] = 'changed';
		map.toArray()[0]![1] = 'also changed';

		expect(map.get(1)).toBe('one');
	});

	it('orders NaN keys consistently and updates an existing NaN key', () => {
		const map = new SortedMap([ [ Number.NaN, 'first' ], [ 2, 'two' ], [ Number.NaN, 'updated' ], [ 1, 'one' ] ]);

		expect(map.toArray()).toEqual([ [ 1, 'one' ], [ 2, 'two' ], [ Number.NaN, 'updated' ] ]);
		expect(map.get(Number.NaN)).toBe('updated');
		expect(map.size).toBe(3);
	});

	it('supports inclusive and strict navigation at and beyond boundaries', () => {
		const map = new SortedMap([ [ 10, 'a' ], [ 20, 'b' ], [ 30, 'c' ] ]);

		expect(map.floor(20)).toEqual([ 20, 'b' ]);
		expect(map.ceiling(20)).toEqual([ 20, 'b' ]);
		expect(map.lower(20)).toEqual([ 10, 'a' ]);
		expect(map.higher(20)).toEqual([ 30, 'c' ]);
		expect(map.floor(5)).toBeUndefined();
		expect(map.lower(10)).toBeUndefined();
		expect(map.ceiling(35)).toBeUndefined();
		expect(map.higher(30)).toBeUndefined();
		expect(new SortedMap<number, string>().firstKey()).toBeUndefined();
		expect(new SortedMap<number, string>().lastKey()).toBeUndefined();
		expect(new SortedMap<number, string>().firstEntry()).toBeUndefined();
		expect(new SortedMap<number, string>().lastEntry()).toBeUndefined();
	});

	it('iterates half-open key ranges and returns empty iterators for reversed or empty ranges', () => {
		const map = new SortedMap([ [ 1, 'a' ], [ 2, 'b' ], [ 3, 'c' ], [ 4, 'd' ], [ 5, 'e' ] ]);

		expect([ ...map.range(2, 5) ]).toEqual([ [ 2, 'b' ], [ 3, 'c' ], [ 4, 'd' ] ]);
		expect([ ...map.range(0, 2) ]).toEqual([ [ 1, 'a' ] ]);
		expect([ ...map.range(5, 5) ]).toEqual([]);
		expect([ ...map.range(6, 3) ]).toEqual([]);
		expect([ ...map.range(0, 10) ]).toEqual(map.toArray());
	});

	it('returns independent entry tuples and supports fluent clearing', () => {
		const map = new SortedMap([ [ 1, 'one' ] ]);
		const entry = map.firstEntry()!;
		entry[1] = 'changed';

		expect(map.get(1)).toBe('one');
		expect(map.clear()).toBe(map);
		expect(map.size).toBe(0);
		expect(map.isEmpty()).toBe(true);
	});

	it('matches a sorted-array model through a fixed-seed operation sequence', () => {
		const map = new SortedMap<number, number>();
		const model: [number, number][] = [];
		let seed = 0x51a7ed;
		const random = (): number => {
			seed = (Math.imul(seed, 1103515245) + 12345) >>> 0;

			return seed;
		};

		for (let operation = 0; operation < 500; operation++) {
			const key = random() % 51 - 25;
			const value = random() % 1000;
			const index = model.findIndex(([ existing ]) => existing === key);
			switch (random() % 4) {
				case 0:
				case 1: {
					expect(map.set(key, value)).toBe(map);
					if (index < 0) {
						model.push([ key, value ]);
						model.sort(([ left ], [ right ]) => left - right);
					} else {
						model[index]![1] = value;
					}
					break;
				}
				case 2:
					expect(map.delete(key)).toBe(index >= 0);
					if (index >= 0) { model.splice(index, 1); }
					break;
				default:
					expect(map.get(key)).toBe(index < 0 ? undefined : model[index]![1]);
					expect(map.has(key)).toBe(index >= 0);
			}

			expect(map.toArray()).toEqual(model);
			expect(map.size).toBe(model.length);
			expect([ ...map ]).toEqual(model);
			expect([ ...map.range(key - 2, key + 3) ]).toEqual(model.filter(([ existing ]) => existing >= key - 2 && existing < key + 3));
		}
	});
});
