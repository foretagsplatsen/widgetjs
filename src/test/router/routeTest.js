import router from "../../router";

function assertMatch(url, route, message) {
	expect(router.url({rawUrl: url}).matchRoute(router.route({ pattern: route })).isMatch()).toBeTruthy();
}

function assertNoMatch(url, route, message) {
	expect(!router.url({rawUrl: url}).matchRoute(router.route({ pattern: route })).isMatch()).toBeTruthy();
}

describe("route", function() {

	// MATCH tests

	it("Empty route", function() {
		var route = "";

		assertMatch("", route, "Match empty");
		assertMatch("/", route, "Match slash");
		assertMatch("//",route, "Ignore extra slash");
		assertMatch("?a=1&b=2",route, "Ignore query");

		assertNoMatch("value",route, "Don't match values");
	});

	it("Slash route", function() {
		var route = "/";

		assertMatch("", route, "Match empty");
		assertMatch("/", route, "Match slash");
		assertMatch("//",route, "Ignore extra slash");
		assertMatch("?a=1&b=2",route, "Ignore query");

		assertNoMatch("value",route, "Don't match values");
	});

	it("Static route", function() {
		var route = "a/static/path";

		assertMatch("/a/static/path",route, "Match if all segments are equal");
		assertMatch("a/static/path",route, "Ignore leading slash");
		assertMatch("/a/static/path/",route, "Ignore trailing slash");
		assertMatch("/a//static///path/",route, "Ignore extra slash");
		assertMatch("/a/static/path?a=1&b=2",route, "Ignore query");

		assertNoMatch("", route, "Don't match empty");
		assertNoMatch("a/static/path/and/some/more",route, "Don't match if more segments than in route.");
	});

	it("Route ignore trailing slash on pattern", function() {
		var route = "a/static/path/"; // <-- ends with a slash

		assertMatch("/a/static/path",route, "Match if all segments are equal");
		assertMatch("a/static/path",route, "Ignore leading slash");
		assertMatch("/a/static/path/",route, "Ignore trailing slash");
		assertMatch("/a//static///path/",route, "Ignore extra slash");
		assertMatch("/a/static/path?a=1&b=2",route, "Ignore query");

		assertNoMatch("",route, "Empty.");
		assertNoMatch("a/static/path/and",route, "Don't match if more segments than in route.");
	});

	it("Parameter route", function() {
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

	it("Multiple parameters route", function() {
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

	it("Optional Parameter route", function() {
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

	it("Multiple Optional Parameter route", function() {
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

	it("Mixed Optional and Mandatory Parameter route", function() {
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

	it("Route match result", function() {
		var route = router.route({ pattern: "#a/#b" });
		var url = router.url({rawUrl: "hello/world"});

		var result = url.matchRoute(route);

		expect(result.isMatch()).toBeTruthy();
		expect(result.getRoute()).toEqual(route);
		expect(result.getUrl()).toEqual(url);

		expect(result.getRouteParameters()).toBeTruthy();
		expect(result.getRouteParameters().a).toBe("hello");
	});

	it("Route match capture parameters", function() {
		var result = router.url({rawUrl: "/hello/world"}).matchRoute(router.route({pattern: "#foo/#bar" }));
		var props = result.getRouteParameters();

		expect(props).toBeTruthy();
		expect(props.foo).toBe("hello");
		expect(props.bar).toBe("world");

	});

	it("Route match capture parameters mixed with statics", function() {
		var result = router.url({rawUrl: "/hello/static/world"}).matchRoute(router.route({ pattern: "#foo/static/#bar" }));
		var props = result.getRouteParameters();

		expect(props).toBeTruthy();
		expect(props.foo).toBe("hello");
		expect(props.bar).toBe("world");

	});

	it("Route parameter capture optional parameters", function() {
		var result = router.url({rawUrl: "/hello/world"}).matchRoute(router.route({ pattern: "?foo/?bar"}));
		var props = result.getRouteParameters();

		expect(props).toBeTruthy();
		expect(props.foo).toBe("hello");
		expect(props.bar).toBe("world");
	});

	it("Route parameter capture optional parameters mixed with parameters", function() {
		var firstOptionalBothMatch = router.url({rawUrl: "hello/world"}).matchRoute(router.route({ pattern: "?foo/#bar"})).getRouteParameters();

		expect(firstOptionalBothMatch).toEqual({ foo: "hello", bar : "world"});

		var firstOptionalOneMatch = router.url({rawUrl: "/world"}).matchRoute(router.route({ pattern: "?foo/#bar"})).getRouteParameters();

		expect(firstOptionalOneMatch).toEqual({ foo: undefined, bar : "world"});

		var optionalInPath = router.url({rawUrl: "hello/world"}).matchRoute(router.route({ pattern: "#foo/?bar/#bro" })).getRouteParameters();

		expect(optionalInPath).toEqual({ foo: "hello", bar: undefined,bro : "world"});

		var trailingOptionals = router.url({rawUrl: "hello/world"}).matchRoute(router.route({ pattern: "#foo/?bar/?bro" })).getRouteParameters();

		expect(trailingOptionals).toEqual({ foo: "hello", bar : "world", bro: undefined});
	});

	it("Route parameter can have defaults", function() {
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

		expect(props).toBeTruthy();
		expect(props.foo).toBe("hello");
		expect(props.bar).toBe("world");
	});

		// Query

	it("Query", function() {
		var query = router.url({rawUrl: "hello/world?a=1&b=2&c=3"}).getQuery();

		expect(query).toEqual({a: "1", b:"2", c: "3"});
	});

		// Expand

	it("Expand parameters", function() {
		var route = router.route({ pattern: "#a/test/#b"});

		var url = route.expand({a : "hello", b: "world"});

		expect(url).toBe("hello/test/world");
	});

	it("Route parameter expansion can handle arrays", function() {
		var route = router.route({
			pattern: "foo/#bar"
		});

		var url = route.expand({bar: ["a", "b"]});

		expect(url).toBe("foo/a,b");
	});

	it("Route optional parameter expansion can handle arrays", function() {
		var route = router.route({
			pattern: "foo"
		});
		var url = route.expand({bar: ["a", "b"]});

		expect(url).toBe("foo?bar=a,b");
	});

	it("Expand optionals", function() {
		var route = router.route({ pattern: "#a/?c/#b/?d"});

		expect(route.expand({a : "hello", b: "world", d: "d"})).toBe("hello/world/d");
		expect(route.expand({a : "hello", b: "world" })).toBe("hello/world");
		expect(route.expand({a : "hello", b: "world", c: "c" })).toBe("hello/c/world");
	});

	it("Expand extra parameters to the query string", function() {
		var route = router.route({ pattern: "#a/#b"});

		expect(route.expand({a : "hello", b: "world", c: "foo"})).toBe("hello/world?c=foo");
		expect(route.expand({a : "hello", b: "world", c: "foo", d: "bar" })).toBe("hello/world?c=foo&d=bar");
	});

	it("Expand throws not valid URL error", function() {
		var route = router.route({ pattern: "#a/#b" });

		expect(function() { route.expand({a : "hello"});}).toThrowError("Could not generate a valid URL");
	});

		// Constraints

	it("Route with function constraint", function() {
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

		expect(aRoute.matchUrl(router.url({rawUrl: "/hello/world"})).isMatch()).toBeTruthy();
		expect(!aRoute.matchUrl(router.url({rawUrl: "/hello/sweden"})).isMatch()).toBeTruthy();
	});

	it("Route with array constraint", function() {
		var aRoute = router.route({
			pattern: "hello/#foo",
			options: {
				constraints : {
					foo: ["world", "sweden"]
				}
			}
		});

		expect(aRoute.matchUrl(router.url({rawUrl: "/hello/world"})).isMatch()).toBeTruthy();
		expect(!aRoute.matchUrl(router.url({rawUrl: "/hello/france"})).isMatch()).toBeTruthy();
	});

	it("Route with RegExp constraint", function() {
		var aRoute = router.route({
			pattern: "hello/#foo",
			options: {
				constraints : {
					foo: /(^[a-z]+$)/
				}
			}
		});

		expect(aRoute.matchUrl(router.url({rawUrl: "/hello/world"})).isMatch()).toBeTruthy();
		expect(!aRoute.matchUrl(router.url({rawUrl: "/hello/öland"})).isMatch()).toBeTruthy();
	});

	it("Route with mixed constraints", function() {
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

		expect(aRoute.matchUrl(router.url({rawUrl: "/henrik/mikael/h"})).isMatch()).toBeTruthy();
		expect(!aRoute.matchUrl(router.url({rawUrl: "/ben/mikael/1"})).isMatch()).toBeTruthy();
		expect(!aRoute.matchUrl(router.url({rawUrl: "/henrik/dennis/1"})).isMatch()).toBeTruthy();
		expect(!aRoute.matchUrl(router.url({rawUrl: "/henrik/mikael/a"})).isMatch()).toBeTruthy();
	});

	it("Route constraints on optional parameters", function() {
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

		expect(aRoute.matchUrl(router.url({rawUrl: ""})).isMatch()).toBeTruthy();

		expect(!aRoute.matchUrl(router.url({rawUrl: "ö"})).isMatch()).toBeTruthy();

		expect(aRoute.matchUrl(router.url({rawUrl: "henrik/micke/h"})).isMatch()).toBeTruthy();
		expect(aRoute.matchUrl(router.url({rawUrl: "henrik/micke/h"})).getRouteParameters()).toEqual({ a: "henrik", b: "micke", c: "h"});

		expect(aRoute.matchUrl(router.url({rawUrl: "henrik/micke"})).isMatch()).toBeTruthy();
		expect(aRoute.matchUrl(router.url({rawUrl: "henrik/micke"})).getRouteParameters()).toEqual({ a: "henrik", b: "micke", c: undefined});

		expect(aRoute.matchUrl(router.url({rawUrl: "henrik"})).isMatch()).toBeTruthy();
		expect(aRoute.matchUrl(router.url({rawUrl: "henrik"})).getRouteParameters()).toEqual({ a: "henrik", b: undefined, c: undefined});

		expect(aRoute.matchUrl(router.url({rawUrl: "micke"})).isMatch()).toBeTruthy();
		expect(aRoute.matchUrl(router.url({rawUrl: "micke"})).getRouteParameters()).toEqual({ a: undefined, b: "micke", c: undefined});

		expect(aRoute.matchUrl(router.url({rawUrl: "h"})).isMatch()).toBeTruthy();
		expect(aRoute.matchUrl(router.url({rawUrl: "h"})).getRouteParameters()).toEqual({ a: undefined, b: undefined, c: "h"});
	});

	it("Ignore trailing segments route option", function() {
		var aRoute = router.route({
			pattern: "hello/#foo",
			options: {
				ignoreTrailingSegments: true
			}
		});

		expect(aRoute.matchUrl(router.url({rawUrl: "/hello/world"})).isMatch()).toBeTruthy();
		expect(aRoute.matchUrl(router.url({rawUrl: "/hello/world/and/some/extra"})).isMatch()).toBeTruthy();
	});
});
