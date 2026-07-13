<?php
/**
 * Patch-style Header Template Part pattern.
 */
return [
	'title'      => __( 'Patch Header', '__theme_txtd' ),
	'categories' => [ 'header' ],
	'blockTypes' => [ 'core/template-part/header' ],
	'content'    => '<!-- wp:novablocks/header {"layout":"logo-left","logoHeight":48,"mobileLogoHeight":24,"navigationLinkSpacing":20,"headerSidesSpacing":0,"className":"is-style-anima-patch-header"} -->
<!-- wp:novablocks/header-row {"slug":"logo","label":"Site Identity / Logo","blockTopSpacing":0,"blockBottomSpacing":0,"emphasisTopSpacing":0,"emphasisBottomSpacing":0,"contentAlignment":"start"} -->
<!-- wp:novablocks/logo /-->
<!-- /wp:novablocks/header-row -->

<!-- wp:novablocks/header-row {"slug":"primary","label":"Primary Navigation","isPrimary":true,"blockTopSpacing":0,"blockBottomSpacing":0,"emphasisTopSpacing":0,"emphasisBottomSpacing":0,"contentAlignment":"start","navigationColumns":2,"navigationLinkVerticalSpacing":25} -->
<!-- wp:novablocks/navigation {"slug":"primary"} /-->
<!-- /wp:novablocks/header-row -->

<!-- wp:novablocks/header-row {"slug":"tertiary","label":"Social Navigation","blockTopSpacing":0,"blockBottomSpacing":0,"emphasisTopSpacing":0,"emphasisBottomSpacing":0,"contentAlignment":"start"} -->
<!-- wp:novablocks/navigation {"slug":"tertiary"} /-->
<!-- /wp:novablocks/header-row -->
<!-- /wp:novablocks/header -->',
];
