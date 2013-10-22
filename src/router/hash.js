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
	// In old IE (< IE 8) a hidden IFrame is created to allow the back button and hash-based history to work.
	// See `createFrame()` and `fixHistoryForIE()`.
	//
	// Usage:
	//
	//		var location = hash();
	//		hash.on('changed', function(newHash) { window.alert(newHash); });
	//		location.start();
	//		location.setUrl('newUrl');
	//		location.setUrl('anotherUrl');
	//		location.back();
	//
	// _Note:_ Router can be started before DOM is ready, but since it won’t be usable before then in
	// IE6/7 (due to the necessary IFrame), recommended usage is to bind it inside a DOM ready handler.
	//

	var fallback = !('onhashchange' in window),
		poll_intervall = 25,  // Num ms between each location change poll on legacy browsers
		isLegacyBrowser = jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 8;

	function hash(spec, my) {
		spec = spec || {};
		my = my || {};

		var currentHash, // last hash fragment
			history = [], // history of visited hash fragments
			pollTimerId = null,
			iframe,
			iframe_src = (spec.iframe_src || /*jshint scripturl:true*/ 'javascript:0');
			/*jshint scripturl:false*/

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
			iframe.location.hash = currentHash;
		}

		function check() {
			var newHash = isLegacyBrowser ?
				iframe.location.hash :
				getHash();

			var urlChanged = currentHash !== newHash;
			if (urlChanged) {
				currentHash = newHash;
				history.push(currentHash);

				that.trigger('changed', currentHash);

				if (isLegacyBrowser) {
					updateFrame();
					setHash(iframe.location.hash);
				}
			}
		}

		// ### Public API

		that.setHash = setHash;
		that.getHash = getHash;

		that.getUrl = getUrl;
		that.setUrl = setUrl;

		that.linkToUrl = urlToHash;

		that.back = function(fallbackUrl) {
			if (history.length > 1) {
				history.pop();
				setHash(history.pop());
			} else if (fallbackUrl) {
				setUrl(fallbackUrl);
			}
		};

		// **Start/stop** url changes check. If the browser supports it we bind 'check()' to the 'hashchange' event.
		// In legacy browsers we instead pull for changes every 100 ms.

		that.start = function() {
			that.stop();

			currentHash = getHash();
			history = [currentHash];

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
			jQuery('#ie_history_iframe').remove(); // remove any IFRAME
			iframe = null;
		};

		return that;
	}

	return hash;
});