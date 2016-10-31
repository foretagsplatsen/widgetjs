requirejs.config({
    baseUrl: ".",
    paths:   {
        "jquery":   "../../bower_components/jquery/dist/jquery",
		"klassified": "../../bower_components/klassified/dist/klassified",
		"widgetjs": "../../src/",
        "bootstrap": "http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min",
        "lodash" : "http://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min"
    },
    shim:    {
        bootstrap: { deps: ["jquery"], exports: "jQuery" }
    }
});

define(["./converter", "jquery"], function(converter, jQuery) {
    jQuery(document).ready(function() {
        converter().appendTo("body");
    });
});
