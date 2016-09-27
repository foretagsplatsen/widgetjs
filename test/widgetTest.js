define(["widgetjs/widget", "widgetjs/htmlCanvas", "jquery", "chai"], function(widget, htmlCanvas, jQuery, chai) {

    var assert = chai.assert;

    // helper functions

    var withWidget = function(callback) {
        // create a widget
        var my = {};
        var aWidget = widget(my);
        aWidget.renderContentOn = function(html) {
            html.h1("Hello world");
        };
        aWidget.appendTo(jQuery("body"));

        // execute test
        callback(aWidget, my);

        // clean-up : remove widget
        aWidget.asJQuery().remove();
    };

    var withCanvas = function(callback) {
        $("BODY").append("<div id=\"sandbox\"></div>");
        var sandbox = jQuery("#sandbox");

        var html = htmlCanvas(sandbox);
        callback(html);

        sandbox.remove();
    };

    // actual tests

    suite("widget");

    test("widgets are assigned unique identifiers", function() {
        withWidget(function(aWidget) {
            for( var i=0; i<1000;i++) {
                assert.ok(widget().id() !== aWidget.id(), "aWidget id should be unique");
            }
        });
    });

    test("widgets identifier set from spec", function() {
        var aWidget = widget({id : "anId"});
        assert.equal(aWidget.id(), "anId", "id() set to id in spec()");
    });

    test("widgets supports events", function() {
        // Arrange: a widget with a public method
        // that triggers an event when executed.
        var aWidget = (function() {
            var my = {};
            var that = widget({}, my);

            that.aMethod = function() {
                that.trigger("anEvent");
            };

            return that;
        })();

        // Assert: that callback is executed when
        aWidget.on("anEvent", function() {
            assert.ok(true, "event triggered on widget()");
        });

        // event is triggered
        aWidget.aMethod();
    });

    test("widgets supports event methods", function() {
        // Arrange: a widget with a public method
        // that triggers an event when executed.
        var aWidget = (function() {
            var my = {};
            var that = widget({}, my);

            that.onAnEvent = my.events.createEvent("anEvent");

            that.aMethod = function() {
                that.trigger("anEvent");
            };

            return that;
        })();

        // Assert: that callback is executed when
        aWidget.onAnEvent(function() {
            assert.ok(true, "event triggered on widget()");
        });

        // event is triggered
        aWidget.aMethod();
    });

    test("linkTo() creates links to paths in app", function() {
        var my = {}; // reference to protected methods using "my";
        var aWidget = widget({}, my);

        assert.equal(my.linkTo("foo/bar"), "#!/foo/bar", "Hash-bang convention hidden in hash.js");
    });

    test("redirectTo() redirects to paths in app", function() {
        var my = {}; // reference to protected methods using "my";
        var aWidget = widget({}, my);

        my.redirectTo("foo/bar");
        assert.equal(window.location.hash, my.linkTo("foo/bar"), "Use hash-bang convention hidden in hash.js");
    });

    test("Render", function() {
        withWidget(function(aWidget) {
            assert.ok(jQuery("#" + aWidget.id()).get(0), "appends widget to DOM");
        });
    });

    test("Update", function() {
        withWidget(function(aWidget) {
            aWidget.renderContentOn = function(html) {
                html.div().id("foo");
            };

            aWidget.update();

            assert.ok(jQuery("#foo").get(0), "updates widget");
        });
    });

    test("Remove", function() {
        withWidget(function(aWidget, my) {
            var id = "#" + aWidget.id();
            assert.ok(jQuery(id).get(0), "widget in DOM before remove()");

            aWidget.asJQuery().remove();

            assert.ok(!jQuery(id).get(0), "widget removed after remove()");
        });
    });

    test("Widgets can be appended a jQuery", function() {
        withCanvas(function(html) {
            // Arrange: a widget
            var aWidget = (function() {
                var that = widget();

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
            assert.equal(divQuery.children().get(1).id, aWidget.id(), "widget appended as last element");

        });
    });

    test("Widgets can replace content of a jQuery", function() {
        withCanvas(function(html) {
            // Arrange: a widget
            var aWidget = (function() {
                var that = widget();

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
            assert.equal(divQuery.children().length, 1, "only one child element");
            assert.equal(divQuery.children().get(0).id, aWidget.id(), "child is widget");
        });
    });

    test("Widgets can be appended to a HTML canvas", function() {
        withCanvas(function(html) {
            // Arrange: a widget
            var aWidget = (function() {
                var that = widget();

                that.renderContentOn = function(html) {
                    html.div("div").addClass("aDiv");
                };

                return that;
            })();


            // Act: append widget to canvas
            html.render(aWidget);

            // Assert: that widget was rendered in canvas
            assert.ok(html.root.asJQuery().find(".aDiv").get(0), "widget rendered inside canvas");
        });
    });

    test("isRendered()", function() {
        withCanvas(function(html) {
            // Arrange: a widget
            var aWidget = (function() {
                var that = widget();

                that.renderContentOn = function(html) {
                    html.div("div").addClass("aDiv");
                };

                return that;
            })();

            // Assert: false before render
            assert.ok(!aWidget.isRendered(), "isRendered() is false when not rendered");

            // Act: render widget
            html.render(aWidget);

            // Assert: true ehrn rendered
            assert.ok(aWidget.isRendered(), "isRendered() is true when rendereded");
        });
    });


    test("renderRoot() can be overridden in widget", function() {
        withCanvas(function(html) {

            // Arrange: a widget that renders it"s root as
            // form instead of DIV
            var aWidget = (function() {
                var my = {};
                var that = widget({}, my);

                my.renderRootOn = function (html) {
                    return html.form().id(that.id());
                };

                return that;
            })();

            // Act: render widget
            html.render(aWidget);

            // Assert: that form is rendered with id
            assert.equal(html.root.asJQuery().find("FORM").get(0).id, aWidget.id(), "root rendered as FORM");

        });
    });

	test("willAttach() and didAttach() are called upon rendering", function() {
        withCanvas(function(html) {
            var aWidget = (function() {
                var my = {};
                var that = widget({}, my);

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
            assert.ok(aWidget.willAttachCalled);
            assert.ok(aWidget.didAttachCalled);
        });
    });

	test("willUpdate() is not called when rendering", function() {
        withCanvas(function(html) {
            var aWidget = (function() {
                var my = {};
                var that = widget({}, my);

				that.willUpdateCalled = false;

				my.willUpdate = function() {
					that.willUpdateCalled = true;
				};

                return that;
            })();

            html.render(aWidget);

            assert.ok(!aWidget.willUpdateCalled);
        });
	});

	test("willUpdate() is called when updating", function() {
        withCanvas(function(html) {
            var aWidget = (function() {
                var my = {};
                var that = widget({}, my);

				that.willUpdateCalled = false;

				my.willUpdate = function() {
					that.willUpdateCalled = true;
				};

                return that;
            })();

            html.render(aWidget);
			aWidget.update();

            assert.ok(aWidget.willUpdateCalled);
        });
	});
});
