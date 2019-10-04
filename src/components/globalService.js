import $ from 'jquery';
import { debounce } from '../utils';

class GlobalService {

	constructor() {
		this.props = {};
		this.renderCallbacks = [];
		this.updateCallbacks = [];
		this.observeCallbacks = [];
		this.frameRendered = true;


		this.currentMutationList = [];

		const updateProps = this.updateProps.bind( this );
		const updateScroll = this.updateScroll.bind( this );
		const renderLoop = this.renderLoop.bind( this );

		updateProps();
		updateScroll();

		document.addEventListener('DOMContentLoaded', updateProps );
		window.addEventListener( 'resize', updateProps );
		window.addEventListener( 'load', updateProps );
		window.addEventListener( 'scroll', updateScroll );
		window.requestAnimationFrame( renderLoop );

		if ( wp.customize ) {
			if ( wp.customize.selectiveRefresh ) {
				wp.customize.selectiveRefresh.bind( 'partial-content-rendered', updateProps );
			}
			wp.customize.bind( 'change', updateProps );
		}

		const self = this;

		const observeCallback = this.observeCallback.bind( this );
		const observeAndUpdateProps = function() {
			observeCallback( self.currentMutationList );
			updateProps( true );
			self.currentMutationList = [];
		};
		const debouncedObserveCallback = debounce( observeAndUpdateProps, 200 );

		this.observe( function( mutationList ) {
			self.currentMutationList = self.currentMutationList.concat( mutationList );
			debouncedObserveCallback();
		} );
	}

	observeCallback() {
		const passedArguments = arguments;
		$.each(this.observeCallbacks, function( i, fn ) {
			fn( ...passedArguments );
		});
	}

	observe( callback ) {
		if ( ! window.MutationObserver ) {
			return;
		}

		const observer = new MutationObserver( callback );

		observer.observe( document.body, {
			childList: true,
			subtree: true
		} );
	}

	registerObserverCallback( fn ) {
		if ( typeof fn === "function" && this.observeCallbacks.indexOf( fn ) < 0 ) {
			this.observeCallbacks.push( fn );
		}
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
		const passedArguments = arguments;
		$.each( this.renderCallbacks, function( i, fn ) {
			fn( ...passedArguments );
		} );
	}

	registerUpdate( fn ) {
		if ( typeof fn === "function" && this.updateCallbacks.indexOf( fn ) < 0 ) {
			this.updateCallbacks.push( fn );
		}
	}

	updateStuff() {
		const passedArguments = arguments;
		$.each( this.updateCallbacks, function( i, fn ) {
			fn( ...passedArguments );
		} );
	}

	updateScroll() {

		const newProps = {
			scrollY: window.pageYOffset,
			scrollX: window.pageXOffset,
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
