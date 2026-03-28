# collections
JavaScript Collections and Data Structures

[![npm version](https://img.shields.io/npm/v/@d1g1tal/collections?color=blue)](https://www.npmjs.com/package/@d1g1tal/collections)
[![npm downloads](https://img.shields.io/npm/dm/@d1g1tal/collections)](https://www.npmjs.com/package/@d1g1tal/collections)
[![CI](https://github.com/D1g1talEntr0py/collections/actions/workflows/ci.yml/badge.svg)](https://github.com/D1g1talEntr0py/collections/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/D1g1talEntr0py/collections/graph/badge.svg)](https://codecov.io/gh/D1g1talEntr0py/collections)
[![License: MIT](https://img.shields.io/github/license/D1g1talEntr0py/collections)](https://github.com/D1g1talEntr0py/collections/blob/main/LICENSE)
[![Node.js](https://img.shields.io/node/v/@d1g1tal/collections)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript->=5.1.3-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

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

## Usage
Both root imports and subpath imports are supported.

```javascript
import { List } from '@d1g1tal/collections';
// or
import { List } from '@d1g1tal/collections/list';
```

## TypeScript 6 Map Methods

`LinkedMap`, `MultiMap`, and `SetMultiMap` support the TypeScript 6 `Map` helper methods:

- `getOrInsert(key, defaultValue)`
- `getOrInsertComputed(key, compute)`

For `LinkedMap`, both methods return the map value type (`V`).

For `MultiMap` and `SetMultiMap`, behavior matches `Map` semantics:

- If the key exists, they return the existing stored collection (`List<V>` or `Set<V>`).
- If the key does not exist and you pass a scalar (`V`), they return that inserted scalar.
- If the key does not exist and you pass a collection (`List<V>` or `Set<V>`), they return that inserted collection.

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

### LinkedList

Use case: manage a queue, playlist, or work stream where items are frequently added or removed from either end.

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

const timeline = new LinkedList(LinkedList.Type.Doubly);

timeline.addLast('draft');
timeline.addLast('review');
timeline.addLast('published');

timeline.reverse();

console.log(timeline.toArray());
// ['published', 'review', 'draft']

console.log(timeline.get(1)); // review
```

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

const changelogPath = recentFiles.getOrInsert('CHANGELOG.md', '/docs/changelog');
console.log(changelogPath); // /docs/changelog

const packagePath = recentFiles.getOrInsertComputed('package.json', (key) => `/${key}`);
console.log(packagePath); // /package
```

### MultiMap

Use case: group several values under the same key when duplicates and insertion order matter.

```javascript
import { List, MultiMap } from '@d1g1tal/collections';

const ticketsByStatus = new MultiMap();

ticketsByStatus.set('open', 'INC-100');
ticketsByStatus.set('open', 'INC-101');
ticketsByStatus.set('open', 'INC-101');

console.log(Array.from(ticketsByStatus.get('open') ?? []));
// ['INC-100', 'INC-101', 'INC-101']

console.log(ticketsByStatus.hasValue('open', 'INC-101')); // true

ticketsByStatus.deleteValue('open', 'INC-100');

console.log(Array.from(ticketsByStatus.get('open') ?? []));
// ['INC-101', 'INC-101']

const insertedTicket = ticketsByStatus.getOrInsert('pending', 'INC-200');
console.log(insertedTicket); // INC-200
console.log(Array.from(ticketsByStatus.get('pending') ?? []));
// ['INC-200']

const existingPending = ticketsByStatus.getOrInsert('pending', 'INC-201');
console.log(Array.from(existingPending));
// ['INC-200']

const waitingList = ticketsByStatus.getOrInsertComputed('waiting', () => new List(['INC-300', 'INC-301']));
console.log(Array.from(waitingList));
// ['INC-300', 'INC-301']
```

### SetMultiMap

Use case: model one-to-many relationships where duplicate values should be ignored automatically.

```javascript
import { SetMultiMap } from '@d1g1tal/collections';

const rolesByUser = new SetMultiMap();

rolesByUser.set('jason', 'admin');
rolesByUser.set('jason', 'editor');
rolesByUser.set('jason', 'editor');

console.log(Array.from(rolesByUser.get('jason') ?? []));
// ['admin', 'editor']

console.log(rolesByUser.hasValue('jason', 'admin')); // true

rolesByUser.deleteValue('jason', 'admin');

console.log(Array.from(rolesByUser.get('jason') ?? []));
// ['editor']

const insertedRole = rolesByUser.getOrInsert('alice', 'viewer');
console.log(insertedRole); // viewer
console.log(Array.from(rolesByUser.get('alice') ?? []));
// ['viewer']

const existingAlice = rolesByUser.getOrInsertComputed('alice', () => 'admin');
console.log(Array.from(existingAlice));
// ['viewer']

const teamRoles = rolesByUser.getOrInsertComputed('team', () => new Set(['maintainer', 'reviewer']));
console.log(Array.from(teamRoles));
// ['maintainer', 'reviewer']
```

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

### Low-Level Primitives

`Node` and `KeyedNode` are exposed for advanced use cases.

Use `Node` when you want to build your own linked structure with `previous`, `next`, and `value` references.

Use `KeyedNode` when you need the same linked behavior plus a stored key for ordered key/value structures.

Most application code should prefer `LinkedList` or `LinkedMap` over working with nodes directly.
