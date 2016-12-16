define([
	"klassified"
], function(klassified) {

	/**
	 * Token/Char used to separate segments in URL paths.
	 * @type {string}
	 */
	var urlSeparator = "/";

	/**
	 * A `url` actually represents the fragment part of the actual url.
	 *
	 * @example
	 *    var url = url({rawUrl: "path/to?foo=a&bar=b"});
	 *    url.getPath(); // => "path/to"
	 *    url.getQuery(); // => {foo: "a", bar: "b"}
	 *    url.matchRoute(aRoute); // => true
	 *
	 * @param {string} rawUrl
	 * @returns {url}
	 */
	var url = klassified.object.subclass(function(that, my) {

		var rawUrl;
		var path;
		var query;
		var segments;

		my.initialize = function(spec) {
			my.super(spec);
			rawUrl = spec.rawUrl || "";
			path = parsePath(rawUrl);
			query = parseQuery(rawUrl);
			segments = parseSegments(path);
		};

		//
		// Public
		//

		/**
		 * URL path
		 * @returns {string}
		 */
		that.getPath = function() { return path; };

		/**
		 * Key/Value pairs parsed from query
		 *
		 * @returns {{}}
		 */
		that.getQuery = function() { return query; };

		/**
		 * Segments in path parsed by splitting `path` by `urlSeparator`
		 *
		 * @returns {string[]}
		 */
		that.getSegments = function() { return segments; };

		/**
		 * Answers true if the route is a match for the receiver
		 *
		 * @param route
		 * @returns {boolean}
		 */
		that.matchRoute = function(route) {
			return route.matchUrl(that);
		};

		/**
		 * Returns `rawUrl`
		 * @returns {string}
		 */
		that.toString = function() {
			return rawUrl;
		};
	});

	/**
	 * Create URL from path and query
	 *
	 * @example
	 *    var aUrl = url("/path/to", {foo: "bar" });
	 *    aUrl.toString(); // => "path/to?foo=bar"
	 *
	 * @param {string} path
	 * @param {{}} query
	 * @returns {url}
	 */
	url.build = function(path, query) {
		if (typeof(path) === "undefined" || path === null || typeof path !== "string") {
			throw "accepts only string paths";
		}

		if (query) {
			var queryPart = decodeURIComponent(jQuery.param(query));
			if (queryPart) {
				return url({rawUrl: path + "?" + queryPart});
			}
		}

		return url({rawUrl: path});
	};

	/**
	 * Splits URL path into segments. Removes leading, trailing, and
	 * duplicated `urlSeparator`.
	 *
	 * @example
	 *    parseSegments("/a/path/to"); // => ["a", "path", "to"]
	 *
	 * @param path
	 * @returns {string[]}
	 */
	function parseSegments(path) {
		// Split on separator and remove all leading, trailing, and
		// duplicated `urlSeparator` by filtering empty strings.
		return path.split(urlSeparator).filter(Boolean);
	}

	/**
	 * Returns path from a raw URL
	 *
	 * @example
	 *    parsePath("/a/path/to?foo=bar"); // => "/a/path/to"
	 *
	 * @param {string} rawUrl
	 * @returns {string}
	 */
	function parsePath(rawUrl) {
		return rawUrl.replace(/\?.*$/g, "");
	}

	/**
	 * Extract query key/value(s) from a rawUrl and return them as an
	 * object literal with key/values.
	 *
	 * @example
	 *    parsePath("/a/path/to?foo=bar&test=1"); // => {foo: "bar", test: "1"}
	 *
	 * @param {string} rawUrl
	 * @returns {{}}
	 */
	function parseQuery(rawUrl) {
		// Extract query key/value(s) from a rawUrl and add them to `query` object.
		var result = /[^?]*\?(.*)$/g.exec(rawUrl);
		var query = {};
		var pair;
		if (result && result.length >= 2) {
			(result[1].split("&")).forEach(function(each) {
				pair = each.split("=");
				query[pair[0]] = pair[1];
			});
		}

		return query;
	}

	return url;
});
