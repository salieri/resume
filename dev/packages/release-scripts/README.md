# Release Scripts
Generic scripts for managing releases.

## Scripts
* `release-notes` generates release notes between two git tags

## Commands
```bash
pnpm lint
pnpm build
pnpm test
```

## Release Notes CLI
```bash
pnpm release:notes --current-tag v1.2.3 --previous-tag v1.2.2 --output ./release-notes.md
```
