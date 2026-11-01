import { BiMap } from '../src/bi-map.js';
import { describe, expect, it, vi } from 'vitest';

describe('BiMap', () => {
	it('evicts the prior pair when a key is reassigned', () => {
		const map = new BiMap<string, number>([ [ 'a', 1 ], [ 'b', 2 ] ]);

		expect(map.set('a', 3)).toBe(map);
		expect(Array.from(map)).toEqual([ [ 'b', 2 ], [ 'a', 3 ] ]);
		expect(map.hasValue(1)).toBe(false);
		expect(map.getKey(3)).toBe('a');
	});

	it('evicts the prior pair when a value is assigned to another key', () => {
		const map = new BiMap<string, number>([ [ 'a', 1 ], [ 'b', 2 ] ]);

		map.set('c', 2);

		expect(Array.from(map)).toEqual([ [ 'a', 1 ], [ 'c', 2 ] ]);
		expect(map.has('b')).toBe(false);
		expect(map.get('c')).toBe(2);
	});

	it('does not change insertion order when setting the same pair', () => {
		const map = new BiMap<string, number>([ [ 'a', 1 ], [ 'b', 2 ] ]);

		map.set('a', 1);

		expect(Array.from(map)).toEqual([ [ 'a', 1 ], [ 'b', 2 ] ]);
	});

	it('evicts both pairs when the key and the value belong to different pairs', () => {
		const map = new BiMap<string, number>([ [ 'a', 1 ], [ 'b', 2 ], [ 'c', 3 ] ]);

		expect(map.set('a', 2)).toBe(map);

		expect(Array.from(map)).toEqual([ [ 'c', 3 ], [ 'a', 2 ] ]);
		expect(map.size).toBe(2);
		expect(map.has('b')).toBe(false);
		expect(map.hasValue(1)).toBe(false);
		expect(map.getKey(2)).toBe('a');
	});

	it('treats NaN as equal to itself when setting an existing pair', () => {
		const map = new BiMap<number, number>([ [ Number.NaN, Number.NaN ], [ 1, 2 ] ]);

		map.set(Number.NaN, Number.NaN);

		expect(Array.from(map)).toEqual([ [ Number.NaN, Number.NaN ], [ 1, 2 ] ]);
		expect(map.size).toBe(2);
	});

	it('deletes by key and by value', () => {
		const map = new BiMap<string, number>([ [ 'a', 1 ], [ 'b', 2 ] ]);

		expect(map.delete('a')).toBe(true);
		expect(map.delete('missing')).toBe(false);
		expect(map.deleteValue(2)).toBe(true);
		expect(map.deleteValue(2)).toBe(false);
		expect(map.size).toBe(0);
	});

	it('supports undefined and null keys and values', () => {
		const map = new BiMap<string | null | undefined, string | null | undefined>();
		map.set(undefined, null);
		map.set(null, undefined);

		expect(map.has(undefined)).toBe(true);
		expect(map.hasValue(null)).toBe(true);
		expect(map.get(undefined)).toBe(null);
		expect(map.getKey(null)).toBe(undefined);
		expect(map.hasValue(undefined)).toBe(true);
		expect(map.get(null)).toBe(undefined);
		expect(map.getKey(undefined)).toBe(null);
		expect(map.delete(undefined)).toBe(true);
		expect(map.hasValue(null)).toBe(false);
	});

	it('initializes from an iterable and resolves constructor collisions', () => {
		const map = new BiMap([ [ 'a', 1 ], [ 'b', 2 ], [ 'a', 3 ], [ 'c', 2 ] ] as const);

		expect(Array.from(map)).toEqual([ [ 'a', 3 ], [ 'c', 2 ] ]);
	});

	it('exposes native-map style iteration and forEach arguments', () => {
		const map = new BiMap<string, number>([ [ 'a', 1 ], [ 'b', 2 ] ]);
		const callback = vi.fn();

		expect(Array.from(map.keys())).toEqual([ 'a', 'b' ]);
		expect(Array.from(map.values())).toEqual([ 1, 2 ]);
		expect(Array.from(map.entries())).toEqual([ [ 'a', 1 ], [ 'b', 2 ] ]);
		expect(Array.from(map)).toEqual([ [ 'a', 1 ], [ 'b', 2 ] ]);

		map.forEach(callback);

		expect(callback).toHaveBeenNthCalledWith(1, 1, 'a', map);
		expect(callback).toHaveBeenNthCalledWith(2, 2, 'b', map);
	});

	it('keeps the inverse view live in both directions', () => {
		const map = new BiMap<string, number>([ [ 'a', 1 ], [ 'b', 2 ] ]);
		const inverse = map.inverse();

		expect(Array.from(inverse)).toEqual([ [ 1, 'a' ], [ 2, 'b' ] ]);
		inverse.set(3, 'c');
		expect(map.get('c')).toBe(3);

		map.set('d', 4);
		expect(inverse.get(4)).toBe('d');

		inverse.delete(1);
		expect(map.has('a')).toBe(false);
		inverse.set(2, 'renamed');
		expect(map.has('b')).toBe(false);
		expect(map.get('renamed')).toBe(2);

		expect(inverse.clear()).toBe(inverse);
		expect(map.size).toBe(0);
	});

	it('returns this from clear', () => {
		const map = new BiMap<string, number>([ [ 'a', 1 ] ]);

		expect(map.clear()).toBe(map);
		expect(map.size).toBe(0);
	});
});
