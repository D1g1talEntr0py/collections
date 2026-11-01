# collections
JavaScript Collections and Data Structures

[![npm version](https://img.shields.io/npm/v/@d1g1tal/collections?color=blue)](https://www.npmjs.com/package/@d1g1tal/collections)
[![npm downloads](https://img.shields.io/npm/dm/@d1g1tal/collections)](https://www.npmjs.com/package/@d1g1tal/collections)
[![CI](https://img.shields.io/github/actions/workflow/status/D1g1talEntr0py/collections/ci.yml?branch=main&label=CI)](https://github.com/D1g1talEntr0py/collections/actions/workflows/ci.yml)
[![codecov](https://img.shields.io/codecov/c/github/D1g1talEntr0py/collections?branch=main&label=coverage)](https://codecov.io/gh/D1g1talEntr0py/collections)
[![License: MIT](https://img.shields.io/github/license/D1g1talEntr0py/collections)](https://github.com/D1g1talEntr0py/collections/blob/main/LICENSE)
[![Node.js](https://img.shields.io/node/v/@d1g1tal/collections)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript->=5.6.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## About
This is a collection of TypeScript data structures and algorithms. The goal is to provide a comprehensive set of data structures and algorithms that can be used in TypeScript/JavaScript programs.

If you are looking for `EvictingCache`, it has been removed as it is its own [package](https://github.com/D1g1talEntr0py/evicting-cache) now

## Installation

```bash
// pnpm 🎉
pnpm add @d1g1tal/collections

// npm 😒
npm install @d1g1tal/collections
```

The package is ESM-only and requires Node.js 22 or newer. The repository uses TypeScript 6 for development, while published types support TypeScript 5.6 and newer.

## Usage
Both root imports and subpath imports are supported.

```javascript
import { List } from '@d1g1tal/collections';
// or
import { List } from '@d1g1tal/collections/list';
```

## Map Helper Methods

`LinkedMap`, `MultiMap`, and `SetMultiMap` provide the following Map-style helper methods:

- `getOrInsert(key, defaultValue)`
- `getOrInsertComputed(key, compute)`

For `LinkedMap`, both methods return the map value type (`V`).

For `MultiMap` and `SetMultiMap`, `defaultValue`/`compute` must be a collection (`List<V>` or `Set<V>`), matching `Map` semantics:

- If the key exists, they return the existing stored collection.
- If the key does not exist, they insert the supplied (or computed) collection and return it.

Use `add(key, value)` on `MultiMap` and `SetMultiMap` to append a single value to the collection for a key, creating it if necessary.

## Collection Types

| Type | Best for | Why use it |
| --- | --- | --- |
| `List` | General ordered data | Familiar array-style operations with a consistent collection API |
| `LinkedList` | Frequent inserts/removals at the ends or middle | Avoids array shifting costs for linked-list style workflows |
| `LinkedMap` | Ordered key/value data | Preserves order and lets you move entries to the front or back |
| `MultiMap` | One key with many values, duplicates allowed | Stores grouped values in a `List` per key |
| `SetMultiMap` | One key with many unique values | Stores grouped values in a `Set` per key |
| `Stack` | LIFO workflows | Small, focused push/pop/peek abstraction |
| `Node` | Building custom linked structures | Low-level primitive used by linked collections |
| `KeyedNode` | Building custom keyed linked structures | Low-level node primitive for ordered key/value chains |

## Choosing a Type

Use `List` when you want the simplest ordered collection.

Use `LinkedList` when inserts and removals near the front or middle matter more than random access speed.

Use `LinkedMap` when order is part of the behavior, such as caches, recency lists, or prioritized registries.

Use `MultiMap` when one key can intentionally map to repeated values.

Use `SetMultiMap` when one key maps to many values, but duplicates should be ignored.

Use `Stack` for undo history, parser state, DFS traversal, or any last-in-first-out flow.

Most users will not need `Node` or `KeyedNode` directly unless they are extending the library or building custom linked data structures.

### List

Use case: maintain an ordered backlog, pipeline, or result set where indexed access and array-like operations are useful.

```javascript
import { List } from '@d1g1tal/collections';

const backlog = new List(['triage', 'build', 'ship']);

backlog.add('verify');
backlog.insert(1, 'design');

console.log(backlog.get(0)); // triage
console.log(backlog.contains('ship')); // true

backlog.remove('build');

console.log(backlog.toArray());
// ['triage', 'design', 'ship', 'verify']

backlog.forEach((step) => {
	console.log(step);
});

// triage
// design
// ship
// verify

```

`List` wraps a JavaScript array, so indexed reads are constant-time while inserting or removing near the front or middle shifts later elements. It is not intended to replace native arrays, but provides a fluent collection API. It also provides array-style methods such as `at`, `slice`, `filter`, `map`, `flatMap`, `find`, `findLast`, `findLastIndex`, `every`, `some`, `removeIf`, `toSorted`, and `reduce`. Callback arguments are `(element, index, list)`; the third argument is the `List`, not its backing array. Methods that create results return a `List`, and `map` preserves the mapped element type. `addAllFrom(iterable)` appends large or streaming inputs without expanding them into function arguments.

```javascript
const completed = backlog
	.filter((step) => step !== 'verify')
	.map((step) => step.toUpperCase());

console.log(completed.toArray());
// ['TRIAGE', 'DESIGN', 'SHIP']
```

`List.keys()`, `List.values()`, and `List.entries()` return the corresponding native array iterators. `LinkedList` and `LinkedMap` expose iterators over their linked nodes, so `for...of`, `keys()`, `values()`, and `entries()` do not allocate an intermediate array.

### LinkedList

Use case: maintain a sequence with efficient front operations and traversal; choose doubly linked mode when tail removals are frequent.

The constructor and `LinkedList.from` accept an iterable first and an optional list type second. The type defaults to `LinkedList.Type.Singly`; pass the type directly, not inside an options object.

```javascript
import { LinkedList } from '@d1g1tal/collections';

const empty = new LinkedList();
const singly = new LinkedList([1, 2, 3], LinkedList.Type.Singly);
const doubly = new LinkedList([1, 2, 3], LinkedList.Type.Doubly);
const emptyDoubly = new LinkedList(undefined, LinkedList.Type.Doubly);

const fromIterable = LinkedList.from(new Set([1, 2, 3]));
const doublyFromIterable = LinkedList.from(new Set([1, 2, 3]), LinkedList.Type.Doubly);
```

```javascript
import { LinkedList } from '@d1g1tal/collections';

const queue = new LinkedList();

queue.addLast('job-1');
queue.addLast('job-2');
queue.addFirst('urgent-job');

console.log(queue.getFirst()); // urgent-job
console.log(queue.getLast()); // job-2

queue.removeFirst();
queue.insert(1, 'job-1.5');

console.log(queue.toArray());
// ['job-1', 'job-1.5', 'job-2']

for (const job of queue) {
	console.log(job);
}

// job-1
// job-1.5
// job-2

```

### Doubly Linked List

Use case: the same linked-list workflow as above, but better suited for reversing or traversing large lists where bidirectional links are beneficial.

```javascript
import { LinkedList } from '@d1g1tal/collections';

const timeline = new LinkedList(undefined, LinkedList.Type.Doubly);

timeline.addLast('draft');
timeline.addLast('review');
timeline.addLast('published');

timeline.reverse();

console.log(timeline.toArray());
// ['published', 'review', 'draft']

console.log(timeline.get(1)); // review
```

`LinkedList` accepts any iterable in its constructor or `LinkedList.from(iterable)`. Both accept an optional list type as the second parameter and are singly linked by default; pass `LinkedList.Type.Doubly` when reverse traversal or frequent tail removals justify the extra backward links, for example `LinkedList.from([1, 2, 3], LinkedList.Type.Doubly)`. To create an empty doubly linked list, use `new LinkedList(undefined, LinkedList.Type.Doubly)`. `addFirst`, `addLast`, and `removeFirst` are constant-time in either mode; `removeLast` is O(n) for a singly linked list and O(1) for a doubly linked list. Indexed lookup, insertion, and removal must first traverse to the index. Its empty/not-found accessors return `undefined`; use `size` or `contains` to distinguish absence from a stored `undefined`. `descendingValues()` traverses doubly linked lists backward and returns a reverse snapshot for singly linked lists. Iterators skip removed values; after `clear()`, an active iterator resumes at the new head, while a completed iterator stays complete.

### LinkedMap

Use case: keep items in a meaningful order and promote or demote entries without rebuilding the map.

```javascript
import { LinkedMap } from '@d1g1tal/collections';

const recentFiles = new LinkedMap();

recentFiles.addLast('README.md', '/docs/readme');
recentFiles.addLast('package.json', '/package');
recentFiles.addLast('tsconfig.json', '/tsconfig');

recentFiles.moveToLast('README.md');

console.log(Array.from(recentFiles.keys()));
// ['package.json', 'tsconfig.json', 'README.md']

console.log(recentFiles.getFirst()); // /package
console.log(recentFiles.getLast()); // /docs/readme
console.log(recentFiles.firstKey()); // package.json

recentFiles.set('README.md', '/docs/readme-v2'); // updates in place; does not reorder
recentFiles.delete('tsconfig.json');

const changelogPath = recentFiles.getOrInsert('CHANGELOG.md', '/docs/changelog');
console.log(changelogPath); // /docs/changelog

const packagePath = recentFiles.getOrInsertComputed('package.json', (key) => `/${key}`);
console.log(packagePath); // /package
```

`LinkedMap` accepts an iterable of `[key, value]` entries. Key lookup and endpoint reordering are constant-time on average; `set` and ordering mutators return the map, and `set` updates existing values without moving their entries. This makes it useful as the ordered index inside a recency list, but it does not enforce a capacity or evict entries automatically. Use `delete(key)` for Map-style removal; `remove(key)` remains as a deprecated alias. `getFirst()` and `getLast()` return `undefined` when empty, and `firstKey()`, `lastKey()`, `firstEntry()`, and `lastEntry()` expose the endpoints. Iterators skip removed entries and, after `clear()`, continue with newly added entries.

### MultiMap

Use case: group several values under the same key when duplicates and insertion order matter.

```javascript
import { List, MultiMap } from '@d1g1tal/collections';

const ticketsByStatus = new MultiMap();

ticketsByStatus.add('open', 'INC-100');
ticketsByStatus.add('open', 'INC-101');
ticketsByStatus.add('open', 'INC-101');

console.log(Array.from(ticketsByStatus.get('open') ?? []));
// ['INC-100', 'INC-101', 'INC-101']

console.log(ticketsByStatus.hasValue('open', 'INC-101')); // true

ticketsByStatus.deleteValue('open', 'INC-100');

console.log(Array.from(ticketsByStatus.get('open') ?? []));
// ['INC-101', 'INC-101']

console.log(ticketsByStatus.valueCount); // 2
console.log(Array.from(ticketsByStatus.flatValues()));
// ['INC-101', 'INC-101']

const insertedTicket = ticketsByStatus.getOrInsert('pending', new List(['INC-200']));
console.log(Array.from(insertedTicket));
// ['INC-200']
console.log(Array.from(ticketsByStatus.get('pending') ?? []));
// ['INC-200']

const existingPending = ticketsByStatus.getOrInsert('pending', new List(['INC-201']));
console.log(Array.from(existingPending));
// ['INC-200']

const waitingList = ticketsByStatus.getOrInsertComputed('waiting', () => new List(['INC-300', 'INC-301']));
console.log(Array.from(waitingList));
// ['INC-300', 'INC-301']
```

`deleteValue(key, value)` removes only one matching value, including when `value` is `undefined`; use the inherited `delete(key)` to remove the entire key.

### SetMultiMap

Use case: model one-to-many relationships where duplicate values should be ignored automatically.

```javascript
import { SetMultiMap } from '@d1g1tal/collections';

const rolesByUser = new SetMultiMap();

rolesByUser.add('jason', 'admin');
rolesByUser.add('jason', 'editor');
rolesByUser.add('jason', 'editor');

console.log(Array.from(rolesByUser.get('jason') ?? []));
// ['admin', 'editor']

console.log(rolesByUser.hasValue('jason', 'admin')); // true

rolesByUser.deleteValue('jason', 'admin');

console.log(Array.from(rolesByUser.get('jason') ?? []));
// ['editor']

const insertedRole = rolesByUser.getOrInsert('alice', new Set(['viewer']));
console.log(Array.from(insertedRole));
// ['viewer']
console.log(Array.from(rolesByUser.get('alice') ?? []));
// ['viewer']

const existingAlice = rolesByUser.getOrInsertComputed('alice', () => new Set(['admin']));
console.log(Array.from(existingAlice));
// ['viewer']

const teamRoles = rolesByUser.getOrInsertComputed('team', () => new Set(['maintainer', 'reviewer']));
console.log(Array.from(teamRoles));
// ['maintainer', 'reviewer']
```

`SetMultiMap.deleteValue(key, value)` removes only that association, including an `undefined` value. Use `delete(key)` to remove the entire key. `valueCount` returns the number of stored key/value associations, and `flatValues()` iterates them in key and value insertion order.

### Stack

Use case: represent undo history, nested parser state, or any last-in-first-out control flow.

```javascript
import { Stack } from '@d1g1tal/collections';

const undoStack = new Stack();

undoStack.push('insert line');
undoStack.push('rename symbol');
undoStack.push('delete block');

console.log(undoStack.peek()); // delete block
console.log(undoStack.pop()); // delete block
console.log(undoStack.pop()); // rename symbol
console.log(undoStack.size); // 1
```

`Stack` can be initialized from an iterable in bottom-to-top order. Iteration and `toArray()` expose top-to-bottom order; `clear()` empties the stack and returns it for chaining.

### Deque

Use case: process values from either end without shifting an array on each operation.

```javascript
import { Deque } from '@d1g1tal/collections';

const tasks = new Deque(['build', 'test']);
tasks.pushFront('lint');
tasks.pushBack('release');

console.log(tasks.popFront()); // lint
console.log(tasks.popBack()); // release
console.log(tasks.toArray()); // ['build', 'test']
```

`Deque` is backed by a ring buffer. `pushFront`, `pushBack`, `popFront`, and `popBack` are amortized O(1), making it a good fit for a work queue that promotes urgent items at the front. `at()` is constant-time and supports negative indexes like `Array.at()`. Empty pops and peeks return `undefined`.

### PriorityQueue

Use case: repeatedly select the next item by priority.

```javascript
import { PriorityQueue } from '@d1g1tal/collections';

const queue = new PriorityQueue([5, 1, 4, 2]);
console.log(queue.peek()); // 1
console.log(queue.pop()); // 1
console.log([...queue.drain()]); // [2, 4, 5]
```

The queue is a min-heap by default and accepts a comparator as its second constructor argument. For objects, compare their priority fields:

```javascript
import { PriorityQueue } from '@d1g1tal/collections';

const jobs = new PriorityQueue(
	[{ name: 'report', priority: 2 }, { name: 'incident', priority: 1 }],
	(left, right) => left.priority - right.priority,
);

console.log(jobs.pop()?.name); // incident
```

`peek()` is O(1), while `push()` and `pop()` are O(log n); `remove(value)` scans the heap and is O(n). Duplicate values are retained. `toArray()` and ordinary iteration expose the internal heap layout, not priority order; use `drain()` to remove values in priority order. Draining is lazy, so values are removed only as the iterator is consumed. Comparator-equal values have no stable order.

### Low-Level Primitives

`Node` and `KeyedNode` are exposed for advanced use cases.

Use `Node` when you want to build your own linked structure with `previous`, `next`, and `value` references.

Use `KeyedNode` when you need the same linked behavior plus a stored key for ordered key/value structures.

Most application code should prefer `LinkedList` or `LinkedMap` over working with nodes directly.

## Benchmarks

The repository includes Mitata benchmarks for comparing `List` with native arrays and the linked collections with their native counterparts. Build the project before running the full collection benchmark suite:

```bash
pnpm benchmark   # Build, then run all benchmark suites
```
