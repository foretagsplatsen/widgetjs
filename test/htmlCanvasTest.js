define(["widgetjs/htmlCanvas", "jquery"], function(htmlCanvas, jQuery) {

    // helper functions

    var withDOMElement = function(callback) {
        var id = "canvas_testing";
        var h1 = htmlCanvas(jQuery('body')).h1("hello world").id(id);
        callback(h1, id);
        jQuery("#"+id).remove();
    };

    var withCanvas = function(callback) {
        $("BODY").append("<div id='sandbox'></div>");
        var sandbox = jQuery('#sandbox');

        var html = htmlCanvas(sandbox);
        callback(html);
        
        sandbox.remove();
    };

    module("htmlCanvas");

    test("htmlCanvas library", function() {
        ok(htmlCanvas, "exported correcly.");
    });

    test("can be created on a jQuery", function() {
        // Arrange: a canvas on BODY
        var html = htmlCanvas($("BODY"));

        // Assert that:
        ok(html, 'canvas was created');
        ok(html.root, 'have a root');
        ok(html.root.element(), 'have an element');
        ok($("BODY").is(html.root.element()), 'element is BODY.');
    });


    test("can render HTML tags", function() {
        withCanvas(function(html) {
            // Arrange: a Hello World! H1
            html.h1('Hello World!');
            
            // Assert: that H1 was rendered
            var h1El = jQuery("#sandbox > H1");
            ok(h1El.get(0), 'element rendered');

            // and class was set
            equal(h1El.text(), 'Hello World!', 'text rendered');
        });
    });

    test("standard attributes are supported", function() {
        withCanvas(function(html) {
            // Arrange: a Google link
            html.a('Google').id('test_id').href('http://www.google.se');
            
            // Assert: that A was rendered
            var linkEl = jQuery("#test_id");
            ok(linkEl.get(0), 'element rendered');

            // and href was set
            equal(linkEl.attr('href'), 'http://www.google.se', 'href attribute rendered');
        });
    });

    test("render object literal attributes", function() {
        withCanvas(function(html) {
            // Arrange: a div with attributes
            html.div({id: 'test_div', 'class' : 'test_class', 'special_attribute' : 'test'}, 'content');
            
            // Assert: that DIV was rendered
            var divEl = jQuery("#test_div");
            ok(divEl.get(0), 'element rendered');

            // and class was set
            equal(divEl.attr('class'), 'test_class', 'attribute class rendered');

            // and class was set
            equal(divEl.attr('special_attribute'), 'test', 'attribute special_attribute rendered');
        });
    });


    test("callbacks can be attached to events", function() {
        withCanvas(function(html) {
            var clicked = false;

            // Arrange: a link with a click callback
            html.a('Click me!').id('test_link').click(function() { clicked = true; });
            
            // Assert: that link was rendered
            var linkEl = jQuery("#test_link");
            ok(linkEl.get(0), 'element rendered');

            // and click triggers callback
            linkEl.click(); // execute click
            equal(clicked, true, 'click callback executed');
        });
    });

    test("tags can be nested", function() {
        withCanvas(function(html) {
            // Arrange: a inner and outer div with a span as inner child
            html.div({'id' : 'outer_div'},
                html.div({'id' : 'inner_div'},
                    html.span('Some text')
                )
            );
            
            // Assert: that outer div rendered
            ok(jQuery("#outer_div").get(0), 'outer div rendered');
            ok(jQuery("#inner_div").get(0), 'inner div rendered');
            ok(jQuery("#inner_div > SPAN").get(0), 'inner SPAN rendered');
        });
    });

    test("parts can be assigned to variables", function() {
        withCanvas(function(html) {
            // Arrange a button, assign to variable and then set class
            var button = html.a('Home').id('test_button').href('/');
            button.addClass('button');
            
            // Assert:
            ok(jQuery("#test_button").get(0), 'button rendered');
           equal(jQuery('#test_button').attr('class'), 'button', 'attribute class rendered');

        });
    });

    test("parts can be assigned to variables", function() {
        withCanvas(function(html) {
            // Arrange a button, assign to variable and then set class
            var button = html.a('Home').id('test_button').href('/');
            button.addClass('button');
            
            // Assert:
            ok(jQuery("#test_button").get(0), 'button rendered');
           equal(jQuery('#test_button').attr('class'), 'button', 'attribute class rendered');

        });
    });

    test("can render arrays", function() {
        withCanvas(function(html) {
            // Arrange a div with10 sub span supplied to DIV as an array
            var div = html.div($.map([1,2,3,4,5,6,7,8,9,10], function(num) {
                return html.span(num.toString());
            })).id('test_div');
            
            // Assert:
            equal(jQuery("#test_div > SPAN").length, 10, 'div rendered with children from array');

        });
    });

    test("can render with html function", function() {
        withCanvas(function(html) {
            // Arrange a function that take a canvas as argument.
            var htmlFn = function(html2) {
                html2.span('Test').addClass('aSpan');
            };

            // and render a DIV with function as argument
            html.div({id : 'aDiv'}, htmlFn);
            
            // Assert
            ok(jQuery("#aDiv").get(0), 'div was rendered');
            ok(jQuery("#aDiv > .aSpan").get(0), 'child div from function was rendered inside div');
        });
    });

    test("element() returns brush element", function() {
        withCanvas(function(html) {
            // Arrange: a heading
            var h1 = html.h1().id('aHeading');

            // Assert
            equal(h1.element(), jQuery("#aHeading").get(0), 'element acessor returns correct element.');
        });
    });

    test("asJQuery() returns jQuery that match brush element", function() {
        withCanvas(function(html) {
            // Arrange: a heading
            var h1 = html.h1().id('aHeading');

            // Assert
            equal(h1.asJQuery().get(0), jQuery("#aHeading").get(0), 'asJQuery() acessor returns hquery that match element.');
        });
    });

    test("addClass()/removeClass() add/remove class", function () {
        withCanvas(function(html) {
            // Arrange: a heading
            var h1 = html.h1().id('aHeading');

            // addClass()
            h1.addClass('foo');
            ok(h1.asJQuery().hasClass('foo'));

            // removeClass()
            h1.removeClass('foo');
            ok(!h1.asJQuery().hasClass('foo'));
        });
    });

    test("css() get/set style", function () {
        withCanvas(function(html) {
            // Arrange: a heading
            var h1 = html.h1().id('aHeading');

            h1.css('background-color', 'red');
            equal(h1.asJQuery().css('background-color'), 'rgb(255, 0, 0)');
        });
    });

    test("attr() get/set style", function () {
        withCanvas(function(html) {
            // Arrange: a heading
            var h1 = html.h1().id('aHeading');

            h1.title("foo");
            equal(h1.asJQuery().attr("title"), ("foo"));
        });
    });
});
