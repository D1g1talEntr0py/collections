import { LinkedList } from '../src/linked-list.js';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Doubly LinkedList', () => {
	let list: LinkedList<number>;

	beforeEach(() => {
		list = new LinkedList(LinkedList.Type.Doubly);
	});

	describe('constructor', () => {
		it('creates an empty list', () => {
			expect(list).toBeInstanceOf(LinkedList);
			expect(list.size).toBe(0);
		});
	});

	describe('addFirst', () => {
		it('adds an element at the start of the list', () => {
			list.addFirst(1);
			expect(list.getFirst()).toBe(1);
			expect(list.size).toBe(1);
		});

		it('adds multiple elements at the start of the list', () => {
			list.addFirst(1);
			list.addFirst(2);
			list.addFirst(3);
			expect(list.getFirst()).toBe(3);
			expect(list.size).toBe(3);
		});
	});

	describe('addLast', () => {
		it('adds an element at the end of the list', () => {
			list.addLast(1);
			expect(list.getLast()).toBe(1);
			expect(list.size).toBe(1);
		});
	});

	describe('getFirst', () => {
		it('returns the first element in the list', () => {
			list.addFirst(1);
			list.addLast(2);
			expect(list.getFirst()).toBe(1);
		});
	});

	describe('getLast', () => {
		it('returns the last element in the list', () => {
			list.addFirst(1);
			list.addLast(2);
			expect(list.getLast()).toBe(2);
		});
	});

	describe('removeFirst', () => {
		it('removes the first element from the list', () => {
			list.addFirst(1);
			list.addLast(2);
			expect(list.removeFirst()).toBe(1);
			expect(list.getFirst()).toBe(2);
		});
	});

	describe('removeLast', () => {
		it('removes the last element from the list', () => {
			list.addFirst(1);
			list.addLast(2);
			expect(list.removeLast()).toBe(2);
			expect(list.getLast()).toBe(1);
		});
	});

	describe('remove', () => {
		it('removes the given element from the list', () => {
			list.addLast(1);
			list.addLast(2);
			list.addLast(3);
			expect(list.remove(2)).toBe(2);
			expect(list.size).toBe(2);
		});

		it('removes the first element from the list', () => {
			list.addLast(1);
			list.addLast(2);
			list.addLast(3);
			expect(list.remove(1)).toBe(1);
			expect(list.size).toBe(2);
		});

		it('returns null if the element is not in the list', () => {
			list.addLast(1);
			list.addLast(2);
			list.addLast(3);
			expect(list.remove(4)).toBeNull();
			expect(list.size).toBe(3);
		});
	});

	describe('get', () => {
		it('returns the element at the given index', () => {
			list.addLast(1);
			list.addLast(2);
			list.addLast(3);
			expect(list.get(1)).toBe(2);
		});

		it('should return the correct node when index is in the second half of a doubly linked list', () => {
			// Assuming a method add to add elements to the list
			for (let i = 0; i < 10; i++) {
				list.addLast(i);
			}

			// The list should now contain numbers 0-9. Let's get a node in the second half.
			const value = list.get(7);

			// Assuming the node has a 'value' property
			expect(value).toBe(7);
		});

		it('should return null if the index is out of bounds', () => {
			list.addLast(1);
			expect(list.get(1)).toBeNull();
		});
	});

	describe('set', () => {
		it('sets the value at the given index', () => {
			list.addLast(1);
			list.set(0, 2);
			expect(list.get(0)).toBe(2);
		});

		it('throws a RangeError if the index is out of bounds', () => {
			list.addLast(1);
			expect(() => list.set(1, 2)).toThrow(RangeError);
		});
	});

	describe('insert', () => {
		it('inserts a value at the given index', () => {
			list.addLast(1);
			list.addLast(3);
			list.insert(1, 2);
			expect(list.get(1)).toBe(2);
		});

		it('inserts a value at the start of the list', () => {
			list.addLast(1);
			list.addLast(2);
			list.insert(0, 0);
			expect(list.get(0)).toBe(0);
		});

		it('inserts in the middle of the list', () => {
			list.addLast(1);
			list.addLast(2);
			list.addLast(3);

			list.insert(1, 1.5); // insert 1.5 between 1 and 2

			expect(list.size).toBe(4);

			// Check the node at index 1
			expect(list.get(1)).toBe(1.5);
			expect(list.getLast()).toBe(3);
			expect(list.getFirst()).toBe(1);
		});

		it('inserts a value at the end of the list', () => {
			list.addLast(1);
			list.addLast(2);
			list.insert(2, 3);
			expect(list.get(2)).toBe(3);
		});

		it('inserts multiple values at the given index', () => {
			list.addLast(1);
			list.addLast(2);
			list.addLast(3);
			list.addFirst(0);
			list.insert(1, 4);
			expect(list.get(0)).toBe(0);
			expect(list.get(1)).toBe(4);
			expect(list.get(2)).toBe(1);
			expect(list.get(3)).toBe(2);
			expect(list.get(4)).toBe(3);
		});

		it('throws a RangeError if the index is out of bounds', () => {
			list.addLast(1);
			list.addLast(2);
			expect(() => list.insert(3, 3)).toThrow(RangeError);
		});
	});

	describe('contains', () => {
		it('checks if the list contains a value', () => {
			list.addLast(1);
			list.addLast(2);
			expect(list.contains(1)).toBeTruthy();
			expect(list.contains(3)).toBeFalsy();
		});
	});

	describe('reverse', () => {
		it('reverses the list', () => {
			list.addLast(1);
			list.addLast(2);
			list.reverse();
			expect(list.getFirst()).toBe(2);
			expect(list.getLast()).toBe(1);
		});

		it('works on empty list', () => {
			list.reverse();
			expect(list.getFirst()).toBeNull();
			expect(list.getLast()).toBeNull();
		});

		it('works on single-element list', () => {
			list.addFirst(1);
			list.reverse();
			expect(list.getFirst()).toBe(1);
			expect(list.getLast()).toBe(1);
		});

		it('works on multiple-element list', () => {
			list.addLast(1);
			list.addLast(2);
			list.addLast(3);
			list.reverse();
			expect(list.getFirst()).toBe(3);
			expect(list.getLast()).toBe(1);
		});
	});

	describe('clear', () => {
		it('clears the list', () => {
			list.addLast(1);
			list.clear();
			expect(list.size).toBe(0);
		});
	});

	describe('isEmpty', () => {
		it('checks if the list is empty', () => {
			expect(list.isEmpty()).toBeTruthy();
			list.addLast(1);
			expect(list.isEmpty()).toBeFalsy();
		});
	});

	describe('#indexOf', () => {
		it('returns the index of a value in the list', () => {
			list.addLast(1);
			list.addLast(2);
			expect(list.indexOf(2)).toBe(1);
		});

		it('returns -1 if the value is not in the list', () => {
			list.addLast(1);
			list.addLast(2);
			expect(list.indexOf(3)).toBe(-1);
		});
	});

	describe('#forEach', () => {
		it('iterates over the list', () => {
			const values = [1, 2, 3];
			values.forEach(v => list.addLast(v));
			const result: number[] = [];
			list.forEach(v => result.push(v));
			expect(result).toEqual(values);
		});
	});

	describe('#values', () => {
		it('returns an iterator of values in the list', () => {
			const values = [1, 2, 3];
			values.forEach(v => list.addLast(v));
			expect(Array.from(list.values())).toEqual(values);
		});
	});

	describe('#size', () => {
		it('returns the size of the list', () => {
			expect(list.size).toBe(0);
			list.addLast(1);
			expect(list.size).toBe(1);
		});
	});

	describe('#toArray', () => {
		it('returns an array representation of the list', () => {
			const values = [1, 2, 3];
			values.forEach(v => list.addLast(v));
			expect(list.toArray()).toEqual(values);
		});
	});

	describe('#[Symbol.iterator]', () => {
		it('is iterable', () => {
			const values = [1, 2, 3];
			values.forEach(v => list.addLast(v));
			expect([...list]).toEqual(values);
		});
	});
});

