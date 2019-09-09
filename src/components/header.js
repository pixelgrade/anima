import GlobalService from "./globalService";

class Header {
	constructor( element ) {
		this.element = element;
		this.inversed = ! jQuery( this.element ).hasClass( 'site-header--normal' );
		this.update();
		this.init();
	}

	init() {
		GlobalService.registerUpdate( this.update.bind( this ) );
	}

	update() {
		const page = document.getElementById( 'page' );
		this.box = this.element.getBoundingClientRect();

		page.style.paddingTop = this.box.height + 'px';

		jQuery( this.element ).addClass( 'site-header--fixed site-header--ready' );
	}

	render( inversed ) {
		if ( inversed !== this.inversed ) {
			jQuery( this.element ).toggleClass( 'site-header--normal', ! inversed );
			this.inversed = inversed;
		}

		jQuery( this.element ).toggleClass( 'site-header--scrolled', GlobalService.getProp( 'scrollY' ) > 0 );
	}
}

export default Header;