import GlobalService from "./globalService";
import Cookies from 'js-cookie';

export default class AnnouncementBar {

	constructor( element, args ) {
		this.element = element;
		this.parent = args.parent || null;
		this.transitionDuration = args.transitionDuration || 0.5;
		this.transitionEasing = args.transitionEasing || Power4.easeOut;
		this.pieces = this.getPieces();
		this.id = jQuery( element ).data( 'id' );
		this.cookieName = 'novablocks-announcement-' + this.id + '-disabled';

		const disabled = Cookies.get( this.cookieName );

		if ( disabled ) {
			jQuery( element ).remove();
			this.height = 0;
			return;
		}

		this.timeline = this.getTimeline();
		this.timeline.play();

		this.bindEvents();
	}

	getPieces() {
		const $element = jQuery( this.element );

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

		timeline.fromTo( content, transitionDuration, { opacity: 0 }, { opacity: 1, ease: transitionEasing }, 0 );
		timeline.fromTo( close, transitionDuration, { opacity: 0 }, { opacity: 1, ease: transitionEasing }, 0 );
		timeline.to( element, transitionDuration, { height: height, ease: transitionEasing }, 0 );
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
		this.timeline.reverse();
	}

	onHeightUpdate( tween ) {
		this.height = tween.target.height;

		if ( this.parent ) {
			this.parent.update();
		}
	}
}