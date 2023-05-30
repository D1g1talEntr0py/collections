import Node from './node.js';

/**
 * A doubly linked list is a list that has nodes with a reference to the next and the previous node.
 * The list has three properties, the head, the tail and the list size.
 * The list has the following methods:
 * - push: Takes a value as parameter and assigns it as the tail of the list.
 * - pop: Removes the tail of the list.
 * - shift: Removes the head of the list.
 * - unshift: Takes a value as parameter and assigns it as the head of the list.
 * - get: Takes an index number as parameter and returns the value of the node at that index.
 * - set: Takes an index number and a value as parameters, and modifies the node value at the given index in the list.
 * - insert: Takes an index number and a value as parameters, and inserts the value at the given index in the list.
 * - length: Gets the length of the list.
 *
 * @module {DoublyLinkedList} doubly-linked-list
 */
class DoublyLinkedList {
	/** @type {Node} */
	#head;
	/** @type {Node} */
	#tail;
	/** @type {number} */
	#length;

	/**
	 * The list has three properties, the head, the tail and the list size
	 */
	constructor() {
		this.#head = null;
		this.#tail = null;
		this.#length = 0;
	}

	/**
	 * Gets the head of the list
	 *
	 * @returns {Node} The head of the list.
	 */
	get head() {
		return this.#head;
	}

	/**
	 * Gets the tail of the list
	 *
	 * @returns {Node} The tail of the list.
	 */
	get tail() {
		return this.#tail;
	}

	/**
	 * Gets the length of the list
	 *
	 * @returns {number} The length of the list.
	 */
	get length() {
		return this.#length;
	}

	/**
	 * Takes a value as parameter and assigns it as the tail of the list
	 *
	 * @param {*} value The value to be assigned as the tail of the list.
	 * @returns {DoublyLinkedList} The list with the new tail.
	 */
	push(value) {
		const node = new Node(value);
		if (this.#length === 0) {
			this.#head = node;
			this.#tail = node;
		} else {
			this.#tail.next = node;
			node.previous = this.#tail;
			this.#tail = node;
		}
		this.#length++;

		return this;
	}

	/**
	 * Removes the tail of the list
	 *
	 * @returns {Node} The removed node. Or `undefined` if the list is empty.
	 */
	pop() {
		if (!this.#head) return undefined;
		const tail = this.#tail;
		if (this.#length === 1) {
			this.#head = null;
			this.#tail = null;
		} else {
			this.#tail = tail.previous;
			this.#tail.next = null;
			this.#tail.previous = null; // Add this line
		}
		this.#length--;

		return tail;
	}

	/**
	 * Removes the head of the list
	 *
	 * @returns {Node} The removed node. Or `undefined` if the list is empty.
	 */
	shift() {
		if (this.#length === 0) return undefined;
		const head = this.#head;
		if (this.#length === 1) {
			this.#head = null;
			this.#tail = null;
		} else {
			this.#head = head.next;
			this.#head.previous = null;
			this.#head.next = null;
		}
		this.#length--;

		return head;
	}

	/**
	 * Takes a value as parameter and assigns it as the head of the list
	 *
	 * @param {*} val The value to be assigned as the head of the list.
	 * @returns {DoublyLinkedList} The list with the new head.
	 */
	unshift(val) {
		const node = new Node(val);
		if (this.#length === 0) {
			this.#head = node;
			this.#tail = node;
		} else {
			this.#head.previous = node;
			node.next = this.#head;
			this.#head = node;
		}
		this.#length++;

		return this;
	}

	/**
	 * Takes an index number as parameter and returns the value of the node at that index
	 *
	 * @param {number} index The index of the node to be returned.
	 * @returns {Node} The node at the given index. Or `null` if the index is out of bounds.
	 * @throws {Error} If the index is out of bounds.
	 * @example
	 * ````js
	 * const list = new DoublyLinkedList();
	 * list.push('Hello');
	 * list.push('World');
	 * list.push('!');
	 * list.get(1); // 'World'
	 * list.get(3); // null
	 * list.get(-1); // null
	 * ````
	 */
	get(index) {
		if (index < 0 || index >= this.#length) return null;

		let current;
		if (index <= this.#length / 2) {
			current = this.#head;
			for (let count = 0; count < index; count++) {
				current = current.next;
			}
		} else {
			current = this.#tail;
			for (let count = this.#length - 1; count > index; count--) {
				current = current.previous;
			}
		}

		return current;
	}


	/**
	 * Takes an index number and a value as parameters, and modifies the node value at the given index in the list
	 *
	 * @param {number} index The index of the node to be modified.
	 * @param {*} val The new value to be assigned to the node.
	 * @returns {boolean} `true` if the node was modified. `false` if the index is out of bounds.
	 * @throws {Error} If the index is out of bounds.
	 * @example
	 * ````js
	 * const list = new DoublyLinkedList();
	 * list.push('Hello');
	 * list.push('World');
	 * list.push('!');
	 * list.set(1, 'Earth'); // true
	 * list.set(3, 'Earth'); // Error: Index out of bounds: 3
	 * ````
	 */
	set(index, val) {
		const node = this.get(index);
		if (node !== null) {
			node.value = val;
			return true;
		}

		throw new Error(`Index out of bounds: ${index}`);
	}


	/**
	 * The insert method takes an index number and a value as parameters, and inserts the value at the given index in the list
	 *
	 * @param {number} index The index of the node to be inserted.
	 * @param {*} value The value to be assigned to the node.
	 * @returns {boolean} `true` if the node was inserted. `false` if the index is out of bounds.
	 * @throws {Error} If the index is out of bounds.
	 * @example
	 * ````js
	 * const list = new DoublyLinkedList();
	 * list.push('Hello');
	 * list.push('World');
	 * list.push('!');
	 * list.insert(1, 'Earth'); // true
	 * list.insert(3, 'Earth'); // Error: Index out of bounds: 3
	 * ````
	 */
	insert(index, value) {
		if (index < 0 || index > this.#length) return false;
		if (index === 0) return !!this.unshift(value);
		if (index === this.#length) return !!this.push(value);

		const node = new Node(value);
		const previousNode = this.get(index - 1);
		const nextNode = previousNode.next;

		node.previous = previousNode;
		node.next = nextNode;

		previousNode.next = node;
		nextNode.previous = node;

		this.#length++;

		return true;
	}
}

export default DoublyLinkedList;