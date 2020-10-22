import $ from 'jquery';

const LIGHT_THEME = 'user-light-mode',
	  DARK_THEME = 'user-dark-mode';

let theme;

export default class LightsSwitcher {

	constructor( element ) {
		this.$element = $( element );
		this.$lightsSwitcher = this.$element.find('a');

		this.checkLocalStorage();
		this.$lightsSwitcher.on('click', this.switchTheme.bind(this));
	}

	checkLocalStorage() {

		if (localStorage) {
			theme = localStorage.getItem('theme')
		}

		if( body.classList.contains('is-dark-mode') && theme === null ) {

			localStorage.setItem('theme', 'dark-mode');
			theme = localStorage.getItem('theme'); // @todo: Razvan check this
			html.classList.add(DARK_THEME);

			return;
		}

		if (theme === LIGHT_THEME || theme === DARK_THEME) {
			html.classList.add(theme)
		} else {
			html.classList.add(LIGHT_THEME)
		}
	}

	switchTheme(event) {

		event.preventDefault();

		if (theme === DARK_THEME) {
			html.classList.replace(DARK_THEME, LIGHT_THEME);
			localStorage.setItem('theme', 'light-mode');
			theme = LIGHT_THEME;
		} else {
			html.classList.replace(LIGHT_THEME, DARK_THEME);
			localStorage.setItem('theme', 'dark-mode');
			theme = DARK_THEME;
		}
	}
}
