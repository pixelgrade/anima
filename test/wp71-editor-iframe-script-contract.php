<?php
/**
 * Ensure frontend-only inline scripts are excluded from admin editor canvases.
 */

$source = file_get_contents( __DIR__ . '/../functions.php' );

if ( ! preg_match(
	'/function\s+anima_print_scripts\s*\(\s*\)\s*\{\s*if\s*\(\s*is_admin\(\)\s*\)\s*\{\s*return\s*;/s',
	$source
) ) {
	throw new RuntimeException(
		'anima_print_scripts() must return before printing frontend helpers during admin block-editor asset collection.'
	);
}

echo "WordPress 7.1 editor iframe script contract passed.\n";
