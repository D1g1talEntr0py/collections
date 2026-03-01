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
