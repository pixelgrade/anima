<?php

/**
 * Handle the Stripe integration logic.
 *
 * Everything here gets run at the `after_setup_theme` hook, priority 10.
 * So only use hooks that come after that. The rest will not run.
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function rosa2_stripe_elements_style( $array ) {
	$array = array(
		'base'     => array(
			'fontSize'   => '17px',
			'padding'   => '0',
			'fontSmoothing' => 'antialiased',
//			'::placeholder' => array(
//				'color' => "#909090"
//			)
		),
	);

	return $array;
}

add_filter( 'wc_stripe_elements_styling', 'rosa2_stripe_elements_style' );
