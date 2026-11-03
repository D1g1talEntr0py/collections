import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { afterEach, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const config = fileURLToPath(new URL('../../cliff.toml', import.meta.url));
const planner = fileURLToPath(new URL('../release-version.ts', import.meta.url));
const directories: string[] = [];
const environment: NodeJS.ProcessEnv = {
	...process.env,
	GITHUB_REPOSITORY: 'fixture/collections',
	GIT_AUTHOR_NAME: 'Release Test',
	GIT_AUTHOR_EMAIL: 'release@example.invalid',
	GIT_COMMITTER_NAME: 'Release Test',
	GIT_COMMITTER_EMAIL: 'release@example.invalid',
	GIT_CONFIG_NOSYSTEM: '1',
	GIT_CONFIG_GLOBAL: '/dev/null'
};

afterEach(() => {
	for (const directory of directories.splice(0)) {
		rmSync(directory, { recursive: true, force: true });
	}
});

function git(directory: string, ...args: string[]): string {
	return execFileSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], {
		cwd: directory, env: environment, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe']
	}).trim();
}

function commit(directory: string, message: string): string {
	git(directory, 'commit', '--allow-empty', '--no-gpg-sign', '-m', message);
	return git(directory, 'rev-parse', 'HEAD');
}

function fixture(): string {
	const directory = mkdtempSync(join(tmpdir(), 'collections-release-'));
	directories.push(directory);
	git(directory, 'init', '--initial-branch=main');
	copyFileSync(config, join(directory, 'cliff.toml'));
	commit(directory, 'initial history');
	git(directory, 'tag', 'v1.2.3');
	return directory;
}

function plan(directory: string, env: NodeJS.ProcessEnv = environment): string {
	return execFileSync(process.execPath, [planner], {
		cwd: directory, env, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe']
	}).trim();
}

