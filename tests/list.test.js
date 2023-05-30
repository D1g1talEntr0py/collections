import { describe, beforeEach, it, expect, test } from '@jest/globals';
import List from '../src/list.js';

describe('Constructor', () => {
	test('Empty Constructor', () => expect(new List().size).toEqual(0));
	test('Number Array', () => expect(new List([2]).size).toEqual(1));
	test('String Array', () => expect(new List(['string']).size).toEqual(1));
	test('String', () => expect(new List('string').size).toEqual(6));
	test('Empty Set', () => expect(new List(new Set()).size).toEqual(0));
	test('Set of Objects', () => expect(new List(new Set([{foo: 'bar'}, {foo: 'zoo'}])).size).toEqual(2));
	test('Map<string, string>', () => expect(new List(new Map([['key', 'value']])).size).toEqual(1));
});

describe('List', () => {
	let list, arr;

	beforeEach(() => {
		arr = [1, 2, 3];
		list = new List(arr);
	});

	describe('constructor', () => {
		it('creates an instance with the given iterable', () => {
			expect(list.toArray()).toEqual(arr);
		});

		it('creates an empty instance if no iterable is provided', () => {
			const emptyList = new List();
			expect(emptyList.isEmpty()).toBe(true);
		});
	});

	describe('from', () => {
		it('creates a new instance from given elements', () => {
			const fromList = List.from(arr);
			expect(fromList.toArray()).toEqual(arr);
		});

		it('creates a new instance from given elements and apply a mapper', () => {
			const mapper = x => x * 2;
			const fromList = List.from(arr, mapper);
			expect(fromList.toArray()).toEqual(arr.map(mapper));
		});
	});

	describe('add', () => {
		it('adds an element to the list', () => {
			list.add(4);
			expect(list.toArray()).toEqual([...arr, 4]);
		});
	});

	describe('addAll', () => {
		it('adds multiple elements to the list', () => {
			list.addAll([4, 5]);
			expect(list.toArray()).toEqual([...arr, 4, 5]);
		});
	});

	describe('clear', () => {
		it('clears the list', () => {
			list.clear();
			expect(list.toArray()).toEqual([]);
		});
	});

	describe('concat', () => {
		it('returns a new list as a result of concatenating the list with another', () => {
			const anotherList = new List([4, 5]);
			const concatenatedList = list.concat(anotherList);
			expect(concatenatedList.toArray()).toEqual([...arr, 4, 5]);
		});
	});

	describe('every', () => {
		it('returns true if every element passes the test implemented by the provided function', () => {
			const isPositive = number => number > 0;
			expect(list.every(isPositive)).toBe(true);
		});
	});

	describe('some', () => {
		it('returns true if at least one element passes the test implemented by the provided function', () => {
			const isTwo = number => number === 2;
			expect(list.some(isTwo)).toBe(true);
		});
	});

	describe('filter', () => {
		it('creates a new list with all elements that pass the test implemented by the provided function', () => {
			const isOdd = number => number % 2 !== 0;
			const filteredList = list.filter(isOdd);
			expect(filteredList.toArray()).toEqual([1, 3]);
		});
	});

	describe('find', () => {
		it('returns the first element in the list that satisfies the provided testing function', () => {
			const isTwo = number => number === 2;
			expect(list.find(isTwo)).toBe(2);
		});
	});

	describe('findIndex', () => {
		it('returns the index of the first element in the list that satisfies the provided testing function', () => {
			const isTwo = number => number === 2;
			expect(list.findIndex(isTwo)).toBe(1);
		});
	});

	describe('map', () => {
		it('creates a new list with the results of calling a provided function on every element in the list', () => {
			const multiplyByTwo = number => number * 2;
			const mappedList = list.map(multiplyByTwo);
			expect(mappedList.toArray()).toEqual([2, 4, 6]);
		});
	});

	describe('reduce', () => {
		it('applies a function against an accumulator and each element in the list (from left to right) to reduce it to a single output value', () => {
			const sum = list.reduce((acc, curr) => acc + curr, 0);
			expect(sum).toBe(6);
		});
	});

	describe('sort', () => {
		it('sorts the elements of the list in place and returns the list', () => {
			const sortedList = new List([3, 1, -1, 2]).sort();
			expect(sortedList.toArray()).toEqual([-1, 1, 2, 3]);
		});
	});

	describe('forEach', () => {
		it('executes a provided function once for each list element', () => {
			const results = [];
			const pushIntoResults = item => results.push(item);
			list.forEach(pushIntoResults);
			expect(results).toEqual(arr);
		});
	});

	describe('get', () => {
		it('returns the element at the specified index', () => {
			expect(list.get(1)).toBe(2);
		});
	});

	describe('set', () => {
		it('changes the value of the element at the specified index', () => {
			list.set(1, 5);
			expect(list.get(1)).toBe(5);
		});
	});

	describe('has', () => {
		it('returns a boolean indicating whether an element with the specified value exists in the list', () => {
			expect(list.has(2)).toBe(true);
			expect(list.has(5)).toBe(false);
		});
	});

	describe('insert', () => {
		it('inserts an element at a specific index', () => {
			list.insert(1, 5);
			expect(list.toArray()).toEqual([1, 5, 2, 3]);
		});
	});

	describe('delete', () => {
		it('removes the first occurrence of a specific element from the list', () => {
			list.add(2);
			list.delete(2);
			expect(list.toArray()).toEqual([1, 3, 2]);
		});
	});

	describe('deleteAt', () => {
		it('removes the element at a specific index', () => {
			list.deleteAt(1);
			expect(list.toArray()).toEqual([1, 3]);
		});
	});

	describe('removeLast', () => {
		it('removes the last element from the list', () => {
			list.removeLast();
			expect(list.toArray()).toEqual([1, 2]);
		});
	});

	describe('removeFirst', () => {
		it('removes the first element from the list', () => {
			list.removeFirst();
			expect(list.toArray()).toEqual([2, 3]);
		});
	});

	describe('reverse', () => {
		it('reverses the order of the elements in the list', () => {
			list.reverse();
			expect(list.toArray()).toEqual([3, 2, 1]);
		});
	});

	describe('keys', () => {
		it('returns an array of list indices', () => {
			expect(Array.from(list.keys())).toEqual([0, 1, 2]);
		});
	});

	describe('values', () => {
		it('returns an array of list values', () => {
			expect(Array.from(list.values())).toEqual(arr);
		});
	});

	describe('entries', () => {
		it('returns an IterableIterator of [index, value] for each item in the list', () => {
			expect(Array.from(list.entries())).toEqual([[0, 1], [1, 2], [2, 3]]);
		});
	});

	describe('isEmpty', () => {
		it('returns true if the list is empty', () => {
			list.clear();
			expect(list.isEmpty()).toBe(true);
		});

		it('returns false if the list is not empty', () => {
			expect(list.isEmpty()).toBe(false);
		});
	});

	describe('size', () => {
		it('returns the number of elements in the list', () => {
			expect(list.size).toBe(3);
		});
	});
});