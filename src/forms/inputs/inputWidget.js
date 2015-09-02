define([
	'../controlWidget'
], function(controlWidget) {

	/**
	 *
	 * @param spec
	 * @param my
	 * @returns {*}
	 */
	function inputWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		/** @typedef {controlWidget} inputWidget */
		var that = controlWidget(spec, my);

		// Variables

		my.type = spec.type || 'text';
		my.label = spec.label ||'';

		my.handleChange = function(event) {
			var fieldValue = event.target.value;
			that.setValue(fieldValue);
		};

		// Render

		that.renderOn = function(html) {
			var field = html.input({
				id: that.getId(),
				name: my.name,
				type: my.type,
				value: my.value,
				'class' : my.class
			});

			field.attr(my.attributes);
			field.css(my.style);

			field.blur(my.handleChange);
			field.change(my.handleChange);
		};

		return that;
	}

	return inputWidget;
});