<?php
/**
 * Pixelgrade Care install/activate notice class.
 *
 * @package Felt
 */

class PixelgradeCare_Install_Notice {

	/**
	 * The only instance.
	 * @var     PixelgradeCare_Install_Notice
	 * @access  protected
	 */
	protected static $_instance = null;

	public function __construct() {
		$this->addHooks();
	}

	public function addHooks() {

		if ( $this->shouldShow() ) {
			add_action( 'admin_notices', array( $this, 'outputMarkup' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'outputCSS' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'outputJS' ) );
		}

		add_action( 'wp_ajax_pixcare_install_dismiss_admin_notice', array( $this, 'dismiss_notice' ) );
		add_action( 'switch_theme', array( $this, 'cleanup' ) );
	}

	public function shouldShow() {
		global $pagenow;

		// If Pixelgrade Care is already installed and activated, nothing to do.
		if ( class_exists( 'PixelgradeCare' ) ) {
			return false;
		}

		// We want to show it only on the themes.php page and in the dashboard.
		if ( $pagenow !== 'themes.php' && $pagenow !== 'index.php' ) {
			return false;
		}

		// We also don't want to show it when viewing the TGMPA results or tables.
		if ( ! empty( $_GET['tgmpa-nonce'] ) ) {
			return false;
		}

		$dismissed = get_theme_mod( 'pixcare_install_notice_dismissed', false );
		// Earlier than a 7 days, we will not show again.
		if ( ! empty( $dismissed ) && ( time() - absint( $dismissed ) < DAY_IN_SECONDS * 7 ) ) {
			return false;
		}

		if ( current_user_can('manage_options') ) {
			return true;
		}

		return false;
	}

	public function outputMarkup() {
		$button_text = __( 'Install the Pixelgrade Care&reg; plugin', '__theme_txtd' );
		// Pixelgrade Care plugin installed, but not activated.
		if ( ! class_exists( 'PixelgradeCare' ) && file_exists( WP_PLUGIN_DIR . '/pixelgrade-care/pixelgrade-care.php' ) ) {
			$button_text = __( 'Activate the Pixelgrade Care&reg; plugin', '__theme_txtd' );
		}

		?>
		<div class="pixcare-notice__container notice is-dismissible" >

			<ul class="pxg-wizard">
				<li class="pxg-wizard__step pxg-wizard__step--done">
					<span class="pxg-wizard__label"><?php esc_html_e( 'Theme', '__theme_txtd' ); ?></span>
					<span class="pxg-wizard__progress"><b></b></span>
				</li>
				<li class="pxg-wizard__step pxg-wizard__step--current">
					<span class="pxg-wizard__label"><?php esc_html_e( 'Pixelgrade Care&reg;', '__theme_txtd' ); ?></span>
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
			<form class="pixcare-notice-form"
			      action="<?php echo esc_url( admin_url( 'admin-ajax.php?action=pixcare_install_dismiss_admin_notice' ) ); ?>"
			      method="post">
				<noscript><input type="hidden" name="pixcare-notice-no-js" value="1"/></noscript>

				<div class="pixcare-notice__wrap">
					<div class="pixcare-notice__media">
                        <div class="pixcare-notice__screenshot">
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
					<div class="pixcare-notice__body">
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
						<button class="pixcare-notice-button js-handle-pixcare">
                            <span class="pixcare-notice-button__text"><?php echo esc_html( $button_text ); ?></span>
                            <span class="pixcare-notice-button__overlay">
                                <span class="pixcare-notice-button__text"><?php echo esc_html( $button_text); ?></span>
                            </span>
                        </button>

						<noscript>
							<button type="submit" class="notice-dismiss"><span class="screen-reader-text"><?php esc_html_e( 'Dismiss this notice.', '__theme_txtd' ); ?></span></button>
						</noscript>
					</div>
				</div>
				<?php wp_nonce_field( 'pixcare_install_dismiss_admin_notice', 'nonce-pixcare_install-dismiss' ); ?>
			</form>
		</div>
	<?php
	}

	public function outputCSS() {
		wp_register_style( 'pixcare_notice_css', $this->get_parent_theme_file_uri( $this->get_theme_relative_path( __DIR__ ) . 'notice.css' ), false );
		wp_enqueue_style( 'pixcare_notice_css' );
	}

