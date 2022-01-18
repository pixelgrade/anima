<?php
/**
 * Plugin installation and activation for WordPress themes.
 *
 * Please note that this is a drop-in library for a theme or plugin.
 * The authors of this library (Thomas, Gary and Juliette) are NOT responsible
 * for the support of your plugin or theme. Please contact the plugin
 * or theme author for support.
 *
 * @since 1.13.0
 *
 * @package Anima
 * @author  Pixelgrade <help@pixelgrade.com>
 */

// Make sure the base TGMPA logic is loaded.
require_once 'class-tgm-plugin-activation.php';

if ( ! class_exists( 'PXG_Plugin_Activation' ) ) {

	/**
	 * Automatic plugin installation and activation library.
	 *
	 * Creates a way to automatically install and activate plugins from within themes.
	 * The plugins can be either bundled, downloaded from the WordPress
	 * Plugin Repository or downloaded from another external source.
	 *
	 * @since 1.13.0
	 *
	 * @package Anima
	 * @author  Pixelgrade <help@pixelgrade.com>
	 */
	class PXG_Plugin_Activation extends TGM_Plugin_Activation {
		/**
		 * TGMPA version number.
		 *
		 * @since 1.13.0
		 *
		 * @const string Version number.
		 */
		const TGMPA_VERSION = '2.6.8'; // Version bump by Pixelgrade!!!

		/**
		 * Holds a copy of itself, so it can be referenced by the class name.
		 *
		 * @since 1.13.0
		 *
		 * @var PXG_Plugin_Activation
		 */
		public static $instance;

		/**
		 * Initialise the interactions between this class and WordPress.
		 *
		 * Hooks in three new methods for the class: admin_menu, notices and styles.
		 *
		 * @since 1.13.0
		 *
		 * @see TGM_Plugin_Activation::admin_menu()
		 * @see TGM_Plugin_Activation::notices()
		 * @see TGM_Plugin_Activation::styles()
		 */
		public function init() {
			/**
			 * By default TGMPA only loads on the WP back-end and not in an Ajax call. Using this filter
			 * you can overrule that behaviour.
			 *
			 * @since 1.13.0
			 *
			 * @param bool $load Whether or not TGMPA should load.
			 *                   Defaults to the return of `is_admin() && ! defined( 'DOING_AJAX' )`.
			 */
			if ( true !== apply_filters( 'tgmpa_load', ( is_admin() && ! defined( 'DOING_AJAX' ) ) ) ) {
				return;
			}

			// Load class strings.
			$this->strings = [
				'page_title'                      => esc_html__( 'Install Required Plugins', '__plugin_txtd' ),
				'menu_title'                      => esc_html__( 'Install Plugins', '__plugin_txtd' ),
				/* translators: %s: plugin name. */
				'installing'                      => esc_html__( 'Installing Plugin: %s', '__plugin_txtd' ),
				/* translators: %s: plugin name. */
				'updating'                        => esc_html__( 'Updating Plugin: %s', '__plugin_txtd' ),
				'oops'                            => esc_html__( 'Something went wrong with the plugin API.', '__plugin_txtd' ),
				'notice_can_install_required'     => _n_noop(
				/* translators: 1: plugin name(s). */
					'This theme requires the following plugin: %1$s.',
					'This theme requires the following plugins: %1$s.',
					'__plugin_txtd'
				),
				'notice_can_install_recommended'  => _n_noop(
				/* translators: 1: plugin name(s). */
					'This theme recommends the following plugin: %1$s.',
					'This theme recommends the following plugins: %1$s.',
					'__plugin_txtd'
				),
				'notice_ask_to_update'            => _n_noop(
				/* translators: 1: plugin name(s). */
					'⚠️ The following plugin needs to be updated to its latest version to ensure maximum compatibility with your theme: %1$s.',
					'⚠️ The following plugins need to be updated to their latest version to ensure maximum compatibility with your theme: %1$s.',
					'__plugin_txtd'
				),
				'notice_ask_to_update_maybe'      => _n_noop(
				/* translators: 1: plugin name(s). */
					'There is an update available for: %1$s.',
					'There are updates available for the following plugins: %1$s.',
					'__plugin_txtd'
				),
				'notice_can_activate_required'    => _n_noop(
				/* translators: 1: plugin name(s). */
					'The following required plugin is currently inactive: %1$s.',
					'The following required plugins are currently inactive: %1$s.',
					'__plugin_txtd'
				),
				'notice_can_activate_recommended' => _n_noop(
				/* translators: 1: plugin name(s). */
					'The following recommended plugin is currently inactive: %1$s.',
					'The following recommended plugins are currently inactive: %1$s.',
					'__plugin_txtd'
				),
				'install_link'                    => _n_noop(
					'Begin installing plugin',
					'Begin installing plugins',
					'__plugin_txtd'
				),
				'update_link'                     => _n_noop(
					'Begin updating plugin',
					'Begin updating plugins',
					'__plugin_txtd'
				),
				'activate_link'                   => _n_noop(
					'Begin activating plugin',
					'Begin activating plugins',
					'__plugin_txtd'
				),
				'return'                          => esc_html__( 'Return to Required Plugins Installer', '__plugin_txtd' ),
				'dashboard'                       => esc_html__( 'Return to the Dashboard', '__plugin_txtd' ),
				'plugin_activated'                => esc_html__( 'Plugin activated successfully.', '__plugin_txtd' ),
				'activated_successfully'          => esc_html__( 'The following plugin was activated successfully:', '__plugin_txtd' ),
				'plugin_already_active'           => esc_html__( 'No action taken. Plugin was already active.', '__plugin_txtd' ),
				/* translators: 1: plugin name. */
				'plugin_needs_higher_version'     => esc_html__( 'Plugin not activated. A higher version of %s is needed for this theme. Please update the plugin.', '__plugin_txtd' ),
				/* translators: 1: dashboard link. */
				'complete'                        => esc_html__( 'All plugins installed and activated successfully. %1$s', '__plugin_txtd' ),
				'dismiss'                         => esc_html__( 'Dismiss this notice', '__plugin_txtd' ),
				'notice_cannot_install_activate'  => esc_html__( 'There are one or more required or recommended plugins to install, update or activate.', '__plugin_txtd' ),
				'contact_admin'                   => esc_html__( 'Please contact the administrator of this site for help.', '__plugin_txtd' ),
			];

			do_action( 'tgmpa_register' );

			/* After this point, the plugins should be registered and the configuration set. */

			// Proceed only if we have plugins to handle.
			if ( empty( $this->plugins ) || ! is_array( $this->plugins ) ) {
				return;
			}

			// Set up the menu and notices if we still have outstanding actions.
			if ( true !== $this->is_tgmpa_complete() ) {
				// Sort the plugins.
				array_multisort( $this->sort_order, SORT_ASC, $this->plugins );

				add_action( 'admin_menu', [ $this, 'admin_menu' ] );
				add_action( 'admin_head', [ $this, 'dismiss' ] );

				// Prevent the normal links from showing underneath a single install/update page.
				add_filter( 'install_plugin_complete_actions', [ $this, 'actions' ] );
				add_filter( 'update_plugin_complete_actions', [ $this, 'actions' ] );

				if ( $this->has_notices ) {
					add_action( 'admin_notices', [ $this, 'notices' ] );
					add_action( 'admin_init', [ $this, 'admin_init' ], 1 );
					add_action( 'admin_enqueue_scripts', [ $this, 'thickbox' ] );
				}
			}

			// If needed, filter plugin action links.
			add_action( 'load-plugins.php', [ $this, 'add_plugin_action_link_filters' ], 1 );

			// Make sure things get reset on switch theme.
			add_action( 'switch_theme', [ $this, 'flush_plugins_cache' ] );

			if ( $this->has_notices ) {
				add_action( 'switch_theme', [ $this, 'update_dismiss' ] );
			}

			// Setup the force activation hook.
			if ( true === $this->has_forced_activation ) {
				add_action( 'admin_init', [ $this, 'force_activation' ] );
			}

			// Setup the force deactivation hook.
			if ( true === $this->has_forced_deactivation ) {
				add_action( 'switch_theme', [ $this, 'force_deactivation' ] );
			}

			// Add CSS for the TGMPA admin page.
			if ( method_exists( $this, 'admin_css' ) ) {
				add_action( 'admin_head', [ $this, 'admin_css' ] );
			}
		}

		/**
		 * Add the menu item.
		 *
		 * {@internal IMPORTANT! If this function changes, review the regex in the custom TGMPA
		 * generator on the website.}}
		 *
		 * @since 1.13.0
		 *
		 * @param array $args Menu item configuration.
		 */
		protected function add_admin_menu( array $args ) {
			if ( has_filter( 'tgmpa_admin_menu_use_add_theme_page' ) ) {
				_deprecated_function( 'The "tgmpa_admin_menu_use_add_theme_page" filter', '2.5.0', esc_html__( 'Set the parent_slug config variable instead.', '__plugin_txtd' ) );
			}

			$this->page_hook = add_theme_page( $args['page_title'], $args['menu_title'], $args['capability'], $args['menu_slug'], $args['function'] );
		}

		/**
		 * Echoes required plugin notice.
		 *
		 * Outputs a message telling users that a specific plugin is required for
		 * their theme. If appropriate, it includes a link to the form page where
		 * users can install and activate the plugin.
		 *
		 * Returns early if we're on the Install page.
		 *
		 * @since 1.13.0
		 *
		 * @global object $current_screen
		 *
		 * @return null Returns early if we're on the Install page.
		 */
		public function notices() {
			// Pixelgrade addition and modification!!!
			// Allow others to override the default behavior:
			// Remove nag on the install page / Return early if the nag message has been dismissed or user < author.
			// But, since there are situations when we want to show the notice regardless if the user has dismissed the notice, we need handle the dismissal via filters.
			if ( apply_filters( 'tgmpa_prevent_admin_notices', ( ( $this->is_tgmpa_page() || $this->is_core_update_page() ) || ! current_user_can( apply_filters( 'tgmpa_show_admin_notice_capability', 'publish_posts' ) ) ) ) ) {
				return;
			}

			// Store for the plugin slugs by message type.
			$message = [];

			// Initialize counters used to determine plurality of action link texts.
			$install_link_count          = 0;
			$update_link_count           = 0;
			$activate_link_count         = 0;
			$total_required_action_count = 0;

			foreach ( $this->plugins as $slug => $plugin ) {
				if ( $this->is_plugin_active( $slug ) && false === $this->does_plugin_have_update( $slug ) ) {
					continue;
				}

				if ( ! $this->is_plugin_installed( $slug ) ) {
					if ( current_user_can( 'install_plugins' ) ) {
						$install_link_count++;

						if ( true === $plugin['required'] ) {
							$message['notice_can_install_required'][] = $slug;
						} else {
							$message['notice_can_install_recommended'][] = $slug;
						}
					}
					if ( true === $plugin['required'] ) {
						$total_required_action_count++;
					}
				} else {
					if ( ! $this->is_plugin_active( $slug ) && $this->can_plugin_activate( $slug ) ) {
						if ( current_user_can( 'activate_plugins' ) ) {
							$activate_link_count++;

							if ( true === $plugin['required'] ) {
								$message['notice_can_activate_required'][] = $slug;
							} else {
								$message['notice_can_activate_recommended'][] = $slug;
							}
						}
						if ( true === $plugin['required'] ) {
							$total_required_action_count++;
						}
					}

					if ( $this->does_plugin_require_update( $slug ) || false !== $this->does_plugin_have_update( $slug ) ) {

						if ( current_user_can( 'update_plugins' ) ) {
							$update_link_count++;

							if ( $this->does_plugin_require_update( $slug ) ) {
								$message['notice_ask_to_update'][] = $slug;
							} elseif ( false !== $this->does_plugin_have_update( $slug ) ) {
								$message['notice_ask_to_update_maybe'][] = $slug;
							}
						}
						if ( true === $plugin['required'] ) {
							$total_required_action_count++;
						}
					}
				}
			}
			unset( $slug, $plugin );

			// Pixelgrade addition!!!
			// Allow others to filter notices.
			$message = apply_filters( 'tgmpa_admin_notices', $message, $total_required_action_count, $install_link_count, $activate_link_count, $update_link_count, $this );
			// Pixelgrade addition!!!
			// Allow others to filter notices total required action count.
			$total_required_action_count = apply_filters( 'tgmpa_admin_notices_total_required_action_count', $total_required_action_count, $this );

			// If we have notices to display, we move forward.
			if ( ! empty( $message ) || $total_required_action_count > 0 ) {
				krsort( $message ); // Sort messages.
				$rendered = '';

				// As add_settings_error() wraps the final message in a <p> and as the final message can't be
				// filtered, using <p>'s in our html would render invalid html output.
				$line_template = '<span style="display: block; margin: 0.5em 0.5em 0 0; clear: both;">%s</span>' . "\n";

				if ( ! current_user_can( 'activate_plugins' ) && ! current_user_can( 'install_plugins' ) && ! current_user_can( 'update_plugins' ) ) {
					$rendered  = esc_html( $this->strings['notice_cannot_install_activate'] ) . ' ' . esc_html( $this->strings['contact_admin'] );
					$rendered .= $this->create_user_action_links_for_notice( 0, 0, 0, $line_template );
				} else {

					// If dismissible is false and a message is set, output it now.
					if ( ! $this->dismissable && ! empty( $this->dismiss_msg ) ) {
						$rendered .= sprintf( $line_template, wp_kses_post( $this->dismiss_msg ) );
					}

					// Render the individual message lines for the notice.
					foreach ( $message as $type => $plugin_group ) {
						$linked_plugins = [];

						// Get the external info link for a plugin if one is available.
						foreach ( $plugin_group as $plugin_slug ) {
							$linked_plugins[] = $this->get_info_link( $plugin_slug );
						}
						unset( $plugin_slug );

						$count          = count( $plugin_group );
						$linked_plugins = array_map( [ 'TGMPA_Utils', 'wrap_in_em' ], $linked_plugins );
						$last_plugin    = array_pop( $linked_plugins ); // Pop off last name to prep for readability.
						$imploded       = empty( $linked_plugins ) ? $last_plugin : ( implode( ', ', $linked_plugins ) . ' ' . esc_html_x( 'and', 'plugin A *and* plugin B', '__plugin_txtd' ) . ' ' . $last_plugin );

						$rendered .= sprintf(
							$line_template,
							sprintf(
								translate_nooped_plural( $this->strings[ $type ], $count, '__plugin_txtd' ),
								$imploded,
								$count
							)
						);

					}
					unset( $type, $plugin_group, $linked_plugins, $count, $last_plugin, $imploded );

					$rendered .= $this->create_user_action_links_for_notice( $install_link_count, $update_link_count, $activate_link_count, $line_template );
				}

				// Register the nag messages and prepare them to be processed.
				add_settings_error( 'tgmpa', 'tgmpa', $rendered, $this->get_admin_notice_class() );
			}

			// Admin options pages already output settings_errors, so this is to avoid duplication.
			if ( 'options-general' !== $GLOBALS['current_screen']->parent_base ) {
				$this->display_settings_errors();
			}

			return;
		}

		/**
		 * Remove individual plugin from our collection of plugins.
		 *
		 * Pixelgrade addition!!!
		 *
		 * @since 1.13.0
		 *
		 * @param string $plugin_slug
		 */
		public function deregister( $plugin_slug ) {
			if ( empty( $plugin_slug ) || ! is_string( $plugin_slug ) || ! isset( $this->plugins[ $plugin_slug ] ) ) {
				return;
			}

			unset( $this->plugins[ $plugin_slug ] );
			unset( $this->sort_order[ $plugin_slug ] );
		}

		/**
		 * Helper function to extract the file path of the plugin file from the
		 * plugin slug, if the plugin is installed.
		 *
		 * @since 1.13.0
		 *
		 * @param string $slug Plugin slug (typically folder name) as provided by the developer.
		 * @return string Either file path for plugin if installed, or just the plugin slug.
		 */
		protected function _get_plugin_basename_from_slug( $slug ): string {

			$plugin_basename = false;
			$plugins         = $this->get_plugins();
			foreach ( $plugins as $key => $plugin ) {
				if ( preg_match( '|^' . $slug . '/|', $key ) ) {
					$new_plugin_basename = $key;
				} else

					// This is a Pixelgrade addition!!!
					// We want to be a little lenient and discover installed (but not activated) plugins
					// that may have their directory changed, but that still have their main PHP file with the same name as the plugin slug.
					// This is pretty safe.
					if ( false !== strpos( $key, '/' . $slug . '.php' ) ) {
						$new_plugin_basename = $key;
					}

				if ( ! isset( $new_plugin_basename ) ) {
					continue;
				}

				if ( false === $plugin_basename ) {
					$plugin_basename = $new_plugin_basename;
					continue;
				}

				// Since we may have multiple plugin versions installed, but only one active,
				// we need to make sure that we end up with the details of the right one:
				// - firstly, the one active, if that is the case
				// - secondly, the one with the latest version.
				$overwrite = false;
				if ( is_plugin_active( $new_plugin_basename ) ) {
					return $new_plugin_basename;
				} else if ( version_compare( $plugins[ $plugin_basename ]['Version'], $plugin['Version'], '<' ) ) {
					$overwrite = true;
				}

				if ( true === $overwrite ) {
					$plugin_basename = $new_plugin_basename;
				}
			}

			return $plugin_basename;
		}

		/**
		 * Returns the singleton instance of the class.
		 *
		 * @since 1.13.0
		 *
		 * @return \PXG_Plugin_Activation The PXG_Plugin_Activation object.
		 */
		public static function get_instance() {
			if ( ! isset( self::$instance ) && ! ( self::$instance instanceof self ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}
	}

	if ( ! function_exists( 'load_pxg_plugin_activation' ) ) {
		/**
		 * Ensure only one instance of the class is ever invoked.
		 *
		 * Also make sure that PXG_Plugin_Activation instances are used over the default TGM_Plugin_Activation instances
		 * that may be instantiated by earlier loading of the TGMPA logic.
		 * This is safe to do since PXG_Plugin_Activation extends the functionality and is backwards compatible.
		 *
		 * @since 1.13.0
		 */
		function load_pxg_plugin_activation() {
			// If we already have a TGMPA instance that is not a PXG_Plugin_Activation instance,
			// we need to clean first and then get a proper instance.
			if ( ! empty( $GLOBALS['tgmpa'] ) && ! ( $GLOBALS['tgmpa'] instanceof PXG_Plugin_Activation ) ) {
				remove_action( 'init', [ $GLOBALS['tgmpa'], 'load_textdomain' ], 5 );
				remove_filter( 'load_textdomain_mofile', [ $GLOBALS['tgmpa'], 'overload_textdomain_mofile' ] );
				remove_action( 'init', [ $GLOBALS['tgmpa'], 'init' ] );
			}

			$GLOBALS['tgmpa'] = PXG_Plugin_Activation::get_instance();
		}
	}

	if ( ! function_exists( 'load_tgm_plugin_activation' ) ) {
		/**
		 * Ensure only one instance of the class is ever invoked.
		 *
		 * @since 1.13.0
		 */
		function load_tgm_plugin_activation() {
			load_pxg_plugin_activation();
		}
	}

	if ( did_action( 'plugins_loaded' ) ) {
		load_pxg_plugin_activation();
	} else {
		// Make sure that we don't have previously hooked load_tgm_plugin_activation().
		remove_action( 'plugins_loaded', 'load_tgm_plugin_activation' );
		add_action( 'plugins_loaded', 'load_pxg_plugin_activation' );
	}
}
