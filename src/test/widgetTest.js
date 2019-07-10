import widget from "../widget";
import htmlCanvas from "../htmlCanvas";
import jQuery from "jquery";

var widgetSubclass = widget.subclass(function(that, my) {
	that.renderContentOn = function(html) {
		html.h1("Hello world");
	};
});

function withWidget(callback) {
		// create a widget
	var my = {};

	var aWidget = widgetSubclass({}, my);

	aWidget.appendTo(jQuery("body"));

		// execute test
	callback(aWidget, my);

		// clean-up : remove widget
	aWidget.asJQuery().remove();
}

function withCanvas(callback) {
	$("BODY").append("<div id=\"sandbox\"></div>");
	var sandbox = jQuery("#sandbox");

	var html = htmlCanvas(sandbox);
	callback(html);

	sandbox.remove();
}

	// actual tests

describe("function", function() {

	it("widgets are assigned unique identifiers", function() {
		withWidget(function(aWidget) {
			for (var i = 0; i < 1000; i++) {
				expect(widgetSubclass().id()).not.toEqual(aWidget.id());
			}
		});
	});

	it("widgets identifier set from spec", function() {
		var aWidget = widgetSubclass({id: "anId"});

		expect(aWidget.id()).toBe("anId");
	});

	it("widgets supports events", function() {
			// Arrange: a widget with a public method
			// that triggers an event when executed.
		var aWidget = (function() {
			var my = {};
			var that = widgetSubclass({}, my);

			that.aMethod = function() {
				that.trigger("anEvent");
			};

			return that;
		})();

			// Assert: that callback is executed when
		aWidget.register("anEvent", function() {
			expect(true).toBeTruthy();
		});

			// event is triggered
		aWidget.aMethod();
	});

	it("widgets supports event methods", function() {
			// Arrange: a widget with a public method
			// that triggers an event when executed.
		var aWidget = (function() {
			var my = {};
			var that = widgetSubclass({}, my);

			that.anEvent = my.events.createEvent("anEvent");

			that.aMethod = function() {
				that.trigger("anEvent");
			};

			return that;
		})();

		var spy = jasmine.createSpy("callback");

			// Assert: that callback is executed when
		aWidget.anEvent.register(spy);

			// event is triggered
		aWidget.aMethod();

		expect(spy).toHaveBeenCalled();
	});

	it("linkTo() creates links to paths in app", function() {
		var my = {}; // reference to protected methods using "my";
		widgetSubclass({}, my);

		expect(my.linkTo("foo/bar")).toBe("#!/foo/bar");
	});

	it("redirectTo() redirects to paths in app", function() {
		var my = {}; // reference to protected methods using "my";
		widgetSubclass({}, my);

		my.redirectTo("foo/bar");

		expect(window.location.hash).toBe(my.linkTo("foo/bar"));
	});

	it("Render", function() {
		withWidget(function(aWidget) {
			expect(jQuery("#" + aWidget.id()).get(0)).toBeTruthy();
		});
	});

	it("Update", function() {
		withWidget(function(aWidget) {
			aWidget.renderContentOn = function(html) {
				html.div().id("foo");
			};

			aWidget.update();

			expect(jQuery("#foo").get(0)).toBeTruthy();
		});
	});

	it("Remove", function() {
		withWidget(function(aWidget, my) {
			var id = "#" + aWidget.id();

			expect(jQuery(id).get(0)).toBeTruthy();

			aWidget.asJQuery().remove();

			expect(!jQuery(id).get(0)).toBeTruthy();
		});
	});

	it("Widgets can be appended a jQuery", function() {
		withCanvas(function(html) {
				// Arrange: a widget
			var aWidget = (function() {
				var that = widgetSubclass();

				that.renderContentOn = function(html) {
					html.div("div").addClass("aDiv");
				};

				return that;
			})();

				// and a DIV with existing content
			var divQuery = html.div(html.span("content")).id("aDiv").asJQuery();

				// Act: append widget to DIV
			aWidget.appendTo(divQuery);

				// Assert: that widget was appended last to DIV
			expect(divQuery.children().get(1).id).toBe(aWidget.id());
		});
	});

	it("Widgets can replace content of a jQuery", function() {
		withCanvas(function(html) {
				// Arrange: a widget
			var aWidget = (function() {
				var that = widgetSubclass();

				that.renderContentOn = function(html) {
					html.div("div").addClass("aDiv");
				};

				return that;
			})();

				// and a DIV with existing content
			var divQuery = html.div(html.span("content")).id("aDiv").asJQuery();

				// Act: replace content with jQuery
			aWidget.replace(divQuery);

				// Assert: that widget was appended to DIV
			expect(divQuery.children().length).toBe(1);
			expect(divQuery.children().get(0).id).toBe(aWidget.id());
		});
	});

	it("Widgets can be appended to a HTML canvas", function() {
		withCanvas(function(html) {
				// Arrange: a widget
			var aWidget = (function() {
				var that = widgetSubclass();

				that.renderContentOn = function(html) {
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

	it("isRendered()", function() {
		withCanvas(function(html) {
				// Arrange: a widget
			var aWidget = (function() {
				var that = widgetSubclass();

				that.renderContentOn = function(html) {
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

	it("renderRoot() can be overridden in widget", function() {
		withCanvas(function(html) {

				// Arrange: a widget that renders it"s root as
				// form instead of DIV
			var aWidget = (function() {
				var my = {};
				var that = widgetSubclass({}, my);

				my.renderRootOn = function(html) {
					return html.form().id(that.id());
				};

				return that;
			})();

				// Act: render widget
			html.render(aWidget);

				// Assert: that form is rendered with id
			expect(html.root.asJQuery().find("FORM").get(0).id).toBe(aWidget.id());
		});
	});

	it("willAttach() and didAttach() are called upon rendering", function() {
		withCanvas(function(html) {
			var aWidget = (function() {
				var my = {};
				var that = widgetSubclass({}, my);

				that.willAttachCalled = false;
				that.didAttachCalled = false;

				my.willAttach = function() {
					that.willAttachCalled = true;
				};

				my.didAttach = function() {
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

	it("willUpdate() is not called when rendering", function() {
		withCanvas(function(html) {
			var aWidget = (function() {
				var my = {};
				var that = widgetSubclass({}, my);

				that.willUpdateCalled = false;

				my.willUpdate = function() {
					that.willUpdateCalled = true;
				};

				return that;
			})();

			html.render(aWidget);

			expect(!aWidget.willUpdateCalled).toBeTruthy();
		});
	});

	it("willUpdate() is called when updating", function() {
		withCanvas(function(html) {
			var aWidget = (function() {
				var my = {};
				var that = widgetSubclass({}, my);

				that.willUpdateCalled = false;

				my.willUpdate = function() {
					that.willUpdateCalled = true;
				};

				return that;
			})();

			html.render(aWidget);
			aWidget.update();

			expect(aWidget.willUpdateCalled).toBeTruthy();
		});
	});

	it("widgets initialize their subwidgets", function() {
		var spy = jasmine.createSpy("init");
		var mySubclass = widget.subclass(function(that, my) {
			my.initializeSubwidgets = spy;
		});
		mySubclass();

		expect(spy).toHaveBeenCalled();
	});

	it("widgets initialize their subwidgets after themselves", function() {
			// TODO: refactor when
			// https://github.com/jasmine/jasmine/pull/1242 is merged
		var init = jasmine.createSpy("init");
		var initSub = jasmine.createSpy("init sub");

		var mySubclass = widget.subclass(function(that, my) {
			my.initialize = init;

			my.initializeSubwidgets = function() {
				expect(init).toHaveBeenCalled();
				initSub();
			};
		});

		mySubclass();

		expect(initSub).toHaveBeenCalled();
	});

	it("widgets can create an event", function() {
		withWidget(function(widget, my) {
			expect(widget.foo).toBeUndefined();
			my.createEvent("foo");

			expect(widget.foo).toBeTruthy();
		});
	});

	it("widgets can create events", function() {
		withWidget(function(widget, my) {
			expect(widget.foo).toBeUndefined();
			expect(widget.bar).toBeUndefined();
			my.createEvents("foo", "bar");

			expect(widget.foo).toBeTruthy();
			expect(widget.bar).toBeTruthy();
		});
	});
});
