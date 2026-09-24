// Where a Group with the Bottom action bar style sits decides what it does:
// inside the Footer template part it is pinned on phones; anywhere else it
// is a plain row of buttons. Kept free of WordPress globals for node tests.

const STYLE_CLASS = 'is-style-bottom-action-bar';
const FOOTER_AREA = 'footer';

const hasBottomActionBarStyle = ( className ) => {
  return String( className || '' ).split( /\s+/ ).includes( STYLE_CLASS );
};

// `parentBlocks` runs from the root down to the closest parent, as
// `getBlockParents()` returns them.
const isInFooterTemplatePart = ( { parentBlocks = [], getTemplatePartArea, editedPostType, editedArea } ) => {
  const templatePart = [ ...parentBlocks ].reverse().find( block => block && block.name === 'core/template-part' );

  if ( templatePart ) {
    return getTemplatePartArea( templatePart.attributes || {} ) === FOOTER_AREA;
  }

  // Editing the Footer template part itself: its blocks have no template-part parent.
  return editedPostType === 'wp_template_part' && editedArea === FOOTER_AREA;
};

// The style is only offered in the picker for a Group inside the Footer
// template part. Block styles are registered per block type, so the editor
// registers it while such a Group is selected and unregisters it otherwise;
// this keeps that switch idempotent (no churn on every store change).
const shouldOfferBottomActionBarStyle = ( { blockName, inFooter } ) => {
  return blockName === 'core/group' && !! inFooter;
};

const createStyleOfferSync = ( { offered, register, unregister } ) => {
  let current = offered;

  return ( shouldOffer ) => {
    if ( shouldOffer === current ) {
      return;
    }

    current = shouldOffer;

    if ( shouldOffer ) {
      register();
    } else {
      unregister();
    }
  };
};

module.exports = {
  STYLE_CLASS,
  hasBottomActionBarStyle,
  isInFooterTemplatePart,
  shouldOfferBottomActionBarStyle,
  createStyleOfferSync,
};
