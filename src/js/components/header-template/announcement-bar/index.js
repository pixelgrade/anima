import Cookies from 'js-cookie';
import $ from 'jquery';

import GlobalService from '../../globalService';

export default class AnnouncementBar {

  constructor ( element, args ) {
    this.element = element;
    this.parent = args.parent || null;
    this.transitionDuration = args.transitionDuration || 0.5;
    this.transitionEasing = args.transitionEasing || 'power4.out';
    this.pieces = this.getPieces();
    this.id = $( element ).data( 'id' );
    this.cookieName = 'novablocks-announcement-' + this.id + '-disabled';
    this.height = 0;

    const disabled = Cookies.get( this.cookieName );
    const loggedIn = $( 'body' ).hasClass( 'logged-in' );

    if ( disabled && !loggedIn ) {
      $( element ).remove();
      return;
    }

    this.onResize();
    GlobalService.registerOnDeouncedResize( this.onResize.bind( this ) );

    this.timeline.play();

    this.bindEvents();
  }

  onResize () {
    let progress = 0;
    let wasActive = false;
    let wasReversed = false;

    if ( typeof this.timeline !== 'undefined' ) {
      progress = this.timeline.progress();
      wasActive = this.timeline.isActive();
      wasReversed = this.timeline.reversed();
      this.timeline.clear();
      this.timeline.kill();
      this.pieces.wrapper.css( 'height', '' );
    }

    this.timeline = this.getTimeline();
    this.timeline.progress( progress );
    this.timeline.reversed( wasReversed );

    if ( wasActive ) {
      this.timeline.resume();
    }
  }

  getPieces () {
    const $element = $( this.element );

    return {
      element: $element,
      wrapper: $element.find( '.novablocks-announcement-bar__wrapper' ),
      content: $element.find( '.novablocks-announcement-bar__content' ),
      close: $element.find( '.novablocks-announcement-bar__close' ),
    };
  }

  getTimeline () {
    const {
      transitionDuration,
      transitionEasing,
      pieces: {
        element,
        wrapper,
        content,
        close,
      }
    } = this;

    const that = this;
    const timeline = gsap.timeline( { paused: true } );
    const height = wrapper.outerHeight();

    timeline.fromTo( element, { height: 0 }, { duration: transitionDuration, height: height, ease: transitionEasing }, 0 );

    timeline.to( { height: 0 }, {
      duration: transitionDuration,
      height: height,
      onUpdate: function() {
        const targets = this.targets();

        if ( Array.isArray( targets ) && targets.length ) {
          that.height = targets[0].height;

          if ( that.parent ) {
            that.parent.update();
          }
        }
      },
      onUpdateParams: [ '{self}' ],
      ease: transitionEasing
    }, 0 );

    return timeline;
  }

  bindEvents () {
    this.pieces.close.on( 'click', this.onClose.bind( this ) );
  }

  onClose () {
    if ( typeof this.timeline !== 'undefined' ) {
      this.timeline.reverse();
    }
  }
}