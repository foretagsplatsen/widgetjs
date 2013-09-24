define(
	[
		'jquery',
		'../events',
		'./route',
		'./url',
		'./hash'
	],
	function(jQuery, events, route, url, hash) {

		// ### Router
		//
		// Router allows you to keep state in the URL. When a user visits a specific URL the application
		// can be transformed accordingly.
		//
		// Router keeps a list of routing rules for the application. When the URL change or the user manualy executes
		// `resolvePath` the router will try to match routes against the new path/url. 
		//
		// Routes are registered like this:
		//
		//		router.addRoute('/page/#pageNumber', function(pageNumber) {
		//			alert(pageNumber);
		//		});
		//
		// _Note:_ Routes are matched in registration order until first match
		//
		// _Note:_ By default router use [hash.js]('hash.js') to listen for URL changes.
		//  
		var router = function(spec, my) {
			spec = spec || {};
			my = my || {};

			var locationChangedBinding;
			var lastMatch;

			var that = {};

			my.location = hash();
			my.routeTable = [];

			my.resolvePath = function(path) {
				path = path === undefined ? my.location.getPath() : path;
				var currentUrl = url(path);

				var aMatch = my.routeTable.some(function(candidateRoute) {
					var result = currentUrl.matchRoute(candidateRoute);
					if(result.matched()) {
						lastMatch = result;
						handler.trigger('matched', result);

						return true; // exit on match
					}

					return false; 
				});

				if (!aMatch) {
					handler.trigger('notfound', currentUrl.getPath());
				}
			};

			// #### Public API

			that.addRoute = function(routeSpec) {
				routeSpec = routeSpec || {};

				var newRoute = route(routeSpec.pattern, routeSpec);
				newRoute.on('matched', routeSpec.onMatched);
				
				my.routeTable.push(newRoute);
				return newRoute;
			};

			that.removeRoute = function(route) {
				var index = my.routeTable.indexOf(route);
				if(index === -1) {
					throw new Error('Route not in route table'); 
				}

				my.routeTable.splice(index, 1); 
			};

			that.resolvePath = my.resolvePath;

			that.getPath = function() {
				return my.location.getPath();
			};

			that.linkTo = function(path, query) {
				if (typeof(path) === 'undefined' || path === null || typeof path !== "string") {
					throw 'accepts only string paths';
				}

				if (query) {
					return path + '?' + decodeURIComponent(jQuery.param(query));
				}

				return path;
			};

			that.redirectTo = function(path, query) {
				return my.location.setPath(that.linkTo(path, query));
			};

			that.updatePath = function(parameters) {
				if(!lastMatch) {
					throw new Error('No route to update');
				}

				var currentRoute = lastMatch.getRoute();

				var newQuery = Object.create(lastMatch.getUrl().getQuery());
				var newParameters = Object.create(lastMatch.getParameters());
				Object.keys(parameters).forEach(function(param){
					if(currentRoute.hasParameter(param)) {
						newParameters[param] = parameters[param];
					} else {
						newQuery[param] = parameters[param];
					}
				});

				var path = currentRoute.expand(newParameters);				
				that.redirectTo(path, newQuery);
			};

			that.back = function(fallback) {
				return my.location.back(fallback && that.linkTo(fallback));
			};

			that.start = function() {
				my.location.start();
				
				locationChangedBinding = my.location.on('changed', function() { my.resolvePath(); });
				
				my.resolvePath(); // resolve current url
			};

			that.stop = function() {
				my.location.stop();
				if(my.locationChangedBinding) {
					my.location.off('changed', locationChangedBinding);
				}
			};

			return that;
		};

		// ### Routing Events
		//
		// An event is triggered on match with routeMatchResult as argument and
		// on not found with path as argument. 
		//
		// Usage:
		//
		//		events.at('routing').on('match', function(result) {
		//			alert('Route match: ' + result.getUrl().getPath());
		//		});
		//
		//		events.at('routing').on('notfound', function(url) {
		//			alert('404 - Url not found: ' + url);
		//		});
		//
		var handler = events.at('routing');

		// ### Exports

		var routerSingleton = router();
		
		// TODO: Controller deprecated: Use router.addRoute()	
		var controllerSingleton = {};
		controllerSingleton.on = function(path, callback) {
			routerSingleton.addRoute({
				pattern: path,
				onMatched: function(result) {
					callback.apply(this, result.getCallbackArguments());
				}
			});
		};

		return {
			controller: controllerSingleton,
			router: routerSingleton
		};
	});