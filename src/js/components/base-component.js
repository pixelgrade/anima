import GlobalService from './globalService';

class BaseComponent {

	constructor() {
		GlobalService.registerOnResize( this.onResize.bind( this ) );
	}

	onResize() {

	}

}

export default BaseComponent;