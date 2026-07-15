<?php
/**
 * Contract test for neutralizing the wp.org root design (root padding +
 * root colors) on Style Manager sites.
 *
 * Run from the theme root:
 * php test/style-manager-root-design-contract.php
 */

function anima_fail_root_padding_contract_test( string $message ): void {
	fwrite( STDERR, $message . PHP_EOL );
	exit( 1 );
}

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ );
}

$GLOBALS['anima_root_padding_contract_filters'] = [];

function add_filter( string $hook_name, $callback, int $priority = 10, int $accepted_args = 1 ): bool {
	$GLOBALS['anima_root_padding_contract_filters'][ $hook_name ][] = $callback;

	return true;
}

function add_action( string $hook_name, $callback, int $priority = 10, int $accepted_args = 1 ): bool {
	return true;
}

function remove_action( string $hook_name, $callback, int $priority = 10 ): bool {
	return true;
}

/**
 * Fake stand-in for WP_Theme_JSON_Data. Records the payload passed to
 * update_with() and returns a distinct sentinel object so the test can tell
 * whether the filter returned the original instance or a new one.
 */
class Anima_Test_Fake_Theme_Json_Data {
	/** @var array|null */
	public $received_update = null;

	/** @var bool */
	public $update_with_called = false;

	public function update_with( array $data ) {
		$this->update_with_called = true;
		$this->received_update    = $data;

		return new Anima_Test_Fake_Theme_Json_Data_Result( $data );
	}
}

/**
 * Sentinel result object returned by update_with(), distinct from the input
 * instance so tests can assert the filter returned "the update result" and
 * not the original object.
 */
class Anima_Test_Fake_Theme_Json_Data_Result {
	/** @var array */
	public $data;

	public function __construct( array $data ) {
		$this->data = $data;
	}

	public function update_with( array $data ) {
		return $this;
	}
}

require_once dirname( __DIR__ ) . '/inc/block-editor.php';

$callbacks = $GLOBALS['anima_root_padding_contract_filters']['wp_theme_json_data_theme'] ?? [];

if ( ! in_array( 'anima_neutralize_wporg_root_design_for_style_manager', $callbacks, true ) ) {
	anima_fail_root_padding_contract_test(
		'anima_neutralize_wporg_root_design_for_style_manager must be registered on wp_theme_json_data_theme.'
	);
}

// -----------------------------------------------------------------------------
// 1. Style Manager active: the filter must call update_with() with exactly the
//    two neutralizing keys and nothing else.
// -----------------------------------------------------------------------------
eval( 'namespace Pixelgrade\\StyleManager; class Plugin {}' );

$fake   = new Anima_Test_Fake_Theme_Json_Data();
$result = anima_neutralize_wporg_root_design_for_style_manager( $fake );

if ( ! $fake->update_with_called ) {
	anima_fail_root_padding_contract_test(
		'Style Manager active: update_with() must be called.'
	);
}

if ( $result === $fake ) {
	anima_fail_root_padding_contract_test(
		'Style Manager active: the filter must return the update_with() result, not the original object.'
	);
}

if ( ! ( $result instanceof Anima_Test_Fake_Theme_Json_Data_Result ) ) {
	anima_fail_root_padding_contract_test(
		'Style Manager active: the filter must return whatever update_with() produced.'
	);
}

$payload = $fake->received_update;

if ( ! isset( $payload['settings']['useRootPaddingAwareAlignments'] )
	|| $payload['settings']['useRootPaddingAwareAlignments'] !== false ) {
	anima_fail_root_padding_contract_test(
		'Style Manager active: settings.useRootPaddingAwareAlignments must be exactly false.'
	);
}

$settings_keys = array_keys( $payload['settings'] );
if ( $settings_keys !== [ 'useRootPaddingAwareAlignments' ] ) {
	anima_fail_root_padding_contract_test(
		'Style Manager active: settings must contain ONLY useRootPaddingAwareAlignments, got: ' . implode( ', ', $settings_keys )
	);
}

if ( isset( $payload['settings']['blocks'] ) ) {
	anima_fail_root_padding_contract_test(
		'Style Manager active: the payload must not touch settings.blocks.* (Nova Blocks owns that subtree).'
	);
}

if ( isset( $payload['settings']['color'] ) ) {
	anima_fail_root_padding_contract_test(
		'Style Manager active: the payload must not touch settings.color.* (preset definitions stay for the bare wp.org preview).'
	);
}

$padding = $payload['styles']['spacing']['padding'] ?? null;
$expected_padding = [
	'top'    => '0',
	'right'  => '0',
	'bottom' => '0',
	'left'   => '0',
];

