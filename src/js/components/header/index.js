import GlobalService from "../globalService";
import mqService from '../mqService';
import HeaderBase from './header-base'
import HeaderMobile from './header-mobile';

import { addClass, hasClass, setAndResetElementStyles, getColorSetClasses } from '../../utils';

class Header extends HeaderBase {

	constructor( element, options ) {
		super();

		if ( ! element ) return;

		this.onUpdate = options.onUpdate;

		this.element = element;
		this.mobileHeader = new HeaderMobile( this.element );
		this.secondaryHeader = this.getSecondaryHeader();

		if ( this.secondaryHeader ) {
			addClass( this.secondaryHeader, 'site-header--ready' );
		}

		this.initialize();
		this.onResize();
	}

	initialize() {
		HeaderBase.prototype.initialize.call( this );

		this.timeline = this.getIntroTimeline();
		this.timeline.play();
	}

	updateStickyStyles() {
		HeaderBase.prototype.updateStickyStyles.call( this );

		if ( hasClass( element, 'site-header--main' ) ) {
			toggleClasses( this.element, this.shouldBeSticky, this.initialColorClasses, this.transparentColorClasses );
		}
	}

	render( forceUpdate ) {
		HeaderBase.prototype.render.call( this, forceUpdate );

		if ( typeof this.onUpdate === "function" ) {
			this.onUpdate();
		}
	}

	getHeight() {

		if ( !! mqService.below.lap ) {
			return this.mobileHeader.getHeight();
		}

		return HeaderBase.prototype.getHeight.call( this );
	}

	onResize() {
		HeaderBase.prototype.onResize.call( this );
		setAndResetElementStyles( this.element, { transition: 'none' } );
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

		if ( this.secondaryHeader ) {
			this.secondaryHeader.style.top = `${ this.offset }px`;
		}
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
}

export default Header;
