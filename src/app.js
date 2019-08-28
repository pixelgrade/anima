import GlobalService from './components/globalService';
import Hero from './components/hero';

(function($) {
	$(function() {

		const $heroes = $( '.nova-hero' );

		$heroes.each( function( i, obj ) {
			const hero = new Hero( obj );
			const $hero = $( obj ).data( 'hero', hero );
			GlobalService.registerUpdate( hero.update.bind( hero ) );
		} );

		function update() {
			$heroes.each( function( i, obj ) {
				const $hero = $( obj );
				const hero = $hero.data( 'hero' );

				const $primary = $hero.find( '.c-headline__primary' );
				const $secondary = $hero.find( '.c-headline__secondary' );

				let progress = ( hero.progress.y - 0.5 ) * 2;
				progress = Math.min( Math.max( 0, progress ), 1 );
				let move = -200 * progress;

				$primary.css( {
					transform: 'translateY(' + move * 0.5 + 'px)',
					opacity: 1 - progress,
				} );

				$secondary.css( {
					transform: 'translateY(' + move + 'px)',
					opacity: 1 - progress,
				} );
			} );
		}

		GlobalService.registerRender(update);


	});
})( jQuery );