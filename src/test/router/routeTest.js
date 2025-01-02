import { describe, expect, it } from "vitest";
import router from "../../router.js";

function assertMatch(url, route, _message) {
	expect(
		router
			.url({ rawUrl: url })
			.matchRoute(router.route({ pattern: route }))
			.isMatch(),
	).toBeTruthy();
}

function assertNoMatch(url, route, _message) {
	expect(
		!router
			.url({ rawUrl: url })
			.matchRoute(router.route({ pattern: route }))
			.isMatch(),
	).toBeTruthy();
}

describe("route", () => {
	// MATCH tests

	it("empty route", () => {
		const route = "";

		assertMatch("", route, "Match empty");
		assertMatch("/", route, "Match slash");
		assertMatch("//", route, "Ignore extra slash");
		assertMatch("?a=1&b=2", route, "Ignore query");

		assertNoMatch("value", route, "Don't match values");
	});

	it("slash route", () => {
		const route = "/";

		assertMatch("", route, "Match empty");
		assertMatch("/", route, "Match slash");
		assertMatch("//", route, "Ignore extra slash");
		assertMatch("?a=1&b=2", route, "Ignore query");

		assertNoMatch("value", route, "Don't match values");
	});

	it("static route", () => {
		const route = "a/static/path";

		assertMatch("/a/static/path", route, "Match if all segments are equal");
		assertMatch("a/static/path", route, "Ignore leading slash");
		assertMatch("/a/static/path/", route, "Ignore trailing slash");
		assertMatch("/a//static///path/", route, "Ignore extra slash");
		assertMatch("/a/static/path?a=1&b=2", route, "Ignore query");

		assertNoMatch("", route, "Don't match empty");

		assertNoMatch(
			"a/static/path/and/some/more",
			route,
			"Don't match if more segments than in route.",
		);
	});

	it("route ignore trailing slash on pattern", () => {
		const route = "a/static/path/"; // <-- ends with a slash

		assertMatch("/a/static/path", route, "Match if all segments are equal");
		assertMatch("a/static/path", route, "Ignore leading slash");
		assertMatch("/a/static/path/", route, "Ignore trailing slash");
		assertMatch("/a//static///path/", route, "Ignore extra slash");
		assertMatch("/a/static/path?a=1&b=2", route, "Ignore query");

		assertNoMatch("", route, "Empty.");

		assertNoMatch(
			"a/static/path/and",
			route,
			"Don't match if more segments than in route.",
		);
	});

	it("parameter route", () => {
		const route = "a/#parameter/path"; //

		assertMatch("/a/foo/path", route, "Match any segment value");
		assertMatch("a/bar/path", route, "Ignore leading slash");
		assertMatch("/a/bar/path/", route, "Ignore trailing slash");
		assertMatch("/a//bar///path/", route, "Ignore extra slash");
		assertMatch("/a/foo/path?a=1&b=2", route, "Ignore query");

		assertNoMatch("", route, "Empty. One parameters expected");

		assertNoMatch(
			"a/foo/path/and",
			route,
			"Don't match if more segments than in route.",
		);

		assertNoMatch("b/foo/path", route, "B does not match static a");
	});

	it("multiple parameters route", () => {
		const route = "#parameter/#parameter2"; //

		assertMatch("foo/bar", route, "Match any segment values");
		assertMatch("a/bar/", route, "Ignore leading slash");
		assertMatch("/a/bar/", route, "Ignore trailing slash");
		assertMatch("/a//bar/", route, "Ignore extra slash");
		assertMatch("foo/bar?a=1&b=2", route, "Ignore query");

		assertNoMatch("", route, "Empty. Two named parameters expected");
		assertNoMatch("/foo", route, "One segment. Two segments expected");

		assertNoMatch(
			"a/foo/path/and",
			route,
			"Don't match if more segments than in route.",
		);
	});

	it("optional Parameter route", () => {
		const route = "a/?parameter/path"; //

		assertMatch("/a/foo/path", route, "Match any segment value");
		assertMatch("/a/path", route, "Match URL without segment");
		assertMatch("a/bar/path", route, "Ignore leading slash");
		assertMatch("/a/bar/path/", route, "Ignore trailing slash");
		assertMatch("/a//bar///path/", route, "Ignore extra slash");
		assertMatch("/a/foo/path?a=1&b=2", route, "Ignore query");

		assertNoMatch("", route, "Empty. Two segments expected");
		assertNoMatch("/a", route, "One segment. At least two expected");

		assertNoMatch(
			"a/foo/path/and",
			route,
			"Don't match if more segments than in route.",
		);

		assertNoMatch("b/foo/path", route, "B does not match static a");
	});

	it("multiple Optional Parameter route", () => {
		const route = "?foo/world/?bar/hello";

		assertMatch("/foo/world/bar/hello", route, "Match if all segments");
		assertMatch("/world/bar/hello", route, "Match without first");
		assertMatch("/foo/world/hello", route, "Match without second");
		assertMatch("/world/hello", route, "Match without both");

		assertMatch("foo/world/bar/hello", route, "Ignore leading slash");
		assertMatch("/foo/world/bar/hello/", route, "Ignore trailing slash");
		assertMatch("/foo///world/bar///hello", route, "Ignore extra slash");
		assertMatch("/foo/world/bar/hello?a=1&b=2", route, "Ignore query");

		assertNoMatch("", route, "Empty. At least two segments expected");

		assertNoMatch(
			"/foo/world/bar/hello/and",
			route,
			"Don't match if more segments than in route.",
		);

		assertNoMatch(
			"/foo/b/bar/hello",
			route,
			"B does not match static world",
		);
	});

	it("mixed Optional and Mandatory Parameter route", () => {
		const route = "?foo/#bar/?bro";

		assertMatch("/foo/bar/bro", route, "Match if all segments");
		assertMatch("/foo/bar", route, "Match if two");
		assertMatch("/foo", route, "Match if one");

		assertMatch("foo/bat/bro", route, "Ignore leading slash");
		assertMatch("/foo/bar/bro/", route, "Ignore trailing slash");
		assertMatch("/foo///bar/bro/", route, "Ignore extra slash");
		assertMatch("/foo/bar/bro?a=1&b=2", route, "Ignore query");

		assertNoMatch("", route, "No match if none");
		assertNoMatch("/", route, "No match if only slash");

		assertNoMatch(
			"/foo/bar/bro/and",
			route,
			"Don't match if more segments than in route.",
		);
	});

	// Parameter binding tests

	it("route match result", () => {
		const route = router.route({ pattern: "#a/#b" });
		const url = router.url({ rawUrl: "hello/world" });

		const result = url.matchRoute(route);

		expect(result.isMatch()).toBeTruthy();
		expect(result.getRoute()).toStrictEqual(route);
		expect(result.getUrl()).toStrictEqual(url);

		expect(result.getRouteParameters()).toBeTruthy();
		expect(result.getRouteParameters().a).toBe("hello");
	});

	it("route match capture parameters", () => {
		const result = router
			.url({ rawUrl: "/hello/world" })
			.matchRoute(router.route({ pattern: "#foo/#bar" }));
		const props = result.getRouteParameters();

		expect(props).toBeTruthy();
		expect(props.foo).toBe("hello");
		expect(props.bar).toBe("world");
	});

	it("route match capture parameters mixed with statics", () => {
		const result = router
			.url({ rawUrl: "/hello/static/world" })
			.matchRoute(router.route({ pattern: "#foo/static/#bar" }));
		const props = result.getRouteParameters();

		expect(props).toBeTruthy();
		expect(props.foo).toBe("hello");
		expect(props.bar).toBe("world");
	});

	it("route parameter capture optional parameters", () => {
		const result = router
			.url({ rawUrl: "/hello/world" })
			.matchRoute(router.route({ pattern: "?foo/?bar" }));
		const props = result.getRouteParameters();

		expect(props).toBeTruthy();
		expect(props.foo).toBe("hello");
		expect(props.bar).toBe("world");
	});

	it("route parameter capture optional parameters mixed with parameters", () => {
		const firstOptionalBothMatch = router
			.url({ rawUrl: "hello/world" })
			.matchRoute(router.route({ pattern: "?foo/#bar" }))
			.getRouteParameters();

		expect(firstOptionalBothMatch).toStrictEqual({
			foo: "hello",
			bar: "world",
		});

		const firstOptionalOneMatch = router
			.url({ rawUrl: "/world" })
			.matchRoute(router.route({ pattern: "?foo/#bar" }))
			.getRouteParameters();

		expect(firstOptionalOneMatch).toStrictEqual({
			foo: undefined,
			bar: "world",
		});

		const optionalInPath = router
			.url({ rawUrl: "hello/world" })
			.matchRoute(router.route({ pattern: "#foo/?bar/#bro" }))
			.getRouteParameters();

		expect(optionalInPath).toStrictEqual({
			foo: "hello",
			bar: undefined,
			bro: "world",
		});

		const trailingOptionals = router
			.url({ rawUrl: "hello/world" })
			.matchRoute(router.route({ pattern: "#foo/?bar/?bro" }))
			.getRouteParameters();

		expect(trailingOptionals).toStrictEqual({
			foo: "hello",
			bar: "world",
			bro: undefined,
		});
	});

	it("route parameter can have defaults", () => {
		const route = router.route({
			pattern: "?foo/?bar",
			options: {
				defaults: {
					bar: "world",
				},
			},
		});

		const result = router.url({ rawUrl: "/hello" }).matchRoute(route);
		const props = result.getRouteParameters();

		expect(props).toBeTruthy();
		expect(props.foo).toBe("hello");
		expect(props.bar).toBe("world");
	});

	// Query

	it("query", () => {
		const query = router
			.url({ rawUrl: "hello/world?a=1&b=2&c=3" })
			.getQuery();

		expect(query).toStrictEqual({ a: "1", b: "2", c: "3" });
	});

	// Expand

	it("expand parameters", () => {
		const route = router.route({ pattern: "#a/test/#b" });

		const url = route.expand({ a: "hello", b: "world" });

		expect(url).toBe("hello/test/world");
	});

	it("route parameter expansion can handle arrays", () => {
		const route = router.route({
			pattern: "foo/#bar",
		});

		const url = route.expand({ bar: ["a", "b"] });

		expect(url).toBe("foo/a,b");
	});

	it("route optional parameter expansion can handle arrays", () => {
		const route = router.route({
			pattern: "foo",
		});
		const url = route.expand({ bar: ["a", "b"] });

		expect(url).toBe("foo?bar=a,b");
	});

	it("expand optionals", () => {
		const route = router.route({ pattern: "#a/?c/#b/?d" });

		expect(route.expand({ a: "hello", b: "world", d: "d" })).toBe(
			"hello/world/d",
		);

		expect(route.expand({ a: "hello", b: "world" })).toBe("hello/world");

		expect(route.expand({ a: "hello", b: "world", c: "c" })).toBe(
			"hello/c/world",
		);
	});

	it("expand extra parameters to the query string", () => {
		const route = router.route({ pattern: "#a/#b" });

		expect(route.expand({ a: "hello", b: "world", c: "foo" })).toBe(
			"hello/world?c=foo",
		);

		expect(
			route.expand({ a: "hello", b: "world", c: "foo", d: "bar" }),
		).toBe("hello/world?c=foo&d=bar");
	});

	it("expand throws not valid URL error", () => {
		const route = router.route({ pattern: "#a/#b" });

		expect(() => {
			route.expand({ a: "hello" });
		}).toThrow("Could not generate a valid URL");
	});

	// Constraints

	it("route with function constraint", () => {
		const aRoute = router.route({
			pattern: "/hello/#foo/",
			options: {
				constraints: {
					foo: function (value) {
						return value.length === 5;
					},
				},
			},
		});

		expect(
			aRoute.matchUrl(router.url({ rawUrl: "/hello/world" })).isMatch(),
		).toBeTruthy();

		expect(
			!aRoute.matchUrl(router.url({ rawUrl: "/hello/sweden" })).isMatch(),
		).toBeTruthy();
	});

	it("route with array constraint", () => {
		const aRoute = router.route({
			pattern: "hello/#foo",
			options: {
				constraints: {
					foo: ["world", "sweden"],
				},
			},
		});

		expect(
			aRoute.matchUrl(router.url({ rawUrl: "/hello/world" })).isMatch(),
		).toBeTruthy();

		expect(
			!aRoute.matchUrl(router.url({ rawUrl: "/hello/france" })).isMatch(),
		).toBeTruthy();
	});

	it("route with RegExp constraint", () => {
		const aRoute = router.route({
			pattern: "hello/#foo",
			options: {
				constraints: {
					foo: /(^[a-z]+$)/,
				},
			},
		});

		expect(
			aRoute.matchUrl(router.url({ rawUrl: "/hello/world" })).isMatch(),
		).toBeTruthy();

		expect(
			!aRoute.matchUrl(router.url({ rawUrl: "/hello/öland" })).isMatch(),
		).toBeTruthy();
	});

	it("route with mixed constraints", () => {
		const aRoute = router.route({
			pattern: "#a/#b/#c",
			options: {
				constraints: {
					a: function (value) {
						return value.length > 5;
					},
					b: ["nicolas", "Mikael"],
					c: /(^[h-w]+$)/,
				},
			},
		});

		expect(
			aRoute
				.matchUrl(router.url({ rawUrl: "/henrik/mikael/h" }))
				.isMatch(),
		).toBeTruthy();

		expect(
			!aRoute.matchUrl(router.url({ rawUrl: "/ben/mikael/1" })).isMatch(),
		).toBeTruthy();

		expect(
			!aRoute
				.matchUrl(router.url({ rawUrl: "/henrik/dennis/1" }))
				.isMatch(),
		).toBeTruthy();

		expect(
			!aRoute
				.matchUrl(router.url({ rawUrl: "/henrik/mikael/a" }))
				.isMatch(),
		).toBeTruthy();
	});

	it("route constraints on optional parameters", () => {
		const aRoute = router.route({
			pattern: "?a/?b/?c",
			options: {
				constraints: {
					a: function (value) {
						return value.length > 5;
					},
					b: ["nicolas", "micke"],
					c: /(^[h-w]+$)/,
				},
			},
		});

		expect(
			aRoute.matchUrl(router.url({ rawUrl: "" })).isMatch(),
		).toBeTruthy();

		expect(
			!aRoute.matchUrl(router.url({ rawUrl: "ö" })).isMatch(),
		).toBeTruthy();

		expect(
			aRoute.matchUrl(router.url({ rawUrl: "henrik/micke/h" })).isMatch(),
		).toBeTruthy();

		expect(
			aRoute
				.matchUrl(router.url({ rawUrl: "henrik/micke/h" }))
				.getRouteParameters(),
		).toStrictEqual({ a: "henrik", b: "micke", c: "h" });

		expect(
			aRoute.matchUrl(router.url({ rawUrl: "henrik/micke" })).isMatch(),
		).toBeTruthy();

		expect(
			aRoute
				.matchUrl(router.url({ rawUrl: "henrik/micke" }))
				.getRouteParameters(),
		).toStrictEqual({ a: "henrik", b: "micke", c: undefined });

		expect(
			aRoute.matchUrl(router.url({ rawUrl: "henrik" })).isMatch(),
		).toBeTruthy();

		expect(
			aRoute
				.matchUrl(router.url({ rawUrl: "henrik" }))
				.getRouteParameters(),
		).toStrictEqual({ a: "henrik", b: undefined, c: undefined });

		expect(
			aRoute.matchUrl(router.url({ rawUrl: "micke" })).isMatch(),
		).toBeTruthy();

		expect(
			aRoute
				.matchUrl(router.url({ rawUrl: "micke" }))
				.getRouteParameters(),
		).toStrictEqual({ a: undefined, b: "micke", c: undefined });

		expect(
			aRoute.matchUrl(router.url({ rawUrl: "h" })).isMatch(),
		).toBeTruthy();

		expect(
			aRoute.matchUrl(router.url({ rawUrl: "h" })).getRouteParameters(),
		).toStrictEqual({ a: undefined, b: undefined, c: "h" });
	});

	it("ignore trailing segments route option", () => {
		const aRoute = router.route({
			pattern: "hello/#foo",
			options: {
				ignoreTrailingSegments: true,
			},
		});

		expect(
			aRoute.matchUrl(router.url({ rawUrl: "/hello/world" })).isMatch(),
		).toBeTruthy();

		expect(
			aRoute
				.matchUrl(router.url({ rawUrl: "/hello/world/and/some/extra" }))
				.isMatch(),
		).toBeTruthy();
	});
});
