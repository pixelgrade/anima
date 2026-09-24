// Bottom action bar in the editor: the style is only offered for a Group in
// the Footer template part, and a note on the selected bar says when visitors
// see it (or warns, for a bar left outside the Footer, that it only works
// there).

const {
  hasBottomActionBarStyle,
  isInFooterTemplatePart,
  shouldOfferBottomActionBarStyle,
  createStyleOfferSync,
} = require( './bottom-action-bar-context.js' );

const STYLE_NAME = 'bottom-action-bar';

const { createElement: el, Fragment } = wp.element;
const { __ } = wp.i18n;

const selectIsInFooterTemplatePart = ( select, clientId ) => {
  const blockEditor = select( 'core/block-editor' );
  const core = select( 'core' );
  const editor = select( 'core/editor' );
  const stylesheet = core.getCurrentTheme?.()?.stylesheet;

  return isInFooterTemplatePart( {
    parentBlocks: blockEditor.getBlockParents( clientId ).map( id => blockEditor.getBlock( id ) ),
    getTemplatePartArea: ( { area, slug, theme } ) => {
      if ( area ) {
        return area;
      }

      const record = slug && core.getEditedEntityRecord( 'postType', 'wp_template_part', `${ theme || stylesheet }//${ slug }` );

      return record?.area;
    },
    editedPostType: editor?.getCurrentPostType?.(),
    editedArea: editor?.getEditedPostAttribute?.( 'area' ),
  } );
};

const useIsInFooterTemplatePart = ( clientId ) => {
  return wp.data.useSelect( ( select ) => selectIsInFooterTemplatePart( select, clientId ), [ clientId ] );
};

const BottomActionBarNotice = ( { clientId } ) => {
  const inFooter = useIsInFooterTemplatePart( clientId );
  const { InspectorControls } = wp.blockEditor;
  const { Notice } = wp.components;

  const message = inFooter
    ? __( 'Visitors see this bar pinned to the bottom of the screen below 1024px, together with the mobile menu. It is hidden on wider screens. Only the first bar in the footer is shown.', '__theme_txtd' )
    : __( 'The bottom action bar only works in the Footer template part. Here it shows as a regular row of buttons.', '__theme_txtd' );

  return el(
    InspectorControls,
    null,
    el(
      'div',
      { className: 'anima-bottom-action-bar-notice' },
      el( Notice, { status: inFooter ? 'info' : 'warning', isDismissible: false }, message )
    )
  );
};

const withBottomActionBarNotice = wp.compose.createHigherOrderComponent( ( BlockEdit ) => ( props ) => {
  if ( props.name !== 'core/group' || ! props.isSelected || ! hasBottomActionBarStyle( props.attributes.className ) ) {
    return el( BlockEdit, props );
  }

  return el( Fragment, null, el( BlockEdit, props ), el( BottomActionBarNotice, { clientId: props.clientId } ) );
}, 'withAnimaBottomActionBarNotice' );

wp.hooks.addFilter( 'editor.BlockEdit', 'anima/bottom-action-bar-notice', withBottomActionBarNotice );

// Offer the style only while a Group in the Footer template part is selected.
wp.domReady( () => {
  const style = wp.data.select( 'core/blocks' ).getBlockStyles( 'core/group' ).find( ( { name } ) => name === STYLE_NAME );

  if ( ! style ) {
    return;
  }

  const sync = createStyleOfferSync( {
    offered: true,
    register: () => wp.blocks.registerBlockStyle( 'core/group', style ),
    unregister: () => wp.blocks.unregisterBlockStyle( 'core/group', STYLE_NAME ),
  } );

  const update = () => {
    const select = wp.data.select;
    const clientId = select( 'core/block-editor' ).getSelectedBlockClientId();
    const blockName = clientId && select( 'core/block-editor' ).getBlockName( clientId );

    sync( shouldOfferBottomActionBarStyle( {
      blockName,
      inFooter: blockName === 'core/group' && selectIsInFooterTemplatePart( select, clientId ),
    } ) );
  };

  // Unscoped: the Footer area of a template part can arrive later from core-data.
  update();
  wp.data.subscribe( update );
} );
