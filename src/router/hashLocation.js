define([
	'jquery',
	'../events',
	'./url'
], function(jQuery, events, url) {

	/**
	 * In modern browsers we use the 'hashchange' event to listen for location changes. If not supported
	 * we poll for changes using a timer.
	 */
	var noHashChangeSupport = !('onhashchange' in window);

	/**
	 * Num ms between each location change poll on browsers without 'hashchange'
	 */
	var pollInterval = 25;

	/**
	 * In old IE (< IE 8) a hidden IFrame is created to allow the back button and hash-based history to work.
	 */
	var requireIFrameHistory = jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 8;

	/**
	 * Manages and listens for changes in the hash fragment of the URL.
	 *
	 * @example
	 *		var location = hash();
	 *		hash.on('changed', function(newUrl) { window.alert(newUrl); });
	 *		location.start();
	 *		location.setUrl('newUrl');
	 *		location.setUrl('anotherUrl');
	 *		location.back();
	 *
	 * Note: Hash can be started before DOM is ready, but since it won’t be usable before then in
	 * IE6/7 (due to the necessary IFrame), recommended usage is to start it inside a DOM ready handler.
	 *
	 * @param {{}} [spec]
	 * @param {string} [spec.iFrameSrc='javascript:0']
	 *
	 * @param [my]
	 * @returns {hashLocation}
	 */
	function hashLocation(spec, my) {
		spec = spec || {};
		my = my || {};

		var pollTimerId = null;
		var iFrame;
		var iFrameSrc = (spec.iFrameSrc || /*jshint scripturl:true*/ 'javascript:0'); /*jshint scripturl:false*/

		my.currentHash = undefined; // last hash fragment
		my.history = []; // history of visited hash fragments
        my.events = events.eventCategory();

		/** @typedef {{}} hashLocation */
		var that = {};

		//
		// Public
		//

		/**
		 * Triggered when location change with new URL as
		 * argument.
		 *
		 * @type {event}
		 */
        that.onChanged = my.events.createEvent('changed');

		/**
		 * Set hash fragment to URL
		 *
		 * @param {url|string} aUrl
		 */
		that.setUrl = function(aUrl) {
			var aHash = urlToHash(aUrl);
			setWindowHash(aHash);
			setCurrentHash(aHash);
		};

		/**
		 * Creates a URL from current hash fragment
		 *
		 * @returns {url}
		 */
		that.getUrl = function() {
			return urlFromHash(getWindowHash());
		};

		/**
		 * Creates a raw URL string from a URL that can be used eg. in a href.
		 *
		 * @param {string|url} aUrl
		 * @returns {string}
		 */
		that.linkToUrl = function(aUrl) {
			return urlToHash(aUrl);
		};


		/**
		 * Navigate back to previous location in history. If history is empty
		 * the location will be changed to fallback URL.
		 *
		 * @param {string|url} fallbackUrl
		 * @returns {string} URL
		 */
		that.back = function(fallbackUrl) {
			if (!that.isHistoryEmpty()) {
				my.history.pop();
				setWindowHash(my.history.pop());
			} else if (fallbackUrl) {
				setWindowHash(urlToHash(fallbackUrl));
			}

			setCurrentHash();
		};

		/**
		 * Return `true` if the history is empty.
		 */
		that.isHistoryEmpty = function() {
			return my.history.length <= 1;
		};

		/**
		 * Start listening for URL changes. If `hashchange` is supported by the browser
		 * it will be used, otherwise a timer will poll for changes.
		 */
		that.start = function() {
			that.stop();

			my.currentHash = getWindowHash();
			my.history = [my.currentHash];

			if (noHashChangeSupport) {
				if (requireIFrameHistory) {
					createFrame();
				}

				pollTimerId = setInterval(check, pollInterval);
			} else {
				jQuery(window).bind('hashchange', check);
			}
		};

		/**
		 * Stop listening for location changes and unregister all bindings.
		 */
		that.stop = function() {
			if (pollTimerId) {
				clearInterval(pollTimerId);
				pollTimerId = null;
			}
			jQuery(window).unbind('hashchange', check);
			jQuery('#ie_my.history_iframe').remove(); // remove any IFRAME
			iFrame = null;
		};

		//
		// Private
		//

		function getWindowHash() {
			return window.location.hash;
		}

		function setWindowHash(aHash) {
			window.location.hash = aHash;
		}

		function urlToHash(aUrl) {
			if(typeof aUrl === 'string') {
				aUrl = url(aUrl);
			}
			return '#!/' + aUrl.toString();
		}

		function urlFromHash(aHash) {
			// Remove hash/hash-bang and any leading /
			return url(aHash.replace(/^#!?[\/]?/, ''));
		}

		function createFrame() {
			var idoc = jQuery('<iframe id="ie_history_iframe" src="' + iFrameSrc + '" style="display: none"></iframe>')
				.prependTo('body')[0];
				iFrame = idoc.contentWindow.document || idoc.document;
			if (window.location.hash) {
				iFrame.location.hash = my.currentHash.substr(1); // remove #
			}
			iFrame.location.title = window.title;
		}

		function setFrameHash(aHash) {
			// Special hack for IE < 8 since hash changes is not added to history.
			// IE will add a history entry when IFrame is opened/closed.
			iFrame.open();
			iFrame.close();
			iFrame.location.hash = aHash.substr(1); // remove #
		}

		function getFrameHash() {
			return iFrame.location.hash;
		}

		function setCurrentHash(newHash) {
			newHash = newHash || getWindowHash();

			if(my.currentHash !== newHash) {
				my.currentHash = newHash;
				my.history.push(my.currentHash);

				if (requireIFrameHistory) {
					setFrameHash(my.currentHash);
				}
			}

			that.onChanged.trigger(urlFromHash(my.currentHash));
		}

		function check() {
			var windowHash = getWindowHash();

			if(requireIFrameHistory) {
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

		return that;
	}

	return hashLocation;
});
