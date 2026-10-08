#!/usr/bin/env node
// Measure a rendered page against the zyx contract (ui.zyx.tw DESIGN.md):
// type scale, four corners, no sideways scroll, dark first and copy written for
// the person using the page.
import { parseArgs } from 'node:util';

const usage = 'npm run audit -- <url> [--browser webkit|chromium] [--home https://www.zyx.tw]';
const SIZES = [14, 16, 24, 80];
const WEIGHTS = [400, 500];
const VIEWPORTS = [{ width: 1280, height: 800 }, { width: 390, height: 844 }, { width: 320, height: 640 }];
const INSET = 20;
// Sentences written for the developer or the agent, not for the person using the page.
const NOTES = [
  /\b(?:todo|lorem ipsum|placeholder)\b/i,
  /\b(?:will|would) (?:appear|show up|be shown) here\b/i,
  /\breplace (?:this|me)\b/i,
  /(?:會|將)(?:顯示|出現)在(?:這裡|此處)/,
  /(?:這裡|此處)(?:會|將)/,
  // Instructions on how to use the page.
  /\b(?:click (?:here|the)|you can|feel free to)\b/i,
  /^(?:請先|請點|點擊|點選|按下)|(?:你|您)可以/,
];
// Placeholders name nothing; they must not suggest a value.
const SUGGESTION = /^(?:e\.g\.|eg[:.]|ex[:.]|such as|for example)|例如|比如|範例[:：]/i;
// Buttons are a verb or two.
const BUTTON = { words: 3, cjk: 6 };

