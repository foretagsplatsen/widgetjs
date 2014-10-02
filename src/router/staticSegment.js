define(['./abstractSegment'], function(abstractSegment) {

	/**
	 * A static segment match URL segments that are identical
	 * to the route segment string.
	 *
	 * @param spec abstractSegment spec
	 * @param [my]
	 * @returns {segment}
	 */
	function staticSegment(spec, my) {
		spec = spec || {};
		my = my || {};

		/** @typedef {abstractSegment} segment */
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
	staticSegment.match = function(segmentString) {
		return true;
	};

	return staticSegment;
});