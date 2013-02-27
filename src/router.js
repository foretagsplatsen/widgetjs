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
// When the URL (hash fragment) change the router sends a `resolveRoute(route)` message with the new route to the controller that then triggers an
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

			// Binds a callback to a path. _Eg:_
			//
			//		myController.on('foo', function() {
			//			alert('/#!/foo triggered!');
			//		});
			that.on = function (path, callback) {
				if (typeof(path) === 'undefined' || path === null || typeof path !== "string") {
					throw 'accepts only string paths';
				}

				handler.on(path, callback);
			};

			// Tries to match registered bindings agains the new route
			// from the router.
			that.resolveRoute = function (route) {
				var params,
					numMatches = 0,
					bindings = handler.events;

				for (var path in bindings) {
					if (bindings.hasOwnProperty(path)) {
						params = extractParameters(route, path);
						if (params) {
							numMatches++;
							handler.trigger.apply(this, [path].concat(params));
						}
					}
				}

				// Trigger 'notfound' event (with route as argument) if no match
				if (numMatches === 0) {
					handler.trigger('notfound', route);
				}
			};

			return that;
		};

		// - - -

		// ### Router
		// Listens for changes in the hash fragment of the URL. In modern browsers we use the 'hashchange' event.
		// In legacy browsers we instead pull for changes using a timer/interval.
		//
		// In old IE (< IE 8) a hidden IFrame is created to allow the back button and hash-based history to work. 
		// See `setupOldIE()` and `fixHistoryForIE()`.
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
				fragment, // last hash fragment
				history = [], // history of visited hash fragments
				timer,
				iframe_src = (spec.iframe_src || /*jshint scripturl:true*/  'javascript:0'), /*jshint scripturl:false*/
				controller;


			// #### Initilize
			
			// Fallback only if no 'onhashchange' event
			if ('onhashchange' in window) { fallback = false; }

			// oldIE if IE < IE8
			oldIE = jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 8;

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

			// Setup IFrame for old versions of IE
			function setupOldIE() {
				var iDoc = jQuery("<iframe id='ie_history_iframe'" +
					"src='" + iframe_src + "'" +
					"style='display: none'></iframe>").prependTo("body")[0];
				var iframe = iDoc.contentWindow.document || iDoc.document;
				if (window.location.hash) {
					var hash = window.location.hash.substr(1);
					iframe.location.hash = hash;
				}
				iframe.location.title = window.title;
			}

			// Special hack for IE < 8 since hashchanges is not added to history. 
			// IE will add a history entry when IFrame is opened/closed.
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

			// Delegates route resolving to the current controller, if any
			function resolveRoute() {
				if (controller) {
					controller.resolveRoute(route());
				}
			}

			// Check if the url fragment has changed
			// and resolve it if needed.
			function check() {
				var newFragment = getHash();

				if (fragment !== newFragment /* route changed */) {
					fragment = newFragment;
					pushToHistory(fragment);
					resolveRoute();

				} else if (oldIE) {
					var iframe = getIframe();
					if (iframe.location.hash !== newFragment) {
						setHash(iframe.location.hash);
						pushToHistory(fragment);
						resolveRoute();
					}
				}
			}

			// #### Public API

			// Return current route
			that.route = route;

			that.linkTo = function (path) {
				if (typeof(path) === 'undefined' || path === null || typeof path !== "string") {
					throw 'accepts only string paths';
				}

				return ('#!/' + path);
			};

			that.redirectTo = function (path) {
				setHash(that.linkTo(path));
			};

			// Navigate to previous fragment. Fallback to the
            // `fallback' url if the history is empty
			that.back = function (fallback) {
				if (history.length > 1) {
					history.pop();
					setHash(history.pop());
				} else if (fallback) {
                    setHash(that.linkTo(fallback));
                } 
			};
	
			// **Force a check()**, whether the fragment has changed or not.
			that.forceCheck = resolveRoute;

			// **Register a controller**
			that.register = function (aController) {
				// Only one controller can be registered at a time
				controller = aController;

				// Also send controller route() if started
				if(fragment !== undefined) { 
					resolveRoute();
				}
			};

			// **Start/stop** url changes check. If the browser supports it we bind 'check()' to the 'hashchange' event.
			// In legacy browsers we instead pull for changes every 100 ms.
			that.start = function () {
				that.stop();
				
				fragment = getHash();
				history = [fragment];

				if (fallback) {
					if (oldIE) {
						setupOldIE();
					}
					timer = setInterval(check, 100);
				} else {
					jQuery(window).bind('hashchange', check);
				}

				resolveRoute(); //send controller our route()
			};

			that.stop = function () {
				if (timer) {
					timer.clearInterval();
					timer = null;
				}
				jQuery(window).unbind('hashchange', check);
				jQuery('#ie_history_iframe').remove(); // remove any IFRAME
			};

			return that;
		};

		// ### Exports
		// Instances of default router and controller
		var current_router = router();
		var current_controller = controller();
		current_router.register(current_controller);

		return {
			controller: current_controller,
			router: current_router
		};
	});
