import { Node } from './node';

type LinkedListType = (typeof LinkedList.Type)[keyof typeof LinkedList.Type];
type LinkedIterator<E> = IterableIterator<E> & {
	return: () => IteratorResult<E, void>;
	throw: (error: unknown) => never;
};

/**
 * Creates an iterator over a node chain's values.
 * @param first The first node to visit.
 * @returns An iterator over node values.
 */
const createValueIterator = <E>(first: Node<E> | null): LinkedIterator<E> => {
	let node = first;

	return {
		/** @returns This iterator. */
		[Symbol.iterator]() { return this },
		/** @returns The next iteration result. */
		next() {
			if (node === null) { return { done: true, value: undefined } }

			const current = node;
			node = current.next;

			return { done: false, value: current.value };
		},
		/** @returns A completed iteration result. */
		return() {
			node = null;

			return { done: true, value: undefined };
		},
		/**
		 * Stops iteration and throws the provided error.
		 * @param error The error to throw.
		 */
		throw(error: unknown): never {
			node = null;
			throw error;
		}
	};
};

/** JavaScript implementation of a LinkedList */
export class LinkedList<E> {
	#head: Node<E> | null = null;
	#tail: Node<E> | null = null;
	#size: number = 0;
	#doublyLinked: boolean;

	static Type = { Singly: 'singly', Doubly: 'doubly' } as const;

	/**
	 * Creates a new LinkedList.
	 * @param type The type of the list ('singly' or 'doubly' linked).
	 */
	constructor(type: LinkedListType = LinkedList.Type.Singly) {
		this.#doublyLinked = type == LinkedList.Type.Doubly;
	}

