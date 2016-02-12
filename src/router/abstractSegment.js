define([
	'objectjs'
], function(object) {
	/**
	 * A segment represents a single part of a route that can be matched
	 * against a URL segment using `match()`.
	 *
	 * @param {{}} spec
	 * @param {string} segmentString
	 * @param {{}} spec.options all route options
	 * @param my
	 * @returns {abstractSegment}
	 */
	var abstractSegment = object.subclass(function(that, spec, my) {

		that.initialize = function() {
			my.segmentString = spec.segmentString;
			my.options = spec.options || {};
		};

		//
		// Public
		//

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
	});

	abstractSegment.match = function(segmentString) {
		return false;
	};

	return abstractSegment;
});
