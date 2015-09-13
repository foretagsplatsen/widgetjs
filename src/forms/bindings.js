define([
], function() {

	function isFunction(value) {
		return typeof value == 'function' || false;
	}

	function isNullOrUndefined(value) {
		return value === null || value === undefined;
	}

	function result(obj, property, defaultValue) {
		var value;
		if(isNullOrUndefined(obj)) {
			value = null;
		} else if(isNullOrUndefined(property)) {
			value = obj;
		} else {
			value = obj[property];
		}

		if(isNullOrUndefined(value)) {
			return defaultValue || null;
		}

		return isFunction(value) ? value.call(obj) : value;
	}

	function attributeBinding(model, attribute) {
		var path = attribute.split('.');

		return {
			accessor: function () {
				var node = result(model);
				for (var i = 0; i < path.length; i++) {
					node = node && node[path[i]];
				}

				return node;
			},
			mutator: function (newValue) {
				var node = result(model);
				for (var i = 0; i < path.length; i++) {
					if (i === path.length - 1 && node) {
						node[path[i]] = newValue;
					}
					node = node && node[path[i]];
				}
			}
		};
	}

	function valueBinding(value) {
		var currentValue = value;
		return {
			accessor: function () {
				return currentValue;
			},
			mutator: function (newValue) {
				currentValue = newValue;
			}
		};
	}

	return {
		attribute: attributeBinding,
		value: valueBinding
	};
});
