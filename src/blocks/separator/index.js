wp.domReady( () => {

	wp.blocks.unregisterBlockStyle( 'core/separator', 'wide' );
	wp.blocks.unregisterBlockStyle( 'core/separator', 'dots' );

	wp.blocks.registerBlockStyle( 'core/separator', {
		name: 'line-flower',
		label: 'Line with Flower',
	} );

	wp.blocks.registerBlockStyle( 'core/separator', {
		name: 'flower',
		label: 'Flower',
	} );

} );
