define([
	'./controlWidget'
], function (controlWidget) {

	/**
	 * Base for all selectable controls (eg. option, radioButton and checkbox)
	 *
	 * @param [spec] controlWidget spec
	 * @param {string|function} spec.label - Text to display.
	 * @param {boolean|function} [spec.iSelected=false] - Indicates that the option is selected.
	 * @param [my={}]
	 * @returns {selectableControlWidget}
	 */
	function selectableControlWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		my.isSelected = spec.isSelected || false;

		/** @typedef {controlWidget} selectableControlWidget */
		var that = controlWidget(spec, my);

		that.onSelectionChange =  my.events.createEvent('selectionChange');

		// Public

		that.isSelected = function() {
			return my.isSelected;
		};

		that.setSelected = function(isSelected) {
			if(my.isSelected === isSelected) {
				return;
			}

			my.isSelected = isSelected;
			that.onSelectionChange.trigger(my.isSelected);
			that.update();
		};

		return that;
	}

	return selectableControlWidget;
});