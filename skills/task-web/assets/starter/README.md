# Personal task

A focused React workspace using the Task Web shell and ui.zyx.tw theme.

Edit src/App.tsx for the task and src/task.config.json for its identity. Keep
index.html metadata aligned. No auth, database, analytics or provider is included.

On your configured development host:

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5173
npm run build
```

Choose a dedicated port on a shared host. Serve dist as static files. Follow the
parent workspace's deployment workflow; this starter does not deploy itself.

Dark is the initial theme. The corner button or d switches themes. Fonts are
self-hosted. See DESIGN-SOURCE.md for provenance and theme refresh instructions.
