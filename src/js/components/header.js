import GlobalService from "./globalService";
import { below, setAndResetElementStyles } from '../utils';
import $ from 'jquery';

const defaults = {
	offsetTargetElement: null,
};

const NAVIGATION_OPEN_CLASS = 'navigation-is-open'

class Header {

	constructor( element, args ) {
		if ( ! element ) return;

		this.element = element;
		this.options = Object.assign( {}, defaults, args );

		this.$header = $( this.element );
		this.$toggle = $( '.c-menu-toggle' );
		this.$toggleWrap = $( '.c-menu-toggle__wrap' );
		this.$searchCancelButton = $( '.c-search-overlay__cancel' );
		this.$colorSchemeSwitcher = $( '.is-color-scheme-switcher-button' );
		this.$searchOverlay = $( '.c-search-overlay' );

		this.scrolled = false;
		this.inversed = false;
		this.abovePromoBar = false;
		this.wasSticky = $( 'body' ).is( '.has-site-header-fixed' );

		this.offset = 0;
		this.scrollOffset = 0;
		this.mobileHeaderHeight = 0;
		this.promoBarHeight = 0;

		this.$page = $( '#page .site-content' );
		this.$hero = $( '.has-hero .novablocks-hero' ).first().find( '.novablocks-hero__foreground' );
		this.$promoBar = $('.novablocks-announcement-bar');

		this.createMobileHeader();

		this.onResize();
		this.render();
		GlobalService.registerOnResize( this.onResize.bind( this ) );

		this.initialize();
	}

	initialize() {
		this.timeline = this.getInroTimeline();

		$( '.site-header__wrapper' ).css( 'transition', 'none' );

		this.$header.addClass( 'site-header--fixed site-header--ready' );
		this.$mobileHeader.addClass( 'site-header--fixed site-header--ready' );
		this.initToggleClick();

		this.timeline.play();
	}

	update() {
		this.updatePageOffset();
		this.updateHeaderOffset();
		this.updateMobileHeaderOffset();
		this.updateHeaderButtonsHeight();
		this.updateSearchOverlayOffset();
	}

