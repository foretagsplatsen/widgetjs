import widget from "../widget.js";
import htmlCanvas from "../htmlCanvas.js";
import jQuery from "jquery";
import { vi, describe, it, expect } from "vitest";

const widgetSubclass = widget.subclass((that) => {
	that.renderContentOn = function (html) {
		html.h1("Hello world");
	};
});

function withWidget(callback) {
	// create a widget
	let my = {};

	let aWidget = widgetSubclass({}, my);

	aWidget.appendTo(jQuery("body"));

	// execute test
	callback(aWidget, my);

	// clean-up : remove widget
	aWidget.asJQuery().remove();
}

function withCanvas(callback) {
	jQuery("BODY").append('<div id="sandbox"></div>');
	let sandbox = jQuery("#sandbox");

	let html = htmlCanvas(sandbox);
	callback(html);

	sandbox.remove();
}

// actual tests

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
		let aWidget = widgetSubclass({ id: "anId" });

		expect(aWidget.id()).toBe("anId");
	});

	it("widgets supports events", () => {
		expect.assertions(1);

		// Arrange: a widget with a public method
		// that triggers an event when executed.
		let aWidget = (function () {
			let my = {};
			let that = widgetSubclass({}, my);

			that.aMethod = function () {
				that.trigger("anEvent");
			};

			return that;
		})();

		// Assert: that callback is executed when
		aWidget.register("anEvent", () => {
			expect(true).toBeTruthy();
		});

		// event is triggered
		aWidget.aMethod();
	});

	it("widgets supports event methods", () => {
		// Arrange: a widget with a public method
		// that triggers an event when executed.
		let aWidget = (function () {
			let my = {};
			let that = widgetSubclass({}, my);

			that.anEvent = my.events.createEvent("anEvent");

			that.aMethod = function () {
				that.trigger("anEvent");
			};

			return that;
		})();

		let spy = vi.fn();

		// Assert: that callback is executed when
		aWidget.anEvent.register(spy);

		// event is triggered
		aWidget.aMethod();

		expect(spy).toHaveBeenCalledWith();
	});

	it("linkTo() creates links to paths in app", () => {
		let my = {}; // reference to protected methods using "my";
		widgetSubclass({}, my);

		expect(my.linkTo("foo/bar")).toBe("#!/foo/bar");
	});

	it("redirectTo() redirects to paths in app", () => {
		let my = {}; // reference to protected methods using "my";
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
			let id = `#${aWidget.id()}`;

			expect(jQuery(id).get(0)).toBeTruthy();

			aWidget.asJQuery().remove();

			expect(!jQuery(id).get(0)).toBeTruthy();
		});
	});

	it("widgets can be appended a jQuery", () => {
		expect.assertions(1);

		withCanvas((html) => {
			// Arrange: a widget
			let aWidget = (function () {
				let that = widgetSubclass();

				that.renderContentOn = function (html) {
					html.div("div").addClass("aDiv");
				};

				return that;
			})();

			// and a DIV with existing content
			let divQuery = html.div(html.span("content")).id("aDiv").asJQuery();

			// Act: append widget to DIV
			aWidget.appendTo(divQuery);

			// Assert: that widget was appended last to DIV
			expect(divQuery.children().get(1).id).toBe(aWidget.id());
		});
	});

	it("widgets can replace content of a jQuery", () => {
		expect.assertions(2);

		withCanvas((html) => {
			// Arrange: a widget
			let aWidget = (function () {
				let that = widgetSubclass();

				that.renderContentOn = function (html) {
					html.div("div").addClass("aDiv");
				};

				return that;
			})();

			// and a DIV with existing content
			let divQuery = html.div(html.span("content")).id("aDiv").asJQuery();

			// Act: replace content with jQuery
			aWidget.replace(divQuery);

			// Assert: that widget was appended to DIV
			expect(divQuery.children()).toHaveLength(1);
			expect(divQuery.children().get(0).id).toBe(aWidget.id());
		});
	});

	it("widgets can be appended to a HTML canvas", () => {
		expect.assertions(1);

		withCanvas((html) => {
			// Arrange: a widget
			let aWidget = (function () {
				let that = widgetSubclass();

				that.renderContentOn = function (html) {
					html.div("div").addClass("aDiv");
				};

				return that;
			})();

			// Act: append widget to canvas
			html.render(aWidget);

			// Assert: that widget was rendered in canvas
			expect(html.root.asJQuery().find(".aDiv").get(0)).toBeTruthy();
		});
	});

	it("isRendered()", () => {
		expect.assertions(2);

		withCanvas((html) => {
			// Arrange: a widget
			let aWidget = (function () {
				let that = widgetSubclass();

				that.renderContentOn = function (html) {
					html.div("div").addClass("aDiv");
				};

				return that;
			})();

			// Assert: false before render
			expect(!aWidget.isRendered()).toBeTruthy();

			// Act: render widget
			html.render(aWidget);

			// Assert: true ehrn rendered
			expect(aWidget.isRendered()).toBeTruthy();
		});
	});

	it("renderRoot() can be overridden in widget", () => {
		expect.assertions(1);

		withCanvas((html) => {
			// Arrange: a widget that renders it"s root as
			// form instead of DIV
			let aWidget = (function () {
				let my = {};
				let that = widgetSubclass({}, my);

				my.renderRootOn = function (html) {
					return html.form().id(that.id());
				};

				return that;
			})();

			// Act: render widget
			html.render(aWidget);

			// Assert: that form is rendered with id
			expect(html.root.asJQuery().find("FORM").get(0).id).toBe(
				aWidget.id(),
			);
		});
	});

	it("willAttach() and didAttach() are called upon rendering", () => {
		expect.assertions(2);

		withCanvas((html) => {
			let aWidget = (function () {
				let my = {};
				let that = widgetSubclass({}, my);

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

			// Act: render widget
			html.render(aWidget);

			// Assert: that form is rendered with id
			expect(aWidget.willAttachCalled).toBeTruthy();
			expect(aWidget.didAttachCalled).toBeTruthy();
		});
	});

	it("willUpdate() is not called when rendering", () => {
		expect.assertions(1);

		withCanvas((html) => {
			let aWidget = (function () {
				let my = {};
				let that = widgetSubclass({}, my);

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
			let aWidget = (function () {
				let my = {};
				let that = widgetSubclass({}, my);

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
		let spy = vi.fn();
		let mySubclass = widget.subclass((that, my) => {
			my.initializeSubwidgets = spy;
		});
		mySubclass();

		expect(spy).toHaveBeenCalledWith({});
	});

	it("widgets initialize their subwidgets after themselves", () => {
		expect.assertions(2);

		let init = vi.fn();
		let initSub = vi.fn();

		let mySubclass = widget.subclass((that, my) => {
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
