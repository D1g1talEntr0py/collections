import { LinkedList } from '../src/linked-list.js';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Doubly LinkedList', () => {
	let list: LinkedList<number>;

	beforeEach(() => {
		list = new LinkedList(undefined, LinkedList.Type.Doubly);
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
			expect(list.remove(4)).toBeUndefined();
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
			for (let i = 0; i < 10; i++) {
				list.addLast(i);
			}

			expect(list.get(0)).toBe(0);
			expect(list.get(7)).toBe(7);
			expect(list.get(9)).toBe(9);
		});

		it('should return null if the index is out of bounds', () => {
			list.addLast(1);
			expect(list.get(1)).toBeUndefined();
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

		it('maintains backward links after inserting in the middle', () => {
			list.addLast(1);
			list.addLast(3);
			list.insert(1, 2);

			expect(list.removeLast()).toBe(3);
			expect(list.getLast()).toBe(2);
			expect(list.toArray()).toEqual([1, 2]);
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
			expect(list.getFirst()).toBeUndefined();
			expect(list.getLast()).toBeUndefined();
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

		it('supports closing the iterator early', () => {
			list.addLast(1);
			list.addLast(2);
			const iterator = list.values();

			expect(iterator.next()).toEqual({ done: false, value: 1 });
			expect(iterator.return()).toEqual({ done: true, value: undefined });
			expect(iterator.next()).toEqual({ done: true, value: undefined });
		});

		it('closes the iterator when an error is thrown into it', () => {
			list.addLast(1);
			const iterator = list.values();
			const error = new Error('iteration failed');

			expect(() => iterator.throw(error)).toThrow(error);
			expect(iterator.next()).toEqual({ done: true, value: undefined });
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
		list = new LinkedList(undefined, LinkedList.Type.Singly);
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
			const list = new LinkedList<number>(undefined, LinkedList.Type.Doubly);
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

		it('returns undefined when the list is empty', () => {
			expect(list.removeLast()).toBeUndefined();
		});

		it('unlinks the tail and allows another value to be appended', () => {
			list.addLast(1);
			list.addLast(2);
			list.addLast(3);

			expect(list.removeLast()).toBe(3);
			list.addLast(4);

			expect(list.getLast()).toBe(4);
			expect(list.size).toBe(3);
			expect(list.toArray()).toEqual([1, 2, 4]);
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
			expect(list.remove(4)).toBeUndefined();
			expect(list.size).toBe(3);
		});

		it('removes the only element from the list', () => {
			list.addLast(1);
			expect(list.remove(1)).toBe(1);
			expect(list.size).toBe(0);
		});

		it('unlinks an element from the middle of the list', () => {
			list.addLast(1);
			list.addLast(2);
			list.addLast(3);

			expect(list.remove(2)).toBe(2);
			expect(list.size).toBe(2);
			expect(list.toArray()).toEqual([1, 3]);
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

describe('LinkedList iterable construction and methods', () => {
	it.each([ LinkedList.Type.Singly, LinkedList.Type.Doubly ])('constructs an iterable %s list', (type) => {
		const list = new LinkedList([ 1, 2, 3 ], type);

		expect(list.toArray()).toEqual([ 1, 2, 3 ]);
		expect(list.getFirst()).toBe(1);
		expect(list.getLast()).toBe(3);
	});

	it.each([ LinkedList.Type.Singly, LinkedList.Type.Doubly ])('creates a %s list with from and honors the type parameter', (type) => {
		const list = LinkedList.from(new Set([ 1, 2, 3 ]), type);

		expect(list.toArray()).toEqual([ 1, 2, 3 ]);
		const iterator = list.descendingValues();
		expect(iterator.next().value).toBe(3);
		list.remove(2);
		expect(Array.from(iterator)).toEqual(type === LinkedList.Type.Doubly ? [ 1 ] : [ 2, 1 ]);
	});

	it.each([ 'constructor', 'from' ] as const)('defaults to singly linked with %s when type is omitted or undefined', (factory) => {
		const lists = factory === 'constructor'
			? [ new LinkedList([ 1, 2, 3 ]), new LinkedList([ 1, 2, 3 ], undefined) ]
			: [ LinkedList.from([ 1, 2, 3 ]), LinkedList.from([ 1, 2, 3 ], undefined) ];

		for (const list of lists) {
			const iterator = list.descendingValues();
			list.remove(2);
			expect(Array.from(iterator)).toEqual([ 3, 2, 1 ]);
			expect(list.toArray()).toEqual([ 1, 3 ]);
		}
	});

	it('adds variadic values literally', () => {
		const list = new LinkedList<number>();

		expect(list.addAll(1, 2)).toBe(list);
		expect(list.toArray()).toEqual([ 1, 2 ]);
	});

	it('keeps iterable values intact when adding variadic elements', () => {
		const strings = new LinkedList<string>();
		const arrays = new LinkedList<number[]>();

		strings.addAll('abc');
		arrays.addAll([ 1, 2 ], [ 3, 4 ]);

		expect(strings.toArray()).toEqual([ 'abc' ]);
		expect(arrays.toArray()).toEqual([ [ 1, 2 ], [ 3, 4 ] ]);
	});

	it('streams iterable values through addAllFrom', () => {
		const list = new LinkedList<number>();
		const observedSizes: number[] = [];
		function* values(): Generator<number> {
			yield 1;
			observedSizes.push(list.size);
			yield 2;
			observedSizes.push(list.size);
		}

		expect(list.addAllFrom(values())).toBe(list);
		expect(observedSizes).toEqual([ 1, 2 ]);
		expect(list.toArray()).toEqual([ 1, 2 ]);

		const largeInput = (function* (): Generator<number> {
			for (let value = 0; value < 25_000; value++) { yield value }
		})();
		list.clear().addAllFrom(largeInput);
		expect(list.size).toBe(25_000);
		expect(list.getLast()).toBe(24_999);
	});

	it.each([ LinkedList.Type.Singly, LinkedList.Type.Doubly ])('searches and peeks values in a %s list', (type) => {
		const list = new LinkedList([ 1, 2, 1, 3 ], type);

		expect(list.find((value, index, currentList) => value === 1 && index === 2 && currentList === list)).toBe(1);
		expect(list.find((value) => value > 3)).toBeUndefined();
		expect(list.lastIndexOf(1)).toBe(2);
		expect(list.lastIndexOf(9)).toBe(-1);
		expect(list.peekFirst()).toBe(1);
		expect(list.peekLast()).toBe(3);
	});

	it('preserves stored null and distinguishes absent values', () => {
		const list = new LinkedList<number | null>([ null ]);

		expect(list.get(0)).toBeNull();
		expect(list.getFirst()).toBeNull();
		expect(list.peekFirst()).toBeNull();
		expect(list.removeFirst()).toBeNull();
		expect(list.size).toBe(0);
		expect(list.get(0)).toBeUndefined();
		expect(list.getFirst()).toBeUndefined();
		expect(list.getLast()).toBeUndefined();
		expect(list.peekLast()).toBeUndefined();
		expect(list.removeFirst()).toBeUndefined();
		expect(list.removeLast()).toBeUndefined();
		expect(list.remove(1)).toBeUndefined();
	});

	it('removes a stored undefined value', () => {
		const list = new LinkedList<number | undefined>([ undefined ]);

		expect(list.remove(undefined)).toBeUndefined();
		expect(list.isEmpty()).toBe(true);
	});

	it('returns this from non-data-returning mutators', () => {
		const list = new LinkedList<number>();

		expect(list.addFirst(2)).toBe(list);
		expect(list.addLast(3)).toBe(list);
		expect(list.insert(1, 4)).toBe(list);
		expect(list.set(1, 5)).toBe(list);
		expect(list.reverse()).toBe(list);
		expect(list.clear()).toBe(list);
	});

	it('iterates with undefined as the default callback context', () => {
		const list = new LinkedList([ 1 ]);
		let callbackContext: unknown = list;

		list.forEach(function (this: unknown) {
			callbackContext = this;
		});

		expect(callbackContext).toBeUndefined();

		const context = {};
		list.forEach(function (this: unknown) {
			expect(this).toBe(context);
		}, context);
	});

	it('traverses a doubly linked list backward and skips removed nodes', () => {
		const list = new LinkedList([ 1, 2, 3, 4 ], LinkedList.Type.Doubly);
		const iterator = list.descendingValues();

		expect(iterator.next()).toEqual({ done: false, value: 4 });
		list.remove(3);
		expect(Array.from(iterator)).toEqual([ 2, 1 ]);
	});

	it('uses a snapshot to descend a singly linked list', () => {
		const list = new LinkedList([ 1, 2, 3 ]);
		const iterator = list.descendingValues();

		list.addLast(4);
		expect(Array.from(iterator)).toEqual([ 3, 2, 1 ]);
	});

	it('resumes descending from the new tail after repeated clears', () => {
		const list = new LinkedList([ 1, 2, 3 ], LinkedList.Type.Doubly);
		const iterator = list.descendingValues();

		expect(iterator.next()).toEqual({ done: false, value: 3 });
		list.clear().addAll(4, 5);
		expect(iterator.next()).toEqual({ done: false, value: 5 });
		list.clear().addAll(6, 7);
		expect(Array.from(iterator)).toEqual([ 7, 6 ]);

		list.clear().addLast(8);
		expect(iterator.next()).toEqual({ done: true, value: undefined });
	});

	it('finishes descending when all remaining predecessors are removed', () => {
		const list = new LinkedList([ 1, 2, 3, 4 ], LinkedList.Type.Doubly);
		const iterator = list.descendingValues();

		expect(iterator.next()).toEqual({ done: false, value: 4 });
		list.remove(3);
		list.remove(2);
		list.remove(1);
		expect(iterator.next()).toEqual({ done: true, value: undefined });
		expect(list.toArray()).toEqual([ 4 ]);
	});
});

describe('Symbol.toStringTag', () => {
	it('should return the correct Symbol.toStringTag', () => {
		expect(Object.prototype.toString.call(new LinkedList())).toBe('[object LinkedList]');
	});
});

describe.each([ LinkedList.Type.Singly, LinkedList.Type.Doubly ])('mutation-tolerant LinkedList iterator (%s)', (type) => {
	it('skips the current and next nodes when they are removed', () => {
		const list = new LinkedList<number>(undefined, type);
		[ 1, 2, 3, 4 ].forEach((value) => list.addLast(value));
		const iterator = list.values();

		expect(iterator.next().value).toBe(1);
		list.remove(1);
		list.remove(2);
		expect(Array.from(iterator)).toEqual([ 3, 4 ]);
	});

	it('continues past a removed node when its value is reinserted', () => {
		const list = new LinkedList<number>(undefined, type);
		[ 1, 2, 3 ].forEach((value) => list.addLast(value));
		const iterator = list.values();

		expect(iterator.next().value).toBe(1);
		list.remove(2);
		list.addLast(2);

		expect(Array.from(iterator)).toEqual([ 3, 2 ]);
	});

	it('observes an append after the yielded tail is removed', () => {
		const list = new LinkedList<number>(undefined, type);
		list.addLast(1);
		list.addLast(2);
		const iterator = list.values();

		expect(iterator.next().value).toBe(1);
		expect(iterator.next().value).toBe(2);
		list.remove(2);
		list.addLast(3);

		expect(Array.from(iterator)).toEqual([ 3 ]);
	});

	it('resumes at entries added after each clear', () => {
		const list = new LinkedList<number>(undefined, type);
		[ 1, 2 ].forEach((value) => list.addLast(value));
		const iterator = list.values();

		expect(iterator.next().value).toBe(1);
		list.clear();
		list.addLast(3);
		list.clear();
		[ 4, 5 ].forEach((value) => list.addLast(value));

		expect(Array.from(iterator)).toEqual([ 4, 5 ]);
	});

	it('finds appended values through a chain of removed tail predecessors', () => {
		const list = new LinkedList([ 1, 2, 3 ], type);
		const iterator = list.values();

		expect(iterator.next()).toEqual({ done: false, value: 1 });
		expect(iterator.next()).toEqual({ done: false, value: 2 });
		expect(iterator.next()).toEqual({ done: false, value: 3 });
		list.removeLast();
		list.removeLast();
		list.addLast(4);

		expect(Array.from(iterator)).toEqual([ 4 ]);
		expect(list.toArray()).toEqual([ 1, 4 ]);
	});

	it('resumes at the new head when the yielded tail and all predecessors are removed', () => {
		const list = new LinkedList([ 1, 2, 3 ], type);
		const iterator = list.values();

		expect(iterator.next()).toEqual({ done: false, value: 1 });
		expect(iterator.next()).toEqual({ done: false, value: 2 });
		expect(iterator.next()).toEqual({ done: false, value: 3 });
		list.removeLast();
		list.removeLast();
		list.removeLast();
		expect(list.isEmpty()).toBe(true);
		list.addAll(4, 5);

		expect(Array.from(iterator)).toEqual([ 4, 5 ]);
		expect(list.toArray()).toEqual([ 4, 5 ]);
	});

	it('stays done after later clear and additions', () => {
		const list = new LinkedList<number>(undefined, type);
		const iterator = list.values();

		expect(iterator.next()).toEqual({ done: true, value: undefined });
		list.addLast(1);
		list.clear();
		list.addLast(2);

		expect(iterator.next()).toEqual({ done: true, value: undefined });
	});

	it('keeps multiple iterators independent while nodes are removed', () => {
		const list = new LinkedList<number>(undefined, type);
		[ 1, 2, 3 ].forEach((value) => list.addLast(value));
		const first = list.values();
		const second = list.values();

		expect(first.next().value).toBe(1);
		expect(second.next().value).toBe(1);
		expect(second.next().value).toBe(2);
		list.remove(1);
		list.remove(2);
		list.addLast(4);

		expect(Array.from(first)).toEqual([ 3, 4 ]);
		expect(Array.from(second)).toEqual([ 3, 4 ]);
	});

	it('inherits native Iterator helpers', () => {
		const list = new LinkedList<number>(undefined, type);
		[ 1, 2, 3 ].forEach((value) => list.addLast(value));

		expect(Array.from(list.values().map((value) => value * 2))).toEqual([ 2, 4, 6 ]);
	});
});