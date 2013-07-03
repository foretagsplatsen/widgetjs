define(
	[
		'./route'
	],
	function (route) {

		var urlSeparator = '/';

		// ### Url definition
		//
		// An `url` actually represents the fragment part of the actual url.
		// A `url` has a `path` and a `query`, parsed upon creation.
		// 
		// ### Route matching 
		//
		// Urls can be tested against routes with `matchRoute(route)`.  
		// Actual matching only takes the `path` into account, omitting the 
		// `query`, and is delegated to the `route` (passed as argument).
		// See also `route.js`.

		var url = function (string) {
			var that = {};

			string = string || '';

			// Parser instance used to parse the url path and query
			// upon creation.
			var parser = urlParser();

			// Path string of the url
			var path = string;

			var elements = [];

			// Query part of the url (?a=1&b=2)
			var query = {};

			// Public accessing methods
			that.getPath = function () { return path; };
			that.getQuery = function () { return query; };
			that.getElements = function () { return elements; };

			// Answer true if the route is a match for the receiver
			that.matchRoute = function (route) {
				return route.matchElements(that.getElements());
			};

			// Method called upon url creation.
			function setup() {
				elements = parser.parsePath(string);
				query = parser.parseQuery(string);
			}

			setup();

			return that;
		};

		
		// ### Url parser definition 
		//
		// A parser can parse the path string with `parsePath()` and
		// the query with `parseQuery()`.
		//
		// Both parsing methods answer the parsed result.
		var urlParser = function() {
			var that = {};

			// The path string is first sanitized, then cut down into
			// fragments.
			that.parsePath = function(string) {
				// Remove the optional query string from the path
				var path = string.replace(/\?.*$/g, '');
				//Remove the first / if any and duplicated / in the path
				path = path.replace(/^\//, '');
				path = path.replace(/\/\//g, '/');

				return path.split(urlSeparator);
			};

			// Extracts query key/value(s) from a string and add them
			// to `query` object.
			that.parseQuery = function(string) {
				var result = /[^?]+\?(.*)$/g.exec(string);
				var query = {};
				var pair;
				if (result) {
					(result[1].split("&")).forEach(function (each) {
						pair = each.split("=");
						query[pair[0]] = pair[1];
					});
				}
				
				return query;
			};

			return that;
		};

		return url;
	}
);
