define([
	"klassified"
], function(klassified) {

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
	var routeMatchResult = klassified.object.subclass(function(that, my) {

		var url;
		var route;
		var urlParameters;
		var routeParameters;
		var parameters;

		my.initialize = function(spec) {
			my.super(spec);
			url = spec.url;
			route = spec.route;

			urlParameters = (url && url.getQuery && url.getQuery()) || {};
			routeParameters = spec.values || {};
			parameters = mergeParameters(routeParameters, urlParameters);
		};

		//
		// Public
		//

		/**
		 * Matched route
		 *
		 * @returns {route}
		 */
		that.getRoute = function() {
			return route;
		};

		/**
		 * Matched URL
		 *
		 * @returns {url}
		 */
		that.getUrl = function() {
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
		that.getActionArguments = function() {
			var actionArguments = Object.keys(routeParameters).map(function(parameterName) {
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
				if (routeParameters.hasOwnProperty(parameterName)) {
					allValues[parameterName] = routeParameters[parameterName];
				}
			}

			// Fill with query parameters
			for (var queryParameterName in queryParameters) {
				if (queryParameters.hasOwnProperty(queryParameterName)) {
					allValues[queryParameterName] = queryParameters[queryParameterName];
				}
			}

			return allValues;

		}
	});

	routeMatchResult.class(function(that) {

		/**
		 * Result to use when match does not match url
		 */
		that.routeNoMatchResult = (function() {

			/** @typedef {routeMatchResult} routeNoMatchResult */
			var instance = that();

			instance.isMatch = function() {
				return false;
			};

			return instance;
		})();
	});

	return routeMatchResult;
});
