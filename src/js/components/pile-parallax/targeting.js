function matchesPilePattern( { index, columns = 1, target3d = 'item', rule3d = 'odd' } ) {
  const normalizedColumns = Math.max( 1, parseInt( columns, 10 ) || 1 );

  if ( target3d === 'column' ) {
    const column = ( index % normalizedColumns ) + 1;
    return rule3d === 'even' ? column % 2 === 0 : column % 2 === 1;
  }

  const position = index + 1;
  return rule3d === 'even' ? position % 2 === 0 : position % 2 === 1;
}

function getPilePatternSettings( { className = '', columns = 1 } = {} ) {
  return {
    has3d: className.includes( 'nb-supernova--pile-3d' ),
    target3d: className.includes( 'nb-supernova--pile-3d-target-column' ) ? 'column' : 'item',
    rule3d: className.includes( 'nb-supernova--pile-3d-rule-even' ) ? 'even' : 'odd',
    columns: Math.max( 1, parseInt( columns, 10 ) || 1 ),
  };
}

function shouldParallaxItem( { has3d = false, index, columns = 1, target3d = 'item', rule3d = 'odd' } ) {
  if ( ! has3d ) {
    return true;
  }

  return matchesPilePattern( { index, columns, target3d, rule3d } );
}

module.exports = {
  getPilePatternSettings,
  matchesPilePattern,
  shouldParallaxItem,
};
