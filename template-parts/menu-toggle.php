<?php

global $novablocks_responsive_navigation_outputted;

if ( empty( $novablocks_responsive_navigation_outputted ) ) { ?>

    <input class="c-menu-toggle__checkbox" id="nova-menu-toggle" type="checkbox">

    <label class="c-menu-toggle" for="nova-menu-toggle">
        <span class="c-menu-toggle__wrap">
            <span class="c-menu-toggle__icon">
                <b class="c-menu-toggle__slice c-menu-toggle__slice--top"></b>
                <b class="c-menu-toggle__slice c-menu-toggle__slice--middle"></b>
                <b class="c-menu-toggle__slice c-menu-toggle__slice--bottom"></b>
            </span>
            <span class="c-menu-toggle__label"><?php _e( 'Menu', '__theme_txtd' ); ?></span>
        </span>
    </label>

	<?php $novablocks_responsive_navigation_outputted = true;

}
