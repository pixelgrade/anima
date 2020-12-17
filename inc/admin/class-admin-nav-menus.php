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
						'search' => array(
							'type'          => 'custom-pxg',
							'type_label'    => esc_html__( 'Custom', '__theme_txtd' ),
							// This is used for the default Navigation Label value once the menu item is added in a menu.
							'title'         => esc_html__( 'Search', '__theme_txtd' ),
							// This is the label used for the menu items list.
							'label'         => esc_html__( 'Search', '__theme_txtd' ),
							'url'           => '#search',
							'attr_title'         => esc_html__( 'Search for something you seek', '__theme_txtd' ),
							// These are classes that will be merged with the user defined classes.
							'classes'       => array( 'is-search-button' ),
							'custom_fields' => array(
								'visual_style' => array(
									'type'        => 'select',
									'label'       => esc_html__( 'Visual Style', '__theme_txtd' ),
									'description' => esc_html__( 'Choose a visual style suitable to your goals and audience.', '__theme_txtd' ),
									'default'     => 'label_icon',
									'options'     => array(
										'label'      => esc_html__( 'Label', '__theme_txtd' ),
										'icon'       => esc_html__( 'Icon', '__theme_txtd' ),
										'label_icon' => esc_html__( 'Label with icon', '__theme_txtd' ),
									),
								),
							),
							// Specify the menu item fields we should force-hide via inline CSS for this menu item.
							// This means that despite the Screen Options, these fields will not be shown.
							// Use the value used by core in classes like "field-xfn" -> the 'xfn' value to use.
							'hidden_fields' => array( 'link-target', 'xfn', 'description', ),
						),
						'color-scheme-switcher' => array(
							'type'        => 'custom-pxg',
							'type_label'  => esc_html__( 'Custom', '__theme_txtd' ),
							// This is used for the default Navigation Label value once the menu item is added in a menu.
							'title'       => esc_html__( 'Light/Dark Mode', '__theme_txtd' ),
							// This is the label used for the menu items list.
							'label'       => esc_html__( 'Dark Mode Switcher', '__theme_txtd' ),
							'url'         => '#color-scheme-switcher',
							'attr_title'       => esc_html__( 'Switch between dark and light color mode', '__theme_txtd' ),
							// These are classes that will be merged with the user defined classes.
							'classes'     => array( 'is-color-scheme-switcher-button' ),
							'custom_fields' => array(
								'visual_style' => array(
									'type'        => 'select',
									'label'       => esc_html__( 'Visual Style', '__theme_txtd' ),
									'description' => esc_html__( 'Choose a visual style suitable to your goals and audience.', '__theme_txtd' ),
									'default'     => 'icon',
									'options'     => array(
										'label'      => esc_html__( 'Label', '__theme_txtd' ),
										'icon'       => esc_html__( 'Icon', '__theme_txtd' ),
										'label_icon' => esc_html__( 'Label with icon', '__theme_txtd' ),
									),
								),
							),
						),
					),
				),
			);

            // Allow others to have a say in this.
			$this->menu_items_boxes_config = apply_filters( 'rosa2_menu_items_boxes_config', $this->menu_items_boxes_config );

			/* ===============
			 * Backend effects
			 */
			add_action( 'admin_init', array( $this, 'add_custom_menu_items_boxes' ) );
			// Handle custom fields
			add_action( 'wp_nav_menu_item_custom_fields', array( $this, 'add_custom_fields' ), 5, 2 );
			// Handle hiding some menu item fields via inline CSS.
			add_action( 'wp_nav_menu_item_custom_fields', array( $this, 'inline_css_to_hide_menu_item_fields' ), 5, 2 );
			add_action( 'wp_update_nav_menu_item', array( $this, 'save_custom_fields' ), 10, 3 );
			// Make sure that out menu boxes appear by default (the core hides them by default).
			add_filter( "update_user_metadata", array( $this, 'unhide_our_menu_boxes_for_initial_metaboxes' ), 10, 5 );

			add_filter( 'wp_setup_nav_menu_item', array( $this, 'setup_nav_menu_item' ), 10, 1 );
			add_action( 'admin_enqueue_scripts', array( $this, 'admin_scripts_styles' ), 10, 1 );
			add_action( 'customize_controls_enqueue_scripts', array( $this, 'customize_scripts_styles' ), 10, 1 );

			// Include custom items to customizer nav menu settings.
			add_filter( 'customize_nav_menu_available_item_types', array( $this, 'register_customize_nav_menu_item_types' ) );
			add_filter( 'customize_nav_menu_available_items', array( $this, 'register_customize_nav_menu_items' ), 10, 4 );
			// Handle the menu items custom fields Customizer logic.
			add_action( 'wp_nav_menu_item_custom_fields_customize_template', array( $this, 'add_customize_custom_fields_templates' ), 5 );
			// Handle saving the custom fields in the Customizer.
			add_action( 'customize_save_after', array( $this, 'customizer_save_custom_fields' ), 10, 1 );
			// Set up previewing the custom fields in the Customizer.
			add_action( 'customize_register', array( $this, 'customizer_preview_custom_fields' ), 1000 );

			/* ===============
			 * Frontend effects
			 */
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

		/**
		 * @param int      $item_id Menu item ID.
		 * @param WP_Post  $item    Menu item data object.
		 */
		public function add_custom_fields( $item_id, $item ) {
			if ( 'custom-pxg' !== $item->type ) {
				return;
			}

			$item_config = array();

			$details = explode( '__', (string) $item->object );
			if ( count( $details ) === 2 && isset( $this->menu_items_boxes_config[ $details[0] ]['menu_items'][ $details[1] ] ) ) {
				$item_config = $this->menu_items_boxes_config[ $details[0] ]['menu_items'][ $details[1] ];
			}

			// Bail if we have no custom_fields defined.
			if ( empty( $item_config['custom_fields'] ) ) {
				return;
			}

			// Take each custom field config and output the HTML.
			foreach ( $item_config['custom_fields'] as $name => $config ) {
				if ( ! in_array( $config['type'], array( 'select', 'textarea', ) ) ) {
					continue;
				}

				// Gather up the HTML details of the custom field.
				$field_id = 'edit-menu-item-' . $name . '-' . $item_id;
				$field_name = 'menu-item-' . $name . '[' . $item_id . ']';
				$field_classes = array( 'widefat', 'edit-menu-item-' . $name, );
				if ( ! empty( $config['classes'] ) && is_array( $config['classes'] ) ) {
					$field_classes = array_unique( array_merge( $field_classes, $config['classes'] ) );
				}
				$field_classes = implode( ' ', $field_classes );

				$field_value = '';
				if ( isset( $item->$name ) ) {
					$field_value = $item->$name;
				} else if ( isset( $config['default'] ) ) {
					$field_value = $config['default'];
				} ?>

				<p class="field-<?php echo $name ?> description description-wide">
					<label for="<?php echo $field_id ?>">

					<?php if ( ! empty( $config['label'] ) ) { ?>
						<?php echo $config['label']; ?><br />
					<?php } ?>

				<?php switch ( $config['type'] ) {
					case 'select':
						if ( empty( $config['options'] ) ) {
							break;
						} ?>
						<select id="<?php echo esc_attr( $field_id ); ?>" name="<?php echo esc_attr( $field_name ); ?>" class="<?php echo esc_attr( $field_classes ); ?>">
							<?php foreach ( $config['options'] as $option_value => $option_label ) { ?>
								<option <?php selected( $field_value, $option_value ); ?> value="<?php echo esc_attr( $option_value ); ?>"><?php echo esc_html( $option_label ); ?></option>
							<?php } ?>
						</select>
						<?php break;
					case 'textarea': ?>
						<textarea id="<?php echo esc_attr( $field_id ); ?>" name="<?php echo esc_attr( $field_name ); ?>" class="<?php echo esc_attr( $field_classes ); ?>" rows="3" cols="20"><?php echo esc_textarea( $field_value ); ?></textarea>
						<?php break;
					default:
						break;
				}

				if ( ! empty( $config['description'] ) ) { ?>
						<span class="description"><?php echo wp_kses_post( $config['description'] ); ?></span>
					<?php } ?>

					</label>
				</p>
				<?php
			}
		}

		/**
		 * @param int      $item_id Menu item ID.
		 * @param WP_Post  $item    Menu item data object.
		 */
		public function inline_css_to_hide_menu_item_fields( $item_id, $item ) {
			if ( 'custom-pxg' !== $item->type ) {
				return;
			}

			$item_config = array();

			$details = explode( '__', (string) $item->object );
			if ( count( $details ) === 2 && isset( $this->menu_items_boxes_config[ $details[0] ]['menu_items'][ $details[1] ] ) ) {
				$item_config = $this->menu_items_boxes_config[ $details[0] ]['menu_items'][ $details[1] ];
			}

			// Bail if we have no hidden_fields defined.
			if ( empty( $item_config['hidden_fields'] ) ) {
				return;
			}

			if ( is_string( $item_config['hidden_fields'] ) ) {
				$item_config['hidden_fields'] = array( $item_config['hidden_fields'] );
			}

			// Add the '.field-' prefix to all provided field keys.
			$css_selectors = array_map( function( $str ){ return '.field-' . $str; }, $item_config['hidden_fields'] );
			// Now scope the classes to this specific menu item's settings.
			$css_selectors = array_map( function( $str ) use ( $item_id ) { return '#menu-item-settings-' . $item_id . ' > ' . $str; }, $css_selectors );
			// Finally output the CSS rule. ?>
			<style>
				<?php echo implode( ', ', $css_selectors ); ?> {
					display:none;
					visibility: hidden;
				}
			</style>
			<?php

		}

		/**
		 * @see wp_update_nav_menu_item()
		 *
		 * @param int   $menu_id         ID of the updated menu.
		 * @param int   $menu_item_db_id ID of the updated menu item.
		 * @param array $args            An array of arguments used to update a menu item.
		 */
		public function save_custom_fields( $menu_id, $menu_item_db_id, $args ) {
			if ( 'custom-pxg' !== $args['menu-item-type'] ) {
				return;
			}

			$details = explode( '__', (string) $args['menu-item-object'] );
			if ( count( $details ) === 2 && isset( $this->menu_items_boxes_config[ $details[0] ]['menu_items'][ $details[1] ] ) ) {
				$item_config = $this->menu_items_boxes_config[ $details[0] ]['menu_items'][ $details[1] ];

				if ( empty( $item_config['custom_fields'] ) ) {
					return;
				}

				// Take the value and sanitize/normalize it according to the custom field config.
				foreach ( $item_config['custom_fields'] as $name => $config ) {
					if ( ! in_array( $config['type'], array( 'select', 'textarea', ) ) ) {
						continue;
					}

					$new_value = '';
					if ( isset( $_POST["menu-item-$name"][ $menu_item_db_id ] ) ) {
						$new_value = $_POST["menu-item-$name"][ $menu_item_db_id ];
					} else if ( isset( $config['default'] ) ) {
						$new_value = $config['default'];
					}

					switch ( $config['type'] ) {
						case 'select':
							if ( empty( $config['options'] ) || ! in_array( $new_value, array_keys( $config['options'] ) ) ) {
								if ( isset( $config['default'] ) ) {
									$new_value = $config['default'];
								} else {
									$new_value = '';
								}
							}
							break;
						case 'textarea':
							$new_value = esc_textarea( $new_value );
							break;
						default:
							break;
					}

					// Finally update the menu item post meta.
					update_post_meta( $menu_item_db_id, "_menu_item_$name", $new_value );
				}
			}
		}

		/**
		 * Make sure that our metaboxes are not hidden on the initial nav menus metaboxes.
		 *
		 * @see wp_initial_nav_menu_meta_boxes()
		 *
		 * @param $check
		 * @param $object_id
		 * @param $meta_key
		 * @param $meta_value
		 * @param $prev_value
		 *
		 * @return false|int
		 */
		public function unhide_our_menu_boxes_for_initial_metaboxes( $check, $object_id, $meta_key, $meta_value, $prev_value ) {
			global $wp_meta_boxes;

			if ( $meta_key !== 'metaboxhidden_nav-menus' || ! is_array( $meta_value ) || get_user_option( 'metaboxhidden_nav-menus' ) !== false || ! is_array( $wp_meta_boxes ) ) {
				// Nothing to do.
				return $check;
			}

			// We will remove our menu boxes from the $meta_value.
			foreach ( $this->menu_items_boxes_config as $box_id => $box_config ) {
				if ( false !== $key = array_search( $box_id, $meta_value ) ) {
					unset( $meta_value[ $key ] );
				}
			}

			// On failure, let it pass.
			if ( false === $meta_id = add_metadata( 'user', $object_id, $meta_key, $meta_value ) ) {
				return $check;
			}

			return $meta_id;
		}

		public function add_extras_items( $object ) {
			global $nav_menu_selected_id;

			$menu_items_obj = array();

			foreach ( $this->menu_items_boxes_config['pxg-extras']['menu_items'] as $id => $item ) {
				$menu_items_obj[ $id ]                   = new stdClass;
				$menu_items_obj[ $id ]->ID               = $id;
				$menu_items_obj[ $id ]->title            = $item['title'];
				$menu_items_obj[ $id ]->description      = '';
				$menu_items_obj[ $id ]->db_id            = 0;
				$menu_items_obj[ $id ]->object           = 'pxg-extras__' . $id;
				$menu_items_obj[ $id ]->object_id        = $id;
				$menu_items_obj[ $id ]->menu_item_parent = 0;
				$menu_items_obj[ $id ]->type             = $item['type'];
				$menu_items_obj[ $id ]->url              = '';
				$menu_items_obj[ $id ]->target           = '';
				$menu_items_obj[ $id ]->attr_title       = '';
				$menu_items_obj[ $id ]->label            = $item['label'];
				$menu_items_obj[ $id ]->attr_title       = $item['attr_title'];
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
			// We need to the alterations here because the WP core imposes too much of it's own logic.
			if ( 'custom-pxg' === $menu_item->type ) {
				$details = explode( '__', (string) $menu_item->object );
				if ( count( $details ) === 2 && isset( $this->menu_items_boxes_config[ $details[0] ]['menu_items'][ $details[1] ] ) ) {
					$item_config = $this->menu_items_boxes_config[ $details[0] ]['menu_items'][ $details[1] ];

					$menu_item->type_label =  $item_config['type_label'];

					// Add any configured custom field value to the object.
					if ( ! empty( $item_config['custom_fields'] ) ) {
						foreach ( $item_config['custom_fields'] as $name => $config ) {
							if ( ! in_array( $config['type'], array( 'select', 'textarea', ) ) ) {
								continue;
							}

							$menu_item->$name = get_post_meta( $menu_item->db_id, "_menu_item_$name", true );
						}
					}

					// Merge here our classes so the user can't edit or remove them.
					// But we only want to do this in the frontend, when outputting.
					if ( ! is_admin() ) {
						if ( is_string( $menu_item->classes ) ) {
							$menu_item->classes = explode( ' ', $menu_item->classes );
						}

						// We may need to add other classes depending on custom fields.
						if ( isset( $menu_item->visual_style ) ) {
							switch ( $menu_item->visual_style ) {
								case 'icon':
									$menu_item->classes[] = 'icon-only';
									break;
								case 'label':
									$menu_item->classes[] = 'no-icon';
									break;
								default:
									break;
							}
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
//				wp_enqueue_script( 'rosa2-admin-nav-menus-scripts', get_template_directory_uri() . '/dist/js/admin/edit-nav-menus.js', array( 'jquery' ), '1.0.0', true );
				wp_enqueue_style( 'rosa2-admin-nav-menus-styles', get_template_directory_uri() . '/dist/css/admin/edit-nav-menus.css', array( 'nav-menus' ), '1.0.0' );
			}
		}

		public function customize_scripts_styles() {
			$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';
			// Enqueue script which extends nav menu item controls.
			wp_enqueue_script( 'rosa2-customize-nav-menu-scripts', get_template_directory_uri() . '/dist/js/admin/customizer-nav-menus' . $suffix . '.js', array( 'customize-nav-menus' ), '1.0.0', true );
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
					'title'      => $item['title'],
					'type'       => $item['type'],
					'type_label' => $item['type_label'],
					'object'     => 'pxg-extras__' . $id,
					'classes'    => '',
					'attr_title' => $item['attr_title'],
				);
			}

			return $items;
		}

		public function add_customize_custom_fields_templates() {
			foreach ( $this->menu_items_boxes_config['pxg-extras']['menu_items'] as $box_name => $box_config ) {
			?>

			<# if ( "custom-pxg" === data.item_type && data.el_classes.indexOf("pxg-extras__<?php echo $box_name; ?>") !== -1 ) { #>
			<?php
				$box_config = $this->menu_items_boxes_config['pxg-extras']['menu_items'][ $box_name ];

				if ( empty( $box_config['custom_fields'] ) ) {
					return;
				}

				// Take each custom field config and output the HTML.
				foreach ( $box_config['custom_fields'] as $name => $config ) {
					if ( ! in_array( $config['type'], array( 'select', 'textarea', ) ) ) {
						continue;
					}

					// Gather up the HTML details of the custom field.
					$field_id = 'edit-menu-item-' . $name . '-{{ data.menu_item_id }}';
					$field_name = 'menu-item-' . $name;
					$field_classes = array( 'widefat', 'edit-menu-item-' . $name, );
					if ( ! empty( $config['classes'] ) && is_array( $config['classes'] ) ) {
						$field_classes = array_unique( array_merge( $field_classes, $config['classes'] ) );
					}
					$field_classes = implode( ' ', $field_classes ); ?>

					<p class="field-<?php echo $name ?> description description-thin">
						<label for="<?php echo $field_id ?>">

							<?php if ( ! empty( $config['label'] ) ) { ?>
								<?php echo $config['label']; ?><br />
							<?php } ?>

							<?php switch ( $config['type'] ) {
								case 'select':
									if ( empty( $config['options'] ) ) {
										break;
									} ?>
									<select id="<?php echo esc_attr( $field_id ); ?>" name="<?php echo esc_attr( $field_name ); ?>" class="<?php echo esc_attr( $field_classes ); ?>"<?php echo isset( $config['default'] ) ? ' data-default="' . esc_attr( $config['default'] ) . '"' : ''; ?>>
										<?php foreach ( $config['options'] as $option_value => $option_label ) { ?>
											<option value="<?php echo esc_attr( $option_value ); ?>"><?php echo esc_html( $option_label ); ?></option>
										<?php } ?>
									</select>
									<?php break;
								case 'textarea': ?>
									<textarea id="<?php echo esc_attr( $field_id ); ?>" name="<?php echo esc_attr( $field_name ); ?>" class="<?php echo esc_attr( $field_classes ); ?>" rows="3" cols="20">{{ data.<?php echo $name; ?> }}</textarea>
									<?php break;
								default:
									break;
							}

							if ( ! empty( $config['description'] ) ) { ?>
								<span class="description"><?php echo wp_kses_post( $config['description'] ); ?></span>
							<?php } ?>

						</label>
					</p>
					<?php
				}
			?>
			<# } #>

			<?php
			}
		}

		/**
		 * @param WP_Customize_Manager $wp_customize
		 */
		public function customizer_save_custom_fields( $wp_customize ) {
			foreach ( $wp_customize->settings() as $setting ) {
				if ( $setting instanceof WP_Customize_Nav_Menu_Item_Setting && $setting->check_capabilities() ) {
					$this->save_nav_menu_setting_postmeta( $setting );
				}
			}
		}

		/**
		 * @param WP_Customize_Manager $wp_customize
		 */
		public function customizer_preview_custom_fields( $wp_customize ) {
			if ( $wp_customize->settings_previewed() ) {
				foreach ( $wp_customize->settings() as $setting ) {
					if ( $setting instanceof WP_Customize_Nav_Menu_Item_Setting ) {
						$this->preview_nav_menu_setting_postmeta( $setting );
					}
				}
			}
		}

		/**
		 * Save changes to the nav menu item roles.
		 *
		 * Note the unimplemented to-do in the doc block for the setting's preview method.
		 *
		 * @see WP_Customize_Nav_Menu_Item_Setting::update()
		 *
		 * @param WP_Customize_Nav_Menu_Item_Setting $setting Setting.
		 */
		protected function save_nav_menu_setting_postmeta( WP_Customize_Nav_Menu_Item_Setting $setting ) {
			$visual_style = $this->get_sanitized_visual_style_post_data( $setting );
			if ( null !== $visual_style ) {
				update_post_meta( $setting->post_id, '_menu_item_visual_style', $visual_style );
			}
		}

		/**
		 * Get sanitized posted value for a setting's visual style.
		 *
		 * @param WP_Customize_Nav_Menu_Item_Setting $setting Setting.
		 *
		 * @return array|string|null Visual Style value or null if no posted value present.
		 */
		protected function get_sanitized_visual_style_post_data( $setting ) {
			if ( ! $setting->post_value() ) {
				return null;
			}

			$allowed_visual_style_values = array(
				'label',
				'icon',
				'label_icon',
			);

			$unsanitized_post_value = $setting->manager->unsanitized_post_values()[ $setting->id ];
			if ( isset( $unsanitized_post_value['visual_style'] ) ) {
				$value = $unsanitized_post_value['visual_style'];

				if ( in_array( $value, $allowed_visual_style_values ) ) {
					return $value;
				}
			}

			return '';
		}

		/**
		 * Preview changes to the nav menu item roles.
		 *
		 * Note the unimplemented to-do in the doc block for the setting's preview method.
		 *
		 * @see WP_Customize_Nav_Menu_Item_Setting::preview()
		 *
		 * @param WP_Customize_Nav_Menu_Item_Setting $setting Setting.
		 */
		public function preview_nav_menu_setting_postmeta( $setting ) {
			$visual_style = $this->get_sanitized_visual_style_post_data( $setting );
			if ( null === $visual_style ) {
				return;
			}

			add_filter(
				'get_post_metadata',
				static function ( $value, $object_id, $meta_key ) use ( $setting, $visual_style ) {
					if ( absint( $object_id ) === absint( $setting->post_id ) && '_menu_item_visual_style' === $meta_key ) {
						return $visual_style;
					}
					return $value;
				},
				10,
				3
			);
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
