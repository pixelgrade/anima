const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );

const {
  syncAjaxReadingProgress,
} = require( '../src/js/components/page-transitions/reading-bar.js' );

function createStyle() {
  const values = new Map();

  return {
    values,
    display: '',
    setProperty( name, value ) {
      values.set( name, String( value ) );
    },
    getPropertyValue( name ) {
      return values.get( name ) || '';
    },
  };
}

function createElement( { offsetTop = 0, offsetHeight = 0 } = {} ) {
  return {
    offsetTop,
    offsetHeight,
    style: createStyle(),
  };
}

function createDocument( elements ) {
  return {
    querySelector( selector ) {
      return elements[ selector ] || null;
    },
  };
}

test( 'syncAjaxReadingProgress keeps the AJAX reading bar at zero instead of NaN when the incoming content starts at zero height', () => {
  const progressBar = createElement();
  const content = createElement( { offsetTop: 0, offsetHeight: 0 } );
  const targetDocument = createDocument( {
    '.js-reading-progress': progressBar,
    '.wp-block-post-title, .entry-title': null,
    '.wp-block-post-content, .entry-content, #primary, main': content,
    '.article-header, .post-navigation, .novablocks-conversations': null,
  } );

  const targetWindow = {
    pageYOffset: 0,
    innerHeight: 1000,
  };

  syncAjaxReadingProgress( targetDocument, targetWindow );

  assert.equal( progressBar.style.getPropertyValue( '--progress' ), '0' );
} );

test( 'syncAjaxReadingProgress recalculates against the live project height after AJAX content expands', () => {
  const progressBar = createElement();
  const content = createElement( { offsetTop: 0, offsetHeight: 0 } );
  const targetDocument = createDocument( {
    '.js-reading-progress': progressBar,
    '.wp-block-post-title, .entry-title': null,
    '.wp-block-post-content, .entry-content, #primary, main': content,
    '.article-header, .post-navigation, .novablocks-conversations': null,
  } );

  const targetWindow = {
    pageYOffset: 0,
    innerHeight: 1000,
  };

  syncAjaxReadingProgress( targetDocument, targetWindow );
  assert.equal( progressBar.style.getPropertyValue( '--progress' ), '0' );

  content.offsetHeight = 2500;
  targetWindow.pageYOffset = 750;

  syncAjaxReadingProgress( targetDocument, targetWindow );
  assert.equal( progressBar.style.getPropertyValue( '--progress' ), '0.5' );

  targetWindow.pageYOffset = 0;

  syncAjaxReadingProgress( targetDocument, targetWindow );
  assert.equal( progressBar.style.getPropertyValue( '--progress' ), '0' );
} );
