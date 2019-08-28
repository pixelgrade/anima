class GlobalService {

	constructor() {
		this.props = {};
		this.renderCallbacks = [];
		this.updateCallbacks = [];
		this.frameRendered = true;
		const updateProps = this.updateProps.bind( this );
		updateProps();
		document.addEventListener('DOMContentLoaded', updateProps );
		window.addEventListener( 'resize', updateProps );
		window.addEventListener( 'scroll', updateProps );
		window.requestAnimationFrame( this.renderLoop.bind( this ) );
	}

	renderLoop() {
		if ( ! this.frameRendered ) {
			this.renderStuff();
			this.frameRendered = true;
		}
		window.requestAnimationFrame( this.renderLoop.bind( this ) );
	}

	registerRender( fn ) {
		if ( typeof fn === "function" && this.renderCallbacks.indexOf( fn ) < 0 ) {
			this.renderCallbacks.push( fn );
		}
	}

	renderStuff() {
		this.renderCallbacks.forEach( fn => {
			fn();
		});
	}

	registerUpdate( fn ) {
		if ( typeof fn === "function" && this.updateCallbacks.indexOf( fn ) < 0 ) {
			this.updateCallbacks.push( fn );
		}
	}

	updateStuff() {
		this.updateCallbacks.forEach( fn => {
			fn();
		});
	}

	updateProps() {
		this.props.windowWidth = window.innerWidth;
		this.props.windowHeight = window.innerHeight;
		this.props.scrollY = document.documentElement.scrollTop;
		this.props.scrollX = document.documentElement.scrollLeft;
		this.updateStuff();
		this.frameRendered = false;
	}

	getProps() {
		return this.props;
	}

	getProp( propName ) {
		return this.props[ propName ];
	}
}

export default new GlobalService();