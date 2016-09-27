define([
	"./parameterSegment"
], function(parameterSegment) {

	/**
	 * Optional parameters can have a default value.
	 *
	 * @param {{}} spec abstractSegment string
	 * @param my
	 * @returns {parameter}
	 */
	var optionalParameterSegment = parameterSegment.subclass(function(that, my) {

		my.initialize = function(spec) {
			my.super(spec);
			my.defaultValue = my.options.defaults && my.options.defaults[my.name];
		};

		//
		// Public
		//

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
			return "optional(" + that.getName() + ")";
		};
	});

	optionalParameterSegment.class(function(that) {
		/**
		 * Match segment strings with a leading `?`.
		 * @param {string} segmentString
		 * @returns {boolean}
		 */
		that.match = function(segmentString) {
			return segmentString.substr(0, 1) === "?";
		};
	});

	return optionalParameterSegment;
});
