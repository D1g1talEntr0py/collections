import { List } from '../src/list.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('List class', () => {
	let list: List<number>;
	const initialItems = [1, 2, 3];

	beforeEach(() => {
		list = new List([...initialItems]);
	});

	it('should initialize with given items', () => {
		expect(list.toArray()).toEqual(initialItems);
	});

	it('should copy the initial items', () => {
		const items = [1, 2, 3];
		const list = new List(items);
		items.push(4);

		expect(list.toArray()).toEqual([1, 2, 3]);
	});

	it('should initialize with an empty list if no items are given', () => {
		list = new List();
		expect(list.toArray()).toEqual([]);
	});

	describe('add method', () => {
		it('should add an item to the list', () => {
			list.add(4);
			expect(list.toArray()).toEqual([...initialItems, 4]);
		});
	});

	describe('addAll method', () => {
		it('should add multiple items to the list', () => {
			list.addAll(4, 5, 6);
			expect(list.toArray()).toEqual([...initialItems, 4, 5, 6]);
		});

		it('should add large inputs without spreading into Array.push', () => {
			const elements = Array.from({ length: 100_000 }, (_, index) => index);

			expect(() => list.addAll(...elements)).not.toThrow();
			expect(list.size).toBe(100_003);
			expect(list.get(100_002)).toBe(99_999);
		});
	});

	describe('addAllFrom method', () => {
		it('should append 200,000 iterable values without call-site argument spreading', () => {
			const elements = Array.from({ length: 200_000 }, (_, index) => index);

			expect(list.addAllFrom(elements)).toBe(list);
			expect(list.size).toBe(200_003);
			expect(list.get(200_002)).toBe(199_999);
		});
	});

	describe('insert method', () => {
		it('should insert an item at the specified index', () => {
			list.insert(1, 4);
			expect(list.toArray()).toEqual([1, 4, 2, 3]);
		});

		it('should allow insertion at the end', () => {
			list.insert(list.size, 4);
			expect(list.toArray()).toEqual([1, 2, 3, 4]);
		});

		it('should throw RangeError when the index is outside the list bounds', () => {
			expect(() => list.insert(-1, 4)).toThrow(RangeError);
			expect(() => list.insert(list.size + 1, 4)).toThrow(RangeError);
		});
	});

	describe('remove method', () => {
		it('should remove an item from the list', () => {
			list.remove(2);
			expect(list.toArray()).toEqual([1, 3]);
		});

		it('should return undefined when the element is absent', () => {
			expect(list.remove(99)).toBeUndefined();
			expect(list.toArray()).toEqual(initialItems);
		});
	});

	describe('iterable constructor', () => {
		it('should copy values from an Iterable', () => {
			function* values(): Generator<number> {
				yield 4;
				yield 5;
			}

			expect(new List(values()).toArray()).toEqual([4, 5]);
		});
	});

	describe('removeAt method', () => {
		it('should remove an item at a specific index', () => {
			list.removeAt(1);
			expect(list.toArray()).toEqual([1, 3]);
		});

		it('should return the removed item', () => {
			const removed = list.removeAt(1);
			expect(removed).toEqual(2);
		});

		it('should throw an error if the index is out of bounds', () => {
			expect(() => list.removeAt(10)).toThrow(RangeError);
		});
	});

	describe('get method', () => {
		it('should get the item at a specific index', () => {
			expect(list.get(1)).toEqual(2);
		});
	});

	describe('set method', () => {
		it('should set the value at the specified index', () => {
			list.set(1, 4);
			expect(list.toArray()).toEqual([1, 4, 3]);
		});

		it('should throw an error if index is out of bounds', () => {
			expect(() => list.set(10, 4)).toThrow(RangeError);
		});
	});

	describe('removeLast method', () => {
		it('should remove the last element from the list', () => {
			const last = list.removeLast();
			expect(last).toEqual(3);
			expect(list.toArray()).toEqual([1, 2]);
		});

		it('should return undefined if the list is empty', () => {
			list.clear();
			const last = list.removeLast();
			expect(last).toBeUndefined();
		});

		it('should preserve null as a removed value', () => {
			const nullable = new List<number | null>([null]);

			expect(nullable.removeLast()).toBeNull();
			expect(nullable.removeLast()).toBeUndefined();
		});
	});

	describe('removeFirst method', () => {
		it('should remove the first element from the list', () => {
			const first = list.removeFirst();
			expect(first).toEqual(1);
			expect(list.toArray()).toEqual([2, 3]);
		});

		it('should return undefined if the list is empty', () => {
			list.clear();
			const first = list.removeFirst();
			expect(first).toBeUndefined();
		});

		it('should preserve null as a removed value', () => {
			const nullable = new List<number | null>([null]);

			expect(nullable.removeFirst()).toBeNull();
			expect(nullable.removeFirst()).toBeUndefined();
		});
	});

	describe('reverse method', () => {
		it('should reverse the list', () => {
			list.reverse();
			expect(list.toArray()).toEqual([3, 2, 1]);
		});
	});

	describe('indexOf method', () => {
		it('should return the index of an item', () => {
			expect(list.indexOf(2)).toEqual(1);
		});

		it('should return -1 if the item is not in the list', () => {
			expect(list.indexOf(10)).toEqual(-1);
		});
	});

	describe('lastIndexOf method', () => {
		it('should return the last index of an item', () => {
			list.add(1);
			expect(list.lastIndexOf(1)).toEqual(3);
		});

		it('should return -1 if the item is not in the list', () => {
			expect(list.lastIndexOf(10)).toEqual(-1);
		});
	});

	describe('contains method', () => {
		it('should return true if the list contains the item', () => {
			expect(list.contains(2)).toBe(true);
		});

		it('should return false if the list does not contain the item', () => {
			expect(list.contains(10)).toBe(false);
		});
	});

	describe('concat method', () => {
		it('should return a new list with the items from both lists', () => {
			const newList = list.concat(new List([4, 5, 6]));
			expect(newList.toArray()).toEqual([1, 2, 3, 4, 5, 6]);
		});

		it('should return a new list with the items from both lists', () => {
			const array = [4, 5, 6];
			const newList = list.concat(...array);
			expect(newList.toArray()).toEqual([1, 2, 3, 4, 5, 6]);
		});

		it('should return a new list with the items from both lists', () => {
			const newList = list.concat(4, 5, 6);
			expect(newList.toArray()).toEqual([1, 2, 3, 4, 5, 6]);
		});

		it('should return a new list with the items from both lists', () => {
			const newList = list.concat(4, ...new List([5, 6]).values());
			expect(newList.toArray()).toEqual([1, 2, 3, 4, 5, 6]);
		});
	});

	describe('join method', () => {
		it('should return a string of the list items joined by a separator', () => {
			expect(list.join(',')).toEqual('1,2,3');
		});

		it('should return a string of the list items joined by a default separator', () => {
			expect(list.join()).toEqual('1,2,3');
		});
	});

	describe('size method', () => {
		it('should return the number of items in the list', () => {
			expect(list.size).toEqual(3);
		});
	});

	describe('isEmpty method', () => {
		it('should return false if the list is not empty', () => {
			expect(list.isEmpty()).toBe(false);
		});

		it('should return true if the list is empty', () => {
			list.remove(1);
			list.remove(2);
			list.remove(3);
			expect(list.isEmpty()).toBe(true);
		});
	});

	describe('clear method', () => {
		it('should remove all items from the list', () => {
			list.clear();
			expect(list.isEmpty()).toBe(true);
		});
	});

	describe('every method', () => {
		it('should return true if every item in the list passes the test', () => {
			expect(list.every((item) => item > 0)).toBe(true);
		});

		it('should return false if any item in the list fails the test', () => {
			expect(list.every((item) => item > 1)).toBe(false);
		});
	});

	describe('some method', () => {
		it('should return true if any item in the list passes the test', () => {
			expect(list.some((item) => item > 2)).toBe(true);
		});

		it('should return false if every item in the list fails the test', () => {
			expect(list.some((item) => item > 3)).toBe(false);
		});
	});

	describe('filter method', () => {
		it('should return a new list with items that pass the test', () => {
			const newList = list.filter((item) => item > 1);
			expect(newList.toArray()).toEqual([2, 3]);
		});
	});

	describe('map method', () => {
		it('should return a new list with the results of the callback', () => {
			const newList = list.map((item) => item * 2);
			expect(newList.toArray()).toEqual([2, 4, 6]);
		});
	});

	describe('reduce method', () => {
		it('should return the result of the callback', () => {
			const result = list.reduce((acc, item) => acc + item, 0);
			expect(result).toEqual(6);
		});
	});

	describe('find method', () => {
		it('should return the first item that passes the test', () => {
			const item = list.find((item) => item > 1);
			expect(item).toEqual(2);
		});

		it('should return undefined if no item passes the test', () => {
			const item = list.find((item) => item > 3);
			expect(item).toBe(undefined);
		});
	});

	describe('findIndex method', () => {
		it('should return the index of the first item that passes the test', () => {
			const index = list.findIndex((item) => item > 1);
			expect(index).toEqual(1);
		});

		it('should return -1 if no item passes the test', () => {
			const index = list.findIndex((item) => item > 3);
			expect(index).toEqual(-1);
		});
	});

	describe('sort method', () => {
		it('should sort the list in ascending order without providing a comparator function', () => {
			list.add(4);
			list.add(5);
			list.add(6);
			list.sort();
			expect(list.toArray()).toEqual([1, 2, 3, 4, 5, 6]);
		});

		it('should sort a list of strings in ascending order without providing a comparator function', () => {
			const list = new List(['b', 'B', 'a']);
			list.sort();
			expect(list.toArray()).toEqual(['B', 'a', 'b']);
		});

		it('should compare numbers numerically and mixed values by string order', () => {
			expect(new List([20, 3, 100]).sort().toArray()).toEqual([3, 20, 100]);
			expect(new List([2, '10']).sort().toArray()).toEqual(['10', 2]);
		});

		it('should sort the list in reverse when a comparator function is supplied', () => {
			list.add(4);
			list.add(5);
			list.add(6);
			list.sort((a, b) => b - a);
			expect(list.toArray()).toEqual([6, 5, 4, 3, 2, 1]);
		});
	});

	describe('forEach method', () => {
		it('should call the callback for each item in the list', () => {
			const callback = vi.fn();
			list.forEach(callback);
			expect(callback).toHaveBeenCalledTimes(3);
		});
	});

	describe('toArray method', () => {
		it('should return an array that matches the list', () => {
			expect(list.toArray()).toEqual([1, 2, 3]);
		});
	});

	describe('*keys method', () => {
		it('should return an iterator of the keys', () => {
			const iterator = list.keys();
			expect(iterator.next().value).toEqual(0);
			expect(iterator.next().value).toEqual(1);
			expect(iterator.next().value).toEqual(2);
		});

		it('should loop through the keys', () => {
			for (const key of list.keys()) {
				expect(key).toEqual(list.indexOf(list.get(key)!));
			}
		});
	});

	describe('*values method', () => {
		it('should return an iterator of the values', () => {
			const iterator = list.values();
			expect(iterator.next().value).toEqual(1);
			expect(iterator.next().value).toEqual(2);
			expect(iterator.next().value).toEqual(3);
		});

		it('should loop through the values', () => {
			for (const value of list.values()) {
				expect(list.contains(value));
			}
		});
	});

	describe('*entries method', () => {
		it('should return an iterator of the entries', () => {
			const iterator = list.entries();
			expect(iterator.next().value).toEqual([0, 1]);
			expect(iterator.next().value).toEqual([1, 2]);
			expect(iterator.next().value).toEqual([2, 3]);
		});

		it('should loop through the entries', () => {
			for (const [index, value] of list.entries()) {
				expect(value).toEqual(list.get(index));
			}
		});
	});

	describe('*@@iterator method', () => {
		it('should return an iterator of the values', () => {
			const iterator = list[Symbol.iterator]();
			expect(iterator.next().value).toEqual(1);
			expect(iterator.next().value).toEqual(2);
			expect(iterator.next().value).toEqual(3);
		});
	});

	describe('toString method', () => {
		it('should return a string representation of the list', () => {
			expect(list.toString()).toEqual('1,2,3');
		});
	});

	describe('Symbol.toStringTag method', () => {
		it('should return a string representation of the list', () => {
			expect(list[Symbol.toStringTag]).toEqual('List');
		});
	});

	describe('Stage 1 list methods', () => {
		it('returns elements for positive and negative at indices', () => {
			expect(list.at(0)).toBe(1);
			expect(list.at(-1)).toBe(3);
			expect(list.at(-3)).toBe(1);
			expect(list.at(3)).toBeUndefined();
			expect(list.at(-4)).toBeUndefined();
		});

		it('slices into a separate List and supports negative bounds', () => {
			const result = list.slice(0, -1);

			expect(result).toBeInstanceOf(List);
			expect(result.toArray()).toEqual([1, 2]);
			result.add(4);
			expect(list.toArray()).toEqual([1, 2, 3]);
			expect(list.slice(-2).toArray()).toEqual([2, 3]);
		});

		it('flatMaps values and passes the List as the callback collection', () => {
			let callbackList: List<number> | undefined;
			const result = list.flatMap((value, _index, source) => {
				callbackList = source;

				return [value, value * 10];
			});

			expect(result.toArray()).toEqual([1, 10, 2, 20, 3, 30]);
			expect(callbackList).toBe(list);
		});

		it('supports findLast and findLastIndex', () => {
			const values = new List([1, 2, 3, 2]);

			expect(values.findLast((value) => value === 2)).toBe(2);
			expect(values.findLastIndex((value) => value === 2)).toBe(3);
			expect(values.findLast((value) => value > 3)).toBeUndefined();
			expect(values.findLastIndex((value) => value > 3)).toBe(-1);
		});

		it('removes matching values in place and returns the removed count', () => {
			const originalArray = list.toArray();
			const removed = list.removeIf((value) => value % 2 === 1);

			expect(removed).toBe(2);
			expect(list.toArray()).toEqual([2]);
			expect(originalArray).toEqual([1, 2, 3]);
		});

		it('returns a sorted copy without mutating the source', () => {
			const values = new List([20, 3, 100]);
			const sorted = values.toSorted();

			expect(sorted).not.toBe(values);
			expect(sorted.toArray()).toEqual([3, 20, 100]);
			expect(values.toArray()).toEqual([20, 3, 100]);
			expect(new List(['b', 'B', 'a']).toSorted().toArray()).toEqual(['B', 'a', 'b']);
			expect(values.toSorted((a, b) => b - a).toArray()).toEqual([100, 20, 3]);
		});

		it('reduces without an initial value and throws RangeError on an empty List', () => {
			expect(list.reduce((sum, value) => sum + value)).toBe(6);
			expect(() => new List<number>().reduce((sum, value) => sum + value)).toThrow(RangeError);
			expect(new List<number>().reduce((sum, value) => sum + value, 7)).toBe(7);
		});

		it('creates Lists from iterables, mapped iterables, and elements', () => {
			const source = new Set([1, 2, 3]);
			const listFrom = List.from(source);
			let mappedSource: List<number> | undefined;
			const mapped = List.from(source, (value, _index, callbackList) => {
				mappedSource = callbackList;

				return String(value * 2);
			});

			expect(listFrom).toBeInstanceOf(List);
			expect(listFrom.toArray()).toEqual([1, 2, 3]);
			expect(mapped.toArray()).toEqual(['2', '4', '6']);
			expect(mappedSource?.toArray()).toEqual([1, 2, 3]);
			expect(List.of(4, 5).toArray()).toEqual([4, 5]);
		});

		it('returns shallow copies from toArray and has no valueOf override', () => {
			const nested = { value: 1 };
			const values = new List([nested]);
			const copy = values.toArray();

			expect(copy).not.toBe(values);
			expect(copy).not.toBe(values.toArray());
			expect(copy[0]).toBe(nested);
			copy.push({ value: 2 });
			expect(values.size).toBe(1);
			expect(Object.hasOwn(List.prototype, 'valueOf')).toBe(false);
		});

		it('passes the List as the callback collection and honors callback this-args', () => {
			const receiver = { factor: 10 };
			const callback = function(this: typeof receiver, value: number, _index: number, callbackList: List<number>): number {
				expect(callbackList).toBe(list);
				expect(Array.isArray(callbackList)).toBe(false);

				return value * this.factor;
			};

			expect(list.map(callback, receiver).toArray()).toEqual([10, 20, 30]);

			const observedLists: Array<List<number>> = [];
			list.forEach((_value, _index, callbackList) => observedLists.push(callbackList));
			expect(observedLists).toEqual([list, list, list]);
		});

		it('passes the List to predicate and reducer callbacks and honors predicate this-args', () => {
			const receiver = { minimum: 2 };
			const predicate = function(this: typeof receiver, value: number, _index: number, callbackList: List<number>): boolean {
				expect(callbackList).toBe(list);
				return value >= this.minimum;
			};

			expect(list.filter(predicate, receiver).toArray()).toEqual([2, 3]);
			expect(list.find(predicate, receiver)).toBe(2);

			let reducerList: List<number> | undefined;
			expect(list.reduce((sum, value, _index, callbackList) => {
				reducerList = callbackList;

				return sum + value;
			}, 0)).toBe(6);
			expect(reducerList).toBe(list);
		});

		it('passes this List as the third argument to every callback API', () => {
			const predicate = (_value: number, _index: number, callbackList: List<number>): boolean => {
				expect(callbackList).toBe(list);
				expect(Array.isArray(callbackList)).toBe(false);

				return true;
			};

			list.every(predicate);
			list.some(predicate);
			list.filter(predicate);
			list.find(predicate);
			list.findIndex(predicate);
			list.findLast(predicate);
			list.findLastIndex(predicate);
			list.map((_value, _index, callbackList) => {
				expect(callbackList).toBe(list);
				return 0;
			});
			list.flatMap((_value, _index, callbackList) => {
				expect(callbackList).toBe(list);
				return [];
			});
			list.forEach((_value, _index, callbackList) => expect(callbackList).toBe(list));
			list.reduce((previous, value, _index, callbackList) => {
				expect(callbackList).toBe(list);
				return previous + value;
			}, 0);
			list.removeIf((_value, _index, callbackList) => {
				expect(callbackList).toBe(list);

				return false;
			});
		});

		it('returns this from fluent mutators including clear', () => {
			expect(list.add(4)).toBe(list);
			expect(list.addAll(5)).toBe(list);
			expect(list.addAllFrom([6])).toBe(list);
			expect(list.insert(0, 0)).toBe(list);
			expect(list.set(0, 1)).toBe(list);
			expect(list.reverse()).toBe(list);
			expect(list.sort()).toBe(list);
			expect(list.clear()).toBe(list);
		});
	});

	describe('callback methods when the list is mutated during iteration', () => {
		type Visit = [ number | undefined, number ];
		type Mutation = 'grows' | 'shrinks';

		const methods = [ 'every', 'some', 'filter', 'find', 'findIndex', 'findLast', 'findLastIndex', 'map', 'flatMap', 'forEach', 'reduce' ] as const;

		const results: Record<(typeof methods)[number], (element: number | undefined, index: number) => unknown> = {
			every: () => true,
			some: () => false,
			filter: (_, index) => index % 2 === 0,
			find: () => false,
			findIndex: () => false,
			findLast: () => false,
			findLastIndex: () => false,
			map: (element) => element,
			flatMap: (element) => [ element, element ],
			forEach: () => undefined,
			reduce: () => undefined
		};

		const run = (method: (typeof methods)[number], mutation: Mutation, target: 'array' | 'list') => {
			const visits: Visit[] = [];
			const array = [ 1, 2, 3, 4 ];
			const list = new List(array);
			const mutate = target === 'array'
				? (mutation === 'grows' ? () => array.push(99) : () => array.pop())
				: (mutation === 'grows' ? () => list.add(99) : () => list.removeLast());
			const callback = (element: number | undefined, index: number) => {
				if (visits.push([ element, index ]) === 1) { mutate() }

				return results[method](element, index);
			};
			const reducer = (accumulator: number, element: number | undefined, index: number) => {
				callback(element, index);

				return accumulator + 1;
			};

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const source: any = target === 'array' ? array : list;
			const result = method === 'reduce' ? source.reduce(reducer, 0) : source[method](callback);

			return { visits, result: result instanceof List ? result.toArray() : result, contents: target === 'array' ? array.slice() : list.toArray() };
		};

		for (const method of methods) {
			for (const mutation of [ 'grows', 'shrinks' ] as const) {
				it(`${method} matches native Array behavior when the callback ${mutation} the list`, () => {
					expect(run(method, mutation, 'list')).toEqual(run(method, mutation, 'array'));
				});
			}
		}

		it('flatMap flattens arrays one level like native Array, skipping holes and keeping non-array values', () => {
			// eslint-disable-next-line no-sparse-arrays
			const mapper = (element: number) => element === 1 ? [ 1, , 2 ] : element === 2 ? [ [ 3 ] ] : element;

			expect(list.flatMap(mapper).toArray()).toEqual(initialItems.flatMap(mapper));
		});

		it('removeIf only visits the original elements when the predicate grows the list', () => {
			const visited: number[] = [];

			list.removeIf((element, index, self) => {
				if (visited.push(element) === 1) { self.add(99) }

				return index === 1;
			});

			expect(visited).toEqual([ 1, 2, 3 ]);
			expect(list.toArray()).toEqual([ 1, 3 ]);
		});
	});
});