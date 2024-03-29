<?php
/**
 * Anima required or recommended plugins
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once trailingslashit( get_template_directory() ) . 'inc/required-plugins/class-pxg-plugin-activation.php';

function anima_register_required_plugins() {

	$protocol = 'http:';
	if ( is_ssl() ) {
		$protocol = 'https:';
	}

	$plugins = [
		[
			'name'               => 'Pixelgrade Care',
			'slug'               => 'pixelgrade-care',
			'is_callable'        => 'PixelgradeCare',
			'force_activation'   => false,
			'force_deactivation' => false,
			'required'           => true,
			'source'             => $protocol . '//wupdates.com/api_wupl_version/JxbVe/bv7n4mlA2pys6070w0nlz41q0vlx4z5rgzAAyl6n4zn29y5tnAvvmvrpgz7h3s5rp15A4zjrjbff26jq4fmf4rkpgfv2mq5fgvzw9qsg3zjgm9tx3zrc95t3hf2t45smjv5h2l5qgfgd4qkf3q72s6643fAw7sdjgz3t5p3/',
			'external_url'       => $protocol . '//github.com/pixelgrade/pixelgrade_care',
			'version'            => '1.17.2',
		],
		[
			'name'        => 'Style Manager',
			'slug'        => 'style-manager',
			'is_callable' => '\Pixelgrade\StyleManager\plugin',
			'required'    => true,
			'version'     => '2.2.7',
		],
		[
			'name'     => 'Nova Blocks',
			'slug'     => 'nova-blocks',
			'required' => true,
			'version'  => '2.1.2',
		],
	];

	$config = [
		'domain'       => '__theme_txtd', // Text domain - likely want to be the same as your theme.
		'default_path' => '', // Default absolute path to pre-packaged plugins
		'menu'         => 'install-required-plugins', // Menu slug
		'has_notices'  => true, // Show admin notices or not
		'is_automatic' => false, // Automatically activate plugins after installation or not
		'message'      => '', // Message to output right before the plugins table
		'strings' => [
			'page_title'                      => esc_html__( 'Install Required Plugins', '__theme_txtd' ),
			'menu_title'                      => esc_html__( 'Install Plugins', '__theme_txtd' ),
			'installing'                      => esc_html__( 'Installing Plugin: %s', '__theme_txtd' ),
			// %1$s = plugin name
			'oops'                            => esc_html__( 'Something went wrong with the plugin API.', '__theme_txtd' ),
			/* translators: %1$s = plugin name */
			'notice_can_install_required'     => _n_noop( 'Anima requires the following plugin: %1$s.', 'Anima requires the following plugins: %1$s.', '__theme_txtd' ),
			/* translators: %1$s = plugin name */
			'notice_can_install_recommended'  => _n_noop( 'Anima recommends the following plugin: %1$s.', 'Anima recommends the following plugins: %1$s.', '__theme_txtd' ),
			// %1$s = plugin name(s)
			'notice_cannot_install'           => _n_noop( 'Sorry, but you do not have the correct permissions to install the %s plugin. Contact the administrator of this site for help on getting the plugin installed.', 'Sorry, but you do not have the correct permissions to install the %s plugins. Contact the administrator of this site for help on getting the plugins installed.', '__theme_txtd' ),
			// %1$s = plugin name(s)
			'notice_can_activate_required'    => _n_noop( 'The following required plugin is currently inactive: %1$s.', 'The following required plugins are currently inactive: %1$s.', '__theme_txtd' ),
			// %1$s = plugin name(s)
			'notice_can_activate_recommended' => _n_noop( 'The following recommended plugin is currently inactive: %1$s.', 'The following recommended plugins are currently inactive: %1$s.', '__theme_txtd' ),
			// %1$s = plugin name(s)
			'notice_cannot_activate'          => _n_noop( 'Sorry, but you do not have the correct permissions to activate the %s plugin. Contact the administrator of this site for help on getting the plugin activated.', 'Sorry, but you do not have the correct permissions to activate the %s plugins. Contact the administrator of this site for help on getting the plugins activated.', '__theme_txtd' ),
			// %1$s = plugin name(s)
			'notice_ask_to_update'            => _n_noop(
				'⚠️ The following plugin needs to be updated to its latest version to ensure maximum compatibility with Anima: %1$s.',
				'⚠️ The following plugins need to be updated to their latest version to ensure maximum compatibility with Anima: %1$s.', '
				__theme_txtd' ),
			// %1$s = plugin name(s)
			'notice_cannot_update'            => _n_noop( 'Sorry, but you do not have the correct permissions to update the %s plugin. Contact the administrator of this site for help on getting the plugin updated.', 'Sorry, but you do not have the correct permissions to update the %s plugins. Contact the administrator of this site for help on getting the plugins updated.', '__theme_txtd' ),
			// %1$s = plugin name(s)
			'install_link'                    => _n_noop( 'Begin installing plugin', 'Begin installing plugins', '__theme_txtd' ),
			'activate_link'                   => _n_noop( 'Activate installed plugin', 'Activate installed plugins', '__theme_txtd' ),
			'return'                          => esc_html__( 'Return to Required Plugins Installer', '__theme_txtd' ),
			'plugin_activated'                => esc_html__( 'Plugin activated successfully.', '__theme_txtd' ),
			'complete'                        => esc_html__( 'All plugins installed and activated successfully. %s', '__theme_txtd' )
			// %1$s = dashboard link
		],
	];

	tgmpa( $plugins, $config );
}
add_action( 'tgmpa_register', 'anima_register_required_plugins', 995 );

function anima_prevent_tgmpa_notices( $notices, $total_required_action_count ) {
	// We want to do this only when Pixelgrade Care is not active.
	if ( function_exists( 'PixelgradeCare') ) {
		return $notices;
	}

	// If the user has dismissed the notification, oblige.
	if ( get_user_meta( get_current_user_id(), 'tgmpa_dismissed_notice_' . TGM_Plugin_Activation::get_instance()->id, true ) ) { // WPCS: CSRF ok.
		return [];
	}

	return $notices;
}
add_filter( 'tgmpa_admin_notices', 'anima_prevent_tgmpa_notices', 10, 2 );
