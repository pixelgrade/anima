<?php
/**
 * Footer with navigation and copyright
 */
return array(
	'title'      => __( 'Footer with navigation and copyright (theme)', '__theme_txtd' ),
	'categories' => array( 'footer' ),
	'blockTypes' => array( 'core/template-part/footer' ),
	'content'    => '<!-- wp:separator {"className":"is-style-blank"} -->
					<div class="wp-block-separator alignnone is-style-blank" style="--nb-emphasis-top-spacing:0;--nb-emphasis-bottom-spacing:0;--nb-block-top-spacing:1;--nb-block-bottom-spacing:0;--nb-block-zindex:0;--nb-card-content-area-width:50%;--nb-card-content-padding-multiplier:0;--nb-card-media-padding-top:100%;--nb-card-media-object-fit:cover;--nb-card-media-padding-multiplier:0;--nb-card-layout-gap-modifier:0;--nb-minimum-container-height:0vh;--nb-spacing-modifier:1">
							<div class="c-separator">
									<div class="c-separator__arrow c-separator__arrow--left"></div>
									<div class="c-separator__line c-separator__line--left"></div>
									<div class="c-separator__symbol">
					                    <span><svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7565 8.5753c1.3088-1.6632 2.3177-2.813 3.0266-3.4492.718-.6453 1.3315-.968 1.8405-.968.4181 0 .7817.1682 1.0907.5045.309.3363.4635.7362.4635 1.1997 0 .6726-.4453 1.2043-1.3361 1.5951-.8907.3908-2.5857.7635-5.0852 1.118zm-2.454-1.4315c-.518-1.2633-.918-2.3585-1.1997-3.2856-.2817-.927-.4226-1.6269-.4226-2.0995 0-.5544.1409-.9861.4226-1.2952C8.3846.1545 8.7754 0 9.2753 0c.518 0 .918.1545 1.1997.4635.2818.309.4226.7408.4226 1.2952 0 .4544-.1408 1.1543-.4226 2.0995-.2727.9362-.6635 2.0314-1.1724 3.2856zm2.454 4.2809c2.4995.3544 4.1945.7271 5.0852 1.1179.8908.3908 1.3361.918 1.3361 1.5815 0 .4726-.1545.877-.4635 1.2133-.309.3272-.6726.4908-1.0907.4908-.509 0-1.1225-.3181-1.8405-.9543-.7089-.6362-1.7178-1.786-3.0266-3.4492zm-.0545-1.4315c0 .6635-.2363 1.2315-.7089 1.7041-.4636.4727-1.027.709-1.6905.709-.6726 0-1.2452-.2318-1.7178-.6953-.4727-.4726-.709-1.0452-.709-1.7178 0-.6544.2363-1.218.709-1.6905.4726-.4727 1.036-.709 1.6905-.709.6635 0 1.2315.2363 1.7041.709.4817.4726.7226 1.036.7226 1.6905zM6.8213 8.5753c-2.4994-.3544-4.1945-.727-5.0852-1.1179C.8454 7.0666.4 6.5349.4 5.8623c0-.4635.1544-.8634.4635-1.1997.309-.3363.6725-.5045 1.0906-.5045.509 0 1.118.3227 1.8269.968.7089.6362 1.7223 1.786 3.0402 3.4492zm2.454 4.2672c.518 1.2725.918 2.3722 1.1997 3.2993.2818.927.4226 1.6269.4226 2.0995 0 .5544-.1408.9861-.4226 1.2952-.2817.309-.6726.4635-1.1724.4635-.5181 0-.918-.1545-1.1998-.4635-.2817-.3091-.4226-.7408-.4226-1.2952 0-.4635.1363-1.1588.409-2.0859.2727-.927.668-2.0313 1.186-3.3129zm-2.454-1.4178c-1.336 1.6996-2.354 2.8584-3.0539 3.4765-.6998.618-1.3042.927-1.8132.927a1.383 1.383 0 0 1-.709-.1908c-.218-.1364-.427-.35-.627-.6408-.0728-.1727-.1273-.3272-.1636-.4635a1.582 1.582 0 0 1-.0546-.409c0-.6635.4454-1.1907 1.336-1.5815.8908-.3908 2.5859-.7635 5.0853-1.1179z" fill="currentColor"/></svg></span>
									</div>
									<div class="c-separator__line c-separator__line--right"></div>
									<div class="c-separator__arrow c-separator__arrow--right"></div>
							</div>
					</div>
					<!-- /wp:separator -->' .
	                anima_footer_get_copyright() .'
	                <!-- wp:novablocks/navigation {"slug":"footer","className":"novablocks-navigation novablocks-navigation\u002d\u002dfooter"} /-->',
);
