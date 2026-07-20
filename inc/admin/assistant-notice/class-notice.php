<?php
/**
 * Pixelgrade Assistant install/activate notice class.
 *
 * Recommends the free, WordPress.org-hosted Pixelgrade Assistant plugin after
 * theme activation. The notice is dismissible and never redirects on its own;
 * the actual plugin install/activate is driven entirely by WordPress core
 * (`wp.updates`), so the same notice works in both the commercial and the
 * WordPress.org build.
 *
 * @version 2.0.0
 *
 * @package Anima
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Pixelgrade_Assistant_Install_Notice {

	/**
	 * The WordPress.org slug of the recommended plugin.
	 *
	 * @var string
	 */
	const PLUGIN_SLUG = 'pixelgrade-assistant';

	/**
	 * The plugin main file, relative to the plugins directory.
	 *
	 * @var string
	 */
	const PLUGIN_FILE = 'pixelgrade-assistant/pixelgrade-assistant.php';

	/**
	 * The only instance.
	 *
	 * @var     Pixelgrade_Assistant_Install_Notice
	 * @access  protected
	 */
	protected static $_instance = null;

	public function __construct() {
		$this->addHooks();
	}

	public function addHooks() {

		if ( $this->shouldShow() ) {
			add_action( 'admin_notices', [ $this, 'outputMarkup' ] );
			add_action( 'admin_enqueue_scripts', [ $this, 'outputCSS' ] );
			add_action( 'admin_enqueue_scripts', [ $this, 'outputJS' ] );
		}

		add_action( 'wp_ajax_pixassist_install_dismiss_admin_notice', [ $this, 'dismiss_notice' ] );
		add_action( 'switch_theme', [ $this, 'cleanup' ] );
	}

	public function shouldShow(): bool {
		global $pagenow;

		// If Pixelgrade Assistant is already installed and activated, nothing to do.
		if ( $this->is_plugin_active() ) {
			return false;
		}

		// We want to show it only on the themes.php page and in the dashboard.
		if ( $pagenow !== 'themes.php' && $pagenow !== 'index.php' ) {
			return false;
		}

		$dismissed = get_theme_mod( 'pixassist_install_notice_dismissed', false );
		// Earlier than 7 days, we will not show again.
		if ( ! empty( $dismissed ) && ( time() - absint( $dismissed ) < DAY_IN_SECONDS * 7 ) ) {
			return false;
		}

		// Only users who can install/activate plugins should see the call to action.
		if ( current_user_can( 'install_plugins' ) || current_user_can( 'activate_plugins' ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Whether the Pixelgrade Assistant plugin is active.
	 */
	protected function is_plugin_active(): bool {
		return class_exists( 'PixelgradeAssistant' ) || function_exists( 'PixelgradeAssistant' );
	}

	/**
	 * Whether the Pixelgrade Assistant plugin is installed (regardless of active state).
	 */
	protected function is_plugin_installed(): bool {
		return file_exists( WP_PLUGIN_DIR . '/' . self::PLUGIN_FILE );
	}

	/**
	 * Determine the current plugin status: 'missing', 'installed' or 'active'.
	 */
	protected function get_plugin_status(): string {
		if ( $this->is_plugin_active() ) {
			return 'active';
		}

		if ( $this->is_plugin_installed() ) {
			return 'installed';
		}

		return 'missing';
	}

	public function outputMarkup() {
		$status = $this->get_plugin_status();

		$button_text = __( 'Install the Pixelgrade Assistant plugin', '__theme_txtd' );
		if ( $status === 'installed' ) {
			$button_text = __( 'Activate the Pixelgrade Assistant plugin', '__theme_txtd' );
		} elseif ( $status === 'active' ) {
			$button_text = __( 'Start the Pixelgrade Assistant setup', '__theme_txtd' );
		}

		?>
		<div class="pixassist-notice__container notice is-dismissible" >

			<ul class="pxg-wizard">
				<li class="pxg-wizard__step pxg-wizard__step--done">
					<span class="pxg-wizard__label"><?php esc_html_e( 'Theme', '__theme_txtd' ); ?></span>
					<span class="pxg-wizard__progress"><b></b></span>
				</li>
				<li class="pxg-wizard__step pxg-wizard__step--current">
					<span class="pxg-wizard__label"><?php esc_html_e( 'Pixelgrade Assistant', '__theme_txtd' ); ?></span>
					<span class="pxg-wizard__progress"><b></b></span>
				</li>
				<li class="pxg-wizard__step">
					<span class="pxg-wizard__label"><?php esc_html_e( 'Site setup', '__theme_txtd' ); ?></span>
					<span class="pxg-wizard__progress"><b></b></span>
				</li>
				<li class="pxg-wizard__step">
					<span class="pxg-wizard__label"><?php esc_html_e( 'Ready!', '__theme_txtd' ); ?></span>
					<span class="pxg-wizard__progress"><b></b></span>
				</li>
			</ul>
			<form class="pixassist-notice-form"
			      action="<?php echo esc_url( admin_url( 'admin-ajax.php?action=pixassist_install_dismiss_admin_notice' ) ); ?>"
			      method="post">
				<noscript><input type="hidden" name="pixassist-notice-no-js" value="1"/></noscript>

				<div class="pixassist-notice__wrap">
					<div class="pixassist-notice__media">
                        <div class="pixassist-notice__screenshot">
                            <?php
                            $theme = wp_get_theme();
                            $parent = $theme->parent();
                            if ( $parent ) {
                                $theme = $parent;
                            }
                            $screenshot = $theme->get_screenshot();
                            if ( $screenshot ) { ?>
                                <img src="<?php echo esc_url( $screenshot ); ?>" alt="Theme screenshot">
                            <?php } ?>
                        </div>
					</div>
					<div class="pixassist-notice__body">
						<h1><?php
							/* translators: %s: the theme name. */
							echo wp_kses( sprintf( __( 'Thanks for installing %s, you\'re awesome!<br>Let\'s make an experience out of it.', '__theme_txtd' ),  $theme->get( 'Name' ) ), wp_kses_allowed_html('post') ); ?></h1>
						<p><?php echo wp_kses( __('We\'ve prepared a special onboarding setup that helps you get started and configure your upcoming website in style. Let\'s make it shine!', '__theme_txtd' ), wp_kses_allowed_html('post') ); ?></p>
						<ul>
							<li>
								<i></i><span><?php echo wp_kses( __('<strong>Recommended plugins</strong> to boost your site.', '__theme_txtd' ), wp_kses_allowed_html() ); ?></span>
							</li>
							<li>
								<i></i><span><?php echo wp_kses( __('<strong>Starter Content</strong> to make your site look like the demo.', '__theme_txtd' ), wp_kses_allowed_html() ); ?></span>
							</li>
							<li>
								<i></i><span><?php echo wp_kses( __('<strong>Premium Support</strong> to assist you all the way.', '__theme_txtd' ), wp_kses_allowed_html() ); ?></span>
							</li>
						</ul>
						<div class="message js-plugin-message"></div>
						<button type="button" class="pixassist-notice-button js-handle-pixassist">
                            <span class="pixassist-notice-button__text"><?php echo esc_html( $button_text ); ?></span>
                            <span class="pixassist-notice-button__overlay">
                                <span class="pixassist-notice-button__text"><?php echo esc_html( $button_text); ?></span>
                            </span>
                        </button>

						<noscript>
							<button type="submit" class="notice-dismiss"><span class="screen-reader-text"><?php esc_html_e( 'Dismiss this notice.', '__theme_txtd' ); ?></span></button>
						</noscript>
					</div>
				</div>
				<?php wp_nonce_field( 'pixassist_install_dismiss_admin_notice', 'nonce-pixassist_install-dismiss' ); ?>
			</form>
		</div>
	<?php
	}

	public function outputCSS() {
		wp_register_style( 'pixassist_notice_css', $this->get_parent_theme_file_uri( $this->get_theme_relative_path( __DIR__ ) . 'notice.css' ), false );
		wp_enqueue_style( 'pixassist_notice_css' );
	}

	public function outputJS() {
		$activate_url = wp_nonce_url(
			self_admin_url( 'plugins.php?action=activate&plugin=' . urlencode( self::PLUGIN_FILE ) ),
			'activate-plugin_' . self::PLUGIN_FILE
		);

		// The WordPress core plugin install/activate machinery. `updates` brings
		// wp.updates.installPlugin()/activatePlugin(); `plugin-install` provides
		// the install thickbox helpers and shared nonces. Both are GPL core
		// scripts, so the same flow works in the bare WordPress.org build too.
		wp_enqueue_script( 'updates' );
		wp_enqueue_script( 'plugin-install' );

		wp_register_script(
			'pixassist_notice_js',
			$this->get_parent_theme_file_uri( $this->get_theme_relative_path( __DIR__ ) . 'notice.js' ),
			[ 'jquery', 'wp-util', 'wp-a11y', 'updates', 'plugin-install' ],
			null,
			true
		);
		wp_enqueue_script( 'pixassist_notice_js' );

		wp_localize_script( 'pixassist_notice_js', 'pixassistNotice', [
			'slug'   => self::PLUGIN_SLUG,
			'plugin' => self::PLUGIN_FILE,
			'activateUrl' => esc_url_raw( $activate_url ),
			// Core's activate-plugin AJAX handler requires the plugin display name.
			'name'   => 'Pixelgrade Assistant',
			// Since we are displaying a notice with the details, we want to skip the welcome screen of the wizard.
			'setupUrl' => esc_url( admin_url( 'themes.php?page=pixelgrade_assistant-setup-wizard&skip-welcome=true' ) ),
			'status' => $this->get_plugin_status(),
			'i18n' => [
				'btnInstall'            => esc_html__( 'Install the Pixelgrade Assistant plugin', '__theme_txtd' ),
				'btnInstalling'         => esc_html__( 'Installing Pixelgrade Assistant...', '__theme_txtd' ),
				'btnActivate'           => esc_html__( 'Activate the Pixelgrade Assistant plugin', '__theme_txtd' ),
				'btnActivating'         => esc_html__( 'Activating Pixelgrade Assistant...', '__theme_txtd' ),
				'btnOpenSetup'          => esc_html__( 'Start the Pixelgrade Assistant setup', '__theme_txtd' ),
				'btnOpeningSetup'       => esc_html__( 'Opening the Pixelgrade Assistant setup...', '__theme_txtd' ),
				'btnError'              => esc_html__( 'Please refresh the page 🙏 and try again...', '__theme_txtd' ),
				'installedSuccessfully' => esc_html__( 'Plugin installed successfully.', '__theme_txtd' ),
				'activatedSuccessfully' => esc_html__( 'Plugin activated successfully.', '__theme_txtd' ),
				'redirectingToSetup'    => esc_html__( 'Opening the Pixelgrade Assistant setup in a couple of seconds.', '__theme_txtd' ),
				'error'                 => esc_html__( 'We are truly sorry 😢 Something went wrong and we couldn\'t make sense of it and continue with the plugin setup.', '__theme_txtd' ),
			],
		] );
	}

	/**
	 * Process ajax call to dismiss notice.
	 */
	public function dismiss_notice() {
		// Check nonce.
		check_ajax_referer( 'pixassist_install_dismiss_admin_notice', 'nonce_dismiss' );

		// Only allow users who would actually see the notice to dismiss it.
		if ( ! current_user_can( 'install_plugins' ) && ! current_user_can( 'activate_plugins' ) ) {
			wp_die( -1, 403 );
		}

		// Remember the dismissal (time).
		set_theme_mod( 'pixassist_install_notice_dismissed', time() );

		// Redirect if this is not an ajax request.
		if ( isset( $_POST['pixassist-notice-no-js'] ) ) {

			// Go back to where we came from.
			wp_safe_redirect( wp_get_referer() );
			exit();
		}

		wp_die();
	}

	public function cleanup() {
		// If the theme is about to be deactivated, we want to clear the notice dismissal so next time it is active, it will show.
		set_theme_mod( 'pixassist_install_notice_dismissed', false );
	}

	/**
	 * Get the relative theme path of a given absolute path. In case the given path is not absolute, it is returned as received.
	 *
	 * @param $path string An absolute path.
	 *
	 * @return string A path relative to the current theme directory, without ./ in front.
	 */
	protected function get_theme_relative_path( string $path ): string {
		if ( empty( $path ) ) {
			return '';
		}

		$path = wp_normalize_path( $path );

		$path = str_replace( trailingslashit( get_template_directory() ), '', $path );

		return trailingslashit( $path );
	}

	/**
	 * Retrieves the URL of a file in the parent theme.
	 *
	 * It will use the new function in WP 4.7, but will fallback to the old way of doing things otherwise.
	 *
	 * @param string $file Optional. File to return the URL for in the template directory.
	 *
	 * @return string The URL of the file.
	 */
	protected function get_parent_theme_file_uri( string $file = '' ): string {
		if ( function_exists( 'get_parent_theme_file_uri' ) ) {
			return get_parent_theme_file_uri( $file );
		} else {
			$file = ltrim( $file, '/' );

			if ( empty( $file ) ) {
				$url = get_template_directory_uri();
			} else {
				$url = get_template_directory_uri() . '/' . $file;
			}

			/**
			 * Filters the URL to a file in the parent theme.
			 *
			 * @since 4.7.0
			 *
			 * @param string $url The file URL.
			 * @param string $file The requested file to search for.
			 */
			return apply_filters( 'parent_theme_file_uri', $url, $file );
		}
	}

	public static function init(): ?Pixelgrade_Assistant_Install_Notice {
		return self::instance();
	}

	/**
	 * Main Pixelgrade_Assistant_Install_Notice Instance
	 *
	 * Ensures only one instance of Pixelgrade_Assistant_Install_Notice is loaded or can be loaded.
	 *
	 * @static
	 *
	 * @return Pixelgrade_Assistant_Install_Notice Main Pixelgrade_Assistant_Install_Notice instance
	 */
	public static function instance(): ?Pixelgrade_Assistant_Install_Notice {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	/**
	 * Cloning is forbidden.
	 */
	public function __clone() {
		_doing_it_wrong( __FUNCTION__, esc_html( __( 'Cheatin&#8217; huh?', '__theme_txtd' ) ), null );
	}

	/**
	 * Unserializing instances of this class is forbidden.
	 */
	public function __wakeup() {
		_doing_it_wrong( __FUNCTION__, esc_html( __( 'Cheatin&#8217; huh?', '__theme_txtd' ) ), null );
	}
}
