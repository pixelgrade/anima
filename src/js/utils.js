import $ from 'jquery';

export const debounce = (func, wait) => {
	let timeout = null;

	return function () {
		const context = this;
		const args = arguments;

		const later = () => {
			func.apply(context, args);
		};

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	}
};

export const hasTouchScreen = function() {
	var hasTouchScreen = false;

	if ( "maxTouchPoints" in navigator ) {
		hasTouchScreen = navigator.maxTouchPoints > 0;
	} else if ( "msMaxTouchPoints" in navigator ) {
		hasTouchScreen = navigator.msMaxTouchPoints > 0;
	} else {
		var mQ = window.matchMedia && matchMedia( "(pointer:coarse)" );
		if ( mQ && mQ.media === "(pointer:coarse)" ) {
			hasTouchScreen = !!mQ.matches;
		} else if ( 'orientation' in window ) {
			hasTouchScreen = true;
		} else {
			var UA = navigator.userAgent;
			hasTouchScreen = (
				/\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test( UA ) || /\b(Android|Windows Phone|iPad|iPod)\b/i.test( UA )
			);
		}
	}

	return hasTouchScreen;
};

export function setAndResetElementStyles( element, props = {} ) {

	const $element = $( element );

	$element.css( props );

	Object.keys( props ).forEach( key => {
		props[key] = '';
	} )

	if ( window.requestIdleCallback ) {
		window.requestIdleCallback( () => {
			$element.css( props );
		} );
	} else {
		setTimeout( () => {
			$element.css( props );
		}, 0 );
	}
}

export const getColorSetClasses = ( element ) => {
	const classAttr = element?.getAttribute( 'class' );

	if ( ! classAttr ) {
		return [];
	}

	const classes = classAttr.split( /\s+/ );

	return classes.filter( classname => {
		return classname.search( 'sm-palette-' ) !== -1 || classname.search( 'sm-variation-' ) !== -1 || classname === 'sm-palette--shifted';
	} );
}

export const addClass = ( element, classes ) => {
	const classesArray = classes.split( /\s+/ ).filter( x => x.trim().length );

	if ( classesArray.length ) {
		element.classList.add( ...classesArray );
	}
}

export const removeClass = ( element, classes ) => {
	const classesArray = classes.split(/\s+/).filter( x => x.trim().length );

	if ( classesArray.length ) {
		element.classList.remove( ...classesArray );
	}
}

export const hasClass = ( element, className ) => {
	return element.classList.contains( className );
}

export const toggleClasses = ( element, check, trueClasses = '', falseClasses = '' ) => {
	removeClass( element, !! check ? falseClasses : trueClasses );
	addClass( element, !! check ? trueClasses : falseClasses );
}

export function getFirstChild( el ){
	var firstChild = el.firstChild;
	while ( firstChild != null && firstChild.nodeType === 3 ) { // skip TextNodes
		firstChild = firstChild.nextSibling;
	}
	return firstChild;
}

export const toggleLightClasses = element => {
	const classes = Array.from( element.classList );
	const paletteClassname = classes.find( classname => {
		return classname.indexOf( 'sm-palette-' ) > -1 && classname.indexOf( 'sm-palette--' ) === -1
	} );
	const palette = paletteClassname ? paletteClassname.substring( 'sm-palette-'.length ) : 1;
	const variationPrefix = 'sm-variation-';
	const variationClassname = classes.find( classname => classname.indexOf( variationPrefix ) > -1 );
	const variation = variationClassname ? variationClassname.substring( variationPrefix.length ) : 1;
	const isShifted = !! classes.find( classname => classname.indexOf( 'sm-palette--shifted' ) > -1 );

	if ( ! Array.isArray( window?.sm?.colorsConfig ) ) {
		return;
	}

	const currentPaletteConfig = sm.colorsConfig.find( thisPalette => {
		return thisPalette.id + '' === palette + '';
	} );

	if ( currentPaletteConfig ) {
		const { sourceIndex, lightColorsCount } = currentPaletteConfig;
		const offset = isShifted ? sourceIndex : 0;
		const isLight = ( ( variation - 1 ) + offset ) % 12 + 1 <= lightColorsCount;

		toggleClasses( element, isLight, 'sm-light', 'sm-dark' );
	}
}
