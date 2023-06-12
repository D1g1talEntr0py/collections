import SetMultiMap from '../src/set-multi-map.js';
import { describe, expect, it } from '@jest/globals';

describe('SetMultiMap', () => {
	let multiMap;

	beforeEach(() => {
		multiMap = new SetMultiMap();
	});

	describe('set', () => {
		it('should add a new key-value pair', () => {
			multiMap.set('key1', 'value1');
			expect(multiMap.has('key1')).toBe(true);
			expect(multiMap.get('key1').has('value1')).toBe(true);
		});

		it('should add a new value to an existing key', () => {
			multiMap.set('key1', 'value1');
			multiMap.set('key1', 'value2');
			expect(multiMap.get('key1').has('value1')).toBe(true);
			expect(multiMap.get('key1').has('value2')).toBe(true);
		});

		it('should not add a duplicate value to a key', () => {
			multiMap.set('key1', 'value1');
			multiMap.set('key1', 'value1');
			expect([...multiMap.get('key1')].length).toBe(1);
		});
	});

	describe('hasValue', () => {
		it('should return true if a key has a specific value', () => {
			multiMap.set('key1', 'value1');
			expect(multiMap.hasValue('key1', 'value1')).toBe(true);
		});

		it('should return false if a key does not have a specific value', () => {
			multiMap.set('key1', 'value1');
			expect(multiMap.hasValue('key1', 'value2')).toBe(false);
		});

		it('should return false if a key does not exist', () => {
			expect(multiMap.hasValue('key1', 'value1')).toBe(false);
		});
	});

	describe('deleteValue', () => {
		it('should remove a value from a key', () => {
			multiMap.set('key1', 'value1');
			multiMap.deleteValue('key1', 'value1');
			expect(multiMap.hasValue('key1', 'value1')).toBe(false);
		});

		it('should return true if a value was removed', () => {
			multiMap.set('key1', 'value1');
			expect(multiMap.deleteValue('key1', 'value1')).toBe(true);
		});

		it('should return false if a value does not exist', () => {
			multiMap.set('key1', 'value1');
			expect(multiMap.deleteValue('key1', 'value2')).toBe(false);
		});

		it('should return false if a key does not exist', () => {
			expect(multiMap.deleteValue('key1', 'value1')).toBe(false);
		});
	});

	describe('Symbol.toStringTag', () => {
		it('should return correct tag', () => {
			expect(Object.prototype.toString.call(multiMap)).toBe('[object SetMultiMap]');
		});
	});
});
