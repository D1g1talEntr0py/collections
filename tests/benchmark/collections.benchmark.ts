import assert from 'node:assert/strict';
import { barplot, bench, do_not_optimize, group, run, summary } from 'mitata';
import {
	BiMap,
	Deque,
	LinkedList,
	LinkedMap,
	List,
	MultiMap,
	MultiSet,
	PriorityQueue,
	SetMultiMap,
	SortedMap,
	SortedSet
} from '../../dist/index.js';

const SIZE = 10_000;
const source = Array.from({ length: SIZE }, (_, index) => index);
const first = (value: number): boolean => value === 0;
const missing = (value: number): boolean => value === -1;

const singly = new LinkedList<number>();
const doubly = new LinkedList<number>(undefined, LinkedList.Type.Doubly);
const linkedMap = new LinkedMap<number, number>();
const nativeMap = new Map<number, number>();
const multiMap = new MultiMap<string, number>();
const setMultiMap = new SetMultiMap<string, number>();

for (const value of source) {
	singly.addLast(value);
	doubly.addLast(value);
	linkedMap.set(value, value);
	nativeMap.set(value, value);
	multiMap.add('values', value);
	setMultiMap.add('values', value);
}

const listValues = multiMap.get('values')!;
const setValues = setMultiMap.get('values')!;
const findInSet = (predicate: (value: number) => boolean): number | undefined => {
	for (const value of setValues) {
		if (predicate(value)) { return value }
	}

	return undefined;
};

const integrityProbe = new LinkedList<number>();
integrityProbe.addLast(1);
integrityProbe.addLast(2);
integrityProbe.addLast(3);
assert.equal(integrityProbe.removeLast(), 3);
assert.deepEqual(integrityProbe.toArray(), [1, 2]);
assert.equal(integrityProbe.getLast(), 2);
assert.equal(multiMap.find('values', first), 0);
assert.equal(setMultiMap.find('values', first), 0);
assert.deepEqual(Array.from(linkedMap.keys()), source);

group('LinkedList iteration', () => {
	summary(() => {
		bench('Array#iterator', () => {
			let total = 0;
			for (const value of source) { total += value }
			do_not_optimize(total);
		}).baseline(true);

		bench('LinkedList singly', () => {
			let total = 0;
			for (const value of singly as Iterable<number>) { total += value }
			do_not_optimize(total);
		});

		bench('LinkedList doubly', () => {
			let total = 0;
			for (const value of doubly as Iterable<number>) { total += value }
			do_not_optimize(total);
		});
	});
});

group('LinkedList indexed access', () => {
	const index = SIZE - 100;

	summary(() => {
		bench('singly#get near tail', () => do_not_optimize(singly.get(index))).baseline(true);
		bench('doubly#get near tail', () => do_not_optimize(doubly.get(index)));
	});
});

group('LinkedMap key iteration', () => {
	summary(() => {
		bench('Map#keys', () => {
			let total = 0;
			for (const key of nativeMap.keys()) { total += key }
			do_not_optimize(total);
		}).baseline(true);

		bench('LinkedMap#keys', () => {
			let total = 0;
			for (const key of linkedMap.keys()) { total += key! }
			do_not_optimize(total);
		});
	});
});

group('LinkedMap value iteration', () => {
	summary(() => {
		bench('Map#values', () => {
			let total = 0;
			for (const value of nativeMap.values()) { total += value }
			do_not_optimize(total);
		}).baseline(true);

		bench('LinkedMap#values', () => {
			let total = 0;
			for (const value of linkedMap.values()) { total += value! }
			do_not_optimize(total);
		});
	});
});

group('MultiMap find first', () => {
	summary(() => {
		bench('List#find first', () => do_not_optimize(listValues.find(first))).baseline(true);
		bench('MultiMap#find first', () => do_not_optimize(multiMap.find('values', first)));
	});
});

group('MultiMap find missing', () => {
	summary(() => {
		bench('List#find missing', () => do_not_optimize(listValues.find(missing)));
		bench('MultiMap#find missing', () => do_not_optimize(multiMap.find('values', missing)));
	});
});

group('SetMultiMap find first', () => {
	summary(() => {
		bench('Set direct find first', () => do_not_optimize(findInSet(first))).baseline(true);
		bench('SetMultiMap#find first', () => do_not_optimize(setMultiMap.find('values', first)));
	});
});

group('SetMultiMap find missing', () => {
	summary(() => {
		bench('Set direct find missing', () => do_not_optimize(findInSet(missing)));
		bench('SetMultiMap#find missing', () => do_not_optimize(setMultiMap.find('values', missing)));
	});
});

