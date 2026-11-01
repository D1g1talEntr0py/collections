type LinkedNode<N> = { next: N | null };

/** Gives a node iterator live access to its collection's head node and clear generation. */
export type NodeSource<N> = { head(): N | null, generation(): number };

const removedNodes = new WeakMap<object, object | null>();

/**
 * Marks a linked node as removed and records its predecessor for parked iterators.
 * @param node The node to mark.
 * @param predecessor The node that preceded it before removal.
 */
export const markNodeRemoved: (node: object, predecessor: object | null) => void = removedNodes.set.bind(removedNodes);

/**
 * Checks whether a linked node has been removed.
 * @param node The node to inspect.
 * @returns True if the node has been removed.
 */
export function isNodeRemoved(node: object): boolean {
	return removedNodes.has(node);
}

/**
 * Gets the predecessor recorded when a linked node was removed.
 * @param node The removed node.
 * @returns The recorded predecessor, or null when the node had none or was not removed.
 * @template N The linked node type.
 */
export function getRemovedPredecessor<N extends object>(node: N): N | null {
	return (removedNodes.get(node) as N | null | undefined) ?? null;
}

/**
 * Finds the nearest live node after a removed iterator position.
 * @param node The removed node at the iterator position, which has no next node.
 * @param source The collection's live head accessor.
 * @returns The next node reachable from the nearest live predecessor.
 * @template N The linked node type.
 */
function getNodeAfterRemoved<N extends LinkedNode<N>>(node: N, source: NodeSource<N>) {
	let predecessor = removedNodes.get(node) as N | null | undefined;

	while (predecessor !== null && predecessor !== undefined && removedNodes.has(predecessor)) {
		predecessor = removedNodes.get(predecessor) as N | null | undefined;
	}

	return predecessor !== null && predecessor !== undefined ? predecessor.next : source.head();
}

/**
 * A mutation-tolerant iterator over a linked node chain.
 * State lives in private fields and behavior on the shared prototype, so creating an iterator allocates a single object.
 * @template N The linked node type.
 * @template R The projected iterator value type.
 */
class NodeIterator<N extends LinkedNode<N>, R> extends Iterator<R, undefined, unknown> {
	#cursor: N | null;
	#generation: number;
	#lastNode: N | null = null;
	#done = false;
	readonly #source: NodeSource<N>;
	readonly #project: (node: N) => R;

	/**
	 * Creates an iterator positioned at the collection's current head.
	 * @param source The collection's live head and generation accessors.
	 * @param project Projects a node into an iterator value.
	 */
	constructor(source: NodeSource<N>, project: (node: N) => R) {
		super();
		this.#source = source;
		this.#project = project;
		this.#cursor = source.head();
		this.#generation = source.generation();
	}

	/** @returns The next projected node value, if one remains. */
	override next(): IteratorResult<R, undefined> {
		if (this.#done) { return { done: true, value: undefined } }

		const source = this.#source;
		const generation = source.generation();

		if (generation !== this.#generation) {
			this.#generation = generation;
			this.#cursor = source.head();
			this.#lastNode = null;
		}

		let lastNode = this.#lastNode;
		let node = lastNode === null ? this.#cursor ?? source.head() : lastNode.next;
		let checkedRemovedTail = false;

		while (true) {
			while (node !== null) {
				this.#cursor = null;
				lastNode = node;

				if (!removedNodes.has(node)) {
					this.#lastNode = node;

					return { done: false, value: this.#project(node) };
				}

				node = node.next;
			}

			if (checkedRemovedTail || lastNode === null || !removedNodes.has(lastNode)) { break }

			node = getNodeAfterRemoved(lastNode, source);
			checkedRemovedTail = true;
		}

		this.#lastNode = lastNode;
		this.#done = true;

		return { done: true, value: undefined };
	}

	/** @returns A completed iterator result. */
	override return(): IteratorResult<R, undefined> {
		this.#done = true;

		return { done: true, value: undefined };
	}

	/**
	 * Closes this iterator and throws an error.
	 * @param error The error to throw.
	 */
	throw(error?: unknown): never {
		this.#done = true;
		throw error;
	}
}

/**
 * Creates a mutation-tolerant iterator over a linked node chain, starting at the source's current head.
 * @param source The collection's live head and generation accessors.
 * @param project Projects a node into an iterator value.
 * @returns An iterator over the projected node values.
 * @template N The linked node type.
 * @template R The projected iterator value type.
 */
export function createNodeIterator<N extends LinkedNode<N>, R>(source: NodeSource<N>, project: (node: N) => R): IteratorObject<R, undefined, unknown> {
	return new NodeIterator(source, project);
}