import router from "../../router/router";

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

var my;
var aRouter;

describe("router", function() {

	beforeEach(function() {
		window.location.hash = "";

		my = {};
		aRouter = router({}, my);
		jasmine.clock().install();
	});

	afterEach(function() {
		aRouter.stop();
		aRouter.clear();
		aRouter = null;
		jasmine.clock().uninstall();
	});

	it("Router defaults", function() {
		// Assert that defaults are correct
		expect(my.routeTable.length).toBe(0);
		expect(my.lastMatch).toBe(undefined);
	});

	it("Router options", function() {
		// Arrange a router with options set
		var anotherMy = {};
		router({
			locationHandler: {isFake: true, changed: {register: function() {}}}
		}, anotherMy);

		// Assert that options where applied
		expect(anotherMy.location.isFake).toBeTruthy();
	});

	it("Add route", function() {
		// Act: add a route
		var route = aRouter.addRoute({pattern: "/users/"});

		// Assert that route was added to route table
		expect(my.routeTable.length).toBe(1);
		expect(my.routeTable[0]).toBe(route);
	});

	it("Remove route", function() {
		// Act: add and remove route
		var route = aRouter.addRoute({pattern: "/users/"});
		aRouter.removeRoute(route);

		// Assert that route was removed from route table
		expect(my.routeTable.length).toBe(0);
	});

	it("Named routes", function() {
		// Arrange: a named route
		var route = aRouter.addRoute({name: "users", pattern: "/users/"});

		// Act: lookup route by name
		var namedRoute = aRouter.getRouteByName("users");

		// Assert that route is found
		expect(namedRoute).toBe(route);
	});

	it("Add routes with priority", function() {
		// Act: add routes with different priorities
		var invoiceRoute = aRouter.addRoute({pattern: "/invoice/"});
		var ticketRoute = aRouter.addRoute({pattern: "/ticket/"});
		aRouter.addRoute({pattern: "/customer/", priority: 2});
		var orderRoute = aRouter.addRoute({
			pattern: "/order/",
			priority: 2
		});
		var userRoute = aRouter.addRoute({pattern: "/user/", priority: 1});

		// Assert that route was added to route table in correct order
		expect(my.routeTable.length).toBe(5);
		expect(my.routeTable[0]).toBe(userRoute);
		expect(my.routeTable[2]).toBe(orderRoute);
		expect(my.routeTable[3]).toBe(invoiceRoute);
		expect(my.routeTable[4]).toBe(ticketRoute);
	});

	it("resolveUrl executes route callback on match", function() {
		// Arrange: setup a route
		var userRoute = aRouter.addRoute({pattern: "/user/"});
		var spy = jasmine.createSpy("matched event");

		userRoute.on("matched", spy);

		// Act: resolve two different URL:s but only first should match
		aRouter.resolveUrl("/user/");
		aRouter.resolveUrl("/order/");

		// Assert that callback was executed
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it("resolveUrl triggers resolveUrl event", function() {
		var spy = jasmine.createSpy("resolveUrl event");

		// listen for "resolveUrl event" on router
		aRouter.on("resolveUrl", spy);

		// Act: resolve any URL
		aRouter.resolveUrl("/user/");

		// Assert that callback was executed
		expect(spy).toHaveBeenCalled();
	});

	it("resolveUrl triggers routeMatched event", function(done) {
		// Arrange: setup a route
		var userRoute = aRouter.addRoute({pattern: "/user/"});

		// listen for "matched event" on router
		aRouter.on("routeMatched", function(result) {
			// Assert that callback was executed
			expect(result).toBeTruthy();
			expect(result.getRoute()).toEqual(userRoute);

			this.unbind(); // clean-up
			done(); // execute asserts
		});

		// Act: resolve URL that match
		aRouter.resolveUrl("/user/");
	});

	it("resolveUrl triggers routeNotFound event", function(done) {
		// Arrange: setup no routes but
		// a lister for "notFound event"
		aRouter.on("routeNotFound", function(url) {
			// Assert that callback was executed
			expect(url).toBeTruthy();
			expect(url.toString()).toEqual("/user/");

			this.unbind(); // clean-up
			done(); // execute asserts
		});

		// Act: resolve URL:s that should not match
		aRouter.resolveUrl("/user/");
	});

	it("resolveUrl executes action on match", function() {
		var spy = jasmine.createSpy("action");

		// Arrange: setup a route
		aRouter.addRoute({
			pattern: "/user/",
			action: spy
		});

		// Act: resolve a URL that match pattern
		aRouter.resolveUrl("/user/");

		// Assert that callback was executed
		expect(spy).toHaveBeenCalled();
	});

	it("resolveUrl pass values to action", function(done) {
		// Arrange a route that have two mandatory parameters
		aRouter.addRoute({
			pattern: "/user/#userid/order/#orderid",
			action: function(userid, orderid) {
				expect(userid === "john" && orderid === "1").toBeTruthy();
				this.unbind(); // clean-up
				done(); // execute asserts
			}
		});

		// Act: resolve a URL that match pattern
		aRouter.resolveUrl("/user/john/order/1");
	});

	it("resolveUrl pass optional values to action", function(done) {
		// Arrange a route that have two mandatory parameters
		aRouter.addRoute({
			pattern: "/user/?userid/order/?orderid",
			action: function(userid, orderid) {
				expect(userid).toBe(undefined);
				expect(orderid).toBe("1");
				this.unbind(); // clean-up
				done(); // execute asserts
			}
		});

		// Act: resolve a URL that match pattern
		aRouter.resolveUrl("/user/order/1");
	});

	it("resolveUrl pass optional value defaults to action", function(done) {
		// Arrange a route that have two optional parameters
		// with defaukts
		aRouter.addRoute({
			pattern: "/user/?userid/order/?orderid",
			defaults: {
				userid: "bengan",
				orderid: "skor"
			},
			action: function(userid, orderid) {
				expect(userid).toBe("bengan");
				expect(orderid).toBe("1");
				this.unbind(); // clean-up
				done(); // execute asserts
			}
		});

		// Act: resolve a URL that match pattern
		aRouter.resolveUrl("/user/order/1");
	});

	it("resolveUrl pass query as last argument to action", function(done) {
		// Arrange a route that have one parameter
		aRouter.addRoute({
			pattern: "/user/#userid/order",
			action: function(userid, query) {
				// Assert: that parameters and query was passed ok
				expect(userid).toBe("john");
				expect(query.filter).toBe("open");
				expect(query.orderBy).toBe("date");
				this.unbind(); // clean-up
				done(); // execute asserts
			}
		});

		// Act: resolve a URL that match pattern
		aRouter.resolveUrl("/user/john/order/?filter=open&orderBy=date");
	});

	it("resolveUrl continues if fallThrough", function(done) {
		// Arrange a 3 routes, where first have fallThrough
		// set and the two other have not

		aRouter.addRoute({
			fallThrough: true,
			pattern: "/user/",
			action: function() {
				expect(true).toBeTruthy();
				this.unbind(); // clean-up
			}
		});

		aRouter.addRoute({
			pattern: "/user/",
			action: function() {
				expect(true).toBeTruthy();
				this.unbind(); // clean-up
				done(); // execute asserts
			}
		});

		aRouter.addRoute({
			pattern: "/user/",
			action: function() {
				expect(true).toBeTruthy();
				this.unbind(); // clean-up
			}
		});

		// Act: resolve a URL that match pattern
		aRouter.resolveUrl("/user/");
	});

	it("Add route with constraints", function() {
		var action = jasmine.createSpy("action");

		aRouter.addRoute({
			pattern: "/user/#name/",
			constraints: {
				name: ["nicolas", "Mikael"]
			},
			action: action
		});

		aRouter.resolveUrl("/user/nicolas");

		expect(action).toHaveBeenCalledWith("nicolas", jasmine.anything());
		expect(action).toHaveBeenCalledTimes(1);

		// resolve two URLs that do *not* match constraint
		aRouter.resolveUrl("/user/john");
		aRouter.resolveUrl("/user/james");

		expect(action).toHaveBeenCalledTimes(1);
	});

	it("getUrl returns current location", function() {
		// Act: change hash and get url
		window.location.hash = "#!/aPath";
		var currentUrl = aRouter.getUrl();

		// Assert correct url
		expect(currentUrl.toString()).toBe("aPath");
	});

	it("linkTo() creates links for href", function() {
		expect(aRouter.linkTo("aPath")).toBe("#!/aPath");
		expect(aRouter.linkTo("")).toBe("#!/");
	});

	it("redirectTo() changes the current location to URL", function() {
		aRouter.redirectTo("aPath");

		expect(window.location.hash).toBe("#!/aPath");

		aRouter.redirectTo("");

		expect(window.location.hash).toBe("#!/");
	});

	it("Pipe notfound to another router", function() {
		// Arrange another router with a route handler
		var anotherRouter = router();
		var spy = jasmine.createSpy("action");
		anotherRouter.addRoute({
			pattern: "APathNotInDefaultRouterButInPipedRouter",
			action: spy
		});

		// Act: pipe to second router if not found in first
		aRouter.pipeNotFound(anotherRouter);
		aRouter.resolveUrl("APathNotInDefaultRouterButInPipedRouter");

		// Assert that second router matched the route
		expect(spy).toHaveBeenCalled();
		anotherRouter.stop();
	});

	it("Pipe route to another router", function() {
		// Arrange another router with a route handler
		var anotherRouter = router();
		var spy = jasmine.createSpy("action");
		anotherRouter.addRoute({
			pattern: "/a/b/#c",
			action: spy
		});

		// Act: pipe pattern tp second router
		aRouter.pipeRoute({pattern: "a/#b/#c"}, anotherRouter);
		aRouter.resolveUrl("/a/b/c");

		// Assert that second router matched the route
		expect(spy).toHaveBeenCalled();
		anotherRouter.stop();
	});

	it("back()", function(done) {
		aRouter.stop();
		window.location.hash = ""; // start path
		aRouter.start();

		delayedSteps(
			function() {
				aRouter.redirectTo("a");
			},
			function() {
				aRouter.redirectTo("b");
			},
			function() {
				expect(aRouter.getUrl().toString()).toBe("b");
			},
			function() {
				aRouter.back();
			},
			function() {
				expect(aRouter.getUrl().toString()).toBe("a");
			},
			function() {
				aRouter.back();
			},
			function() {
				expect(aRouter.getUrl().toString()).toBe("");
			},
			function() {
				aRouter.back();
			},
			function() {
				expect(aRouter.getUrl().toString()).toBe("");
			},
			function() {
				aRouter.back("fallback");
			},
			function() {
				expect(aRouter.getUrl().toString()).toBe("fallback");
			},
			done
		);
		jasmine.clock().tick(131);
	});

	it("Expand parameters for named route", function() {
		// Arrange: a named route
		aRouter.addRoute({name: "user", pattern: "/user/#userId"});

		// Act: get path from parameters
		var url = aRouter.expand({
			routeName: "user",
			parameters: {userId: "john", includeDetails: true}
		});

		// Assert that route parameters was injected in url and
		// other parameters was set in query
		expect(url.toString()).toBe("user/john?includeDetails=true");
	});

	it("Expand parameters for empty route", function() {
		// Arrange: empty hash route
		window.location.hash = ""; // start path

		// Act: get path from parameters
		var url = aRouter.expand({
			parameters: {userId: "john", includeDetails: true}
		});

		// Assert that all parameters was set as query parameters
		expect(url.toString()).toBe("?userId=john&includeDetails=true");
	});

	it("Expand parameters for current route", function() {
		// Arrange: a named route
		aRouter.addRoute({
			name: "user",
			pattern: "/user/#userId"
		});

		// and navigate to that route
		aRouter.redirectTo("/user/john", {includeCompanies: true});

		// Act: get path from parameters for current location
		var url = aRouter.expand({
			parameters: {includeDetails: true}
		});

		// Assert that route parameters was injected in url and
		// other parameters was set in query
		expect(url.toString()).toBe("user/john?includeCompanies=true&includeDetails=true");
	});

	it("LinkTo with default parameters", function() {
		// Arrange: a route with non optional parameter #foo
		aRouter.addRoute({
			name: "bar",
			pattern: "/#foo/bar"
		});

		// and a default parameter getter for #foo
		aRouter.setDefaultParameter("foo", function() {
			return "default";
		});

		// Act: link to without mandatory parameter #foo
		var url = aRouter.linkTo("bar");

		// Assert that foo is in second route as well
		expect(url.toString()).toBe("#!/default/bar");
	});

	it("GetParameters from current URL", function() {
		// Arrange: a named route
		aRouter.addRoute({name: "user", pattern: "/user/#userId"});

		// and navigate to that route
		aRouter.redirectTo("/user/john", {includeCompanies: true});

		// Act: get parameters from URL
		var parameters = aRouter.getParameters();

		// Assert that parameters contains both query and URL parameters
		expect(parameters).toEqual({
			userId: "john",
			includeCompanies: "true"
		});
	});

	it("GetParameter", function() {
		// Arrange: a named route
		aRouter.addRoute({name: "user", pattern: "/user/#userId"});

		// and navigate to that route
		aRouter.redirectTo("/user/john", {includeCompanies: true});

		// Act: get parameters from URL
		var userIdParameter = aRouter.getParameter("userId");
		var includeCompaniesParameter = aRouter.getParameter("includeCompanies");
		var unknownParameter = aRouter.getParameter("unknown");

		// Assert that parameters contains both query and URL parameters
		expect(userIdParameter).toBe("john");
		expect(includeCompaniesParameter).toBe("true");
		expect(unknownParameter).toBeUndefined();
	});

	it("setParameters()", function(done) {
		aRouter.stop();
		window.location.hash = ""; // start path
		aRouter.start();

		aRouter.addRoute({pattern: "a/#value"});

		delayedSteps(
			function() {
				aRouter.redirectTo("a/b", {foo: "bar"});
			},
			function() {
				expect(aRouter.getUrl().toString()).toBe("a/b?foo=bar");
			},
			function() {
				aRouter.setParameters({value: "hello"});
			},
			function() {
				expect(aRouter.getUrl().toString()).toBe("a/hello?foo=bar");
			},
			function() {
				aRouter.setParameters({foo: "world"});
			},
			function() {
				expect(aRouter.getUrl().toString()).toBe("a/hello?foo=world");
			},
			function() {
				aRouter.setParameters({extra: "fun"});
			},
			function() {
				expect(aRouter.getUrl().toString()).toBe("a/hello?foo=world&extra=fun");
			},
			done
		);
		jasmine.clock().tick(131);
	});
});
