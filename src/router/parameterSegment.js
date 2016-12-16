define([
	"./abstractSegment"
], function(abstractSegment) {

	/**
	 * Constructs validator functions from constraints parameters.
	 *
	 * @param {*} constraint
	 * @returns {function} function that take a urlSegment as argument
	 */
	function parameterValidator(constraint) {
		// Custom function that take a url segment as argument
		if (typeof constraint === "function") {
			return constraint;
		}

		// Match against RegExp
		if (constraint instanceof RegExp) {
			var exp = new RegExp(constraint);
			return function(urlSegment) {
				return exp.test(urlSegment);
			};
		}

		// Match valid options in an array
		if (Object.prototype.toString.call(constraint) === "[object Array]") {
			var options = constraint.map(function(option) {
				return option.toLowerCase();
			});
			return function(urlSegment) {
				var val = urlSegment.toLowerCase();
				return options.indexOf(val) !== -1;
			};
		}
		return null;
	}

	/**
	 * Parameter match URL segments if all constraints are met.
	 *
	 * @param {{}} spec abstractSegment spec
	 * @param [my]
	 * @returns {parameterSegment}
	 */
	var parameterSegment = abstractSegment.subclass(function(that, my) {

		my.initialize = function(spec) {
			my.super(spec);
			my.name = my.segmentString.substr(1); // strip of the leading #
			my.constraints = (my.options.constraints && my.options.constraints[my.name] &&
				[my.options.constraints[my.name]]) || [];
			my.validators = my.constraints.map(parameterValidator).filter(Boolean);
		};

		//
		// Public
		//

		/**
		 * Name is segmentString without leading property type char.
		 *
		 * @returns {string}
		 */
		that.getName = function() {
			return my.name;
		};

		/**
		 * Value captured for urlSegment
		 *
		 * @param {string} urlSegment
		 * @returns {*}
		 */
		that.getValue = function(urlSegment) {
			return urlSegment;
		};

		/**
		 * Always true
		 *
		 * @returns {boolean}
		 */
		that.isParameter = function() {
			return true;
		};

		/**
		 * Match urSegment if all constraints are met.
		 *
		 * @param {string} urlSegment
		 * @returns {boolean|*}
		 */
		that.match = function(urlSegment) {
			return urlSegment !== undefined && that.validate(urlSegment);
		};

		/**
		 * Answers true if url segment meet all constraints for parameter.
		 *
		 * @param {string} urlSegment
		 * @returns {boolean}
		 */
		that.validate = function(urlSegment) {
			return my.validators.every(function(validator) {
				return validator(urlSegment);
			});
		};

		/**
		 * String representation for segment that can be used eg. when debugging.
		 * @returns {*}
		 */
		that.toString = function() {
			return "param(" + that.getName() + ")";
		};
	});

	parameterSegment.class(function(that) {

		/**
		 * Match segment strings with a leading `#`.
		 * @param {string} segmentString
		 * @returns {boolean}
		 */
		that.match = function(segmentString) {
			return segmentString.substr(0, 1) === "#";
		};
	});

	return parameterSegment;
});
