QUnit.config.autostart = false;

requirejs.config({
	baseUrl: '.',
	paths: {
		'jquery': '../components/jquery/jquery',
		'widgetjs' : '../src/'
	}
});

var testModules = [
	'htmlCanvasTest',
	'widgetTest',
	'eventsTest',
	'routerTest'];


define(testModules, function() {
	QUnit.start();
});