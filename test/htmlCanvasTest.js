define(["widgetjs/htmlCanvas"], function(htmlCanvas) {

    // helper functions

    var withDOMElement = function(callback) {
        var id = "canvas_testing";
        var h1 = htmlCanvas(jQuery('body')).h1("hello world").id(id);
        callback(h1, id);
        jQuery("#"+id).remove();
    };

    // actual tests

    test("testing existance", function() {
        ok(htmlCanvas, "HTMLCanvas loaded");
        ok(jQuery, "jQuery loaded as a dependency");
    });

    test("testing append to jQuery", function() {
        withDOMElement(function(h1, id) {
            ok(jQuery("#"+id).get(0), "DOM element inserted");
        });
    });

    test("testing element() accessor", function() {
        withDOMElement(function(h1, id) {
            equal(jQuery("#"+id).get(0), h1.element());
        });
    });

    test("testing asJQuery()", function() {
        withDOMElement(function(h1, id) {
            equal(jQuery("#"+id).get(0), h1.asJQuery().get(0));
        });
    });

    test("testing contents()", function () {
        withDOMElement(function(h1, id) {
            h1.contents("some contents");
            equal(jQuery("#"+id).html(), "some contents");
        });
    });

    test("testing addClass()/removeClass()", function () {
        withDOMElement(function(h1) {
            h1.addClass('foo');
            ok(h1.asJQuery().hasClass('foo'));

            h1.removeClass('foo');
            ok(!h1.asJQuery().hasClass('foo'));
        });
    });

    test("testing css()", function () {
        withDOMElement(function(h1) {
            h1.css('background-color', 'red');
            equal(h1.asJQuery().css('background-color'), 'rgb(255, 0, 0)');
        });
    });


    test("testing attributes", function() {
        withDOMElement(function(h1, id) {
            h1.title("foo");
            equal(h1.asJQuery().attr("title"), ("foo"));
        });
    });
});
