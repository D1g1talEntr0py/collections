import LinkedList from '../src/linked-list';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('Doubly LinkedList', () => {
	let list;

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
			const result = [];
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
	let list;

	beforeEach(() => {
		list = new LinkedList(LinkedList.Type.Singly);
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

	describe('get', () => {
		it('returns the element at the given index', () => {
			list.addLast(1);
			list.addLast(2);
			list.addLast(3);
			expect(list.get(1)).toBe(2);
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

	describe('reversedValues', () => {
		it('throws an error if reversedValues is called on a singly linked list', () => {
			expect(() => Array.from(list.reversedValues())).toThrowError();
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
			const result = [];
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

describe('Symbol.toStringTag', () => {
	it('should return the correct Symbol.toStringTag', () => {
		expect(Object.prototype.toString.call(new LinkedList())).toBe('[object LinkedList]');
	});
});



// describe('LinkedList (Singly)', () => {
// 	describe('addFirst', () => {
// 		it('should add the value as the head of an empty list', () => {
// 			const list = new LinkedList();
// 			list.addFirst('Value 1');

// 			expect(list.getFirst()).toBe('Value 1');
// 			expect(list.getLast()).toBe('Value 1');
// 			expect(list.size).toBe(1);
// 		});

// 		it('should add the value as the head of a non-empty list', () => {
// 			const list = new LinkedList();
// 			list.addFirst('Value 1');
// 			list.addFirst('Value 2');

// 			expect(list.getFirst()).toBe('Value 2');
// 			expect(list.getLast()).toBe('Value 1');
// 			expect(list.size).toBe(2);
// 		});
// 	});

// 	describe('addLast', () => {
// 		it('should add the value as the tail of an empty list', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');

// 			expect(list.getFirst()).toBe('Value 1');
// 			expect(list.getLast()).toBe('Value 1');
// 			expect(list.size).toBe(1);
// 		});

// 		it('should add the value as the tail of a non-empty list', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');
// 			list.addLast('Value 2');

// 			expect(list.getFirst()).toBe('Value 1');
// 			expect(list.getLast()).toBe('Value 2');
// 			expect(list.size).toBe(2);
// 		});
// 	});

// 	describe('removeFirst', () => {
// 		it('should remove and return the head value from a non-empty list', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');
// 			list.addLast('Value 2');

// 			const removedValue = list.removeFirst();

// 			expect(removedValue).toBe('Value 1');
// 			expect(list.getFirst()).toBe('Value 2');
// 			expect(list.getLast()).toBe('Value 2');
// 			expect(list.size).toBe(1);
// 		});

// 		it('should return undefined if the list is empty', () => {
// 			const list = new LinkedList();

// 			const removedValue = list.removeFirst();

// 			expect(removedValue).toBeUndefined();
// 			expect(list.size).toBe(0);
// 		});
// 	});

// 	describe('removeLast', () => {
// 		it.only('should remove and return the tail value from a non-empty list', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');
// 			list.addLast('Value 2');

// 			const removedValue = list.removeLast();

// 			expect(removedValue).toBe('Value 2');
// 			expect(list.getFirst()).toBe('Value 1');
// 			expect(list.getLast()).toBe('Value 1');
// 			expect(list.size).toBe(1);
// 		});

// 		it('should return undefined if the list is empty', () => {
// 			const list = new LinkedList();

// 			const removedValue = list.removeLast();

// 			expect(removedValue).toBeUndefined();
// 			expect(list.size).toBe(0);
// 		});
// 	});

// 	describe('remove', () => {
// 		it('should remove and return the value from the list if it exists', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');
// 			list.addLast('Value 2');
// 			list.addLast('Value 3');

// 			const removedValue = list.remove('Value 2');

// 			expect(removedValue).toBe('Value 2');
// 			expect(list.getFirst()).toBe('Value 1');
// 			expect(list.getLast()).toBe('Value 3');
// 			expect(list.size).toBe(2);
// 		});

// 		it('should return undefined if the value does not exist in the list', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');
// 			list.addLast('Value 2');

// 			const removedValue = list.remove('Value 3');

// 			expect(removedValue).toBeUndefined();
// 			expect(list.size).toBe(2);
// 		});
// 	});

// 	describe('contains', () => {
// 		it('should return true if the value exists in the list', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');
// 			list.addLast('Value 2');

// 			const containsValue = list.contains('Value 2');

// 			expect(containsValue).toBe(true);
// 		});

// 		it('should return false if the value does not exist in the list', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');
// 			list.addLast('Value 2');

// 			const containsValue = list.contains('Value 3');

// 			expect(containsValue).toBe(false);
// 		});
// 	});

// 	describe('insert', () => {
// 		it('should insert the value at the specified index in a non-empty list', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');
// 			list.addLast('Value 2');

// 			list.insert(1, 'Value 1.5');

// 			expect(list.toArray()).toEqual(['Value 1', 'Value 1.5', 'Value 2']);
// 			expect(list.size).toBe(3);
// 		});

// 		it('should insert the value at the specified index in an empty list', () => {
// 			const list = new LinkedList();

// 			list.insert(0, 'Value 1');

// 			expect(list.toArray()).toEqual(['Value 1']);
// 			expect(list.size).toBe(1);
// 		});

// 		it('should throw an error if the index is out of bounds', () => {
// 			const list = new LinkedList();

// 			expect(() => {
// 				list.insert(2, 'Value 1');
// 			}).toThrowError('Index out of bounds: 2');
// 		});
// 	});

// 	describe('toArray', () => {
// 		it('should convert the list to an array', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');
// 			list.addLast('Value 2');
// 			list.addLast('Value 3');

// 			const arr = list.toArray();

// 			expect(arr).toEqual(['Value 1', 'Value 2', 'Value 3']);
// 		});

// 		it('should return an empty array for an empty list', () => {
// 			const list = new LinkedList();

// 			const arr = list.toArray();

// 			expect(arr).toEqual([]);
// 		});
// 	});

// 	describe('reverse', () => {
// 		it('should reverse the list in place', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');
// 			list.addLast('Value 2');
// 			list.addLast('Value 3');

// 			list.reverse();

// 			expect(list.toArray()).toEqual(['Value 3', 'Value 2', 'Value 1']);
// 		});

// 		it('should reverse an empty list without any changes', () => {
// 			const list = new LinkedList();

// 			list.reverse();

// 			expect(list.toArray()).toEqual([]);
// 		});
// 	});

// 	describe('get', () => {
// 		it('should get the value at the specified index in a non-empty list', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');
// 			list.addLast('Value 2');
// 			list.addLast('Value 3');

// 			const value = list.get(1);

// 			expect(value).toBe('Value 2');
// 		});

// 		it('should return null if the index is out of bounds in a non-empty list', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');
// 			list.addLast('Value 2');

// 			const value = list.get(2);

// 			expect(value).toBeUndefined();
// 		});

// 		it('should return null if the index is out of bounds in an empty list', () => {
// 			const list = new LinkedList();

// 			const value = list.get(0);

// 			expect(value).toBeUndefined();
// 		});
// 	});

// 	describe('set', () => {
// 		it('should set the value at the specified index in a non-empty list', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');
// 			list.addLast('Value 2');
// 			list.addLast('Value 3');

// 			const result = list.set(1, 'Value 2.5');

// 			expect(result).toBe(true);
// 			expect(list.get(1)).toBe('Value 2.5');
// 		});

// 		it('should throw an error if the index is out of bounds', () => {
// 			const list = new LinkedList();

// 			expect(() => {
// 				list.set(1, 'Value 1');
// 			}).toThrowError('Index out of bounds: 1');
// 		});
// 	});

// 	describe('forEach', () => {
// 		it('should execute the callback function for each value in the list', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');
// 			list.addLast('Value 2');
// 			list.addLast('Value 3');

// 			const callback = jest.fn();
// 			list.forEach(callback);

// 			expect(callback).toHaveBeenCalledTimes(3);
// 			expect(callback).toHaveBeenCalledWith('Value 1', 0, list);
// 			expect(callback).toHaveBeenCalledWith('Value 2', 1, list);
// 			expect(callback).toHaveBeenCalledWith('Value 3', 2, list);
// 		});

// 		it('should execute the callback function with the provided context', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');
// 			list.addLast('Value 2');

// 			const context = { count: 0 };
// 			const callback = function (value) {
// 				this.count++;
// 				console.log(value);
// 			};
// 			list.forEach(callback, context);

// 			expect(context.count).toBe(2);
// 		});
// 	});

// 	describe('values', () => {
// 		it('should return an iterator of the values in the list', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');
// 			list.addLast('Value 2');
// 			list.addLast('Value 3');

// 			const iterator = list.values();
// 			const result = Array.from(iterator);

// 			expect(result).toEqual(['Value 1', 'Value 2', 'Value 3']);
// 		});
// 	});

// 	describe('size', () => {
// 		it('should return the number of elements in the list', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');
// 			list.addLast('Value 2');
// 			list.addLast('Value 3');

// 			const size = list.size;

// 			expect(size).toBe(3);
// 		});

// 		it('should return 0 for an empty list', () => {
// 			const list = new LinkedList();

// 			const size = list.size;

// 			expect(size).toBe(0);
// 		});
// 	});

// 	describe('isEmpty', () => {
// 		it('should return true for an empty list', () => {
// 			const list = new LinkedList();

// 			const isEmpty = list.isEmpty();

// 			expect(isEmpty).toBe(true);
// 		});

// 		it('should return false for a non-empty list', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');

// 			const isEmpty = list.isEmpty();

// 			expect(isEmpty).toBe(false);
// 		});
// 	});

// 	describe('clear', () => {
// 		it('should remove all elements from the list', () => {
// 			const list = new LinkedList();
// 			list.addLast('Value 1');
// 			list.addLast('Value 2');
// 			list.addLast('Value 3');

// 			list.clear();

// 			expect(list.toArray()).toEqual([]);
// 			expect(list.size).toBe(0);
// 		});
// 	});
// });