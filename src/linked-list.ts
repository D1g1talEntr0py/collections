import { Node } from './node';
import { createNodeIterator, getRemovedPredecessor, isNodeRemoved, markNodeRemoved, type NodeSource } from './internal/node-iterator';

type LinkedListType = (typeof LinkedList.Type)[keyof typeof LinkedList.Type];
type LinkedIterator<E> = IteratorObject<E, undefined, unknown>;

/**
 * Projects a node to its value.
 * @param node The node to project.
 * @returns The node's value.
 */
function nodeValue<E>(node: Node<E>): E {
	return node.value;
}

/** JavaScript implementation of a LinkedList */
export class LinkedList<E> {
	#head: Node<E> | null = null;
	#tail: Node<E> | null = null;
	#size: number = 0;
	#generation: number = 0;
	#doublyLinked: boolean;
	#source: NodeSource<Node<E>> | null = null;

	static Type = { Singly: 'singly', Doubly: 'doubly' } as const;

	/**
	 * Creates a new LinkedList from an optional iterable.
	 * @param iterable The initial values for the list.
	 * @param type The type of the list ('singly' or 'doubly' linked). Defaults to singly linked.
	 */
	constructor(iterable?: Iterable<E>, type: LinkedListType = LinkedList.Type.Singly) {
		this.#doublyLinked = type == LinkedList.Type.Doubly;

		if (iterable !== undefined) { this.addAllFrom(iterable) }
	}

	/**
	 * Creates a new LinkedList from an iterable.
	 * @param iterable The initial values for the list.
	 * @param type The type of the list ('singly' or 'doubly' linked). Defaults to singly linked.
	 * @returns A new LinkedList containing the iterable's values.
	 */
	static from<E>(iterable: Iterable<E>, type?: LinkedListType): LinkedList<E> {
		return new LinkedList(iterable, type);
	}

