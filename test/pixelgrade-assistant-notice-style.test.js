const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const noticeScss = fs.readFileSync(
  path.join(__dirname, '../inc/admin/assistant-notice/notice.scss'),
  'utf8'
);
const noticeCss = fs.readFileSync(
  path.join(__dirname, '../inc/admin/assistant-notice/notice.css'),
  'utf8'
);

test('uses the WordPress admin visual language for the Assistant handoff', () => {
  assert.match(
    noticeScss,
    /--pixassist-accent:\s*var\(--wp-admin-theme-color,\s*#3858e9\)/
  );
  assert.match(noticeScss, /border:\s*1px solid var\(--pixassist-border\)/);
  assert.match(noticeScss, /border-radius:\s*8px/);
  assert.match(noticeScss, /\.pixassist-notice-button[\s\S]*?min-height:\s*40px/);
  assert.match(noticeScss, /&:focus-visible/);

  assert.doesNotMatch(noticeScss, /0 64px 128px/);
  assert.doesNotMatch(noticeScss, /transform:\s*scale\(/);
  assert.doesNotMatch(noticeScss, /@keyframes\s+(?:shake|progress-bg-anim)/);
});

test('keeps the primary action ahead of decorative media on narrow screens', () => {
  assert.match(
    noticeScss,
    /@media only screen and \(max-width:\s*1023px\)[\s\S]*?\.pixassist-notice__media\s*\{[\s\S]*?display:\s*none/
  );
});

test('does not hide unrelated WordPress notices and respects reduced motion', () => {
  assert.doesNotMatch(noticeScss, /(^|\n)\.notice\s*\{/);
  assert.match(noticeScss, /@media \(prefers-reduced-motion:\s*reduce\)/);
});

test('ships compiled notice CSS with the same styling contract', () => {
  assert.match(
    noticeCss,
    /--pixassist-accent:\s*var\(--wp-admin-theme-color,\s*#3858e9\)/
  );
  assert.match(noticeCss, /\.pixassist-notice-button:focus-visible/);
  assert.match(noticeCss, /@media \(prefers-reduced-motion:\s*reduce\)/);
  assert.doesNotMatch(noticeCss, /0 64px 128px/);
  assert.doesNotMatch(noticeCss, /(^|\n)\.notice\s*\{/);
});
