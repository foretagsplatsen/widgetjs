define([
	'../widget',
	'./inputs',
	'./bindings'
], function(widget, inputs, bindings) {

	/**
	 * Base for all forms
	 *
	 * @param spec
	 * @param my
	 * @returns {*}
	 */
	var formWidget = function (spec, my) {
		my = my || {};
		spec = spec || {};

		var that = widget(spec, my);

		my.fields = {};
		my.model = spec.model || {};

		// Protected

		my.createValueBinding = function(options) {
			if (options.mutator || options.accessor) {
				return {
					accessor: options.accessor,
					mutator: options.mutator
				};
			} else if (options.attribute) {
				return bindings.attribute(that.getModel, options.attribute, options.defaultValue);
			}

			return undefined;
		};

		//
		// Public API
		//

		that.setModel = function (model) {
			my.model = model;
			that.update();
		};

		that.getModel = function() {
			return my.model;
		};

		that.getFields = function() {
			return Object.keys(my.fields).map(function(name) {
				return my.fields[name];
			});
		};

		that.getField = function(name) {
			return my.fields[name];
		};

		that.addField = function (field, options) {
			my.fields[options.name] = field;
			return field;
		};

		// Inputs

		that.input = function (options) {
			var textInput = inputs.input({
				value: options.value,
				valueBinding: my.createValueBinding(options),
				name: options.name || my.nextId(),
				type: options.type || 'text'
			});

			return that.addField(textInput, options);
		};

		that.password = function (options) {
			var inputOptions = Object.create(options);
			inputOptions.type = options.type || 'password';

			return that.input(inputOptions);
		};

		that.number = function (options) {
			var inputOptions = Object.create(options);
			inputOptions.type = options.type || 'number';

			return that.input(inputOptions);
		};

		that.number = function (options) {
			var inputOptions = Object.create(options);
			inputOptions.type = options.type || 'number';

			return that.input(inputOptions);
		};

		that.radiobuttonList = function(options) {
			var name = options.name || my.nextId();
			var items = options.items || [];
			var radiobuttons = items.map(function(item) {
				return inputs.radiobutton({
					name: name,
					label: item,
					value: item
				});
			});

			var field = inputs.radiobuttonList({
				controls: radiobuttons,
				value: options.value,
				valueBinding: my.createValueBinding(options)
			});

			return that.addField(field, options);
		};


		// Protected

		that.renderContentOn = function (html) {
			html.form(that.getFields());
		};

		return that;
	};

	return formWidget;
});
