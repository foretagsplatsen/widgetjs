define([
	'../selectionWidget'
], function (selectionWidget) {

	/**
	 * One or more checkboxes.
	 *
	 * @example
	 * var roles = checkboxGroupWidget({
	 * 		value: ['user', 'admin'],
	 * 		controls: ['user', 'admin', 'editor'].map(function(role) {
	 * 			return checkbox({value: role});
	 * 		})
	 * });
	 *
	 * @param {{}} [spec] selectionWidget spec
	 * @param [my]
	 * @returns {checkboxGroupWidget}
	 */
	function checkboxGroupWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		spec.isMultipleSelect = true;

		/** @typedef {selectionWidget} checkboxGroupWidget */
		var that = selectionWidget(spec, my);

		return that;
	}

	return checkboxGroupWidget;
});