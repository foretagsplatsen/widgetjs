define(
	[
		'jquery',
		'../events',
		'./route',
		'./url',
		'./hash'
	],
	function(jQuery, events, route, url, hash) {

		// Even if we create multiple routers
		// we usualy only want one hash-fragment
		// listner.
		var hashSingleton = function() {
			if(!hashSingleton.instance) {
				hashSingleton.instance = hash();
			}

			return hashSingleton.instance;
		};

		// ### Router
		//
		// Router allow you to keep state in the URL. When a user visits a specific URL the application
		// can be transformed accordingly.
		//
		// Router have a routing table concisting of an array of routes. When the router resolves a URL
		// each route is matched against the URL one-by-one. The order is defined by the route priority
		// property (lower first). If two routes have the same priority or if priority is omitted, routes
		// are matched in registration order.
		//
		// Routes are added using 'addRoute'
		//
		// Eg:
		//
		//		var route = aRouter.addRoute({
		//			pattern: '/user/#id',
		//			onMatch: function(result) { console.dir(result);}
		//		});
		//
		// onMatch is triggered when a URL match pattern
		//
		// _Note:_ By default router use [hash.js]('hash.js') to listen for URL changes.
		//
		// An event is also triggered on match with routeMatchResult as argument and
		// aswell when a route is 'not found' with url as argument.
		//
		// Usage:
		//
		//		router.on('match', function(result) {
		//			alert('Route match: ' + result.getUrl().getPath());
		//		});
		//
		//		router.on('notfound', function(url) {
		//			alert('404 - Url not found: ' + url);
		//		});
		//
		// Routers can be chained using `pipeRoute` and  `pipeNotFound`
		//
		//		router.pipeNotFound(anotherRouter);
		//		router.pipeRoute({ pattern: '/module/#feature'}, anotherRouter);
		//
		//
		var router = function(spec, my) {
			spec = spec || {};
			my = my || {};

			var that = {};

			my.location = spec.locationHandler || hashSingleton();
			my.routeTable = [];
			my.lastMatch = undefined;
			my.stopOnMatch = spec.stopOnMatch === undefined ? true : spec.stopOnMatch;

			// Listen for URL changes and resolve URL when changed
			my.location.on('changed', function() { my.resolveUrl(); });

			// Mixin events
			jQuery.extend(that, events.eventhandler());

			my.resolveUrl = function(aUrl) {
				var currentUrl = aUrl === undefined ? my.location.getUrl() : aUrl;

				var numMatched = 0;
				my.routeTable.some(function(candidateRoute) {
					var result = currentUrl.matchRoute(candidateRoute);
					if(result.matched()) {
						my.lastMatch = result;
						numMatched++;
						that.trigger('matched', result);

						if(my.stopOnMatch) {
							return true;
						}
					}
				});

				if (numMatched === 0) {
					that.trigger('notfound', currentUrl.toString());
				}
			};

			var sortedInsert = function (route) {
				var routeIndex = my.routeTable.length;
				do { --routeIndex; } while (my.routeTable[routeIndex] && route.priority <= my.routeTable[routeIndex].priority);
				my.routeTable.splice(routeIndex + 1, 0, route);
			};

			// #### Public API

			that.addRoute = function(routeSpec) {
				routeSpec = routeSpec || {};

				var newRoute = route(routeSpec.pattern, routeSpec);
				newRoute.on('matched', routeSpec.onMatched);
				newRoute.priority = routeSpec.priority;

				sortedInsert(newRoute);
				return newRoute;
			};

			that.removeRoute = function(route) {
				var index = my.routeTable.indexOf(route);
				if(index === -1) {
					throw new Error('Route not in route table');
				}

				my.routeTable.splice(index, 1);
			};

			that.pipeRoute = function (routeSpec, router) {
				if(!routeSpec || !routeSpec.pattern) {
					throw new Error('Route pattern required');
				}

				routeSpec.onMatched = function(result) {
					router.resolveUrl(result.getUrl());
				};

				return that.addRoute(routeSpec);
			};

			that.pipeNotFound = function (router) {
				return that.on('notfound', function(aRawUrl) {
					router.resolveUrl(aRawUrl);
				});
			};

			that.resolveUrl = function(aUrl) {
				if(typeof aUrl === "string") {
					aUrl = url(aUrl);
				}

				my.resolveUrl(aUrl);
			};

			that.getUrl = function() {
				return my.location.getUrl();
			};

			that.linkTo = function(path, query) {
				return that.linkToUrl(url.build(path, query));
			};

			that.linkToUrl = function(aUrl) {
				return my.location.linkToUrl(aUrl);
			};

			that.redirectTo = function(path, query) {
				return that.redirectToUrl(url.build(path, query));
			};

			that.redirectToUrl = function(aUrl) {
				return my.location.setUrl(aUrl);
			};

			that.updateUrl = function(parameters) {
				var newQuery, newParameters, currentRoute;

				// Use current route as template
				if(my.lastMatch) {
					currentRoute = my.lastMatch.getRoute();
					newQuery = Object.create(my.lastMatch.getUrl().getQuery());
					newParameters = Object.create(my.lastMatch.getParameters());
				} else {
					currentRoute = route();
					newQuery = {};
					newParameters = {};
				}

				// If parameter exist in route add to parameters otherwise to query.
				Object.keys(parameters).forEach(function(param){
					if(currentRoute.hasParameter(param)) {
						newParameters[param] = parameters[param];
					} else {
						newQuery[param] = parameters[param];
					}
				});

				var aRawUrl = currentRoute.expand(newParameters);

				that.redirectTo(aRawUrl, newQuery);
			};

			that.back = function(aFallbackUrl) {
				return my.location.back(aFallbackUrl);
			};

			that.start = function() {
				my.location.start();
				my.resolveUrl(); // resolve current url
			};

			that.stop = function() {
				my.location.stop();
			};

			return that;
		};

		// FACADE FOR OLD DEPRECATED ROUTER/CONTROLLER

		var handler = events.at('routing');

		var routerSingleton = (function(spec,my) {
			var that = router(spec, my);

			that.on('match', function(result) {
				events.at('routing').trigger('match', result);
			});
			that.on('notfound', function(url) {
				events.at('routing').trigger('notfound', url);
			});

			that.resolvePath = that.resolveUrl;
			that.getPath = function() { return that.getUrl().toString(); };
			that.updatePath = that.updateUrl;

			return that;
		}());

		var controllerSingleton = {};
		controllerSingleton.on = function(path, callback) {
			routerSingleton.addRoute({
				pattern: path,
				onMatched: function(result) {
					callback.apply(this, result.getCallbackArguments());
				}
			});
		};

		// Expose new router
		routerSingleton.router = router;

		return {
			controller: controllerSingleton,
			router: routerSingleton
		};
	});