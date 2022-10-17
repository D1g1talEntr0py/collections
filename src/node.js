export default class Node {
	#value;
	#next;

	constructor(value) {
		this.#value = value;
		this.#next = null;
	}

	get value() {
		return this.#value;
	}

	get next() {
		return this.#next;
	}

	get [Symbol.toStringTag]() {
		return 'Node';
	}
}