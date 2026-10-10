import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// The tokens come from the ui.zyx.tw base item; the corner fade comes from the
// corners item, whose component this starter keeps as a portable copy.
const registry = 'https://ui.zyx.tw/r';
const items = ['base', 'corners'];
const root = new URL('../', import.meta.url);

function rule(selector, value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Expected an object for ${selector}`);
  const body = Object.entries(value).map(([key, item]) => {
    if (typeof item === 'object') return Object.keys(item).length || !key.startsWith('@apply') ? rule(key, item) : `${key};`;
    if (typeof item !== 'string' && typeof item !== 'number') throw new Error(`Invalid CSS value: ${key}`);
    return `${key}: ${item};`;
  }).join('\n');
  return `${selector} {\n${body.split('\n').map(line => '  ' + line).join('\n')}\n}`;
}

const vars = values => Object.fromEntries(Object.entries(values).map(([key, value]) => [`--${key}`, value]));

// shadcn writes a --color-* alias for every color variable of a base; the
// serializer does the same so bg-background and friends exist.
export function renderTheme(base, extra = []) {
  if (base.name !== 'base' || base.type !== 'registry:base') throw new Error('Expected the ui.zyx.tw base registry item');
  const { theme = {}, light = {}, dark = {} } = base.cssVars ?? {};
  for (const mode of Object.keys(base.cssVars ?? {})) if (!['theme', 'light', 'dark'].includes(mode)) throw new Error(`Unsupported theme mode: ${mode}`);
  const colors = [...new Set([...Object.keys(light), ...Object.keys(dark)])].filter(key => key !== 'radius');
  const imports = [];
  const rules = [];
  for (const item of [base, ...extra]) {
    for (const [selector, value] of Object.entries(item.css ?? {})) {
      if (selector.startsWith('@import ')) imports.push(`${selector};`);
      else rules.push(rule(selector, value));
    }
  }
  return [
    '/* Generated from https://ui.zyx.tw/r/base.json and corners.json. Run npm run theme:sync. */',
    ...imports,
    rule('@theme inline', { ...vars(theme), ...Object.fromEntries(colors.map(key => [`--color-${key}`, `var(--${key})`])) }),
    rule(':root', vars(light)),
    rule('.dark', vars(dark)),
    ...rules,
  ].join('\n\n') + '\n';
}

async function load(name, files) {
  if (files[name]) return readFile(resolve(files[name]), 'utf8');
  const response = await fetch(`${registry}/${name}.json`, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`${name}.json fetch failed: ${response.status}`);
  return response.text();
}

async function sync() {
  const args = process.argv.slice(2);
  const files = {};
  for (let i = 0; i < args.length; i += 2) {
    const name = { '--base': 'base', '--corners': 'corners' }[args[i]];
    if (!name || !args[i + 1]) throw new Error('Usage: sync-theme.mjs [--base base.json] [--corners corners.json]');
    files[name] = args[i + 1];
  }
  const raw = await Promise.all(items.map(name => load(name, files)));
  const [base, ...extra] = raw.map(text => JSON.parse(text));
  await writeFile(new URL('src/zyx-theme.css', root), renderTheme(base, extra));
  const sources = items.map((name, i) => ({ source: `${registry}/${name}.json`, sha256: createHash('sha256').update(raw[i]).digest('hex') }));
  await writeFile(new URL('theme-source.json', root), JSON.stringify(sources, null, 2) + '\n');
  console.log(`Updated the theme from ${items.join(' and ')}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  sync().catch(error => { console.error(error.message); process.exitCode = 1; });
}
