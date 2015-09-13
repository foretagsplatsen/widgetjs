define([
	'../widget',
	'./bindings'
], function(widget, bindings) {

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

		var valueBinding = spec.valueBinding || bindings.value(spec.value);
		my.name = spec.name || '';
		my.attributes = spec.attributes || {};
		my.class = spec.class || '';
		my.style = spec.style || '';
		my.isDisabled = spec.isDisabled || {};

		// Public

		that.onChange = my.events.createEvent('change');

		that.getValue = function() {
			return valueBinding.accessor();
		};

		that.setValue = function(newValue, noEvent) {
			var oldValue = that.getValue();
			if(oldValue === newValue) {
				return;
			}

			valueBinding.mutator(newValue);
			if(!noEvent) {
				that.onChange.trigger(newValue, oldValue, that);
			}
			that.update();
		};

		return that;
	}


	return controlWidget;
});