define(
	["widgetjs/router", "widgetjs/events"],
	function (router, events) {

		// helpers
		function delayedAsyncTest(name, fn, expected) {
			asyncTest(name, function () {
				expect(expected || 1);
				setTimeout(fn, 100 /* Give some time to the router to initialize. */);
			});
		}

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

		function assertUrlMatchRoute(arg, message) {
			ok(router.url(arg.url).matchRoute(router.route(arg.route)).matched(),
				'Url "' + arg.url + '" should match route "' + arg.route + '". ' + 
				(message ? message : ''));
		}

		function assertUrlNotMatchRoute(arg, message) {
			ok(!router.url(arg.url).matchRoute(router.route(arg.route)).matched(),
				'Url "' + arg.url + '" should not match route "' + arg.route + '". ' + 
				(message ? message : ''));
		}

		var redirectTo = function (path, query) {
			router.router.redirectTo(path, query);
		};

		module("router", {
			setup: function() {
				router.router.start();
			}
		});
		

		test("Route match", function () {
			assertUrlMatchRoute({ url: "", route: ""}, 'Empty match.');
			assertUrlMatchRoute({ url: "hello/world", route: "hello/world"}, 'Segments match.');
			assertUrlMatchRoute({ url: "/hello/world", route: "#foo/#bar"}, 'Named parameters match both URL  segments');
			assertUrlMatchRoute({ url: "hello//world", route: "#foo/#bar"}, 'Extra "/" is ignored.');
			assertUrlMatchRoute({ url: "hello/world", route: "#foo/#bar"}, 'Leading slash not required.');
			assertUrlMatchRoute({ url: "hello", route: "?foo/hello"}, 'Strips optional segments til match.');
			assertUrlMatchRoute({ url: "/foo/world/hello", route: "?foo/world/?bar/hello"}, 'Strips optional segments til match.');
			assertUrlMatchRoute({ url: "hello", route: "?foo/#bar"}, 'Strips first optional argument and match second parameter.');
			assertUrlMatchRoute({ url: "hello", route: "?foo/#bar/?blah"}, 'Query parameters not mandatory.');
			assertUrlMatchRoute({ url: "hello/hello", route: "?foo/#bar/?blah"}, 'Handles optional, named and query parameters');

			//Expected not to match
			assertUrlNotMatchRoute({ url: "hello", route: "#foo/#bar"}, 'Two named parameters expected.');
			assertUrlNotMatchRoute({ url: "hello/world", route: "foo/#bar"}, 'First segment "hello" should not match "bar".');
			assertUrlNotMatchRoute({ url: "hello/world", route: "#foo/bar"}, 'Second segment "world" does not match "bar".');
		});

		test("Route parameter bindings", function () {
			var result;

			result = router.url("hello/world").matchRoute(router.route("hello/world"));
			equal(0, result.getValues().length);

			result = router.url("/hello/world").matchRoute(router.route("#foo/#bar"));
			equal(result.getValues()[0], "hello");
			equal(result.getValues()[1], "world");

			result = router.url("/hello/world").matchRoute(router.route("?foo/#bar"));
			equal(result.getValues()[0], "hello");
			equal(result.getValues()[1], "world");

		});

		test("Route parameter bindings 2", function () {
			result = router.url("/hello/world").matchRoute(router.route("#foo/#bar"));
			var props = result.getParameters();

			equal(props.foo, "hello");
			equal(props.bar, "world");

		});

		test("Route parameter bindings 3", function () {
			result = router.url("/hello/world").matchRoute(router.route("?foo/#bar"));
			var props = result.getParameters();

			equal(props.foo, "hello");
			equal(props.bar, "world");
		});


		test("singleton router", function () {
			equal(router.router, router.router);
		});

		test("singleton controller", function () {
			equal(router.controller, router.controller);
		});

		delayedAsyncTest("basic route", function () {
			router.controller.on('foo', function () {
				ok(true, 'callback executed for route');
				this.unbind(); // clean-up: unbound this event
				start();
			});

			redirectTo('foo');
		});

		delayedAsyncTest("route with parameter", function () {
			router.controller.on('some/#value', function (value) {
				ok(value === 'thing', 'parameter passed correcly');
				this.unbind(); // clean-up: unbound this event
				start();
			});
			redirectTo('some/thing');
		});

		delayedAsyncTest("route with multiple parameters", function () {
			router.controller.on('some/#value/#anothervalue', function (value, anothervalue) {
				ok(value === 'thing' && anothervalue === 'thing2', 'parameters passed correcly');
				this.unbind(); // clean-up: unbound this event
				start();
			});
			redirectTo('some/thing/thing2');
		});

		delayedAsyncTest("route with query string", function () {
			router.controller.on('querytest/#value', function (value, query) {
				ok(query.foo === 'bar');
				this.unbind(); // clean-up: unbound this event
				start();
			});
			redirectTo('querytest/thing', {'foo': 'bar'});
		});

		delayedAsyncTest("notfound event triggered", function () {
			events.at('routing').on('notfound', function () {
				ok(true, 'notfound event triggered correcly');
				this.unbind(); // clean-up: unbound this event
				start();
			});

			redirectTo('APathNotBoundToACallback');
		});

		test("route()", function () {
			window.location.hash = '#!/aPath';
			equal(router.router.getPath(), 'aPath', 'returns the URL hash fragment minus the hash-bang (#!)');
		});

		test("linkTo()", function () {
			equal(router.router.linkTo('aPath'), '#!/aPath', 'uses the hash-bang "#! convention');
			equal(router.router.linkTo(''), '#!/', 'handles empty path');

			throws(function () { router.router.linkTo(null); }, 'throws error if null');
			throws(function () { router.router.linkTo(undefined); }, 'throws error if undefined');
			throws(function () { router.router.linkTo({}); }, 'throws error if object');

		});

		test("redirectTo()", function () {
			throws(function () { router.router.redirectTo(null); }, 'throws error if null');
			throws(function () { router.router.redirectTo(undefined); }, 'throws error if undefined');
			throws(function () { router.router.redirectTo({}); }, 'throws error if object');

			router.router.redirectTo('aPath');
			equal(window.location.hash, '#!/aPath', 'sets window.location.hash');

			router.router.redirectTo('');
			equal(window.location.hash, '#!/', 'redirects empty path');
		});

		asyncTest("back()", function () {
			delayedSteps(
				function () {
					router.router.stop();
					window.location.hash = ''; // start path
					router.router.start();
				},
				function () {
					router.router.redirectTo('a');
				},
				function () {
					router.router.redirectTo('b');
				},
				function () {
					equal(router.router.getPath(), 'b', 'route is last path');
				},
				function () {
					router.router.back();
				},
				function () {
					equal(router.router.getPath(), 'a', 'back sets path to previous path');
				},
				function () {
					router.router.back();
				},
				function () {
					equal(router.router.getPath(), '', 'back set to start path');
				},
				function () {
					router.router.back();
				},
				function () {
					equal(router.router.getPath(), '', 'can not back furter than start');
				},
				function () {
					router.router.back('fallback');
				},
				function () {
					equal(router.router.getPath(), 'fallback', 'but can give a fallback path');
				},
				function () {
					start();
				}
			);
		});
	}
);
