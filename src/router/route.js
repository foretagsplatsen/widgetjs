define(
	['./segments', '../events', 'jquery'],
	function(routeSegments, events, jQuery) {

		var urlSeparator = '/';

		// ### Route object
		// 
		// Routes are used to match URLs. Routes represent
		// the path taken for which an action has to be taken
		// (registered in the router with an associated callback
		// function).
		//
		// A route have a `segments` array. Some segments are optional and other mandatory. 
		// A route match a URL if the segments matches the route segments. 
		//
		// The strategy to match route against a URL is to match it against the segments
		// and then all combinations optional parameters. An array with all optional 
		// sequences is calculated when route is created.
		//
		// _Note:_: Avvoid large number of optionals since it will consume memory
		// and slow down matching. You can sse query parameters instead.
		//
		var route = function(spec, my) {
			if(Object.prototype.toString.call(spec) === '[object String]') {
				var routePattern = spec;
				var routeSpec = my;
				return routeFactory(routePattern, routeSpec);
			}

			spec = spec || {};
			my = my || {};

			// Segments to match
			var segments = spec.segments;

			// Array with all optional sequences, ie. all combinations 
			// of optional perameters. Array must be orderd to match URL:s
			// left to right. 
			var optionalSequences = [];

			// Pre-caluclate optional sequences.
			ensureOptionalSequences();

			var that = {};

			// Mixin events
			jQuery.extend(that, events.eventhandler());

			my.getSegments = function() {
				return segments;
			};

			that.matchUrl = function(url) {
				var match = findMatch(url);
				if(!match) {
					return routeNoMatchResult();
				}

				var result = createMatchResult(match, url);

				that.trigger('matched', result);

				return result;
			};

			that.expand = function(params) {
				params = params || {};

				// Try to expand route into URL
				var urlSegments = [];
				segments.forEach(function(routeSegment) {
					var urlSegment;
					if(routeSegment.isParameter()) {
						// Use supplied value for parameters
						urlSegment = params[routeSegment.getName()];
					} else {
						// name/value for segments
						urlSegment = routeSegment.getValue();
					}

					// Skip if no match and optional
					if(urlSegment === undefined && 
						routeSegment.isOptional()) {
						return;
					}

					// Validate segment
					if (!routeSegment.match(urlSegment)) {
						throw new Error('Could not generate a valid URL');
					}

					urlSegments.push(urlSegment);
				});

				return urlSegments.join('/');
			};

			that.hasParameter = function(name) {
				return segments.some(function(segment) {
					return segment.isParameter() && segment.getName() === name;
				});
			};

			that.toString = function() {
				return 'route(' + segments.join('/') + ')';
			};

			function isMatch(urlSegments, sequence) {
				sequence = sequence || segments;

				// Can not match if different sizes
				if(urlSegments.length != sequence.length) {
					return false;
				}

				// All routeSegments much match coresponding URL segment
				return sequence.every(function(routeSegment, index) {
					var urlSegment = urlSegments[index];
					return urlSegment !== undefined && routeSegment.match(urlSegment);
				});
			}

			function findMatch(url) {
				// Match URL segments against route segments
				var urlSegments = url.getSegments();

				// Try match orignial segements
				if(isMatch(urlSegments)) {
					return segments;
				}

				// then optionals
				for(var i = 0; i < optionalSequences.length; i++) {
					if(isMatch(urlSegments, optionalSequences[i])) {
						return optionalSequences[i];
					}
				}

				return null;
			}

			function ensureOptionalSequences () {
				// Find positions for optionals
				var optionalPositions = [];
				segments.forEach(function(segment, index) {
					if(segment.isOptional()) {
						optionalPositions.push(index);
					}
				});

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

			function createMatchResult(match, url) {
				var urlSegments = url.getSegments();

				var parameters = {};

				// Fill with matched parameter values
				match.forEach(function(routeSegment, index) {
					if(routeSegment.isParameter()) {
						parameters[routeSegment.getName()] = routeSegment.getValue(urlSegments[index]);
					}
				});

				// Fill with default values for not matched parameters
				segments.forEach(function(routeSegment) {
					if(routeSegment.isParameter() && match.indexOf(routeSegment) === -1) {
						parameters[routeSegment.getName()] = routeSegment.getValue();
					}
				});

				return routeMatchResult({route: that, url: url, parameters: parameters});
			}

			return that;
		};

		// ### Route Factory
		//
		// Create route from pattern. A pattern can look like:
		//
		//	`/foo/#bar/?baz`
		//
		// See valid [segments](segments.html)
		//
		var routeFactory = function(routePattern, spec) {
			var segmentStrings = routePattern.split(urlSeparator);
			
			var nonEmptySegmentStrings = segmentStrings
				.map(Function.prototype.call, String.prototype.trim)
				.filter(Boolean);

			var segmentArray = nonEmptySegmentStrings.map(function(segmentString) {
				return routeSegments.segmentFactory(segmentString, spec);
			});

			return route({ 
				segments: segmentArray 
			});
		};

		// Generates all subsets of aray with same internal order
		// Returned subsets are ordered in right to left order.
		// Examples:
		// [1,2,3] => [1,2,3],[2,3],[1,3],[3],[1,2],[2],[1])
		var orderedSubsets = function(input) {
			var results = [], result, mask, 
				total = Math.pow(2, input.length);

			for (mask = 1; mask < total; mask++) {
				result = [];
				i = input.length - 1;
				do {
					if ((mask & (1 << i)) !== 0) {
						result.unshift(input[i]);
					}
				} while (i--);
				results.unshift(result);
			}

			return results;
		};


		// ### Route result
		//
		// Route match result are used as the answer of matching
		// a url for a route. 
		//
		// Parameters is a hash with matched segment names as keys
		// and matching url segment values.
		//
		var routeMatchResult = function(spec) {
			spec = spec || {};

			var url = spec.url;
			var route = spec.route;
			var parameters = spec.parameters || {};

			var that = {};

			that.getParameters = function() { return parameters; };

			that.getKeys = function() {
				return Object.keys(parameters);
			};

			that.getValues = function() {
				return that.getKeys().map(function(v) {
					return parameters[v];
				});
			};

			that.getRoute = function () {
				return route;
			};

			that.getUrl = function () {
				return url;
			};

			that.matched = function() {
				return true;
			};

			that.getCallbackArguments = function () {
				var callbackArguments = [];
				callbackArguments = callbackArguments.concat(that.getValues());
				callbackArguments.push(url.getQuery());
				return callbackArguments;
			};

			return that;
		};

		var routeNoMatchResult = function() {
			var that = routeMatchResult();

			that.matched = function() {
				return false;
			};

			return that;
		};

		return route;
	}
);