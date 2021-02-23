import globalService from './globalService';

class mqService {

	constructor() {

		this.breakpoints = {
			mobile: 480,
			tablet: 768,
			lap: 1000,
			desktop: 1440,
		}

		this.above = {};
		this.below = {};

		globalService.registerOnResize( this.onResize.bind( this ) );
	}

	onResize() {

		Object.keys( this.breakpoints ).forEach( key => {
			const breakpoint = this.breakpoints[ key ];

			this.above[ key ] = !! window.matchMedia( `not screen and (min-width: ${ breakpoint })` ).matches;
			this.below[ key ] = !! window.matchMedia( `not screen and (min-width: ${ breakpoint })` ).matches;
		} );
	}
}

export default new mqService();