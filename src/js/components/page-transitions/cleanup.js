function cleanupTransitionContainer( container ) {
  if ( ! container || typeof container.querySelectorAll !== 'function' ) {
    return;
  }

  container.querySelectorAll( '.js-reading-bar, .js-reading-progress' ).forEach( ( element ) => {
    element.remove();
  } );

  container.querySelectorAll( 'video' ).forEach( ( video ) => {
    video.pause();
    video.src = '';
    video.load();
    video.remove();
  } );
}

module.exports = {
  cleanupTransitionContainer,
};
