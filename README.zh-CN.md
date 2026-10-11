<!-- 翻译自 README.md @ docs/readme-template-v2。只翻 "For AI agents" 以上的章节，英文版更新时一起改。 -->

<div align="center">

<h1>Task Web</h1>

<p><strong>在 Codex 与 Claude Code 里，给小型网页任务一个熟悉的家。</strong></p>

[![Check](https://img.shields.io/github/actions/workflow/status/zyx1121/task-web/check.yml?branch=main&style=flat-square&label=check)](https://github.com/zyx1121/task-web/actions)
[![Release](https://img.shields.io/github/v/release/zyx1121/task-web?style=flat-square&sort=semver)](https://github.com/zyx1121/task-web/releases)
[![Node](https://img.shields.io/badge/node-22.12%2B-339933?style=flat-square&logo=node.js&logoColor=white)](package.json)
[![License](https://img.shields.io/github/license/zyx1121/task-web?style=flat-square)](LICENSE)

[English](README.md) | [繁體中文](README.zh-TW.md) | **简体中文**

</div>

![用 Task Web 做的研究 demo](docs/relay-preview.png)

个人工具或研究 demo 应该从任务本身开始，而不是先排版。Task Web 给每个任务固定的四个角落与专注的工作区，套用 ui.zyx.tw 主题。它不含目录、发票、登录或数据库。可以看[在线研究示例](https://dev.zyx.tw/semantic-gateway.html)。

## 功能

- **开新任务**：一条命令复制干净的 React 与 Vite 起始项目。
- **复用外壳**：把四角加进现有的 React 或 Next.js 项目。
- **两个宿主都能用**：Codex 与 Claude Code 找到同一个 skill。
- **检查成果**：页面违反主题、字号、四角或文案规则时，`npm run audit` 会失败。

## 快速开始

```sh
# Claude Code
claude plugin marketplace add zyx1121/marketplace
claude plugin install task-web@zyx1121

# Codex
codex plugin marketplace add zyx1121/marketplace
codex plugin add task-web@zyx1121
```

开新对话，直接说：「用我的 zyx 模板做一个比较两个实验的个人网页工具。」

## 使用方式

- **指名使用**：Claude Code 用 `/task-web:task-web`，Codex 用 `$task-web`。
- **不通过 agent**，需要 Node.js 22.12 以上：

  ```sh
  node skills/task-web/scripts/create.mjs /path/to/new-task --title "My experiment" --lang en
  cd /path/to/new-task
  npm ci
  npm run dev -- --host 127.0.0.1 --port 5173
  ```

  目标目录必须为空或不存在。命令不会覆盖已有内容。任务内容改 `src/App.tsx`，名称改 `src/task.config.json`。
- **在现有项目里**：按[集成指南](skills/task-web/references/integration.md)操作。复用它的 provider 与外壳，不要在上面重新生成项目。

| 包 | 负责 |
|----|------|
| Task Web | 选模板、生成源码、组出四角外壳 |
| [ui.zyx.tw](https://ui.zyx.tw) | 管理 token 与 Base UI 组件(`@zyx1121/<name>`) |
| [FDE](https://github.com/zyx1121/fde) | 操作已配置好的工作环境：同步与快照 |

## 配置

没有配置，也没有密钥。plugin 安装时不运行 MCP server、hook 或构建。起始项目在编写时复制 registry，[DESIGN-SOURCE.md](skills/task-web/assets/starter/DESIGN-SOURCE.md) 记录来源版本与更新主题的命令。

## 限制

- 不含主机、账号或付费服务。`npm run build` 产出静态文件，部署由你负责。
- 这个 skill 用于个人工具、临时页面与研究 demo。客户自己的设计会保留。

## 其他

给 AI agent 的结构化信息与开发说明在[英文版](README.md#for-ai-agents)。

## 许可证

[MIT](LICENSE)。字体许可证附在各自的文件或包里。
