import abstractSegment from "./abstractSegment.js";
import "./parameterSegment.js";
import "./optionalParameterSegment.js";
import "./staticSegment.js";

/**
 * Token/Char used to separate segments in route patterns.
 * @type {string}
 */
let routePatternSeparator = "/";

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

	options ||= {};
	let segmentStrings = pattern.split(routePatternSeparator);

	let nonEmptySegmentStrings = segmentStrings
		.map(Function.prototype.call, String.prototype.trim)
		.filter(Boolean);

	let segmentArray = nonEmptySegmentStrings.map((segmentString) =>
		segmentFactory(segmentString, options),
	);

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
	options ||= {};

	let segments = abstractSegment.allSubclasses();

	// Find segment type from string
	for (let segment of segments) {
		if (segment.match(segmentString)) {
			return segment({
				segmentString,
				options,
			});
		}
	}

	return null;
}

export default routeFactory;
