import GlobalService from './globalService';

class BaseComponent {

	constructor() {
		GlobalService.registerOnResize( this.onResize.bind( this ) );
		GlobalService.registerOnDeouncedResize( this.onDebouncedResize.bind( this ) );
	}

	onResize() {

	}

	onDebouncedResize() {

	}

}

export default BaseComponent;