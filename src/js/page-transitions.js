/**
 * Page Transitions — Webpack Entry Point
 *
 * Only loaded when the page transitions feature is enabled in Style Manager.
 * Uses View Transitions API + Navigation API + GSAP for smooth page-to-page
 * animations with a border expand/collapse overlay.
 */

import { init } from './components/page-transitions/index';

// Config is passed from PHP via wp_localize_script().
const config = window.animaPageTransitions || {};

// Initialize when DOM is ready.
if ( document.readyState === 'loading' ) {
  document.addEventListener( 'DOMContentLoaded', () => init( config ) );
} else {
  init( config );
}
