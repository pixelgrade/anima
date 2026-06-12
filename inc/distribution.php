<?php
/**
 * Commercial distribution logic.
 *
 * Everything loaded from this file belongs to the commercial (WUpdates)
 * distribution of the theme: the self-update mechanism, the required-plugins
 * onboarding (TGMPA), the Pixelgrade Care installer/notice, and the remote
 * CDN webfonts fallback.
 *
 * The WordPress.org build strips this file (and everything it loads) via
 * `.zipignore-wporg`. The rest of the theme must keep working without it:
 * functions.php only loads it when it exists, and no code outside this file
 * may call functions defined here without guarding with
 * `function_exists()` / `class_exists()`.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WUpdates self-update mechanism.
 */
require_once trailingslashit( get_template_directory() ) . 'inc/distribution/wupdates.php';

/**
 * Fallback webfonts served from the Pixelgrade CDN when Style Manager is not active.
 */
require_once trailingslashit( get_template_directory() ) . 'inc/distribution/webfonts-fallback.php';

/**
 * Remote vendor scripts (GSAP, SplitText, Snap.svg) — CDN-loaded and not
 * GPL-redistributable, so they exist only in the commercial distribution.
 */
require_once trailingslashit( get_template_directory() ) . 'inc/distribution/remote-scripts.php';

/**
 * Required plugins onboarding (TGM Plugin Activation).
 */
require_once trailingslashit( get_template_directory() ) . 'inc/required-plugins.php';

/**
 * Pixelgrade Care installer, activation redirect, and theme support.
 */
require_once trailingslashit( get_template_directory() ) . 'inc/integrations/pixelgrade-care.php';
