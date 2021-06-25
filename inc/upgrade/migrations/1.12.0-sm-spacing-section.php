<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$site_container_width = intval( pixelgrade_option( 'content_wide_width_addon', 75 ) );
$content_inset        = intval( pixelgrade_option( 'wide_offset_width_addon', 230 ) );
$spacing_level        = intval( pixelgrade_option( 'layout_spacing', 1 ) );

// update the options with the migrated color sources and output values
update_option( 'sm_site_container_width', $site_container_width );
update_option( 'sm_content_inset', $content_inset );
update_option( 'sm_spacing_level', $spacing_level );
