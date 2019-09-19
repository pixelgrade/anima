<?php
/**
 * Pixelgrade Care Compatibility File.
 *
 * @package Rosa2
 */

/**
 * Handle the specific Pixelgrade Care integration.
 */
function rosa2_setup_pixelgrade_care() {
	/*
	 * Declare support for Pixelgrade Care
	 */
	add_theme_support( 'pixelgrade_care', array(
			'support_url'   => 'https://pixelgrade.com/docs/rosa2/',
			'changelog_url' => 'https://wupdates.com/rosa2-changelog',
		)
	);
}
add_action( 'after_setup_theme', 'rosa2_setup_pixelgrade_care', 10 );

/**
 * After the first theme activation we need to ensure that Pixelgrade Care is installed
 * So we add a transient which will be handled by the `rosa2_admin_redirect_to_pixcare_install_once` action
 */
function rosa2_force_redirect_to_pixcare_install_once() {
	if ( class_exists( 'PixelgradeCare' ) || file_exists( WP_PLUGIN_DIR . '/pixelgrade-care/pixelgrade-care.php' ) ) {
		return;
	}

	$plugin_version = get_option( 'pixelgrade_care_version' );
	if ( empty( $plugin_version ) ) {
		set_transient( '_rosa2_activation_redirect', 1 );
	}
}
add_action( 'after_switch_theme', 'rosa2_force_redirect_to_pixcare_install_once' );

/**
 *  * Redirect the admin to the pixcare install page once only if the plugin is missing
 */
function rosa2_admin_redirect_to_pixcare_install_once() {
	if ( ! get_transient( '_rosa2_activation_redirect' ) ) {
		return;
	}
	delete_transient( '_rosa2_activation_redirect' );

	$url = admin_url( 'themes.php?page=pixelgrade_care-install' );

	wp_safe_redirect( $url );
	exit;
}
add_action( 'admin_init', 'rosa2_admin_redirect_to_pixcare_install_once' );

function rosa2_add_pixcare_install_page() {
	add_theme_page(  '', '', 'manage_options', 'pixelgrade_care-install', null );
}
add_action( 'admin_menu', 'rosa2_add_pixcare_install_page' );

