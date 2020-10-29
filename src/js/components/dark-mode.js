import $ from 'jquery';

const COLOR_SCHEME_BUTTON = '.color-scheme-switcher-button',
	STORAGE_ITEM = 'color-scheme-dark',
	$html = $( 'html' );

export default class DarkMode {

	constructor( element ) {
		this.$element = $( element );

		this.$colorSchemeButtons = $( COLOR_SCHEME_BUTTON );
		this.$colorSchemeButtonsLink = this.$colorSchemeButtons.children( 'a' );

		this.theme = null;

		this.initialize();
	}

	initialize() {
		this.bindEvents();
		this.update();
	}

	bindEvents() {
		this.$colorSchemeButtonsLink.on( 'click', this.onClick.bind( this ) );
	}

	onClick( e ) {
		e.preventDefault();

		let isDark = this.isCompiledDark();

		localStorage.setItem( STORAGE_ITEM, !! isDark ? 'light' : 'dark' );

		this.update();
	};

	isSystemDark() {
		const darkModeSetting = $html.data( 'dark-mode-advanced' ),
			USER_PREFER_DARK = !! window.matchMedia && window.matchMedia( '(prefers-color-scheme: dark)' ).matches;

		let isDark = darkModeSetting === 'dark';

		if( darkModeSetting === 'auto' && USER_PREFER_DARK ) {
			isDark = true;
		}

		return isDark;
	}

	isCompiledDark() {
		let isDark = this.isSystemDark();

		let colorSchemeStorageValue = localStorage.getItem( STORAGE_ITEM );

		if ( colorSchemeStorageValue !== null ) {
			isDark = colorSchemeStorageValue === 'dark';
		}

		return isDark;
	}


	update() {
		const isDark = this.isCompiledDark();
		$html.toggleClass( 'is-dark', isDark );
	}
}
