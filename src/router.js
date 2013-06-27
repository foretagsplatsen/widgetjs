// Event-based URL handling:
//
// - **Router**: simply watches the hash of the URL (uses the hash-bang '#!' convention) and notifies a controller when it change.
//
//    http://foo.com/#!**/bar**
//
// - **Controller**: responsible for binding events to some URL.
//
//		controller.on('/**bar**', function() { alert('bar'); });
//
// When the URL (hash fragment) change the router sends a `resolveUrl(url)` message with the new url to the controller that then triggers an
// action.
// - - -
define(
	[
		'jquery',
		'./events'
	],
	function (jQuery, events) {


		var urlSeparator = '/';
		
		// ### Url definition
		//
		// A url has a path and a query string

		var url = function(string) {
			var that = {};

			string = string || '';

			// Path string of the url
			var path = '';

			var elements = [];

			// Query part of the url (?a=1&b=2)
			var query = {};

			
			//Comment
			function setPath(string) {
				// Remove the optional query string from the path
				path = string.replace(/\?.*$/g, '');
				//Remove the first / if any and duplicated / in the path
				path = path.replace(/^\//, '');
				path = path.replace(/\/\//g, '/');
				
				elements = path.split(urlSeparator);
			}

			// Extract query key/value(s) from a string and add them to `query`
			function extractQuery(string) {
				var result = /[^?]+\?(.*)$/g.exec(string);
				var pair;
				if(result) {
					(result[1].split("&")).forEach(function(each) {
						pair = each.split("=");
						query[pair[0]] = pair[1];
					});
				}
			}

			function setup() {
				setPath(string);
				extractQuery(string);
			}


			// Public accessing methods
			that.path = function() { return path; };
			that.query = function() { return query; };
			that.elements = function() { return elements; };

			// TODO: remove
			// Answer a regular expression built upon an extractor string
			var extractParameters = function(extractor) {
				return new RegExp('^' + extractor + '[\/]?$').exec(path);
			};

			// Match the path against a route string and return an array of
			// values for matched parameters, or null.
			//
			//		parametersFor('/user/kalle', '/user/#id'); //=> ['kalle']

			// TODO: remove this version and update the comment
			that.parametersFor = function(string) {
				var parameters = [];

				var parameterExtractor = string.replace(/#[\w\d]+/g, '([^\/]*)');
				var optionalParameterExtractor = string.replace(/\?[\w\d]+/g, '([^\/]*)');
				var parameterValues = extractParameters(parameterExtractor);
				var optionalParameterValues = extractParameters(optionalParameterExtractor);

				if (parameterValues) {
					parameterValues.slice(1).forEach(function(each) {
						parameters.push(parameter(each));
					});
				} 

				if (optionalParameterValues) {
					optionalParameterValues.slice(1).forEach(function(each) {
						parameters.push(optionalParameter(each));
					});
				} 

				return parameters || null;
			};

			// Answer true if the route is a match for the receiver
			that.matchRoute = function(route) {
				return route.matchElements(that.elements());
			};

			that.newParametersFor = function(route) {
				
			};

			setup();

			return that;
		};


		// - - -
		// ### Route objects definition
		// - - -

		// ### Route object
		// A route has an elements array and can match an url with arguments
		// Routes are built from string representations
		// - - -
		var route = function(string) {
			var that = {};

			var elements = [];
			var stream = routeElementsStream(elements);

			that.stream = function() { return stream; };
			that.getElements = function() { return elements; };

			// Answer true if the elements array matches each of the route
			// elements. The strategy is to try several passes with
			// and without optional parameters
			that.matchElements = function(urlElements) {
				return matchUrlElements(urlElements);
			};

			// try to match an url elements with `elementss`. Recursively
			// remove optional params if it doesn't match
			function matchUrlElements(urlElements) {
				var parameters = [];
				elements.forEach(function(each){
					if(each.isParameter()) {
						parameters.push(each.getValue());
					}
				});
				var result = routeMatchResult(parameters);
				return stream.match(urlElements, result);
			}

			// Elements setup. See segment(s) and the `prefix`
			// attached to parameters
			function setupElements() {
				var elements = string.split(urlSeparator);
				elements.forEach(function(each) {
					if(each.length > 0) {
						addToElements(each);
					}
				});
			}

			function addToElements(string) {
				var element;
				
				// find the right parameter
				parameters.forEach(function(each) {
					if(string[0] === each.prefix) {
						element = each(string);
					}
				});

				// fallback to a simple segment
				if(element === undefined) {
					element = segment(string);
				}

				elements.push(element);
			}

			
			// Initialization
			setupElements();

			return that;
		};
		
		// ### read-only route elements stream definition.
		// Used to stream over a route elements segments to match an url
		// - - -
		var routeElementsStream = function(elements) {
			var that = {};
			var position = 0;

			that.getElements = function() {
				return elements;
			};

			that.getPosition = function() {
				return position;
			};

			that.atEnd = function() {
				return position >= elements.length;
			};

			that.peek = function() {
				return elements[position];
			};

			that.next = function() {
				if(that.atEnd()) {
					return null;
				}
				var element = that.peek();
				position = position + 1;
				return element;
			};

			that.reset = function() {
				position = 0;
			};

			// Answer a new stream with the elements trimmed
			that.trimOptionalParameter = function() {
				// keep a copy of the elements array
				var trimmedElements = [];
				var trimmed = false;

				elements.forEach(function(each) {
					if(!trimmed) {
						if(each.isOptional()) {
							trimmed = true;
						} else {
							trimmedElements.push(each);
						}
					} else {
						trimmedElements.push(each);
					}
				});

				if(!trimmed) { trimmedElements = []; }

				return routeElementsStream(trimmedElements);
			};

			// Match an url elements (represented here as `elements`). 
			// If the stream does not match an optional parameter, 
			// the stream is rewinded til the last optional parameter 
			// and the process goes on.
			that.match = function(urlElements, result) {
				var matched = true;
				var newStream;

				// Guard
				if(elements.length < urlElements.length) {
					return result;
				}

				urlElements.forEach(function(each) {
					if(matched) {
						matched = that.next().match(each);
					}
				});

				// All elements matched and we are at the end of the
				// stream. Hourra, we made it!
				if(matched && that.atEnd()) {
					result.match();
					return result;
				}

				// Did not match. Try without the first optional parameter
				newStream = that.trimOptionalParameter();
				return newStream.match(urlElements, result);
			};
			

			return that;
		};
		// ### Route segment
		// - - -
		var segment = function(value) {
			var that = {};

			that.getValue = function() {
				return value;
			};
			
			that.isParameter = function() { return false; };
			that.isOptional = function() { return false; };


			// Answer true if the receiver is a match for an url elements
			// element
			that.match = function(string) {
				return value === string;
			};

			return that;
		};

		// ### Route parameter object
		// - - -
		var parameter = function(value) {
			// Parameters have a prefix, get rid of it
			var that = segment(value.substr(1));

			that.isParameter = function() { return true; };
			
			// For parameters, always answer true if the string is defined.
			// Since it's a parameter, the value doesn't matter
			that.match = function(string) { 
				return typeof string === 'string';
			};
			
			return that;
		};

		// ### Optional parameter
		// - - -
		var optionalParameter = function(value) {
			var that = parameter(value);

			that.isOptional = function() { return true; };
			
			// Optional, so always answer true
			that.match = function() { return true; };

			return that;
		};

		// ### Syntax definition.
		// To add an element prefix, add it to the elements element function
		// - - -

		var parameters = [ segment, parameter, optionalParameter ];
		parameter.prefix = '#';
		optionalParameter.prefix = '?';


		// ### Route result, used as the answer of a matching url for a route
		// - - -
		var routeMatchResult = function(elements) {
			var that = {};

			var matched = false;

			elements = elements || null;

			that.getElements = function() {
				return elements;
			};

			that.setElements = function(elts) {
				elements = elts;
			};

			that.matched = function() {
				return matched;
			};

			that.match = function() {
				matched = true;
			};

			return that;
		};

		// - - -



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

			// #### Public API

			// Binds a callback to a path. _Eg:_
			//
			//		myController.on('foo', function() {
			//			alert('/#!/foo triggered!');
			//		});
			that.on = function (path, callback) {
				// TODO: remove
				if (typeof path !== "string") {
					throw 'accepts only string paths';
				}

				handler.on(path, callback);
			};

			// Try to match registered bindings against the new url.
			that.resolveUrl = function (url) {
				var params,
					numMatches = 0,
					bindings = handler.events;

				for (var path in bindings) {
					if (bindings.hasOwnProperty(path)) {
						params = url.parametersFor(path);
						if (params) {
							numMatches++;
							handler.trigger.apply(this, [path].concat(params).concat(url.query()));
						}
					}
				}

				// Trigger 'notfound' event (with url as argument) if no match
				if (numMatches === 0) {
					handler.trigger('notfound', url.path());
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
				iframe_src = (spec.iframe_src || /*jshint scripturl:true*/	'javascript:0'), /*jshint scripturl:false*/
				controller;


			// #### Initilize
			
			// Fallback only if no 'onhashchange' event
			if ('onhashchange' in window) { fallback = false; }

			// oldIE if IE < IE8
			oldIE = jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 8;

			// #### Private methods

			// The url is built from the URL hash fragment minus the hash-bang (#!). Eg. **bar** in:
			// http://foo.com/#!**/bar**
			function getUrl() {
				return url(window.location.hash.replace(/^#![\/]?/, ''));
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

			// Delegates url resolving to the current controller, if any
			function resolveUrl() {
				if (controller) {
					controller.resolveUrl(getUrl());
				}
			}

			// Check if the url fragment has changed
			// and resolve it if needed.
			function check() {
				var newFragment = getHash();

				if (fragment !== newFragment /* url changed */) {
					fragment = newFragment;
					pushToHistory(fragment);
					resolveUrl();

				} else if (oldIE) {
					var iframe = getIframe();
					if (iframe.location.hash !== newFragment) {
						setHash(iframe.location.hash);
						pushToHistory(fragment);
						resolveUrl();
					}
				}
			}

			// #### Public API

			// Return current url

			that.path = function() {
				return getUrl().path(); 
			};

			that.linkTo = function (path, query) {
				var link, params;
				if (typeof(path) === 'undefined' || path === null || typeof path !== "string") {
					throw 'accepts only string paths';
				}

				link = '#!/' + path;
				if(query) {
					link = link + '?';
					params = Object.keys(query);
					params.forEach(function(param, index) {
						link = link + param + '=' + query[param];
						if(index < params.length - 1) {
							link = link + '&';
						}
					});
				}
				
				return link;
			};

			that.redirectTo = function (path, query) {
				setHash(that.linkTo(path, query));
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
			that.forceCheck = resolveUrl;

			// **Register a controller**
			that.register = function (aController) {
				// Only one controller can be registered at a time
				controller = aController;

				// Also send controller getUrl() if started
				if(fragment !== undefined) { 
					resolveUrl();
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

				resolveUrl(); //send controller our getUrl()
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
			router: current_router,
			route: route,
			url: url
		};
	});
