define(
	["widgetjs/router/router", "chai"],
	function(router, chai) {

        var assert = chai.assert;

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

		var my, aRouter;

		suite("router");

        beforeEach(function() {
            window.location.hash = "";

            my = {};
            aRouter = router({}, my);
        });

        afterEach(function() {
            aRouter.stop();
            aRouter.clear();
		});

		test("Router defaults", function() {
			// Assert that defaults are correct
			assert.equal(my.routeTable.length, 0, "routetable is empty");
			assert.equal(my.lastMatch, undefined, "no route matched");
		});

		test("Router options", function() {
			// Arrange a router with options set
			var anotherMy = {};
			var anotherRouter = router({
				locationHandler: { isFake: true, onChanged: function() {} }
			}, anotherMy);

			// Assert that options where applied
			assert.equal(anotherMy.location.isFake, true, "location handler from options");
		});

		test("Add route", function() {
			// Act: add a route
			var route = aRouter.addRoute({ pattern: "/users/" });

			// Assert that route was added to route table
			assert.equal(my.routeTable.length, 1, "route was added to routetable");
			assert.equal(my.routeTable[0], route, "equals route created");
		});


		test("Remove route", function() {
			// Act: add and remove route
			var route = aRouter.addRoute({pattern: "/users/"});
			aRouter.removeRoute(route);

			// Assert that route was removed from route table
			assert.equal(my.routeTable.length, 0, "route was removed from routetable");
		});


        test("Named routes", function() {
            // Arrange: a named route
            var route = aRouter.addRoute({name: "users", pattern: "/users/"});

            // Act: lookup route by name
            var namedRoute = aRouter.getRouteByName("users");

            // Assert that route is found
            assert.equal(namedRoute, route, "same route");
        });

		test("Add routes with priority", function() {
			// Act: add routes with different priorities
			var invoiceRoute = aRouter.addRoute({pattern: "/invoice/"});
			var ticketRoute = aRouter.addRoute({pattern: "/ticket/"});
			var customerRoute = aRouter.addRoute({pattern: "/customer/", priority: 2});
			var orderRoute = aRouter.addRoute({pattern: "/order/", priority: 2});
			var userRoute = aRouter.addRoute({pattern: "/user/", priority: 1});

			// Assert that route was added to route table in correct order
			assert.equal(my.routeTable.length, 5, "all added to routetable");
			assert.equal(my.routeTable[0], userRoute, "lowest priority first");
			assert.equal(my.routeTable[2], orderRoute, "registration order if same priority");
			assert.equal(my.routeTable[3], invoiceRoute, "routes without priority last");
			assert.equal(my.routeTable[4], ticketRoute, "registration order if no priority");
		});

		test("resolveUrl executes route callback on match", function(start) {
			// Arrange: setup a route
			var userRoute = aRouter.addRoute({pattern: "/user/"});
			userRoute.on("matched", function() {
				start(); // execute asserts
				this.unbind(); // clean-up
			});

			// Act: resolve two different URL:s but only first should match
			aRouter.resolveUrl("/user/");
			aRouter.resolveUrl("/order/");

			// Assert that callback was executed (start was called)
			assert.ok(true, "callback executed for route");
		});

		test("resolveUrl triggers resolveUrl event", function(start) {
			// listen for "resolveUrl event" on router
			aRouter.on("resolveUrl", function(url) {
				start(); // execute asserts
				this.unbind(); // clean-up
			});

			// Act: resolve any URL
			aRouter.resolveUrl("/user/");

			// Assert that callback was "resolveUrl event" executed
			assert.ok(true, "callback executed");
		});

		test("resolveUrl triggers routeMatched event", function(start) {
			// Arrange: setup a route
			var userRoute = aRouter.addRoute({pattern: "/user/"});

			// listen for "matched event" on router
			aRouter.on("routeMatched", function(result) {
				// Assert that callback was executed
				assert.ok(result, "callback executed with result parameter");
				assert.equal(result.getRoute(), userRoute, "matched route is correct");

				start(); // execute asserts
				this.unbind(); // clean-up
			});

			// Act: resolve URL that match
			aRouter.resolveUrl("/user/");
		});

		test("resolveUrl triggers routeNotFound event", function(start) {
			// Arrange: setup no routes but
			// a lister for "notFound event"
			aRouter.on("routeNotFound", function(url) {
				// Assert that callback was executed
				assert.ok(url, "callback executed with url parameter");
				assert.equal(url, "/user/", "url is correct");

				start(); // execute asserts
				this.unbind(); // clean-up
			});

			// Act: resolve URL:s that should not match
			aRouter.resolveUrl("/user/");
		});

		test("resolveUrl executes action on match", function(start) {
			// Arrange: setup a route
			var userRoute = aRouter.addRoute({
				pattern: "/user/",
				action: function() {
					start(); // execute asserts
					this.unbind(); // clean-up
				}
			});

			// Act: resolve a URL that match pattern
			aRouter.resolveUrl("/user/");

			// Assert that callback was executed (start was called)
			assert.ok(true, "action was executed once");
		});

		test("resolveUrl pass values to action", function(start) {
			// Arrange a route that have two mandatory parameters
			aRouter.addRoute({
				pattern: "/user/#userid/order/#orderid",
				action: function(userid, orderid) {
					assert.ok(userid === "john" && orderid === "1", "parameters passed in same order as defined");
					start(); // execute asserts
					this.unbind(); // clean-up
				}
			});

			// Act: resolve a URL that match pattern
			aRouter.resolveUrl("/user/john/order/1");
		});

		test("resolveUrl pass optional values to action", function(start) {
			// Arrange a route that have two mandatory parameters
			aRouter.addRoute({
				pattern: "/user/?userid/order/?orderid",
				action: function(userid, orderid) {
					assert.equal(userid, undefined, "optional parameters without values is undefined");
					assert.equal(orderid, "1", "optional parameters with values get value");
					start(); // execute asserts
					this.unbind(); // clean-up
				}
			});

			// Act: resolve a URL that match pattern
			aRouter.resolveUrl("/user/order/1");
		});

		test("resolveUrl pass optional value defaults to action", function(start) {
			// Arrange a route that have two optional parameters
			//  with defaukts
			var userRoute = aRouter.addRoute({
				pattern: "/user/?userid/order/?orderid",
				defaults: {
					userid: "bengan",
					orderid: "skor"
				},
				action: function(userid, orderid) {
					assert.equal(userid, "bengan", "optional parameters get default value");
					assert.equal(orderid, "1", "optional parameters with values get value");
					start(); // execute asserts
					this.unbind(); // clean-up
				}
			});

			// Act: resolve a URL that match pattern
			aRouter.resolveUrl("/user/order/1");
		});

		test("resolveUrl pass query as last argument to action", function(start) {
			// Arrange a route that have one parameter
			var userRoute = aRouter.addRoute({
				pattern: "/user/#userid/order",
				action: function(userid, query) {
					// Assert: that parameters and query was passed ok
					assert.equal(userid, "john", "parameter passed ok");
					assert.equal(query.filter, "open", "first query parameter passed ok");
					assert.equal(query.orderBy, "date", "second query parameter passed ok");
					start(); // execute asserts
					this.unbind(); // clean-up
				}
			});

			// Act: resolve a URL that match pattern
			aRouter.resolveUrl("/user/john/order/?filter=open&orderBy=date");
		});

		test("resolveUrl continues if fallThrough", function(start) {
			// Arrange a 3 routes, where first have fallThrough
			// set and the two other have not

			aRouter.addRoute({
				fallThrough: true,
				pattern: "/user/",
				action: function() {
					assert.ok(true, "executes fallThrough route");
					this.unbind(); // clean-up
				}
			});

			aRouter.addRoute({
				pattern: "/user/",
				action: function() {
					assert.ok(true, "and route after fallThrough route");
					start(); // execute asserts
					this.unbind(); // clean-up
				}
			});

			aRouter.addRoute({
				pattern: "/user/",
				action: function() {
					assert.ok(false, "but not after that route");
                    this.unbind(); // clean-up
				}
			});

			// Act: resolve a URL that match pattern
			aRouter.resolveUrl("/user/");
		});

		test("Add route with constraints", function(start) {
			// Arrange a route with constraints
			var userRoute = aRouter.addRoute({
				pattern: "/user/#name/",
				constraints: {
					name: ["nicolas", "Mikael"]
				},
				action: function(name) {
					assert.ok(true, "Route got name " + name);
                    start();
                    this.unbind(); // clean-up
				}
			});

			// Act: resolve one URL that match constraint and two more
			aRouter.resolveUrl("/user/nicolas");
			aRouter.resolveUrl("/user/john");
			aRouter.resolveUrl("/user/james");
		});

		test("getUrl returns current location", function() {
			// Act: change hash and get url
			window.location.hash = "#!/aPath";
			var currentUrl = aRouter.getUrl();

			// Assert correct url
			assert.equal(currentUrl.toString(), "aPath", "url is current location");
		});

		test("linkTo() creates links for href", function() {
			assert.equal(aRouter.linkTo("aPath"), "#!/aPath", "Hash-bang \"#!\" convention (hash.js)");
			assert.equal(aRouter.linkTo(""), "#!/", "handles empty path");
		});

		test("redirectTo() changes the current location to URL", function() {
			aRouter.redirectTo("aPath");
			assert.equal(window.location.hash, "#!/aPath", "sets window.location.hash");

			aRouter.redirectTo("");
			assert.equal(window.location.hash, "#!/", "redirects empty path");
		});

		test("Pipe notfound to another router", function(start) {
			// Arrange another router with a route handler
			var anotherRouter = router();
			anotherRouter.addRoute({
				pattern: "APathNotInDefaultRouterButInPipedRouter",
				action: function() {
					start();
					this.unbind(); // clean-up: unbound this event
				}
			});

			// Act: pipe to second router if not found in first
			aRouter.pipeNotFound(anotherRouter);
			aRouter.resolveUrl("APathNotInDefaultRouterButInPipedRouter");

			// Assert that second router matched the route
			assert.ok(true, "callback executed for route");
            anotherRouter.stop();
		});

		test("Pipe route to another router", function(start) {
			// Arrange another router with a route handler
			var anotherRouter = router();
			anotherRouter.addRoute({
				pattern: "/a/b/#c",
				action: function() {
					start();
					this.unbind(); // clean-up: unbound this event
				}
			});

			// Act: pipe pattern tp second router
			aRouter.pipeRoute({pattern: "a/#b/#c"}, anotherRouter);
			aRouter.resolveUrl("/a/b/c");

			// Assert that second router matched the route
			assert.ok(true, "callback executed for route");
            anotherRouter.stop();
		});

		test("back()", function(start) {
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
					assert.equal(aRouter.getUrl().toString(), "b", "route is last URL");
				},
				function() {
					aRouter.back();
				},
				function() {
					assert.equal(aRouter.getUrl().toString(), "a", "back sets path to previous path");
				},
				function() {
					aRouter.back();
				},
				function() {
					assert.equal(aRouter.getUrl().toString(), "", "back set to start path");
				},
				function() {
					aRouter.back();
				},
				function() {
					assert.equal(aRouter.getUrl().toString(), "", "can not back furter than start");
				},
				function() {
					aRouter.back("fallback");
				},
				function() {
					assert.equal(aRouter.getUrl().toString(), "fallback", "but can give a fallback path");
				},
				function() {
					start();
				}
			);
		});

        test("Expand parameters for named route", function() {
            // Arrange: a named route
            aRouter.addRoute({name: "user", pattern: "/user/#userId"});

            // Act: get path from parameters
            var url = aRouter.expand({
				routeName: "user",
				parameters: {userId: "john", includeDetails: true}
			});

            // Assert that route parameters was injected in url and
            // other parameters was set in query
            assert.equal(url.toString(), "user/john?includeDetails=true", "URL match pattern and data");
        });

        test("Expand parameters for empty route", function() {
            // Arrange: empty hash route
            window.location.hash = ""; // start path

            // Act: get path from parameters
            var url = aRouter.expand({
				parameters: { userId: "john", includeDetails : true}
			});

            // Assert that all parameters was set as query parameters
            assert.equal(url.toString(), "?userId=john&includeDetails=true", "URL match pattern and data");
        });

        test("Expand parameters for current route", function() {
            // Arrange: a named route
            aRouter.addRoute({
                name: "user",
                pattern: "/user/#userId"
            });

            // and navigate to that route
            aRouter.redirectTo("/user/john", { includeCompanies : true});

            // Act: get path from parameters for current location
            var url = aRouter.expand({
				parameters: { includeDetails : true}
			});

            // Assert that route parameters was injected in url and
            // other parameters was set in query
            assert.equal(url.toString(), "user/john?includeCompanies=true&includeDetails=true", "URL match pattern and data");
        });

		test("LinkTo with default parameters", function() {
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
			assert.equal(url.toString(), "#!/default/bar", "Parameter value from default parameters used.");
		});

        test("GetParameters from current URL", function() {
            // Arrange: a named route
            aRouter.addRoute({name: "user", pattern: "/user/#userId"});

            // and navigate to that route
            aRouter.redirectTo("/user/john", {includeCompanies : true});

            // Act: get parameters from URL
            var parameters = aRouter.getParameters();

            // Assert that parameters contains both query and URL parameters
            assert.deepEqual(parameters, {userId : "john", includeCompanies: "true"}, "Parameters contains query and URL parameters");
        });

        test("GetParameter", function() {
            // Arrange: a named route
            aRouter.addRoute({name: "user", pattern: "/user/#userId"});

            // and navigate to that route
            aRouter.redirectTo("/user/john", {includeCompanies : true});

            // Act: get parameters from URL
            var userIdParameter = aRouter.getParameter("userId");
            var includeCompaniesParameter = aRouter.getParameter("includeCompanies");
            var unknownParameter = aRouter.getParameter("unknown");

            // Assert that parameters contains both query and URL parameters
            assert.equal(userIdParameter, "john", "URL parameter match");
            assert.equal(includeCompaniesParameter, "true", "Query parameter match");
            assert.equal(unknownParameter, null, "Unknown parameter is null");
        });

        test("setParameters()", function(start) {
			aRouter.stop();
			window.location.hash = ""; // start path
			aRouter.start();

			aRouter.addRoute({pattern: "a/#value"});

			delayedSteps(
				function() {
					aRouter.redirectTo("a/b", {foo : "bar"});
				},
				function() {
					assert.equal(aRouter.getUrl().toString(), "a/b?foo=bar", "parameter and query set");
				},
				function() {
					aRouter.setParameters({value : "hello"});
				},
				function() {
					assert.equal(aRouter.getUrl().toString(), "a/hello?foo=bar", "parameter updated");
				},
				function() {
					aRouter.setParameters({foo : "world"});
				},
				function() {
					assert.equal(aRouter.getUrl().toString(), "a/hello?foo=world", "query updated");
				},
				function() {
					aRouter.setParameters({extra : "fun"});
				},
				function() {
					assert.equal(aRouter.getUrl().toString(), "a/hello?foo=world&extra=fun", "extra parameter added");
				},
				function() {
					start();
				}
			);
		});
	}
);
