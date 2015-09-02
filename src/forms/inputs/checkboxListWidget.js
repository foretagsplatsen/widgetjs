define([
	'../selectionWidget',
	'./checkboxWidget'
], function (selectionWidget, checkboxWidget) {

	/**
	 * One or more checkboxes.
	 *
	 * @param [spec] selectionWidget spec
	 * @param my
	 * @returns {*}
	 */
	function checkboxListWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		spec.isMultipleSelect = true;

		/** @typedef {selectionWidget} checkboxListWidget */
		var that = selectionWidget(spec, my);

		return that;
	}

	return checkboxListWidget;
});