# Task Web

Codex and Claude Code plugin with one skill, `task-web`, that scaffolds and audits personal task pages. Read [README.md](README.md) and [skills/task-web/SKILL.md](skills/task-web/SKILL.md) before you change it.

## Rules

- The root `plugin.json` is the source of truth. `scripts/manifests.mjs` generates `.claude-plugin/plugin.json`. Commit the generated manifest and the starter lockfile.
- Keep the package on personal task pages and scaffolding. FDE owns configured environments and their operations. ui.zyx.tw owns the tokens and the components in `components/ui` (`@zyx1121/<name>`).
- Do not add app data, accounts, sign-in, AI providers, MCP servers or hooks to the starter.
- Plugin install never builds and never installs app dependencies.
- Repository documents and code comments are English.

## Verify

```sh
npm run check
node skills/task-web/scripts/create.mjs "$TMP/smoke" --title "Smoke" --lang en
cd "$TMP/smoke" && npm ci && npm run build && npm run audit -- <preview-url>
```

Run installs, builds and tests on the sandbox, not on the author's Mac. Use an isolated directory and port. Use WebKit for browser tests.

## Release

Use SemVer. After the PR merges, tag the release and pin its commit in `zyx1121/marketplace`.