	/**
	 * Adds an element to the start of the list.
	 * @param value The element to add.
	 */
	addFirst(value: E): void {
		const node = new Node({ next: this.#head, value });
		if (this.#doublyLinked && this.#head) { this.#head.previous = node }

		this.#head = node;
		if (!this.#tail) { this.#tail = node }

		this.#size++;
	}

	/**
	 * Adds an element to the end of the list.
	 * @param value The element to add.
	 */
	addLast(value: E): void {
		const node = new Node({ value, previous: this.#doublyLinked ? this.#tail : null });
		if (this.#tail) { this.#tail.next = node }

		this.#tail = node;
		if (!this.#head) { this.#head = node }

		this.#size++;
	}

	/**
	 * Gets the first node in the list.
	 * @returns The first node in the list, or null if the list is empty.
	 */
	getFirst(): E | null {
		return this.#head?.value ?? null;
	}

	/**
	 * Gets the last node in the list.
	 * @returns The last node in the list, or null if the list is empty.
	 */
	getLast(): E | null {
		return this.#tail?.value ?? null;
	}

	/**
	 * Removes the first element from the list.
	 * @returns The removed element, or null if the list was empty.
	 */
	removeFirst(): E | null {
		return this.removeNode(this.#head);
	}

	/**
	 * Removes the last element from the list.
	 * @returns The removed element, or null if the list was empty.
	 */
	removeLast(): E | null {
		return this.removeNode(this.#tail);
	}

	/**
	 * Removes the first occurrence of an element from the list.
	 * @param value The element to remove.
	 * @returns The removed element, or null if the element was not found.
	 */
	remove(value: E): E | null {
		let previous: Node<E> | null = null;
		for (let node = this.#head; node; previous = node, node = node.next) {
			if (node.value === value) { return this.removeNode(node, previous) }
		}

		return null;
	}

	/**
	 * Gets the value of the node at the specified index.
	 * @param index The index of the element to remove.
	 * @returns The removed element, or null if the index was out of bounds.
	 */
	get(index: number): E | null {
		return this.getNodeAt(index)?.value ?? null;
	}

	/**
	 * Sets the value of the node at the specified index.
	 * Replaces the value of the node at the specified index with the specified value.
	 * @param index The index of the element to set.
	 * @param value The new value of the element.
	 * @throws {RangeError} If the index is out of bounds.
	 */
	set(index: number, value: E): void {
		const node = this.getNodeAt(index);
		if (!node) { throw new RangeError('Index out of bounds') }

		node.value = value;
	}

	/**
	 * Inserts an element at the specified index.
	 * Shifts the element currently at that position (if any) and any subsequent elements to the right (adds one to their indices).
	 * If the index is equal to the size of the list, the element is added to the end of the list.
	 * If the index is 0, the element is added to the start of the list.
	 * Otherwise, the element is inserted at the specified index.
	 * @param index The index at which to insert the element.
	 * @param value The element to insert.
	 * @throws {RangeError} If the index is out of bounds.
	 */
	insert(index: number, value: E): void {
		if (index < 0 || index > this.#size) { throw new RangeError('Index out of bounds') }

		if (index === 0) {
			this.addFirst(value);
		} else if (index === this.#size) {
			this.addLast(value);
		} else {
			const prevNode = this.getNodeAt(index - 1)!;
			const nextNode = prevNode.next;
			const node = new Node({ value, previous: this.#doublyLinked ? prevNode : null, next: nextNode });
			prevNode.next = node;
			if (this.#doublyLinked) { nextNode!.previous = node }
			this.#size++;
		}
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
	 */
	reverse(): void {
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
	}

	/**
	 * Removes all elements from the list.
	 * The list will be empty after this call returns.
	 * This method runs in linear time.
	 */
	clear(): void {
		let node = this.#head;
		while (node) {
			const next = node.next;
			node.previous = node.next = null;
			node = next;
		}

		this.#head = this.#tail = null;
		this.#size = 0;
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
	 * Iterates over the list and calls the specified consumer function for each element.
	 * The consumer function is called with three arguments: the value of the element, the index of the element, and the list itself.
	 * @param consumer The consumer function to call for each element.
	 * @param [context] The context to call the consumer function in.
	 */
	forEach(consumer: (arg0: E, arg1: number, arg2: LinkedList<E>) => void, context: object = this): void {
		for (let index = 0, node = this.#head; node; node = node.next, index++) {
			consumer.call(context, node.value, index, this);
		}
	}

	/**
	 * Returns an iterator over the values in the list.
	 * The values are returned in order from the first to the last element.
	 * This method runs in constant time.
	 * @returns An iterator over the values in the list.
	 */
	values(): LinkedIterator<E> {
		return createValueIterator(this.#head);
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
		return Array.from(this.values());
	}

	/**
	 * Returns an iterator over the values in the list.
	 * The values are returned in order from the first to the last element.
	 * This method runs in constant time.
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
	 * Gets the node at the specified index.
	 * If the index is out of bounds, null is returned.
	 * @param index The index of the node to get.
	 * @returns The node at the specified index, or null if the index is out of bounds.
	 */
	private getNodeAt(index: number) {
		if (index < 0 || index >= this.#size) { return null }

		let node: Node<E> | null;
		if (this.#doublyLinked && index >= this.#size / 2) {
			node = this.#tail;
			for (let i = this.#size - 1; i > index; i--) { node = node!.previous }
		} else {
			node = this.#head;
			for (let i = 0; i < index; i++) { node = node!.next }
		}

		return node;
	}

	/**
	 * Removes a node from the list.
	 * @param node The node to remove.
	 * @param previous The node preceding the node to remove, when already known.
	 * @returns The value of the removed node.
	 */
	private removeNode(node: Node<E> | null, previous: Node<E> | null = null) {
		if (node === null) { return null }

		const value = node.value;

		if (node === this.#head && node === this.#tail) {
			this.#head = this.#tail = null;
		} else if (node === this.#head) {
			this.#head = node.next;
			if (this.#doublyLinked) { this.#head!.previous = null }
		} else if (this.#doublyLinked) {
			if (node === this.#tail) { this.#tail = node.previous }
			node.unlink();
		} else {
			if (previous === null) {
				previous = this.#head;
				while (previous?.next !== node) { previous = previous!.next }
			}

			previous.next = node.next;
			if (node === this.#tail) { this.#tail = previous }
		}

		node.previous = node.next = null;
		this.#size--;
		if (this.#size === 1) { this.#tail = this.#head }

		return value;
	}
}