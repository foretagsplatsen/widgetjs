define(
	[
		'./route'
	],
	function (route) {

		var urlSeparator = '/';

		// ### Url definition
		//
		// A `url` actually represents the fragment part of the actual url.
		// A `url` has a `path` and a `query`, parsed upon creation.
		// 
		// ### Route matching 
		//
		// Urls can be tested against routes with `matchRoute(route)`.  
		// Actual matching only takes the `path` into account, omitting the 
		// `query`, and is delegated to the `route` (passed as argument).
		// See also `route.js`.

		var url = function (rawUrl) {
			var that = {};

			rawUrl = rawUrl || '';

			// Parser instance used to parse the url path and query
			// upon creation.
			var parser = urlParser();

			// Path of the url
			var path = rawUrl;

			var segments = parser.parsePath(rawUrl);

			// Query part of the url (?a=1&b=2)
			var query = parser.parseQuery(rawUrl);

			// Public accessing methods
			that.getPath = function () { return path; };
			that.getQuery = function () { return query; };
			that.getSegments = function () { return segments; };

			// Answer true if the route is a match for the receiver
			that.matchRoute = function (route) {
				return route.matchUrl(that);
			};

			return that;
		};

		
		// ### Url parser definition 
		//
		// A parser can parse the path URL with `parsePath()` and
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
