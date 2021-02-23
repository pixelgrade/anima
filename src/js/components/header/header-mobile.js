import globalService from '../globalService';
import HeaderBase from './header-base';
import MenuToggle from './menu-toggle';

import { addClass, toggleClasses } from '../../utils';

class HeaderMobile extends HeaderBase {

	constructor( parent ) {
		super();

		this.parent = parent;
		this.parentContainer = parent.querySelector( '.site-header__inner-container' );
		this.initialize();
		this.onResize();
	}

	initialize() {
		this.initializeMenuToggle();
		this.createMobileHeader();

		HeaderBase.prototype.initialize.call( this );
	}

	render( forceUpdate ) {
		HeaderBase.prototype.render.call( this );
	}

	initializeMenuToggle() {
		const menuToggleCheckbox = document.getElementById( 'nova-menu-toggle' );

		this.navigationIsOpen = menuToggleCheckbox.checked;
		this.menuToggle = new MenuToggle( menuToggleCheckbox, {
			onChange: this.onToggleChange.bind( this )
		} );
	}

	createMobileHeader() {
		this.element = document.createElement( 'div' );
		this.element.setAttribute( 'class', 'site-header--mobile site-header-background site-header-shadow' );
		this.copyElementFromParent( '.c-branding' );
		this.copyElementFromParent( '.menu-item--cart' );
		this.menuToggle.element.insertAdjacentElement( 'afterend', this.element );
		this.createButtonMenu();
	}

	createButtonMenu() {
		let buttonCount = 0;

		this.buttonMenu = document.createElement( 'ul' );
		addClass( this.buttonMenu, 'menu menu--buttons' );

		const buttonSelectors = [
			'.menu-item--search',
			'.menu-item--dark-mode'
		];

		buttonSelectors.forEach( selector => {
			const button = this.parent.querySelector( selector );

			console.log( selector, button );

			if ( button ) {
				const buttonClone = button.cloneNode( true );
				this.buttonMenu.appendChild( buttonClone );
				buttonCount = buttonCount + 1;
			}
		} );

		if ( buttonCount ) {
			// create a fake navigation block to inherit styles
			// @todo hopefully find a better solution for styling
			const navigationBlock = document.createElement( 'div' );
			const wrapper = document.createElement( 'div' );
			addClass( navigationBlock, 'wp-block-novablocks-navigation' );
			addClass( wrapper, 'site-header__buttons-menu wp-block-group__inner-container' );

			wrapper.appendChild( navigationBlock );
			navigationBlock.appendChild( this.buttonMenu );
			this.parent.appendChild( wrapper );
		}
	}

	updateStickyStyles() {
		HeaderBase.prototype.updateStickyStyles.call( this );
		this.applyStickyStyles( this.menuToggle.element );

		toggleClasses( this.element, this.shouldBeSticky, this.initialColorClasses, this.transparentColorClasses );
		this.updateToggleClasses();
	}

	onResize() {
		HeaderBase.prototype.onResize.call( this );
		this.update();
	}

	update() {
		this.menuToggle.element.style.height = `${ this.box.height }px`;
		this.parentContainer.style.paddingTop = `${ this.box.height }px`;
		this.buttonMenu.style.height = `${ this.box.height }px`;
	}

	onToggleChange( event, menuToggle ) {
		const { checked } = event.target;
		document.body.style.overflow = checked ? 'hidden' : '';
		this.navigationIsOpen = !! checked;
		this.updateToggleClasses();
	}

	updateToggleClasses() {
		const { navigationIsOpen, shouldBeSticky, initialColorClasses, transparentColorClasses } = this;
		const isTransparent = navigationIsOpen || ! shouldBeSticky;

		toggleClasses( this.menuToggle.element, isTransparent, transparentColorClasses, initialColorClasses );
	}

	copyElementFromParent( selector ) {
		const element = this.parent.querySelector( selector );
		const elementClone = element?.cloneNode( true );

		if ( elementClone ) {
			this.element.appendChild( elementClone );
		}
	}
}

export default HeaderMobile;