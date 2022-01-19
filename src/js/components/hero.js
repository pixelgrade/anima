import GlobalService from './globalService';

export default class Hero {

  constructor ( element ) {
    this.element = element;
    this.progress = 0;
    this.timeline = gsap.timeline( { paused: true, onComplete: () => { this.paused = true; } } );
    this.pieces = this.getMarkupPieces();
    this.paused = false;
    this.offset = 0;
    this.reduceMotion = false;
    this.update();
    this.updateOnScroll();
    this.init();
  }

  init () {

    GlobalService.registerOnScroll( () => {
      this.update();
    } );

    GlobalService.registerRender( () => {
      this.updateOnScroll();
    } );

    const mediaQuery = window.matchMedia( '(prefers-reduced-motion: reduce)' );

    mediaQuery.addListener( () => {
      this.reduceMotion = mediaQuery.matches;
      this.updateOnScroll();
    } );

    this.reduceMotion = mediaQuery.matches;

    this.addIntroToTimeline();
    this.timeline.addLabel( 'middle' );
    this.addOutroToTimeline();
    this.timeline.addLabel( 'end' );
    this.pauseTimelineOnScroll();

    if ( this.reduceMotion ) {
      const middleTime = this.timeline.getLabelTime( 'middle' );
      const endTime = this.timeline.getLabelTime( 'end' );
      const minTlProgress = middleTime / endTime;

      this.paused = true;
      this.timeline.progress( minTlProgress );
    } else {
      this.timeline.play();
    }
  }

  update () {
    const { scrollY } = GlobalService.getProps();

    this.box = this.element.getBoundingClientRect();

    this.view = {
      left: this.box.left,
      top: this.box.top + scrollY,
      width: this.box.width,
      height: this.box.height,
    };
  }

  updateOnScroll () {
    const { scrollY, scrollHeight, windowHeight } = GlobalService.getProps();

    // used to calculate animation progress
    const length = windowHeight * 0.5;
    const middleMin = 0;
    const middleMax = scrollHeight - windowHeight - length * 0.5;
    const middle = this.view.top + (this.box.height - windowHeight) * 0.5;
    const middleMid = Math.max( middleMin, Math.min( middle, middleMax ) );

    this.start = middleMid - length * 0.5;
    this.end = this.start + length;

    this.progress = (scrollY - this.start) / (this.end - this.start);

    if ( this.reduceMotion ) {
      const middleTime = this.timeline.getLabelTime( 'middle' );
      const endTime = this.timeline.getLabelTime( 'end' );
      const minTlProgress = middleTime / endTime;

      this.progress = minTlProgress;
    }

    this.updateTimelineOnScroll();
  }

  updateTimelineOnScroll () {

    if ( !this.paused ) {
      return;
    }

    const currentProgress = this.timeline.progress();
    const middleTime = this.timeline.getLabelTime( 'middle' );
    const endTime = this.timeline.getLabelTime( 'end' );
    const minTlProgress = middleTime / endTime;

    let newTlProgress = (this.progress - 0.5) * 2 * (1 - minTlProgress) + minTlProgress;
    newTlProgress = Math.min( Math.max( minTlProgress, newTlProgress ), 1 );

    if ( currentProgress === newTlProgress ) {
      return;
    }

    this.timeline.progress( newTlProgress );
  }

  getMarkupPieces () {
    const container = jQuery( this.element ).find( '.novablocks-hero__inner-container' );
    const headline = container.children().filter( '.c-headline' ).first();
    const title = headline.find( '.c-headline__primary' );
    const subtitle = headline.find( '.c-headline__secondary' );
    const separator = headline.next( '.wp-block-separator' );
    const sepFlower = separator.find( '.c-separator__symbol' );
    const sepLine = separator.find( '.c-separator__line' );
    const sepArrow = separator.find( '.c-separator__arrow' );
    const othersBefore = headline.prevAll();
    const othersAfter = headline.length ? headline.nextAll().not( separator ) : container.children();

    return { headline, title, subtitle, separator, sepFlower, sepLine, sepArrow, othersBefore, othersAfter };
  }

  addIntroToTimeline () {
    const timeline = this.timeline;
    const { windowWidth } = GlobalService.getProps();
    const {
      headline,
      title,
      subtitle,
      separator,
      sepFlower,
      sepLine,
      sepArrow,
      othersBefore,
      othersAfter
    } = this.pieces;

    if ( title.length && title.text().trim().length ) {

      this.splitTitle = new SplitText( title, { wordsClass: 'c-headline__word' } );

      this.splitTitle.lines.forEach( line => {
        const words = Array.from( line.children );
        const letters = [];

        words.forEach( word => {
          letters.push( ...word.children );
        } );

        letters.forEach( letter => {
          const box = letter.getBoundingClientRect();
          const width = letter.offsetWidth;
          const offset = box.x - (windowWidth / 2);

          const offsetPercent = 2 * offset / windowWidth;
          const move = 400 * letters.length * offsetPercent;

          timeline.from( letter, {
            duration: 0.72,
            x: move,
            ease: 'power.out'
          }, 0 );
        } );
      } );

      timeline.fromTo( title, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.89,
        ease: 'power.out'
      }, 0 );

      // aici era title dar facea un glitch ciudat
      timeline.fromTo( headline, {
        'y': 30
      }, {
        'y': 0,
        duration: 1,
        ease: 'power.out'
      }, 0 );

    }

