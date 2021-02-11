(
	function( $, window, undefined ) {

		const $siteHeader = $( '.site-header--main' ),
			$stickyHeader = $( '.site-header--secondary' );

		let stickyHeaderShown = false,
			mainHeaderShouldBeSticky = $('.site-header--main[data-sticky]').length && ! $stickyHeader.length;

		$( window ).on( 'scroll', makeHeaderStickyOnScroll );

		// This function will add .social-menu-item class
		// on menu-items if it's needed.
		function addSocialMenuClass() {
			const menuItem = document.querySelectorAll( '.site-header__menu .menu-item a' );
			const bodyStyle = window.getComputedStyle( document.documentElement );
			const enableSocialIconsProp = bodyStyle.getPropertyValue( '--enable-social-icons' );
			const enableSocialIcons = !! parseInt( enableSocialIconsProp, 10 );

			if ( enableSocialIcons ) {

				menuItem.forEach( function( obj, index ) {
					const elementStyle = window.getComputedStyle( obj );
					const elementIsSocialProp = elementStyle.getPropertyValue( '--is-social' );
					const elementIsSocial = !! parseInt( elementIsSocialProp, 10 );

					if ( elementIsSocial ) {
						obj.parentElement.classList.add( 'social-menu-item' );
					}
				} );
			}
		}

		addSocialMenuClass();

		// We are using this function when
		// header layout is simple (one-row).
		function makeHeaderStickyOnScroll() {

			let windowScrollY = window.scrollY,
				mainHeaderIsSticky = windowScrollY > 1;

			if ( mainHeaderShouldBeSticky && mainHeaderIsSticky !== stickyHeaderShown ) {
				$siteHeader.toggleClass( 'site-header--sticky' );
				stickyHeaderShown = mainHeaderIsSticky;
			}
		}
	}
)( jQuery, window );
