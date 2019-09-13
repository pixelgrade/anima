import GlobalService from "./globalService";

const defaults = {
	offsetTargetElement: null,
};

class Header {

	constructor( element, args ) {
		this.element = element;
		this.inversed = ! jQuery( this.element ).hasClass( 'site-header--normal' );
		this.options = Object.assign( {}, defaults, args );

		this.offset = 0;
		this.scrollOffset = 0;

		this.update();
		this.registerUpdate();
	}

	registerUpdate() {
		GlobalService.registerUpdate( () => {
			this.update();
		} );
	}

	update() {
		this.box = this.element.getBoundingClientRect();
		this.scrollOffset = this.getScrollOffset();
		this.element.style.marginTop = this.offset + 'px';
		this.updatePageOffset();

		jQuery( this.element ).addClass( 'site-header--fixed site-header--ready' );
	}

	getScrollOffset() {
		const { adminBarHeight, scrollY } = GlobalService.getProps();
		const { offsetTargetElement } = this.options;

		if ( offsetTargetElement ) {
			const offsetTargetBox = offsetTargetElement.getBoundingClientRect();
			const targetBottom = offsetTargetBox.top + scrollY + offsetTargetBox.height;
			const headerOffset = adminBarHeight + this.offset + this.box.height / 2;
			return targetBottom - headerOffset;
		}

		return 0;
	}

	updatePageOffset() {
		const page = document.getElementById( 'page' );
		page.style.paddingTop = this.box.height + this.offset + 'px';
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