import jQuery from "../../lib-wrappers/jquery.js";
import hashLocationModel from "../../router/hashLocation.js";

// Helpers

function delayedSteps() {
	let steps = Array.prototype.slice.call(arguments);

	function next() {
		if (steps.length === 0) {
			return;
		}
		let fn = steps.shift();

		setTimeout(function () {
			next(fn.apply(next, arguments));
		}, 10);
	}

	next();
}

function setHash(aHash) {
	window.location.hash = aHash;
	jQuery(window).trigger("hashchange");
}

let my;
let hashLocation;

describe("hashLocation", () => {
	beforeEach(() => {
		window.location.hash = "";

		my = {};
		hashLocation = hashLocationModel({}, my);
		jasmine.clock().install();
	});

	afterEach(() => {
		if (hashLocation) {
			hashLocation.stop();
		}
		window.location.hash = "";
		jasmine.clock().uninstall();
	});

	it("hash defaults", () => {
		// Assert that defaults are correct
		expect(my.currentHash).toBe(undefined);
		expect(my.history.length).toBe(0);
	});

	it("start() initilize hash", () => {
		// Arrange: set a location hash
		window.location.hash = "#!/test";

		// Act: start listening
		hashLocation.start();

		// Assert that hash is current location and history is set
		expect(my.currentHash).toBe("#!/test");
		expect(my.history.length).toBe(1);
		expect(my.history[0]).toBe(my.currentHash);
	});

	it("start() resets hash", () => {
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

	it("getUrl() returns location.hash minus hash-bang", () => {
		// Arrange: set a location hash
		window.location.hash = "#!/test";

		// Act: get current URL
		hashLocation.start();
		let currentUrl = hashLocation.getUrl();

		// Assert that URL is location hash minus hash-bang
		expect(currentUrl.toString()).toBe("test");
	});

	it("setUrl() adds hash-bang", () => {
		// Act: set url
		hashLocation.start();
		hashLocation.setUrl("test");

		// Assert that current hash is set correctly
		expect(my.currentHash).toBe("#!/test");
	});

	it("linkToUrl() return link for href:s", () => {
		// Act: create link to URL
		let link = hashLocation.linkToUrl("someurl");

		// Assert that URL have hash-bang
		expect(link).toBe("#!/someurl");
	});

	it("setUrl() triggers change", () => {
		let anotherHashLocation = hashLocationModel();
		let spy = jasmine.createSpy("changed event");

		// Arrange: listen for url changes
		anotherHashLocation.changed.register(spy);

		// Act: set URL
		anotherHashLocation.start();
		anotherHashLocation.setUrl("test");

		// Assert that "change" callback was executed with url
		expect(spy).toHaveBeenCalledWith({
			asymmetricMatch: function (actual) {
				return actual.toString() === "test";
			},
		});

		anotherHashLocation.stop();
	});

	it("back()", (callback) => {
		delayedSteps(
			() => {
				hashLocation.stop();
				window.location.hash = ""; // start hash
				hashLocation.start();
			},
			() => {
				hashLocation.setUrl("a");
			},
			() => {
				hashLocation.setUrl("b");
			},
			() => {
				expect(hashLocation.getUrl().toString()).toBe("b");
			},
			() => {
				hashLocation.back();
			},
			() => {
				expect(hashLocation.getUrl().toString()).toBe("a");
			},
			() => {
				hashLocation.back();
			},
			() => {
				expect(hashLocation.getUrl().toString()).toBe("");
			},
			() => {
				hashLocation.back();
			},
			() => {
				expect(hashLocation.getUrl().toString()).toBe("");
			},
			() => {
				hashLocation.back("fallback");
			},
			() => {
				expect(hashLocation.getUrl().toString()).toBe("fallback");
			},
			() => {
				callback();
			},
		);

		jasmine.clock().tick(131);
	});
});
