/*
 * router.js -- Event-based URL handling
 * Requires jQuery
 */

define(
	[
		'jquery',
		'./events'
	],
	function (jQuery, events) {

		/*
		 * A Controller is responsible for binding events to some url fragments.
		 * use controller.on()
		 *
		 * Paths can contain parameters (starting with a '#').
		 * Example:
		 *
		 * myController.on('/page/#pageNumber', function(pageNumber) {
		 *     alert(pageNumber);
		 * });
		 *
		 * Paths can be regexp:
		 *
		 * myController.on('/page/.*', function() {
		 *     ...
		 * });
		 */

		var handler = events.at('routing');

		var controller = function () {
			var that = {};

			/* Converts a route into a regexp string */
			function convertRoute(route) {
				return route.replace(/#[\w\d]+/g, '([^\/]*)');
			}

			function extractParameters(route, path) {
				var params = new RegExp('^' + convertRoute(path) + '[\/]?$').exec(route);
				if (params) {
					return params.slice(1);
				} else {
					return null;
				}
			}

			that.resolveRoute = function (route) {
				var params;
				for (var path in handler.bindings) {
					params = extractParameters(route, path);
					if (params) {
						handler.trigger.apply(this, [path].concat(params));
					}
				}
			};

			/*
			 * Attach a callback to an url fragment.
			 * Uses the '#!' convention
			 * (no HTML5 pushState yet)
			 *
			 * Example:
			 *     myController.on('foo', function() {
			 *         alert('/#!/foo triggered!');
			 *     });
			 */

			that.on = function (string, callback) {
				handler.on(string, callback);
			};

			/*
			 * Register this controller.
			 * Only one controller can be registered at a time,
			 * this means that it will unregister any previously
			 * registered controller
			 */

			that.register = function () {
				current_router.register(that);
			};

			return that;
		};


		var router = function () {
			var that = {};

			var fallback = true;
			if('onhashchange' in window) {fallback = false;}
			var oldIE = jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 8;
			var fragment;
			var controller;
			var history = [];

			var previousFragment; // This 3 variables are used in the fallback mode only
			var timer;

			that.fragment = function () { return fragment; };
			that.previousFragment = function () { return previousFragment; };

			/* The route is simply the url fragment minus the hash-bang */
			function route() {
				return window.location.hash.replace(/^#![\/]?/, '');
			}
			that.route = route;
			fragment = route();

			/* Check if the url fragment has changed and resolve it if needed */
			function check() {
				fragment = that.getHash();
				if (fragment !== previousFragment) {
					previousFragment = fragment;
					if (oldIE) {
						fixHistoryForIE();
					}
					history.push(fragment);
					resolveFragment();
				} else {
					if(oldIE) {
						checkIframe();
					}
				}
			}

			function checkIframe() {
				// Yeah, well, IE7.
				var iframe = getIframe();
				if(iframe.location.hash !== fragment) {
					window.location.hash = iframe.location.hash;
					fragment = that.getHash();
					resolveFragment();
				}
			}

			that.getHash = function() {
				return window.location.hash;
			};

			that.setHash = function(string) {
				window.location.hash = string;
			};

			that.back = function() {
				if(history.length > 0) {
					history.pop();
					that.setHash(history.pop());
				}
			};

			/* delegates route resolving to the current controller, if any */
			function resolveFragment() {
				if (controller) {
					controller.resolveRoute(route());
				}
			}

			/*
			 * Special hack for IE < 8.
			 * Else IE won't add an entry to the history
			 */
			function fixHistoryForIE() {
				//Add history entry
				var iframe = getIframe();
				iframe.open();
				iframe.close();
				iframe.location.hash = fragment;
			}

			function getIframe() {
				return jQuery('#ie_history_iframe').get(0).contentWindow.document;
			}

			/* Setup the iframe for old versions of IE */
			function setupOldIE() {
				var iDoc = jQuery("<iframe id='ie_history_iframe'" +
					"src='/Client/ie_iframe.html'" +
					"style='display: none'></iframe>").prependTo("body")[0];
				var iframe = iDoc.contentWindow.document || iDoc.document;
				if (window.location.hash) {
					var hash = window.location.hash.substr(1);
					iframe.location.hash = hash;
				}
				iframe.location.title = window.title;
			}

			/* Force a check() call, wheither the fragment has changed or not. */
			that.forceCheck = function() {
				resolveFragment();
			};

			/*
			 * Controller registration.
			 * Whenever the controller is changed, force a fragment check.
			 */
			that.register = function (c) {
				controller = c;
				resolveFragment();
			};

			/* Start/stop url changes check */
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
				resolveFragment();
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


		/*
		 * Global route resolver.
		 * Register controller using
		 * controller.register()
		 */

		var current_router = router();
		var current_controller = controller();

		return {
			controller: current_controller,
			router: current_router
		};
	});
