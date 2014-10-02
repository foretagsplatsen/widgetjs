define(['./parameterSegment'], function(parameterSegment) {

	/**
	 * Optional parameters can have a default value.
	 *
	 * @param {{}} spec abstractSegment string
	 * @param my
	 * @returns {parameter}
	 */
	function optionalParameterSegment(spec, my) {
		spec = spec || {};
		my = my || {};

		/** @typedef {parameter} optionalParameter */
		var that = parameterSegment(spec, my);

		my.defaultValue = my.options.defaults && my.options.defaults[my.name];

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
			return 'optional(' + that.getName() + ')';
		};

		return that;
	}

	/**
	 * Match segment strings with a leading `?`.
	 * @param {string} segmentString
	 * @returns {boolean}
	 */
	optionalParameterSegment.match = function(segmentString) {
		return segmentString.substr(0, 1) === '?';
	};

	return optionalParameterSegment;
});