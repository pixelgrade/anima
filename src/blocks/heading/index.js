wp.domReady( () => {

	wp.blocks.registerBlockStyle( 'core/heading', {
		name: 'default',
		label: 'Default',
	} );

	wp.blocks.registerBlockStyle( 'core/heading', {
		name: 'alternate',
		label: 'Alternate',
	} );

} );