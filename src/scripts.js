import $ from 'jquery';
import App from './components/app';

function initialize() {
	new App();
	$( 'body' ).removeClass( 'is-loading' ).addClass( 'has-loaded' );
}

$(function () {
	const $window = $( window );
	const $html = $( 'html' );

	if ( ! $html.is( '.wf-active' ) ) {
		$window.on( 'wf-active', initialize );
	} else {
		initialize();
	}

	$( window ).on( 'beforeunload', () => {
		$( 'body' ).addClass( 'is-loading' );
	} );

});
