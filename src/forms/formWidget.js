define([
	'../widget',
	'./inputs'
], function(widget, inputs) {

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

		my.fields = [];
		my.model = spec.model;

		//
		// Public API
		//

		that.setModel = function (model) {
			my.model = model;
		};


		// Fields

		that.addField = function (field, options) {
			if (options.mutator || options.accessor) {
				field.bindValue({
					accessor: options.accessor,
					mutator: options.mutator
				});
			}
			else if (options.attribute) {
				field.bindValue(inputs.attributeBinding(my.model, options.attribute));
			}

			my.fields.push(field);
			return field;
		};

		that.input = function (options) {
			var textInput = inputs.input({
				value: options.value,
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
				controls: radiobuttons
			});

			return that.addField(field, options);
		};


		// Protected

		that.renderContentOn = function (html) {
			html.form(my.fields);
		};

		return that;
	};

	return formWidget;
});
