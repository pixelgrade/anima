import { debounce } from '../utils';

class GlobalService {

	constructor() {
		this.props = {};
		this.renderCallbacks = [];
		this.updateCallbacks = [];
		this.observeCallbacks = [];
		this.frameRendered = true;
		const updateProps = this.updateProps.bind( this );
		const updateScroll = this.updateScroll.bind( this );
		updateProps();
		updateScroll();
		document.addEventListener('DOMContentLoaded', updateProps );
		window.addEventListener( 'resize', updateProps );
		window.addEventListener( 'load', updateProps );
		window.addEventListener( 'scroll', updateScroll );
		window.requestAnimationFrame( this.renderLoop.bind( this ) );

		if ( wp.customize ) {
			if ( wp.customize.selectiveRefresh ) {
				wp.customize.selectiveRefresh.bind( 'partial-content-rendered', updateProps );
			}
			wp.customize.bind( 'change', updateProps );
		}

		this.observe( this.observeCallback.bind( this ) );
	}

	observeCallback() {
		this.observeCallbacks.forEach( fn => {
			fn();
		});
	}

	observe( callback ) {
		if ( ! window.MutationObserver ) {
			return;
		}

		const observer = new MutationObserver( () => {
			callback( ...arguments );
		} );

		observer.observe( document.body, {
			attributes: true,
			attributeOldValue: false,
			characterData: true,
			characterDataOldValue: false,
			childList: true,
			subtree: true
		} );
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

		const newProps = {
			scrollY: window.scrollY,
			scrollX: window.scrollX,
		}

		if ( this.checkNewProps( newProps ) ) {
			this.props = Object.assign( {}, this.props, newProps );
			this.frameRendered = false;
		}
	}

	checkNewProps( newProps ) {
		return Object.keys( newProps ).some( key => {
			return newProps[key] !== this.props[key];
		} )
	}

	updateProps( force = false ) {
		const body = document.body;
		const html = document.documentElement;
		const bodyScrollHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight );
		const htmlScrollHeight = Math.max( html.scrollHeight, html.offsetHeight );

		const newProps = {
			scrollHeight: Math.max( bodyScrollHeight, htmlScrollHeight ),
			adminBarHeight: this.getAdminBarHeight(),
			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight,
		}

		this.updateScroll();

		if ( this.checkNewProps( newProps ) || force ) {
			this.props = Object.assign( {}, this.props, newProps );

			this.updateStuff();
			this.frameRendered = false;
		}
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