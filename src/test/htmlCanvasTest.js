import { describe, expect, it } from "vitest";
import htmlCanvas from "../htmlCanvas.js";
import jQuery from "jquery";

function withCanvas(callback) {
	jQuery("BODY").append('<div id="sandbox"></div>');
	const sandbox = jQuery("#sandbox");

	const html = htmlCanvas(sandbox);
	callback(html);

	sandbox.remove();
}

describe("htmlCanvas", () => {
	it("htmlCanvas library", () => {
		expect(htmlCanvas).toBeTruthy();
	});

	it("can be created on a jQuery", () => {
		// Arrange: a canvas on BODY
		const html = htmlCanvas("BODY");

		// Assert that:
		expect(html).toBeTruthy();
		expect(html.root).toBeTruthy();
		expect(html.root.element).toBeTruthy();
		expect(jQuery("BODY").is(html.root.element)).toBeTruthy();
	});

	it("throws exception if jQuery dont match element", () => {
		expect(() => {
			htmlCanvas("#notfound");
		}).toThrow("htmlTagBrush requires an element");
	});

	it("can render HTML tags", () => {
		expect.assertions(2);

		withCanvas((html) => {
			// Arrange: a Hello World! H1
			html.h1("Hello World!");

			// Assert: that H1 was rendered
			const h1El = jQuery("#sandbox > H1");

			expect(h1El.get(0)).toBeTruthy();

			// and class was set
			expect(h1El.text()).toBe("Hello World!");
		});
	});

	it("standard attributes are supported", () => {
		expect.assertions(2);

		withCanvas((html) => {
			// Arrange: a Google link
			html.a("Google").id("test_id").href("https://www.google.se");

			// Assert: that A was rendered
			const linkEl = jQuery("#test_id");

			expect(linkEl.get(0)).toBeTruthy();

			// and href was set
			expect(linkEl.attr("href")).toBe("https://www.google.se");
		});
	});

	it("render object literal attributes", () => {
		expect.assertions(3);

		withCanvas((html) => {
			// Arrange: a div with attributes
			html.div(
				{
					id: "test_div",
					klass: "test_class",
					special_attribute: "test",
				},
				"content",
			);

			// Assert: that DIV was rendered
			const divEl = jQuery("#test_div");

			expect(divEl.get(0)).toBeTruthy();

			// and class was set
			expect(divEl.attr("class")).toBe("test_class");

			// and class was set
			expect(divEl.is("[special_attribute]")).toBeTruthy();
		});
	});

	describe("should omit an attribute", () => {
		it("when value is html.omit()", () => {
			expect.assertions(2);

			withCanvas((html) => {
				// Arrange: a div with attributes
				html.div(
					{
						id: "test_div",
						special_attribute: html.omit(),
					},
					"content",
				);

				// Assert: that DIV was rendered
				const divEl = jQuery("#test_div");

				expect(divEl.get(0)).toBeTruthy();

				// and class was set
				expect(!divEl.is("[special_attribute]")).toBeTruthy();
			});
		});

		it("when value is undefined", () => {
			expect.assertions(1);

			withCanvas((html) => {
				const attributeName = "data-test";

				const div = html.div({ [attributeName]: undefined });

				expect(div.element.hasAttribute("data-test")).toBe(false);
			});
		});

		it("when value is null", () => {
			expect.assertions(1);

			withCanvas((html) => {
				const attributeName = "data-test";

				const div = html.div({ [attributeName]: null });

				expect(div.element.hasAttribute("data-test")).toBe(false);
			});
		});

		it("when value if false", () => {
			expect.assertions(1);

			withCanvas((html) => {
				const attributeName = "data-test";

				const div = html.div({ [attributeName]: false });

				expect(div.element.hasAttribute("data-test")).toBe(false);
			});
		});

		it("when value is the empty string", () => {
			expect.assertions(1);

			withCanvas((html) => {
				const attributeName = "data-test";

				const div = html.div({ [attributeName]: "" });

				expect(div.element.hasAttribute("data-test")).toBe(false);
			});
		});
	});

	it("callbacks can be attached to events", () => {
		expect.assertions(2);

		withCanvas((html) => {
			let clicked = false;

			// Arrange: a link with a click callback
			html.a(
				{
					id: "test_link",
					click: () => {
						clicked = true;
					},
				},
				"Click me!",
			);

			// Assert: that link was rendered
			const linkEl = jQuery("#test_link");

			expect(linkEl.get(0)).toBeTruthy();

			// and click triggers callback
			linkEl.click();

			expect(clicked).toBe(true);
		});
	});

	it("callbacks can be attached using attributes", () => {
		expect.assertions(2);

		withCanvas((html) => {
			let clicked = false;

			// Arrange: a link with a click callback
			html.a("Click me!")
				.id("test_link")
				.click(() => {
					clicked = true;
				});

			// Assert: that link was rendered
			const linkEl = jQuery("#test_link");

			expect(linkEl.get(0)).toBeTruthy();

			// and click triggers callback
			linkEl.click();

			expect(clicked).toBe(true);
		});
	});

	it("tags can be nested", () => {
		expect.assertions(3);

		withCanvas((html) => {
			// Arrange: a inner and outer div with a span as inner child
			html.div(
				{ id: "outer_div" },
				html.div({ id: "inner_div" }, html.span("Some text")),
			);

			// Assert: that outer div rendered
			expect(jQuery("#outer_div").get(0)).toBeTruthy();
			expect(jQuery("#inner_div").get(0)).toBeTruthy();
			expect(jQuery("#inner_div > SPAN").get(0)).toBeTruthy();
		});
	});

	it("can omit nested tags", () => {
		expect.assertions(3);

		withCanvas((html) => {
			// Arrange: a inner and outer div with a span as inner child
			// where the child is omitted
			html.div(
				{ id: "outer_div" },
				html.div({ id: "inner_div" }, html.omit()),
			);

			// Assert: that outer div rendered
			expect(jQuery("#outer_div").get(0)).toBeTruthy();
			expect(jQuery("#inner_div").get(0)).toBeTruthy();
			expect(!jQuery("#inner_div > SPAN").get(0)).toBeTruthy();
		});
	});

	it("parts can be assigned to variables", () => {
		expect.assertions(2);

		withCanvas((html) => {
			// Arrange a button, assign to variable and then set class
			const button = html.a("Home").id("test_button").href("/");
			button.addClass("button");

			// Assert:
			expect(jQuery("#test_button").get(0)).toBeTruthy();
			expect(jQuery("#test_button").attr("class")).toBe("button");
		});
	});

	it("render() can append objects to brush", () => {
		expect.assertions(1);

		withCanvas((html) => {
			// Arrange: a DIV
			const div = html.div().id("aDiv");

			// Act: render a SPAN in it
			div.render(html.span("test").addClass("aSpan"));

			// Assert:
			expect(jQuery("#aDiv > .aSpan").get(0)).toBeTruthy();
		});
	});

	it("can render arrays", () => {
		expect.assertions(1);

		withCanvas((html) => {
			// Arrange a div with10 sub span supplied to DIV as an array
			html.div(
				jQuery.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (num) =>
					html.span(num.toString()),
				),
			).id("test_div");

			// Assert:
			expect(jQuery("#test_div > SPAN")).toHaveLength(10);
		});
	});

	it("can render several objects using html.render", () => {
		expect.assertions(1);

		withCanvas((html) => {
			// Arrange
			html.div((html) => {
				html.render(html.span("hello"), html.span("world"));
			}).id("test_div");

			// Assert:
			expect(jQuery("#test_div > SPAN")).toHaveLength(2);
		});
	});

	it("throws error if object to append is null or undefined", () => {
		expect.assertions(2);

		withCanvas((html) => {
			expect(() => {
				html.render(null);
			}).toThrow(
				"Cannot read properties of null (reading 'appendToBrush')",
			);

			expect(() => {
				html.render(undefined);
			}).toThrow(
				"Cannot read properties of undefined (reading 'appendToBrush')",
			);
		});
	});

	it("can render with html function", () => {
		expect.assertions(2);

		withCanvas((html) => {
			// Arrange a function that take a canvas as argument.
			function htmlFn(html2) {
				html2.span("Test").addClass("aSpan");
			}

			// and render a DIV with function as argument
			html.div({ id: "aDiv" }, htmlFn);

			// Assert
			expect(jQuery("#aDiv").get(0)).toBeTruthy();
			expect(jQuery("#aDiv > .aSpan").get(0)).toBeTruthy();
		});
	});

	it("delegates rendering to objects implementing appendToBrush()", () => {
		expect.assertions(1);

		withCanvas((html) => {
			function appendableObject() {
				const that = {};

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
		expect.assertions(1);

		withCanvas((html) => {
			// Arrange:
			const htmlString = '<div id="unescaped">foo</div>';

			// Act: render the string
			html.render(htmlString);

			// Assert
			expect(jQuery("#unescaped").get(0)).toBeFalsy();
		});
	});

	it("rendering of strings is escaped", () => {
		expect.assertions(1);

		withCanvas((html) => {
			// Arrange:
			const htmlString = "<>&foo";

			// Act: render the string
			html.render(htmlString);

			// Assert
			expect(jQuery("#sandbox").html()).toBe("&lt;&gt;&amp;foo");
		});
	});

	it("rendering using `html()` does not escape", () => {
		expect.assertions(1);

		withCanvas((html) => {
			// Arrange:
			const htmlString = "<div>hello</div>";

			// Act: render the string
			html.div({ id: "not-escaped" }).html(htmlString);

			// Assert
			expect(jQuery("#not-escaped").html()).toBe(htmlString);
		});
	});

	it("element() returns brush element", () => {
		expect.assertions(1);

		withCanvas((html) => {
			// Arrange: a heading
			const h1 = html.h1().id("aHeading");

			// Assert
			expect(h1.element).toBe(jQuery("#aHeading").get(0));
		});
	});

	it("setAttribute() get/set style using key/value", () => {
		expect.assertions(1);

		withCanvas((html) => {
			// Arrange: a heading with id
			const h1 = html.h1().setAttribute("id", "aHeading");

			// Assert: id set
			expect(h1.asJQuery().attr("id")).toBe("aHeading");
		});
	});

	it("css() get/set style", () => {
		expect.assertions(1);

		withCanvas((html) => {
			// Arrange: a div
			const div = html.div();

			div.css("width", "100px");

			expect(div.asJQuery().css("width")).toBe("100px");
		});
	});

	it("attr() get/set style", () => {
		expect.assertions(1);

		withCanvas((html) => {
			// Arrange: a heading with id (set using map)
			const h1 = html.h1().attr({ id: "aHeading" });

			// Assert: that id is set
			expect(h1.asJQuery().attr("id")).toBe("aHeading");
		});
	});

	it("addClass()/removeClass() add/remove class", () => {
		expect.assertions(2);

		withCanvas((html) => {
			// Arrange: a heading
			const h1 = html.h1().id("aHeading");

			// addClass()
			h1.addClass("foo");

			expect(h1.asJQuery().hasClass("foo")).toBeTruthy();

			// removeClass()
			h1.removeClass("foo");

			expect(!h1.asJQuery().hasClass("foo")).toBeTruthy();
		});
	});

	it("addClass() with a complex argument", () => {
		expect.assertions(1);

		withCanvas((html) => {
			const h1 = html.h1();

			h1.addClass(["foo", { disabled: () => false }, ["bar"]]);

			expect(h1.element.className).toBe("foo disabled bar");
		});
	});

	it("removeClass() with a complex argument", () => {
		expect.assertions(1);

		withCanvas((html) => {
			const h1 = html.h1({ class: "foo baz disabled bar" });

			h1.removeClass(["foo", { disabled: () => false }, ["bar"]]);

			expect(h1.element.className).toBe("baz");
		});
	});

	it("asJQuery() returns jQuery that match brush element", () => {
		expect.assertions(1);

		withCanvas((html) => {
			// Arrange: a heading
			const h1 = html.h1().id("aHeading");

			// Assert
			expect(h1.asJQuery().get(0)).toBe(jQuery("#aHeading").get(0));
		});
	});

	it("can render almost everything", () => {
		expect.assertions(1);

		withCanvas((html) => {
			html.render(0); // toString()
			html.render(3.141_592_653_59); // toString()
			html.render("<div>test</div>"); // => DIV element
			html.render({}); // as attributes but since it have no keys => nothing
			html.render([]); // as array but since empty => nothing

			expect(true).toBeTruthy();
		});
	});

	describe("svg tags", () => {
		it("can render an SVG element with svgTag", () => {
			expect.assertions(1);

			withCanvas((html) => {
				const tag = html.svgTag("svg");

				expect(tag.element.namespaceURI).toBe(
					"http://www.w3.org/2000/svg",
				);
			});
		});

		it("can render the svg-specific tags", () => {
			expect.assertions(12);

			withCanvas((html) => {
				["svg", "circle", "path", "polygon", "rect", "text"].forEach(
					(tagName) => {
						const tag = html[tagName]();

						expect(tag.element.namespaceURI).toBe(
							"http://www.w3.org/2000/svg",
						);

						expect(tag.element.tagName.toLowerCase()).toStrictEqual(
							tagName,
						);
					},
				);
			});
		});
	});

	/* eslint-disable sonarjs/assertions-in-tests -- the expectation isn't visible to the rule but exists */
	describe("class names", () => {
		it("assign a single class name", () => {
			expectClassNamesToBecomeCSSClass({
				input: "foo",
				expectedOutput: "foo",
			});
		});

		it("assign 2 class names in a single string", () => {
			expectClassNamesToBecomeCSSClass({
				input: "foo bar",
				expectedOutput: "foo bar",
			});
		});

		it("assign class names in an array", () => {
			expectClassNamesToBecomeCSSClass({
				input: ["foo", "bar"],
				expectedOutput: "foo bar",
			});
		});

		it("assign class names in an object", () => {
			expectClassNamesToBecomeCSSClass({
				input: { foo: true, bar: true },
				expectedOutput: "foo bar",
			});
		});

		it("ignore class names in an object whose value is false", () => {
			expectClassNamesToBecomeCSSClass({
				input: { foo: true, bar: false },
				expectedOutput: "foo",
			});
		});

		it("assign class names in an object inside an array", () => {
			expectClassNamesToBecomeCSSClass({
				input: [{ foo: true }, { bar: false }],
				expectedOutput: "foo",
			});
		});

		it("assign class names in an array of mixed types", () => {
			expectClassNamesToBecomeCSSClass({
				input: [
					"foo",
					{ bar: true },
					{ baz: false },
					"yes no",
					["another-yes", "another-no"],
				],
				expectedOutput: "foo bar yes no another-yes another-no",
			});
		});

		function expectClassNamesToBecomeCSSClass({ input, expectedOutput }) {
			withCanvas((html) => {
				const tag = html.div({ class: input });

				expect(tag.element.className).toStrictEqual(expectedOutput);
			});
		}
	});
	/* eslint-enable sonarjs/assertions-in-tests */

	it("render() accepts a ref attribute to retrieve the DOM element", () => {
		expect.assertions(1);

		withCanvas((html) => {
			const rootRef = {};

			html.render({ ref: rootRef }, (html) => html.p("foo"));

			expect(rootRef.current.innerHTML).toBe("<p>foo</p>");
		});
	});

	it("div() accepts a ref attribute to retrieve the DOM element", () => {
		expect.assertions(1);

		withCanvas((html) => {
			const rootRef = {};

			html.div({ ref: rootRef }, (html) => html.p("foo"));

			expect(rootRef.current.outerHTML).toBe("<div><p>foo</p></div>");
		});
	});
});