	getInroTimeline() {
		const element = this.element;
		const timeline = new TimelineMax( { paused: true } );
		const height = $( element ).outerHeight();
		const transitionEasing = Power4.easeInOut;
		const transitionDuration = 0.5;
		timeline.to( element, transitionDuration, { opacity: 1, ease: transitionEasing }, 0 );
		timeline.to( { height: 0 }, transitionDuration, {
			height: height,
			onUpdate: this.onHeightUpdate.bind( this ),
			onUpdateParams: ["{self}"],
			onComplete: () => {
				$( '.site-header__wrapper' ).css( 'transition', '' );
			},
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

		if ( this.$promoBar.length ) {
			this.promoBarHeight = this.$promoBar.outerHeight();
		}
	}

	onResize() {
		const $header = $( this.element );
		const wasScrolled = $header.hasClass( 'site-header--scrolled' );

		setAndResetElementStyles( $header, { transition: 'none' } );
		setAndResetElementStyles( this.$searchOverlay, { transition: 'none' } );
		$header.removeClass( 'site-header--scrolled' );

		this.getProps();
		this.setVisibleHeaderHeight();
		this.shouldMakeHeaderStatic();

		$header.toggleClass( 'site-header--scrolled', wasScrolled );

		this.initHeaderButtons();

		if ( ! this.hasMobileNav() ) {
			$( 'body' ).removeClass( NAVIGATION_OPEN_CLASS );
		}

		this.update();
	}

	shouldMakeHeaderStatic() {
		const $body = $( 'body' );
		const { windowHeight } = GlobalService.getProps();

		if ( this.wasSticky ) {
			$body.toggleClass( 'has-site-header-fixed', this.visibleHeaderHeight < windowHeight * 0.2 );
		}
	}

	updateHeaderOffset() {
		if ( ! this.element ) return;

		this.element.style.marginTop = this.offset + 'px';
	}

	updateMobileHeaderOffset() {
		if ( ! this.$mobileHeader ) return;

		this.$mobileHeader.css( {
			height: this.mobileHeaderHeight,
		} );

		TweenMax.to(this.$mobileHeader, .2, {y: this.offset});

		$( '.site-header__inner-container' ).css( {
			transform:  `translateY(${this.mobileHeaderHeight}px)`
		} );

		this.$toggleWrap.css( {
			height: this.mobileHeaderHeight,
		} );

		TweenMax.to(this.$toggleWrap, .2, {y: this.offset});
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
		TweenMax.set( this.$page, { css: { marginTop: this.visibleHeaderHeight + this.offset } } );
	}

	updateMobileNavigationOffset() {
		const { scrollY } = GlobalService.getProps();

		if ( below('lap') ) {
			this.element.style.marginTop = Math.max(( this.promoBarHeight - scrollY ), 0) + 'px';
		}
	}

	updateMobileHeaderState() {
		const { scrollY } = GlobalService.getProps();
		const abovePromoBar = scrollY > this.promoBarHeight;

		if ( ( abovePromoBar !== this.abovePromoBar ) ) {
			$( body ).toggleClass( 'site-header-mobile--scrolled', abovePromoBar );
			this.abovePromoBar = abovePromoBar;
		}
	}

	updateDesktopHeaderState(inversed) {

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

	createMobileHeader() {
		if ( this.createdMobileHeader ) return;

		const $mobileHeader = $( '.site-header--mobile' );

		if ( $mobileHeader.length ) {
			this.$mobileHeader = $mobileHeader;
			this.createdMobileHeader = true;
			return;
		}

		this.$mobileHeader = $( '<div class="site-header--mobile">' );

		$( '.c-branding' ).first().clone().appendTo( this.$mobileHeader );
		$( '.menu-item--cart' ).first().clone().appendTo( this.$mobileHeader );

		this.$mobileHeader.insertAfter( this.$toggle );
		this.createdMobileHeader = true;
	}

	initHeaderButtons() {

		if ( this.hasMobileNav() ) {
			this.initHeaderSearchButton();
			this.initHeaderLightsButton();
		}

	}

	initHeaderSearchButton() {

		if ( this.movedSearchButton ) {
			return;
		}

		this.$searchButtonWrapper = $( '<div class="search-button__wrapper">' );

		$( '.is-search-button' ).first().clone().appendTo( this.$searchButtonWrapper );

		this.$searchButtonWrapper.insertAfter( '.site-header__wrapper' );
		this.movedSearchButton = true;
	}

	initHeaderLightsButton() {

		if ( this.movedColorSchemeSwitcherButton ) {
			return;
		}

		this.$colorSchemeSwitcherWrapper = $( '<div class="scheme-switcher__wrapper">' );

		$( '.is-color-scheme-switcher-button' ).first().clone().appendTo( this.$colorSchemeSwitcherWrapper );

		this.$colorSchemeSwitcherWrapper.insertAfter( '.site-header__wrapper' );
		this.movedColorSchemeSwitcherButton = true;
	}

	updateHeaderButtonsHeight() {

		const $searchButtonWrapper = $( '.search-button__wrapper' );
		const $lightsButtonWrapper = $(' .scheme-switcher__wrapper' );
		const $buttons = this.$searchCancelButton.add( $searchButtonWrapper, this.$colorSchemeSwitcher, $lightsButtonWrapper );

		$buttons.css( 'height', '' );

		if ( ! below('lap') ) {
			return;
		}

		$buttons.css( 'height', this.mobileHeaderHeight );
	}

	updateSearchOverlayOffset() {
		if ( this.hasMobileNav() && this.$searchOverlay.length ) {
			this.$searchOverlay[0].paddingTop = Math.max(( this.promoBarHeight - scrollY ), 0) + 'px';
		}
	}

	initToggleClick() {
		const $body = $( 'body' );

		this.$toggle.on( 'click', function() {
			$body.toggleClass( NAVIGATION_OPEN_CLASS );
		} );
	}

	hasMobileNav() {
		return below( 'lap' );
	}

	render() {
		if ( ! this.element ) return;

		window.document.body.style.setProperty( '--site-header-height', ( this.visibleHeaderHeight * 0.75 ) + this.promoBarHeight + 'px' );

		this.updateMobileNavigationOffset();
		this.updateMobileHeaderState();
		this.updateDesktopHeaderState(false);
	}
}

export default Header;
