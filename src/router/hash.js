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
	// See `createFrame()` and `updateFrame()`.
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

	var noHashChangeSupport = !('onhashchange' in window),
		isLegacyBrowser = jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 8,
		poll_intervall = 25;  // Num ms between each location change poll on legacy browsers

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


		// Handle Window Hash

		function getWindowHash() {
			return window.location.hash;
		}

		function setWindowHash(aHash) {
			window.location.hash = aHash;
		}


		// Convert hash to/from url

		function urlToHash(aUrl) {
			if(typeof aUrl === "string") {
				aUrl = url(aUrl);
			}
			return '#!/' + aUrl.toString();
		}

		function urlFromHash(aHash) {
			// Remove hash/hash-bang and any leading /
			return url(aHash.replace(/^#!?[\/]?/, ''));
		}

		// Manage iFrame for IE < 8

		function createFrame() {
			var idoc = jQuery("<iframe id='ie_history_iframe'" +
				"src='" + iframe_src + "'" +
				"style='display: none'></iframe>").prependTo("body")[0];
			iframe = idoc.contentWindow.document || idoc.document;
			if (window.location.hash) {
				iframe.location.hash = my.currentHash.substr(1); // remove #
			}
			iframe.location.title = window.title;
		}

		function setFrameHash(aHash) {
			// Special hack for IE < 8 since hashchanges is not added to history.
			// IE will add a history entry when IFrame is opened/closed.
			iframe.open();
			iframe.close();
			iframe.location.hash = aHash.substr(1); // remove #
		}

		function getFrameHash() {
			return iframe.location.hash;
		}


		// Handle Hash change

		function setCurrentHash(newHash) {
			newHash = newHash || getWindowHash();

			if(my.currentHash !== newHash) {
				my.currentHash = newHash;
				my.history.push(my.currentHash);

				if (isLegacyBrowser) {
					setFrameHash(my.currentHash);
				}
			}

			that.trigger('changed', urlFromHash(my.currentHash));
		}

		function check() {
			var windowHash = getWindowHash();

			if(isLegacyBrowser) {
				var frameHash = getFrameHash();

				var isBackButtonClicked = frameHash !== my.currentHash &&
					frameHash !== windowHash;

				if(isBackButtonClicked) {
					setWindowHash(frameHash);
					windowHash = frameHash;
				}
			}

			var urlChanged = my.currentHash !== windowHash;
			if (urlChanged) {
				setCurrentHash(windowHash);
			}
		}


		// ### Public API

		that.setUrl = function(aUrl) {
			var aHash = urlToHash(aUrl);
			setWindowHash(aHash);
			setCurrentHash(aHash);
		};

		that.getUrl = function() {
			return urlFromHash(getWindowHash());
		};

		that.linkToUrl = function(aUrl) {
			return urlToHash(aUrl);
		};

		that.back = function(fallbackUrl) {
			if (my.history.length > 1) {
				my.history.pop();
				setWindowHash(my.history.pop());
			} else if (fallbackUrl) {
				setWindowHash(urlToHash(fallbackUrl));
			}

			setCurrentHash();
		};

		that.start = function() {
			that.stop();

			my.currentHash = getWindowHash();
			my.history = [my.currentHash];

			if (noHashChangeSupport) {
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