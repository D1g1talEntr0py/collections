import { KeyedNode } from '../src/keyed-node';
import { describe, it, expect, beforeEach } from 'vitest';

describe('KeyedNode', () => {
	let node: KeyedNode<string, number>;

	beforeEach(() => {
		node = new KeyedNode<string, number>({ key: 'apples', value: 10 });
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
		const nextNode = new KeyedNode<string, number>({ key: 'bananas', value: 30 });
		node.next = nextNode;
		expect(node.next).toBe(nextNode);
	});

	it('should set and get the previous node', () => {
		const previousNode = new KeyedNode<string, number>({ key: 'cherries', value: 40 });
		node.previous = previousNode;
		expect(node.previous).toBe(previousNode);
	});

	it('should return "KeyedNode" as the default description', () => {
		expect(node[Symbol.toStringTag]).toBe('KeyedNode');
	});

	describe('key', () => {
		it('should set and get the key', () => {
			node.key = 'oranges';
			expect(node.key).toBe('oranges');
		});
	});

	describe('unlink', () => {
		let node1: KeyedNode<string, number>;
		let node2: KeyedNode<string, number>;

		beforeEach(() => {
			node1 = new KeyedNode<string, number>({ key: 'node1', value: 100 });
			node2 = new KeyedNode<string, number>({ key: 'node2', value: 200 });
			node1.next = node2;
			node2.previous = node1;
		});

		it('should correctly unlink the next node', () => {
			node1.unlink();
			expect(node1.next).toBeNull();
			expect(node2.previous).toBeNull();
		});

		it('should correctly unlink the previous node', () => {
			node2.unlink();
			expect(node2.previous).toBeNull();
			expect(node1.next).toBeNull();
		});
	});
});