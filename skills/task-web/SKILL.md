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
- Use theme tokens and the ui.zyx.tw components. Add only what the task needs with
  `npx shadcn@latest add @zyx1121/<name>`; do not edit components/ui or install
  stock shadcn primitives. Base UI uses render, not asChild.
- Default dark, with light available. Keep fonts Inter, Noto Sans JP/TC and Geist
  Mono for code. Only 80/24/16/14px are legal (display, titles, body and controls,
  captions), at weight 400, or 500 for titles and headings. Dark/light preference
  in an existing app takes precedence.
- Keep UI chrome grayscale. Colors may encode actual data. Tooltip bubbles stay
  opaque; floating panels use the registry's transparent 12px blur.
- Write copy for the person using the page, not for the developer. Keep the title
  and the labels the task needs. Leave out instructions on how to use the page,
  explanations of a state, "results will appear here" and notes about the build.
  An empty state is a short label or nothing at all. Buttons are a verb or two
  (登入, not 以實驗室帳號登入). Inputs carry a label; a placeholder never suggests
  a value. Show what the person reads, never internal codes, ids or field keys.
- When the page cannot handle a real input, fix the tool or system behind it, not
  the page around it.

## Verify

Build, serve it on the development host, then run `npm run audit -- <url>` from
the project. It opens the page in WebKit at 1280, 390 and 320px, in dark and
light, and fails on an illegal font size or weight, a missing corner, sideways
scroll or a light first paint, and on copy that reads like a note to the developer, a
placeholder that suggests a value or a button longer than a short verb. A failed
audit is not done. Report what the audit printed.
[evals/scenarios.md](../../evals/scenarios.md) in the plugin repository holds the
fixed scenarios used to judge changes to this skill.

The skill is automatically discoverable in both hosts, but it is not an always-on
instruction or permission to redesign unrelated sites. It works without FDE. A
request to build a demo does not by itself authorize new infrastructure or paid
services. Report the resulting URL/artifact and what was actually verified.
