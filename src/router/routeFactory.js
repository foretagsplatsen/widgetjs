import "./optionalParameterSegment.js";
import "./parameterSegment.js";
import "./staticSegment.js";
import abstractSegment from "./abstractSegment.js";

/**
 * Token/Char used to separate segments in route patterns.
 * @type {string}
 */
const routePatternSeparator = "/";

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
	const segmentStrings = pattern.split(routePatternSeparator);

	const nonEmptySegmentStrings = segmentStrings
		.map(Function.prototype.call, String.prototype.trim)
		.filter(Boolean);

	return nonEmptySegmentStrings.map((segmentString) =>
		segmentFactory(segmentString, options),
	);
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

	const segments = abstractSegment.allSubclasses();

	// Find segment type from string
	for (const segment of segments) {
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
