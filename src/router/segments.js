define([], function() {

	/**
	 * A segment represents a single part of a route that can be matched
	 * against a URL segment using `match()`.
	 *
	 * @param {{}} spec
	 * @param {string} segmentString
	 * @param {{}} spec.options all route options
	 * @param my
	 * @returns {abstractSegment}
	 */
	function abstractSegment(spec, my) {
		spec = spec || {};
		my = my || {};

		my.segmentString = spec.segmentString;
		my.options = spec.options || {};

		/** @typedef {{}} abstractSegment */
		var that = {};

		/**
		 * Answers true if route segment match URL segment
		 *
		 * @param {string} urlSegment
		 * @returns {boolean}
		 */
		that.match = function(urlSegment) {
			return false;
		};

		/**
		 * Value captured for urlSegment
		 *
		 * @param {string} urlSegment
		 * @returns {*}
		 */
		that.getValue = function(urlSegment) {
			return my.segmentString;
		};

		/**
		 * Variable part of the route.
		 *
		 * @returns {boolean}
		 */
		that.isParameter = function() {
			return false;
		};

		/**
		 * Optional segments can be omitted in URLs and the
		 * URL will still match the route if all other non
		 * optional segments match.
		 *
		 * @returns {boolean}
		 */
		that.isOptional = function() {
			return false;
		};

		/**
		 * String representation for segment that can be used eg. when debugging.
		 * @returns {*}
		 */
		that.toString = function() {
			return my.segmentString;
		};

		return that;
	}

	/**
	 * A static segment match URL segments that are identical
	 * to segment string.
	 *
	 * @param spec abstractSegment spec
	 * @param [my]
	 * @returns {segment}
	 */
	function segment(spec, my) {
		spec = spec || {};
		my = my || {};

		/** @typedef {abstractSegmen} segment */
		var that = abstractSegment(spec, my);

		/**
		 * Static segment match if URL and route segment
		 * strings are identical.
		 *
		 * @param {string} urlSegment
		 * @returns {boolean}
		 */
		that.match = function(urlSegment) {
			return that.getValue() === urlSegment;
		};

		return that;
	}

	/**
	 * Abstract segments should be the last segment type to match
	 * since it will match all segment strings.
	 *
	 * @param {string} segmentString
	 * @returns {boolean}
	 */
	segment.match = function(segmentString) {
		return true;
	};

	//TODO: Yes
	function parameterValidator(constraint) {
		// Custom function that take vale as argument
		if(typeof constraint === 'function') {
			return constraint;
		}

		// Match against RegExp
		if(constraint instanceof RegExp) {
			var exp = new RegExp(constraint);
			return function(string) { return exp.test(string); };
		}

		// Match valid options in an array
		if(Object.prototype.toString.call(constraint) === '[object Array]') {
			var options = constraint.map(function(option) {
				return option.toLowerCase();
			});
			return function(string) {
				var val = string.toLowerCase();
				return options.indexOf(val) !== -1;
			};
		}
	}


	/**
	 * Parameter match URL segments if all constraints are met.
	 *
	 * @param {{}} spec abstractSegment spec
	 * @param [my]
	 * @returns {parameter}
	 */
	function parameter(spec, my) {
		spec = spec || {};
		my = my || {};

		/** @typedef {abstractSegment} parameter */
		var that = abstractSegment(spec, my);

		my.name = my.segmentString.substr(1); // strip of the leading #
		my.constraints = my.options.constraints && my.options.constraints[my.name];
		my.validators = my.constraints ?
			[my.constraints].map(parameterValidator).filter(Boolean) :
			[];

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
			return 'param(' + that.getName() + ')';
		};

		return that;
	}

	/**
	 * Match segment strings with a leading `#`.
	 * @param {string} segmentString
	 * @returns {boolean}
	 */
	parameter.match = function(segmentString) {
		return segmentString.substr(0, 1) === '#';
	};

	/**
	 * Optional parameters can have a default value.
	 *
	 * @param {{}} spec abstractSegment string
	 * @param my
	 * @returns {parameter}
	 */
	function optionalParameter(spec, my) {
		spec = spec || {};
		my = my || {};

		/** @typedef {parameter} optionalParameter */
		var that = parameter(spec, my);

		my.defaultValue = my.options.defaults && my.options.defaults[my.name];

		/**
		 * Parameter value or default value if not matched.
		 *
		 * @param {string} urlSegment
		 * @returns {*}
		 */
		that.getValue = function(urlSegment) {
			return urlSegment === undefined ?
				my.defaultValue :
				urlSegment;
		};

		/**
		 * Always true.
		 * @returns {boolean}
		 */
		that.isOptional = function() {
			return true;
		};

		/**
		 * String representation for segment that can be used eg. when debugging.
		 * @returns {*}
		 */
		that.toString = function() {
			return 'optional(' + that.getName() + ')';
		};

		return that;
	}

	/**
	 * Match segment strings with a leading `?`.
	 * @param {string} segmentString
	 * @returns {boolean}
	 */
	optionalParameter.match = function(segmentString) {
		return segmentString.substr(0, 1) === '?';
	};

	return {
		segment: segment,
		parameter: parameter,
		optionalParameter: optionalParameter,
		all: [parameter, optionalParameter, segment]
	};
});