function rosa2_pixcare_install_page() {
	if ( empty( $_GET['page'] ) || 'pixelgrade_care-install' !== $_GET['page'] ) {
		return;
	}

	$nonce_url = wp_nonce_url(
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
	$nonce_url = str_replace( 'amp;', '', $nonce_url );

	wp_enqueue_style( 'galanogrotesquealt', '//pxgcdn.com/fonts/galanogrotesquealt/stylesheet.css' );
	wp_enqueue_style( 'galanoclassic', '//pxgcdn.com/fonts/galanoclassic/stylesheet.css' );

	wp_enqueue_script( 'jquery' );
	wp_enqueue_script( 'wp-util' );
	?><!DOCTYPE html>
	<html <?php language_attributes(); ?>>
	<head>
		<meta name="viewport" content="width=device-width"/>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<script type="text/javascript">
            var ajaxurl = '<?php echo esc_url( admin_url( 'admin-ajax.php', 'relative' ) ); ?>',
                pagenow = 'plugins';
		</script>
		<style>.btn--action,.btn--small,.btn--text,html,p{font-family:"Galano Classic",sans-serif}.btn,button{cursor:pointer}.btn--text,html,p{font-size:13px;line-height:18px}.btn,.section__title{-webkit-font-smoothing:antialiased}.plugins,.section ul{list-style-type:none}html,p{color:#333}.section:after{content:" ";display:table;clear:both}.pixelgrade_care-wrapper{max-width:730px;margin:50px auto}.pixelgrade_care-wrapper,.pixelgrade_care-wrapper *{box-sizing:border-box}.dashboard-tabs>:first-child,.section{background:#fff;border:1px solid #ddd}.setup-wizard-theme-name,.u-text-center{text-align:center}button{border:0;background:0 0;-webkit-appearance:none}.btn{text-decoration:none;transition:background .15s ease-in-out}.btn--text{padding:12px 18px;color:#23282d;opacity:.5}.btn--action,.btn--small{border-radius:2px;font-weight:600;line-height:23px;text-align:center}.btn--text:hover{opacity:1}.btn--action{display:inline-block;padding:20px 40px;font-size:16px;background-color:#00a9de;color:#fff}.btn--action:hover{background-color:#23282d;color:#fff}.btn--validated{position:relative;padding-left:55px;pointer-events:none}.btn--validated:before{content:"";position:absolute;left:20px;top:50%;transform:translateY(-50%);display:block;width:30px;height:30px;background:url(../images/icon-checked-white.svg) center center no-repeat;background-size:cover}.btn--small{padding:5px 30px;font-size:13px;color:#FFF;background-color:#23282D}.btn--small:hover{background-color:#00a9de}.btn--green{background-color:#3BB371}.btn--blue{background-color:#00a9de}.btn--slim{padding:0}.btn--disabled{cursor:not-allowed;opacity:.5}.switch{font-family:"Galano Grotesque Alt",sans-serif;font-size:14px;line-height:22px;text-align:left;color:#23282d}.setup-wizard-theme-name,.theme__name,.theme__status{font-family:"Galano Classic",sans-serif;color:#23282d}.switch.switch.switch{margin-bottom:30px}.switch [style*=flex]{justify-content:space-between}.header-toolbar{display:flex;justify-content:space-between;margin-bottom:7px}.header-toolbar__wing{display:flex;align-items:center}.header-toolbar__wing--right .btn{opacity:1}.header-toolbar__wing--right .btn:last-child{padding-right:0}.setup-wizard-theme-name,.theme__name{margin:0;font-size:36px;font-weight:700;line-height:49px;opacity:.9}.theme__status{margin-left:14px;font-size:14px;line-height:19px}.theme__status--ok:before{content:"";position:relative;top:2px;display:inline-block;width:14px;height:14px;margin-right:5px;background:url(../images/icon-checked.svg) center center no-repeat;background-size:cover}.dashboard-tabs>:first-child{justify-content:flex-start;background:#fff!important;width:auto!important}.dashboard-tabs__tab-name{flex:0;padding:2px 26px!important;border-bottom:3px solid transparent!important;font-family:"Galano Classic",sans-serif!important;font-size:14px!important;font-weight:600!important;line-height:19px!important;color:#23282d!important;text-transform:none!important;opacity:.5}.dashboard-tabs__tab-name.is-active{border-bottom:3px solid #00a9de!important;opacity:1}.dashboard-tabs__tab-name--system-status{margin-left:auto!important;margin-right:0!important}.dashboard-tabs__tab-name--system-status[disabled]{cursor:not-allowed!important}.section{position:relative;padding:30px;margin:20px 0}.section--informative{padding:50px}.section--informative .section__title{margin:0;font-size:36px;font-weight:700;line-height:49px}.section--informative .section__content{margin:20px 0 30px}.section h2,.section h3,.section h4{font-family:"Galano Classic",sans-serif;-webkit-font-smoothing:antialiased}.section ul{padding:0}.section ul li{margin-bottom:7px}.section :last-child,.section ul li:last-child{margin-bottom:0}.section a:not(.btn){color:inherit}.section--airy{margin:47px 0 40px;padding:0;border:0;background:0 0}.section--airy .section__subtitle{margin-top:0;margin-bottom:5px;font-size:18px;font-weight:600;line-height:24px;opacity:.9;color:#738D96}.section--airy .section__title{opacity:.9;font-size:23px;line-height:29px;font-weight:600;text-align:center}.section__title{margin-top:0;margin-bottom:40px;font-size:22px;color:#23282d}.section__content{font-family:"Galano Grotesque Alt",sans-serif;font-size:16px;line-height:26px;color:#23282d}.section__content+.btn--cta{margin-top:12px}.faq-question p,.sections-grid .section{margin-top:0}.section__close{position:absolute;top:0;right:0;padding:12px;background:0 0}.section__close:before{content:"\f153";display:block;height:20px;width:20px;font:400 16px/20px dashicons;text-align:center;color:#b4b9be;speak:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.faq-question{margin-bottom:27px}.faq-question h3{margin-bottom:9px;font-size:16px}.sections-grid{display:flex;justify-content:center;flex-wrap:wrap;margin-left:-30px}.sections-grid.sections-grid{margin-bottom:-30px}.sections-grid>*{flex-basis:50%;padding-left:30px;padding-bottom:30px}.sections-grid .section__title{margin-bottom:20px;font-size:18px;line-height:24px}.sections-grid .section__content{margin:0 0 22px;font-size:14px;line-height:23px}.box{position:relative;display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;margin:20px 0;padding:16px 18px 16px 52px;border-radius:4px;background:#fff;color:#fff}.box:before{content:"";position:absolute;left:18px;top:50%;transform:translateY(-50%);z-index:1;background:center center no-repeat;background-size:cover;width:20px;height:20px}.box--neutral{color:#23282d;border:1px solid #ebebeb}.box--validated{background-color:#3BB371}.box--validated:before{background-image:url(../images/icon-checked-white.svg)}.box--error{background-color:#E3004A}.box--error:before{background-image:url(../images/icon-error-white.svg)}.box--info{background-color:#00A9DE}.box--info:before{background-image:url(../images/icon-info-white.svg)}.box--warning{background-color:#FFBF4D}.box--warning:before{background-image:url(../images/icon-warning-white.svg)}.box--error,.box--info,.box--validated,.box--warning{border:0;color:#fff}.box a{color:#fff}.box__text,.box__title{font-size:14px;color:inherit}.box>:not(.box__filler){position:relative;z-index:1}.box__body{flex:1 1 auto}.box__cta{margin-left:20px}.box__title{margin:0;font-family:"Galano Classic",sans-serif;font-weight:600;line-height:19px;-webkit-font-smoothing:antialiased}.box__text{margin:0 0 -4px;font-family:"Galano Grotesque Alt",sans-serif;line-height:26px}.box__filler{position:absolute;top:0;left:0;bottom:0;z-index:0;border-radius:inherit;display:block;height:100%;width:0;background-color:#00a9de}.box--plugin-activating:before,.box--plugin-installing:before,.box--plugin-missing:before{width:6px;height:6px;border:7px solid;border-radius:50%}.box--plugin-missing:before{border-color:#ebebeb}.box--plugin-activating,.box--plugin-installing{border:0;background-color:#eee;background-image:linear-gradient(-45deg,rgba(255,255,255,.3) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.3) 50%,rgba(255,255,255,.3) 75%,transparent 75%,transparent);background-size:50px 50px;animation:progress-bg-anim 2s linear infinite;-webkit-animation:progress-bg-anim 2s linear infinite}.box--plugin-activating:before,.box--plugin-installing:before{border-color:#fff;background-color:#41B273}.box--plugin-installing{color:#23282d}@keyframes progress-bg-anim{0%{background-position:0 0}100%{background-position:50px 50px}}.box--plugin-invalidated,.box--plugin-validated{transition:color .3s ease-in-out}.box--plugin-invalidated:after,.box--plugin-validated:after{content:"";position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;background-color:#00a9de;pointer-events:none}.box--plugin-invalidated:after{transform:translateX(-100%)}.box--plugin-installing:after{transition:15s transform ease-out;transform:translateX(-20%)}.box--plugin-installing:nth-child(2):after{transition-delay:4s}.box--plugin-installing:nth-child(3):after{transition-delay:6s}.box--plugin-installing:nth-child(4):after{transition-delay:8s}.box--plugin-installing:nth-child(5):after{transition-delay:10s}.box--plugin-installing:nth-child(6):after{transition-delay:12s}.box--plugin-installing:nth-child(7):after{transition-delay:14s}.box--plugin-installing:nth-child(8):after{transition-delay:16s}.box--plugin-installing:nth-child(9):after{transition-delay:18s}.box--plugin-installing:nth-child(10):after{transition-delay:20s}.box--plugin-installing:nth-child(11):after{transition-delay:22s}.box--plugin-installing:nth-child(12):after{transition-delay:24s}.box--plugin-installing:nth-child(13):after{transition-delay:26s}.box--plugin-installing:nth-child(14):after{transition-delay:28s}.box--plugin-installing:nth-child(15):after{transition-delay:30s}.box--plugin-installing:nth-child(16):after{transition-delay:32s}.box--plugin-installing:nth-child(17):after{transition-delay:34s}.box--plugin-installing:nth-child(18):after{transition-delay:36s}.box--plugin-installing:nth-child(19):after{transition-delay:38s}.box--plugin-installing:nth-child(20):after{transition-delay:40s}.box--plugin-installed:after{transition:.2s transform ease-in-out;transform:translateX(-10%)}.box--plugin-installed.box--plugin-installed:after{transition-delay:0s}.box--plugin-activating{color:#fff}.box--plugin-activating:after{transition:20s transform ease-out;transform:translateX(-5%)}.box--plugin-activating.box--plugin-activating:after{transition-delay:0s}.box--plugin-validated{color:#fff;border:0}.box--plugin-validated:before{width:20px;height:20px;background-image:url(../images/icon-checked-white.svg);background-color:transparent;border:0}.box--plugin-validated:after{transition-duration:.3s;transform:translateX(0)}.system-status-tables div[style*="height: auto"]:not(.switch)>div:first-child table,.system-status-tables div[style*="height: auto"]:not(.switch)>div:first-child table thead,.system-status-tables div[style*="height: auto"]:not(.switch)>div:first-child table tr{border-bottom:0!important}.system-status-tables div[style*="height: auto"]:not(.switch)>div:first-child table{background-color:#FCFCFC!important}.system-status-tables div[style*="height: auto"]:not(.switch){margin-bottom:30px}.system-status-tables div[style*="height: auto"]:not(.switch):last-child{margin-bottom:0}.system-status-table{border:1px solid #ebebeb}.system-status-table *{font-size:14px!important}.system-status-table td,.system-status-table th{padding:15px 18px!important;text-align:left!important}.system-status-table td:first-child,.system-status-table th{font-family:"Galano Classic",sans-serif!important}.system-status-table th{color:#23282d!important}.system-status-table td{font-family:"Galano Grotesque Alt",sans-serif!important}.pixelgrade_care-setup{margin:0;padding:100px 0;background-color:#f3f7f8}.pixelgrade_care-setup .pixelgrade_care-wrapper{margin-top:0}.pixelgrade_care-setup .btn--small{padding:12px 55px;background-color:#00a9de}.stepper__label,.stepper__label>span{position:relative;padding:0!important}.pixelgrade_care-setup .btn--small:hover{background-color:#23282d}.setup-wizard-theme-name{margin-bottom:30px;font-size:72px;font-weight:700;line-height:97px;letter-spacing:10px;text-transform:uppercase}.stepper .btn--small,.stepper .btn--text{font-size:14px}.btn--return-to-dashboard,.stepper__label-name{font-size:16px;font-weight:600;text-align:center}.stepper .section--informative{margin-top:15px}.stepper>div:first-of-type>:not([class]){display:none}.stepper__step{cursor:pointer;flex-basis:20%!important}.stepper__label{flex-wrap:wrap;justify-content:center;cursor:inherit}.stepper__label>span{z-index:3;height:20px;width:20px;background-color:#f3f7f8;opacity:0;transition:opacity .2s ease-in-out}.stepper__label:after,.stepper__label:before{content:"";position:absolute}.stepper__label>span svg{margin-left:-2px;margin-top:-2px}.stepper__label:before{top:45px;left:50%;transform:translateX(-50%);z-index:2;width:14px;height:14px;background:#f3f7f8;border:3px solid #ccc;border-radius:50%;transition:all .2s ease-in-out}.stepper__label:after{left:0;top:53px;z-index:1;display:block;width:100%;height:4px;background:linear-gradient(to right,#ccc 0,#ccc 100%);transition:all .5s ease-in-out}.current .stepper__label:before,.done .stepper__label:before,.passed .stepper__label:before{border-color:#00a9de;background:#00a9de}.current .stepper__label:after{background:linear-gradient(to right,#00a9de 0,#00a9de 50%,#ccc 51%,#ccc 100%)}.passed .stepper__label:after{background:linear-gradient(to right,#00a9de 0,#00a9de 100%)}.done .stepper__label>span{opacity:1}.stepper__label-name{order:-1;flex:1 1 100%;display:block;font-family:"Galano Classic",sans-serif;line-height:22px;color:#ccc;opacity:.9;cursor:inherit}.current .stepper__label-name,.done .stepper__label-name,.passed .stepper__label-name{color:#00a9de}.stepper__content{opacity:1;transition:opacity .25s ease-in-out}.stepper__content.is--hidden{opacity:0}.btn--return-to-dashboard{display:block;line-height:26px;text-decoration:underline}.plugins{padding:0}.plugins p{margin-left:0}.plugin{overflow:hidden;margin-bottom:10px;transition:.3s background ease-in-out;-webkit-mask-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC)}.plugin:last-of-type{margin-bottom:0}</style>
		<?php wp_head(); ?>
	</head>
	<body class="pixelgrade_care-setup wp-core-ui">
	<div class="pixelgrade_care-wrapper">
		<div id="pixelgrade_care_installer">
			<div class="stepper">
				<div class="stepper__content">

					<div class="section section--informative">

						<h2 class="section__title u-text-center"><?php esc_html_e( 'One more lap to go..', '__theme_txtd' ); ?></h2>
						<div class="section__content">
							<?php
							echo sprintf(
								'%s <strong>%s</strong> %s',
								esc_html__( 'Start your digital journey with our', '__theme_txtd' ),
								esc_html__( 'Pixelgrade Care&#174;', '__theme_txtd' ),
								esc_html__( 'on board. It\'s the core of your experience with our WordPress theme, and we bet you are going to love it from day one. You\'re in great hands, no doubt about that!', '__theme_txtd' )
							); ?>
						</div>
						<div class="plugins">
							<div class="plugin  box  box--neutral  box--plugin-missing  box--plugin-invalidated">
								<div class="box__body">
									<h5 class="box__title"><?php esc_html_e( 'Pixelgrade Care&#174;', '__theme_txtd' ) ?></h5>
									<p class="box__text"><?php esc_html_e( 'Installing ...', '__theme_txtd' ) ?></p>
								</div>
							</div>
						</div>
					</div>

					<a class="btn  btn--text  btn--return-to-dashboard"
					   href="<?php echo esc_url( admin_url() ); ?>"><?php esc_html_e( 'Return to the WordPress Dashboard', '__theme_txtd' ) ?></a>
				</div>
			</div>
		</div>
	</div>

	<?php wp_print_footer_scripts(); ?>
	<script type="text/javascript">
        // this script is trying to force the installation of Pixelgrade Care plugin
        (function ($) {
            $(document).ready(function () {
                var temp_url = wp.ajax.settings.url,
                    $plugin = $('.plugin'),
                    $status = $plugin.find('.box__text');

                wp.ajax.settings.url = "<?php echo esc_url_raw( $nonce_url ) ?>";
                $plugin.addClass('box--plugin-installing');
                wp.ajax.send({type: 'GET'}).always(function (res) {
                    var success = res.indexOf('<p><?php esc_html_e( 'Plugin installed successfully.', '__theme_txtd' ); ?></p>');
                    var already_exists = res.indexOf('<p><?php esc_html_e( 'Plugin destination folder already exists.', '__theme_txtd' ); ?></p>');

                    if (success !== -1) {

                        // we need to trigger a request first to allow TGMPA cleanup his cache
                        $.ajax({
                            method: "GET",
                            url: "<?php echo esc_url( admin_url( 'themes.php?page=install-required-plugins' ) ); ?>"
                        }).done(function (msg) {
                            // just wait a sec
                            setTimeout(function () {
                                window.location.href = '<?php echo esc_url( admin_url( 'index.php?page=pixelgrade_care-setup-wizard' ) ); ?>';
                            }, 4000);
                        });

                    } else if (already_exists !== -1) {
                        window.location.href = '<?php echo esc_url( admin_url( 'index.php?page=pixelgrade_care-setup-wizard' ) ); ?>';
                    } else {
                        $plugin.removeClass('box--plugin-installing box--neutral');
                        $plugin.addClass('box--plugin-invalidated box--error');

                        $status.text('<?php esc_html_e( 'Bummer! Something went wrong. I\'m sorry but you will need to install the plugin manually. Redirecting you to the appropriate page...', '__theme_txtd' ); ?>');

                        setTimeout(function () {
                            window.location.href = '<?php echo esc_url( admin_url( 'index.php?page=pixelgrade_care-setup-wizard' ) ); ?>';
                        }, 8000);
                    }
                });
                wp.ajax.settings.url = temp_url;
            });
        })(jQuery);

	</script>
	</body>
	</html>
	<?php
	exit;
}
add_action( 'admin_init', 'rosa2_pixcare_install_page' );


/**
 * @param $title
 *
 * @return string
 */
function rosa2_pixcare_install_page_title( $title ) {
	if ( empty( $_GET['page'] ) || 'pixelgrade_care-install' !== $_GET['page'] ) {
		return $title;
	}

	return esc_html__( 'Pixelgrade Care &rsaquo; Installer', '__theme_txtd' );
}
add_filter( 'wp_title', 'rosa2_pixcare_install_page_title', 10, 1 );
