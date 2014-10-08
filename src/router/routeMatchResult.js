define(
	[],
	function() {

		/**
		 * Route match result are used as the answer of matching a url against a route.
		 *
		 * @param {{}} [spec]
		 * @param {{}} spec.url Matched URL
		 * @param {{}} spec.route Matched Route
		 * @param {{}} spec.values Hash with matched parameter names as keys and matching url segment values.
		 *
		 * @returns {routeMatchResult}
		 */
		function routeMatchResult(spec) {
			spec = spec || {};

			var url = spec.url;
			var route = spec.route;

			var urlParameters = (url && url.getQuery && url.getQuery()) || {};
			var routeParameters = spec.values || {};
			var parameters = mergeParameters(routeParameters, urlParameters);

			/** @typedef {{}} routeMatchResult */
			var that = {};

			//
			// Public
			//

			/**
			 * Matched route
			 *
			 * @returns {route}
			 */
			that.getRoute = function () {
				return route;
			};

			/**
			 * Matched URL
			 *
			 * @returns {url}
			 */
			that.getUrl = function () {
				return url;
			};

			/**
			 * Answers true if route match URL
			 *
			 * @returns {boolean}
			 */
			that.isMatch = function() {
				return true;
			};

			/**
			 * Values for parameters in route
			 *
			 * @returns {{}}
			 */
			that.getRouteParameters = function() {
				return routeParameters;
			};

			/**
			 * Values for parameters in query
			 *
			 * @returns {{}}
			 */
			that.getQueryParameters = function() {
				return url.getQuery();
			};

			/**
			 * All matched parameters
			 *
			 * @returns {{}}
			 */
			that.getParameters = function() {
				return parameters;
			};

			/**
			 * Constructs an array with all parameters in same order as in route pattern with
			 * query parameter as the last value.
			 *
			 * @returns {Array}
			 */
			that.getActionArguments = function () {
				var actionArguments =  Object.keys(routeParameters).map(function (parameterName) {
					return routeParameters[parameterName];
				});
				actionArguments.push(url.getQuery());
				return actionArguments;
			};

			//
			// Private
			//

			function mergeParameters(routeParameters, queryParameters) {
				var allValues = {};

				// Fill with route parameters
				for (var parameterName in routeParameters) {
					if(routeParameters.hasOwnProperty(parameterName)) {
						allValues[parameterName] = routeParameters[parameterName];
					}
				}

				// Fill with query parameters
				for (var queryParameterName in queryParameters) {
					if(queryParameters.hasOwnProperty(queryParameterName)) {
						allValues[queryParameterName] = queryParameters[queryParameterName];
					}
				}

				return allValues;

			}

			return that;
		}

		/**
		 * Result to use when match does not match url
		 */
		routeMatchResult.routeNoMatchResult = (function() {

			/** @typedef {routeMatchResult} routeNoMatchResult */
			var that = routeMatchResult();

			that.isMatch = function() {
				return false;
			};

			return that;
		}());

		return routeMatchResult;
	}
);