	/**
	 * Adds an element to the start of the list.
	 * @param value The element to add.
	 * @returns This list.
	 */
	addFirst(value: E): this {
		const node = new Node({ next: this.#head, value });

		if (this.#doublyLinked && this.#head) { this.#head.previous = node }

		this.#head = node;

		if (!this.#tail) { this.#tail = node }

		this.#size++;

		return this;
	}

	/**
	 * Adds an element to the end of the list.
	 * @param value The element to add.
	 * @returns This list.
	 */
	addLast(value: E): this {
		const node = new Node({ value, previous: this.#doublyLinked ? this.#tail : null });

		if (this.#tail) { this.#tail.next = node }

		this.#tail = node;

		if (!this.#head) { this.#head = node }

		this.#size++;

		return this;
	}

	/**
	 * Adds each provided value to the end of the list.
	 * @param values The values to add.
	 * @returns This list.
	 */
	addAll(...values: E[]): this {
		for (const value of values) { this.addLast(value) }

		return this;
	}

	/**
	 * Adds each value from an iterable to the end of the list.
	 * This method consumes the iterable incrementally and supports inputs larger than the call-site argument limit.
	 * @param values The values to add.
	 * @returns This list.
	 */
	addAllFrom(values: Iterable<E>): this {
		for (const value of values) { this.addLast(value) }

		return this;
	}

	/**
	 * Gets the first value in the list.
	 * @returns The first value in the list, or undefined if the list is empty.
	 */
	getFirst(): E | undefined {
		return this.#head === null ? undefined : this.#head.value;
	}

	/**
	 * Gets the last value in the list.
	 * @returns The last value in the list, or undefined if the list is empty.
	 */
	getLast(): E | undefined {
		return this.#tail === null ? undefined : this.#tail.value;
	}

	/**
	 * Gets the first value in the list without removing it.
	 * @returns The first value in the list, or undefined if the list is empty.
	 */
	peekFirst(): E | undefined {
		return this.getFirst();
	}

	/**
	 * Gets the last value in the list without removing it.
	 * @returns The last value in the list, or undefined if the list is empty.
	 */
	peekLast(): E | undefined {
		return this.getLast();
	}

	/**
	 * Removes the first element from the list.
	 * @returns The removed element, or undefined if the list was empty.
	 */
	removeFirst(): E | undefined {
		return this.#removeNode(this.#head);
	}

	/**
	 * Removes the last element from the list.
	 * @returns The removed element, or undefined if the list was empty.
	 */
	removeLast(): E | undefined {
		return this.#removeNode(this.#tail);
	}

	/**
	 * Removes the first occurrence of an element from the list.
	 * @param value The element to remove.
	 * @returns The removed element, or undefined if the element was not found.
	 */
	remove(value: E): E | undefined {
		let previous: Node<E> | null = null;

		for (let node = this.#head; node; previous = node, node = node.next) {
			if (node.value === value) { return this.#removeNode(node, previous) }
		}

		return undefined;
	}

	/**
	 * Gets the value of the node at the specified index.
	 * @param index The index of the element to get.
	 * @returns The value at the index, or undefined if the index is out of bounds.
	 */
	get(index: number): E | undefined {
		const node = this.#getNodeAt(index);
		return node === null ? undefined : node.value;
	}

	/**
	 * Sets the value of the node at the specified index.
	 * Replaces the value of the node at the specified index with the specified value.
	 * @param index The index of the element to set.
	 * @param value The new value of the element.
	 * @returns This list.
	 * @throws {RangeError} If the index is out of bounds.
	 */
	set(index: number, value: E): this {
		const node = this.#getNodeAt(index);

		if (!node) { throw new RangeError('Index out of bounds') }

		node.value = value;

		return this;
	}

	/**
	 * Inserts an element at the specified index.
	 * Shifts the element currently at that position (if any) and any subsequent elements to the right (adds one to their indices).
	 * If the index is equal to the size of the list, the element is added to the end of the list.
	 * If the index is 0, the element is added to the start of the list.
	 * Otherwise, the element is inserted at the specified index.
	 * @param index The index at which to insert the element.
	 * @param value The element to insert.
	 * @returns This list.
	 * @throws {RangeError} If the index is out of bounds.
	 */
	insert(index: number, value: E): this {
		if (index < 0 || index > this.#size) { throw new RangeError('Index out of bounds') }

		if (index === 0) {
			this.addFirst(value);
		} else if (index === this.#size) {
			this.addLast(value);
		} else {
			const prevNode = this.#getNodeAt(index - 1)!;
			const nextNode = prevNode.next;
			const node = new Node({ value, previous: this.#doublyLinked ? prevNode : null, next: nextNode });

			prevNode.next = node;

			if (this.#doublyLinked) { nextNode!.previous = node }

			this.#size++;
		}

		return this;
	}

	/**
	 * Checks if the list contains the specified element.
	 * @param value The element to check for.
	 * @returns True if the list contains the element, false otherwise.
	 */
	contains(value: E): boolean {
		for (let node = this.#head; node; node = node.next) {
			if (node.value === value) { return true }
		}

		return false;
	}

	/**
	 * Reverses the list.
	 * The first element becomes the last, and the last element becomes the first.
	 * This method runs in linear time.
	 * @returns This list.
	 */
	reverse(): this {
		let node = this.#head;
		let prev = null;

		while (node) {
			const next = node.next;

			node.next = prev;
			node.previous = this.#doublyLinked ? next : null;

			prev = node;
			node = next;
		}

		[ this.#head, this.#tail ] = [ this.#tail, this.#head ];

		return this;
	}

	/**
	 * Removes all elements from the list.
	 * The list will be empty after this call returns.
	 * This method runs in constant time.
	 * @returns This list.
	 */
	clear(): this {
		this.#head = this.#tail = null;
		this.#size = 0;
		this.#generation++;

		return this;
	}

	/**
	 * Checks if the list is empty.
	 * @returns True if the list is empty, false otherwise.
	 */
	isEmpty(): boolean {
		return this.#size === 0;
	}

	/**
	 * Gets the index of the value in the list.
	 * If the value is not found, -1 is returned.
	 * If the value is found multiple times, the index of the first occurrence is returned.
	 * This method runs in linear time.
	 * @param value The value to search for.
	 * @returns The index of the value in the list, or -1 if the value is not found.
	 */
	indexOf(value: E): number {
		for (let index = 0, node = this.#head; node; node = node.next, index++) {
			if (node.value === value) { return index }
		}

		return -1;
	}

	/**
	 * Gets the index of the last matching value in the list.
	 * If the value is not found, -1 is returned.
	 * This method runs in linear time.
	 * @param value The value to search for.
	 * @returns The last index of the value, or -1 if it is not found.
	 */
	lastIndexOf(value: E): number {
		let lastIndex = -1;
		for (let index = 0, node = this.#head; node; node = node.next, index++) {
			if (node.value === value) { lastIndex = index }
		}

		return lastIndex;
	}

	/**
	 * Finds the first value that satisfies the predicate.
	 * @param predicate The predicate to test each value.
	 * @param context The context to call the predicate in.
	 * @returns The first matching value, or undefined if none match.
	 */
	find(predicate: (value: E, index: number, list: LinkedList<E>) => unknown, context?: unknown): E | undefined {
		for (let index = 0, node = this.#head; node; node = node.next, index++) {
			if (predicate.call(context, node.value, index, this)) { return node.value }
		}

		return undefined;
	}

	/**
	 * Iterates over the list and calls the specified consumer function for each element.
	 * The consumer function is called with three arguments: the value of the element, the index of the element, and the list itself.
	 * @param consumer The consumer function to call for each element.
	 * @param context The context to call the consumer function in. Defaults to undefined.
	 */
	forEach(consumer: (arg0: E, arg1: number, arg2: LinkedList<E>) => void, context?: unknown): void {
		for (let index = 0, node = this.#head; node; node = node.next, index++) {
			consumer.call(context, node.value, index, this);
		}
	}

	/**
	 * Returns an iterator over values from the last to the first.
	 * Doubly linked lists traverse backward through their nodes; singly linked lists use an array snapshot.
	 * @returns An iterator over the values in reverse order.
	 */
	descendingValues(): LinkedIterator<E> {
		return this.#doublyLinked ? this.#descendingValues() : this.toArray().reverse().values();
	}

	/**
	 * Traverses a doubly linked list from tail to head.
	 * @returns An iterator over values in reverse order.
	 * @yields {E} The next value in reverse order.
	 */
	*#descendingValues(): Generator<E, undefined, unknown> {
		let node = this.#tail;
		let generation = this.#generation;

		while (true) {
			if (generation !== this.#generation) {
				generation = this.#generation;
				node = this.#tail;
			}

			while (node !== null && isNodeRemoved(node)) {
				node = getRemovedPredecessor(node);
			}

			if (node === null) { return undefined }

			const current = node;
			node = current.previous;
			yield current.value;
		}
	}

	/**
	 * Returns an iterator over the values in the list.
	 * The values are returned in order from the first to the last element.
	 * This method runs in constant time.
	 * @remarks Removing nodes during iteration skips them. After `clear()`, iteration resumes at the new head; once done, it stays done. Reordering nodes during iteration may skip or revisit values.
	 * @returns An iterator over the values in the list.
	 */
	values(): LinkedIterator<E> {
		return createNodeIterator(this.#nodeSource(), nodeValue<E>);
	}

	/**
	 * Gets the size of the list.
	 * @returns The size of the list.
	 */
	get size(): number {
		return this.#size;
	}

	/**
	 * Gets an array containing all the values in the list.
	 * The values are returned in order from the first to the last element.
	 * This method runs in linear time.
	 * The returned array is a shallow copy of the list.
	 * Modifying the array will not modify the list.
	 * @returns An array containing all the values in the list.
	 */
	toArray(): E[] {
		const values = new Array<E>(this.#size);

		for (let index = 0, node = this.#head; node !== null; node = node.next, index++) {
			values[index] = node.value;
		}

		return values;
	}

	/**
	 * Returns an iterator over the values in the list.
	 * The values are returned in order from the first to the last element.
	 * This method runs in constant time.
	 * @remarks Removing nodes during iteration skips them. After `clear()`, iteration resumes at the new head; once done, it stays done. Reordering nodes during iteration may skip or revisit values.
	 * The iterator exposes `next`, `return`, and `throw`, but does not provide list mutation methods.
	 * This method is called when the list is used in a for-of loop.
	 * @returns An iterator over the values in the list.
	 * @example
	 * ````js
	 * for (const value of list) {
	 * 	 console.log(value);
	 * }
	 * ````
	 */
	[Symbol.iterator](): LinkedIterator<E> {
		return this.values();
	}

	/**
	 * Returns a string description of the list.
	 * @returns A string description of the list.
	 */
	get [Symbol.toStringTag]() {
		return 'LinkedList';
	}

	/**
	 * Gets the live head and generation accessors shared by this list's iterators, creating them on first use.
	 * @returns The node source for this list.
	 */
	#nodeSource(): NodeSource<Node<E>> {
		return this.#source ??= {
			/** @returns The current head node. */
			head: () => this.#head,
			/** @returns The current clear generation. */
			generation: () => this.#generation
		};
	}

	/**
	 * Gets the node at the specified index.
	 * If the index is out of bounds, null is returned.
	 * @param index The index of the node to get.
	 * @returns The node at the specified index, or null if the index is out of bounds.
	 */
	#getNodeAt(index: number) {
		if (index < 0 || index >= this.#size) { return null }

		// The bounds check guarantees every traversed node exists.
		let node: Node<E>;
		if (this.#doublyLinked && index >= this.#size / 2) {
			node = this.#tail!;
			for (let i = this.#size - 1; i > index; i--) { node = node.previous! }
		} else {
			node = this.#head!;
			for (let i = 0; i < index; i++) { node = node.next! }
		}

		return node;
	}

	/**
	 * Removes a node from the list.
	 * @param node The node to remove.
	 * @param previous The node preceding the node to remove, when already known.
	 * @returns The value of the removed node.
	 */
	#removeNode(node: Node<E> | null, previous: Node<E> | null = null): E | undefined {
		if (node === null) { return undefined }

		const value = node.value;
		let removedPrevious = this.#doublyLinked ? node.previous : previous;

		if (node === this.#head && node === this.#tail) {
			this.#head = this.#tail = null;
		} else if (node === this.#head) {
			this.#head = node.next;

			if (this.#doublyLinked && this.#head !== null) { this.#head.previous = null }
		} else if (this.#doublyLinked) {
			if (node === this.#tail) { this.#tail = node.previous }

			// Only the head lacks a predecessor, and the head was handled above.
			node.previous!.next = node.next;

			if (node.next !== null) { node.next.previous = node.previous }

			node.previous = null;
		} else {
			if (previous === null) {
				// The node is not the head, so it is reachable from the head.
				previous = this.#head!;
				while (previous.next !== node) { previous = previous.next! }
			}

			removedPrevious = previous;
			previous.next = node.next;

			if (node === this.#tail) { this.#tail = previous }

			node.previous = null;
		}

		markNodeRemoved(node, removedPrevious);

		this.#size--;

		if (this.#size === 1) { this.#tail = this.#head }

		return value;
	}
}