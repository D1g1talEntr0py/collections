# Migrating to Version 5

Version 5 includes breaking changes to runtime requirements, linked-list construction, and a few APIs. Review the items below when upgrading.

## Runtime and TypeScript requirements

- Node.js 24 or newer is required.
- TypeScript 5.6 or newer is required to consume the published declarations.

## LinkedList constructor

The constructor now accepts an optional iterable followed by the list type as the second parameter, without an options object. Replace the old type-enum argument:

```ts
// Before
new LinkedList(LinkedList.Type.Doubly);

// After
new LinkedList(undefined, LinkedList.Type.Doubly);
new LinkedList([1, 2, 3], LinkedList.Type.Doubly);
```

`LinkedList.from(iterable, type)` accepts the same optional second parameter. Both APIs default to `LinkedList.Type.Singly` when the type is omitted or `undefined`.

## List changes

- `List.remove(value)` returns `undefined` when the value is absent. Check the return value if absence needs to be distinguished.
- Callback-based methods such as `map`, `filter`, `find`, and `forEach` now pass the `List` itself as the third argument, not its backing array. Use `list.get(index)` and `list.size` instead of array indexing and `.length`, or call `list.toArray()` for a shallow copy. Reducers receive the `List` as their fourth argument.
- `List.insert(index, value)` throws `RangeError` when `index < 0` or `index > list.size`, rather than applying array-splice clamping. Inserting at `list.size` appends.
- `List.valueOf()` was removed; use `List.toArray()` for a shallow array copy.
- Keep using `List.addAll(...values)` for ordinary batches. Use `List.addAllFrom(iterable)` for large batches or streaming iterables so values do not need to be passed as a large argument list.

## Absence sentinels

Collection lookups and element-returning removals use `undefined` for missing values or empty collections, not `null`. In particular, update `null` checks for `LinkedList.get`, `getFirst`, `getLast`, `remove`, `removeFirst`, and `removeLast`; `LinkedMap.getFirst` and `getLast`; and `List.removeFirst` and `removeLast`. `Stack.pop()` and `peek()` also return `undefined` when empty.

Stored `null` and `undefined` remain valid values when allowed by the element type. An `undefined` result alone cannot distinguish a stored `undefined` from absence; use `has(key)`, `contains(value)`, or a size check as appropriate. Node links (`Node.previous` and `Node.next`, including `KeyedNode` links) still use `null` for a missing neighbor.

## Fluent return values

The following mutators now return the same instance for chaining rather than `void`:

- `Stack.push` (the new `clear` method also returns `this`).
- `List.clear` (`add`, `addAll`, `insert`, `set`, `reverse`, and `sort` also return `this`).
- `LinkedList.addFirst`, `addLast`, `insert`, `set`, `reverse`, and `clear`.
- `LinkedMap.set`, `addFirst`, `addLast`, `moveToFirst`, `moveToLast`, and `clear`.

Do not treat these results as inserted values, sizes, or success flags. Removal methods retain their documented element or boolean results; they are not uniformly fluent.

## LinkedMap changes

- `LinkedMap.set(key, value)` now updates an existing entry in place and returns the map, preserving its insertion position.
- Use `LinkedMap.delete(key)` for the Map-style boolean result. `remove(key)` remains as a deprecated alias.
- `removeFirst()` and `removeLast()` now return the removed `[key, value]` tuple, or `undefined` when empty, instead of a boolean. Check `entry !== undefined` before destructuring; the value inside a returned tuple may itself be `undefined`.
- Iterators tolerate removal of not-yet-yielded entries and continue from the current head after `clear()`. An iterator that has completed remains completed.

## MultiMap and SetMultiMap deletion

`deleteValue(key, value)` now requires an explicit value and returns a boolean indicating whether a value was removed. `MultiMap` removes one matching occurrence; `SetMultiMap` removes the unique value. Removing the last value also deletes its key.

`deleteValue(key, undefined)` removes a stored `undefined` value, not the whole key. Replace any old whole-key `deleteValue(key)` or `deleteValue(key, undefined)` calls with the inherited `delete(key)` to remove the key and all its values:

```ts
const values = new MultiMap<string, number | undefined>();
values.add('key', undefined).add('key', 1);
values.deleteValue('key', undefined); // true; 'key' still contains 1
values.delete('key'); // true; removes the whole key
```

The same distinction applies to `SetMultiMap`.

## Natural ordering

Default sorting uses a shared natural comparator: when both operands are numbers, they are compared numerically; otherwise their string representations are compared in JavaScript code-unit order. String ordering is locale-independent, unlike `localeCompare`. This affects `List.sort()` and `toSorted()`, and the default ordering of `PriorityQueue`, `SortedMap`, and `SortedSet`.

For numeric comparisons, `NaN` sorts after every other number (including `Infinity`), and two `NaN` values compare equal. Pass an explicit comparator when you need different behavior or locale-aware ordering, for example `list.sort((a, b) => a.localeCompare(b))` for a list of strings.

## Map prototype side effects

Importing the package no longer adds helper methods to the global `Map.prototype`. The library uses internal helpers instead; applications should avoid relying on package imports to patch native prototypes.

## New collection types

Version 5 adds `Deque`, `PriorityQueue`, `BiMap`, `MultiSet`, `SortedMap`, and `SortedSet`. See the [collection type guide](../README.md#collection-types) for usage and selection guidance.