function cliff(directory: string, ...args: string[]): string {
	return execFileSync('git-cliff', [
		'--github-repo', 'fixture/collections', '--offline', ...args
	], { cwd: directory, env: environment, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
}

for (const [message, expected] of [
	['feat: add a collection', '1.3.0'],
	['feat(list): add an operation', '1.3.0'],
	['fix: repair an operation', '1.2.4'],
	['fix(list): repair an operation', '1.2.4'],
	['perf: reduce allocations', '1.2.4'],
	['perf(list): reduce allocations', '1.2.4'],
	['revert: restore old behavior', '1.2.4'],
	['revert(list): restore old behavior', '1.2.4'],
	['feat!: replace an API', '2.0.0'],
	['feat(collections)!: modernize linked and multimap APIs', '2.0.0'],
	['feat(list)!: modernize list APIs and sorting', '2.0.0'],
	['chore!: drop a runtime', '2.0.0'],
	['custom(scope)!: change a contract', '2.0.0'],
	['docs: revise a contract\n\nBREAKING CHANGE: the old contract is removed', '2.0.0'],
	['refactor(list): replace internals\n\nBREAKING-CHANGE: the old contract is removed', '2.0.0'],
	['refactor: simplify internals', ''],
	['refactor(list): simplify internals', ''],
	['docs: explain usage', ''],
	['style: format source', ''],
	['chore: update tooling', ''],
	['test: add coverage', ''],
	['build: update packaging', ''],
	['ci: update checks', ''],
	['custom: miscellaneous change', ''],
	['fixup: not a fix commit', ''],
	['unconventional commit', ''],
	['not conventional\n\nBREAKING CHANGE: not a conventional footer', '']
] as const) {
	test(`release policy: ${message.split('\n')[0]} => ${expected || 'no release'}`, () => {
		const directory = fixture();
		commit(directory, message);
		assert.equal(plan(directory), expected);
	});
}

test('no commits after the latest release tag do not release', () => {
	assert.equal(plan(fixture()), '');
});

test('already released breaking changes are not reconsidered', () => {
	const directory = fixture();
	commit(directory, 'feat!: already released change');
	git(directory, 'tag', 'v2.0.0');
	commit(directory, 'docs: describe the release');
	assert.equal(plan(directory), '');
});

test('a corrective breaking commit after 4.1.1 produces 5.0.0 without changing tags', () => {
	const directory = fixture();
	git(directory, 'tag', '--delete', 'v1.2.3');
	git(directory, 'tag', 'v4.1.1');
	commit(directory, 'fix(release)!: establish the major-version boundary for collection API changes');
	const tags = git(directory, 'tag', '--list');
	assert.equal(plan(directory), '5.0.0');
	assert.equal(git(directory, 'tag', '--list'), tags);
});

for (const [message, expected] of [
	['feat: add a feature before 1.0', '0.3.0'],
	['chore!: drop a runtime before 1.0', '1.0.0']
] as const) {
	test(`zero-major version policy: ${message} => ${expected}`, () => {
		const directory = fixture();
		git(directory, 'tag', '--delete', 'v1.2.3');
		git(directory, 'tag', 'v0.2.0');
		commit(directory, message);
		assert.equal(plan(directory), expected);
	});
}

test('all commits appear exactly once in the full changelog, but notes contain only unreleased commits', () => {
	const directory = fixture();
	const initial = git(directory, 'rev-parse', 'HEAD');
	const historical = commit(directory, 'docs: historical documentation');
	git(directory, 'tag', 'v1.2.4');
	const messages = [
		['feat(list)!: replace an API', 'Breaking Changes'],
		['docs: revise a contract\n\nBREAKING-CHANGE: old contract removed', 'Breaking Changes'],
		['feat(queue): add queue helpers', 'Features'],
		['fix(list): fix lookup', 'Bug Fixes'],
		['perf(list): speed up lookup', 'Performance Improvements'],
		['revert: undo a change', 'Reverts'],
		['docs: document usage', 'Documentation'],
		['style: format code', 'Styles'],
		['chore(release): old release [skip ci]', 'Chores'],
		['refactor: simplify code', 'Code Refactoring'],
		['test: cover behavior', 'Tests'],
		['build: update build', 'Build System'],
		['ci: update CI', 'Continuous Integration'],
		['custom: another change', 'Other Changes'],
		['unconventional commit\n\nwith a multi-line body', 'Other Changes']
	] as const;
	const ids = messages.map(([message]) => commit(directory, message));
	assert.equal(plan(directory), '2.0.0');
	const context: unknown = JSON.parse(cliff(directory, '--unreleased', '--context'));
	assert.ok(Array.isArray(context));
	const release: unknown = context[0];
	assert.ok(typeof release === 'object' && release !== null && 'commits' in release);
	assert.ok(Array.isArray(release.commits));
	const groups = release.commits.map((commit: unknown) => {
		assert.ok(typeof commit === 'object' && commit !== null && 'group' in commit);
		assert.equal(typeof commit.group, 'string');
		return commit.group;
	});
	assert.deepEqual(groups, messages.map(([, group]) => group));

	const full = cliff(directory, '--tag', 'v2.0.0');
	const notes = cliff(directory, '--tag', 'v2.0.0', '--unreleased', '--strip', 'header');
	for (const id of [initial, historical, ...ids]) {
		assert.equal(full.split(`/commit/${id}`).length - 1, 1, `full changelog must include ${id} once`);
	}
	for (const id of ids) {
		assert.ok(notes.includes(`/commit/${id}`));
	}
	assert.ok(!notes.includes(`/commit/${historical}`));
	assert.ok(!notes.includes(`/commit/${initial}`));
	assert.ok(!notes.startsWith('# Changelog'));
	assert.ok(full.includes('https://github.com/fixture/collections/compare/v1.2.4...v2.0.0'));
	assert.ok(full.includes('**queue:** add queue helpers'));
	assert.ok(full.includes('old contract removed'));
	for (const group of new Set(messages.map(([, group]) => group))) {
		assert.ok(full.includes(`### ${group}`), `missing group ${group}`);
	}
});

interface CliffResult {
	stdout?: string;
	stderr?: string;
	status?: number;
}

function stubCliff(directory: string, result: CliffResult): NodeJS.ProcessEnv {
	const bin = join(directory, 'bin');
	mkdirSync(bin);
	const context = [{
		previous: { version: 'v1.2.3' },
		commits: [{ conventional: true, breaking: false, raw_message: 'fix: a fix' }]
	}];
	writeFileSync(join(bin, 'git-cliff'), `#!/bin/sh
exec '${process.execPath}' '${join(bin, 'git-cliff.ts')}' "$@"
`, { mode: 0o755 });
	writeFileSync(join(bin, 'git-cliff.ts'), `export {};
const args: string[] = process.argv;
if (args.includes('--context')) {
	process.stdout.write(${JSON.stringify(JSON.stringify(context))});
} else {
	process.stdout.write(${JSON.stringify(result.stdout ?? '')});
	process.stderr.write(${JSON.stringify(result.stderr ?? '')});
	process.exitCode = ${result.status ?? 0};
}
`);
	return { ...environment, PATH: `${bin}${delimiter}${process.env.PATH}` };
}

for (const result of [
	{ stdout: '' },
	{ stdout: 'v1.2.3\n' },
	{ stdout: '1.2.3\n' },
	{ stderr: 'There is nothing to bump', status: 0 },
	{ stderr: 'There is nothing to bump', status: 1 }
]) {
	test(`safely skips empty, unchanged, or nothing-to-bump output: ${JSON.stringify(result)}`, () => {
		const directory = fixture();
		assert.equal(plan(directory, stubCliff(directory, result)), '');
	});
}

for (const result of [
	{ stderr: 'configuration error', status: 1 },
	{ stdout: 'not-a-version' }
]) {
	test(`fails explicitly on invalid git-cliff output: ${JSON.stringify(result)}`, () => {
		const directory = fixture();
		const actual = spawnSync(process.execPath, [planner], {
			cwd: directory, env: stubCliff(directory, result), encoding: 'utf8'
		});
		assert.notEqual(actual.status, 0);
		assert.equal(actual.stdout, '');
		assert.match(actual.stderr, /git-cliff version calculation failed|Invalid release version/);
	});
}
