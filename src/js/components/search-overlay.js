import $ from 'jquery';
import BaseComponent from './base-component';
import { setAndResetElementStyles } from '../utils';

const SEARCH_OVERLAY_OPEN_CLASS = 'has-search-overlay';
const ESC_KEY_CODE = 27;

class SearchOverlay extends BaseComponent {

	constructor() {
		super();

		this.$searchOverlay = $( '.c-search-overlay' );

		this.initialize();
		this.onResize();
	}

	initialize() {
		$( document ).on( 'click', '.menu-item--search a', this.openSearchOverlay );
		$( document ).on( 'click', '.c-search-overlay__cancel', this.closeSearchOverlay );
		$( document ).on( 'keydown', this.closeSearchOverlayOnEsc );
	}

	onResize() {
		setAndResetElementStyles( this.$searchOverlay, { transition: 'none' } );
	}

	openSearchOverlay( e ) {
		e.preventDefault();
		$( 'body' ).toggleClass( SEARCH_OVERLAY_OPEN_CLASS );
		$( '.c-search-overlay__form .search-field' ).focus();
	}

	closeSearchOverlayOnEsc( e ) {
		if ( e.keyCode === ESC_KEY_CODE ) {
			$( 'body' ).removeClass( SEARCH_OVERLAY_OPEN_CLASS );
			$( '.c-search-overlay__form .search-field' ).blur();
		}
	}

	closeSearchOverlay( e ) {
		e.preventDefault();
		$( 'body' ).removeClass( SEARCH_OVERLAY_OPEN_CLASS );
	}
}

export default SearchOverlay;
