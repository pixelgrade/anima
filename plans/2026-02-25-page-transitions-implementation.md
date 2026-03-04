# Page Transitions Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add optional AJAX page transitions to Anima, porting Pile's cinematic border-expand animation using Barba.js v2 and GSAP.

**Architecture:** A self-contained feature behind a Style Manager toggle. When enabled, PHP outputs the border overlay markup and enqueues a separate `page-transitions.js` entry point. The JS initializes Barba.js v2, intercepts internal links, and plays GSAP timeline animations ported directly from Pile. Anima's existing components are reinitialized after each page swap using Pile's "re-scan and re-bind" pattern. When disabled, zero footprint — no JS, no CSS, no markup.

**Tech Stack:** Barba.js v2 (`@barba/core`), GSAP v3 (already registered in Anima from CDN), WordPress Customizer/Style Manager integration.

**Key discovery:** Anima already registers GSAP from CDN (`functions.php:166-170`) and has hook points in `template-canvas.php` (`anima/template_html:before` / `anima/template_html:after`) for injecting the Barba wrapper without editing template files.

## Tuning Notes

- `2026-03-03`: Initial cap-based tuning (`0.16 -> 0.12 -> 0.06` viewport travel cap) reduced gaps but made parallax too subtle.
- Final approach: remove hard cap and attenuate only the positive/downward phase with `positiveOffsetFactor = 0.35` in `src/js/components/pile-parallax/index.js`. This keeps upward movement strong while reducing oversized blank space above the first grid row.

---

### Task 1: Add npm dependency and webpack entry point

**Files:**
- Modify: `package.json`
- Modify: `webpack.config.js`
- Create: `src/js/page-transitions.js` (placeholder)

**Step 1: Add @barba/core to package.json**

Add to `dependencies` in `package.json`:

```json
"@barba/core": "^2.10.0"
```

GSAP is NOT added as npm dependency — Anima already registers it from CDN (`functions.php:166`). The page-transitions script will declare `gsap` as a WordPress script dependency, and webpack will treat it as an external.

**Step 2: Add webpack entry point and GSAP external**

In `webpack.config.js`, add to `entry`:

```js
'./dist/js/page-transitions' : './src/js/page-transitions.js',
'./dist/js/page-transitions.min' : './src/js/page-transitions.js',
```

Add `gsap` to `externals`:

```js
externals: {
  react: 'React',
  jquery: 'jQuery',
  gsap: 'gsap',
},
```

This tells webpack that `import { gsap } from 'gsap'` should resolve to the global `gsap` object (provided by the CDN script already enqueued by Anima).

**Step 3: Create placeholder entry point**

Create `src/js/page-transitions.js`:

```js
import $ from 'jquery';

// Page transitions will be initialized here.
// This file is the webpack entry point — loaded only when the feature is enabled.
console.log( 'Page transitions: loaded' );
```

**Step 4: Install and build**

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 22
cd "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima"
npm install
npx webpack --mode=production --node-env=production
```

Expected: Builds successfully. `dist/js/page-transitions.js` and `dist/js/page-transitions.min.js` exist.

**Step 5: Commit**

```bash
git add package.json package-lock.json webpack.config.js src/js/page-transitions.js dist/js/page-transitions.js dist/js/page-transitions.min.js
git commit -m "Add page-transitions webpack entry point and @barba/core dependency

Refs #363"
```

---

### Task 2: PHP integration — Style Manager toggle, enqueue, overlay markup

**Files:**
- Create: `inc/integrations/page-transitions.php`
- Modify: `inc/integrations.php` (add require)
- Modify: `inc/integrations/style-manager/layout.php` (add toggle field)
- Modify: `functions.php` (register script)

**Step 1: Create the PHP integration file**

Create `inc/integrations/page-transitions.php`:

```php
<?php
/**
 * Page Transitions — AJAX navigation with animated border overlay.
 *
 * Ported from the Pile theme's transition system.
 * Uses Barba.js v2 for AJAX navigation and GSAP for animations.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Check if page transitions are enabled.
 *
 * @return bool
 */
function anima_page_transitions_enabled() {
	// Disabled in Customizer preview — full reloads needed for Customizer to track changes.
	if ( is_customize_preview() ) {
		return false;
	}

	return (bool) pixelgrade_option( 'enable_page_transitions', false );
}

/**
 * Enqueue page transitions script when the feature is enabled.
 */
