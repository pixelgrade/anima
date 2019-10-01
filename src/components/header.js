import GlobalService from "./globalService";
import $ from 'jquery';

const defaults = {
	offsetTargetElement: null,
};

class Header {

	constructor( element, args ) {
		if ( ! element ) return;

		this.element = element;
		this.options = Object.assign( {}, defaults, args );

		this.$header = $( this.element );
		this.$toggle = $( '.c-menu-toggle' );
		this.$toggleWrap = $( '.c-menu-toggle__wrap' );

		this.scrolled = false;
		this.inversed = false;

		this.offset = 0;
		this.scrollOffset = 0;
		this.mobileHeaderHeight = 0;

		this.createMobileHeader();

		this.onResize();
		GlobalService.registerUpdate( this.onResize.bind( this ) );

		this.timeline = this.getInroTimeline();
		this.timeline.play();
	}

	initialize() {
		this.$header.addClass( 'site-header--fixed site-header--ready' );
		this.$mobileHeader.addClass( 'site-header--fixed site-header--ready' );
	}

	update() {
		this.updatePageOffset();
		this.updateHeaderOffset();
		this.updateMobileHeaderOffset();
	}

	getInroTimeline() {
		const element = this.element;
		const timeline = new TimelineMax( { paused: true } );
		const height = $( element ).outerHeight();
		const transitionEasing = Power4.easeOut;
		const transitionDuration = 0.5;
		timeline.to( element, transitionDuration, { opacity: 1, ease: transitionEasing }, 0 );
		timeline.to( { height: 0 }, transitionDuration, {
			height: height,
			onUpdate: this.onHeightUpdate.bind( this ),
			onUpdateParams: ["{self}"],
			onComplete: this.initialize.bind( this ),
			ease: transitionEasing
		}, 0 );

		return timeline;
	}

	onHeightUpdate( tween ) {
		this.getProps();
		this.box = Object.assign( this.box, { height: tween.target.height } );
		this.setVisibleHeaderHeight();
		this.update();
	}

	getMobileHeaderHeight() {
		const mobileHeaderHeight = this.$mobileHeader.css( 'height', '' ).outerHeight();
		const toggleHeight = this.$toggleWrap.css( 'height', '' ).outerHeight();

		return Math.max( mobileHeaderHeight, toggleHeight );
	}

	isMobileHeaderVisibile() {
		return this.$mobileHeader.is( ':visible' );
	}

	setVisibleHeaderHeight() {
		this.visibleHeaderHeight = this.isMobileHeaderVisibile() ? this.mobileHeaderHeight : this.box.height;
	}

	getProps() {
		this.box = this.element.getBoundingClientRect();
		this.scrollOffset = this.getScrollOffset();
		this.mobileHeaderHeight = this.getMobileHeaderHeight();
	}

	onResize() {
		this.getProps();
		this.setVisibleHeaderHeight();
		this.update();
	}

	updateHeaderOffset() {
		if ( ! this.element ) return;

		this.element.style.marginTop = this.offset + 'px';
	}

	updateMobileHeaderOffset() {
		if ( ! this.$mobileHeader ) return;

		this.$mobileHeader.css( {
			height: this.mobileHeaderHeight,
			marginTop: this.offset + 'px',
		} );

		$( '.site-header__inner-container' ).css( {
			marginTop: this.mobileHeaderHeight
		} );

		this.$toggleWrap.css( {
			height: this.mobileHeaderHeight,
			marginTop: this.offset + 'px',
		} );
	}

	getScrollOffset() {
		const { adminBarHeight, scrollY } = GlobalService.getProps();
		const { offsetTargetElement } = this.options;

		if ( offsetTargetElement ) {
			const offsetTargetBox = offsetTargetElement.getBoundingClientRect();
			const targetBottom = offsetTargetBox.top + scrollY + offsetTargetBox.height;
			const headerOffset = adminBarHeight + this.offset + this.box.height / 2;
			return targetBottom - headerOffset;
		}

		return 0;
	}

	updatePageOffset() {
		const page = document.getElementById( 'page' );
		page.style.paddingTop = this.visibleHeaderHeight + this.offset + 'px';
	}

	createMobileHeader() {
		if ( this.createdMobileHeader ) {
			return;
		}

		this.$mobileHeader = $( '<div class="site-header--mobile">' );

		$( '.c-branding' ).clone().appendTo( this.$mobileHeader );
		$( '.menu-item--cart' ).clone().appendTo( this.$mobileHeader );

		this.$mobileHeader.insertAfter( this.$toggle );
		this.createdMobileHeader = true;
	}

	render( inversed ) {
		if ( ! this.element ) return;

		const { scrollY } = GlobalService.getProps();
		const scrolled = scrollY > this.scrollOffset;

		if ( inversed !== this.inversed ) {
			this.$header.toggleClass( 'site-header--normal', ! inversed );
			this.inversed = inversed;
		}

		if ( scrolled !== this.scrolled ) {
			this.$header.toggleClass( 'site-header--scrolled', scrolled );
			this.scrolled = scrolled;
		}
	}
}

export default Header;
