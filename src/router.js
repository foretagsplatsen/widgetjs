// Event-based URL handling:
//
// - **Router**: simply watches the hash of the URL (uses the hash-bang '#!' convention) and notifies a controller when it change.
//
//     http://foo.com/#!**/bar**
//
// - **Controller**: responsible for binding events to some URL.
//
//		controller.on('/**bar**', function() { alert('bar'); });
//
// When the URL (hash fragment) change the router sends a 'resolveRoute' message with the new route to the controller that then triggers an
// action.
// - - -
define(
	[
		'jquery',
		'./events'
	],
	function (jQuery, events) {


		// ### Event bus/manager for routing
		// Manage all routing events. Usage:
		//
		//		events.at('routing').on('notfound', function(url) {
		//			alert('404 - Url not found: ' + url);
		//		});
		// - - -
		var handler = events.at('routing');


		// ### Default controller
		// Use controller.on(...)
		//
		// Example: path with parameters (starting with a '#')
		//
		//		myController.on('/page/#pageNumber', function(pageNumber) {
		//			alert(pageNumber);
		//		});
		//
		// Example: regexp path:
		//
		//		myController.on('/page/.*', function() {
		//			...
		//		});
		//
		var controller = function () {
			var that = {};

			// #### Private methods


			// Convert parameters (eg. '#userId') into regexp
			//
			//		convertRoute('/user/#userId'); //=> "/user/([^/]*)"
			function convertRoute(route) {
				return route.replace(/#[\w\d]+/g, '([^\/]*)');
			}

			// Match route against path and return array of values for matched parameters in path.
			//
			//		extractParameters('/user/kalle', '/user/#id'); //=> ['kalle']
			function extractParameters(route, path) {
				var parameterValues = new RegExp('^' + convertRoute(path) + '[\/]?$').exec(route);
				if (parameterValues) {
					return parameterValues.slice(1);
				} else {
					return null;
				}
			}

			// #### Public API

			// Binds a callback to a path.
			//
			//		myController.on('foo', function() {
			//			alert('/#!/foo triggered!');
			//		});
			that.on = function (path, callback) {
				handler.on(path, callback);
			};

			// Tries to match registered bindings agains the new route
			// from the router.
			that.resolveRoute = function (route) {
				var params;
				var numMatches = 0;
				for (var path in handler.events) {
					params = extractParameters(route, path);
					if (params) {
						numMatches++;
						handler.trigger.apply(this, [path].concat(params));
					}
				}

				// Trigger 'notfound' event (with route as argument) if no match
				if(numMatches === 0) {
					handler.trigger('notfound', route);
				}
			};

			// Register this controller
			that.register = function () {
				current_router.register(that);
			};

			return that;
		};

		// - - -

		// ### Router
		// Listens for changes in the hash fragment of the URL. In modern browsers we use the 'hashchange' event.
		// In legacy browsers we instead pull for changes using a timer/interval.
		//
		// In old IE (< IE 8) a hidden IFrame is created to allow the back button and hash-based history to work.
		//
		// Usage:
		//
		// 1. Register your controller
		//
		//		current_router.register(controller);
		//
		//		or
		//
		//		controller.register();
		//
		// 2. Set-up routing
		//
		//		controller.on(...)
		//
		// 3. Start the router
		//
		//		router.start();
		//
		// Router can be started before DOM is ready, but since it won’t be usable before then in IE6/7 (due to the necessary IFrame),
		// recommended usage is to bind it inside a DOM ready handler.
		//
		var router = function (spec) {
			spec = spec || {};
			var that = {};

			var fallback = true,
				oldIE, // IE7 or older
				fragment, // current fragment
				previousFragment, // previously visited fragment
				history = [], // history of visited fragments
				timer,
				iframe_src = spec.iframe_src || '/Client/ie_iframe.html', //TODO: how to do this?
				controller;


			// #### Initilize
			
			// Fallback only if no 'onhashchange' event
			if('onhashchange' in window) { fallback = false; }

			// oldIE if IE < IE8
			oldIE = jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 8;

			// Set current fragment to route
			fragment = route();

			// #### Private methods

			// The route is simply the URL hash fragment minus the hash-bang (#!). Eg. **bar** in:
			//    http://foo.com/#!**/bar**
			function route() {
				return window.location.hash.replace(/^#![\/]?/, '');
			}

			// Get/Set the hash fragment
			function getHash() {
				return window.location.hash;
			}
			function setHash(string) {
				window.location.hash = string;
			}

			// Delegates route resolving to the current controller, if any
			function resolveRoute() {
				if (controller) {
					controller.resolveRoute(route());
				}
			}

			// Setup the iframe for old versions of IE
			function setupOldIE() {
				var iDoc = jQuery("<iframe id='ie_history_iframe'" +
					"src='"+ iframe_src + "'" +
					"style='display: none'></iframe>").prependTo("body")[0];
				var iframe = iDoc.contentWindow.document || iDoc.document;
				if (window.location.hash) {
					var hash = window.location.hash.substr(1);
					iframe.location.hash = hash;
				}
				iframe.location.title = window.title;
			}

			// Special hack for IE < 8. Else IE won't add an entry to the history
			function fixHistoryForIE() {
				var iframe = getIframe();
				iframe.open();
				iframe.close();
				iframe.location.hash = fragment;
			}

			function getIframe() {
				return jQuery('#ie_history_iframe').get(0).contentWindow.document;
			}

			// Adds a fragment to history
			function pushToHistory(aFragment) {
				if (oldIE) {
					fixHistoryForIE();
				}
				history.push(aFragment);
			}

			// Check if the url fragment has changed
			// and resolve it if needed.
			function check() {
				fragment = getHash();

				if (fragment !== previousFragment) {
					previousFragment = fragment;
					pushToHistory(fragment);
					resolveRoute();
				} else {
					if(oldIE) {
						var iframe = getIframe();
						if(iframe.location.hash !== fragment) {
							window.location.hash = iframe.location.hash;
							fragment = getHash();
							resolveRoute();
						}
					}
				}
			}

			// #### Public API

			// Return current route
			that.route = route;

			that.linkTo = function(path) {
				return ('#!/' + path);
			};

			that.redirectTo = function(path) {
				setHash(that.linkTo(path));
			};

			// Navigate to previous fragment
			that.back = function() {
				if(history.length > 0) {
					history.pop();
					setHash(history.pop());
				}
			};
	
			// **Force a check()**, wheither the fragment has changed or not.
			that.forceCheck = function() {
				resolveRoute();
			};

			// **Register a controller**
			that.register = function (aController) {
				// Only one controller can be registered at a time
				controller = aController;
				// also force a fragment check
				resolveRoute();
			};

			// **Start/stop** url changes check. If the browser supports it we bind 'check()' to the 'hashchange' event.
			// In legacy browsers we instead pull for changes every 100 ms.
			that.start = function () {
				that.stop();
				if (fallback) {
					if (oldIE) {
						setupOldIE();
					}
					timer = setInterval(check, 100);
				} else {
					jQuery(window).bind('hashchange', check);
				}

				resolveRoute();
			};

			that.stop = function () {
				if (timer) {
					timer.clearInterval();
					timer = null;
				}
				jQuery(window).unbind('hashchange', check);
			};

			return that;
		};

		// ### Exports
		// Instances of default router and controller
		var current_router = router();
		var current_controller = controller();
		return {
			controller: current_controller,
			router: current_router
		};
	});
