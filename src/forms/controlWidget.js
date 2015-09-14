define([
	'../widget',
	'./bindings'
], function(widget, bindings) {

	/**
	 * Base for all input controls.
	 *
	 * @param {{}} [spec] widget spec
	 * @param {string} [spec.type=text] Type of input
	 * @param {*} spec.value Initial Value.
	 * @param {{}} [spec.valueBinding] Binding object that expose a `accessor` and `mutator` method.
	 * @param {function} [spec.validator] Validation function that takes value and return true if valid
	 * @param {boolean} [spec.validateOnChange=true] Perform validation on each change
	 * @param {boolean} [spec.isDisabled=false]
	 * @param {string} [spec.name='']
	 * @param {{}} [spec.attributes={}]
	 * @param {string} [spec.class={}]
	 * @param {string} [spec.style={}]
	 * @param [my]
	 * @returns {controlWidget}
	 */
	function controlWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		/** @typedef {widget} controlWidget */
		var that = widget(spec, my);

		//
		// Variables
		//

		var valueBinding = spec.valueBinding || bindings.value(spec.value);

		my.error = null;
		my.validator = spec.validator || function(data) {};
		my.validateOnChange = spec.validateOnChange === undefined ? true : spec.validateOnChange;
		my.name = spec.name || '';
		my.attributes = spec.attributes || {};
		my.class = spec.class || '';
		my.style = spec.style || '';
		my.isDisabled = spec.isDisabled || {};

		//
		// Public
		//

		that.onChange = my.events.createEvent('change');
		that.onValidationStateChange = my.events.createEvent('validationStateChange');

		that.getValue = function() {
			return valueBinding.accessor();
		};

		that.setValue = function(newValue, noEvent) {
			var oldValue = that.getValue();
			if(oldValue === newValue) {
				return;
			}

			valueBinding.mutator(newValue);
			var isValid = that.validate();
			if(!noEvent) {
				that.onChange.trigger(newValue, oldValue, that, isValid);
			}
			that.update();
		};

		that.validate = function(aValue) {
			var value =  aValue === undefined ? that.getValue() : aValue;

			my.error = null;
			try {
				my.validator(value);
			} catch (validationError) {
				my.error = validationError;
			}

			that.onValidationStateChange.trigger(!my.error, my.error);

			return !my.error;
		};

		that.isValid = function() {
			return !error;
		};


		return that;
	}


	return controlWidget;
});