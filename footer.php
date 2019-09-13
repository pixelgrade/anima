

	</div><!-- #content -->

	<?php if ( function_exists( 'block_areas' ) ) { ?>
		<?php block_areas()->render( 'footer' );
	} else {
		get_template_part( 'template-parts/site-footer' );
	} ?>

</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
