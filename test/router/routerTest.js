define(
	["widgetjs/router/router"],
	function (router) {

		function delayedSteps() {
			var steps = Array.prototype.slice.call(arguments);

			function next() {
				if (steps.length === 0) {
					return;
				}
				var fn = steps.shift();
				setTimeout(function () {
					next(fn.apply(next, arguments));
				}, 10);
			}

			next();
		}

		var my, aRouter;

		module("router", {
			setup: function() {
				window.location.hash = '';

				my = {};
				aRouter = router({}, my);
			},
			teardown: function() {
				window.location.hash = '';
				aRouter.stop();
				my = null;
				aRouter = null;
			}
		});

		test("Router defaults", function () {
			// Assert that defaults are correct
			equal(my.routeTable.length, 0, 'routetable is empty');
			equal(my.lastMatch, undefined, 'no route matched');
		});

		test("Router options", function () {
			// Arrange a router with options set
			var anotherMy = {};
			var anotherRouter = router({
				locationHandler: { isFake: true, on: function() {} }
			}, anotherMy);

			// Assert that options where applied
			equal(anotherMy.location.isFake, true, 'location handler from options');
		});

		test("Add route", function () {
			// Act: add a route
			var route = aRouter.addRoute({ pattern: '/users/' });

			// Assert that route was added to route table
			equal(my.routeTable.length, 1, 'route was added to routetable');
			equal(my.routeTable[0], route, 'equals route created');
		});


		test("Remove route", function () {
			// Act: add and remove route
			var route = aRouter.addRoute({pattern: '/users/'});
			aRouter.removeRoute(route);

			// Assert that route was removed from route table
			equal(my.routeTable.length, 0, 'route was removed from routetable');
		});


        test("Named routes", function () {
            // Arrange: a named route
            var route = aRouter.addRoute({name: 'users', pattern: '/users/'});

            // Act: lookup route by name
            var namedRoute = aRouter.getRouteByName('users');

            // Assert that route is found
            equal(namedRoute, route, 'same route');
        });

		test("Add routes with priority", function () {
			// Act: add routes with different priorities
			var invoiceRoute = aRouter.addRoute({pattern: '/invoice/'});
			var ticketRoute = aRouter.addRoute({pattern: '/ticket/'});
			var customerRoute = aRouter.addRoute({pattern: '/customer/', priority: 2});
			var orderRoute = aRouter.addRoute({pattern: '/order/', priority: 2});
			var userRoute = aRouter.addRoute({pattern: '/user/', priority: 1});

			// Assert that route was added to route table in correct order
			equal(my.routeTable.length, 5, 'all added to routetable');
			equal(my.routeTable[0], userRoute, 'lowest priority first');
			equal(my.routeTable[2], orderRoute, 'registration order if same priority');
			equal(my.routeTable[3], invoiceRoute, 'routes without priority last');
			equal(my.routeTable[4], ticketRoute, 'registration order if no priority');
		});

		asyncTest("resolveUrl executes route callback on match", 1, function () {
			// Arrange: setup a route
			var userRoute = aRouter.addRoute({pattern: '/user/'});
			userRoute.on('matched', function() {
				start(); // execute asserts
				this.unbind(); // clean-up
			});

			// Act: resolve two different URL:s but only first should match
			aRouter.resolveUrl('/user/');
			aRouter.resolveUrl('/order/');

			// Assert that callback was executed (start was called)
			ok(true, 'callback executed for route');
		});

		asyncTest("resolveUrl triggers resolveUrl event", 1, function () {
			// listen for 'resolveUrl event' on router
			aRouter.on('resolveUrl', function(url) {
				start(); // execute asserts
				this.unbind(); // clean-up
			});

			// Act: resolve any URL
			aRouter.resolveUrl('/user/');

			// Assert that callback was 'resolveUrl event' executed
			ok(true, 'callback executed');
		});

		asyncTest("resolveUrl triggers routeMatched event", 2, function () {
			// Arrange: setup a route
			var userRoute = aRouter.addRoute({pattern: '/user/'});

			// listen for 'matched event' on router
			aRouter.on('routeMatched', function(result) {
				// Assert that callback was executed
				ok(result, 'callback executed with result parameter');
				equal(result.getRoute(), userRoute, 'matched route is correct');

				start(); // execute asserts
				this.unbind(); // clean-up
			});

			// Act: resolve URL that match
			aRouter.resolveUrl('/user/');
		});

		asyncTest("resolveUrl triggers routeNotFound event", 2, function () {
			// Arrange: setup no routes but
			// a lister for 'notFound event'
			aRouter.on('routeNotFound', function(url) {
				// Assert that callback was executed
				ok(url, 'callback executed with url parameter');
				equal(url, '/user/', 'url is correct');

				start(); // execute asserts
				this.unbind(); // clean-up
			});

			// Act: resolve URL:s that should not match
			aRouter.resolveUrl('/user/');
		});

		asyncTest("resolveUrl executes action on match", 1, function () {
			// Arrange: setup a route
			var userRoute = aRouter.addRoute({
				pattern: '/user/',
				action: function() {
					start(); // execute asserts
					this.unbind(); // clean-up
				}
			});

			// Act: resolve a URL that match pattern
			aRouter.resolveUrl('/user/');

			// Assert that callback was executed (start was called)
			ok(true, 'action was executed once');
		});

		asyncTest("resolveUrl pass values to action", 1, function () {
			// Arrange a route that have two mandatory parameters
			var userRoute = aRouter.addRoute({
				pattern: '/user/#userid/order/#orderid',
				action: function(userid, orderid) {
					ok(userid === 'john' && orderid === '1', 'parameters passed in same order as defined');
					start(); // execute asserts
					this.unbind(); // clean-up
				}
			});

			// Act: resolve a URL that match pattern
			aRouter.resolveUrl('/user/john/order/1');
		});

		asyncTest("resolveUrl pass optional values to action", 2, function () {
			// Arrange a route that have two mandatory parameters
			var userRoute = aRouter.addRoute({
				pattern: '/user/?userid/order/?orderid',
				action: function(userid, orderid) {
					equal(userid, undefined, 'optional parameters without values is undefined');
					equal(orderid, '1', 'optional parameters with values get value');
					start(); // execute asserts
					this.unbind(); // clean-up
				}
			});

			// Act: resolve a URL that match pattern
			aRouter.resolveUrl('/user/order/1');
		});

		asyncTest("resolveUrl pass optional value defaults to action", 2, function () {
			// Arrange a route that have two optional parameters
			//  with defaukts
			var userRoute = aRouter.addRoute({
				pattern: '/user/?userid/order/?orderid',
				defaults: {
					userid: 'bengan',
					orderid: 'skor'
				},
				action: function(userid, orderid) {
					equal(userid, 'bengan', 'optional parameters get default value');
					equal(orderid, '1', 'optional parameters with values get value');
					start(); // execute asserts
					this.unbind(); // clean-up
				}
			});

			// Act: resolve a URL that match pattern
			aRouter.resolveUrl('/user/order/1');
		});

		asyncTest("resolveUrl pass query as last argument to action", 3, function () {
			// Arrange a route that have one parameter
			var userRoute = aRouter.addRoute({
				pattern: '/user/#userid/order',
				action: function(userid, query) {
					// Assert: that parameters and query was passed ok
					equal(userid, 'john', 'parameter passed ok');
					equal(query.filter, 'open', 'first query parameter passed ok');
					equal(query.orderBy, 'date', 'second query parameter passed ok');
					start(); // execute asserts
					this.unbind(); // clean-up
				}
			});

			// Act: resolve a URL that match pattern
			aRouter.resolveUrl('/user/john/order/?filter=open&orderBy=date');
		});

		asyncTest("resolveUrl continues if fallThrough", 2, function () {
			// Arrange a 3 routes, where first have fallThrough
			// set and the two other have not

			aRouter.addRoute({
				fallThrough: true,
				pattern: '/user/',
				action: function() {
					ok(true, 'executes fallThrough route');
					this.unbind(); // clean-up
				}
			});

			aRouter.addRoute({
				pattern: '/user/',
				action: function() {
					ok(true, 'and route after fallThrough route');
					start(); // execute asserts
					this.unbind(); // clean-up
				}
			});

			aRouter.addRoute({
				pattern: '/user/',
				action: function() {
					ok(false, 'but not after that route');
				}
			});

			// Act: resolve a URL that match pattern
			aRouter.resolveUrl('/user/');
		});

		asyncTest("Add route with constraints", function () {
			expect(1); // only 1 match

			// Arrange a route with constraints
			var userRoute = aRouter.addRoute({
				pattern: '/user/#name/',
				constraints: {
					name: ['nicolas', 'Mikael'],
				},
				action: function(name) {
					ok(true, 'Route got name ' + name);
				}
			});

			// Act: resolve one URL that match constraint and two more
			aRouter.resolveUrl('/user/nicolas');
			aRouter.resolveUrl('/user/john');
			aRouter.resolveUrl('/user/james');
			start();

			// Assert: only 1 match
		});

		test("getUrl returns current location", function () {
			// Act: change hash and get url
			window.location.hash = '#!/aPath';
			var currentUrl = aRouter.getUrl();

			// Assert correct url
			equal(currentUrl.toString(), 'aPath', 'url is current location');
		});


		test("linkTo() creates links for href", function () {
			equal(aRouter.linkTo('aPath'), '#!/aPath', 'Hash-bang "#!" convention (hash.js)');
			equal(aRouter.linkTo(''), '#!/', 'handles empty path');

			throws(function () { aRouter.linkTo(null); }, 'throws error if null');
			throws(function () { aRouterlinkTo(undefined); }, 'throws error if undefined');
			throws(function () { aRouter.linkTo({}); }, 'throws error if object');
		});

		test("redirectTo() changes the current location to URL", function () {
			throws(function () { aRouter.redirectTo(null); }, 'throws error if null');
			throws(function () { aRouter.redirectTo(undefined); }, 'throws error if undefined');
			throws(function () { aRouter.redirectTo({}); }, 'throws error if object');

			aRouter.redirectTo('aPath');
			equal(window.location.hash, '#!/aPath', 'sets window.location.hash');

			aRouter.redirectTo('');
			equal(window.location.hash, '#!/', 'redirects empty path');
		});

		asyncTest("Pipe notfound to another router", 1, function () {
			// Arrange another router with a route handler
			var anotherRouter = router();
			anotherRouter.addRoute({
				pattern: 'APathNotInDefaultRouterButInPipedRouter',
				action: function() {
					start();
					this.unbind(); // clean-up: unbound this event
				}
			});

			// Act: pipe to second router if not found in first
			aRouter.pipeNotFound(anotherRouter);
			aRouter.resolveUrl('APathNotInDefaultRouterButInPipedRouter');

			// Assert that second router matched the route
			ok(true, 'callback executed for route');
		});

		asyncTest("Pipe route to another router", 1, function () {
			// Arrange another router with a route handler
			var anotherRouter = router();
			anotherRouter.addRoute({
				pattern: '/a/b/#c',
				action: function() {
					start();
					this.unbind(); // clean-up: unbound this event
				}
			});

			// Act: pipe pattern tp second router
			aRouter.pipeRoute({pattern: 'a/#b/#c'}, anotherRouter);
			aRouter.resolveUrl('/a/b/c');

			// Assert that second router matched the route
			ok(true, 'callback executed for route');
		});

		asyncTest("back()", function () {
			aRouter.stop();
			window.location.hash = ''; // start path
			aRouter.start();

			expect(5);

			delayedSteps(
				function () {
					aRouter.redirectTo('a');
				},
				function () {
					aRouter.redirectTo('b');
				},
				function () {
					equal(aRouter.getUrl().toString(), 'b', 'route is last URL');
				},
				function () {
					aRouter.back();
				},
				function () {
					equal(aRouter.getUrl().toString(), 'a', 'back sets path to previous path');
				},
				function () {
					aRouter.back();
				},
				function () {
					equal(aRouter.getUrl().toString(), '', 'back set to start path');
				},
				function () {
					aRouter.back();
				},
				function () {
					equal(aRouter.getUrl().toString(), '', 'can not back furter than start');
				},
				function () {
					aRouter.back('fallback');
				},
				function () {
					equal(aRouter.getUrl().toString(), 'fallback', 'but can give a fallback path');
				},
				function () {
					start();
				}
			);
		});

        test("Update URL for named route", function () {
            // Arrange: a named route
            aRouter.addRoute({name: 'user', pattern: '/user/#userId'});

            // Act: get URL from parameters
            var url = aRouter.getUpdateUrl('user', { userId: 'john', includeDetails : true});

            // Assert that URL parameters was injected in url and
            // other parameters was set in query
            equal(url.toString(), 'user/john?includeDetails=true', 'URL match pattern and data');
        });

        test("Update URL for empty route", function () {
            // Arrange: empty hash route
            window.location.hash = ''; // start path

            // Act: get URL from parameters
            var url = aRouter.getUpdateUrl({ userId: 'john', includeDetails : true});

            // Assert that all parameters was set as query parameters
            equal(url.toString(), '?userId=john&includeDetails=true', 'URL match pattern and data');
        });

        asyncTest("Update URL for named route", 1, function () {
            // Arrange: a named route
            aRouter.addRoute({
                name: 'user',
                pattern: '/user/#userId',
                action: function() {
                    start();
                    this.unbind(); // clean-up: unbound this event
                }
            });

            // and navigate to that route
            aRouter.redirectTo('/user/john', {includeCompanies : true});

            // Act: get URL from parameters
            var url = aRouter.getUpdateUrl({ includeDetails : true});

            // Assert that URL parameters was injected in url and
            // other parameters was set in query
            equal(url.toString(), 'user/john?includeDetails=true&includeCompanies=true', 'URL match pattern and data');
        });

        asyncTest("updatePath()", function () {
			aRouter.stop();
			window.location.hash = ''; // start path
			aRouter.start();

			aRouter.addRoute({pattern: 'a/#value'});

			expect(4);

			delayedSteps(
				function () {
					aRouter.redirectTo('a/b', {foo : 'bar'});
				},
				function () {
					equal(aRouter.getUrl().toString(), 'a/b?foo=bar', 'parameter and query set');
				},
				function () {
					aRouter.updateUrl({value : 'hello'});
				},
				function () {
					equal(aRouter.getUrl().toString(), 'a/hello?foo=bar', 'parameter updated');
				},
				function () {
					aRouter.updateUrl({foo : 'world'});
				},
				function () {
					equal(aRouter.getUrl().toString(), 'a/hello?foo=world', 'query updated');
				},
				function () {
					aRouter.updateUrl({extra : 'fun'});
				},
				function () {
					equal(aRouter.getUrl().toString(), 'a/hello?extra=fun&foo=world', 'extra parameter added');
				},
				function () {
					start();
				}
			);
		});

	}
);
