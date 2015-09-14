define([
	'./inputs/inputWidget',
	'./inputs/radioButtonGroupWidget',
	'./inputs/radioButtonWidget',
	'./inputs/checkboxGroupWidget',
	'./inputs/checkboxWidget',
	'./inputs/optionWidget',
	'./inputs/optionGroupWidget',
	'./inputs/selectWidget'
], function(inputWidget, radioButtonGroupWidget, radioButtonWidget,
			checkboxGroupWidget, checkboxWidget, optionWidget, optionGroupWidget, selectWidget) {

	return {
		input: inputWidget,
		radioButtonGroup: radioButtonGroupWidget,
		radioButton: radioButtonWidget,
		checkboxGroup: checkboxGroupWidget,
		checkbox: checkboxWidget,
		option: optionWidget,
		optionGroup: optionGroupWidget,
		select: selectWidget
	};
});
