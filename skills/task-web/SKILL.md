---
name: task-web
description: "Build personal web tools, temporary interactive pages and research demos using Loki's zyx template: fixed corners, a focused center and ui.zyx.tw. Use for 個人工具、小任務、臨時網頁、研究 demo or an explicit zyx template request. Preserve an existing product or client design unless the user asks to adopt this template."
---

# Task Web

Use the shared visual shell for personal tasks. Make the requested task the center
of the page. The starter contains no business pages, login, database or AI setup.
Those are optional application features, never prerequisites for a useful demo.

## Choose the integration

- **New standalone task:** use the bundled React + Vite starter. Resolve the skill
  directory from this file, then run `node "<skill-dir>/scripts/create.mjs"
  "<empty-destination>" --title "Task title" --lang zh-TW`. It only copies source;
  it does not install, start a server or deploy. `--description` is optional.
- **Existing React / Next.js project:** reuse its installed primitives and shell
  first. Read [integration](references/integration.md) for the portable TaskShell
  and theme dependencies. Do not scaffold over an existing project or nest four
  corners inside another shell.
- **Configured FDE workspace:** use FDE, when available, to resolve the workspace
  and handle sync/lifecycle/snapshots. This skill supplies the layout only. Keep
  the workspace's live-edit workflow and preserve existing routes and data.

Honor repository and user execution-location rules. In Loki's stack, local work
is editing/git; dependency installation, builds and servers run on the configured
sandbox or the FDE project's own VM. Sync source without .git or node_modules and
retrieve remotely generated manifests/components before another sync.

## Design contract

Before styling, read https://ui.zyx.tw/agent-instructions.md and
https://ui.zyx.tw/index.md. The bundled theme is a tested snapshot, documented in
the starter's DESIGN-SOURCE.md. If the live contract changes, update deliberately
through shadcn and verify the result. Do not recreate tokens from a screenshot or
silently replace an existing app's theme.

- Four fixed corners, 20px inset: zyx mark to www.zyx.tw, task actions at top right,
  Privacy/Terms at bottom left, copyright at bottom right. Its tip says only Loki.
  Put no transforms on ancestors of the fixed corners. Keep actions short enough
  for mobile; additional task controls belong in the central workspace.
- One centered working column with responsive width and room above/below for the
  corners. A comparison or editor may use the wide variant. Avoid surrounding the
  task with a dashboard, sidebar or marketing hero unless the task needs one.
- Use theme tokens and stock shadcn base-nova components. Add only needed primitives
  with the shadcn CLI; do not edit components/ui. Base UI uses render, not asChild.
- Default dark, with light available. Keep fonts Inter, Noto Sans JP/TC and Geist
  Mono for code. Use the current registry type scale, including 16px corner text.
  Dark/light preference in an existing app takes precedence.
- Keep UI chrome grayscale. Colors may encode actual data. Show concise states
  for the task; remove placeholder copy when real content exists. Tooltip bubbles
  stay opaque; floating panels use the registry's transparent 12px blur.

The skill is automatically discoverable in both hosts, but it is not an always-on
instruction or permission to redesign unrelated sites. It works without FDE. A
request to build a demo does not by itself authorize new infrastructure or paid
services. Report the resulting URL/artifact and what was actually verified.
