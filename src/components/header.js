import GlobalService from "./globalService";
import $ from 'jquery';

const defaults = {
	offsetTargetElement: null,
};

class Header {

	constructor( element, args ) {
		this.element = element;

		this.options = Object.assign( {}, defaults, args );

		this.$header = $( this.element );
		this.$toggle = $( '.c-menu-toggle' );
		this.$toggleWrap = $( '.c-menu-toggle__wrap' );

		this.inversed = ! this.$header.hasClass( 'site-header--normal' );

		this.offset = 0;
		this.scrollOffset = 0;
		this.mobileHeaderHeight = 0;

		this.createMobileHeader();

		this.onResize();
		GlobalService.registerUpdate( this.onResize.bind( this ) );

		this.$header.addClass( 'site-header--fixed site-header--ready' );
	}

	update() {
		this.updatePageOffset();
		this.updateHeaderOffset();
		this.updateMobileHeaderOffset();
	}

	onResize() {
		this.box = this.element.getBoundingClientRect();
		this.scrollOffset = this.getScrollOffset();

		const mobileHeaderHeight = this.$mobileHeader.css( 'height', '' ).outerHeight();
		const toggleHeight = this.$toggleWrap.css( 'height', '' ).outerHeight();

		this.mobileHeaderHeight = Math.max( mobileHeaderHeight, toggleHeight );
		this.visibleHeaderHeight = this.$mobileHeader.is( ':visible' ) ? this.mobileHeaderHeight : this.box.height;
		this.update();
	}

	updateHeaderOffset() {
		this.element.style.marginTop = this.offset + 'px';
	}

	updateMobileHeaderOffset() {

		this.$mobileHeader.css( {
			height: this.mobileHeaderHeight,
			marginTop: this.offset + 'px',
		} );

		$( '.site-header__inner-container' ).css( {
			marginTop: this.mobileHeaderHeight
		} );

		this.$toggleWrap.css( {
			height: this.mobileHeaderHeight,
			marginTop: this.offset + 'px',
		} );
	}

	getScrollOffset() {
		const { adminBarHeight, scrollY } = GlobalService.getProps();
		const { offsetTargetElement } = this.options;

		if ( offsetTargetElement ) {
			const offsetTargetBox = offsetTargetElement.getBoundingClientRect();
			const targetBottom = offsetTargetBox.top + scrollY + offsetTargetBox.height;
			const headerOffset = adminBarHeight + this.offset + this.box.height / 2;
			return targetBottom - headerOffset;
		}

		return 0;
	}

	updatePageOffset() {
		const page = document.getElementById( 'page' );
		page.style.paddingTop = this.visibleHeaderHeight + this.offset + 'px';
	}

	createMobileHeader() {

		if ( this.createdMobileHeader ) {
			return;
		}

		this.$mobileHeader = $( '<div class="site-header--mobile">' );

		$( '.c-branding' ).clone().appendTo( this.$mobileHeader );
		$( '.menu-item--cart' ).clone().appendTo( this.$mobileHeader );

		this.$mobileHeader.insertAfter( this.$toggle );
		this.createdMobileHeader = true;
	}

	render( inversed ) {
		const { scrollY } = GlobalService.getProps();

		if ( inversed !== this.inversed ) {
			this.$header.toggleClass( 'site-header--normal', ! inversed );
			this.inversed = inversed;
		}

		this.$header.toggleClass( 'site-header--scrolled', scrollY > this.scrollOffset );
		this.$mobileHeader.toggleClass( 'site-header--scrolled', scrollY > this.scrollOffset );
	}
}

export default Header;
