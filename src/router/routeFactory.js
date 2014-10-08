define([
	'./parameterSegment',
	'./optionalParameterSegment',
	'./staticSegment'
], function(parameterSegment, optionalParameterSegment, staticSegment) {

	/**
	 * Token/Char used to separate segments in route patterns.
	 * @type {string}
	 */
	var routePatternSeparator = '/';

	var segments = [parameterSegment, optionalParameterSegment];

	/**
	 * Creates a route from pattern. A pattern is a string with route segments
	 * separated by `routePatternSeparator`.
	 *
	 * @example
	 *	routeFactory(`/foo/#bar/?baz`);
	 *
	 * @param {string} pattern
	 * @param {{}} options
	 * @returns {abstractSegment[]}
	 */
	function routeFactory(pattern, options) {
		if(!pattern) {
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

		// Find segment type from string
		for(var i = 0; i < segments.length; i++) {
			var segment = segments[i];
			if(segment.match(segmentString)) {
				return segment({
					segmentString: segmentString,
					options: options
				});
			}
		}

		// Default to static segment
		return staticSegment({
			segmentString: segmentString,
			options: options
		});
	}

	/**
	 * Adds another segment type to available segments
	 *
	 * @param segment
	 */
	routeFactory.addSegment = function(segment) {
		segments.push(segment);
	};


	return routeFactory;
});