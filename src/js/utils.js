import $ from 'jquery';

// checks if box1 and box2 overlap
export function overlapping( box1, box2 ) {
	const overlappingX = box1.left + box1.width >= box2.left && box2.left + box2.width >= box1.left;
	const overlappingY = box1.top + box1.height >= box2.top && box2.top + box2.height >= box1.top;
	return overlappingX && overlappingY;
}

// chechks if box1 is completely inside box2
export function inside( box1, box2 ) {
	const insideX = box1.left >= box2.left && box1.left + box1.width <= box2.left + box2.width;
	const insideY = box1.top >= box2.top && box1.top + box1.height <= box2.top + box2.height;
	return insideX && insideY;
}

// chechks if box1 is completely inside box2
export function insideHalf( box1, box2 ) {
	const insideX = box1.left + box1.width / 2 >= box2.left && box2.left + box2.width >= box1.left + box1.width / 2;
	const insideY = box1.top + box1.height / 2 >= box2.top && box2.top + box2.height >= box1.top + box1.height / 2;
	return insideX && insideY;
}

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

export const mq = function(direction, string) {
	var $temp = jQuery( '<div class="u-mq-' + direction + '-' + string + '">' ).appendTo( 'body' ),
		response = $temp.is( ':visible' );

	$temp.remove();
	return response;
};

export const below = function(string) {
	return mq( 'below', string );
};

export const above = function(string) {
	return mq( 'above', string );
};

export function setAndResetElementStyles( element, props = {} ) {

	$(element).css(props);
	Object.keys( props ).forEach( key => { props[ key ] = '' } )

   if ( window.requestIdleCallback ) {
		requestIdleCallback( () => {
			$(element).css(props);
		} );
	} else {
		setTimeout( () => {
			$(element).css(props);
		}, 0 );
	}
}


