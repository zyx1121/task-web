import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderTheme } from '../skills/task-web/assets/starter/scripts/sync-theme.mjs';

test('serializes the base: imports first, color aliases, nested rules and @apply', () => {
  const css = renderTheme({ name: 'base', type: 'registry:base',
    cssVars: { theme: { 'text-*': 'initial', 'text-body': '1rem' }, light: { background: 'oklch(1 0 0)', radius: '1rem' }, dark: { background: 'oklch(0 0 0)' } },
    css: { '@import "tw-animate-css"': {}, '@layer base': { body: { '@apply bg-background text-body': {} } }, '@utility w-menu': { width: 'calc(var(--anchor-width) + 0.5rem)' } },
  }, [{ css: { '[data-slot="corner-edge"]': { 'backdrop-filter': 'blur(12px)' } } }]);
  assert.ok(css.indexOf('@import "tw-animate-css";') < css.indexOf('@theme inline'));
  assert.ok(css.includes('  --text-*: initial;\n'));
  assert.ok(css.includes('  --color-background: var(--background);\n'));
  assert.ok(!css.includes('--color-radius'));
  assert.ok(css.includes(':root {\n  --background: oklch(1 0 0);\n  --radius: 1rem;\n}'));
  assert.ok(css.includes('.dark {\n  --background: oklch(0 0 0);\n}'));
  assert.ok(css.includes('  body {\n    @apply bg-background text-body;\n  }'));
  assert.ok(css.includes('[data-slot="corner-edge"] {\n  backdrop-filter: blur(12px);\n}'));
  assert.throws(() => renderTheme({ name: 'theme', type: 'registry:theme' }), /Expected/);
  assert.throws(() => renderTheme({ name: 'base', type: 'registry:base', cssVars: { unknown: {} } }), /Unsupported/);
});
