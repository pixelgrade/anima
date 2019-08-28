import GlobalService from "./globalService";

export default class Hero {

	constructor( element ) {
		this.element = element;
		this.progress = {
			x: 0,
			y: 0,
		};
		this.update();
	}

	update() {
		const { windowWidth, windowHeight, scrollX, scrollY } = GlobalService.getProps();

		this.box = this.element.getBoundingClientRect();

		const progress = {
			x: ( windowWidth - this.box.left ) / ( windowWidth + this.box.width ),
			y: ( windowHeight - this.box.top ) / ( windowHeight + this.box.height )
		}

		this.progress = {
			x: Math.min( Math.max( 0, progress.x ), 1 ),
			y: Math.min( Math.max( 0, progress.y ), 1 ),
		}
	}
}