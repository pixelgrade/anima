import $ from 'jquery';
import BaseComponent from './base-component';
import { setAndResetElementStyles } from '../utils';

class SearchOverlay extends BaseComponent {

	constructor() {
		super();

		this.$searchCancelButton = $( '.c-search-overlay__cancel' );
		this.$searchOverlay = $( '.c-search-overlay' );

		this.initializeToggle();
		this.onResize();
	}

	onResize() {
		setAndResetElementStyles( this.$searchOverlay, { transition: 'none' } );
	}

	initializeToggle() {

		if ( this.movedSearchButton ) {
			return;
		}

		this.$searchButtonWrapper = $( '<div class="search-button__wrapper">' );

		$( '.is-search-button' ).first().clone().appendTo( this.$searchButtonWrapper );

		this.$searchButtonWrapper.insertAfter( '.site-header__wrapper' );
		this.movedSearchButton = true;
	}

	updateSearchOverlayOffset() {
//		if ( this.hasMobileNav() && this.$searchOverlay.length ) {
//			this.$searchOverlay[0].paddingTop = Math.max( ( this.promoBarHeight - scrollY ), 0 ) + 'px';
//		}
	}
}

export default SearchOverlay;