describe('Singly LinkedList', () => {
	let list: LinkedList<number>;

	beforeEach(() => {
		list = new LinkedList(LinkedList.Type.Singly);
	});

	describe('constructor', () => {
		it('creates an empty list', () => {
			expect(list).toBeInstanceOf(LinkedList);
			expect(list.size).toBe(0);
		});
	});

	describe('addFirst method', () => {
		it('should add an element to the start of an empty list', () => {
			const list = new LinkedList<number>();
			list.addFirst(1);
			expect(list.getFirst()).toEqual(1);
			expect(list.getLast()).toEqual(1);
			expect(list.size).toEqual(1);
		});

		it('should add an element to the start of a doubly linked list', () => {
			const list = new LinkedList<number>(LinkedList.Type.Doubly);
			list.addFirst(1);
			list.addFirst(2);
			expect(list.getFirst()).toEqual(2);
			expect(list.getLast()).toEqual(1);
		});
	});

	describe('addLast', () => {
		it('adds an element at the end of the list', () => {
			list.addLast(1);
			expect(list.getLast()).toBe(1);
			expect(list.size).toBe(1);
		});
	});

	describe('getFirst', () => {
		it('returns the first element in the list', () => {
			list.addFirst(1);
			list.addLast(2);
			expect(list.getFirst()).toBe(1);
		});
	});

	describe('getLast', () => {
		it('returns the last element in the list', () => {
			list.addFirst(1);
			list.addLast(2);
			expect(list.getLast()).toBe(2);
		});
	});

	describe('removeFirst', () => {
		it('removes the first element from the list', () => {
			list.addFirst(1);
			list.addLast(2);
			expect(list.removeFirst()).toBe(1);
			expect(list.getFirst()).toBe(2);
		});
	});

	describe('removeLast', () => {
		it('removes the last element from the list', () => {
			list.addFirst(1);
			list.addLast(2);
			expect(list.removeLast()).toBe(2);
			expect(list.getLast()).toBe(1);
		});

		it('Returns null when the list is empty', () => {
			expect(list.removeLast()).toBeNull();
		});
	});

	describe('remove', () => {
		it('removes the given element from the list', () => {
			list.addLast(1);
			list.addLast(2);
			list.addLast(3);
			expect(list.remove(2)).toBe(2);
			expect(list.size).toBe(2);
		});

		it('returns null if the element is not in the list', () => {
			list.addLast(1);
			list.addLast(2);
			list.addLast(3);
			expect(list.remove(4)).toBe(null);
			expect(list.size).toBe(3);
		});

		it('removes the only element from the list', () => {
			list.addLast(1);
			expect(list.remove(1)).toBe(1);
			expect(list.size).toBe(0);
		});
	});

	describe('set', () => {
		it('sets the value at the given index', () => {
			list.addLast(1);
			list.set(0, 2);
			expect(list.get(0)).toBe(2);
		});

		it('throws a RangeError if the index is out of bounds', () => {
			list.addLast(1);
			expect(() => list.set(1, 2)).toThrow(RangeError);
		});
	});

	describe('insert', () => {
		it('inserts a value at the given index', () => {
			list.addLast(1);
			list.addLast(3);
			list.insert(1, 2);
			expect(list.get(1)).toBe(2);
		});

		it('throws a RangeError if the index is out of bounds', () => {
			list.addLast(1);
			expect(() => list.insert(2, 2)).toThrow(RangeError);
		});

		it('inserts at the start of the list', () => {
			list.addLast(2);
			list.insert(0, 1);
			expect(list.get(0)).toBe(1);
		});

		it('inserts multiple values at the given index', () => {
			list.addLast(1);
			list.addLast(3);
			list.insert(1, 2);
			list.insert(2, 4);
			expect(list.get(1)).toBe(2);
			expect(list.get(2)).toBe(4);
		});
	});

	describe('contains', () => {
		it('checks if the list contains a value', () => {
			list.addLast(1);
			list.addLast(2);
			expect(list.contains(1)).toBeTruthy();
			expect(list.contains(3)).toBeFalsy();
		});
	});

	describe('#reverse', () => {
		it('reverses the list', () => {
			list.addLast(1);
			list.addLast(2);
			list.reverse();
			expect(list.getFirst()).toBe(2);
			expect(list.getLast()).toBe(1);
		});
	});

	describe('#clear', () => {
		it('clears the list', () => {
			list.addLast(1);
			list.clear();
			expect(list.size).toBe(0);
		});
	});

	describe('#isEmpty', () => {
		it('checks if the list is empty', () => {
			expect(list.isEmpty()).toBeTruthy();
			list.addLast(1);
			expect(list.isEmpty()).toBeFalsy();
		});
	});

	describe('#indexOf', () => {
		it('returns the index of a value in the list', () => {
			list.addLast(1);
			list.addLast(2);
			expect(list.indexOf(2)).toBe(1);
		});
	});

	describe('#forEach', () => {
		it('iterates over the list', () => {
			const values = [1, 2, 3];
			values.forEach(v => list.addLast(v));
			const result: number[] = [];
			list.forEach((v: number) => result.push(v));
			expect(result).toEqual(values);
		});
	});

	describe('#values', () => {
		it('returns an iterator of values in the list', () => {
			const values = [1, 2, 3];
			values.forEach(v => list.addLast(v));
			expect(Array.from(list.values())).toEqual(values);
		});
	});

	describe('#size', () => {
		it('returns the size of the list', () => {
			expect(list.size).toBe(0);
			list.addLast(1);
			expect(list.size).toBe(1);
		});
	});

	describe('#toArray', () => {
		it('returns an array representation of the list', () => {
			const values = [1, 2, 3];
			values.forEach(v => list.addLast(v));
			expect(list.toArray()).toEqual(values);
		});
	});

	describe('#[Symbol.iterator]', () => {
		it('is iterable', () => {
			const values = [1, 2, 3];
			values.forEach(v => list.addLast(v));
			expect([...list]).toEqual(values);
		});
	});
});

describe('Symbol.toStringTag', () => {
	it('should return the correct Symbol.toStringTag', () => {
		expect(Object.prototype.toString.call(new LinkedList())).toBe('[object LinkedList]');
	});
});