define([
	'../widget'
], function(widget) {

	// TODO: convert value

	/**
	 * Base for all input controls.
	 *
	 * @param {*} spec.value - Initial Value.
	 * @param {bool} [spec.isDisabled=false]
	 * @param {string} [spec.name='']
	 * @param {{}} [spec.attributes={}]
	 * @param {{}} [spec.class={}]
	 * @param {{}} [spec.style={}]

	 * @param [my]
	 *
	 * @returns {controlWidget}
	 */
	function controlWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		/** @typedef {widget} controlWidget */
		var that = widget(spec, my);

		// Variables

		my.value = spec.value;
		my.name = spec.name || '';
		my.attributes = spec.attributes || {};
		my.class = spec.class || '';
		my.style = spec.style || '';
		my.isDisabled = spec.isDisabled || {};

		// Public

		that.onChange = my.events.createEvent('change');

		that.getValue = function() {
			return my.value;
		};

		that.setValue = function(newValue) {
			var oldValue = my.value;
			if(oldValue === newValue) {
				return;
			}

			my.value = newValue;
			that.onChange.trigger(newValue, oldValue, that);
			that.update();
		};

		that.bindValue = function(binding) {
			if(binding.mutator) {
				that.onChange(function (newValue) {
					binding.mutator(newValue);
				});
			}

			if(binding.accessor) {
				my.value = binding.accessor();
			}
		};

		// Initialization

		if(spec.valueBinding) {
			that.bindValue(spec.valueBinding);
		}

		return that;
	}


	return controlWidget;
});