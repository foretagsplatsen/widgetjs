requirejs.config({
	baseUrl: ".",
	paths: {
		"jquery": "../../bower_components/jquery/dist/jquery",
		"klassified": "../../bower_components/klassified/dist/klassified",
		"widgetjs": "../../src",
		"bootstrap" : "http://netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min",
		"jstorage" : "http://cdnjs.cloudflare.com/ajax/libs/jStorage/0.4.4/jstorage.min",
		"json2": "http://cdnjs.cloudflare.com/ajax/libs/json2/20121008/json2"
	},
	shim: {
		bootstrap: { deps: ["jquery"], exports: "jQuery" },
		jstorage: ["jquery", "json2"]
	}
});

define(["app", "jquery"], function(app, jQuery) {
	jQuery( document ).ready(function() {
		app();
	});
});
