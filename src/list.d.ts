/**
 *
 * @template E
 * @typedef {Iterable<E>} List<E>
 */
/**
 * @template E
 * @type {List<E>}
 */
export default class List<E> {
    /**
     *
     * @param {Iterable<E>} iterable
     * @param {function(E, number?)} mapper
     * @param {*} context
     * @returns {List<E>}
     */
    static from(iterable: Iterable<E>, mapper: (arg0: E, arg1: number | null) => any, context: any): List<E>;
    static withSize(size: any): any;
    /**
     *
     * @param {Iterable<E>} [iterable]
     */
    constructor(iterable?: Iterable<E>);
    /**
     *
     * @param {E} element
     * @returns {List<E>} The updated list
     */
    add(element: E): List<E>;
    /**
     *
     * @param {Iterable<E>} iterable
     * @returns {List<E>} The updated list
     */
    addAll(iterable: Iterable<E>): List<E>;
    clear(): void;
    /**
     *
     * @param {E} elements
     * @returns {List<E>}
     */
    concat(elements: E): List<E>;
    /**
     *
     * @param {function(E, number?, List<E>?): boolean} predicate
     * @returns {boolean}
     */
    every(predicate: (arg0: E, arg1: number | null, arg2: List<E> | null) => boolean): boolean;
    /**
     *
     * @param {function(E, number?, List<E>?): boolean} predicate
     * @returns {boolean}
     */
    some(predicate: (arg0: E, arg1: number | null, arg2: List<E> | null) => boolean): boolean;
    /**
     *
     * @param {function(E, number?, List<E>?): boolean} predicate
     * @returns {List<E>}
     */
    filter(predicate: (arg0: E, arg1: number | null, arg2: List<E> | null) => boolean): List<E>;
    /**
     *
     * @param {function(E, number?, List<E>?): boolean} predicate
     * @param {*} [context] Optional object to use as this when calling the predicate function
     * @returns {E}
     */
    find(predicate: (arg0: E, arg1: number | null, arg2: List<E> | null) => boolean, context?: any): E;
    /**
     *
     * @param {function(E, number?, List<E>?): boolean} predicate
     * @param {*} [context] Optional object to use as this when calling the predicate function
     * @returns {number}
     */
    findIndex(predicate: (arg0: E, arg1: number | null, arg2: List<E> | null) => boolean, context?: any): number;
    /**
     *
     * @param {function(E, number?, List<E>?)} mapper
     * @returns {List<E>}
     */
    map(mapper: (arg0: E, arg1: number | null, arg2: List<E> | null) => any): List<E>;
    /**
     * Executes a user-supplied "reducer" callback function on each element of the list, in order,
     * passing in the return value from the calculation on the preceding element. The final result
     * of running the reducer across all elements of the array is a single value.
     *
     * @param {function(E, E, *)} reducer
     * @param {*} [initialValue]
     * @returns {*}
     */
    reduce(reducer: (arg0: E, arg1: E, arg2: any) => any, initialValue?: any): any;
    /**
     * Sorts the elements of a list in place and returns the reference to the same list, now sorted.
     * The default sort order is ascending, built upon converting the elements into strings,
     * then comparing their sequences of UTF-16 code units values.
     *
     * The sort() method preserves empty slots. If the source list is sparse, the empty slots are moved to the end of the list, and always come after all the undefined values.
     *
     * @example
     * // returns
     * new List([50, 3, 20, 33, 9, 1]).sort();
     * @param {function(E, E): number} [comparator] A function that defines the sort order. If omitted, the list elements are converted to strings, then sorted according to each character's Unicode code point value.
     * @returns {List<E>} The reference to the original list, now sorted. Note that the list is sorted in place, and no copy is made.
     */
    sort(comparator?: (arg0: E, arg1: E) => number): List<E>;
    /**
     *
     * @param {function(E, number?, List<E>?): boolean} consumer
     */
    forEach(consumer: (arg0: E, arg1: number | null, arg2: List<E> | null) => boolean): void;
    /**
     *
     * @param {E} element
     * @param {number} [fromIndex]
     * @returns {E}
     */
    get(element: E, fromIndex?: number): E;
    /**
     *
     * @param {E} element
     * @returns {boolean}
     */
    has(element: E): boolean;
    /**
     * Inserts the entry in a sorted list in the correct position.
     * The list must be sorted in ascending order to work.
     *
     * @param {number} index
     * @param {E} element The entry to add to the list.
     */
    insert(index: number, element: E): void;
    /**
     * Removes the element associated to the value and returns a boolean asserting whether an element was successfully removed or not.
     *
     * @param {E} element The element to remove
     * @returns {boolean} true if element was already in {@link List}; otherwise false.
     */
    delete(element: E): boolean;
    /**
     * Removes the element at the specified index and returns a boolean asserting whether an element was successfully removed or not.
     *
     * @param {number} index The element to remove
     * @returns {boolean} true if element was already in {@link List}; otherwise false.
     */
    deleteAt(index: number): boolean;
    keys(): IterableIterator<number>;
    /**
     *
     * @returns {IterableIterator<E>}
     */
    values(): IterableIterator<E>;
    /**
     *
     * @returns {IterableIterator<number, E>}
     */
    entries(): IterableIterator<number, E>;
    /**
     * Checks to see if the list is empty
     *
     * @returns {boolean} true if the list is empty, false otherwise.
     */
    isEmpty(): boolean;
    toArray(): E[];
    toString(): string;
    valueOf(): Object;
    get size(): number;
    [Symbol.iterator](): IterableIterator<E>;
    get [Symbol.toStringTag](): string;
    #private;
}
export type List<E> = Iterable<E>;