if ( $padding !== $expected_padding ) {
	anima_fail_root_padding_contract_test(
		'Style Manager active: styles.spacing.padding must be all four sides set to "0", got: ' . var_export( $padding, true )
	);
}

$spacing_keys = array_keys( $payload['styles']['spacing'] );
if ( $spacing_keys !== [ 'padding' ] ) {
	anima_fail_root_padding_contract_test(
		'Style Manager active: styles.spacing must contain ONLY padding (no blockGap), got: ' . implode( ', ', $spacing_keys )
	);
}

$color          = $payload['styles']['color'] ?? null;
$expected_color = [
	'background' => 'var(--sm-current-bg-color)',
	'text'       => 'var(--sm-current-fg1-color)',
];

if ( $color !== $expected_color ) {
	anima_fail_root_padding_contract_test(
		'Style Manager active: styles.color must route background/text through the Style Manager tokens, got: ' . var_export( $color, true )
	);
}

$styles_keys = array_keys( $payload['styles'] );
sort( $styles_keys );
if ( $styles_keys !== [ 'color', 'spacing' ] ) {
	anima_fail_root_padding_contract_test(
		'Style Manager active: styles must contain ONLY spacing and color, got: ' . implode( ', ', $styles_keys )
	);
}

// -----------------------------------------------------------------------------
// 2. Style Manager inactive: the filter must be a no-op — same instance
//    returned, update_with() never called.
// -----------------------------------------------------------------------------
// Simulate an "inactive" environment by calling the callback directly against
// a context where anima_style_manager_is_active() would return false. Since
// that helper checks real class/function existence and we already defined
// Pixelgrade\StyleManager\Plugin above (process-wide, can't be undefined),
// this test instead runs in a separate PHP process with a clean environment.
$inactive_script = dirname( __DIR__ ) . '/inc/block-editor.php';
$inactive_check  = <<<'PHP'
<?php
define( 'ABSPATH', __DIR__ );
function add_filter( $a, $b, $c = 10, $d = 1 ) { return true; }
function add_action( $a, $b, $c = 10, $d = 1 ) { return true; }
function remove_action( $a, $b, $c = 10 ) { return true; }

class Fake {
	public $update_with_called = false;
	public function update_with( array $data ) {
		$this->update_with_called = true;
		return 'SHOULD_NOT_BE_RETURNED';
	}
}

require_once __DIR__ . '/inc/block-editor.php';

$fake = new Fake();
$result = anima_neutralize_wporg_root_design_for_style_manager( $fake );

if ( $fake->update_with_called ) {
	fwrite( STDERR, "Style Manager inactive: update_with() must never be called.\n" );
	exit( 1 );
}

if ( $result !== $fake ) {
	fwrite( STDERR, "Style Manager inactive: the filter must return the original object untouched.\n" );
	exit( 1 );
}

echo "inactive-subprocess-ok\n";
PHP;

$tmp_dir = sys_get_temp_dir() . '/anima-root-padding-contract-' . uniqid();
mkdir( $tmp_dir );
mkdir( $tmp_dir . '/inc' );
copy( dirname( __DIR__ ) . '/inc/block-editor.php', $tmp_dir . '/inc/block-editor.php' );
file_put_contents( $tmp_dir . '/check.php', $inactive_check );

$php_binary = PHP_BINARY ?: 'php';
$output     = [];
$exit_code  = 0;
exec( escapeshellarg( $php_binary ) . ' ' . escapeshellarg( $tmp_dir . '/check.php' ) . ' 2>&1', $output, $exit_code );

// Clean up the temp fixture regardless of outcome.
@unlink( $tmp_dir . '/inc/block-editor.php' );
@rmdir( $tmp_dir . '/inc' );
@unlink( $tmp_dir . '/check.php' );
@rmdir( $tmp_dir );

if ( 0 !== $exit_code || ! in_array( 'inactive-subprocess-ok', $output, true ) ) {
	anima_fail_root_padding_contract_test(
		'Style Manager inactive subprocess check failed: ' . implode( "\n", $output )
	);
}

// -----------------------------------------------------------------------------
// 3. Non-object / method-less input passes through unchanged, even with Style
//    Manager active (Pixelgrade\StyleManager\Plugin already defined above).
// -----------------------------------------------------------------------------
$non_object_inputs = [
	null,
	'a string',
	42,
	[ 'not' => 'an object' ],
	new stdClass(), // object without update_with().
];

foreach ( $non_object_inputs as $input ) {
	$result = anima_neutralize_wporg_root_design_for_style_manager( $input );

	if ( $result !== $input ) {
		anima_fail_root_padding_contract_test(
			'Non-object/method-less input must pass through unchanged: ' . var_export( $input, true )
		);
	}
}

echo "Style Manager root-design neutralization contract OK\n";
