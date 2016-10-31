define([
	"widgetjs/widgetjs"
], function(widgetjs, shared) {

	/**
	 * About Page
	 */
	var aboutDocument = widgetjs.widget.subclass(function(that, my) {

		that.renderContentOn = function(html) {
			html.div({klass: "jumbotron"},
				html.h1("Recipes Sample"),
				html.p("This example illustrates how to use the basic elements of widget-js: router, events, htmlCanvas and widgets"),
				html.p("It uses twitter boostrap as base for styles and scripts")
			);
		};
	});

	return aboutDocument;
});
