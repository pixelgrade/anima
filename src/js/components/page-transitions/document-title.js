const NAMED_HTML_ENTITIES = {
  amp: '&',
  apos: '\'',
  gt: '>',
  hellip: '…',
  lt: '<',
  mdash: '—',
  nbsp: '\u00A0',
  ndash: '–',
  quot: '"',
};

function decodeHtmlEntities( text ) {
  return text.replace( /&(#(?:x[\da-f]+|\d+)|[a-z]+);/gi, ( entity, value ) => {
    if ( value.charAt( 0 ) === '#' ) {
      const isHex = value.charAt( 1 ).toLowerCase() === 'x';
      const number = parseInt( value.slice( isHex ? 2 : 1 ), isHex ? 16 : 10 );

      if ( Number.isFinite( number ) ) {
        return String.fromCodePoint( number );
      }

      return entity;
    }

    const namedValue = NAMED_HTML_ENTITIES[ value.toLowerCase() ];
    return typeof namedValue === 'string' ? namedValue : entity;
  } );
}

function getDocumentTitleFromHtml( html ) {
  const match = html.match( /<title[^>]*>([\s\S]*?)<\/title>/i );

  if ( ! match || ! match[ 1 ] ) {
    return null;
  }

  return decodeHtmlEntities( match[ 1 ].trim() );
}

function syncDocumentTitle( html, targetDocument = document ) {
  const title = getDocumentTitleFromHtml( html );

  if ( title === null ) {
    return null;
  }

  targetDocument.title = title;

  return title;
}

module.exports = {
  decodeHtmlEntities,
  getDocumentTitleFromHtml,
  syncDocumentTitle,
};
