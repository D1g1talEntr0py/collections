import Stack from '../src/stack.js';
import { describe, expect, test } from '@jest/globals';

describe('Stack', () => {
	let stack;

	beforeEach(() => {
		stack = new Stack();
	});

	describe('push', () => {
		test('should add an element to the stack', () => {
			stack.push(1);
			expect(stack.size).toBe(1);
		});

		test('should add multiple elements to the stack', () => {
			stack.push(1);
			stack.push(2);
			expect(stack.size).toBe(2);
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
});