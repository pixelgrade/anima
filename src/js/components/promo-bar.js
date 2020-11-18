import AnnouncementBar from "./announcement-bar";

export default class PromoBar {

	constructor( elements, args ) {
		const announcementElementsArray = Array.from( elements );

		this.bars = announcementElementsArray.map( element => new AnnouncementBar( element, {
			parent: this,
			transitionDuration: 0.5,
			transitionEasing: Power4.easeInOut,
		} ) );
		this.height = 0;
		this.onUpdate = args.onUpdate;
		this.update();
	}

	update() {
		let promoBarHeight = 0;

		this.bars.forEach( bar => {
			promoBarHeight += bar.height;
		} );

		this.height = promoBarHeight;
		
		if ( typeof this.onUpdate === "function" ) {
			this.onUpdate( this );
		}
	}
}