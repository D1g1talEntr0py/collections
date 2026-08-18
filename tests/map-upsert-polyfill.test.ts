import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';

const nativeGetOrInsert = Object.getOwnPropertyDescriptor(Map.prototype, 'getOrInsert');
const nativeGetOrInsertComputed = Object.getOwnPropertyDescriptor(Map.prototype, 'getOrInsertComputed');

describe('map-upsert-polyfill', () => {
	beforeAll(async () => {
		// Force the polyfill to install by removing any native implementation first.
		expect(Reflect.deleteProperty(Map.prototype, 'getOrInsert')).toBe(true);
		expect(Reflect.deleteProperty(Map.prototype, 'getOrInsertComputed')).toBe(true);
		vi.resetModules();
		const { installMapUpsert } = await import('../src/map-upsert-polyfill');
		installMapUpsert();
	});

	afterAll(() => {
		expect(Reflect.deleteProperty(Map.prototype, 'getOrInsert')).toBe(true);
		expect(Reflect.deleteProperty(Map.prototype, 'getOrInsertComputed')).toBe(true);

		if (nativeGetOrInsert) { Object.defineProperty(Map.prototype, 'getOrInsert', nativeGetOrInsert) }
		if (nativeGetOrInsertComputed) { Object.defineProperty(Map.prototype, 'getOrInsertComputed', nativeGetOrInsertComputed) }
	});

	it('should install non-enumerable methods', () => {
		expect(Object.getOwnPropertyDescriptor(Map.prototype, 'getOrInsert')?.enumerable).toBe(false);
		expect(Object.getOwnPropertyDescriptor(Map.prototype, 'getOrInsertComputed')?.enumerable).toBe(false);
		expect(typeof Map.prototype.getOrInsert).toBe('function');
		expect(typeof Map.prototype.getOrInsertComputed).toBe('function');
	});

	it('should not replace an already installed implementation', async () => {
		const { installMapUpsert } = await import('../src/map-upsert-polyfill');
		const installed = Map.prototype.getOrInsert;

		installMapUpsert();

		expect(Map.prototype.getOrInsert).toBe(installed);
	});

	describe('getOrInsert', () => {
		it('should insert and return the default value when the key is absent', () => {
			const map = new Map<string, number>();

			expect(map.getOrInsert('a', 1)).toBe(1);
			expect(map.get('a')).toBe(1);
		});

		it('should return the existing value without overwriting it', () => {
			const map = new Map<string, number>([ [ 'a', 1 ] ]);

			expect(map.getOrInsert('a', 2)).toBe(1);
			expect(map.get('a')).toBe(1);
		});

		it('should return an existing undefined value without inserting', () => {
			const map = new Map<string, number | undefined>([ [ 'a', undefined ] ]);

			expect(map.getOrInsert('a', 1)).toBeUndefined();
			expect(map.size).toBe(1);
		});
	});

	describe('getOrInsertComputed', () => {
		it('should insert and return the computed value when the key is absent', () => {
			const map = new Map<string, string>();
			const compute = vi.fn((key: string) => `${key}-value`);

			expect(map.getOrInsertComputed('a', compute)).toBe('a-value');
			expect(map.get('a')).toBe('a-value');
			expect(compute).toHaveBeenCalledWith('a');
		});

		it('should not invoke the callback when the key exists', () => {
			const map = new Map<string, string>([ [ 'a', 'existing' ] ]);
			const compute = vi.fn(() => 'computed');

			expect(map.getOrInsertComputed('a', compute)).toBe('existing');
			expect(compute).not.toHaveBeenCalled();
		});

		it('should overwrite an entry inserted by the callback', () => {
			const map = new Map<string, string>();

			expect(map.getOrInsertComputed('a', (key) => {
				map.set(key, 'from-callback');

				return 'computed';
			})).toBe('computed');
			expect(map.get('a')).toBe('computed');
		});
	});
});
