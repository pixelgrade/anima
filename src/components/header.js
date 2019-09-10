import GlobalService from "./globalService";

const defaults = {
	offsetTargetElement: null,
};

class Header {
	constructor( element, args ) {
		this.element = element;
		this.inversed = ! jQuery( this.element ).hasClass( 'site-header--normal' );
		this.scrollOffset = 0;
		this.options = Object.assign( {}, defaults, args );
		this.update();
		this.init();
	}

	init() {
		GlobalService.registerUpdate( this.update.bind( this ) );
	}

	update() {
		const { scrollY } = GlobalService.getProps();
		const page = document.getElementById( 'page' );
		const { offsetTargetElement } = this.options;
		this.box = this.element.getBoundingClientRect();

		if ( offsetTargetElement ) {
			const offsetBox = offsetTargetElement.getBoundingClientRect();
			this.scrollOffset = offsetBox.top + offsetBox.height + scrollY - this.box.height / 2;
		}

		page.style.paddingTop = this.box.height + 'px';

		jQuery( this.element ).addClass( 'site-header--fixed site-header--ready' );
	}

	render( inversed ) {
		const { scrollY } = GlobalService.getProps();

		if ( inversed !== this.inversed ) {
			jQuery( this.element ).toggleClass( 'site-header--normal', ! inversed );
			this.inversed = inversed;
		}

		jQuery( this.element ).toggleClass( 'site-header--scrolled', scrollY > this.scrollOffset );
	}
}

export default Header;