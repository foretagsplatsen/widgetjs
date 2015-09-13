define([
	'./controlWidget'
], function (controlWidget) {

	/**
	 * Base for all widgets where you can select one or more
	 * items.
	 *
	 * @param {*} spec
	 * @param my
	 * @returns {controlWidget}
	 */
	function selectionWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		/** @typedef {controlWidget} selectionWidget */
		var that = controlWidget(spec, my);

		my.isMultipleSelect = spec.isMultipleSelect;
		my.controls = spec.controls || [];

		var  ignoreEvents = false;
		observeControls(my.controls);

		// Public

		that.getControls = function() {
			return my.controls;
		};

		that.setControls = function(controls) {
			my.controls = controls;
			observeControls(my.controls);
		};

/*
		that.getSelectedControls = function() {
			return that.getControls().filter(function(control) {
				return control.isSelected();
			});
		};

		that.setSelectedControls = function(controls) {
			ignoreEvents = true;
			that.getControls().forEach(function(control) {
				control.setSelected(controls.indexOf(control) >= 0, true);
			});
			ignoreEvents = false;
		};
*/
		// Protected

	/*	my.updateSelection = function(control) {
			//TODO: clean-up
			var value = control.getValue();

			if(!my.isMultipleSelect) {
				that.setValue(value);
				return;
			}

			var selected = control.isSelected();
			var values = that.getValue().slice();
			var indexOfValue = values.indexOf(value);

			if(selected) {
				if (indexOfValue < 0) {
					values.push(value);
					that.setValue(values);
				}
			} else {
				if (indexOfValue >= 0) {
					values.splice(indexOfValue, 1);
					that.setValue(values);
				}
			}
		};*/


		// Render

		that.renderContentOn = function (html) {
			html.render(my.controls);
		};


		// Private

		//TODO: solution below does not allow methods to be overriden

		function isSelectedValue(value) {
			if(!my.isMultipleSelect) {
				return that.getValue() === value;
			}

			var values = that.getValue() || [];
			return values.indexOf(value) >= 0;
		}

		function selectValue(value) {
			if(!my.isMultipleSelect) {
				that.setValue(value);
				return;
			}

			var values = that.getValue().slice();
			var indexOfValue = values.indexOf(value);

			if (indexOfValue < 0) {
				values.push(value);
				that.setValue(values);
			}
		}

		function deselectValue(value) {
			if(!my.isMultipleSelect) {
				that.setValue(undefined);
				return;
			}

			var values = that.getValue().slice();
			var indexOfValue = values.indexOf(value);
			if (indexOfValue >= 0) {
				values.splice(indexOfValue, 1);
				that.setValue(values);
			}
		}

		function observeControls(controls) {
			controls.forEach(function(control) {
				// Observe grouped controls recursively
				if(control.getControls) {
					observeControls(control.getControls());
					return;
				}

				// Update value when selection change
				control.setSelectedBinding({
					accessor: function () {
						return isSelectedValue(control.getValue());
					},
					mutator: function (selected) {
						if (selected) {
							selectValue(control.getValue());
						} else {
							deselectValue(control.getValue());
						}
					}
				});

			});
		}

		return that;
	}

	return selectionWidget;
});