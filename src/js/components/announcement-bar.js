import GlobalService from "./globalService";
import Cookies from 'js-cookie';
import $ from 'jquery';

export default class AnnouncementBar {

	constructor( element, args ) {
		this.element = element;
		this.parent = args.parent || null;
		this.transitionDuration = args.transitionDuration || 0.5;
		this.transitionEasing = args.transitionEasing || Power4.easeOut;
		this.pieces = this.getPieces();
		this.id = $( element ).data( 'id' );
		this.cookieName = 'novablocks-announcement-' + this.id + '-disabled';
		this.height = 0;

		const disabled = Cookies.get( this.cookieName );
		const loggedIn = $( 'body' ).hasClass( 'logged-in' );

		if ( disabled && ! loggedIn ) {
			$( element ).remove();
			return;
		}

		this.onResize();
		GlobalService.registerOnDeouncedResize( this.onResize.bind( this ) );

		this.timeline.play();

		this.bindEvents();
	}

	onResize() {
		let progress = 0;
		let wasActive = false;
		let wasReversed = false;

		if ( typeof this.timeline !== "undefined" ) {
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

	getPieces() {
		const $element = $( this.element );

		return {
			element: $element,
			wrapper: $element.find( '.novablocks-announcement-bar__wrapper' ),
			content: $element.find( '.novablocks-announcement-bar__content' ),
			close: $element.find( '.novablocks-announcement-bar__close' ),
		}
	}

	getTimeline() {
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

		const timeline = new TimelineMax( { paused: true } );
		const height = wrapper.outerHeight();
		timeline.fromTo( element, transitionDuration, { height: 0 }, { height: height, ease: transitionEasing }, 0 );
		timeline.to( { height: 0 }, transitionDuration, {
			height: height,
			onUpdate: this.onHeightUpdate.bind( this ),
			onUpdateParams: ["{self}"],
			ease: transitionEasing
		}, 0 );

		return timeline;
	}

	bindEvents() {
		this.pieces.close.on( 'click', this.onClose.bind( this ) );
	}

	onClose() {
		if ( typeof this.timeline !== "undefined" ) {
			this.timeline.reverse();
		}
	}

	onHeightUpdate( tween ) {
		this.height = tween.target.height;

		if ( this.parent ) {
			this.parent.update();
		}
	}
}
