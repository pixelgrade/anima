<?php
/**
 * Default sidebar.
 */

ob_start();
if ( is_active_sidebar( 'sidebar-1' ) ) {
	dynamic_sidebar( 'sidebar-1' );
}
$sidebar_content = ob_get_clean();

return array(
	'title'      => __( 'Articles Sidebar (theme)', '__theme_txtd' ),
	'categories' => array( 'sidebar' ),
	'blockTypes' => array( 'core/template-part/sidebar' ),
	'content'    => $sidebar_content,
);
