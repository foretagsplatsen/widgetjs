import routeFactory from "./routeFactory";
import events from "../events";
import routeMatchResult from "./routeMatchResult";
import url from "./url";
import klassified from "klassified";
import "jquery";

/**
 * Routes represent the path for which an action should be taken (see `matched` event).
 *
 * Route is implemented as an array of segments. A route can be constructed from a segment array
 * or a route pattern string.
 *
 * @example
 *        var aRouteFromSegments = route({segments: arrayOfRouteSegments});
 *        var aRouteFromPattern = route("/segmentA/#aParameter/?andAnOptionalParameter");
 *
 * Route pattern strings are parsed into segment arrays by `routeFactory`.
 *
 * Route match URL:s by comparing the URL segments against an array
 * of route segments. A route match a URL if the segments matches the route segments.
 *
 * @example
 *    route("/User/#id").matchUrl("/User/john").matched(); // => true
 *
 * Route would match URL since first segment in URL match Route (both "User") and second
 * segment is matched since a route parameter will match all values (if no constraints).
 *
 * Some segments can be optional and other mandatory. The strategy to match route with optional
 * segments is to match it against the segments and then all combinations of optional parameters.
 *
 * An array with all optional sequences is calculated when route is created.
 *
 * Note: Avoid large number of optionals since it will consume memory and slow down matching.
 * You can use query parameters instead.
 *
 * When a URL is matched the router will bind matches parameters to corresponding segments in URL
 * and return them in `matchResult`
 *
 * @example
 *
 *        var result = route("/user/#id").matchUrl("/user/john");
 *        console.dir(result.getValues()); // => { user: "john"}
 *
 * Routes can also be used as patterns for creating URLs
 *
 *        var url = route("/user/#id").expand({id: "john"});
 *        console.log(url); // => "/user/john"
 *
 *
 * @param {string|{}} spec Route pattern or route spec
 * @param {boolean} spec.ignoreTrailingSegments Route will match if all route segment match
 * even if url have trailing unmatched segments
 * @param {segment[]} [spec.segments] Array of route segments
 *
 * @param {{}} my
 * @returns {route}
 */
