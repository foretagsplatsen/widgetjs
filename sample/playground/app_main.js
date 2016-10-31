requirejs.config({
	baseUrl: ".",
	paths: {
		"jquery": "../../bower_components/jquery/dist/jquery",
		"klassified": "../../bower_components/klassified/dist/klassified",
		// "widgetjs": "../../widgetjs", // live time
		"widgetjs": "../../dist/widgetjs",
		"bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js",
		"lodash": "http://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min"
	},
	shim: {
		bootstrap: {deps: ["jquery"], exports: "jQuery"}
	},
	packages: [
		{
			name: "codemirror",
			location: "../../bower_components/codemirror/",
			main: "lib/codemirror"
		}
	]
});

define(["./app", "jquery"], function(app, jQuery) {
	jQuery(document).ready(function() {
		app().appendTo("body");
	});
});
