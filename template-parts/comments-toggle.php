<?php

?>

<input type="checkbox" name="comments-toggle" id="nova-comments-toggle"
       class="c-comments-toggle__checkbox" <?php pixelgrade_comments_toggle_checked_attribute(); ?> />

<label class="c-comments-toggle__label" for="nova-comments-toggle">
    <span class="c-comments-toggle__icon"><?php // pixelgrade_get_component_template_part( Pixelgrade_Blog::COMPONENT_SLUG, 'svg/comments-toggle-icon' ); ?></span>
    <span class="c-comments-toggle__text">
        <?php
        /* translators: 1: the number of comments */
        printf( esc_html( _nx( '%1$s comment', '%1$s comments', get_comments_number(), 'comments title', '__components_txtd' ) ), wp_kses( number_format_i18n( get_comments_number() ), wp_kses_allowed_html() ) );
        ?>
    </span>
</label>
