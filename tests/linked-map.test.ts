import { LinkedMap } from '../src/linked-map.js';
import { vi, describe, beforeEach, expect, it } from 'vitest';

describe('LinkedMap', () => {
	let linkedMap: LinkedMap<string, string>;

	beforeEach(() => {
		linkedMap = new LinkedMap();
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

		it('should update the value and move the key to the end of the insertion order if the key already exists', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');
			linkedMap.set('key1', 'updatedValue1');

			expect(linkedMap.get('key1')).toBe('updatedValue1');
			expect(Array.from(linkedMap.keys())).toEqual(['key2', 'key1']);
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

	describe('getFirst', () => {
		it('should retrieve the value associated with the first key in the map', () => {
			linkedMap.addFirst('key1', 'value1');

			expect(linkedMap.getFirst()).toBe('value1');
		});

		it('should return null if the map is empty', () => {
			expect(linkedMap.getFirst()).toBeNull();
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

		it('should return null if the map is empty', () => {
			expect(linkedMap.getLast()).toBeNull();
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

		it('should return undefined if the key does not exist', () => {
			expect(linkedMap.moveToFirst('key1')).toBeUndefined();
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

	describe('remove', () => {
		it('should delete a key-value pair from the map', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			expect(linkedMap.remove('key1')).toBe(true);
			expect(linkedMap.has('key1')).toBe(false);
			expect(linkedMap.remove(null)).toBe(false);
			expect(linkedMap.size).toBe(1);
		});

		it('should return false if the key does not exist in the map', () => {
			expect(linkedMap.remove('key1')).toBe(false);
		});

		it('should not move the key to the end of the insertion order', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			linkedMap.remove('key1');

			expect(Array.from(linkedMap.keys())).toEqual(['key2']);

			linkedMap.remove('key2');

			expect(Array.from(linkedMap.keys())).toEqual([]);
		});
	});

	describe('removeFirst', () => {
		it('should delete the first key-value pair from the map', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			expect(linkedMap.removeFirst()).toBe(true);
		});

		it('should return false if the map is empty', () => {
			expect(linkedMap.removeFirst()).toBe(false);
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

			expect(linkedMap.removeLast()).toBe(true);
		});

		it('should return false if the map is empty', () => {
			expect(linkedMap.removeLast()).toBe(false);
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

			linkedMap.clear();

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
	});

	describe('values', () => {
		it('should return an iterator that yields all values in the map in their insertion order', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			const values = linkedMap.values();
			expect(values.next().value).toBe('value1');
			expect(values.next().value).toBe('value2');
			expect(values.next().done).toBe(true);
		});
	});

	describe('entries', () => {
		it('should return an iterator that yields all key-value pairs in the map as arrays in their insertion order', () => {
			linkedMap.set('key1', 'value1');
			linkedMap.set('key2', 'value2');

			const entries = linkedMap.entries();
			expect(entries.next().value).toEqual(['key1', 'value1']);
			expect(entries.next().value).toEqual(['key2', 'value2']);
			expect(entries.next().done).toBe(true);
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