function anima_page_transitions_enqueue() {
	if ( ! anima_page_transitions_enabled() ) {
		return;
	}

	$theme  = wp_get_theme( get_template() );
	$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

	wp_enqueue_script(
		'anima-page-transitions',
		trailingslashit( get_template_directory_uri() ) . 'dist/js/page-transitions' . $suffix . '.js',
		[ 'jquery', 'gsap', 'anima-app' ],
		$theme->get( 'Version' ),
		true
	);

	// Build excluded URLs list.
	$excluded_urls = anima_page_transitions_get_excluded_urls();

	wp_localize_script( 'anima-page-transitions', 'animaPageTransitions', [
		'excludedUrls' => $excluded_urls,
		'ajaxUrl'      => admin_url( 'admin-ajax.php' ),
	] );
}
add_action( 'wp_enqueue_scripts', 'anima_page_transitions_enqueue', 30 );

/**
 * Build the list of URLs that should skip AJAX navigation.
 *
 * @return array
 */
function anima_page_transitions_get_excluded_urls() {
	$excluded = [];

	// WooCommerce transactional pages.
	if ( function_exists( 'wc_get_page_id' ) ) {
		$cart_page_id     = wc_get_page_id( 'cart' );
		$checkout_page_id = wc_get_page_id( 'checkout' );

		if ( $cart_page_id > 0 ) {
			$excluded[] = get_permalink( $cart_page_id );
		}
		if ( $checkout_page_id > 0 ) {
			$excluded[] = get_permalink( $checkout_page_id );
		}
	}

	/**
	 * Filter the URLs excluded from AJAX page transitions.
	 *
	 * @param array $excluded Array of URL strings to exclude.
	 */
	return apply_filters( 'anima_page_transitions_excluded_urls', $excluded );
}

/**
 * Output the Barba wrapper opening tag before the template HTML.
 */
function anima_page_transitions_wrapper_open() {
	if ( ! anima_page_transitions_enabled() ) {
		return;
	}

	$namespace = 'page';
	if ( is_singular() ) {
		$namespace = get_post_type();
	} elseif ( is_archive() ) {
		$namespace = 'archive';
	} elseif ( is_search() ) {
		$namespace = 'search';
	} elseif ( is_404() ) {
		$namespace = '404';
	}

	echo '<div data-barba="wrapper">';
	echo '<div data-barba="container" data-barba-namespace="' . esc_attr( $namespace ) . '">';
}
add_action( 'anima/template_html:before', 'anima_page_transitions_wrapper_open', 10 );

/**
 * Output the Barba wrapper closing tag after the template HTML.
 */
function anima_page_transitions_wrapper_close() {
	if ( ! anima_page_transitions_enabled() ) {
		return;
	}

	echo '</div><!-- [data-barba="container"] -->';
	echo '</div><!-- [data-barba="wrapper"] -->';
}
add_action( 'anima/template_html:after', 'anima_page_transitions_wrapper_close', 10 );

/**
 * Output the border overlay markup in wp_footer.
 */
function anima_page_transitions_overlay_markup() {
	if ( ! anima_page_transitions_enabled() ) {
		return;
	}

	$logo = '';
	if ( has_custom_logo() ) {
		$logo = get_custom_logo();
	}
	?>
	<div class="c-page-transition-border js-page-transition-border"
	     style="border-color: var(--sm-current-accent-color); background: var(--sm-current-accent-color);">
		<div class="border-logo-bgscale">
			<div class="border-logo-background">
				<div class="border-logo-fill"></div>
				<div class="logo"><?php echo $logo; ?></div>
			</div>
		</div>
		<div class="border-logo"><div class="logo"><?php echo $logo; ?></div></div>
	</div>
	<?php
}
add_action( 'wp_footer', 'anima_page_transitions_overlay_markup', 5 );

/**
 * Add body data attributes for page transitions.
 */
function anima_page_transitions_body_class( $classes ) {
	if ( anima_page_transitions_enabled() ) {
		$classes[] = 'has-page-transitions';
	}

	return $classes;
}
add_filter( 'body_class', 'anima_page_transitions_body_class' );

/**
 * Add data attributes to body tag for post identification after AJAX swap.
 */
function anima_page_transitions_body_data() {
	if ( ! anima_page_transitions_enabled() ) {
		return;
	}

	$post_id = get_queried_object_id();
	$edit_link = '';

	if ( $post_id && current_user_can( 'edit_post', $post_id ) ) {
		$edit_link = get_edit_post_link( $post_id, 'raw' );
	}

	echo ' data-curpostid="' . esc_attr( $post_id ) . '"';
	echo ' data-curpostedit="' . esc_attr( $edit_link ) . '"';
}
add_action( 'anima/template_html:before', 'anima_page_transitions_body_data', 5 );
```

**Step 2: Require the integration file**

In `inc/integrations.php`, add before the closing `?>` (or at the end):

```php
/**
 * Load Page Transitions integration for this theme.
 */
