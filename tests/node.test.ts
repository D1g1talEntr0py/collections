import { Node } from '../src/node';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Node', () => {
	let node: Node<number>;

	beforeEach(() => {
		node = new Node({ value: 10 }); // Assuming the Node constructor takes a single value argument for simplicity
	});

	it('should properly initialize a node', () => {
		// Test the critical aspects of initialization
		expect(node.value).toBe(10);
		// Assuming next and previous are important properties to check at initialization
		expect(node.next).toBeNull();
		expect(node.previous).toBeNull();
	});

	it('should allow updating and retrieving the value', () => {
		node.value = 20;
		expect(node.value).toBe(20);
	});

	it('should link nodes correctly', () => {
		const nextNode = new Node({ value: 30 });
		const previousNode = new Node({ value: 40 });

		node.next = nextNode;
		node.previous = previousNode;

		// Check if the linking is correct without asserting on each property
		expect(node.next).toEqual(nextNode);
		expect(node.previous).toEqual(previousNode);
	});

	it('should handle unlink operation correctly', () => {
		const nextNode = new Node({ value: 30 });
		node.next = nextNode;
		nextNode.previous = node;

		node.unlink();

		// Assuming unlink affects the node's next and previous properties
		expect(node.next).toBeNull();
		expect(node.previous).toBeNull();
		// Optionally, check if the linked nodes are also updated
		expect(nextNode.previous).toBeNull();
	});

	let node1: Node<string>;
	let node2: Node<string>;
	let node3: Node<string>;

	beforeEach(() => {
		node1 = new Node({ value: 'Node 1' });
		node2 = new Node({ value: 'Node 2' });
		node3 = new Node({ value: 'Node 3' });

		node1.next = node2;
		node2.previous = node1;
		node2.next = node3;
		node3.previous = node2;
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
		const circularNode1 = new Node({ value: 'Circular Node 1' });
		const circularNode2 = new Node({ value: 'Circular Node 2' });

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

	it('should have the correct Symbol.toStringTag', () => {
		expect(node[Symbol.toStringTag]).toBe('Node');
	});
});