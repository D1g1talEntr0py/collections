import { SetMultiMap } from '../src/set-multi-map.js';
import { beforeEach, describe, expect, it } from 'vitest';

describe('SetMultiMap', () => {
	let multiMap: SetMultiMap<string, string>;

	beforeEach(() => {
		multiMap = new SetMultiMap();
	});

	describe('set', () => {
		it('should add a new key-value pair', () => {
			multiMap.set('key1', 'value1');
			expect(multiMap.has('key1')).toBe(true);
			expect(multiMap.get('key1')?.has('value1')).toBe(true);
		});

		it('should add a new value to an existing key', () => {
			multiMap.set('key1', 'value1');
			multiMap.set('key1', 'value2');
			expect(multiMap.get('key1')?.has('value1')).toBe(true);
			expect(multiMap.get('key1')?.has('value2')).toBe(true);
		});

		it('should not add a duplicate value to a key', () => {
			multiMap.set('key1', 'value1');
			multiMap.set('key1', 'value1');
			expect([...multiMap.get('key1') ?? []].length).toBe(1);
		});
	});

	describe('find', () => {
		it('should return the value if it exists', () => {
			multiMap.set('key1', 'value1');
			expect(multiMap.find('key1', () => true)).toBe('value1');
		});

		it('should return undefined if the value does not exist', () => {
			multiMap.set('key1', 'value1');
			expect(multiMap.find('key1', () => false)).toBe(undefined);
		});

		it('should return undefined if the key does not exist', () => {
			expect(multiMap.find('key1', () => true)).toBe(undefined);
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

		it('Should delete the key if the value is undefined', () => {
			multiMap.set('key1', 'value1');
			multiMap.deleteValue('key1', undefined);
			expect(multiMap.has('key1')).toBe(false);
		});
	});

	describe('Symbol.toStringTag', () => {
		it('should return correct tag', () => {
			expect(Object.prototype.toString.call(multiMap)).toBe('[object SetMultiMap]');
		});
	});
});
