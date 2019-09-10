import GlobalService from "./globalService";

export default class Hero {

	constructor( element ) {
		this.element = element;
		this.progress = 0;
		this.timeline = new TimelineMax( { paused: true, onComplete: () => { this.paused = true } } );
		this.pieces = this.getMarkupPieces();
		this.paused = false;
		this.update();
		this.updateOnScroll();
		this.init();
	}

	init() {

		GlobalService.registerUpdate(() => {
			this.update();
		});

		GlobalService.registerRender( () => {
			this.updateOnScroll();
			this.updateTimelineOnScroll();
		});

		this.addIntroToTimeline();
		this.timeline.addLabel( 'middle' );
		this.addOutroToTimeline();
		this.timeline.addLabel( 'end' );

		this.pauseTimelineOnScroll();
		this.timeline.play();
	}

	update() {
		const { scrollY, scrollHeight, windowHeight } = GlobalService.getProps();
		this.box = this.element.getBoundingClientRect();
		this.view = {
			x: this.box.x,
			y: this.box.y + scrollY,
			width: this.box.width,
			height: this.box.height,
		};

		// used to calculate animation progress
		const length = windowHeight * 0.5;
		const middleMin = 0;
		const middleMax = scrollHeight - windowHeight - length * 0.5;
		const middle = scrollY + this.box.top + ( this.box.height - windowHeight ) * 0.5;
		const middleMid = Math.max( middleMin, Math.min( middle, middleMax ) );

		this.start = middleMid - length * 0.5;
		this.end = this.start + length;
	}

	getMarkupPieces() {
		const container = jQuery( this.element ).find( '.novablocks-hero__inner-container' );
		const headline = container.children().first().filter( '.c-headline' );
		const title = headline.find( '.c-headline__primary' );
		const subtitle = headline.find( '.c-headline__secondary' );
		const separator = headline.next( '.c-separator' );
		const sepFlower = separator.find( '.c-separator__flower' );
		const sepLine = separator.find( '.c-separator__line' );
		const sepArrow = separator.find( '.c-separator__arrow' );
		const others = container.children().not( headline ).not( separator );

		return { headline, title, subtitle, separator, sepFlower, sepLine, sepArrow, others };
	}

	addIntroToTimeline() {
		const timeline = this.timeline;
		const { headline, title, subtitle, separator, sepFlower, sepLine, sepArrow, others } = this.pieces;

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

			// aici era title dar facea un glitch ciudat
			timeline.fromTo( headline, 1, {
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

		this.timeline = timeline;
	}

	addOutroToTimeline() {
		const { title, subtitle, others, separator, sepLine, sepFlower, sepArrow } = this.pieces;
		const timeline = this.timeline;

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

		this.timeline = timeline;
	}

	pauseTimelineOnScroll() {
		const middleTime = this.timeline.getLabelTime( 'middle' );
		const endTime = this.timeline.getLabelTime( 'end' );

		this.timeline.eventCallback( 'onUpdate', ( tl ) => {
			const time = tl.time();

			// calculate the current timeline progress relative to middle and end labels
			// in such a way that timelineProgress is 0.5 for middle and 1 for end
			// because we don't want the animation to be stopped before the middle label
			const tlProgress = ( time - middleTime ) / ( endTime - middleTime );
			const pastMiddle = time > middleTime;
			const pastScroll = ( tlProgress * 0.5 + 0.5 ) >= this.progress;

			if ( pastMiddle && pastScroll ) {
				tl.pause();
				this.timeline.eventCallback( 'onUpdate', null );
				this.paused = true;
			}

		}, [ "{self}" ] );
	}

	updateOnScroll() {
		const { scrollY } = GlobalService.getProps();
		this.progress = ( scrollY - this.start ) / ( this.end - this.start );
	}

	updateTimelineOnScroll() {

		if ( ! this.paused ) {
			return;
		}

		const currentProgress = this.timeline.progress();
		const middleTime = this.timeline.getLabelTime( 'middle' );
		const endTime = this.timeline.getLabelTime( 'end' );

		// ( this.progress - 0.5 ) / ( 1 - 0.5 ) = ( newTlProgress - minTlProgress ) / ( 1 - minTlProgress );
		// ( this.progress - 0.5 ) * 2 * ( 1 - minTlProgress ) = ( newTlProgress - minTlProgress );
		// newTlProgress = ( this.progress - 0.5 ) * 2 * ( 1 - minTlProgress ) + minTlProgress;
		const minTlProgress = middleTime / endTime;
		let newTlProgress = ( this.progress - 0.5 ) * 2 * ( 1 - minTlProgress ) + minTlProgress;
		newTlProgress = Math.min( Math.max( minTlProgress, newTlProgress ), 1 );

		if ( currentProgress === newTlProgress ) {
			return;
		}

		this.timeline.progress( newTlProgress );
	}
}