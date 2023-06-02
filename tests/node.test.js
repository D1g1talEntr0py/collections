import Node from '../src/node';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('Node', () => {
	let node;

	beforeEach(() => {
		node = new Node({ value: 10});
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

	describe('unlink', () => {
		let node1;
		let node2;
		let node3;

		beforeEach(() => {
			node1 = new Node({ value: 'Node 1' });
			node2 = new Node({ value: 'Node 2' });
			node3 = new Node({ value: 'Node 3' });

			node1.next = node2;
			node2.previous = node1;
			node2.next = node3;
			node3.previous = node2;
		});

		afterEach(() => {
			node1 = null;
			node2 = null;
			node3 = null;
		});

		it('should unlink the node from its previous and next nodes', () => {
			node2.unlink();

			expect(node2.previous).toBeNull();
			expect(node2.next).toBeNull();

			expect(node1.next).toBe(node3);
			expect(node3.previous).toBe(node1);
		});

		it('should update the previous and next nodes correctly when unlinking the first node', () => {
			node1.unlink();

			expect(node1.previous).toBeNull();
			expect(node1.next).toBeNull();

			expect(node2.previous).toBeNull();
			expect(node2.next).toBe(node3);
			expect(node3.previous).toBe(node2);
		});

		it('should update the previous and next nodes correctly when unlinking the last node', () => {
			node3.unlink();

			expect(node3.previous).toBeNull();
			expect(node3.next).toBeNull();

			expect(node2.next).toBeNull();
			expect(node2.previous).toBe(node1);
			expect(node1.next).toBe(node2);
		});

		it('should handle unlinking a node that is not connected to any other nodes', () => {
			const isolatedNode = new Node({ value: 'Isolated Node' });
			isolatedNode.unlink();

			expect(isolatedNode.previous).toBeNull();
			expect(isolatedNode.next).toBeNull();
		});

		it('should handle unlinking a node that has circular references', () => {
			const circularNode1 = new Node();
			const circularNode2 = new Node();

			circularNode1.next = circularNode2;
			circularNode2.previous = circularNode1;

			circularNode1.unlink();

			expect(circularNode1.previous).toBeNull();
			expect(circularNode1.next).toBeNull();
			expect(circularNode2.previous).toBeNull();
			expect(circularNode2.next).toBeNull();
		});

		it('should clear the next and previous references if they still reference this node', () => {
			const node1 = new Node({ value: 'Node 1' });
			const node2 = new Node({ value: 'Node 2' });

			node1.next = node2;
			node2.previous = node1;

			node1.unlink();

			expect(node1.previous).toBeNull();
			expect(node1.next).toBeNull();

			expect(node2.previous).toBeNull();
			expect(node2.next).toBeNull();
		});

		it('should clear the next and previous references if they still reference this node', () => {
			const node1 = new Node({ value: 'Node 1' });
			const node2 = new Node({ value: 'Node 2' });
			const node3 = new Node({ value: 'Node 3' });

			node1.next = node2;
			node2.previous = node1;
			node2.next = node3;
			node3.previous = node2;

			node2.unlink();

			expect(node2.previous).toBeNull();
			expect(node2.next).toBeNull();
			expect(node1.next).toBe(node3);
			expect(node3.previous).toBe(node1);
		});

	});

});