define(['../selectionWidget', './optionWidget'],
	function (selectionWidget, optionWidget) {

		/**
		 * A HTML SELECT element. Represents a control that presents a menu of options.
		 * The options within the menu are represented by option elements, which
		 * can be grouped by optionGroup elements
		 *
		 * @param spec
		 * @param my
		 * @returns {selectWidget}
		 */
		function selectWidget (spec, my) {
			spec = spec || {};
			my = my || {};

			spec.isMultipleSelect = spec.isMultipleSelect || false;

			/** @typedef {optionSetWidget} selectWidget */
			var that = selectionWidget(spec, my);


			// Public API

			that.getControls = function() {
				return my.getAllOptions(); // including those in option groups
			};


			// Protected API

			my.getAllOptions = function() {
				return my.controls.reduce(function(options, item) {
					// group
					if(item.getControls) {
						return options.concat(item.getControls());
					}

					return options.concat([item]);
				},[]);
			};

			// Render

			that.renderOn = function(html) {
				var el = html.select({
					id: that.getId()},
					my.controls
				);

				if(name) {
					el.setAttribute('name', name);
				}

				if(my.isMultipleSelect) {
					el.setAttribute('multiple');
				}

				el.change(function () {
					var identifiersOfSelectedOptions = Array.prototype.slice.call(this.selectedOptions)
						.map(function(option) {
							return option.id;
						});

					var selected = that.getControls().filter(function(option) {
						return identifiersOfSelectedOptions.indexOf(option.getId()) >= 0;
					});

					var selectedValues = selected.map(function(control) {
						return control.getValue();
					});

					var value = my.isMultipleSelect ? selectedValues : selectedValues[0];
					that.setValue(value);
				});
			};

			that.update = function() {
				that.getControls().forEach(function(control) {
					control.update();
				});

			};

			return that;
		}

		return selectWidget;
	}
);