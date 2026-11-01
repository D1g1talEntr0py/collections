/** A predicate used to test a collection value. */
export type Predicate<E> = (value: E, index: number, collection: ReadonlyCollection<E>) => boolean;

/** A mapper used to transform a collection value. */
export type Mapper<E, R> = (value: E, index: number, collection: ReadonlyCollection<E>) => R;

/** A comparator that returns a negative, zero, or positive number. */
export type Comparator<E> = (left: E, right: E) => number;

/** The common read-only surface shared by collection types. */
export interface ReadonlyCollection<E> extends Iterable<E> {
	/** The number of values in the collection. */
	readonly size: number;

	/** Whether the collection contains no values. */
	isEmpty(): boolean;

	/** Returns a shallow array copy of the collection's values. */
	toArray(): E[];
}
