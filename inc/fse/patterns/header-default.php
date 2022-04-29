<?php
/**
 * Default header block pattern
 */
return [
	'title'      => __( 'Default Header (theme)', '__theme_txtd' ),
	'categories' => [ 'header' ],
	'blockTypes' => [ 'core/template-part/header' ],
	'content'    => '<!-- wp:novablocks/header {"layout":"logo-center"} -->
<!-- wp:novablocks/header-row {"slug":"primary","label":"Primary Navigation","isSticky":true,"isPrimary":true} -->
<!-- wp:novablocks/navigation {"slug":"primary"} /-->

<!-- wp:novablocks/logo /-->

<!-- wp:novablocks/navigation {"slug":"secondary"} /-->
<!-- /wp:novablocks/header-row -->
<!-- /wp:novablocks/header -->',
];
