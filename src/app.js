import GlobalService from './components/globalService';
import Hero from './components/hero';
import Header from './components/header';

import { insideHalf } from "./utils";

(function($, window) {

	$(function() {
		const heroElements = document.getElementsByClassName( 'novablocks-hero' );
		const heroElementsArray = Array.from( heroElements );
		const HeroCollection = heroElementsArray.map( element => new Hero( element ) );
		const firstHero = heroElementsArray[0];
		const headerElement = $( '.site-header' ).get(0);
		const header = new Header( headerElement, {
			offsetTargetElement: firstHero || null
		} );

		GlobalService.registerRender( function() {
			const overlap = HeroCollection.some( function( hero ) {
				const { scrollY } = GlobalService.getProps();
				return insideHalf( {
					x: header.box.x,
					y: header.box.y + scrollY,
					width: header.box.width,
					height: header.box.height,
				}, hero.view );
			} );
			header.render( overlap );
		} );
	});

})( jQuery, window );
