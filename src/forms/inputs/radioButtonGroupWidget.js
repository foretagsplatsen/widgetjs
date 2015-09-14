define([
	'../selectionWidget'
], function (selectionWidget) {

	/**
	 * One (two make more sense) or more radio buttons.
	 *
	 * @example
	 * 	 * var genderPicker = radioButtonGroupWidget({
	 * 		value: 'male',
	 * 		controls: ['male', 'female'].map(function(gender) {
	 * 			return radioButtonWidget({value: gender});
	 	* 	});
	 * });
	 *
	 * @param [spec] selectionWidget spec
	 * @param my
	 * @returns {*}
	 */
	function radioButtonGroupWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		/** @typedef {selectionWidget} radioButtonGroupWidget */
		var that = selectionWidget(spec, my);

		return that;
	}

	return radioButtonGroupWidget;
});