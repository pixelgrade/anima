import $ from 'jquery';

const LIGHT_THEME = 'light-mode',
	  DARK_THEME = 'dark-mode';

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
			theme = localStorage.getItem("theme")
		}

		if (theme === LIGHT_THEME || theme === DARK_THEME) {
			body.classList.add(theme)
		} else {
			body.classList.add(LIGHT_THEME)
		}
	}

	switchTheme(event) {

		event.preventDefault();

		if (theme === DARK_THEME) {
			body.classList.replace(DARK_THEME, LIGHT_THEME);
			localStorage.setItem("theme", "light-mode");
			theme = LIGHT_THEME;
		} else {
			body.classList.replace(LIGHT_THEME, DARK_THEME);
			localStorage.setItem("theme", "dark-mode");
			theme = DARK_THEME;
		}
	}
}
