wp.domReady( () => {

	wp.blocks.unregisterBlockStyle( 'core/button', 'outline' );
	wp.blocks.unregisterBlockStyle( 'core/button', 'squared' );

	wp.blocks.registerBlockStyle( 'core/button', {
		name: 'text',
		label: 'Text',
	} );

} );