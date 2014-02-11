/**
 * @module widgetjs/router/url
 */
define(
	[],
	function () {

        /**
         * Token separating URL segments
         */
        var urlSeparator = '/';

        /**
         * Token separating path from query
         */
        var querySeparator = '?';

        /**
         * A `url` actually represents the fragment part of the actual url.
         * A `url` has a `path` and a `query`, parsed upon creation.
         *
         * @alias module:widgetjs/router/url
         * @param rawUrl {string}
		 * @returns {url}
         */
		var url = function (rawUrl) {
            var path = parsePath(rawUrl);

            var segments = parseSegments(path);

            var query = parseQuery(rawUrl);

            /** @lends module:widgetjs/router/url.prototype */
			var that = {};

			rawUrl = rawUrl || '';

            /**
             * Path part of URL
             * @returns {string}
             */
            that.getPath = function () { return path; };

            /**
             * Query part of url as hash
             * @returns {{}}
             */
			that.getQuery = function () { return query; };

            /**
             * Path as a segment array
             * @returns {string[]}
             */
			that.getSegments = function () { return segments; };

			// Answer true if the route is a match for the receiver

            /**
             * Match URL against route.
             * @param route
             * @returns {bool}
             */
            that.matchRoute = function (route) {
				return route.matchUrl(that);
			};

            /**
             * Return raw url
             * @returns {string}
             */
			that.toString = function() {
				return rawUrl;
			};

			return that;
		};

        /**
         * Build URL from path and query
         *
         * @function
         * @param path {string}
         * @param query {{}}
         * @returns {url}
         */
		url.build = function(path, query) {
			if (typeof(path) === 'undefined' || path === null || typeof path !== "string") {
				throw 'accepts only string paths';
			}

			if (query) {
                var queryPart = decodeURIComponent(jQuery.param(query));
                if(queryPart) {
                    return url(path + querySeparator + queryPart);
                }
            }

			return url(path);
		};

        /**
         * Split path into segments
         *
         * @param path {string}
         * @returns {string[]}
         */
        function parseSegments (path) {
            var sanitizedPath = path;
            //Remove the first / if any and duplicated / in the path and trailing slash
            sanitizedPath = sanitizedPath.replace(/^\//, '');
            sanitizedPath = sanitizedPath.replace(/\/\//g, '/');
            sanitizedPath = sanitizedPath.replace(/\/+$/, '');

            return sanitizedPath.split(urlSeparator).filter(Boolean);
        }

        /**
         * Extract path part from raw url
         * @param rawUrl
         * @returns {string}
         */
        function parsePath (rawUrl) {
            return rawUrl.replace(/\?.*$/g, '');
        }

        /**
         * Extract query part from raw url and parse key/values into an object
         * @param rawUrl
         * @returns {{}}
         */
        function parseQuery(rawUrl) {
            var result = /[^?]+\?(.*)$/g.exec(rawUrl);
            var query = {};
            var pair;
            if (result) {
                (result[1].split("&")).forEach(function (each) {
                    pair = each.split("=");
                    query[pair[0]] = pair[1];
                });
            }

            return query;
        }

		return url;
	}
);