require_once trailingslashit( get_template_directory() ) . 'inc/integrations/page-transitions.php';
```

**Step 3: Add Style Manager toggle**

In `inc/integrations/style-manager/layout.php`, add a new option after `layout_spacing` (inside the `'options'` array, before the closing `],`):

```php
'enable_page_transitions' => [
	'type'    => 'checkbox',
	'label'   => esc_html__( 'Page Transitions', '__theme_txtd' ),
	'desc'    => esc_html__( 'Enable smooth animated transitions between pages.', '__theme_txtd' ),
	'default' => false,
],
```

**Step 4: Register the script handle**

In `functions.php`, inside `anima_register_assets()`, add after the `anima-app` registration (after line 179):

```php
wp_register_script( 'anima-page-transitions', trailingslashit( get_template_directory_uri() ) . 'dist/js/page-transitions' . $suffix . '.js', [ 'jquery', 'gsap', 'anima-app' ], $theme->get( 'Version' ), true );
```

**Step 5: Test in browser**

1. Go to http://style-manager.local/wp-admin/customize.php
2. Navigate to Layout section
3. Enable "Page Transitions" checkbox
4. Save & Publish
5. View frontend — check page source for:
   - `data-barba="wrapper"` wrapping the content
   - `.c-page-transition-border` overlay in footer
   - `page-transitions.js` script tag
   - Console log: "Page transitions: loaded"

Expected: All elements present. No visual change yet (animations not wired up).

**Step 6: Commit**

```bash
git add inc/integrations/page-transitions.php inc/integrations.php inc/integrations/style-manager/layout.php functions.php
git commit -m "Add page transitions PHP integration

- Style Manager toggle (Layout > Page Transitions)
- Barba wrapper via template_html hooks
- Border overlay markup in wp_footer
- Script enqueue with excluded URL list
- Body class and data attributes for AJAX sync

Refs #363"
```

---

### Task 3: CSS — Border overlay styles and animation keyframes

**Files:**
- Create: `src/scss/components/_page-transitions.scss`
- Modify: `src/scss/style.scss` (add import)

**Step 1: Create the SCSS file**

Create `src/scss/components/_page-transitions.scss`, ported from Pile's `_loading.scss` and `_border-logo.scss`:

```scss
// ==========================================================================
// Page Transitions — Border overlay and loading animation
// Ported from Pile theme.
// ==========================================================================

// Border overlay — fixed fullscreen, GSAP animates borderWidth
.c-page-transition-border {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100000;
  pointer-events: none;
  border: 0 solid transparent;
  display: none;

  .has-page-transitions & {
    display: block;
  }
}

// Logo container — centered in the border overlay
.border-logo-bgscale {
  position: absolute;
  top: 50%;
  left: 50%;
}

.border-logo-background {
  position: absolute;
  top: 0;
  left: 0;
  transform: translate3d(-50%, -50%, 0) scaleY(0);
  background: rgba(0, 0, 0, 0.2);
  padding: 30px 60px;
  overflow: hidden;
  animation: anima-raiseMeUp 0.4s 0.4s cubic-bezier(0.770, 0.000, 0.175, 1.000) forwards;

  .logo {
    opacity: 0;
  }

  .has-page-transitions.is-loaded & {
    transform: translate3d(-50%, -50%, 0) scaleY(0);
    transition: transform 0.3s 0.15s cubic-bezier(0.455, 0.030, 0.515, 0.955);
  }
}

.border-logo-fill {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  transform: translate3d(-100%, 0, 0);
  background: white;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: white;
    transform: translateZ(0);
    animation: anima-fillMe 10s 0.8s ease-out forwards;

    .has-page-transitions.is-loaded & {
      transition: transform 0.3s 0.15s cubic-bezier(0.455, 0.030, 0.515, 0.955);
    }
  }
}

.border-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;

  .logo {
    display: block;
    opacity: 0;
    animation: anima-fadeMeIn 0.3s 0.5s ease-in-out forwards;

    .has-page-transitions.is-loaded & {
      opacity: 0;
      transition: transform 0.3s 0.15s cubic-bezier(0.455, 0.030, 0.515, 0.955);
    }
  }

  img {
    width: auto;
  }
}

.border-logo-bgscale,
.border-logo {
  .custom-logo {
    max-height: none;
  }
}

