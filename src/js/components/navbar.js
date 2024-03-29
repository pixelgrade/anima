import GlobalService from './globalService';
import mqService from './mqService';
import $ from 'jquery';

const MENU_ITEM = '.menu-item, .page_item';
const MENU_ITEM_WITH_CHILDREN = '.menu-item-has-children, .page_item_has_children';
const SUBMENU = '.sub-menu, .children';
const SUBMENU_LEFT_CLASS = 'has-submenu-left';
const HOVER_CLASS = 'hover';

export default class Navbar {

  constructor () {
    this.$menuItems = $( MENU_ITEM );
    this.$menuItemsWithChildren = this.$menuItems.filter( MENU_ITEM_WITH_CHILDREN ).removeClass( HOVER_CLASS );
    this.$menuItemsWithChildrenLinks = this.$menuItemsWithChildren.children( 'a' );

    this.initialize();
  }

  initialize () {
    this.onResize();
    this.initialized = true;
    GlobalService.registerOnDeouncedResize( this.onResize.bind( this ) );
  }

  onResize () {

    // we are on desktop
    if ( !mqService.below.lap ) {
      this.addSubMenusLeftClass();

      if ( this.initialized && !this.desktop ) {
        this.unbindClick();
      }

      if ( !this.initialized || !this.desktop ) {
        this.bindHoverIntent();
      }

      this.desktop = true;
      return;
    }

    this.removeSubMenusLeftClass();

    if ( this.initialized && this.desktop ) {
      this.unbindHoverIntent();
    }

    if ( !this.initialized || this.desktop ) {
      this.bindClick();
    }

    this.desktop = false;
  }

  addSubMenusLeftClass () {
    const { windowWidth } = GlobalService.getProps();

    this.$menuItemsWithChildren.each( function ( index, obj ) {
      const $obj = $( obj );
      const $subMenu = $obj.children( SUBMENU ),
        subMenuWidth = $subMenu.outerWidth(),
        subMenuOffSet = $subMenu.offset(),
        availableSpace = windowWidth - subMenuOffSet.left;

      if ( availableSpace < subMenuWidth ) {
        $obj.addClass( SUBMENU_LEFT_CLASS );
      }
    } );
  }

  removeSubMenusLeftClass () {
    this.$menuItemsWithChildren.removeClass( SUBMENU_LEFT_CLASS );
  }

  onClickMobile ( event ) {
    const $link = $( this );
    const $siblings = $link.parent().siblings().not( $link );

    if ( $link.is( '.active' ) ) {
      return;
    }

    event.preventDefault();

    $link.addClass( 'active' ).parent().addClass( HOVER_CLASS );
    $siblings.removeClass( HOVER_CLASS );
    $siblings.find( '.active' ).removeClass( 'active' );
  }

  bindClick () {
    this.$menuItemsWithChildrenLinks.on( 'click', this.onClickMobile );
  }

  unbindClick () {
    this.$menuItemsWithChildrenLinks.off( 'click', this.onClickMobile );
  }

  bindHoverIntent () {
    this.$menuItems.hoverIntent( {
      out: function () {
        $( this ).removeClass( HOVER_CLASS );
      },
      over: function () {
        $( this ).addClass( HOVER_CLASS );
      },
      timeout: 200
    } );
  }

  unbindHoverIntent () {
    this.$menuItems.off( 'mousemove.hoverIntent mouseenter.hoverIntent mouseleave.hoverIntent' );
    delete this.$menuItems.hoverIntent_t;
    delete this.$menuItems.hoverIntent_s;
  }
}
