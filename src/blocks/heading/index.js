import './style.scss';

wp.domReady( () => {

	wp.blocks.registerBlockStyle( 'core/heading', {
		name: 'alternate',
		label: 'Alternate',
	} );

} );

const replaceSeparatorEdit = wp.compose.createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( 'core/heading' === props.name ) {
			console.log( props );
		}
		return <BlockEdit { ...props } />;
	}
}, "replaceSeparatorEdit" );
wp.hooks.addFilter( 'editor.BlockEdit', 'nova-theme/separator', replaceSeparatorEdit );

const replaceSeparatorSave = ( element, blockType, attributes ) => {
	if ( 'core/heading' === blockType.name ) {
		console.log( element, attributes );
	}
	return element;
}
wp.hooks.addFilter( 'blocks.getSaveElement', 'nova-theme/separator', replaceSeparatorSave );