const LIST_SIZE = 1_000;
const LIST_MUTABLE_SIZE = 250;

const listSource: ReadonlyArray<number> = Array.from({ length: LIST_SIZE }, (_, index) => index);
const mutableListSource: number[] = listSource.slice(0, LIST_MUTABLE_SIZE);
const unsortedList: number[] = Array.from({ length: LIST_MUTABLE_SIZE }, () => (Math.random() * LIST_MUTABLE_SIZE) | 0);

const numeric = (a: number, b: number): number => a - b;

const array: number[] = [ ...listSource ];
const list: List<number> = new List(array);

const listMidpoint = LIST_SIZE >> 1;
const listMutableMidpoint = LIST_MUTABLE_SIZE >> 1;
const listPredicate = (element: number): boolean => element > listMidpoint;
const double = (element: number): number => element * 2;
const sum = (accumulator: number, element: number): number => accumulator + element;

const newArray = (): number[] => [ ...mutableListSource ];
const newList = (): List<number> => new List(mutableListSource);

group('List construction', () => {
	summary(() => {
		bench('Array (spread copy)', () => do_not_optimize([ ...mutableListSource ]));
		bench('List#constructor', () => do_not_optimize(new List(mutableListSource)));
	});
});

group('List add', () => {
	summary(() => {
		bench('Array#push', function* () {
			yield {
				[0]: newArray,
				bench(target: number[]) {
					target.push(-1);
					do_not_optimize(target);
				}
			};
		});

		bench('List#add', function* () {
			yield { [0]: newList, bench: (target: List<number>) => do_not_optimize(target.add(-1)) };
		});
	});
});

group('List addAll', () => {
	const batch: number[] = Array.from({ length: 100 }, (_, index) => -index);

	summary(() => {
		bench('Array#push(...batch)', function* () {
			yield {
				[0]: newArray,
				bench(target: number[]) {
					target.push(...batch);
					do_not_optimize(target);
				}
			};
		});

		bench('List#addAll', function* () {
			yield { [0]: newList, bench: (target: List<number>) => do_not_optimize(target.addAll(...batch)) };
		});
	});
});

group('List insert', () => {
	summary(() => {
		bench('Array#splice(insert)', function* () {
			yield {
				[0]: newArray,
				bench(target: number[]) {
					target.splice(listMutableMidpoint, 0, -1);
					do_not_optimize(target);
				}
			};
		});

		bench('List#insert', function* () {
			yield { [0]: newList, bench: (target: List<number>) => do_not_optimize(target.insert(listMutableMidpoint, -1)) };
		});
	});
});

group('List concat', () => {
	const otherArray: number[] = [ ...listSource ];
	const otherList: List<number> = new List(otherArray);

	summary(() => {
		bench('Array#concat', () => do_not_optimize(array.concat(otherArray)));
		bench('List#concat', () => do_not_optimize(list.concat(otherList)));
	});
});

group('List remove (by value)', () => {
	summary(() => {
		bench('Array#indexOf+splice', function* () {
			yield {
				[0]: newArray,
				bench(target: number[]) {
					const index = target.indexOf(listMutableMidpoint);
					do_not_optimize(index === -1 ? undefined : target.splice(index, 1)[0]);
				}
			};
		});

		bench('List#remove', function* () {
			yield { [0]: newList, bench: (target: List<number>) => do_not_optimize(target.remove(listMutableMidpoint)) };
		});
	});
});

group('List removeAt', () => {
	summary(() => {
		bench('Array#splice(delete)', function* () {
			yield {
				[0]: newArray,
				bench(target: number[]) {
					if (listMutableMidpoint < 0 || target.length <= listMutableMidpoint) { throw new RangeError(`Index ${listMutableMidpoint} out of bounds.`) }

					do_not_optimize(target.splice(listMutableMidpoint, 1)[0]);
				}
			};
		});

		bench('List#removeAt', function* () {
			yield { [0]: newList, bench: (target: List<number>) => do_not_optimize(target.removeAt(listMutableMidpoint)) };
		});
	});
});

group('List removeFirst', () => {
	summary(() => {
		bench('Array#shift', function* () {
			yield { [0]: newArray, bench: (target: number[]) => do_not_optimize(target.shift() ?? null) };
		});

		bench('List#removeFirst', function* () {
			yield { [0]: newList, bench: (target: List<number>) => do_not_optimize(target.removeFirst()) };
		});
	});
});

