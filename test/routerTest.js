define(
    ["widgetjs/router", "widgetjs/events"],
    function(router, events) {
		

		// helpers
        function delayedAsyncTest(name, fn, expected) {
			asyncTest(name, function() {
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
				setTimeout(function() {
					next(fn.apply(next, arguments));
				}, 10);
			}
			next();
		}

		var redirectTo = function(path, query) {
			router.router.redirectTo(path, query);
		};

		// setup router
		router.router.start();

		module("router");

		test("Route stream", function() {
			var route = router.route("foo/#bar/?baz");
			var stream = route.stream();
			var next;

			equal(false, stream.atEnd());
			
			next = stream.next();
			equal('foo', next.getValue());
			equal(false, next.isParameter());
			equal(false, next.isOptional());
			equal(false, stream.atEnd());

			next = stream.next();
			equal('bar', next.getValue());
			equal(true, next.isParameter());
			equal(false, next.isOptional());
			equal(false, stream.atEnd());

			next = stream.next();
			equal('baz', next.getValue());
			equal(true, next.isParameter());
			equal(true, next.isOptional());

			equal(true, stream.atEnd());
		});

		test("Route match", function() {
			
			//Expected to match
			equal(true, router.url("hello/world").matchRoute(router.route("hello/world")).matched());
			equal(true, router.url("/hello/world").matchRoute(router.route("#foo/#bar")).matched());
			equal(true, router.url("hello//world").matchRoute(router.route("#foo/#bar")).matched());
			equal(true, router.url("hello/world").matchRoute(router.route("#foo/#bar")).matched());
			equal(true, router.url("hello").matchRoute(router.route("?foo/hello")).matched());
			equal(true, router.url("hello").matchRoute(router.route("?foo/#bar")).matched());
			equal(true, router.url("hello").matchRoute(router.route("?foo/#bar/?blah")).matched());
			equal(true, router.url("hello/hello").matchRoute(router.route("?foo/#bar/?blah")).matched());
			
			//Expected not to match
			equal(false, router.url("hello").matchRoute(router.route("#foo/#bar")).matched());
			equal(false, router.url("hello/world").matchRoute(router.route("foo/#bar")).matched());
			equal(false, router.url("hello/world").matchRoute(router.route("#foo/bar")).matched());
		});

		test("Route parameter bindings", function() {
			var result;
			
			result = router.url("hello/world").matchRoute(router.route("hello/world"));
			equal(0, result.getElements().length);

			
			result = router.url("/hello/world").matchRoute(router.route("#foo/#bar"));
			equal(result.getElements()[0], "foo");
			equal(result.getElements()[1], "bar");

			result = router.url("/hello/world").matchRoute(router.route("?foo/#bar"));
			equal(result.getElements()[0], "foo");
			equal(result.getElements()[1], "bar");

		//	equal(true, router.url("hello//world").matchRoute(router.route("#foo/#bar")).matched());
		//	equal(true, router.url("hello/world").matchRoute(router.route("#foo/#bar")).matched());
		//	equal(true, router.url("hello").matchRoute(router.route("?foo/hello")).matched());
		//	equal(true, router.url("hello").matchRoute(router.route("?foo/#bar")).matched());
		//	equal(true, router.url("hello").matchRoute(router.route("?foo/#bar/?blah")).matched());
		//	equal(true, router.url("hello/hello").matchRoute(router.route("?foo/#bar/?blah")).matched());
		});


		test("singleton router", function() {
			equal(router.router, router.router);
		});

		test("singleton controller", function() {
			equal(router.controller, router.controller);
		});
		
		delayedAsyncTest("basic route", function() {
			router.controller.on('foo', function() {
				ok(true, 'callback executed for route');
				start();
			});

			redirectTo('foo');
		});

		delayedAsyncTest("route with parameter", function() {
			router.controller.on('some/#value', function(value) {
				ok(value === 'thing', 'parameter passed correcly');
				start();
			});
			redirectTo('some/thing');
		});


		delayedAsyncTest("route with multiple parameters", function() {
			router.controller.on('some/#value/#anothervalue', function(value, anothervalue) {
				ok(value === 'thing'&& anothervalue === 'thing2', 'parameters passed correcly');
				start();
			});
			redirectTo('some/thing/thing2');
		});

		delayedAsyncTest("route with query string", function() {
			router.controller.on('querytest/#value', function(value, query) {
				ok(query.foo === 'bar');
				start();
			});
			redirectTo('querytest/thing', {'foo': 'bar'});
		});


		delayedAsyncTest("regexp route", function() {
			router.controller.on('any/.*', function() {
				ok(true, 'regexp route matches correcly');
				start();
			});
			redirectTo('any/thing');
		});

		delayedAsyncTest("regexp route with slashes", function() {
			router.controller.on('blah/.*', function() {
				ok(true, 'regexp route matches correcly');
				start();
			});
			redirectTo('blah/some/thing/bar/baz');
		});

		delayedAsyncTest("notfound event triggered", function() {
			events.at('routing').on('notfound', function() {
				ok(true, 'notfound event triggered correcly');
				this.unbind(); // clean-up: unbound this event
				start();
			});

			redirectTo('APathNotBoundToACallback');
		});

		test("route()", function() {
			window.location.hash = '#!/aPath';
			equal(router.router.path(), 'aPath', 'returns the URL hash fragment minus the hash-bang (#!)');
		});

		test("linkTo()", function() {
			equal(router.router.linkTo('aPath'), '#!/aPath', 'uses the hash-bang "#! convention');
			equal(router.router.linkTo(''), '#!/', 'handles empty path');

			throws(function() { router.router.linkTo(null); }, 'throws error if null');
			throws(function() { router.router.linkTo(undefined); }, 'throws error if undefined');
			throws(function() { router.router.linkTo({}); }, 'throws error if object');

		});

		test("redirectTo()", function() {
			throws(function() { router.router.redirectTo(null); }, 'throws error if null');
			throws(function() { router.router.redirectTo(undefined); }, 'throws error if undefined');
			throws(function() { router.router.redirectTo({}); }, 'throws error if object');

			router.router.redirectTo('aPath');
			equal(window.location.hash, '#!/aPath', 'sets window.location.hash');			 

			router.router.redirectTo('');
			equal(window.location.hash, '#!/', 'redirects empty path');
		});

		asyncTest("back()", function() {
			delayedSteps(
				function() {
					router.router.stop();
					window.location.hash = ''; // start path
					router.router.start();
				},
				function() {
					router.router.redirectTo('a');
				},
				function() {
					router.router.redirectTo('b'); 
				},
				function() {
					equal(router.router.path(), 'b', 'route is last path'); 
				},
				function() { 
					router.router.back();
				},
				function() { 
					equal(router.router.path(), 'a', 'back sets path to previous path'); 
				},
				function() { 
					router.router.back();
				},
				function() { 
					equal(router.router.path(), '', 'back set to start path'); 
				},
				function() { 
					router.router.back();
				},
				function() { 
					equal(router.router.path(), '', 'can not back furter than start'); 
				},
				function() { 
					router.router.back('fallback');
				},
				function() { 
					equal(router.router.path(), 'fallback', 'but can give a fallback path'); 
				},
				function() {
					start();
				}
			);
		});
	}
);
