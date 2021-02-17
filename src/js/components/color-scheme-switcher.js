import $ from 'jquery';
import BaseComponent from './base-component';
import { setAndResetElementStyles } from '../utils';

class ColorSchemeSwitcher extends BaseComponent {

	constructor() {
		super();

		this.initializeToggle();
	}

	initializeToggle() {

		if ( this.movedColorSchemeSwitcherButton ) {
			return;
		}

		this.$colorSchemeSwitcherWrapper = $( '<div class="scheme-switcher__wrapper">' );

		$( '.is-color-scheme-switcher-button' ).first().clone().appendTo( this.$colorSchemeSwitcherWrapper );

		this.$colorSchemeSwitcherWrapper.insertAfter( '.site-header__wrapper' );
		this.movedColorSchemeSwitcherButton = true;
	}
}

export default ColorSchemeSwitcher;