class GlobalService {

	constructor() {
		this.props = {};
		this.renderCallbacks = [];
		this.updateCallbacks = [];
		this.frameRendered = true;
		const updateProps = this.updateProps.bind( this );
		const updateScroll = this.updateScroll.bind( this );
		document.addEventListener('DOMContentLoaded', updateProps );
		window.addEventListener( 'resize', updateProps );
		window.addEventListener( 'load', updateProps );
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
		const body = document.body;
		const html = document.documentElement;
		const bodyScrollHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight );
		const htmlScrollHeight = Math.max( html.scrollHeight, html.offsetHeight );

		this.props.scrollHeight = Math.max( bodyScrollHeight, htmlScrollHeight );
		this.props.adminBarHeight = this.getAdminBarHeight();

		this.props.windowWidth = window.innerWidth;
		this.props.windowHeight = window.innerHeight;
		this.updateScroll();
		this.updateStuff();
	}

	getAdminBarHeight() {
		const adminBar = document.getElementById( 'wpadminbar' );

		if ( adminBar ) {
			const box = adminBar.getBoundingClientRect();
			return box.height;
		}

		return 0;
	}

	getProps() {
		return this.props;
	}

	getProp( propName ) {
		return this.props[ propName ];
	}
}

export default new GlobalService();