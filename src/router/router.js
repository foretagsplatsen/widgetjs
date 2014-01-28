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
		//		aRouter.addRoute({
		//			pattern: '/user/#id',
		//			action: function(id) { console.log(id);},
		//			priority: 4000
		//		});
		//
		// The action callback is triggered when a URL match pattern. Values for matched parameterers are
		// supplied as arguments in the same order as they are defined in the pattern. Priority is optional.
		//
		// Add router accept the same options as [route](route.js)
		//
		//		var aRoute = aRouter.addRoute({
		//			pattern: '/user/?id',
		//			defaults: {
		//				id: 'john'
		//			},
		//			constraints: {
		//				id :  ['john', 'olle']
		//			}
		//		});
		//
		//		aRoute.on('matched', function(result) {
		//			console.dir(result.getRouteParameters());
		//		});
		//
		// Routes are removed using 'removeRoute'
		//
		// Eg:
		//
		//		aRouter.removeRoute(aRoute);
		//
		//
		// Url's can be resolved manualy using the 'resolveRoute' method or automaticly when the URL change. The URL
		// location handler can be set when the router is constructed
		//
		//Eg:
		//
		//	var aHashRouter = router({locationHandler: hash()});
		//	var aPushStateRouter = router({locationHandler: pushState()});
		//
		// _Note:_ By default router use [hash.js]('hash.js') to listen for URL changes.
		//
		// Events are triggered on each resolve, on match and when a route is 'not found' with url as argument.
		//
		// Usage:
		//
		//		router.on('resolveUrl', function(url) {
		//			console.log(url.toString()); // or log to google analytics / mixpanel / etc
		//		});
		//
		//		router.on('routeMatched', function(result) {
		//			alert('Route match: ' + result.getUrl().getPath());
		//		});
		//
		//		router.on('routeNotFound', function(url) {
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

			// Listen for URL changes and resolve URL when changed
			my.location.on('changed', function() { my.resolveUrl(); });

			// Mixin events
			jQuery.extend(that, events.eventhandler());

			my.resolveUrl = function(aUrl) {
				var currentUrl = aUrl === undefined ? my.location.getUrl() : aUrl;

				that.trigger('resolveUrl', currentUrl);

				var numMatched = 0;
				my.routeTable.some(function(candidateRoute) {
					var result = currentUrl.matchRoute(candidateRoute);
					if(result.matched()) {
						my.lastMatch = result;
						numMatched++;
						that.trigger('routeMatched', result);

						if(candidateRoute.fallThrough === undefined || 
							candidateRoute.fallThrough === false) {
							return true;
						}
					}
				});

				if (numMatched === 0) {
					that.trigger('routeNotFound', currentUrl.toString());
				}
			};

			var sortedInsert = function (route) {
				var routeIndex = my.routeTable.length;
				if(route.priority !== undefined) {
					do { --routeIndex; } while (my.routeTable[routeIndex] &&
						(my.routeTable[routeIndex].priority === undefined ||
						route.priority < my.routeTable[routeIndex].priority));
					routeIndex += 1;
				}
				my.routeTable.splice(routeIndex, 0, route);
			};

			// #### Public API

			that.addRoute = function(routeSpec) {
				routeSpec = routeSpec || {};

				var newRoute = route(routeSpec.pattern, routeSpec);

				if(routeSpec.action) {
					newRoute.on('matched', function(result) {
						routeSpec.action.apply(this, result.getCallbackArguments());
					});
				}

                newRoute.name = routeSpec.name;
				newRoute.fallThrough = routeSpec.fallThrough;

				newRoute.priority = routeSpec.priority;
				sortedInsert(newRoute);

				return newRoute;
			};

            that.findRoute = function(predicate) {
                var numRoutes = my.routeTable.length;
                for(var routeIndex = 0; routeIndex < numRoutes; routeIndex++) {
                    var route = my.routeTable[routeIndex];
                    if(predicate(route)) {
                        return route;
                    }
                }

                return null;
            };

            that.getRouteByName = function(routeName) {
                return that.findRoute(function(route) {
                    return route.name && route.name === routeName;
                });
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

				var aRoute = that.addRoute(routeSpec);
				aRoute.on('matched', function(result) {
					router.resolveUrl(result.getUrl());
				});

				return aRoute;
			};

			that.pipeNotFound = function (router) {
				return that.on('routeNotFound', function(aRawUrl) {
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
                // TODO: Clean-up this code when deprecated code can be removed.

                // If path is an object assume it's a parameter object
                if(!(typeof path == 'string' || path instanceof String)) {
                    return that.linkToParameters(path);
                }

                // If path match a route name assume it's a routeName
                var route = that.getRouteByName(path);
                if(route) {
                    return that.linkToParameters(route.name, query);
                }

                // TODO: deprecated. Should be used directly using linkToPath not linkTo
                return that.linkToPath(path, query);
            };

            that.linkToPath = function(path, query) {
				return that.linkToUrl(url.build(path, query));
			};

			that.linkToUrl = function(aUrl) {
				return my.location.linkToUrl(aUrl);
			};

            that.redirectTo = function(path, query) {
                // TODO: Clean-up this code when deprecated code can be removed.

                // If path is an object assume it's a parameter object
                if(!(typeof path == 'string' || path instanceof String)) {
                    return that.setParameters(path);
                }

                // If path match a route name assume it's a routeName
                var route = that.getRouteByName(path);
                if(route) {
                    return that.setParameters(route.name, query);
                }

                // TODO: deprecated. Should be used directly using redirectToPath not redirectTo
                return that.redirectToPath(path, query);
            };

			that.redirectToPath = function(path, query) {
				return that.redirectToUrl(url.build(path, query));
			};

			that.redirectToUrl = function(aUrl) {
				return my.location.setUrl(aUrl);
			};

			that.getParameterPath = function(routeName, parameters) {
                // routeName can be omitted
                if(!(typeof routeName == 'string' || routeName instanceof String)) {
                    parameters = routeName;
                    routeName = null;
                }

                parameters = parameters || {};

				var newQuery = {};
                var newParameters = {};
                var currentRoute;

                // Lookup named route if name supplied
                if(routeName) {
                    currentRoute = that.getRouteByName(routeName);
                    if(!currentRoute) {
                        throw new Error("No route found with name " + routeName);
                    }
                }

				// Use current route as template and pre-fill parameters
                // and query with current url values
                else if(my.lastMatch) {
					currentRoute = my.lastMatch.getRoute();
					newQuery = Object.create(my.lastMatch.getUrl().getQuery());
					newParameters = Object.create(my.lastMatch.getRouteParameters());
				}

                // otherwise put everything in query parameters
                else {
					currentRoute = route();
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

				return url.build(aRawUrl, newQuery);
			};


			that.linkToParameters = function(routeName, parameters) {
				return my.location.linkToUrl(that.getParameterPath(routeName, parameters));
			};

			that.setParameters = function(routeName, parameters) {
				that.redirectToUrl(that.getParameterPath(routeName, parameters));
			};

            that.getRouteParameters = function () {
                return my.lastMatch ? my.lastMatch.getParameters() : {};
            };

            that.getParameter = function (parameterKey) {
                var parameters = that.getRouteParameters();
                return parameters[parameterKey];
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

		return router;
	});