import AnnouncementBar from "./announcement-bar";

export default class PromoBar {

	constructor( classname, args ) {
		const announcementElements = document.getElementsByClassName( classname );
		const announcementElementsArray = Array.from( announcementElements );

		this.bars = announcementElementsArray.map( element => new AnnouncementBar( element, {
			parent: this,
			transitionDuration: 0.5,
			transitionEasing: Power4.easeInOut,
		} ) );

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