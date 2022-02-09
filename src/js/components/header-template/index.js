import $ from "jquery";
import { debounce, getFirstBlock } from "../../utils";
import GlobalService from "../globalService";
import Header from "./header";
import PromoBar from "./promo-bar";

const applyPaddingTopToTargets = ( $targets, extraPaddingTop ) => {
  $targets.each( ( i, target ) => {
    const $target = $( target );
    const paddingTop = getPaddingTop( $target );
    $target.css( 'paddingTop', paddingTop + extraPaddingTop );
  } );
};

const getPaddingTop = ( $element ) => {
  return parseInt( $element.css( 'paddingTop', '' ).css( 'paddingTop' ), 10 ) || 0;
};

export default class HeaderTemplate {

  constructor() {
    this.adminBar = document.getElementById( 'wpadminbar' );
    this.enableFirstBlockPaddingTop = $( 'body' ).hasClass( 'has-novablocks-header-transparent' );
    this.adminBarFixed = false;
    this.promoBarFixed = false;
    this.adminBarHeight = 0;
    this.updateAdminBarProps();

    this.onStickyHeaderResize = debounce( stickyHeaderHeight => {
      document.documentElement.style.setProperty( '--theme-sticky-header-height', `${ stickyHeaderHeight }px` );
    }, 100 );

    this.initializeHeader();
    this.initializePromoBar();

    GlobalService.registerOnDeouncedResize( this.onResize.bind( this ) );
  }

  onResize() {
    this.updateAdminBarProps();
    this.updatePromoBarProps();

    if ( !!this.promoBar ) {
      this.promoBar.offset = this.adminBarHeight;
      this.promoBar.update();
    } else {
      this.onPromoBarUpdate();
    }

    if ( this?.header?.mobileHeader ) {
      this.header.mobileHeader.top = this.adminBarHeight;
    }
  }

  initializeHeader() {
    const header = document.querySelector( '.novablocks-header' );
    const stickyHeader = document.querySelector( '.novablocks-header--sticky' );

    if ( stickyHeader ) {
      const resizeObserver = new ResizeObserver( entries => {
        this.onStickyHeaderResize( stickyHeader.offsetHeight );
      } );

      resizeObserver.observe( stickyHeader );
    }

    if ( !!header ) {
      this.header = new Header( header, {
        onResize: () => {
          requestAnimationFrame( this.onHeaderUpdate.bind( this ) );
        }
      } );
    }
  }

  onHeaderUpdate() {

    if ( !this.enableFirstBlockPaddingTop ) {
      return false;
    }

    const promoBarHeight = this.promoBar?.height || 0;
    const headerHeight = this.header?.getHeight() || 0;
    const $body = $( 'body' );

    document.documentElement.style.setProperty( '--theme-header-height', `${ headerHeight }px` );

    if ( !$body.is( '.has-no-spacing-top' ) ) {
      $body.find( '.site-content' ).css( 'marginTop', `${ promoBarHeight + headerHeight }px` );
    } else {
      const content = document.querySelector( '.site-main .hentry' );
      const firstBlock = getFirstBlock( content );
      const $firstBlock = $( firstBlock );

      if ( $firstBlock.is( '.supernova' ) ) {
        const attributes = $firstBlock.data();
        const $header = $firstBlock.find( '.nb-collection__header' );

        let $targets = $firstBlock;

        if ( !$header.length && attributes.imagePadding === 0 && attributes.cardLayout === 'stacked' ) {
          $targets = $firstBlock.find( '.supernova-item__inner-container' );

          if ( attributes.layoutStyle !== 'carousel' ) {
            $targets = $targets.first();
          }
        }

        applyPaddingTopToTargets( $targets, headerHeight + promoBarHeight );
        return;
      }

      if ( $firstBlock.is( '.novablocks-hero, .novablocks-slideshow' ) ) {
        const $targets = $firstBlock.find( '.novablocks-doppler__foreground' );
        applyPaddingTopToTargets( $targets, headerHeight + promoBarHeight );
        return;
      }

      applyPaddingTopToTargets( $firstBlock, headerHeight + promoBarHeight );
    }
  }

  initializePromoBar() {
    const promoBar = document.querySelector( '.promo-bar' );

    if ( !promoBar ) {
      this.onPromoBarUpdate();
      return;
    }

    this.promoBar = new PromoBar( promoBar, {
      offset: this.adminBarHeight,
      onUpdate: this.onPromoBarUpdate.bind( this )
    } );

    this.updatePromoBarProps();
  }

  updatePromoBarProps() {

    if ( !this.promoBar ) {
      return;
    }

    const promoBarStyle = window.getComputedStyle( this.promoBar.element );
    this.promoBarFixed = promoBarStyle.getPropertyValue( 'position' ) === 'fixed';
  }

  onPromoBarUpdate() {
    const header = this.header;
    const HeroCollection = this.HeroCollection;
    const promoBarHeight = !!this.promoBar ? this.promoBar.height : 0;

    const adminBarTop = this.adminBarFixed ? this.adminBarHeight : 0;
    const promoBarTop = this.promoBarFixed ? promoBarHeight : 0;
    const stickyDistance = adminBarTop + promoBarTop;
    const staticDistance = this.adminBarHeight + promoBarHeight;

    document.documentElement.style.setProperty( '--theme-sticky-distance', `${ stickyDistance }px` );

    if ( !!header ) {
      header.stickyDistance = stickyDistance;
      header.staticDistance = staticDistance;
      header.render( true );

      header.mobileHeader.stickyDistance = stickyDistance;
      header.mobileHeader.staticDistance = staticDistance;
      header.mobileHeader.render( true );
    }

//    HeroCollection.forEach( hero => {
//      hero.offset = promoBarHeight;
//      hero.updateOnScroll();
//    } );

    this.onHeaderUpdate();
  }

  updateAdminBarProps () {

    if ( !this.adminBar ) {
      return;
    }

    this.adminBarHeight = this.adminBar.offsetHeight;
    const adminBarStyle = window.getComputedStyle( this.adminBar );
    this.adminBarFixed = adminBarStyle.getPropertyValue( 'position' ) === 'fixed';
  }
}