// Keyframe animations
@keyframes anima-raiseMeUp {
  0% { transform: translate3d(-50%, -50%, 0) scaleY(0); }
  100% { transform: translate3d(-50%, -50%, 0) scaleY(1); }
}

@keyframes anima-fadeMeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes anima-fillMe {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(90%, 0, 0); }
}

// Page visibility during transitions
.has-page-transitions {
  // Hide content during initial load (revealed by loading animation)
  &:not(.is-loaded) [data-barba="container"] {
    visibility: hidden;
  }
}
```

**Step 2: Import in style.scss**

In `src/scss/style.scss`, add the import alongside other component imports. Find the components section and add:

```scss
@import "components/page-transitions";
```

**Step 3: Build styles**

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 22
cd "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima"
npm run styles
```

Expected: Compiles successfully. Inspect `style.css` for `.c-page-transition-border` rules.

**Step 4: Commit**

```bash
git add src/scss/components/_page-transitions.scss src/scss/style.scss style.css style-rtl.css dist/css/
git commit -m "Add page transitions CSS — border overlay and loading animation

Keyframe animations and overlay positioning ported from Pile theme.
Scoped to .has-page-transitions body class (zero footprint when off).

Refs #363"
```

---

### Task 4: JS — Barba.js initialization and link exclusion

**Files:**
- Create: `src/js/components/page-transitions/index.js`
- Create: `src/js/components/page-transitions/utils.js`
- Modify: `src/js/page-transitions.js` (wire up entry point)

**Step 1: Create the utils module**

Create `src/js/components/page-transitions/utils.js`:

```js
import $ from 'jquery';

/**
 * Sync body classes from the new page's HTML response.
 * Uses the same NOTBODY trick as Pile to parse <body> attributes from raw HTML.
 */
export function syncBodyClasses( html ) {
  const data = html.replace( /(<\/?)body( .+?)?>/gi, '$1NOTBODY$2>' );
  const nobodyClass = $( data ).filter( 'notbody' ).attr( 'class' );

  if ( nobodyClass ) {
    $( 'body' ).attr( 'class', nobodyClass );
  }
}

/**
 * Update document title from new page HTML.
 */
export function syncDocumentTitle( html ) {
  const match = html.match( /<title[^>]*>([\s\S]*?)<\/title>/i );
  if ( match && match[ 1 ] ) {
    document.title = match[ 1 ].trim();
  }
}

/**
 * Update admin bar Edit/Customize links after AJAX page swap.
 */
export function syncAdminBar( html ) {
  if ( ! $( 'body' ).hasClass( 'admin-bar' ) ) {
    return;
  }

  const data = html.replace( /(<\/?)body( .+?)?>/gi, '$1NOTBODY$2>' );
  const $nobody = $( data ).filter( 'notbody' );

  const postId = $nobody.data( 'curpostid' );
  const editLink = $nobody.data( 'curpostedit' );

  // Update Edit link.
  if ( editLink ) {
    $( '#wp-admin-bar-edit a' ).attr( 'href', editLink );
  }

  // Update Customize link.
  const $customizeLink = $( '#wp-admin-bar-customize a' );
  if ( $customizeLink.length ) {
    const baseUrl = $customizeLink.attr( 'href' ).replace( /url=.*$/, '' );
    $customizeLink.attr( 'href', baseUrl + 'url=' + encodeURIComponent( window.location.href ) );
  }
}

/**
 * Re-initialize Anima's JS components on the new page DOM.
 * Follows Pile's "re-scan and re-bind" pattern.
 */
export function reinitComponents() {
  // Trigger imagesLoaded for any new images.
  const $images = $( '[data-barba="container"]' ).find( 'img' ).not( '[srcset], .is-loaded, .is-broken' );
  if ( $images.length && $.fn.imagesLoaded ) {
    $images.imagesLoaded().progress( ( instance, image ) => {
      const className = image.isLoaded ? 'is-loaded' : 'is-broken';
      $( image.img ).addClass( className );
    } );
  }

  // Re-trigger WooCommerce cart fragments if available.
  if ( typeof wc_cart_fragments_params !== 'undefined' ) {
    $( document.body ).trigger( 'wc_fragment_refresh' );
  }

  // Fire a custom event that other scripts can hook into.
  $( document ).trigger( 'anima:page-transition-complete' );

  // Dispatch a resize event to recalculate any layout-dependent JS.
  window.dispatchEvent( new Event( 'resize' ) );
}

/**
 * Cleanup heavy resources before page transition.
 */
export function cleanupBeforeTransition() {
  const $container = $( '[data-barba="container"]' );

  // Pause and remove video elements.
  $container.find( 'video' ).each( function() {
    this.pause();
    this.src = '';
    this.load();
    $( this ).remove();
  } );
}

/**
 * Push a pageview event for analytics.
 */
export function trackPageview() {
  // Google Analytics 4 (gtag).
  if ( typeof gtag === 'function' ) {
    gtag( 'event', 'page_view', {
      page_location: window.location.href,
      page_title: document.title,
    } );
    return;
  }

  // Google Tag Manager dataLayer.
  if ( typeof dataLayer !== 'undefined' && Array.isArray( dataLayer ) ) {
    dataLayer.push( {
      event: 'pageview',
      page: {
        path: window.location.pathname,
        title: document.title,
      },
    } );
    return;
  }

  // Legacy Universal Analytics.
  if ( typeof _gaq !== 'undefined' ) {
    _gaq.push( [ '_trackPageview' ] );
  }
}
```

