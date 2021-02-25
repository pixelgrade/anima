import globalService from '../globalService';

import { addClass, getFirstChild, getColorSetClasses, toggleClasses } from '../../utils';

class HeaderBase {

	constructor() {
		this.offset = 0;
	}

	initialize() {
		this.initializeColors();

		toggleClasses( this.element, true, this.transparentColorClasses, this.initialColorClasses );
		addClass( this.element, 'site-header--ready' );

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

	initializeColors() {
		const content = document.querySelector( '.site-main .entry-content' );
		const firstBlock = getFirstChild( content );
		const novablocksBlock = firstBlock.querySelector( '.novablocks-block' );
		const blockWithColors = novablocksBlock || firstBlock;

		this.initialColorClasses = getColorSetClasses( this.element ).join( ' ' );
		this.transparentColorClasses = getColorSetClasses( blockWithColors ).join( ' ' ) + ' site-header--transparent';
	}
}

export default HeaderBase;