import GlobalService from './components/globalService';
import Hero from './components/hero';

(function($) {
	$(function() {

		const $heroes = $( '.nova-hero' );

		$heroes.each( function( i, obj ) {
			const hero = new Hero( obj );

			const $hero = $( obj );
			$hero.data( 'hero', hero );

			const timeline = getTimeline( $hero );
			$hero.data( 'timeline', timeline );

			GlobalService.registerUpdate( function() {
				hero.update();

				if ( timeline.paused() && timeline.progress() > 0 ) {
					updateTimelineOnScroll( $hero );
				}
			} );

			timeline.play();
		} );

		function getTimeline( $hero ) {
			const pieces = getMarkupPieces( $hero );

			let timeline = new TimelineMax( { paused: true } );

			if ( isFirstHero( $hero ) ) {
				timeline = addIntroToTimeline( timeline, pieces );
			}

			timeline.addLabel( 'middle' );
			timeline = addOutroToTimeline( timeline, pieces );
			timeline.addLabel( 'end' );

			pauseTimelineOnScroll( timeline, $hero );

			return timeline;
		}

		function pauseTimelineOnScroll( timeline, $hero ) {
			const hero = $hero.data( 'hero' );
			const middleTime = timeline.getLabelTime( 'middle' );
			const endTime = timeline.getLabelTime( 'end' );

			timeline.eventCallback( 'onUpdate', function( tl ) {
				const time = tl.time();

				// calculate the current timeline progress relative to middle and end labels
				// in such a way that timelineProgress is 0.5 for middle and 1 for end
				// because we don't want the animation to be stopped before the middle label
				const tlProgress = ( time - middleTime ) / ( endTime - middleTime );
				const scrollProgress = hero.progress.y;

				if ( ( tlProgress * 0.5 + 0.5 ) >= scrollProgress ) {
					tl.pause();
				}

			}, [ "{self}" ] );
		}

		function updateTimelineOnScroll( $hero ) {
			const timeline = $hero.data( 'timeline' );
			const hero = $hero.data( 'hero' );
			const middleTime = timeline.getLabelTime( 'middle' );
			const endTime = timeline.getLabelTime( 'end' );

			const scrollProgress = hero.progress.y;

			// ( scrollProgress - 0.5 ) / ( 1 - 0.5 ) = ( newTlProgress - minTlProgress ) / ( 1 - minTlProgress );
			// ( scrollProgress - 0.5 ) * 2 * ( 1 - minTlProgress ) = ( newTlProgress - minTlProgress );
			// newTlProgress = ( scrollProgress - 0.5 ) * 2 * ( 1 - minTlProgress ) + minTlProgress;
			const minTlProgress = middleTime / endTime;
			const newTlProgress = ( scrollProgress - 0.5 ) * 2 * ( 1 - minTlProgress ) + minTlProgress;
			timeline.progress( newTlProgress );
		}

		function isFirstHero( $hero ) {
			return true;
		}

		function getMarkupPieces( $hero ) {
			const container = $hero.find( '.nova-hero__inner-container' );
			const headline = container.children().first().filter( '.c-headline' );
			const title = headline.find( '.c-headline__primary' );
			const subtitle = headline.find( '.c-headline__secondary' );
			const separator = headline.next( '.c-separator' );
			const sepFlower = separator.find( '.c-separator__flower' );
			const sepLine = separator.find( '.c-separator__line' );
			const sepArrow = separator.find( '.c-separator__arrow' );
			const others = container.children().not( headline ).not( separator );

			return { headline, title, subtitle, separator, sepFlower, sepLine, sepArrow, others }
		}

		function addIntroToTimeline( timeline, { title, subtitle, separator, sepFlower, sepLine, sepArrow, others } ) {

			if ( title.length && title.text().trim().length ) {

				timeline.fromTo( title, 0.72, {
					'letter-spacing': '1em',
					'margin-right': '-0.9em'
				}, {
					'letter-spacing': '0.2em',
					'margin-right': '-0.1em',
					ease: Expo.easeOut
				}, 0 );

				timeline.fromTo( title, 0.89, {
					opacity: 0
				}, {
					opacity: 1,
					ease: Expo.easeOut
				}, 0 );

				timeline.fromTo( title, 1, {
					'y': 30
				}, {
					'y': 0,
					ease: Expo.easeOut
				}, 0);

			}

			if ( subtitle.length ) {
				timeline.fromTo(subtitle, 0.65, {opacity: 0}, {opacity: 1, ease: Quint.easeOut}, '-=0.65');
				timeline.fromTo(subtitle, 0.9, {y: 30}, {y: 0, ease: Quint.easeOut}, '-=0.65');
			}

			if ( sepFlower.length ) {
				timeline.fromTo(sepFlower, 0.15, {opacity: 0}, {opacity: 1, ease: Quint.easeOut}, '-=0.6');
				timeline.fromTo(sepFlower, 0.55, {rotation: -270}, {rotation: 0, ease: Back.easeOut}, '-=0.5');
			}

			if ( sepLine.length ) {
				timeline.fromTo(sepLine, 0.6, {width: 0}, {width: '42%', opacity: 1, ease: Quint.easeOut}, '-=0.55');
				timeline.fromTo(separator, 0.6, {width: 0}, {width: '100%', opacity: 1, ease: Quint.easeOut}, '-=0.6');
			}

			if ( sepArrow.length ) {
				timeline.fromTo(sepArrow, 0.2, {opacity: 0}, {opacity: 1, ease: Quint.easeOut}, '-=0.27');
			}

			if ( others.length ) {
				timeline.fromTo(others, 0.5, {opacity: 0}, {opacity: 1, ease: Quint.easeOut}, '-=0.28');
				timeline.fromTo(others, 0.75, {y: -20}, {y: 0}, '-=0.5');
			}

			return timeline;
		}

		function addOutroToTimeline( timeline, { title, subtitle, others, separator, sepLine, sepFlower, sepArrow } ) {

			timeline.fromTo( title, 1.08, {
				y: 0
			}, {
				opacity: 0,
				y: -60,
				ease: Quad.easeIn
			}, 'middle' );

			timeline.to( subtitle, 1.08, {
				opacity: 0,
				y: -90,
				ease: Quad.easeIn
			}, 'middle');

			timeline.to( others, 1.08, {
				y: 60,
				opacity: 0,
				ease: Quad.easeIn
			}, 'middle' );

			timeline.to( sepLine, 0.86, {width: '0%', opacity: 0, ease: Quad.easeIn}, '-=0.94');
			timeline.to( separator, 0.86, {width: '0%', opacity: 0, ease: Quad.easeIn}, '-=0.86');
			timeline.to( sepFlower, 1, {rotation: 180}, '-=1.08');
			timeline.to( sepFlower, 0.11, {opacity: 0}, '-=0.03');
			timeline.to( sepArrow, 0.14, {opacity: 0}, '-=1.08');

			return timeline;
		}

	});
})( jQuery );