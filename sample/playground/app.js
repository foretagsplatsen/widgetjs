define([
	"widgetjs",
	"./editorWidget",
	"./outputWidget"
], function(widgetjs, editorWidget, outputWidget) {

	var counterCode = "function counterWidget(spec, my) {\n\tspec = spec || {};\n\tmy = my || {};\n\n\tvar that = widgetjs.widget(spec, my);\n\n\tvar count = 0;\n\n\tthat.renderContentOn = function(html) {\n\t\thtml.h1(count.toString());\n\t\thtml.button(\"+\").click(function() { count++; that.update();});\n\t\thtml.button(\"-\").click(function() { count--; that.update();});\n\t};\n\n\treturn that;\n};\n\nreturn counterWidget();";

	/**
	 * JSFiddle like playground for trying out WIDGET-JS
	 *
	 * @return {playgroundApp}
	 */
	function playgroundApp(spec, my) {
		spec = spec || {};
		my = my || {};

		var that = widgetjs.widget(spec, my);

		var runOnChange = true;

		my.code = outputWidget();
		my.editor = editorWidget({code: counterCode});
		my.editor.onChange(function() {
			if(runOnChange) {
				my.run();
			}
		});
		my.code.evaluateCode(my.editor.getCode());

		//
		// Render
		//

		that.renderContentOn = function(html) {
			my.renderNavOn(html);
			my.renderEditorOn(html);
		};

		my.renderNavOn = function(html) {
			html.div({klass: "navbar navbar-inverse navbar-static-top"},
				html.div({klass: "container-fluid"},
					html.div({klass: "navbar-header"},
						html.a({klass: "navbar-brand", href: "#"}, "Playground")
					),

					html.form({klass: "navbar-form navbar-right"},
						my.renderOptionsOn
					)
				)
			);
		};

		my.renderOptionsOn = function(html) {
			html.div({klass: "btn checkbox navbar-btn"},
				html.label({klass: "navbar-link", for: "run-on-change"},
					// Toggle run on change
					html.input({
						id: "run-on-change",
						type: "checkbox",
						checked: runOnChange ? "checked" : html.omit(),
						click: function() { runOnChange = !runOnChange; }
					}),
					" run code on change "
				)
			);

			// Run manually
			html.a({klass: "btn btn-success", click: my.run}, "Run");
		};

		my.renderEditorOn = function(html) {
			html.div({klass: "container-fluid"},
				html.div({klass: "row"},
					html.div({klass: "col-md-6"},
						// Editor
						html.div({klass: "editor code_panel"},
							html.div(my.editor),
							html.span({klass: "panel_label"}, "Code")
						)
					),
					html.div({class: "col-md-6"},
						// Output
						html.div({klass: "output code_panel"},
							html.div(my.code),
							html.span({ klass: "panel_label"}, "Output")
						)
					)
				)
			);
		};

		//
		// Protected
		//

		my.run = function() {
			my.code.evaluateCode(my.editor.getCode());
		};


		return that;
	}

	return playgroundApp;
});
