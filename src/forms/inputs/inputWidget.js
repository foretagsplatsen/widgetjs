define([
	'../controlWidget'
], function(controlWidget) {

	/**
	 * Inputs is used to create interactive controls for
	 * web-based forms in order to accept data from the user.
	 *
	 * @example
	 * var password = input({type: 'password'});
	 *
	 * password.onChange(function(newValue, oldValue) {
	 * 	console.log('password: + ' + newValue);
	 * });
	 *
	 * @param {{}} [spec] controlWidget spec
	 * @param {string} [spec.type=text] Type of input
	 * @param [my]
	 * @returns {inputWidget}
	 */
	function inputWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		/** @typedef {controlWidget} inputWidget */
		var that = controlWidget(spec, my);

		//
		// Variables
		//

		my.type = spec.type || 'text';

		//
		// Render
		//

		that.renderOn = function(html) {
			var field = html.input({
				id: that.getId(),
				name: my.name,
				type: my.type,
				value: that.getValue(),
				'class' : my.class
			});

			field.attr(my.attributes);
			field.css(my.style);

			field.blur(my.handleChange);
			field.change(my.handleChange);
		};

		//
		// Protected
		//

		my.handleChange = function(event) {
			var fieldValue = event.target.value;
			that.setValue(fieldValue);
		};

		return that;
	}

	return inputWidget;
});