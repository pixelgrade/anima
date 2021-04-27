import globalService from '../globalService';

import { addClass, hasClass, getFirstChild, getColorSetClasses, toggleClasses, toggleLightClasses } from '../../utils';

class HeaderColors {

	constructor( element, initialColorsSource, transparentColorsSource ) {
		this.element = element;
		this.initialColorsSource = initialColorsSource ? initialColorsSource : element;
		this.transparentColorsSource = transparentColorsSource ? transparentColorsSource : this.getFirstBlockElement();

		this.initializeColors();
	}

	getFirstBlockElement() {
		const content = document.querySelector( '.site-main .entry-content' );
		const firstBlock = content ? getFirstChild( content ) : null;
		const novablocksBlock = firstBlock ? firstBlock.querySelector( '.novablocks-block' ) : null;

		if ( ! firstBlock || ! hasClass( firstBlock, 'alignfull' ) ) {
			return null;
		}

		return novablocksBlock || firstBlock;
	}

	initializeColors() {
		this.initialColorClasses = getColorSetClasses( this.initialColorsSource ).join( ' ' );
		this.transparentColorClasses = this.initialColorClasses;

		if ( this.transparentColorsSource ) {
			this.transparentColorClasses = getColorSetClasses( this.transparentColorsSource ).join( ' ' ) + ' novablocks-header--transparent';
		}
	}

	toggleColors( isTransparent ) {
		toggleClasses( this.element, isTransparent, this.transparentColorClasses, this.initialColorClasses );
		toggleLightClasses( this.element );
	}
}

export default HeaderColors;