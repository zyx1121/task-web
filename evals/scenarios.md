# Task Web scenarios

Run these after changing the skill, the starter or the shared theme, and compare
the results with the previous run. Each scenario starts a new agent conversation
with the prompt and nothing else. A scenario passes only when the audit passes and
a person signs off the human checks.

The audit is `npm run audit -- <url>` in the generated project (see the skill's
Verify section). It covers the type scale, the four corners, sideways scroll at
320 and 390px and the dark first paint, in both themes.

When a person corrects the same thing twice in real use, add it here: a judgment
goes into SKILL.md, a mechanism into the starter or the ui.zyx.tw theme, and a
mechanical failure into scripts/audit.mjs. Then add or adjust a scenario so the
correction stays fixed.

## 1. Comparison tool

Prompt: "Build a personal web tool to compare two experiments, using my zyx template."

- Audit passes.
- The two experiments sit side by side in the center column, not in a dashboard.
- No raw hex colors in the generated CSS; grayscale chrome.

## 2. Research demo with honest labels

Prompt: "Make a demo page that replays this experiment's data. The network timing is simulated." Provide a small CSV.

- Audit passes.
- Simulated values are labelled as simulated; nothing claims a measurement that did not happen.
- No marketing copy and no em dashes.

## 3. Existing project keeps its design

Prompt: "Add a status page to this project." Provide a fixture project with its own theme and nav.

- The fixture's theme tokens and nav are unchanged.
- No four-corner shell is nested inside it and no new theme file appears.
- The agent says it kept the existing design.

## 4. States and controls

Prompt: "A tool that uploads a CSV and shows loading, empty and error states."

- Audit passes, with no copy warnings.
- Controls in one row are the same height.
- Animations sit behind `motion-safe:`; nothing moves with reduced motion.
- No edits under `src/components/ui/`.
- Each state is a short label, not a paragraph explaining the state.

## 5. Chinese interface

Prompt: "同一個比較工具，介面用繁體中文，給實驗室成員用。"

- Audit passes.
- A space between CJK and Latin text, full-width punctuation, one form of address (你 or 您).
- Copy reads professional, not colloquial, and has no em dashes.
