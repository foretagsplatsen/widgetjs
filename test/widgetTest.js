define(["widgetjs/widget", "jquery"], function(widgetjswidget, jQuery) {

    // helper functions

    var withDOMElement = function(callback) {
        var id = "canvas_testing";
        var h1 =    htmlCanvas(jQuery('body')).h1("hello world").id(id);
        callback(h1, id);
        jQuery("#"+id).remove();
    };

    var withWidget = function(callback) {
        var my = {};
        var widget = widgetjswidget(my);
        widget.renderContentOn = function(html) {
            html.h1('Hello world');
        };
        widget.appendTo(jQuery('body'));
        callback(widget, my);

        widget.asJQuery().empty();
    };

    // actual tests

    module("widget");


    test("testing unique id generator", function() {
        withWidget(function(widget) {
            for( var i=0; i<1000;i++) {
                ok(widgetjswidget().id() !== widget.id(), "Widget id should be unique");
            }
        });
    });

    test("local links", function() {
        // keep a reference to protected methods using 'my';
        var my = {};
        var widget = widgetjswidget({}, my);

        equal(my.linkTo('foo/bar'), '#!/foo/bar');

        my.redirectTo('foo/bar');
        equal(window.location.hash, '#!/foo/bar');
    });

    test("Rendering", function() {
        withWidget(function(widget) {
            ok(jQuery("#"+widget.id()).get(0), "widget built");
        });
    });

    test("Updating", function() {
        withWidget(function(widget) {
            widget.renderContentOn = function(html) {
                html.div().id('foo');
            };
            widget.update();
            ok(jQuery("#foo").get(0), "widget built");
        });
    });

    test("Removing", function() {
        withWidget(function(widget, my) {
            widget.renderContentOn = function(html) {
                html.div().id('foo');
            };

            widget.update();
            ok(jQuery("#foo").get(0), "widget built");

            widget.asJQuery().empty();
            ok(!jQuery("#foo").get(0), "widget removed");
        });
    });
});
