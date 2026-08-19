const commitSections = new Map([
  ['feat', 'Features'],
  ['fix', 'Bug Fixes'],
  ['perf', 'Performance Improvements'],
  ['revert', 'Reverts'],
  ['refactor', 'Code Refactoring'],
  ['docs', 'Documentation'],
  ['style', 'Styles'],
  ['chore', 'Miscellaneous Chores'],
  ['test', 'Tests'],
  ['build', 'Build System'],
  ['ci', 'Continuous Integration'],
]);

const sectionOrder = new Map(
  [...commitSections.values()].map((section, index) => [section, index]),
);

export default {
  branches: ['main'],
  plugins: [
    ['@semantic-release/commit-analyzer', {
      releaseRules: [
        { breaking: true, release: 'major' },
        { type: 'refactor', release: 'patch' },
      ],
    }],
    ['@semantic-release/release-notes-generator', {
      writerOpts: {
        transform: (commit) => ({
          ...commit,
          type: commitSections.get(commit.type) ?? commit.type,
          scope: commit.scope === '*' ? undefined : commit.scope,
          shortHash: commit.hash?.slice(0, 7),
        }),
        commitGroupsSort: (left, right) =>
          (sectionOrder.get(left.title) ?? sectionOrder.size)
          - (sectionOrder.get(right.title) ?? sectionOrder.size),
      },
    }],
    '@semantic-release/changelog',
    ['@semantic-release/npm', { npmPublish: false }],
    ['@semantic-release/exec', {
      prepareCmd: 'pnpm lint && pnpm -s build --minify --force && pnpm pack',
      publishCmd: 'pnpm publish --no-git-checks --provenance',
    }],
    ['@semantic-release/git', {
      assets: ['CHANGELOG.md', 'package.json'],
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
    }],
    ['@semantic-release/github', {
      assets: [{ path: 'd1g1tal-collections-*.tgz' }],
    }],
  ],
};