**Step 2: Create the main Barba initialization module**

Create `src/js/components/page-transitions/index.js`:

```js
import $ from 'jquery';
import barba from '@barba/core';
import {
  syncBodyClasses,
  syncDocumentTitle,
  syncAdminBar,
  reinitComponents,
  cleanupBeforeTransition,
  trackPageview,
} from './utils';

// Ignored URL patterns — file extensions, admin, anchors.
const IGNORED_PATTERNS = [
  '.pdf', '.doc', '.eps', '.png', '.jpg', '.jpeg', '.zip',
  'wp-admin', 'wp-login', 'wp-',
  'feed',
  '#',
  '&add-to-cart=', '?add-to-cart=', '?remove_item',
];

/**
 * Initialize page transitions.
 */
export function init() {
  const $body = $( 'body' );

  // Don't init in Customizer preview.
  if ( $body.hasClass( 'is--customizer-preview' ) ) {
    return;
  }

  // Merge server-side excluded URLs with client-side patterns.
  const serverExcluded = ( typeof animaPageTransitions !== 'undefined' && animaPageTransitions.excludedUrls )
    ? animaPageTransitions.excludedUrls
    : [];

  barba.init( {
    // Barba v2 uses a prevent function instead of overriding preventCheck.
    prevent: ( { el, href } ) => {
      // Skip links with target="_blank".
      if ( el.target && el.target === '_blank' ) {
        return true;
      }

      // Skip links with data-no-transition attribute.
      if ( el.hasAttribute( 'data-no-transition' ) ) {
        return true;
      }

      // Check against ignored patterns.
      for ( const pattern of IGNORED_PATTERNS ) {
        if ( href.indexOf( pattern ) > -1 ) {
          return true;
        }
      }

      // Check against server-side excluded URLs.
      for ( const url of serverExcluded ) {
        if ( href.indexOf( url ) > -1 ) {
          return true;
        }
      }

      return false;
    },

    // Transitions are defined in Task 5.
    transitions: [],
  } );

  // Mark as loaded after initial page load animation.
  $body.addClass( 'is-loaded' );
}
```

**Step 3: Wire up the entry point**

Replace `src/js/page-transitions.js` contents:

```js
import $ from 'jquery';
import { init } from './components/page-transitions';

$( function() {
  init();
} );
```

**Step 4: Build and test**

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 22
cd "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima"
npx webpack --mode=production --node-env=production
```

Expected: Builds successfully. Enable the toggle in Style Manager, click links on the frontend — Barba should intercept them and do a basic content swap (no animation yet, but no full page reload either). Check console for errors.

**Step 5: Commit**

```bash
git add src/js/page-transitions.js src/js/components/page-transitions/ dist/js/page-transitions.js dist/js/page-transitions.min.js
git commit -m "Add Barba.js initialization and page swap utilities

- Link interception with URL exclusion patterns
- Body class, title, and admin bar sync after AJAX swap
- Component reinit, video cleanup, analytics tracking
- WooCommerce cart fragment refresh

Refs #363"
```

---

### Task 5: JS — GSAP animation timelines (the core port from Pile)

**Files:**
- Create: `src/js/components/page-transitions/transitions.js`
- Create: `src/js/components/page-transitions/loading-animation.js`
- Modify: `src/js/components/page-transitions/index.js` (add transitions)

**Step 1: Create the loading animation module**

Create `src/js/components/page-transitions/loading-animation.js`, ported from Pile's `loadingAnimation.js`:

```js
import $ from 'jquery';

/**
 * Initial page load animation — the "opening curtain".
 * Ported from Pile's loadingAnimation.js.
 *
 * Uses the global `gsap` object (loaded from CDN by WordPress).
 */