    if ( subtitle.length ) {
      timeline.fromTo( subtitle, { opacity: 0 }, { opacity: 1, duration: 0.65, ease: 'power4.out' }, '-=0.65' );
      timeline.fromTo( subtitle, { y: 30 }, { y: 0, duration: 0.9, ease: 'power4.out' }, '-=0.65' );
    }

    if ( separator.length ) {

      if ( sepFlower.length ) {
        timeline.fromTo( sepFlower, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: 'power4.out' }, '-=0.6' );
        timeline.fromTo( sepFlower, { rotation: -270 }, { rotation: 0, duration: 0.55, ease: 'back.out' }, '-=0.5' );
      }

      if ( sepLine.length ) {
        timeline.fromTo( sepLine, { width: 0 }, { width: '42%', opacity: 1, duration: 0.6, ease: 'power4.out' }, '-=0.55' );
        timeline.fromTo( separator, { width: 0 }, { width: '100%', opacity: 1, duration: 0.6, ease: 'power4.out' }, '-=0.6' );
      }

      if ( sepArrow.length ) {
        timeline.fromTo( sepArrow, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power4.out' }, '-=0.27' );
      }
    }

    if ( othersAfter.length ) {
      timeline.fromTo( othersAfter, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power4.out' }, '-=0.28' );
      timeline.fromTo( othersAfter, { y: -20 }, { y: 0, duration: 0.75 }, '-=0.5' );
    }

    if ( othersBefore.length ) {
      timeline.fromTo( othersBefore, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power4.out' }, '-=0.75' );
      timeline.fromTo( othersBefore, { y: 20 }, { y: 0, duration: 0.75 }, '-=0.75' );
    }

    this.timeline = timeline;
  }

  addOutroToTimeline () {
    const { title, subtitle, othersBefore, othersAfter, separator, sepLine, sepFlower, sepArrow } = this.pieces;
    const timeline = this.timeline;

    timeline.fromTo( title, {
      y: 0
    }, {
      opacity: 0,
      y: -60,
      duration: 1.08,
      ease: 'power1.in'
    }, 'middle' );

    timeline.to( subtitle, {
      opacity: 0,
      y: -90,
      duration: 1.08,
      ease: 'power1.in'
    }, 'middle' );

    timeline.to( othersBefore, {
      y: 60,
      opacity: 0,
      duration: 1.08,
      ease: 'power1.in'
    }, 'middle' );

    timeline.to( othersAfter, {
      y: 60,
      opacity: 0,
      duration: 1.08,
      ease: 'power1.in'
    }, 'middle' );

    timeline.to( sepLine, { width: '0%', opacity: 0, duration: 0.86, ease: 'power1.in' }, '-=0.94' );
    timeline.to( separator, { width: '0%', opacity: 0, duration: 0.86, ease: 'power1.in' }, '-=0.86' );
    timeline.to( sepFlower, { rotation: 180, duration: 1 }, '-=1.08' );
    timeline.to( sepFlower, { opacity: 0, duration: 0.11 }, '-=0.03' );
    timeline.to( sepArrow, { opacity: 0, duration: 0.14 }, '-=1.08' );

    this.timeline = timeline;
  }

  revertTitle () {
    if ( typeof this.splitTitle !== 'undefined' ) {
      this.splitTitle.revert();
    }
  }

  pauseTimelineOnScroll () {
    const middleTime = this.timeline.getLabelTime( 'middle' );
    const endTime = this.timeline.getLabelTime( 'end' );

    this.timeline.eventCallback( 'onUpdate', ( tl ) => {
      const time = tl.time();

      // calculate the current timeline progress relative to middle and end labels
      // in such a way that timelineProgress is 0.5 for middle and 1 for end
      // because we don't want the animation to be stopped before the middle label
      const tlProgress = (time - middleTime) / (endTime - middleTime);
      const pastMiddle = time > middleTime;
      const pastScroll = (tlProgress * 0.5 + 0.5) >= this.progress;

      if ( pastMiddle && pastScroll ) {
        tl.pause();
        this.revertTitle();
        this.timeline.eventCallback( 'onUpdate', null );
        this.paused = true;
      }

    }, [ '{self}' ] );
  }
}
