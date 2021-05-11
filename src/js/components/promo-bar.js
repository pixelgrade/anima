import AnnouncementBar from "./announcement-bar";

export default class PromoBar {

	constructor( element, args ) {
		const announcementBars = element.querySelectorAll( '.novablocks-announcement-bar' );
		const announcementElementsArray = Array.from( announcementBars );

		this.element = element;

		this.bars = announcementElementsArray.map( element => new AnnouncementBar( element, {
			parent: this,
			transitionDuration: 0.5,
			transitionEasing: Power4.easeInOut,
		} ) );

		this.height = 0;
		this.onUpdate = args.onUpdate;
		this.offset = args.offset || 0;
		this.update();
	}

	update() {
		let promoBarHeight = 0;

		this.bars.forEach( bar => {
			promoBarHeight += bar.height;
		} );

		this.height = promoBarHeight;
		this.element.style.top = `${ this.offset }px`;

		if ( typeof this.onUpdate === "function" ) {
			this.onUpdate( this );
		}
	}
}