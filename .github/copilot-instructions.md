# collections — Project Guidelines

TypeScript data-structure library (`@d1g1tal/collections`). ESM-only, targets ESNext, published to npm.

## Build & Test

```bash
pnpm install          # install deps (pnpm@10.33.0 required)
pnpm build            # compile TypeScript → dist/
pnpm type-check       # type-check without emitting
pnpm lint             # ESLint (strict + type-aware)
pnpm test             # run tests once (vitest)
pnpm test:watch       # watch mode
pnpm test:coverage    # coverage → tests/coverage/
```

Tests are excluded from ESLint. Coverage excludes `src/index.ts`.

## Architecture

Eight exported collection classes — see [src/index.ts](../src/index.ts) for the full list.

**Composition over inheritance** is the dominant pattern:
- `List<E>` wraps a private `Array<E>`.
- `LinkedMap<K,V>` composes `Map<K, KeyedNode<K,V>>` plus doubly-linked `$head`/`$tail` pointers.
- `KeyedNode<K,E>` extends `Node<E>` — the only meaningful inheritance.

Each collection is a **standalone class** in its own file (`src/<name>.ts`) with a matching test file (`tests/<name>.test.ts`).

## Conventions

**Private fields** use a `$` prefix (`$elements`, `$map`, `$head`, `$tail`, `$key`).

**Fluent API** — mutating methods (`add`, `set`, `insert`, `remove`, …) return `this` for chaining.

**Error handling** — throw `RangeError` for out-of-bounds or invalid-index conditions. No other error types are used internally.

**JSDoc** is required on every public method. Use the TypeScript JSDoc style:
- No `{Type}` annotations inside JSDoc tags — TypeScript types are the source of truth.
- `@param name description` and `@returns description` (no type braces).
- `@template T description` for generic type parameters.

**Linting** enforces `jsdoc/no-types` — the rule will fail if you add type annotations to `@param`/`@returns`.

**Exports map** supports both root imports and per-file subpath imports:
```ts
import { List } from '@d1g1tal/collections';
import { List } from '@d1g1tal/collections/list';
```
When adding a new collection, register it in both `src/index.ts` and `package.json#exports`.

## Testing

Framework: Vitest. Pattern: nested `describe` per class/method, `it` per scenario.

```ts
describe('List', () => {
  describe('add', () => {
    it('should add an element to the end', () => { … });
    it('should throw RangeError when index is out of bounds', () => { … });
  });
});
```

Use `beforeEach` for shared setup. Use `expect().toEqual()` for value equality and `expect().toThrow(RangeError)` for error cases.

## Releases

Automated via Conventional Commits + semantic-release. See [docs/release-process.md](../docs/release-process.md) for commit types and version bump rules.
