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

			var path = urlParser.parsePath(rawUrl);

			var segments = urlParser.parseSegments(path);

			// Query part of the url (?a=1&b=2)
			var query = urlParser.parseQuery(rawUrl);

			// Public accessing methods

			that.getPath = function () { return path; };
			that.getQuery = function () { return query; };
			that.getSegments = function () { return segments; };

			// Answer true if the route is a match for the receiver
			that.matchRoute = function (route) {
				return route.matchUrl(that);
			};

			that.toString = function() {
				return rawUrl;
			};

			return that;
		};

		url.build = function(path, query) {
			if (typeof(path) === 'undefined' || path === null || typeof path !== "string") {
				throw 'accepts only string paths';
			}

			if (query) {
                var queryPart = decodeURIComponent(jQuery.param(query));
                if(queryPart) {
                    return url((path + '?' + queryPart));
                }
            }

			return url(path);
		};


		// ### Url parser definition
		//
		// A parser can parse the path URL with `parsePath()` and
		// the query with `parseQuery()`.
		//
		// Both parsing methods answer the parsed result.
		var urlParser = (function() {
			var that = {};

			that.parseSegments = function(path) {
				var sanitizedPath = path;
				//Remove the first / if any and duplicated / in the path and trailing slash
				sanitizedPath = sanitizedPath.replace(/^\//, '');
				sanitizedPath = sanitizedPath.replace(/\/\//g, '/');
				sanitizedPath = sanitizedPath.replace(/\/+$/, '');

				return sanitizedPath.split(urlSeparator).filter(Boolean);
			};

			that.parsePath = function(rawUrl) {
				return rawUrl.replace(/\?.*$/g, '');
			};

			that.parseQuery = function(string) {
				// Extract query key/value(s) from a string and add them to `query` object.
				var result = /[^?]*\?(.*)$/g.exec(string);
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
		}());

		return url;
	}
);
