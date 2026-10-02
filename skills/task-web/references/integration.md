# Integrating the shell

The starter lives at `assets/starter/`, relative to the skill directory.
It uses React, Tailwind CSS 4, stock shadcn base-nova and the ui.zyx.tw theme.
`TaskShell` is an app composition, not a registry item or an npm package.

## New project

Run `scripts/create.mjs <empty-destination> --title "My task" --lang en` from any
working directory. `--description` is optional. Existing files are never replaced.
Edit `src/App.tsx` for task behavior and `src/task.config.json` for identity.
After changing metadata, keep index.html's title, description and lang aligned.
Install with `npm ci`, build with `npm run build`, and serve using a dedicated
port on the configured remote development host. Vite's relative asset base allows
the built site to be served at a subpath as well as the domain root.

## Existing project

Inspect the existing shell before copying anything. If it already provides the
four corners, supply task content and top-right actions through that shell.
Otherwise, copy these app compositions from the starter's src/components:

- task-shell.tsx, corners.tsx, corner-tip.tsx and zyx-mark.tsx.
- task-theme.tsx only if the app has no existing theme provider/control.

Adapt import aliases to the target. The shell uses normal anchors and has no
Vite or Next.js dependency. In Next.js, retain the client boundary in TaskShell
and use the existing root layout, fonts and theme provider. Do not replace an
application layout, auth guard or global CSS with the starter's equivalents.

Install `tooltip` and, when using the bundled theme control, `button` from stock
shadcn base-nova. `lib/utils.ts` provides cn. Do not copy or edit older primitive
implementations to sidestep the current CLI. Fonts belong to the consuming app.

```tsx
<TaskShell title="Relay experiment" actions={<TaskActions />} wide>
  <RelayExperiment />
</TaskShell>
```

TaskShell reserves the bottom-left corner for shared legal links. Put source
links, methods and experiment caveats in the task itself. Use the width prop only
when the working surface needs it. No background bars or extra chrome are needed.

## Registry updates

The registry copies source at installation time. It is not a live dependency.
Read the current design contract before updating. The starter carries a registry
serializer to work around the current shadcn theme importer error. In a scaffolded
project run:

```sh
npm run theme:sync
npx shadcn@latest add button tooltip
```

Keep style=base-nova (Base UI), respect the project's package manager and inspect the diff
before accepting a refresh. The tested snapshot's provenance is in
`assets/starter/DESIGN-SOURCE.md`. Update that file when releasing a new snapshot.
Do not invent a task-shell registry endpoint; the shell belongs to this plugin.
