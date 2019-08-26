import './style.scss';

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

const Separator = ( props ) => {
	let classes = 'c-separator';
	classes = props.className ? classes + ` ${ props.className }` : classes;

	return (
		<div className={ classes }>
			<div className="c-separator__arrow c-separator__arrow--left"></div>
			<div className="c-separator__line c-separator__line--left"></div>
			<div className="c-separator__flower">&#10043;</div>
			<div className="c-separator__line c-separator__line--right"></div>
			<div className="c-separator__arrow c-separator__arrow--right"></div>
		</div>
	);
}

const replaceSeparatorEdit = wp.compose.createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( 'core/separator' === props.name ) {
			return <Separator className={ props.attributes.className } />;
		} else {
			return <BlockEdit { ...props } />;
		}
	}
}, "replaceSeparatorEdit" );
wp.hooks.addFilter( 'editor.BlockEdit', 'nova-theme/separator', replaceSeparatorEdit );

const replaceSeparatorSave = ( element, blockType, attributes ) => {
	if ( 'core/separator' === blockType.name ) {
		return <Separator className={ attributes.className } />;
	} else {
		return element;
	}
}
wp.hooks.addFilter( 'blocks.getSaveElement', 'nova-theme/separator', replaceSeparatorSave );
