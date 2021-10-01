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

		if ( ! firstBlock ) {
			return null;
		}

		const attributes = firstBlock.dataset;

		if ( ! hasClass( firstBlock, 'alignfull' ) ) {
			return null;
		}

		if ( hasClass( firstBlock, 'supernova' ) &&
		     parseInt( attributes.imagePadding, 10 ) === 0 &&
		     attributes.cardLayout === 'stacked' ) {
			return firstBlock.querySelector( '.supernova-item__inner-container' );
		}

		const novablocksBlock = firstBlock.querySelector( '.novablocks-block' );

		return novablocksBlock || firstBlock;
	}

	initializeColors() {
		this.initialColorClasses = getColorSetClasses( this.initialColorsSource ).join( ' ' );
		this.transparentColorClasses = this.initialColorClasses;

		if ( this.transparentColorsSource ) {
			this.transparentColorClasses = getColorSetClasses( this.transparentColorsSource ).join( ' ' );
		} else {
			this.transparentColorClasses = 'sm-palette-1 sm-variation-1';
		}

		this.transparentColorClasses = `${ this.transparentColorClasses }`;
	}

	toggleColors( isTransparent ) {
		toggleClasses( this.element, isTransparent, this.transparentColorClasses, this.initialColorClasses );
		toggleLightClasses( this.element );
	}
}

export default HeaderColors;