group('List removeLast', () => {
	summary(() => {
		bench('Array#pop', function* () {
			yield { [0]: newArray, bench: (target: number[]) => do_not_optimize(target.pop() ?? null) };
		});

		bench('List#removeLast', function* () {
			yield { [0]: newList, bench: (target: List<number>) => do_not_optimize(target.removeLast()) };
		});
	});
});

group('List clear', () => {
	summary(() => {
		bench('Array#length=0', function* () {
			yield {
				[0]: newArray,
				bench(target: number[]) {
					target.length = 0;
					do_not_optimize(target);
				}
			};
		});

		bench('List#clear', function* () {
			yield {
				[0]: newList,
				bench(target: List<number>) {
					target.clear();
					do_not_optimize(target);
				}
			};
		});
	});
});

group('List get', () => {
	summary(() => {
		bench('Array#[index]', () => do_not_optimize(array[listMidpoint]));
		bench('List#get', () => do_not_optimize(list.get(listMidpoint)));
	});
});

group('List set', () => {
	summary(() => {
		bench('Array#index assignment', function* () {
			yield {
				[0]: newArray,
				bench(target: number[]) {
					target[listMutableMidpoint] = -1;
					do_not_optimize(target);
				}
			};
		});

		bench('List#set', function* () {
			yield { [0]: newList, bench: (target: List<number>) => do_not_optimize(target.set(listMutableMidpoint, -1)) };
		});
	});
});

group('List size', () => {
	summary(() => {
		bench('Array#length', () => do_not_optimize(array.length));
		bench('List#size', () => do_not_optimize(list.size));
	});
});

group('List emptiness', () => {
	const emptyArray: number[] = [];
	const emptyList = new List<number>();

	summary(() => {
		bench('Array#length===0', () => do_not_optimize(emptyArray.length === 0));
		bench('List#isEmpty', () => do_not_optimize(emptyList.isEmpty()));
	});
});

group('List indexOf', () => {
	summary(() => {
		bench('Array#indexOf', () => do_not_optimize(array.indexOf(listMidpoint)));
		bench('List#indexOf', () => do_not_optimize(list.indexOf(listMidpoint)));
	});
});

group('List lastIndexOf', () => {
	summary(() => {
		bench('Array#lastIndexOf', () => do_not_optimize(array.lastIndexOf(listMidpoint)));
		bench('List#lastIndexOf', () => do_not_optimize(list.lastIndexOf(listMidpoint)));
	});
});

group('List contains', () => {
	summary(() => {
		bench('Array#includes', () => do_not_optimize(array.includes(listMidpoint)));
		bench('List#contains', () => do_not_optimize(list.contains(listMidpoint)));
	});
});

group('List find', () => {
	summary(() => {
		bench('Array#find', () => do_not_optimize(array.find(listPredicate)));
		bench('List#find', () => do_not_optimize(list.find(listPredicate)));
	});
});

group('List findIndex', () => {
	summary(() => {
		bench('Array#findIndex', () => do_not_optimize(array.findIndex(listPredicate)));
		bench('List#findIndex', () => do_not_optimize(list.findIndex(listPredicate)));
	});
});

group('List every', () => {
	const nonNegative = (element: number): boolean => element >= 0;

	summary(() => {
		bench('Array#every', () => do_not_optimize(array.every(nonNegative)));
		bench('List#every', () => do_not_optimize(list.every(nonNegative)));
	});
});

group('List some', () => {
	summary(() => {
		bench('Array#some', () => do_not_optimize(array.some(listPredicate)));
		bench('List#some', () => do_not_optimize(list.some(listPredicate)));
	});
});

group('List filter', () => {
	summary(() => {
		bench('Array#filter', () => do_not_optimize(array.filter(listPredicate)));
		bench('List#filter', () => do_not_optimize(list.filter(listPredicate)));
	});
});

group('List map', () => {
	summary(() => {
		bench('Array#map', () => do_not_optimize(array.map(double)));
		bench('List#map', () => do_not_optimize(list.map(double)));
	});
});

group('List reduce', () => {
	summary(() => {
		bench('Array#reduce', () => do_not_optimize(array.reduce(sum, 0)));
		bench('List#reduce', () => do_not_optimize(list.reduce(sum, 0)));
	});
});

group('List forEach', () => {
	summary(() => {
		bench('Array#forEach', () => {
			let total = 0;
			array.forEach((element) => { total += element });
			do_not_optimize(total);
		});

		bench('List#forEach', () => {
			let total = 0;
			list.forEach((element) => { total += element });
			do_not_optimize(total);
		});
	});
});

