import GlobalService from "./globalService";
import MenuToggle from './menu-toggle';

import { below, setAndResetElementStyles, getColorSetClasses, toggleClasses } from '../utils';
import $ from 'jquery';

const defaults = {}

class Header {

	constructor( element, options ) {
		if ( ! element ) return;

		this.element = element;
		this.options = Object.assign( {}, defaults, options );

		this.$header = $( this.element );

		this.initializeMenuToggle();

		this.wasSticky = $( 'body' ).is( '.has-site-header-fixed' );
		this.siteHeaderSticky = $( '.site-header--secondary' );

		this.offset = 0;
		this.mobileHeaderHeight = 0;
		this.promoBarHeight = 0;

		this.$page = $( '#page .site-content' );
		this.$promoBar = $( '.novablocks-announcement-bar' );

		this.createMobileHeader();
		this.initializeColors();
		this.onResize();
		this.render();

		this.initialize();
	}

	initializeMenuToggle() {
		const menuToggleCheckbox = document.getElementById( 'nova-menu-toggle' );

		this.navigationIsOpen = menuToggleCheckbox.checked;
		this.menuToggle = new MenuToggle( menuToggleCheckbox, {
			onChange: this.onToggleChange.bind( this )
		} );
	}

	onToggleChange( event, menuToggle ) {
		const { checked } = event.target;
		document.body.style.overflow = checked ? 'hidden' : '';
		this.navigationIsOpen = !! checked;
		this.updateToggleClasses();
	}

	updateToggleClasses() {
		const { navigationIsOpen, abovePromoBar, initialColorClasses, transparentColorClasses } = this;
		const isTransparent = navigationIsOpen || ! abovePromoBar;
		toggleClasses( this.menuToggle.element, isTransparent, transparentColorClasses, initialColorClasses );
	}

	initializeColors() {
		let $firstBlock = $( '.entry-content' ).children().first();
		let $novaBlock = $firstBlock.find( '.novablocks-block' );
		let $blockColors = $novaBlock.length ? $novaBlock : $firstBlock;

		this.initialColorClasses = getColorSetClasses( this.element ).join( ' ' );
		this.transparentColorClasses = getColorSetClasses( $blockColors[0] ).join( ' ' ) + ' site-header--transparent';

		this.$header.addClass( this.transparentColorClasses );
		this.$mobileHeader.addClass( this.transparentColorClasses );
	}

	initialize() {
		this.timeline = this.getIntroTimeline();

		$( '.site-header__wrapper' ).css( 'transition', 'none' );

		this.$header.addClass( 'site-header--fixed site-header--ready' );
		this.$mobileHeader.addClass( 'site-header--fixed site-header--ready' );

		this.timeline.play();
	}

	update() {

		requestAnimationFrame(() => {
			this.$page[0].style.marginTop = `${ this.visibleHeaderHeight + this.offset }px`

			if ( this?.element?.style ) {
				this.element.style.marginTop = `${ this.offset }px`;
			}

			if ( this.siteHeaderSticky.length ) {
				this.siteHeaderSticky[0].style.marginTop = `${ this.offset }px`;
			}
		} );

		this.updateMobileHeaderOffset();

//		this.updateHeaderButtonsHeight();
	}

	getIntroTimeline() {
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

		return Math.max( mobileHeaderHeight, this.menuToggle.getHeight() );
	}

	isMobileHeaderVisibile() {
		return this.$mobileHeader.is( ':visible' );
	}

	setVisibleHeaderHeight() {
		this.visibleHeaderHeight = this.isMobileHeaderVisibile() ? this.mobileHeaderHeight : this.box.height;
	}

	getProps() {
		this.box = this.element.getBoundingClientRect();
		this.mobileHeaderHeight = this.getMobileHeaderHeight();
		this.getPromoBarProps();
	}

	getPromoBarProps() {
		if ( this?.$promoBar?.length ) {
			this.promoBarHeight = this.$promoBar.outerHeight();
			this.promoBarOffset = this.$promoBar.offset();
		}
	}

	onResize() {
		const $header = $( this.element );

		setAndResetElementStyles( $header, { transition: 'none' } );

		this.getProps();
		this.setVisibleHeaderHeight();
		this.shouldMakeHeaderStatic();

		if ( ! this.hasMobileNav() ) {
			$( 'body' ).css( 'overflow', '' );
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

	updateMobileHeaderOffset() {
		if ( ! this.$mobileHeader ) return;

		TweenMax.set( '.site-header__inner-container', { paddingTop: this.mobileHeaderHeight } );
		TweenMax.set( this.$mobileHeader, { height: this.mobileHeaderHeight } );
		TweenMax.to( this.$mobileHeader, .2, { y: this.offset } );

		this.menuToggle.element.style.height = `${ this.mobileHeaderHeight }px`;
		this.menuToggle.element.style.transform = `translate3d(0,${ this.offset }px,0)`;
	}

	updateMobileNavigationOffset() {

		if ( ! this.hasMobileNav() ) {
			return;
		}

		const { scrollY } = GlobalService.getProps();
		this.element.style.marginTop = Math.max(( this.promoBarHeight - scrollY ), 0) + 'px';
	}

	updateMobileHeaderState() {

		if ( ! this.hasMobileNav() ) {
			return;
		}

		const { scrollY } = GlobalService.getProps();
		const abovePromoBar = scrollY > ( this.promoBarOffset.top + this.promoBarHeight );

		if ( ( abovePromoBar !== this.abovePromoBar ) ) {
			this.abovePromoBar = abovePromoBar;

			$( body ).toggleClass( 'has-fixed-mobile-site-header', this.abovePromoBar );
			toggleClasses( this.$mobileHeader[0], this.abovePromoBar, this.initialColorClasses, this.transparentColorClasses );
			this.updateToggleClasses();
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

		this.$mobileHeader = $( '<div class="site-header--mobile site-header-background site-header-shadow">' );

		$( '.c-branding' ).first().clone().appendTo( this.$mobileHeader );
		this.$header.find( '.menu-item--cart' ).first().clone().appendTo( this.$mobileHeader );

		this.$mobileHeader.insertAfter( this.menuToggle.element );
		this.createdMobileHeader = true;
	}

	updateHeaderButtonsHeight() {

		const $buttons = this.$searchCancelButton
		                     .add( this.$colorSchemeSwitcher )
		                     .add( '.search-button__wrapper' )
		                     .add( '.scheme-switcher__wrapper' );

		$buttons.css( 'height', '' );

		if ( ! this.hasMobileNav() ) {
			return;
		}

		$buttons.css( 'height', this.mobileHeaderHeight );
	}

	hasMobileNav() {
		return below( 'lap' );
	}

	render() {
		if ( ! this.element ) return;

		window.document.body.style.setProperty( '--site-header-height', `${ this.visibleHeaderHeight + this.promoBarHeight }px` );
		window.document.body.style.setProperty( '--site-promo-bar-height', `${ this.promoBarHeight }px` );

		this.updateMobileNavigationOffset();
		this.updateMobileHeaderState();
	}
}

export default Header;
