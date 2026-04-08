const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );

const {
  getDocumentTitleFromHtml,
} = require( '../src/js/components/page-transitions/document-title.js' );

test( 'decodes HTML entities before syncing the AJAX document title', () => {
  assert.equal(
    getDocumentTitleFromHtml( '<title>News &#8211; Mies &amp; Friends</title>' ),
    'News – Mies & Friends'
  );
} );

test( 'returns null when the response HTML has no title tag', () => {
  assert.equal( getDocumentTitleFromHtml( '<main>No title here</main>' ), null );
} );
