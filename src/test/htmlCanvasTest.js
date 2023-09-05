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

	it("htmlCanvas library", () => {
		expect(htmlCanvas).toBeTruthy();
	});

	it("can be created on a jQuery", () => {
		// Arrange: a canvas on BODY
		var html = htmlCanvas("BODY");

		// Assert that:
		expect(html).toBeTruthy();
		expect(html.root).toBeTruthy();
		expect(html.root.element).toBeTruthy();
		expect($("BODY").is(html.root.element)).toBeTruthy();
	});

	it("throws exception if jQuery dont match element", () => {
		expect(() => { htmlCanvas("#notfound"); })
			.toThrowError("htmlTagBrush requires an element");
	});

	it("can render HTML tags", () => {
		withCanvas((html) => {
			// Arrange: a Hello World! H1
			html.h1("Hello World!");

			// Assert: that H1 was rendered
			var h1El = jQuery("#sandbox > H1");

			expect(h1El.get(0)).toBeTruthy();

			// and class was set
			expect(h1El.text()).toBe("Hello World!");
		});
	});

	it("standard attributes are supported", () => {
		withCanvas((html) => {
			// Arrange: a Google link
			html.a("Google").id("test_id").href("http://www.google.se");

			// Assert: that A was rendered
			var linkEl = jQuery("#test_id");

			expect(linkEl.get(0)).toBeTruthy();

			// and href was set
			expect(linkEl.attr("href")).toBe("http://www.google.se");
		});
	});

	it("render object literal attributes", () => {
		withCanvas((html) => {
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

	describe("should omit an attribute", () => {
		it("when value is html.omit()", () => {
			withCanvas((html) => {
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

		it("when value is undefined", () => {
			withCanvas((html) => {
				let attributeName = "data-test";

				let div = html.div({[attributeName]: undefined});

				expect(div.element.hasAttribute("data-test")).toBeFalse();
			});
		});

		it("when value is null", () => {
			withCanvas((html) => {
				let attributeName = "data-test";

				let div = html.div({[attributeName]: null});

				expect(div.element.hasAttribute("data-test")).toBeFalse();
			});
		});

		it("when value if false", () => {
			withCanvas((html) => {
				let attributeName = "data-test";

				let div = html.div({[attributeName]: false});

				expect(div.element.hasAttribute("data-test")).toBeFalse();
			});
		});

		it("when value is the empty string", () => {
			withCanvas((html) => {
				let attributeName = "data-test";

				let div = html.div({[attributeName]: ""});

				expect(div.element.hasAttribute("data-test")).toBeFalse();
			});
		});
	});

	it("callbacks can be attached to events", () => {
		withCanvas((html) => {
			var clicked = false;

			// Arrange: a link with a click callback
			html.a(
				{
					id: "test_link",
					click: () => { clicked = true; }
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

	it("callbacks can be attached using attributes", () => {
		withCanvas((html) => {
			var clicked = false;

			// Arrange: a link with a click callback
			html.a("Click me!").id("test_link").click(() => { clicked = true; });

			// Assert: that link was rendered
			var linkEl = jQuery("#test_link");

			expect(linkEl.get(0)).toBeTruthy();

			// and click triggers callback
			linkEl.click();

			expect(clicked).toBe(true);
		});
	});

	it("tags can be nested", () => {
		withCanvas((html) => {
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

	it("can omit nested tags", () => {
		withCanvas((html) => {
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

	it("parts can be assigned to variables", () => {
		withCanvas((html) => {
			// Arrange a button, assign to variable and then set class
			var button = html.a("Home").id("test_button").href("/");
			button.addClass("button");

			// Assert:
			expect(jQuery("#test_button").get(0)).toBeTruthy();
			expect(jQuery("#test_button").attr("class")).toBe("button");
		});
	});

	it("render() can append objects to brush", () => {
		withCanvas((html) => {
			// Arrange: a DIV
			var div = html.div().id("aDiv");

			// Act: render a SPAN in it
			div.render(html.span("test").addClass("aSpan"));

			// Assert:
			expect(jQuery("#aDiv > .aSpan").get(0)).toBeTruthy();
		});
	});

	it("can render arrays", () => {
		withCanvas((html) => {
			// Arrange a div with10 sub span supplied to DIV as an array
			html.div($.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (num) => {
				return html.span(num.toString());
			})).id("test_div");

			// Assert:
			expect(jQuery("#test_div > SPAN").length).toBe(10);

		});
	});

	it("can render several objects using html.render", () => {
		withCanvas((html) => {
			// Arrange
			html.div((html) => {
				html.render(html.span("hello"), html.span("world"));
			}).id("test_div");

			// Assert:
			expect(jQuery("#test_div > SPAN").length).toBe(2);

		});
	});

	it("throws error if object to append is null or undefined", () => {
		withCanvas((html) => {
			expect(() => { html.render(null); })
				.toThrowError();

			expect(() => { html.render(undefined); })
				.toThrowError();
		});
	});

	it("can render with html function", () => {
		withCanvas((html) => {
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

	it("delegates rendering to objects implementing appendToBrush()", () => {
		withCanvas((html) => {
			function appendableObject() {
				var that = {};

				that.appendToBrush = (aTagBrush) => {
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

	it("rendering html strings not allowed by default", () => {
		withCanvas((html) => {
			// Arrange:
			var htmlString = "<div id=\"unescaped\">foo</div>";

			// Act: render the string
			html.render(htmlString);

			// Assert
			expect(jQuery("#unescaped").get(0)).toBeFalsy();
		});
	});

	it("rendering of strings is escaped ", () => {
		withCanvas((html) => {
			// Arrange:
			var htmlString = "<>&foo";

			// Act: render the string
			html.render(htmlString);

			// Assert
			expect(jQuery("#sandbox").html()).toBe("&lt;&gt;&amp;foo");
		});
	});

	it("rendering using `html()` does not escape ", () => {
		withCanvas((html) => {
			// Arrange:
			var htmlString = "<div>hello</div>";

			// Act: render the string
			html.div({id: "not-escaped"}).html(htmlString);

			// Assert
			expect(jQuery("#not-escaped").html()).toBe(htmlString);
		});
	});

	it("element() returns brush element", () => {
		withCanvas((html) => {
			// Arrange: a heading
			var h1 = html.h1().id("aHeading");

			// Assert
			expect(h1.element).toBe(jQuery("#aHeading").get(0));
		});
	});

	it("setAttribute() get/set style using key/value", () => {
		withCanvas((html) => {
			// Arrange: a heading with id
			var h1 = html.h1().setAttribute("id", "aHeading");

			// Assert: id set
			expect(h1.asJQuery().attr("id")).toBe(("aHeading"));
		});
	});

	it("css() get/set style", () => {
		withCanvas((html) => {
			// Arrange: a div
			var div = html.div();

			div.css("width", "100px");

			expect(div.asJQuery().css("width")).toBe("100px");
		});
	});

	it("attr() get/set style", () => {
		withCanvas((html) => {
			// Arrange: a heading with id (set using map)
			var h1 = html.h1().attr({id: "aHeading"});

			// Assert: that id is set
			expect(h1.asJQuery().attr("id")).toBe("aHeading");
		});
	});

	it("addClass()/removeClass() add/remove class", () => {
		withCanvas((html) => {
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

	it("addClass() with a complex argument", () => {
		withCanvas((html) => {
			let h1 = html.h1();

			h1.addClass(["foo", {disabled: () => false}, ["bar"]]);

			expect(h1.element.className).toEqual("foo disabled bar");
		});
	});

	it("removeClass() with a complex argument", () => {
		withCanvas((html) => {
			let h1 = html.h1({class: "foo baz disabled bar"});

			h1.removeClass(["foo", {disabled: () => false}, ["bar"]]);

			expect(h1.element.className).toEqual("baz");
		});
	});

	it("asJQuery() returns jQuery that match brush element", () => {
		withCanvas((html) => {
			// Arrange: a heading
			var h1 = html.h1().id("aHeading");

			// Assert
			expect(h1.asJQuery().get(0)).toBe(jQuery("#aHeading").get(0));
		});
	});

	//TODO: allow or throw exception?
	it("can render almost everything", () => {
		withCanvas((html) => {
			html.render(0); // toString()
			html.render(3.14159265359); // toString()
			html.render("<div>test</div>"); // => DIV element
			html.render({}); // as attributes but since it have no keys => nothing
			html.render([]); // as array but since empty => nothing

			expect(true).toBeTruthy();
		});
	});

	describe("svg tags", () => {
		it("can render an SVG element with svgTag", () => {
			withCanvas((html) => {
				let tag = html.svgTag("svg");

				expect(tag.element.namespaceURI).toEqual("http://www.w3.org/2000/svg");
			});
		});

		it("can render the svg-specific tags", () => {
			withCanvas((html) => {
				["svg", "circle", "path", "polygon", "rect", "text"].forEach((tagName) => {
					let tag = html[tagName]();

					expect(tag.element.namespaceURI).toEqual("http://www.w3.org/2000/svg");
					expect(tag.element.tagName.toLowerCase()).toEqual(tagName);
				});
			});
		});
	});

	describe("class names", () => {
		it("assign a single class name", () => {
			expectClassNamesToBecomeCSSClass({input: "foo", expectedOutput: "foo"});
		});

		it("assign 2 class names in a single string", () => {
			expectClassNamesToBecomeCSSClass({input: "foo bar", expectedOutput: "foo bar"});
		});

		it("assign class names in an array", () => {
			expectClassNamesToBecomeCSSClass({input: ["foo", "bar"], expectedOutput: "foo bar"});
		});

		it("assign class names in an object", () => {
			expectClassNamesToBecomeCSSClass({input: {foo: true, bar: true}, expectedOutput: "foo bar"});
		});

		it("ignore class names in an object whose value is false", () => {
			expectClassNamesToBecomeCSSClass({input: {foo: true, bar: false}, expectedOutput: "foo"});
		});

		it("assign class names in an object inside an array", () => {
			expectClassNamesToBecomeCSSClass({input: [{foo: true}, {bar: false}], expectedOutput: "foo"});
		});

		it("assign class names in an array of mixed types", () => {
			expectClassNamesToBecomeCSSClass({
				input: [
					"foo",
					{bar: true},
					{baz: false},
					"yes no",
					["another-yes", "another-no"]
				],
				expectedOutput: "foo bar yes no another-yes another-no"});
		});

		function expectClassNamesToBecomeCSSClass({input, expectedOutput}) {
			withCanvas((html) => {
				let tag = html.div({class: input});

				expect(tag.element.className).toEqual(expectedOutput);
			});
		}
	});

	it("render() accepts a ref attribute to retrieve the DOM element", () => {
		withCanvas((html) => {
			let rootRef = {};

			html.render(
				{ref: rootRef},
				(html) => html.p("foo")
			);

			expect(rootRef.current.innerHTML).toEqual("<p>foo</p>");
		});
	});

	it("div() accepts a ref attribute to retrieve the DOM element", () => {
		withCanvas((html) => {
			let rootRef = {};

			html.div(
				{ref: rootRef},
				(html) => html.p("foo")
			);

			expect(rootRef.current.outerHTML).toEqual("<div><p>foo</p></div>");
		});
	});
});
