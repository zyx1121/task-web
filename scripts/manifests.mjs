import { readFile, mkdir, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('plugin.json', root), 'utf8'));
const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
if (pkg.version !== manifest.version) throw new Error('Plugin and package versions must match');
const { $schema, extensions, ...compat } = manifest;
await mkdir(new URL('.claude-plugin/', root), { recursive: true });
await writeFile(new URL('.claude-plugin/plugin.json', root), JSON.stringify(compat, null, 2) + '\n');
