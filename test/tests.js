QUnit.config.autostart = false;

requirejs.config({
	baseUrl: '.',
	paths: {
		'jquery': '../bower_components/jquery/jquery',
		'widgetjs' : '../src/'
	}
});

var testModules = [
	'htmlCanvasTest',
	'widgetTest',
	'eventsTest',
	'router/routerTest',
	'router/routeTest'
];


define(testModules, function() {
	QUnit.start();
});
