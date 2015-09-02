define([
	'./inputs/inputWidget',
	'./inputs/radioButtonListWidget',
	'./inputs/radiobuttonWidget',
	'./inputs/checkboxListWidget',
	'./inputs/checkboxWidget',
	'./inputs/optionWidget',
	'./inputs/optionGroupWidget',
	'./inputs/selectWidget'
], function(inputWidget, radiobuttonListWidget, radiobuttonWidget,
			checkboxListWidget, checkboxWidget, optionWidget, optionGroupWidget, selectWidget) {

	//TODO: move attributeBinding

	function attributeBinding(model, path) {
		if (typeof path === "string") {
			path = path.split('.');
		}

		var node = model;
		var attr;
		for (var i = 0; i < path.length; i++) {
			attr = path[i];
			if(i < path.length - 1)
				node = node[attr];
		}

		return {
			accessor: function () {
				return node[attr];
			},
			mutator: function (newValue) {
				node[attr] = newValue;
			}
		};
	}


	return {
		input: inputWidget,
		radiobuttonList: radiobuttonListWidget,
		radiobutton: radiobuttonWidget,
		checkboxList: checkboxListWidget,
		checkbox: checkboxWidget,
		option: optionWidget,
		optionGroup: optionGroupWidget,
		select: selectWidget,
		attributeBinding: attributeBinding
	};
});
