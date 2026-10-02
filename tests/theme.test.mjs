import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderTheme } from '../skills/task-web/assets/starter/scripts/sync-theme.mjs';

test('serializes registry variables, flat theme declarations and nested rules', () => {
  const css = renderTheme({ name: 'theme', type: 'registry:theme',
    cssVars: { light: { radius: '1rem' }, dark: { background: 'oklch(0 0 0)' } },
    css: { '@theme inline': { '--text-xs': '0.875rem' }, '@supports (backdrop-filter: blur(0))': { '[data-slot="dialog-content"]': { 'backdrop-filter': 'blur(12px)' } } },
  });
  assert.ok(css.includes(':root {\n  --radius: 1rem;\n}'));
  assert.ok(css.includes('@theme inline {\n  --text-xs: 0.875rem;\n}'));
  assert.ok(css.includes('  [data-slot="dialog-content"] {\n    backdrop-filter: blur(12px);\n  }'));
  assert.throws(() => renderTheme({ name: 'button', type: 'registry:ui' }), /Expected/);
  assert.throws(() => renderTheme({ name: 'theme', type: 'registry:theme', cssVars: { unknown: {} } }), /Unsupported/);
});
