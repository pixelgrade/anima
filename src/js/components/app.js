import $ from 'jquery';

import GlobalService from './globalService';
import Hero from './hero';
import CommentsArea from './commentsArea';
import Header from './header/index';
import PromoBar from "./promo-bar";
import Navbar from "./navbar";

import SearchOverlay from './search-overlay';

import { toggleLightClasses } from '../utils';

export default class App {

	constructor() {

		this.adminBar = document.getElementById( 'wpadminbar' );
		this.adminBarFixed = false;
		this.promoBarFixed = false;
		this.adminBarHeight = 0;
		this.updateAdminBarProps();

		this.enableFirstBlockPaddingTop = $( 'body' ).hasClass( 'has-novablocks-header-transparent' );

		this.initializeHero();
		this.initializeHeader();
		this.initializeLogo();
		this.initializeNavbar();
		this.searchOverlay = new SearchOverlay();
		this.initializePromoBar();
		this.initializeImages();
		this.initializeCommentsArea();
		this.initializeReservationForm();

		window.addEventListener( 'resize', this.onResize.bind( this ) );
	}

	onResize() {
		this.updateAdminBarProps();
		this.updatePromoBarProps();

		if ( !! this.promoBar ) {
			this.promoBar.offset = this.adminBarHeight;
			this.promoBar.update();
		} else {
			this.onPromoBarUpdate();
		}

		if ( this?.header?.mobileHeader ) {
			this.header.mobileHeader.top = this.adminBarHeight;
		}
	}

	initializeImages() {
		const showLoadedImages = this.showLoadedImages.bind( this );
		showLoadedImages();

		GlobalService.registerObserverCallback( function( mutationList ) {
			$.each( mutationList, ( i, mutationRecord ) => {
				$.each( mutationRecord.addedNodes, ( j, node ) => {
					const nodeName = node.nodeName && node.nodeName.toLowerCase();
					if ( 'img' === nodeName || node.childNodes.length ) {
						showLoadedImages( node );
					}
				} );
			} );
		} );
	}

	initializeLogo() {
		const wrappers = document.querySelectorAll( '[class*="sm-palette"]' );

		wrappers.forEach( toggleLightClasses );
	}

	initializeReservationForm() {
		GlobalService.registerObserverCallback( function( mutationList ) {
			$.each( mutationList, ( i, mutationRecord ) => {
				$.each( mutationRecord.addedNodes, ( j, node ) => {
					const $node = $( node );
					if ( $node.is( '#ot-reservation-widget' ) ) {
						$node.closest( '.novablocks-opentable' ).addClass( 'is-loaded' );
					}
				} )
			} );
		} );
	}

	updateAdminBarProps() {

		if ( ! this.adminBar ) {
			return;
		}

		this.adminBarHeight = this.adminBar.offsetHeight ;
		const adminBarStyle = window.getComputedStyle( this.adminBar );
		this.adminBarFixed = adminBarStyle.getPropertyValue( 'position' ) === 'fixed';
	}

	showLoadedImages( container = document.body ) {
		const $images = $( container ).find( 'img' ).not( '[srcset], .is-loaded, .is-broken' );

		$images.imagesLoaded().progress( ( instance, image ) => {
			const className = image.isLoaded ? 'is-loaded' : 'is-broken';
			$( image.img ).addClass( className );
		} );
	}

	initializeHero() {
		const heroElements = document.getElementsByClassName( 'novablocks-hero' );
		const heroElementsArray = Array.from( heroElements );

		this.HeroCollection = heroElementsArray.map( element => new Hero( element ) );
		this.firstHero = heroElementsArray[0];
	}

	initializeCommentsArea() {
		const $commentsArea = $( '.comments-area' );

		if ( $commentsArea.length ) {
			this.commentsArea = new CommentsArea( $commentsArea.get(0) );
		}
	}

	initializeHeader() {
		const header = document.querySelector( '.novablocks-header' );

		if ( !! header ) {
			this.header = new Header( header, {
				onResize: this.onHeaderUpdate.bind( this )
			} );
		}
	}

	initializeNavbar() {
		this.navbar = new Navbar();
	}

	initializePromoBar() {
		const promoBar = document.querySelector( '.promo-bar' );

		if ( ! promoBar ) {
			this.onPromoBarUpdate();
			return;
		}

		this.promoBar = new PromoBar( promoBar, {
			offset: this.adminBarHeight,
			onUpdate: this.onPromoBarUpdate.bind( this )
		});

		this.updatePromoBarProps();
	}

	updatePromoBarProps() {

		if ( ! this.promoBar ) {
			return;
		}

		const promoBarStyle = window.getComputedStyle( this.promoBar.element );
		this.promoBarFixed = promoBarStyle.getPropertyValue( 'position' ) === 'fixed';
	}

	onPromoBarUpdate() {
		const header = this.header;
		const HeroCollection = this.HeroCollection;
		const promoBarHeight = !! this.promoBar ? this.promoBar.height : 0;

		const adminBarTop = this.adminBarFixed ? this.adminBarHeight : 0;
		const promoBarTop = this.promoBarFixed ? promoBarHeight : 0;
		const stickyDistance = adminBarTop + promoBarTop;
		const staticDistance = this.adminBarHeight + promoBarHeight;

		if ( !! header ) {
			header.stickyDistance = stickyDistance;
			header.staticDistance = staticDistance;
			header.render( true );

			header.mobileHeader.stickyDistance = stickyDistance;
			header.mobileHeader.staticDistance = staticDistance;
			header.mobileHeader.render( true );
		}

		HeroCollection.forEach( hero => {
			hero.offset = promoBarHeight;
			hero.updateOnScroll();
		} );

		this.onHeaderUpdate();
	}

	onHeaderUpdate() {

		if ( ! this.enableFirstBlockPaddingTop ) {
			return false;
		}

		const promoBarHeight = this.promoBar?.height || 0;
		const headerHeight = this.header?.getHeight() || 0;

		$( 'body:not(.has-no-spacing-top) .site-content' ).css( 'marginTop', `${ promoBarHeight + headerHeight }px` );
		$( 'html' ).css( 'scrollPaddingTop', `${ headerHeight }px` );

		const $firstBlock = $( '.entry-content > :first-child' );

		if ( $firstBlock.is( '.supernova' ) ) {
			const paddingTop = getPaddingTop( $firstBlock );
			$firstBlock.css( 'paddingTop', paddingTop + headerHeight + promoBarHeight );
			return;
		}

		const $firstBlockFg = $firstBlock.find( '.novablocks-doppler__foreground' );

		if ( $firstBlockFg.length ) {
			const paddingTop = getPaddingTop( $firstBlockFg );
			$firstBlockFg.css( 'paddingTop', Math.max( paddingTop, headerHeight + promoBarHeight ) );
		}
	}
}

const getPaddingTop = ( $element ) => {
	return parseInt( $element.css( 'paddingTop', '' ).css( 'paddingTop' ), 10 ) || 0
}
