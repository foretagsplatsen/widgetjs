define([
	'./controlWidget',
	'./bindings'
], function (controlWidget, bindings) {

	/**
	 * Base for all selectable controls (eg. option, radioButton and checkbox)
	 *
	 * @param [spec] controlWidget spec
	 * @param {boolean} [spec.iSelected=false] - Indicates that the option is selected.
	 * @param {{}} [spec.isSelectedBinding] - Binding object that expose a `accessor` and `mutator` method.
	 * @param {string} [spec.label] - Text to display.
	 * @param [my]
	 * @returns {selectableControlWidget}
	 */
	function selectableControlWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		var isSelected = spec.isSelectedBinding || bindings.value(spec.isSelected);

		/** @typedef {controlWidget} selectableControlWidget */
		var that = controlWidget(spec, my);

		that.onSelectionChange =  my.events.createEvent('selectionChange');

		//
		// Public
		//

		that.isSelected = function() {
			return isSelected.accessor();
		};

		that.setSelected = function(newValue) {
			if(that.isSelected() === newValue) {
				return;
			}

			isSelected.mutator(newValue);
			that.onSelectionChange.trigger(that.isSelected());
			that.update();
		};

		that.setSelectedBinding = function(newBinding) {
			isSelected = newBinding;
			that.update();
		};

		return that;
	}

	return selectableControlWidget;
});