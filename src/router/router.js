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
		//			console.dir(result.getParameters());
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
			my.location.on('changed', function(url, isTriggeredByBackButton) {

                // Check if we have a callback to cancel
                if(isTriggeredByBackButton) {
                    var currentRoute = my.lastMatch.getRoute();
                    if(currentRoute) {
                        var callback = my.getCallbackByCaller(currentRoute);
                        if(callback) {
                            currentRoute.trigger('answer', false, callback.cancelCallback);
                            my.removeCallback(callback);

                        }
                    }
                }

                my.resolveUrl();
            });

			// Mixin events
			jQuery.extend(that, events.eventhandler());


            my.callbacks = [];

            // Callbacks

            my.getCallbackByCaller = function(route) {
                var match = my.callbacks.filter(function(callback) {
                    return callback.caller === route;
                });

                return match.length > 0 ? match[0] : null;
            };

            my.getCallbackByTarget = function(route) {
                var match = my.callbacks.filter(function(callback) {
                    return callback.target === route;
                });

                return match.length > 0 ? match[0] : null;
            };

            my.saveCallback = function(caller, target, answerCallback, cancelCallback) {
                var callback = { caller: caller, target: target, answerCallback: answerCallback, cancelCallback:cancelCallback}
                my.callbacks.push(callback);
                return callback;

            };

            my.removeCallback = function (callback) {
                my.callbacks.splice(my.callbacks.indexOf((callback)), 1);
            };

            that.call = function(routeName, args, answerCallback, cancelCallback) {
                var route = that.getRouteByName(routeName);
                var currentRoute = my.lastMatch.getRoute();

                my.saveCallback(currentRoute, route, answerCallback, cancelCallback);

                var url = route.expand(args);
                return that.redirectToUrl(url);
            };

            that.answer = function(result) {
                var currentRoute = my.lastMatch.getRoute();
                if(currentRoute) {
                    var callback = my.getCallbackByTarget(currentRoute);
                    if(callback) {
                        callback.caller.trigger('answer', true, callback.answerCallback, result);
                        my.removeCallback(callback);
                        return;
                    }
                }

                return that.back();
            };

            that.cancel = function () {
                var currentRoute = my.lastMatch.getRoute();
                if(currentRoute) {
                    var callback = my.getCallbackByTarget(currentRoute);
                    if(callback) {
                        callback.caller.trigger('answer', false, callback.cancelCallback);
                        my.removeCallback(callback);
                        return;
                    }
                }

                return that.back();

            };


            my.resolveUrl = function(aUrl) {
				var currentUrl = aUrl === undefined ? my.location.getUrl() : aUrl;

				that.trigger('resolveUrl', currentUrl);

				var numMatched = 0;
				my.routeTable.some(function(candidateRoute) {
					var result = currentUrl.matchRoute(candidateRoute);
					if(result.matched()) {

                        var callback = my.getCallbackByCaller(candidateRoute);
                        if(callback) {
                            my.removeCallback(callback);
                        }

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

                if(routeSpec.name) {
                    newRoute.name = routeSpec.name;
                }

				newRoute.fallThrough = routeSpec.fallThrough;

				newRoute.priority = routeSpec.priority;
				sortedInsert(newRoute);

				return newRoute;
			};

            that.getRouteByName = function(name) {
                var routes = my.routeTable.filter(function(route) {
                    return route.name === name;
                });

                return routes.length > 0 ? routes[0] : null;
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

			that.getUpdateUrl = function(parameters) {
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

				return url.build(aRawUrl, newQuery);
			};


			that.linkToUpdateUrl = function(parameters) {
				return my.location.linkToUrl(that.getUpdateUrl(parameters));
			};

			that.updateUrl = function(parameters) {
				that.redirectToUrl(that.getUpdateUrl(parameters));
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