export function playLoadingAnimation() {
  const $border = $( '.js-page-transition-border' );

  if ( ! $border.length ) {
    return;
  }

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // Logo fill slides in from left.
  gsap.to( '.border-logo-fill', {
    x: 0,
    duration: 0.3,
    ease: 'circ.in',
    onComplete: function() {
      $( '.border-logo' ).css( 'opacity', 0 );
    },
  } );

  // Logo background scales down.
  gsap.to( '.border-logo-bgscale', {
    scaleY: 0,
    duration: 0.3,
    delay: 0.3,
    ease: 'quad.inOut',
  } );

  // Border collapses from full-screen to zero.
  gsap.fromTo( $border[ 0 ], {
    borderWidth: windowHeight / 2 + 'px ' + windowWidth / 2 + 'px',
  }, {
    background: 'none',
    borderWidth: 0,
    duration: 0.6,
    delay: 0.5,
    ease: 'quart.inOut',
  } );

  // Hero content fades in.
  gsap.fromTo(
    '.novablocks-hero .nb-supernova-item__inner-container, .nb-supernova--card-layout-stacked.nb-supernova--1-columns.nb-supernova--align-full .nb-supernova-item__inner-container',
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'quad.out', delay: 0.7 }
  );

  // Hero background scales down.
  gsap.fromTo(
    '.novablocks-hero .nb-supernova-item__media-wrapper, .nb-supernova--card-layout-stacked.nb-supernova--1-columns.nb-supernova--align-full .nb-supernova-item__media-wrapper',
    { scale: 1.2 },
    { scale: 1, duration: 0.4, ease: 'quad.out', delay: 0.7 }
  );
}
```

**Step 2: Create the transition timelines**

Create `src/js/components/page-transitions/transitions.js`, ported from Pile's `AjaxLoading.js`:

```js
import $ from 'jquery';
import {
  syncBodyClasses,
  syncDocumentTitle,
  syncAdminBar,
  reinitComponents,
  cleanupBeforeTransition,
  trackPageview,
} from './utils';

/**
 * Wraps a GSAP timeline in a Promise.
 * Resolves when the timeline completes.
 */
function timelinePromise( timeline ) {
  return new Promise( ( resolve ) => {
    timeline.eventCallback( 'onComplete', () => {
      resolve( true );
    } );
  } );
}

/**
 * Create the "border expanding inward" timeline for page leave.
 * Ported from Pile's borderOutTimeline().
 */
function createBorderOutTimeline() {
  const $border = $( '.js-page-transition-border' );
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const borderX = windowWidth / 2;
  const borderY = windowHeight / 2;

  const timeline = gsap.timeline( { paused: true } );

  $border.css( {
    top: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    borderWidth: '0 0',
    borderColor: 'var(--sm-current-accent-color)',
    display: 'block',
  } );

  timeline.fromTo( $border[ 0 ], {
    x: 0,
    y: 0,
    scale: 1,
  }, {
    borderTopWidth: borderY,
    borderBottomWidth: borderY,
    borderLeftWidth: borderX,
    borderRightWidth: borderX,
    duration: 0.6,
    ease: 'quart.inOut',
  } );

  return timeline;
}

/**
 * Create the "border collapsing outward" timeline for page enter.
 * Ported from Pile's FadeTransition.fadeIn().
 */
function createBorderInTimeline() {
  const $border = $( '.js-page-transition-border' );

  const timeline = gsap.timeline( { paused: true } );

  timeline.to( $border[ 0 ], {
    borderWidth: 0,
    duration: 0.6,
    ease: 'quart.inOut',
  } );

  // Hero content fades in.
  timeline.fromTo(
    '.novablocks-hero .nb-supernova-item__inner-container, .nb-supernova--card-layout-stacked.nb-supernova--1-columns.nb-supernova--align-full .nb-supernova-item__inner-container',
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'quad.out' },
    '-=0.4'
  );

  // Hero background scales down.
  timeline.fromTo(
    '.novablocks-hero .nb-supernova-item__media-wrapper, .nb-supernova--card-layout-stacked.nb-supernova--1-columns.nb-supernova--align-full .nb-supernova-item__media-wrapper',
    { scale: 1.2 },
    { scale: 1, duration: 0.4, ease: 'quad.out' },
    '-=0.4'
  );

  return timeline;
}

/**
 * The Barba.js v2 transition definition.
 * Ported from Pile's FadeTransition (Barba v1).
 */
