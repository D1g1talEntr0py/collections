# collections
JavaScript Collections and Data Structures

[![npm version](https://img.shields.io/npm/v/@d1g1tal/collections?color=blue)](https://www.npmjs.com/package/@d1g1tal/collections)
[![npm downloads](https://img.shields.io/npm/dm/@d1g1tal/collections)](https://www.npmjs.com/package/@d1g1tal/collections)
[![CI](https://github.com/D1g1talEntr0py/collections/actions/workflows/ci.yml/badge.svg)](https://github.com/D1g1talEntr0py/collections/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/D1g1talEntr0py/collections/graph/badge.svg)](https://codecov.io/gh/D1g1talEntr0py/collections)
[![License: ISC](https://img.shields.io/github/license/D1g1talEntr0py/collections)](https://github.com/D1g1talEntr0py/collections/blob/main/LICENSE)
[![Node.js](https://img.shields.io/node/v/@d1g1tal/collections)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## About
This is a collection of TypeScript data structures and algorithms. The goal is to provide a comprehensive set of data structures and algorithms that can be used in TypeScript/JavaScript programs.

If you are looking for `EvictingCache`, it has been removed as it is its own [library](https://github.com/D1g1talEntr0py/evicting-cache) now

## Installation

```bash
// pnpm 🎉
pnpm add @d1g1tal/collections

// npm 😒
npm install @d1g1tal/collections
```

## Usage
### List
```javascript
import { List } from '@d1g1tal/collections';

const list = new List();
list.add(1);
list.add(2);
list.add(3);
list.add(4);
list.add(5);

list.forEach((value) => {
	console.log(value); // 1, 2, 3, 4, 5
});

list.remove(3);

list.forEach((value) => {
	console.log(value); // 1, 2, 4, 5
});

```
### LinkedList
```javascript
import { LinkedList } from '@d1g1tal/collections';

const linkedList = new LinkedList();
linkedList.add(1);
linkedList.add(2);
linkedList.add(3);
linkedList.add(4);
linkedList.add(5);

linkedList.forEach((value) => {
	console.log(value); // 1, 2, 3, 4, 5
});

linkedList.remove(3);

linkedList.forEach((value) => {
	console.log(value); // 1, 2, 4, 5
});

linkedList.clear();

linkedList.forEach((value) => {
	console.log(value); // nothing
});

console.log(linkedList.size); // 0
```

### Doubly Linked List
```javascript
const doublyLinkedList = new LinkedList(LinkedList.Type.Doubly);

doublyLinkedList.add(1);
doublyLinkedList.add(2);
doublyLinkedList.add(3);
doublyLinkedList.add(4);
doublyLinkedList.add(5);

doublyLinkedList.forEach((value) => {
	console.log(value); // 1, 2, 3, 4, 5
});

doublyLinkedList.reverse();

doublyLinkedList.forEach((value) => {
	console.log(value); // 5, 4, 3, 2, 1
});
```
