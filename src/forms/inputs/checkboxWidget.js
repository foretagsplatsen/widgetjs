define([
	'../selectableControlWidget'
],function (selectableControlWidget) {

	/**
	 * Checkboxes let a user select ZERO or MORE options
	 * of a limited number of choices.
	 *
	 * @example
	 * var isActive = checkbox({value: 'active', selected: true});
	 *
	 * @param {{}} [spec] selectableControlWidget spec
	 * @param [my]
	 * @returns {checkboxWidget}
	 */
	function checkboxWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		/** @typedef {selectableControlWidget} checkboxWidget */
		var that = selectableControlWidget(spec, my);

		//
		// Render
		//

		that.renderContentOn = function (html) {
			var el = html.input({
				type: 'checkbox',
				name: my.name,
				value: that.getValue()
			});

			html.render(my.getLabel());

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

		//
		// Protected
		//

		my.getLabel = function() {
			return my.label || that.getValue();
		};


		return that;
	}

	return checkboxWidget;
});