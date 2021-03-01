import globalService from './globalService';

class mqService {

	constructor() {

		this.breakpoints = {
			mobile: '480px',
			tablet: '768px',
			lap: '1000px',
			desktop: '1440px',
		}

		this.above = {};
		this.below = {};

		globalService.registerOnResize( this.onResize.bind( this ) );

		this.onResize();
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