var route = klassified.object.subclass(function(that, my) {

	var segments;
	var ignoreTrailingSegments;
	var optionalSequences;

	my.initialize = function(spec) {
		my.super();
		// Build segments from pattern
		segments = routeFactory(spec.pattern, spec.options);

		// Route match URL if all route segments match
		// but URL still contain trailing segments (default false)
		ignoreTrailingSegments = (spec.options && spec.options.ignoreTrailingSegments) || false;

		// Array with all optional sequences, ie. all combinations
		// of optional parameters. Array must be ordered to match URL:s
		// left to right.
		optionalSequences = [];

		// Pre-calculate optional sequences.
		ensureOptionalSequences();
	};

	my.events = events.eventCategory();

	//
	// Public
	//

	that.matched = my.events.createEvent("matched");
	that.onMatched = that.matched; // deprecated

	// @deprecated Use event property instead
	that.on = my.events.register;

	/**
	 * Match route against URL by comparing segments. Triggers
	 * `matched` event on match.
	 *
	 * @param {url} url
	 * @returns {routeMatchResult}
	 */
	that.matchUrl = function(url) {
		var match = findMatch(url);
		if (!match) {
			return routeMatchResult.routeNoMatchResult;
		}

		var result = createMatchResult(match, url);
		my.events.trigger("matched", result);

		return result;
	};

	/**
	 * Expands route into a url. All non optional route parameters must exist
	 * in `params`.
	 *
	 * @param {{}} params Key/Values where keys are route parameter names and values the values to use
	 *
	 * @returns {string} URL string
	 */
	that.expand = function(params) {
		params = params || {};

		// Try to expand route into URL
		var urlSegments = [];
		segments.forEach(function(routeSegment) {
			var urlSegment;
			if (routeSegment.isParameter()) {
				// Use supplied value for parameters
				urlSegment = params[routeSegment.getName()];
			} else {
				// name/value for segments
				urlSegment = routeSegment.getValue();
			}

			// Skip if no match and optional
			if (urlSegment === undefined &&
				routeSegment.isOptional()) {
				return;
			}

			// Validate segment
			if (!routeSegment.match(urlSegment)) {
				throw new Error("Could not generate a valid URL");
			}

			urlSegments.push(urlSegment);
		});

		var query = {};

		Object.keys(params).forEach(function(param) {
			if (!that.hasParameter(param)) {
				query[param] = params[param];
				// Handle array param values
				if (query[param] instanceof Array) {
					query[param] = query[param].join(",");
				}
			}
		});

		return url.build(urlSegments.join("/"), query).toString();
	};

	/**
	 * Answers true if parameter with `name` exists in route.
	 *
	 * @param {string} name
	 * @returns {boolean}
	 */
	that.hasParameter = function(name) {
		return segments.some(function(segment) {
			return segment.isParameter() && segment.getName() === name;
		});
	};

	/**
	 * Returns a string representation of route useful for debugging.
	 *
	 * @returns {string}
	 */
	that.toString = function() {
		return "route(" + segments.join("/") + ")";
	};

	//
	// Private
	//

	/**
	 * Checks if an array of url segments match a sequence of route segments.
	 *
	 * @param {string[]} urlSegments
	 * @param {segments[]} [sequence] Route segments will be used as default
	 * @returns {boolean}
	 */
	function isMatch(urlSegments, sequence) {
		sequence = sequence || segments;

		// Can not match if different sizes
		if (urlSegments.length !== sequence.length && !ignoreTrailingSegments) {
			return false;
		}

		// All routeSegments much match corresponding URL segment
		return sequence.every(function(routeSegment, index) {
			var urlSegment = urlSegments[index];
			return urlSegment !== undefined && routeSegment.match(urlSegment);
		});
	}

	/**
	 * Returns first sequence of segments that match url or null if no sequence match.
	 *
	 * @param {url} url
	 * @returns {segment[]}
	 */
	function findMatch(url) {
		var urlSegments = url.getSegments();

		// Try match url segments
		if (isMatch(urlSegments)) {
			return segments;
		}

		// then optional sequences
		var sequenceIndex;
		for (sequenceIndex = 0; sequenceIndex < optionalSequences.length; sequenceIndex++) {
			if (isMatch(urlSegments, optionalSequences[sequenceIndex])) {
				return optionalSequences[sequenceIndex];
			}
		}

		return null;
	}

	/**
	 * Pre-calculate all optional sequences of segments.
	 */
	function ensureOptionalSequences() {
		// Find positions for optionals
		var optionalPositions = [];
		segments.forEach(function(segment, index) {
			if (segment.isOptional()) {
				optionalPositions.push(index);
			}
		});

		if (optionalPositions.length > 15) {
			throw new Error("Too many optional arguments. \"" + optionalPositions.length +
				"\" optionals would generate  " + Math.pow(2, optionalPositions.length) +
				" optional sequences.");
		}

		// Generate possible sequences
		var possibleOptionalSequences = orderedSubsets(optionalPositions);

		possibleOptionalSequences.forEach(function(sequence) {
			// Clone segments array and remove optionals matching
			// indexes in index sequence
			var optionalSequence = segments.slice();
			sequence.forEach(function(optionalIndex, numRemoved) {
				// Remove optional but take in to account that we have already
				// removed {numRemoved} from permutation.
				optionalSequence.splice(optionalIndex - numRemoved, 1);
			});

			optionalSequences.push(optionalSequence);
		});
	}

	/**
	 * Create a "routeMatchResult" from a matched sequence.
	 *
	 * @param {segment[]} match Matched segment sequence
	 * @param {url} url Matched URL
	 *
	 * @returns {routeMatchResult}
	 */
	function createMatchResult(match, url) {
		var urlSegments = url.getSegments();

		var parameterValues = {};
		segments.forEach(function(routeSegment) {
			if (!routeSegment.isParameter()) {
				return;
			}

			var matchedIndex = match.indexOf(routeSegment);
			if (matchedIndex >= 0) {
				parameterValues[routeSegment.getName()] = routeSegment.getValue(urlSegments[matchedIndex]);
			} else {
				parameterValues[routeSegment.getName()] = routeSegment.getValue();
			}
		});

		return routeMatchResult({
			route: that,
			url: url,
			values: parameterValues
		});
	}
});

/**
 * Generates all subsets of an array with same internal order. Returned subsets are
 * ordered in right to left order.
 *
 * @example
 *    orderedSubsets([1,2,3]); // => [[1,2,3],[2,3],[1,3],[3],[1,2],[2],[1]]
 *
 * @param {[]} input
 * @returns {[[]]} Array with all subset arrays
 */
function orderedSubsets(input) {
	var results = [];
	var result;
	var mask;
	var total = Math.pow(2, input.length);

	for (mask = 1; mask < total; mask++) {
		result = [];
		var i = input.length - 1;
		do {
			if ((mask & (1 << i)) !== 0) {
				result.unshift(input[i]);
			}
		} while (i--);
		results.unshift(result);
	}

	return results;
}

export default route;
