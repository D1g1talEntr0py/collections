import MultiMap from '../src/multi-map.js';
import List from '../src/list.js';
import { describe, expect, it } from '@jest/globals';

describe('MultiMap', () => {
	let multiMap;

	beforeEach(() => {
		multiMap = new MultiMap();
	});

	it('should add a key-value pair correctly', () => {
		multiMap.set('testKey', 'testValue');
		const values = multiMap.get('testKey');

		expect(values).toBeInstanceOf(List);
		expect(values.size).toBe(1);
		expect(values.get(0)).toBe('testValue');
	});

	it('should add multiple values for the same key correctly', () => {
		multiMap.set('testKey', 'testValue1');
		multiMap.set('testKey', 'testValue2');
		const values = multiMap.get('testKey');

		expect(values).toBeInstanceOf(List);
		expect(values.size).toBe(2);
		expect(values.get(0)).toBe('testValue1');
		expect(values.get(1)).toBe('testValue2');
	});

	it('toStringTag should return correct tag', () => {
		expect(Object.prototype.toString.call(multiMap)).toBe('[object MultiMap]');
	});

	it('should return undefined when getting value for non-existing key', () => {
		expect(multiMap.get('nonExistingKey')).toBeUndefined();
	});
});
