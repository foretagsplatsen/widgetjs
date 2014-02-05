define(
	["widgetjs/router", "widgetjs/events"],
	function (router, events) {

		// Helpers

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
				}, 30);
			}

			next();
		}

		var redirectTo = function (path, query) {
			router.router.redirectTo(path, query);
		};


		module("deprecated router", {
			setup: function() {
				router.router.start();
			}
		});

		test("singleton router", function () {
			equal(router.router, router.router);
		});

		test("singleton controller", function () {
			equal(router.controller, router.controller);
		});

		delayedAsyncTest("Executes route callback", function () {
			expect(1);

			router.controller.on('foo', function () {
				ok(true, 'callback executed for route');
				this.unbind(); // clean-up: unbound this event
				start();
			});

			redirectTo('foo');
		});

		delayedAsyncTest("Pass parameter values to callback", function () {
			expect(1);

			router.controller.on('some/#value/#anothervalue', function (value, anothervalue) {
				ok(value === 'thing' && anothervalue === 'thing2', 'parameters passed in same order as defined');
				this.unbind(); // clean-up: unbound this event
				start();
			});

			redirectTo('some/thing/thing2');
		});

		delayedAsyncTest("Pass query as last argument to callback", function () {
			expect(1);

			router.controller.on('querytest/#value', function (value, query) {
				ok(query.foo === 'bar');
				this.unbind(); // clean-up: unbound this event
				start();
			});

			redirectTo('querytest/thing', {'foo': 'bar'});
		});

		test("Keeps the current path", function () {
			window.location.hash = '#!/aPath';
			equal(router.router.getPath(), 'aPath', 'URL hash fragment minus the hash-bang (#!)');
		});

		test("linkTo()", function () {
			equal(router.router.linkTo('aPath'), '#!/aPath', 'Hash-bang "#!" convention (hiden in hash.js)');
			equal(router.router.linkTo(''), '#!/', 'handles empty path');
		});

		test("redirectTo()", function () {
			router.router.redirectTo('aPath');
			equal(window.location.hash, '#!/aPath', 'sets window.location.hash');

			router.router.redirectTo('');
			equal(window.location.hash, '#!/', 'redirects empty path');
		});

		asyncTest("back()", function () {
			expect(5);

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