export const pageTransition = {
  name: 'page-transition',

  leave( { current } ) {
    const timeline = createBorderOutTimeline();
    timeline.play();

    // Close mobile nav if open.
    $( 'body' ).removeClass( 'nav-is-open' );

    return timelinePromise( timeline ).then( () => {
      // Cleanup heavy resources from the old page.
      cleanupBeforeTransition();

      // Hide old container.
      $( current.container ).hide();
    } );
  },

  enter( { next } ) {
    // Scroll to top.
    window.scrollTo( 0, 0 );

    // Reset border background.
    $( '.js-page-transition-border' ).css( 'backgroundColor', 'transparent' );

    // Sync WordPress state from new page HTML.
    const html = next.html;
    syncBodyClasses( html );
    syncDocumentTitle( html );
    syncAdminBar( html );

    // Re-initialize components on new DOM.
    reinitComponents();

    // Track pageview.
    trackPageview();

    // Play the enter animation.
    const timeline = createBorderInTimeline();
    timeline.play();

    return timelinePromise( timeline );
  },
};
```

**Step 3: Wire transitions into Barba init**

Update `src/js/components/page-transitions/index.js` — add the imports and transitions array:

At the top, add:

```js
import { pageTransition } from './transitions';
import { playLoadingAnimation } from './loading-animation';
```

Replace the `transitions: [],` line in `barba.init()` with:

```js
transitions: [ pageTransition ],
```

After `$body.addClass( 'is-loaded' );`, add:

```js
// Play the initial page load animation (opening curtain).
playLoadingAnimation();
```

**Step 4: Build and test**

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 22
cd "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima"
npx webpack --mode=production --node-env=production
```

Expected: With the feature enabled, clicking internal links should now show the full border-expand animation. The border closes inward (0.6s), content swaps, border opens outward (0.6s) with hero fade-in. Initial page load should play the opening curtain animation.

**Step 5: Commit**

```bash
git add src/js/components/page-transitions/ dist/js/page-transitions.js dist/js/page-transitions.min.js
git commit -m "Add GSAP animation timelines — border expand/collapse + loading animation

Direct port of Pile's AjaxLoading.js and loadingAnimation.js:
- borderOutTimeline: 4-sided border expands inward (0.6s, quart.inOut)
- borderInTimeline: border collapses with hero fade-in (-0.4s overlap)
- Loading animation: logo fill, background scale, border collapse, hero reveal

Refs #363"
```

---

### Task 6: Handle the body class and data attribute problem

**Files:**
- Modify: `inc/integrations/page-transitions.php`
- Modify: `src/js/components/page-transitions/utils.js`

Anima uses FSE's `template-canvas.php` where `<body>` is rendered directly by WordPress. The `data-curpostid` and `data-curpostedit` data attributes need to be on the `<body>` tag, but we hooked into `anima/template_html:before` which outputs AFTER the body tag. We need a different approach.

**Step 1: Use body_class filter for data attributes**

In `inc/integrations/page-transitions.php`, remove the `anima_page_transitions_body_data` function and its hook. Replace with a `wp_footer` inline script that embeds the data:

```php
/**
 * Output post data as inline JSON for AJAX page sync.
 * This is read by the JS after each AJAX page swap.
 */
function anima_page_transitions_post_data() {
	if ( ! anima_page_transitions_enabled() ) {
		return;
	}

	$post_id = get_queried_object_id();
	$edit_link = '';

	if ( $post_id && current_user_can( 'edit_post', $post_id ) ) {
		$edit_link = get_edit_post_link( $post_id, 'raw' );
	}

	echo '<script type="application/json" id="anima-page-data">';
	echo wp_json_encode( [
		'postId'   => $post_id,
		'editLink' => $edit_link,
	] );
	echo '</script>';
}
add_action( 'wp_footer', 'anima_page_transitions_post_data', 1 );
```

**Step 2: Update utils.js to read from JSON instead of body data attributes**

In `src/js/components/page-transitions/utils.js`, update `syncAdminBar`:

```js
export function syncAdminBar( containerEl ) {
  if ( ! $( 'body' ).hasClass( 'admin-bar' ) ) {
    return;
  }

  // Read post data from the inline JSON block in the new page.
  const $pageData = $( containerEl ).parent().find( '#anima-page-data' );
  // Fallback: look in the full HTML response.
  if ( ! $pageData.length ) {
    return;
  }

  try {
    const data = JSON.parse( $pageData.text() );

    if ( data.editLink ) {
      $( '#wp-admin-bar-edit a' ).attr( 'href', data.editLink );
    }

    const $customizeLink = $( '#wp-admin-bar-customize a' );
    if ( $customizeLink.length ) {
      const baseUrl = $customizeLink.attr( 'href' ).replace( /url=.*$/, '' );
      $customizeLink.attr( 'href', baseUrl + 'url=' + encodeURIComponent( window.location.href ) );
    }
  } catch ( e ) {
    // Silently fail — admin bar links just won't update.
  }
}
```

