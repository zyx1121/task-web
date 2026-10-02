# Task Web

Read README.md and skills/task-web/SKILL.md before changing the plugin. The
portable plugin.json is canonical; scripts/manifests.mjs generates the Claude
compatibility manifest. Both hosts load the same skill and starter.

Keep this package focused on personal task presentation and scaffolding. FDE owns
configured environments and operations. ui.zyx.tw owns theme tokens and additions;
stock shadcn base-nova owns components/ui. Do not add application-specific data,
accounts, authentication, AI providers, MCP servers or hooks to the starter.

Run installs, builds and tests in the configured development sandbox, not the
author's Mac. Use an isolated directory and port. npm run check validates the
scaffolder. The starter also requires npm ci and npm run build. Use WebKit for
browser verification. Commit generated manifests and the starter lockfile.

Use SemVer. After checks and PR merge, tag a release and pin its commit in
zyx1121/marketplace. Plugin installation never builds or installs app dependencies.
