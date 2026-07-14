const test = require('node:test');
const assert = require('node:assert/strict');

const wporgBuild = require('../tasks/build-wporg');

test('removes orphaned line and block source-map references from wp.org assets', () => {
  assert.equal(typeof wporgBuild.stripSourceMapReferences, 'function');

  const input = [
    'const answer = 42;',
    '//# sourceMappingURL=barba.umd.js.map',
    'body {}',
    '/*# sourceMappingURL=style.css.map */',
    '',
  ].join('\n');

  assert.equal(
    wporgBuild.stripSourceMapReferences(input),
    'const answer = 42;\nbody {}\n'
  );
});
