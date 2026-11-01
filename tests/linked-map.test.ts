import { LinkedMap } from '../src/linked-map.js';
import { vi, describe, beforeEach, expect, it } from 'vitest';

describe('LinkedMap', () => {
	let linkedMap: LinkedMap<string, string>;

	beforeEach(() => {
		linkedMap = new LinkedMap();
	});

	describe('constructor', () => {
		it('should initialize entries from an iterable in order', () => {
			const entries = new LinkedMap([ [ 'first', 1 ], [ 'second', 2 ] ] as const);

			expect(Array.from(entries)).toEqual([ [ 'first', 1 ], [ 'second', 2 ] ]);
		});
	});

	describe('size', () => {
		it('should return the number of key-value pairs in the map', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			expect(linkedMap.size).toBe(2);
		});

		it('should return 0 when the map is empty', () => {
			expect(linkedMap.size).toBe(0);
		});
	});

	describe('mutation-tolerant LinkedMap iterators', () => {
		it('matches native Map when removing current and next entries and reinserting', () => {
			const linkedMap = new LinkedMap<string, number>();
			const nativeMap = new Map<string, number>();
			for (const [ key, value ] of [ [ 'a', 1 ], [ 'b', 2 ], [ 'c', 3 ], [ 'd', 4 ] ] as const) {
				linkedMap.set(key, value);
				nativeMap.set(key, value);
			}

			const actual = linkedMap.entries();
			const expected = nativeMap.entries();
			expect(actual.next()).toEqual(expected.next());

			linkedMap.delete('a');
			nativeMap.delete('a');
			linkedMap.delete('b');
			nativeMap.delete('b');
			expect(actual.next()).toEqual(expected.next());

			linkedMap.delete('c');
			nativeMap.delete('c');
			linkedMap.set('c', 30);
			nativeMap.set('c', 30);
			expect(Array.from(actual)).toEqual(Array.from(expected));
		});

		it('observes an append after the yielded tail is removed', () => {
			const linkedMap = new LinkedMap<string, number>();
			linkedMap.set('a', 1);
			linkedMap.set('b', 2);
			const iterator = linkedMap.keys();

			expect(iterator.next().value).toBe('a');
			expect(iterator.next().value).toBe('b');
			linkedMap.delete('b');
			linkedMap.set('c', 3);

			expect(Array.from(iterator)).toEqual([ 'c' ]);
		});

		it('matches native Map across repeated clear and additions', () => {
			const linkedMap = new LinkedMap<string, number>();
			const nativeMap = new Map<string, number>();
			for (const key of [ 'old-1', 'old-2' ]) {
				linkedMap.set(key, 1);
				nativeMap.set(key, 1);
			}

			const actual = linkedMap.keys();
			const expected = nativeMap.keys();
			expect(actual.next()).toEqual(expected.next());

			linkedMap.clear();
			nativeMap.clear();
			linkedMap.set('discarded', 2);
			nativeMap.set('discarded', 2);
			linkedMap.clear();
			nativeMap.clear();
			linkedMap.set('new-1', 3);
			nativeMap.set('new-1', 3);
			linkedMap.set('new-2', 4);
			nativeMap.set('new-2', 4);

			expect(Array.from(actual)).toEqual(Array.from(expected));
		});

		it('stays done after later clear and additions, like native Map', () => {
			const linkedMap = new LinkedMap<string, number>();
			const nativeMap = new Map<string, number>();
			const actual = linkedMap.values();
			const expected = nativeMap.values();

			expect(actual.next()).toEqual(expected.next());
			linkedMap.set('later', 1);
			nativeMap.set('later', 1);
			linkedMap.clear();
			nativeMap.clear();
			linkedMap.set('latest', 2);
			nativeMap.set('latest', 2);
			expect(actual.next()).toEqual(expected.next());
		});

		it('sees additions made after iterator creation while the collection is empty', () => {
			const linkedMap = new LinkedMap<string, number>();
			const nativeMap = new Map<string, number>();
			const actual = linkedMap.keys();
			const expected = nativeMap.keys();

			linkedMap.set('added', 1);
			nativeMap.set('added', 1);
			expect(actual.next()).toEqual(expected.next());
		});

		it('tolerates moves during iteration, which may skip entries', () => {
			const linkedMap = new LinkedMap<string, number>();
			[ 'a', 'b', 'c' ].forEach((key, index) => linkedMap.set(key, index));
			const iterator = linkedMap.keys();

			expect(iterator.next().value).toBe('a');
			linkedMap.moveToFirst('c');

			expect(Array.from(iterator)).toEqual([ 'b' ]);
		});

		it('keeps multiple iterators independent while entries are removed and reinserted', () => {
			const linkedMap = new LinkedMap<string, number>();
			[ 'a', 'b', 'c' ].forEach((key, index) => linkedMap.set(key, index));
			const first = linkedMap.keys();
			const second = linkedMap.keys();

			expect(first.next().value).toBe('a');
			expect(second.next().value).toBe('a');
			expect(second.next().value).toBe('b');
			linkedMap.delete('a');
			linkedMap.delete('b');
			linkedMap.set('b', 1);

			expect(Array.from(first)).toEqual([ 'c', 'b' ]);
			expect(Array.from(second)).toEqual([ 'c', 'b' ]);
		});
	});

	describe('get', () => {
		it('should retrieve the value associated with a given key', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			expect(linkedMap.get('key1')).toBe('value1');
			expect(linkedMap.get('key2')).toBe('value2');
		});

		it('should return undefined for a key that does not exist', () => {
			expect(linkedMap.get('key1')).toBeUndefined();
		});
	});

	describe('set', () => {
		it('should set the value for a given key', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			expect(linkedMap.get('key1')).toBe('value1');
			expect(linkedMap.get('key2')).toBe('value2');
		});

		it('should update an existing value in place and return this', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');
			const returned = linkedMap.set('key1', 'updatedValue1');

			expect(linkedMap.get('key1')).toBe('updatedValue1');
			expect(Array.from(linkedMap.keys())).toEqual([ 'key1', 'key2' ]);
			expect(returned).toBe(linkedMap);
		});
	});

	describe('getOrInsert', () => {
		it('should insert and return the default value when the key does not exist', () => {
			const value = linkedMap.getOrInsert('key1', 'value1');

			expect(value).toBe('value1');
			expect(linkedMap.get('key1')).toBe('value1');
			expect(Array.from(linkedMap.keys())).toEqual(['key1']);
		});

		it('should return the existing value when the key already exists', () => {
			linkedMap.set('key1', 'value1');

			const value = linkedMap.getOrInsert('key1', 'value2');

			expect(value).toBe('value1');
			expect(linkedMap.get('key1')).toBe('value1');
			expect(Array.from(linkedMap.keys())).toEqual(['key1']);
		});
	});

	describe('getOrInsertComputed', () => {
		it('should compute, insert, and return the value when the key does not exist', () => {
			const compute = vi.fn((key: string) => `${key}-value`);

			const value = linkedMap.getOrInsertComputed('key1', compute);

			expect(value).toBe('key1-value');
			expect(compute).toHaveBeenCalledWith('key1');
			expect(compute).toHaveBeenCalledTimes(1);
			expect(linkedMap.get('key1')).toBe('key1-value');
			expect(Array.from(linkedMap.keys())).toEqual(['key1']);
		});

		it('should return the existing value without computing when the key already exists', () => {
			linkedMap.set('key1', 'value1');
			const compute = vi.fn(() => 'value2');

			const value = linkedMap.getOrInsertComputed('key1', compute);

			expect(value).toBe('value1');
			expect(compute).not.toHaveBeenCalled();
			expect(linkedMap.get('key1')).toBe('value1');
			expect(Array.from(linkedMap.keys())).toEqual(['key1']);
		});

		it('should preserve linked nodes when the callback inserts the same key', () => {
			const value = linkedMap.getOrInsertComputed('key1', () => {
				linkedMap.set('key1', 'from-callback');

				return 'computed';
			});

			expect(value).toBe('computed');
			expect(linkedMap.get('key1')).toBe('computed');
			expect(linkedMap.size).toBe(1);
			expect(Array.from(linkedMap.keys())).toEqual(['key1']);
		});
	});

	describe('addFirst', () => {
		it('should add a key-value pair to the beginning of the map', () => {
			linkedMap.addFirst('key1', 'value1');
			linkedMap.addFirst('key2', 'value2');

			expect(linkedMap.get('key1')).toBe('value1');
			expect(linkedMap.get('key2')).toBe('value2');
			expect(Array.from(linkedMap.keys())).toEqual(['key2', 'key1']);
		});

		it('should update the value and move the key to the beginning of the insertion order if the key already exists', () => {
			linkedMap.addFirst('key1', 'value1');
			linkedMap.addFirst('key2', 'value2');
			linkedMap.addFirst('key1', 'updatedValue1');

			expect(linkedMap.get('key1')).toBe('updatedValue1');
			expect(Array.from(linkedMap.keys())).toEqual(['key1', 'key2']);
		});
	});

	describe('addLast', () => {
		it('should add a key-value pair to the end of the map', () => {
			linkedMap.addLast('key1', 'value1');
			linkedMap.addLast('key2', 'value2');
			linkedMap.addLast('key3', 'value3');
			linkedMap.addLast('key4', 'value4');

			expect(Array.from(linkedMap.keys())).toEqual(['key1', 'key2', 'key3', 'key4']);
		});

		it('should update the value and move the key to the end of the insertion order if the key already exists', () => {
			linkedMap.addLast('key1', 'value1');
			linkedMap.addLast('key2', 'value2');
			linkedMap.addLast('key3', 'value3');

			linkedMap.addLast('key1', 'updatedValue1');

			expect(linkedMap.get('key1')).toBe('updatedValue1');
			expect(Array.from(linkedMap.keys())).toEqual(['key2', 'key3', 'key1']);
		});
	});

	it('should allow chaining fluent mutation methods', () => {
		const result = linkedMap
			.addFirst('first', 'one')
			.addLast('last', 'two')
			.moveToFirst('last')
			.moveToLast('first');

		expect(result).toBe(linkedMap);
		expect(Array.from(linkedMap.keys())).toEqual([ 'last', 'first' ]);
		expect(linkedMap.clear()).toBe(linkedMap);
		expect(linkedMap.size).toBe(0);
	});

	describe('getFirst', () => {
		it('should retrieve the value associated with the first key in the map', () => {
			linkedMap.addFirst('key1', 'value1');

			expect(linkedMap.getFirst()).toBe('value1');
		});

		it('should return undefined if the map is empty', () => {
			expect(linkedMap.getFirst()).toBeUndefined();
		});

		it('should not move the key to the end of the insertion order', () => {
			linkedMap.addFirst('key1', 'value1');
			linkedMap.addFirst('key2', 'value2');

			linkedMap.getFirst();

			expect(Array.from(linkedMap.keys())).toEqual(['key2', 'key1']);
		});
	});

	describe('getLast', () => {
		it('should retrieve the value associated with the last key in the map in insertion order', () => {
			linkedMap.addFirst('key1', 'value1');
			linkedMap.addFirst('key2', 'value2');
			linkedMap.addFirst('key3', 'value3');

			expect(linkedMap.getLast()).toBe('value1');
		});

		it('should retrieve the value associated with the last key in the map in insertion order', () => {
			linkedMap.addFirst('key1', 'value1');
			linkedMap.addFirst('key2', 'value2');
			linkedMap.addFirst('key3', 'value3');
			linkedMap.moveToFirst('key1');

			expect(linkedMap.getLast()).toBe('value2');
		});

		it('should return undefined if the map is empty', () => {
			expect(linkedMap.getLast()).toBeUndefined();
		});
	});

	describe('first and last entries', () => {
		it('should return the first and last keys and entries', () => {
			linkedMap.set('first', 'one');
			linkedMap.set('last', 'two');

			expect(linkedMap.firstKey()).toBe('first');
			expect(linkedMap.lastKey()).toBe('last');
			expect(linkedMap.firstEntry()).toEqual([ 'first', 'one' ]);
			expect(linkedMap.lastEntry()).toEqual([ 'last', 'two' ]);
		});

		it('should return undefined for absent keys and entries', () => {
			expect(linkedMap.firstKey()).toBeUndefined();
			expect(linkedMap.lastKey()).toBeUndefined();
			expect(linkedMap.firstEntry()).toBeUndefined();
			expect(linkedMap.lastEntry()).toBeUndefined();
		});

		it('should preserve null and undefined keys and values in entries', () => {
			const nullable = new LinkedMap<null | undefined, null | undefined>();
			nullable.set(null, undefined);
			nullable.set(undefined, null);

			expect(nullable.firstKey()).toBeNull();
			expect(nullable.lastKey()).toBeUndefined();
			expect(nullable.getFirst()).toBeUndefined();
			expect(nullable.getLast()).toBeNull();
			expect(nullable.firstEntry()).toEqual([ null, undefined ]);
			expect(nullable.lastEntry()).toEqual([ undefined, null ]);
			expect(nullable.removeFirst()).toEqual([ null, undefined ]);
			expect(nullable.removeLast()).toEqual([ undefined, null ]);
		});
	});

	describe('moveToFirst', () => {
		it('should move a key to the beginning of the insertion order', () => {
			linkedMap.addFirst('key1', 'value1');
			linkedMap.addFirst('key2', 'value2');
			linkedMap.addFirst('key3', 'value3');

			linkedMap.moveToFirst('key2');

			expect(Array.from(linkedMap.keys())).toEqual(['key2', 'key3', 'key1']);
		});

		it('should not move the key if it is already at the beginning of the insertion order', () => {
			linkedMap.addFirst('key1', 'value1');
			linkedMap.addFirst('key2', 'value2');

			linkedMap.moveToFirst('key2');

			expect(Array.from(linkedMap.keys())).toEqual(['key2', 'key1']);
		});

		it('should move the last key to the beginning of the insertion order', () => {
			linkedMap.addFirst('key1', 'value1');
			linkedMap.addFirst('key2', 'value2');
			linkedMap.addFirst('key3', 'value3');

			linkedMap.moveToFirst('key1');

			expect(Array.from(linkedMap.keys())).toEqual(['key1', 'key3', 'key2']);
		});

		it('should move the last key to the beginning of the insertion order', () => {
			linkedMap.addFirst('key1', 'value1');
			linkedMap.addFirst('key2', 'value2');
			linkedMap.addFirst('key3', 'value3');

			linkedMap.moveToFirst('key2');

			expect(Array.from(linkedMap.keys())).toEqual(['key2', 'key3', 'key1']);
		});

		it('should return this if the key does not exist', () => {
			expect(linkedMap.moveToFirst('key1')).toBe(linkedMap);
		});
	});

	describe('moveToLast', () => {
		it('should move a key to the end of the insertion order', () => {
			linkedMap.addFirst('key1', 'value1');
			linkedMap.addFirst('key2', 'value2');
			linkedMap.addFirst('key3', 'value3');

			linkedMap.moveToLast('key2');

			expect(Array.from(linkedMap.keys())).toEqual(['key3', 'key1', 'key2']);
		});

		it('should not move the key if it is already at the end of the insertion order', () => {
			linkedMap.addFirst('key1', 'value1');
			linkedMap.addFirst('key2', 'value2');
			linkedMap.addFirst('key3', 'value3');

			linkedMap.moveToLast('key1');

			expect(Array.from(linkedMap.keys())).toEqual(['key3', 'key2', 'key1']);
		});

		it('should move the first key to the end of the insertion order', () => {
			linkedMap.addFirst('key1', 'value1');
			linkedMap.addFirst('key2', 'value2');
			linkedMap.addFirst('key3', 'value3');
			linkedMap.addFirst('key4', 'value4');

			linkedMap.moveToLast('key4');

			expect(Array.from(linkedMap.keys())).toEqual(['key3', 'key2', 'key1', 'key4']);
		});
	});

	describe('delete', () => {
		it('should delete a key-value pair from the map', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			expect(linkedMap.delete('key1')).toBe(true);
			expect(linkedMap.has('key1')).toBe(false);
			expect(linkedMap.size).toBe(1);
		});

		it('should return false if the key does not exist in the map', () => {
			expect(linkedMap.delete('key1')).toBe(false);
		});

		it('should not move the key to the end of the insertion order', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			linkedMap.delete('key1');

			expect(Array.from(linkedMap.keys())).toEqual(['key2']);

			linkedMap.delete('key2');

			expect(Array.from(linkedMap.keys())).toEqual([]);
		});

		it('should support null keys', () => {
			const nullKeys = new LinkedMap<string | null, string>();
			nullKeys.set(null, 'value');

			expect(nullKeys.delete(null)).toBe(true);
			expect(nullKeys.has(null)).toBe(false);
		});
	});

	describe('remove alias', () => {
		it('should delegate to delete', () => {
			const deleteSpy = vi.spyOn(linkedMap, 'delete');
			linkedMap.set('key', 'value');

			expect(linkedMap.remove('key')).toBe(true);
			expect(deleteSpy).toHaveBeenCalledWith('key');
		});
	});

	describe('removeFirst', () => {
		it('should delete the first key-value pair from the map', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			expect(linkedMap.removeFirst()).toEqual([ 'key1', 'value1' ]);
		});

		it('should return undefined if the map is empty', () => {
			expect(linkedMap.removeFirst()).toBeUndefined();
		});

		it('should not move the key to the end of the insertion order', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			linkedMap.removeFirst();

			expect(Array.from(linkedMap.keys())).toEqual(['key2']);
		});
	});

	describe('removeLast', () => {
		it('should delete the last key-value pair from the map', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			expect(linkedMap.removeLast()).toEqual([ 'key2', 'value2' ]);
		});

		it('should return undefined if the map is empty', () => {
			expect(linkedMap.removeLast()).toBeUndefined();
		});

		it('should not move the key to the end of the insertion order', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			linkedMap.removeLast();

			expect(Array.from(linkedMap.keys())).toEqual(['key1']);
		});
	});

	describe('has', () => {
		it('should check if a key exists in the map', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			expect(linkedMap.has('key1')).toBe(true);
			expect(linkedMap.has('key2')).toBe(true);
			expect(linkedMap.has('key3')).toBe(false);
		});
	});

	describe('clear', () => {
		it('should remove all key-value pairs from the map', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			expect(linkedMap.clear()).toBe(linkedMap);

			expect(linkedMap.size).toBe(0);
			expect(linkedMap.has('key1')).toBe(false);
			expect(linkedMap.has('key2')).toBe(false);
		});
	});

	describe('keys', () => {
		it('should return an iterator that yields all keys in the map in their insertion order', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			const keys = linkedMap.keys();
			expect(keys.next().value).toBe('key1');
			expect(keys.next().value).toBe('key2');
			expect(keys.next().done).toBe(true);
		});

		it('should support closing the iterator early', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');
			const keys = linkedMap.keys();

			expect(keys.next()).toEqual({ done: false, value: 'key1' });
			expect(keys.return()).toEqual({ done: true, value: undefined });
			expect(keys.next()).toEqual({ done: true, value: undefined });
		});

		it('should close the iterator when an error is thrown into it', () => {
			linkedMap.set('key1', 'value1');
			const keys = linkedMap.keys();
			const error = new Error('iteration failed');

			expect(() => keys.throw(error)).toThrow(error);
			expect(keys.next()).toEqual({ done: true, value: undefined });
		});
	});

	describe('values', () => {
		it('should return an iterator that yields all values in the map in their insertion order', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			const values = linkedMap.values();
			expect(values[Symbol.iterator]()).toBe(values);
			expect(values.next().value).toBe('value1');
			expect(values.next().value).toBe('value2');
			expect(values.next().done).toBe(true);
		});

		it('should close the iterator when an error is thrown into it', () => {
			linkedMap.set('key1', 'value1');
			const values = linkedMap.values();
			const error = new Error('iteration failed');

			expect(() => values.throw(error)).toThrow(error);
			expect(values.next()).toEqual({ done: true, value: undefined });
		});

		it('should support closing the iterator early', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');
			const values = linkedMap.values();

			expect(values.next()).toEqual({ done: false, value: 'value1' });
			expect(values.return()).toEqual({ done: true, value: undefined });
			expect(values.next()).toEqual({ done: true, value: undefined });
		});
	});

	describe('entries', () => {
		it('should return an iterator that yields all key-value pairs in the map as arrays in their insertion order', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			const entries = linkedMap.entries();
			expect(entries[Symbol.iterator]()).toBe(entries);
			expect(entries.next().value).toEqual(['key1', 'value1']);
			expect(entries.next().value).toEqual(['key2', 'value2']);
			expect(entries.next().done).toBe(true);
		});

		it('should support closing the iterator early', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');
			const entries = linkedMap.entries();

			expect(entries.next()).toEqual({ done: false, value: ['key1', 'value1'] });
			expect(entries.return()).toEqual({ done: true, value: undefined });
			expect(entries.next()).toEqual({ done: true, value: undefined });
		});

		it('should close the iterator when an error is thrown into it', () => {
			linkedMap.set('key1', 'value1');
			const entries = linkedMap.entries();
			const error = new Error('iteration failed');

			expect(() => entries.throw(error)).toThrow(error);
			expect(entries.next()).toEqual({ done: true, value: undefined });
		});
	});

	describe('forEach', () => {
		it('should execute a provided function once for each key-value pair in the map', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			const callback = vi.fn();
			linkedMap.forEach(callback);

			expect(callback).toHaveBeenCalledTimes(2);
			expect(callback).toHaveBeenCalledWith('value1', 'key1', linkedMap);
			expect(callback).toHaveBeenCalledWith('value2', 'key2', linkedMap);
		});

		it('should execute the callback with the provided thisArg as the `this` value', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			const callback = vi.fn();
			const thisArg = {};

			linkedMap.forEach(callback, thisArg);

			expect(callback).toHaveBeenCalledWith('value1', 'key1', linkedMap);
			expect(callback).toHaveBeenCalledWith('value2', 'key2', linkedMap);
			expect(callback.mock.instances[0]).toBe(thisArg);
			expect(callback.mock.instances[1]).toBe(thisArg);
		});
	});

	describe('Symbol.iterator', () => {
		it('should return an iterator that yields all key-value pairs in the map as arrays in their insertion order', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			const iterator = linkedMap[Symbol.iterator]();
			expect(iterator.next().value).toEqual(['key1', 'value1']);
			expect(iterator.next().value).toEqual(['key2', 'value2']);
			expect(iterator.next().done).toBe(true);
		});
	});
});