And update its signature in `transitions.js` to pass the container element instead of HTML string:

```js
// In enter(), change:
syncAdminBar( html );
// To:
syncAdminBar( next.container );
```

**Step 3: Build and test**

```bash
npx webpack --mode=production --node-env=production
```

Expected: Admin bar Edit link updates correctly when navigating between pages with transitions enabled.

**Step 4: Commit**

```bash
git add inc/integrations/page-transitions.php src/js/components/page-transitions/ dist/js/page-transitions.js dist/js/page-transitions.min.js
git commit -m "Fix post data passing for admin bar sync

Use inline JSON script tag instead of body data attributes,
since FSE template-canvas renders body before our hooks fire.

Refs #363"
```

---

### Task 7: Error handling and fallback

**Files:**
- Modify: `src/js/components/page-transitions/index.js`

**Step 1: Add error hooks to Barba init**

In `src/js/components/page-transitions/index.js`, add Barba hooks after `barba.init()`:

```js
// Error fallback: if AJAX navigation fails, do a full page reload.
barba.hooks.on( 'page:error', ( { url } ) => {
  window.location.href = url;
} );

// After each transition, ensure the body is visible.
barba.hooks.after( () => {
  $( 'body' ).addClass( 'is-loaded' );
} );
```

**Step 2: Build and test**

```bash
npx webpack --mode=production --node-env=production
```

Expected: If a network error occurs during transition, the browser falls back to a normal page load instead of leaving the user stuck.

**Step 3: Commit**

```bash
git add src/js/components/page-transitions/ dist/js/page-transitions.js dist/js/page-transitions.min.js
git commit -m "Add error fallback — full page reload on AJAX failure

Refs #363"
```

---

### Task 8: Full build, verify ZIP, test on live site

**Files:** None modified. Verification only.

**Step 1: Full build**

```bash
export NVM_DIR="/Users/georgeolaru/.nvm" && source "/Users/georgeolaru/.nvm/nvm.sh" && nvm use 22
cd "/Users/georgeolaru/Local Sites/style-manager/app/public/wp-content/themes/anima"
npm run build
```

Expected: Build succeeds. ZIP created.

**Step 2: Verify ZIP includes page-transitions files**

```bash
unzip -l ../Anima-*.zip | grep page-transitions
```

Expected: `dist/js/page-transitions.js`, `dist/js/page-transitions.min.js` present. `src/js/components/page-transitions/` NOT present (excluded by `.zipignore`).

**Step 3: Verify ZIP excludes plans/**

```bash
unzip -l ../Anima-*.zip | grep plans
```

Expected: No results.

**Step 4: Test on live site**

With the feature toggle OFF:
- Page source should NOT contain `data-barba`, `.c-page-transition-border`, or `page-transitions.js`
- Navigation should be normal full page reloads

With the feature toggle ON:
- Border-expand animation on link clicks
- Opening curtain on first page load
- Admin bar links update after navigation
- Back/forward browser buttons work
- WooCommerce cart/checkout do full reloads
- External links open normally
- No console errors

**Step 5: Commit build artifacts**

```bash
git add dist/ style.css style-rtl.css languages/anima.pot
git commit -m "Build page transitions feature

Refs #363"
```

---

## File Summary

| File | Action | Purpose |
|------|--------|---------|
| `package.json` | Modify | Add `@barba/core` dependency |
| `webpack.config.js` | Modify | New entry point + gsap external |
| `src/js/page-transitions.js` | Create | Webpack entry point |
| `src/js/components/page-transitions/index.js` | Create | Barba.js init, link exclusion |
| `src/js/components/page-transitions/transitions.js` | Create | GSAP timelines (border expand/collapse) |
| `src/js/components/page-transitions/loading-animation.js` | Create | Initial page load animation |
| `src/js/components/page-transitions/utils.js` | Create | Body class sync, admin bar, analytics |
| `src/scss/components/_page-transitions.scss` | Create | Overlay CSS + keyframes |
| `src/scss/style.scss` | Modify | Import page-transitions partial |
| `inc/integrations/page-transitions.php` | Create | PHP: markup, enqueue, config |
| `inc/integrations.php` | Modify | Require page-transitions.php |
| `inc/integrations/style-manager/layout.php` | Modify | Add toggle option |
| `functions.php` | Modify | Register script handle |
