const config = {
  branches: ["feat/setup_example"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        parserOpts: {
          mergePattern: /^Merge pull request #(\d+) from (.*)$/,
          mergeCorrespondence: ["id", "source"],
        },
      },
    ],
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
        changelogTitle: "# Backend Example Module Changelog",
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: [
          "CHANGELOG.md",
          "docs",
          "src",
          "templates",
          "Dockerfile",
          "README.md",
          "package.json",
          "tsconfig.json",
          "yarn.lock",
        ],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    '@semantic-release/github'
  ],
};

module.exports = config;
