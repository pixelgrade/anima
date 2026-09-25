const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  HERO_RESTING_SCROLL_PROGRESS,
  getHeroRestingProgress,
  getHeroTimelineProgress,
  settleHeroTimelineForReducedMotion,
} = require('../src/js/components/hero-motion.js');

const heroSourcePath = path.join( __dirname, '..', 'src', 'js', 'components', 'hero.js' );

// A GSAP-shaped timeline double: labels + progress()/pause(), recording calls.
function createTimeline( labels ) {
  const calls = [];
  let progress = 0;

  return {
    labels,
    calls,
    pause() {
      calls.push( [ 'pause' ] );
      return this;
    },
    play() {
      calls.push( [ 'play' ] );
      return this;
    },
    progress( value ) {
      if ( typeof value === 'undefined' ) {
        return progress;
      }
      calls.push( [ 'progress', value ] );
      progress = value;
      return this;
    },
  };
}

test( 'the resting progress is the end of the intro (middle label), not the timeline midpoint', () => {
  // Intro runs 0 → 1.4s, outro 1.4s → 2.48s: the intro's finished state is 1.4 / 2.48.
  const timeline = createTimeline( { middle: 1.4, end: 2.48 } );

  assert.equal( getHeroRestingProgress( timeline ), 1.4 / 2.48 );
} );

test( 'a timeline without an outro rests at its end', () => {
  assert.equal( getHeroRestingProgress( createTimeline( { middle: 0, end: 0 } ) ), 1 );
  assert.equal( getHeroRestingProgress( createTimeline( {} ) ), 1 );
} );

test( 'reduced motion jumps the paused timeline straight to the finished intro', () => {
  const timeline = createTimeline( { middle: 2, end: 3 } );

  settleHeroTimelineForReducedMotion( timeline );

  assert.deepEqual( timeline.calls, [ [ 'pause' ], [ 'progress', 2 / 3 ] ] );
  assert.equal( timeline.progress(), 2 / 3 );
} );

test( 'the resting scroll progress maps onto the finished intro, not into the outro', () => {
  const timeline = createTimeline( { middle: 1.4, end: 2.48 } );
  const resting = getHeroRestingProgress( timeline );

  assert.equal( getHeroTimelineProgress( timeline, HERO_RESTING_SCROLL_PROGRESS ), resting );
  // Feeding the timeline ratio back in as a scroll progress lands inside the outro:
  // the pre-fix reduced-motion path did exactly that.
  assert.ok( getHeroTimelineProgress( timeline, resting ) > resting );
} );

test( 'scroll progress plays the outro to its end and never rewinds the intro', () => {
  const timeline = createTimeline( { middle: 2, end: 3 } );

  assert.equal( getHeroTimelineProgress( timeline, 0 ), 2 / 3 );
  assert.equal( getHeroTimelineProgress( timeline, 1 ), 1 );
  assert.equal( getHeroTimelineProgress( timeline, 2 ), 1 );
} );

test( 'hero.js reads the timeline labels through the shared helper (#629)', () => {
  const source = fs.readFileSync( heroSourcePath, 'utf8' );

  // `this.labels` is undefined on the Hero instance: reading `.middle` from it threw
  // under prefers-reduced-motion, aborting init with every piece still at opacity 0.
  assert.equal(
    /this\.labels\b/.test( source ),
    false,
    'Hero must not read labels from itself; they live on this.timeline'
  );
  assert.match(
    source,
    /if \( this\.reduceMotion \) \{\s*this\.paused = true;\s*settleHeroTimelineForReducedMotion\( this\.timeline \);/,
    'init must settle the timeline at its finished intro under reduced motion'
  );
  assert.match(
    source,
    /if \( this\.reduceMotion \) \{\s*this\.progress = HERO_RESTING_SCROLL_PROGRESS;\s*\}/,
    'scroll updates must pin reduced motion to the resting scroll progress'
  );
  assert.match(
    source,
    /const newTlProgress = getHeroTimelineProgress\( this\.timeline, this\.progress \);/,
    'scroll updates must map through the shared helper'
  );
} );
