# collections
JavaScript Collections and Data Structures

[![Build Status](https://travis-ci.org/d1g1tal/collections.svg?branch=master)](https://travis-ci.org/d1g1tal/collections)
[![Coverage Status](https://coveralls.io/repos/github/d1g1tal/collections/badge.svg?branch=master)](https://coveralls.io/github/d1g1tal/collections?branch=master)
[![npm version](https://badge.fury.io/js/%40d1g1tal%2Fcollections.svg)](https://badge.fury.io/js/%40d1g1tal%2Fcollections)

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
