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
	});

	describe('insert method', () => {
		it('should insert an item at the specified index', () => {
			list.insert(1, 4);
			expect(list.toArray()).toEqual([1, 4, 2, 3]);
		});
	});

	describe('remove method', () => {
		it('should remove an item from the list', () => {
			list.remove(2);
			expect(list.toArray()).toEqual([1, 3]);
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

		it('should return null if the list is empty', () => {
			list.clear();
			const last = list.removeLast();
			expect(last).toBe(null);
		});
	});

	describe('removeFirst method', () => {
		it('should remove the first element from the list', () => {
			const first = list.removeFirst();
			expect(first).toEqual(1);
			expect(list.toArray()).toEqual([2, 3]);
		});

		it('should return null if the list is empty', () => {
			list.clear();
			const first = list.removeFirst();
			expect(first).toBe(null);
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
			const list = new List(['c', 'a', 'b']);
			list.sort();
			expect(list.toArray()).toEqual(['a', 'b', 'c']);
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

	describe('valueOf method', () => {
		it('should return an array that matches the list', () => {
			expect(list.valueOf()).toEqual([1, 2, 3]);
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
});