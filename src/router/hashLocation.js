import jQuery from "jquery";
import events from "../events";
import url from "./url";
import klassified from "klassified";

/**
 * In modern browsers we use the "hashchange" event to listen for location changes. If not supported
 * we poll for changes using a timer.
 */
var noHashChangeSupport = !("onhashchange" in window);

/**
 * Num ms between each location change poll on browsers without "hashchange"
 */
var pollInterval = 25;

/**
 * Manages and listens for changes in the hash fragment of the URL.
 *
 * @example
 *        var location = hash();
 *        hash.on("changed", function(newUrl) { window.alert(newUrl); });
 *        location.start();
 *        location.setUrl("newUrl");
 *        location.setUrl("anotherUrl");
 *        location.back();
 *
 * @param {{}} [spec]
 *
 * @param [my]
 * @returns {hashLocation}
 */
var hashLocation = klassified.object.subclass(function(that, my) {

	var pollTimerId = null;

	my.currentHash = undefined; // last hash fragment
	my.history = []; // history of visited hash fragments
	my.events = events.eventCategory();

	//
	// Public
	//

	/**
	 * Triggered when location change with new URL as
	 * argument.
	 *
	 * @type {event}
	 */
	that.changed = my.events.createEvent("changed");
	that.onChanged = that.changed; // deprecated

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
			pollTimerId = setInterval(check, pollInterval);
		} else {
			jQuery(window).bind("hashchange", check);
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
		jQuery(window).unbind("hashchange", check);
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
		if (typeof aUrl === "string") {
			aUrl = url({rawUrl: aUrl});
		}
		return "#!/" + aUrl.toString();
	}

	function urlFromHash(aHash) {
		// Remove hash/hash-bang and any leading /
		return url({rawUrl: aHash.replace(/^#!?[/]?/, "")});
	}

	function setCurrentHash(newHash) {
		newHash = newHash || getWindowHash();

		if (my.currentHash !== newHash) {
			my.currentHash = newHash;
			my.history.push(my.currentHash);
		}

		that.changed.trigger(urlFromHash(my.currentHash));
	}

	function check() {
		var windowHash = getWindowHash();

		var urlChanged = my.currentHash !== windowHash;
		if (urlChanged) {
			setCurrentHash(windowHash);
		}
	}
});

export default hashLocation;
