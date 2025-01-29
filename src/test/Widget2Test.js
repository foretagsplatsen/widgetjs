import { beforeEach, describe, expect, it } from "vitest";
import htmlCanvas from "../htmlCanvas.js";
import jQuery from "jquery";
import Widget2 from "../Widget2.js";

describe("Widget", () => {
	beforeEach(() => {
		document.body.replaceChildren();
	});

	describe("isRendered()", () => {
		it("returns false if the widget isn't attached to the DOM", () => {
			const widget = makeWidget();

			expect(widget.isRendered()).toBeFalsy();
		});

		it("returns true if the widget is attached to the DOM", () => {
			const widget = makeWidget();

			makeHtml().render(widget);

			expect(widget.isRendered()).toBeTruthy();
		});

		it("returns true if the widget is attached to the DOM under a special shadow host", () => {
			const host = document.createElement("div");
			host.setAttribute("widgetjs-shadow", "document");

			document.body.appendChild(host);

			const shadowRoot = host.attachShadow({ mode: "open" });

			const widget = makeWidget();

			htmlCanvas(jQuery(shadowRoot)).render(widget);

			expect(widget.isRendered()).toBeTruthy();
		});
	});
});

function makeWidget() {
	class Foo extends Widget2 {
		renderContentOn(html) {
			html.p("content");
		}
	}

	return new Foo();
}

function makeHtml() {
	jQuery("BODY").append('<div id="sandbox"></div>');
	const sandbox = jQuery("#sandbox");

	return htmlCanvas(sandbox);
}
