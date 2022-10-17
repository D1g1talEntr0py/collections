import Node from './node.js';

export default class Stack {
	#first;
	#last;
	#size;

	// The stack has three properties, the first node, the last node and the stack size
	constructor() {
		this.#first = null;
		this.#last = null;
		this.#size = 0;
	}

	// The push method receives a value and adds it to the "top" of the stack
	push(value) {
		const node = new Node(value);

		if (this.#first) {
			const next = this.#first;
			this.#first = node;
			this.#first.next = next;
		} else {
			this.#first = node;
			this.#last = node;
		}

		return ++this.#size;
	}

	// The pop method eliminates the element at the "top" of the stack and returns its value
	pop() {
		if (!this.#first) return null;

		const temp = this.#first;
		if (this.#first === this.#last) {
			this.#last = null;
		}

		this.#first = this.#first.next;
		this.#size--;

		return temp.value;
	}
}