import $ from 'jquery';

const LIGHT_THEME = 'color-scheme-light',
	DARK_THEME = 'color-scheme-dark',
	AUTO_THEME = 'color-scheme-auto',
	COLOR_SCHEME_BUTTON = '.is-lights-button',
	USER_PREFER_DARK = window.matchMedia && window.matchMedia( '(prefers-color-scheme: dark)' ).matches;

const $body = $( 'body' );

export default class LightsSwitcher {

	constructor( element ) {
		this.$element = $( element );

		this.$colorSchemeButtons = $( COLOR_SCHEME_BUTTON );
		this.$colorSchemeButtonsLink = this.$colorSchemeButtons.children( 'a' );

		this.theme = null;

		this.initialize();
	}

	initialize() {
		this.checkLocalStorage();
		this.bindClicks();
	}

	bindClicks() {
		this.$colorSchemeButtonsLink.on( 'click', this.switchTheme );
	}


	checkLocalStorage() {

		// Checking local storage for color scheme value.

		if ( localStorage ) {
			this.theme = localStorage.getItem( 'theme' );
		}

		// If color scheme is set on auto and
		// theme was not defined by the user, do nothing.

		if ( $body.hasClass( AUTO_THEME ) && this.theme === null ) {
			return;
		}

		// If color scheme has been defined by the use
		// make sure we remove color-scheme-auto class.

		if ( this.theme !== null ) {
			if ( $body.hasClass( AUTO_THEME ) ) {
				$body.removeClass( AUTO_THEME )
			}
		}

		// When theme is set to dark,
		// add color-scheme-dark class and
		// remove color-scheme-light class
		// and vice-versa if theme is set to light.

		if ( this.theme === DARK_THEME ) {

			$body.addClass( DARK_THEME );

			if ( $body.hasClass( LIGHT_THEME ) ) {
				$body.removeClass( LIGHT_THEME )
			}

		} else if ( this.theme === LIGHT_THEME ) {

			$body.addClass( LIGHT_THEME );

			if ( $body.hasClass( DARK_THEME ) ) {
				$body.removeClass( DARK_THEME )
			}
		}
	}

	switchTheme( event ) {

		event.preventDefault();

		if ( localStorage ) {
			this.theme = localStorage.getItem( 'theme' );
		}

		// User choose a theme, so we are going
		// to remove color-scheme-auto.

		if ( $body.hasClass( AUTO_THEME ) ) {
			$body.removeClass( AUTO_THEME );
		}

		if ( this.theme === DARK_THEME ) {

			// If theme was dark, we are going
			// to change it on light

			$body.removeClass( DARK_THEME ).addClass( LIGHT_THEME );
			localStorage.setItem( 'theme', LIGHT_THEME );
			this.theme = LIGHT_THEME;

		} else if ( this.theme === LIGHT_THEME ) {

			// If theme was light, we are going
			// to change it on dark

			$body.removeClass( LIGHT_THEME ).addClass( DARK_THEME );
			localStorage.setItem( 'theme', DARK_THEME );
			this.theme = DARK_THEME;

		} else {

			// Before first click, color scheme
			// is not defined so we are going
			// to define it considering color scheme setting
			// or user system preference.


			// When color scheme is set on light
			// we are going to switch it on dark

			if ( $body.hasClass( LIGHT_THEME ) ) {
				$body.removeClass( LIGHT_THEME ).addClass( DARK_THEME );
				localStorage.setItem( 'theme', DARK_THEME );
				this.theme = DARK_THEME;
			} else if ( $body.hasClass( DARK_THEME ) ) {

				// When color scheme is set on dark
				// we are going to switch it on light

				$body.removeClass( DARK_THEME ).addClass( LIGHT_THEME );
				localStorage.setItem( 'theme', LIGHT_THEME );
				this.theme = LIGHT_THEME;
			} else {

				// When color scheme is set on auto,
				// we are going to consider user system preferences.

				if ( USER_PREFER_DARK ) {

					// User prefer dark, website is currently dark
					// and we are switch it to light.

					$body.removeClass( DARK_THEME ).addClass( LIGHT_THEME );
					localStorage.setItem( 'theme', LIGHT_THEME );
					this.theme = LIGHT_THEME;

				} else {

					// User is not preferring dark,
					// website is currently light and we
					// are going to switch it to dark.

					$body.removeClass( LIGHT_THEME ).addClass( DARK_THEME );
					localStorage.setItem( 'theme', DARK_THEME );
					this.theme = DARK_THEME;

				}
			}


		}

	}
}
