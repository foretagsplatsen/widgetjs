import { describe, expect, it, vi } from "vitest";
import htmlCanvas from "../htmlCanvas.js";
import jQuery from "jquery";
import widget from "../widget.js";

const widgetSubclass = widget.subclass((that) => {
	that.renderContentOn = function (html) {
		html.h1("Hello world");
	};
});

function withWidget(callback) {
	const my = {};

	const aWidget = widgetSubclass({}, my);

	aWidget.appendTo(jQuery("body"));

	callback(aWidget, my);

	aWidget.asJQuery().remove();
}

function withCanvas(callback) {
	jQuery("BODY").append('<div id="sandbox"></div>');
	const sandbox = jQuery("#sandbox");

	const html = htmlCanvas(sandbox);
	callback(html);

	sandbox.remove();
}

describe("function", () => {
	it("widgets are assigned unique identifiers", () => {
		expect.assertions(1000);

		withWidget((aWidget) => {
			for (let i = 0; i < 1000; i++) {
				expect(widgetSubclass().id()).not.toStrictEqual(aWidget.id());
			}
		});
	});

	it("widgets identifier set from spec", () => {
		const aWidget = widgetSubclass({ id: "anId" });

		expect(aWidget.id()).toBe("anId");
	});

	it("widgets supports events", () => {
		expect.assertions(1);

		const aWidget = (function () {
			const my = {};
			const that = widgetSubclass({}, my);

			that.aMethod = function () {
				that.trigger("anEvent");
			};

			return that;
		})();

		aWidget.register("anEvent", () => {
			expect(true).toBeTruthy();
		});

		aWidget.aMethod();
	});

	it("widgets supports event methods", () => {
		const aWidget = (function () {
			const my = {};
			const that = widgetSubclass({}, my);

			that.anEvent = my.events.createEvent("anEvent");

			that.aMethod = function () {
				that.trigger("anEvent");
			};

			return that;
		})();

		const spy = vi.fn();

		aWidget.anEvent.register(spy);

		aWidget.aMethod();

		expect(spy).toHaveBeenCalledWith();
	});

	it("linkTo() creates links to paths in app", () => {
		const my = {};
		widgetSubclass({}, my);

		expect(my.linkTo("foo/bar")).toBe("#!/foo/bar");
	});

	it("redirectTo() redirects to paths in app", () => {
		const my = {};
		widgetSubclass({}, my);

		my.redirectTo("foo/bar");

		expect(window.location.hash).toBe(my.linkTo("foo/bar"));
	});

	it("render", () => {
		expect.assertions(1);

		withWidget((aWidget) => {
			expect(jQuery(`#${aWidget.id()}`).get(0)).toBeTruthy();
		});
	});

	it("update", () => {
		expect.assertions(1);

		withWidget((aWidget) => {
			aWidget.renderContentOn = function (html) {
				html.div().id("foo");
			};

			aWidget.update();

			expect(jQuery("#foo").get(0)).toBeTruthy();
		});
	});

	it("remove", () => {
		expect.assertions(2);

		withWidget((aWidget) => {
			const id = `#${aWidget.id()}`;

			expect(jQuery(id).get(0)).toBeTruthy();

			aWidget.asJQuery().remove();

			expect(!jQuery(id).get(0)).toBeTruthy();
		});
	});

	it("widgets can be appended a jQuery", () => {
		expect.assertions(1);

		withCanvas((html) => {
			const aWidget = (function () {
				const that = widgetSubclass();

				that.renderContentOn = function (html) {
					html.div("div").addClass("aDiv");
				};

				return that;
			})();

			const divQuery = html
				.div(html.span("content"))
				.id("aDiv")
				.asJQuery();

			aWidget.appendTo(divQuery);

			expect(divQuery.children().get(1).id).toBe(aWidget.id());
		});
	});

	it("widgets can replace content of a jQuery", () => {
		expect.assertions(2);

		withCanvas((html) => {
			const aWidget = (function () {
				const that = widgetSubclass();

				that.renderContentOn = function (html) {
					html.div("div").addClass("aDiv");
				};

				return that;
			})();

			const divQuery = html
				.div(html.span("content"))
				.id("aDiv")
				.asJQuery();

			aWidget.replace(divQuery);

			expect(divQuery.children()).toHaveLength(1);
			expect(divQuery.children().get(0).id).toBe(aWidget.id());
		});
	});

	it("widgets can be appended to a HTML canvas", () => {
		expect.assertions(1);

		withCanvas((html) => {
			const aWidget = (function () {
				const that = widgetSubclass();

				that.renderContentOn = function (html) {
					html.div("div").addClass("aDiv");
				};

				return that;
			})();

			html.render(aWidget);

			expect(html.root.asJQuery().find(".aDiv").get(0)).toBeTruthy();
		});
	});

	describe("isRendered()", () => {
		it("returns false before render", () => {
			expect.assertions(1);

			withCanvas(() => {
				const aWidget = (function () {
					const that = widgetSubclass();

					that.renderContentOn = function (html) {
						html.div("div").addClass("aDiv");
					};

					return that;
				})();

				expect(aWidget.isRendered()).toBeFalsy();
			});
		});

		it("returns true after render", () => {
			// Make sure the function passed to `withCanvas()` is
			// called:
			expect.assertions(1);

			withCanvas((html) => {
				const aWidget = (function () {
					const that = widgetSubclass();

					that.renderContentOn = function (html) {
						html.div("div").addClass("aDiv");
					};

					return that;
				})();

				html.render(aWidget);

				expect(aWidget.isRendered()).toBeTruthy();
			});
		});

		it("returns true if the widget is attached to the DOM under a special shadow host", () => {
			// Make sure the function passed to `withCanvas()` is
			// called:
			expect.assertions(1);

			const aWidget = (function () {
				const that = widgetSubclass();

				that.renderContentOn = function (html) {
					html.div("div");
				};

				return that;
			})();

			const host = document.createElement("div");
			host.setAttribute("widgetjs-shadow", "document");

			document.body.appendChild(host);

			const shadowRoot = host.attachShadow({ mode: "open" });

			htmlCanvas(jQuery(shadowRoot)).render(aWidget);

			expect(aWidget.isRendered()).toBeTruthy();
		});
	});

	it("renderRoot() can be overridden in widget", () => {
		expect.assertions(1);

		withCanvas((html) => {
			const aWidget = (function () {
				const my = {};
				const that = widgetSubclass({}, my);

				my.renderRootOn = function (html) {
					return html.form().id(that.id());
				};

				return that;
			})();

			html.render(aWidget);

			expect(html.root.asJQuery().find("FORM").get(0).id).toBe(
				aWidget.id(),
			);
		});
	});

	it("willAttach() and didAttach() are called upon rendering", () => {
		expect.assertions(2);

		withCanvas((html) => {
			const aWidget = (function () {
				const my = {};
				const that = widgetSubclass({}, my);

				that.willAttachCalled = false;
				that.didAttachCalled = false;

				my.willAttach = function () {
					that.willAttachCalled = true;
				};

				my.didAttach = function () {
					that.didAttachCalled = true;
				};

				return that;
			})();

			html.render(aWidget);

			expect(aWidget.willAttachCalled).toBeTruthy();
			expect(aWidget.didAttachCalled).toBeTruthy();
		});
	});

	it("willUpdate() is not called when rendering", () => {
		expect.assertions(1);

		withCanvas((html) => {
			const aWidget = (function () {
				const my = {};
				const that = widgetSubclass({}, my);

				that.willUpdateCalled = false;

				my.willUpdate = function () {
					that.willUpdateCalled = true;
				};

				return that;
			})();

			html.render(aWidget);

			expect(!aWidget.willUpdateCalled).toBeTruthy();
		});
	});

	it("willUpdate() is called when updating", () => {
		expect.assertions(1);

		withCanvas((html) => {
			const aWidget = (function () {
				const my = {};
				const that = widgetSubclass({}, my);

				that.willUpdateCalled = false;

				my.willUpdate = function () {
					that.willUpdateCalled = true;
				};

				return that;
			})();

			html.render(aWidget);
			aWidget.update();

			expect(aWidget.willUpdateCalled).toBeTruthy();
		});
	});

	it("widgets initialize their subwidgets", () => {
		const spy = vi.fn();
		const mySubclass = widget.subclass((that, my) => {
			my.initializeSubwidgets = spy;
		});
		mySubclass();

		expect(spy).toHaveBeenCalledWith({});
	});

	it("widgets initialize their subwidgets after themselves", () => {
		expect.assertions(2);

		const init = vi.fn();
		const initSub = vi.fn();

		const mySubclass = widget.subclass((that, my) => {
			my.initialize = init;

			my.initializeSubwidgets = function () {
				expect(init).toHaveBeenCalledWith(expect.anything());

				initSub();
			};
		});

		mySubclass();

		expect(initSub).toHaveBeenCalledWith();
	});

	it("widgets can create an event", () => {
		expect.assertions(2);

		// eslint-disable-next-line no-shadow -- we should fix that later
		withWidget((widget, my) => {
			expect(widget.foo).toBeUndefined();

			my.createEvent("foo");

			expect(widget.foo).toBeTruthy();
		});
	});

	it("widgets can create events", () => {
		expect.assertions(4);

		// eslint-disable-next-line no-shadow -- we should fix that later
		withWidget((widget, my) => {
			expect(widget.foo).toBeUndefined();
			expect(widget.bar).toBeUndefined();

			my.createEvents("foo", "bar");

			expect(widget.foo).toBeTruthy();
			expect(widget.bar).toBeTruthy();
		});
	});
});
