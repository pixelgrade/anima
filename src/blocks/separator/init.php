<?php

if ( ! function_exists( 'rosa_separator_block_init' ) ) {

	function rosa_separator_block_init() {
		register_block_type( 'core/separator', array(
			'attributes' => array(),
			'render_callback' => 'rosa_render_separator_block'
		) );
	}
}
add_action( 'init', 'rosa_separator_block_init' );

if ( ! function_exists( 'rosa_render_separator_block' ) ) {

	function rosa_render_separator_block( $attributes, $content ) {
		ob_start(); ?>
			<div class="wp-block-separator <?php echo $attributes['className']; ?>">
				<?php echo rosa_get_separator_markup(); ?>
			</div>
		<?php return ob_get_clean();
	}

}
