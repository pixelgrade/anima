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
				const { scrollY } = GlobalService.getProps();
				return insideHalf( {
					x: siteHeader.box.x,
					y: siteHeader.box.y + scrollY,
					width: siteHeader.box.width,
					height: siteHeader.box.height,
				}, hero.view );
			} );
			siteHeader.render( overlap );
		} );
	});

})( jQuery, window );
