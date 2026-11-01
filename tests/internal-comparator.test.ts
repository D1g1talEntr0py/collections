import { describe, expect, it } from 'vitest';
import { naturalComparator } from '../src/internal/comparator.js';

describe('naturalComparator', () => {
	describe('numbers', () => {
		it('should order numbers numerically rather than by their string representations', () => {
			expect(naturalComparator(2, 10)).toBe(-1);
			expect(naturalComparator(10, 2)).toBe(1);
			expect(naturalComparator(5, 5)).toBe(0);
			expect(naturalComparator(-Infinity, Infinity)).toBe(-1);
		});

		it('should treat NaN as equal to NaN', () => {
			expect(naturalComparator(Number.NaN, Number.NaN)).toBe(0);
		});

		it('should order NaN after every other number', () => {
			expect(naturalComparator(Number.NaN, 1)).toBe(1);
			expect(naturalComparator(Number.NaN, Infinity)).toBe(1);
			expect(naturalComparator(1, Number.NaN)).toBe(-1);
			expect(naturalComparator(Infinity, Number.NaN)).toBe(-1);
		});

		it('should sort an array containing NaN with NaN last', () => {
			expect([ 3, Number.NaN, 1, Number.NaN, 2 ].sort(naturalComparator)).toEqual([ 1, 2, 3, Number.NaN, Number.NaN ]);
		});
	});

	describe('strings', () => {
		it('should order strings by code unit', () => {
			expect(naturalComparator('apple', 'banana')).toBe(-1);
			expect(naturalComparator('banana', 'apple')).toBe(1);
			expect(naturalComparator('apple', 'apple')).toBe(0);
			expect(naturalComparator('', '')).toBe(0);
		});

		it('should order a prefix before the longer string', () => {
			expect(naturalComparator('ab', 'abc')).toBe(-1);
			expect(naturalComparator('abc', 'ab')).toBe(1);
		});

		it('should not depend on the locale', () => {
			expect(naturalComparator('B', 'a')).toBe(-1);
			expect(naturalComparator('a', 'B')).toBe(1);
		});

		it('should order numeric strings lexicographically', () => {
			expect(naturalComparator('10', '9')).toBe(-1);
		});
	});

	describe('mixed and non-primitive values', () => {
		it('should compare a number with a non-number by string representation', () => {
			expect(naturalComparator<unknown>(10, '9')).toBe(-1);
			expect(naturalComparator<unknown>('9', 10)).toBe(1);
			expect(naturalComparator<unknown>(1, '1')).toBe(0);
		});

		it('should compare other values by string representation', () => {
			expect(naturalComparator<unknown>(null, undefined)).toBe(-1);
			expect(naturalComparator<unknown>(true, 'true')).toBe(0);
			expect(naturalComparator<unknown>({ toString: () => 'b' }, { toString: () => 'a' })).toBe(1);
		});
	});
});
