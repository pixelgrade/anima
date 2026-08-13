<?php
/**
 * Ensure shipped block markup matches the WordPress 7.1-era serializers.
 */

$roots = array( 'templates', 'parts', 'inc/fse/patterns', 'wporg' );
$patterns = array(
	'legacy Core Heading markup' => '/<h[1-6]\b(?![^>]*\bwp-block-heading\b)[^>]*>/i',
	'legacy Nova custom-property units' => '/--nb-(?:card-media-container-height|emphasis-area|block-zindex):\s*[-+]?\d+(?:\.\d+)?px\b/i',
);
$failures = array();

foreach ( $roots as $root ) {
	if ( ! is_dir( $root ) ) {
		continue;
	}

	$iterator = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $root ) );
	foreach ( $iterator as $file ) {
		if ( ! $file->isFile() || ! in_array( $file->getExtension(), array( 'html', 'php' ), true ) ) {
			continue;
		}

		$path    = $file->getPathname();
		$content = file_get_contents( $path );
		foreach ( $patterns as $label => $pattern ) {
			if ( ! preg_match_all( $pattern, $content, $matches, PREG_OFFSET_CAPTURE ) ) {
				continue;
			}

			foreach ( $matches[0] as list( $match, $offset ) ) {
				$line       = 1 + substr_count( substr( $content, 0, $offset ), "\n" );
				$failures[] = sprintf( '%s:%d: %s: %s', $path, $line, $label, $match );
			}
		}
	}
}

if ( $failures ) {
	fwrite( STDERR, implode( "\n", $failures ) . "\n" );
	exit( 1 );
}

echo "WordPress 7.1 template markup contract passed.\n";
