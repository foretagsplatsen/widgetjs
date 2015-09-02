define(['../selectableControlWidget'],
	function (selectableControlWidget) {

		/**
		 * A HTML OPTION - An item within a optionGroup, select or dataList
		 *
		 * @example
		 * var bmwOption = option({ label: 'Bayerische Motoren Werke ', value: 'bmw' });
		 * var mercedesOption = option({ label: 'Mercedes-Benz', value: 'mercedes', value: true });
		 *
		 * @returns {optionWidget}
		 */
		function optionWidget(spec, my) {
			spec = spec || {};
			my = my || {};

			/** @typedef {selectableControlWidget} optionWidget */
			var that = selectableControlWidget(spec, my);

			// Protected

			that.update = function () {
				if (my.isSelected) {
					that.asJQuery().attr('selected', 'selected');
				} else {
					that.asJQuery().removeAttr('selected');
				}
			};

			// Render

			that.renderOn = function (html) {
				var el = html.option({
						id: that.getId()
					},
					my.label || that.getValue()
				);

				if (my.isSelected) {
					el.setAttribute('selected', 'selected');
				}
			};

			return that;
		}

		return optionWidget;
	}
);