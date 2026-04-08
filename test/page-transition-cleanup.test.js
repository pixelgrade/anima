const test = require( 'node:test' );
const assert = require( 'node:assert/strict' );

const {
  cleanupTransitionContainer,
} = require( '../src/js/components/page-transitions/cleanup.js' );

function createRemovableNode() {
  return {
    removed: false,
    remove() {
      this.removed = true;
    },
  };
}

function createVideoNode() {
  return {
    paused: false,
    loaded: false,
    removed: false,
    src: 'http://example.com/video.mp4',
    pause() {
      this.paused = true;
    },
    load() {
      this.loaded = true;
    },
    remove() {
      this.removed = true;
    },
  };
}

function createContainer( { videos = [], readingNodes = [] } = {} ) {
  return {
    querySelectorAll( selector ) {
      if ( selector === '.js-reading-bar, .js-reading-progress' ) {
        return readingNodes;
      }

      if ( selector === 'video' ) {
        return videos;
      }

      return [];
    },
  };
}

test( 'cleanupTransitionContainer only removes resources from the outgoing Barba container', () => {
  const outgoingVideo = createVideoNode();
  const incomingVideo = createVideoNode();
  const outgoingReadingBar = createRemovableNode();
  const incomingReadingBar = createRemovableNode();

  const outgoingContainer = createContainer( {
    videos: [ outgoingVideo ],
    readingNodes: [ outgoingReadingBar ],
  } );
  const incomingContainer = createContainer( {
    videos: [ incomingVideo ],
    readingNodes: [ incomingReadingBar ],
  } );

  cleanupTransitionContainer( outgoingContainer );

  assert.equal( outgoingReadingBar.removed, true );
  assert.equal( outgoingVideo.paused, true );
  assert.equal( outgoingVideo.src, '' );
  assert.equal( outgoingVideo.loaded, true );
  assert.equal( outgoingVideo.removed, true );

  assert.equal( incomingReadingBar.removed, false );
  assert.equal( incomingVideo.paused, false );
  assert.equal( incomingVideo.src, 'http://example.com/video.mp4' );
  assert.equal( incomingVideo.loaded, false );
  assert.equal( incomingVideo.removed, false );
} );
