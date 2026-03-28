import { List } from '../src/list.js';
import { MultiMap } from '../src/multi-map';
import { describe, beforeEach, expect, it } from 'vitest';

describe('MultiMap', () => {
	let multiMap: MultiMap<string, string>;

	beforeEach(() => {
		multiMap = new MultiMap();
	});

	it('should add a key-value pair correctly', () => {
		multiMap.set('testKey', 'testValue');
		const values = multiMap.get('testKey')!;

		expect(values).toBeInstanceOf(List);
		expect(values.size).toBe(1);
		expect(values.get(0)).toBe('testValue');
	});

	it('should add multiple values for the same key correctly', () => {
		multiMap.set('testKey', 'testValue1');
		multiMap.set('testKey', 'testValue2');
		const values = multiMap.get('testKey')!;

		expect(values).toBeInstanceOf(List);
		expect(values.size).toBe(2);
		expect(values.get(0)).toBe('testValue1');
		expect(values.get(1)).toBe('testValue2');
	});

	it('should set a List of values for a key', () => {
		const valueList = new List<string>();
		valueList.add('value1');
		valueList.add('value2');
		valueList.add('value3');
		multiMap.set('key1', valueList);

		const values = multiMap.get('key1')!;
		expect(values).toBeInstanceOf(List);
		expect(values.size).toBe(3);
		expect(values.get(0)).toBe('value1');
		expect(values.get(1)).toBe('value2');
		expect(values.get(2)).toBe('value3');
	});

	it('should replace existing values when setting a List', () => {
		multiMap.set('key1', 'value1');
		const valueList = new List<string>();
		valueList.add('value2');
		valueList.add('value3');
		multiMap.set('key1', valueList);

		const values = multiMap.get('key1')!;
		expect(values.size).toBe(2);
		expect(values.get(0)).toBe('value2');
		expect(values.get(1)).toBe('value3');
	});

	it('toStringTag should return correct tag', () => {
		expect(Object.prototype.toString.call(multiMap)).toBe('[object MultiMap]');
	});

	it('should return undefined when getting value for non-existing key', () => {
		expect(multiMap.get('nonExistingKey')).toBeUndefined();
	});

	describe('getOrInsert', () => {
		it('should return the inserted value when the key does not exist', () => {
			const value = multiMap.getOrInsert('key1', 'value1');

			expect(value).toBe('value1');
			expect(multiMap.get('key1')).toBeInstanceOf(List);
			expect(multiMap.get('key1')?.size).toBe(1);
			expect(multiMap.get('key1')?.get(0)).toBe('value1');
		});

		it('should insert the provided List when the key does not exist', () => {
			const defaultValues = new List<string>().add('value1').add('value2');
			const values = multiMap.getOrInsert('key1', defaultValues);

			expect(values).toBe(defaultValues);
			expect(values.size).toBe(2);
			expect(values.get(0)).toBe('value1');
			expect(values.get(1)).toBe('value2');
		});

		it('should return the existing List when the key already exists', () => {
			multiMap.set('key1', 'value1');
			const values = multiMap.getOrInsert('key1', 'value2');

			expect(values).toBeInstanceOf(List);
			expect(values.size).toBe(1);
			expect(values.get(0)).toBe('value1');
		});
	});

	describe('getOrInsertComputed', () => {
		it('should return the computed value when the key does not exist', () => {
			const value = multiMap.getOrInsertComputed('key1', () => 'value1');

			expect(value).toBe('value1');
			expect(multiMap.get('key1')).toBeInstanceOf(List);
			expect(multiMap.get('key1')?.size).toBe(1);
			expect(multiMap.get('key1')?.get(0)).toBe('value1');
		});

		it('should insert the computed List when the key does not exist', () => {
			const values = multiMap.getOrInsertComputed('key1', () => new List<string>().add('value1').add('value2'));

			expect(values).toBeInstanceOf(List);
			expect(values.size).toBe(2);
			expect(values.get(0)).toBe('value1');
			expect(values.get(1)).toBe('value2');
		});

		it('should return the existing List without computing a new value', () => {
			multiMap.set('key1', 'value1');
			const compute = () => {
				throw new Error('should not be called');
			};

			const values = multiMap.getOrInsertComputed('key1', compute);

			expect(values.size).toBe(1);
			expect(values.get(0)).toBe('value1');
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

		it('should delete the key if the value is undefined', () => {
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
});
