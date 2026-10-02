#!/usr/bin/env node
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const usage = 'node create.mjs <empty-destination> [--title "My task"] [--description "..."] [--lang en|zh-TW]';
const escapeHTML = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

async function create() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { title: { type: 'string' }, description: { type: 'string' }, lang: { type: 'string', default: 'en' }, help: { type: 'boolean' } },
  });
  if (values.help) return console.log(usage);
  if (positionals.length !== 1) throw new Error(usage);
  if (!['en', 'zh-TW'].includes(values.lang)) throw new Error('--lang must be en or zh-TW');
  const destination = resolve(positionals[0]);
  let stat;
  try { stat = await lstat(destination); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (stat && (!stat.isDirectory() || (await readdir(destination)).length)) {
    throw new Error('Destination must be an empty directory or a new path. No files were changed.');
  }
  const config = { title: values.title ?? 'My task', description: values.description ?? '', lang: values.lang };
  if (!config.title.trim()) throw new Error('--title cannot be blank');
  await mkdir(dirname(destination), { recursive: true });
  const staging = await mkdtemp(join(dirname(destination), '.task-web-'));
  try {
    const source = fileURLToPath(new URL('../assets/starter/', import.meta.url));
    await cp(source, staging, { recursive: true, filter: path => !['node_modules', 'dist', '.git', '.DS_Store'].includes(basename(path)) });
    await writeFile(join(staging, 'src/task.config.json'), JSON.stringify(config, null, 2) + '\n');
    const pkg = JSON.parse(await readFile(join(staging, 'package.json'), 'utf8'));
    pkg.name = basename(destination).toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/^-+|-+$/g, '') || 'my-task';
    await writeFile(join(staging, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
    const lock = JSON.parse(await readFile(join(staging, 'package-lock.json'), 'utf8'));
    lock.name = pkg.name;
    lock.packages[''].name = pkg.name;
    await writeFile(join(staging, 'package-lock.json'), JSON.stringify(lock, null, 2) + '\n');
    const html = await readFile(join(staging, 'index.html'), 'utf8');
    await writeFile(join(staging, 'index.html'), html
      .replace(/<html[^>]*>/, `<html lang="${config.lang}" class="dark">`)
      .replace(/<title>[^]*?<\/title>/, () => `<title>${escapeHTML(config.title)}</title>`)
      .replace(/<meta name="description"[^>]*>/, () => `<meta name="description" content="${escapeHTML(config.description)}" />`));
    await rename(staging, destination);
    console.log(JSON.stringify({ destination, ...config, next: 'Edit src/App.tsx; install and run on your configured development host.' }, null, 2));
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}

create().catch(error => { console.error(error.message); process.exitCode = 1; });
