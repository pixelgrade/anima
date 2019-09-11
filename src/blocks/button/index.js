wp.domReady( () => {

	wp.blocks.unregisterBlockStyle( 'core/button', 'outline' );
	wp.blocks.unregisterBlockStyle( 'core/button', 'squared' );
	wp.blocks.unregisterBlockStyle( 'core/button', 'default' );

	wp.blocks.registerBlockStyle( 'core/button', {
		name: 'primary',
		label: 'Primary',
	} );

	wp.blocks.registerBlockStyle( 'core/button', {
		name: 'secondary',
		label: 'Secondary',
	} );

	wp.blocks.registerBlockStyle( 'core/button', {
		name: 'text',
		label: 'Text',
	} );

} );
