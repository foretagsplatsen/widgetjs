define([
	'jquery',
	'../events',
	'./url'
], function(jQuery, events, url) {

	// ### Hash
	//
	// Listens for changes in the hash fragment of the URL. In modern browsers we use the 'hashchange' event.
	// In legacy browsers we instead pull for changes using a timer/interval.
	//
	// In old IE (< IE 8) a hidden IFrame is created to allow the back button and hash-based my.history to work.
	// See `createFrame()` and `fixHistoryForIE()`.
	//
	// Usage:
	//
	//		var location = hash();
	//		hash.on('changed', function(newUrl) { window.alert(newUrl); });
	//		location.start();
	//		location.setUrl('newUrl');
	//		location.setUrl('anotherUrl');
	//		location.back();
	//
	// _Note:_ Hash can be started before DOM is ready, but since it won’t be usable before then in
	// IE6/7 (due to the necessary IFrame), recommended usage is to bind it inside a DOM ready handler.
	//

	var fallback = !('onhashchange' in window),
		poll_intervall = 25,  // Num ms between each location change poll on legacy browsers
		isLegacyBrowser = jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 8;

	function hash(spec, my) {
		spec = spec || {};
		my = my || {};

		var pollTimerId = null,
			iframe,
			iframe_src = (spec.iframe_src || /*jshint scripturl:true*/ 'javascript:0');
			/*jshint scripturl:false*/

		my.currentHash = undefined; // last hash fragment
		my.history = []; // history of visited hash fragments

		var that = {};

		// Mixin events
		jQuery.extend(that, events.eventhandler());

		function getHash() {
			return window.location.hash;
		}

		function setHash(string) {
			window.location.hash = string;
		}

		function getUrl() {
			return url(window.location.hash.replace(/^#![\/]?/, ''));
		}

		function urlToHash(aUrl) {
			if(typeof aUrl === "string") {
				aUrl = url(aUrl);
			}
			return '#!/' + aUrl.toString();
		}

		function setUrl(aUrl) {
			setHash(urlToHash(aUrl));
		}

		function createFrame() {
			var iDoc = jQuery("<iframe id='ie_history_iframe'" +
				"src='" + iframe_src + "'" +
				"style='display: none'></iframe>").prependTo("body")[0];
			iframe = iDoc.contentWindow.document || iDoc.document;
			if (window.location.hash) {
				iframe.location.hash = window.location.hash.substr(1);
			}
			iframe.location.title = window.title;
		}

		function updateFrame() {
			// Special hack for IE < 8 since hashchanges is not added to history.
			// IE will add a history entry when IFrame is opened/closed.
			iframe.open();
			iframe.close();
			iframe.location.hash = my.currentHash;
		}

		function check() {
			var newHash = isLegacyBrowser ?
				iframe.location.hash :
				getHash();

			var urlChanged = my.currentHash !== newHash;
			if (urlChanged) {
				my.currentHash = newHash;
				my.history.push(my.currentHash);

				if (isLegacyBrowser) {
					updateFrame();
					setHash(iframe.location.hash);
				}

				that.trigger('changed', getUrl());
			}
		}

		// ### Public API

		that.setUrl = function(aUrl) {
			setUrl(aUrl);
			check();
		};

		that.getUrl = getUrl;

		that.linkToUrl = urlToHash;

		that.back = function(fallbackUrl) {
			if (my.history.length > 1) {
				my.history.pop();
				setHash(my.history.pop());
			} else if (fallbackUrl) {
				setUrl(fallbackUrl);
			}
		};

		// **Start/stop** url changes check. If the browser supports it we bind 'check()' to the 'hashchange' event.
		// In legacy browsers we instead pull for changes every 100 ms.

		that.start = function() {
			that.stop();

			my.currentHash = getHash();
			my.history = [my.currentHash];

			if (fallback) {
				if (isLegacyBrowser) {
					createFrame();
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
			jQuery('#ie_my.history_iframe').remove(); // remove any IFRAME
			iframe = null;
		};

		return that;
	}

	return hash;
});