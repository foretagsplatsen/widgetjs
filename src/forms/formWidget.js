define([
	'../widget',
	'./inputs',
	'./bindings'
], function(widget, inputs, bindings) {

	function formGroupWidget(spec, my) {
		my = my || {};
		spec = spec || {};

		var that = widget(spec, my);

		var label = spec.label;
		var objects = [];

		that.addField = function(field) {
			objects.push(field);
		};

		that.renderContentOn = function(html) {
			html.div({ klass: 'control-group' },
				html.label({ klass: 'control-label' }, label || ' '),
				html.div({klass: 'controls'},
					objects
				)
			);
		};

		return that;
	}

	/**
	 * Base for all forms
	 *
	 * @param spec
	 * @param my
	 * @returns {*}
	 */
	function formWidget(spec, my) {
		my = my || {};
		spec = spec || {};

		var that = widget(spec, my);

		my.class = spec.class || spec.klass;
		my.fields = [];
		my.groups = {};
		my.content = [];
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
		// Public
		//

		that.setModel = function (model) {
			my.model = model;
			that.update();
		};

		that.getModel = function() {
			return my.model;
		};

		that.getFields = function() {
			return my.fields.slice();
		};

		that.addField = function (field, options) {
			my.registerField(field);

			if(options.group) {
				var group = my.groups[options.group];
				if(!group) {
					group = my.createGroup(options);
					my.groups[options.group] = group;
				}

				group.addField(field);
				my.content.push(group);
			} else {
				my.content.push(field);
			}

			return field;
		};

		//
		// Protected
		//

		my.createGroup = function(options) {
			return formGroupWidget({label: options.group });
		};


		my.registerField = function(field) {
			if (!field || !field.validate) {
				throw "Field must be a valid form field";
			}

			my.fields.push(field);
		};


		// Inputs

		that.input = function (options) {
			var textInput = inputs.input({
				value: options.value,
				valueBinding: my.createValueBinding(options),
				name: options.name || my.nextId(),
				type: options.type || 'text',
				'class': 'form-control'
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

		that.checkbox = function(options) {
			var checkbox = inputs.checkbox({
				selected: options.value,
				selectedBinding: my.createValueBinding(options),
				value: options.name,
				name: options.name || my.nextId(),
				type: options.type || 'text'
			});

			return that.addField(checkbox, options);
		};

		that.checkboxGroup = function(options) {
			var name = options.name || my.nextId();
			var items = options.items || [];
			var buttons = items.map(function(item) {
				return inputs.checkbox({
					name: name,
					label: item,
					value: item
				});
			});

			var field = inputs.checkboxGroup({
				controls: buttons,
				value: options.value,
				valueBinding: my.createValueBinding(options)
			});

			return that.addField(field, options);
		};

		that.radioButtonGroup = function(options) {
			var name = options.name || my.nextId();
			var items = options.items || [];
			var buttons = items.map(function(item) {
				return inputs.radioButton({
					name: name,
					label: item,
					value: item
				});
			});

			var field = inputs.radioButtonGroup({
				controls: buttons,
				value: options.value,
				valueBinding: my.createValueBinding(options)
			});

			return that.addField(field, options);
		};

		// Protected

		that.renderContentOn = function (html) {
			html.form({'class': my.class}, my.content);
		};

		return that;
	};

	return formWidget;
});
