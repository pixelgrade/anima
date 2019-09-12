<?php
/**
 * The template part used for displaying the single product tabs.
 *
 * This template part can be overridden by copying it to a child theme or in the same theme
 * by putting it in the root `/template-parts/single-product/tabs/tabs.php` or in `/template-parts/woocommerce/single-product/tabs/tabs.php`.
 *
 * @see pixelgrade_locate_component_template_part()
 *
 * HOWEVER, on occasion Pixelgrade will need to update template files and you
 * will need to copy the new files to your child theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see        https://pixelgrade.com
 * @author     Pixelgrade
 * @package    Components/Woocommerce
 * @version    1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Filter tabs and allow third parties to add their own.
 *
 * Each tab is an array containing title, callback and priority.
 * @see woocommerce_default_product_tabs()
 */
$product_tabs = apply_filters( 'woocommerce_product_tabs', array() );

if ( ! empty( $product_tabs ) ) { ?>

	<div class="wc-tabs-wrapper">
		<ul class="tabs wc-tabs" role="tablist">
			<?php foreach ( $product_tabs as $tab_key => $product_tab ) : ?>
				<li class="<?php echo esc_attr( $tab_key ); ?>_tab" id="tab-title-<?php echo esc_attr( $tab_key ); ?>" role="tab" aria-controls="tab-<?php echo esc_attr( $tab_key ); ?>">
					<a class="h3" href="#tab-<?php echo esc_attr( $tab_key ); ?>"><?php echo wp_kses_post( apply_filters( 'woocommerce_product_' . $tab_key . '_tab_title', esc_html( $product_tab['title'] ), $tab_key ) ); ?></a>
				</li>
			<?php endforeach; ?>
		</ul>
		<?php foreach ( $product_tabs as $tab_key => $product_tab ) : ?>
			<div class="woocommerce-Tabs-panel woocommerce-Tabs-panel--<?php echo esc_attr( $tab_key ); ?> panel entry-content wc-tab" id="tab-<?php echo esc_attr( $tab_key ); ?>" role="tabpanel" aria-labelledby="tab-title-<?php echo esc_attr( $tab_key ); ?>">
				<?php if ( isset( $product_tab['callback'] ) ) { call_user_func( $product_tab['callback'], $key, $product_tab ); } ?>
			</div>
		<?php endforeach; ?>
	</div>

<?php }
