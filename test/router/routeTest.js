define(
	["widgetjs/router", "chai"],
	function(router,chai) {

        var assert = chai.assert;

        function assertMatch(url, route, message) {
			var assertMessage = (message ? message + ". ": "") + "Url \"" + url + "\" should match route \"" + route + "\". ";
			assert.ok(router.url({rawUrl: url}).matchRoute(router.route({ pattern: route })).isMatch(), assertMessage);
		}

		function assertNoMatch(url, route, message) {
			var assertMessage = (message ? message + ". " : "") + "Url \"" + url + "\" should not match route \"" + route + "\". ";
			assert.ok(!router.url({rawUrl: url}).matchRoute(router.route({ pattern: route })).isMatch(), assertMessage);
		}

		suite("route");

		// MATCH tests

		test("Empty route", function() {
			var route = "";

			assertMatch("", route, "Match empty");
			assertMatch("/", route, "Match slash");
			assertMatch("//",route, "Ignore extra slash");
			assertMatch("?a=1&b=2",route, "Ignore query");

			assertNoMatch("value",route, "Don't match values");
		});

		test("Slash route", function() {
			var route = "/";

			assertMatch("", route, "Match empty");
			assertMatch("/", route, "Match slash");
			assertMatch("//",route, "Ignore extra slash");
			assertMatch("?a=1&b=2",route, "Ignore query");

			assertNoMatch("value",route, "Don't match values");
		});

		test("Static route", function() {
			var route = "a/static/path";

			assertMatch("/a/static/path",route, "Match if all segments are equal");
			assertMatch("a/static/path",route, "Ignore leading slash");
			assertMatch("/a/static/path/",route, "Ignore trailing slash");
			assertMatch("/a//static///path/",route, "Ignore extra slash");
			assertMatch("/a/static/path?a=1&b=2",route, "Ignore query");

			assertNoMatch("", route, "Don't match empty");
			assertNoMatch("a/static/path/and/some/more",route, "Don't match if more segments than in route.");
		});

		test("Route ignore trailing slash on pattern", function() {
			var route = "a/static/path/"; // <-- ends with a slash

			assertMatch("/a/static/path",route, "Match if all segments are equal");
			assertMatch("a/static/path",route, "Ignore leading slash");
			assertMatch("/a/static/path/",route, "Ignore trailing slash");
			assertMatch("/a//static///path/",route, "Ignore extra slash");
			assertMatch("/a/static/path?a=1&b=2",route, "Ignore query");

			assertNoMatch("",route, "Empty.");
			assertNoMatch("a/static/path/and",route, "Don't match if more segments than in route.");
		});

		test("Parameter route", function() {
			var route = "a/#parameter/path"; //

			assertMatch("/a/foo/path",route, "Match any segment value");
			assertMatch("a/bar/path",route, "Ignore leading slash");
			assertMatch("/a/bar/path/",route, "Ignore trailing slash");
			assertMatch("/a//bar///path/",route, "Ignore extra slash");
			assertMatch("/a/foo/path?a=1&b=2",route, "Ignore query");

			assertNoMatch("",route, "Empty. One parameters expected");
			assertNoMatch("a/foo/path/and",route, "Don't match if more segments than in route.");
			assertNoMatch("b/foo/path",route, "B does not match static a");
		});

		test("Multiple parameters route", function() {
			var route = "#parameter/#parameter2"; //

			assertMatch("foo/bar",route, "Match any segment values");
			assertMatch("a/bar/",route, "Ignore leading slash");
			assertMatch("/a/bar/",route, "Ignore trailing slash");
			assertMatch("/a//bar/",route, "Ignore extra slash");
			assertMatch("foo/bar?a=1&b=2",route, "Ignore query");

			assertNoMatch("",route, "Empty. Two named parameters expected");
			assertNoMatch("/foo",route, "One segment. Two segments expected");
			assertNoMatch("a/foo/path/and",route, "Don't match if more segments than in route.");
		});

		test("Optional Parameter route", function() {
			var route = "a/?parameter/path"; //

			assertMatch("/a/foo/path",route, "Match any segment value");
			assertMatch("/a/path",route, "Match URL without segment");
			assertMatch("a/bar/path",route, "Ignore leading slash");
			assertMatch("/a/bar/path/",route, "Ignore trailing slash");
			assertMatch("/a//bar///path/",route, "Ignore extra slash");
			assertMatch("/a/foo/path?a=1&b=2",route, "Ignore query");

			assertNoMatch("",route, "Empty. Two segments expected");
			assertNoMatch("/a",route, "One segment. At least two expected");
			assertNoMatch("a/foo/path/and",route, "Don't match if more segments than in route.");
			assertNoMatch("b/foo/path",route, "B does not match static a");
		});

		test("Multiple Optional Parameter route", function() {
			var route = "?foo/world/?bar/hello";

			assertMatch("/foo/world/bar/hello",route, "Match if all segments");
			assertMatch("/world/bar/hello",route, "Match without first");
			assertMatch("/foo/world/hello",route, "Match without second");
			assertMatch("/world/hello",route, "Match without both");

			assertMatch("foo/world/bar/hello",route, "Ignore leading slash");
			assertMatch("/foo/world/bar/hello/",route, "Ignore trailing slash");
			assertMatch("/foo///world/bar///hello",route, "Ignore extra slash");
			assertMatch("/foo/world/bar/hello?a=1&b=2",route, "Ignore query");

			assertNoMatch("",route, "Empty. At least two segments expected");
			assertNoMatch("/foo/world/bar/hello/and",route, "Don't match if more segments than in route.");
			assertNoMatch("/foo/b/bar/hello",route, "B does not match static world");
		});

		test("Mixed Optional and Mandatory Parameter route", function() {
			var route = "?foo/#bar/?bro";

			assertMatch("/foo/bar/bro",route, "Match if all segments");
			assertMatch("/foo/bar",route, "Match if two");
			assertMatch("/foo",route, "Match if one");

			assertMatch("foo/bat/bro",route, "Ignore leading slash");
			assertMatch("/foo/bar/bro/",route, "Ignore trailing slash");
			assertMatch("/foo///bar/bro/",route, "Ignore extra slash");
			assertMatch("/foo/bar/bro?a=1&b=2",route, "Ignore query");

			assertNoMatch("", route, "No match if none");
			assertNoMatch("/",route, "No match if only slash");
			assertNoMatch("/foo/bar/bro/and",route, "Don't match if more segments than in route.");
		});

		// Parameter binding tests

		test("Route match result", function() {
			var route = router.route({ pattern: "#a/#b" });
			var url = router.url({rawUrl: "hello/world"});

			var result = url.matchRoute(route);

			assert.ok(result.isMatch(), "have matched method true");
			assert.equal(result.getRoute(), route, "have route");
			assert.equal(result.getUrl(), url, "have url");

			assert.ok(result.getRouteParameters(), "contains parameters");
			assert.equal(result.getRouteParameters().a, "hello", "first parameter set");
			assert.equal(result.getRouteParameters().a, "hello", "first parameter set");
		});

		test("Route match capture parameters", function() {
			var result = router.url({rawUrl: "/hello/world"}).matchRoute(router.route({pattern: "#foo/#bar" }));
			var props = result.getRouteParameters();

			assert.ok(props, "contains parameters");
			assert.equal(props.foo, "hello");
			assert.equal(props.bar, "world");

		});

		test("Route match capture parameters mixed with statics", function() {
			var result = router.url({rawUrl: "/hello/static/world"}).matchRoute(router.route({ pattern: "#foo/static/#bar" }));
			var props = result.getRouteParameters();

			assert.ok(props, "contains parameters");
			assert.equal(props.foo, "hello", "foo");
			assert.equal(props.bar, "world", "bar");

		});

		test("Route parameter capture optional parameters", function() {
			var result = router.url({rawUrl: "/hello/world"}).matchRoute(router.route({ pattern: "?foo/?bar"}));
			var props = result.getRouteParameters();

			assert.ok(props, "contains parameters");
			assert.equal(props.foo, "hello");
			assert.equal(props.bar, "world");
		});

		test("Route parameter capture optional parameters mixed with parameters", function() {
			var firstOptionalBothMatch = router.url({rawUrl: "hello/world"}).matchRoute(router.route({ pattern:  "?foo/#bar"})).getRouteParameters();
			assert.deepEqual(firstOptionalBothMatch, { foo: "hello", bar : "world"}, "match all segments if possible");

			var firstOptionalOneMatch = router.url({rawUrl: "/world"}).matchRoute(router.route({ pattern: "?foo/#bar"})).getRouteParameters();
			assert.deepEqual(firstOptionalOneMatch, { foo: undefined, bar : "world"}, "match mandatory parameter first");

			var optionalInPath = router.url({rawUrl: "hello/world"}).matchRoute(router.route({ pattern: "#foo/?bar/#bro" })).getRouteParameters();
			assert.deepEqual(optionalInPath, { foo: "hello", bar: undefined,bro : "world"}, "match mandatory parameters even if not first");

			var trailingOptionals = router.url({rawUrl: "hello/world"}).matchRoute(router.route({ pattern: "#foo/?bar/?bro" })).getRouteParameters();
			assert.deepEqual(trailingOptionals, { foo: "hello", bar : "world", bro: undefined}, "match optional from left");
		});

		test("Route parameter can have defaults", function() {
			var route = router.route({
				pattern: "?foo/?bar",
				options: {
					defaults: {
						bar: "world"
					}
				}
			});

			var result = router.url({rawUrl: "/hello"}).matchRoute(route);
			var props = result.getRouteParameters();

			assert.ok(props, "contains parameters");
			assert.equal(props.foo, "hello");
			assert.equal(props.bar, "world");
		});

		// Query

		test("Query", function() {
			var query = router.url({rawUrl: "hello/world?a=1&b=2&c=3"}).getQuery();
			assert.deepEqual(query, {a: "1", b:"2", c: "3"}, "match query parameters");
		});

		// Expand

		test("Expand parameters", function() {
			var route = router.route({ pattern: "#a/test/#b"});

			var url = route.expand({a : "hello", b: "world"});

			assert.equal(url, "hello/test/world");
		});

		test("Route parameter expansion can handle arrays", function() {
			var route = router.route({
				pattern: "foo/#bar"
			});

			var url = route.expand({bar: ["a", "b"]});

			assert.equal(url, "foo/a,b");
		});

		test("Route optional parameter expansion can handle arrays", function() {
			var route = router.route({
				pattern: "foo"
			});
			var url = route.expand({bar: ["a", "b"]});

			assert.equal(url, "foo?bar=a,b");
		});

		test("Expand optionals", function() {
			var route = router.route({ pattern: "#a/?c/#b/?d"});

			assert.equal(route.expand({a : "hello", b: "world", d: "d"}), "hello/world/d");
			assert.equal(route.expand({a : "hello", b: "world" }), "hello/world");
			assert.equal(route.expand({a : "hello", b: "world", c: "c" }), "hello/c/world");
		});

		test("Expand extra parameters to the query string", function() {
			var route = router.route({ pattern: "#a/#b"});

			assert.equal(route.expand({a : "hello", b: "world", c: "foo"}), "hello/world?c=foo");
			assert.equal(route.expand({a : "hello", b: "world", c: "foo", d: "bar" }), "hello/world?c=foo&d=bar");
		});

		test("Expand throws not valid URL error", function() {
			var route = router.route({ pattern: "#a/#b" });

			assert.throws(function() { route.expand({a : "hello"});}, Error, "Could not generate a valid URL", "error since required parameter missing");
		});

		// Constraints

		test("Route with function constraint", function() {
			var aRoute = router.route({
				pattern: "/hello/#foo/",
				options: {
					constraints : {
						foo: function(value) {
							return value.length === 5;
						}
					}
				}
			});

			assert.ok(aRoute.matchUrl(router.url({rawUrl: "/hello/world"})).isMatch(), "match if function return true");
			assert.ok(!aRoute.matchUrl(router.url({rawUrl: "/hello/sweden"})).isMatch(), "no match if function return false");
		});

		test("Route with array constraint", function() {
			var aRoute = router.route({
				pattern: "hello/#foo",
				options: {
					constraints : {
						foo: ["world", "sweden"]
					}
				}
			});

			assert.ok(aRoute.matchUrl(router.url({rawUrl: "/hello/world"})).isMatch(), "match if value in array");
			assert.ok(!aRoute.matchUrl(router.url({rawUrl: "/hello/france"})).isMatch(), "no match if value not in array");
		});

		test("Route with RegExp constraint", function() {
			var aRoute = router.route({
				pattern: "hello/#foo",
				options: {
					constraints : {
						foo: /(^[a-z]+$)/
					}
				}
			});

			assert.ok(aRoute.matchUrl(router.url({rawUrl: "/hello/world"})).isMatch(), "match if regexp match value");
			assert.ok(!aRoute.matchUrl(router.url({rawUrl: "/hello/öland"})).isMatch(), "no match if regexp dont match");
		});

		test("Route with mixed constraints", function() {
			var aRoute = router.route({
				pattern: "#a/#b/#c",
				options: {
					constraints : {
						a: function(value) {
							return value.length > 5;
						},
						b: ["nicolas", "Mikael"],
						c: /(^[h-w]+$)/
					}
				}
			});

			assert.ok(aRoute.matchUrl(router.url({rawUrl: "/henrik/mikael/h"})).isMatch(), "all constraints match");
			assert.ok(!aRoute.matchUrl(router.url({rawUrl: "/ben/mikael/1"})).isMatch(), "function constraint dont match");
			assert.ok(!aRoute.matchUrl(router.url({rawUrl: "/henrik/dennis/1"})).isMatch(), "array constrait dont match");
			assert.ok(!aRoute.matchUrl(router.url({rawUrl: "/henrik/mikael/a"})).isMatch(), "regexp constraint dont match");
		});

		test("Route constraints on optional parameters", function() {
			var aRoute = router.route({
				pattern: "?a/?b/?c",
				options: {
					constraints : {
						a: function(value) {
							return value.length > 5;
						},
						b: ["nicolas", "micke"],
						c: /(^[h-w]+$)/
					}
				}
			});

			assert.ok(aRoute.matchUrl(router.url({rawUrl: ""})).isMatch(), "constraints are not evaluated if never matched");

			assert.ok(!aRoute.matchUrl(router.url({rawUrl: "ö"})).isMatch(), "no parameters match url segment");

			assert.ok(aRoute.matchUrl(router.url({rawUrl: "henrik/micke/h"})).isMatch(), "all constraints match");
			assert.deepEqual(aRoute.matchUrl(router.url({rawUrl: "henrik/micke/h"})).getRouteParameters(), { a: "henrik", b: "micke", c: "h"}, "parameters");

			assert.ok(aRoute.matchUrl(router.url({rawUrl: "henrik/micke"})).isMatch(), "first two constraints match");
			assert.deepEqual(aRoute.matchUrl(router.url({rawUrl: "henrik/micke"})).getRouteParameters(), { a: "henrik", b: "micke", c: undefined}, "parameters");

			assert.ok(aRoute.matchUrl(router.url({rawUrl: "henrik"})).isMatch(), "first constraint match");
			assert.deepEqual(aRoute.matchUrl(router.url({rawUrl: "henrik"})).getRouteParameters(), { a: "henrik", b: undefined, c: undefined}, "parameters");

			assert.ok(aRoute.matchUrl(router.url({rawUrl: "micke"})).isMatch(), "second constraint match");
			assert.deepEqual(aRoute.matchUrl(router.url({rawUrl: "micke"})).getRouteParameters(), { a: undefined, b: "micke", c: undefined}, "parameters");

			assert.ok(aRoute.matchUrl(router.url({rawUrl: "h"})).isMatch(), "last constraint match");
			assert.deepEqual(aRoute.matchUrl(router.url({rawUrl: "h"})).getRouteParameters(), { a: undefined, b: undefined, c: "h"}, "parameters");
		});

        test("Ignore trailing segments route option", function() {
            var aRoute = router.route({
				pattern: "hello/#foo",
				options: {
					ignoreTrailingSegments: true
				}
			});

            assert.ok(aRoute.matchUrl(router.url({rawUrl: "/hello/world"})).isMatch(), "match as normal route");
            assert.ok(aRoute.matchUrl(router.url({rawUrl: "/hello/world/and/some/extra"})).isMatch(), "ignores trailing segments");
        });
	}
);
