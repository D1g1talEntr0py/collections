import { spawnSync } from 'node:child_process';

type CliffCommit = {
	conventional: true;
	breaking: boolean;
	raw_message: string;
} | {
	conventional: false;
	raw_message: string;
};

interface CliffRelease {
	commits: CliffCommit[];
	previous?: { version?: string | null } | null;
}

function isCliffCommit(value: unknown): value is CliffCommit {
	return typeof value === 'object' && value !== null
		&& 'conventional' in value && typeof value.conventional === 'boolean'
		&& (!value.conventional || ('breaking' in value && typeof value.breaking === 'boolean'))
		&& 'raw_message' in value && typeof value.raw_message === 'string';
}

function isCliffRelease(value: unknown): value is CliffRelease {
	if (typeof value !== 'object' || value === null
		|| !('commits' in value) || !Array.isArray(value.commits)
		|| !value.commits.every(isCliffCommit)) {
		return false;
	}
	if (!('previous' in value) || value.previous == null) return true;
	return typeof value.previous === 'object'
		&& (!('version' in value.previous) || value.previous.version == null
			|| typeof value.previous.version === 'string');
}

const repository = process.env.GITHUB_REPOSITORY;
if (!repository) {
	throw new Error('GITHUB_REPOSITORY must be set to owner/repository');
}

const args = ['--github-repo', repository, '--offline', '--unreleased'];
const context = spawnSync('git-cliff', [...args, '--context'], { encoding: 'utf8' });
if (context.stderr) process.stderr.write(context.stderr);
if (context.error) throw context.error;
if (context.status !== 0) throw new Error(`git-cliff context failed (${context.status})`);

const releases: unknown = JSON.parse(context.stdout);
if (!Array.isArray(releases) || !releases.every(isCliffRelease)) {
	throw new Error('Invalid release context from git-cliff');
}
const eligible = releases.some(release => release.commits.some(commit =>
	commit.conventional && (
		commit.breaking || /^(feat|fix|perf|revert)(\([^\r\n]*\))?: /.test(commit.raw_message)
	)
));

if (!eligible) {
	console.error('No release-worthy commits since the latest release tag');
} else {
	const result = spawnSync('git-cliff', [...args, '--bumped-version'], { encoding: 'utf8' });
	if (result.stderr) process.stderr.write(result.stderr);
	if (result.error) throw result.error;
	const nothingToBump = /There is nothing to bump/i.test(`${result.stdout}\n${result.stderr}`);
	if (result.status !== 0 && !nothingToBump) {
		throw new Error(`git-cliff version calculation failed (${result.status})`);
	}

	const version = result.stdout.trim().replace(/^v/, '');
	const previousVersion = releases[0]?.previous?.version?.replace(/^v/, '');
	if (nothingToBump || !version || version === previousVersion) {
		console.error('No version bump required');
	} else {
		if (!/^\d+\.\d+\.\d+$/.test(version)) {
			throw new Error(`Invalid release version from git-cliff: ${version}`);
		}
		console.log(version);
	}
}
