const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('intro animation scss defines effect-specific duration, delay, and easing presets', () => {
  const filePath = path.join(__dirname, '..', 'src', 'scss', 'components', '_intro-animations.scss');
  const scss = fs.readFileSync(filePath, 'utf8');

  assert.match(
    scss,
    /body\.has-intro-animations--fade\s*\{[\s\S]*?--anima-intro-easing:\s*linear;[\s\S]*?--anima-intro-delay-window:\s*0\.6s;/,
  );
  assert.match(
    scss,
    /body\.has-intro-animations--fade\.has-intro-animations--medium\s*\{[\s\S]*?--anima-intro-duration:\s*0\.90s;/,
  );
  assert.match(
    scss,
    /body\.has-intro-animations--scale,\s*body\.has-intro-animations--slide\s*\{[\s\S]*?--anima-intro-easing:\s*cubic-bezier\(0\.19,\s*1,\s*0\.22,\s*1\);[\s\S]*?--anima-intro-delay-window:\s*0\.6s;/,
  );
  assert.match(
    scss,
    /body\.has-intro-animations--scale\.has-intro-animations--slow\s*\{[\s\S]*?--anima-intro-duration:\s*1\.20s;/,
  );
  assert.match(
    scss,
    /body\.has-intro-animations--slide\.has-intro-animations--fast\s*\{[\s\S]*?--anima-intro-duration:\s*0\.45s;/,
  );
  assert.match(
    scss,
    /body\.has-intro-animations--clip,\s*body\.has-intro-animations--flex\s*\{[\s\S]*?--anima-intro-easing:\s*cubic-bezier\(0\.19,\s*1,\s*0\.22,\s*1\);[\s\S]*?--anima-intro-delay-window:\s*1\.0s;/,
  );
  assert.match(
    scss,
    /body\.has-intro-animations--clip\.has-intro-animations--medium\s*\{[\s\S]*?--anima-intro-duration:\s*0\.65s;/,
  );
  assert.match(
    scss,
    /body\.has-intro-animations--flex\.has-intro-animations--fast\s*\{[\s\S]*?--anima-intro-duration:\s*0\.50s;/,
  );
});
