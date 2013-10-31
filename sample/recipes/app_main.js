requirejs.config({
	baseUrl: '.',
	paths: {
		'jquery': '../../bower_components/jquery/jquery',
		'widgetjs' : '../../src/',
		'boostrap' : 'http://netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min'
	}
});

define(['app', 'jquery'], function(app, jQuery) {
	jQuery( document ).ready(function() {
		var anApp = app();
		anApp.initialize();
	});
});
