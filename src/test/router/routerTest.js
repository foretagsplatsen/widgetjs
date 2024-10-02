import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import router from "../../router/router.js";

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

let my;
let aRouter;

describe("router", () => {
	beforeEach(() => {
		window.location.hash = "";

		my = {};
		aRouter = router({}, my);
		vi.useFakeTimers();
	});

	afterEach(() => {
		aRouter.stop();
		aRouter.clear();
		aRouter = null;
		vi.useRealTimers();
	});

	it("router defaults", () => {
		// Assert that defaults are correct
		expect(my.routeTable).toHaveLength(0);
		expect(my.lastMatch).toBeUndefined();
	});

	it("router options", () => {
		// Arrange a router with options set
		let anotherMy = {};

		router(
			{
				locationHandler: {
					isFake: true,
					changed: { register: function () {} },
				},
			},
			anotherMy,
		);

		// Assert that options where applied
		expect(anotherMy.location.isFake).toBeTruthy();
	});

	it("add route", () => {
		// Act: add a route
		let route = aRouter.addRoute({ pattern: "/users/" });

		// Assert that route was added to route table
		expect(my.routeTable).toHaveLength(1);
		expect(my.routeTable[0]).toBe(route);
	});

	it("remove route", () => {
		// Act: add and remove route
		let route = aRouter.addRoute({ pattern: "/users/" });
		aRouter.removeRoute(route);

		// Assert that route was removed from route table
		expect(my.routeTable).toHaveLength(0);
	});

	it("named routes", () => {
		// Arrange: a named route
		let route = aRouter.addRoute({ name: "users", pattern: "/users/" });

		// Act: lookup route by name
		let namedRoute = aRouter.getRouteByName("users");

		// Assert that route is found
		expect(namedRoute).toBe(route);
	});

	it("add routes with priority", () => {
		// Act: add routes with different priorities
		let invoiceRoute = aRouter.addRoute({ pattern: "/invoice/" });
		let ticketRoute = aRouter.addRoute({ pattern: "/ticket/" });
		aRouter.addRoute({ pattern: "/customer/", priority: 2 });
		let orderRoute = aRouter.addRoute({
			pattern: "/order/",
			priority: 2,
		});
		let userRoute = aRouter.addRoute({ pattern: "/user/", priority: 1 });

		// Assert that route was added to route table in correct order
		expect(my.routeTable).toHaveLength(5);
		expect(my.routeTable[0]).toBe(userRoute);
		expect(my.routeTable[2]).toBe(orderRoute);
		expect(my.routeTable[3]).toBe(invoiceRoute);
		expect(my.routeTable[4]).toBe(ticketRoute);
	});

	it("resolveUrl executes route callback on match", () => {
		// Arrange: setup a route
		let userRoute = aRouter.addRoute({ pattern: "/user/" });
		let spy = vi.fn();

		userRoute.on("matched", spy);

		// Act: resolve two different URL:s but only first should match
		aRouter.resolveUrl("/user/");
		aRouter.resolveUrl("/order/");

		// Assert that callback was executed
		expect(spy).toHaveBeenCalledOnce();
	});

	it("resolveUrl triggers resolveUrl event", () => {
		let spy = vi.fn();

		// listen for "resolveUrl event" on router
		aRouter.on("resolveUrl", spy);

		// Act: resolve any URL
		aRouter.resolveUrl("/user/");

		// Assert that callback was executed
		expect(spy).toHaveBeenCalledWith(expect.anything());
	});

	it("resolveUrl triggers routeMatched event", () =>
		new Promise((resolve) => {
			expect.assertions(2);

			// Arrange: setup a route
			let userRoute = aRouter.addRoute({ pattern: "/user/" });

			// listen for "matched event" on router
			aRouter.on("routeMatched", function (result) {
				// Assert that callback was executed
				expect(result).toBeTruthy();
				expect(result.getRoute()).toStrictEqual(userRoute);

				this.unbind(); // clean-up
				resolve(); // execute asserts
			});

			// Act: resolve URL that match
			aRouter.resolveUrl("/user/");
		}));

	it("resolveUrl triggers routeNotFound event", () =>
		new Promise((resolve) => {
			expect.assertions(2);

			// Arrange: setup no routes but
			// a lister for "notFound event"
			aRouter.on("routeNotFound", function (url) {
				// Assert that callback was executed
				expect(url).toBeTruthy();
				expect(url.toString()).toBe("/user/");

				this.unbind(); // clean-up
				resolve(); // execute asserts
			});

			// Act: resolve URL:s that should not match
			aRouter.resolveUrl("/user/");
		}));

	it("resolveUrl executes action on match", () => {
		let spy = vi.fn();

		// Arrange: setup a route
		aRouter.addRoute({
			pattern: "/user/",
			action: spy,
		});

		// Act: resolve a URL that match pattern
		aRouter.resolveUrl("/user/");

		// Assert that callback was executed
		expect(spy).toHaveBeenCalledWith({});
	});

	it("resolveUrl pass values to action", () =>
		new Promise((resolve) => {
			expect.assertions(2);

			// Arrange a route that have two mandatory parameters
			aRouter.addRoute({
				pattern: "/user/#userid/order/#orderid",
				action: function (userid, orderid) {
					expect(userid).toBe("john");
					expect(orderid).toBe("1");

					this.unbind(); // clean-up
					resolve(); // execute asserts
				},
			});

			// Act: resolve a URL that match pattern
			aRouter.resolveUrl("/user/john/order/1");
		}));

	it("resolveUrl pass optional values to action", () =>
		new Promise((resolve) => {
			expect.assertions(2);

			// Arrange a route that have two mandatory parameters
			aRouter.addRoute({
				pattern: "/user/?userid/order/?orderid",
				action: function (userid, orderid) {
					expect(userid).toBeUndefined();
					expect(orderid).toBe("1");

					this.unbind(); // clean-up
					resolve(); // execute asserts
				},
			});

			// Act: resolve a URL that match pattern
			aRouter.resolveUrl("/user/order/1");
		}));

	it("resolveUrl pass optional value defaults to action", () =>
		new Promise((resolve) => {
			expect.assertions(2);

			// Arrange a route that have two optional parameters
			// with defaukts
			aRouter.addRoute({
				pattern: "/user/?userid/order/?orderid",
				defaults: {
					userid: "bengan",
					orderid: "skor",
				},
				action: function (userid, orderid) {
					expect(userid).toBe("bengan");
					expect(orderid).toBe("1");

					this.unbind(); // clean-up
					resolve(); // execute asserts
				},
			});

			// Act: resolve a URL that match pattern
			aRouter.resolveUrl("/user/order/1");
		}));

	it("resolveUrl pass query as last argument to action", () =>
		new Promise((resolve) => {
			expect.assertions(3);

			// Arrange a route that have one parameter
			aRouter.addRoute({
				pattern: "/user/#userid/order",
				action: function (userid, query) {
					// Assert: that parameters and query was passed ok
					expect(userid).toBe("john");
					expect(query.filter).toBe("open");
					expect(query.orderBy).toBe("date");

					this.unbind(); // clean-up
					resolve(); // execute asserts
				},
			});

			// Act: resolve a URL that match pattern
			aRouter.resolveUrl("/user/john/order/?filter=open&orderBy=date");
		}));

	it("resolveUrl continues if fallThrough", () =>
		new Promise((resolve) => {
			expect.assertions(2);

			// Arrange a 3 routes, where first have fallThrough
			// set and the two other have not

			aRouter.addRoute({
				fallThrough: true,
				pattern: "/user/",
				action: function () {
					expect(true).toBeTruthy();

					this.unbind(); // clean-up
				},
			});

			aRouter.addRoute({
				pattern: "/user/",
				action: function () {
					expect(true).toBeTruthy();

					this.unbind(); // clean-up
					resolve(); // execute asserts
				},
			});

			aRouter.addRoute({
				pattern: "/user/",
				action: function () {
					expect(true).toBeTruthy();

					this.unbind(); // clean-up
				},
			});

			// Act: resolve a URL that match pattern
			aRouter.resolveUrl("/user/");
		}));

	it("add route with constraints", () => {
		let action = vi.fn();

		aRouter.addRoute({
			pattern: "/user/#name/",
			constraints: {
				name: ["nicolas", "Mikael"],
			},
			action,
		});

		aRouter.resolveUrl("/user/nicolas");

		expect(action).toHaveBeenCalledWith("nicolas", expect.anything());
		expect(action).toHaveBeenCalledOnce();

		// resolve two URLs that do *not* match constraint
		aRouter.resolveUrl("/user/john");
		aRouter.resolveUrl("/user/james");

		expect(action).toHaveBeenCalledOnce();
	});

	it("getUrl returns current location", () => {
		// Act: change hash and get url
		window.location.hash = "#!/aPath";
		let currentUrl = aRouter.getUrl();

		// Assert correct url
		expect(currentUrl.toString()).toBe("aPath");
	});

	it("linkTo() creates links for href", () => {
		expect(aRouter.linkTo("aPath")).toBe("#!/aPath");
		expect(aRouter.linkTo("")).toBe("#!/");
	});

	it("redirectTo() changes the current location to URL", () => {
		aRouter.redirectTo("aPath");

		expect(window.location.hash).toBe("#!/aPath");

		aRouter.redirectTo("");

		expect(window.location.hash).toBe("#!/");
	});

	it("pipe notfound to another router", () => {
		// Arrange another router with a route handler
		let anotherRouter = router();
		let spy = vi.fn();

		anotherRouter.addRoute({
			pattern: "APathNotInDefaultRouterButInPipedRouter",
			action: spy,
		});

		// Act: pipe to second router if not found in first
		aRouter.pipeNotFound(anotherRouter);
		aRouter.resolveUrl("APathNotInDefaultRouterButInPipedRouter");

		// Assert that second router matched the route
		expect(spy).toHaveBeenCalledWith({});

		anotherRouter.stop();
	});

	it("pipe route to another router", () => {
		// Arrange another router with a route handler
		let anotherRouter = router();
		let spy = vi.fn();

		anotherRouter.addRoute({
			pattern: "/a/b/#c",
			action: spy,
		});

		// Act: pipe pattern tp second router
		aRouter.pipeRoute({ pattern: "a/#b/#c" }, anotherRouter);
		aRouter.resolveUrl("/a/b/c");

		// Assert that second router matched the route
		expect(spy).toHaveBeenCalledOnce();

		anotherRouter.stop();
	});

	it("back()", () =>
		new Promise((resolve) => {
			expect.assertions(5);

			aRouter.stop();
			window.location.hash = ""; // start path
			aRouter.start();

			delayedSteps(
				() => {
					aRouter.redirectTo("a");
				},
				() => {
					aRouter.redirectTo("b");
				},
				() => {
					expect(aRouter.getUrl().toString()).toBe("b");
				},
				() => {
					aRouter.back();
				},
				() => {
					expect(aRouter.getUrl().toString()).toBe("a");
				},
				() => {
					aRouter.back();
				},
				() => {
					expect(aRouter.getUrl().toString()).toBe("");
				},
				() => {
					aRouter.back();
				},
				() => {
					expect(aRouter.getUrl().toString()).toBe("");
				},
				() => {
					aRouter.back("fallback");
				},
				() => {
					expect(aRouter.getUrl().toString()).toBe("fallback");
				},
				resolve,
			);

			vi.advanceTimersByTime(131);
		}));

	it("expand parameters for named route", () => {
		// Arrange: a named route
		aRouter.addRoute({ name: "user", pattern: "/user/#userId" });

		// Act: get path from parameters
		let url = aRouter.expand({
			routeName: "user",
			parameters: { userId: "john", includeDetails: true },
		});

		// Assert that route parameters was injected in url and
		// other parameters was set in query
		expect(url.toString()).toBe("user/john?includeDetails=true");
	});

	it("expand parameters for empty route", () => {
		// Arrange: empty hash route
		window.location.hash = ""; // start path

		// Act: get path from parameters
		let url = aRouter.expand({
			parameters: { userId: "john", includeDetails: true },
		});

		// Assert that all parameters was set as query parameters
		expect(url.toString()).toBe("?userId=john&includeDetails=true");
	});

	it("expand parameters for current route", () => {
		// Arrange: a named route
		aRouter.addRoute({
			name: "user",
			pattern: "/user/#userId",
		});

		// and navigate to that route
		aRouter.redirectTo("/user/john", { includeCompanies: true });

		// Act: get path from parameters for current location
		let url = aRouter.expand({
			parameters: { includeDetails: true },
		});

		// Assert that route parameters was injected in url and
		// other parameters was set in query
		expect(url.toString()).toBe(
			"user/john?includeCompanies=true&includeDetails=true",
		);
	});

	it("linkTo with default parameters", () => {
		// Arrange: a route with non optional parameter #foo
		aRouter.addRoute({
			name: "bar",
			pattern: "/#foo/bar",
		});

		// and a default parameter getter for #foo
		aRouter.setDefaultParameter("foo", () => "default");

		// Act: link to without mandatory parameter #foo
		let url = aRouter.linkTo("bar");

		// Assert that foo is in second route as well
		expect(url.toString()).toBe("#!/default/bar");
	});

	it("getParameters from current URL", () => {
		// Arrange: a named route
		aRouter.addRoute({ name: "user", pattern: "/user/#userId" });

		// and navigate to that route
		aRouter.redirectTo("/user/john", { includeCompanies: true });

		// Act: get parameters from URL
		let parameters = aRouter.getParameters();

		// Assert that parameters contains both query and URL parameters
		expect(parameters).toStrictEqual({
			userId: "john",
			includeCompanies: "true",
		});
	});

	it("getParameter", () => {
		// Arrange: a named route
		aRouter.addRoute({ name: "user", pattern: "/user/#userId" });

		// and navigate to that route
		aRouter.redirectTo("/user/john", { includeCompanies: true });

		// Act: get parameters from URL
		let userIdParameter = aRouter.getParameter("userId");
		let includeCompaniesParameter =
			aRouter.getParameter("includeCompanies");
		let unknownParameter = aRouter.getParameter("unknown");

		// Assert that parameters contains both query and URL parameters
		expect(userIdParameter).toBe("john");
		expect(includeCompaniesParameter).toBe("true");
		expect(unknownParameter).toBeUndefined();
	});

	it("setParameters()", () =>
		new Promise((resolve) => {
			expect.assertions(4);

			aRouter.stop();
			window.location.hash = ""; // start path
			aRouter.start();

			aRouter.addRoute({ pattern: "a/#value" });

			delayedSteps(
				() => {
					aRouter.redirectTo("a/b", { foo: "bar" });
				},
				() => {
					expect(aRouter.getUrl().toString()).toBe("a/b?foo=bar");
				},
				() => {
					aRouter.setParameters({ value: "hello" });
				},
				() => {
					expect(aRouter.getUrl().toString()).toBe("a/hello?foo=bar");
				},
				() => {
					aRouter.setParameters({ foo: "world" });
				},
				() => {
					expect(aRouter.getUrl().toString()).toBe(
						"a/hello?foo=world",
					);
				},
				() => {
					aRouter.setParameters({ extra: "fun" });
				},
				() => {
					expect(aRouter.getUrl().toString()).toBe(
						"a/hello?foo=world&extra=fun",
					);
				},
				resolve,
			);

			vi.advanceTimersByTime(131);
		}));
});
