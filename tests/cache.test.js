import Cache from '../src/cache.js';
import { describe, expect, it } from '@jest/globals';

describe('Cache', () => {
	describe('has', () => {
		it('returns false for non-existing keys', () => {
			const cache = new Cache();
			expect(cache.has('key')).toBe(false);
		});

		it('returns true for existing keys', () => {
			const cache = new Cache();
			cache.set('key', 'value');
			expect(cache.has('key')).toBe(true);
		});
	});

	describe('set', () => {
		it('adds a new key-value pair', () => {
			const cache = new Cache();
			cache.set('key', 'value');
			expect(cache.get('key')).toBe('value');
		});
	});

	describe('get', () => {
		it('retrieves values for existing keys', () => {
			const cache = new Cache();
			cache.set('key', 'value');
			expect(cache.get('key')).toBe('value');
		});

		it('returns undefined for non-existing keys', () => {
			const cache = new Cache();
			expect(cache.get('key')).toBeUndefined();
		});
	});

	describe('getOrSet', () => {
		it('returns existing value for keys', () => {
			const cache = new Cache();
			cache.set('key', 'value');
			expect(cache.getOrSet('key', 'anotherValue')).toBe('value');
		});

		it('sets and returns new value for non-existing keys', () => {
			const cache = new Cache();
			expect(cache.getOrSet('key', 'value')).toBe('value');
			expect(cache.get('key')).toBe('value');
		});

		it('sets and returns new value for non-existing keys with falsy values', () => {
			const cache = new Cache();
			expect(cache.getOrSet('key', 0)).toBe(0);
			expect(cache.get('key')).toBe(0);
		});
	});

	describe('delete', () => {
		it('removes existing keys', () => {
			const cache = new Cache();
			cache.set('key', 'value');
			cache.delete('key');
			expect(cache.has('key')).toBe(false);
		});

		it('should decrement size', () => {
			const cache = new Cache();
			cache.set('key', 'value');
			cache.delete('key');
			expect(cache.size).toBe(0);
		});

		it('should not decrement size if key does not exist', () => {
			const cache = new Cache();
			cache.delete('key');
			expect(cache.size).toBe(0);
		});
	});

	describe('clear', () => {
		it('removes all keys', () => {
			const cache = new Cache();
			cache.set('key1', 'value1');
			cache.set('key2', 'value2');
			cache.clear();
			expect(cache.has('key1')).toBe(false);
			expect(cache.has('key2')).toBe(false);
		});
	});

	describe('size', () => {
		it('returns the number of key-value pairs', () => {
			const cache = new Cache();
			cache.set('key1', 'value1');
			cache.set('key2', 'value2');
			expect(cache.size).toBe(2);
		});
	});

	describe('Symbol.toStringTag', () => {
		it('returns the default string description of the class', () => {
			const cache = new Cache();
			expect(cache[Symbol.toStringTag]).toBe('Cache');
		});
	});
});
