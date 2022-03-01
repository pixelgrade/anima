import $ from 'jquery';
import { colord, extend as colordExtend } from 'colord';
import colordA11yPlugin from 'colord/plugins/a11y';

export const debounce = ( func, wait ) => {
  let timeout = null;

  return function () {
    const context = this;
    const args = arguments;

    const later = () => {
      func.apply( context, args );
    };

    clearTimeout( timeout );
    timeout = setTimeout( later, wait );
  };
};

export const hasTouchScreen = function () {
  var hasTouchScreen = false;

  if ( 'maxTouchPoints' in navigator ) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
  } else if ( 'msMaxTouchPoints' in navigator ) {
    hasTouchScreen = navigator.msMaxTouchPoints > 0;
  } else {
    var mQ = window.matchMedia && matchMedia( '(pointer:coarse)' );
    if ( mQ && mQ.media === '(pointer:coarse)' ) {
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

export function setAndResetElementStyles ( element, props = {} ) {

  const $element = $( element );

  $element.css( props );

  Object.keys( props ).forEach( key => {
    props[key] = '';
  } );

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

  if ( !classAttr ) {
    return [];
  }

  const classes = classAttr.split( /\s+/ );

  return classes.filter( classname => {
    return classname.search( 'sm-palette-' ) !== -1 ||
           classname.search( 'sm-variation-' ) !== -1;
  } );
};

export const addClass = ( element, classes ) => {
  const classesArray = classes.split( /\s+/ ).filter( x => x.trim().length );

  if ( classesArray.length ) {
    element.classList.add( ...classesArray );
  }
};

export const removeClass = ( element, classes ) => {
  const classesArray = classes.split( /\s+/ ).filter( x => x.trim().length );

  if ( classesArray.length ) {
    element.classList.remove( ...classesArray );
  }
};

export const hasClass = ( element, className ) => {
  return element.classList.contains( className );
};

export const toggleClasses = ( element, classesToAdd = '' ) => {

  const prefixes = [
    'sm-palette-',
    'sm-variation-',
    'sm-color-signal-'
  ];

  const classesToRemove = Array.from( element.classList ).filter( classname => {
    return prefixes.some( prefix => classname.indexOf( prefix ) > -1 );
  } );

  element.classList.remove( ...classesToRemove );

  addClass( element, classesToAdd );
};

export function getFirstChild ( el ) {
  var firstChild = el.firstChild;
  while ( firstChild != null && firstChild.nodeType === 3 ) { // skip TextNodes
    firstChild = firstChild.nextSibling;
  }
  return firstChild;
}

export const getFirstBlock = ( element ) => {

  if ( ! element || ! element.children.length ) {
    return element;
  }

  const firstBlock = element.children[0];

  if ( hasClass( firstBlock, 'nb-sidecar' ) ) {
    const content = firstBlock.querySelector( '.nb-sidecar-area--content' )

    if ( content && content.children.length ) {
      return getFirstBlock( content );
    }
  }

  return firstBlock;
};
