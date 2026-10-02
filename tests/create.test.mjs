import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const script = fileURLToPath(new URL('../skills/task-web/scripts/create.mjs', import.meta.url));

test('creates a relocatable starter and safely encodes task metadata', async t => {
  const dir = await mkdtemp(join(tmpdir(), 'task-web-test-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const destination = join(dir, '研究 Demo');
  const title = 'A </title><script>alert("x")</script> & $&';
  const description = '" onload="bad() <hello>';
  await run(process.execPath, [script, destination, '--title', title, '--description', description, '--lang', 'zh-TW'], { cwd: tmpdir() });
  const config = JSON.parse(await readFile(join(destination, 'src/task.config.json'), 'utf8'));
  assert.deepEqual(config, { title, description, lang: 'zh-TW' });
  const html = await readFile(join(destination, 'index.html'), 'utf8');
  assert.ok(html.includes('&lt;/title&gt;&lt;script&gt;'));
  assert.ok(html.includes('&quot; onload=&quot;bad() &lt;hello&gt;'));
  assert.ok(html.includes('<html lang="zh-TW" class="dark">'));
  const pkg = JSON.parse(await readFile(join(destination, 'package.json'), 'utf8'));
  const lock = JSON.parse(await readFile(join(destination, 'package-lock.json'), 'utf8'));
  assert.equal(pkg.name, 'demo');
  assert.equal(lock.packages[''].name, pkg.name);
  assert.equal(lock.name, pkg.name);
  assert.ok(!(await readdir(destination)).includes('node_modules'));
});

test('refuses existing content and directory symlinks without changing them', async t => {
  const dir = await mkdtemp(join(tmpdir(), 'task-web-test-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  await writeFile(join(dir, 'keep.txt'), 'user data');
  await assert.rejects(run(process.execPath, [script, dir]), /Destination must be an empty/);
  assert.equal(await readFile(join(dir, 'keep.txt'), 'utf8'), 'user data');
  const link = join(dir, 'linked');
  await symlink(dir, link);
  await assert.rejects(run(process.execPath, [script, link]), /Destination must be an empty/);
  assert.equal(await readFile(join(dir, 'keep.txt'), 'utf8'), 'user data');
});

test('rejects invalid arguments before creating output', async t => {
  const dir = await mkdtemp(join(tmpdir(), 'task-web-test-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  await assert.rejects(run(process.execPath, [script, join(dir, 'new'), '--lang', 'unknown']), /--lang must be/);
  assert.deepEqual(await readdir(dir), []);
});
