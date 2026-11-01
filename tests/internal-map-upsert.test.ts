import { afterEach, describe, expect, it, vi } from 'vitest';
import { getOrInsert, getOrInsertComputed } from '../src/internal/map-upsert.js';

const nativeGetOrInsert = Object.getOwnPropertyDescriptor(Map.prototype, 'getOrInsert');
const nativeGetOrInsertComputed = Object.getOwnPropertyDescriptor(Map.prototype, 'getOrInsertComputed');

const restoreNativeMethods = (): void => {
	Reflect.deleteProperty(Map.prototype, 'getOrInsert');
	Reflect.deleteProperty(Map.prototype, 'getOrInsertComputed');
	if (nativeGetOrInsert) { Object.defineProperty(Map.prototype, 'getOrInsert', nativeGetOrInsert) }
	if (nativeGetOrInsertComputed) { Object.defineProperty(Map.prototype, 'getOrInsertComputed', nativeGetOrInsertComputed) }
};

describe('internal map upsert helpers', () => {
	afterEach(() => {
		restoreNativeMethods();
		vi.resetModules();
	});

	it('should not patch Map.prototype when collection entry points are imported', async () => {
		Reflect.deleteProperty(Map.prototype, 'getOrInsert');
		Reflect.deleteProperty(Map.prototype, 'getOrInsertComputed');
		const propertyNames = Object.getOwnPropertyNames(Map.prototype);

		vi.resetModules();
		await import('../src/index.js');

		expect(Object.getOwnPropertyNames(Map.prototype)).toEqual(propertyNames);
		expect(Map.prototype).not.toHaveProperty('getOrInsert');
		expect(Map.prototype).not.toHaveProperty('getOrInsertComputed');
	});

	describe('getOrInsert', () => {
		it('should insert and return the default value when the key is absent', () => {
			const map = new Map<string, number>();

			expect(getOrInsert(map, 'a', 1)).toBe(1);
			expect(map.get('a')).toBe(1);
		});

		it('should return the existing value without overwriting it', () => {
			const map = new Map<string, number>([ [ 'a', 1 ] ]);

			expect(getOrInsert(map, 'a', 2)).toBe(1);
			expect(map.get('a')).toBe(1);
		});

		it('should return an existing undefined value without inserting', () => {
			const map = new Map<string, number | undefined>([ [ 'a', undefined ] ]);

			expect(getOrInsert(map, 'a', 1)).toBeUndefined();
			expect(map.size).toBe(1);
		});
	});

	describe('getOrInsertComputed', () => {
		it('should insert and return the computed value when the key is absent', () => {
			const map = new Map<string, string>();
			const compute = vi.fn((key: string) => `${key}-value`);

			expect(getOrInsertComputed(map, 'a', compute)).toBe('a-value');
			expect(map.get('a')).toBe('a-value');
			expect(compute).toHaveBeenCalledWith('a');
		});

		it('should not invoke the callback when the key exists', () => {
			const map = new Map<string, string>([ [ 'a', 'existing' ] ]);
			const compute = vi.fn(() => 'computed');

			expect(getOrInsertComputed(map, 'a', compute)).toBe('existing');
			expect(compute).not.toHaveBeenCalled();
		});

		it('should overwrite an entry inserted by the callback', () => {
			const map = new Map<string, string>();

			expect(getOrInsertComputed(map, 'a', (key) => {
				map.set(key, 'from-callback');

				return 'computed';
			})).toBe('computed');
			expect(map.get('a')).toBe('computed');
		});
	});
});
