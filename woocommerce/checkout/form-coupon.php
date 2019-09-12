<?php
/**
 * The template part used for displaying the checkout coupon form.
 *
 * This template part can be overridden by copying it to a child theme or in the same theme
 * by putting it in the root `/template-parts/checkout/form-coupon.php` or in `/template-parts/woocommerce/checkout/form-coupon.php`.
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

if ( ! wc_coupons_enabled() ) {
	return;
}

?>

<div class="woocommerce-form-coupon-toggle">
	<?php wc_print_notice( apply_filters( 'woocommerce_checkout_coupon_message', esc_html__( 'Have a coupon?', '__components_txtd' ) . ' <a href="#" class="showcoupon">' . esc_html__( 'Click here to enter your code', '__components_txtd' ) . '</a>' ), 'notice' ); ?>
</div>

<div class="checkout_coupon woocommerce-form-coupon" method="post" style="display:none">

	<p><?php esc_html_e( 'If you have a coupon code, please apply it below.', '__components_txtd' ); ?></p>

	<p class="form-row form-row-first">
		<input type="text" name="coupon_code" class="input-text" placeholder="<?php esc_attr_e( 'Coupon code', '__components_txtd' ); ?>" id="coupon_code" value="" form="form-coupon" />
	</p>

	<p class="form-row form-row-last">
		<button type="submit" class="button" form="form-coupon" name="apply_coupon" value="<?php esc_attr_e( 'Apply coupon', '__components_txtd' ); ?>"><?php esc_html_e( 'Apply coupon', '__components_txtd' ); ?></button>
	</p>

	<div class="clear"></div>
</div>
