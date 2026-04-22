import $ from 'jquery';

import { debounce, getFirstBlock } from '../utils';

import GlobalService from './globalService';
import Hero from './hero';
import heroInitFilter from './hero-init-filter';
import CommentsArea from './commentsArea';
import Navbar from './navbar';
import SearchOverlay from './search-overlay';
import SiteFrame from './site-frame';
import * as PileParallax from './pile-parallax';
import IntroAnimations from './intro-animations';

export default class App {

  constructor() {
    this.initializeHero();

    this.navbar = new Navbar();
    this.searchOverlay = new SearchOverlay();
    this.siteFrame = new SiteFrame();

    this.initializeImages();
    this.initializeCommentsArea();
    this.initializeReservationForm();
    this.initializeIntroAnimations();
    this.initializePileParallax();
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
    const {
      NEW_HERO_SELECTOR: newHeroesSelector,
      OLD_HERO_SELECTOR: oldHeroesSelector,
      shouldInitializeHero,
    } = heroInitFilter;
    const heroesSelector = `${ newHeroesSelector }, ${ oldHeroesSelector }`;
    const heroElementsArray = Array.from( document.querySelectorAll( heroesSelector ) ).filter( shouldInitializeHero );

    this.HeroCollection = heroElementsArray.map( element => new Hero( element ) );
    this.firstHero = heroElementsArray[ 0 ];
  }

  initializePileParallax() {
    PileParallax.initialize();
    PileParallax.bind();
  }

  initializeIntroAnimations() {
    IntroAnimations.initialize();
    IntroAnimations.bind();
  }

  initializeCommentsArea() {
    const $commentsArea = $( '.comments-area' );

    if ( $commentsArea.length ) {
      this.commentsArea = new CommentsArea( $commentsArea.get( 0 ) );
    }
  }
}
