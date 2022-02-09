<?php
/**
 * Simple blog posts block pattern
 */
return array(
	'title'      => __( 'Simple blog posts', '__theme_txtd' ),
	'categories' => array( 'query' ),
	'blockTypes' => array( 'core/query' ),
	'content'    => '<!-- wp:query {"queryId":5,"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","categoryIds":[],"tagIds":[],"order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true},"layout":{"inherit":true}} -->
<div class="wp-block-query break-align-left break-align-right"><!-- wp:post-template -->
<!-- wp:post-title {"isLink":true,"style":{"spacing":{"margin":{"top":"1rem","bottom":"1rem"}},"typography":{"fontStyle":"normal","fontWeight":"300"},"elements":{"link":{"color":{"text":"var:preset|color|primary"}}}},"textColor":"primary","fontSize":"var(\u002d\u002dwp\u002d\u002dcustom\u002d\u002dtypography\u002d\u002dfont-size\u002d\u002dhuge, clamp(2.25rem, 4vw, 2.75rem))"} /-->

<!-- wp:post-featured-image {"isLink":true} /-->

<!-- wp:post-excerpt /-->

<!-- wp:group {"layout":{"type":"flex"}} -->
<div class="wp-block-group break-align-left break-align-right sm-palette-1 sm-variation-1 sm-color-signal-0 alignundefined" style="--nb-emphasis-top-spacing:0;--nb-emphasis-bottom-spacing:0;--nb-block-top-spacing:1;--nb-block-bottom-spacing:0;--nb-block-zindex:0;--nb-card-content-area-width:50%;--nb-card-media-container-height:50px;--nb-card-content-padding-multiplier:0;--nb-card-media-padding-top:100%;--nb-card-media-object-fit:cover;--nb-card-media-padding-multiplier:0;--nb-card-layout-gap-modifier:0;--nb-minimum-container-height:0vh;--nb-spacing-modifier:1;--nb-emphasis-area:100px" data-palette="1" data-palette-variation="1" data-color-signal="0"><!-- wp:post-date {"format":"F j, Y","style":{"typography":{"fontStyle":"normal","fontWeight":"400"}},"fontSize":"small"} /-->

<!-- wp:post-terms {"term":"category","fontSize":"small"} /-->

<!-- wp:post-terms {"term":"post_tag","fontSize":"small"} /--></div>
<!-- /wp:group -->

<!-- wp:spacer {"height":128} -->
<div style="height:128px" aria-hidden="true" class="wp-block-spacer break-align-left break-align-right"></div>
<!-- /wp:spacer -->
<!-- /wp:post-template -->

<!-- wp:query-pagination {"paginationArrow":"arrow","align":"wide","layout":{"type":"flex","justifyContent":"space-between"}} -->
<!-- wp:query-pagination-previous {"fontSize":"small"} /-->

<!-- wp:query-pagination-numbers /-->

<!-- wp:query-pagination-next {"fontSize":"small"} /-->
<!-- /wp:query-pagination --></div>
<!-- /wp:query -->',
);
