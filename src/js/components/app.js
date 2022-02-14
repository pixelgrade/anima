import $ from 'jquery';

import { debounce, toggleLightClasses, getFirstBlock } from '../utils';

import GlobalService from './globalService';
import Hero from './hero';
import CommentsArea from './commentsArea';
import Navbar from './navbar';
import SearchOverlay from './search-overlay';
import HeaderTemplate from './header-template';

export default class App {

  constructor () {
//    new HeaderTemplate();

    this.initializeHero();
    this.toggleSMLightDarkClasses();

    this.navbar = new Navbar();
    this.searchOverlay = new SearchOverlay();

    this.initializeImages();
    this.initializeCommentsArea();
    this.initializeReservationForm();
  }


  initializeImages() {
    const showLoadedImages = this.showLoadedImages.bind( this );
    showLoadedImages();

    GlobalService.registerObserverCallback( function( mutationList ) {
      $.each( mutationList, ( i, mutationRecord ) => {
        $.each( mutationRecord.addedNodes, ( j, node ) => {
          const nodeName = node.nodeName && node.nodeName.toLowerCase();
          if ( 'img' === nodeName || node.childNodes.length ) {
            showLoadedImages( node );
          }
        } );
      } );
    } );
  }

  toggleSMLightDarkClasses() {
    const wrappers = document.querySelectorAll( '[class*="sm-palette"]' );

    wrappers.forEach( toggleLightClasses );
  }

  initializeReservationForm () {
    GlobalService.registerObserverCallback( function ( mutationList ) {
      $.each( mutationList, ( i, mutationRecord ) => {
        $.each( mutationRecord.addedNodes, ( j, node ) => {
          const $node = $( node );
          if ( $node.is( '#ot-reservation-widget' ) ) {
            $node.closest( '.novablocks-opentable' ).addClass( 'is-loaded' );
          }
        } );
      } );
    } );
  }

  showLoadedImages ( container = document.body ) {
    const $images = $( container ).find( 'img' ).not( '[srcset], .is-loaded, .is-broken' );

    $images.imagesLoaded().progress( ( instance, image ) => {
      const className = image.isLoaded ? 'is-loaded' : 'is-broken';
      $( image.img ).addClass( className );
    } );
  }

  initializeHero () {
    const heroElements = document.getElementsByClassName( 'novablocks-hero' );
    const heroElementsArray = Array.from( heroElements );

    this.HeroCollection = heroElementsArray.map( element => new Hero( element ) );
    this.firstHero = heroElementsArray[0];
  }

  initializeCommentsArea () {
    const $commentsArea = $( '.comments-area' );

    if ( $commentsArea.length ) {
      this.commentsArea = new CommentsArea( $commentsArea.get( 0 ) );
    }
  }
}
