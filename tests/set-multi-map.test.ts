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

		it('should set a Set of values for a key', () => {
			const valueSet = new Set(['value1', 'value2', 'value3']);
			multiMap.set('key1', valueSet);
			expect(multiMap.get('key1')?.size).toBe(3);
			expect(multiMap.get('key1')?.has('value1')).toBe(true);
			expect(multiMap.get('key1')?.has('value2')).toBe(true);
			expect(multiMap.get('key1')?.has('value3')).toBe(true);
		});

		it('should replace existing values when setting a Set', () => {
			multiMap.set('key1', 'value1');
			const valueSet = new Set(['value2', 'value3']);
			multiMap.set('key1', valueSet);
			expect(multiMap.get('key1')?.size).toBe(2);
			expect(multiMap.get('key1')?.has('value1')).toBe(false);
			expect(multiMap.get('key1')?.has('value2')).toBe(true);
			expect(multiMap.get('key1')?.has('value3')).toBe(true);
		});
	});

	describe('getOrInsert', () => {
		it('should insert and return the default value when the key does not exist', () => {
			const value = multiMap.getOrInsert('key1', 'value1');

			expect(value).toBe('value1');
			expect(multiMap.get('key1')).toBeInstanceOf(Set);
			expect(multiMap.get('key1')?.has('value1')).toBe(true);
		});

		it('should insert and return the provided Set when the key does not exist', () => {
			const values = new Set(['value1', 'value2']);

			expect(multiMap.getOrInsert('key1', values)).toBe(values);
			expect(multiMap.get('key1')).toBe(values);
		});

		it('should return the existing Set when the key already exists', () => {
			multiMap.set('key1', 'value1');

			const values = multiMap.getOrInsert('key1', 'value2');

			expect(values).toBeInstanceOf(Set);
			expect(values).toBe(multiMap.get('key1'));
			expect(values.has('value1')).toBe(true);
			expect(values.has('value2')).toBe(false);
		});
	});

	describe('getOrInsertComputed', () => {
		it('should compute, insert, and return the value when the key does not exist', () => {
			const value = multiMap.getOrInsertComputed('key1', (key) => `${key}-value`);

			expect(value).toBe('key1-value');
			expect(multiMap.get('key1')).toBeInstanceOf(Set);
			expect(multiMap.get('key1')?.has('key1-value')).toBe(true);
		});

		it('should compute, insert, and return the Set when the key does not exist', () => {
			const values = multiMap.getOrInsertComputed('key1', () => new Set(['value1', 'value2']));

			expect(values).toBeInstanceOf(Set);
			expect(values).toBe(multiMap.get('key1'));
			expect(values.has('value1')).toBe(true);
			expect(values.has('value2')).toBe(true);
		});

		it('should return the existing Set without computing when the key already exists', () => {
			multiMap.set('key1', 'value1');
			let called = false;

			const values = multiMap.getOrInsertComputed('key1', () => {
				called = true;
				return 'value2';
			});

			expect(called).toBe(false);
			expect(values).toBeInstanceOf(Set);
			expect(values).toBe(multiMap.get('key1'));
			expect(values.has('value1')).toBe(true);
		});
	});

	describe('find', () => {
		it('should return the value if it exists', () => {
			multiMap.set('key1', 'value1');
			expect(multiMap.find('key1', () => true)).toBe('value1');
		});

		it('should return the correct value using iterator function', () => {
			multiMap.set('key1', 'value1');
			multiMap.set('key1', 'value2');
			multiMap.set('key1', 'value3');
			expect(multiMap.find('key1', (value) => value === 'value2')).toBe('value2');
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

		it('should return true if a key has a specific value among multiple values', () => {
			multiMap.set('key1', 'value1');
			multiMap.set('key1', 'value2');
			multiMap.set('key1', 'value3');
			expect(multiMap.hasValue('key1', 'value2')).toBe(true);
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

		it('should remove only the specified value from a key with multiple values', () => {
			multiMap.set('key1', 'value1');
			multiMap.set('key1', 'value2');
			multiMap.set('key1', 'value3');
			multiMap.deleteValue('key1', 'value2');
			expect(multiMap.hasValue('key1', 'value1')).toBe(true);
			expect(multiMap.hasValue('key1', 'value2')).toBe(false);
			expect(multiMap.hasValue('key1', 'value3')).toBe(true);
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

		it('should remove the key when the last value is deleted', () => {
			multiMap.set('key1', 'value1');
			multiMap.deleteValue('key1', 'value1');
			expect(multiMap.has('key1')).toBe(false);
		});

		it('should keep the key when there are remaining values after deletion', () => {
			multiMap.set('key1', 'value1');
			multiMap.set('key1', 'value2');
			multiMap.deleteValue('key1', 'value1');
			expect(multiMap.has('key1')).toBe(true);
			expect(multiMap.get('key1')?.size).toBe(1);
		});
	});

	describe('Symbol.toStringTag', () => {
		it('should return correct tag', () => {
			expect(Object.prototype.toString.call(multiMap)).toBe('[object SetMultiMap]');
		});
	});
});
