## [2.2.0](https://github.com/D1g1talEntr0py/collections/compare/v2.1.6...v2.2.0) (2026-03-28)

### Features

* add `getOrInsert` and `getOrInsertComputed` map methods (31e66630b19692be92bf7e611d9a95b110bdd184)
Introduces standard TypeScript 6 map access utility methods to `LinkedMap`, `MultiMap`, and `SetMultiMap`. Appends comprehensive unit tests for the new map procedures. Unveils `KeyedNode` in the core module exports.


### Code Refactoring

* remove explicit return types and rely on typescript inference (924a66e6dd3719cc948f367bc78219820096e231)
Strips explicitly declared return types from collection interfaces to leverage TypeScript's type inference. Eliminates redundant `: void` and specific primitives like `: boolean` or `: E` where they are clearly delineated by the method bodies.


### Documentation

* add copilot instructions and improve readme (17371c7aedee3f59c70e42638bf2f48a4735f3e4)
Adds a comprehensive GitHub Copilot instructions markdown file to guide AI contributions. Refines and greatly expands the README with new usage examples, a visual collection types matrix, and guidance on when to choose specific data structures.


### Miscellaneous Chores

* update dependencies and typescript configuration (ef54f1dbb88da35536591b3d4e26271176673108)
Updates TypeScript to the latest version and bumps various devDependencies including vitest, eslint, and rollup. Modifies `tsconfig.json` to enable `erasableSyntaxOnly` and configures root and module resolution settings. Expands `package.json` exports to support individual module imports.

## [2.1.6](https://github.com/D1g1talEntr0py/collections/compare/v2.1.5...v2.1.6) (2026-03-18)

### Bug Fixes

* add missing .js extension to file paths in import statements when minifying (267997de0b9450ac586cba6d39f219cff7e19505)

## [2.1.5](https://github.com/D1g1talEntr0py/collections/compare/v2.1.4...v2.1.5) (2026-03-18)

### Bug Fixes

* add missing .js extension to file paths in import statements (106f2e4f85acefa81fab34012f500d58da600bc5)

## [2.1.4](https://github.com/D1g1talEntr0py/collections/compare/v2.1.3...v2.1.4) (2026-03-18)

### Bug Fixes

* **release:** added --no-git-checks flag (8d49a6f2567a41e59f43c221675a921901c990bc)

## [2.1.3](https://github.com/D1g1talEntr0py/collections/compare/v2.1.2...v2.1.3) (2026-03-18)

### Bug Fixes

* patch vulnerable dependencies to resolve CVE-2026-32141 (094f15fb012426c2f3a0b409865f4946d23312f1)
Updates packages within the development environment and regenerates the lockfile to ensure stable and secure modules. This effectively mitigates the security vulnerability identified by CVE-2026-32141.

* **release:** updated npm references to pnpm (d2fa2307e8cf217369659a900005afa148293f36)

### Documentation

* transition project license to MIT (4d7d6aec725f0008f1d1d1c7eb70ff3154da8eca)
Updates the repository license from ISC to MIT to expand accessibility. This includes replacing the LICENSE file content, updating the README badge, and modifying the author and license fields in the package manifest.


### Miscellaneous Chores

* update publish configuration and action workflows (4a3103cfc9bd930d6f57eac8591baf74195e10b1)
Upgrades GitHub Actions steps to newer semantic versions ensuring continued compatibility. Adjusts the semantic-release configuration to properly build and lint packages before publishing, and updates package.json maintainer properties and export definitions.

## [2.1.2](https://github.com/D1g1talEntr0py/collections/compare/v2.1.1...v2.1.2) (2026-03-01)

### Bug Fixes

* upgrade dependencies to resolve CVE-2026-27606 (cb10120d37206574ea9b4164ddf3823b5719f641)
Bumps eslint (9→10), typescript-eslint (8.46→8.56), vitest (3→4),
vite (7.1→7.3), esbuild (0.25→0.27), and related ecosystem packages.
Switches from local tsbuild link to published @d1g1tal/tsbuild.

Fixes security vulnerability CVE-2026-27606 present in transitive
dependencies of the previous lockfile resolution.


### Code Refactoring

* clean up package config and minor source fixes (e6333070429ac6aadf99d1582fd8a26abeae5231)
Adds engine requirement, pins packageManager, sets npm registry in
publishConfig, moves minification to the prepublish script, and
removes a redundant null initializer in the linked list traversal.


### Documentation

* update README badges and add release process guide (4e84e49c462ad5c1c55d35dd83091f723a1104c3)
Replaces legacy Travis CI and Coveralls badges with current ones.
Adds documentation explaining how to write commits, open PRs, and
what the automated release pipeline does.


### Continuous Integration

* add GitHub Actions workflows, release config, and commit hook (fad55466b350df346388d35e5eee8a882f68b1b7)
Adds CI pipeline across Node.js 20/22/24, automated semantic-release
publish workflow, .releaserc.json config, and a commit-msg hook to
enforce Conventional Commits locally.
