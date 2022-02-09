<?php
/**
 * Irregular grid of posts block pattern
 */
return array(
	'title'      => __( 'Irregular grid of posts', '__theme_txtd' ),
	'categories' => array( 'query' ),
	'blockTypes' => array( 'core/query' ),
	'content'    => '<!-- wp:group {"align":"wide"} -->
<div class="wp-block-group break-align-left break-align-right sm-palette-1 sm-variation-1 sm-color-signal-0 alignwide" style="--nb-emphasis-top-spacing:0;--nb-emphasis-bottom-spacing:0;--nb-block-top-spacing:1;--nb-block-bottom-spacing:0;--nb-block-zindex:0;--nb-card-content-area-width:50%;--nb-card-media-container-height:50px;--nb-card-content-padding-multiplier:0;--nb-card-media-padding-top:100%;--nb-card-media-object-fit:cover;--nb-card-media-padding-multiplier:0;--nb-card-layout-gap-modifier:0;--nb-minimum-container-height:0vh;--nb-spacing-modifier:1;--nb-emphasis-area:100px" data-palette="1" data-palette-variation="1" data-color-signal="0"><!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns break-align-left break-align-right alignwide"><!-- wp:column -->
<div class="wp-block-column break-align-left break-align-right"><!-- wp:query {"queryId":6,"query":{"offset":0,"postType":"post","categoryIds":[],"tagIds":[],"order":"desc","orderBy":"date","author":"","search":"","sticky":"","perPage":"1"},"displayLayout":{"type":"list","columns":3},"align":"wide","layout":{"inherit":true}} -->
<div class="wp-block-query break-align-left break-align-right alignwide"><!-- wp:post-template {"align":"wide"} -->
<!-- wp:post-featured-image {"isLink":true,"width":"100%","height":"318px"} /-->

<!-- wp:post-title {"isLink":true,"fontSize":"x-large"} /-->

<!-- wp:post-excerpt /-->

<!-- wp:post-date {"format":"F j, Y","isLink":true,"fontSize":"small"} /-->
<!-- /wp:post-template --></div>
<!-- /wp:query --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column break-align-left break-align-right"><!-- wp:query {"queryId":7,"query":{"offset":"1","postType":"post","categoryIds":[],"tagIds":[],"order":"desc","orderBy":"date","author":"","search":"","sticky":"","perPage":"1"},"displayLayout":{"type":"list","columns":3},"align":"wide","layout":{"inherit":true}} -->
<div class="wp-block-query break-align-left break-align-right alignwide"><!-- wp:post-template {"align":"wide"} -->
<!-- wp:spacer {"height":64} -->
<div style="height:64px" aria-hidden="true" class="wp-block-spacer break-align-left break-align-right"></div>
<!-- /wp:spacer -->

<!-- wp:post-featured-image {"isLink":true,"width":"100%","height":"318px"} /-->

<!-- wp:post-title {"isLink":true,"fontSize":"x-large"} /-->

<!-- wp:post-excerpt /-->

<!-- wp:post-date {"format":"F j, Y","isLink":true,"fontSize":"small"} /-->
<!-- /wp:post-template --></div>
<!-- /wp:query --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column break-align-left break-align-right"><!-- wp:query {"queryId":8,"query":{"offset":"2","postType":"post","categoryIds":[],"tagIds":[],"order":"desc","orderBy":"date","author":"","search":"","sticky":"","perPage":"1"},"displayLayout":{"type":"list","columns":3},"align":"wide","layout":{"inherit":true}} -->
<div class="wp-block-query break-align-left break-align-right alignwide"><!-- wp:post-template {"align":"wide"} -->
<!-- wp:spacer {"height":128} -->
<div style="height:128px" aria-hidden="true" class="wp-block-spacer break-align-left break-align-right"></div>
<!-- /wp:spacer -->

<!-- wp:post-featured-image {"isLink":true,"width":"100%","height":"318px"} /-->

<!-- wp:post-title {"isLink":true,"fontSize":"x-large"} /-->

<!-- wp:post-excerpt /-->

<!-- wp:post-date {"format":"F j, Y","isLink":true,"fontSize":"small"} /-->
<!-- /wp:post-template --></div>
<!-- /wp:query --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns break-align-left break-align-right alignwide"><!-- wp:column -->
<div class="wp-block-column break-align-left break-align-right"><!-- wp:query {"queryId":9,"query":{"offset":"3","postType":"post","categoryIds":[],"tagIds":[],"order":"desc","orderBy":"date","author":"","search":"","sticky":"","perPage":"1"},"displayLayout":{"type":"list","columns":3},"align":"wide","layout":{"inherit":true}} -->
<div class="wp-block-query break-align-left break-align-right alignwide"><!-- wp:post-template {"align":"wide"} -->
<!-- wp:post-featured-image {"isLink":true,"width":"100%","height":"318px"} /-->

<!-- wp:post-title {"isLink":true,"fontSize":"x-large"} /-->

<!-- wp:post-excerpt /-->

<!-- wp:post-date {"format":"F j, Y","isLink":true,"fontSize":"small"} /-->
<!-- /wp:post-template --></div>
<!-- /wp:query --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column break-align-left break-align-right"><!-- wp:query {"queryId":10,"query":{"offset":"4","postType":"post","categoryIds":[],"tagIds":[],"order":"desc","orderBy":"date","author":"","search":"","sticky":"","perPage":"1"},"displayLayout":{"type":"list","columns":3},"align":"wide","layout":{"inherit":true}} -->
<div class="wp-block-query break-align-left break-align-right alignwide"><!-- wp:post-template {"align":"wide"} -->
<!-- wp:spacer {"height":96} -->
<div style="height:96px" aria-hidden="true" class="wp-block-spacer break-align-left break-align-right"></div>
<!-- /wp:spacer -->

<!-- wp:post-featured-image {"isLink":true,"width":"100%","height":"318px"} /-->

<!-- wp:post-title {"isLink":true,"fontSize":"x-large"} /-->

<!-- wp:post-excerpt /-->

<!-- wp:post-date {"format":"F j, Y","isLink":true,"fontSize":"small"} /-->
<!-- /wp:post-template --></div>
<!-- /wp:query --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column break-align-left break-align-right"><!-- wp:query {"queryId":11,"query":{"offset":"5","postType":"post","categoryIds":[],"tagIds":[],"order":"desc","orderBy":"date","author":"","search":"","sticky":"","perPage":"1"},"displayLayout":{"type":"list","columns":3},"align":"wide","layout":{"inherit":true}} -->
<div class="wp-block-query break-align-left break-align-right alignwide"><!-- wp:post-template {"align":"wide"} -->
<!-- wp:spacer {"height":160} -->
<div style="height:160px" aria-hidden="true" class="wp-block-spacer break-align-left break-align-right"></div>
<!-- /wp:spacer -->

<!-- wp:post-featured-image {"isLink":true,"width":"100%","height":"318px"} /-->

<!-- wp:post-title {"isLink":true,"fontSize":"x-large"} /-->

<!-- wp:post-excerpt /-->

<!-- wp:post-date {"format":"F j, Y","isLink":true,"fontSize":"small"} /-->
<!-- /wp:post-template --></div>
<!-- /wp:query --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns break-align-left break-align-right alignwide"><!-- wp:column -->
<div class="wp-block-column break-align-left break-align-right"><!-- wp:query {"queryId":12,"query":{"offset":"6","postType":"post","categoryIds":[],"tagIds":[],"order":"desc","orderBy":"date","author":"","search":"","sticky":"","perPage":"1"},"displayLayout":{"type":"list","columns":3},"align":"wide","layout":{"inherit":true}} -->
<div class="wp-block-query break-align-left break-align-right alignwide"><!-- wp:post-template {"align":"wide"} -->
<!-- wp:spacer {"height":32} -->
<div style="height:32px" aria-hidden="true" class="wp-block-spacer break-align-left break-align-right"></div>
<!-- /wp:spacer -->

<!-- wp:post-featured-image {"isLink":true,"width":"100%","height":"318px"} /-->

<!-- wp:post-title {"isLink":true,"fontSize":"x-large"} /-->

<!-- wp:post-excerpt /-->

<!-- wp:post-date {"format":"F j, Y","isLink":true,"fontSize":"small"} /-->
<!-- /wp:post-template --></div>
<!-- /wp:query --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column break-align-left break-align-right"><!-- wp:query {"queryId":14,"query":{"offset":"7","postType":"post","categoryIds":[],"tagIds":[],"order":"desc","orderBy":"date","author":"","search":"","sticky":"","perPage":"1"},"displayLayout":{"type":"list","columns":3},"align":"wide","layout":{"inherit":true}} -->
<div class="wp-block-query break-align-left break-align-right alignwide"><!-- wp:post-template {"align":"wide"} -->
<!-- wp:spacer {"height":160} -->
<div style="height:160px" aria-hidden="true" class="wp-block-spacer break-align-left break-align-right"></div>
<!-- /wp:spacer -->

<!-- wp:post-featured-image {"isLink":true,"width":"100%","height":"318px"} /-->

<!-- wp:post-title {"isLink":true,"fontSize":"x-large"} /-->

<!-- wp:post-excerpt /-->

<!-- wp:post-date {"format":"F j, Y","isLink":true,"fontSize":"small"} /-->
<!-- /wp:post-template --></div>
<!-- /wp:query --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column break-align-left break-align-right"><!-- wp:query {"queryId":13,"query":{"offset":"8","postType":"post","categoryIds":[],"tagIds":[],"order":"desc","orderBy":"date","author":"","search":"","sticky":"","perPage":"1"},"displayLayout":{"type":"list","columns":3},"align":"wide","layout":{"inherit":true}} -->
<div class="wp-block-query break-align-left break-align-right alignwide"><!-- wp:post-template {"align":"wide"} -->
<!-- wp:spacer {"height":96} -->
<div style="height:96px" aria-hidden="true" class="wp-block-spacer break-align-left break-align-right"></div>
<!-- /wp:spacer -->

<!-- wp:post-featured-image {"isLink":true,"width":"100%","height":"318px"} /-->

<!-- wp:post-title {"isLink":true,"fontSize":"x-large"} /-->

<!-- wp:post-excerpt /-->

<!-- wp:post-date {"format":"F j, Y","isLink":true,"fontSize":"small"} /-->
<!-- /wp:post-template --></div>
<!-- /wp:query --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->',
);
