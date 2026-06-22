<?php
/**
 * Pixelgrade Assistant integration.
 *
 * Pixelgrade Assistant is the free, WordPress.org-hosted onboarding plugin for
 * the Anima stack. It bundles its own plugin installer (Style Manager, Nova
 * Blocks), runs the setup wizard + starter content import, and surfaces the
 * premium Pixelgrade Plus. The theme never installs those plugins itself; it
 * only declares support so Assistant can drive onboarding.
 *
 * This integration ships in BOTH the commercial and the WordPress.org build. It
 * is inert when the Assistant plugin is not present and introduces no remote or
 * non-GPL assets, so it is safe for the bare WordPress.org package.
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Declare support for Pixelgrade Assistant.
 *
 * Assistant reads this support tag to identify the theme and configure
 * onboarding. All keys are optional (the plugin fills in sensible defaults),
 * but providing the support URL keeps the in-wizard help links accurate.
 */
function anima_setup_pixelgrade_assistant() {
	add_theme_support(
		'pixelgrade_assistant',
		[
			'support_url' => 'https://pixelgrade.com/docs/anima/',
		]
	);
}
add_action( 'after_setup_theme', 'anima_setup_pixelgrade_assistant', 10 );

/**
 * Allow Pixelgrade Assistant's starter content import to overwrite the theme's
 * block areas (header/footer template parts) so the imported demo replaces the
 * defaults instead of duplicating them.
 *
 * Assistant 2.x renamed this filter from `pixcare_sce_should_overwrite_existing_post`
 * to `pixassist_sce_should_overwrite_existing_post`.
 *
 * @param bool  $should_overwrite Whether the existing post should be overwritten.
 * @param int   $existing_post_id The ID of the existing post.
 * @param array $post             The post being imported.
 *
 * @return bool
 */
function anima_force_pixassist_sce_overwrite_existing_post( $should_overwrite, $existing_post_id, $post ) {
	if ( ! empty( $post['post_type'] ) && 'block_area' === $post['post_type'] ) {
		$should_overwrite = true;
	}

	return $should_overwrite;
}
add_filter( 'pixassist_sce_should_overwrite_existing_post', 'anima_force_pixassist_sce_overwrite_existing_post', 10, 3 );
