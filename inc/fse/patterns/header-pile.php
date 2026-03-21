<?php
/**
 * Pile-style header block pattern
 */
return [
	'title'      => __( 'Header a la Pile', '__theme_txtd' ),
	'categories' => [ 'header' ],
	'blockTypes' => [ 'core/template-part/header' ],
	'content'    => '<!-- wp:novablocks/header {"layout":"logo-left-center-right"} -->
<!-- wp:novablocks/header-row {"slug":"primary","label":"Primary Navigation","isSticky":true,"isPrimary":true} -->
<!-- wp:novablocks/logo /-->

<!-- wp:novablocks/navigation {"slug":"primary"} /-->

<!-- wp:novablocks/navigation {"slug":"secondary"} /-->
<!-- /wp:novablocks/header-row -->
<!-- /wp:novablocks/header -->',
];
