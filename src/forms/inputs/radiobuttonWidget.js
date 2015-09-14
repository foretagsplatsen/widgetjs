define([
	'../selectableControlWidget'
], function (selectableControlWidget) {

	/**
	 * A button in a radioButtonList. Radio buttons let a user select
	 * ONLY ONE of a limited number of choices.
	 *
	 * @example
	 * var male = radioButtonWidget({value: 'male', selected: true});
	 * var female = radioButtonWidget({value: 'female'});
	 *
	 * @param {{}} [spec] selectableControlWidget spec
	 * @param [my]
	 * @returns {radioButton}
	 *
	 */
	function radioButtonWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		my.label = spec.label || '';

		/** @typedef {selectableControlWidget} radioButton */
		var that = selectableControlWidget(spec, my);

		//
		// Render
		//

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

			if (that.isSelected()) {
				el.setAttribute('checked', 'checked');
			}
		};

		that.update = function () {
			var inputElement = that.asJQuery().find('input');
			if (that.isSelected()) {
				inputElement.attr('checked', 'checked');
			} else {
				inputElement.removeAttr('checked');
			}
		};


		return that;
	}

	return radioButtonWidget;
}
);