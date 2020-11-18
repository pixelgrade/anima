/**
 * Started from this wonderful solution provided by Weston Ruter: https://gist.github.com/westonruter/7f2b9c18113f0576a72e0aca3ce3dbcb
 */

(function () {

	// Augment each menu item control once it is added and embedded.
	wp.customize.control.bind( 'add', ( control ) => {
		if ( control.extended( wp.customize.Menus.MenuItemControl ) ) {
			control.deferred.embedded.done( () => {
				extendControl( control );
			} );
		}
	} );

	/**
	 * Extend the control with our custom fields information.
	 *
	 * @param {wp.customize.Menus.MenuItemControl} control
	 */
	function extendControl( control ) {
		if ( control.container.find( '.field-visual_style' ).length < 1 ) {
			return;
		}

		control.visualStyleField = control.container.find( '.field-visual_style' );

		// Update the UI state when the setting changes programmatically.
		control.setting.bind( () => {
			updateControlFields( control );
		} );

		// Update the setting when the inputs are modified.
		control.visualStyleField.find( 'select' ).on( 'change', function () {
			setSettingVisualStyle( control.setting, this.value );
		} );

		// Set the initial UI state.
		let initialVisualStyle = updateControlFields( control );

		// Update the initial setting value.
		setSettingVisualStyle( control.setting, initialVisualStyle );
	}

	/**
	 * Extend the setting with roles information.
	 *
	 * @param {wp.customize.Setting} setting
	 * @param {string} visual_style
	 */
	function setSettingVisualStyle( setting, visual_style ) {
		setting.set(
			Object.assign(
				{},
				_.clone( setting() ),
				{ visual_style }
			)
		);
	}

	/**
	 * Apply the control's setting value to the control's fields (or the default value if that's the case).
	 *
	 * @param {wp.customize.Menus.MenuItemControl} control
	 */
	function updateControlFields( control ) {
		const defaultVisualStyle = control.visualStyleField.find( 'select' ).data('default') || 'label_icon';
		const visualStyle = control.setting().visual_style || defaultVisualStyle;

		control.visualStyleField.find( 'select' ).val(visualStyle);

		return visualStyle;
	}
})();
