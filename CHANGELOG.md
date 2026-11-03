# Changelog

All commits are included below, grouped by release and change type.


## [5.0.0](https://github.com/D1g1talEntr0py/collections/compare/v4.1.1...v5.0.0) - 2026-11-03






### Breaking Changes

* **release:** correct the major-version boundary for collection API changes ([a258ebf](https://github.com/D1g1talEntr0py/collections/commit/a258ebfa439fb7ecfd8e8755c695c6ee6182555a))

> the incompatible collection APIs documented in the
version 5 migration guide were incorrectly published as 4.1.0.
This release establishes the intended 5.0.0 version boundary.










































## [4.1.1](https://github.com/D1g1talEntr0py/collections/compare/v4.1.0...v4.1.1) - 2026-11-01












### Bug Fixes

* **ci:** align Node.js versions with toolchain requirements ([372cf11](https://github.com/D1g1talEntr0py/collections/commit/372cf11c6051c0ee2d642c208953b70d496c85e2))


















### Chores

* **release:** 4.1.1 [skip ci] ([1fef2d4](https://github.com/D1g1talEntr0py/collections/commit/1fef2d48ee560125af66d80d7640092d4c87f837))





















## [4.1.0](https://github.com/D1g1talEntr0py/collections/compare/v4.0.1...v4.1.0) - 2026-11-01






### Breaking Changes

* **collections:** modernize linked and multimap APIs ([bc4700f](https://github.com/D1g1talEntr0py/collections/commit/bc4700f79b7f7d06a847edc7328fe3d0db32ac2a))

> modernize linked and multimap APIs


* **list:** modernize list APIs and sorting ([2430fb8](https://github.com/D1g1talEntr0py/collections/commit/2430fb85882c546a31f34819b2956dcd2efc0d2e))

> modernize list APIs and sorting






### Features

* **stack:** add iterable and fluent operations ([2b3ded5](https://github.com/D1g1talEntr0py/collections/commit/2b3ded52025d6113c4338ce4f65b89f64e4b17d3))


* **queue:** add deque and priority queue ([c183798](https://github.com/D1g1talEntr0py/collections/commit/c183798c278abad7c226a92e225533441e20f0b6))


* **bimap:** add bidirectional map ([9e25a50](https://github.com/D1g1talEntr0py/collections/commit/9e25a50e3c7560d7aac075f2836ea35b1b097313))


* **multiset:** add counted element collection ([f3d2de0](https://github.com/D1g1talEntr0py/collections/commit/f3d2de09b8b8ed5a8d9351c1b7dd6b25680e172c))


* **sorted:** add sorted map and set ([8875a80](https://github.com/D1g1talEntr0py/collections/commit/8875a80859fd2c1fb9abb3eb82c0db81b430ca1d))















### Documentation

* document version 5 collections and migration ([35bb7e0](https://github.com/D1g1talEntr0py/collections/commit/35bb7e08fc2c502668ecad1b58eed839b7b78722))









### Chores

* **deps:** update development toolchain ([3f43db7](https://github.com/D1g1talEntr0py/collections/commit/3f43db7b77395a35a013fb6a725382d2d1d71bd2))


* **build:** remove unused compiler configuration ([5090255](https://github.com/D1g1talEntr0py/collections/commit/5090255546c06f17100aab8a8627a398a2391daa))


* **release:** 4.1.0 [skip ci] ([e21e55b](https://github.com/D1g1talEntr0py/collections/commit/e21e55ba3c87eaffc19a26373cd6d42b19ba6ea3))









### Tests

* **benchmark:** compare equivalent operations across collections ([e8fba91](https://github.com/D1g1talEntr0py/collections/commit/e8fba919437fe3c976d5277dc8a9b2bd7d2b501d))















## [4.0.1](https://github.com/D1g1talEntr0py/collections/compare/v4.0.0...v4.0.1) - 2026-09-26












### Bug Fixes

* **build:** preserve empty exports in bundled declarations ([9a52fc0](https://github.com/D1g1talEntr0py/collections/commit/9a52fc01a04584b66e02f3fe00045edee344cdff))


















### Chores

* **release:** 4.0.1 [skip ci] ([72e51e2](https://github.com/D1g1talEntr0py/collections/commit/72e51e29101b89c25e9f1f3dce0db32e989c1bd8))





















## [4.0.0](https://github.com/D1g1talEntr0py/collections/compare/v3.2.2...v4.0.0) - 2026-09-21






### Breaking Changes

* **multi-map:** replace value-set overload with dedicated add method ([6a0a60a](https://github.com/D1g1talEntr0py/collections/commit/6a0a60a77d1cacde6518bb442a97985bc000fbcf))

> `MultiMap#set` no longer accepts a single value; use the new `add()` method instead. `getOrInsert()` and `getOrInsertComputed()` no longer accept single values or value-computing callbacks; pass/compute a `List<V>` instead.


* **set-multi-map:** replace value-set overload with dedicated add method ([1caf3a4](https://github.com/D1g1talEntr0py/collections/commit/1caf3a409c6cbae3fa8452d6970dcfeeefd231cb))

> `SetMultiMap#set` no longer accepts a single value; use the new `add()` method instead. `getOrInsert()` and `getOrInsertComputed()` no longer accept single values or value-computing callbacks; pass/compute a `Set<V>` instead.
























### Chores

* **release:** 4.0.0 [skip ci] ([c1fb67a](https://github.com/D1g1talEntr0py/collections/commit/c1fb67a406774c6cc3d9b9b12a7120f5b63656ec))





















## [3.2.2](https://github.com/D1g1talEntr0py/collections/compare/v3.2.1...v3.2.2) - 2026-09-20












### Bug Fixes

* **types:** move export statement to the top to ensure it is treated as a module in map-upsert-polyfill ([74cfc1c](https://github.com/D1g1talEntr0py/collections/commit/74cfc1c9fc4148f61f890a90284f7c1e873ee514))


















### Chores

* **eslint:** remove method-signature-style rule to simplify configuration ([90a1141](https://github.com/D1g1talEntr0py/collections/commit/90a1141b9fd0142e2a0664529614797420429b8b))


* **deps:** updated dev dependencies and packageManger ([0a005fc](https://github.com/D1g1talEntr0py/collections/commit/0a005fc100a3148d48828772cdb4eb9614124686))


* **deps:** update broken pnpm-lock.yaml because self-update does not update it. ([b1bb43c](https://github.com/D1g1talEntr0py/collections/commit/b1bb43c027b02596bde66b02341ea5c28875f17a))


* **release:** 3.2.2 [skip ci] ([2ca5293](https://github.com/D1g1talEntr0py/collections/commit/2ca52934ed3a83ce9468f2789bb3e66cb8435e34))





















## [3.2.1](https://github.com/D1g1talEntr0py/collections/compare/v3.2.0...v3.2.1) - 2026-09-16












### Bug Fixes

* **ci:** remove Node 22 from CI test matrix as some dev dependencies dropped support ([dc11588](https://github.com/D1g1talEntr0py/collections/commit/dc11588badc8085b9c53dba3d8e8b3f23db1d136))


















### Chores

* **release:** 3.2.1 [skip ci] ([23b61cb](https://github.com/D1g1talEntr0py/collections/commit/23b61cbe12587bbc18d0b5c6b4455699a102166b))





















## [3.2.0](https://github.com/D1g1talEntr0py/collections/compare/v3.1.1...v3.2.0) - 2026-09-16









### Features

* **stack:** add Symbol.toStringTag support ([f76fc4a](https://github.com/D1g1talEntr0py/collections/commit/f76fc4afe5d3bdfbef76e632452e0c1a2c8040bb))





















### Chores

* **deps:** upgrade dev tooling and align build/lint config ([13a2516](https://github.com/D1g1talEntr0py/collections/commit/13a2516d559729fc16921345acca6538e328ebb9))


* **style:** apply consistent formatting across list and multi-map modules ([e68bbe8](https://github.com/D1g1talEntr0py/collections/commit/e68bbe84a4809259c7dbae5f133e6812580435e3))


* **release:** 3.2.0 [skip ci] ([9d3170f](https://github.com/D1g1talEntr0py/collections/commit/9d3170fe37ca2d131cd92657bf934202eba8ef0c))






### Code Refactoring

* **map-upsert-polyfill:** auto-install polyfill as a side effect ([0d907bb](https://github.com/D1g1talEntr0py/collections/commit/0d907bb93865eb34d29561ba0272cad8e8b75d97))


* **linked-list:** use private class fields and safer null handling ([2d5747a](https://github.com/D1g1talEntr0py/collections/commit/2d5747aac4a965258fcdcd9366a7d9a16243a797))


* **linked-map:** guard head/tail null checks when linking nodes ([e81639a](https://github.com/D1g1talEntr0py/collections/commit/e81639a050558a1ad1b2d4caafe53522c5bbc334))


















## [3.1.1](https://github.com/D1g1talEntr0py/collections/compare/v3.1.0...v3.1.1) - 2026-08-19












### Bug Fixes

* **release:** update dependencies and migrate release configuration to .releaserc.json ([f131b81](https://github.com/D1g1talEntr0py/collections/commit/f131b81bef42ed467aaaf3ed3cf7db4007248348))


















### Chores

* **release:** 3.1.1 [skip ci] ([0ad60f0](https://github.com/D1g1talEntr0py/collections/commit/0ad60f00b2613857592765bb7a80036bd6bf45b8))





















## [3.1.0](https://github.com/D1g1talEntr0py/collections/compare/v3.0.1...v3.1.0) - 2026-08-19









### Features

* **map-upsert-polyfill:** polyfill map upsert and delegate collections ([e2c11c2](https://github.com/D1g1talEntr0py/collections/commit/e2c11c208c80b08fa57f19fae8f2c860a2ad2dfb))


* **release-config:** migrate to release.config.js and remove .releaserc.json ([f90624c](https://github.com/D1g1talEntr0py/collections/commit/f90624c6868ac17d0901ffa8815e0878a686a6a3))





















### Chores

* update lockfile and fix benchmark import path ([b8eb7aa](https://github.com/D1g1talEntr0py/collections/commit/b8eb7aa8f07f2968867e816675ae9baa3cc026c8))


* **release:** 3.1.0 [skip ci] ([22f997e](https://github.com/D1g1talEntr0py/collections/commit/22f997e45302e3fb78e08eabcf8430d3c1e7655b))





















## [3.0.1](https://github.com/D1g1talEntr0py/collections/compare/v3.0.0...v3.0.1) - 2026-08-16












### Bug Fixes

* **types:** support typescript 5.1.3 consumers ([a7e2bda](https://github.com/D1g1talEntr0py/collections/commit/a7e2bdab6c320a991bc2d220a27760faed4e15e8))












### Documentation

* **readme:** document typescript 5.1.3 support ([8480942](https://github.com/D1g1talEntr0py/collections/commit/848094290c79391ed59dd75d854b2cc5d647bde7))









### Chores

* **release:** 3.0.1 [skip ci] ([6abc032](https://github.com/D1g1talEntr0py/collections/commit/6abc032a03b2df03fb1bff2bc15f47ab1c7885b8))





















## [3.0.0](https://github.com/D1g1talEntr0py/collections/compare/v2.2.4...v3.0.0) - 2026-08-16






### Breaking Changes

* **multi-map:** return stored collection from getOrInsert ([23fcd04](https://github.com/D1g1talEntr0py/collections/commit/23fcd04ac87512165ef5d6ce1838a3fef2c3f281))

> getOrInsert and getOrInsertComputed on MultiMap and SetMultiMap now always return the stored List/Set, wrapping scalar defaults, instead of sometimes returning the scalar itself.

- aligns return types with Map semantics and removes the V | List<V> union
- find() iterates the stored collection directly without Array.from allocation
- deleteValue() no longer relies on try/catch and handles falsy values correctly









### Bug Fixes

* **linked-list:** repair node unlinking and reversal ([f3de4eb](https://github.com/D1g1talEntr0py/collections/commit/f3de4eb45cfa5f21147de7a56577b02b297cd635))






### Performance Improvements

* **collections:** replace generator iterators and delegate list to native arrays ([eeec774](https://github.com/D1g1talEntr0py/collections/commit/eeec774b108664f366ea23e87fdcd72b09100538))















### Chores

* **release:** 3.0.0 [skip ci] ([bb48bcf](https://github.com/D1g1talEntr0py/collections/commit/bb48bcf30aeeb6e1b9e23b1be7121a0b01af798c))












### Build System

* upgrade to typescript 6 toolchain and add mitata benchmarks ([f37f855](https://github.com/D1g1talEntr0py/collections/commit/f37f8552e1890c795d96797f5460aeb3f6f6789b))












## [2.2.4](https://github.com/D1g1talEntr0py/collections/compare/v2.2.3...v2.2.4) - 2026-07-30












### Bug Fixes

* updated tsbuild to fix a problem with imports missing the file extension when building ([2c8b2e0](https://github.com/D1g1talEntr0py/collections/commit/2c8b2e07a780df2fa6c327569d14c85d4534915d))


















### Chores

* update eslint config to TypeScript ([5d37e9d](https://github.com/D1g1talEntr0py/collections/commit/5d37e9d7aa70ac283806e9925a13331f5a5a99cc))


* **release:** 2.2.4 [skip ci] ([d4d36f7](https://github.com/D1g1talEntr0py/collections/commit/d4d36f7b0383713d46afe9de1fb20504b6bec707))















### Continuous Integration

* replaced node v20 with v26 in the test matrix ([778c574](https://github.com/D1g1talEntr0py/collections/commit/778c5740647021645a0684ebe6429d0b6ee35cd0))









## [2.2.3](https://github.com/D1g1talEntr0py/collections/compare/v2.2.2...v2.2.3) - 2026-07-29












### Bug Fixes

* **deps:** update dependencies to fix the following security vulnerabilities ([79fa394](https://github.com/D1g1talEntr0py/collections/commit/79fa3944c483340b35c2bb09648a92ffee3c7401))


















### Chores

* update actions and pnpm setup versions in CI and publish workflows ([80ef731](https://github.com/D1g1talEntr0py/collections/commit/80ef7315b49a0ac0098bb65db8e3d4b5fb58d6ed))


* update CI and codecov badge URLs in README ([d44d7d1](https://github.com/D1g1talEntr0py/collections/commit/d44d7d171949149483dafdc27ab449f05da55791))


* **release:** 2.2.3 [skip ci] ([5a19d15](https://github.com/D1g1talEntr0py/collections/commit/5a19d15366133a660b34ecbc16773c13983e7edc))






### Code Refactoring

* replace public properties with private class fields in data structures ([77ed52c](https://github.com/D1g1talEntr0py/collections/commit/77ed52cc3f5d14a60fc32f5e1d5cfeab7d515e78))


















## [2.2.2](https://github.com/D1g1talEntr0py/collections/compare/v2.2.1...v2.2.2) - 2026-05-25












### Bug Fixes

* **ci:** disabled minimum release age (sorry pnpm) ([aa1cd21](https://github.com/D1g1talEntr0py/collections/commit/aa1cd218dc660b3ba96cbefe95ccc65f8a59ff9a))


















### Chores

* **deps:** update dependencies, package manager, and CI workflows ([be39151](https://github.com/D1g1talEntr0py/collections/commit/be39151c7880d11b6e05f2dca615f77c530d4d21))


* **release:** 2.2.2 [skip ci] ([5f17253](https://github.com/D1g1talEntr0py/collections/commit/5f1725353de7cd43a7fcc714c134fd64ffe4de51))






### Code Refactoring

* transition to native ECMAScript private fields ([2929ae5](https://github.com/D1g1talEntr0py/collections/commit/2929ae5638f6b5bcd330ae30fe7e35a511168e3f))


















## [2.2.1](https://github.com/D1g1talEntr0py/collections/compare/v2.2.0...v2.2.1) - 2026-04-07












### Bug Fixes

* update dependencies to address CVE-2026-39363 in Vite ([2b353f8](https://github.com/D1g1talEntr0py/collections/commit/2b353f84b3093bcb56c622058cc1c725a68cbc9c))


















### Chores

* **release:** 2.2.1 [skip ci] ([34bec15](https://github.com/D1g1talEntr0py/collections/commit/34bec157239bbd5b8e2fd5c30539009324c2be6d))






### Code Refactoring

* add explicit return types to public methods ([fd77f73](https://github.com/D1g1talEntr0py/collections/commit/fd77f735735336dfdd7b988c7e3edfe50530e421))









### Build System

* update typescript configuration and release rules ([08c0294](https://github.com/D1g1talEntr0py/collections/commit/08c029410b19c1d0f6836aa98b7a64b53892e2b2))












## [2.2.0](https://github.com/D1g1talEntr0py/collections/compare/v2.1.6...v2.2.0) - 2026-03-28









### Features

* add `getOrInsert` and `getOrInsertComputed` map methods ([31e6663](https://github.com/D1g1talEntr0py/collections/commit/31e66630b19692be92bf7e611d9a95b110bdd184))















### Documentation

* add copilot instructions and improve readme ([17371c7](https://github.com/D1g1talEntr0py/collections/commit/17371c7aedee3f59c70e42638bf2f48a4735f3e4))









### Chores

* update dependencies and typescript configuration ([ef54f1d](https://github.com/D1g1talEntr0py/collections/commit/ef54f1dbb88da35536591b3d4e26271176673108))


* **release:** 2.2.0 [skip ci] ([6743118](https://github.com/D1g1talEntr0py/collections/commit/67431188496fed88a529b2f3fb19cd1d1d2a7502))






### Code Refactoring

* remove explicit return types and rely on typescript inference ([924a66e](https://github.com/D1g1talEntr0py/collections/commit/924a66e6dd3719cc948f367bc78219820096e231))


















## [2.1.6](https://github.com/D1g1talEntr0py/collections/compare/v2.1.5...v2.1.6) - 2026-03-18












### Bug Fixes

* add missing .js extension to file paths in import statements when minifying ([267997d](https://github.com/D1g1talEntr0py/collections/commit/267997de0b9450ac586cba6d39f219cff7e19505))


















### Chores

* **release:** 2.1.6 [skip ci] ([79f9a76](https://github.com/D1g1talEntr0py/collections/commit/79f9a76de7e555cee0762bdeaa70016056a7510c))





















## [2.1.5](https://github.com/D1g1talEntr0py/collections/compare/v2.1.4...v2.1.5) - 2026-03-18












### Bug Fixes

* add missing .js extension to file paths in import statements ([106f2e4](https://github.com/D1g1talEntr0py/collections/commit/106f2e4f85acefa81fab34012f500d58da600bc5))


















### Chores

* **release:** 2.1.5 [skip ci] ([26b02e4](https://github.com/D1g1talEntr0py/collections/commit/26b02e46d3682b11094cb8c99c649e95edfbf4c5))





















## [2.1.4](https://github.com/D1g1talEntr0py/collections/compare/v2.1.3...v2.1.4) - 2026-03-18












### Bug Fixes

* **release:** added --no-git-checks flag ([8d49a6f](https://github.com/D1g1talEntr0py/collections/commit/8d49a6f2567a41e59f43c221675a921901c990bc))


















### Chores

* **release:** 2.1.4 [skip ci] ([a3a4ece](https://github.com/D1g1talEntr0py/collections/commit/a3a4eceddd073d21ff77dbdaf92a99d05eed6237))





















## [2.1.3](https://github.com/D1g1talEntr0py/collections/compare/v2.1.2...v2.1.3) - 2026-03-18












### Bug Fixes

* patch vulnerable dependencies to resolve CVE-2026-32141 ([094f15f](https://github.com/D1g1talEntr0py/collections/commit/094f15fb012426c2f3a0b409865f4946d23312f1))


* **release:** updated npm references to pnpm ([d2fa230](https://github.com/D1g1talEntr0py/collections/commit/d2fa2307e8cf217369659a900005afa148293f36))












### Documentation

* transition project license to MIT ([4d7d6ae](https://github.com/D1g1talEntr0py/collections/commit/4d7d6aec725f0008f1d1d1c7eb70ff3154da8eca))









### Chores

* update publish configuration and action workflows ([4a3103c](https://github.com/D1g1talEntr0py/collections/commit/4a3103cfc9bd930d6f57eac8591baf74195e10b1))


* **release:** 2.1.3 [skip ci] ([3bb6033](https://github.com/D1g1talEntr0py/collections/commit/3bb6033a1771a0e9caeafb410155a38189679f5d))





















## [2.1.2](https://github.com/D1g1talEntr0py/collections/compare/v2.1.1...v2.1.2) - 2026-03-01












### Bug Fixes

* upgrade dependencies to resolve CVE-2026-27606 ([cb10120](https://github.com/D1g1talEntr0py/collections/commit/cb10120d37206574ea9b4164ddf3823b5719f641))












### Documentation

* update README badges and add release process guide ([4e84e49](https://github.com/D1g1talEntr0py/collections/commit/4e84e49c462ad5c1c55d35dd83091f723a1104c3))









### Chores

* **release:** 2.1.2 [skip ci] ([3d66f0c](https://github.com/D1g1talEntr0py/collections/commit/3d66f0cc5818eb290bd3f534f9f27d5c17b2f9b7))






### Code Refactoring

* clean up package config and minor source fixes ([e633307](https://github.com/D1g1talEntr0py/collections/commit/e6333070429ac6aadf99d1582fd8a26abeae5231))












### Continuous Integration

* add GitHub Actions workflows, release config, and commit hook ([fad5546](https://github.com/D1g1talEntr0py/collections/commit/fad55466b350df346388d35e5eee8a882f68b1b7))









## [2.1.1](https://github.com/D1g1talEntr0py/collections/compare/v2.1.0...v2.1.1) - 2025-10-10










































### Other Changes

* Maintenance update. Dependency updates and some fixes for types and tests. ([390f774](https://github.com/D1g1talEntr0py/collections/commit/390f7748d50a78173167daa9c6a2ed959c2a7e6a))






## [2.1.0](https://github.com/D1g1talEntr0py/collections/compare/v2.0.3...v2.1.0) - 2025-09-16










































### Other Changes

* Converted standard JSDoc syntax to TypeScript and updated dependencies ([0bd413c](https://github.com/D1g1talEntr0py/collections/commit/0bd413c2e1dfc5b517dff5921ffa00d8383cae08))






## [2.0.3](https://github.com/D1g1talEntr0py/collections/compare/v2.0.1...v2.0.3) - 2025-07-20










































### Other Changes

* Maintenance update: updated dependencies and tsconfig.json ([b5b8300](https://github.com/D1g1talEntr0py/collections/commit/b5b8300c04bd4d83374e5f62e9118efcb62656c6))


* Bump version number ([e99744b](https://github.com/D1g1talEntr0py/collections/commit/e99744b445a12d570e5b94d75716366ff0fad1bf))


* Dependency Updates ([5d97fca](https://github.com/D1g1talEntr0py/collections/commit/5d97fcacd1fb874cc37eff3426495ec155ca1267))






## [2.0.1](https://github.com/D1g1talEntr0py/collections/compare/v2.0.0...v2.0.1) - 2024-09-08










































### Other Changes

* Fixed listing TypeScript as a dependency. It is now in devDependencies ([34a132a](https://github.com/D1g1talEntr0py/collections/commit/34a132a76ace2a6391c6f51020822fee96fa5575))






## [2.0.0](https://github.com/D1g1talEntr0py/collections/compare/v1.0.0...v2.0.0) - 2024-09-07










































### Other Changes

* Maintenance release ([025854d](https://github.com/D1g1talEntr0py/collections/commit/025854d11d5b09da39e9eaaab8f1c7c1a85316cb))


* TypeScript Source. Breaking Changes!
- Converted source to TypeScript.
- Switched from Jest to Vitest.
- Updated eslint to the new flat config format.
- Breaking: Removed the 'EvictingCache' class as it is its own project now.
- Added a 'find' method to the 'SetMultiMap' class.
- Added additional logic to the 'delete' method to remove the key if the value is the last one or undefined. ([34a818e](https://github.com/D1g1talEntr0py/collections/commit/34a818e711ed171c81f3f6ed8d8a85c01551520a))






## [1.0.0](https://github.com/D1g1talEntr0py/collections/compare/v0.2.5...v1.0.0) - 2023-12-03










































### Other Changes

* Deprecated EvictingCache class and moved it to its own repository (https://github.com/D1g1talEntr0py/evicting-cache).
- Updated dependencies.
- Small optimizations to the 'LinkedMap' and 'Node' classes. ([4e062f9](https://github.com/D1g1talEntr0py/collections/commit/4e062f99d4b1330a6146306260cfb2a5f51743c0))






## [0.2.5](https://github.com/D1g1talEntr0py/collections/compare/v0.2.4...v0.2.5) - 2023-11-02










































### Other Changes

* Changed 'exports' field in package.json and updated dependencies ([02832e6](https://github.com/D1g1talEntr0py/collections/commit/02832e6f3760d6617298551912bf4382e722b88c))






## [0.2.4](https://github.com/D1g1talEntr0py/collections/compare/v0.2.3...v0.2.4) - 2023-10-11










































### Other Changes

* Changed project to use pnpm instead of npm. Updated license to ISC ([9df5a8f](https://github.com/D1g1talEntr0py/collections/commit/9df5a8f02e760925896c4329284a1241d388dbc4))






## [0.2.3](https://github.com/D1g1talEntr0py/collections/compare/v0.2.2...v0.2.3) - 2023-07-08










































### Other Changes

* Refactoring the `List`, `LinkedMap`, and `EvictingCache` classes to fix some bugs and add some enhancements.
- Added a default value (100) for the `capacity` parameter in the `EvictingCache` class constructor.
- Fixed line endings in the `LinkedList` class.
- Refactored the `LinkedMap` to abstract away some boilerplate code into private methods.
- Refactored the `insert` method in the `List` class return the `List` instance to allow chaining.
- Refactored the remove methods (`remove()`, `removeFirst()`, `removeLast()`, `removeAt()`) to return the removed value.
- Added a `concat()` method to the `List` class.
- Refactored methods that evaluate a predicate to use the `call()` method instead of the `apply()` method to avoid creating an unnecessary array.
- Changed the default comparator function for the `sort()` method to include handling for numbers or default to String handling.
- Updated the tests for all of the changed classes. All tests are passing with 100% coverage. ([f450f78](https://github.com/D1g1talEntr0py/collections/commit/f450f7892d1327561673fc84fd2a7fc8e6fea0f2))






## [0.2.2](https://github.com/D1g1talEntr0py/collections/compare/v0.2.1...v0.2.2) - 2023-06-15










































### Other Changes

* Created a `LinkedMap` class to use instead of a `Map` and separate `LinkedList` for the `EvictingCache` class.
- Added a `LinkedMap` class that is backed by a `Map`. The nodes are linked internally and stored in the head and tail properties of the class.
- Added unit tests for the `LinkedMap` class.
- Added a `KeyedNode` class that extends the `Node` class and adds a key property.
- Added unit tests for the `KeyedNode` class.
- Updated the `EvictingCache` class to use the `LinkedMap` class instead of a `Map` and separate `LinkedList`.
- Fixed JSDoc comments in the `List` class. ([3cd7242](https://github.com/D1g1talEntr0py/collections/commit/3cd72429dd9b8caa32f261e92ced7f3d0c088bd5))






## [0.2.1](https://github.com/D1g1talEntr0py/collections/compare/v0.2.0...v0.2.1) - 2023-06-13










































### Other Changes

* Removed internal `Cache` class and unit tests. Minor bug fixes.
- Removed `Cache` class and unit tests.
- Updated .eslintrc to change how semi-colons are handled.
- Updated README.md. I know, its a bit sparse right now.
- Updated the evicting cache to use a `Map` instead of an object.
- Updated the `size` method to use the `Map`'s `size` property and be accessed as a property instead of a method. ([5ab8862](https://github.com/D1g1talEntr0py/collections/commit/5ab88624dc8f987ef5ecf9af7348e80edcf9ea3b))






## [0.2.0](https://github.com/D1g1talEntr0py/collections/compare/v0.1.2...v0.2.0) - 2023-06-12










































### Other Changes

* Added `Cache` class and additional unit tests.
-Added `Cache` class that is backed by an `Object` with no prototype chain. `Object.create(null)` is used to create the backing object. This is an internal only class and is not exported since it is designed to be used by the `EvictingCache` class.
-Added unit tests for the `Cache` class.
-Refactored the `EvictingCache` class to use the `Cache` class instead of a `Map`.
-Updated unit tests for the `EvictingCache` class.
-Reimplemented the `List` class instead of fixing the numerous bugs.
-Updated unit tests for the `List` class.
-Reimplemented the `MultiMap` class instead of fixing the numerous bugs.
-Added unit tests for the `MultiMap` class.
-Reimplemented the `SetMultiMap` class instead of fixing the numerous bugs.
-Added unit tests for the `SetMultiMap` class.
-Reimplemented the `Stack` class instead of fixing the numerous bugs.
-Added unit tests for the `Stack` class.
-Updated dependencies. ([d3da9d1](https://github.com/D1g1talEntr0py/collections/commit/d3da9d1580716beb304d262d3c9c15d1dbf1a0f3))






## [0.1.2](https://github.com/D1g1talEntr0py/collections/compare/v0.1.1...v0.1.2) - 2023-06-02










































### Other Changes

* Added 'has()' method and modified 'getOrPut()' to accept function as second param in 'EvictingCache' ([ef850ae](https://github.com/D1g1talEntr0py/collections/commit/ef850ae166c4e125778873d47d338fc8dd8a827f))






## [0.1.1](https://github.com/D1g1talEntr0py/collections/compare/v0.1.0...v0.1.1) - 2023-06-02










































### Other Changes

* Added 'getOrPut()' method and unit tests ([8c64bc4](https://github.com/D1g1talEntr0py/collections/commit/8c64bc490897b9197888e88e693aa3c07e25890f))






## [0.1.0](https://github.com/D1g1talEntr0py/collections/compare/v0.0.5...v0.1.0) - 2023-06-02










































### Other Changes

* Added `EvictingCache` class and refactored both linked lists into a single `LinkedList` class.
- Modified the `Node` class to add types to the JSDoc comments.
- Removed both the `DoublyLinkedList` and `SinglyLinkedList` classes and replaced them with a single `LinkedList` class.
- Added the `EvictingCache` class.
- Added tests for the `EvictingCache` class.
- Added tests for the `LinkedList` class.
- Updated tests for the `Node` class.
- Updated the `README.md` file.
- Updated dev dependencies. ([95934ec](https://github.com/D1g1talEntr0py/collections/commit/95934ec1f2f4c783f58c247d3f0e6bbc44f2e0f5))






## [0.0.5](https://github.com/D1g1talEntr0py/collections/compare/v0.0.4...v0.0.5) - 2023-05-30










































### Other Changes

* Added `DoublyLinkedList` class and updated `Node` class and unit tests.
- Added `DoublyLinkedList` class.
- Updated `Node` class to support doubly linked lists.
- Updated unit tests to support doubly linked lists.
- Updated development dependencies.
- Deleted d.ts files.
- Added JSDoc comments.
- Renamed the `withSize()` method to `withCapacity()` in the `List` class.
- Fixed a bug in the `concat()` method of the `List` class that caused an error at runtime attempting to use `this()` as a constructor.
- Added a `context` parameter to the `every()`, `some()`, `find()`, `findIndex()`, `filter()` and `map()` methods of the `List` class. The default value is `this`.
- Added a `forEach()` method to the `List` class.
- Added a `set()` method to the `List` class.
- Added a return value to the `insert()` method of the `List` class.
- Added a `removeLast()` method to the `List` class.
- Added a `removeFirst()` method to the `List` class.
- Added a `reverse()` method to the `List` class.
- Changed the `values()` method to be a generator function.
- Changed the `Symbol.iterator()` method to be a generator function. ([1b3f1e2](https://github.com/D1g1talEntr0py/collections/commit/1b3f1e245892f3fd86c66c11ad0daeb2d50407b5))






## [0.0.4](https://github.com/D1g1talEntr0py/collections/compare/v0.0.3...v0.0.4) - 2022-10-17










































### Other Changes

* Updates for importing modules
-Renamed re-exports files to index.js and index.d.ts.
-Removed references to MultiMap from SetMultiMap and WeakSetMultiMap.
-Added "exports" field in package.json to be able to import individual modules to allow tree-shaking in esbuild. ([c594bfd](https://github.com/D1g1talEntr0py/collections/commit/c594bfd19a6078e6ea6ea30c58c35245325e4ccd))






## [0.0.3](https://github.com/D1g1talEntr0py/collections/compare/v0.0.2...v0.0.3) - 2022-10-17










































### Other Changes

* Fixed bug with removing an item from a List ([55de17c](https://github.com/D1g1talEntr0py/collections/commit/55de17ca98f1044c8ea7899944ae8c02613ce841))






## [0.0.2](https://github.com/D1g1talEntr0py/collections/compare/v0.0.1...v0.0.2) - 2022-10-17










































### Other Changes

* Added collections.js and collections.d.ts to 'files' entry in package.json ([efbac45](https://github.com/D1g1talEntr0py/collections/commit/efbac452a0eb3fa441e4fb2aa77e77de16ed3b36))






## [0.0.1](https://github.com/D1g1talEntr0py/collections/releases/tag/v0.0.1) - 2022-10-17










































### Other Changes

* Initial commit ([16187be](https://github.com/D1g1talEntr0py/collections/commit/16187be694436e1035221d25ce0addabf16bfb60))


* Initial commit ([447d498](https://github.com/D1g1talEntr0py/collections/commit/447d498da92615343d0ea1497e85f1a8ce8adcd0))