function measure({ sizes, weights, inset, notes, suggestion, button }) {
  const visible = element => {
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    return style.visibility !== 'hidden' && style.display !== 'none' && Number(style.opacity) > 0 && box.width > 0 && box.height > 0;
  };
  const describe = element => {
    const id = element.id ? `#${element.id}` : '';
    const slot = element.dataset.slot ? `[data-slot=${element.dataset.slot}]` : '';
    return `${element.tagName.toLowerCase()}${id}${slot}`;
  };
  const snippet = text => text.replace(/\s+/g, ' ').trim().slice(0, 40);
  const type = new Map();
  const copy = new Set();
  for (const element of document.body.querySelectorAll('*')) {
    if (element.closest('svg, script, style, noscript, [aria-hidden=true]')) continue;
    const field = element.matches('input:not([type=hidden]), textarea, select');
    const own = [...element.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join('');
    const text = field ? element.value || element.getAttribute('placeholder') || '' : own;
    if (!text.trim() || !visible(element)) continue;
    const style = getComputedStyle(element);
    const size = Math.round(parseFloat(style.fontSize) * 100) / 100;
    const weight = Number(style.fontWeight);
    // Bold is real emphasis in prose, and code highlighting owns its weights.
    const emphasis = element.closest('strong, b, code, pre');
    if (!sizes.includes(size) || (!emphasis && !weights.includes(weight))) {
      const key = `${size}px/${weight} ${describe(element)}`;
      if (!type.has(key)) type.set(key, snippet(text));
    }
    for (const note of notes) if (new RegExp(note.source, note.flags).test(text)) copy.add(snippet(text));
    const hint = element.getAttribute('placeholder');
    if (field && hint && new RegExp(suggestion.source, suggestion.flags).test(hint.trim())) copy.add(`placeholder suggests a value: ${snippet(hint)}`);
  }
  for (const element of document.body.querySelectorAll('button, [role=button], a[data-slot=button]')) {
    if (!visible(element)) continue;
    const label = element.textContent.replace(/\s+/g, ' ').trim();
    const cjk = (label.match(/[\u3400-\u9fff]/g) ?? []).length;
    const words = label.replace(/[\u3400-\u9fff]/g, ' ').split(' ').filter(Boolean).length;
    if (cjk > button.cjk || words > button.words) copy.add(`button is not a short verb: ${snippet(label)}`);
  }
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const near = (a, b) => Math.abs(a - b) <= 1;
  const fixed = [...document.body.querySelectorAll('*')].filter(element => getComputedStyle(element).position === 'fixed' && visible(element));
  const boxes = fixed.map(element => ({ element, box: element.getBoundingClientRect() }));
  const corner = test => boxes.find(({ box }) => test(box))?.element;
  const corners = {
    'top-left': corner(box => near(box.left, inset) && near(box.top, inset)),
    'top-right': corner(box => near(box.right, vw - inset) && near(box.top, inset)),
    'bottom-left': corner(box => near(box.left, inset) && near(box.bottom, vh - inset)),
    'bottom-right': corner(box => near(box.right, vw - inset) && near(box.bottom, vh - inset)),
  };
  const mark = corners['top-left']?.querySelector('a[href]')?.href ?? null;
  const wide = [...document.body.querySelectorAll('*')]
    .filter(element => visible(element) && element.getBoundingClientRect().right > vw + 1)
    .slice(0, 5)
    .map(element => `${describe(element)} right=${Math.round(element.getBoundingClientRect().right)}`);
  return {
    type: [...type].map(([key, text]) => `${key} "${text}"`),
    copy: [...copy],
    missing: Object.entries(corners).filter(([, element]) => !element).map(([at]) => at),
    mark,
    overflow: document.documentElement.scrollWidth > vw + 1 ? wide : [],
  };
}

async function audit() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { browser: { type: 'string', default: 'webkit' }, home: { type: 'string', default: 'https://www.zyx.tw' }, help: { type: 'boolean' } },
  });
  if (values.help) return console.log(usage);
  if (positionals.length !== 1) throw new Error(usage);
  if (!['webkit', 'chromium'].includes(values.browser)) throw new Error('--browser must be webkit or chromium');
  const playwright = await import('playwright');
  const browser = await playwright[values.browser].launch();
  const failures = [];
  const copy = new Set();
  const fail = (check, where, details) => failures.push(`FAIL ${check} @ ${where}\n${details.map(line => `  ${line}`).join('\n')}`);
  try {
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
      await page.goto(positionals[0], { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const size = `${viewport.width}x${viewport.height}`;
      if (!(await page.evaluate(() => document.documentElement.classList.contains('dark')))) fail('dark-first', size, ['<html> does not start with class="dark"']);
      for (const theme of ['dark', 'light']) {
        await page.evaluate(dark => document.documentElement.classList.toggle('dark', dark), theme === 'dark');
        const where = `${size} ${theme}`;
        const result = await page.evaluate(measure, { sizes: SIZES, weights: WEIGHTS, inset: INSET, notes: NOTES.map(note => ({ source: note.source, flags: note.flags })), suggestion: { source: SUGGESTION.source, flags: SUGGESTION.flags }, button: BUTTON });
        if (result.type.length) fail('type-scale', where, [`only ${SIZES.join('/')}px at weight ${WEIGHTS.join('/')} are legal`, ...result.type]);
        if (result.missing.length) fail('corners', where, [`no fixed element ${INSET}px in from: ${result.missing.join(', ')}`]);
        else if (result.mark !== null && new URL(result.mark).origin !== new URL(values.home, positionals[0]).origin) fail('corners', where, [`top-left links to ${result.mark}, expected ${values.home}`]);
        if (result.overflow.length) fail('overflow', where, ['page scrolls sideways; widest elements:', ...result.overflow]);
        for (const text of result.copy) copy.add(text);
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
  if (copy.size) fail('copy', 'all viewports', ['write for the person using the page, not the developer', ...[...copy].map(text => `"${text}"`)]);
  for (const failure of failures) console.error(failure);
  if (failures.length) process.exitCode = 1;
  else console.log(`PASS ${VIEWPORTS.length} viewports x dark/light: type scale, corners, no sideways scroll, dark first, copy`);
}

audit().catch(error => { console.error(error.message); process.exitCode = 1; });
