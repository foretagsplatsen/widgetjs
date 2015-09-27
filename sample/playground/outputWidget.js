define([
	'widgetjs/core'
], function(widgetjs) {

	/**
	 * Evaluates code and render resulting rendable.
	 *
	 * @param spec
	 * @param my
	 *
	 * @return {outputWidget}
	 */
	function outputWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		var that = widgetjs.widget(spec, my);

		my.output = '';

		//
		// Public
		//

		that.setCode = function(code) {
			try {
				my.output = eval("try { var _wrapper = function() {" + code + "}; _wrapper();} catch (error) { error.toString(); }");
			} catch (error) {
				my.output = error.toString();
			}
			that.update();
		};

		//
		// Render
		// 

		that.renderContentOn = function(html) {
			try {
				html.div(my.output || html.omit());
			} catch (error) {
				html.span(error.toString());
			}
		};

		return that;
	}

  return outputWidget;
});
