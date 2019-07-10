import htmlCanvas from "../htmlCanvas";
import jQuery from "jquery";

function withCanvas(callback) {
	$("BODY").append("<div id=\"sandbox\"></div>");
	var sandbox = jQuery("#sandbox");

	var html = htmlCanvas(sandbox);
	callback(html);

	sandbox.remove();
}

describe("htmlCanvas", function() {

	it("htmlCanvas library", function() {
		expect(htmlCanvas).toBeTruthy();
	});

	it("can be created on a jQuery", function() {
		// Arrange: a canvas on BODY
		var html = htmlCanvas("BODY");

		// Assert that:
		expect(html).toBeTruthy();
		expect(html.root).toBeTruthy();
		expect(html.root.element).toBeTruthy();
		expect($("BODY").is(html.root.element)).toBeTruthy();
	});

	it("throws exception if jQuery dont match element", function() {
		expect(function() { htmlCanvas("#notfound"); })
			.toThrowError("htmlTagBrush requires an element");
	});

	it("can render HTML tags", function() {
		withCanvas(function(html) {
			// Arrange: a Hello World! H1
			html.h1("Hello World!");

			// Assert: that H1 was rendered
			var h1El = jQuery("#sandbox > H1");

			expect(h1El.get(0)).toBeTruthy();

			// and class was set
			expect(h1El.text()).toBe("Hello World!");
		});
	});

	it("standard attributes are supported", function() {
		withCanvas(function(html) {
			// Arrange: a Google link
			html.a("Google").id("test_id").href("http://www.google.se");

			// Assert: that A was rendered
			var linkEl = jQuery("#test_id");

			expect(linkEl.get(0)).toBeTruthy();

			// and href was set
			expect(linkEl.attr("href")).toBe("http://www.google.se");
		});
	});

	it("render object literal attributes", function() {
		withCanvas(function(html) {
			// Arrange: a div with attributes
			html.div({
				id: "test_div",
				klass: "test_class",
				"special_attribute": "test"
			}, "content");

			// Assert: that DIV was rendered
			var divEl = jQuery("#test_div");

			expect(divEl.get(0)).toBeTruthy();

			// and class was set
			expect(divEl.attr("class")).toBe("test_class");

			// and class was set
			expect(divEl.is("[special_attribute]")).toBeTruthy();
		});
	});

	it("can omit attributes", function() {
		withCanvas(function(html) {
			// Arrange: a div with attributes
			html.div({
				id: "test_div",
				"special_attribute": html.omit()
			}, "content");

			// Assert: that DIV was rendered
			var divEl = jQuery("#test_div");

			expect(divEl.get(0)).toBeTruthy();

			// and class was set
			expect(!divEl.is("[special_attribute]")).toBeTruthy();
		});
	});

	it("callbacks can be attached to events", function() {
		withCanvas(function(html) {
			var clicked = false;

			// Arrange: a link with a click callback
			html.a(
				{
					id: "test_link",
					click: function() { clicked = true; }
				},
				"Click me!"
			);

			// Assert: that link was rendered
			var linkEl = jQuery("#test_link");

			expect(linkEl.get(0)).toBeTruthy();

			// and click triggers callback
			linkEl.click();

			expect(clicked).toBe(true);
		});
	});

	it("callbacks can be attached using attributes", function() {
		withCanvas(function(html) {
			var clicked = false;

			// Arrange: a link with a click callback
			html.a("Click me!").id("test_link").click(function() { clicked = true; });

			// Assert: that link was rendered
			var linkEl = jQuery("#test_link");

			expect(linkEl.get(0)).toBeTruthy();

			// and click triggers callback
			linkEl.click();

			expect(clicked).toBe(true);
		});
	});

	it("tags can be nested", function() {
		withCanvas(function(html) {
			// Arrange: a inner and outer div with a span as inner child
			html.div({"id": "outer_div"},
				html.div({"id": "inner_div"},
					html.span("Some text")
				)
			);

			// Assert: that outer div rendered
			expect(jQuery("#outer_div").get(0)).toBeTruthy();
			expect(jQuery("#inner_div").get(0)).toBeTruthy();
			expect(jQuery("#inner_div > SPAN").get(0)).toBeTruthy();
		});
	});

	it("can omit nested tags", function() {
		withCanvas(function(html) {
			// Arrange: a inner and outer div with a span as inner child
			// where the child is omited based on a flag
			var hasSomeText = false;
			html.div({"id": "outer_div"},
				html.div({"id": "inner_div"},
					hasSomeText ? html.span("Some text") : html.omit()
				)
			);

			// Assert: that outer div rendered
			expect(jQuery("#outer_div").get(0)).toBeTruthy();
			expect(jQuery("#inner_div").get(0)).toBeTruthy();
			expect(!jQuery("#inner_div > SPAN").get(0)).toBeTruthy();
		});
	});

	it("parts can be assigned to variables", function() {
		withCanvas(function(html) {
			// Arrange a button, assign to variable and then set class
			var button = html.a("Home").id("test_button").href("/");
			button.addClass("button");

			// Assert:
			expect(jQuery("#test_button").get(0)).toBeTruthy();
			expect(jQuery("#test_button").attr("class")).toBe("button");
		});
	});

	it("render() can append objects to brush", function() {
		withCanvas(function(html) {
			// Arrange: a DIV
			var div = html.div().id("aDiv");

			// Act: render a SPAN in it
			div.render(html.span("test").addClass("aSpan"));

			// Assert:
			expect(jQuery("#aDiv > .aSpan").get(0)).toBeTruthy();
		});
	});

	it("can render arrays", function() {
		withCanvas(function(html) {
			// Arrange a div with10 sub span supplied to DIV as an array
			html.div($.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(num) {
				return html.span(num.toString());
			})).id("test_div");

			// Assert:
			expect(jQuery("#test_div > SPAN").length).toBe(10);

		});
	});

	it("can render several objects using html.render", function() {
		withCanvas(function(html) {
			// Arrange
			html.div(function(html) {
				html.render(html.span("hello"), html.span("world"));
			}).id("test_div");

			// Assert:
			expect(jQuery("#test_div > SPAN").length).toBe(2);

		});
	});

	it("throws error if object to append is null or undefined", function() {
		withCanvas(function(html) {
			expect(function() { html.render(null); })
				.toThrowError();

			expect(function() { html.render(undefined); })
				.toThrowError();
		});
	});

	it("can render with html function", function() {
		withCanvas(function(html) {
			// Arrange a function that take a canvas as argument.
			function htmlFn(html2) {
				html2.span("Test").addClass("aSpan");
			}

			// and render a DIV with function as argument
			html.div({id: "aDiv"}, htmlFn);

			// Assert
			expect(jQuery("#aDiv").get(0)).toBeTruthy();
			expect(jQuery("#aDiv > .aSpan").get(0)).toBeTruthy();
		});
	});

	it("delegates rendering to objects implementing appendToBrush()", function() {
		withCanvas(function(html) {
			function appendableObject() {
				var that = {};

				that.appendToBrush = function(aTagBrush) {
					aTagBrush.render("content");
				};

				return that;
			}

			// Act: render object
			html.render(appendableObject());

			// Assert
			expect(jQuery("#sandbox").html()).toBe("content");
		});
	});

	it("rendering html strings not allowed by default", function() {
		withCanvas(function(html) {
			// Arrange:
			var htmlString = "<div id=\"unescaped\">foo</div>";

			// Act: render the string
			html.render(htmlString);

			// Assert
			expect(jQuery("#unescaped").get(0)).toBeFalsy();
		});
	});

	it("rendering of strings is escaped ", function() {
		withCanvas(function(html) {
			// Arrange:
			var htmlString = "<>&foo";

			// Act: render the string
			html.render(htmlString);

			// Assert
			expect(jQuery("#sandbox").html()).toBe("&lt;&gt;&amp;foo");
		});
	});

	it("rendering using `html()` does not escape ", function() {
		withCanvas(function(html) {
			// Arrange:
			var htmlString = "<div>hello</div>";

			// Act: render the string
			html.div({id: "not-escaped"}).html(htmlString);

			// Assert
			expect(jQuery("#not-escaped").html()).toBe(htmlString);
		});
	});

	it("element() returns brush element", function() {
		withCanvas(function(html) {
			// Arrange: a heading
			var h1 = html.h1().id("aHeading");

			// Assert
			expect(h1.element).toBe(jQuery("#aHeading").get(0));
		});
	});

	it("setAttribute() get/set style using key/value", function() {
		withCanvas(function(html) {
			// Arrange: a heading with id
			var h1 = html.h1().setAttribute("id", "aHeading");

			// Assert: id set
			expect(h1.asJQuery().attr("id")).toBe(("aHeading"));
		});
	});

	it("css() get/set style", function() {
		withCanvas(function(html) {
			// Arrange: a div
			var div = html.div();

			div.css("width", "100px");

			expect(div.asJQuery().css("width")).toBe("100px");
		});
	});

	it("attr() get/set style", function() {
		withCanvas(function(html) {
			// Arrange: a heading with id (set using map)
			var h1 = html.h1().attr({id: "aHeading"});

			// Assert: that id is set
			expect(h1.asJQuery().attr("id")).toBe("aHeading");
		});
	});

	it("addClass()/removeClass() add/remove class", function() {
		withCanvas(function(html) {
			// Arrange: a heading
			var h1 = html.h1().id("aHeading");

			// addClass()
			h1.addClass("foo");

			expect(h1.asJQuery().hasClass("foo")).toBeTruthy();

			// removeClass()
			h1.removeClass("foo");

			expect(!h1.asJQuery().hasClass("foo")).toBeTruthy();
		});
	});

	it("asJQuery() returns jQuery that match brush element", function() {
		withCanvas(function(html) {
			// Arrange: a heading
			var h1 = html.h1().id("aHeading");

			// Assert
			expect(h1.asJQuery().get(0)).toBe(jQuery("#aHeading").get(0));
		});
	});

	//TODO: allow or throw exception?
	it("can render almost everything", function() {
		withCanvas(function(html) {
			html.render(0); // toString()
			html.render(3.14159265359); // toString()
			html.render("<div>test</div>"); // => DIV element
			html.render({}); // as attributes but since it have no keys => nothing
			html.render([]); // as array but since empty => nothing

			expect(true).toBeTruthy();
		});
	});
});
