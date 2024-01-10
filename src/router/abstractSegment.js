import { object } from "klassified";

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
const abstractSegment = object.subclass((that, my) => {
	my.initialize = function (spec) {
		my.super(spec);
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
	that.match = function (_urlSegment) {
		return false;
	};

	/**
	 * Value captured for urlSegment
	 *
	 * @param {string} urlSegment
	 * @returns {*}
	 */
	that.getValue = function (_urlSegment) {
		return my.segmentString;
	};

	/**
	 * Variable part of the route.
	 *
	 * @returns {boolean}
	 */
	that.isParameter = function () {
		return false;
	};

	/**
	 * Optional segments can be omitted in URLs and the
	 * URL will still match the route if all other non
	 * optional segments match.
	 *
	 * @returns {boolean}
	 */
	that.isOptional = function () {
		return false;
	};

	/**
	 * String representation for segment that can be used eg. when debugging.
	 * @returns {*}
	 */
	that.toString = function () {
		return my.segmentString;
	};
});

abstractSegment.class((that) => {
	that.match = function (_segmentString) {
		return false;
	};
});

export default abstractSegment;
