<?php
/**
 * Hive-inspired decorative title treatments.
 *
 * @package Anima
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'style_manager/filter_fields', 'anima_customize_post_title_styling_field', 50, 1 );
add_action( 'after_setup_theme', 'anima_maybe_migrate_post_title_styling_option', 20 );
add_action( 'after_setup_theme', 'anima_maybe_invalidate_post_title_styling_customizer_cache', 20 );

/**
 * Replace the decorative title style picker with an LT-facing post title toggle.
 *
 * @param array $config Style Manager config.
 * @return array
 */
function anima_customize_post_title_styling_field( array $config ): array {
	if ( empty( $config['sections']['style_manager_section']['options']['sm_decorative_titles_style'] ) || ! is_array( $config['sections']['style_manager_section']['options']['sm_decorative_titles_style'] ) ) {
		return $config;
	}

	$config['sections']['style_manager_section']['options']['sm_decorative_titles_style_intro'] = [
		'type'         => 'html',
		'setting_type' => 'option',
		'setting_id'   => 'sm_decorative_titles_style_intro',
		'html'         => '<div class="customize-control-title">' . esc_html__( 'Auto-style Post Titles', '__theme_txtd' ) . '</div>' .
			'<span class="description customize-control-description">' . esc_html__( 'Give post titles and supported collection card titles a more expressive typographic treatment, guided automatically by punctuation and letter case.', '__theme_txtd' ) . '</span>',
	];

	$config['sections']['style_manager_section']['options']['sm_decorative_titles_style'] = array_merge(
		$config['sections']['style_manager_section']['options']['sm_decorative_titles_style'],
		[
			'type'         => 'sm_toggle',
			'setting_type' => 'option',
			'setting_id'   => 'sm_decorative_titles_style',
			'label'        => esc_html__( 'Enable Auto-style Post Titles', '__theme_txtd' ),
			'desc'         => '',
			'default'      => false,
			'choices'      => [],
		]
	);

	return $config;
}

/**
 * Normalize the shared cross-theme decorative titles option to the new LT toggle values.
 */
function anima_maybe_migrate_post_title_styling_option(): void {
	$legacy_value = get_option( 'sm_decorative_titles_style', null );

	if ( 'hive' === $legacy_value ) {
		update_option( 'sm_decorative_titles_style', true );
		return;
	}

	if ( in_array( $legacy_value, [ 'underline', 'blocky' ], true ) ) {
		update_option( 'sm_decorative_titles_style', false );
	}
}

/**
 * Invalidate the cached Style Manager Customizer config if the LT field contract drifted.
 */
function anima_maybe_invalidate_post_title_styling_customizer_cache(): void {
	$cached_config = get_option( 'pixelgrade_style_manager_customizer_config' );

	if ( ! is_array( $cached_config ) ) {
		return;
	}

	$options = $cached_config['panels']['style_manager_panel']['sections']['sm_tweak_board_section']['options'] ?? [];
	$field = $options['sm_decorative_titles_style'] ?? [];
	$intro = $options['sm_decorative_titles_style_intro'] ?? [];

	$has_expected_field = (
		( $intro['type'] ?? '' ) === 'html'
		&& false !== strpos( (string) ( $intro['html'] ?? '' ), 'Auto-style Post Titles' )
		&& false !== strpos( (string) ( $intro['html'] ?? '' ), 'Give post titles and supported collection card titles a more expressive typographic treatment, guided automatically by punctuation and letter case.' )
		&& ( $field['type'] ?? '' ) === 'sm_toggle'
		&& ( $field['setting_type'] ?? '' ) === 'option'
		&& ( $field['setting_id'] ?? '' ) === 'sm_decorative_titles_style'
		&& ( $field['label'] ?? '' ) === esc_html__( 'Enable Auto-style Post Titles', '__theme_txtd' )
		&& empty( $field['desc'] )
		&& array_key_exists( 'default', $field )
		&& false === $field['default']
	);

	if ( $has_expected_field ) {
		return;
	}

	update_option( 'pixelgrade_style_manager_customizer_config_timestamp', 0, true );
	update_option( 'pixelgrade_style_manager_customizer_opt_name_timestamp', 0, true );
}

/**
 * Check whether automatic post title styling is active.
 */
