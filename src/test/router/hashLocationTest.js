import jQuery from "jquery";
import hashLocationModel from "../../router/hashLocation";

// Helpers

function delayedSteps() {
	var steps = Array.prototype.slice.call(arguments);

	function next() {
		if (steps.length === 0) {
			return;
		}
		var fn = steps.shift();
		setTimeout(function() {
			next(fn.apply(next, arguments));
		}, 10);
	}

	next();
}

function setHash(aHash) {
	window.location.hash = aHash;
	window.open(window.location, "_self", true);
	jQuery(window).trigger("hashchange");
}

var my;
var hashLocation;

describe("hashLocation", function() {

	beforeEach(function() {
		window.location.hash = "";

		my = {};
		hashLocation = hashLocationModel({}, my);
		jasmine.clock().install();
	});

	afterEach(function() {
		if (hashLocation) {
			hashLocation.stop();
		}
		window.location.hash = "";
		jasmine.clock().uninstall();
	});

	it("hash defaults", function() {
		// Assert that defaults are correct
		expect(my.currentHash).toBe(undefined);
		expect(my.history.length).toBe(0);
	});

	it("start() initilize hash", function() {
		// Arrange: set a location hash
		window.location.hash = "#!/test";

		// Act: start listening
		hashLocation.start();

		// Assert that hash is current location and history is set
		expect(my.currentHash).toBe("#!/test");
		expect(my.history.length).toBe(1);
		expect(my.history[0]).toBe(my.currentHash);
	});

	it("start() resets hash", function() {
		// Arrange: add some history
		hashLocation.start();
		setHash("#!/a");
		setHash("#!/b");

		// Act: restart hash
		hashLocation.start();

		// Assert that hash was reset,
		expect(my.history.length).toBe(1);
		expect(my.history[0]).toBe(my.currentHash);
	});

	it("getUrl() returns location.hash minus hash-bang", function() {
		// Arrange: set a location hash
		window.location.hash = "#!/test";

		// Act: get current URL
		hashLocation.start();
		var currentUrl = hashLocation.getUrl();

		// Assert that URL is location hash minus hash-bang
		expect(currentUrl.toString()).toBe("test");
	});

	it("setUrl() adds hash-bang", function() {
		// Act: set url
		hashLocation.start();
		hashLocation.setUrl("test");

		// Assert that current hash is set correctly
		expect(my.currentHash).toBe("#!/test");
	});

	it("linkToUrl() return link for href:s", function() {
		// Act: create link to URL
		var link = hashLocation.linkToUrl("someurl");

		// Assert that URL have hash-bang
		expect(link).toBe("#!/someurl");
	});

	it("setUrl() triggers change", function() {
		var anotherHashLocation = hashLocationModel();
		var spy = jasmine.createSpy("changed event");

		// Arrange: listen for url changes
		anotherHashLocation.changed.register(spy);

		// Act: set URL
		anotherHashLocation.start();
		anotherHashLocation.setUrl("test");

		// Assert that "change" callback was executed with url
		expect(spy).toHaveBeenCalledWith({
			asymmetricMatch: function(actual) {
				return actual.toString() === "test";
			}
		});

		anotherHashLocation.stop();
	});

	it("back()", function(callback) {
		delayedSteps(
			function() {
				hashLocation.stop();
				window.location.hash = ""; // start hash
				hashLocation.start();
			},
			function() {
				hashLocation.setUrl("a");
			},
			function() {
				hashLocation.setUrl("b");
			},
			function() {
				expect(hashLocation.getUrl().toString()).toBe("b");
			},
			function() {
				hashLocation.back();
			},
			function() {
				expect(hashLocation.getUrl().toString()).toBe("a");
			},
			function() {
				hashLocation.back();
			},
			function() {
				expect(hashLocation.getUrl().toString()).toBe("");
			},
			function() {
				hashLocation.back();
			},
			function() {
				expect(hashLocation.getUrl().toString()).toBe("");
			},
			function() {
				hashLocation.back("fallback");
			},
			function() {
				expect(hashLocation.getUrl().toString()).toBe("fallback");
			},
			function() {
				callback();
			}
		);
		jasmine.clock().tick(131);
	});
});
