import GlobalService from './components/globalService';
import Hero from './components/hero';
import Header from './components/header';
import PromoBar from "./components/promo-bar";

import { insideHalf } from "./utils";

(function($, window) {

	$(function() {
		// initialize hero
		const heroElements = document.getElementsByClassName( 'novablocks-hero' );
		const heroElementsArray = Array.from( heroElements );
		const HeroCollection = heroElementsArray.map( element => new Hero( element ) );

		// initialize header
		const firstHero = heroElementsArray[0];
		const headerElement = $( '.site-header' ).get(0);
		const header = new Header( headerElement, {
			offsetTargetElement: firstHero || null
		} );

		// initialize hero
		const promo = new PromoBar( 'novablocks-announcement-bar', {
			onUpdate: function( promo ) {
				header.offset = promo.height;
				header.update();
			}
		});

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
