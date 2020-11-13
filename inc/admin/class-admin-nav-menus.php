<?php
/**
 * Rosa 2 Nav Menus logic.
 *
 * @package Rosa2
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Rosa2_Admin_Nav_Menus', false ) ) :

	/**
	 * Rosa2_Admin_Nav_Menus Class.
	 */
	class Rosa2_Admin_Nav_Menus {

		public $menu_items_boxes_config = array();

		/**
		 * Initialize nav menus alteration logic.
		 */
		public function __construct() {
			$this->menu_items_boxes_config = array(
				'pxg-extras' => array(
					'title'      => esc_html__( 'Extras', '__theme_txtd' ),
					'callback'   => array( $this, 'add_extras_items' ),
					'context'    => 'side',
					'priority'   => 'low',
					'menu_items' => array(
						'search'                => array(
							'type'        => 'custom-pxg',
							'type_label'  => esc_html__( 'Custom', '__theme_txtd' ),
							'title'       => esc_html__( 'Search for something you seek', '__theme_txtd' ),
							'label'       => esc_html__( 'Search', '__theme_txtd' ),
							'url'         => '#search',
							'classes'     => array( 'is-search-button' ),
						),
						'color-scheme-switcher' => array(
							'type'        => 'custom-pxg',
							'type_label'  => esc_html__( 'Custom', '__theme_txtd' ),
							'title'       => esc_html__( 'Switch between dark and light color mode', '__theme_txtd' ),
							'label'       => esc_html__( 'Dark Mode Switcher', '__theme_txtd' ),
							'url'         => '#color-scheme-switcher',
							'classes'     => array( 'is-color-scheme-switcher-button' ),
						),
					),
				),
			);

			// Allow others to have a say in this.
			$this->menu_items_boxes_config = apply_filters( 'rosa2_menu_items_boxes_config', $this->menu_items_boxes_config );

			// Backend effects
			add_action( 'admin_init', array( $this, 'add_custom_menu_items_boxes' ) );
			add_filter( 'wp_setup_nav_menu_item', array( $this, 'setup_nav_menu_item' ), 10, 1 );
			add_action( 'admin_enqueue_scripts', array( $this, 'admin_scripts_styles' ), 10, 1 );

			// Include custom items to customizer nav menu settings.
			add_filter( 'customize_nav_menu_available_item_types', array( $this, 'register_customize_nav_menu_item_types' ) );
			add_filter( 'customize_nav_menu_available_items', array( $this, 'register_customize_nav_menu_items' ), 10, 4 );

			// Frontend effects
			add_action( 'rosa2_after_footer', array( $this, 'output_search_overlay' ), 10 );
			add_filter( 'get_search_form', array( $this, 'custom_search_form' ), 10, 1 );
			add_filter( 'language_attributes', array( $this, 'add_color_scheme_attribute' ), 10, 2 );
		}

		public function add_custom_menu_items_boxes() {
			global $pagenow;
			if( 'nav-menus.php' == $pagenow ) {
				// Add the configured meta boxes.
				foreach ( $this->menu_items_boxes_config as $box_id => $box_config ) {
					add_meta_box( $box_id, $box_config['title'], $box_config['callback'], 'nav-menus', $box_config['context'], $box_config['priority'] );
				}
			}
		}

		public function add_extras_items( $object ) {
			global $nav_menu_selected_id;

			$menu_items_obj = array();

			foreach ( $this->menu_items_boxes_config['pxg-extras']['menu_items'] as $id => $item ) {
				$menu_items_obj[ $id ]                   = new stdClass;
				$menu_items_obj[ $id ]->ID               = $id;
				$menu_items_obj[ $id ]->title            = $item['label'];
				$menu_items_obj[ $id ]->description      = '';
				$menu_items_obj[ $id ]->db_id            = 0;
				$menu_items_obj[ $id ]->object           = 'pxg-extras__' . $id;
				$menu_items_obj[ $id ]->object_id        = $id;
				$menu_items_obj[ $id ]->menu_item_parent = 0;
				$menu_items_obj[ $id ]->type             = $item['type'];
				$menu_items_obj[ $id ]->target           = '';
				$menu_items_obj[ $id ]->attr_title       = '';
				$menu_items_obj[ $id ]->label            = $item['label'];
				$menu_items_obj[ $id ]->attr_title       = $item['title'];
				$menu_items_obj[ $id ]->classes          = array();
				$menu_items_obj[ $id ]->xfn              = '';
			}

			$walker = new Walker_Nav_Menu_Checklist( array() );

			?>

			<div id="rosa2-user-menu-links" class="taxonomydiv">
				<div id="tabs-panel-rosa2-links-all" class="tabs-panel tabs-panel-view-all tabs-panel-active">

					<ul id="rosa2-user-menu-linkschecklist" class="list:rosa2-user-menu-links categorychecklist form-no-clear">
						<?php echo walk_nav_menu_tree( array_map( 'wp_setup_nav_menu_item', $menu_items_obj ), 0, (object) array( 'walker' => $walker ) ); ?>
					</ul>

				</div>
				<p class="button-controls">
				<span class="add-to-menu">
					<input type="submit" <?php disabled( $nav_menu_selected_id, 0 ); ?> class="button-secondary submit-add-to-menu right"
					       value="<?php esc_attr_e( 'Add to Menu', '__theme_txtd' ); ?>"
					       name="add-rosa2-user-menu-links-menu-item" id="submit-rosa2-user-menu-links"/>
				</span>
				</p>
			</div>

			<?php
		}

		public function setup_nav_menu_item( $menu_item ) {
			// We need to the alterations here because the WP core emposes too much of it's own logic.
			if ( 'custom-pxg' === $menu_item->type ) {
				$details = explode( '__', (string) $menu_item->object );
				if ( count( $details ) === 2 && isset( $this->menu_items_boxes_config[ $details[0] ]['menu_items'][ $details[1] ] ) ) {
					$item_config = $this->menu_items_boxes_config[ $details[0] ]['menu_items'][ $details[1] ];
					$menu_item->type_label =  $item_config['type_label'];

					// Merge here our classes so the user can't edit or remove them.
					// But we only want to do this in the frontend, when outputting.
					if ( ! is_admin() ) {
						if ( is_string( $menu_item->classes ) ) {
							$menu_item->classes = explode( ' ', $menu_item->classes );
						}

						$menu_item->classes = array_unique( array_merge( $menu_item->classes, $item_config['classes'] ) );

						if ( ! empty( $item_config['url'] ) ) {
							$menu_item->url = $item_config['url'];
						}
					}
				}
			}

			return $menu_item;
		}

		public function admin_scripts_styles( $hook_suffix ) {
			if( 'nav-menus.php' === $hook_suffix ) {
				wp_enqueue_script( 'rosa2-admin-nav-menus-scripts', get_template_directory_uri() . '/dist/js/admin/edit-nav-menus.js', array( 'jquery' ), '1.0.0', true );
				wp_enqueue_style( 'rosa2-admin-nav-menus-styles', get_template_directory_uri() . '/dist/css/admin/edit-nav-menus.css', array( 'nav-menus' ), '1.0.0' );
			}
		}

		/**
		 * Register customize new nav menu item types.
		 *
		 * @param  array $item_types Menu item types.
		 * @return array
		 */
		public function register_customize_nav_menu_item_types( $item_types ) {
			foreach ( $this->menu_items_boxes_config as $box_id => $box_config ) {
				$item_types[] = array(
					'title'      => $box_config['title'],
					'type_label' => $box_config['title'],
					'type'       => 'custom-pxg',
					'object'     => $box_id,
				);
			}

			return $item_types;
		}

		/**
		 * Add our extra menu items to customize nav menu items.
		 *
		 * @param  array   $items  List of nav menu items.
		 * @param  string  $type   Nav menu type.
		 * @param  string  $object Nav menu object.
		 * @param  integer $page   Page number.
		 * @return array
		 */
		public function register_customize_nav_menu_items( $items = array(), $type = '', $object = '', $page = 0 ) {
			if ( 'pxg-extras' !== $object ) {
				return $items;
			}

			// Don't allow pagination since all items are loaded at once.
			if ( 0 < $page ) {
				return $items;
			}

			foreach ( $this->menu_items_boxes_config['pxg-extras']['menu_items'] as $id => $item ) {
				$items[] = array(
					'id'         => $id,
					'title'      => $item['label'],
					'type'       => $item['type'],
					'type_label' => $item['type_label'],
					'object'     => 'pxg-extras__' . $id,
					'classes'    => '',
					'attr_title' => $item['title'],
				);
			}

			return $items;
		}

		public function output_search_overlay() {

			$menu_locations = get_nav_menu_locations();

			// Determine if any menu location has a search menu item so we can output the overlay markup.
			$has_search_item = false;
			foreach ( $menu_locations as $menu_location ) {
				$menu_items = wp_get_nav_menu_items( $menu_location );
				if ( ! $menu_items ) {
					continue;
				}

				foreach ( $menu_items as $menu_item ) {
					if ( '#search' === $menu_item->url ) {
						$has_search_item = true;
						break;
					}
				}

				// No need to continue if we have found one.
				if ( $has_search_item ) {
					break;
				}
			}

			if ( ! $has_search_item ) {
				return;
			} ?>

			<div class="c-search-overlay">
				<div class="c-search-overlay__content">
					<div class="c-search-overlay__form">
						<?php get_search_form(); ?>
						<span class="c-search-overlay__cancel"></span>
					</div>

					<?php if ( has_nav_menu( 'search-suggestions' ) ) {

						$menu_name = wp_get_nav_menu_name('search-suggestions' ); ?>

						<div class="c-search-overlay__suggestions">
							<p><?php echo wp_kses( $menu_name, wp_kses_allowed_html() ); ?></p>
							<?php wp_nav_menu( array(
								'container'      => false,
								'theme_location' => 'search-suggestions',
								'menu_id'        => 'search-suggestions-menu',
								'fallback_cb'    => false
							) ); ?>
						</div><!-- .c-search-overlay__suggestions -->

					<?php } ?>
				</div><!-- .c-search-overlay__content -->
			</div><!-- .c-search-overlay -->

			<?php
		}

		/**
		 * Custom search form.
		 *
		 * @param string $form Form HTML.
		 * @return string Modified form HTML.
		 */
		public function custom_search_form( $form ) {
			$form = '<form role="search" method="get" class="search-form" action="' . esc_url( home_url( '/' ) ) . '">
				<label>
					<span class="screen-reader-text">' . _x( 'Search for:', 'label', '__theme_txtd' ) . '</span>
					<input type="search" class="search-field" placeholder="' . esc_attr( sprintf( __( 'Search %s...', '__theme_txtd' ), esc_html( get_bloginfo( 'name' ) ) ) ) . '" value="' . get_search_query() . '" name="s" />
					<span class="search-icon"></span>
				</label>
				<input type="submit" class="search-submit" value="' . esc_attr_x( 'Search', 'submit button', '__theme_txtd' ) . '" />
			</form>';

			return $form;
		}

		/**
		 * Add Color Scheme attribute to <html> tag.
		 *
		 * @since 1.6.0
		 *
		 * @param string $output A space-separated list of language attributes.
		 * @param string $doctype The type of html document (xhtml|html).
		 *
		 * @return string $output A space-separated list of language attributes.
		 */
		public function add_color_scheme_attribute( $output, $doctype ) {

			if( is_admin() ) {
				return;
			}

			if ( 'html' !== $doctype ) {
				return $output;
			}

			$output .= ' data-dark-mode-advanced=' . pixelgrade_option( 'sm_dark_mode_advanced', 'off' );

			return $output;
		}

		public function is_nav_menus_page( $new_edit = null ) {
			global $pagenow;

			// Make sure we are on the backend.
			if ( ! is_admin() ) {
				return false;
			}

			if( 'nav-menus.php' == $pagenow ) {
				return true;
			}

			return false;
		}
	}

endif;

return new Rosa2_Admin_Nav_Menus();
