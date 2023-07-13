import abstractSegment from "./abstractSegment";

/**
 * A static segment match URL segments that are identical
 * to the route segment string.
 *
 * @param spec - abstractSegment spec
 * @param [my]
 * @returns {segment}
 */
let staticSegment = abstractSegment.subclass((that, my) => {
	/**
	 * Static segment match if URL and route segment
	 * strings are identical.
	 *
	 * @param {string} urlSegment
	 * @returns {boolean}
	 */
	that.match = function (urlSegment) {
		return that.getValue() === urlSegment;
	};

	return that;
});

staticSegment.class((that) => {
	/**
	 * Match all but parameter segment strings
	 * @param {string} segmentString
	 * @returns {boolean}
	 */
	that.match = function (segmentString) {
		return ["#", "?"].indexOf(segmentString[0]) === -1;
	};
});

export default staticSegment;