group('List reverse', () => {
	summary(() => {
		bench('Array#reverse', function* () {
			yield { [0]: newArray, bench: (target: number[]) => do_not_optimize(target.reverse()) };
		});

		bench('List#reverse', function* () {
			yield { [0]: newList, bench: (target: List<number>) => do_not_optimize(target.reverse()) };
		});
	});
});

group('List sort', () => {
	const newUnsortedArray = (): number[] => [ ...unsortedList ];
	const newUnsortedList = (): List<number> => new List(unsortedList);

	summary(() => {
		bench('Array#sort (numeric comparator)', function* () {
			yield { [0]: newUnsortedArray, bench: (target: number[]) => do_not_optimize(target.sort(numeric)) };
		});

		bench('List#sort (default comparator)', function* () {
			yield { [0]: newUnsortedList, bench: (target: List<number>) => do_not_optimize(target.sort()) };
		});

		bench('List#sort (explicit comparator)', function* () {
			yield { [0]: newUnsortedList, bench: (target: List<number>) => do_not_optimize(target.sort(numeric)) };
		});
	});
});

barplot(() => {
	group('List iteration', () => {
		summary(() => {
			bench('Array#for..of', () => {
				let total = 0;
				for (const element of array) { total += element }

				do_not_optimize(total);
			});

			bench('List#for..of', () => {
				let total = 0;
				for (const element of list) { total += element }

				do_not_optimize(total);
			});
		});
		summary(() => {
			bench('Array#keys', () => {
				let total = 0;
				for (const index of array.keys()) { total += index }

				do_not_optimize(total);
			});

			bench('List#keys', () => {
				let total = 0;
				for (const index of list.keys()) { total += index }

				do_not_optimize(total);
			});
		});
		summary(() => {
			bench('Array#values', () => {
				let total = 0;
				for (const element of array.values()) { total += element }

				do_not_optimize(total);
			});

			bench('List#values', () => {
				let total = 0;
				for (const element of list.values()) { total += element }

				do_not_optimize(total);
			});
		});
		summary(() => {
			bench('Array#entries', () => {
				let total = 0;
				for (const [ index, element ] of array.entries()) { total += index + element }

				do_not_optimize(total);
			});

			bench('List#entries', () => {
				let total = 0;
				for (const [ index, element ] of list.entries()) { total += index + element }

				do_not_optimize(total);
			});
		});
	});
});

group('List toArray', () => {
	summary(() => {
		bench('Array#spread', () => do_not_optimize([ ...array ]));
		bench('List#toArray', () => do_not_optimize(list.toArray()));
	});
});

group('List join', () => {
	summary(() => {
		bench('Array#join', () => do_not_optimize(array.join(',')));
		bench('List#join', () => do_not_optimize(list.join(',')));
	});
});

group('List toString', () => {
	summary(() => {
		bench('Array#toString', () => do_not_optimize(array.toString()));
		bench('List#toString', () => do_not_optimize(list.toString()));
	});
});

group('Deque front operations', () => {
	const smallSource = source.slice(0, 250);
	summary(() => {
		bench('Deque#pushFront/popFront', function* () {
			yield {
				bench() {
					const deque = new Deque<number>();
					for (const value of smallSource) { deque.pushFront(value) }
					for (let index = 0; index < smallSource.length; index++) { deque.popFront() }
					do_not_optimize(deque);
				}
			};
		});
		bench('Array#unshift/shift', function* () {
			yield {
				bench() {
					const values: number[] = [];
					for (const value of smallSource) { values.unshift(value) }
					for (let index = 0; index < smallSource.length; index++) { values.shift() }
					do_not_optimize(values);
				}
			};
		}).baseline(true);
	});
});

group('PriorityQueue construction', () => {
	const sortedValues = source.slice(0, 250).reverse();

	summary(() => {
		bench('PriorityQueue#from', () => do_not_optimize(PriorityQueue.from(sortedValues)));
	});
});

group('BiMap lookup', () => {
	const entries = source.slice(0, 250).map((value) => [ value, value ] as const);
	const map = new Map(entries);
	const biMap = new BiMap(entries);

	summary(() => {
		bench('BiMap#get', () => do_not_optimize(biMap.get(125)));
		bench('Map#get', () => do_not_optimize(map.get(125))).baseline(true);
	});
});

