import EvictingCache from '../src/evicting-cache.js';
import { describe, expect, it } from '@jest/globals';

describe('EvictingCache', () => {
	describe('constructor', () => {
		it('should initialize with the given capacity', () => {
			const cache = new EvictingCache(3);
			expect(cache).toBeDefined();
		});
	});

	describe('get', () => {
		it('should return null for a missing key', () => {
			const cache = new EvictingCache(3);
			expect(cache.get('missing')).toBeNull();
		});

		it('should return the value for an existing key and move it to the front', () => {
			const cache = new EvictingCache(2);
			cache.put('key1', 'value1');
			cache.put('key2', 'value2');
			expect(cache.get('key1')).toEqual('value1');
		});

		it('should return the value for an existing key and move it to the front even if the cache is at capacity', () => {
			const cache = new EvictingCache(2);
			cache.put('key1', 'value1');
			cache.put('key2', 'value2');
			cache.get('key1'); // Makes 'key1' most recently used.
			cache.put('key3', 'value3'); // Evicts 'key2'.
			expect(cache.get('key1')).toEqual('value1');
			expect(cache.get('key2')).toBeNull();
			expect(cache.get('key3')).toEqual('value3');
		});
	});

	describe('has', () => {
		it('should return false for a missing key', () => {
			const cache = new EvictingCache(3);
			expect(cache.has('missing')).toBe(false);
		});

		it('should return true for an existing key', () => {
			const cache = new EvictingCache(3);
			cache.put('key1', 'value1');
			expect(cache.has('key1')).toBe(true);
		});

		it('should return true for an existing key even if the cache is at capacity', () => {
			const cache = new EvictingCache(2);
			cache.put('key1', 'value1');
			cache.put('key2', 'value2');
			cache.get('key1'); // Makes 'key1' most recently used.
			cache.put('key3', 'value3'); // Evicts 'key2'.
			expect(cache.has('key1')).toBe(true);
		});
	});

	describe('put', () => {
		it('should add new key-value pairs and evict the least recently used item when over capacity', () => {
			const cache = new EvictingCache(2);
			cache.put('key1', 'value1');
			cache.put('key2', 'value2');
			cache.put('key3', 'value3');
			expect(cache.get('key1')).toBeNull();
			expect(cache.get('key2')).toEqual('value2');
			expect(cache.get('key3')).toEqual('value3');
		});

		it('should update the value for an existing key and move it to the front', () => {
			const cache = new EvictingCache(2);
			cache.put('key1', 'value1');
			cache.put('key1', 'updatedValue1');
			expect(cache.get('key1')).toEqual('updatedValue1');
		});

		it('should update the value for an existing key and move it to the front even if the cache is at capacity', () => {
			const cache = new EvictingCache(2);
			cache.put('key1', 'value1');
			cache.put('key2', 'value2');
			cache.get('key1'); // Makes 'key1' most recently used.
			cache.put('key1', 'updatedValue1'); // Updates 'key1'.
			cache.put('key3', 'value3'); // Evicts 'key2'.
			expect(cache.get('key1')).toEqual('updatedValue1');
			expect(cache.get('key2')).toBeNull();
			expect(cache.get('key3')).toEqual('value3');
		});
	});

	describe('getOrPut', () => {
		it('should return the value for the key if it exists in the cache', () => {
			const cache = new EvictingCache(2);
			cache.put('key1', 'value1');
			const value = cache.getOrPut('key1', () => 'value2');
			expect(value).toBe('value1');
		});

		it('should put the key-value pair into the cache and return the value if the key does not exist', () => {
			const cache = new EvictingCache(2);
			const value = cache.getOrPut('key1', () => 'value1');
			expect(value).toBe('value1');
			expect(cache.get('key1')).toBe('value1');
		});
	});

	describe('evict', () => {
		it('should remove the least recently used item', () => {
			const cache = new EvictingCache(2);
			cache.put('key1', 'value1');
			cache.put('key2', 'value2');
			cache.get('key1'); // Makes 'key1' most recently used.
			cache.evict();
			expect(cache.get('key1')).toEqual('value1');
			expect(cache.get('key2')).toBeNull();
		});

		it('should not throw when evicting from an empty cache', () => {
			const cache = new EvictingCache(2);
			cache.evict();
			expect(cache.get('anyKey')).toBeNull();
		});
	});

	describe('clear', () => {
		it('should clear the cache and the LRU list', () => {
			const cache = new EvictingCache(2);
			cache.put('key1', 'value1');
			cache.put('key2', 'value2');
			cache.clear();
			expect(cache.get('key1')).toBeNull();
			expect(cache.get('key2')).toBeNull();
		});

		it('should not throw when clearing an already empty cache', () => {
			const cache = new EvictingCache(2);
			cache.clear();
			expect(cache.get('anyKey')).toBeNull();
		});
	});

	describe('size', () => {
		it('should return the number of items in the cache', () => {
			const cache = new EvictingCache(2);
			cache.put('key1', 'value1');
			cache.put('key2', 'value2');
			expect(cache.size).toEqual(2);
		});
	});

	describe('capacity', () => {
		it('should return the capacity of the cache', () => {
			const cache = new EvictingCache(2);
			expect(cache.capacity).toEqual(2);
		});
	});

	describe('Symbol.toStringTag', () => {
		it('should return the correct string tag', () => {
			const cache = new EvictingCache(2);
			expect(Object.prototype.toString.call(cache)).toEqual('[object EvictingCache]');
		});
	});
});