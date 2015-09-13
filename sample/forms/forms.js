define([
	'widgetjs/widget',
	'widgetjs/forms/formWidget',
	'widgetjs/forms/inputs'
], function(widget, formWidget, inputs) {

	// Sample data

	var role = 'user';
	var user = {
		name: 'kalle',
		age: 10,
		gender: 'female',
		getRole: function() {
			return role;
		},
		setRole: function(newRole) {
			role = newRole;
		}
	};

	window.user = user;


    function formsExamples() {
        var that = widget();

		// Custom form

		function userFormWidget(spec, my) {
			spec = spec || {};
			my = my || {};

			var that = formWidget(spec, my);

			that.renderContentOn = function(html) {
				html.form({class: 'form-horizontal'},
					that.getFields().map(function(field) {
						return html.div({class: 'form-group'},
							html.label('test'),
							field
						);
					})
				);
			};

			return that;
		}


		// Form

		var userForm = formWidget({
			//? validations: [validation.required('name', 'age')]
			//? fields: ['name', 'age', {name: 'role', accessor: user.getRole, mutator: user.setRole}]
		});


		userForm.input({
			name: 'name',
			attribute: 'name'
		});

		userForm.input({
			name: 'age',
			attribute: 'age'
		});

		userForm.input({
			name: 'role',
			accessor: user.getRole,
			mutator: user.setRole
		});

		userForm.radiobuttonList({
			name: 'gender',
			items: ['male', 'female'],
			attribute: 'gender'
		});

		userForm.setModel(user);

		// Single inputs

		var userName = inputs.input({
			name: 'userName',
			valueBinding: inputs.attributeBinding(user, 'name')
		});

		var password = inputs.input({
			name: 'password',
			type: 'password'
			//? dataTypeType: number, //number, string,
			//? valueBinding: attributeValueBinding(user, 'name'),
			//? valueBinding: valueBinding({accessor: user.getName, mutator: user.setName}),
			//? validation: [validators.mandatory]
		});

		password.onChange(function(newValue) {
			console.log('password: ', newValue);
		});

		var gender = inputs.radiobuttonList({
			value: 'male',
			controls: ['male','female'].map(function(gender) {
				return inputs.radiobutton({ value: gender });
			})
		});

		gender.onChange(function(newValue) {
			console.log('gender: ', newValue);
		});

		var someOptions = inputs.checkboxList({
			value: [1, 4],
			controls: [1,2,3,4].map(function(option) {
				return inputs.checkbox({value: option});
			})
		});

		someOptions.onChange(function(newValue) {
			console.log('someOptions: ', newValue);
		});

		var aDropDown = inputs.select({
			value: ['A2', 'B'],
			//isMultipleSelect: true,
			controls: [
				inputs.optionGroup({
					label: 'A',
					controls: [
						inputs.option({value: 'A1'}),
						inputs.option({value: 'A2'})
					]
				}),
				inputs.option({value: 'B'}),
				inputs.option({value: 'C'}),
				inputs.option({value: 'D'})
			]
		});

		aDropDown.onChange(function(newValue) {
			console.log('aDropDown: ', newValue);
		});


		that.renderContentOn = function(html) {
            html.h1('Hello Forms');
			html.render(userForm);
			html.hr();

			html.h1('Hello inputs');
			html.div(
				'Username: ',userName, html.br(),
				'Password: ', password, html.br(),
				gender,html.br(),
				someOptions,html.br(),
				aDropDown
			);
        };

        return that;
    }

	return formsExamples;
});
