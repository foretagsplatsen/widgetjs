define([
	"./abstractSegment",
	"./parameterSegment",
	"./optionalParameterSegment",
	"./staticSegment"
], function(abstractSegment) {

	/**
	 * Token/Char used to separate segments in route patterns.
	 * @type {string}
	 */
	var routePatternSeparator = "/";

	/**
	 * Creates a route from pattern. A pattern is a string with route segments
	 * separated by `routePatternSeparator`.
	 *
	 * @example
	 *    routeFactory(`/foo/#bar/?baz`);
	 *
	 * @param {string} pattern
	 * @param {{}} options
	 * @returns {abstractSegment[]}
	 */
	function routeFactory(pattern, options) {
		if (!pattern) {
			return [];
		}

		options = options || {};
		var segmentStrings = pattern.split(routePatternSeparator);

		var nonEmptySegmentStrings = segmentStrings
			.map(Function.prototype.call, String.prototype.trim)
			.filter(Boolean);

		var segmentArray = nonEmptySegmentStrings.map(function(segmentString) {
			return segmentFactory(segmentString, options);
		});

		return segmentArray;
	}

	/**
	 * Create segment from string
	 *
	 * @param {string} segmentString
	 * @param {{}} options
	 * @returns {abstractSegment}
	 */
	function segmentFactory(segmentString, options) {
		options = options || {};

		var segments = abstractSegment.allSubclasses();

		// Find segment type from string
		for (var i = 0; i < segments.length; i++) {
			var segment = segments[i];
			if (segment.match(segmentString)) {
				return segment({
					segmentString: segmentString,
					options: options
				});
			}
		}

		return null;
	}

	return routeFactory;
});
