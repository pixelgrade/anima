import GlobalService from "../globalService";
import HeaderBase from './header-base'
import HeaderMobile from './header-mobile';
import {
	below,
	setAndResetElementStyles,
	getColorSetClasses,
	addClass,
	toggleClasses
} from '../../utils';

import $ from 'jquery';

const defaults = {};

class Header extends HeaderBase {

	constructor( element, options ) {
		super();

		if ( ! element ) return;

		this.options = Object.assign( {}, defaults, options );

		this.element = element;
		this.mobileHeader = new HeaderMobile( this.element );
		this.secondaryHeader = this.getSecondaryHeader();

		this.initialize();
		this.onResize();
	}

	initialize() {
		HeaderBase.prototype.initialize.call( this );

		this.timeline = this.getIntroTimeline();
		this.timeline.play();
	}

	getSecondaryHeader() {
		const nextSibling = this.element.nextElementSibling;

		if ( nextSibling.classList.contains( 'site-header--secondary' ) ) {
			return nextSibling;
		}

		return null;
	}

	updateStickyStyles() {
		HeaderBase.prototype.updateStickyStyles.call( this );

		this.element.style.marginTop = `${ this.offset }px`;
		this.secondaryHeader.style.top = `${ this.offset }px`;
	}

	getIntroTimeline() {
		const timeline = new TimelineMax( { paused: true } );
		const height = this.element.offsetHeight;
		const transitionEasing = Power4.easeInOut;
		const transitionDuration = 0.5;
		timeline.to( this.element, transitionDuration, { opacity: 1, ease: transitionEasing }, 0 );
		timeline.to( { height: 0 }, transitionDuration, {
			height: height,
			onUpdate: ( tween ) => {
				this.box = Object.assign( {}, this.box, { height: tween.target.height } );
			},
			onUpdateParams: [ "{self}" ],
			ease: transitionEasing
		}, 0 );

		return timeline;
	}

	onResize() {
		HeaderBase.prototype.onResize.call( this );
		setAndResetElementStyles( this.element, { transition: 'none' } );
	}
}

export default Header;
