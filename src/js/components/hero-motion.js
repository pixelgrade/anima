// The Hero timeline runs its intro up to the `middle` label and its scroll-driven
// outro from `middle` to `end`. The intro's finished state (every piece at
// opacity 1, no offset) is therefore the timeline progress at `middle`.

// Scroll progress is 0 → 1 across the hero's scroll window; its midpoint is the
// scroll position that maps onto the `middle` label (the finished intro).
const HERO_RESTING_SCROLL_PROGRESS = 0.5;

function getHeroRestingProgress( timeline ) {
  const { middle, end } = timeline.labels || {};

  if ( ! ( end > 0 ) || typeof middle !== 'number' ) {
    return 1;
  }

  return middle / end;
}

// Map scroll progress onto timeline progress: the resting scroll progress lands on
// `middle`, and scrolling on plays the outro up to `end`. Never rewinds the intro.
function getHeroTimelineProgress( timeline, scrollProgress ) {
  const restingProgress = getHeroRestingProgress( timeline );
  const progress = ( scrollProgress - HERO_RESTING_SCROLL_PROGRESS ) * 2 * ( 1 - restingProgress ) + restingProgress;

  return Math.min( Math.max( restingProgress, progress ), 1 );
}

// Under prefers-reduced-motion the intro must not animate, and its end state must
// be the finished intro, never the pre-hidden start (#629).
function settleHeroTimelineForReducedMotion( timeline ) {
  timeline.pause();
  timeline.progress( getHeroRestingProgress( timeline ) );
}

module.exports = {
  HERO_RESTING_SCROLL_PROGRESS,
  getHeroRestingProgress,
  getHeroTimelineProgress,
  settleHeroTimelineForReducedMotion,
};
