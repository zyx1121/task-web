<div align="center">

<h1>Task Web</h1>

<p><strong>A familiar home for small web tasks in Codex and Claude Code.</strong></p>

[![Check](https://img.shields.io/github/actions/workflow/status/zyx1121/task-web/check.yml?branch=main&style=flat-square&label=check)](https://github.com/zyx1121/task-web/actions)
[![Release](https://img.shields.io/github/v/release/zyx1121/task-web?style=flat-square&sort=semver)](https://github.com/zyx1121/task-web/releases)
[![Node](https://img.shields.io/badge/node-22.12%2B-339933?style=flat-square&logo=node.js&logoColor=white)](package.json)
[![License](https://img.shields.io/github/license/zyx1121/task-web?style=flat-square)](LICENSE)

**English** | [繁體中文](README.zh-TW.md) | [简体中文](README.zh-CN.md)

</div>

![A research demo built with Task Web](docs/relay-preview.png)

A personal tool or a research demo should start with the task, not with layout work. Task Web gives each one four fixed corners and a focused work area in the ui.zyx.tw theme. It has no catalog, invoices, sign-in or database. See the [live research example](https://dev.zyx.tw/semantic-gateway.html).

## Features

- **Starts a task**: one command copies a clean React and Vite starter.
- **Reuses the shell**: add the four corners to an existing React or Next.js project.
- **Works in two hosts**: Codex and Claude Code find the same skill.
- **Checks the result**: `npm run audit` fails a page that breaks the theme, the type scale, the corners or the copy rules.

## Quick start

```sh
# Claude Code
claude plugin marketplace add zyx1121/marketplace
claude plugin install task-web@zyx1121

# Codex
codex plugin marketplace add zyx1121/marketplace
codex plugin add task-web@zyx1121
```

Start a new conversation and ask: "Build a personal web tool to compare two experiments, using my zyx template."

## Usage

- **By name**: `/task-web:task-web` in Claude Code, `$task-web` in Codex.
- **Without an agent**, with Node.js 22.12 or later:

  ```sh
  node skills/task-web/scripts/create.mjs /path/to/new-task --title "My experiment" --lang en
  cd /path/to/new-task
  npm ci
  npm run dev -- --host 127.0.0.1 --port 5173
  ```

  The destination must be empty or absent. The command does not overwrite work. Edit `src/App.tsx` for the task and `src/task.config.json` for its name.
- **In an existing project**: follow the [integration guide](skills/task-web/references/integration.md). Reuse its providers and shell, and do not scaffold over it.

| Package | Job |
|---------|-----|
| Task Web | Picks the template, scaffolds the source and builds the four-corner shell |
| [ui.zyx.tw](https://ui.zyx.tw) | Owns the tokens and the Base UI components (`@zyx1121/<name>`) |
| [FDE](https://github.com/zyx1121/fde) | Operates a configured workspace: sync and snapshots |

## Configuration

No settings and no secrets. The plugin runs no MCP server, no hook and no build at install time. The starter copies the registry at authoring time, and [DESIGN-SOURCE.md](skills/task-web/assets/starter/DESIGN-SOURCE.md) records the source versions and the theme refresh command.

## Limits

- No hosting, accounts or paid providers. `npm run build` gives static files, and you deploy them.
- The skill is for personal tools, temporary pages and research demos. It keeps a client's own design.

## For AI agents

Facts for coding agents and LLM tools. The rules for changing the code are in [AGENTS.md](AGENTS.md).

- **Summary**: Codex and Claude Code plugin with one skill that scaffolds and audits React task pages in the ui.zyx.tw four-corner shell.
- **Type**: plugin
- **Interfaces**: skill `task-web`, CLI `node skills/task-web/scripts/create.mjs <dir> --title <t> --lang <en|zh-TW>`, starter script `npm run audit -- <url>`
- **Install**: `claude plugin install task-web@zyx1121` or `codex plugin add task-web@zyx1121`, from `zyx1121/marketplace`
- **Run**: in a scaffolded app, `npm ci && npm run dev`
- **Verify**: `npm run check` here. In a scaffolded app, `npm ci && npm run build`, then `npm run audit -- <url>`.
- **Config**: none. `src/task.config.json` in each app.
- **Secrets**: none
- **Limits**: Node.js 22.12 or later. The plugin never installs app dependencies.

## Development

```sh
npm run check   # regenerate the Claude manifest and run the tests
```

The root `plugin.json` is the source of truth. `scripts/manifests.mjs` generates `.claude-plugin/plugin.json`. CI also scaffolds an app, builds it and runs the audit in WebKit. After a release, pin the release commit in [zyx1121/marketplace](https://github.com/zyx1121/marketplace).

## License

[MIT](LICENSE). Font licenses come with their files or packages.
