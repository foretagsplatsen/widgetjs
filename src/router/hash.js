define([
	'jquery',
	'../events',
	'./route',
	'./url'
], function(jQuery, events, route, url) {

	// ### Hash
	//
	// Listens for changes in the hash fragment of the URL. In modern browsers we use the 'hashchange' event.
	// In legacy browsers we instead pull for changes using a timer/interval.
	//
	// In old IE (< IE 8) a hidden IFrame is created to allow the back button and hash-based history to work. 
	// See `setupOldIE()` and `fixHistoryForIE()`.
	//
	// Usage:
	//		
	//		var location = hash();
	//		hash.on('changed', function(newHash) { window.alert(newHash); });
	//		location.start();
	//		location.setHash('#!/newUrl');
	//		location.setHash('#!/anotherUrl');
	//		location.back();
	//
	// Router can be started before DOM is ready, but since it won’t be usable before then in 
	// IE6/7 (due to the necessary IFrame), recommended usage is to bind it inside a DOM ready handler.
	//

	var fallback = !('onhashchange' in window),
		poll_intervall = 25,  // Num ms between each location change poll on legacy browsers
		isLegacyBrowser = jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 8; 

	function hash(spec, my) {
		spec = spec || {};
		my = my || {};

		var fragment, // last hash fragment
			history = [], // history of visited hash fragments
			pollTimerId = null,
			iframe_src = (spec.iframe_src || /*jshint scripturl:true*/ 'javascript:0'),
			/*jshint scripturl:false*/
			controller;

		var that = {};

		// Mixin events
		jQuery.extend(that, events.eventhandler());



		function getPath () {
			return window.location.hash.replace(/^#![\/]?/, '');
		}

		function setPath (path) {
			setHash('#!/' + path);
		}

		// Get/Set the hash fragment
		function getHash() {
			return window.location.hash;
		}

		function setHash(string) {
			window.location.hash = string;
		}

		function setupOldIE() {
			var iDoc = jQuery("<iframe id='ie_history_iframe'" +
				"src='" + iframe_src + "'" +
				"style='display: none'></iframe>").prependTo("body")[0];
			var iframe = iDoc.contentWindow.document || iDoc.document;
			if (window.location.hash) {
				iframe.location.hash = window.location.hash.substr(1);
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
			if (isLegacyBrowser) {
				fixHistoryForIE();
			}
			history.push(aFragment);
		}

		// Check if the url fragment has changed
		// and resolve it if needed.

		function check() {
			var newFragment = getHash();

			if (fragment !== newFragment /* url changed */ ) {
				var previousFragment = fragment;
				fragment = newFragment;
				pushToHistory(fragment);

				that.trigger('changed', fragment);

			} else if (isLegacyBrowser) {
				var iframe = getIframe();
				if (iframe.location.hash !== newFragment) {
					setHash(iframe.location.hash);
					pushToHistory(fragment);
					that.trigger('changed', fragment);
				}
			}
		}

		// ### Public API

		that.setHash = setHash;
		that.getHash = getHash;

		that.setPath = setPath;
		that.getPath = getPath;

		// Navigate to previous fragment. Fallback to the
		// `fallback' url if the history is empty

		that.back = function(fallback) {
			if (history.length > 1) {
				history.pop();
				setHash(history.pop());
			} else if (fallback) {
				setPath(fallback);
			}
		};

		// **Start/stop** url changes check. If the browser supports it we bind 'check()' to the 'hashchange' event.
		// In legacy browsers we instead pull for changes every 100 ms.

		that.start = function() {
			that.stop();

			fragment = getHash();
			history = [fragment];

			if (fallback) {
				if (isLegacyBrowser) {
					setupOldIE();
				}
				pollTimerId = setInterval(check, poll_intervall);
			} else {
				jQuery(window).bind('hashchange', check);
			}
		};

		that.stop = function() {
			if (pollTimerId) {
				clearInterval(pollTimerId);
				pollTimerId = null;
			}
			jQuery(window).unbind('hashchange', check);
			jQuery('#ie_history_iframe').remove(); // remove any IFRAME
		};


		return that;
	}

	return hash;
});