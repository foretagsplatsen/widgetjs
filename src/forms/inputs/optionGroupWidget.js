define(['../selectionWidget', './optionWidget'],
	function (selectionWidget, optionWidget) {

		/**
		 * A HTML OPTGROUP - A grouping of options within a select element
		 *
		 * @param my
		 * @returns {optionGroupWidget}
		 */
		function optionGroupWidget(spec, my) {
			spec = spec || {};
			my = my || {};

			spec.widget = spec.widget || optionWidget;

			/** @typedef {selectionWidget} optionGroupWidget */
			var that = selectionWidget(spec, my);

			my.label = spec.label;

			that.onSelectionChange =  my.events.createEvent('selectionChange');

			//TODO: good enough
			that.onChange(function(newValue, oldValue) {
				that.onSelectionChange.trigger(newValue, oldValue);
			});

			// Render

			that.renderOn = function (html) {
				html.optgroup({
						id: that.getId(),
						label: my.label
					},
					my.controls
				);
			};

			return that;
		}

		return optionGroupWidget;
	}
);