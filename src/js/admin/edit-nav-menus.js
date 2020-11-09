(function($){

	$(document).ready(function(){

		hide_all_custom_menu_items_url();

	});

	function hide_all_custom_menu_items_url() {

		$('#menu-to-edit').find('.menu-item-custom').each( function(idx,menu_item) {
			hide_custom_menu_item_url(menu_item);
		});
	}

	function hide_custom_menu_item_url(menu_item) {

		let $this = $(menu_item);

		let urlField = $this.find('.edit-menu-item-url').first();

		if ( urlField.val() === '#search' ) {
			$this.find('.field-url').first().hide();
		}
	}


	$( document ).on( 'menu-item-added', function() {
		hide_custom_menu_item_url('#menu-to-edit .menu-item');
	} );

})(jQuery);
