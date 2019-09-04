import GlobalService from './components/globalService';
import Hero from './components/hero';

(function($) {
	$(function() {
	});

	$(window).on('load', function() {
		const HeroCollection = $( '.novablocks-hero' ).map( ( i, obj ) => new Hero( obj ) );
	});
})( jQuery );