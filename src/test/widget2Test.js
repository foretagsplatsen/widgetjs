import Widget from "../Widget2";
import htmlCanvas from "../htmlCanvas";

let sandboxId = "sandbox";

describe("Widget2", () => {
	describe("_makeRootTagOn()", () => {
		class MyWidget extends Widget {
			_initialize({tagName = "div", attributeName = "data-test", attributeValue = "foo"} = {}) {
				super._initialize(...arguments);

				this._tagName = tagName;
				this._attributeName = attributeName;
				this._attributeValue = attributeValue;
			}

			renderContentOn(html) {}

			_makeRootTagOn(html) {
				return html.tag(this._tagName, {[this._attributeName]: this._attributeValue});
			}

		}

		it("allows for changing the root tag", () => {
			withCanvas((html) => {
				let tagName = "TR";
				let attributeName = "data-test";
				let attributeValue = "foo-bar";

				let widget = new MyWidget({tagName, attributeName, attributeValue});

				html.render(widget);

				let result = html.root.element.firstElementChild;

				expect(result.tagName).toEqual(tagName);
				expect(result.getAttribute(attributeName)).toEqual(attributeValue);
			});
		});

		it("assigns the widget's ID", () => {
			withCanvas((html) => {
				let widget = new MyWidget();

				html.render(widget);

				let result = html.root.element.firstElementChild;

				expect(result.id).toEqual(widget.getId());
			});
		});
	});
});

function withCanvas(callback) {
	$("BODY").append(`<div id="${sandboxId}"></div>`);
	var sandbox = jQuery(`#${sandboxId}`);

	var html = htmlCanvas(sandbox);
	callback(html);

	sandbox.remove();
}
