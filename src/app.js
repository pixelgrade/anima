import GlobalService from './components/globalService';
import Hero from './components/hero';
import Header from './components/header';
import PromoBar from "./components/promo-bar";

import { insideHalf, reloadRellax } from "./utils";

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
		const promo = new PromoBar( document.querySelectorAll( '.promo-bar .novablocks-announcement-bar' ), {
			onUpdate: function( promo ) {
				header.offset = promo.height;
				header.update();
				HeroCollection.forEach( hero => {
					hero.offset = promo.height;
					hero.updateOnScroll();

					$( hero.element ).find( '.novablocks-hero__parallax' ).each( ( i, obj ) => {
						reloadRellax( obj )
					} );
				} );
			}
		});

		GlobalService.registerRender( function() {
			const { scrollY, adminBarHeight } = GlobalService.getProps();
			const overlap = HeroCollection.some( function( hero ) {
				return insideHalf( {
					x: header.box.x,
					y: header.box.y + scrollY,
					width: header.box.width,
					height: header.box.height,
				}, {
					x: hero.box.x,
					y: hero.box.y + promo.height,
					width: hero.box.width,
					height: hero.box.height,
				} );
			} );
			header.render( overlap );
		} );
	});

})( jQuery, window );
