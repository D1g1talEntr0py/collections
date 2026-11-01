/**
 * Compares values numerically when both are numbers, otherwise by their string representations.
 * String comparisons use JavaScript's code-unit ordering and are locale-independent.
 * @param a The first value to compare.
 * @param b The second value to compare.
 * @returns A negative number, zero, or a positive number according to the comparison.
 * @template T The values' type.
 */
export function naturalComparator<T>(a: T, b: T): number {
	if (typeof a === 'number' && typeof b === 'number') {
		if (Number.isNaN(a)) { return Number.isNaN(b) ? 0 : 1 }

		if (Number.isNaN(b)) { return -1 }

		return a < b ? -1 : a > b ? 1 : 0;
	}

	const left = String(a);
	const right = String(b);

	return left < right ? -1 : left > right ? 1 : 0;
}