import { object } from "klassified";

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
const routeMatchResult = object.subclass((that, my) => {
	let url;
	let route;
	let urlParameters;
	let routeParameters;
	let parameters;

	my.initialize = function (spec) {
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
	that.isMatch = function () {
		return true;
	};

	/**
	 * Values for parameters in route
	 *
	 * @returns {{}}
	 */
	that.getRouteParameters = function () {
		return routeParameters;
	};

	/**
	 * Values for parameters in query
	 *
	 * @returns {{}}
	 */
	that.getQueryParameters = function () {
		return url.getQuery();
	};

	/**
	 * All matched parameters
	 *
	 * @returns {{}}
	 */
	that.getParameters = function () {
		return parameters;
	};

	/**
	 * Constructs an array with all parameters in same order as in route pattern with
	 * query parameter as the last value.
	 *
	 * @returns {Array}
	 */
	that.getActionArguments = function () {
		let actionArguments = Object.keys(routeParameters).map(
			(parameterName) => routeParameters[parameterName],
		);
		actionArguments.push(url.getQuery());
		return actionArguments;
	};

	//
	// Private
	//

	function mergeParameters(routeParameters, queryParameters) {
		let allValues = {};

		// Fill with route parameters
		for (let parameterName in routeParameters) {
			if (
				Object.prototype.hasOwnProperty.call(
					routeParameters,
					parameterName,
				)
			) {
				allValues[parameterName] = routeParameters[parameterName];
			}
		}

		// Fill with query parameters
		for (let queryParameterName in queryParameters) {
			if (
				Object.prototype.hasOwnProperty.call(
					queryParameters,
					queryParameterName,
				)
			) {
				allValues[queryParameterName] =
					queryParameters[queryParameterName];
			}
		}

		return allValues;
	}
});

routeMatchResult.class((that) => {
	/**
	 * Result to use when match does not match url
	 */
	that.routeNoMatchResult = (function () {
		/** @typedef {routeMatchResult} routeNoMatchResult */
		let instance = that();

		instance.isMatch = function () {
			return false;
		};

		return instance;
	})();
});

export default routeMatchResult;