function anima_is_hive_decorative_titles_style_active(): bool {
	$value = get_option( 'sm_decorative_titles_style', false );

	if ( is_bool( $value ) ) {
		return $value;
	}

	if ( is_numeric( $value ) ) {
		return (bool) $value;
	}

	if ( is_string( $value ) ) {
		$normalized_value = strtolower( $value );

		if ( in_array( $normalized_value, [ '1', 'true', 'yes', 'on', 'hive' ], true ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Port Hive classic's title styling rules to a standalone parser.
 *
 * @param string $title Raw title text.
 * @return string
 */
function anima_get_hive_styled_title_markup( string $title ): string {
	if ( '' === $title || ! class_exists( 'DOMDocument' ) ) {
		return esc_html( $title );
	}

	$document = anima_create_html_fragment_document( $title );

	if ( ! $document instanceof DOMDocument ) {
		return esc_html( $title );
	}

	$body = $document->getElementsByTagName( 'body' )->item( 0 );

	if ( ! $body instanceof DOMElement ) {
		return esc_html( $title );
	}

	anima_apply_hive_title_rules_to_descendant_text_nodes( $body );

	$styled_title = anima_get_html_from_fragment_body( $document );

	return wp_kses(
		wp_specialchars_decode( $styled_title ),
		[
			'b' => [],
			'i' => [],
		]
	);
}

/**
 * Apply Hive title styling to rendered core/post-title blocks.
 *
 * @param string       $block_content Rendered block HTML.
 * @param array        $block         Parsed block data.
 * @param WP_Block|null $instance     Runtime block instance.
 * @return string
 */
function anima_apply_hive_decorative_style_to_post_title_block( string $block_content, array $block = [], $instance = null ): string {
	if ( ! anima_is_hive_decorative_titles_style_active() || '' === trim( $block_content ) ) {
		return $block_content;
	}

	$post_id = anima_resolve_rendered_title_post_id( $block, $instance );

	if ( empty( $post_id ) ) {
		return $block_content;
	}

	$styled_title = anima_get_hive_styled_title_markup( get_the_title( $post_id ) );

	if ( '' === $styled_title ) {
		return $block_content;
	}

	return anima_replace_element_contents_with_html(
		$block_content,
		[
			'//*[contains(concat(" ", normalize-space(@class), " "), " wp-block-post-title ")]//a[1]',
			'//*[contains(concat(" ", normalize-space(@class), " "), " wp-block-post-title ")][1]',
		],
		$styled_title
	);
}
add_filter( 'render_block_core/post-title', 'anima_apply_hive_decorative_style_to_post_title_block', 10, 3 );

/**
 * Apply Hive title styling to Nova Blocks collection card titles.
 *
 * @param string        $markup Card markup.
 * @param WP_Post|mixed $post   Card post object.
 * @return string
 */
function anima_apply_hive_decorative_style_to_collection_card_markup( string $markup, $post, array $attributes = [] ): string {
	unset( $attributes );

	if ( ! anima_is_hive_decorative_titles_style_active() || '' === trim( $markup ) || ! $post instanceof WP_Post ) {
		return $markup;
	}

	$styled_title = anima_get_hive_styled_title_markup( get_the_title( $post ) );

	if ( '' === $styled_title ) {
		return $markup;
	}

	return anima_replace_element_contents_with_html(
		$markup,
		[
			'//*[contains(concat(" ", normalize-space(@class), " "), " nb-card__title ")]//a[1]',
			'//*[contains(concat(" ", normalize-space(@class), " "), " nb-card__title ")][1]',
		],
		$styled_title
	);
}
add_filter( 'novablocks/get_collection_card_markup', 'anima_apply_hive_decorative_style_to_collection_card_markup', 10, 3 );

/**
 * Resolve the current render-time post ID for a title block.
 *
 * @param array        $block    Parsed block data.
 * @param WP_Block|null $instance Runtime block instance.
 * @return int
 */
function anima_resolve_rendered_title_post_id( array $block = [], $instance = null ): int {
	if ( is_object( $instance ) && isset( $instance->context ) && is_array( $instance->context ) && ! empty( $instance->context['postId'] ) ) {
		return (int) $instance->context['postId'];
	}

	if ( ! empty( $block['context']['postId'] ) ) {
		return (int) $block['context']['postId'];
	}

	if ( ! empty( $GLOBALS['post'] ) && $GLOBALS['post'] instanceof WP_Post ) {
		return (int) $GLOBALS['post']->ID;
	}

	return (int) get_the_ID();
}

/**
 * Apply Hive title rules to all descendant text nodes.
 */
function anima_apply_hive_title_rules_to_descendant_text_nodes( DOMNode $node ): void {
	if ( XML_TEXT_NODE === $node->nodeType ) {
		$node->nodeValue = anima_apply_hive_title_rules_to_text( $node->nodeValue );
		return;
	}

	if ( ! $node->hasChildNodes() ) {
		return;
	}

	foreach ( iterator_to_array( $node->childNodes ) as $child_node ) {
		if ( $child_node instanceof DOMNode ) {
			anima_apply_hive_title_rules_to_descendant_text_nodes( $child_node );
		}
	}
}

/**
 * Apply the original Hive text transformations.
 */
function anima_apply_hive_title_rules_to_text( string $text ): string {
	$text = preg_replace( '/(?<=\s|^)([\p{Lu}\'\`\.\‘\’][\p{Lu}\'\`\.\‘\’]+)(?=\s|$)/u', '<b>$1</b>', $text );
	$text = preg_replace( "/(?<=\s|^)([\w\'\`\.\‘\’]+\!)/u", '<b>$1</b>', $text );
	$text = preg_replace( '/(\"[^\"]+\")/', '<i>$1</i>', $text );
	$text = preg_replace( '/(\“[^\”]+\”)/', '<i>$1</i>', $text );
	$text = preg_replace( '/(\&\#8220\;[^\"]+\&\#8221\;)/', '<i>$1</i>', $text );
	$text = preg_replace( '/(\([^\(\)]+\))/', '<i>$1</i>', $text );
	$text = preg_replace( '/(?<=\:)([^\:\!\?]+[\!|\?]\S*)/', '<i>$1</i>', $text );
	$text = preg_replace( '/(\A[^\:]+\:)/', '<b>$1</b>', $text );

	return preg_replace( '/(\A[^\?\:\!]+\?)([^\?\:\!]+)\z/', '<b>$1</b><i>$2</i>', $text );
}

/**
 * Replace the contents of the first matching element with HTML.
 *
 * @param string   $html          Source markup.
 * @param string[] $xpath_queries Ordered XPath queries.
 * @param string   $replacement   Replacement HTML.
 * @return string
 */
function anima_replace_element_contents_with_html( string $html, array $xpath_queries, string $replacement ): string {
	if ( '' === trim( $html ) || '' === trim( $replacement ) || ! class_exists( 'DOMDocument' ) ) {
		return $html;
	}

	$document = anima_create_html_fragment_document( $html );

	if ( ! $document instanceof DOMDocument ) {
		return $html;
	}

	$xpath = new DOMXPath( $document );
	$target = null;

	foreach ( $xpath_queries as $xpath_query ) {
		$node_list = $xpath->query( $xpath_query );

		if ( $node_list instanceof DOMNodeList && $node_list->length > 0 && $node_list->item( 0 ) instanceof DOMElement ) {
			$target = $node_list->item( 0 );
			break;
		}
	}

	if ( ! $target instanceof DOMElement ) {
		return $html;
	}

	while ( $target->firstChild ) {
		$target->removeChild( $target->firstChild );
	}

	$replacement_document = anima_create_html_fragment_document( $replacement );

	if ( ! $replacement_document instanceof DOMDocument ) {
		return $html;
	}

	$replacement_body = $replacement_document->getElementsByTagName( 'body' )->item( 0 );

	if ( ! $replacement_body instanceof DOMElement ) {
		return $html;
	}

	foreach ( iterator_to_array( $replacement_body->childNodes ) as $child_node ) {
		if ( $child_node instanceof DOMNode ) {
			$target->appendChild( $document->importNode( $child_node, true ) );
		}
	}

	return anima_get_html_from_fragment_body( $document );
}

/**
 * Create a DOM document from an HTML fragment.
 */
function anima_create_html_fragment_document( string $html ): ?DOMDocument {
	if ( '' === $html || ! class_exists( 'DOMDocument' ) ) {
		return null;
	}

	$document = new DOMDocument( '1.0', 'UTF-8' );
	$previous_state = libxml_use_internal_errors( true );
	$loaded = $document->loadHTML( '<?xml encoding="UTF-8"><body>' . $html . '</body>' );
	libxml_clear_errors();
	libxml_use_internal_errors( $previous_state );

	if ( ! $loaded ) {
		return null;
	}

	foreach ( iterator_to_array( $document->childNodes ) as $child_node ) {
		if ( XML_PI_NODE === $child_node->nodeType ) {
			$document->removeChild( $child_node );
		}
	}

	return $document;
}

/**
 * Serialize the children of the fragment body.
 */
function anima_get_html_from_fragment_body( DOMDocument $document ): string {
	$body = $document->getElementsByTagName( 'body' )->item( 0 );

	if ( ! $body instanceof DOMElement ) {
		return '';
	}

	$html = '';

	foreach ( $body->childNodes as $child_node ) {
		$html .= $document->saveHTML( $child_node );
	}

	return $html;
}
