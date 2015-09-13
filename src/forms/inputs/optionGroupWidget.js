define([
	'../../widget'
],function (widget) {

	/**
	 * A HTML OPTGROUP - A grouping of options within a select element
	 *
	 * @param my
	 * @returns {optionGroupWidget}
	 */
	function optionGroupWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		var controls = spec.controls || [];
		var label = spec.label;

		/** @typedef {widget} optionGroupWidget */
		var that = widget(spec, my);

		// Public

		that.getControls = function() {
			return controls;
		};

		// Render

		that.renderOn = function (html) {
			html.optgroup({
					id: that.getId(),
					label: label
				},
				controls
			);
		};

		return that;
	}

	return optionGroupWidget;
});