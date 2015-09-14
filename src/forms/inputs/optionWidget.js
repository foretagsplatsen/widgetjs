define([
	'../selectableControlWidget'
], function (selectableControlWidget) {

	/**
	 * A HTML OPTION - An item within a optionGroup, select or dataList
	 *
	 * @example
	 * var bmwOption = option({ label: 'Bayerische Motoren Werke ', value: 'bmw' });
	 * var mercedesOption = option({ label: 'Mercedes-Benz', value: 'mercedes', value: true });
	 *
	 * @param {{}} [spec] selectableControlWidget spec
	 * @param [my]
	 * @returns {optionWidget}
	 */
	function optionWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		/** @typedef {selectableControlWidget} optionWidget */
		var that = selectableControlWidget(spec, my);

		//
		// Render
		//

		that.renderOn = function (html) {
			var el = html.option({
					id: that.getId()
				},
				my.label || that.getValue()
			);

			if (that.isSelected()) {
				el.setAttribute('selected', 'selected');
			}
		};

		that.update = function () {
			if (that.isSelected()) {
				that.asJQuery().attr('selected', 'selected');
			} else {
				that.asJQuery().removeAttr('selected');
			}
		};

		return that;
	}

	return optionWidget;
});