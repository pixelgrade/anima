import './style.scss';

wp.domReady( () => {

	wp.blocks.registerBlockStyle( 'core/heading', {
		name: 'alternate',
		label: 'Alternate',
	} );

} );
