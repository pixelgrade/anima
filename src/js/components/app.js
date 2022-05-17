import $ from 'jquery';

import { debounce, getFirstBlock } from '../utils';

import GlobalService from './globalService';
import Hero from './hero';
import CommentsArea from './commentsArea';
import Navbar from './navbar';
import SearchOverlay from './search-overlay';

export default class App {

  constructor() {
    this.initializeHero();

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

  initializeReservationForm() {
    GlobalService.registerObserverCallback( function( mutationList ) {
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

  showLoadedImages( container = document.body ) {
    const $images = $( container ).find( 'img' ).not( '[srcset], .is-loaded, .is-broken' );

    $images.imagesLoaded().progress( ( instance, image ) => {
      const className = image.isLoaded ? 'is-loaded' : 'is-broken';
      $( image.img ).addClass( className );
    } );
  }

  initializeHero() {
    const newHeroesSelector = '.nb-supernova--card-layout-stacked.nb-supernova--1-columns.nb-supernova--align-full';
    const oldHeroesSelector = '.novablocks-hero';
    const heroesSelector = `${ newHeroesSelector }, ${ oldHeroesSelector }`;
    const heroElements = document.querySelectorAll( heroesSelector );
    const heroElementsArray = Array.from( heroElements );

    this.HeroCollection = heroElementsArray.map( element => new Hero( element ) );
    this.firstHero = heroElementsArray[ 0 ];
  }

  initializeCommentsArea() {
    const $commentsArea = $( '.comments-area' );

    if ( $commentsArea.length ) {
      this.commentsArea = new CommentsArea( $commentsArea.get( 0 ) );
    }
  }
}
