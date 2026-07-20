const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const noticeSource = fs.readFileSync(
  path.join(__dirname, '../inc/admin/assistant-notice/class-notice.php'),
  'utf8'
);

test('presents the approved Pixelgrade LT promise in the Assistant install notice', () => {
  const approvedCopy = [
    'Thanks for choosing %s — you’re off to a lovely start.<br>Let’s make your whole site feel considered.',
    'Install the free Pixelgrade Assistant to bring your Pixelgrade LT setup together in one calm place. No account required.',
    '<strong>A coherent design system</strong> to keep every detail playing nicely together.',
    '<strong>Polished Starter Sites</strong> to adapt, remix, and make unmistakably yours.',
    '<strong>Guided setup and helpful checks</strong> whenever you need a nudge.',
  ];

  approvedCopy.forEach((copy) => {
    assert.ok(noticeSource.includes(copy), `Missing approved notice copy: ${copy}`);
  });
});

test('does not use legacy demo-copy or premium-support promises', () => {
  const retiredCopy = [
    '<strong>Recommended plugins</strong> to boost your site.',
    '<strong>Starter Content</strong> to make your site look like the demo.',
    '<strong>Premium Support</strong> to assist you all the way.',
  ];

  retiredCopy.forEach((copy) => {
    assert.equal(noticeSource.includes(copy), false, `Retired notice copy remains: ${copy}`);
  });
});

test('announces onboarding progress and exposes one button name', () => {
  assert.match(noticeSource, /aria-current="step"/);
  assert.match(noticeSource, /screen-reader-text[^>]*>\s*<\?php esc_html_e\( 'Completed:'/);
  assert.match(
    noticeSource,
    /pixassist-notice-button__overlay" aria-hidden="true"/
  );
});

test('treats the supporting theme screenshot as decorative', () => {
  assert.match(noticeSource, /^\s*<img[^\n]*alt=""[^\n]*$/m);
});
