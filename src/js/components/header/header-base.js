import { addClass } from '../../utils';

import globalService from '../globalService';

class HeaderBase {

	constructor( options ) {
		this.offset = 0;
		this.options = options || {};
	}

	initialize() {
		addClass( this.element, 'novablocks-header--ready' );

		globalService.registerRender( this.render.bind( this ) );
		globalService.registerOnResize( this.onResize.bind( this ) );

		this.render();
	}

	onResize() {
		this.box = this.element.getBoundingClientRect();

		if ( typeof this.options.onResize === "function" ) {
			this.options.onResize();
		}
	}

	getHeight() {
		return this?.box?.height;
	}

	render( forceUpdate ) {
		this.maybeUpdateStickyStyles( forceUpdate );
	}

	maybeUpdateStickyStyles( forceUpdate ) {
		const { scrollY } = globalService.getProps();
		const shouldBeSticky = scrollY > this.offset - this.top;

		if ( this.shouldBeSticky === shouldBeSticky && ! forceUpdate ) {
			return;
		}

		this.shouldBeSticky = shouldBeSticky;
		this.updateStickyStyles();
	}

	updateStickyStyles() {
		this.applyStickyStyles( this.element );
	}

	applyStickyStyles( element ) {
		if ( this.shouldBeSticky ) {
			element.style.position = 'fixed';
			element.style.top = `${ this.top }px`;
		} else {
			element.style.position = 'absolute';
			element.style.top = `${ this.offset }px`;
		}
	}
}

export default HeaderBase;