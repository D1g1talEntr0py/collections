import Node from '../src/node';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('Node', () => {
	let node;

	beforeEach(() => {
		node = new Node(10);
	});

	afterEach(() => {
		node = null;
	});

	it('should create a new node with the given value', () => {
		expect(node.value).toBe(10);
		expect(node.next).toBeNull();
		expect(node.previous).toBeNull();
	});

	it('should set and get the value of the node', () => {
		node.value = 20;
		expect(node.value).toBe(20);
	});

	it('should set and get the next node', () => {
		const nextNode = new Node(30);
		node.next = nextNode;
		expect(node.next).toBe(nextNode);
	});

	it('should set and get the previous node', () => {
		const previousNode = new Node(40);
		node.previous = previousNode;
		expect(node.previous).toBe(previousNode);
	});

	it('should return "Node" as the default description', () => {
		expect(node[Symbol.toStringTag]).toBe('Node');
	});
});