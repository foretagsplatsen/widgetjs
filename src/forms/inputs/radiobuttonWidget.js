define([
	'../selectableControlWidget'
], function (selectableControlWidget) {

	/**
	 * A button in a radioButtonList. Radio buttons let a user select
	 * ONLY ONE of a limited number of choices.
	 *
	 * @param spec
	 * @param [my]
	 * @returns {*}
	 */
	function radioButtonWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		my.label = spec.label || '';

		/** @typedef {selectableControlWidget} radioButton */
		var that = selectableControlWidget(spec, my);

		// Protected

		that.update = function () {
			var inputElement = that.asJQuery().find('input');
			if (my.isSelected) {
				inputElement.attr('checked', 'checked');
			} else {
				inputElement.removeAttr('checked');
			}
		};

		// Render

		that.renderContentOn = function (html) {
			var el = html.input({
					type: 'radio',
					name: my.name,
					value: that.getValue()
				}
			);

			html.render(my.label || that.getValue());

			el.click(function () {
				var checked = jQuery(this).is(':checked');
				that.setSelected(checked);
			});

			if (my.isSelected) {
				el.setAttribute('checked', 'checked');
			}
		};

		return that;
	}

	return radioButtonWidget;
}
);