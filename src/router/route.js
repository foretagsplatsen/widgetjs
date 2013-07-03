define(
	[],
	function () {

		var urlSeparator = '/';

		// ### Route object definition
		// 
		// Routes are used to match urls in routers. Routes represent
		// the path taken for which an action has to be taken
		// (registered in the router with an associated callback
		// function.
		//
		// A route has an `elements` array and can match an `url`
		// against its fragments (and parameters..  Routes are built
		// from string representations
		var route = function(string) {
			var that = {};

			var elements = [];
			var stream = routeParameterStream(elements);

			that.stream = function() { return stream; };
			that.getElements = function() { return elements; };

			// Answer true if the elements array matches each of the route
			// elements. The strategy is to try several passes with
			// and without optional parameters
			that.matchElements = function(urlElements) {
				return matchUrlElements(urlElements);
			};

			// Answer the parameters from the elements array
			function getParameters() {
				var parameters = [];
				elements.forEach(function (each) {
					if (each.isParameter()) {
						parameters.push(each.getValue());
					}
				});
				return parameters;
			}

			// try to match an url elements with `elements`. Recursively
			// remove optional params if it doesn't match
			function matchUrlElements(urlElements) {
				var parameters = getParameters();
				var result = routeMatchResult(parameters);
				return stream.match(urlElements, result);
			}

			// Elements setup. See segment(s) and the `prefix`
			// attached to parameters.
			//
			// Called upon creation.
			function setupElements() {
				var elements = string.split(urlSeparator);
				elements.forEach(function (each) {
					if (each.length > 0) {
						addToElements(each);
					}
				});
			}

			function addToElements(string) {
				elements.push(createElement(string));
			}

			// Create and answer a segment created from `string`.
			function createElement(string) {
				var element;

				// find the right parameter
				parameters.forEach(function (each) {
					if (string[0] === each.prefix) {
						element = each(string);
					}
				});

				// fallback to a simple segment
				if (element === undefined) {
					element = segment(string);
				}

				return element;
			}


			// Initialization
			setupElements();

			return that;
		};


		// ### read-only route stream definition.
		// Used to stream over a route elements segments to match an url
		var routeStream = function (elements) {
			var that = {};

			// Internally hold onto the position of the stream.
			var position = 0;

			// Accessors definition
			that.getElements = function () {
				return elements;
			};

			that.getPosition = function () {
				return position;
			};


			// Answer true if the stream has reached the end of the
			// route.
			that.atEnd = function () {
				return position >= elements.length;
			};

			// Answer the next element *without* moving the stream
			that.peek = function () {
				return elements[position];
			};

			// Answer the next element *and* moved the stream by 1.
			that.next = function () {
				if (that.atEnd()) {
					return null;
				}
				var element = that.peek();
				position = position + 1;
				return element;
			};

			// Reset the stream to the beginning of the route.
			that.reset = function () {
				position = 0;
			};

			return that;
		};

		
		// ### Parameter stream definition
		//
		// Special route stream used to match parameters with an
		// url.
		//
		// ### match()
		// `match()` tests the route against an url path.
		// Used together with a `routeMatchResult` object, filled
		// with the result of the match.
		
		var routeParameterStream = function(elements) {
			var that = routeStream(elements);
			
			// Match an url elements (represented here as `elements`). 
			// If the stream does not match an optional parameter, 
			// the stream is rewinded til the last optional parameter 
			// and the process goes on.
			that.match = function (urlElements, result) {
				var matched = true;
				var newStream;

				// Guard
				if (that.getElements().length < urlElements.length) {
					return result;
				}

				urlElements.forEach(function (each) {
					if (matched) {
						matched = that.next().match(each);
					}
				});

				// All elements matched and we are at the end of the
				// stream. Hourra, we made it!
				if (matched && that.atEnd()) {
					result.match();
					return result;
				}

				// Did not match. Try without the first optional parameter
				newStream = trimOptionalParameter();
				return newStream.match(urlElements, result);
			};

			// Answer a new stream with the elements trimmed
			var trimOptionalParameter = function () {
				// keep a copy of the elements array
				var trimmedElements = [];
				var trimmed = false;

				that.getElements().forEach(function (each) {
					if (!trimmed) {
						if (each.isOptional()) {
							trimmed = true;
						}
						else {
							trimmedElements.push(each);
						}
					}
					else {
						trimmedElements.push(each);
					}
				});

				if (!trimmed) { trimmedElements = []; }

				return routeParameterStream(trimmedElements);
			};


			return that;
		};



		// ### Route segment
		//
		// A segment represents a single part of the route.
		//
		// Three kind of segments are currently defined:
		// - segment: simple segment
		// - parameter: parameter segment, starting with a '#'
		// - optioanl parameter: optional parameter segment, starting with a '?'
		//
		// *Example:*
		//
		// '/foo/#bar/?baz' will be cut down into a route with 3 segments:
		// - foo -> segment
		// - bar -> parameter
		// - baz -> optional parameter

		var segment = function (value) {
			var that = {};

			that.getValue = function () {
				return value;
			};

			that.isParameter = function () { return false; };
			that.isOptional = function () { return false; };

			// Answer true if the receiver is a match for an url elements
			// element
			that.match = function (string) {
				return value === string;
			};

			return that;
		};

		// ### Route parameter definition
		//
		// Note: the leading '#' is *not* part of the value of the
		// segment.

		var parameter = function (value) {
			// Parameters have a prefix, get rid of it
			var that = segment(value.substr(1));

			that.isParameter = function () { return true; };

			// For parameters, always answer true if the string is defined.
			// Since it's a parameter, the value doesn't matter
			that.match = function (string) {
				return typeof string === 'string';
			};

			return that;
		};

		// ### Optional parameter definition
		// 
		// Note: the leading '?' is *not* part of the value of the
		// segment.

		var optionalParameter = function (value) {
			var that = parameter(value);

			that.isOptional = function () { return true; };

			// Optional, so always answer true
			that.match = function () { return true; };

			return that;
		};

		// ### Syntax definition.
		// To add an element prefix, add it to the elements element function.

		var parameters = [parameter, optionalParameter];
		parameter.prefix = '#';
		optionalParameter.prefix = '?';

		// ### Route result definition
		//
		// Route matched results are used as the answer of a matching
		// url for a route. Instances are passed as arguments to
		// `route.match()` and filled appropriately depending on the
		// match.

		var routeMatchResult = function (elements) {
			var that = {};

			var matched = false;

			elements = elements || null;

			// Public accessors
			that.getElements = function () {
				return elements;
			};

			that.setElements = function (elts) {
				elements = elts;
			};

			that.matched = function () {
				return matched;
			};

			that.match = function () {
				matched = true;
			};

			return that;
		};


		return route;
	}
);
