import GlobalService from "./globalService";
import MenuToggle from './menu-toggle';

import { below, setAndResetElementStyles, getColorSetClasses, toggleClasses } from '../utils';
import $ from 'jquery';

const defaults = {
	offsetTargetElement: null,
};

//const NAVIGATION_OPEN_CLASS = 'navigation-is-open'

class Header {

	constructor( element, args ) {
		if ( ! element ) return;

		this.element = element;
		this.options = Object.assign( {}, defaults, args );

		this.$header = $( this.element );

		this.menuToggle = new MenuToggle( document.getElementById( 'nova-menu-toggle' ), {
			onChange: this.onToggleChange.bind( this )
		} );

		this.abovePromoBar = false;
		this.wasSticky = $( 'body' ).is( '.has-site-header-fixed' );
		this.siteHeaderSticky = $( '.site-header--secondary' );

		this.offset = 0;
		this.scrollOffset = 0;
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

	onToggleChange( event, menuToggle ) {
		const { checked } = event.target;
		document.body.style.overflow = checked ? 'hidden' : '';
		toggleClasses( menuToggle.element, checked, this.transparentColorClasses, this.initialColorClasses );
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
		this.updatePageOffset();
		this.updateHeaderOffset();
		this.updateStickyHeaderOffset();
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
		this.scrollOffset = this.getScrollOffset();
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

	updateHeaderOffset() {
		requestAnimationFrame(() => {
			if ( ! this?.element?.style ) {
				return;
			}
			this.element.style.marginTop = this.offset + 'px';
		} );
	}

	updateStickyHeaderOffset() {
		requestAnimationFrame( () => {

			if ( ! this.siteHeaderSticky.length ) {
				return;
			}

			this.siteHeaderSticky.css (
				{
					marginTop: this.offset + 'px'
				}
			)
		})
	}

	updateMobileHeaderOffset() {
		if ( ! this.$mobileHeader ) return;

		TweenMax.set( this.$mobileHeader, { height: this.mobileHeaderHeight } );
		TweenMax.set( '.site-header__content', { paddingTop: this.mobileHeaderHeight } );
		TweenMax.to( this.$mobileHeader, .2, { y: this.offset } );
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
			$( body ).toggleClass( 'has-fixed-mobile-site-header', abovePromoBar );
			toggleClasses( this.$mobileHeader[0], abovePromoBar, this.initialColorClasses, this.transparentColorClasses );
			this.abovePromoBar = abovePromoBar;
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
