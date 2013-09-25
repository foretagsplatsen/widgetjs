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
				// Match URL segments against route segments
				var urlSegments = url.getSegments();

				var matchingSegments = findMatch(urlSegments); 
				if(!matchingSegments) {
					return routeNoMatchResult();
				}

				// Get values for each matching parameter and return as result
				var parameters = getParameters(matchingSegments, urlSegments);
				var result = routeMatchResult({route: that, url: url, parameters: parameters});

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

				// TODO: rtewrite
				for(var segmentIndex = 0; segmentIndex < sequence.length; segmentIndex++) {
					var urlSegment = urlSegments[segmentIndex]; 
					var routeSegment = sequence[segmentIndex];
					if(urlSegment === undefined || !routeSegment.match(urlSegment)) {
						return false;
					}
				}

				return true;
			};

			function findMatch(urlSegments) {
				if(isMatch(urlSegments)) {
					return segments;
				}

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

				// Create arrays that we can use to pick all combinations of
				// optional positions.
				// 3 => [[2], [1], [0], [1,2], [0,1], [0,2], [0,1,2]]
				var generator = rangeSubsets(optionalPositions.length)
				
				// Generate all possible combinations of optional 
				generator.forEach(function(indexSequence) {
					// Clone segments array and remove optionals matching
					// indexes in index sequence
					var permutation = segments.slice();
					indexSequence.forEach(function(index, numRemoved) {
						// Use the generator index to look up the real
						// position of the optional using the optionalPositions array
						var optionalIndex = optionalPositions[index];

						// Remove optional but take in to account that we have already
						// removed {numRemoved} from permutation.
						permutation.splice(optionalIndex - numRemoved, 1);
					});

					optionalSequences.push(permutation); 
				});
			};

			function getParameters(segmentPath, urlSegments) {
				var parameters = {};

				// Fill with matched parameter values
				segmentPath.forEach(function(routeSegment, index) {
					if(routeSegment.isParameter()) {
						parameters[routeSegment.getName()] = routeSegment.getValue(urlSegments[index]);
					}
				});

				// Fill unmatched parameters
				segments.forEach(function(routeSegment) {
					if(routeSegment.isParameter() && segmentPath.indexOf(routeSegment) === -1){ //!segmentPath.contains(routeSegment)) {
						parameters[routeSegment.getName()] = routeSegment.getValue(); // should return default
					}
				});

				return parameters;
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

		// Generates a range of a given size. Eg. 3 => [1,2,3]
		// Then generates all subsets of the range (with same internal order)
		// Returned subsets are ordered in right to left order. 
		// Examples: 
		// 1 => [[0]]
		// 2 => [[0], [0,1]]
		// 3 => [[2], [1], [0], [1,2], [0,1], [0,2], [0,1,2]]
		function rangeSubsets(size) {
			var queue = [];
			var anArray = [];
			for(var i = 0; i < size; i++) {
				anArray.push(i);
				queue.push([i]);
			}

			anArray.slice().map(function(item) {
				return [item];
			});

			var permutations = [];
			while (queue.length > 0) {
				var seqence = queue.pop();
				permutations.push(seqence);

				var indexLastItem = seqence[seqence.length - 1];         
				var remaining = anArray.slice(indexLastItem + 1);

				remaining.forEach(function(item) {
					var newSequence = seqence.concat(item);
					queue.unshift(newSequence);
				});
			}

			return permutations;
		}


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