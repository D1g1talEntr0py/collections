# Release Process

## Overview

[git-cliff](https://git-cliff.org/) 2.14.2 parses Conventional Commits, calculates versions, and generates changelogs. The [release workflow](../.github/workflows/publish.yml) updates the package version and publishes to npm and GitHub. Release tooling is installed in CI, not added to package dependencies. Do not manually bump the package version.

Release eligibility and changelog inclusion are separate:

- Every commit appears in the changelog, including non-conventional commits, maintenance commits, and release commits.
- Only the release-worthy commits below trigger a release.
- Non-release commits accumulate until the next release. At release time, the **full changelog** is regenerated from Git history, while GitHub release notes contain only unreleased commits.
- Commit links use the workflow's `GITHUB_REPOSITORY`, not a hard-coded repository.

## Commit and Version Policy

Use `type(optional-scope): description`.

| Commit | Version bump |
|---|---|
| Any conventional commit with `!` or a breaking-change footer | Major |
| `feat` | Minor |
| `fix`, `perf`, `revert` | Patch |
| `docs`, `style`, `chore`, `refactor`, `test`, `build`, `ci`, other types, or non-conventional commits | None unless conventionally marked breaking |

Both `feat!: change an API` and `feat(list)!: change an API` trigger major releases. No footer is required when `!` is present. Either `BREAKING CHANGE:` or `BREAKING-CHANGE:` in a conventional commit footer also triggers a major release:

```text
refactor(list): replace the storage contract

BREAKING-CHANGE: callers must use the new storage contract.
```

Breaking changes take precedence over minor and patch changes, including for `0.x` versions. Scopes do not change release eligibility. Non-breaking refactoring is included in release notes but does not independently trigger a release.

## Contributor Checks

Work on a feature branch and open a PR against `main`. CI runs the release-policy fixtures, lint, type-check, tests with coverage, and build on the latest Node.js 24 and 26 releases.

Local development requires Node.js 24.15.0 or newer and pnpm 12.17.0. The package runtime minimum remains Node.js 24.11.1; CI does not test that exact minimum.

Before merging, preserve conventional messages on `main`:

- With a squash merge, put the correct type, scope, and any breaking marker in the squash message.
- With a merge commit, the individual branch commits are analyzed.

## Automated Release

Pushes to `main` run the workflow in the `npm` environment. Releases are serialized without cancelling an in-progress publish. Queued runs check out the current `main` with full history and tags.

1. Install the pinned git-cliff version and project dependencies.
2. Run disposable Git-fixture tests covering release eligibility, version bumps, and complete changelogs.
3. Parse commits since the latest stable `vMAJOR.MINOR.PATCH` tag. Skip publishing when no commit is release-worthy.
4. Calculate the next version with `git-cliff --bumped-version`. Safely skip empty output, unchanged versions, and "There is nothing to bump"; other errors fail the workflow.
5. Generate separate release notes with `--unreleased --strip header` and regenerate the full changelog. Both commands use `--github-repo "$GITHUB_REPOSITORY"`.
6. Strip the `v` prefix and update `package.json` using `npm version --no-git-tag-version --ignore-scripts`.
7. Run lint, type-check, coverage tests, `pnpm build --minify`, and `pnpm pack`. Verify the archive contains the entry point, declarations, README, license, and migration guide.
8. Refuse to publish if `main` moved during preparation. Publish the validated archive with npm Trusted Publishing and `--provenance`.
9. Commit only the generated changelog and package version with `chore(release): VERSION [skip ci]`, create the release tag, and atomically push the commit and tag.
10. Create a GitHub release with the separate notes and the published package archive attached.

The workflow retains `node-version: lts/*`, upgrades npm for Trusted Publishing support, and uses no npm access token.

## Local Preview and Regression Tests

Install git-cliff **2.14.2** using an [upstream installation method](https://git-cliff.org/docs/installation/), then run:

```sh
export GITHUB_REPOSITORY=D1g1talEntr0py/collections
git-cliff --version
pnpm exec tsc --project scripts/tsconfig.json
node --test scripts/tests/release-policy.ts
node scripts/release-version.ts
```

The release scripts are TypeScript ES modules executed directly by Node's native type stripping, without a transpiler or compatibility loader. Their separate strict type-check uses `scripts/tsconfig.json` so they remain outside the published library build.

The version script is read-only. It prints an unprefixed version only when a release is needed, with diagnostics on stderr. It uses git-cliff's parsed conventional/breaking flags and does not create tags, edit files, or publish.

Preview the full changelog on stdout without changing the working tree:

```sh
git-cliff --github-repo "$GITHUB_REPOSITORY" --offline
```

To preview the next release notes, use the version returned by the policy script:

```sh
VERSION=$(node scripts/release-version.ts)
if [ -n "$VERSION" ]; then
  git-cliff --github-repo "$GITHUB_REPOSITORY" --offline \
    --tag "v$VERSION" --unreleased --strip header
fi
```

The policy script and fixture tests work offline; remote metadata is not needed to generate repository-aware links.

## Correcting the Existing 4.x Release

The incompatible collection changes intended for version 5 were already released under 4.1.0. Changing the release tooling does not reclassify commits behind an existing release tag.

This migration does **not** bump the version, publish, rewrite tags, or regenerate the historical changelog immediately. To establish the correct major-version boundary afterward, prepare a separately reviewed conventional breaking-change commit describing the correction, for example:

```text
fix(release)!: establish the major-version boundary for collection API changes

BREAKING CHANGE: the collection API incompatibilities documented in
docs/migration-v5.md require a major release; they were previously shipped
under 4.1.0.
```

Preview that commit through the policy script before merging. From the current 4.1.1 release, it should produce 5.0.0. Do not delete, move, or reuse published 4.x tags or npm versions.

## Verification and Recovery

- Check [Actions](https://github.com/D1g1talEntr0py/collections/actions), [npm](https://www.npmjs.com/package/@d1g1tal/collections), and [GitHub releases](https://github.com/D1g1talEntr0py/collections/releases).
- If no release is created, check commits since the latest stable release tag. Documentation and non-breaking maintenance alone intentionally do not release.
- If the version is unexpected, run the policy fixtures and local preview. Both breaking-marker forms and both footer spellings must produce major bumps.
- If publishing fails, verify the `npm` environment and npm Trusted Publisher's repository, workflow filename, and environment settings.
- If npm publishing succeeds but a later Git push or GitHub release step fails, reconcile npm, the release commit, and tag before retrying. Do not blindly republish an existing version.
- Before any publish, rollback consists of reverting the migration's tooling and documentation changes together. After a publish, correct mistakes with a new release, not rewritten published versions.
