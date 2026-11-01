import { Stack } from '../src/stack';
import { beforeEach, describe, expect, test } from 'vitest';

describe('Stack', () => {
	let stack: Stack<number>;

	beforeEach(() => {
		stack = new Stack();
	});

	describe('push', () => {
		test('should add an element to the stack', () => {
			expect(stack.push(1)).toBe(stack);
			expect(stack.size).toBe(1);
		});

		test('should add multiple elements to the stack', () => {
			stack.push(1);
			stack.push(2);
			expect(stack.size).toBe(2);
		});
	});

	describe('constructor', () => {
		test('should initialize from an iterable with its last item on top', () => {
			stack = new Stack([1, 2, 3]);

			expect(stack.peek()).toBe(3);
			expect([...stack]).toEqual([3, 2, 1]);
		});

		test('should initialize an empty stack from an empty iterable', () => {
			stack = new Stack([]);

			expect(stack.isEmpty()).toBe(true);
			expect(stack.size).toBe(0);
		});
	});

	describe('pop', () => {
		test('should remove the top element from the stack', () => {
			stack.push(1);
			stack.push(2);
			const poppedValue = stack.pop();
			expect(poppedValue).toBe(2);
			expect(stack.size).toBe(1);
		});

		test('should return undefined when popping an empty stack', () => {
			const poppedValue = stack.pop();
			expect(poppedValue).toBeUndefined();
		});
	});

	describe('peek', () => {
		test('should return the top element without removing it', () => {
			stack.push(1);
			stack.push(2);
			const peekedValue = stack.peek();
			expect(peekedValue).toBe(2);
			expect(stack.size).toBe(2);
		});

		test('should return undefined when peeking an empty stack', () => {
			const peekedValue = stack.peek();
			expect(peekedValue).toBeUndefined();
		});
	});

	describe('size', () => {
		test('should return the correct size of the stack', () => {
			expect(stack.size).toBe(0);
			stack.push(1);
			expect(stack.size).toBe(1);
			stack.push(2);
			expect(stack.size).toBe(2);
			stack.pop();
			expect(stack.size).toBe(1);
		});
	});

	describe('isEmpty', () => {
		test('should return true when the stack is empty', () => {
			expect(stack.isEmpty()).toBe(true);
		});

		test('should return false when the stack is not empty', () => {
			stack.push(1);
			expect(stack.isEmpty()).toBe(false);
		});
	});

	describe('iteration and toArray', () => {
		test('should expose values from top to bottom', () => {
			stack.push(1).push(2).push(3);

			expect([...stack]).toEqual([3, 2, 1]);
			expect(stack.toArray()).toEqual([3, 2, 1]);
		});

		test('should return a copy from toArray', () => {
			stack.push(1).push(2);
			const values = stack.toArray();
			values.pop();

			expect(stack.toArray()).toEqual([2, 1]);
		});

		test('should iterate over a snapshot', () => {
			stack.push(1).push(2);
			const iterator = stack[Symbol.iterator]();
			stack.push(3);

			expect([...iterator]).toEqual([2, 1]);
		});
	});

	describe('clear', () => {
		test('should remove all items and return the stack', () => {
			stack.push(1).push(2);

			expect(stack.clear()).toBe(stack);
			expect(stack.size).toBe(0);
			expect(stack.isEmpty()).toBe(true);
			expect(stack.peek()).toBeUndefined();
			expect(stack.pop()).toBeUndefined();
		});
	});

	describe('Symbol.toStringTag', () => {
		test('should return the correct Symbol.toStringTag', () => {
			expect(stack[Symbol.toStringTag]).toBe('Stack');
			expect(Object.prototype.toString.call(stack)).toBe('[object Stack]');
		});
	});
});