// Explains the Bottom action bar where it is chosen: next to the block style
// picker, a note says when visitors see it, or warns that it only works in
// the Footer template part.

const {
  hasBottomActionBarStyle,
  isInFooterTemplatePart,
} = require( './bottom-action-bar-context.js' );

const { createElement: el, Fragment } = wp.element;
const { __ } = wp.i18n;

const useIsInFooterTemplatePart = ( clientId ) => {
  return wp.data.useSelect( ( select ) => {
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
  }, [ clientId ] );
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
