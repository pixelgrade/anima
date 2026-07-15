=== Anima LT ===
Contributors: pixelgrade
Requires at least: 6.0
Tested up to: 7.0
Requires PHP: 7.4
Stable tag: 2.0.44
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Tags: blog, portfolio, one-column, custom-background, custom-logo, custom-menu, featured-images, threaded-comments, translation-ready, block-patterns, full-site-editing, rtl-language-support

A design-system foundation for the block editor, and the universal base of the Pixelgrade LT site solutions.

== Description ==

Anima LT is a design-system foundation for the block editor — a considered base
of colour, typography, and spacing, with several palettes and curated Google
font pairings, rather than a library of pre-built layouts. It is the universal
base of the Pixelgrade LT site solutions (Rosa LT, Felt LT, Julia LT, Mies LT).

Anima is complete and usable on its own with core blocks. Add the free Style
Manager and Nova Blocks plugins for the full Pixelgrade design-system workflow:
Style Manager coordinates colors, typography, and spacing, while Nova Blocks
adds richer layouts and ready-made sections that pick up exactly where the
theme leaves off.

See it live: https://starter.pixelgrade.com/anima/ — a public demo running
only the theme and core blocks, no plugins.

Install it from the WordPress.org theme directory:
https://wordpress.org/themes/anima-lt/

The theme is developed in public. The human-readable sources for the compiled
CSS (SCSS) and the build tooling live in the theme's repository:
https://github.com/pixelgrade/anima

== Frequently Asked Questions ==

= Does this theme require any plugins? =

No. Anima LT works with the core block editor out of the box. It integrates
with the Style Manager and Nova Blocks plugins (both available on WordPress.org)
for additional design-system controls, blocks, and layout options when those
plugins are active.

== Changelog ==

= 2.0.44 =

* Fix an uncovered strip on the right side of full-width layouts and incomplete dark-mode backgrounds on Style Manager sites, by neutralizing the wp.org root padding and routing the root colors through Style Manager tokens.

= 2.0.43 =

* Add the Anima Collage recipe with Patch-inspired masonry rhythm, expressive card treatments, integrated header behavior, and matching editor previews.
* Add a Patch header pattern and connect its dense card typography to Style Manager.
* Fix Quote card hover framing and restore category/byline metadata reveal in Collage collections.
* Preserve WordPress global styles and bundled font defaults when Style Manager is active.
* Keep the Anima LT header, footer, and hero aligned to the wide layout grid.

= 2.0.24 =

* Improve block-based header compatibility with Nova Blocks navigation editing and fresh-site header pattern registration.
* Fix transparent and inverted Site Logo parity in transparent and dark header contexts.
* Fix Depth Parallax behavior on Parametric collections after layout rebuilds.

= 2.0.23 =

* Add a dismissible welcome notice after activation that offers to install the free Pixelgrade Assistant plugin for guided setup — recommended companion plugins, starter content, and onboarding.

= 2.0.22 =

* First approved WordPress.org directory release.

= 2.0.21 =
* Remove external sample links and remote preview references from the WordPress.org package.

= 2.0.17 =
* Initial WordPress.org review package.

== Copyright ==

Anima LT WordPress Theme, Copyright Pixelgrade
Anima LT is distributed under the terms of the GNU GPL v2 or later.

This theme bundles the following third-party resources:

Barba.js, Copyright Luigi De Rosa and contributors
License: MIT
Source: https://github.com/barbajs/barba

js-cookie, Copyright Klaus Hartl, Fagner Brack, and contributors
License: MIT
Source: https://github.com/js-cookie/js-cookie

colord, Copyright Vlad Shilov
License: MIT
Source: https://github.com/omgovich/colord

Font Awesome icons (subset), Copyright Dave Gandy
License: SIL OFL 1.1 (fonts), MIT (code)
Source: https://fontawesome.com/

Bundled fonts (assets/fonts/), Space Grotesk / Cormorant / Quattrocento Sans / Lora / Montserrat
License: SIL Open Font License 1.1
Source: https://fonts.google.com/ (see assets/fonts/LICENSE.md)

Cover image (assets/images/cover-foundation.jpg), original abstract artwork by Pixelgrade
License: GPLv2 or later (same as this theme)