	public function outputJS() {
		wp_register_script( 'pixcare_notice_js', $this->get_parent_theme_file_uri( $this->get_theme_relative_path( __DIR__ ) . 'notice.js' ), array( 'jquery') );
		wp_enqueue_script( 'pixcare_notice_js' );

		$install_url = wp_nonce_url(
			add_query_arg(
				array(
					'plugin'        => urlencode( 'pixelgrade-care' ),
					'tgmpa-install' => 'install-plugin',
				),
				admin_url( 'themes.php?page=install-required-plugins' )
			),
			'tgmpa-install',
			'tgmpa-nonce'
		);
		// &amp; is not something that wp.ajax can actually handle
		$install_url = str_replace( 'amp;', '', $install_url );

		$activate_url = wp_nonce_url(
			add_query_arg(
				array(
					'plugin'        => urlencode( 'pixelgrade-care' ),
					'tgmpa-activate' => 'activate-plugin',
				),
				admin_url( 'themes.php?page=install-required-plugins' )
			),
			'tgmpa-activate',
			'tgmpa-nonce'
		);
		// &amp; is not something that wp.ajax can actually handle
		$activate_url = str_replace( 'amp;', '', $activate_url );

		$plugin_status = 'missing';
		// Pixelgrade Care plugin installed, but not activated.
		if ( class_exists( 'PixelgradeCare' ) ) {
			$plugin_status = 'active';
		} elseif ( file_exists( WP_PLUGIN_DIR . '/pixelgrade-care/pixelgrade-care.php' ) ) {
			$plugin_status = 'installed';
		}

		wp_localize_script( 'pixcare_notice_js', 'pixcareNotice', array(
			'ajaxurl' => esc_url( admin_url( 'admin-ajax.php' ) ),
			'installUrl' => esc_url_raw( $install_url ),
			'activateUrl' => esc_url_raw( $activate_url ),
			'themesPluginsUrl' => esc_url( admin_url( 'themes.php?page=install-required-plugins' ) ),
			'pixcareSetupUrl' => esc_url( admin_url( 'index.php?page=pixelgrade_care-setup-wizard' ) ),
			'status' => $plugin_status,
			'i18n' => array(
				'btnInstall' => esc_html__( 'Install the Pixelgrade Care&reg; plugin', '__theme_txtd' ),
				'btnInstalling' => esc_html__( 'Installing Pixelgrade Care&reg;...', '__theme_txtd' ),
				'btnActivate' => esc_html__( 'Activate the Pixelgrade Care&reg; plugin', '__theme_txtd' ),
				'btnActivating' => esc_html__( 'Activating Pixelgrade Care&reg;...', '__theme_txtd' ),
				'btnRedirectingToSetup' => esc_html__( 'Opening the Pixelgrade Care&reg; setup...', '__theme_txtd' ),
				'btnError' => esc_html__( 'Please refresh the page 🙏 and try again...', '__theme_txtd' ),
				'installedSuccessfully' => esc_html__( 'Plugin installed successfully.', '__theme_txtd' ),
				'activatedSuccessfully' => esc_html__( 'Plugin activated successfully.', '__theme_txtd' ),
				'redirectingToSetup' => esc_html__( 'Opening the Pixelgrade Care&reg; setup in a couple of seconds.', '__theme_txtd' ),
				'folderAlreadyExists' => esc_html__( 'Plugin destination folder already exists.', '__theme_txtd' ),
				'error' => esc_html__( 'We are truly sorry 😢 Something went wrong and we couldn\'t make sense of it and continue with the plugin setup.', '__theme_txtd' ),
			),
		) );
	}

	/**
	 * Process ajax call to dismiss notice.
	 */
	public function dismiss_notice() {
		// Check nonce.
		check_ajax_referer( 'pixcare_install_dismiss_admin_notice', 'nonce_dismiss' );

		// Remember the dismissal (time).
		set_theme_mod( 'pixcare_install_notice_dismissed', time());

		// Redirect if this is not an ajax request.
		if ( isset( $_POST['pixcare-notice-no-js'] ) ) {

			// Go back to where we came from.
			wp_safe_redirect( wp_get_referer() );
			exit();
		}

		wp_die();
	}

	public function cleanup() {
		// If the theme is about to be deactivated, we want to clear the notice dismissal so next time it is active, it will show.
		set_theme_mod( 'pixcare_install_notice_dismissed', false );
	}

	/**
	 * Get the relative theme path of a given absolute path. In case the given path is not absolute, it is returned as received.
	 *
	 * @param $path string An absolute path.
	 *
	 * @return string A path relative to the current theme directory, without ./ in front.
	 */
	protected function get_theme_relative_path( $path ) {
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
	 * @return string The URL of the file.
	 */
	protected function get_parent_theme_file_uri( $file = '' ) {
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

	public static function init() {
		return self::instance();
	}

	/**
	 * Main PixelgradeCare_Install_Notice Instance
	 *
	 * Ensures only one instance of PixelgradeCare_Install_Notice is loaded or can be loaded.
	 *
	 * @static
	 *
	 * @return PixelgradeCare_Install_Notice Main PixelgradeCare_Install_Notice instance
	 */
	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	} // End instance().

	/**
	 * Cloning is forbidden.
	 */
	public function __clone() {
		_doing_it_wrong( __FUNCTION__, esc_html( __( 'Cheatin&#8217; huh?', '__theme_txtd' ) ), null );
	} // End __clone().

	/**
	 * Unserializing instances of this class is forbidden.
	 */
	public function __wakeup() {
		_doing_it_wrong( __FUNCTION__, esc_html( __( 'Cheatin&#8217; huh?', '__theme_txtd' ) ), null );
	} // End __wakeup().
}
