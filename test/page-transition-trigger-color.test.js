const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );

const {
  getTransitionColorFromTrigger,
} = require( '../src/js/components/page-transitions/transition-color.js' );

test( 'getTransitionColorFromTrigger prefers the explicit destination color exposed on the clicked link', () => {
  const trigger = {
    getAttribute( name ) {
      return 'data-anima-transition-color' === name ? '#123456' : '';
    },
  };

  assert.equal( getTransitionColorFromTrigger( trigger ), '#123456' );
} );

test( 'getTransitionColorFromTrigger uses the existing contextual destination color when the link exposes data-color', () => {
  const trigger = {
    getAttribute( name ) {
      return 'data-color' === name ? '#654321' : '';
    },
  };

  assert.equal( getTransitionColorFromTrigger( trigger ), '#654321' );
} );

test( 'getTransitionColorFromTrigger falls back to the theme accent when the link exposes no destination color', () => {
  const trigger = {
    getAttribute() {
      return '';
    },
  };

  assert.equal( getTransitionColorFromTrigger( trigger ), 'var(--sm-current-accent-color)' );
} );
