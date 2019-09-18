export default class Navbar {
	constructor( element ) {
		this.element = element;
		this.handleSubMenus();
		this.handleHoverMenuItems();
	}

	handleSubMenus() {
		const menuItemsWithChildren = Array.from(document.querySelectorAll('.menu-item-has-children'));
		const menuItemsWithChildrenLinks = Array.from(document.querySelectorAll('.menu-item-has-children > a'));

		// Make sure there are no open menu items
		menuItemsWithChildren.map(( item ) => {
			item.classList.remove('hover');
		});

		// Add a class so we know the items to handle
		menuItemsWithChildrenLinks.map(( link ) => {
			link.classList.add('prevent-one');
		});

		const prevent = Array.from(document.querySelectorAll('.prevent-one'));

		let getSiblings = function (elem) {
			return Array.prototype.filter.call(elem.parentNode.children, function (sibling) {
				return sibling !== elem;
			});
		};

		function changeClasses(e) {
			e.preventDefault();

			if ( this.classList.contains('active')) {
				window.location.href = this.getAttribute( 'href' );
				return;
			}

			this.classList.remove('active');
			this.classList.add('active');

			let siblings = getSiblings(this.parentNode);

			siblings.map(( sibling ) => {
				sibling.classList.remove('hover');
			});


			this.parentNode.classList.add('hover');
		}

		prevent.forEach(( item ) => {
			item.addEventListener('click', changeClasses);
		});


	}
	handleHoverMenuItems() {

		const menuItems = jQuery('.menu-item');

		function toggleSubMenu() {
			jQuery(this).toggleClass('hover');
		}

		menuItems.hoverIntent(
			{
				out: toggleSubMenu,
				over: toggleSubMenu,
				timeout: 200
			}
		);
	}
}
