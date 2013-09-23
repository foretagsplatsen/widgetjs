define(
	["widgetjs/router"],
	function(router) {
		function assertMatch(url, route, message) {
			var assertMessage = (message ? message + '. ': '') + 'Url "' + url + '" should match route "' + route + '". ';
			ok(router.url(url).matchRoute(router.route(route)).matched(), assertMessage);
		}

		function assertNoMatch(url, route, message) {
			var assertMessage = (message ? message + '. ' : '') + 'Url "' + url + '" should not match route "' + route + '". ';
			ok(!router.url(url).matchRoute(router.route(route)).matched(), assertMessage);
		}

		module("route");

		// MATCH tests

		test("Empty route", function() {
			var route = '';

			assertMatch('', route, 'Match empty');
			assertMatch('/', route, 'Match slash');
			assertMatch('//',route, 'Ignore extra slash');
			assertMatch("?a=1&b=2",route, 'Ignore query');

			assertNoMatch('value',route, "Don't match values");
		});

		test("Slash route", function() {
			var route = '/';

			assertMatch('', route, 'Match empty');
			assertMatch('/', route, 'Match slash');
			assertMatch('//',route, 'Ignore extra slash');
			assertMatch("?a=1&b=2",route, 'Ignore query');


			assertNoMatch('value',route, "Don't match values");
		});

		test("Static route", function() {
			var route = 'a/static/path';

			assertMatch("/a/static/path",route, 'Match if all segments are equal');
			assertMatch("a/static/path",route, 'Ignore leading slash');
			assertMatch("/a/static/path/",route, 'Ignore trailing slash');
			assertMatch("/a//static///path/",route, 'Ignore extra slash');
			assertMatch("/a/static/path?a=1&b=2",route, 'Ignore query');

			assertNoMatch('', route, "Don't match empty");
			assertNoMatch('a/static/path/and/some/more',route, "Don't match if more segments than in route.");
		});

		test("Route ignore trailing slash on pattern", function() {
			var route = 'a/static/path/'; // <-- ends with a slash

			assertMatch("/a/static/path",route, 'Match if all segments are equal');
			assertMatch("a/static/path",route, 'Ignore leading slash');
			assertMatch("/a/static/path/",route, 'Ignore trailing slash');
			assertMatch("/a//static///path/",route, 'Ignore extra slash');
			assertMatch("/a/static/path?a=1&b=2",route, 'Ignore query');

			assertNoMatch("",route, 'Empty.');
			assertNoMatch('a/static/path/and',route, "Don't match if more segments than in route.");
		});

		test("Parameter route", function() {
			var route = 'a/#parameter/path'; // 

			assertMatch("/a/foo/path",route, 'Match any segment value');
			assertMatch("a/bar/path",route, 'Ignore leading slash');
			assertMatch("/a/bar/path/",route, 'Ignore trailing slash');
			assertMatch("/a//bar///path/",route, 'Ignore extra slash');
			assertMatch("/a/foo/path?a=1&b=2",route, 'Ignore query');

			assertNoMatch('',route, 'Empty. One parameters expected');
			assertNoMatch('a/foo/path/and',route, "Don't match if more segments than in route.");
			assertNoMatch('b/foo/path',route, 'B does not match static a');
		});

		test("Multiple parameters route", function() {
			var route = '#parameter/#parameter2'; // 

			assertMatch("foo/bar",route, 'Match any segment values');
			assertMatch("a/bar/",route, 'Ignore leading slash');
			assertMatch("/a/bar/",route, 'Ignore trailing slash');
			assertMatch("/a//bar/",route, 'Ignore extra slash');
			assertMatch("foo/bar?a=1&b=2",route, 'Ignore query');

			assertNoMatch("",route, 'Empty. Two named parameters expected');
			assertNoMatch("/foo",route, 'One segment. Two segments expected');
			assertNoMatch('a/foo/path/and',route, "Don't match if more segments than in route.");
		});

		test("Optional Parameter route", function() {
			var route = 'a/?parameter/path'; // 

			assertMatch("/a/foo/path",route, 'Match any segment value');
			assertMatch("/a/path",route, 'Match URL without segment');
			assertMatch("a/bar/path",route, 'Ignore leading slash');
			assertMatch("/a/bar/path/",route, 'Ignore trailing slash');
			assertMatch("/a//bar///path/",route, 'Ignore extra slash');
			assertMatch("/a/foo/path?a=1&b=2",route, 'Ignore query');

			assertNoMatch('',route, 'Empty. Two segments expected');
			assertNoMatch('/a',route, 'One segment. At least two expected');
			assertNoMatch('a/foo/path/and',route, "Don't match if more segments than in route.");
			assertNoMatch('b/foo/path',route, 'B does not match static a');
		});

		test("Multiple Optional Parameter route", function() {
			var route = '?foo/world/?bar/hello';

			assertMatch("/foo/world/bar/hello",route, 'Match if all segments');
			assertMatch("/world/bar/hello",route, 'Match without first');
			assertMatch("/foo/world/hello",route, 'Match without second');
			assertMatch("/world/hello",route, 'Match without both');

			assertMatch("foo/world/bar/hello",route, 'Ignore leading slash');
			assertMatch("/foo/world/bar/hello/",route, 'Ignore trailing slash');
			assertMatch("/foo///world/bar///hello",route, 'Ignore extra slash');
			assertMatch("/foo/world/bar/hello?a=1&b=2",route, 'Ignore query');


			assertNoMatch('',route, 'Empty. At least two segments expected');
			assertNoMatch('/foo/world/bar/hello/and',route, "Don't match if more segments than in route.");
			assertNoMatch('/foo/b/bar/hello',route, 'B does not match static world');
		});

		test("Mixed Optional and Mandatory Parameter route", function() {
			var route = '?foo/#bar/?bro';

			assertMatch("/foo/bar/bro",route, 'Match if all segments');
			assertMatch("/foo/bar",route, 'Match if two');
			assertMatch("/foo",route, 'Match if one');

			assertMatch("foo/bat/bro",route, 'Ignore leading slash');
			assertMatch("/foo/bar/bro/",route, 'Ignore trailing slash');
			assertMatch("/foo///bar/bro/",route, 'Ignore extra slash');
			assertMatch("/foo/bar/bro?a=1&b=2",route, 'Ignore query');

			assertNoMatch("", route, 'No match if none');
			assertNoMatch("/",route, 'No match if only slash');
			assertNoMatch('/foo/bar/bro/and',route, "Don't match if more segments than in route.");
		});

		// Parameter binding tests

		test("Route match result", function() {			
			var route = router.route("#a/#b");
			var url = router.url("hello/world");

			var result = url.matchRoute(route);

			ok(result.matched(), 'have matched method true');
			equal(result.getRoute(), route, 'have route');
			equal(result.getUrl(), url, 'have url');

			ok(result.getParameters(), 'contains parameters');
			equal(result.getParameters().a, 'hello', 'first parameter set');
			equal(result.getParameters().a, 'hello', 'first parameter set');

			deepEqual(result.getValues(), ['hello', 'world'], 'values as array');
			deepEqual(result.getKeys(), ['a', 'b'], 'parameter names as array');

		});

		test("Route match capture parameters", function() {
			var result = router.url("/hello/world").matchRoute(router.route("#foo/#bar"));
			var props = result.getParameters();

			ok(props, 'contains parameters');
			equal(props.foo, "hello");
			equal(props.bar, "world");

		});

		test("Route match capture parameters mixed with statics", function() {
			var result = router.url("/hello/static/world").matchRoute(router.route("#foo/static/#bar"));
			var props = result.getParameters();

			ok(props, 'contains parameters');
			equal(props.foo, "hello", 'foo');
			equal(props.bar, "world", 'bar');

		});

		test("Route parameter capture optional parameters", function() {
			var result = router.url("/hello/world").matchRoute(router.route("?foo/?bar"));
			var props = result.getParameters();

			ok(props, 'contains parameters');
			equal(props.foo, "hello");
			equal(props.bar, "world");
		});

		test("Route parameter capture optional parameters mixed with parameters", function() {
			var firstOptionalBothMatch = router.url("hello/world").matchRoute(router.route("?foo/#bar")).getParameters();
			deepEqual(firstOptionalBothMatch, { foo: 'hello', bar : 'world'}, 'match all segments if possible');

			var firstOptionalOneMatch = router.url("/world").matchRoute(router.route("?foo/#bar")).getParameters();
			deepEqual(firstOptionalOneMatch, { bar : 'world'}, 'match mandatory parameter first');

			var optionalInPath = router.url("hello/world").matchRoute(router.route("#foo/?bar/#bro")).getParameters();
			deepEqual(optionalInPath, { foo: 'hello', bro : 'world'}, 'match mandatory parameters even if not first');

			// TODO: should only pass matched parameters or pass all parameters with a default value for 
			// does not matched (I vote for default value)
			var trailingOptionals = router.url("hello/world").matchRoute(router.route("#foo/?bar/?bro")).getParameters();
			deepEqual(trailingOptionals, { foo: 'hello', bar : 'world', bro: undefined}, 'match optional from left');
		});

		// Query

		test("Query", function() {			
			var query = router.url("hello/world?a=1&b=2&c=3").getQuery();
			deepEqual(query, {a: '1', b:'2', c: '3'}, 'match query parameters');
		});

	}
);