const fs = require( 'node:fs' );
const path = require( 'node:path' );
const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );

const themeRoot = path.join( __dirname, '..' );

function readSource( relativePath ) {
  return fs.readFileSync( path.join( themeRoot, relativePath ), 'utf8' );
}

test( 'component reinitialization does not announce page-transition completion before the overlay exits', () => {
  const utils = readSource( 'src/js/components/page-transitions/utils.js' );
  const reinitBody = utils.match( /export function reinitComponents\(\) \{[\s\S]*?\n\}/ );

  assert.ok( reinitBody, 'expected to find reinitComponents()' );
  assert.equal(
    reinitBody[ 0 ].includes( 'anima:page-transition-complete' ),
    false,
    'completion must be emitted after the enter overlay animation, not during component reinit'
  );
} );

test( 'border iris announces page-transition completion after the border collapse timeline resolves', () => {
  const transitions = readSource( 'src/js/components/page-transitions/transitions.js' );

  assert.match(
    transitions,
    /const timelineDone = timelinePromise\( timeline \);\s*timeline\.play\(\);\s*timelineDone\.then\(\s*\(\) => \{\s*notifyPageTransitionComplete\(\);\s*resolve\(\);\s*\}\s*\)/,
    'Border Iris should notify completion after the enter timeline finishes'
  );
} );

test( 'timelinePromise preserves any existing GSAP onComplete callback', () => {
  const transitions = readSource( 'src/js/components/page-transitions/transitions.js' );

  assert.match(
    transitions,
    /const existingOnComplete = timeline\.eventCallback\( 'onComplete' \);[\s\S]*?if \( typeof existingOnComplete === 'function' \) \{[\s\S]*?existingOnComplete\.call\( timeline \);[\s\S]*?\}/,
    'timelinePromise should not replace timeline cleanup callbacks'
  );
} );

test( 'border iris enter tween collapses the same side-specific widths set on leave', () => {
  const transitions = readSource( 'src/js/components/page-transitions/transitions.js' );

  assert.match(
    transitions,
    /borderTopWidth:\s*0,[\s\S]*?borderBottomWidth:\s*0,[\s\S]*?borderLeftWidth:\s*0,[\s\S]*?borderRightWidth:\s*0,/,
    'Border Iris should collapse individual side widths, not only the borderWidth shorthand'
  );
} );

test( 'slide wipe announces page-transition completion after the loader hide promise resolves', () => {
  const transitions = readSource( 'src/js/components/page-transitions/slide-wipe-transitions.js' );

  assert.match(
    transitions,
    /SlideWipeLoader\.hide\(\)\.then\(\s*\(\) => \{\s*notifyPageTransitionComplete\(\);\s*resolve\(\);\s*\}\s*\)/,
    'Slide Wipe should notify completion after its loader has hidden'
  );
} );

test( 'initial page-transition loader announces start and completion around first-load overlay', () => {
  const index = readSource( 'src/js/components/page-transitions/index.js' );

  assert.match(
    index,
    /notifyPageTransitionStart\(\);/,
    'initial page load should close the intro-animation page-transition gate while the loader covers the page'
  );
  assert.match(
    index,
    /waitForLoadAndHide\(\)\.then\( notifyPageTransitionComplete \)/,
    'Slide Wipe + Cycling Images should announce completion after the first-load loader hides'
  );
  assert.match(
    index,
    /SlideWipeLoader\.hide\(\)\.then\( notifyPageTransitionComplete \)/,
    'Slide Wipe + Progress Bar should announce completion after the first-load loader hides'
  );
  assert.match(
    index,
    /collapseBorderIrisInitialLoader\( \$border \)\.then\( notifyPageTransitionComplete \)/,
    'Border Iris first-load loaders should announce completion after the border collapses'
  );
} );
