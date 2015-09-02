define([
	'widgetjs/widget',
	'widgetjs/forms/formWidget',
	'widgetjs/forms/inputs'
], function(widget, formWidget, inputs) {

    function formsExamples() {
        var that = widget();

		var role = 'user';
		var user = {
			name: 'kalle',
			age: 10,
			gender: 'male',
			getRole: function() {
				return role;
			},
			setRole: function(newRole) {
				role = newRole;
			}
		};

		window.user = user;

		// Form

		var userForm = formWidget({
			model: user
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
			controls: [
				male = inputs.radiobutton({value: 'male', isSelected: true}),
				inputs.radiobutton({value: 'female'})
			]
		});

		gender.onChange(function(newValue) {
			console.log('gender: ', newValue);
		});

		//TODO: use onChange instead of onSelectionChange?
		male.onSelectionChange(function(newValue) {
			console.log('male: ', newValue);
		});

		var someOptions = inputs.checkboxList({
			controls: [1,2,3,4].map(function(option) {
				return inputs.checkbox({value: option, isSelected: option === 3});
			})
		});

		someOptions.onChange(function(newValue) {
			console.log('someOptions: ', newValue);
		});

		var aDropDown = inputs.select({
			// isMultipleSelect: true,
			controls: [
				inputs.optionGroup({
					label: 'A',
					controls: [
						inputs.option({value: 'A1'}),
						inputs.option({value: 'A2'})
					]
				}),
				inputs.option({value: 'B'}),
				inputs.option({value: 'C'})
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
