const PROGRESS_SELECTOR = '.js-reading-progress';
const TITLE_SELECTOR = '.wp-block-post-title, .entry-title';
const CONTENT_SELECTOR = '.wp-block-post-content, .entry-content, #primary, main';
const IGNORED_SELECTOR = '.article-header, .post-navigation, .novablocks-conversations';

let destroyReadingBarSync = null;

function getIgnoredHeight( targetDocument ) {
  if ( ! targetDocument || typeof targetDocument.querySelectorAll !== 'function' ) {
    return 0;
  }

  return Array.from( targetDocument.querySelectorAll( IGNORED_SELECTOR ) ).reduce( ( total, element ) => {
    return total + ( element?.offsetHeight || 0 );
  }, 0 );
}

function getReadingBarBounds( targetDocument = document, targetWindow = window ) {
  const title = targetDocument.querySelector( TITLE_SELECTOR );
  const content = targetDocument.querySelector( CONTENT_SELECTOR );

  if ( ! title && ! content ) {
    return null;
  }

  const titleBottom = title
    ? title.offsetTop + title.offsetHeight
    : content.offsetTop;
  const contentBottom = content
    ? content.offsetTop + content.offsetHeight
    : targetDocument.body?.scrollHeight || titleBottom;
  const min = Number.isFinite( titleBottom ) ? titleBottom : 0;
  const maxCandidate = contentBottom - getIgnoredHeight( targetDocument ) - targetWindow.innerHeight;
  const max = Math.max( min, Number.isFinite( maxCandidate ) ? maxCandidate : min );

  return { min, max };
}

function getReadingBarProgress( scrollY, bounds ) {
  const min = bounds?.min ?? 0;
  const max = bounds?.max ?? min;
  const safeScrollY = Number.isFinite( scrollY ) ? scrollY : 0;
  const range = max - min;

  if ( ! Number.isFinite( range ) || range <= 0 ) {
    return safeScrollY > min ? 1 : 0;
  }

  const progress = ( safeScrollY - min ) / range;

  if ( ! Number.isFinite( progress ) ) {
    return safeScrollY > min ? 1 : 0;
  }

  return Math.max( 0, Math.min( 1, progress ) );
}

function syncAjaxReadingProgress( targetDocument = document, targetWindow = window ) {
  const progressBar = targetDocument.querySelector( PROGRESS_SELECTOR );

  if ( ! progressBar?.style || typeof progressBar.style.setProperty !== 'function' ) {
    return null;
  }

  const progress = getReadingBarProgress(
    targetWindow.pageYOffset,
    getReadingBarBounds( targetDocument, targetWindow )
  );

  progressBar.style.setProperty( '--progress', progress );

  return progress;
}

function bindAjaxReadingProgress( targetDocument = document, targetWindow = window ) {
  if ( ! targetDocument.querySelector( PROGRESS_SELECTOR ) ) {
    return () => {};
  }

  let rafId = null;
  let timeoutId = null;

  const runSync = () => {
    rafId = null;
    syncAjaxReadingProgress( targetDocument, targetWindow );
  };

  const scheduleSync = () => {
    if ( typeof targetWindow.requestAnimationFrame !== 'function' ) {
      runSync();
      return;
    }

    if ( rafId !== null ) {
      return;
    }

    rafId = targetWindow.requestAnimationFrame( runSync );
  };

  if ( typeof targetWindow.addEventListener === 'function' ) {
    targetWindow.addEventListener( 'scroll', scheduleSync );
    targetWindow.addEventListener( 'resize', scheduleSync );
  }

  syncAjaxReadingProgress( targetDocument, targetWindow );
  scheduleSync();

  if ( typeof targetWindow.setTimeout === 'function' ) {
    timeoutId = targetWindow.setTimeout( scheduleSync, 250 );
  }

  return () => {
    if ( typeof targetWindow.removeEventListener === 'function' ) {
      targetWindow.removeEventListener( 'scroll', scheduleSync );
      targetWindow.removeEventListener( 'resize', scheduleSync );
    }

    if ( rafId !== null && typeof targetWindow.cancelAnimationFrame === 'function' ) {
      targetWindow.cancelAnimationFrame( rafId );
    }

    if ( timeoutId !== null && typeof targetWindow.clearTimeout === 'function' ) {
      targetWindow.clearTimeout( timeoutId );
    }
  };
}

function rebindAjaxReadingProgress( targetDocument = document, targetWindow = window ) {
  if ( typeof destroyReadingBarSync === 'function' ) {
    destroyReadingBarSync();
  }

  destroyReadingBarSync = bindAjaxReadingProgress( targetDocument, targetWindow );
  return destroyReadingBarSync;
}

module.exports = {
  bindAjaxReadingProgress,
  getReadingBarBounds,
  getReadingBarProgress,
  rebindAjaxReadingProgress,
  syncAjaxReadingProgress,
};
