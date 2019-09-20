import GlobalService from './globalService';

export default class Navbar {

	constructor() {
		this.$menuItems = jQuery( '.menu-item' );
		this.$menuItemsWithChildren = this.$menuItems.filter( '.menu-item-has-children' ).removeClass( 'hover' );
		this.$menuItemsWithChildrenLinks = this.$menuItemsWithChildren.children( 'a' );

		this.initialize();
	}

	initialize() {
		this.onResize();
		this.initialized = true;
		GlobalService.registerUpdate( this.onResize.bind( this ) );
	}

	onResize() {
		const mq = window.matchMedia( "only screen and (min-width: 1000px)" );

		// we are on desktop
		if ( mq.matches ) {

			if ( this.initialized && ! this.desktop ) {
				this.unbindClick();
			}

			if ( ! this.initialized || ! this.desktop ) {
				this.bindHoverIntent();
			}

			this.desktop = true;
			return;
		}

		if ( this.initialized && this.desktop ) {
			this.unbindHoverIntent();
		}

		if ( ! this.initialized || this.desktop ) {
			this.bindClick();
		}

		this.desktop = false;
		return;
	}

	onClickMobile( event ) {
		const $link = jQuery( this );
		const $siblings = $link.parent().siblings().not( $link );

		if ( $link.is( '.active' ) ) {
			return;
		}

		event.preventDefault();

		$link.addClass( 'active' ).parent().addClass( 'hover' );
		$siblings.removeClass( 'hover' );
		$siblings.find( '.active' ).removeClass( 'active' );
	}

	bindClick() {
		this.$menuItemsWithChildrenLinks.on( 'click', this.onClickMobile );
	}

	unbindClick() {
		this.$menuItemsWithChildrenLinks.off( 'click', this.onClickMobile );
	}

	bindHoverIntent() {
		this.$menuItems.hoverIntent( {
			out: function() {
				jQuery( this ).removeClass( 'hover' );
			},
			over: function() {
				jQuery( this ).addClass( 'hover' );
			},
			timeout: 200
		} );
	}

	unbindHoverIntent() {
		this.$menuItems.off( 'mousemove.hoverIntent mouseenter.hoverIntent mouseleave.hoverIntent' );
		delete this.$menuItems.hoverIntent_t;
		delete this.$menuItems.hoverIntent_s;
	}
}
