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

		var eventBindings = [];

		my.isMultipleSelect = spec.isMultipleSelect;
		my.controls = spec.controls || [];

		var  ignoreEvents = false;
		observeControls(my.controls);

		// Public

		that.getValue = function() {
			var selection = that.getSelectedValues();

			if(!my.isMultipleSelect) {
				return selection[0];
			}

			return selection;
		};

		that.setValue = function(newSelection) {
			if(!my.isMultipleSelect) {
				newSelection = [newSelection];
			}

			var previousValue =  that.getValue();
			that.setSelectedValues(newSelection);
			var currentValue =  that.getValue();

			that.onChange.trigger(currentValue, previousValue, that);
			that.update();
		};

		that.getControls = function() {
			return my.controls;
		};

		that.setControls = function(controls) {
			unbindEventBindings();
			my.controls = controls;
			observeControls(my.controls);
		};

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

		that.getSelectedValues = function() {
			return that.getSelectedControls().map(function(control) {
				return control.getValue();
			});
		};

		that.setSelectedValues = function(values) {
			var selected = that.getControls().filter(function(control) {
				return values.indexOf(control.getValue()) >= 0;
			});
			that.setSelectedControls(selected);
		};

		// Protected

		my.updateSelection = function(control) {
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
		};


		// Render

		that.renderOn = function (html) {
			html.render(my.controls);
		};


		// Private

		function unbindEventBindings() {
			eventBindings.forEach(function(binding) {
				binding.unbind();
			});
		}

		function observeControls(controls) {
			unbindEventBindings();

			controls.forEach(function(control) {
				var binding = control.onSelectionChange(function () {
					if(ignoreEvents) {
						return;
					}
					my.updateSelection(control);
				});

				eventBindings.push(binding);
			});
		}

		return that;
	}

	return selectionWidget;
});