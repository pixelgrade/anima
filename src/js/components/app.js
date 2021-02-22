import $ from 'jquery';

import { insideHalf, debounce } from "../utils";
import GlobalService from './globalService';
import Hero from './hero';
import CommentsArea from './commentsArea';
import Header from './header/index';
import PromoBar from "./promo-bar";
import Navbar from "./navbar";

import SearchOverlay from './search-overlay';

export default class App {

	constructor() {
		this.initializeHero();
		this.initializeHeader();
		this.initializeNavbar();
		this.searchOverlay = new SearchOverlay();
		this.initializePromoBar();
		this.initializeImages();
		this.initializeCommentsArea();
		this.initializeReservationForm();
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
		const $header = $( '.site-header' );

		if ( $header.length ) {
			this.header = new Header( $header.get(0) );
		}
	}

	initializeNavbar() {
		this.navbar = new Navbar();
	}

	initializePromoBar() {
		const announcementBars = document.querySelectorAll( '.promo-bar .novablocks-announcement-bar' );

		this.promoBar = new PromoBar( announcementBars, {
			onUpdate: this.onPromoBarUpdate.bind( this )
		});
	}

	onPromoBarUpdate( promoBar ) {
		const header = this.header;
		const HeroCollection = this.HeroCollection;
		const promoBarHeight = !! promoBar ? promoBar.height : 0;

		if ( !! header ) {
			document.body.style.setProperty( '--theme-promobar-height', `${ promoBarHeight }px` );

			console.log( header.getHeight() );

			header.offset = promoBarHeight;
			header.render( true );

			header.mobileHeader.offset = promoBarHeight;
			header.mobileHeader.render( true );
		}

		HeroCollection.forEach( hero => {
			hero.offset = promoBarHeight;
			hero.updateOnScroll();
		} );
	}
}
