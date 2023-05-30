import DoublyLinkedList from '../src/doubly-linked-list.js';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('DoublyLinkedList', () => {
	let list;

	beforeEach(() => {
		list = new DoublyLinkedList();
	});

	describe('push', () => {
		it('should add a new node to an empty list', () => {
			list.push('Hello');
			expect(list.length).toBe(1);
			expect(list.head.value).toBe('Hello');
			expect(list.tail.value).toBe('Hello');
		});

		it('should add a new node to the tail of the list', () => {
			list.push('Hello');
			list.push('World');
			expect(list.length).toBe(2);
			expect(list.head.value).toBe('Hello');
			expect(list.tail.value).toBe('World');
		});
	});

	describe('pop', () => {
		it('should remove the tail node from a list with one node', () => {
			list.push('Hello');
			const removedNode = list.pop();
			expect(list.length).toBe(0);
			expect(removedNode.value).toBe('Hello');
			expect(list.head).toBeNull();
			expect(list.tail).toBeNull();
		});

		it('should remove the tail node from a list with multiple nodes', () => {
			list.push('Hello');
			list.push('World');
			const removedNode = list.pop();
			expect(list.length).toBe(1);
			expect(removedNode.value).toBe('World');
			expect(list.head.value).toBe('Hello');
			expect(list.tail.value).toBe('Hello');
		});

		it('should return undefined for an empty list', () => {
			const removedNode = list.pop();
			expect(removedNode).toBeUndefined();
		});
	});

	describe('shift', () => {
		it('should remove the head node from a list with one node', () => {
			list.push('Hello');
			const removedNode = list.shift();
			expect(list.length).toBe(0);
			expect(removedNode.value).toBe('Hello');
			expect(list.head).toBeNull();
			expect(list.tail).toBeNull();
		});

		it('should remove the head node from a list with multiple nodes', () => {
			list.push('Hello');
			list.push('World');
			const removedNode = list.shift();
			expect(list.length).toBe(1);
			expect(removedNode.value).toBe('Hello');
			expect(list.head.value).toBe('World');
			expect(list.tail.value).toBe('World');
		});

		it('should return undefined for an empty list', () => {
			const removedNode = list.shift();
			expect(removedNode).toBeUndefined();
		});
	});

	describe('unshift', () => {
		it('should add a new node to an empty list', () => {
			list.unshift('Hello');
			expect(list.length).toBe(1);
			expect(list.head.value).toBe('Hello');
			expect(list.tail.value).toBe('Hello');
		});

		it('should add a new node to the head of the list', () => {
			list.unshift('World');
			list.unshift('Hello');
			expect(list.length).toBe(2);
			expect(list.head.value).toBe('Hello');
			expect(list.tail.value).toBe('World');
		});
	});

	describe('get', () => {
		it('should return the node at the specified index', () => {
			list.push('Hello');
			list.push('World');
			list.push('!');
			expect(list.get(0).value).toBe('Hello');
			expect(list.get(1).value).toBe('World');
			expect(list.get(2).value).toBe('!');
		});

		it('should return null for an index out of bounds', () => {
			list.push('Hello');
			expect(list.get(1)).toBeNull();
			expect(list.get(-1)).toBeNull();
		});

		it('should return the head node value for index 0 in a list with one node', () => {
			list.push('Hello');
			expect(list.get(0).value).toBe('Hello');
		});

		it('should return the tail node value for index length - 1 in a list with multiple nodes', () => {
			list.push('Hello');
			list.push('World');
			list.push('!');
			expect(list.get(list.length - 1).value).toBe('!');
		});

		it('should return null for index less than 0', () => {
			list.push('Hello');
			expect(list.get(-1)).toBeNull();
			expect(list.get(-10)).toBeNull();
		});

		it('should return null for index greater than or equal to the list length', () => {
			list.push('Hello');
			list.push('World');
			expect(list.get(2)).toBeNull();
			expect(list.get(10)).toBeNull();
		});

		it('should return the node value at the specified index', () => {
			list.push('Hello');
			list.push('World');
			list.push('!');
			list.push('Earth');
			list.push('Universe');
			list.push('Galaxy');
			expect(list.get(3).value).toBe('Earth');
		});

		it('should traverse the list backward when the index is greater than half of the list length', () => {
			list.push('Hello');
			list.push('World');
			list.push('!');
			list.push('Earth');
			list.push('Universe');
			list.push('Galaxy');
			list.push('Solar System');
			list.push('Milky Way');
			list.push('Singularity');
			list.push('Big Bang');

			expect(list.get(7).value).toBe('Milky Way');
		});
	});

	describe('set', () => {
		it('should modify the node value at the specified index', () => {
			list.push('Hello');
			list.push('World');
			list.push('!');
			expect(list.set(1, 'Earth')).toBe(true);
			expect(list.get(1).value).toBe('Earth');
		});

		it('should throw an error for an index out of bounds', () => {
			list.push('Hello');
			expect(() => list.set(1, 'Earth')).toThrow('Index out of bounds: 1');
		});
	});

	describe('insert', () => {
		it('should insert a new node at the specified index', () => {
			list.push('Hello');
			list.push('World');
			list.insert(1, 'Earth');
			expect(list.length).toBe(3);
			expect(list.get(0).value).toBe('Hello');
			expect(list.get(1).value).toBe('Earth');
			expect(list.get(2).value).toBe('World');
		});

		it('should insert a new node at the beginning of the list', () => {
			list.push('World');
			list.insert(0, 'Hello');
			expect(list.length).toBe(2);
			expect(list.get(0).value).toBe('Hello');
			expect(list.get(1).value).toBe('World');
		});

		it('should insert a new node at the end of the list', () => {
			list.push('Hello');
			list.insert(1, 'World');
			expect(list.length).toBe(2);
			expect(list.get(0).value).toBe('Hello');
			expect(list.get(1).value).toBe('World');
		});

		it('should return false for an index out of bounds', () => {
			list.push('Hello');
			expect(list.insert(2, 'World')).toBe(false);
		});
	});
});