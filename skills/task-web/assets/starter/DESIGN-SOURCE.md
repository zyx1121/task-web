# Design sources

Validated snapshot: 2026-10-10.

- Tokens: https://ui.zyx.tw/r/base.json and the corner fade from
  https://ui.zyx.tw/r/corners.json, SHA-256 in theme-source.json.
- Contract: https://github.com/zyx1121/www.zyx.tw/blob/main/apps/ui/DESIGN.md.
- Button, Tooltip and lib/utils.ts: the registry items `@zyx1121/button`,
  `@zyx1121/tooltip` and `@zyx1121/utils`, unmodified.
- Corners, tips and mark: zyx1121/www.zyx.tw at 2b4d31d, packages/ui/src/components,
  with next/link replaced by a plain anchor for portable React.
- Inter 4.1 self-hosted; Noto Sans JP/TC and Geist Mono from Fontsource variable
  packages, all served locally. base.css maps them to the `--font-*` variables the
  base expects (next/font sets those in Next.js).
- Inter is distributed under the SIL Open Font License in src/fonts/LICENSE.txt.

npm run theme:sync reads the registry and rewrites src/zyx-theme.css and its hash.
It does not fetch at runtime. Review and build after a refresh.
