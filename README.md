# Ume Client 

## Getting Started

Install all recommendation extensions/plugins for Visual Studio Code text editor

To start the development server:

```bash
yarn global add turbo
yarn global add tsup
yarn install
yarn dev:client ## For portal
```

## Git Conventional

The commit contains the following structural elements, to communicate intent to the consumers of your library:

- fix: a commit of the type fix patches a bug in your codebase (this correlates with PATCH in Semantic Versioning).
- feat: a commit of the type feat introduces a new feature to the codebase (this correlates with MINOR in Semantic Versioning).
- BREAKING CHANGE: a commit that has a footer BREAKING CHANGE:, or appends a ! after the type/scope, introduces a breaking API change
  (correlating with MAJOR in Semantic Versioning). A BREAKING CHANGE can be part of commits of any type. types other than fix: and feat: are allowed, for example @commitlint/config-conventional (based on the the Angular convention) recommends
- build:, chore:, ci:, docs:, style:, refactor:, perf:, test:, and others.

More information at: [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
