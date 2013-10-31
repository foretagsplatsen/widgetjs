define([
	'widgetjs/core'
], function (widgetjs, shared) {
	function aboutDocument() {
		var that = widgetjs.widget();

		that.renderContentOn = function (html) {
			html.div({klass: 'jumbotron'},
				html.h1('Recipes Sample'),
				html.p('This example illustrates how to use the basic elements of widget-js: router, events and widgets'),
				html.p('It uses twitter boostrap as base for styles and scripts')
			);
		};

		return that;
	}

	return aboutDocument;
});