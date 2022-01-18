<?php
/**
 * Template part for displaying a message that posts cannot be found
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Anima
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>

<h1 class="page-title"><?php esc_html_e( 'Nothing Found', '__theme_txtd' ); ?></h1>
<?php
if ( is_home() && current_user_can( 'publish_posts' ) ) {

	printf(
		'<p>' . wp_kses(
		/* translators: 1: link to WP admin new post page. */
			__( 'Ready to publish your first post? <a href="%1$s">Get started here</a>.', '__theme_txtd' ),
			[
				'a' => [
					'href' => [],
				],
			]
		) . '</p>',
		esc_url( admin_url( 'post-new.php' ) )
	);

} elseif ( is_search() ) { ?>

    <p><?php esc_html_e( 'Sorry, but nothing matched your search terms. Please try again with some different keywords.', '__theme_txtd' ); ?></p>
	<?php
	get_search_form();

} else { ?>

    <p><?php esc_html_e( 'It seems we can&rsquo;t find what you&rsquo;re looking for. Perhaps searching can help.', '__theme_txtd' ); ?></p>
	<?php
	get_search_form();

} ?>
