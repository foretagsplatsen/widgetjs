requirejs.config({
	baseUrl: ".",
	paths:   {
		"klassified":   "../../bower_components/klassified/src/object",
		"jquery":   "../../bower_components/jquery/dist/jquery",
		"widgetjs": "../../src/",
		"bootstrap": "http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min",
        "lodash" : "http://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min",
        "prettify" : "../../bower_components/google-code-prettify/src/prettify"
	},
	shim:    {
        bootstrap: { deps: ["jquery"], exports: "jQuery" }
	}
});

define(["./app", "jquery"], function(app, jQuery) {
	jQuery(document).ready(function() {
        app().appendTo("body");
	});
});
