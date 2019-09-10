class GlobalService {

	constructor() {
		this.props = {};
		this.renderCallbacks = [];
		this.updateCallbacks = [];
		this.frameRendered = true;
		const updateProps = this.updateProps.bind( this );
		const updateScroll = this.updateScroll.bind( this );
		updateProps();
		document.addEventListener('DOMContentLoaded', updateProps );
		window.addEventListener( 'resize', updateProps );
		window.addEventListener( 'scroll', updateScroll );
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

	updateScroll() {
		this.props.scrollY = window.scrollY;
		this.props.scrollX = window.scrollX;
		this.frameRendered = false;
	}

	updateProps() {
		this.updateStuff();
		this.props.windowWidth = window.innerWidth;
		this.props.windowHeight = window.innerHeight;
		this.updateScroll();
	}

	getProps() {
		return this.props;
	}

	getProp( propName ) {
		return this.props[ propName ];
	}
}

export default new GlobalService();