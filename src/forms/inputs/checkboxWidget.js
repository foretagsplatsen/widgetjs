define(['../selectableControlWidget'],
	function (selectableControlWidget) {

		/**
		 * Checkboxes let a user select ZERO or MORE options
		 * of a limited number of choices.
		 *
		 * @param [spec] selectableControlWidget spec
		 * @param [my]
		 * @returns {checkboxWidget}
		 */
		function checkboxWidget(spec, my) {
			spec = spec || {};
			my = my || {};

			/** @typedef {selectableControlWidget} checkboxWidget */
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

			//TODO: Exactly the same render code as radio button except type checkbox

			that.renderContentOn = function (html) {
				var el = html.input({
						type: 'checkbox',
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

		return checkboxWidget;
	}
);