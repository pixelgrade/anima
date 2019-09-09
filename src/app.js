import GlobalService from './components/globalService';
import Hero from './components/hero';
import Header from './components/header';

import { insideHalf } from "./utils";

(function($, window) {

	$(function() {
		const heroes = document.getElementsByClassName( 'novablocks-hero' );
		const HeroCollection = Array.from( heroes ).map( element => new Hero( element ) );
		const siteHeader = new Header( $( '.site-header' ).get(0) );

		GlobalService.registerRender( function() {
			const overlap = HeroCollection.some( function( hero ) {
				return insideHalf( siteHeader.box, hero.box );
			} );
			siteHeader.render( overlap );
		} );
	});

})( jQuery, window );