group('MultiSet count', () => {
	const smallSource = source.slice(0, 250);
	const multiSet = new MultiSet(smallSource);

	summary(() => {
		bench('MultiSet#count', () => do_not_optimize(multiSet.count(125)));
	});
});

group('SortedMap lookup', () => {
	const entries = source.slice(0, 250).map((value) => [ value, value ] as const);
	const map = new Map(entries);
	const sortedMap = new SortedMap(entries);

	summary(() => {
		bench('SortedMap#get', () => do_not_optimize(sortedMap.get(125)));
		bench('Map#get', () => do_not_optimize(map.get(125))).baseline(true);
	});
});

group('SortedSet lookup', () => {
	const smallSource = source.slice(0, 250);
	const set = new Set(smallSource);
	const sortedSet = new SortedSet(smallSource.slice().reverse());

	summary(() => {
		bench('SortedSet#has', () => do_not_optimize(sortedSet.has(125)));
		bench('Set#has', () => do_not_optimize(set.has(125))).baseline(true);
	});
});

group('List flatMap', () => {
	const pairs = (element: number): number[] => [ element, element ];

	summary(() => {
		bench('Array#flatMap', () => do_not_optimize(array.flatMap(pairs)));
		bench('List#flatMap', () => do_not_optimize(list.flatMap(pairs)));
	});
});

group('List findLastIndex', () => {
	const none = (element: number): boolean => element < 0;

	summary(() => {
		bench('Array#findLastIndex (no match)', () => do_not_optimize(array.findLastIndex(none)));
		bench('List#findLastIndex (no match)', () => do_not_optimize(list.findLastIndex(none)));
	});
});

group('List removeIf', () => {
	const none = (element: number): boolean => element < 0;

	summary(() => {
		bench('List#removeIf (no match)', () => do_not_optimize(list.removeIf(none)));
	});
});

group('LinkedList snapshot', () => {
	summary(() => {
		bench('Array#spread copy', () => do_not_optimize([ ...source ])).baseline(true);
		bench('LinkedList#toArray', () => do_not_optimize(singly.toArray()));
	});
});

group('MultiSet snapshot', () => {
	const multiSet = new MultiSet<number>();
	for (let value = 0; value < SIZE / 10; value++) { multiSet.add(value, 10) }

	summary(() => {
		bench('Array#spread copy', () => do_not_optimize([ ...source ])).baseline(true);
		bench('MultiSet#toArray', () => do_not_optimize(multiSet.toArray()));
	});
});

group('SortedMap snapshot', () => {
	const entries = source.map((value) => [ value, value ] as [number, number]);
	const sortedMap = new SortedMap(entries, numeric);
	const map = new Map(entries);

	summary(() => {
		bench('Array.from(Map)', () => do_not_optimize(Array.from(map))).baseline(true);
		bench('SortedMap#toArray', () => do_not_optimize(sortedMap.toArray()));
	});
});

group('LinkedMap key iterator creation', () => {
	summary(() => {
		bench('Map#keys (create only)', () => do_not_optimize(nativeMap.keys())).baseline(true);
		bench('LinkedMap#keys (create only)', () => do_not_optimize(linkedMap.keys()));
	});
});

group('LinkedList value iterator creation', () => {
	summary(() => {
		bench('Array#values (create only)', () => do_not_optimize(source.values())).baseline(true);
		bench('LinkedList#values (create only)', () => do_not_optimize(singly.values()));
	});
});

group('SortedSet construction', () => {
	const shuffled = source.slice().sort((left, right) => ((left * 7919) % SIZE) - ((right * 7919) % SIZE));

	summary(() => {
		bench('new SortedSet(shuffled)', () => do_not_optimize(new SortedSet(shuffled, numeric)));
	});
});

group('SortedMap construction', () => {
	const shuffled = source.slice().sort((left, right) => ((left * 7919) % SIZE) - ((right * 7919) % SIZE));
	const shuffledEntries = shuffled.map((value) => [ value, value ] as [number, number]);

	summary(() => {
		bench('new SortedMap(shuffled)', () => do_not_optimize(new SortedMap(shuffledEntries, numeric)));
	});
});

group('PriorityQueue push and pop', () => {
	const shuffled = source.slice().sort((left, right) => ((left * 7919) % SIZE) - ((right * 7919) % SIZE));

	summary(() => {
		bench('PriorityQueue#push/pop', () => {
			const queue = new PriorityQueue<number>([], numeric);
			for (const value of shuffled) { queue.push(value) }
			while (queue.pop() !== undefined);
			do_not_optimize(queue);
		});
	});
});

await run({ colors: true });