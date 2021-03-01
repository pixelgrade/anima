import { addClass } from '../../utils';

import globalService from '../globalService';

class HeaderBase {

	constructor() {
		this.offset = 0;
	}

	initialize() {
		addClass( this.element, 'novablocks-header--ready' );

		globalService.registerRender( this.render.bind( this ) );
		globalService.registerOnResize( this.onResize.bind( this ) );

		this.render();
	}

	onResize() {
		this.box = this.element.getBoundingClientRect();
	}

	getHeight() {
		return this?.box?.height;
	}

	render( forceUpdate ) {
		this.maybeUpdateStickyStyles( forceUpdate );
	}

	maybeUpdateStickyStyles( forceUpdate ) {
		const { scrollY } = globalService.getProps();
		const shouldBeSticky = scrollY > this.offset;

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
			element.style.removeProperty( 'top' );
		} else {
			element.style.position = 'absolute';
			element.style.top = `${ this.offset }px`;
		}
	}
}

export default HeaderBase;