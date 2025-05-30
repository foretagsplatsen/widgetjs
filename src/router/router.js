import "jquery";
import { eventCategory } from "yaem";
import { object } from "klassified";
import hashLocation from "./hashLocation.js";
import route from "./route.js";
import url from "./url.js";

/**
 * Lazily creates a singleton instance of
 * hash-fragment listener `hashLocation()`.
 *
 * @returns {hashLocation}
 */
function hashSingleton() {
	hashSingleton.instance ||= hashLocation();

	return hashSingleton.instance;
}

/**
 * Router allow you to keep state in the URL. When a user visits a specific URL the application
 * can be transformed accordingly.
 *
 * Router have a routing table consisting of an array of routes. When the router resolves a URL
 * each route is matched against the URL one-by-one. The order is defined by the route priority
 * property (lower first). If two routes have the same priority or if priority is omitted, routes
 * are matched in registration order.
 *
 * @param [spec]
 * @param [spec.locationHandler] hashSingleton by default
 *
 * @returns {{}}
 */
const router = object.subclass((that, my) => {
	my.initialize = function (spec) {
		my.super(spec);
		my.location = spec.locationHandler || hashSingleton();
		my.routeTable = [];
		my.lastMatch = undefined;
		my.defaultParameters = {};

		// Listen for URL changes and resolve URL when changed
		my.location.changed.register(() => {
			my.resolveUrl();
		});
	};

	// Events
	my.events = eventCategory();

	//
	// Public
	//

	/**
	 * Triggered when a route is matched with `routeMatchResult` as argument.
	 * @type {event}
	 */
	that.routeMatched = my.events.createEvent("routeMatched");
	that.onRouteMatched = that.routeMatched; // deprecated

	/**
	 * Triggered when a route is not matched with "url" as argument.
	 * @type {event}
	 */
	that.routeNotFound = my.events.createEvent("routeNotFound");
	that.onRouteNotFound = that.routeNotFound; // deprecated

	/**
	 * Triggered each time a URL is resolved with `url` as argument
	 * @type {event}
	 */
	that.onResolveUrl = my.events.createEvent("resolveUrl");

	// @deprecated Use event property instead
	that.on = my.events.register;

	//
	// Public
	//

	/**
	 * Tries to resolve URL by matching the URL against all routes in
	 * route table. Unless `fallThrough` is set on the matched route, router
	 * will stop on first match.
	 *
	 * Last match is also stored as `my.lastMatch`
	 *
	 * @param {url} [aUrl] A URL or current url as default
	 */
	that.resolveUrl = function (aUrl) {
		if (typeof aUrl === "string") {
			aUrl = url({ rawUrl: aUrl });
		}

		my.resolveUrl(aUrl);
	};

	/**
	 * Creates and adds a new route to the routing table.
	 *
	 * @example
	 *
	 *        // Simplest possible route
	 *        aRouter.addRoute({
	 *			pattern: "/user/#id",
	 *			action: function(id, query) { console.log(id, query);},
	 *		});
	 *
	 *        // Route with name and priority,
	 *        aRouter.addRoute({
	 *			name: "user",
	 *			pattern: "/user/#id",
	 *			priority: 4000,
	 *			action: function(id) { console.log(id);},
	 *		});
	 *
	 *        // Route with only pattern and custom matched event handler,
	 *        var route = aRouter.addRoute({ pattern: ""/user/#id""});
	 *        route.matched.register(function(result) {
	 *			console.dir(result.getValues());
	 *		});
	 *
	 *        // Route with route options,
	 *        aRouter.addRoute({
	 *			pattern: "/user/#id",
	 *			priority: 4000,
	 *			defaults: {
	 *				id: "john_doe"
	 *			},
	 *			constraints: {
	 *				id: ["john_doe", "jane_doe"]
	 *			}
	 *		});
	 *
	 *
	 * @param {routeSpec} routeSpec Options passed to route plus options below
	 * @param {string} routeSpec.pattern Route pattern as string
	 * @param {function} routeSpec.action Executed when route is matched with parameters as arguments +
	 * query object as the last argument.
	 * @param {string} routeSpec.pattern Route pattern as string
	 *
	 * @returns {route}
	 */
	that.addRoute = function (routeSpec) {
		routeSpec ||= {};

		const newRoute = route({
			pattern: routeSpec.pattern,
			options: routeSpec,
		});

		if (routeSpec.action) {
			newRoute.matched.register(function (result) {
				routeSpec.action.apply(this, result.getActionArguments());
			});
		}

		newRoute.name = routeSpec.name;
		newRoute.fallThrough = routeSpec.fallThrough;

		newRoute.priority = routeSpec.priority;
		my.addRoute(newRoute);

		return newRoute;
	};

	/**
	 * Find a route using a predicate function. The function is applied on routes
	 * on-by-one until match.
	 *
	 * @param {function} predicate
	 * @returns {route} Matched route or null if not matched
	 */
	that.findRoute = function (predicate) {
		const numRoutes = my.routeTable.length;
		for (let routeIndex = 0; routeIndex < numRoutes; routeIndex++) {
			// eslint-disable-next-line no-shadow -- we should fix that later
			const route = my.routeTable[routeIndex];
			if (predicate(route)) {
				return route;
			}
		}

		return null;
	};

	/**
	 * Finds route by name
	 *
	 * @param {string} routeName
	 * @returns {route}
	 */
	that.getRouteByName = function (routeName) {
		return that.findRoute(
			// eslint-disable-next-line no-shadow -- we should fix that later
			(route) => route.name && route.name === routeName,
		);
	};

	/**
	 * Removes a route from routing table
	 *
	 * @param route
	 */
	// eslint-disable-next-line no-shadow -- we should fix that later
	that.removeRoute = function (route) {
		const index = my.routeTable.indexOf(route);
		if (index === -1) {
			throw new Error("Route not in route table");
		}

		my.routeTable.splice(index, 1);
	};

	/**
	 * Removes all routes from routing table.
	 */
	that.clear = function () {
		my.routeTable = [];
		my.lastMatch = undefined;
	};

	/**
	 * Pipes URL matching "routeSpec" to another router.
	 *
	 * @param {{}} routeSpec Same options as `addRoute`
	 * @param {router} router
	 *
	 * @returns {route}
	 */
	// eslint-disable-next-line no-shadow -- we should fix that later
	that.pipeRoute = function (routeSpec, router) {
		if (!routeSpec || !routeSpec.pattern) {
			throw new Error("Route pattern required");
		}

		const aRoute = that.addRoute(routeSpec);

		aRoute.matched.register((result) => {
			router.resolveUrl(result.getUrl());
		});

		return aRoute;
	};

	/**
	 * Pipe not found to a different router
	 *
	 * @param {router} router
	 * @returns {route}
	 */
	// eslint-disable-next-line no-shadow -- we should fix that later
	that.pipeNotFound = function (router) {
		return that.routeNotFound.register((aRawUrl) => {
			router.resolveUrl(aRawUrl);
		});
	};

	/**
	 * Returns the current URL
	 * @returns {url}
	 */
	that.getUrl = function () {
		return my.location.getUrl();
	};

	/**
	 * Constructs a link that can be used eg. in href.
	 *
	 * @example
	 *    // Link to a route by name (recommended)
	 *    aRouter.linkTo("users-list", {user: "jane"});
	 *
	 *    // Link to a path
	 *    aRouter.linkTo("/user/mikael");
	 *    aRouter.linkTo("/user/", {sortBy: "name"});
	 *
	 * @param {string} routeName Name of route or path
	 * @param {{}} [parameters]
	 * @param {boolean} [includeCurrentParameters] Merge parameters with parameters in current match.
	 *
	 * @returns {string}
	 */
	that.linkTo = function (routeName, parameters, includeCurrentParameters) {
		// eslint-disable-next-line no-shadow -- we should fix that later
		const route = that.getRouteByName(routeName);
		if (route) {
			return my.location.linkToUrl(
				that.expand({
					routeName: route.name,
					parameters,
					excludeCurrentParameters: !includeCurrentParameters,
				}),
			);
		}

		// fallback to path (eg. /user/john) if route is not defined
		return that.linkToPath(routeName, parameters);
	};

	/**
	 * Link to a path
	 *
	 * @example
	 *    aRouter.linkToPath("/user/mikael");
	 *    aRouter.linkToPath("/user/", {sortBy: "name"});
	 *
	 * @param {string} path
	 * @param {{}} query
	 * @returns {string}
	 */
	that.linkToPath = function (path, query) {
		return that.linkToUrl(url.build(path, query));
	};

	/**
	 * Link from url
	 *
	 * @param {url} aUrl
	 * @returns {string}
	 */
	that.linkToUrl = function (aUrl) {
		return my.location.linkToUrl(aUrl);
	};

	/**
	 * Redirects browser to route or path.
	 *
	 * @example
	 *    // Redirect to a route by name
	 *    aRouter.redirectTo("users-list", {user: "jane"});
	 *
	 *    // Redirect to a path
	 *    aRouter.redirectTo("/user/mikael");
	 *    aRouter.redirectTo("/user/", {sortBy: "name"});
	 *
	 * @param {string} routeName
	 * @param {{}} [parameters]
	 * @param {boolean} [includeCurrentParameters] Merge parameters with parameters in current match.
	 *
	 * @returns {string}
	 */
	that.redirectTo = function (
		routeName,
		parameters,
		includeCurrentParameters,
	) {
		// eslint-disable-next-line no-shadow -- we should fix that later
		const route = that.getRouteByName(routeName);
		if (route) {
			return my.location.setUrl(
				that.expand({
					routeName: route.name,
					parameters,
					excludeCurrentParameters: !includeCurrentParameters,
				}),
			);
		}

		return that.redirectToPath(routeName, parameters);
	};

	/**
	 * Redirect to a path
	 *
	 * @example
	 *    aRouter.redirectToPath("/user/mikael");
	 *    aRouter.redirectToPath("/user/", {sortBy: "name"});
	 *
	 * @param {string} path
	 * @param {{}} query
	 * @returns {string}
	 */
	that.redirectToPath = function (path, query) {
		return that.redirectToUrl(url.build(path, query));
	};

	/**
	 * Redirect to url
	 *
	 * @param {url} aUrl
	 * @returns {string}
	 */
	that.redirectToUrl = function (aUrl) {
		return my.location.setUrl(aUrl);
	};

	/**
	 * Redirect to another location (as in window.location) path.
	 *
	 * @param {string} path
	 * @return {undefined}
	 */
	that.redirectToLocationPath = function (path) {
		window.location.href = path.startsWith("/") ? path : `/${path}`;
	};

	/**
	 * Change the URL to be `newLocation`.
	 *
	 * @param {string} newLocation - The new URL.
	 */
	that.setLocation = function (newLocation) {
		window.location = newLocation;
	};

	/**
	 * Reload the current URL, just like the "refresh" button.
	 */
	that.reloadPage = function () {
		window.location.reload();
	};

	/**
	 * Constructs a new URL from parameters with a route as template. If no route is
	 * supplied the last matched route is used.
	 *
	 * Parameters are merged with parameters from last match unless `excludeCurrentParameters`
	 * is set to true.
	 *
	 * @param {{}} [options]
	 * @param {string} [options.routeName] Name of route to link to. Default route from last match.
	 * @param {{}} [options.parameters]
	 * @param {boolean} [options.excludeCurrentParameters]
	 *
	 * @returns {url}
	 */
	that.expand = function (options) {
		const routeName = options.routeName;
		const suppliedParameters = options.parameters || {};
		const excludeCurrentParameters =
			options.excludeCurrentParameters || false;

		// Pick a template route
		let templateRoute;
		if (routeName) {
			templateRoute = that.getRouteByName(routeName) || route();
		} else if (my.lastMatch) {
			templateRoute = my.lastMatch.getRoute();
		} else {
			templateRoute = route();
		}

		// Merge current parameters with supplied parameters
		const currentParameters = excludeCurrentParameters
			? {}
			: that.getParameters();
		const allParameters = merge(currentParameters, suppliedParameters);

		// Fill with defaults if needed
		Object.keys(my.defaultParameters).forEach((parameterName) => {
			if (parameterName in allParameters) return;

			allParameters[parameterName] =
				typeof my.defaultParameters[parameterName] === "function"
					? my.defaultParameters[parameterName]()
					: my.defaultParameters[parameterName];
		});

		// Expand template route and construct URL
		const aRawUrl = templateRoute.expand(allParameters);
		return url({ rawUrl: aRawUrl });
	};

	/**
	 * Constructs a link from supplied parameters.
	 *
	 * @param {{}} [parameters]
	 * @param {boolean} [excludeCurrentParameters]
	 *
	 * @returns {string}
	 */
	that.linkToParameters = function (parameters, excludeCurrentParameters) {
		return my.location.linkToUrl(
			that.expand({
				parameters,
				excludeCurrentParameters,
			}),
		);
	};

	/**
	 * Constructs a link from supplied parameters.
	 *
	 * @param {{}} [parameters]
	 * @param {boolean} [excludeCurrentParameters]
	 *
	 * @returns {string}
	 */
	that.setParameters = function (parameters, excludeCurrentParameters) {
		that.redirectToUrl(
			that.expand({
				parameters,
				excludeCurrentParameters,
			}),
		);
	};

	/**
	 * Return current parameters, ether from last match or if no match
	 * from query in current URL.
	 *
	 * @returns {{}} Parameter values with parameter names as keys
	 */
	that.getParameters = function () {
		if (!my.lastMatch) {
			return my.location.getUrl().getQuery();
		}

		return my.lastMatch.getParameters();
	};

	/**
	 * Returns parameter value by name
	 *
	 * @param {string} parameterName
	 * @returns {*}
	 */
	that.getParameter = function (parameterName) {
		const parameters = that.getParameters();
		return parameters[parameterName];
	};

	that.setDefaultParameter = function (parameterName, value) {
		my.defaultParameters[parameterName] = value;
	};

	/**
	 * Navigate back to previous location in history. If history is empty
	 * the location will be changed to fallback URL.
	 *
	 * @param {string|url} aFallbackUrl
	 * @returns {string} URL
	 */
	that.back = function (aFallbackUrl) {
		return my.location.back(aFallbackUrl);
	};

	/**
	 * Return `true` if the history is empty
	 */
	that.isHistoryEmpty = function () {
		return my.location.isHistoryEmpty();
	};

	/**
	 * Start listening for location changes and automatically
	 * resolve new URLs (including the current)
	 */
	that.start = function () {
		my.location.start();
		my.resolveUrl(); // resolve current url
	};

	/**
	 * Stop listening for location changes.
	 */
	that.stop = function () {
		my.location.stop();
	};

	//
	// Protected
	//

	/**
	 * Tries to resolve URL by matching the URL against all routes in
	 * route table. Unless `fallThrough`is set on the matched route router
	 * will stop on first match.
	 *
	 * Last match is also stored as `my.lastMatch`
	 *
	 * @param {url} [aUrl] A URL or current url as default
	 */
	my.resolveUrl = function (aUrl) {
		const currentUrl = aUrl === undefined ? my.location.getUrl() : aUrl;

		that.onResolveUrl.trigger(currentUrl);

		let numMatched = 0;

		my.routeTable.some((candidateRoute) => {
			const result = currentUrl.matchRoute(candidateRoute);
			if (result.isMatch()) {
				my.lastMatch = result;
				numMatched++;
				that.routeMatched.trigger(result);

				if (
					candidateRoute.fallThrough === undefined ||
					candidateRoute.fallThrough === false
				) {
					return true;
				}
			}
			return null;
		});

		if (numMatched === 0) {
			that.routeNotFound.trigger(currentUrl.toString());
		}
	};

	/**
	 * Injects route in route table. Routes are ordered by priority (lower first) with
	 * routes without priority last. Routes with same priority are order in
	 * registration order.
	 *
	 * @param {route} route
	 */
	// eslint-disable-next-line no-shadow -- we should fix that later
	my.addRoute = function (route) {
		let routeIndex = my.routeTable.length;
		if (route.priority !== undefined) {
			do {
				--routeIndex;
			} while (
				my.routeTable[routeIndex] &&
				(my.routeTable[routeIndex].priority === undefined ||
					route.priority < my.routeTable[routeIndex].priority)
			);
			routeIndex += 1;
		}
		my.routeTable.splice(routeIndex, 0, route);
	};

	//
	// Private
	//

	/**
	 * Shallow merge all objects in arguments. Properties in later objects overwrites
	 * properties.
	 *
	 * @returns {{}}
	 */
	function merge() {
		const objects = Array.prototype.slice.call(arguments);

		const target = {};

		objects.forEach((obj) => {
			Object.keys(obj).forEach((key) => {
				target[key] = obj[key];
			});
		});

		return target;
	}
});

export default router;
